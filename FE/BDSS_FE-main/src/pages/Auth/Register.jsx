import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import axios from "../../assets/axiosInstance";
import {
  FaEnvelope,
  FaLock,
  FaUserEdit,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaBriefcase,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    birthday: "",
    sex: "",
    email: "",
    password: "",
    phoneNumber: null,
    address: null,
    bloodType: null,
    occupation: null,
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
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
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: 20,
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
        className="form"
        onSubmit={handleSubmit}
        style={{
          opacity: loading ? 0.5 : 1,
          pointerEvents: loading ? "none" : "auto",
        }}
      >
        <h1>REGISTER</h1>

        <div className="field-wrapper">
          <FaUserEdit className="input-icon" />
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="field-wrapper">
          <FaEnvelope className="input-icon" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field-wrapper">
          <FaLock className="input-icon" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field-wrapper-gender">
          <label>
            <input
              type="radio"
              name="sex"
              value="Male"
              checked={formData.sex === "Male"}
              onChange={handleChange}
              required
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
        <div className="field-wrapper" id="birthday">
          <h6>Birthday</h6>
          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            required
          />
        </div>
        <div className="field-wrapper">
          <input
            type="hidden"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="field-wrapper">
          <input
            type="hidden"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="field-wrapper">
          <input
            type="hidden"
            name="bloodType"
            placeholder="Blood Type"
            value={formData.bloodType}
            onChange={handleChange}
            required
          />
        </div>
        <div className="field-wrapper">
          <input
            type="hidden"
            name="occupation"
            placeholder="Occupation"
            value={formData.occupation}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div className="field-wrapper-btn">
          <button className="wrap-button" type="submit">
            REGISTER
          </button>
        </div>

        <br />
        <Link to="/">Home</Link>
      </form>
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}
