import React, { useEffect, useState } from "react";
import Navbar from "../assets/navbar";
import Footer from "../assets/footer";
import { getUserIdFromToken } from "../assets/getUserById";

export default function AppointmentSchedule1() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = sessionStorage.getItem("accessToken");
  const userId = getUserIdFromToken(); // Không cần truyền token

  useEffect(() => {
    if (!userId) {
      setError("Không tìm thấy thông tin người dùng.");
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`http://localhost:8080/api/booking/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi khi lấy dữ liệu lịch hẹn");
        return res.json();
      })
      .then((data) => {
        setAppointments(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Đã xảy ra lỗi");
        setLoading(false);
      });
  }, [userId, token]);

  return (
    <>
      <Navbar />
      <div className="appointment-container">
        <h2 className="appointment-title">Lịch hẹn hiến máu của bạn</h2>
        {loading ? (
          <div>Đang tải dữ liệu...</div>
        ) : error ? (
          <div style={{ color: "red" }}>{error}</div>
        ) : appointments.length === 0 ? (
          <div>Bạn chưa có lịch hẹn nào.</div>
        ) : (
          <table className="appointment-table">
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Địa điểm</th>
                <th>Trung tâm</th>
                <th>Khung giờ</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((item) => (
                <tr key={item.bookingId}>
                  <td>{item.dateDonation}</td>
                  <td>{item.address?.split(" - ")[0]}</td>
                  <td>{item.address?.split(" - ")[1]}</td>
                  <td>
                    {item.startTime?.slice(0, 5)} - {item.endTime?.slice(0, 5)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Footer />
    </>
  );
}
