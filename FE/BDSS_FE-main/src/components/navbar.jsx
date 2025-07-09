import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Button,
  Dropdown,
} from "react-bootstrap";
import { VscAccount } from "react-icons/vsc";
import { FaRegBell } from "react-icons/fa";
import logout from "../assets/authLogout";
import logo from "../images/logo.jpg";
import { getUserIdFromToken } from "../assets/getUserById";
import "./navbar.css";

export default function AppNavbar() {
  const [notification, setNotification] = useState([]);
  const userId = getUserIdFromToken();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setUser(userId);
    const fetchNotifications = async () => {
      const response = await fetch(
        `http://localhost:8080/notifications/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setNotification(data);
      }
    };
    if (userId) fetchNotifications();
  }, [userId]);

  const handleLogout = () => {
    logout();
    navigate("/");
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
                    }}
                    id="dropdown-notification"
                  >
                    <FaRegBell />
                  </Dropdown.Toggle>
                  <Dropdown.Menu
                    style={{
                      minWidth: 320,
                      maxHeight: 400,
                      overflowY: "auto",
                    }}
                  >
                    <Dropdown.Header>Notifications</Dropdown.Header>
                    {notification.length === 0 ? (
                      <Dropdown.Item disabled>No notifications</Dropdown.Item>
                    ) : (
                      notification.map((item, idx) => (
                        <Dropdown.Item key={item.id || idx}>
                          <div style={{ fontWeight: 600 }}>{item.title}</div>
                          <div>{item.detail}</div>
                          <div
                            style={{
                              fontSize: "0.95em",
                              color: "#888",
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
                    >
                      View all
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <NavDropdown
                  title={
                    <VscAccount
                      style={{ fontSize: "1.7rem", color: "white" }}
                    />
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
