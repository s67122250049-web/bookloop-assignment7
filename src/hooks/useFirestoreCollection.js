import { useEffect, useState } from "react";
import { subscribeToCollection } from "../services/firestoreService.js";

export function useFirestoreCollection(collectionName) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToCollection(
      collectionName,
      (items) => {
        setData(items);
        setLoading(false);
      },
      (err) => {
        setError(err.message || "โหลดข้อมูลไม่สำเร็จ");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [collectionName]);

  return { data, loading, error };
}
