import { NavLink, Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-4">
        <h2 className="text-lg font-bold mb-6">Monitoring</h2>

        <nav className="space-y-2">
          <NavLink className="block hover:text-slate-300" to="/">
            Overview
          </NavLink>
          <NavLink className="block hover:text-slate-300" to="/logs">
            Logs
          </NavLink>
          <NavLink className="block hover:text-slate-300" to="/incidents">
            Incidents
          </NavLink>
          <NavLink className="block hover:text-slate-300" to="/alerts">
            Alert Rules
          </NavLink>
          <NavLink className="block hover:text-slate-300" to="/notifications">
            Notifications
          </NavLink>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-slate-100 p-6">
        <Outlet />
      </main>
    </div>
  );
}
