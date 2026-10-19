# BOOKLOOP — คู่มือตรวจความปลอดภัยก่อนเผยแพร่ (Assignment 7)

## สำคัญ: ยังไม่ใช่ระบบการเช่า-คืนที่ป้องกันการแก้สต็อกโดยผู้ใช้ทั้งหมด

แก้การเช่า-คืนให้ใช้ Firestore Transaction ทำให้สองเอกสารถูกบันทึกสำเร็จหรือยกเลิกพร้อมกัน และเพิ่ม Rules แบบจำกัดสิทธิ์ตาม UID / role แต่ Firestore client SDK ยังต้องได้รับสิทธิ์ลด quantityAvailable ของหนังสือ ทำให้ผู้ใช้ที่ล็อกอินสามารถส่งคำขอลดสต็อกโดยไม่สร้างรายการเช่าได้ หากเขียนคำขอเอง ไม่ควรใช้กับบริการเช่าที่มีการชำระเงินจริง การบังคับความสัมพันธ์เช่ากับสต็อกอย่างสมบูรณ์ควรย้ายการทำรายการไป Cloud Functions + Firebase Admin SDK หรือออกแบบ schema และ getAfter rules ให้ตรวจคู่เอกสารด้วยรหัสรายการที่ผูกกัน

## ก่อน Publish Rules
1. สำรองข้อมูล Firestore โดยเฉพาะ books, members, rentals ไว้ก่อน และไม่เปิดเผยอีเมลสมาชิกใน public repo
2. ยืนยันว่าเอกสาร `members/{firebase-auth-uid}` ของบัญชี Admin เดิมมี `role: "admin"` จริง มิฉะนั้น Admin จะถูกปฏิเสธ
3. เปิด Firebase Console → Firestore Database → Rules แล้วนำเนื้อหา `firestore.rules` ไปวางและกด Publish (ทำเฉพาะหลังสำรองข้อมูล)
4. Realtime Database มี Rules ของตัวเอง แยกจาก Firestore Rules ต้องกำหนดอ่าน categories เท่านั้น (ถ้าข้อมูลไม่ได้ต้องการเขียนจากหน้าเว็บ) เช่น `{"rules":{"categories":{".read":true,".write":false}}}` และตรวจ nodes อื่นแยกต่างหาก

## ข้อควรระวังข้อมูลเดิม
- สมาชิกจากชุดข้อมูล seed (เช่น M001) อาจไม่ใช้ Firebase Auth UID จึงไม่สามารถใช้เป็นบัญชีสมาชิกที่ล็อกอินได้ ต้องสร้างบัญชีผ่านหน้าสมัครสมาชิกเพื่อให้ members doc ID เท่ากับ UID
- Rentals เก่าจาก seed ที่ใช้ memberId เช่น M001 จะยังมองเห็นจาก Admin แต่ไม่ขึ้นในหน้าสมาชิกใหม่ซึ่ง query ตาม UID
- หนังสือรหัส B001–B006 ที่ลบแล้ว อาจยังมีรายการเช่าเก่าอ้างอิงอยู่; ระบบคืนจะเตือนว่าไม่พบหนังสือและไม่บันทึกสถานะคืนซ้ำ กรุณาปรับข้อมูลด้วยการสำรองและตรวจด้วย Admin ก่อน
- ปุ่ม seed ข้อมูลตัวอย่างถูกนำออกจาก Dashboard เพราะอาจเขียนทับข้อมูลจริงและย้อนสิทธิ์ Role
- ฟอร์มเพิ่มสมาชิกด้วย Admin ถูกปิดไว้: ต้องสมัครผ่าน Firebase Authentication ก่อน จึงจะได้ UID เดียวกับเอกสารสมาชิก

## ทดสอบหลัง Publish
1. Guest อ่านรายการ books ได้ แต่เข้าหน้า Admin ไม่ได้
2. สมาชิกใหม่สมัครได้; เอกสาร members/{uid} role member
3. สมาชิกดูได้เฉพาะรายการเช่าของตนเอง และไม่สามารถเปลี่ยน role เป็น admin
4. สมาชิกเช่าหนังสือ 1 ครั้ง: เพิ่ม rental 1 รายการ ลด stock 1; รีเฟรชแล้วยังอยู่
5. Admin คืน 1 ครั้ง: status Returned เพิ่ม stock 1; กดซ้ำต้องไม่เพิ่มสต็อกอีก
6. Admin เพิ่มและแก้ไขหนังสือได้ (รหัสเอกสารอัตโนมัติ)
7. ตรวจ Firebase Rules Playground/Emulator เพิ่มเติมสำหรับกรณีปฏิเสธการข้ามสิทธิ์
8. ตั้ง Firestore indexes ตาม error console หาก Firebase ร้องขอ

## GitHub และ Deploy
- อย่าอัปโหลด service account JSON, private keys, .env จริง, export ข้อมูลสมาชิกจริง
- หลังแตก ZIP เวอร์ชันแก้ไข ให้นำไฟล์ในโฟลเดอร์ bookloop ไปแทนไฟล์โครงการเดิม (สำรองก่อน) แล้วรัน `npm.cmd install`, `npm.cmd run build`, `npm.cmd run dev`
- หากต้องการบันทึกการแก้ไขใน Git: `git add .`, `git commit -m "Harden BOOKLOOP permissions and rental transactions"`, `git push origin main`
- ไฟล์ `firestore.rules` เป็นข้อเสนอสำหรับ Review ยังไม่ถูก Publish ให้อัตโนมัติ
