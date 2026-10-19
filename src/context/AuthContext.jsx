import { createContext, useContext, useEffect, useState } from "react";
import { subscribeToAuthChanges } from "../services/authService.js";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase.js";

/*
  ===========================================================
  AuthContext.jsx — สถานะการล็อกอินของทั้งแอป
  ===========================================================
  ให้ AuthProvider ครอบทั้งแอปไว้ที่ main.jsx (ทำไปแล้ว)
  หน้าไหนอยากรู้ว่าตอนนี้ใครล็อกอินอยู่ ให้เรียก useAuth() แทนการยุ่งกับ
  Firebase Auth SDK โดยตรง

  ค่าที่ได้จาก useAuth():
  - user        → Firebase Auth user object ดิบ (null ถ้ายังไม่ล็อกอิน)
  - profile     → ข้อมูลสมาชิกจาก Firestore (collection "members") รวมฟิลด์ role
  - isLoggedIn  → true/false
  - isAdmin     → true ถ้า profile.role === "admin"
  - loading     → true ระหว่างรอตรวจสอบสถานะล็อกอินตอนโหลดเว็บครั้งแรก
  - logout()    → ฟังก์ชันออกจากระบบ (re-export จาก authService)
*/

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // ฟังการเปลี่ยนแปลงสถานะล็อกอินจาก Firebase Auth
  useEffect(() => {
    const unsubscribeAuth = subscribeToAuthChanges((firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setProfile(null);
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // เมื่อมีผู้ใช้ล็อกอินแล้ว ให้ดึงข้อมูลสมาชิก (รวม role) จาก Firestore มาผูกไว้ด้วย
  useEffect(() => {
    if (!user) return undefined;

    setLoading(true);
    const unsubscribeProfile = onSnapshot(doc(db, "members", user.uid), (snapshot) => {
      setProfile(snapshot.exists() ? { ...snapshot.data(), _id: snapshot.id } : null);
      setLoading(false);
    }, () => { setProfile(null); setLoading(false); });
    return () => unsubscribeProfile();
  }, [user]);

  const value = {
    user,
    profile,
    isLoggedIn: Boolean(user),
    isAdmin: profile?.role === "admin",
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth ต้องถูกเรียกใช้ภายใน <AuthProvider> เท่านั้น");
  }
  return context;
}
