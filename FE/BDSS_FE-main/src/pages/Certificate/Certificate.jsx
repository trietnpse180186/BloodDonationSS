import React, { useEffect, useState } from "react";
import axios from "../../helpers/axiosInstance";
import { getUserIdFromToken } from "../../helpers/getUserById";

export default function Certificate({ bookingId }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const token = sessionStorage.getItem("accessToken");
  const userId = getUserIdFromToken();

  useEffect(() => {
    if (!userId) {
      setError("User information not found.");
      return;
    }

    axios
      .get(`http://localhost:8080/api/certificates/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const cert = res.data.find((c) => c.bookingId === bookingId);
        if (cert) {
          setData(cert);
        } else {
          setError("No matching certificate found.");
        }
      })
      .catch((err) =>
        setError(err.response?.data?.message || "Failed to load certificate.")
      );
  }, [bookingId, userId]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!data) return <p>Loading certificate...</p>;

  return (
    <div className="certificate-box">
      <h3>Blood Donation Certificate</h3>
      <p>
        <strong>Full Name:</strong> {data.user?.fullName}
      </p>
      <p>
        <strong>Email:</strong> {data.user?.email}
      </p>
      <p>
        <strong>Blood Type:</strong> {data.user?.bloodType}
      </p>
      <p>
        <strong>Phone Number:</strong> {data.user?.phoneNumber}
      </p>
      <p>
        <strong>Date of Birth:</strong> {data.user?.birthday}
      </p>
      <hr />
      <p>
        <strong>Donation Date:</strong> {data.donationDate}
      </p>
      <p>
        <strong>Volume:</strong> {data.volume} ml
      </p>
      <p>
        <strong>Booking ID:</strong> {data.bookingId}
      </p>
    </div>
  );
}
