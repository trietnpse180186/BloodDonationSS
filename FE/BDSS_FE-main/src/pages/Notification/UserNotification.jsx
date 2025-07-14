import React, { useState, useEffect, useRef } from "react";
import "./UserNotification.css";
import Navbar from "../../components/navbar";
import axios from "axios";
import { getUserNotifications } from "../../assets/getNotification";
export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRefs = useRef({});

  useEffect(() => {
    getUserNotifications().then(setNotifications).catch(console.error);
  }, []);

  // Đánh dấu đã đọc
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
        // Cập nhật local state
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, status: "READ" } : n
          )
        );

        setActiveMenuId(null);
        window.dispatchEvent(new CustomEvent("notificationUpdated"));
        console.log("Notification marked as read successfully");
      } else {
        console.error("Failed to mark notification as read");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Xóa thông báo
  const deleteNotification = async (notificationId) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
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
          setNotifications((prev) =>
            prev.filter((n) => n.id !== notificationId)
          );
          setActiveMenuId(null);
          window.dispatchEvent(new CustomEvent("notificationUpdated"));
        } else {
          alert("Failed to delete notification. Please try again.");
        }
      } catch (error) {
        alert("Error occurred while deleting notification.");
      }
    }
  };

  // Đóng menu khi click bên ngoài
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeMenuId]);

  return (
    <>
      <Navbar />
      <div className="notification-wrapper">
        <div className="notification-toolbar">
          <h2 className="notification-title">Notification</h2>
          
        </div>

        <div className="notification-list">
          {notifications.map((notify) => (
            <div
              key={notify.id}
              className={`notification-card ${
                notify.status === "UNREAD" ? "UNREAD" : ""
              }`}
              onClick={() => {
                if (notify.status === "UNREAD") {
                  markAsRead(notify.id);
                }
              }}
            >
              <div className="notification-icon">
                <span className="icon">🔔</span>
                {notify.status === "UNREAD" && <span className="dot" />}
              </div>

              <div className="notification-content">
                <h4 className="note-title">{notify.title}</h4>
                <p className="note-message">{notify.detail}</p>
                <span className="note-date">{notify.date}</span>
                <span className="note-time">{notify.time}</span>
              </div>

              <div
                className="notification-actions"
                ref={(el) => (menuRefs.current[notify.id] = el)}
              >
                <button
                  className="menu-button"
                  onClick={(e) => {
                    e.stopPropagation(); // tránh click trùng với markAsRead
                    deleteNotification(notify.id);
                  }}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
