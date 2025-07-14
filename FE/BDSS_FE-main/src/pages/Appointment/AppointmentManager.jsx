import React, { useEffect, useState } from "react";
import axios from "../../helpers/axiosInstance";
import "./AppointmentManager.css";

import Table from 'react-bootstrap/Table';

export default function AppointmentManager() {
  const [appointments, setAppointments] = useState([]);
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
    if (!acc[name]) acc[name] = [];
    acc[name].push(item);
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


  return (
    <div className="appointment-manager-container">
      <h2>Donor Appointment Details</h2>
      <div className="appointment-manager">
        {Object.entries(grouped).map(([name, items]) => (
          <div className="appointment-card" key={name}>
            <h3>{name}</h3>
            <Table bordered>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Center</th>
                  <th>Address</th>
                  <th>Booking Time</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.bookingId}>
                    <td>{item.user.email}</td>
                    <td>{formatDate(item.dateDonation)}</td>
                    <td>

                      {item.startTime?.slice(0, 5)} - {item.endTime?.slice(0, 5)}

                    </td>
                    <td>{item.center}</td>
                    <td>{item.address}</td>
                    <td>{formatDateTime(item.bookingTime)}</td>
                    <td>{renderStatus(item.status)}</td>
                    <td className="action-buttons">
                      {(item.status === "PENDING" || item.status === "APPROVED") && (
                        <button onClick={() => handleUpdate(item)}>Update</button>
                      )}                
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ))}
      </div>
    </div>
  );
}