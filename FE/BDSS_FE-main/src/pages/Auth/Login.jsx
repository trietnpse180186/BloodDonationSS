import React, { useState } from "react";
import axios from "../../helpers/axiosInstance";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "./Login.css";
import { getUserRole } from "../../helpers/getUserName";
import loginBanner from "../../images/loginBanner.jpg";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PulseLoader } from "react-spinners";

function PasswordInput({ value, onChange }) {
  const [show, setShow] = useState(false);

  return (
    <div className="input-group-login">
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
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        email,
        password,
      });

      const { accessToken, refreshToken } = response.data;

      if (!accessToken) {
        alert("Can not get accessToken!");
        setLoading(false);
        return;
      }
      sessionStorage.setItem("accessToken", accessToken);
      sessionStorage.setItem("refreshToken", refreshToken);

      const role = getUserRole(accessToken);
      console.log(getUserRole(accessToken));
      if (role === "DONOR") {
        const params = new URLSearchParams(location.search);
        const redirect = params.get("redirect");
        navigate(redirect || "/");
      } else if (role === "ADMIN") {
        navigate("/admin");
      } else if (role === "STAFF") {
        navigate("/staff");
      } else {
        toast.error("Invalid role!");
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please check your email and password.");
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(255, 255, 255, 0.82)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <PulseLoader
            color="#bd0909ff"
            size={50}
            speedMultiplier={1.2}
            loading={loading}
            cssOverride={{
              borderWidth: "6px",
              margin: "0 auto",
            }}
          />
        </div>
      )}
      <div
        className="login-inputs"
        style={{
          opacity: loading ? 0.5 : 1,
          pointerEvents: loading ? "none" : "auto",
        }}
      >
        <form className="login-wrapper" onSubmit={handleSubmit}>
          <h1>SIGN IN</h1>
          <div className="input-group-login">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={{ position: "relative" }}>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div
              style={{
                right: 0,
                fontSize: 14,
                marginTop: -16,
                marginBottom: 16,
                justifyItems: "flex-end",
                width: "100%",
              }}
            >
              <Link to="/forgot-password" style={{ color: "#b30000" }}>
                Forgot password?
              </Link>
            </div>
          </div>
          <button type="submit">Sign in</button>
        </form>
        <div
          className="register"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h8 style={{ marginTop: 8, marginRight: 8 }}>
            Don't have an account?
          </h8>
          <Link to="/register">Register here!</Link>
        </div>
        <div className="back-btn">
          <a
            type="button"
            className="back-btn-back"
            onClick={() => navigate("/")}
            style={{ marginRight: 8, fontSize: 15 }}
          >
            ⟵ Back to Home Page
          </a>
        </div>
      </div>
      <div className="login-banner">
        <img src={loginBanner} />
      </div>
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}
