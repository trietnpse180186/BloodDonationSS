import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { getUserNotifications } from "../helpers/getNotification";
import { getUserIdFromToken } from "../helpers/getUserById";

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const pollingInterval = useRef(null);
  const processedNotifications = useRef(new Set());

  const fetchNotifications = async () => {
    try {
      const data = await getUserNotifications();

      // Check for new notifications
      const newNotifications = data.filter(
        (notification) => !processedNotifications.current.has(notification.id)
      );

      if (newNotifications.length > 0) {
        // Show browser notification for newest one
        if (
          newNotifications.length > 0 &&
          Notification.permission === "granted"
        ) {
          const latestNotification = newNotifications[0];
          new Notification(latestNotification.title, {
            body: latestNotification.detail,
            icon: "/favicon.ico",
          });
        }

        // Mark as processed
        newNotifications.forEach((notification) => {
          processedNotifications.current.add(notification.id);
        });
      }

      setNotifications(data);

      // Count unread notifications
      const unreadNotifications = data.filter(
        (item) =>
          item.status === "UNREAD" || (!item.read && item.status !== "READ")
      );
      setUnreadCount(unreadNotifications.length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const startPolling = () => {
    if (pollingInterval.current) return;

    fetchNotifications();
    pollingInterval.current = setInterval(fetchNotifications, 5000);
  };

  const stopPolling = () => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
      pollingInterval.current = null;
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = sessionStorage.getItem("accessToken");
      const response = await fetch(
        `http://localhost:8080/notifications/${notificationId}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, status: "READ" } : n
          )
        );

        // Update unread count
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const token = sessionStorage.getItem("accessToken");
      const response = await fetch(
        `http://localhost:8080/notifications/${notificationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
        processedNotifications.current.delete(notificationId);

        // Update unread count
        const deletedNotification = notifications.find(
          (n) => n.id === notificationId
        );
        if (deletedNotification && deletedNotification.status === "UNREAD") {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // Auto start/stop polling based on user login
  useEffect(() => {
    const userId = getUserIdFromToken();

    if (userId) {
      // Request notification permission
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }

      // Load initial data and mark as processed
      getUserNotifications().then((data) => {
        setNotifications(data);
        data.forEach((n) => processedNotifications.current.add(n.id));

        const unreadNotifications = data.filter(
          (item) =>
            item.status === "UNREAD" || (!item.read && item.status !== "read")
        );
        setUnreadCount(unreadNotifications.length);
      });

      startPolling();
    } else {
      stopPolling();
      setNotifications([]);
      setUnreadCount(0);
    }

    return () => stopPolling();
  }, [getUserIdFromToken()]);

  // Handle page visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      const userId = getUserIdFromToken();
      if (!userId) return;

      if (document.hidden) {
        stopPolling();
      } else {
        startPolling();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    deleteNotification,
    refreshNotifications: fetchNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
