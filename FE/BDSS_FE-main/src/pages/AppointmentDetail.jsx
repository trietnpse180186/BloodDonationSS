import React from 'react';
import './AppointmentSchedule.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';

export default function AppointmentDetail({ appointment, saveReview, setSavedReview, onClose }) {
  if (!appointment) return null;

  const [review, setReview] = useState(saveReview || ""); // Khởi tạo review từ props hoặc để trống

  const handleReviewChange = () => {
    if (!review.trim()) {
      toast.error("Vui lòng nhập đánh giá trước khi lưu!");
      return;
    }
    setSavedReview(review);
    toast.success("Đã lưu đánh giá!");
    if (onClose) onClose(); // Đóng modal nếu có hàm onClose
  };
  
  const handleRemoveChange = () => {
    toast.success("Đã xóa đánh giá!");
    setSavedReview("");
    if (onClose) onClose(); // Đóng modal nếu có hàm onClose
  };

  return (
    <>
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
        value={review}
        onChange={e => setReview(e.target.value)}
        placeholder="Viết đánh giá của bạn..."
        rows={4}
        />
      <div className="modal-footer">
        <button type="button" className="btn btn-primary" onClick={handleRemoveChange}>Remove</button>
        <button type="button" className="btn btn-primary" onClick={handleReviewChange}>Save Changes</button>
      </div>
    </div>
    </>
  );
}
