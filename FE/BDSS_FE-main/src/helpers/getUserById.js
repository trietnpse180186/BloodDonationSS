import axios from "axios";

// Hàm lấy userId từ token JWT
export function getUserIdFromToken() {
  const token = sessionStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.userId;
  } catch (err) {
    console.error("Lỗi decode token:", err);
    return null;
  }
}

export default async function getUserById() {
  const token = sessionStorage.getItem("accessToken");
  const userId = getUserIdFromToken();

  if (!token || !userId) {
    throw new Error("Không tìm thấy token hoặc userId");
  }

  try {
    const res = await axios.get(`http://localhost:8080/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("Lỗi khi lấy user:", err);
    throw err;
  }
}
