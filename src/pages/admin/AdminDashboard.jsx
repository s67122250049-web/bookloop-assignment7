import { useState } from "react";
import { Link } from "react-router-dom";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection.js";


const iconBook = "/images/icons/book.svg";
const iconUser = "/images/icons/user.svg";
const iconBookmark = "/images/icons/bookmark.svg";
const iconHeart = "/images/icons/heart.svg";

function statusBadgeClass(status) {
  if (status === "Rented") return "badge badge-info";
  if (status === "Overdue") return "badge badge-danger";
  if (status === "Returned") return "badge badge-success";
  return "badge badge-neutral";
}

function AdminDashboard() {
  const { data: books, loading: loadingBooks } = useFirestoreCollection("books");
  const { data: members, loading: loadingMembers } = useFirestoreCollection("members");
  const { data: rentals, loading: loadingRentals } = useFirestoreCollection("rentals");
  if (loadingBooks || loadingMembers || loadingRentals) {
    return <p className="empty-state">กำลังโหลดข้อมูลจาก Firestore...</p>;
  }

  const totalCopies = books.reduce((sum, b) => sum + b.quantityTotal, 0);
  const availableCopies = books.reduce((sum, b) => sum + b.quantityAvailable, 0);
  const rentedNow = rentals.filter((r) => r.status === "Rented" || r.status === "Overdue").length;
  const overdueCount = rentals.filter((r) => r.status === "Overdue").length;

  const popularBooks = [...books].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 4);
  const recentRentals = [...rentals].slice(-4).reverse();

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>ภาพรวมระบบ</h1>
          <p>สรุปสถานะหนังสือ สมาชิก และรายการเช่า-คืนล่าสุด (เชื่อมต่อ Firestore แบบเรียลไทม์)</p>
        </div>

      </div>

      {books.length === 0 && (
        <p className="empty-state">
          ยังไม่มีข้อมูลใน Firestore เลย — กดปุ่ม "นำเข้าข้อมูลตัวอย่าง" ด้านบนก่อนครับ
        </p>
      )}

      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <img src={iconBook} alt="" />
          </div>
          <span className="admin-stat-number">{totalCopies}</span>
          <span className="admin-stat-label">จำนวนหนังสือทั้งหมด (เล่ม)</span>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <img src={iconUser} alt="" />
          </div>
          <span className="admin-stat-number">{members.length}</span>
          <span className="admin-stat-label">จำนวนสมาชิก</span>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <img src={iconBookmark} alt="" />
          </div>
          <span className="admin-stat-number">{rentedNow}</span>
          <span className="admin-stat-label">กำลังถูกเช่า</span>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <img src={iconHeart} alt="" />
          </div>
          <span className="admin-stat-number">{availableCopies}</span>
          <span className="admin-stat-label">พร้อมให้เช่า</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-number">{overdueCount}</span>
          <span className="admin-stat-label">รายการเกินกำหนด</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-number">{rentals.length}</span>
          <span className="admin-stat-label">รายการเช่าทั้งหมด</span>
        </div>
      </div>

      <div className="admin-panels">
        <div className="admin-panel">
          <div className="admin-panel-head">
            <h3>รายการเช่าล่าสุด</h3>
            <Link to="/admin/rentals" className="btn btn-ghost btn-sm">
              ดูทั้งหมด
            </Link>
          </div>
          {recentRentals.length === 0 && <p className="empty-state">ยังไม่มีรายการเช่า</p>}
          {recentRentals.map((r) => {
            const book = books.find((b) => b._id === r.bookId);
            const member = members.find((m) => m.id === r.memberId);
            return (
              <div className="admin-list-row" key={r._id}>
                <span>
                  {book?.title || r.bookId} — {member?.name || r.memberId}
                </span>
                <span className={statusBadgeClass(r.status)}>{r.status}</span>
              </div>
            );
          })}
        </div>

        <div className="admin-panel">
          <div className="admin-panel-head">
            <h3>Quick Actions</h3>
          </div>
          <div className="admin-quick-actions">
            <Link to="/admin/books" className="btn btn-outline btn-sm">
              + เพิ่มหนังสือ
            </Link>
            <Link to="/admin/members" className="btn btn-outline btn-sm">
              + เพิ่มสมาชิก
            </Link>
            <Link to="/admin/rentals" className="btn btn-outline btn-sm">
              ดูรายการเช่า
            </Link>
            <Link to="/admin/returns" className="btn btn-outline btn-sm">
              ตรวจรายการคืน
            </Link>
          </div>

          <div className="admin-panel-head" style={{ marginTop: "20px" }}>
            <h3>หนังสือยอดนิยม</h3>
          </div>
          {popularBooks.map((book) => (
            <div className="admin-list-row" key={book._id}>
              <span>{book.title}</span>
              <span>★ {(book.rating || 0).toFixed(1)}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
