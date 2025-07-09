import React, { useState } from "react";
import axios from "../../assets/axiosInstance";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "./Login.css";
import { getUserRole } from "../../assets/getUserName";
import loginBanner from "../../images/loginBanner.jpg";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";

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
        <div style={{ display: "flex", justifyContent: "center", margin: 20 }}>
          <ClipLoader color="#b30000" size={48} speedMultiplier={1.1} />
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
