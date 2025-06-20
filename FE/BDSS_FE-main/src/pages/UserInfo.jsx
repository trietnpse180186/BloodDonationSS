import React, { useEffect, useState } from "react";
import Navbar from "../assets/navbar";
import "./UserInfo.css";
import Footer from "../assets/footer";
import getUserById from "../assets/getUserById";
import { Link } from "react-router";
import { IoMdMale, IoMdFemale } from "react-icons/io";

function GenderIcon({ sex }) {
  console.log("Giá trị sex:", sex);
  if (sex === "MALE") return <IoMdMale style={{ color: "#1976d2" }} />;
  if (sex === "FEMALE") return <IoMdFemale style={{ color: "#e91e63" }} />;
  return null;
}

function UserInfo({ userId }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getUserById(userId).then(setUser).catch(setError);
  }, [userId]);

  function formatDate(dateStr) {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  }

  if (error) return <p>Lỗi: {error.message}</p>;
  if (!user) return <p>Đang tải dữ liệu...</p>;

  return (
    <>
      <Navbar />
      <div className="userinfo-container">
        <div className="userinfo-content">
          <h2>USER PROFILE</h2>
          <div className="content-group-first">
            <p>
              <strong style={{ fontSize: "1.1rem" }}>Full Name:</strong>{" "}
              {user.fullName}
            </p>
            <p>
              <strong style={{ fontSize: "1.1rem" }}>Birthday:</strong>{" "}
              {formatDate(user.birthday)}
            </p>
          </div>
          <p>
            <strong style={{ fontSize: "1.1rem" }}>Gender:</strong>{" "}
            <GenderIcon sex={user.sex} />
          </p>
          <p>
            <strong style={{ fontSize: "1.1rem" }}>Address:</strong>{" "}
            {user.address}
          </p>
          <p>
            <strong style={{ fontSize: "1.1rem" }}>Email:</strong> {user.email}
          </p>

          <p>
            <strong style={{ fontSize: "1.1rem" }}>Occupation:</strong>{" "}
            {user.occupation}
          </p>
          <p>
            <strong style={{ fontSize: "1.1rem" }}>Phone Number:</strong>{" "}
            {user.phoneNumber}
          </p>
        </div>
        <div className="userinfo-report">
          <h2>{user.bloodType}</h2>
        </div>
        <div className="userinfo-sidebar">
          <Link to="/">Report</Link>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default UserInfo;
