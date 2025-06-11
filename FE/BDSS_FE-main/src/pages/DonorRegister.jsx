import React from "react";
import "./DonorRegister.css";


const DonorForm = () => {
  return (
    <div className="donor-form-wrapper">
      <h2>Đăng ký hiến máu</h2>
      <form className="donor-form">
        <label>
          Họ và tên:
          <input type="text" placeholder="Nhập họ và tên..." required />
        </label>
        <label>
          Ngày sinh:
          <input type="date" required />
        </label>
        <label>
          Nhóm máu:
          <select required>
            <option value="">-- Chọn nhóm máu --</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        </label>
        <label>
          Số điện thoại:
          <input type="tel" placeholder="Nhập số điện thoại..." required />
        </label>
        <label>
          Địa chỉ:
          <textarea placeholder="Nhập địa chỉ cụ thể..." required></textarea>
        </label>
        <button type="submit">Gửi đăng ký</button>
      </form>
    </div>
  );
};

export default DonorForm;
