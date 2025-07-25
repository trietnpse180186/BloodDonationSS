import React, { useState, useEffect } from "react";
import {
  FaUserEdit,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaBriefcase,
  FaSpinner,
  FaArrowLeft,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../helpers/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "./UserUpdate.css";
import getUserById, { getUserIdFromToken } from "../../helpers/getUserById";
import { MdCake } from "react-icons/md";
import { uploadImageToCloudinary } from "../../helpers/uploadImageToCloudinary";

export default function UserUpdate() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    birthday: "",
    sex: "",
    email: "",
    password: null,
    phoneNumber: "",
    address: "",
    bloodType: "",
    occupation: "",
    avatarUrl: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [errors, setErrors] = useState({
    birthday: "",
    phoneNumber: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await getUserById();
        setFormData((prev) => ({
          ...prev,
          fullName: user.fullName || "",
          birthday: user.birthday || "",
          sex: user.sex || "",
          phoneNumber: user.phoneNumber || "",
          address: user.address || "",
          bloodType: user.bloodType || "",
          occupation: user.occupation || "",
          avatarUrl: user.avatarUrl || "",
        }));
        setAvatarPreview(user.avatarUrl || null);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    }
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "birthday") {
      if (!isOver18Years(value)) {
        setErrors((prev) => ({
          ...prev,
          birthday: "You must be at least 18 years old.",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          birthday: "",
        }));
      }
    }

    if (name === "phoneNumber") {
      if (!isValidPhoneNumber(value)) {
        setErrors((prev) => ({
          ...prev,
          phoneNumber: "Phone number must be exactly 10 digits.",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          phoneNumber: "",
        }));
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setSelectedFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = getUserIdFromToken();
    const token = sessionStorage.getItem("accessToken");
    if (!userId || !token) {
      toast.error("User not found or not logged in");
      return;
    }

    let formIsValid = true;
    const newErrors = { birthday: "", phoneNumber: "" };

    if (formData.birthday && !isOver18Years(formData.birthday)) {
      newErrors.birthday = "You must be at least 18 years old.";
      formIsValid = false;
    }

    if (formData.phoneNumber && !isValidPhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be exactly 10 digits.";
      formIsValid = false;
    }

    setErrors(newErrors);

    if (!formIsValid) {
      toast.error("Please correct the errors before submitting.");
      return;
    }

    try {
      setLoading(true);
      let uploadedUrl = formData.avatarUrl;
      if (avatarFile) {
        const url = await uploadImageToCloudinary(avatarFile);
        if (url) uploadedUrl = url;
      }

      const updatedData = {
        ...formData,
        avatarUrl: uploadedUrl,
      };

      await axios.put(`http://localhost:8080/users/${userId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Update successful!");
      navigate("/user-profile");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Update failed. Please check your information.");
    } finally {
      setLoading(false);
    }
  };

  const isOver18Years = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age >= 18;
  };

  const isValidPhoneNumber = (phone) => {
    return /^\d{10}$/.test(phone);
  };

  return (
    <>
      <div className="user-update-page">
        <form className="user-update-form" onSubmit={handleSubmit}>
          <h1>EDIT YOUR PROFILE</h1>

          <div className="user-update-avatar-wrapper">
            <div className="user-update-avatar-row">
              <label>Upload Avatar:</label>
              <label className="user-update-file-label">
                Choose File
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </label>
              <span className="user-update-file-name">
                {selectedFileName || "No file chosen"}
              </span>
            </div>
            {avatarPreview && (
              <div className="user-update-preview">
                <img src={avatarPreview} alt="Avatar Preview" />
              </div>
            )}
          </div>

          <div className="user-update-field">
            <FaUserEdit className="user-update-icon" />
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
            />
          </div>

          <div className="user-update-field">
            <MdCake className="user-update-icon" />
            <input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
            />
            {errors.birthday && (
              <div className="user-update-error">{errors.birthday}</div>
            )}
          </div>

          <div className="user-update-gender-wrapper">
            <div className="user-update-gender-option">
              <input
                id="male-radio"
                type="radio"
                name="sex"
                value="Male"
                checked={formData.sex === "Male"}
                onChange={handleChange}
              />
              <label htmlFor="male-radio">Male</label>
            </div>
            <div className="user-update-gender-option">
              <input
                id="female-radio"
                type="radio"
                name="sex"
                value="Female"
                checked={formData.sex === "Female"}
                onChange={handleChange}
              />
              <label htmlFor="female-radio">Female</label>
            </div>
          </div>

          <div className="user-update-field">
            <FaPhoneAlt className="user-update-icon" />
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number (10 digits)"
            />
            {errors.phoneNumber && (
              <div className="user-update-error">{errors.phoneNumber}</div>
            )}
          </div>

          <div className="user-update-field">
            <FaMapMarkerAlt className="user-update-icon" />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
            />
          </div>

          <div className="user-update-field">
            <select
              className="user-update-select"
              name="bloodType"
              value={formData.bloodType}
              onChange={handleChange}
            >
              <option value="">Choose blood type</option>
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

          <div className="user-update-field">
            <FaBriefcase className="user-update-icon" />
            <input
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              placeholder="Occupation"
            />
          </div>

          <div className="user-update-button-wrapper">
            <button
              className="user-update-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="user-update-spinner" /> Saving...
                </>
              ) : (
                "SAVE CHANGES"
              )}
            </button>
          </div>

          <Link className="user-update-back" to="/user-profile">
            <FaArrowLeft /> Back to Profile
          </Link>
        </form>
      </div>
      <ToastContainer position="top-center" autoClose={2000} />
    </>
  );
}
