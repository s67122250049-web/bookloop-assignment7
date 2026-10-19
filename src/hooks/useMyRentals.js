import { useEffect, useState } from "react";
import { subscribeToMyRentals } from "../services/firestoreService.js";
import { useAuth } from "../context/AuthContext.jsx";

export function useMyRentals() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    setData([]);
    if (!user?.uid) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    return subscribeToMyRentals(user.uid, items => { setData(items); setLoading(false); }, err => {
      setError(err.message); setLoading(false);
    });
  }, [user?.uid]);
  return {data, loading, error};
}
