import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import axios from "../../helpers/axiosInstance";
import {
  FaEnvelope,
  FaLock,
  FaUserEdit,
  FaPen,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { FaPhone, FaLocationDot } from "react-icons/fa6";
import { MdCake, MdWork } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader, PulseLoader } from "react-spinners";
import { baseUrl } from "../../Utils/baseUrl";

function PasswordInput({ value, onChange, name, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className="register-input-group">
      <FaLock className="register-input-icon" />
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder || "Password"}
        value={value}
        name={name}
        onChange={onChange}
        className="register-password-input"
      />
      <span
        className="register-show-password-btn"
        onClick={() => setShow((s) => !s)}
        tabIndex={0}
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <FaEyeSlash /> : <FaEye />}
      </span>
    </div>
  );
}

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    birthday: "",
    sex: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    address: "",
    occupation: "",
    bloodType: null,
  });

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    return /[A-Z]/.test(password) && /\d/.test(password) && password.length > 8;
  };

  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full Name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (!isValidEmail(formData.email)) newErrors.email = "Email is invalid.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (!isValidPassword(formData.password)) {
      newErrors.password = "Please enter a valid password!";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    if (!formData.sex) {
      newErrors.sex = "Gender is required.";
    }
    if (!formData.birthday) {
      newErrors.birthday = "Birthday is required.";
    }
    if (formData.birthday) {
      const today = new Date();
      const birthDate = new Date(formData.birthday);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) {
        newErrors.birthday = "You must be at least 18 years old to register.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [loading, setLoading] = useState(false);
  const [passwordHintColor, setPasswordHintColor] = useState("red");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      if (!value) {
        setPasswordHintColor("red");
      } else if (isValidPassword(value)) {
        setPasswordHintColor("green");
      } else {
        setPasswordHintColor("red");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    console.log("Form data gửi đi:", formData);
    try {
      const response = await axios.post(`${baseUrl}/api/v1/users`, formData);
      toast.success("Please check your email for the OTP.");
      setTimeout(() => {
        setLoading(false);
        navigate("/verify-email", { state: { email: formData.email } });
      }, 1500);
    } catch (error) {
      setLoading(false);
      if (error.response?.status === 409) {
        toast.error("Email already exists. Please use a different email.");
      } else {
        toast.error("Registration failed. Please check your information.");
      }
    }
  };

  return (
    <div className="register-page">
      {loading && (
        <div className="register-loading-overlay">
          <PulseLoader
            color="#b30000"
            size={60}
            speedMultiplier={1.2}
            loading={loading}
            cssOverride={{
              borderWidth: "6px",
              margin: "0 auto",
            }}
          />
        </div>
      )}
      <form
        className="register-form"
        onSubmit={handleSubmit}
        style={{
          opacity: loading ? 0.5 : 1,
          pointerEvents: loading ? "none" : "auto",
        }}
      >
        <h1 className="register-title">SIGN UP</h1>
        <div className="register-flex-row" style={{ gap: 32 }}>
          <div className="register-account" style={{ flex: 1, minWidth: 320 }}>
            <h4 className="register-section-title">Account Information</h4>
            <div className="register-field" style={{ marginBottom: 18 }}>
              <label className="register-label" htmlFor="email">
                Email <span className="register-required">*</span>
              </label>
              <div
                className="register-field-wrapper"
                style={{ alignItems: "center" }}
              >
                <FaEnvelope className="register-input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email *"
                  value={formData.email}
                  onChange={handleChange}
                  className="register-input"
                  style={{ width: "100%" }}
                />
              </div>
              {errors.email && (
                <div className="register-error-message">{errors.email}</div>
              )}
            </div>
            <div className="register-field" style={{ marginBottom: 18 }}>
              <label className="register-label" htmlFor="password">
                Password <span className="register-required">*</span>
              </label>
              <div
                className="register-field-wrapper"
                style={{ alignItems: "center" }}
              >
                <PasswordInput
                  value={formData.password}
                  name="password"
                  onChange={handleChange}
                />
              </div>
              <div
                className="register-password-hints"
                style={{ color: passwordHintColor, marginLeft: 32 }}
              >
                <ul className="register-hints-list">
                  <li>Password must contain at least 1 uppercase letter</li>
                  <li>Password must contain at least 1 number</li>
                  <li>Password must be longer than 8 characters</li>
                </ul>
              </div>
              {errors.password && (
                <div className="register-error-message">{errors.password}</div>
              )}
            </div>
            <div className="register-field" style={{ marginBottom: 18 }}>
              <label className="register-label" htmlFor="confirmPassword">
                Confirm Password <span className="register-required">*</span>
              </label>
              <div
                className="register-field-wrapper"
                style={{ alignItems: "center" }}
              >
                <PasswordInput
                  value={formData.confirmPassword}
                  name="confirmPassword"
                  onChange={handleChange}
                />
              </div>
              {errors.confirmPassword && (
                <div className="register-error-message">
                  {errors.confirmPassword}
                </div>
              )}
            </div>
          </div>
          <div className="register-profile" style={{ flex: 1, minWidth: 320 }}>
            <h4 className="register-section-title">Profile Information</h4>
            <div className="register-field" style={{ marginBottom: 18 }}>
              <label className="register-label" htmlFor="fullName">
                Full Name <span className="register-required">*</span>
              </label>
              <div
                className="register-field-wrapper"
                style={{ alignItems: "center" }}
              >
                <FaUserEdit className="register-input-icon" />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Enter your full name *"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="register-input"
                  style={{ width: "100%" }}
                />
              </div>
              {errors.fullName && (
                <div className="register-error-message">{errors.fullName}</div>
              )}
            </div>
            <div className="register-field" style={{ marginBottom: 18 }}>
              <label className="register-label">
                Gender <span className="register-required">*</span>
              </label>
              <div
                className="register-gender-options"
                style={{ display: "flex", gap: 24, marginTop: 4 }}
              >
                <label
                  className="register-radio-label"
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <input
                    type="radio"
                    name="sex"
                    value="Male"
                    checked={formData.sex === "Male"}
                    onChange={handleChange}
                    className="register-radio-input"
                  />
                  <span className="register-radio-text">Male</span>
                </label>
                <label
                  className="register-radio-label"
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <input
                    type="radio"
                    name="sex"
                    value="Female"
                    checked={formData.sex === "Female"}
                    onChange={handleChange}
                    className="register-radio-input"
                  />
                  <span className="register-radio-text">Female</span>
                </label>
              </div>
              {errors.sex && (
                <div className="register-error-message">{errors.sex}</div>
              )}
            </div>
            <div className="register-field" style={{ marginBottom: 18 }}>
              <label className="register-label" htmlFor="birthday">
                Birthday <span className="register-required">*</span>
              </label>
              <div
                className="register-field-wrapper"
                style={{ alignItems: "center" }}
              >
                <MdCake className="register-input-icon" />
                <input
                  type="date"
                  id="birthday"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                  className="register-input register-date-input"
                  style={{ width: "100%" }}
                />
              </div>

              {errors.birthday && (
                <div className="register-error-message">{errors.birthday}</div>
              )}
              <h6 className="register-optional-label">
                (You must be at least 18 years old to register)
              </h6>
            </div>
          </div>
        </div>

        <div className="register-button-wrapper">
          <button
            className="register-submit-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "SIGNING UP..." : "VERIFY YOUR EMAIL"}
          </button>
        </div>

        <div className="register-back-link">
          <Link to="/login" className="register-link">
            Already have an account? Login here
          </Link>
        </div>
      </form>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
