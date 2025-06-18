import React from "react";
import "./ChooseDateLocation.css";
import { FaCalendarAlt, FaClipboardList } from "react-icons/fa";

export default function ChooseDateLocation() {
  return (
    <div className="booking-container">
      <h2>Đặt lịch hiến máu</h2>

      <div className="sidebar">
        <button className="tab active">
          <FaCalendarAlt className="icon" /> Thời gian & địa điểm
        </button>
        <button className="tab">
          <FaClipboardList className="icon" /> Phiếu đăng ký hiến máu
        </button>
      </div>

      <div className="main-content">
        <h3>Thời gian & địa điểm</h3>

        <div className="calendar-wrapper">
          <div className="calendar-header">
            <FaCalendarAlt className="icon" /> Chọn ngày
          </div>

          <div className="calendar-box">
            <div className="calendar">
              <div>
                <strong>Tháng 6</strong> 2025
                <div className="days">Th 2  Th 3  Th 4  Th 5  Th 6  Th 7  CN</div>
                <div className="dates">
                  {[...Array(30).keys()].map((d) => (
                    <span key={d + 1} className={d + 1 === 18 ? "today" : ""}>{d + 1}</span>
                  ))}
                </div>
              </div>
              <div>
                <strong>Tháng 7</strong> 2025
                <div className="days">Th 2  Th 3  Th 4  Th 5  Th 6  Th 7  CN</div>
                <div className="dates">
                  {[...Array(31).keys()].map((d) => (
                    <span key={d + 1}>{d + 1}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
} 
