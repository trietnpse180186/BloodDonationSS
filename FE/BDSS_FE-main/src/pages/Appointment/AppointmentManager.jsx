import React, { useEffect, useState } from "react";
import axios from "../../helpers/axiosInstance";
import "./AppointmentManager.css";
import { baseUrl } from "../../Utils/baseUrl";
import Table from "react-bootstrap/Table";
import { Button, Modal, Toast } from "react-bootstrap";
import {
  getQuestionTextById,
  getLabelByValue,
} from "../../helpers/bloodRegister";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

export default function AppointmentManager() {
  const [appointments, setAppointments] = useState([]);
  const [surveyData, setSurveyData] = useState({ show: false, data: [] });
  const [detailData, setDetailData] = useState({ show: false, data: {} });
  const [bloodTypeUpdateData, setBloodTypeUpdateData] = useState({
    show: false,
    user: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [otpModal, setOtpModal] = useState({ show: false, item: null, otp: "" });
  const accessToken = sessionStorage.getItem("accessToken");

  useEffect(() => {
    axios
      .get(`${baseUrl}/api/booking/all`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => setAppointments(res.data))
      .catch((err) => {
        console.error("Error fetching appointment details:", err);
      });
  }, [accessToken]);

  function formatDate(isoDate) {
    if (!isoDate) return "";
    const [year, month, day] = isoDate.split("-");
    return `${day}-${month}-${year}`;
  }

  function formatDateTime(isoDateTime) {
    if (!isoDateTime) return "";
    const [datePart, timePart] = isoDateTime.split("T");
    const [year, month, day] = datePart.split("-");
    return `${day}-${month}-${year} ${timePart.slice(0, 5)}`;
  }

  const renderStatus = (status) => {
    switch (status) {
      case "PENDING":
        return <span className="status-pending">Pending</span>;
      case "APPROVED":
        return <span className="status-confirmed">Approved</span>;
      case "CHECKED_IN":
        return <span className="status-confirmed">Approved</span>;
      case "CANCELLED":
        return <span className="status-cancelled">Cancelled</span>;
      case "COMPLETED":
        return <span className="status-complete">Complete</span>;
      default:
        return <span>{status}</span>;
    }
  };

  const grouped = appointments.reduce((acc, item) => {
    const name = item.user?.fullName || "Unknown User";
    const email = item.user?.email || "Unknown Email";
    const key = `${name} (${email})`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const filteredGrouped = Object.entries(grouped).filter(([key, items]) => {
    const name = items[0]?.user?.fullName || "";
    const email = items[0]?.user?.email || "";
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleAccept = async (item) => {
    try {
      await axios.post(
        `${baseUrl}/api/checkin/approve/${item.bookingId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const userId = item.user?.userID || item.user?.userId;
      if (userId) {
        await axios.post(
          `${baseUrl}/notifications`,
          {
            title: "Appointment Approved",
            detail: "Your blood donation appointment has been approved.",
            donorId: userId,
            date: new Date().toISOString().slice(0, 10),
            time: new Date().toTimeString().slice(0, 5),
            type: "NOTIFICATION",
            priority: "NORMAL",
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      }

      setAppointments((prev) =>
        prev.map((appt) =>
          appt.bookingId === item.bookingId
            ? { ...appt, status: "APPROVED" }
            : appt
        )
      );

      toast.success("Appointment approved successfully!");
    } catch (error) {
      toast.error("Approve Failed!");
    }
  };

  const handleSurvey = async (item) => {
    try {
      const res = await axios.get(`${baseUrl}/api/survey/${item.bookingId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setSurveyData({ show: true, data: res.data });
    } catch (error) {
      console.error("Error fetching survey data:", error);
      await Swal.fire({
        icon: "error",
        title: "Load Survey Failed!",
        confirmButtonColor: "#2563eb",
      });
    }
  };
  const handleDetail = (item) => {
    const bookingData = {
      center: item.center,
      location: item.location || item.address,
      date: formatDate(item.dateDonation),
      timeSlot:
        item.startTime && item.endTime
          ? `${item.startTime.slice(0, 5)} - ${item.endTime.slice(0, 5)}`
          : "N/A",
      status: item.status,
      bloodType: item.bloodType,
      user: item.user,
      bookingTime: formatDateTime(item.bookingTime),
    };

    setDetailData({ show: true, data: bookingData });
  };

  const handleCancel = async (item) => {
    Swal.fire({
      icon: "warning",
      title: "Reject Confirmation",
      text: "Are you sure you want to reject this appointment?",
      showCancelButton: true,
      confirmButtonText: "Reject Appointment",
      cancelButtonText: "Back",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        await axios.put(
          `${baseUrl}/api/booking/${item.bookingId}`,
          { status: "CANCELLED" },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        setAppointments((prev) =>
          prev.map((appt) =>
            appt.bookingId === item.bookingId
              ? { ...appt, status: "CANCELLED" }
              : appt
          )
        );

        const bookingRes = await axios.get(
          `${baseUrl}/api/booking/${item.bookingId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        const userId = bookingRes.data?.user?.userID;

        if (userId) {
          await axios.post(
            `${baseUrl}/notifications`,
            {
              title: "Appointment Cancelled",
              detail:
                "Your blood donation appointment has been cancelled by the staff. Reason: You do not meet the eligibility requirements for blood donation.",
              donorId: userId,
              date: new Date().toISOString().slice(0, 10),
              time: new Date().toTimeString().slice(0, 5),
              type: "NOTIFICATION",
              priority: "NORMAL",
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
        } else {
          console.warn("User ID not found for notification.");
        }
      } catch (error) {
        console.error("Cancel or notification failed:", error);
        toast.error("Cancel Failed!");
      }
    });
  };

  const handleRestore = async (item) => {
    try {
      await axios.put(
        `${baseUrl}/api/booking/${item.bookingId}`,
        { status: "PENDING" },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.bookingId === item.bookingId
            ? { ...appt, status: "PENDING" }
            : appt
        )
      );
    } catch (error) {
      toast.error("Restore Failed!");
    }
  };

  const handleBloodTypeUpdate = (user) => {
    setBloodTypeUpdateData({ show: true, user: user });
  };

  const updateUserBloodType = async (userId, bloodType) => {
    try {
      await axios.put(
        `${baseUrl}/users/${userId}`,
        { bloodType: bloodType },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setAppointments((prev) =>
        prev.map((appt) =>
          appt.user?.userID === userId || appt.user?.userId === userId
            ? { ...appt, user: { ...appt.user, bloodType: bloodType } }
            : appt
        )
      );

      toast.success("Blood type updated successfully!");
      setBloodTypeUpdateData({ show: false, user: null });
    } catch (error) {
      console.error("Error updating blood type:", error);
      toast.error("Failed to update blood type!");
    }
  };

  const handleCheckinClick = (item) => {
    setOtpModal({ show: true, item, otp: "" });
  };

  const handleCheckin = async () => {
    if (!otpModal.otp) {
      toast.error("Please enter the OTP code!");
      return;
    }
    try {
      await axios.post(
        `${baseUrl}/api/checkin`,
        { checkInCode: otpModal.otp },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.bookingId === otpModal.item.bookingId
            ? { ...appt, status: "CHECKED_IN", checkInCode: otpModal.otp }
            : appt
        )
      );
      toast.success("Check-in successful!");
      setOtpModal({ show: false, item: null, otp: "" });
    } catch (error) {
      toast.error("Check-in Failed! Please check the OTP code.");
    }
  };

  const handleCheckout = async (item) => {
    try {
      await axios.post(
        `${baseUrl}/api/checkin/checkout/${item.bookingId}`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.bookingId === item.bookingId
            ? { ...appt, status: "COMPLETED" }
            : appt
        )
      );
      toast.success("Checkout successful!");

      const userId = item.user?.userID || item.user?.userId;
      if (userId) {
        await axios.post(
          `${baseUrl}/notifications`,
          {
            title: "Appointment Completed",
            detail: "Thank you for your blood donation. Your appointment has been completed successfully.",
            donorId: userId,
            date: new Date().toISOString().slice(0, 10),
            time: new Date().toTimeString().slice(0, 5),
            type: "NOTIFICATION",
            priority: "NORMAL",
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      }

      const bloodType =
        item.user?.bloodType || item.bloodType || "UNKNOWN";
      if (!bloodType || bloodType === "UNKNOWN") {
        setBloodTypeUpdateData({ show: true, user: item.user });
        toast.info("Please update blood type for this Donor!");
      }
    } catch (error) {
      toast.error("Checkout Failed!");
    }
  };

  return (
    <div className="appointment-manager-container">
      <h2>Donor Appointment Details</h2>

      {/* Search Bar */}
      <div className="search-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="search-results-info">
          {searchTerm && (
            <span>
              Found {filteredGrouped.length} user(s) matching "{searchTerm}"
            </span>
          )}
        </div>
      </div>

      <div className="appointment-manager">
        {filteredGrouped.length === 0 && searchTerm ? (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No Results Found</h3>
            <p>No users found matching "{searchTerm}"</p>
            <p>Try searching with a different name or email.</p>
          </div>
        ) : (
          filteredGrouped.map(([key, items]) => (
            <div className="appointment-card" key={key}>
              <div className="user-header">
                <h3>{key}</h3>
                <div className="blood-type-section">
                  <span className="blood-type-display">
                    Blood Type: {items[0]?.user?.bloodType || "Unknown"}
                  </span>
                  <button
                    className="blood-type-update-btn"
                    onClick={() => handleBloodTypeUpdate(items[0]?.user)}
                    title="Update Blood Type"
                  >
                    ✏️ Update Blood Type
                  </button>
                </div>
              </div>
              <div className="appointment-table">
                <Table bordered responsive>
                  <thead>
                    <tr>
                      <th>Center</th>
                      <th>Booking Time</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.bookingId}>
                        <td>{item.center}</td>
                        <td>{formatDateTime(item.bookingTime)}</td>
                        <td>{renderStatus(item.status)}</td>
                        <td className="action-buttons">
                          <button onClick={() => handleDetail(item)}>
                            View Details
                          </button>
                          <button onClick={() => handleSurvey(item)}>
                            View Survey
                          </button>
                          {item.status === "PENDING" && (
                            <button onClick={() => handleAccept(item)}>
                              Accepted
                            </button>
                          )}
                          {item.status === "APPROVED" && (
                            <button onClick={() => handleCheckinClick(item)}>
                              Check-In
                            </button>
                          )}
                          {item.status === "CHECKED_IN" && (
                            <button onClick={() => handleCheckout(item)}>
                              Check-Out
                            </button>
                          )}
                          {item.status === "PENDING" && (
                            <button onClick={() => handleCancel(item)}>
                              Reject
                            </button>
                          )}
                          {item.status === "CANCELLED" && (
                            <button onClick={() => handleRestore(item)}>
                              Restore
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal nhập OTP checkin */}
      <Modal
        show={otpModal.show}
        onHide={() => setOtpModal({ show: false, item: null, otp: "" })}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Check-in: Enter OTP Code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <label htmlFor="otpInput">
              Please enter the OTP code for check-in:
            </label>
            <input
              id="otpInput"
              type="text"
              className="form-control mt-2"
              value={otpModal.otp}
              onChange={(e) =>
                setOtpModal((prev) => ({ ...prev, otp: e.target.value }))
              }
              placeholder="Enter OTP code"
              autoFocus
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setOtpModal({ show: false, item: null, otp: "" })}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCheckin}>
            Confirm Check-in
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={surveyData.show}
        onHide={() => setSurveyData({ show: false, data: [] })}
      >
        <Modal.Header closeButton>
          <Modal.Title>Survey Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!Array.isArray(surveyData.data) || surveyData.data.length === 0 ? (
            <div>No survey found.</div>
          ) : (
            <ul>
              {surveyData.data
                .slice()
                .sort((a, b) => {
                  const order = [
                    "q1",
                    "q2",
                    "q3",
                    "q4",
                    "q5",
                    "q6",
                    "q7",
                    "q8",
                    "q9",
                  ];
                  return (
                    order.indexOf(a.description) - order.indexOf(b.description)
                  );
                })
                .map((s, idx) => {
                  let audit = {};
                  try {
                    audit = JSON.parse(s.answerAudit);
                  } catch {
                    audit = {};
                  }
                  return (
                    <li key={idx}>
                      <strong>{getQuestionTextById(s.description)}</strong>
                      <br />
                      <strong>Answer:</strong>{" "}
                      {getLabelByValue(s.description, audit.answer)}
                      {audit.additionalInfo && audit.additionalInfo !== "" && (
                        <span>
                          <br />
                          <strong>Info:</strong> {audit.additionalInfo}
                        </span>
                      )}
                    </li>
                  );
                })}
            </ul>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setSurveyData({ show: false, data: [] })}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={detailData.show}
        onHide={() => setDetailData({ show: false, data: {} })}
      >
        <Modal.Header closeButton>
          <Modal.Title>Booking Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!detailData.data ? (
            <div>No details available.</div>
          ) : (
            <div className="booking-details">
              <div className="detail-row">
                <strong>Donor:</strong> {detailData.data.user?.fullName}
              </div>
              <div className="detail-row">
                <strong>Email:</strong> {detailData.data.user?.email}
              </div>
              <div className="detail-row">
                <strong>Phone:</strong> {detailData.data.user?.phoneNumber}
              </div>
              <div className="detail-row">
                <strong>Booking Time:</strong> {detailData.data.bookingTime}
              </div>
              <div className="detail-row">
                <strong>Status:</strong> {detailData.data.status}
              </div>
              <div className="detail-card">
                <div className="detail-row">
                  <strong>Center:</strong> {detailData.data.center}
                </div>
                <div className="detail-row">
                  <strong>Location:</strong> {detailData.data.location}
                </div>
                <div className="detail-row">
                  <strong>Date:</strong> {detailData.data.date}
                </div>
                <div className="detail-row">
                  <strong>Time:</strong> {detailData.data.timeSlot}
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setDetailData({ show: false, data: null })}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Blood Type Update Modal */}
      <Modal
        show={bloodTypeUpdateData.show}
        onHide={() => setBloodTypeUpdateData({ show: false, user: null })}
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Blood Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {bloodTypeUpdateData.user && (
            <div>
              <div className="mb-3">
                <strong>User:</strong> {bloodTypeUpdateData.user.fullName}
              </div>
              <div className="mb-3">
                <strong>Email:</strong> {bloodTypeUpdateData.user.email}
              </div>
              <div className="mb-3">
                <strong>Current Blood Type:</strong>{" "}
                {bloodTypeUpdateData.user.bloodType || "Unknown"}
              </div>
              <div className="mb-3">
                <label htmlFor="bloodTypeSelect">
                  <strong>Select New Blood Type:</strong>
                </label>
                <select
                  id="bloodTypeSelect"
                  className="form-control mt-2"
                  defaultValue={bloodTypeUpdateData.user.bloodType || ""}
                  onChange={(e) => {
                    const selectedBloodType = e.target.value;
                    document.getElementById("confirmBloodTypeBtn").onclick =
                      () => {
                        updateUserBloodType(
                          bloodTypeUpdateData.user.userID ||
                            bloodTypeUpdateData.user.userId,
                          selectedBloodType
                        );
                      };
                  }}
                >
                  <option value="">Unknown</option>
                  <option value="A_POSITIVE">A+</option>
                  <option value="A_NEGATIVE">A-</option>
                  <option value="B_POSITIVE">B+</option>
                  <option value="B_NEGATIVE">B-</option>
                  <option value="AB_POSITIVE">AB+</option>
                  <option value="AB_NEGATIVE">AB-</option>
                  <option value="O_POSITIVE">O+</option>
                  <option value="O_NEGATIVE">O-</option>
                </select>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setBloodTypeUpdateData({ show: false, user: null })}
          >
            Cancel
          </Button>
          <Button id="confirmBloodTypeBtn" variant="primary" onClick={() => {}}>
            Update Blood Type
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </div>
  );
}
