import { createContext, useContext, useState, type ReactNode } from 'react'
import type {
  LibraryItem, Device, Collection, SyncPlan, SyncRunItem,
  LibraryFilter, LibrarySortKey, SortDir, SyncStatus,
} from '../types'
import { LIBRARY } from '../fixtures/library'
import { DEVICES } from '../fixtures/devices'
import { COLLECTIONS } from '../fixtures/collections'
import { SYNC_PLAN, SYNC_RESULT } from '../fixtures/syncPlan'

interface AppState {
  library: LibraryItem[]
  devices: Device[]
  collections: Collection[]
  syncPlan: SyncPlan | null
  syncResult: SyncRunItem[] | null
  hasOnboarded: boolean
  libraryRoots: string[]
  activeSyncDeviceId: string | null
  filter: LibraryFilter
  sortKey: LibrarySortKey
  sortDir: SortDir
}

interface AppActions {
  completeOnboarding: (roots: string[]) => void
  toggleDeviceTag: (itemId: string, deviceId: string) => void
  setTagBulk: (itemIds: string[], deviceId: string, status: SyncStatus | null) => void
  updateCollection: (col: Collection) => void
  addCollection: (col: Collection) => void
  deleteCollection: (colId: string) => void
  setSyncPlan: (plan: SyncPlan | null) => void
  setSyncResult: (result: SyncRunItem[] | null) => void
  setActiveSyncDeviceId: (id: string | null) => void
  setFilter: (f: Partial<LibraryFilter>) => void
  setSort: (key: LibrarySortKey, dir: SortDir) => void
  addLibraryRoot: (path: string) => void
  removeLibraryRoot: (path: string) => void
}

const Ctx = createContext<(AppState & AppActions) | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [library, setLibrary] = useState<LibraryItem[]>(LIBRARY)
  const [devices] = useState<Device[]>(DEVICES)
  const [collections, setCollections] = useState<Collection[]>(COLLECTIONS)
  const [syncPlan, setSyncPlanState] = useState<SyncPlan | null>(null)
  const [syncResult, setSyncResultState] = useState<SyncRunItem[] | null>(null)
  const [hasOnboarded, setHasOnboarded] = useState(false)
  const [libraryRoots, setLibraryRoots] = useState<string[]>([])
  const [activeSyncDeviceId, setActiveSyncDeviceId] = useState<string | null>(null)
  const [filter, setFilterState] = useState<LibraryFilter>({
    search: '', console: 'all', syncStatus: 'all', deviceId: 'all',
  })
  const [sortKey, setSortKey] = useState<LibrarySortKey>('title')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  function completeOnboarding(roots: string[]) {
    setLibraryRoots(roots)
    setHasOnboarded(true)
  }

  function toggleDeviceTag(itemId: string, deviceId: string) {
    setLibrary(prev => prev.map(item => {
      if (item.id !== itemId) return item
      const current = item.deviceTags[deviceId]
      const next = { ...item.deviceTags }
      if (!current) {
        next[deviceId] = 'pending_add'
      } else if (current === 'synced') {
        next[deviceId] = 'pending_remove'
      } else if (current === 'pending_remove') {
        next[deviceId] = 'synced'
      } else if (current === 'pending_add') {
        delete next[deviceId]
      }
      return { ...item, deviceTags: next }
    }))
  }

  function setTagBulk(itemIds: string[], deviceId: string, status: SyncStatus | null) {
    setLibrary(prev => prev.map(item => {
      if (!itemIds.includes(item.id)) return item
      const next = { ...item.deviceTags }
      if (status === null) {
        delete next[deviceId]
      } else {
        next[deviceId] = status
      }
      return { ...item, deviceTags: next }
    }))
  }

  function updateCollection(col: Collection) {
    setCollections(prev => prev.map(c => c.id === col.id ? col : c))
  }

  function addCollection(col: Collection) {
    setCollections(prev => [...prev, col])
  }

  function deleteCollection(colId: string) {
    setCollections(prev => prev.filter(c => c.id !== colId))
  }

  function setFilter(f: Partial<LibraryFilter>) {
    setFilterState(prev => ({ ...prev, ...f }))
  }

  function setSort(key: LibrarySortKey, dir: SortDir) {
    setSortKey(key)
    setSortDir(dir)
  }

  function addLibraryRoot(path: string) {
    setLibraryRoots(prev => prev.includes(path) ? prev : [...prev, path])
  }

  function removeLibraryRoot(path: string) {
    setLibraryRoots(prev => prev.filter(p => p !== path))
  }

  return (
    <Ctx.Provider value={{
      library, devices, collections, syncPlan, syncResult,
      hasOnboarded, libraryRoots, activeSyncDeviceId,
      filter, sortKey, sortDir,
      completeOnboarding,
      toggleDeviceTag, setTagBulk,
      updateCollection, addCollection, deleteCollection,
      setSyncPlan: setSyncPlanState,
      setSyncResult: setSyncResultState,
      setActiveSyncDeviceId,
      setFilter, setSort,
      addLibraryRoot, removeLibraryRoot,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export function useApp() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}

export function useFilteredLibrary() {
  const { library, filter, sortKey, sortDir } = useApp()
  let items = library

  if (filter.search) {
    const q = filter.search.toLowerCase()
    items = items.filter(i =>
      i.title.toLowerCase().includes(q) ||
      i.developer.toLowerCase().includes(q) ||
      i.genre.toLowerCase().includes(q)
    )
  }
  if (filter.console !== 'all') {
    items = items.filter(i => i.console === filter.console)
  }
  if (filter.deviceId !== 'all') {
    if (filter.syncStatus === 'untagged') {
      items = items.filter(i => !i.deviceTags[filter.deviceId])
    } else {
      items = items.filter(i => !!i.deviceTags[filter.deviceId])
      if (filter.syncStatus !== 'all') {
        items = items.filter(i => i.deviceTags[filter.deviceId] === filter.syncStatus)
      }
    }
  } else if (filter.syncStatus === 'untagged') {
    items = items.filter(i => Object.keys(i.deviceTags).length === 0)
  } else if (filter.syncStatus !== 'all') {
    items = items.filter(i => Object.values(i.deviceTags).includes(filter.syncStatus as any))
  }

  items = [...items].sort((a, b) => {
    let va: string | number, vb: string | number
    switch (sortKey) {
      case 'title': va = a.title; vb = b.title; break
      case 'console': va = a.console; vb = b.console; break
      case 'size': va = a.sizeBytes; vb = b.sizeBytes; break
      case 'year': va = a.year; vb = b.year; break
      case 'rating': va = a.rating; vb = b.rating; break
    }
    if (va < vb) return sortDir === 'asc' ? -1 : 1
    if (va > vb) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  return items
}

export function useDeviceStats(deviceId: string) {
  const { library } = useApp()
  let synced = 0, pendingAdd = 0, pendingRemove = 0, conflict = 0, bytesUsed = 0
  for (const item of library) {
    const tag = item.deviceTags[deviceId]
    if (!tag) continue
    if (tag === 'synced') { synced++; bytesUsed += item.sizeBytes }
    else if (tag === 'pending_add') { pendingAdd++; bytesUsed += item.sizeBytes }
    else if (tag === 'pending_remove') pendingRemove++
    else if (tag === 'conflict') { conflict++; bytesUsed += item.sizeBytes }
  }
  return { synced, pendingAdd, pendingRemove, conflict, bytesUsed }
}

export { SYNC_PLAN as MOCK_SYNC_PLAN, SYNC_RESULT as MOCK_SYNC_RESULT }
