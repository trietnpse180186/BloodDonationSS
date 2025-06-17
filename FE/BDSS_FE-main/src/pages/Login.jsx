import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import { getUserRole } from "../assets/getUserRole";

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

      if (role === "USER") {
        navigate("/");
      } else if (role === "ADMIN" || role === "STAFF") {
        navigate("/adminPage");
      } else {
        navigate("/");
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
      <h1>Đăng nhập</h1>
      <form className="login-wrapper" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Đăng nhập</button>
      </form>
      <Link to="/register">Đăng ký</Link>
    </div>
  );
}
