import { jwtDecode } from "jwt-decode";

export function getUsernameFromToken() {
  const token = localStorage.getItem("token");
  if (token && token.split(".").length === 3) {
    try {
      const decoded = jwtDecode(token);
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
  const token = localStorage.getItem("token");
  if (token && token.split(".").length === 3) {
    try {
      const decoded = jwtDecode(token);
      return decoded.role || "Người dùng";
    } catch (error) {
      console.error("Token không hợp lệ:", error);
      return null;
    }
  }
  return null;
}
