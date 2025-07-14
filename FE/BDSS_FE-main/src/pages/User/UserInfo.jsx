import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import "./UserInfo.css";
import Footer from "../../components/footer";
import getUserById, { getUserIdFromToken } from "../../helpers/getUserById";
import { IoMdMale, IoMdFemale } from "react-icons/io";
import { CiWarning } from "react-icons/ci";
import { FaKey, FaTrashAlt, FaUserEdit } from "react-icons/fa";
import { FaPenToSquare } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

function GenderIcon({ sex }) {
  if (sex.toUpperCase() === "MALE")
    return (
      <>
        <IoMdMale style={{ color: "#1976d2" }} />
        <span>Male</span>
      </>
    );
  if (sex.toUpperCase() === "FEMALE")
    return (
      <>
        <IoMdFemale style={{ color: "#e91e63" }} />
        <span>Female</span>
      </>
    );
  return null;
}

function UserInfo({ userId }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [donationReport, setDonationReport] = useState(null);
  const userIdFromToken = getUserIdFromToken();
  const navigate = useNavigate();

  useEffect(() => {
    getUserById(userId).then(setUser).catch(setError);
    fetchDonationReport(userId);
  }, [userId]);

  const fetchDonationReport = async (uid) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/reports/user/${userIdFromToken}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );
      setDonationReport(res.data);
    } catch (err) {
      setDonationReport(null);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/users/delete/${userIdFromToken}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");
      toast.success("Account deleted successfully");
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error(error?.response?.data?.message || "Failed to delete account");
    }
  };

  function formatDate(dateStr) {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  }

  if (error) return <p>Error: {error.message}</p>;
  if (!user) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="user-info-modern-container">
        <div className="user-info-modern-sidebar">
          <h4 style={{ marginBottom: 18, color: "#b30000" }}>Actions</h4>
          <Button
            variant="outline-primary"
            className="user-info-modern-action-btn"
            onClick={() => navigate(`/user/update/${userIdFromToken}`)}
          >
            <FaPenToSquare style={{ marginRight: 8 }} />
            Edit Profile
          </Button>
          <Button
            variant="outline-secondary"
            className="user-info-modern-action-btn"
            onClick={() => navigate(`/user/change-password`)}
            style={{ marginTop: 10 }}
          >
            <FaKey style={{ marginRight: 8 }} />
            Change Password
          </Button>
          <Button
            variant="outline-danger"
            className="user-info-modern-action-btn"
            style={{ marginTop: 10 }}
            onClick={() => setShowConfirm(true)}
          >
            <FaTrashAlt style={{ marginRight: 8 }} />
            Delete Account
          </Button>
          {showConfirm && (
            <div className="user-info-modern-confirm">
              <p style={{ color: "#b30000", fontWeight: "bold" }}>
                Are you sure you want to delete your account? This action cannot
                be undone.
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                <Button variant="danger" onClick={handleDelete}>
                  Yes, Delete
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="user-info-modern-card">
          <div className="user-info-modern-header">
            <div className="user-info-modern-avatar">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="Avatar"
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <FaUserEdit size={56} color="#b30000" />
              )}
            </div>
            <div>
              <h2 style={{ marginBottom: 4 }}>{user.fullName}</h2>
              <span className="user-info-modern-role">
                {user.role || "Donor"}
              </span>
            </div>
          </div>
          <div className="user-info-modern-details">
            <div className="user-info-modern-row">
              <span className="user-info-modern-label">Gender:</span>
              <span className="user-info-modern-value">
                <GenderIcon sex={user.sex} />
              </span>
            </div>
            <div className="user-info-modern-row">
              <span className="user-info-modern-label">Birthday:</span>
              <span className="user-info-modern-value">
                {formatDate(user.birthday)}
              </span>
            </div>
            <div className="user-info-modern-row">
              <span className="user-info-modern-label">Email:</span>
              <span className="user-info-modern-value">
                {user.email ?? <span style={{ color: "#888" }}>N/A</span>}
              </span>
            </div>
            <div className="user-info-modern-row">
              <span className="user-info-modern-label">Phone:</span>
              <span className="user-info-modern-value">
                {user.phoneNumber ?? <span style={{ color: "#888" }}>N/A</span>}
              </span>
            </div>
            <div className="user-info-modern-row">
              <span className="user-info-modern-label">Address:</span>
              <span className="user-info-modern-value">
                {user.address ?? <span style={{ color: "#888" }}>N/A</span>}
              </span>
            </div>
            <div className="user-info-modern-row">
              <span className="user-info-modern-label">Occupation:</span>
              <span className="user-info-modern-value">
                {user.occupation ?? <span style={{ color: "#888" }}>N/A</span>}
              </span>
            </div>
            <div className="user-info-modern-row">
              <span className="user-info-modern-label">Blood Type:</span>
              <span className="user-info-modern-value">
                {user.bloodType ?? <span style={{ color: "#888" }}>N/A</span>}
              </span>
            </div>
          </div>
        </div>
        <div className="user-info-modern-report">
          <h4>Your Blood Donation Journey</h4>
          <div className="user-info-modern-report-content">
            {donationReport ? (
              <>
                <p>
                  <strong>Total Donations:</strong>
                  <span>{donationReport.totalDonations} times</span>
                </p>
                <p>
                  <strong>Total Blood Volume:</strong>
                  <span>{donationReport.totalBloodVolume} L</span>
                </p>
                <p>
                  <strong>Last Donation:</strong>
                  <span>
                    {donationReport.lastDonationDate
                      ? formatDate(donationReport.lastDonationDate)
                      : "No record"}
                  </span>
                </p>
                <p>
                  <strong>Eligible to Donate?</strong>
                  <span
                    className={donationReport.eligibleToDonate ? "yes" : "no"}
                  >
                    {donationReport.eligibleToDonate
                      ? "Yes, you are ready!"
                      : "Not yet"}
                  </span>
                </p>
                {!donationReport.eligibleToDonate && (
                  <>
                    <p>
                      <strong>Next Eligible Date:</strong>
                      <span className="next-eligible">
                        {donationReport.nextEligibleDate
                          ? formatDate(donationReport.nextEligibleDate)
                          : "Pending"}
                      </span>
                    </p>
                    <div className="report-message">
                      {donationReport.message}
                    </div>
                    <div className="friendly-tip">
                      Take care and see you at the next donation!
                    </div>
                  </>
                )}
                {donationReport.eligibleToDonate && (
                  <div className="friendly-tip">
                    You are eligible to donate blood. Thank you for your
                    kindness!
                  </div>
                )}
              </>
            ) : (
              <p style={{ color: "#888" }}>No donation report available.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default UserInfo;
