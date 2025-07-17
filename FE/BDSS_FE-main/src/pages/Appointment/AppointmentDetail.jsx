import "./AppointmentDetail.css";
import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import Certificate from "../Certificate/Certificate";

import { getUserIdFromToken } from "../../helpers/getUserById";
import axios from "../../helpers/axiosInstance";
import { Button, Modal } from "react-bootstrap";

function formatDate(isoDate) {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-");
  return `${day}-${month}-${year}`;
}
export default function AppointmentDetail() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const token = sessionStorage.getItem("accessToken");
  const userId = getUserIdFromToken();

  const openCertificateModal = (bookingId) => {
    setSelectedBookingId(bookingId);
    setIsModalVisible(true);
    document.body.classList.add("modal-open");
  };

  const closeCertificateModal = () => {
    setSelectedBookingId(null);
    setIsModalVisible(false);
    document.body.classList.remove("modal-open");
  };

  const renderStatus = (status) => {
    switch (status) {
      case "PENDING":
        return <span className="status-pending">Pending</span>;
      case "APPROVED":
        return <span className="status-confirmed">Approved</span>;
      case "CANCELLED":
        return <span className="status-cancelled">Cancelled</span>;
      case "COMPLETED":
        return <span className="status-complete">Complete</span>;
      default:
        return null;
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
                  <th>Center</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Time Slot</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((item) => (
                  <tr key={item.bookingId}>
                    <td>{item.center}</td>
                    <td>{formatDate(item.dateDonation)}</td>
                    <td>{item.address}</td>
                    <td>
                      {item.startTime?.slice(0, 5)} -{" "}
                      {item.endTime?.slice(0, 5)}
                    </td>
                    <td>{renderStatus(item.status)}</td>
                    <td>
                      {item.status === "COMPLETED" && (
                        <Button
                          type="primary"
                          size="small"
                          onClick={() => openCertificateModal(item.bookingId)}
                        >
                          View Certificate
                        </Button>
                      )}
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

            <Modal
              title=""
              open={isModalVisible}
              onCancel={closeCertificateModal}
              footer={null}
              zIndex={1050}
              className="certificate-modal"
              getContainer={document.body}
              width="77%"
              centered
               maskClosable={false}
              closeIcon={
                <div className="custom-close-button">
                  <span>close</span>
                </div>
              }
            >
              {selectedBookingId && (
                <Certificate bookingId={selectedBookingId} />
              )}
            </Modal>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
