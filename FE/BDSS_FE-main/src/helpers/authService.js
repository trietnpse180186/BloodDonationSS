import axios from "axios";
import { Button } from "react-bootstrap";
import { baseUrl } from "../Utils/baseUrl";

export async function refreshAccessToken() {
  const refreshToken = sessionStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new Error("Không tìm thấy refresh token");
  }

  try {
    const res = await axios.post(`${baseUrl}/refresh`, {
      refreshToken,
    });

    const { accessToken } = res.data;
    sessionStorage.setItem("accessToken", accessToken);
    return accessToken;
  } catch (err) {
    console.error("Lỗi khi refresh token:", err);
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    window.location.href = "/login";
    throw err;
  }
}
