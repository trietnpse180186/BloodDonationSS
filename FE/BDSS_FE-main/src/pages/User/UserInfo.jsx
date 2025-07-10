import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import "./UserInfo.css";
import Footer from "../../components/footer";
import getUserById, { getUserIdFromToken } from "../../assets/getUserById";
import { IoMdMale, IoMdFemale } from "react-icons/io";
import { FaPenToSquare } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

function GenderIcon({ sex }) {
  if (sex.toUpperCase() === "MALE")
    return (
      <>
        <IoMdMale style={{ color: "#1976d2" }} />
        <p>Male</p>
      </>
    );
  if (sex.toUpperCase() === "FEMALE")
    return (
      <>
        <IoMdFemale style={{ color: "#e91e63" }} />
        <p>Female</p>
      </>
    );
  return null;
}

function UserInfo({ userId }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const userIdFromToken = getUserIdFromToken();
  const navigate = useNavigate();

  useEffect(() => {
    getUserById(userId).then(setUser).catch(setError);
  }, [userId]);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/users/delete/${userIdFromToken}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");
      toast.success("Account deleted successfully");
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error(error?.response?.data?.message || "Failed to delete account");
    }
  };

  function formatDate(dateStr) {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  }

  if (error) return <p>Error: {error.message}</p>;
  if (!user) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="userinfo-container">
        <div className="userinfo-content">
          <div className="userinfo-header">
            <h1>USER PROFILE</h1>
            <Button onClick={() => navigate(`/user/update/${userIdFromToken}`)}>
              <FaPenToSquare />
            </Button>
          </div>
          <p>
            <strong style={{ fontSize: "1.1rem" }}>Full Name:</strong>{" "}
            {user.fullName}
          </p>
          <p>
            <strong style={{ fontSize: "1.1rem" }}>Gender:</strong>{" "}
            <GenderIcon sex={user.sex} />
          </p>
          <p>
            <strong style={{ fontSize: "1.1rem" }}>Birthday:</strong>{" "}
            {formatDate(user.birthday)}
          </p>

          <p>
            <strong style={{ fontSize: "1.1rem" }}>Address:</strong>{" "}
            {user.address ?? <span style={{ color: "#888" }}>N/A</span>}
          </p>
          <p>
            <strong style={{ fontSize: "1.1rem" }}>Email:</strong>{" "}
            {user.email ?? <span style={{ color: "#888" }}>N/A</span>}
          </p>
          <p>
            <strong style={{ fontSize: "1.1rem" }}>Occupation:</strong>{" "}
            {user.occupation ?? <span style={{ color: "#888" }}>N/A</span>}
          </p>
          <p>
            <strong style={{ fontSize: "1.1rem" }}>Phone Number:</strong>{" "}
            {user.phoneNumber ?? <span style={{ color: "#888" }}>N/A</span>}
          </p>
          <Button variant="danger" onClick={() => setShowConfirm(true)}>
            Delete Account{" "}
          </Button>
          {showConfirm && (
            <div
              style={{
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: 8,
                padding: 24,
                marginTop: 16,
                boxShadow: "0 2px 8px #0002",
                zIndex: 100,
                maxWidth: 320,
              }}
            >
              <p style={{ color: "#b30000", fontWeight: "bold" }}>
                Are you sure you want to delete your account? This action cannot
                be undone.
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                <Button variant="danger" onClick={handleDelete}>
                  Yes, Delete
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="userinfo-report">
          <h1> USER REPORT</h1>
          <p>
            Blood Type:{" "}
            {user.bloodType ?? <span style={{ color: "#888" }}>N/A</span>}
          </p>
        </div>
      </div>
      {user && user.id && <Link to={`/users/${userId}`}>Go to user</Link>}
      <Footer />
    </>
  );
}

export default UserInfo;
