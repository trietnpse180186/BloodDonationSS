import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../assets/navbar";
import Footer from "../assets/footer";
import axios from "axios";
import { toast } from "react-toastify";

export default function BookingConfirm() {
  const location = useLocation();
  const navigate = useNavigate();

  const bookingData = location.state?.bookingData;
  const surveyData = location.state?.surveyData;

  const [isSubmitting, setIsSubmitting] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!bookingData || !surveyData) {
      toast.error("Dữ liệu không hợp lệ. Vui lòng thực hiện lại.");
      navigate("/blood-registration");
      return;
    }

    const payload = {
      booking: {
        scheduleId: "demo-123",
        date: bookingData.date,
        location: bookingData.location,
        center: bookingData.center,
        timeSlot: bookingData.timeSlot,
      },
      survey: surveyData.map((q) => ({
        questionId: q.questionId,
        answer: q.answer,
        additionalInfo: q.input || "",
      })),
    };

    axios
      .post("http://localhost:8080/api/booking/create", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        setResult(res.data);
        toast.success("Đặt lịch thành công!");
      })
      .catch((err) => {
        toast.error("Có lỗi xảy ra khi đặt lịch.");
        console.error("Booking error:", err);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }, [bookingData, surveyData, navigate]);

  if (isSubmitting) {
    return (
      <>
        <Navbar />
        <div className="bloodform-container">
          <h2>Đang gửi yêu cầu đặt lịch...</h2>
        </div>
        <Footer />
      </>
    );
  }

  if (!result) {
    return (
      <>
        <Navbar />
        <div className="bloodform-container">
          <h2>Đặt lịch thất bại</h2>
          <p>Vui lòng thử lại hoặc kiểm tra kết nối.</p>
          <button className="button-style" onClick={() => navigate("/")}>
            Quay lại Trang chủ
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bloodform-container">
        <h2 className="bloodform-title">Xác nhận Đăng ký</h2>
        <div className="confirm-info">
          <h3>Cảm ơn bạn đã đăng ký hiến máu!</h3>
          <ul>
            <li>
              <strong>Ngày:</strong> {result.dateDonation}
            </li>
            <li>
              <strong>Địa điểm:</strong> {result.address}
            </li>
            <li>
              <strong>Thời gian:</strong> {result.startTime} - {result.endTime}
            </li>
          </ul>
          <button className="button-style" onClick={() => navigate("/")}>
            Quay lại Trang chủ
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
