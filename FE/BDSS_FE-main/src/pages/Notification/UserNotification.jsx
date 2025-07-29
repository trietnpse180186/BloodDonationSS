import React, { useState, useEffect, useRef } from "react";
import "./UserNotification.css";
import Navbar from "../../components/navbar";
import { getUserNotifications } from "../../helpers/getNotification";
import NotificationModal from "../../components/NotificationModal";
import { useLocation } from "react-router-dom";
import { baseUrl } from "../../Utils/baseUrl";

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const menuRefs = useRef({});
  const pollingInterval = useRef(null);
  const processedNotifications = useRef(new Set());
  const location = useLocation();

  const checkForNewNotifications = async () => {
    try {
      const data = await getUserNotifications();

      const newNotifications = data.filter(
        (notification) => !processedNotifications.current.has(notification.id)
      );

      if (newNotifications.length > 0) {
        setNotifications((prevNotifications) => {
          const updatedNotifications = [
            ...newNotifications,
            ...prevNotifications,
          ];

          newNotifications.forEach((notification) => {
            processedNotifications.current.add(notification.id);
          });

          return updatedNotifications;
        });

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
      }
    } catch (error) {
      console.error("Error checking for new notifications:", error);
    }
  };

  const startPolling = () => {
    if (pollingInterval.current) return;

    checkForNewNotifications();

    pollingInterval.current = setInterval(() => {
      checkForNewNotifications();
    }, 5000);
  };

  const stopPolling = () => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
      pollingInterval.current = null;
    }
  };

  useEffect(() => {
    getUserNotifications()
      .then((data) => {
        setNotifications(data);
        data.forEach((n) => processedNotifications.current.add(n.id));
        startPolling();
      })
      .catch((error) => {
        console.error("Error loading notifications:", error);
      });

    return () => {
      stopPolling();
    };
  }, []);

  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling();
      } else {
        startPolling();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      const token = sessionStorage.getItem("accessToken");
      const response = await fetch(
        `${baseUrl}/notifications/${notificationId}/read`,
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
      }
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    if (!window.confirm("Delete this notification?")) return;

    try {
      const token = sessionStorage.getItem("accessToken");
      const response = await fetch(
        `${baseUrl}/notifications/${notificationId}`,
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
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        activeMenuId &&
        menuRefs.current[activeMenuId] &&
        !menuRefs.current[activeMenuId].contains(event.target)
      ) {
        setActiveMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeMenuId]);

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedNotification(null);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const notificationId = searchParams.get("id");

    if (notificationId && notifications.length > 0) {
      const notification = notifications.find(
        (n) => n.id.toString() === notificationId
      );

      if (notification) {
        setSelectedNotification(notification);
        setShowModal(true);
      }
    }
  }, [location.search, notifications]);

  return (
    <>
      <Navbar />
      <div className="notification-wrapper">
        <div className="notification-toolbar">
          <h2 className="notification-title">Notifications</h2>
        </div>

        <div className="notification-list">
          {notifications.length === 0 ? (
            <div
              style={{ textAlign: "center", padding: "40px", color: "#666" }}
            >
              <p>No notifications yet</p>
              <small>New notifications will appear automatically</small>
            </div>
          ) : (
            notifications.map((notify) => (
              <div
                key={notify.id}
                className={`notification-card ${
                  notify.status === "UNREAD" ? "UNREAD" : ""
                }`}
                onClick={() => {
                  if (notify.status === "UNREAD") {
                    markAsRead(notify.id);
                  }
                  setSelectedNotification(notify);
                  setShowModal(true);
                }}
              >
                <div className="notification-icon">
                  <span className="icon">🔔</span>
                  {notify.status === "UNREAD" && <span className="dot" />}
                </div>

                <div className="notification-content">
                  <h4 className="note-title">{notify.title}</h4>
                  <p className="note-message">{notify.detail}</p>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      marginTop: "5px",
                    }}
                  >
                    {notify.date} at{" "}
                    {notify.time
                      ? notify.time.match(/^\d{2}:\d{2}:\d{2}/)?.[0] || ""
                      : ""}
                  </div>
                </div>

                <div className="notification-actions">
                  <button
                    className="menu-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notify.id);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "18px",
                      cursor: "pointer",
                      color: "#999",
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {selectedNotification && (
          <NotificationModal
            show={showModal}
            onHide={handleCloseModal}
            notification={selectedNotification}
          />
        )}
      </div>
    </>
  );
}
