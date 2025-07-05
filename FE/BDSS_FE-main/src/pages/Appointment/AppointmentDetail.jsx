import "./AppointmentDetail.css";
import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { getUserIdFromToken } from "../../assets/getUserById";
import axios from "../../assets/axiosInstance";

export default function AppointmentDetail() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = sessionStorage.getItem("accessToken");
  const userId = getUserIdFromToken();

  const renderStatus = (status) => {
    switch (status) {
      case "PENDING":
        return <span className="status-pending">Pending</span>;
      case "APPROVED":
        return <span className="status-confirmed">Approved</span>;
      case "CANCELLED":
        return <span className="status-cancelled">Cancelled</span>;
      case "COMPLETE":
        return <span className="status-complete">Complete</span>;
    }
  };
  useEffect(() => {
    if (!userId) {
      setError("User information not found.");
      setLoading(false);
      return;
    }
    setLoading(true);
    axios
      .get(`http://localhost:8080/api/booking/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAppointments(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || err.message || "An error occurred."
        );
        setLoading(false);
      });
  }, [userId, token]);

  const handleCancel = async (bookingId) => {
    try {
      await axios.put(
        `http://localhost:8080/api/booking/${bookingId}`,
        { bookingId },
        {
          params: { status: "CANCELLED" },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAppointments((prev) =>
        prev.map((item) =>
          item.bookingId === bookingId ? { ...item, status: "CANCELLED" } : item
        )
      );
    } catch (error) {
      alert("Failed to cancel appointment. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="appointment-container">
        <h2 className="appointment-title">Donation Appointments</h2>
        {loading ? (
          <div className="appointment-loading">Loading data...</div>
        ) : error ? (
          <div className="appointment-error">{error}</div>
        ) : appointments.length === 0 ? (
          <div className="appointment-empty">You have no appointments.</div>
        ) : (
          <div className="appointment-table-wrapper">
            <table className="appointment-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Center</th>
                  <th>Location</th>
                  <th>Time Slot</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((item) => (
                  <tr key={item.bookingId}>
                    <td>{item.dateDonation}</td>
                    <td>{item.center}</td>
                    <td>{item.address}</td>
                    <td>
                      {item.startTime?.slice(0, 5)} -{" "}
                      {item.endTime?.slice(0, 5)}
                    </td>
                    <td>{renderStatus(item.status)}</td>
                    <td
                      style={{
                        minWidth: "50px",
                        padding: "0",
                        translate: "-20px 0px",
                      }}
                    >
                      {item.status === "PENDING" && (
                        <button
                          className="cancel-button"
                          onClick={() => handleCancel(item.bookingId)}
                        >
                          x
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
