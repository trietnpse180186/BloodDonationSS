import React, { useState } from "react";
import axios from "../../helpers/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router";
import "./ForgotPassword.css";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";

function PasswordInput({ value, onChange }) {
  const [show, setShow] = useState(false);

  return (
    <div className="input-group">
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
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/auth/forgot-password", null, {
        params: { email },
      });
      toast.success("OTP has been sent to your email.");
      setStep(2);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send OTP.");
    }
    setLoading(false);
  };

  const validatePassword = (pw) => {
    if (!pw) return "Password is required";
    if (pw.length < 6) return "Password must be at least 6 characters";
    if (!/[A-Z]/.test(pw))
      return "Password must contain at least 1 uppercase letter";
    if (!/[a-z]/.test(pw))
      return "Password must contain at least 1 lowercase letter";
    if (!/[0-9]/.test(pw)) return "Password must contain at least 1 number";
    return "";
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setNewPasswordError("");
    setConfirmPasswordError("");

    const pwError = validatePassword(newPassword);
    if (pwError) {
      setNewPasswordError(pwError);
      setLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/auth/reset-password", {
        email,
        otpCode: otp,
        newPassword,
        confirmPassword,
      });
      toast.success("Password reset successfully. Please login!");
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to reset password.");
    }
    setLoading(false);
  };

  return (
    <div
      className="forgot-password-page"
      style={{ maxWidth: 400, margin: "40px auto" }}
    >
      <h2>Forgot Password</h2>
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(255,255,255,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <span
            style={{
              color: "#b30000",
              fontWeight: 600,
              fontSize: 18,
            }}
          >
            Processing...
          </span>
        </div>
      )}
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
              disabled={loading}
            />
            <button type="submit" style={{ width: "100%" }} disabled={loading}>
              {loading ? "Sending..." : "GET OTP"}
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
            disabled={loading}
          />
          <label>New Password</label>
          <PasswordInput
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
          />
          {newPasswordError && (
            <div style={{ color: "#d32f2f", fontSize: 13, marginBottom: 8 }}>
              {newPasswordError}
            </div>
          )}
          <label>Confirm Password</label>
          <PasswordInput
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
          {confirmPasswordError && (
            <div style={{ color: "#d32f2f", fontSize: 13, marginBottom: 8 }}>
              {confirmPasswordError}
            </div>
          )}
          <button type="submit" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Processing..." : "Reset Password"}
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
