import { Link, useNavigate } from "react-router-dom";
import { Dropdown, Button, ButtonGroup } from "react-bootstrap";
import { useEffect, useState } from "react";
import { VscAccount } from "react-icons/vsc";

import logout from "./authLogout";
import logo from "../images/logo.jpg";

import "./navbar.css";
import { getUserIdFromToken } from "./getUserById";
import { FaRegBell } from "react-icons/fa";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const id = getUserIdFromToken();
    setUser(id);
  }, []);

  const handleLogout = () => {
    logout();
  };
  return (
    <>
      <div data-aos="fade-down" data-aos-duration="600" className="navbar">
        <div className="navbar-img">
          <Button
            style={{ backgroundColor: "transparent", border: "none" }}
            onClick={() => (window.location.href = "/")}
          >
            <img
              className="navbar-logo"
              alt="Jimeng"
              src={logo}
              style={{
                Width: "100%",
                maxWidth: "150px",
                minHeight: "80px",
                borderRadius: "7.7px",
              }}
            />
          </Button>
        </div>
        <div className="navbar-item">
          <div className="text-wrapper" id="home-wrapper">
            <Link
              className="wrapper-link"
              style={{ textDecoration: "none" }}
              to="/"
            >
              Home
            </Link>
          </div>

          <div className="text-wrapper">
            <Link
              className="wrapper-link"
              style={{ textDecoration: "none" }}
              to="/blog"
            >
              News
            </Link>
          </div>

          <div className="text-wrapper">
            <Link
              className="wrapper-link"
              style={{ textDecoration: "none" }}
              to="/FAQ"
            >
              FAQ
            </Link>
          </div>
          <div className="text-wrapper">
            <Link
              className="wrapper-link"
              style={{ textDecoration: "none" }}
              to="/contact"
            >
              Customer support
            </Link>
          </div>
        </div>
        <div className="navbav-item-login">
          <div className="text-wrapper">
            {user ? (
              <div className="fix-split-button">
                <Button
                  style={{
                    background: "none",
                    border: "none",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "1.3rem",
                    textAlign: "center",
                  }}
                  className="button-bell"
                  onClick={() => navigate("/notification")}
                >
                  <FaRegBell />
                </Button>
                <Dropdown as={ButtonGroup}>
                  <Button
                    style={{
                      background: "none",
                      border: "none",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1.7rem",
                      textAlign: "center",
                    }}
                    onClick={() => (window.location.href = "/user-profile")}
                    variant="success"
                    className="donor-button"
                  >
                    <VscAccount />
                  </Button>

                  <Dropdown.Toggle
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "1.4rem",
                      alignItems: "center",
                      display: "flex",
                      color: "white",
                    }}
                    split
                    variant="success"
                    id="dropdown-split-basic"
                  />

                  <Dropdown.Menu className="dropdown-menu">
                    <Dropdown.Item href="#/action-1">
                      <div className="text-wrapper">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="navbar-icon"
                          viewBox="0 0 16 16"
                        >
                          <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                        </svg>
                        <Link
                          style={{
                            textDecoration: "none",
                          }}
                          to="/user-profile"
                        >
                          Hồ sơ cá nhân
                        </Link>
                      </div>
                    </Dropdown.Item>
                    <Dropdown.Item href="#/action-2">
                      <div className="text-wrapper">
                        {/* Globe Icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="navbar-icon"
                          viewBox="0 0 16 16"
                        >
                          <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2m-5.146-5.146-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708.708" />
                        </svg>
                        <Link
                          style={{
                            textDecoration: "none",
                          }}
                          to="/appointment"
                        >
                          Lịch hẹn của bạn
                        </Link>
                      </div>
                    </Dropdown.Item>
                    <Dropdown.Item href="/">
                      <Button onClick={handleLogout}>Logout</Button>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            ) : (
              <button className="wrapper-link-login" n>
                <Link
                  style={{ textDecoration: "none", color: "#db230b" }}
                  to="/login"
                >
                  Login
                </Link>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
