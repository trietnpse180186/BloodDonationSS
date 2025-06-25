import React, { useState, useEffect } from "react";
import "./BloodDonationInfo.css";
import { useLocation, useNavigate } from "react-router-dom";
import AppointmentDetail from "./AppointmentDetail";
import Navbar from "../assets/navbar";
import bloodRegister, { getLabelByValue } from "../assets/bloodRegister";
import LogoCenter from "../images/logocenter.jpg";
import axios from "axios";
import getUserById, { getUserIdFromToken } from "../assets/getUserById";
import Footer from "../assets/footer";
import { IoMdMale, IoMdFemale } from "react-icons/io";

function GenderIcon({ sex }) {
  if (!sex) return null;
  if (sex.toUpperCase() === "MALE")
    return (
      <>
        <IoMdMale style={{ color: "#1976d2" }} /> Nam
      </>
    );
  if (sex.toUpperCase() === "FEMALE")
    return (
      <>
        <IoMdFemale style={{ color: "#e91e63" }} /> Nữ
      </>
    );
  return null;
}

export default function BloodDonationInfo({ answers }) {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state?.bookingData;
  const surveyData = location.state?.surveyData;

  // Lấy userId từ token
  const userIdFromToken = getUserIdFromToken();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (userIdFromToken) {
      getUserById(userIdFromToken)
        .then(setUser)
        .catch(() => setUser(null));
    }
  }, [userIdFromToken]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const renderUserData = () => {
    if (!user)
      return (
        <div className="info-card">
          <h3>Thông tin cá nhân</h3>
          <p>Không có thông tin người dùng.</p>
        </div>
      );
    function formatDate(dateStr) {
      if (!dateStr) return "";
      const [year, month, day] = dateStr.split("-");
      return `${day}/${month}/${year}`;
    }
    return (
      <div className="info-card">
        <h3>Thông tin cá nhân</h3>
        <p>
          <strong>Họ và tên:</strong> {user.fullName}
        </p>
        <p>
          <strong>Giới tính:</strong> <GenderIcon sex={user.sex} />
        </p>
        <p>
          <strong>Ngày sinh:</strong> {formatDate(user.birthday)}
        </p>
        <p>
          <strong>Địa chỉ:</strong> {user.address}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Nghề nghiệp:</strong> {user.occupation}
        </p>
        <p>
          <strong>Số điện thoại:</strong> {user.phoneNumber}
        </p>
        <p>
          <strong>Nhóm máu:</strong> {user.bloodType}
        </p>
      </div>
    );
  };

  const renderBookingData = () => {
    if (!bookingData) return <div>Không có thông tin đặt lịch.</div>;
    return (
      <div className="info-card">
        <h3>Thông tin đặt lịch</h3>
        <p>
          <strong>Ngày:</strong> {bookingData.date}
        </p>
        <p>
          <strong>Địa điểm:</strong> {bookingData.location}
        </p>
        <p>
          <strong>Trung tâm:</strong> {bookingData.center}
        </p>
        <p>
          <strong>Khung giờ:</strong> {bookingData.timeSlot}
        </p>
      </div>
    );
  };

  const renderSurveyData = () => {
    if (!surveyData) return <div>Không có thông tin khảo sát.</div>;
    return (
      <div className="info-card">
        <h3>Khảo sát đăng ký hiến máu</h3>
        {surveyData.map((q, idx) => (
          <div key={q.questionId} style={{ marginBottom: 10 }}>
            <i>
              {bloodRegister.find((bq) => bq.id === q.questionId)?.text ||
                `Câu hỏi ${idx + 1}`}
            </i>
            <div style={{ marginLeft: 16, color: "#b30000" }}>
              {getLabelByValue(q.questionId, q.answer)}
              {q.input ? `: ${q.input}` : ""}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Hàm xác nhận đặt lịch
  const handleConfirmBooking = async () => {
    if (!bookingData || !surveyData) {
      alert("Vui lòng cung cấp đầy đủ thông tin đặt lịch và khảo sát.");
      return;
    }

    const payload = {
      booking: bookingData,
      survey: surveyData,
    };

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/booking/create",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );
      alert("Đặt lịch thành công!");
      navigate("/");
    } catch (error) {
      alert("Đặt lịch thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="donation-info-container">
        <h2>Thông tin đăng ký hiến máu</h2>
        <div className="donation-grid">
          <div className="info-1">
            {renderUserData()}
            {renderBookingData()}
          </div>
          <div className="info-2">{renderSurveyData()}</div>
        </div>
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <button
            className="button-style"
            onClick={handleConfirmBooking}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang xác nhận..." : "Xác nhận đặt lịch"}
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
