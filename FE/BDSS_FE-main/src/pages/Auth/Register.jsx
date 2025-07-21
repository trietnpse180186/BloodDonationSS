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
    bloodType: "",
    occupation: "",
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
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits.";
    }

    // Age validation
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
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/users",
        formData
      );
      toast.success("Registration successful!");
      setTimeout(() => {
        setLoading(false);
        navigate("/login");
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
        <div className="register-flex-row">
          <div className="register-account">
            <h4 className="register-section-title">Account Information</h4>

            {/* Email field */}
            <div className="register-field">
              <h6 className="register-label">
                Email <span className="register-required">*</span>
              </h6>
              <div className="register-field-wrapper">
                <FaEnvelope className="register-input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email *"
                  value={formData.email}
                  onChange={handleChange}
                  className="register-input"
                />
              </div>
              {errors.email && (
                <div className="register-error-message">{errors.email}</div>
              )}
            </div>

            {/* Password field */}
            <div className="register-field">
              <h6 className="register-label">
                Password <span className="register-required">*</span>
              </h6>
              <div className="register-field-wrapper">
                <PasswordInput
                  value={formData.password}
                  name="password"
                  onChange={handleChange}
                />
              </div>
              <div
                className="register-password-hints"
                style={{ color: passwordHintColor }}
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

            {/* Confirm Password field */}
            <div className="register-field">
              <h6 className="register-label">
                Confirm Password <span className="register-required">*</span>
              </h6>
              <div className="register-field-wrapper">
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

          <div className="register-profile">
            <h4 className="register-section-title">Profile Information</h4>

            {/* Full Name field */}
            <div className="register-field">
              <h6 className="register-label">
                Full Name <span className="register-required">*</span>
              </h6>
              <div className="register-field-wrapper">
                <FaUserEdit className="register-input-icon" />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name *"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="register-input"
                />
              </div>
              {errors.fullName && (
                <div className="register-error-message">{errors.fullName}</div>
              )}
            </div>

            {/* Gender field */}
            <div className="register-field">
              <h6 className="register-label">
                Gender <span className="register-required">*</span>
              </h6>
              <div className="register-gender-options">
                <label className="register-radio-label">
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
                <label className="register-radio-label">
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

            {/* Birthday field */}
            <div className="register-field">
              <h6 className="register-label">
                Birthday <span className="register-required">*</span>
              </h6>
              <div className="register-field-wrapper">
                <MdCake className="register-input-icon" />
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                  className="register-input register-date-input"
                />
              </div>
              {errors.birthday && (
                <div className="register-error-message">{errors.birthday}</div>
              )}
            </div>

            {/* Phone Number field */}
            <div className="register-field">
              <h6 className="register-label">
                Phone Number <span className="register-required">*</span>
              </h6>
              <div className="register-field-wrapper">
                <FaPhone className="register-input-icon" />
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Enter your phone number *"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="register-input"
                />
              </div>
              {errors.phoneNumber && (
                <div className="register-error-message">
                  {errors.phoneNumber}
                </div>
              )}
            </div>

            {/* Optional fields */}
            <h6 className="register-optional-label">
              The following fields are optional. You can complete them later in
              your profile.
            </h6>

            <div className="register-field">
              <div className="register-field-wrapper">
                <FaLocationDot className="register-input-icon" />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  className="register-input"
                />
              </div>
            </div>

            <div className="register-field">
              <div className="register-field-wrapper">
                <select
                  name="bloodType"
                  value={formData.bloodType || ""}
                  onChange={handleChange}
                  className="register-select"
                >
                  <option value="" disabled>
                    Select Blood Type
                  </option>
                  <option value="A_POSITIVE">A+</option>
                  <option value="A_NEGATIVE">A-</option>
                  <option value="B_POSITIVE">B+</option>
                  <option value="B_NEGATIVE">B-</option>
                  <option value="AB_POSITIVE">AB+</option>
                  <option value="AB_NEGATIVE">AB-</option>
                  <option value="O_POSITIVE">O+</option>
                  <option value="O_NEGATIVE">O-</option>
                </select>
              </div>
            </div>

            <div className="register-field">
              <div className="register-field-wrapper">
                <MdWork className="register-input-icon" />
                <input
                  type="text"
                  name="occupation"
                  placeholder="Occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  className="register-input"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="register-button-wrapper">
          <button
            className="register-submit-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "SIGNING UP..." : "SIGN UP"}
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
