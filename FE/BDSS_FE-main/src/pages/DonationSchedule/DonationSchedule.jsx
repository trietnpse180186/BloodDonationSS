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

        {token ? (
          userInfo ? (
            <div className="donation-schedule-header">
              <div className="search-bar">
                <h3>Search schedule</h3>
                <div className="search-inputs">
                  <div className="search-name-wrapper">
                    <span className="search-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                      </svg>
                    </span>

                    <input
                      className="search-name"
                      type="text"
                      placeholder="Search by center name..."
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      aria-label="Search donation centers by name"
                    />
                  </div>

                  <div className="search-date-wrapper">
                    <span className="date-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
                      </svg>
                    </span>

                    <input
                      className="search-date"
                      type="date"
                      value={searchDate}
                      onChange={(e) => setSearchDate(e.target.value)}
                      placeholder="Select a date"
                      aria-label="Search by donation date"
                    />
                  </div>

                  <button
                    className="search-clear-btn"
                    onClick={() => {
                      setSearchName("");
                      setSearchDate("");
                    }}
                    aria-label="Clear search filters"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                    </svg>
                    Clear
                  </button>
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
                      const canBook = eligibility === true;

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
                                {schedule.bloodNeed.map((type) => (
                                  <span key={type} className="blood-type-badge">
                                    {type}
                                  </span>
                                ))}
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
                              <span>Registration Status</span>
                            </div>

                            <div className="schedule-total-count">
                              {schedule.registrationStatus}
                            </div>

                            <button
                              className="schedule-button"
                              onClick={() => handleBooking(schedule)}
                              disabled={!canBook}
                            >
                              Book now
                            </button>

                            {eligibility === false && (
                              <div className="eligibility-messages">
                                <div className="warning-message" style={{ color: "red" }}>
                                  You are not eligible to donate blood at this
                                  time. Please wait until the required interval
                                  has passed.
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div>Loading user info...</div>
          )
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
