import {
    collection,
    onSnapshot,
    addDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    runTransaction,
} from "firebase/firestore";
import { db } from "../firebase.js";

/*
  ฟังก์ชันกลางสำหรับคุยกับ Firestore
  ใช้ onSnapshot เพื่อให้ข้อมูลอัปเดตแบบเรียลไทม์ทุกหน้าที่เปิดดูอยู่
  document id ของ Firestore จะถูกแนบกลับมาเป็นฟิลด์ _id เสมอ
*/

export function subscribeToCollection(collectionName, onChange, onError) {
    return onSnapshot(
        collection(db, collectionName),
        (snapshot) => {
            const items = snapshot.docs.map((docSnap) => ({
                ...docSnap.data(),
                _id: docSnap.id,
            }));
            onChange(items);
        },
        (error) => {
            if (onError) onError(error);
        }
    );
}

export function addDocument(collectionName, data) {
    return addDoc(collection(db, collectionName), data);
}

// ใช้เมื่อต้องการกำหนด document id เอง เช่นตอน seed ข้อมูลตัวอย่าง (B001, M001, R001)
export function setDocument(collectionName, id, data) {
    return setDoc(doc(db, collectionName, id), data);
}

export function updateDocument(collectionName, id, data) {
    return updateDoc(doc(db, collectionName, id), data);
}

export function deleteDocument(collectionName, id) {
    return deleteDoc(doc(db, collectionName, id));
}

// อ่านเฉพาะรายการเช่าของเจ้าของบัญชี (Firestore Rules จะบังคับซ้ำ)
export function subscribeToMyRentals(uid, onChange, onError) {
    if (!uid) { onChange([]); return () => {}; }
    return onSnapshot(query(collection(db, "rentals"), where("memberId", "==", uid)),
        (snapshot) => onChange(snapshot.docs.map(d => ({...d.data(), _id: d.id }))), onError);
}

// ใช้ Transaction เพื่อให้สร้างรายการเช่าและลดจำนวนหนังสือเป็นชุดเดียว
export async function rentBook(bookId, uid, rentalDays = 14) {
    if (!uid) throw new Error("กรุณาเข้าสู่ระบบ");
    const bookRef = doc(db, "books", bookId);
    const rentalRef = doc(collection(db, "rentals"));
    const today = new Date();
    const due = new Date(today);
    due.setDate(due.getDate() + Number(rentalDays || 14));
    await runTransaction(db, async(transaction) => {
        const snap = await transaction.get(bookRef);
        if (!snap.exists()) throw new Error("ไม่พบหนังสือ");
        const available = snap.data().quantityAvailable;
        if (!Number.isInteger(available) || available < 1) throw new Error("หนังสือหมดแล้ว");
        transaction.update(bookRef, { quantityAvailable: available - 1, lastRentalId: rentalRef.id });
        transaction.set(rentalRef, {
            memberId: uid,
            bookId,
            rentalDate: today.toISOString().slice(0, 10),
            dueDate: due.toISOString().slice(0, 10),
            returnDate: null,
            status: "Rented",
            fine: 0,
        });
    });
}

// คืนหนังสือครั้งเดียวเท่านั้น ป้องกันการเพิ่มสต็อกซ้ำ
export async function returnBook(rentalId) {
    const rentalRef = doc(db, "rentals", rentalId);
    await runTransaction(db, async(transaction) => {
        const rentalSnap = await transaction.get(rentalRef);
        if (!rentalSnap.exists()) throw new Error("ไม่พบรายการเช่า");
        const rental = rentalSnap.data();
        if (rental.status === "Returned") throw new Error("รายการนี้คืนแล้ว");
        const bookRef = doc(db, "books", rental.bookId);
        const bookSnap = await transaction.get(bookRef);
        if (!bookSnap.exists()) throw new Error("ไม่พบหนังสือที่เชื่อมกับรายการเช่า (อาจถูกลบไปแล้ว)");
        const book = bookSnap.data();
        const available = Number(book.quantityAvailable);
        const total = Number(book.quantityTotal);
        if (!Number.isInteger(available) || !Number.isInteger(total) || available >= total)
            throw new Error("จำนวนหนังสือไม่ถูกต้อง กรุณาตรวจสอบสต็อก");
        const today = new Date().toISOString().slice(0, 10);
        const daysLate = Math.max(0, Math.floor((new Date(today) - new Date(rental.dueDate)) / 86400000));
        transaction.update(rentalRef, { status: "Returned", returnDate: today, fine: daysLate * Number(book.lateFeePerDay || 10) });
        transaction.update(bookRef, { quantityAvailable: available + 1 });
    });
}
// สมาชิกส่งคำขอคืนหนังสือ
// ยังไม่เพิ่มจำนวนหนังสือกลับเข้าคลัง
export async function requestReturn(rentalId) {
    if (!rentalId) {
        throw new Error("ไม่พบรายการเช่า");
    }

    await updateDoc(doc(db, "rentals", rentalId), {
        status: "PendingReturn",
    });
}