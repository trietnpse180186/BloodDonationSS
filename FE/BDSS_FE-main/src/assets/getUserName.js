import { jwtDecode } from "jwt-decode";

// Lấy tên user từ accessToken
export function getUsernameFromToken() {
  const token = localStorage.getItem("accessToken");
  if (token && token.split(".").length === 3) {
    try {
      const decoded = jwtDecode(token);
      console.log(decoded);
      return (
        decoded.fullName ||
        decoded.username ||
        decoded.email ||
        decoded.sub ||
        "Người dùng"
      );
    } catch (error) {
      console.error("Token không hợp lệ:", error);
      return null;
    }
  }
  return null;
}

export function getUserRole() {
  const token = localStorage.getItem("accessToken");
  if (token && token.split(".").length === 3) {
    try {
      const decoded = jwtDecode(token);
      if (
        Array.isArray(decoded.authorities) &&
        decoded.authorities.length > 0
      ) {
        return decoded.authorities[0];
      }
    } catch (error) {
      console.error("Token không hợp lệ:", error);
      return null;
    }
  }
  return null;
}
