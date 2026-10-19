const iconMenu = "/images/icons/menu.svg";

function Topbar({ title, onToggleSidebar }) {
  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        <button type="button" className="admin-menu-toggle" onClick={onToggleSidebar}>
          <img src={iconMenu} alt="เปิดเมนู" />
        </button>
        <h2>{title}</h2>
      </div>

      <div className="admin-topbar-right">
        <div className="admin-user-chip">
          <span className="admin-user-avatar">A</span>
          <span>Admin01</span>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
