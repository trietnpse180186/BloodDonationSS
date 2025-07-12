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

const formatDateToIso = (dateStr) => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

  const [day, month, year] = dateStr.split("/");
  return `${year}-${month}-${day}`;
};
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
          <strong>Full Name:</strong> {user.fullName}
        </p>
        <p>
          <strong>Gender:</strong> <GenderIcon sex={user.sex} />
        </p>
        <p>
          <strong>Date of Birth:</strong> {formatDate(user.birthday)}
        </p>
        <p>
          <strong>Address:</strong> {user.address}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Occupation:</strong> {user.occupation}
        </p>
        <p>
          <strong>Phone Number:</strong> {user.phoneNumber}
        </p>
        <p>
          <strong>Blood Type:</strong> {user.bloodType}
        </p>
      </div>
    );
  };

  const renderBookingData = () => {
    if (!bookingData) return <div>No booking information.</div>;
    return (
      <div className="info-card">
        <h3>Booking Information</h3>
        <p>
          <strong>Date:</strong> {bookingData.date}
        </p>
        <p>
          <strong>Location:</strong> {bookingData.location}
        </p>
        <p>
          <strong>Center:</strong> {bookingData.center}
        </p>
        <p>
          <strong>Time Slot:</strong> {bookingData.timeSlot.startTime} -{" "}
          {bookingData.timeSlot.endTime}
        </p>
      </div>
    );
  };

  const renderSurveyData = () => {
    if (!surveyData) return <div>No survey information.</div>;
    return (
      <div className="info-card">
        <h3>Blood Donation Survey</h3>
        {surveyData.map((q, idx) => (
          <div key={q.questionId} style={{ marginBottom: 10 }}>
            <i>
              {bloodRegister.find((bq) => bq.id === q.questionId)?.text ||
                `Question ${idx + 1}`}
            </i>
            <div style={{ marginLeft: 16, color: "#b30000" }}>
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
        <div style={{ textAlign: "center", marginTop: 32 }}>
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
