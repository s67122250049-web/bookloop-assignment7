import { Link } from "react-router-dom";
import { categories } from "../../data/mockData.js";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection.js";
import BookCard from "../../components/front/BookCard.jsx";
import { getBookCover } from "../../utils/bookCover.js";

const iconSearch = "/images/icons/search.svg";
const iconHeart = "/images/icons/heart.svg";
const iconBook = "/images/icons/book.svg";
const iconBookmark = "/images/icons/bookmark.svg";

// จุดเด่นของระบบ อ้างอิงจากตาราง Function/Feature ในเอกสารวิเคราะห์ความต้องการ
const features = [
  {
    icon: iconSearch,
    title: "ค้นหาหนังสือได้ทันที",
    desc: "ค้นหาจากชื่อหนังสือ ผู้แต่ง หรือหมวดหมู่ พร้อมกรองผลลัพธ์ตามที่ต้องการ",
  },
  {
    icon: iconBook,
    title: "ตรวจสอบสถานะแบบเรียลไทม์",
    desc: "รู้จำนวนหนังสือที่พร้อมให้เช่าในแต่ละชื่อเรื่องก่อนตัดสินใจ (ข้อมูลซิงก์จาก Firestore)",
  },
  {
    icon: iconBookmark,
    title: "จัดการสมาชิกครบวงจร",
    desc: "สมัครสมาชิก เข้าสู่ระบบ และดูข้อมูลบัญชีได้ในที่เดียว",
  },
  {
    icon: iconHeart,
    title: "ติดตามประวัติการเช่า-คืน",
    desc: "ดูวันที่เช่า กำหนดคืน และประวัติย้อนหลังของแต่ละสมาชิก",
  },
];

