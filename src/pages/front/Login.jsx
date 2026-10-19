import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginWithEmail, translateAuthError } from "../../services/authService.js";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await loginWithEmail(email, password);
      navigate("/member/dashboard");
    } catch (err) {
      setError(translateAuthError(err.code));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>เข้าสู่ระบบ</h1>
        <p>เข้าสู่ระบบเพื่อเช่าหนังสือและจัดการบัญชีของคุณ</p>

        <div className="field">
          <label htmlFor="email">อีเมล</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="password">รหัสผ่าน</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <p style={{ color: "var(--danger)", fontSize: "0.85rem", marginTop: "-10px" }}>
            {error}
          </p>
        )}

        <div className="auth-row">
          <label>
            <input type="checkbox" /> จดจำฉันไว้
          </label>
          <a href="#forgot">ลืมรหัสผ่าน?</a>
        </div>

        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>

        <p className="auth-divider">ยังไม่มีบัญชี?</p>

        <Link to="/register" className="btn btn-outline btn-block">
          สมัครสมาชิก
        </Link>

        <p className="auth-note">
          * เชื่อมต่อ Firebase Authentication จริงแล้ว — ต้องสมัครสมาชิกก่อนจึงจะเข้าสู่ระบบได้
        </p>
      </form>
    </div>
  );
}

export default Login;
