import React, { useState, useEffect } from "react";
import {
  FaUserEdit,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaBriefcase,
  FaSpinner,
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

  return (
    <>
      <div className="update-page">
        <form className="form" onSubmit={handleSubmit}>
          <h1>EDIT YOUR PROFILE</h1>

          <div className="field-wrapper avatar-upload-wrapper">
            <div className="avatar-upload-label">
              <label>Upload Avatar:</label>
              <label className="custom-file-btn">
                Choose File
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </label>
              <span className="selected-file-name">
                {selectedFileName || "No file chosen"}
              </span>
            </div>
            {avatarPreview && (
              <div className="avatar-preview">
                <img src={avatarPreview} alt="Avatar Preview" />
              </div>
            )}
          </div>

          <div className="field-wrapper">
            <FaUserEdit className="input-icon" />
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="field-wrapper">
            <MdCake className="input-icon" />
            <input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
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
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>

          <div className="field-wrapper">
            <FaMapMarkerAlt className="input-icon" />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="field-wrapper">
            <select
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

          <div className="field-wrapper">
            <FaBriefcase className="input-icon" />
            <input
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
            />
          </div>

          <div className="field-wrapper-btn">
            <button className="wrap-submit" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <FaSpinner className="loading-spinner" /> Saving...
                </>
              ) : (
                "SAVE CHANGES"
              )}
            </button>
          </div>

          <br />
          <Link to="/user-profile">Back</Link>
        </form>
      </div>
      <ToastContainer position="top-center" autoClose={2000} />
    </>
  );
}
