import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { logout } from "../../services/authService.js";

const logo = "/images/logo/book_rental_logo.svg";
const iconUser = "/images/icons/user.svg";

function Navbar() {
  const { isLoggedIn, profile, loading } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <NavLink to="/" className="brand">
          <img src={logo} alt="BOOKLOOP" className="brand-logo" />
        </NavLink>

        <nav className="main-nav">
          <NavLink to="/" end>
            หน้าแรก
          </NavLink>
          <NavLink to="/books">หนังสือทั้งหมด</NavLink>
          <NavLink to="/member/dashboard">บัญชีของฉัน</NavLink>
          <NavLink to="/member/feedback">ประเมินระบบ</NavLink>
        </nav>

        {/* แสดงปุ่มตามสถานะล็อกอินจริงจาก AuthContext */}
        {loading ? (
          <span style={{ width: "110px" }} />
        ) : isLoggedIn ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
              สวัสดี, {profile?.name || "สมาชิก"}
            </span>
            <button type="button" className="btn btn-outline header-member-btn" onClick={handleLogout}>
              ออกจากระบบ
            </button>
          </div>
        ) : (
          <NavLink to="/login" className="btn btn-outline header-member-btn">
            <img src={iconUser} alt="" className="btn-icon" />
            เข้าสู่ระบบ
          </NavLink>
        )}
      </div>
    </header>
  );
}

export default Navbar;

