import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { realtimeDb } from "../firebase.js";

// หมวดหมู่อ่านจาก Firebase Realtime Database ไม่ได้ใช้ข้อมูล mock
export function useRealtimeCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    return onValue(ref(realtimeDb, "categories"), (snapshot) => {
      const value = snapshot.val() || {};
      setCategories(Object.entries(value).map(([id, item]) => ({ id, ...item })).filter(item => item.isActive !== false));
      setError(null);
      setLoading(false);
    }, (err) => { setError(err.message); setLoading(false); });
  }, []);
  return { categories, loading, error };
}
