import React, { useState } from "react";
import { Link } from "react-router";
import "./Register.css";
import axios from "axios";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    birthday: "",
    sex: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
    bloodType: "",
    occupation: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      alert("Mật khẩu có 6 kí tự trở lên");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/register",
        formData
      );
      alert("Đăng ký thành công!");
      console.log("Server trả về:", response.data);
    } catch (error) {
      console.error("Đăng ký lỗi:", error);
      alert("Đăng ký thất bại. Hãy kiểm tra lại thông tin.");
    }
  };

  return (
    <div className="register-page">
      <form className="form" onSubmit={handleSubmit}>
        <h1>Đăng ký</h1>

        <div className="field-wrapper">
          <input
            type="text"
            name="fullName"
            placeholder="Họ tên"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field-wrapper">
          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field-wrapper-gender">
          <label>
            <input
              type="radio"
              name="sex"
              value="Male"
              checked={formData.sex === "Male"}
              onChange={handleChange}
              required
            />
            Nam
          </label>
          <label style={{ marginLeft: "10px" }}>
            <input
              type="radio"
              name="sex"
              value="Female"
              checked={formData.sex === "Female"}
              onChange={handleChange}
            />
            Nữ
          </label>
        </div>

        <div className="field-wrapper">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field-wrapper">
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field-wrapper">
          <input
            type="text"
            name="phoneNumber"
            placeholder="Số điện thoại"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field-wrapper">
          <input
            type="text"
            name="address"
            placeholder="Địa chỉ"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field-wrapper">
          <select
            name="bloodType"
            value={formData.bloodType}
            onChange={handleChange}
            required
          >
            <option value="">Chọn nhóm máu</option>
            <option value="A_POSITIVE">A+</option>
            <option value="A_NEGATIVE">A-</option>
            <option value="B_POSITIVE">B+</option>
            <option value="B_NEGATIVE">B-</option>
            <option value="O_POSITIVE">O+</option>
            <option value="O_NEGATIVE">O-</option>
            <option value="AB_POSITIVE">AB+</option>
            <option value="AB_NEGATIVE">AB-</option>
          </select>
        </div>

        <div className="field-wrapper">
          <input
            type="text"
            name="occupation"
            placeholder="Nghề nghiệp"
            value={formData.occupation}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div className="field-wrapper">
          <input className="wrap-submit" type="submit" value="Đăng ký" />
        </div>

        <br />
        <Link to="/">Trang chủ</Link>
      </form>
    </div>
  );
}
