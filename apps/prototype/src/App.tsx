import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './store/AppContext'
import { AppShell } from './layout/AppShell'
import { Onboarding } from './screens/Onboarding'
import { Library } from './screens/Library'
import { DeviceDetail } from './screens/DeviceDetail'
import { Collections } from './screens/Collections'
import { SyncHub } from './screens/SyncHub'
import { SyncDiff } from './screens/SyncDiff'
import { SyncResult } from './screens/SyncResult'
import { Settings } from './screens/Settings'

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route element={<AppShell />}>
            <Route index element={<Navigate to="/library" replace />} />
            <Route path="/library" element={<Library />} />
            <Route path="/devices/:deviceId" element={<DeviceDetail />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/sync" element={<SyncHub />} />
            <Route path="/sync/diff" element={<SyncDiff />} />
            <Route path="/sync/result" element={<SyncResult />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
