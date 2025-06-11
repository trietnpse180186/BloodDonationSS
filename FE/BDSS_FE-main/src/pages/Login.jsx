import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Login.css";
import { getUserRole } from "../assets/getUserName";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          email,
          password,
        }
      );

      // Lấy token đúng trường
      const { token, authenticated } = response.data.result;
      localStorage.setItem("token", token);
      const role = getUserRole(token);
      if (role == "DONOR") {
        navigate("/");
      } else {
        navigate("/adminPage");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(
        "Đăng nhập không thành công. Vui lòng kiểm tra lại tài khoản và mật khẩu."
      );
    }
  };

  return (
    <>
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
    </>
  );
}
