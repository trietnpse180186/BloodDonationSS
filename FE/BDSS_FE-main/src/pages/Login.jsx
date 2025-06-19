import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import { getUserRole } from "../assets/getUserName";
import bannerLogin from "../images/banner-login.jpg";
import { FaEnvelope, FaLock } from "react-icons/fa";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        email,
        password,
      });

      const { accessToken, refreshToken } = response.data;

      if (!accessToken) {
        alert("Không nhận được accessToken từ server!");
        return;
      }
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      const role = getUserRole(accessToken);

      if (role === "DONOR") {
        navigate("/");
      } else if (role === "ADMIN" || role === "STAFF") {
        navigate("/adminPage");
      } else {
        alert("Vai trò không hợp lệ!");
        return;
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(
        "Đăng nhập không thành công. Vui lòng kiểm tra lại tài khoản và mật khẩu."
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-inputs">
        <form className="login-wrapper" onSubmit={handleSubmit}>
          <h1 style={{ color: "#b5332b" }}>Đăng nhập</h1>
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Đăng nhập</button>
        </form>
        <Link to="/register">Đăng ký</Link>
      </div>
      <div className="login-background">
        <img src={bannerLogin} alt="" />
      </div>
    </div>
  );
}
