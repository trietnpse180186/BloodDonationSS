import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import axios from "../../assets/axiosInstance";
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
import { ClipLoader } from "react-spinners";

function PasswordInput({ value, onChange, name }) {
  const [show, setShow] = useState(false);

  return (
    <div className="input-group">
      <FaLock className="input-icon" />
      <input
        type={show ? "text" : "password"}
        placeholder="Password"
        value={value}
        name={name}
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

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    birthday: "",
    sex: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: null,
    address: null,
    bloodType: null,
    occupation: null,
  });

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    return /[A-Z]/.test(password) && /\d/.test(password) && password.length > 6;
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
    if (!formData.birthday) {
      newErrors.birthday = "Birthday is required.";
    }
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits.";
    } else {
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
      toast.error("Registration failed. Please check your information.");
    }
  };

  return (
    <div className="register-page">
      {loading && (
        <div
          style={{
            position: "fixed", // hoặc "absolute" nếu muốn chỉ phủ trong .register-page
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(255,255,255,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <ClipLoader
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
        <h1>SIGN UP</h1>
        <div className="register-flex-row">
          <div className="register-account">
            <h4>Account Information</h4>
            <div className="register-email">
              <h6>Email</h6>
              <div className="field-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && (
                <div
                  style={{ color: "red", fontSize: "0.95em", marginBottom: 8 }}
                >
                  {errors.email}
                </div>
              )}
            </div>

            <div className="register-password">
              <h6>Password</h6>
              <div className="field-wrapper">
                <FaLock className="input-icon" />
                <PasswordInput
                  value={formData.password}
                  name="password"
                  onChange={handleChange}
                />
              </div>
              <div
                style={{
                  color: passwordHintColor,
                  fontSize: "0.85em",
                  marginBottom: 8,
                }}
              >
                <ul>
                  <li>Password must contain at least 1 uppercase letter</li>
                  <li>Password must contain at least 1 number</li>
                  <li>Password must be longer than 6 characters</li>
                </ul>
              </div>
              {errors.password && (
                <div
                  style={{ color: "red", fontSize: "0.95em", marginBottom: 8 }}
                >
                  {errors.password}
                </div>
              )}
            </div>
            <div className="register-confirm-password">
              <h6>Confirm Password</h6>
              <div className="field-wrapper">
                <PasswordInput
                  value={formData.confirmPassword}
                  name="confirmPassword"
                  onChange={handleChange}
                />
              </div>
              {errors.confirmPassword && (
                <div
                  style={{ color: "red", fontSize: "0.95em", marginBottom: 8 }}
                >
                  {errors.confirmPassword}
                </div>
              )}
            </div>
          </div>
          <div className="register-profile">
            <h4>Profile Information</h4>
            <div className="register-full-name">
              <h6>Full Name</h6>
              <div className="field-wrapper">
                <FaUserEdit className="input-icon" />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
              {errors.fullName && (
                <div
                  style={{ color: "red", fontSize: "0.95em", marginBottom: 8 }}
                >
                  {errors.fullName}
                </div>
              )}
            </div>
            <div className="field-wrapper-gender">
              <label>
                <input
                  type="radio"
                  name="sex"
                  value="Male"
                  checked={formData.sex === "Male"}
                  onChange={handleChange}
                />
                Male
              </label>
              <label style={{ marginLeft: "10px" }}>
                <input
                  type="radio"
                  name="sex"
                  value="Female"
                  checked={formData.sex === "Female"}
                  onChange={handleChange}
                />
                Female
              </label>
            </div>
            <div className="register-birth">
              <h6>Birthday</h6>
              <div className="field-wrapper" id="birthday">
                <MdCake className="input-icon" />
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                />
              </div>
              {errors.birthday && (
                <div
                  style={{ color: "red", fontSize: "0.95em", marginBottom: 8 }}
                >
                  {errors.birthday}
                </div>
              )}
            </div>
            <div className="register-phone">
              <h6>Phone Number</h6>
              <div className="field-wrapper">
                <FaPhone className="input-icon" />
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
              {errors.phoneNumber && (
                <div
                  style={{ color: "red", fontSize: "0.95em", marginBottom: 8 }}
                >
                  {errors.phoneNumber}
                </div>
              )}
            </div>
            <h6 style={{ color: "#888", fontWeight: 400, marginTop: 20 }}>
              The following fields are optional. You can complete them later in
              your profile.
            </h6>

            <div className="register-address">
              <div className="field-wrapper">
                <FaLocationDot className="input-icon" />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="register-blood-type">
              <div className="field-wrapper">
                <select
                  name="bloodType"
                  value={formData.bloodType || ""}
                  onChange={handleChange}
                  style={{ color: formData.bloodType ? "#333" : "#aaa" }}
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
            <div className="register-occupation">
              <div className="field-wrapper">
                <MdWork className="input-icon" />
                <input
                  type="text"
                  name="occupation"
                  placeholder="Occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="field-wrapper-btn">
          <button className="wrap-button" type="submit">
            SIGN UP
          </button>
        </div>
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
      </form>
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}
