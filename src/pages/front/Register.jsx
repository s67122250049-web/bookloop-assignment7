import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerWithEmail, translateAuthError } from "../../services/authService.js";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("รหัสผ่านทั้งสองช่องไม่ตรงกัน");
      return;
    }

    setSubmitting(true);
    try {
      await registerWithEmail({ name, email, password });
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
        <h1>สมัครสมาชิก</h1>
        <p>สร้างบัญชีเพื่อเริ่มเช่าหนังสือกับ BOOKLOOP</p>

        <div className="field">
          <label htmlFor="name">ชื่อ-นามสกุล</label>
          <input
            id="name"
            type="text"
            placeholder="ชื่อของคุณ"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="reg-email">อีเมล</label>
          <input
            id="reg-email"
            type="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="reg-password">รหัสผ่าน</label>
          <input
            id="reg-password"
            type="password"
            placeholder="อย่างน้อย 6 ตัวอักษร"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="confirm-password">ยืนยันรหัสผ่าน</label>
          <input
            id="confirm-password"
            type="password"
            placeholder="พิมพ์รหัสผ่านอีกครั้ง"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {error && (
          <p style={{ color: "var(--danger)", fontSize: "0.85rem", marginTop: "-10px" }}>
            {error}
          </p>
        )}

        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
        </button>

        <p className="auth-divider">มีบัญชีอยู่แล้ว?</p>

        <Link to="/login" className="btn btn-outline btn-block">
          เข้าสู่ระบบ
        </Link>

        <p className="auth-note">
          * เมื่อสมัครสำเร็จ ระบบจะสร้างข้อมูลสมาชิกใน Firestore ให้อัตโนมัติ (role: member)
        </p>
      </form>
    </div>
  );
}

export default Register;
