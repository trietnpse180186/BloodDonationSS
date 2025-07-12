import React, { useEffect, useState } from "react";
import axios from "../../assets/axiosInstance";
import "./AppointmentManager.css"; // Import your CSS file for styling
import Table from 'react-bootstrap/Table';
export default function AppointmentManager() {
  const [appointments, setAppointments] = useState([]);
  const accessToken = sessionStorage.getItem("accessToken");
  const [editingId, setEditingId] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  // Hàm decode JWT payload


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

  const handleUpdate = (item) => {
    setEditingId(item.bookingId);
    setNewStatus(item.status);
  };

  // Khi nhấn Save
  const handleSave = async (bookingId) => {
    try {
      await axios.put(
        `http://localhost:8080/api/booking/${bookingId}`,
        {},
        {
          params: { status: newStatus },
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setAppointments((prev) =>
        prev.map((item) =>
          item.bookingId === bookingId ? { ...item, status: newStatus } : item
        )
      );
      setEditingId(null);
    } catch (error) {
      alert("Cập nhật trạng thái thất bại!");
    }
  };

  const handleDelete = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete?")) return;
    try {
      await axios.delete(
        `http://localhost:8080/api/booking/${bookingId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setAppointments((prev) =>
        prev.filter((item) => item.bookingId !== bookingId)
      );
    } catch (error) {
      alert("Xóa lịch hẹn thất bại!");
    }
  };

  return (
    <div>
      <h2>Users Appointment Details</h2>
      <div className="appointment-manager">
      {Object.entries(grouped).map(([name, items]) => (
        <div className="appointment-card" key={name} >
          <h3>{name}</h3>
          <Table  bordered>
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
                  <td>
                    {editingId === item.bookingId ? (
                      <select
                        value={newStatus}
                        onChange={e => setNewStatus(e.target.value)}
                      >
                        <option value="APPROVED">Approved</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    ) : (
                      renderStatus(item.status)
                    )}
                  </td>
                  <td className="action-buttons">
                    {editingId === item.bookingId ? (
                      <button onClick={() => handleSave(item.bookingId)}>Save</button>
                    ) : (
                      <>
                        <button onClick={() => handleUpdate(item)}>Update</button>
                        <button onClick={() => handleDelete(item.bookingId)}>Delete</button>
                      </>
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
