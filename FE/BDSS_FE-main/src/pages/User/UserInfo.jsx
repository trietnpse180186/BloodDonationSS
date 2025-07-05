import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import "./UserInfo.css";
import Footer from "../../components/footer";
import getUserById, { getUserIdFromToken } from "../../assets/getUserById";
import { IoMdMale, IoMdFemale } from "react-icons/io";
import { FaPenToSquare } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

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
  const userIdFromToken = getUserIdFromToken();
  const navigate = useNavigate();

  useEffect(() => {
    getUserById(userId).then(setUser).catch(setError);
  }, [userId]);

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
