import React, { useEffect, useState } from "react";
import "./DonationSchedule.css";
import bloodDonationSchedules from "../assets/donationSchedule";
import { getUsernameFromToken } from "../assets/getUserName";
import { Link } from "react-router";
import { Button, ButtonGroup, Dropdown } from "react-bootstrap";
import { useLocation } from "react-router";
import { logout } from "../assets/authLogout";
import Navbar from "../assets/navbar";
import Footer from "../assets/footer";

export default function DonationSchedule() {
  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [filteredSchedules, setFilteredSchedules] = useState(
    bloodDonationSchedules
  );
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const date = params.get("date") || "";
    setSearchDate(date);
  }, [location.search]);

  useEffect(() => {
    let filtered = bloodDonationSchedules;

    if (searchName.trim()) {
      filtered = filtered.filter((s) =>
        s.center.toLowerCase().includes(searchName.trim().toLowerCase())
      );
    }
    if (searchDate) {
      filtered = filtered.filter((s) => s.date === searchDate);
    }
    setFilteredSchedules(filtered);
  }, [searchName, searchDate]);
  return (
    <>
      {/*Navbar*/}
      <Navbar />
      {/* Search */}
      <div
        style={{
          maxWidth: 900,
          margin: "32px auto 0 auto",
          display: "flex",
          gap: 16,
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Tìm theo tên trung tâm..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #ccc",
            flex: 1,
            minWidth: 0,
          }}
        />
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />
        <Button
          variant="outline-danger"
          onClick={() => {
            setSearchName("");
            setSearchDate("");
          }}
        >
          Xóa lọc
        </Button>
      </div>
      {/*Donation Schedule*/}
      <div className="donation-schedule">
        {filteredSchedules.length === 0 ? (
          <div className="no-schedule">Không tìm thấy lịch phù hợp.</div>
        ) : (
          filteredSchedules.map((schedule, idx) => (
            <div className="schedule-container" key={idx}>
              <div className="schedule-detail">
                <ul>
                  <li>
                    <strong>{schedule.center}</strong>
                  </li>
                  <li>
                    <strong>Địa điểm:</strong> {schedule.location}{" "}
                  </li>
                  <li>
                    <strong>Thời gian:</strong> {schedule.date} - Từ{" "}
                    {schedule.startTime} đến {schedule.endTime}
                  </li>
                </ul>
              </div>
              <div className="schedule-total">
                <strong>Số lượng người đăng ký:</strong>
                <br />
                {schedule.donorCount}
              </div>
            </div>
          ))
        )}
      </div>
      {/*Footer*/}
      <Footer />
    </>
  );
}
