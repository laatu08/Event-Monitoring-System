import { NavLink, Outlet } from "react-router-dom";

const navItemBase =
  "flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition";

const navItemInactive =
  "text-slate-300 hover:bg-slate-800 hover:text-white";

const navItemActive =
  "bg-slate-800 text-white";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-slate-900 text-white flex flex-col">
        {/* Brand */}
        <div className="px-6 py-5 border-b border-slate-800">
          <h2 className="text-xl font-semibold tracking-wide">
            Monitoring
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Observability Dashboard
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${navItemBase} ${
                isActive ? navItemActive : navItemInactive
              }`
            }
          >
            Overview
          </NavLink>

          <NavLink
            to="/logs"
            className={({ isActive }) =>
              `${navItemBase} ${
                isActive ? navItemActive : navItemInactive
              }`
            }
          >
            Logs
          </NavLink>

          <NavLink
            to="/incidents"
            className={({ isActive }) =>
              `${navItemBase} ${
                isActive ? navItemActive : navItemInactive
              }`
            }
          >
            Incidents
          </NavLink>

          <NavLink
            to="/alerts"
            className={({ isActive }) =>
              `${navItemBase} ${
                isActive ? navItemActive : navItemInactive
              }`
            }
          >
            Alert Rules
          </NavLink>

          <NavLink
            to="/notifications"
            className={({ isActive }) =>
              `${navItemBase} ${
                isActive ? navItemActive : navItemInactive
              }`
            }
          >
            Notifications
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 text-xs text-slate-400">
          v1.0 • Local
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen overflow-y-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
