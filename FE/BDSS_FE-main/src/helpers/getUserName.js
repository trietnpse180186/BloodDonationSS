import { jwtDecode } from "jwt-decode";

// Lấy tên user từ accessToken
export function getUsernameFromToken() {
  const token = sessionStorage.getItem("accessToken");
  if (token && token.split(".").length === 3) {
    try {
      const decoded = jwtDecode(token);
      console.log(decoded);
      return (
        decoded.fullName ||
        decoded.username ||
        decoded.email ||
        decoded.sub ||
        "Unknown User"
      );
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }
  return null;
}

export function getUserRole(token) {
  token = token || sessionStorage.getItem("accessToken");
  if (token && token.split(".").length === 3) {
    try {
      const decoded = jwtDecode(token);
      if (
        Array.isArray(decoded.authorities) &&
        decoded.authorities.length > 0
      ) {
        return decoded.authorities[0].toUpperCase();
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }
  return null;
}
