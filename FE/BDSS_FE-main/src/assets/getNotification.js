import axios from "axios";
import { getUserIdFromToken } from "./getUserById";

export async function getUserNotifications() {
  const userId = getUserIdFromToken();
  const response = await axios.get(
    `http://localhost:8080/notifications/user/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    }
  );
  return response.data;
}

export async function markNotificationAsRead(notificationId) {
  const userId = getUserIdFromToken();
  const response = await axios.put(
    `http://localhost:8080/notifications/${notificationId}`,
    { userId },
    {
      params: { status: "READ" },
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    }
  );
  return response.data;
}
