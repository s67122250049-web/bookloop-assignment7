import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection.js";
import { useMyRentals } from "../../hooks/useMyRentals.js";

function statusBadgeClass(status) {
  if (status === "Rented") return "badge badge-info";
  if (status === "Overdue") return "badge badge-danger";
  if (status === "Returned") return "badge badge-success";
  return "badge badge-neutral";
}

function statusLabel(status) {
  if (status === "Rented") return "กำลังเช่า";
  if (status === "Overdue") return "เกินกำหนด";
  if (status === "Returned") return "คืนแล้ว";
  return status;
}

function RentalHistory() {
  const { profile, isLoggedIn, loading: authLoading } = useAuth();
  const { data: rentals, loading: loadingRentals } = useMyRentals();
  const { data: books, loading: loadingBooks } = useFirestoreCollection("books");

  if (authLoading || loadingRentals || loadingBooks) {
    return <p className="empty-state">กำลังโหลดข้อมูล...</p>;
  }

  if (!isLoggedIn || !profile) {
    return (
      <div className="page-header">
        <p className="empty-state">กรุณาเข้าสู่ระบบก่อนเพื่อดูประวัติการเช่าของคุณ</p>
        <Link to="/login" className="btn btn-primary">
          ไปหน้าเข้าสู่ระบบ
        </Link>
      </div>
    );
  }

  const myHistory = rentals;

  return (
    <>
      <div className="page-header">
        <p className="breadcrumb">
          <Link to="/">หน้าแรก</Link> / <Link to="/member/dashboard">บัญชีของฉัน</Link> / ประวัติการเช่า
        </p>
        <h1>ประวัติการเช่า-คืน</h1>
        <p>รายการเช่าทั้งหมดของคุณ ทั้งที่คืนแล้วและยังไม่คืน</p>
      </div>

      <section>
        {myHistory.length === 0 ? (
          <p className="empty-state">ยังไม่มีประวัติการเช่า</p>
        ) : (
          <div className="rental-table-wrap">
            <table className="rental-table">
              <thead>
                <tr>
                  <th>หนังสือ</th>
                  <th>วันที่เช่า</th>
                  <th>วันที่คืน</th>
                  <th>สถานะ</th>
                  <th>ค่าปรับ</th>
                </tr>
              </thead>
              <tbody>
                {myHistory.map((rental) => {
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
                      <td>{rental.returnDate ?? "-"}</td>
                      <td>
                        <span className={statusBadgeClass(rental.status)}>
                          {statusLabel(rental.status)}
                        </span>
                      </td>
                      <td>{rental.fine > 0 ? `${rental.fine} บาท` : "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

export default RentalHistory;
