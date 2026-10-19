# BOOKLOOP

ระบบเช่า-คืนหนังสือออนไลน์พร้อมจัดการสมาชิกสำหรับร้านหนังสือ
React + Vite + React Router + Firebase (Firestore + Authentication)

> อ่านโครงสร้างโปรเจกต์แบบละเอียด (ไฟล์ไหนทำหน้าที่อะไร) ได้ที่ [`PROJECT_STRUCTURE.md`](./PROJECT_STRUCTURE.md)

## วิธีรัน

```bash
npm install
npm run dev
```

เปิดลิงก์ที่ Vite แสดงในเทอร์มินัล (ปกติคือ http://localhost:5173)

## ตั้งค่า Firebase ก่อนใช้งานครั้งแรก

โปรเจกต์นี้ต่อกับ Firebase project **OnlineBookRenTal** ไว้แล้วใน `src/firebase.js`
สิ่งที่ต้องเปิดใช้งานในฝั่ง Firebase Console (ทำครั้งเดียว):

1. **Firestore Database** — เปิดแบบ Test mode (Build → Firestore Database → Create database)
2. **Authentication** — Build → Authentication → Sign-in method → เปิดใช้ **Email/Password**
3. เข้าเว็บ → ไปหน้า `/admin/dashboard` → กดปุ่ม **"นำเข้าข้อมูลตัวอย่าง"** เพื่อสร้างข้อมูลตั้งต้นใน Firestore

## สถานะปัจจุบัน

- ✅ Front Office: หน้าแรก / รายการหนังสือ / รายละเอียด+เช่าจริง / Login-Register จริง / บัญชีสมาชิก
- ✅ Back Office: Dashboard / จัดการหนังสือ-สมาชิก-รายการเช่า-รายการคืน (CRUD จริงผ่าน Firestore)
- ✅ Firebase Authentication (Email/Password) พร้อม AuthContext
- ⏳ ยังไม่มี Protected Routes (ทุกคนเข้าหน้า Admin ได้แม้ไม่ได้ล็อกอิน — เฟสถัดไป)
- ⏳ Firestore Security Rules ยังเป็น test mode ต้องตั้งใหม่ก่อน deploy จริง

## ไฟล์ขั้นที่ 2 (เวอร์ชัน Static ไม่มี Router/useState)

เก็บสำรองไว้ที่ `src/_archive_step2/` เผื่อยังต้องใช้อ้างอิงหรือส่งงานย้อนหลัง
