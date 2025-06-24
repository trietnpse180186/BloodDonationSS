import React from 'react';
import './AppointmentSchedule.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';

export default function AppointmentDetail({ appointment, saveReview, setSavedReview, onClose }) {
  if (!appointment) return null;

  const [review, setReview] = useState(saveReview || ""); // Khởi tạo review từ props hoặc để trống

  
  // Star rating state
  const [rating, setRating] = useState(saveReview || 0);
  
  // Handle star click
  const handleStarClick = (star) => {
    setRating(star);
  };
  
  const handleReviewChange = () => {
    if (!review.trim()) {
      toast.error("Vui lòng nhập đánh giá trước khi lưu!");
      return;
    }
    if(!rating) {
      toast.error("Vui lòng chọn đánh giá sao trước khi lưu!");
      return;
    }
    setSavedReview({ review, rating }); // Lưu đánh giá và rating
    toast.success("Đã lưu đánh giá!");
    if (onClose) onClose(); // Đóng modal nếu có hàm onClose
  };
  
  const handleRemoveChange = () => {
    toast.success("Đã xóa đánh giá!");
    setSavedReview("");
    if (onClose) onClose(); // Đóng modal nếu có hàm onClose
  };
  const handleClose = () => {
    if (onClose) onClose(); // Gọi hàm onClose nếu có
  }
  return (
    <>
    <div>
      <div className="appointment-detail">
        <div className='body-info'>
          <h3>Chi tiết lịch hẹn</h3>
          <p><b>Địa điểm:</b> {appointment.center}</p>
          <p><b>Địa chỉ:</b> {appointment.address}</p>
          <p><b>Ngày:</b> {appointment.date}</p>
          <p><b>Thời gian:</b> {appointment.time}</p>
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
        </div>
          <div className='body-rating'>
            <h3>Đánh giá</h3>
              <div style={{ fontSize: 28, color: '#fbbf24', marginBottom: 8 }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                  key={star}
                  style={{
                    cursor: 'pointer',
                    color: star <= rating ? '#fbbf24' : '#e5e7eb'
                  }}
                  onClick={() => setRating(star)}
                  data-testid={`star-${star}`}
                  role="button"
                  aria-label={`Chọn ${star} sao`}
                  >
                    ★
                  </span>
                ))}
                <span style={{ marginLeft: 12, color: "#333", fontSize: 18 }}>
                  {rating > 0}
                </span>
              </div>
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
      </div>
      <div  className='modal-footer'>
          <button type='button' className="button-back" onClick={handleClose}>Quay về</button>
      </div>
    </div>
    </>
  );
}
