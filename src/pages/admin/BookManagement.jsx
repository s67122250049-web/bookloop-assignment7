import { getBookCover } from "../../utils/bookCover.js";
import { useState } from "react";
import { categories } from "../../data/mockData.js";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection.js";
import { addDocument, updateDocument, deleteDocument } from "../../services/firestoreService.js";

const iconSearch = "/images/icons/search.svg";

const emptyForm = {
  title: "",
  author: "",
  category: "Fantasy",
  publisher: "",
  year: "",
  quantityTotal: "",
  quantityAvailable: "",
  rating: "",
  description: "",
  rentalDays: 14,
  lateFeePerDay: 10,
  cover: "",
  status: "Available",
};

function BookManagement() {
  const { data: books, loading, error } = useFirestoreCollection("books");

  const [keyword, setKeyword] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const filteredBooks = books.filter((book) => {
    const matchKeyword =
      keyword.trim() === "" || book.title.toLowerCase().includes(keyword.toLowerCase());
    const matchCategory = categoryFilter === "all" || book.category === categoryFilter;
    return matchKeyword && matchCategory;
  });

  function openAddModal() {
    setForm(emptyForm);
    setEditingId(null);
    setModalOpen(true);
  }

  function openEditModal(book) {
    setForm({
      title: book.title || "",
      author: book.author || "",
      category: book.category || "Fantasy",
      publisher: book.publisher || "",
      year: book.year || "",
      quantityTotal: book.quantityTotal ?? "",
      quantityAvailable: book.quantityAvailable ?? "",
      rating: book.rating ?? "",
      description: book.description || "",
      rentalDays: book.rentalDays || 14,
      lateFeePerDay: book.lateFeePerDay || 10,
      cover: book.cover || "",
      status: book.status || "Available",
    });
    setEditingId(book._id);
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const data = {
      ...form,
      year: Number(form.year) || 0,
      quantityTotal: Number(form.quantityTotal) || 0,
      quantityAvailable: Number(form.quantityAvailable) || 0,
      rating: Number(form.rating) || 0,
      rentalDays: Number(form.rentalDays) || 14,
      lateFeePerDay: Number(form.lateFeePerDay) || 10,
    };

    try {
      if (editingId) {
        await updateDocument("books", editingId, data);
      } else {
        await addDocument("books", data);
      }
      setModalOpen(false);
    } catch (err) {
      alert("บันทึกไม่สำเร็จ: " + (err.message || "unknown error"));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(book) {
    if (!window.confirm(`ลบ "${book.title}" ออกจากระบบ?`)) return;
    try {
      await deleteDocument("books", book._id);
    } catch (err) {
      alert("ลบไม่สำเร็จ: " + (err.message || "unknown error"));
    }
  }

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>จัดการหนังสือ</h1>
          <p>รายการหนังสือทั้งหมดในคลัง (เชื่อมต่อ Firestore — เพิ่ม/แก้ไข/ลบ บันทึกจริง)</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openAddModal}>
          + เพิ่มหนังสือ
        </button>
      </div>

      <div className="admin-toolbar">
        <div className="admin-toolbar-search">
          <img src={iconSearch} alt="" />
          <input
            type="text"
            placeholder="ค้นหาชื่อหนังสือ..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">ทุกหมวดหมู่</option>
          {categories.map((cat) => (
            <option value={cat.name} key={cat.id}>
              {cat.th}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="empty-state">กำลังโหลดข้อมูล...</p>}
      {error && <p className="empty-state">โหลดข้อมูลไม่สำเร็จ: {error}</p>}

      {!loading && !error && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>รหัส</th>
                <th>ปก</th>
                <th>ชื่อหนังสือ</th>
                <th>ผู้เขียน</th>
                <th>หมวดหมู่</th>
                <th>สถานะ</th>
                <th>จำนวน</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => (
                <tr key={book._id}>
                  <td>{book.id || book._id.slice(0, 6)}</td>
                  <td>
                    <img src={getBookCover(book)} alt={book.title} className="admin-table-cover" />
                  </td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.category}</td>
                  <td>
                    <span
                      className={
                        book.quantityAvailable > 0 ? "badge badge-success" : "badge badge-danger"
                      }
                    >
                      {book.quantityAvailable > 0 ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td>
                    {book.quantityAvailable}/{book.quantityTotal}
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <button type="button" className="btn btn-outline btn-sm" onClick={() => openEditModal(book)}>
                        แก้ไข
                      </button>
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(book)}>
                        ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && filteredBooks.length === 0 && (
        <p className="empty-state">ไม่พบหนังสือที่ตรงกับเงื่อนไข</p>
      )}

      {modalOpen && (
        <div className="admin-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? "แก้ไขหนังสือ" : "เพิ่มหนังสือใหม่"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>ชื่อหนังสือ</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div className="field">
                <label>ผู้เขียน</label>
                <input
                  type="text"
                  required
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                />
              </div>
              <div className="admin-modal-row">
                <div className="field">
                  <label>หมวดหมู่</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    {categories.map((cat) => (
                      <option value={cat.name} key={cat.id}>
                        {cat.th}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>ปีพิมพ์</label>
                  <input
                    type="number"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                  />
                </div>
              </div>
              <div className="admin-modal-row">
                <div className="field">
                  <label>จำนวนทั้งหมด</label>
                  <input
                    type="number"
                    required
                    value={form.quantityTotal}
                    onChange={(e) => setForm({ ...form, quantityTotal: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label>จำนวนพร้อมให้เช่า</label>
                  <input
                    type="number"
                    required
                    value={form.quantityAvailable}
                    onChange={(e) => setForm({ ...form, quantityAvailable: e.target.value })}
                  />
                </div>
              </div>
              <div className="field">
                <label>คำอธิบาย</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="admin-modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>
                  ยกเลิก
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "กำลังบันทึก..." : "บันทึก"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default BookManagement;
