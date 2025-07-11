import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./Rating.css";

export default function Rating() {
  const { bookingId } = useParams();

  const [formData, setFormData] = useState({
    q1: "kjbhb",
    q2: ", k ",
    q3: " hj h ",
    q4: " hbhh",
    comment: " b ",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.q1) newErrors.q1 = "Chưa chọn câu 1";
    if (!formData.q2) newErrors.q2 = "Chưa chọn câu 2";
    if (!formData.q3) newErrors.q3 = "Chưa chọn câu 3";
    if (!formData.q4) newErrors.q4 = "Chưa chọn câu 4";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    console.log("Đã gửi đánh giá:", formData, "Booking ID:", bookingId);
    alert("Cảm ơn bạn đã đánh giá!");
  };

  const choices = ["Tệ", "Khá tệ", "Tốt", "Tuyệt vời"];

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h2>Đánh giá buổi hiến máu</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>1. Quy trình đăng ký có dễ hiểu không?</label><br />
          {choices.map((c) => (
            <label key={c}>
              <input
                type="radio"
                name="q1"
                value={c}
                checked={formData.q1 === c}
                onChange={handleChange}
              />
              {c}{" "}
            </label>
          ))}
          {errors.q1 && <div style={{ color: "red" }}>{errors.q1}</div>}
        </div>

        <div>
          <label>2. Nhân viên và tình nguyện viên hỗ trợ bạn như thế nào?</label><br />
          {choices.map((c) => (
            <label key={c}>
              <input
                type="radio"
                name="q2"
                value={c}
                checked={formData.q2 === c}
                onChange={handleChange}
              />
              {c}{" "}
            </label>
          ))}
          {errors.q2 && <div style={{ color: "red" }}>{errors.q2}</div>}
        </div>

        <div>
          <label>3. Cơ sở vật chất có sạch sẽ và thoải mái không?</label><br />
          {choices.map((c) => (
            <label key={c}>
              <input
                type="radio"
                name="q3"
                value={c}
                checked={formData.q3 === c}
                onChange={handleChange}
              />
              {c}{" "}
            </label>
          ))}
          {errors.q3 && <div style={{ color: "red" }}>{errors.q3}</div>}
        </div>

        <div>
          <label>4. Bạn có cảm thấy an toàn khi hiến máu không?</label><br />
          {choices.map((c) => (
            <label key={c}>
              <input
                type="radio"
                name="q4"
                value={c}
                checked={formData.q4 === c}
                onChange={handleChange}
              />
              {c}{" "}
            </label>
          ))}
          {errors.q4 && <div style={{ color: "red" }}>{errors.q4}</div>}
        </div>

        <div>
          <label>Nhận xét thêm (không bắt buộc):</label><br />
          <textarea
            name="comment"
            rows="4"
            style={{ width: "100%" }}
            value={formData.comment}
            onChange={handleChange}
            placeholder="Viết gì thêm nếu bạn muốn..."
          ></textarea>
        </div>

        <button type="submit" style={{ marginTop: "10px" }}>
          Gửi đánh giá
        </button>
      </form>
    </div>
  );
}
