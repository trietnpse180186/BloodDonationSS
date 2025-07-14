import React, { useState, useEffect } from "react";
import "./BloodDonationInfo.css";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import bloodRegister, { getLabelByValue } from "../../helpers/bloodRegister";
import axios from "../../helpers/axiosInstance";
import getUserById, { getUserIdFromToken } from "../../helpers/getUserById";
import Footer from "../../components/footer";
import { IoMdMale, IoMdFemale } from "react-icons/io";

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
    if (!user)
      return (
        <div className="info-card">
          <h3>User Information</h3>
          <p>No user information found.</p>
        </div>
      );
    function formatDate(dateStr) {
      if (!dateStr) return "";
      const [year, month, day] = dateStr.split("-");
      return `${day}/${month}/${year}`;
    }
    return (
      <div className="info-card">
        <h3>User Information</h3>
        <p>
          <strong>Full Name:</strong> 
          <span className="info-value">{user.fullName}</span>
        </p>
        <p>
          <strong>Gender:</strong> 
          <span className="info-value"><GenderIcon sex={user.sex} /></span>
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
      </div>
    );
  };

  const renderBookingData = () => {
    if (!bookingData) return <div>No booking information.</div>;

    return (
      <div className="info-card-booking">
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
          <span className="info-value">{bookingData.timeSlot.startTime} - {bookingData.timeSlot.endTime}</span>
        </p>
      </div>
    );
  };

  const renderSurveyData = () => {
    if (!surveyData) return <div>No survey information.</div>;
    return (
      <div className="info-card-survey">
        <h3>Blood Donation Survey</h3>
        {surveyData.map((q, idx) => (
          <div key={q.questionId} style={{ marginBottom: 10 }}>
            <i className="question">
              {bloodRegister.find((bq) => bq.id === q.questionId)?.text ||
                `Question ${idx + 1}`}
            </i>
            <div className="answer" style={{ marginLeft: 16, color: "#b30000" }}>
              {getLabelByValue(q.questionId, q.answer)}
              {q.additionalInfo ? `: ${q.additionalInfo}` : ""}
            </div>
          </div>
        ))}
      </div>
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
        "http://localhost:8080/api/booking/create",
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

  return (
    <>
      <Navbar />
      <div className="donation-info-container">
        <h2>Blood Donation Registration Information</h2>
        <div className="donation-grid">
          <div className="info-1">
            {renderUserData()}
            {renderBookingData()}
          </div>
          <div className="info-2">{renderSurveyData()}</div>
        </div>
        <div className="actions-button" style={{ textAlign: "center", marginTop: 32 }}>
          <button
            className="button-style"
            onClick={handleConfirmBooking}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Confirm Booking"}
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
