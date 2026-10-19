import { useState } from "react";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection.js";
import { updateDocument } from "../../services/firestoreService.js";

// คำนวณจำนวนวันที่เกินกำหนด เทียบกับวันที่คืนจริง (หรือวันปัจจุบันถ้ายังไม่คืน)
function daysLate(rental) {
  const due = new Date(rental.dueDate);
  const compareDate = rental.returnDate ? new Date(rental.returnDate) : new Date();
  const diff = Math.floor((compareDate - due) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

function statusBadgeClass(status) {
  if (status === "Rented") return "badge badge-info";
  if (status === "Overdue") return "badge badge-danger";
  if (status === "Returned") return "badge badge-success";
  return "badge badge-neutral";
}

function ReturnManagement() {
  const { data: rentals, loading: loadingRentals } = useFirestoreCollection("rentals");
  const { data: books, loading: loadingBooks } = useFirestoreCollection("books");
  const { data: members, loading: loadingMembers } = useFirestoreCollection("members");
  const [processingId, setProcessingId] = useState(null);

  const loading = loadingRentals || loadingBooks || loadingMembers;

  // บันทึกการคืนหนังสือจริง: ตั้งสถานะเป็น Returned, บันทึกวันที่คืน, คำนวณค่าปรับ
  // และเพิ่มจำนวนเล่มที่พร้อมให้เช่าของหนังสือเล่มนั้นกลับคืน 1 เล่ม
  async function handleMarkReturned(rental) {
    setProcessingId(rental._id);
    const book = books.find((b) => b._id === rental.bookId);
    const late = daysLate(rental);
    const fine = late * (book?.lateFeePerDay || 10);
    const today = new Date().toISOString().slice(0, 10);

    try {
      await updateDocument("rentals", rental._id, {
        status: "Returned",
        returnDate: today,
        fine,
      });
      if (book) {
        await updateDocument("books", book._id, {
          quantityAvailable: book.quantityAvailable + 1,
        });
      }
    } catch (err) {
      alert("บันทึกการคืนไม่สำเร็จ: " + (err.message || "unknown error"));
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>จัดการรายการคืน</h1>
          <p>ตรวจสอบรายการคืนหนังสือและค่าปรับกรณีคืนล่าช้า</p>
        </div>
      </div>

      {loading && <p className="empty-state">กำลังโหลดข้อมูล...</p>}

      {!loading && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>สมาชิก</th>
                <th>หนังสือ</th>
                <th>วันที่เช่า</th>
                <th>วันที่คืน</th>
                <th>กำหนดคืน</th>
                <th>จำนวนวันที่เกิน</th>
                <th>ค่าปรับ</th>
                <th>สถานะ</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rentals.map((rental) => {
                const book = books.find((b) => b._id === rental.bookId);
                const member = members.find((m) => m.id === rental.memberId);
                const late = daysLate(rental);
                const notReturned = rental.status !== "Returned";
                return (
                  <tr key={rental._id}>
                    <td>{member?.name || rental.memberId}</td>
                    <td>{book?.title || rental.bookId}</td>
                    <td>{rental.rentalDate}</td>
                    <td>{rental.returnDate ?? "ยังไม่คืน"}</td>
                    <td>{rental.dueDate}</td>
                    <td>{late > 0 ? `${late} วัน` : "-"}</td>
                    <td>{rental.fine > 0 ? `${rental.fine} บาท` : "-"}</td>
                    <td>
                      <span className={statusBadgeClass(rental.status)}>{rental.status}</span>
                    </td>
                    <td>
                      {notReturned ? (
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          disabled={processingId === rental._id}
                          onClick={() => handleMarkReturned(rental)}
                        >
                          {processingId === rental._id ? "กำลังบันทึก..." : "บันทึกว่าคืนแล้ว"}
                        </button>
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
    </>
  );
}

export default ReturnManagement;
