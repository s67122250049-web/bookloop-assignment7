import {
  collection,
  onSnapshot,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
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
