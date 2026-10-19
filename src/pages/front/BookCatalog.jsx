import { useMemo, useState } from "react";
import { categories } from "../../data/mockData.js";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection.js";
import BookCard from "../../components/front/BookCard.jsx";
import { useRealtimeCategories } from "../../hooks/useRealtimeCategories.js";

const iconSearch = "/images/icons/search.svg";

function BookCatalog() {
  const { data: books, loading, error } = useFirestoreCollection("books");
  const { categories: liveCategories, loading: categoryLoading, error: categoryError } = useRealtimeCategories();

  const [keyword, setKeyword] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("title-asc");

  const filteredBooks = useMemo(() => {
    let result = books.filter((book) => {
      const matchKeyword =
        keyword.trim() === "" ||
        book.title.toLowerCase().includes(keyword.toLowerCase()) ||
        book.author.toLowerCase().includes(keyword.toLowerCase());

      const matchCategory = categoryFilter === "all" || book.category === categoryFilter;

      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "available" && book.quantityAvailable > 0) ||
        (statusFilter === "unavailable" && book.quantityAvailable === 0);

      return matchKeyword && matchCategory && matchStatus;
    });

    switch (sortBy) {
      case "title-asc":
        result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "rating-desc":
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      case "year-desc":
        result = [...result].sort((a, b) => b.year - a.year);
        break;
      default:
        break;
    }

    return result;
  }, [books, keyword, categoryFilter, statusFilter, sortBy]);

  return (
    <>
      <div className="page-header">
        <p className="breadcrumb">หน้าแรก / หนังสือทั้งหมด</p>
        <h1>หนังสือทั้งหมด</h1>
        <p>ค้นหา กรอง และเรียงลำดับหนังสือในคลังของร้าน (ข้อมูลจาก Firestore แบบเรียลไทม์)</p>
      </div>

      <section>
        <div role="status" style={{ marginBottom: "12px", fontSize: "0.9rem" }}>
          {categoryLoading ? "กำลังโหลดหมวดหมู่จาก Realtime Database..." :
            categoryError ? `ไม่สามารถโหลดหมวดหมู่จาก Realtime Database: ${categoryError}` :
            `หมวดหมู่จาก Realtime Database: ${liveCategories.length ? liveCategories.map(c => c.name).join(" · ") : "ไม่พบข้อมูล"}`}
        </div>
        <div className="catalog-toolbar">
          <div className="catalog-search">
            <img src={iconSearch} alt="" />
            <input
              type="text"
              placeholder="ค้นหาชื่อหนังสือหรือผู้แต่ง..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <div className="catalog-filters">
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="all">ทุกหมวดหมู่</option>
              {categories.map((cat) => (
                <option value={cat.name} key={cat.id}>
                  {cat.th}
                </option>
              ))}
            </select>

            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">ทุกสถานะ</option>
              <option value="available">พร้อมให้เช่า</option>
              <option value="unavailable">ไม่พร้อมให้เช่า</option>
            </select>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="title-asc">เรียงตามชื่อ (ก-ฮ)</option>
              <option value="rating-desc">คะแนนสูงสุดก่อน</option>
              <option value="year-desc">ปีพิมพ์ล่าสุดก่อน</option>
            </select>
          </div>
        </div>

        {loading && <p className="empty-state">กำลังโหลดข้อมูล...</p>}
        {error && <p className="empty-state">โหลดข้อมูลไม่สำเร็จ: {error}</p>}

        {!loading && !error && (
          <>
            <p className="catalog-count">พบ {filteredBooks.length} รายการ</p>

            {filteredBooks.length === 0 ? (
              <p className="empty-state">ไม่พบหนังสือที่ตรงกับเงื่อนไขที่เลือก</p>
            ) : (
              <div className="book-grid">
                {filteredBooks.map((book) => (
                  <BookCard book={book} key={book._id} />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}

export default BookCatalog;
