import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection.js";
import { useMyRentals } from "../../hooks/useMyRentals.js";
import { requestReturn } from "../../services/firestoreService.js";
import { getBookCover } from "../../utils/bookCover.js";

function statusBadgeClass(status) {
  if (status === "Rented") return "badge badge-info";
  if (status === "Overdue") return "badge badge-danger";
  if (status === "PendingReturn") return "badge badge-info";
  if (status === "Returned") return "badge badge-success";
  return "badge badge-neutral";
}

function statusLabel(status) {
  if (status === "Rented") return "กำลังเช่า";
  if (status === "Overdue") return "เกินกำหนด";
  if (status === "PendingReturn") return "รอ Admin ยืนยันคืน";
  if (status === "Returned") return "คืนแล้ว";
  return status;
}

function MyRentals() {
  const { profile, isLoggedIn, loading: authLoading } = useAuth();
  const { data: rentals, loading: loadingRentals } = useMyRentals();
  const { data: books, loading: loadingBooks } =
    useFirestoreCollection("books");

  const [processingId, setProcessingId] = useState(null);

  async function handleRequestReturn(rental) {
    const confirmed = window.confirm(
      "ต้องการส่งคำขอคืนหนังสือเล่มนี้ใช่หรือไม่?"
    );

    if (!confirmed) return;

    setProcessingId(rental._id);

    try {
      await requestReturn(rental._id);
      alert("ส่งคำขอคืนหนังสือสำเร็จ กรุณารอ Admin ยืนยัน");
    } catch (error) {
      alert(
        "ส่งคำขอคืนไม่สำเร็จ: " +
          (error.message || "เกิดข้อผิดพลาด")
      );
    } finally {
      setProcessingId(null);
    }
  }

  if (authLoading || loadingRentals || loadingBooks) {
    return <p className="empty-state">กำลังโหลดข้อมูล...</p>;
  }

  if (!isLoggedIn || !profile) {
    return (
      <div className="page-header">
        <p className="empty-state">
          กรุณาเข้าสู่ระบบก่อนเพื่อดูรายการเช่าของคุณ
        </p>
        <Link to="/login" className="btn btn-primary">
          ไปหน้าเข้าสู่ระบบ
        </Link>
      </div>
    );
  }

  const activeRentals = rentals.filter(
    (r) => r.status !== "Returned"
  );

  return (
    <>
      <div className="page-header">
        <p className="breadcrumb">
          <Link to="/">หน้าแรก</Link> /{" "}
          <Link to="/member/dashboard">บัญชีของฉัน</Link> /
          รายการเช่าของฉัน
        </p>

        <h1>รายการเช่าของฉัน</h1>
        <p>ตรวจสอบสถานะการเช่าและส่งคำขอคืนหนังสือ</p>
      </div>

      <section>
        {activeRentals.length === 0 ? (
          <p className="empty-state">
            ตอนนี้คุณไม่มีหนังสือที่กำลังเช่าอยู่
          </p>
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
                  <th>การดำเนินการ</th>
                </tr>
              </thead>

              <tbody>
                {activeRentals.map((rental) => {
                  const book = books.find(
                    (b) => b._id === rental.bookId
                  );

                  const canRequestReturn =
                    rental.status === "Rented";

                  return (
                    <tr key={rental._id}>
                      <td>
                        <div className="rental-book-cell">
                          {book && (
                            <img
                              src={getBookCover(book)}
                              alt={book.title}
                            />
                          )}
                          <span>
                            {book?.title || rental.bookId}
                          </span>
                        </div>
                      </td>

                      <td>{rental.rentalDate}</td>
                      <td>{rental.dueDate}</td>

                      <td>
                        <span
                          className={statusBadgeClass(rental.status)}
                        >
                          {statusLabel(rental.status)}
                        </span>
                      </td>

                      <td>
                        {rental.fine > 0
                          ? `${rental.fine} บาท`
                          : "-"}
                      </td>

                      <td>
                        {canRequestReturn ? (
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            disabled={
                              processingId === rental._id
                            }
                            onClick={() =>
                              handleRequestReturn(rental)
                            }
                          >
                            {processingId === rental._id
                              ? "กำลังส่งคำขอ..."
                              : "ขอคืนหนังสือ"}
                          </button>
                        ) : rental.status === "PendingReturn" ? (
                          <span>รอ Admin ยืนยัน</span>
                        ) : book ? (
                          <Link
                            to={`/books/${book._id}`}
                            className="btn btn-outline btn-sm"
                          >
                            ดูรายละเอียด
                          </Link>
                        ) : (
                          "-"
                        )}
                      </td>
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

export default MyRentals;