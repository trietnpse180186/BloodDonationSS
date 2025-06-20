// AppointmentDetail.js
import React from 'react';
import './AppointmentDetail.css';

export default function AppointmentDetail({ appointment, onBack }) {
  if (!appointment) return null;

  return (
    <div className="appointment-detail">
      <h3>Chi tiết lịch hẹn</h3>
      <p><b>Địa điểm:</b> {appointment.location}</p>
      <p><b>Địa chỉ:</b> {appointment.address}</p>
      <p><b>Thời gian:</b> {appointment.time} - {appointment.date}</p>
      <p><b>Trạng thái:</b>
        <span style={{
          backgroundColor: '#ef4444',
          color: 'white',
          padding: '4px 8px',
          borderRadius: 4,
          marginLeft: 6
        }}>
          {appointment.status}
        </span>
      </p>

      <h4>Đánh giá</h4>
      <div style={{ fontSize: 24, color: '#fbbf24' }}>⭐⭐⭐⭐⭐</div>
      <textarea
        placeholder="Chia sẻ đánh giá của bạn..."
        style={{ width: '100%', margin: '8px 0' }}
      ></textarea>
      <button onClick={onBack}>⬅ Quay lại danh sách</button>
    </div>
  );
}
