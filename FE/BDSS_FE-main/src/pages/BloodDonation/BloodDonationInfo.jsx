import React, { useState, useEffect } from "react";
import "./BloodDonationInfo.css";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import bloodRegister, { getLabelByValue } from "../../helpers/bloodRegister";
import axios from "../../helpers/axiosInstance";
import getUserById, { getUserIdFromToken } from "../../helpers/getUserById";
import Footer from "../../components/footer";
import { IoMdMale, IoMdFemale } from "react-icons/io";
import { baseUrl } from "../../Utils/baseUrl";

function GenderIcon({ sex }) {
  if (!sex) return null;
  if (sex.toUpperCase() === "MALE")
    return (
      <>
        <IoMdMale style={{ color: "#1976d2" }} /> Male
      </>
    );
  if (sex.toUpperCase() === "FEMALE")
    return (
      <>
        <IoMdFemale style={{ color: "#e91e63" }} /> Female
      </>
    );
  return null;
}

function formatDateToIso(dateStr) {
  if (!dateStr) return "";
  // Nếu đã đúng ISO yyyy-MM-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  // Nếu là dạng dd/MM/yyyy hoặc dd-MM-yyyy
  if (/^\d{2}[\/-]\d{2}[\/-]\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split(/\/|-/);
    return `${year}-${month}-${day}`;
  }
  return dateStr;
}

export default function BloodDonationInfo({ answers }) {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state?.bookingData;
  const surveyData = location.state?.surveyData;

  // Get userId from token
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
    // Không bọc thêm div.info-card nữa
    if (!user) return <p>No user information found.</p>;

    function formatDate(dateStr) {
      if (!dateStr) return "";
      const [year, month, day] = dateStr.split("-");
      return `${day}/${month}/${year}`;
    }

    // Chỉ trả về nội dung, không bọc thêm div.info-card nữa
    return (
      <>
        <h3>User Information</h3>
        <p>
          <strong>Full Name:</strong>
          <span className="info-value">{user.fullName}</span>
        </p>
        <p>
          <strong>Gender:</strong>
          <span className="info-value">
            <GenderIcon sex={user.sex} />
          </span>
        </p>
        <p>
          <strong>Date of Birth:</strong>
          <span className="info-value">{formatDate(user.birthday)}</span>
        </p>
        <p>
          <strong>Address:</strong>
          <span className="info-value">{user.address}</span>
        </p>
        <p>
          <strong>Email:</strong>
          <span className="info-value">{user.email}</span>
        </p>
        <p>
          <strong>Occupation:</strong>
          <span className="info-value">{user.occupation}</span>
        </p>
        <p>
          <strong>Phone Number:</strong>
          <span className="info-value">{user.phoneNumber}</span>
        </p>
        <p>
          <strong>Blood Type:</strong>
          <span className="info-value">{user.bloodType}</span>
        </p>
      </>
    );
  };

  const renderBookingData = () => {
    if (!bookingData) return <div>No booking information.</div>;

    // Chỉ trả về nội dung, không bọc thêm div.info-card-booking nữa
    return (
      <>
        <h3>Booking Information</h3>
        <p>
          <strong>Date:</strong>
          <span className="info-value">{bookingData.date}</span>
        </p>
        <p>
          <strong>Location:</strong>
          <span className="info-value">{bookingData.location}</span>
        </p>
        <p>
          <strong>Center:</strong>
          <span className="info-value">{bookingData.center}</span>
        </p>
        <p>
          <strong>Time Slot:</strong>
          <span className="info-value">
            {bookingData.timeSlot.startTime} - {bookingData.timeSlot.endTime}
          </span>
        </p>
      </>
    );
  };

  const renderSurveyData = () => {
    if (!surveyData) return <div>No survey information.</div>;
    // Loại bỏ div.info-card-survey bên ngoài
    return (
      <>
        <h3>Blood Donation Survey</h3>
        {surveyData.map((q, idx) => (
          <div key={q.questionId} style={{ marginBottom: 10 }}>
            <i className="question">
              {bloodRegister.find((bq) => bq.id === q.questionId)?.text ||
                `Question ${idx + 1}`}
            </i>
            {/* Thay đổi màu đỏ sang xanh */}
            <div
              className="answer"
              style={{ marginLeft: 16, color: "#2c5282" }}
            >
              {getLabelByValue(q.questionId, q.answer)}
              {q.additionalInfo ? `: ${q.additionalInfo}` : ""}
            </div>
          </div>
        ))}
      </>
    );
  };

  const handleConfirmBooking = async () => {
    if (!bookingData || !surveyData) {
      alert("Please provide complete booking and survey information.");
      return;
    }

    const payload = {
      booking: {
        ...bookingData,
        date: formatDateToIso(bookingData.date),
        timeSlot: bookingData.timeSlot.id,
      },
      survey: surveyData,
    };

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${baseUrl}/api/booking/create`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );
      alert("Booking successful!");
      navigate("/appointment-detail");
    } catch (error) {
      console.error("Booking error:", error, error?.response?.data);
      alert(
        "Booking failed. " +
          (error?.response?.data?.message
            ? error.response.data.message
            : "Please try again.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Phần return của component
  return (
    <>
      <Navbar />
      <div className="donation-info-container">
        <h2>Blood Donation Registration Confirmation</h2>

        {/* Summary box */}
        <div className="booking-summary">
          <div className="summary-icon">
            <i className="fas fa-calendar-check"></i>
          </div>
          <div className="summary-content">
            <h3>Booking Summary</h3>
            <p>
              <strong>{bookingData?.center}</strong> • {bookingData?.date} •{" "}
              {bookingData?.timeSlot?.startTime} -{" "}
              {bookingData?.timeSlot?.endTime}
            </p>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="booking-progress">
          <div className="progress-step completed">1. Select Date</div>
          <div className="progress-step completed">2. Complete Survey</div>
          <div className="progress-step active">3. Review & Confirm</div>
        </div>

        {/* Appointment Details */}
        <h3 className="section-title">1. Appointment Details</h3>
        <div className="info-card-booking highlight-card">
          {renderBookingData()}
        </div>

        {/* Personal Information */}
        <h3 className="section-title">2. Personal Information</h3>
        <div className="info-card">{renderUserData()}</div>

        {/* Health Questionnaire */}
        <h3 className="section-title">3. Health Questionnaire</h3>
        <div className="info-card-survey">{renderSurveyData()}</div>

        {/* Action buttons */}
        <div className="actions-button">
          <button className="button-secondary" onClick={() => navigate(-1)}>
            Back to Survey
          </button>
          <button
            className="button-primary"
            onClick={handleConfirmBooking}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Confirm Booking"}
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
