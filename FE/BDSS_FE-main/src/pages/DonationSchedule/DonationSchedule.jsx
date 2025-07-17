import React, { useEffect, useState } from "react";
import "./DonationSchedule.css";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { peopleFill } from "../../icons/icon";
import axios from "../../helpers/axiosInstance";
import getUserById, { getUserIdFromToken } from "../../helpers/getUserById";

export default function DonationSchedule() {
  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const token = sessionStorage.getItem("accessToken");
  const refreshToken = sessionStorage.getItem("refreshToken");
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

  // Chỉ gọi eligibility API khi có token
  useEffect(() => {
    if (token && refreshToken) {
      const userIdFromToken = getUserIdFromToken(token);
      axios
        .get(
          `http://localhost:8080/api/reports/user/${userIdFromToken}/eligibility`
        )
        .then((res) => {
          setEligibility(res.data);
        })
        .catch((err) => {
          console.error("Error loading eligibility", err);
        });
    }
  }, [token, refreshToken]);

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

  // Chỉ gọi getUserById khi có token
  useEffect(() => {
    if (token && refreshToken) {
      getUserById().then(setUserInfo);
    }
  }, [token, refreshToken]);

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
        {token && refreshToken ? (
          // Nếu có cả accessToken và refreshToken
          userInfo ? (
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
                  filteredSchedules.map((schedule, idx) => {
                    const canBookBlood =
                      userInfo &&
                      userInfo.bloodType &&
                      schedule.bloodNeed.some(
                        (b) =>
                          b.replace(/\s+/g, "").toUpperCase() ===
                          userInfo.bloodType.replace(/\s+/g, "").toUpperCase()
                      );
                    const canBook = canBookBlood && eligibility === true;

                    return (
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
                              <strong>Blood Need:</strong>{" "}
                              {schedule.bloodNeed.join(" - ")}
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
                              disabled={!canBook}
                              style={
                                !canBook
                                  ? {
                                      background: "#ccc",
                                      cursor: "not-allowed",
                                    }
                                  : {}
                              }
                            >
                              Book now
                            </button>
                          </div>
                          {!canBookBlood && (
                            <div
                              style={{
                                color: "red",
                                marginTop: 8,
                                fontWeight: 500,
                              }}
                            >
                              Your blood type is not needed for this schedule.
                            </div>
                          )}
                          {canBookBlood && eligibility === false && (
                            <div
                              style={{
                                color: "orange",
                                marginTop: 8,
                                fontWeight: 500,
                              }}
                            >
                              You are not eligible to donate blood at this time.
                              Please wait until the required interval has
                              passed.
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            <div>Loading user info...</div>
          )
        ) : (
          // Nếu không có token hoặc refreshToken
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
