import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase.js";
import { setDocument } from "./firestoreService.js";

/*
  ===========================================================
  authService.js — Service Layer สำหรับ Firebase Authentication
  ===========================================================
  ไฟล์นี้เป็นจุดเดียวในโปรเจกต์ที่คุยกับ Firebase Auth โดยตรง
  หน้าอื่น ๆ (Login.jsx, Register.jsx, AuthContext.jsx) เรียกใช้ฟังก์ชันจากที่นี่
  เท่านั้น ไม่เรียก Firebase Auth SDK ตรง ๆ — ถ้าจะเปลี่ยนวิธียืนยันตัวตนในอนาคต
  (เช่น เพิ่ม Google Login) แก้ที่ไฟล์นี้ไฟล์เดียวพอ
*/

// สมัครสมาชิกใหม่ด้วย Email/Password
// พร้อมสร้างเอกสารข้อมูลสมาชิกใน Firestore (collection "members") โดยใช้ uid เป็น document id
// role เริ่มต้นเป็น "member" เสมอ — บัญชี Admin ต้องไปตั้งค่า role เป็น "admin" เองใน Firestore Console
export async function registerWithEmail({ name, email, password }) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const user = credential.user;

  await updateProfile(user, { displayName: name });

  await setDocument("members", user.uid, {
    id: user.uid,
    name,
    email,
    phone: "",
    status: "Active",
    joinDate: new Date().toISOString().slice(0, 10),
    borrowingCount: 0,
    role: "member",
  });

  return user;
}

export function loginWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logout() {
  return signOut(auth);
}

// สมัครฟังการเปลี่ยนแปลงสถานะล็อกอิน (ใช้ใน AuthContext.jsx เท่านั้น)
export function subscribeToAuthChanges(callback) {
  return onAuthStateChanged(auth, callback);
}

// แปลง error code จาก Firebase Auth เป็นข้อความภาษาไทยที่อ่านเข้าใจง่าย
export function translateAuthError(code) {
  const messages = {
    "auth/invalid-email": "รูปแบบอีเมลไม่ถูกต้อง",
    "auth/user-not-found": "ไม่พบบัญชีผู้ใช้นี้ในระบบ",
    "auth/wrong-password": "รหัสผ่านไม่ถูกต้อง",
    "auth/invalid-credential": "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
    "auth/email-already-in-use": "อีเมลนี้ถูกใช้สมัครสมาชิกไปแล้ว",
    "auth/weak-password": "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร",
    "auth/too-many-requests": "พยายามเข้าสู่ระบบผิดหลายครั้งเกินไป กรุณาลองใหม่ภายหลัง",
  };
  return messages[code] || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";
}
