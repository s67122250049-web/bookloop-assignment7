import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar.jsx";
import Topbar from "../components/admin/Topbar.jsx";
import "../styles/admin.css";

const pageTitles = {
  "/admin/dashboard": "Dashboard",
  "/admin/books": "จัดการหนังสือ",
  "/admin/members": "จัดการสมาชิก",
  "/admin/rentals": "จัดการรายการเช่า",
  "/admin/returns": "จัดการรายการคืน",
  "/admin/feedback": "ผลการประเมินระบบ",
};

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Admin";

  return (
    <div className={sidebarOpen ? "admin-shell sidebar-open" : "admin-shell"}>
      <Sidebar onNavigate={() => setSidebarOpen(false)} />
      <div
        className="admin-sidebar-overlay"
        onClick={() => setSidebarOpen(false)}
        role="presentation"
      />

      <div className="admin-main-wrap" style={{ flex: 1, minWidth: 0 }}>
        <Topbar title={title} onToggleSidebar={() => setSidebarOpen((open) => !open)} />
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
