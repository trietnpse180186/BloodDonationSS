import React, { useEffect, useState } from "react";
import axios from "../../helpers/axiosInstance";
import "./AppointmentManager.css";

import Table from 'react-bootstrap/Table';
import { Button, Modal } from "react-bootstrap";
import { getQuestionTextById, getLabelByValue } from "../../helpers/bloodRegister";
export default function AppointmentManager() {
  const [appointments, setAppointments] = useState([]);
  const [surveyData, setSurveyData] = useState({ show: false, data: [] });
  const [detailData, setDetailData] = useState({ show: false, data: {} });
  const accessToken = sessionStorage.getItem("accessToken");


  useEffect(() => {
    axios
      .get("http://localhost:8080/api/booking/all", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => setAppointments(res.data))
      .catch((err) => {
        console.error("Error fetching appointment details:", err);
      });
  }, [accessToken]);

  function formatDate(isoDate) {
    if (!isoDate) return "";
    const [year, month, day] = isoDate.split("-");
    return `${day}-${month}-${year}`;
  }

  function formatDateTime(isoDateTime) {
    if (!isoDateTime) return "";
    const [datePart, timePart] = isoDateTime.split("T");
    const [year, month, day] = datePart.split("-");
    return `${day}-${month}-${year} ${timePart.slice(0, 5)}`;
  }

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
        return <span>{status}</span>;
    }
  };

  const grouped = appointments.reduce((acc, item) => {
    const name = item.user?.fullName || "Unknown User";
    const email = item.user?.email || "Unknown Email";
    const key = `${name} (${email})`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  // Tự động cập nhật trạng thái khi nhấn Update
  const handleUpdate = async (item) => {
    let nextStatus = "";
    if (item.status === "PENDING") nextStatus = "APPROVED";
    else if (item.status === "APPROVED") nextStatus = "COMPLETED";
    else return; // Không cho update nếu đã CANCELLED hoặc COMPLETED

    try {
      await axios.put(
        `http://localhost:8080/api/booking/${item.bookingId}`,
        {},
        {
          params: { status: nextStatus },
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.bookingId === item.bookingId ? { ...appt, status: nextStatus } : appt
        )
      );
    } catch (error) {
      alert("Cập nhật trạng thái thất bại!");
    }
  };

  const handleSurvey = async (item) => {
    try{
      const res = await axios.get(
        `http://localhost:8080/api/survey/${item.bookingId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setSurveyData({ show: true, data: res.data });
    } catch (error) {
      console.error("Error fetching survey data:", error);
      alert("Load Survey Failed!");
    }
  }
  const handleDetail = (item) => {
    const bookingData = {
      
      center: item.center,
      location: item.location || item.address,
      date: formatDate(item.dateDonation),
      timeSlot: item.startTime && item.endTime 
      ? `${item.startTime.slice(0, 5)} - ${item.endTime.slice(0, 5)}` 
      : "N/A",
      status: item.status,
      bloodType: item.bloodType,
      user: item.user,
      bookingTime: formatDateTime(item.bookingTime)
    };

    setDetailData({ show: true, data: bookingData });
  };

  return (
    <div className="appointment-manager-container">
      <h2>Donor Appointment Details</h2>
      <div className="appointment-manager">
        {Object.entries(grouped).map(([key, items]) => (
          <div className="appointment-card" key={key}>
            <h3>{key}</h3>
            <div className="appointment-table">
            <Table bordered responsive>
              <thead>
                <tr>
                  <th>Center</th>
                  <th>Booking Time</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.bookingId}>
                    <td>{item.center}</td>
                    <td>{formatDateTime(item.bookingTime)}</td>
                    <td>{renderStatus(item.status)}</td>
                    <td className="action-buttons">
                      <button onClick={() => handleDetail(item)}>View Details</button>
                      <button onClick={() => handleSurvey(item)}>View Survey</button>
                      {(item.status === "PENDING" || item.status === "APPROVED") && (
                        <button onClick={() => handleUpdate(item)}>Update</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            </div>
          </div>
        ))}
      </div>
      <Modal show={surveyData.show} onHide={() => setSurveyData({ show: false, data: [] })}>
        <Modal.Header closeButton>
          <Modal.Title>Survey Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!Array.isArray(surveyData.data) || surveyData.data.length === 0 ? (
            <div>No survey found.</div>
          ) : (
            <ul>
              {surveyData.data
                .slice() // tạo bản sao để sort không ảnh hưởng state
                .sort((a, b) => {
                  const order = [
                    "q1","q2","q3","q4","q5","q6","q7","q8","q9"
                  ];
                  return order.indexOf(a.description) - order.indexOf(b.description);
                })
                .map((s, idx) => {
                  let audit = {};
                  try {
                    audit = JSON.parse(s.answerAudit);
                  } catch {
                    audit = {};
                  }
                  return (
                    <li key={idx}>
                      <strong>{getQuestionTextById(s.description)}</strong><br />
                      <strong>Đáp án:</strong> {getLabelByValue(s.description, audit.answer)}
                      {audit.additionalInfo && audit.additionalInfo !== "" && (
                        <span><br /><strong>Info:</strong> {audit.additionalInfo}</span>
                      )}
                    </li>
                  );
                })}
            </ul>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSurveyData({ show: false, data: [] })}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={detailData.show} onHide={() => setDetailData({ show: false, data: {} })}>
        <Modal.Header closeButton>
          <Modal.Title>Booking Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!detailData.data ? (
            <div>No details available.</div>
          ) : (
            <div className="booking-details">
              <div className="detail-row">
                <strong>Donor:</strong> {detailData.data.user?.fullName}
              </div>
              <div className="detail-row">
                <strong>Email:</strong> {detailData.data.user?.email}
              </div>
              <div className="detail-card">
                <div className="detail-row">
                  <strong>Center:</strong> {detailData.data.center}
                </div>
                <div className="detail-row">
                  <strong>Location:</strong> {detailData.data.location}
                </div>
                <div className="detail-row">
                  <strong>Date:</strong> {detailData.data.date}
                </div>
                <div className="detail-row">
                  <strong>Time:</strong> {detailData.data.timeSlot}
                </div>
              </div>
              <div className="detail-row">
                <strong>Booking Time:</strong> {detailData.data.bookingTime}
              </div>
              <div className="detail-row">
                <strong>Status:</strong> {detailData.data.status}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDetailData({ show: false, data: null })}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}