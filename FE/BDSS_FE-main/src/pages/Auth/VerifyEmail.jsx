import React, { useState } from "react";
import axios from "../../helpers/axiosInstance";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEnvelope, FaKey } from "react-icons/fa";

export default function VerifyEmail() {
  const location = useLocation();
  const initialEmail = location.state?.email || "";
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !otp) {
      toast.error("Please enter both email and OTP code.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("/verify-email", { email, otpCode: otp });
      toast.success(res.data || "Email verified successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 1800);
    } catch (err) {
      toast.error(
        err.response?.data || "Verification failed. Please check your OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="verify-email-page"
      style={{
        minHeight: 400,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form
        className="verify-email-form"
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: 32,
          borderRadius: 12,
          boxShadow: "0 2px 12px #eee",
          minWidth: 340,
          maxWidth: 400,
          width: "100%",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#b30000", marginBottom: 24 }}>
          Verify Your Email
        </h2>
        <div style={{ marginBottom: 18 }}>
          <label htmlFor="email" style={{ fontWeight: 500 }}>
            Email
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FaEnvelope style={{ color: "#b30000" }} />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={{
                flex: 1,
                padding: 8,
                borderRadius: 6,
                border: "1px solid #ccc",
              }}
              required
            />
          </div>
        </div>
        <div style={{ marginBottom: 18 }}>
          <label htmlFor="otp" style={{ fontWeight: 500 }}>
            OTP Code
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FaKey style={{ color: "#b30000" }} />
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP code"
              style={{
                flex: 1,
                padding: 8,
                borderRadius: 6,
                border: "1px solid #ccc",
              }}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            background: loading ? "#ccc" : "#b30000",
            color: "#fff",
            padding: 10,
            border: "none",
            borderRadius: 6,
            fontWeight: 600,
            fontSize: 16,
            cursor: loading ? "not-allowed" : "pointer",
            marginTop: 8,
          }}
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>
        <ToastContainer position="top-center" autoClose={2500} />
      </form>
    </div>
  );
}
