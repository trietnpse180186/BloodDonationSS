import axios from "axios";
import { getUserIdFromToken } from "./getUserById";
import { baseUrl } from "../Utils/baseUrl";

export async function getUserNotifications() {
  const userId = getUserIdFromToken();
  const response = await axios.get(`${baseUrl}/notifications/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
    },
  });
  return response.data;
}

export async function markNotificationAsRead(notificationId) {
  const userId = getUserIdFromToken();
  const response = await axios.put(
    `${baseUrl}/notifications/${notificationId}`,
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
