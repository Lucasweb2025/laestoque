import { Outlet } from 'react-router-dom'
import { modoEmbutido } from '../../config/plataforma'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function AppShell() {
  if (modoEmbutido) {
    return (
      <div className="min-h-full bg-main">
        <Outlet />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-main">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <Outlet />
      </div>
    </div>
  )
}
