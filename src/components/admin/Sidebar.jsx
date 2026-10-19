import { NavLink } from "react-router-dom";

const logo = "/images/logo/book_rental_logo.svg";
const iconDashboard = "/images/icons/menu.svg";
const iconBook = "/images/icons/book.svg";
const iconUser = "/images/icons/user.svg";
const iconBookmark = "/images/icons/bookmark.svg";
const iconHeart = "/images/icons/heart.svg";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: iconDashboard },
  { to: "/admin/books", label: "จัดการหนังสือ", icon: iconBook },
  { to: "/admin/members", label: "จัดการสมาชิก", icon: iconUser },
  { to: "/admin/rentals", label: "จัดการรายการเช่า", icon: iconBookmark },
  { to: "/admin/returns", label: "จัดการรายการคืน", icon: iconHeart },
];

function Sidebar({ onNavigate }) {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <img src={logo} alt="BOOKLOOP" />
        <span>ADMIN PANEL</span>
      </div>

      <nav className="admin-nav">
        {navItems.map((item) => (
          <NavLink to={item.to} key={item.to} onClick={onNavigate}>
            <img src={item.icon} alt="" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <p>BOOKLOOP Back Office</p>
        <p>Prototype — ยังไม่เชื่อมต่อฐานข้อมูลจริง</p>
      </div>
    </aside>
  );
}

export default Sidebar;
