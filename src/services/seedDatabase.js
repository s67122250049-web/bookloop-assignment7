import { books, members, rentals } from "../data/mockData.js";
import { setDocument } from "./firestoreService.js";

/*
  นำข้อมูลตัวอย่าง (ที่เคยใช้ตอนเป็น Mock Data) เข้า Firestore ครั้งแรก
  ใช้ id เดิม (B001, M001, R001 ...) เป็น document id เพื่อให้ตรงกับเอกสารโครงงาน
  กดได้จากปุ่ม "นำเข้าข้อมูลตัวอย่าง" ในหน้า Admin Dashboard — กดซ้ำได้ ข้อมูลจะถูกเขียนทับด้วยชุดเดิมเสมอ ไม่ซ้ำซ้อน
*/
export async function seedDatabase() {
  await Promise.all(books.map((book) => setDocument("books", book.id, book)));
  await Promise.all(members.map((member) => setDocument("members", member.id, member)));
  await Promise.all(rentals.map((rental) => setDocument("rentals", rental.id, rental)));
}
