import { Link } from "react-router-dom";

const logo = "/images/logo/book_rental_logo.svg";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src={logo} alt="BOOKLOOP" className="footer-logo" />
          <p>ระบบเช่า-คืนหนังสือออนไลน์พร้อมจัดการสมาชิกสำหรับร้านหนังสือ</p>
        </div>

        <div className="footer-links">
          <Link to="/">หน้าแรก</Link>
          <Link to="/books">หนังสือทั้งหมด</Link>
          <Link to="/login">เข้าสู่ระบบ</Link>
          <Link to="/admin/dashboard">สำหรับผู้ดูแลระบบ</Link>
        </div>

        <div className="footer-meta">
          <p>โครงงาน: ระบบเช่า-คืนหนังสือออนไลน์พร้อมจัดการสมาชิกสำหรับร้านหนังสือ</p>
          <p>วิชาการพัฒนาเว็บแอปพลิเคชัน สาขาวิทยาการคอมพิวเตอร์</p>
          <p>คณะวิทยาศาสตร์และเทคโนโลยี มหาวิทยาลัยราชภัฏสวนสุนันทา</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
