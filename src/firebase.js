import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

/*
  Firebase config ของโปรเจกต์ OnlineBookRenTal
  ค่าเหล่านี้ไม่ใช่ความลับ (เป็น client identifier ตามปกติของ Firebase)
  ความปลอดภัยที่แท้จริงมาจาก Firestore Security Rules ที่ตั้งไว้ใน Firebase Console
  ตอนนี้ฐานข้อมูลเปิดแบบ "test mode" (อ่าน/เขียนได้ทุกคนชั่วคราว) ต้องกลับไปตั้ง
  Rules ให้รัดกุมก่อน deploy ใช้งานจริง
*/
const firebaseConfig = {
  apiKey: "AIzaSyBRwQm6RgqnQxZGngRrSWTwnMGvMR0Sjlo",
  authDomain: "onlinebookrental-b260f.firebaseapp.com",
  projectId: "onlinebookrental-b260f",
  databaseURL: "https://onlinebookrental-b260f-default-rtdb.firebaseio.com",
  storageBucket: "onlinebookrental-b260f.firebasestorage.app",
  messagingSenderId: "863505938736",
  appId: "1:863505938736:web:25ac853a8a9fb5e5fdf0f5",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const realtimeDb = getDatabase(app);
