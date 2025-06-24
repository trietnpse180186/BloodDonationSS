import { Link } from "react-router-dom";
import { Dropdown, Button, ButtonGroup } from "react-bootstrap";
import { useEffect, useState } from "react";
import { VscAccount } from "react-icons/vsc";

import logout from "./authLogout";
import logo from "../images/logo.jpg";

import "./navbar.css";
import { getUserIdFromToken } from "./getUserById";

export default function Navbar() {
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
                    <Dropdown.Item as={Link} to="/user-profile">
                      <div className="text-wrapper">
                        <svg>...</svg>
                        Hồ sơ cá nhân
                      </div>
                    </Dropdown.Item>

                    <Dropdown.Item as={Link} to="/donorSchedule">
                      <div className="text-wrapper">
                        <svg>...</svg>
                        Lịch hẹn của bạn
                      </div>
                    </Dropdown.Item>

                    <Dropdown.Item onClick={handleLogout}>
                      <div className="text-wrapper">
                        <svg>...</svg>
                        Đăng xuất
                      </div>
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
