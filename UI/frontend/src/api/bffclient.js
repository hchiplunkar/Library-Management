import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8085";

export async function fetchDashboard(userId, bookId) {
  const res = await axios.post(`${API_BASE}/bff/dashboard`, {
    user_id: userId,
    book_id: bookId
  });
  console.log("BffClient fetchDashboard response:", res.data);
  return res.data;
}
