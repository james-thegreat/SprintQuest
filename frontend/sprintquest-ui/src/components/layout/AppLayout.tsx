import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/projects", label: "Projects" },
  { to: "/board", label: "Sprint Board" },
  { to: "/tasks/1", label: "Task Details" },
  { to: "/progress", label: "Progress" },
];

export function AppLayout() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h2>SprintQuest</h2>

        <nav>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}