import React, { useEffect, useState } from "react";
import axios from "../../assets/axiosInstance";
import "./MedicalSchedule.css"; // Assuming you have a CSS file for styling

export default function MedicalSchedule() {
  const [schedules, setSchedules] = useState([]);
  const accessToken = sessionStorage.getItem("accessToken");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/schedule-donations/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => setSchedules(res.data))
      .catch((err) => {
        console.error("Error fetching schedules:", err);
      });
  }, [accessToken]);

  return (
    <div className="medical-schedule">
      <h2>Donation Schedules</h2>
      <table>
        <thead>
          <tr>
            <th>Center</th>
            <th>Location</th>
            <th>Date</th>
            <th>Time</th>
            <th>NUmber of Donor</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((s) => (
            <tr key={s.id}>
              <td>{s.center}</td>
              <td>{s.location}</td>
              <td>{s.date}</td>
              <td>
                {s.timeSlots &&
                  s.timeSlots.map((slot) => (
                    <div key={slot.id}>
                      {slot.startTime} - {slot.endTime}
                    </div>
                  ))}
              </td>
              <td>{s.donorCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
