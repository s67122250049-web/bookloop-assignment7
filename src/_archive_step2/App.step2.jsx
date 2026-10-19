import "./App.css";

/*
  รูปภาพทั้งหมดเก็บไว้ในโฟลเดอร์ public/images ตามแนวทางที่กำหนด
  ไฟล์ใน public จะถูกให้บริการจาก root path ของเว็บไซต์โดยตรง
  จึงอ้างอิง path เป็นข้อความ (ไม่ใช้ import) แล้วส่งค่าผ่าน attribute ที่เป็น JavaScript Expression
*/
const logo = "/images/logo/book_rental_logo.svg";

// icons
const iconSearch = "/images/icons/search.svg";
const iconHeart = "/images/icons/heart.svg";
const iconUser = "/images/icons/user.svg";
const iconChevron = "/images/icons/chevron-right.svg";
const iconBook = "/images/icons/book.svg";
const iconBookmark = "/images/icons/bookmark.svg";

// category icons
const catFantasy = "/images/categories/fantasy.svg";
const catFiction = "/images/categories/fiction.svg";
const catChildren = "/images/categories/children.svg";
const catEducation = "/images/categories/education.svg";
const catBusiness = "/images/categories/business.svg";
const catHistory = "/images/categories/history.svg";
const catRomance = "/images/categories/romance.svg";
const catScience = "/images/categories/science.svg";

// book covers (image_thumbnail assets from the project's Digital Asset set)
const cover001 = "/images/books/book_001_thumb.svg";
const cover002 = "/images/books/book_002_thumb.svg";
const cover003 = "/images/books/book_003_thumb.svg";
const cover004 = "/images/books/book_004_thumb.svg";
const cover005 = "/images/books/book_005_thumb.svg";

/*
  ข้อมูลหนังสือทั้งหมดด้านล่างนำมาจาก Book Master Dataset
  (Online_Book_Rental_Assignment5.xlsx / งาน 5) ซึ่งเป็นแหล่งข้อมูลหลักของโครงงาน
  ไม่มีการแต่งข้อมูลหนังสือขึ้นมาเอง
*/
const books = [
  {
    id: "B001",
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    category: "Fantasy",
    publisher: "Bloomsbury",
    year: 1997,
    quantityTotal: 5,
    quantityAvailable: 4,
    cover: cover001,
  },
  {
    id: "B002",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    category: "Fantasy",
    publisher: "George Allen & Unwin",
    year: 1937,
    quantityTotal: 5,
    quantityAvailable: 3,
    cover: cover002,
  },
  {
    id: "B003",
    title: "1984",
    author: "George Orwell",
    category: "Fiction",
    publisher: "Secker & Warburg",
    year: 1949,
    quantityTotal: 4,
    quantityAvailable: 2,
    cover: cover003,
  },
  {
    id: "B004",
    title: "Animal Farm",
    author: "George Orwell",
    category: "Fiction",
    publisher: "Secker & Warburg",
    year: 1945,
    quantityTotal: 4,
    quantityAvailable: 4,
    cover: cover004,
  },
  {
    id: "B005",
    title: "The Little Prince",
    author: "Antoine de Saint-Exupéry",
    category: "Children",
    publisher: "Reynal & Hitchcock",
    year: 1943,
    quantityTotal: 5,
    quantityAvailable: 5,
    cover: cover005,
  },
];

// หมวดหมู่หนังสือทั้ง 8 รายการ มาจากชีต Categories ในไฟล์ข้อมูลของโครงงาน
const categories = [
  { id: "C001", name: "Fantasy", th: "แฟนตาซี", icon: catFantasy },
  { id: "C002", name: "Fiction", th: "นวนิยาย", icon: catFiction },
  { id: "C003", name: "Children", th: "หนังสือเด็ก", icon: catChildren },
  { id: "C004", name: "Education", th: "การศึกษา", icon: catEducation },
  { id: "C005", name: "Business", th: "ธุรกิจ", icon: catBusiness },
  { id: "C006", name: "History", th: "ประวัติศาสตร์", icon: catHistory },
  { id: "C007", name: "Science", th: "วิทยาศาสตร์", icon: catScience },
  { id: "C008", name: "Romance", th: "โรแมนซ์", icon: catRomance },
];

