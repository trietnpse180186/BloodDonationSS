import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Button,
  Dropdown,
} from "react-bootstrap";
import { FaRegBell } from "react-icons/fa";
import logout from "../helpers/authLogout";
import logo from "../images/logo.jpg";
import getUserById, { getUserIdFromToken } from "../helpers/getUserById";
import { getUserNotifications } from "../helpers/getNotification";
import "./navbar.css";

export default function AppNavbar() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = sessionStorage.getItem("accessToken");
      if (token) {
        try {
          const userId = getUserIdFromToken(token);
          if (userId) {
            const userData = await getUserById(userId);
            setUser(userData);
          }
        } catch (error) {
          console.error("Error getting user data:", error);
          sessionStorage.removeItem("accessToken");
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await getUserNotifications();
      setNotifications(data);
      const unread = data.filter((n) => n.status === "UNREAD").length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 5000);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate("/");
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = sessionStorage.getItem("accessToken");
      await fetch(
        `http://localhost:8080/notifications/${notificationId}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setNotifications((prevNotifications) =>
        prevNotifications.map((n) =>
          n.id === notificationId ? { ...n, status: "READ" } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleNotificationClick = (notificationId, status) => {
    if (status === "UNREAD") {
      markAsRead(notificationId);
    }

    navigate(`/user-notification?id=${notificationId}`);
  };

  return (
    <Navbar variant="dark" expand="lg" sticky="top" className="px-3">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          <img
            src={logo}
            alt="Logo"
            style={{
              maxWidth: "150px",
              minHeight: "50px",
              borderRadius: "7.7px",
            }}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/schedule">
              Schedule
            </Nav.Link>
            <Nav.Link as={Link} to="/blog">
              News
            </Nav.Link>
            <Nav.Link as={Link} to="/FAQ">
              FAQ
            </Nav.Link>
            <Nav.Link as={Link} to="/contact">
              Customer support
            </Nav.Link>
          </Nav>
          <Nav
            className="nav-user-group ms-auto"
            style={{ alignItems: "center", gap: "18px" }}
          >
            {user ? (
              <>
                <Dropdown align="end">
                  <Dropdown.Toggle
                    bsPrefix="custom-toggle"
                    style={{
                      background: "none",
                      border: "none",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1.4rem",
                      textAlign: "center",
                      boxShadow: "none",
                      position: "relative",
                    }}
                    id="dropdown-notification"
                  >
                    <FaRegBell />
                    {unreadCount > 0 && (
                      <span
                        style={{
                          position: "absolute",
                          top: "-8px",
                          right: "-8px",
                          background: "#dc3545",
                          color: "white",
                          borderRadius: "50%",
                          width: "20px",
                          height: "20px",
                          fontSize: "0.7rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                        }}
                      >
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </Dropdown.Toggle>
                  <Dropdown.Menu
                    className="notification-dropdown"
                    style={{
                      minWidth: 320,
                      maxHeight: 400,
                      overflowY: "auto",
                    }}
                  >
                    <Dropdown.Header>Notifications</Dropdown.Header>
                    {notifications.length === 0 ? (
                      <Dropdown.Item disabled>No notifications</Dropdown.Item>
                    ) : (
                      notifications.slice(0, 5).map((item, idx) => (
                        <Dropdown.Item
                          key={item.id || idx}
                          onClick={() =>
                            handleNotificationClick(item.id, item.status)
                          }
                          style={{
                            backgroundColor:
                              item.status === "UNREAD"
                                ? "#f8f9fa"
                                : "transparent",
                            borderLeft:
                              item.status === "UNREAD"
                                ? "3px solid #007bff"
                                : "3px solid transparent",
                          }}
                        >
                          <div
                            style={{
                              fontWeight: item.status === "UNREAD" ? 600 : 400,
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            {item.status === "UNREAD" && (
                              <span
                                style={{
                                  width: "8px",
                                  height: "8px",
                                  backgroundColor: "#007bff",
                                  borderRadius: "50%",
                                }}
                              ></span>
                            )}
                            {item.title}
                          </div>
                          <div
                            style={{
                              fontSize: "0.9em",
                              color: "#666",
                              marginTop: "4px",
                            }}
                          >
                            {item.detail}
                          </div>
                          <div
                            style={{
                              fontSize: "0.8em",
                              color: "#888",
                              marginTop: "4px",
                            }}
                          >
                            {item.date} {item.time}
                          </div>
                        </Dropdown.Item>
                      ))
                    )}
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={() => navigate("/user-notification")}
                      style={{ textAlign: "center", fontWeight: "bold" }}
                    >
                      View all notifications
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                <NavDropdown
                  title={
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <img
                        src={
                          user.avatarUrl ||
                          "https://ui-avatars.com/api/?name=" +
                            encodeURIComponent(user.fullName)
                        }
                        alt="avatar"
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          objectFit: "cover",
                          marginRight: 8,
                          border: "2px solid #fff",
                          background: "#eee",
                        }}
                      />
                      <span style={{ color: "white", fontWeight: 600 }}>
                        {user.fullName}
                      </span>
                    </span>
                  }
                  id="nav-profile-dropdown"
                  align="end"
                >
                  <NavDropdown.Item
                    className="dropdown-item"
                    as={Link}
                    to="/user-profile"
                  >
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    className="dropdown-item"
                    as={Link}
                    to="/appointment"
                  >
                    Your Appointments
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    className="dropdown-item"
                    as={Link}
                    to="/emergency-donation"
                  >
                    Emergency Donation
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    className="dropdown-item"
                    as="button"
                    onClick={handleLogout}
                  >
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Sign In
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  <Button variant="outline-light" className="nav-btn">
                    Sign Up
                  </Button>
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
