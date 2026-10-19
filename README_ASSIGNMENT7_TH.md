# BOOKLOOP — Assignment 7

## สิ่งที่ตรวจและปรับปรุง
- ใช้ React + Vite พร้อม Firebase Authentication และ Cloud Firestore สำหรับข้อมูลหนังสือ สมาชิก รายการเช่า/คืน (เดิม)
- เพิ่ม Firebase Realtime Database สำหรับอ่าน `categories` จากโปรเจกต์ OnlineBookRenTal และแสดงหมวดหมู่บนหน้า `/books`
- เพิ่ม Protected Routes สำหรับ `/member/*` และ `/admin/*` (การซ่อนหน้าไม่ใช่การป้องกันข้อมูล ต้องตั้ง Rules ที่ Firebase ด้วย)
- เพิ่มหน้ากรณีไม่พบ Route และ .gitignore

## วิธีรันใน VS Code (PowerShell)
1. แตก ZIP แล้วเปิดโฟลเดอร์ `bookloop` ที่มี `package.json`
2. `npm.cmd install`
3. `npm.cmd run dev`
4. เปิด http://localhost:5173
5. สำหรับ build: `npm.cmd run build` และทดสอบด้วย `npm.cmd run preview`

## ต้องดำเนินการด้วยตนเองก่อนส่ง
1. Firebase Console > Authentication > Sign-in method เปิด Email/Password
2. Firebase Console > Realtime Database > Data ตรวจ `categories`; > Rules ตั้งสิทธิ์ให้เหมาะสม ตัวอย่างใน `database.rules.json` ให้อ่านหมวดหมู่สาธารณะและปิดการเขียนจาก client อย่าวางทับ Rules ของข้อมูลอื่นโดยไม่ตรวจสอบ
3. Firebase Console > Firestore > Rules: ห้ามปล่อย test mode ก่อน Deploy; กำหนดให้สมาชิกเห็นข้อมูลตนเองเท่านั้น และ Admin มีสิทธิ์จัดการข้อมูล โดยต้องตรวจสอบกฎให้ตรงกับทุกคำสั่ง CRUD ของระบบ
4. ฟังก์ชันเช่า/คืนในโค้ดเดิมใช้การเขียน 2 ขั้น (เพิ่มรายการเช่า + ลดสต็อก) ซึ่งยังไม่เป็น atomic transaction และต้องออกแบบใหม่ให้ปลอดภัยต่อการเช่าพร้อมกันก่อนใช้งานจริง
5. ตรวจรูปหนังสือที่โหลดไม่ขึ้น และทดสอบข้อมูลที่ Firebase มีอยู่จริง
6. ตรวจสอบช่องโหว่ dependency ด้วย `npm.cmd audit` และวางแผนอัปเดตเวอร์ชันโดยทดสอบผล ไม่ใช้ `--force` ทันที
7. สร้าง GitHub Repository และ Commit เป็นช่วง ๆ โดยไม่อัปโหลด .env หรือข้อมูลลับ
8. Deploy ผ่าน Hosting ที่รองรับ SPA fallback แล้วทดสอบลิงก์ตรงทุก Route
9. ส่งออก **JSON จริง** จาก Firebase Console > Realtime Database > Data > Export JSON (ไฟล์ `firebase-categories-SAMPLE.json` เป็นตัวอย่างประกอบเท่านั้น **ไม่ใช่ข้อมูลส่งออกจริง**)
10. เตรียมรายงาน PDF, สไลด์, วิดีโอเดโม, URL เว็บไซต์ และลิงก์ GitHub ตาม Assignment 7

## ข้อควรทราบ
- โค้ดส่วนใหญ่ยังใช้ Cloud Firestore ไม่ได้ย้ายข้อมูลทั้งหมดมา Realtime Database หากผู้สอนต้องการ Realtime Database สำหรับ **ข้อมูลทั้งหมด** ต้องตกลงขอบเขตแล้วปรับ service และ rules เพิ่มเติม
- ไม่สามารถรับประกันการทำงานกับ Firebase จริงจากการตรวจโค้ดเพียงอย่างเดียว ต้องทดสอบกับบัญชีและ Rules ของโปรเจกต์ของคุณ
- Firebase API key ในเว็บเป็น client identifier แต่ข้อมูลสิทธิ์ / กฎความปลอดภัยยังสำคัญ
