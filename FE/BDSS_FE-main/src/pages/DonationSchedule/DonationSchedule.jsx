import React, { useEffect, useState } from "react";
import "./DonationSchedule.css";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { peopleFill } from "../../icons/icon";
import axios from "../../assets/axiosInstance";

export default function DonationSchedule() {
  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const token = sessionStorage.getItem("accessToken");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/schedule-donations")
      .then((res) => {
        setSchedules(res.data);
        setFilteredSchedules(res.data);
      })
      .catch((err) => {
        console.error("Error loading schedules", err);
      });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const date = params.get("date") || "";
    setSearchDate(date);
  }, [location.search]);

  useEffect(() => {
    let filtered = schedules;

    if (searchName.trim()) {
      filtered = filtered.filter((s) =>
        s.center.toLowerCase().includes(searchName.trim().toLowerCase())
      );
    }
    if (searchDate) {
      filtered = filtered.filter((s) => s.date === searchDate);
    }
    setFilteredSchedules(filtered);
  }, [searchName, searchDate, schedules]);

  const handleBooking = (schedule) => {
    navigate(
      `/blood-registration?date=${schedule.date}&location=${encodeURIComponent(
        schedule.location
      )}&center=${encodeURIComponent(schedule.center)}`
    );
  };

  return (
    <>
      <Navbar />
      <div className="donation-schedule-page">
        <h1>Donation Schedule</h1>
        {token ? (
          <div className="donation-schedule-header">
            <div className="search-bar">
              <h3>Search schedule</h3>
              <div className="search-inputs">
                <input
                  className="search-name"
                  type="text"
                  placeholder="Search by center name..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  aria-label="Search donation centers by name"
                />
                <input
                  className="search-date"
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  placeholder="Select a date"
                  aria-label="Search by donation date"
                />
                <Button
                  className="btn-outline-danger"
                  variant="outline-danger"
                  onClick={() => {
                    setSearchName("");
                    setSearchDate("");
                  }}
                  aria-label="Clear search filters"
                >
                  Clear
                </Button>
              </div>
            </div>
            <div className="donation-schedule">
              {filteredSchedules.length === 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    minHeight: 200,
                    justifyContent: "center",
                  }}
                >
                  <div className="no-schedule" style={{ marginBottom: 16 }}>
                    No schedules available.
                  </div>
                </div>
              ) : (
                filteredSchedules.map((schedule, idx) => (
                  <div className="schedule-container" key={idx}>
                    <div className="schedule-detail">
                      <ul style={{ listStyleType: "none", padding: 0 }}>
                        <li>
                          <strong
                            style={{
                              color: "rgb(218, 35, 35)",
                              fontSize: "1.2em",
                            }}
                          >
                            {schedule.center}
                          </strong>
                        </li>
                        <li>
                          <strong>Location:</strong> {schedule.location}{" "}
                        </li>
                        <li>
                          <strong>Date:</strong> {schedule.date}
                        </li>
                        <li>
                          <strong>Time slots:</strong>
                          <ul style={{ margin: 0, paddingLeft: 16 }}>
                            {schedule.timeSlots.map((slot) => (
                              <li key={slot.id}>
                                {slot.startTime} - {slot.endTime}
                              </li>
                            ))}
                          </ul>
                        </li>
                      </ul>
                    </div>
                    <div className="schedule-total">
                      <div className="schedule-total-icon">
                        {peopleFill}
                        <strong>Number of registrations:</strong>
                      </div>
                      <div className="schedule-total-count">
                        {schedule.registrationStatus}
                        <button
                          className="schedule-button"
                          onClick={() => handleBooking(schedule)}
                        >
                          Book now
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="login-prompt">
            <h4 style={{ marginBottom: 20 }}>
              Please login to view donation schedules!
            </h4>
            <Button
              style={{
                minWidth: 140,
                padding: "15px 20px",
                fontSize: "1.1em",
                fontWeight: "bold",
              }}
              variant="outline-danger"
              onClick={() =>
                navigate(
                  `/login?redirect=${encodeURIComponent(
                    location.pathname + location.search
                  )}`
                )
              }
            >
              Login Here
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
