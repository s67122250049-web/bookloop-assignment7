import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection.js";

function statusBadgeClass(status) {
  if (status === "Rented") return "badge badge-info";
  if (status === "Overdue") return "badge badge-danger";
  if (status === "Returned") return "badge badge-success";
  return "badge badge-neutral";
}

function MemberDashboard() {
  const { profile, isLoggedIn, loading: authLoading } = useAuth();
  const { data: rentals, loading: loadingRentals } = useFirestoreCollection("rentals");
  const { data: books, loading: loadingBooks } = useFirestoreCollection("books");

  if (authLoading || loadingRentals || loadingBooks) {
    return <p className="empty-state">กำลังโหลดข้อมูล...</p>;
  }

  // ยังไม่มี Protected Route จริง ๆ (เฟสถัดไป) จึงกันเหนียวไว้ตรงนี้ก่อน
  // ถ้ายังไม่ได้ล็อกอิน หรือสมัครสมาชิกไม่สำเร็จ (ไม่มี profile) ให้พาไปหน้า Login
  if (!isLoggedIn || !profile) {
    return (
      <div className="page-header">
        <p className="empty-state">กรุณาเข้าสู่ระบบก่อนเพื่อดูบัญชีของคุณ</p>
        <Link to="/login" className="btn btn-primary">
          ไปหน้าเข้าสู่ระบบ
        </Link>
      </div>
    );
  }

  const myRentals = rentals.filter((r) => r.memberId === profile.id);
  const activeRentals = myRentals.filter((r) => r.status === "Rented" || r.status === "Overdue");
  const overdueRentals = myRentals.filter((r) => r.status === "Overdue");
  const totalFine = myRentals.reduce((sum, r) => sum + (r.fine || 0), 0);

  return (
    <>
      <div className="page-header">
        <p className="breadcrumb">หน้าแรก / บัญชีของฉัน</p>
      </div>

      <section>
        <div className="dashboard-hero">
          <h1>สวัสดี, {profile.name}</h1>
          <p>
            รหัสสมาชิก {profile.id.slice(0, 8)} • สมัครเมื่อ {profile.joinDate}
          </p>
        </div>

        <div className="stat-cards">
          <div className="stat-card">
            <p className="stat-card-number">{activeRentals.length}</p>
            <p className="stat-card-label">กำลังเช่าอยู่</p>
          </div>
          <div className="stat-card">
            <p className="stat-card-number">{overdueRentals.length}</p>
            <p className="stat-card-label">ต้องคืน / เกินกำหนด</p>
          </div>
          <div className="stat-card">
            <p className="stat-card-number">{myRentals.length}</p>
            <p className="stat-card-label">รายการเช่าทั้งหมด</p>
          </div>
          <div className="stat-card">
            <p className="stat-card-number">{totalFine} บาท</p>
            <p className="stat-card-label">ค่าปรับค้างชำระ</p>
          </div>
        </div>

        <div className="section-head" style={{ textAlign: "left", margin: "0 0 16px" }}>
          <h2 style={{ fontSize: "1.3rem" }}>รายการเช่าล่าสุด</h2>
        </div>

        {myRentals.length === 0 ? (
          <p className="empty-state">ยังไม่มีประวัติการเช่า</p>
        ) : (
          <div className="rental-table-wrap">
            <table className="rental-table">
              <thead>
                <tr>
                  <th>หนังสือ</th>
                  <th>วันที่เช่า</th>
                  <th>กำหนดคืน</th>
                  <th>สถานะ</th>
                  <th>ค่าปรับ</th>
                </tr>
              </thead>
              <tbody>
                {myRentals.map((rental) => {
                  const book = books.find((b) => b._id === rental.bookId);
                  return (
                    <tr key={rental._id}>
                      <td>
                        <div className="rental-book-cell">
                          <img src={book?.cover} alt={book?.title} />
                          <span>{book?.title}</span>
                        </div>
                      </td>
                      <td>{rental.rentalDate}</td>
                      <td>{rental.dueDate}</td>
                      <td>
                        <span className={statusBadgeClass(rental.status)}>{rental.status}</span>
                      </td>
                      <td>{rental.fine > 0 ? `${rental.fine} บาท` : "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ marginTop: "24px", display: "flex", gap: "16px" }}>
          <Link to="/member/rentals" className="btn btn-primary">
            ดูรายการเช่าของฉัน
          </Link>
          <Link to="/member/history" className="btn btn-outline">
            ดูประวัติการเช่าทั้งหมด
          </Link>
        </div>
      </section>
    </>
  );
}

export default MemberDashboard;
