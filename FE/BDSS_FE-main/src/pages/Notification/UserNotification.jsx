import React, { useState, useEffect, useRef, use } from "react";
import "./Notification.css";
import Navbar from "../../components/navbar";
import axios from "axios";
import { getUserNotifications } from "../../assets/getNotification";

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRefs = useRef({});
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");

  useEffect(() => {
    getUserNotifications()
      .then((data) => {
        console.log("🔔 Notifications:", data); // Kiểm tra notify.id
        setNotifications(data);
      })
      .catch(console.error);

    axios
      .get("http://localhost:8080/api/users?role=DONOR")
      .then((response) => {
        console.log("🧑‍🤝‍🧑 Users:", response.data); // Kiểm tra user.id
        setUsers(response.data);
      })
      .catch((error) => console.error("Error fetching donors:", error));
  }, []);

  return (
    <>
      <Navbar />
      <div className="notification-wrapper">
        <div className="notification-toolbar">
          <h2 className="notification-title">Notification</h2>

          {/* take all user notifications */}
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            <option value="">-- Select User --</option>
            {users.map((user) => (
              <option key={user.donorId} value={user.id}>
                {user.fullName || user.email || user.donorId}
              </option>
            ))}
          </select>
          <button className="mark-all-read">Mark all as read</button>
        </div>

        <div className="notification-list">
          {notifications.map((notify) => (
            <div
              key={notify.id}
              className={`notification-card ${notify.read ? "" : "UNREAD"}`}
            >
              <div className="notification-icon">
                <span className="icon">🔔</span>
                {!notify.read && <span className="dot" />}
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
                  onClick={() =>
                    setActiveMenuId(
                      activeMenuId === notify.id ? null : notify.id
                    )
                  }
                >
                  ⋮
                </button>

                {activeMenuId === notify.id && (
                  <div className="dropdown-menu">
                    <button onClick={() => markAsRead(notify.id)}>
                      Mark as read
                    </button>
                    <hr />
                    <button onClick={() => deleteNotification(notify.id)}>
                      Delete notification
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
