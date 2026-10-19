import { useState } from "react";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection.js";

function statusBadgeClass(status) {
  if (status === "Rented") return "badge badge-info";
  if (status === "Overdue") return "badge badge-danger";
  if (status === "Returned") return "badge badge-success";
  return "badge badge-neutral";
}

function RentalManagement() {
  const { data: rentals, loading: loadingRentals } = useFirestoreCollection("rentals");
  const { data: books, loading: loadingBooks } = useFirestoreCollection("books");
  const { data: members, loading: loadingMembers } = useFirestoreCollection("members");
  const [statusFilter, setStatusFilter] = useState("all");

  const loading = loadingRentals || loadingBooks || loadingMembers;

  const filteredRentals = rentals.filter(
    (r) => statusFilter === "all" || r.status === statusFilter
  );

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>จัดการรายการเช่า</h1>
          <p>รายการเช่าหนังสือทั้งหมดในระบบ (เชื่อมต่อ Firestore แบบเรียลไทม์)</p>
        </div>
      </div>

      <div className="admin-toolbar">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">ทุกสถานะ</option>
          <option value="Rented">กำลังเช่า</option>
          <option value="Returned">คืนแล้ว</option>
          <option value="Overdue">เกินกำหนด</option>
        </select>
      </div>

      {loading && <p className="empty-state">กำลังโหลดข้อมูล...</p>}

      {!loading && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>เลขรายการ</th>
                <th>สมาชิก</th>
                <th>หนังสือ</th>
                <th>วันที่เช่า</th>
                <th>กำหนดคืน</th>
                <th>สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {filteredRentals.map((rental) => {
                const book = books.find((b) => b._id === rental.bookId);
                const member = members.find((m) => m.id === rental.memberId);
                return (
                  <tr key={rental._id}>
                    <td>{rental.id || rental._id.slice(0, 6)}</td>
                    <td>{member?.name || rental.memberId}</td>
                    <td>{book?.title || rental.bookId}</td>
                    <td>{rental.rentalDate}</td>
                    <td>{rental.dueDate}</td>
                    <td>
                      <span className={statusBadgeClass(rental.status)}>{rental.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!loading && filteredRentals.length === 0 && (
        <p className="empty-state">ไม่พบรายการเช่าที่ตรงกับเงื่อนไข</p>
      )}
    </>
  );
}

export default RentalManagement;
