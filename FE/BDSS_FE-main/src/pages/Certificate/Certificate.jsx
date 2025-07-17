import React, { useEffect, useState } from "react";
import axios from "../../helpers/axiosInstance";
import { getUserIdFromToken } from "../../helpers/getUserById";
import "./Certificate.css";
import logo from "../../images/logo.jpg";
import logoCertificate from "../../images/logoCertificate.jpg";

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
    <div className="certificate-wrapper">
      <div className="certificate">
        <div className="logo-header">
          <img src={logo} alt="Logo Center" className="cert-logo-center" />
        </div>

        <div className="medal-badge">
          <div className="medal-ribbon"></div>
          <div className="medal-circle"></div>
        </div>
        <h2 className="certificate-title">Blood Donation Certificate</h2>
        <h3 className="cert-name">
          {data.user?.fullName
            ?.split(" ")
            .map(
              (word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(" ")}
        </h3>

        <div className="cert-body">
          <p className="cert-text-underName">
            {" "}
           to honor their selfless act of donating blood. which has helped save lives and bring hope to those in need.
          </p>
          <strong>Blood Type:</strong> {data.user?.bloodType}
          <br />
          <strong>Birthday:</strong> {new Date(data.user?.birthday).toLocaleDateString('en-GB')}
          <br />
          <strong>Donation Date:</strong> {new Date(data.donationDate).toLocaleDateString('en-GB')}
          <br />
          <strong>Volume:</strong> {data.volume} ml
        </div>
        <div className="cert-signature-line"></div>
        <div className="certificate-footer">
          <div className="cert-signature">
            <div className="cert-signature-name">Dr. T-riet</div>
            <div className="cert-signature-title">
              Medical Director, Blood Donation
            </div>
          </div>
          <div className="certificate-logo">
            <img
              src={logoCertificate}
              alt="Logo Certificate"
              className="cert-logo"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
