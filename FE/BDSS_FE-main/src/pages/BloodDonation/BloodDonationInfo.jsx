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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
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
    if (!user) return <p>No user information found.</p>;

    function formatDate(dateStr) {
      if (!dateStr) return "";
      const [year, month, day] = dateStr.split("-");
      return `${day}/${month}/${year}`;
    }

    return (
      <>
        <h3>User Information</h3>
        <div className="user-info-grid">
          <div className="info-row">
            <span className="info-label">Full Name:</span>
            <span className="info-value">{user.fullName}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Gender:</span>
            <span className="info-value">
              <GenderIcon sex={user.sex} />
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Date of Birth:</span>
            <span className="info-value">{formatDate(user.birthday)}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Address:</span>
            <span className="info-value">{user.address}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Email:</span>
            <span className="info-value">{user.email}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Occupation:</span>
            <span className="info-value">{user.occupation}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Phone Number:</span>
            <span className="info-value">{user.phoneNumber}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Blood Type:</span>
            <span className="info-value blood-type">
              {user.bloodType ? user.bloodType : "UNKNOWN"}
            </span>
          </div>
        </div>
      </>
    );
  };

  const renderBookingData = () => {
    if (!bookingData) return <div>No booking information.</div>;

    return (
      <>
        <h3>Booking Information</h3>
        <div className="booking-info-grid">
          <div className="info-row">
            <span className="info-label">Date:</span>
            <span className="info-value">{bookingData.date}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Location:</span>
            <span className="info-value">{bookingData.location}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Center:</span>
            <span className="info-value">{bookingData.center}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Time:</span>
            <span className="info-value">
              {formatTimeHM(bookingData.timeSlot.startTime)} -{" "}
              {formatTimeHM(bookingData.timeSlot.endTime)}
            </span>
          </div>
        </div>
      </>
    );
  };

  const renderSurveyData = () => {
    if (!surveyData) return <div>No survey information.</div>;
    return (
      <>
        <h3>Blood Donation Survey</h3>
        {surveyData.map((q, idx) => (
          <div key={q.questionId} style={{ marginBottom: 10 }}>
            <i className="question">
              {bloodRegister.find((bq) => bq.id === q.questionId)?.text ||
                `Question ${idx + 1}`}
            </i>
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
      toast.success("Booking successful!");
      setTimeout(() => {
        navigate("/appointment-detail");
      }, 1200);
    } catch (error) {
      console.error("Booking error:", error, error?.response?.data);
      toast.error(
        "Booking failed. " +
          (error?.response?.data?.message
            ? error.response.data.message
            : "Please try again.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  function formatTimeHM(timeStr) {
    if (!timeStr) return "";
    const [h, m] = timeStr.split(":");
    return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
  }

  return (
    <>
      <Navbar />
      <ToastContainer />
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
              {formatTimeHM(bookingData?.timeSlot?.startTime)} -{" "}
              {formatTimeHM(bookingData?.timeSlot?.endTime)}
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
