import { useState } from "react";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection.js";
import { addDocument, updateDocument } from "../../services/firestoreService.js";

const iconSearch = "/images/icons/search.svg";

const emptyForm = {
  id: "",
  name: "",
  email: "",
  phone: "",
  status: "Active",
  joinDate: new Date().toISOString().slice(0, 10),
  borrowingCount: 0,
};

function MemberManagement() {
  const { data: members, loading, error } = useFirestoreCollection("members");
  const [keyword, setKeyword] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const filteredMembers = members.filter(
    (m) => keyword.trim() === "" || m.name.toLowerCase().includes(keyword.toLowerCase())
  );

  function openAddModal() {
    setForm({ ...emptyForm, id: `M${String(members.length + 1).padStart(3, "0")}` });
    setEditingId(null);
    setModalOpen(true);
  }

  function openEditModal(member) {
    setForm({
      id: member.id || "",
      name: member.name || "",
      email: member.email || "",
      phone: member.phone || "",
      status: member.status || "Active",
      joinDate: member.joinDate || "",
      borrowingCount: member.borrowingCount || 0,
    });
    setEditingId(member._id);
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await updateDocument("members", editingId, form);
      } else {
        await addDocument("members", form);
      }
      setModalOpen(false);
    } catch (err) {
      alert("บันทึกไม่สำเร็จ: " + (err.message || "unknown error"));
    } finally {
      setSaving(false);
    }
  }

  async function handleSuspend(member) {
    const nextStatus = member.status === "Active" ? "Suspended" : "Active";
    try {
      await updateDocument("members", member._id, { status: nextStatus });
    } catch (err) {
      alert("อัปเดตสถานะไม่สำเร็จ: " + (err.message || "unknown error"));
    }
  }

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>จัดการสมาชิก</h1>
          <p>ข้อมูลสมาชิกทั้งหมด (เชื่อมต่อ Firestore — บันทึกจริง)</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openAddModal}>
          + เพิ่มสมาชิก
        </button>
      </div>

      <div className="admin-toolbar">
        <div className="admin-toolbar-search">
          <img src={iconSearch} alt="" />
          <input
            type="text"
            placeholder="ค้นหาชื่อสมาชิก..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
      </div>

      {loading && <p className="empty-state">กำลังโหลดข้อมูล...</p>}
      {error && <p className="empty-state">โหลดข้อมูลไม่สำเร็จ: {error}</p>}

      {!loading && !error && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>รหัสสมาชิก</th>
                <th>ชื่อ</th>
                <th>Email</th>
                <th>เบอร์โทรศัพท์</th>
                <th>วันที่สมัคร</th>
                <th>สถานะ</th>
                <th>หนังสือที่เช่าอยู่</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member._id}>
                  <td>{member.id}</td>
                  <td>{member.name}</td>
                  <td>{member.email}</td>
                  <td>{member.phone}</td>
                  <td>{member.joinDate}</td>
                  <td>
                    <span className={member.status === "Active" ? "badge badge-success" : "badge badge-danger"}>
                      {member.status}
                    </span>
                  </td>
                  <td>{member.borrowingCount}</td>
                  <td>
                    <div className="admin-row-actions">
                      <button type="button" className="btn btn-outline btn-sm" onClick={() => openEditModal(member)}>
                        แก้ไข
                      </button>
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => handleSuspend(member)}>
                        {member.status === "Active" ? "ระงับ" : "เปิดใช้งาน"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && filteredMembers.length === 0 && (
        <p className="empty-state">ไม่พบสมาชิกที่ตรงกับเงื่อนไข</p>
      )}

      {modalOpen && (
        <div className="admin-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? "แก้ไขสมาชิก" : "เพิ่มสมาชิกใหม่"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>รหัสสมาชิก</label>
                <input
                  type="text"
                  required
                  value={form.id}
                  disabled={!!editingId}
                  onChange={(e) => setForm({ ...form, id: e.target.value })}
                />
              </div>
              <div className="field">
                <label>ชื่อ-นามสกุล</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="admin-modal-row">
                <div className="field">
                  <label>เบอร์โทรศัพท์</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label>วันที่สมัคร</label>
                  <input
                    type="date"
                    value={form.joinDate}
                    onChange={(e) => setForm({ ...form, joinDate: e.target.value })}
                  />
                </div>
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

export default MemberManagement;
