import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  Button,
  Badge,
  Card,
  Row,
  Col,
  Spinner,
  Alert,
} from "react-bootstrap";
import axios from "axios";
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

function NotificationModal({ show, onHide, notification }) {
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
    const units = unitsMatch ? unitsMatch[1] : "Multiple";

    const priorityMatch = detail.match(/Priority:\s*([A-Za-z]+)/i);
    const priority = priorityMatch ? priorityMatch[1] : "NORMAL";

    const contactMatch =
      detail.match(/Contact:?\s*([^,\n]+)/i) ||
      detail.match(/Call:?\s*([^,\n]+)/i);
    const contact = contactMatch ? contactMatch[1].trim() : "";

    return {
      requestId,
      bloodType,
      hospital,
      units,
      priority,
      contact,
    };
  };

  const emergencyDetails = isEmergencyRequest ? getEmergencyDetails() : null;

  const handleRespondClick = async (requestId) => {
    const confirmed = window.confirm(
      "Are you sure you want to respond to this emergency blood request? " +
        "By confirming, you're agreeing to donate blood for this emergency."
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsSubmitting(true);
      setResponseMessage(null);
      setResponseError(null);

      const token = sessionStorage.getItem("accessToken");

      const response = await axios.post(
        `http://localhost:8080/api/emergency/${requestId}/respond`,
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
        navigate("/appointment");
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
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      className={isEmergencyRequest ? "emergency-modal" : "standard-modal"}
    >
      <Modal.Header
        closeButton
        className={
          isRareBloodRequest
            ? "rare-blood-header"
            : isEmergencyRequest
            ? "emergency-header"
            : ""
        }
      >
        <Modal.Title>
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
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="notification-datetime mb-3">
          <small className="text-muted">
            {notification.date} at {notification.time}
          </small>
          {emergencyDetails && emergencyDetails.requestId && (
            <div className="mt-1">
              <small className="text-muted">
                Request ID:{" "}
                <span className="fw-bold">{emergencyDetails.requestId}</span>
              </small>
            </div>
          )}
        </div>

        {/* Special formatted view for emergency requests */}
        {isEmergencyRequest && emergencyDetails && (
          <Card className="mb-4 emergency-card">
            <Card.Header
              className={
                isRareBloodRequest
                  ? "bg-warning text-dark"
                  : "bg-danger text-white"
              }
            >
              <h5 className="m-0">
                {isRareBloodRequest
                  ? "RARE BLOOD TYPE EMERGENCY"
                  : "EMERGENCY BLOOD REQUEST"}
              </h5>
            </Card.Header>
            <Card.Body>
              <Row className="emergency-details">
                <Col xs={12} md={6} className="mb-3">
                  <div className="d-flex align-items-center">
                    <FaTint className="me-2" style={{ color: "#dc3545" }} />
                    <div>
                      <div className="text-muted small">
                        Blood Type Required
                      </div>
                      <div className="fw-bold fs-4">
                        {emergencyDetails.bloodType}
                      </div>
                    </div>
                  </div>
                </Col>

                <Col xs={12} md={6} className="mb-3">
                  <div className="d-flex align-items-center">
                    <FaHourglassHalf
                      className="me-2"
                      style={{ color: "#fd7e14" }}
                    />
                    <div>
                      <div className="text-muted small">Units Needed</div>
                      <div className="fw-bold">
                        {emergencyDetails.units} unit(s)
                      </div>
                    </div>
                  </div>
                </Col>

                <Col xs={12} className="mb-3">
                  <div className="d-flex align-items-center">
                    <FaHospital className="me-2" style={{ color: "#0d6efd" }} />
                    <div>
                      <div className="text-muted small">Hospital</div>
                      <div className="fw-bold">{emergencyDetails.hospital}</div>
                    </div>
                  </div>
                </Col>

                {emergencyDetails.contact && (
                  <Col xs={12} className="mb-3">
                    <div className="d-flex align-items-center">
                      <FaPhoneAlt
                        className="me-2"
                        style={{ color: "#198754" }}
                      />
                      <div>
                        <div className="text-muted small">
                          Emergency Contact
                        </div>
                        <div className="fw-bold">
                          {emergencyDetails.contact}
                        </div>
                      </div>
                    </div>
                  </Col>
                )}

                <Col xs={12}>
                  <div className="d-flex align-items-center">
                    <FaMapMarkerAlt
                      className="me-2"
                      style={{ color: "#6c757d" }}
                    />
                    <div>
                      <div className="text-muted small">Priority</div>
                      <div>
                        <Badge
                          bg={
                            emergencyDetails.priority === "HIGH"
                              ? "danger"
                              : emergencyDetails.priority === "MEDIUM"
                              ? "warning"
                              : "info"
                          }
                        >
                          {emergencyDetails.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        )}

        {/* Original notification content */}
        <div
          className={`notification-detail ${
            isEmergencyRequest ? "emergency-detail" : ""
          }`}
        >
          {notification.detail.split("\n").map((line, index) => (
            <p
              key={index}
              className={
                line.includes("EMERGENCY") || line.includes("Urgent need")
                  ? "text-danger fw-bold"
                  : line.includes("RARE BLOOD")
                  ? "text-warning fw-bold"
                  : ""
              }
            >
              {line}
            </p>
          ))}
        </div>

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
      </Modal.Body>

      <Modal.Footer>
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
                "Respond to Request"
              )}
            </Button>
          )}
      </Modal.Footer>
    </Modal>
  );
}

export default NotificationModal;
