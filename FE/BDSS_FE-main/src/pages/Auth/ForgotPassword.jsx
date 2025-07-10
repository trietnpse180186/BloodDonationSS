import React, { useState } from "react";
import axios from "../../assets/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router";
import "./ForgotPassword.css"; // Assuming you have a CSS file for styling
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/forgot-password", null, {
        params: { email },
      });
      toast.success("OTP has been sent to your email.");
      setStep(2);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send OTP.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/reset-password", {
        email,
        otpCode: otp,
        newPassword,
        confirmPassword,
      });
      toast.success("Password reset successfully. Please login!");
      setStep(1);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <div
      className="forgot-password-page"
      style={{ maxWidth: 400, margin: "40px auto" }}
    >
      <h2>Forgot Password</h2>
      {step === 1 && (
        <>
          <form onSubmit={handleSendOtp}>
            <label>Enter Your Account Email</label>
            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", marginBottom: 16 }}
            />
            <button type="submit" style={{ width: "100%" }}>
              GET OTP
            </button>
          </form>
          <div className="back-btn">
            <a
              type="button"
              className="back-btn-back"
              onClick={() => navigate(-1)}
              style={{ marginRight: 8 }}
            >
              ⟵ Back
            </a>
          </div>
        </>
      )}
      {step === 2 && (
        <form onSubmit={handleResetPassword}>
          <label>OTP Code (Check your email)</label>
          <input
            type="text"
            value={otp}
            required
            onChange={(e) => setOtp(e.target.value)}
            style={{ width: "100%", marginBottom: 12 }}
          />
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            required
            onChange={(e) => setNewPassword(e.target.value)}
            style={{ width: "100%", marginBottom: 12 }}
          />
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ width: "100%", marginBottom: 16 }}
          />
          <button type="submit" style={{ width: "100%" }}>
            Reset Password
          </button>
          <div className="back-btn">
            <a
              type="button"
              className="back-btn-back"
              onClick={() => navigate("/login")}
              style={{ marginRight: 8 }}
            >
              ⟵ Back to Login
            </a>
          </div>
        </form>
      )}
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}
