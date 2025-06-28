import axios from "axios";

// Hàm gọi refresh token API
export async function refreshAccessToken() {
  const refreshToken = sessionStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new Error("Không tìm thấy refresh token");
  }

  try {
    const res = await axios.post("http://localhost:8080/refresh", {
      refreshToken,
    });

    const { accessToken } = res.data;
    sessionStorage.setItem("accessToken", accessToken);
    return accessToken;
  } catch (err) {
    console.error("Lỗi khi refresh token:", err);
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    window.location.href = "/login"; // hoặc navigate("/login")
    throw err;
  }
}
