
import { useState } from "react";
import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import "../../firebase.js";

const questions = [
  { key: "ease", title: "1. เว็บไซต์ BOOKLOOP ใช้งานง่ายหรือไม่" },
  { key: "search", title: "2. การค้นหาหนังสือสะดวกหรือไม่" },
  { key: "rental", title: "3. ขั้นตอนการเช่าและคืนหนังสือเข้าใจง่ายหรือไม่" },
  { key: "satisfaction", title: "4. ความพึงพอใจโดยรวมต่อเว็บไซต์ BOOKLOOP" },
];

export default function FeedbackPage() {
  const [scores, setScores] = useState({});
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = getAuth(getApp()).currentUser;

    if (!user) {
      alert("กรุณาเข้าสู่ระบบก่อน");
      return;
    }

    if (questions.some((q) => !scores[q.key])) {
      alert("กรุณาประเมินให้ครบทุกข้อ");
      return;
    }

    setLoading(true);

    try {
      const db = getFirestore(getApp());

      await setDoc(doc(db, "feedback", user.uid), {
        memberId: user.uid,
        ease: Number(scores.ease),
        search: Number(scores.search),
        rental: Number(scores.rental),
        satisfaction: Number(scores.satisfaction),
        comment: comment.trim().slice(0, 500),
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      alert("ส่งแบบประเมินสำเร็จ");
    } catch (error) {
      console.error(error);
      alert("ส่งแบบประเมินไม่สำเร็จ: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 24 }}>
      <h1>แบบประเมินระบบ BOOKLOOP</h1>
      <p>กรุณาให้คะแนน 1–5 (1 = น้อยที่สุด, 5 = มากที่สุด)</p>

      {success ? (
        <div className="card" style={{ padding: 24 }}>
          <h2>ขอบคุณสำหรับการประเมิน</h2>
          <p>ระบบได้รับข้อมูลของคุณเรียบร้อยแล้ว</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {questions.map((q) => (
            <div
              key={q.key}
              style={{
                padding: 20,
                marginBottom: 15,
                border: "1px solid #ddd",
                borderRadius: 10,
              }}
            >
              <p><strong>{q.title}</strong></p>
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <label key={n}>
                    <input
                      type="radio"
                      name={q.key}
                      value={n}
                      checked={scores[q.key] === n}
                      onChange={() =>
                        setScores((old) => ({ ...old, [q.key]: n }))
                      }
                    /> {n}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <label htmlFor="feedback-comment">ข้อเสนอแนะเพิ่มเติม</label>
          <textarea
            id="feedback-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            maxLength={500}
            style={{ width: "100%", padding: 12, marginTop: 10 }}
            placeholder="แสดงความคิดเห็นเพิ่มเติม..."
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 20,
              padding: "12px 25px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            {loading ? "กำลังส่ง..." : "ส่งแบบประเมิน"}
          </button>
        </form>
      )}
    </div>
  );
}
