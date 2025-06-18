import React from "react";
import "./BloodDonationInfo.css";

export default function BloodDonationInfo() {
  const user = {
    name: "TRẦN HOÀNG TRUNG HIẾU",
    cmnd: "",
    cccd: "033204008316",
    passport: "",
    dob: "19/10/2004",
    gender: "Nam",
    job: "Học viên",
    unit: "",
    bloodGroup: "-",
    address: "472, khu phố Đông Ba, Phường Bình Hòa, Thành Phố Thuận An, Tỉnh Bình Dương",
    phone: "0963832382",
    phone2: "",
    email: "thth19102004@gmail.com"
  };

  const onRegister = () => {
    alert("Đi đến form đăng ký hiến máu...");
  };

  return (
    <div className="donation-info-container">
      <h2>Thông tin đăng ký hiến máu</h2>

      <div className="donation-grid">
        {/* Thông tin cá nhân */}
        <div className="info-card">
          <h3>Thông tin cá nhân</h3>
          <p><strong>Họ và tên:</strong> {user.name}</p>
          <p><strong>Số CMND:</strong> {user.cmnd || "-"}</p>
          <p><strong>Số CCCD:</strong> {user.cccd}</p>
          <p><strong>Số hộ chiếu:</strong> {user.passport || "-"}</p>
          <p><strong>Ngày sinh:</strong> {user.dob}</p>
          <p><strong>Giới tính:</strong> {user.gender}</p>
          <p><strong>Nghề nghiệp:</strong> {user.job}</p>
          <p><strong>Đơn vị:</strong> {user.unit || "-"}</p>
          <p><strong>Nhóm máu:</strong> {user.bloodGroup || "-"}</p>
        </div>

        {/* Phiếu đăng ký hiến máu */}
        <div className="form-status-card">
          <h3>Phiếu đăng ký hiến máu</h3>
          <div className="form-placeholder">
            <img src="/form-icon.png" alt="Form icon" />
            <p>Chưa có phiếu đăng ký hiến máu</p>
          </div>
        </div>

        {/* Thông tin liên hệ */}
        <div className="info-card">
          <h3>Thông tin liên hệ</h3>
          <p><strong>Địa chỉ liên hệ:</strong> {user.address}</p>
          <p><strong>Điện thoại di động:</strong> {user.phone}</p>
          <p><strong>Điện thoại bàn:</strong> {user.phone2 || "-"}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      </div>

      <div className="button-container">
        <button onClick={onRegister}>Đăng ký hiến máu</button>
      </div>
    </div>
  );
}
