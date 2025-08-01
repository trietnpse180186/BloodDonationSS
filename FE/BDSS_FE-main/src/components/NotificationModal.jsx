import React, { useEffect, useState } from "react";
import "./NotificationModal.css";
import { useNavigate } from "react-router-dom";
import CustomModal from "./CustomModal";
import { Button, Badge, Card, Row, Col, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaStar,
  FaExclamationTriangle,
  FaHospital,
  FaTint,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaHourglassHalf,
  FaInfoCircle,
} from "react-icons/fa";
import { baseUrl } from "../Utils/baseUrl";

function formatDateDMY(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function NotificationModal({ show, onHide, notification }) {
  useEffect(() => {
    if (notification) {
      console.log("[VN] Notification object nhận được:", notification);
    }
  }, [notification]);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);
  const [responseError, setResponseError] = useState(null);

  useEffect(() => {
    if (notification) {
      console.log("Notification object:", notification);
      console.log("Action URL:", notification.actionUrl);
    }
  }, [notification]);

  if (!notification) {
    return null;
  }

  const isEmergencyRequest =
    notification.detail &&
    (notification.detail.includes("EMERGENCY BLOOD REQUEST") ||
      notification.detail.includes("Emergency Blood Request") ||
      notification.detail.includes("Urgent need for blood type"));

  const isRareBloodRequest =
    notification.detail &&
    (notification.detail.includes("RARE BLOOD TYPE EMERGENCY") ||
      notification.detail.includes("rare and especially needed"));

  const isRegularNotification = !isEmergencyRequest;

  const getEmergencyDetails = () => {
    if (!isEmergencyRequest) return null;

    const detail = notification.detail;

    let requestId = null;

    if (notification.actionUrl) {
      requestId = notification.actionUrl.split("/").pop();
      console.log("ID extracted from actionUrl:", requestId);
    }

    if (!requestId) {
      const uuidPattern =
        /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i;
      const uuidMatch = notification.detail.match(uuidPattern);
      if (uuidMatch) {
        requestId = uuidMatch[0];
        console.log("ID extracted from UUID pattern:", requestId);
      }
    }

    const bloodTypeMatch =
      detail.match(/blood type ([A-Z_+-]+)/i) ||
      detail.match(/type:\s*([A-Z_+-]+)/i);
    const bloodType = bloodTypeMatch ? bloodTypeMatch[1] : "Unknown";

    const hospitalMatch =
      detail.match(/at\s+(.+?)(?=\.|near|$)/i) ||
      detail.match(/Hospital:\s*(.+?)(?=\.|$)/i);
    const hospital = hospitalMatch ? hospitalMatch[1].trim() : "Local Hospital";

    const unitsMatch =
      detail.match(/Units.*?:\s*(\d+)/i) || detail.match(/(\d+)\s+units?/i);
    const unitsNeeded = unitsMatch
      ? unitsMatch[1]
      : notification.unitsNeeded || "Multiple";

    const priorityMatch = detail.match(/Priority:\s*([A-Za-z]+)/i);
    const priority = priorityMatch
      ? priorityMatch[1]
      : notification.priority || "NORMAL";

    const contactMatch =
      detail.match(/Contact:?\s*([^,\n]+)/i) ||
      detail.match(/Call:?\s*([^,\n]+)/i);
    const contact = contactMatch
      ? contactMatch[1].trim()
      : notification.contactPhone || "";

    const addressMatch = detail.match(
      /Address:?\s*([\s\S]*?)(?=(Contact Person:|Contact:|Description:|Priority:|$))/i
    );
    const address = addressMatch
      ? addressMatch[1].trim()
      : notification.address || "";

    const contactPersonMatch = detail.match(/Contact Person:?\s*([^,\n]+)/i);
    const contactPerson = contactPersonMatch
      ? contactPersonMatch[1].trim()
      : notification.contactPerson || "";

    const descriptionMatch = detail.match(/Description:?\s*([^,\n]+)/i);
    const description = descriptionMatch
      ? descriptionMatch[1].trim()
      : notification.description || "";

    return {
      requestId,
      bloodType,
      hospital,
      unitsNeeded,
      priority,
      contact,
      address,
      contactPerson,
      description,
    };
  };

  const emergencyDetails = isEmergencyRequest ? getEmergencyDetails() : null;
  useEffect(() => {
    if (emergencyDetails) {
      console.log("[VN] emergencyDetails đã parse:", emergencyDetails);
    }
  }, [emergencyDetails]);

  const handleRespondClick = async (requestId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to respond to this emergency blood request? By confirming, you're agreeing to donate blood for this emergency.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, I agree",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#198754",
      cancelButtonColor: "#d33",
      customClass: {
        popup: "swal2-modal-custom",
      },
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setIsSubmitting(true);
      setResponseMessage(null);
      setResponseError(null);

      const token = sessionStorage.getItem("accessToken");

      const response = await axios.post(
        `${baseUrl}/api/emergency/${requestId}/respond`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response success:", response.data);
      setResponseMessage(
        "Thank you! Your response has been recorded. The hospital will contact you shortly."
      );

      setTimeout(() => {
        onHide();
        navigate("/emergency-donation");
      }, 3000);
    } catch (error) {
      console.error("Error responding to request:", error);
      const errorMsg =
        error.response?.data?.message ||
        "Unable to respond to this request. Please try again later.";
      setResponseError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomModal
      show={show}
      onHide={onHide}
      size="xlarge"
      headerClass={
        isRareBloodRequest
          ? "warning"
          : isEmergencyRequest
          ? "danger"
          : "primary"
      }
      title={
        <div className="d-flex align-items-center gap-2">
          {isRareBloodRequest && (
            <FaStar className="notification-icon-symbol rare" />
          )}
          {isEmergencyRequest && !isRareBloodRequest && (
            <FaExclamationTriangle className="notification-icon-symbol emergency" />
          )}
          {isRegularNotification && (
            <FaInfoCircle className="notification-icon-symbol standard" />
          )}

          <div>
            {notification.title}
            {isEmergencyRequest && (
              <Badge
                bg={isRareBloodRequest ? "warning" : "danger"}
                className="ms-2"
              >
                {isRareBloodRequest ? "RARE BLOOD" : "URGENT"}
              </Badge>
            )}
          </div>
        </div>
      }
      footer={
        <div className="d-flex gap-2">
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          {isEmergencyRequest &&
            emergencyDetails &&
            emergencyDetails.requestId && (
              <Button
                variant={isRareBloodRequest ? "warning" : "danger"}
                onClick={() => handleRespondClick(emergencyDetails.requestId)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Spinner
                    animation="border"
                    size="sm"
                    className="me-2"
                    role="status"
                    aria-hidden="true"
                  />
                ) : (
                  "Accept"
                )}
              </Button>
            )}
        </div>
      }
    >
      <div className="notification-datetime mb-3">
        <small className="text-muted">
          {formatDateDMY(notification.date)} at {notification.time}
        </small>
      </div>

      {isEmergencyRequest && emergencyDetails && (
        <div className="emergency-request-container">
          {/* Emergency Header */}
          <div
            className={`emergency-header ${
              isRareBloodRequest ? "rare-blood" : "urgent"
            }`}
          >
            <div className="emergency-title">
              <h4 className="mb-0">
                {isRareBloodRequest
                  ? "🌟 RARE BLOOD TYPE EMERGENCY"
                  : "🚨 EMERGENCY BLOOD REQUEST"}
              </h4>
              <Badge
                bg={isRareBloodRequest ? "warning" : "danger"}
                className="emergency-badge"
              >
                {isRareBloodRequest ? "RARE BLOOD" : "URGENT"}
              </Badge>
            </div>
          </div>

          {/* Critical Information Row */}
          <div className="critical-info-section">
            <div className="info-card blood-type-card">
              <div className="info-icon">
                <FaTint />
              </div>
              <div className="info-content">
                <div className="info-label">Blood Type Needed</div>
                <div className="info-value blood-type">
                  {emergencyDetails.bloodType}
                </div>
              </div>
            </div>

            <div className="info-card units-card">
              <div className="info-icon">
                <FaHourglassHalf />
              </div>
              <div className="info-content">
                <div className="info-label">Units Required</div>
                <div className="info-value">
                  {emergencyDetails.unitsNeeded} unit(s)
                </div>
              </div>
            </div>

            <div className="info-card priority-card">
              <div className="info-icon">
                <FaExclamationTriangle />
              </div>
              <div className="info-content">
                <div className="info-label">Priority Level</div>
                <Badge
                  bg={
                    emergencyDetails.priority === "HIGH"
                      ? "danger"
                      : emergencyDetails.priority === "MEDIUM"
                      ? "warning"
                      : "info"
                  }
                  className="priority-badge"
                >
                  {emergencyDetails.priority}
                </Badge>
              </div>
            </div>
          </div>

          {/* Hospital Information */}
          <div className="hospital-section">
            <div className="section-title">
              <FaHospital className="section-icon" />
              <h5>Hospital Information</h5>
            </div>
            <div className="hospital-details">
              <div className="hospital-name">{emergencyDetails.hospital}</div>
              {emergencyDetails.address && (
                <div className="hospital-address">
                  <FaMapMarkerAlt className="address-icon" />
                  <span>{emergencyDetails.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="contact-section">
            <div className="section-title">
              <FaPhoneAlt className="section-icon" />
              <h5>Contact Information</h5>
            </div>
            <div className="contact-details">
              {emergencyDetails.contactPerson && (
                <div className="contact-item">
                  <div className="contact-label">Contact Person:</div>
                  <div className="contact-value">
                    {emergencyDetails.contactPerson}
                  </div>
                </div>
              )}
              {emergencyDetails.contactPhone && (
                <div className="contact-item">
                  <div className="contact-label">Emergency Contact:</div>
                  <div className="contact-value emergency-phone">
                    {emergencyDetails.contactPhone}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          {emergencyDetails.description && (
            <div className="description-section">
              <div className="section-title">
                <FaInfoCircle className="section-icon" />
                <h5>Additional Information</h5>
              </div>
              <div className="description-content">
                {emergencyDetails.description}
              </div>
            </div>
          )}
        </div>
      )}

      {!isEmergencyRequest && (
        <div className="notification-detail">
          {notification.detail.split("\n").map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      )}

      {responseMessage && (
        <Alert variant="success" className="mt-3">
          {responseMessage}
        </Alert>
      )}
      {responseError && (
        <Alert variant="danger" className="mt-3">
          {responseError}
        </Alert>
      )}
    </CustomModal>
  );
}

export default NotificationModal;
