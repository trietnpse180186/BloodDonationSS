import React, { useState } from "react";
import "./BloodDonationInfo.css";
import { Link } from "react-router-dom";
import AppointmentDetail from "./AppointmentDetail";
import Navbar from "../assets/navbar";
import bloodRegister from "../assets/bloodRegister";
export default function BloodDonationInfo({answers}) {
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

  // Danh sách lịch hẹn mẫu
  const appointments = [
    {
      id: 1,
      location: "466 Nguyễn Thị Minh Khai (thời gian làm việc từ 7g đến 11g)",
      address: "466 Nguyễn Thị Minh Khai Phường 02, Quận 3, Tp Hồ Chí Minh",
      time: "07:00 đến 11:00 - 14/06/2025",
      status: "Đã xoá"
    },
    {
      id: 2,
      location: "Trung tâm Truyền máu Chợ Rẫy (Cổng số 6)",
      address: "Cổng số 6 - Bệnh viện Chợ Rẫy, đường Triệu Quang Phục, Phường 12, Quận 5, Tp Hồ Chí Minh",
      time: "07:00 đến 11:00 - 26/05/2025",
      status: "Đã xoá"
    }
  ];

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [reviews, setReviews] = useState({});
  return (
    <>
    <Navbar />
    <div className="donation-info-container">
      <h2>Thông tin đăng ký hiến máu</h2>

      <div className="donation-grid">
        {/* Thông tin cá nhân */}
        <div className="info-1">
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
          <div className="info-contact">
            <h3>Thông tin liên hệ</h3>
            <p><strong>Địa chỉ liên hệ:</strong> {user.address}</p>
            <p><strong>Điện thoại di động:</strong> {user.phone}</p>
            <p><strong>Điện thoại bàn:</strong> {user.phone2 || "-"}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        </div>

        {/* Lịch sử đặt hẹn */}
        <div className="info-2">
          <div className="appointment-list">
            <h2>Lịch sử đặt hẹn</h2>
            {appointments.length === 0 ? (
              <div>Chưa có lịch sử đặt hẹn</div>
            ) : (
              appointments.map((appointment) => (
                <div className="appointment-card" key={appointment.id}>
                  <div className="icon">
                    <img src="/blood-drop-icon.png" alt="Hiến máu" />
                    <p>Hiến máu</p>
                  </div>
                  <div className="info">
                    <strong className="location" style={{ color: "#b30000" }}>
                      {appointment.location}
                    </strong>
                    <p><i className="fa fa-map-marker-alt"></i> {appointment.address}</p>
                    <p><i className="fa fa-clock"></i> {appointment.time}</p>
                  </div>
                  <span className="badge" style={{ backgroundColor: "#d9534f" }}>{appointment.status}</span>
                      {reviews[appointment.id] && (
                        <div className="review-result">
                          <strong>Đánh giá của bạn:</strong>
                          <div>
                            <p>{reviews[appointment.id].review}</p>
                            {reviews[appointment.id].rating
                              ? "★".repeat(reviews[appointment.id].rating)
                              : ""}
                            {reviews[appointment.id].rating
                              ? ""
                              : ""}
                          </div>
                        </div>
                      )}
                  <div className="actions">
                    <button onClick={() => setSelectedAppointment(appointment)}>
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="view-survey">
            <h3>Khảo sát đăng ký hiến máu</h3>
            {bloodRegister.map(q => {
              const answer = answers?.[q.id];
              const selectedOption = q.options.find(opt => opt.value === answer?.value);
              return (
                <div key={q.id} style={{ marginBottom: 16 }}>
                  <strong>{q.text}</strong>
                  <div style={{ marginLeft: 16, color: "#b30000" }}>
                    {selectedOption
                      ? selectedOption.label +
                        (selectedOption.hasInput && answer?.input
                          ? `: ${answer.input}`
                          : "")
                      : <i>Chưa trả lời</i>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>  
      </div>
      {selectedAppointment && (
        <div className="modal" onClick={() => setSelectedAppointment(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedAppointment(null)}>&times;</button>
            <AppointmentDetail
              appointment={selectedAppointment}
              saveReview={reviews[selectedAppointment.id] || ""}
              setSavedReview={review => {
                setReviews(prev => ({
                  ...prev,
                  [selectedAppointment.id]: review
                }));
              }}
              onClose={() => setSelectedAppointment(null)}
            />
          </div>
        </div>
      )}
    </div>
    </>
  );
}