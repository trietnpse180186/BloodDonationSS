// AppointmentSchedule.js
import React, { useState } from 'react';
import './AppointmentSchedule.css';
import AppointmentDetail from './AppointmentDetail';

const appointments = [
  {
    id: 1,
    location: "466 Nguyễn Thị Minh Khai (thời gian làm việc từ 7g đến 11g)",
    address: "466 Nguyễn Thị Minh Khai Phường 02, Quận 3, Tp Hồ Chí Minh",
    date: "14/06/2025",
    time: "07:00 đến 11:00",
    status: "Đã xoá",
  },
  {
    id: 2,
    location: "Trung tâm Truyền máu Chợ Rẫy (Cổng số 6)",
    address: "Cổng số 6 - Bệnh viện Chợ Rẫy, đường Triệu Quang Phục, Phường 12, Quận 5, Tp Hồ Chí Minh",
    date: "26/05/2025",
    time: "07:00 đến 11:00",
    status: "Đã xoá",
  }
];

export default function AppointmentSchedule() {
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  if (selectedAppointment) {
    return (
      <AppointmentDetail
        appointment={selectedAppointment}
        onBack={() => setSelectedAppointment(null)}
      />
    );
  }

  return (
    <div className="schedule-container">
      <h2>Lịch sử đặt hẹn</h2>

      <div className="appointment-list">
        {appointments.map(apt => (
          <div key={apt.id} className="appointment-card">
            <div className="icon">
              <img src="/blood-drop-icon.png" alt="Hiến máu" />
              <p>Hiến máu</p>
            </div>
            <div className="info">
              <strong className="location">{apt.location}</strong>
              <p><i className="fa fa-map-marker-alt"></i> {apt.address}</p>
              <p><i className="fa fa-clock"></i> {apt.time} - {apt.date}</p>
            </div>
            <div className="actions">
              <span className="badge">{apt.status}</span>
              <button onClick={() => setSelectedAppointment(apt)}>📄 Xem chi tiết</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
