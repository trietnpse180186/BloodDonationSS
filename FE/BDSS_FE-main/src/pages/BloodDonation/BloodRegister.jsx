import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import "./BloodRegister.css";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../../components/footer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../../helpers/axiosInstance";
function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay() || 7;
  d.setDate(d.getDate() - day + 1);
  return d;
}

function getWeekDays(startDate) {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
}

function WeeklyDatePicker({ selectedDate, onChange }) {
  const parseDate = (dateStr) => {
    const [d, m, y] = dateStr.split("/");
    return new Date(`${y}-${m}-${d}`);
  };

  const safeDate =
    selectedDate && /^\d{2}\/\d{2}\/\d{4}$/.test(selectedDate)
      ? parseDate(selectedDate)
      : new Date();

  const [currentWeek, setCurrentWeek] = useState(getStartOfWeek(safeDate));

  useEffect(() => {
    const startOfSelectedWeek = getStartOfWeek(safeDate);
    if (currentWeek.getTime() !== startOfSelectedWeek.getTime()) {
      setCurrentWeek(startOfSelectedWeek);
    }
    // eslint-disable-next-line
  }, [selectedDate]);

  const weekDays = getWeekDays(currentWeek);

  const handlePrevWeek = () => {
    const prev = new Date(currentWeek);
    prev.setDate(prev.getDate() - 7);
    setCurrentWeek(getStartOfWeek(prev));
  };

  const handleNextWeek = () => {
    const next = new Date(currentWeek);
    next.setDate(next.getDate() + 7);
    setCurrentWeek(getStartOfWeek(next));
  };

  return (
    <div className="weekly-date-picker">
      <button type="button" className="weekly-nav-btn" onClick={handlePrevWeek}>
        {"<"}
      </button>
      {weekDays.map((day) => {
        const ddmmyyyy = day.toLocaleDateString("vi-VN");
        return (
          <button
            key={ddmmyyyy}
            type="button"
            className={`weekly-day-btn ${
              selectedDate === ddmmyyyy ? "selected" : ""
            }`}
            onClick={() => onChange(ddmmyyyy)}
          >
            {day.toLocaleDateString("vi-VN", {
              weekday: "short",
              day: "2-digit",
              month: "2-digit",
            })}
          </button>
        );
      })}
      <button type="button" className="weekly-nav-btn" onClick={handleNextWeek}>
        {">"}
      </button>
    </div>
  );
}

