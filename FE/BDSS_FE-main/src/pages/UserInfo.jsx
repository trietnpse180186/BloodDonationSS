// src/components/UserInfo.jsx
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Navbar from "../assets/navbar";
import "./UserInfo.css";
import Footer from "../assets/footer";

const UserInfo = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch (err) {
      console.error("Token không hợp lệ:", err);
    }
  }, []);

  if (!user) {
    return <p>Chưa đăng nhập hoặc token đã hết hạn.</p>;
  }

  return (
    <>
      <Navbar />
      <div className="userinfo-container">
        <div className="userinfo-sidebar"></div>
        <div className="userinfo-content">
          <h2>Hồ sơ người dùng</h2>
          <ul>
            <li>
              <strong>Họ tên:</strong> {user.fullName}
            </li>
            <li>
              <strong>Email:</strong> {user.email}
            </li>
            <li>
              <strong>Địa chỉ:</strong> {user.address}
            </li>
            <li>
              <strong>Giới tính:</strong> {user.sex}
            </li>
            <li>
              <strong>Nghề nghiệp:</strong> {user.occupation}
            </li>
            <li>
              <strong>Số điện thoại:</strong> {user.phoneNumber}
            </li>
            <li>
              <strong>Nhóm máu:</strong> {user.bloodType}
            </li>
            <li>
              <strong>Ngày sinh:</strong> {user.birthday}
            </li>
            <li>
              <strong>Vai trò:</strong> {user.role}
            </li>
          </ul>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserInfo;
