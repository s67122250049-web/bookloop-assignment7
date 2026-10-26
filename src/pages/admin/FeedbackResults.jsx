
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase.js";

const questions = [
  { key: "ease", label: "ความง่ายในการใช้งาน" },
  { key: "search", label: "ความสะดวกในการค้นหาหนังสือ" },
  { key: "rental", label: "ความง่ายในการเช่าและคืนหนังสือ" },
  { key: "satisfaction", label: "ความพึงพอใจโดยรวม" },
];

export default function FeedbackResults() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFeedback() {
      try {
        const snapshot = await getDocs(collection(db, "feedback"));
        setFeedbacks(snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })));
      } catch (err) {
        console.error(err);
        setError("ไม่สามารถโหลดผลประเมินได้: " + err.message);
      } finally {
        setLoading(false);
      }
    }

    loadFeedback();
  }, []);

  const average = (key) => {
    if (feedbacks.length === 0) return "0.00";

    const total = feedbacks.reduce(
      (sum, item) => sum + Number(item[key] || 0),
      0
    );

    return (total / feedbacks.length).toFixed(2);
  };

  const overallAverage = () => {
    if (feedbacks.length === 0) return "0.00";

    const total = feedbacks.reduce(
      (sum, item) =>
        sum + questions.reduce(
          (score, q) => score + Number(item[q.key] || 0),
          0
        ),
      0
    );

    return (total / (feedbacks.length * questions.length)).toFixed(2);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>ผลการประเมินระบบ BOOKLOOP</h1>
      <p>สรุปคะแนนจากสมาชิกที่ส่งแบบประเมิน</p>

      {loading && <p>กำลังโหลดข้อมูล...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <>
          <div style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 25
          }}>
            <div style={cardStyle}>
              <h3>จำนวนผู้ประเมิน</h3>
              <h1>{feedbacks.length} คน</h1>
            </div>

            <div style={cardStyle}>
              <h3>คะแนนเฉลี่ยรวม</h3>
              <h1>{overallAverage()} / 5</h1>
            </div>
          </div>

          <h2>คะแนนเฉลี่ยแต่ละข้อ</h2>

          <div style={{ marginBottom: 25 }}>
            {questions.map((q) => (
              <div key={q.key} style={cardStyle}>
                <strong>{q.label}</strong>
                <p style={{ marginTop: 8 }}>
                  คะแนนเฉลี่ย: {average(q.key)} / 5
                </p>
              </div>
            ))}
          </div>

          <h2>ข้อเสนอแนะจากสมาชิก</h2>

          {feedbacks.length === 0 ? (
            <p>ยังไม่มีผู้ส่งแบบประเมิน</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={cellStyle}>ผู้ประเมิน</th>
                    <th style={cellStyle}>คะแนนรวมเฉลี่ย</th>
                    <th style={cellStyle}>ข้อเสนอแนะ</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbacks.map((item) => {
                    const score = questions.reduce(
                      (sum, q) => sum + Number(item[q.key] || 0),
                      0
                    ) / questions.length;

                    return (
                      <tr key={item.id}>
                        <td style={cellStyle}>
                          {item.memberId?.slice(0, 8) || "-"}
                        </td>
                        <td style={cellStyle}>
                          {score.toFixed(2)} / 5
                        </td>
                        <td style={cellStyle}>
                          {item.comment || "ไม่มีข้อเสนอแนะ"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const cardStyle = {
  background: "#ffffff",
  border: "1px solid #dddddd",
  borderRadius: 10,
  padding: 18,
  marginBottom: 12,
};

const cellStyle = {
  border: "1px solid #dddddd",
  padding: 12,
  textAlign: "left",
  verticalAlign: "top",
};
