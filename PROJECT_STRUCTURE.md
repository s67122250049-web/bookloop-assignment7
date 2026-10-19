# โครงสร้างโปรเจกต์ BOOKLOOP

เอกสารนี้อธิบายว่าแต่ละโฟลเดอร์/ไฟล์ทำหน้าที่อะไร สำหรับใครก็ตามที่มาเปิดโค้ดนี้ต่อ
(ตัวคุณเองในอนาคต หรือเพื่อนร่วมกลุ่ม) จะได้หาจุดที่ต้องแก้เจอเร็ว ไม่ต้องไล่อ่านทั้งโปรเจกต์

```
src/
├── main.jsx                 ทางเข้าแอป — ครอบด้วย AuthProvider + BrowserRouter
├── App.jsx                  รายการ Route ทั้งหมด (หน้าไหนอยู่ path ไหน)
├── firebase.js               ตั้งค่าเชื่อมต่อ Firebase (config, db, auth)
│
├── services/                 ← คุยกับ Firebase โดยตรง "เฉพาะที่นี่เท่านั้น"
│   ├── firestoreService.js   ฟังก์ชันกลาง: อ่าน/เพิ่ม/แก้ไข/ลบข้อมูลใน Firestore
│   ├── authService.js        ฟังก์ชันกลาง: สมัครสมาชิก/ล็อกอิน/ล็อกเอาต์
│   └── seedDatabase.js       ปุ่ม "นำเข้าข้อมูลตัวอย่าง" ในหน้า Admin เรียกใช้ไฟล์นี้
│
├── context/
│   └── AuthContext.jsx       เก็บสถานะ "ใครล็อกอินอยู่" ให้ทั้งแอปเรียกใช้ผ่าน useAuth()
│
├── hooks/
│   └── useFirestoreCollection.js   ดึงข้อมูลจาก Firestore collection ไหนก็ได้แบบเรียลไทม์
│
├── data/
│   └── mockData.js           ข้อมูลตัวอย่างตั้งต้น (หนังสือ/สมาชิก/รายการเช่า) ใช้ตอน seed เท่านั้น
│                              — หลัง seed แล้ว หน้าเว็บทุกหน้าจะดึงจาก Firestore ไม่ใช่ไฟล์นี้
│
├── layouts/                  โครงหน้าที่ใช้ซ้ำ
│   ├── FrontLayout.jsx        Navbar + เนื้อหา + Footer (ใช้กับทุกหน้าฝั่งสมาชิก)
│   └── AdminLayout.jsx        Sidebar + Topbar + เนื้อหา (ใช้กับทุกหน้าฝั่ง Admin)
│
├── components/                ชิ้นส่วน UI ที่ใช้ซ้ำหลายหน้า
│   ├── front/                 Navbar, Footer, BookCard
│   └── admin/                 Sidebar, Topbar
│
├── pages/                      แต่ละไฟล์ = 1 หน้าเว็บ 1 path
│   ├── front/                  ฝั่งสมาชิก/ผู้ใช้ทั่วไป
│   │   ├── Home.jsx             หน้าแรก
│   │   ├── BookCatalog.jsx      /books — รายการหนังสือทั้งหมด
│   │   ├── BookDetail.jsx       /books/:id — รายละเอียด + ปุ่มเช่าจริง
│   │   ├── Login.jsx            /login
│   │   ├── Register.jsx         /register
│   │   ├── MemberDashboard.jsx  /member/dashboard
│   │   ├── MyRentals.jsx        /member/rentals
│   │   └── RentalHistory.jsx    /member/history
│   │
│   └── admin/                  ฝั่งผู้ดูแลระบบ
│       ├── AdminDashboard.jsx   /admin/dashboard
│       ├── BookManagement.jsx   /admin/books
│       ├── MemberManagement.jsx /admin/members
│       ├── RentalManagement.jsx /admin/rentals
│       └── ReturnManagement.jsx /admin/returns
│
└── styles/
    ├── base.css               สี ฟอนต์ ปุ่ม badge ฯลฯ ที่ใช้ร่วมกันทั้งเว็บ (แก้สีหลักที่นี่)
    ├── front.css               สไตล์เฉพาะฝั่งสมาชิก
    └── admin.css               สไตล์เฉพาะฝั่ง Admin
```

## กฎการจัดโครงสร้าง (อยากให้ทุกคนที่แก้โค้ดต่อยึดตามนี้)

1. **ห้ามหน้า/component เรียก Firebase ตรง ๆ** — ต้องผ่าน `services/` เท่านั้น
   ถ้าจะเพิ่มฟังก์ชันใหม่ (เช่น ลืมรหัสผ่าน, อัปโหลดรูป) ให้เพิ่มฟังก์ชันใน `authService.js`
   หรือ `firestoreService.js` แล้วค่อยเรียกใช้จากหน้า ไม่ใช่เขียน `import { ... } from "firebase/..."`
   ในไฟล์หน้าเว็บโดยตรง
2. **1 หน้าเว็บ = 1 ไฟล์ใน `pages/`** ถ้าจะเพิ่มหน้าใหม่ สร้างไฟล์ใหม่ใน `pages/front/` หรือ
   `pages/admin/` แล้วไปเพิ่ม `<Route>` ใน `App.jsx`
3. **สีและฟอนต์หลักแก้ที่ `styles/base.css` ที่เดียว** (ตัวแปร CSS ด้านบนของไฟล์ เช่น `--brown`, `--gold`)
   ไม่ต้องไปไล่แก้ทีละไฟล์
4. **อยากรู้ว่าใครล็อกอินอยู่ตอนนี้** เรียก `useAuth()` จาก `context/AuthContext.jsx`
   ได้ `user`, `profile`, `isLoggedIn`, `isAdmin` กลับมาใช้ได้เลย

## สถานะปัจจุบัน (จุดที่ทำเสร็จแล้ว)

- ✅ เชื่อม Firestore แสดงข้อมูลจริง + CRUD หนังสือ/สมาชิก/รายการเช่า-คืน
- ✅ Firebase Authentication (Email/Password) พร้อม AuthContext
- ✅ หน้า Login / Register ใช้งานได้จริง

## จุดที่ยังไม่ทำ (เฟสถัดไป)

- ⏳ **Protected Routes** — ตอนนี้ทุกคนเข้าหน้า `/admin/*` หรือ `/member/*` ได้แม้ไม่ได้ล็อกอิน
  ต้องเพิ่มตัวเช็คสิทธิ์ก่อนเข้าหน้า (กำลังจะทำต่อ)
- ⏳ ผูกหน้า Member Dashboard / My Rentals ให้ใช้ข้อมูลจากบัญชีที่ล็อกอินจริง
  (ตอนนี้ยังอ้างอิงสมาชิกตัวอย่างคนแรกจาก `mockData.js` อยู่)
- ⏳ ต้องกลับไปตั้ง Firestore Security Rules ให้รัดกุมก่อน deploy จริง (ตอนนี้เป็น test mode)
