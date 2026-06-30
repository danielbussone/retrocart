export type ConsoleId = 'nes' | 'snes' | 'gba' | 'gb' | 'gbc' | 'psx' | 'genesis' | 'n64'

export type SyncStatus = 'synced' | 'pending_add' | 'pending_remove' | 'conflict'

export type FrontendType = 'onion' | 'esde'

export type LibrarySortKey = 'title' | 'console' | 'size' | 'year' | 'rating'

export type SortDir = 'asc' | 'desc'

export interface LibraryItem {
  id: string
  title: string
  console: ConsoleId
  filename: string
  filenameStem: string
  sizeBytes: number
  developer: string
  publisher: string
  genre: string
  year: number
  rating: number
  players: string
  deviceTags: Partial<Record<string, SyncStatus>>
}

export interface Device {
  id: string
  name: string
  frontendType: FrontendType
  storageBytesTotal: number
  mountLabelHint: string
  mockMountPath: string
}

export interface Collection {
  id: string
  name: string
  itemIds: string[]
  deviceIds: string[]
  color: string
}

export interface SyncRomOp {
  id: string
  title: string
  console: ConsoleId
  filename: string
  sizeBytes: number
  action: 'add' | 'remove'
}

export interface SyncSaveOp {
  id: string
  title: string
  console: ConsoleId
  kind: 'sram' | 'state'
  direction: 'pull' | 'push'
  isConflict: boolean
  conflictRename?: string
  vaultPath?: string
  devicePath?: string
}

export interface SyncPlan {
  deviceId: string
  mountPath: string
  romOps: SyncRomOp[]
  saveOps: SyncSaveOp[]
  mediaUpdates: number
  scannedAt: string
}

export interface SyncRunItem {
  id: string
  title: string
  action: string
  path: string
  status: 'ok' | 'conflict' | 'error'
  bytes?: number
  conflictPath?: string
  timestamp: string
}

export interface LibraryRoot {
  id: string
  path: string
  enabled: boolean
  itemCount: number
}

export interface PlatformMapEntry {
  consoleId: ConsoleId
  label: string
  esdeFolder: string
  onionFolder: string
  saveCore: string
}

export interface LibraryFilter {
  search: string
  console: ConsoleId | 'all'
  syncStatus: SyncStatus | 'all' | 'untagged'
  deviceId: string | 'all'
}
