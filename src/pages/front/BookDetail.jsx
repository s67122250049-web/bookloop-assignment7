import { getBookCover } from "../../utils/bookCover.js";
import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection.js";
import { addDocument, updateDocument } from "../../services/firestoreService.js";
import { useAuth } from "../../context/AuthContext.jsx";

function BookDetail() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { profile, isLoggedIn } = useAuth();
  const { data: books, loading } = useFirestoreCollection("books");
  const [renting, setRenting] = useState(false);
  const [rentError, setRentError] = useState(null);

  if (loading) {
    return <p className="empty-state">กำลังโหลดข้อมูล...</p>;
  }

  const book = books.find((b) => b._id === bookId);

  if (!book) {
    return (
      <div className="page-header">
        <p className="empty-state">ไม่พบหนังสือเล่มนี้</p>
        <Link to="/books" className="btn btn-outline">
          กลับไปหน้าหนังสือทั้งหมด
        </Link>
      </div>
    );
  }

  const isAvailable = book.quantityAvailable > 0;

  // สร้างรายการเช่าจริงใน Firestore (collection "rentals") ผูกกับบัญชีที่ล็อกอินอยู่จริง
  // และลดจำนวนเล่มที่พร้อมให้เช่าลง 1
  async function handleRent() {
    if (!isLoggedIn || !profile) {
      navigate("/login");
      return;
    }

    setRenting(true);
    setRentError(null);
    try {
      const today = new Date();
      const dueDate = new Date(today);
      dueDate.setDate(dueDate.getDate() + (book.rentalDays || 14));

      await addDocument("rentals", {
        memberId: profile.id,
        bookId: book._id,
        rentalDate: today.toISOString().slice(0, 10),
        dueDate: dueDate.toISOString().slice(0, 10),
        returnDate: null,
        status: "Rented",
        fine: 0,
      });

      await updateDocument("books", book._id, {
        quantityAvailable: book.quantityAvailable - 1,
      });

      navigate("/member/rentals");
    } catch (err) {
      setRentError(err.message || "เช่าหนังสือไม่สำเร็จ");
    } finally {
      setRenting(false);
    }
  }

  return (
    <>
      <div className="page-header">
        <p className="breadcrumb">
          <Link to="/">หน้าแรก</Link> / <Link to="/books">หนังสือทั้งหมด</Link> / {book.title}
        </p>
      </div>

      <section className="book-detail">
        <img src={getBookCover(book)} alt={book.title} className="book-detail-cover" />

        <div>
          <span className="book-detail-category">{book.category}</span>
          <h1 className="book-detail-title">{book.title}</h1>
          <p className="book-detail-author">โดย {book.author}</p>

          <p className="book-rating">★ {(book.rating ?? 0).toFixed(1)} คะแนนรีวิว</p>

          <p>{book.description}</p>

          <div className="book-detail-meta">
            <div className="meta-item">
              <span>สถานะ</span>
              <span className={isAvailable ? "available" : "unavailable"}>
                {isAvailable ? "พร้อมให้เช่า" : "ไม่พร้อมให้เช่า"}
              </span>
            </div>
            <div className="meta-item">
              <span>จำนวนเล่ม</span>
              <span>
                {book.quantityAvailable}/{book.quantityTotal} เล่ม
              </span>
            </div>
            <div className="meta-item">
              <span>ระยะเวลาเช่า</span>
              <span>{book.rentalDays} วัน</span>
            </div>
            <div className="meta-item">
              <span>ค่าปรับคืนล่าช้า</span>
              <span>{book.lateFeePerDay} บาท/วัน</span>
            </div>
            <div className="meta-item">
              <span>สำนักพิมพ์</span>
              <span>{book.publisher}</span>
            </div>
            <div className="meta-item">
              <span>ปีพิมพ์</span>
              <span>{book.year}</span>
            </div>
          </div>

          {!isLoggedIn && (
            <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
              * ต้องเข้าสู่ระบบก่อนจึงจะเช่าหนังสือได้
            </p>
          )}
          {rentError && <p style={{ color: "var(--danger)" }}>{rentError}</p>}

          <div className="book-detail-actions">
            <button
              type="button"
              className="btn btn-primary"
              disabled={!isAvailable || renting}
              onClick={handleRent}
            >
              {renting
                ? "กำลังบันทึก..."
                : !isAvailable
                ? "ไม่พร้อมให้เช่า"
                : isLoggedIn
                ? "เช่าหนังสือเล่มนี้"
                : "เข้าสู่ระบบเพื่อเช่าหนังสือ"}
            </button>
            <Link to="/books" className="btn btn-outline">
              กลับไปหน้าหนังสือทั้งหมด
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default BookDetail;