function Home() {
  const { data: books, loading, error } = useFirestoreCollection("books");

  const featuredBook = books[0];
  const popularBooks = [...books].sort((a, b) => b.rating - a.rating).slice(0, 3);
  const availableBooks = books.filter((book) => book.quantityAvailable > 0);
  const totalAvailableCopies = books.reduce((sum, b) => sum + b.quantityAvailable, 0);
  const totalCopies = books.reduce((sum, b) => sum + b.quantityTotal, 0);

  if (loading) {
    return <p className="empty-state">กำลังโหลดข้อมูลจาก Firestore...</p>;
  }

  if (error) {
    return <p className="empty-state">โหลดข้อมูลไม่สำเร็จ: {error}</p>;
  }

  if (books.length === 0) {
    return (
      <div className="page-header">
        <p className="empty-state">
          ยังไม่มีข้อมูลหนังสือใน Firestore — ไปที่หน้า Admin Dashboard แล้วกด
          "นำเข้าข้อมูลตัวอย่าง" ก่อนครับ
        </p>
        <Link to="/admin/dashboard" className="btn btn-primary">
          ไปที่ Admin Dashboard
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* ===== HERO ===== */}
      <section id="home" className="hero">
        <div className="hero-content">
          <p className="hero-eyebrow">ระบบเช่า–คืนหนังสือออนไลน์ สำหรับร้านหนังสือ</p>
          <h1 className="hero-title">
            ยืมหนังสือที่ใช่ คืนได้ง่าย จัดการสมาชิกได้ในที่เดียว
          </h1>
          <p className="hero-desc">
            BOOKLOOP ช่วยให้สมาชิกค้นหา เช่า และคืนหนังสือได้อย่างสะดวก
            พร้อมให้ร้านหนังสือติดตามคลังหนังสือและข้อมูลสมาชิกได้อย่างเป็นระบบ
          </p>
          <div className="hero-actions">
            <Link to="/books" className="btn btn-primary">
              ดูหนังสือทั้งหมด
            </Link>
            <a href="#categories" className="btn btn-ghost">
              เลือกดูตามหมวดหมู่
            </a>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">{books.length}</span>
              <span className="stat-label">ชื่อเรื่องแนะนำ</span>
            </div>
            <div className="stat">
              <span className="stat-number">{categories.length}</span>
              <span className="stat-label">หมวดหมู่</span>
            </div>
            <div className="stat">
              <span className="stat-number">
                {totalAvailableCopies}/{totalCopies}
              </span>
              <span className="stat-label">เล่มที่พร้อมให้เช่า</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
  {books[1] && (
    <img src={getBookCover(books[1])} alt={books[1].title} className="hero-cover hero-cover-back" />
  )}
  {books[3] && (
    <img src={getBookCover(books[3])} alt={books[3].title} className="hero-cover hero-cover-mid" />
  )}
  <img src={getBookCover(featuredBook)} alt={featuredBook.title} className="hero-cover hero-cover-front" />

          <div className="featured-card">
            <p className="featured-label">แนะนำประจำสัปดาห์</p>
            <p className="featured-title">{featuredBook.title}</p>
            <p className="featured-author">{featuredBook.author}</p>
            <p className="featured-meta">
              {featuredBook.category} • {featuredBook.year}
            </p>
          </div>
        </div>
      </section>

      {/* ===== SEARCH ===== */}
      <section className="search-section">
        <div className="search-box">
          <img src={iconSearch} alt="" className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="ค้นหาชื่อหนังสือ ผู้แต่ง หรือหมวดหมู่..."
            readOnly
          />
          <Link to="/books" className="btn btn-primary search-btn">
            ค้นหา
          </Link>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section id="categories" className="categories-section">
        <div className="section-head">
          <h2>หมวดหมู่หนังสือ</h2>
          <p>เลือกดูหนังสือตามหมวดหมู่ที่คุณสนใจ</p>
        </div>

        <div className="category-grid">
          {categories.map((cat) => (
            <Link to="/books" className="category-card" key={cat.id}>
              <img src={cat.icon} alt="" className="category-icon" />
              <span className="category-name">{cat.th}</span>
              <span className="category-name-en">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== RECOMMENDED BOOKS ===== */}
      <section id="books" className="books-section">
        <div className="section-head">
          <h2>หนังสือแนะนำ</h2>
          <p>ข้อมูลดึงตรงจาก Firestore แบบเรียลไทม์</p>
        </div>

        <div className="book-grid">
          {books.map((book) => (
            <BookCard book={book} key={book._id} />
          ))}
        </div>
      </section>

      {/* ===== POPULAR BOOKS ===== */}
      <section className="books-section">
        <div className="section-head">
          <h2>หนังสือยอดนิยม</h2>
          <p>จัดอันดับตามคะแนนรีวิวจากสมาชิก</p>
        </div>

        <div className="book-grid">
          {popularBooks.map((book) => (
            <BookCard book={book} key={book._id} />
          ))}
        </div>
      </section>

      {/* ===== AVAILABLE BOOKS ===== */}
      <section className="books-section">
        <div className="section-head">
          <h2>หนังสือพร้อมให้เช่าตอนนี้</h2>
          <p>รายการที่ยังมีเล่มว่างในคลัง สามารถเช่าได้ทันที</p>
        </div>

        {availableBooks.length === 0 ? (
          <p className="empty-state">ไม่มีหนังสือพร้อมให้เช่าในขณะนี้</p>
        ) : (
          <div className="book-grid">
            {availableBooks.map((book) => (
              <BookCard book={book} key={book._id} />
            ))}
          </div>
        )}
      </section>

      {/* ===== FEATURES ===== */}
      <section className="features-section">
        <div className="section-head">
          <h2>จุดเด่นของระบบ</h2>
          <p>ออกแบบมาเพื่อทั้งสมาชิกและร้านหนังสือ</p>
        </div>

        <div className="feature-grid">
          {features.map((f) => (
            <div className="feature-card" key={f.title}>
              <img src={f.icon} alt="" className="feature-icon" />
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section id="about" className="about-section">
        <div className="about-text">
          <h2>เกี่ยวกับ BOOKLOOP</h2>
          <p>
            BOOKLOOP คือระบบเช่า-คืนหนังสือออนไลน์พร้อมจัดการสมาชิกสำหรับร้านหนังสือ
            พัฒนาขึ้นเพื่อให้สมาชิกค้นหาและเช่าหนังสือได้ด้วยตนเองผ่านหน้าเว็บ
            ในขณะที่ร้านหนังสือสามารถติดตามคลังหนังสือ สถานะการเช่า-คืน
            และข้อมูลสมาชิกได้อย่างเป็นระบบในที่เดียว
          </p>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="how-section">
        <div className="section-head">
          <h2>ใช้งานอย่างไร</h2>
          <p>สามขั้นตอนหลักของระบบ</p>
        </div>

        <div className="how-steps">
          <div className="how-step">
            <img src={iconSearch} alt="" className="how-icon" />
            <h3>ค้นหาหนังสือ</h3>
            <p>ค้นหาหรือเลือกดูตามหมวดหมู่ที่สนใจ</p>
          </div>
          <span className="how-arrow">→</span>
          <div className="how-step">
            <img src={iconBook} alt="" className="how-icon" />
            <h3>เช่าหนังสือ</h3>
            <p>ตรวจสอบสถานะและยืนยันการเช่า</p>
          </div>
          <span className="how-arrow">→</span>
          <div className="how-step">
            <img src={iconBookmark} alt="" className="how-icon" />
            <h3>คืนหนังสือ</h3>
            <p>คืนตามกำหนดและดูประวัติการเช่า-คืนได้</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
