import React, { useState, useEffect, useRef } from 'react';
import './Notification.css';
import Navbar from '../../components/navbar';

const initialNotifications = [
  { id: 1, title: "Lịch hiến máu mới", message: "Tại Đà Nẵng", time: "5 phút trước", type: "nhắc nhở", read: false },
  { id: 2, title: "Xác nhận lịch", message: "Donor A đã hoàn tất", time: "30 phút trước", type: "sự kiện", read: true },
  { id: 3, title: "Cập nhật FAQ", message: "Thêm câu hỏi mới", time: "1 giờ trước", type: "tin tức", read: false },
];

const FILTERS = ["Tất cả", "Chưa đọc", "Nhắc nhở", "Sự kiện", "Tin tức"];

export default function NotificationCenter() {
  const [filter, setFilter] = useState("Tất cả");
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRefs = useRef({}); // Store ref for each item

  useEffect(() => {
    function handleClickOutside(e) {
      const activeRef = menuRefs.current[activeMenuId];
      if (activeRef && !activeRef.contains(e.target)) {
        setActiveMenuId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeMenuId]);

  const filtered = notifications.filter(note => {
    if (filter === "Tất cả") return true;
    if (filter === "Chưa đọc") return !note.read;
    return note.type === filter.toLowerCase();
  });

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setActiveMenuId(null);
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setActiveMenuId(null);
  };

  return (
    <>
      <Navbar />
      <div className="notification-wrapper">
        <div className="notification-toolbar">
          <h2 className="notification-title">Thông báo</h2>
          <button className="mark-all-read">Đánh dấu đã đọc tất cả</button>
        </div>

        <div className="notification-filters">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="notification-list">
          {filtered.map(note => (
            <div key={note.id} className={`notification-card ${note.read ? '' : 'unread'}`}>
              <div className="notification-icon">
                <span className="icon">🔔</span>
                {!note.read && <span className="dot" />}
              </div>

              <div className="notification-content">
                <h4 className="note-title">{note.title}</h4>
                <p className="note-message">{note.message}</p>
                <span className="note-time">{note.time}</span>
              </div>

              <div className="notification-actions" ref={el => menuRefs.current[note.id] = el}>
                <button
                  className="menu-button"
                  onClick={() =>
                    setActiveMenuId(activeMenuId === note.id ? null : note.id)
                  }
                >
                  ⋮
                </button>

                {activeMenuId === note.id && (
                  <div className="dropdown-menu">
                    <button onClick={() => markAsRead(note.id)}>Đánh dấu đã đọc</button>
                    <hr />
                    <button onClick={() => deleteNotification(note.id)}>Xoá thông báo</button>
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
