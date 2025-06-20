// BloodDonationInfo.js
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
    job: "Thống Trị Thế Giới",
    unit: "",
    bloodGroup: "-",
    address: "472, khu phố Đông Ba, Phường Bình Hòa, Thành Phố Thuận An, Tỉnh Bình Dương",
    phone: "0963832382",
    phone2: "",
    email: "thth19102004@gmail.com"
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

        {/* Thông tin liên hệ */}
        <div className="info-card">
          <h3>Thông tin liên hệ</h3>
          <p><strong>Địa chỉ liên hệ:</strong> {user.address}</p>
          <p><strong>Điện thoại di động:</strong> {user.phone}</p>
          <p><strong>Điện thoại bàn:</strong> {user.phone2 || "-"}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>

        {/* Lịch sử đặt hẹn */}
        <div className="info-card wide-card">
          <h2>Lịch sử đặt hẹn</h2>

          <div className="appointment-list">
            {/* Lịch sử 1 */}
            <div className="appointment-card">
              <div className="icon">
                <img src="/blood-drop-icon.png" alt="Hiến máu" />
                <p>Hiến máu</p>
              </div>
              <div className="info">
                <strong className="location" style={{ color: "#b30000" }}>
                  466 Nguyễn Thị Minh Khai (thời gian làm việc từ 7g đến 11g)
                </strong>
                <p><i className="fa fa-map-marker-alt"></i> 466 Nguyễn Thị Minh Khai Phường 02, Quận 3, Tp Hồ Chí Minh</p>
                <p><i className="fa fa-clock"></i> 07:00 đến 11:00 - 14/06/2025</p>
              </div>
              <div className="actions">
                <span className="badge" style={{ backgroundColor: "#d9534f" }}>Đã xoá</span>
                <button style={{ backgroundColor: "#3366FF", color: "#fff" }}>
                  📄 Xem chi tiết
                </button>
              </div>
            </div>

            {/* Lịch sử 2 */}
            <div className="appointment-card">
              <div className="icon">
                <img src="/blood-drop-icon.png" alt="Hiến máu" />
                <p>Hiến máu</p>
              </div>
              <div className="info">
                <strong className="location" style={{ color: "#b30000" }}>
                  Trung tâm Truyền máu Chợ Rẫy (Cổng số 6)
                </strong>
                <p><i className="fa fa-map-marker-alt"></i> Cổng số 6 - Bệnh viện Chợ Rẫy, đường Triệu Quang Phục, Phường 12, Quận 5, Tp Hồ Chí Minh</p>
                <p><i className="fa fa-clock"></i> 07:00 đến 11:00 - 26/05/2025</p>
              </div>
              <div className="actions">
                <span className="badge" style={{ backgroundColor: "#d9534f" }}>Đã xoá</span>
                <button style={{ backgroundColor: "#3366FF", color: "#fff" }}>
                  📄 Xem chi tiết
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
