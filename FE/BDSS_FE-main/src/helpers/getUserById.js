import axios from "axios";

export function getUserIdFromToken() {
  const token = sessionStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const part = token.split(".")[1];
    if (!part) return null;
    // Chuyển base64url về base64 chuẩn
    let base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) base64 += "=";
    const payload = JSON.parse(atob(base64));
    if (!payload.userId) {
      console.error("Token payload không có userId:", payload);
    }
    return payload.userId;
  } catch (err) {
    console.error("Lỗi decode token:", err, token);
    return null;
  }
}

// Hàm gọi API lấy thông tin user
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