// จุดเด่นของระบบ อ้างอิงจากตาราง Function/Feature ในเอกสารวิเคราะห์ความต้องการ (ขั้นที่ 1)
const features = [
  {
    icon: iconSearch,
    title: "ค้นหาหนังสือได้ทันที",
    desc: "ค้นหาจากชื่อหนังสือ ผู้แต่ง หรือหมวดหมู่ พร้อมกรองผลลัพธ์ตามที่ต้องการ",
  },
  {
    icon: iconBook,
    title: "ตรวจสอบสถานะแบบเรียลไทม์",
    desc: "รู้จำนวนหนังสือที่พร้อมให้เช่าในแต่ละชื่อเรื่องก่อนตัดสินใจ",
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

// หนังสือแนะนำประจำสัปดาห์ — ตัวแปร Object เดี่ยว (แยกจาก Array ของรายการหนังสือด้านบน)
const featuredBook = books[0];

function App() {
  // ตัวอย่าง JavaScript Expression: คำนวณจำนวนหนังสือที่พร้อมให้เช่าทั้งหมดจากข้อมูลจริง
  const totalAvailableCopies = books.reduce(
    (sum, book) => sum + book.quantityAvailable,
    0
  );
  const totalCopies = books.reduce((sum, book) => sum + book.quantityTotal, 0);

  return (
    <>
      {/* ===== HEADER ===== */}
      <header className="site-header">
        <div className="header-inner">
          <a href="#home" className="brand">
            <img src={logo} alt="BOOKLOOP" className="brand-logo" />
          </a>

          <nav className="main-nav">
            <a href="#home">หน้าแรก</a>
            <a href="#categories">หมวดหมู่</a>
            <a href="#books">หนังสือแนะนำ</a>
            <a href="#about">เกี่ยวกับระบบ</a>
            <a href="#how-it-works">วิธีใช้งาน</a>
          </nav>

          <a href="#member" className="btn btn-outline header-member-btn">
            <img src={iconUser} alt="" className="btn-icon" />
            เข้าสู่ระบบ
          </a>
        </div>
      </header>

      <main>
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
              ตั้งแต่การค้นหาจนถึงการคืนหนังสือครบวงจร
            </p>
            <div className="hero-actions">
              <a href="#books" className="btn btn-primary">
                ดูหนังสือแนะนำ
              </a>
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

          {/* Hero Image: ประกอบจากปกหนังสือจริงในชุดข้อมูล ใช้แทนภาพถ่าย Hero */}
          <div className="hero-visual">
            <img
              src={books[1].cover}
              alt={books[1].title}
              className="hero-cover hero-cover-back"
            />
            <img
              src={books[3].cover}
              alt={books[3].title}
              className="hero-cover hero-cover-mid"
            />
            <img
              src={featuredBook.cover}
              alt={featuredBook.title}
              className="hero-cover hero-cover-front"
            />

            {/* แสดงค่าจาก Object เดี่ยว (featuredBook) ไม่ใช่จากการ map() array */}
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

        {/* ===== SEARCH (Static UI เท่านั้น ไม่มีการค้นหาจริง) ===== */}
        <section className="search-section">
          <div className="search-box">
            <img src={iconSearch} alt="" className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="ค้นหาชื่อหนังสือ ผู้แต่ง หรือหมวดหมู่..."
              readOnly
            />
            <button type="button" className="btn btn-primary search-btn">
              ค้นหา
            </button>
          </div>
          <p className="search-hint">
            * ช่องค้นหานี้เป็นเพียง UI ต้นแบบสำหรับหน้า Home ยังไม่เชื่อมต่อการค้นหาจริง
          </p>
        </section>

        {/* ===== BOOK CATEGORIES ===== */}
        <section id="categories" className="categories-section">
          <div className="section-head">
            <h2>หมวดหมู่หนังสือ</h2>
            <p>เลือกดูหนังสือตามหมวดหมู่ที่คุณสนใจ</p>
          </div>

          <div className="category-grid">
            {categories.map((cat) => (
              <a href="#books" className="category-card" key={cat.id}>
                <img src={cat.icon} alt="" className="category-icon" />
                <span className="category-name">{cat.th}</span>
                <span className="category-name-en">{cat.name}</span>
              </a>
            ))}
          </div>
        </section>

        {/* ===== RECOMMENDED BOOKS ===== */}
        <section id="books" className="books-section">
          <div className="section-head">
            <h2>หนังสือแนะนำ</h2>
            <p>ตัวอย่างหนังสือจากคลังของร้าน พร้อมสถานะการให้เช่าล่าสุด</p>
          </div>

          {/* Conditional Rendering: กรณีไม่มีหนังสือแนะนำเลย (ตามสเปกหน้า P01) */}
          {books.length === 0 ? (
            <p className="empty-state">ไม่พบหนังสือแนะนำ</p>
          ) : (
            <div className="book-grid">
              {books.map((book) => (
                <article className="book-card" key={book.id}>
                  <div className="book-cover-wrap">
                    <img src={book.cover} alt={book.title} className="book-cover" />
                  </div>
                  <div className="book-info">
                    <span className="book-category">{book.category}</span>
                    <h3 className="book-title">{book.title}</h3>
                    <p className="book-author">{book.author}</p>

                    {/* Conditional Rendering ตามจำนวนที่พร้อมให้เช่าจริง */}
                    <p
                      className={
                        book.quantityAvailable > 0
                          ? "book-status available"
                          : "book-status unavailable"
                      }
                    >
                      {book.quantityAvailable > 0
                        ? `พร้อมให้เช่า (${book.quantityAvailable}/${book.quantityTotal} เล่ม)`
                        : "ไม่พร้อมให้เช่า"}
                    </p>

                    <button type="button" className="btn btn-outline book-btn">
                      ดูรายละเอียด
                      <img src={iconChevron} alt="" className="btn-icon-right" />
                    </button>
                  </div>
                </article>
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
            <p>
              โครงงานนี้เป็นส่วนหนึ่งของวิชาการพัฒนาเว็บแอปพลิเคชัน
              สาขาวิชาวิทยาการคอมพิวเตอร์ คณะวิทยาศาสตร์และเทคโนโลยี
              มหาวิทยาลัยราชภัฏสวนสุนันทา
            </p>
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section id="how-it-works" className="how-section">
          <div className="section-head">
            <h2>ใช้งานอย่างไร</h2>
            <p>สามขั้นตอนหลักของระบบ (ยังไม่เชื่อมต่อการทำงานจริงในหน้าต้นแบบนี้)</p>
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
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <img src={logo} alt="BOOKLOOP" className="footer-logo" />
            <p>ระบบเช่า-คืนหนังสือออนไลน์พร้อมจัดการสมาชิกสำหรับร้านหนังสือ</p>
          </div>

          <div className="footer-links">
            <a href="#home">หน้าแรก</a>
            <a href="#categories">หมวดหมู่</a>
            <a href="#books">หนังสือแนะนำ</a>
            <a href="#about">เกี่ยวกับระบบ</a>
          </div>

          <div className="footer-meta">
            <p>โครงงาน: ระบบเช่า-คืนหนังสือออนไลน์พร้อมจัดการสมาชิกสำหรับร้านหนังสือ</p>
            <p>วิชาการพัฒนาเว็บแอปพลิเคชัน สาขาวิทยาการคอมพิวเตอร์</p>
            <p>คณะวิทยาศาสตร์และเทคโนโลยี มหาวิทยาลัยราชภัฏสวนสุนันทา</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