export default function BloodRegister() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialDate =
    params.get("date") || new Date().toLocaleDateString("vi-VN");
  const initialLocation = params.get("location") || "";
  const initialCenter = params.get("center") || "";
  const initialScheduleId = params.get("scheduleId") || "";

  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCenter, setSelectedCenter] = useState("");
  const [scheduleId, setScheduleId] = useState(initialScheduleId);
  const [donationSchedules, setDonationSchedules] = useState([]);
  const [timeSelected, setTimeSelected] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/schedule-donations")
      .then((res) => {
        setDonationSchedules(res.data);
      })
      .catch((err) => {
        console.error("Fail to load donation schedules:", err);
        toast.error("Failed to load donation schedules");
      });
  }, []);

  useEffect(() => {
    if (donationSchedules.length > 0) {
      if (initialLocation) {
        setSelectedLocation(decodeURIComponent(initialLocation));
      }
      if (initialCenter) {
        setSelectedCenter(decodeURIComponent(initialCenter));
      }
    }
  }, [donationSchedules, initialLocation, initialCenter]);

  const locations = donationSchedules.filter((item) => {
    const itemDate = item.date?.trim();
    return itemDate === selectedDate;
  });

  const selectedLocationTime = locations.find(
    (loc) => loc.location === selectedLocation
  );

  function getBloodGroup(schedule) {
    if (!schedule) return [];
    const found = donationSchedules.find(
      (item) => item.scheduleId === schedule.scheduleId
    );
    if (!found || !found.bloodNeed) return [];
    if (Array.isArray(found.bloodNeed)) return found.bloodNeed;
    return [found.bloodNeed];
  }
  const bloodGroups = getBloodGroup(selectedLocationTime);

  useEffect(() => {
    setTimeSelected(null);
  }, [selectedLocation]);

  const canContinue = !!selectedDate && !!selectedLocation && !!timeSelected;
  const navigate = useNavigate();

  const goToNext = () => {
    if (!canContinue) {
      toast.error("Please select a complete date, location, and time slot!");
      return;
    }

    const selectedTimeSlotObj = selectedLocationTime?.timeSlots?.find(
      (slot) => slot.id === timeSelected
    );

    const bookingData = {
      scheduleId: selectedLocationTime?.scheduleId || scheduleId,
      date: selectedDate,
      location: selectedLocation,
      center: selectedLocationTime?.center || "",
      timeSlot: selectedTimeSlotObj,
    };

    toast.success("Booking information saved!"); // Thêm dòng này
    navigate("/blood-registration2", { state: { bookingData } });
    console.log("Booking Data:", bookingData);
  };

  const convertDateForInput = (ddmmyyyy) => {
    const [d, m, y] = ddmmyyyy.split("/");
    return `${y}-${m}-${d}`;
  };

  const convertDateFromInput = (yyyymmdd) => {
    const [y, m, d] = yyyymmdd.split("-");
    return `${d}/${m}/${y}`;
  };

  return (
    <>
      <Navbar />
      <div className="blood-form-container">
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
          rel="stylesheet"
        ></link>
        <h2 className="blood-form-title">Booking for donation</h2>
        <div className="blood-form-body">
          <div className="blood-form-steps">
            <p className="blood-form-step active">
              <i className="bi bi-check-square"></i>Time & Location
            </p>
            <p className="blood-form-step">
              <i className="bi bi-calendar2"></i>Donation Registration Form
            </p>
          </div>
          <div className="blood-form-content">
            <div className="blood-form-section">
              <div className="blood-form-date-section">
                <h3 className="blood-form-section-title">
                  <i className="bi bi-calendar3"></i>Select date
                </h3>
                <input
                  type="date"
                  className="blood-form-date-input"
                  value={convertDateForInput(selectedDate)}
                  onChange={(e) =>
                    setSelectedDate(convertDateFromInput(e.target.value))
                  }
                />
              </div>
              <div className="blood-form-weekly-picker">
                <WeeklyDatePicker
                  selectedDate={selectedDate}
                  onChange={setSelectedDate}
                />
              </div>
            </div>

            <div className="blood-form-section">
              <h3 className="blood-form-section-title">
                <i className="bi bi-geo-alt"></i>Available Donation Locations
              </h3>
              {locations.length === 0 ? (
                <div className="blood-form-empty-message">
                  No donation locations available for this date
                </div>
              ) : (
                <div className="blood-form-location-list">
                  {locations.map((loc, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`blood-form-location-btn ${
                        selectedLocation === loc.location ? "selected" : ""
                      }`}
                      onClick={() => setSelectedLocation(loc.location)}
                    >
                      {loc.center} - {loc.location}
                    </button>
                  ))}
                </div>
              )}

              <div className="blood-form-blood-types">
                <label className="blood-form-section-subtitle">
                  <i className="bi bi-droplet-half"></i>Available Blood Types
                </label>
                <div className="blood-form-blood-type-container">
                  {!selectedLocation ? (
                    <div></div>
                  ) : bloodGroups.length === 0 ? (
                    <div className="blood-form-empty-message">
                      No blood types available for this location
                    </div>
                  ) : (
                    bloodGroups.map((group) => (
                      <span
                        key={group}
                        className={`blood-form-blood-type type-${group.toLowerCase()}`}
                      >
                        {group}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="blood-form-section">
              <h3 className="blood-form-section-title">
                Time slots for the selected location
              </h3>
              {!selectedLocation ? (
                <div className="blood-form-empty-message">
                  Please select a location first
                </div>
              ) : selectedLocationTime && selectedLocationTime.timeSlots ? (
                <div className="blood-form-time-slots">
                  {selectedLocationTime.timeSlots.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      className={`blood-form-time-slot ${
                        timeSelected === slot.id ? "selected" : ""
                      }`}
                      onClick={() => setTimeSelected(slot.id)}
                    >
                      {slot.startTime} - {slot.endTime}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="blood-form-empty-message">
                  No time slots available for this location
                </div>
              )}
            </div>

            <div className="button-submit">
              <div className="button-style-register">
                <button onClick={goToNext}>Next</button>
              </div>

            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
