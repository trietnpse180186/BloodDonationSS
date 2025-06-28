import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Sửa import
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
export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    birthday: "",
    sex: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
    bloodType: "",
    occupation: "",
  });

  const navigate = useNavigate(); // Thêm dòng này

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

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/users",
        formData
      );
      toast.success("Registration successful!");
      setTimeout(() => {
        navigate("/login");
      }, 1500); // Chờ toast hiện rồi chuyển trang
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please check your information.");
    }
  };

  return (
    <div className="register-page">
      <form className="form" onSubmit={handleSubmit}>
        <h1>REGISTER</h1>

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
          <input
            type="date"
            name="birthday"
            value={formData.birthday}
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

        <div className="field-wrapper">
          <FaPhoneAlt className="input-icon" />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field-wrapper">
          <FaMapMarkerAlt className="input-icon" />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field-wrapper">
          <select
            name="bloodType"
            value={formData.bloodType}
            onChange={handleChange}
            required
          >
            <option value="">Choose blood type </option>
            <option value="A_POSITIVE">A+</option>
            <option value="A_NEGATIVE">A-</option>
            <option value="B_POSITIVE">B+</option>
            <option value="B_NEGATIVE">B-</option>
            <option value="O_POSITIVE">O+</option>
            <option value="O_NEGATIVE">O-</option>
            <option value="AB_POSITIVE">AB+</option>
            <option value="AB_NEGATIVE">AB-</option>
          </select>
        </div>

        <div className="field-wrapper">
          <FaBriefcase className="input-icon" />
          <input
            type="text"
            name="occupation"
            placeholder="Occupation"
            value={formData.occupation}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div
          className="field-wrapper-btn"
          data-aos="fade-up"
          data-aos-duration="500"
          data-aos-easing="ease-in-out"
        >
          <button className="wrap-submit" type="submit">
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
