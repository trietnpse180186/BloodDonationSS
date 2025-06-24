import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import { getUserRole } from "../assets/getUserName";
import bannerLogin from "../images/banner-login.jpg";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import loginBanner from "../images/loginBanner.jpg";
import "react-toastify/dist/ReactToastify.css";

function PasswordInput({ value, onChange }) {
  const [show, setShow] = useState(false);

  return (
    <div className="input-group">
      <FaLock className="input-icon" />
      <input
        type={show ? "text" : "password"}
        placeholder="Password"
        value={value}
        onChange={onChange}
        required
        style={{ paddingLeft: 40, paddingRight: 40 }}
      />
      <span
        className="show-password-btn"
        onClick={() => setShow((s) => !s)}
        tabIndex={0}
      >
        {show ? <FaEyeSlash /> : <FaEye />}
      </span>
    </div>
  );
}

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
      sessionStorage.setItem("accessToken", accessToken);
      sessionStorage.setItem("refreshToken", refreshToken);

      const role = getUserRole(accessToken);

      if (role === "DONOR") {
        navigate("/");
      } else if (role === "ADMIN") {
        navigate("/admin");
      } else if (role === "STAFF") {
        navigate("/staff");
      } else {
        toast.error("Invalid role!");
        return;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please check your email and password.");
    }
  };

  return (
    <div
      className="login-page"
      data-aos="fade-in"
      data-aos-duration="500"
      data-aos-delay="100"
      data-aos-easing="ease-in-out"
    >
      <div
        className="login-inputs"
        data-aos="slide-left"
        data-aos-duration="800"
        data-aos-delay="200"
        data-aos-easing="ease-in-out"
      >
        <form className="login-wrapper" onSubmit={handleSubmit}>
          <h1>SIGN IN</h1>
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
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Sign in</button>
        </form>
        <Link to="/register">Register</Link>
        <Link to="/">Home</Link>
      </div>
      <div className="login-banner">
        <img src={loginBanner} />
      </div>
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}
