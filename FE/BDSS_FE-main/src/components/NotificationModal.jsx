import React, { useEffect, useState } from "react";
import "./NotificationModal.css";
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

    // Capture everything after 'Address:' up to next field or end
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

        {isEmergencyRequest && emergencyDetails && (
          <Card className="mb-4 emergency-card custom-emergency-card">
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
              <Row className="emergency-details custom-emergency-details">
                <Col xs={12} md={6} className="mb-2">
                  <div className="d-flex align-items-center">
                    <FaTint
                      className="me-2"
                      style={{ color: "#dc3545", fontSize: 20 }}
                    />
                    <div>
                      <div className="text-muted small">
                        Blood Type Required
                      </div>
                      <div className="fw-bold" style={{ fontSize: 18 }}>
                        {emergencyDetails.bloodType}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col xs={12} md={6} className="mb-2">
                  <div className="d-flex align-items-center">
                    <FaHourglassHalf
                      className="me-2"
                      style={{ color: "#fd7e14", fontSize: 18 }}
                    />
                    <div>
                      <div className="text-muted small">Units Needed</div>
                      <div className="fw-bold" style={{ fontSize: 18 }}>
                        {emergencyDetails.unitsNeeded} unit(s)
                      </div>
                    </div>
                  </div>
                </Col>
                <Col xs={12} md={6} className="mb-2">
                  <div className="d-flex align-items-center">
                    <FaHospital
                      className="me-2"
                      style={{ color: "#0d6efd", fontSize: 18 }}
                    />
                    <div>
                      <div className="text-muted small">Hospital</div>
                      <div className="fw-bold" style={{ fontSize: 16 }}>
                        {emergencyDetails.hospital}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Address section centered below the first row */}
              {emergencyDetails.address && (
                <div className="d-flex align-items-start justify-content-center mb-3">
                  <FaMapMarkerAlt
                    className="me-2"
                    style={{ color: "#6c757d", fontSize: 18, marginTop: 2 }}
                  />
                  <div className="text-center">
                    <div className="text-muted small">Address</div>
                    <pre
                      className="fw-bold address-text"
                      style={{
                        margin: 0,
                        background: "none",
                        padding: 0,
                        textAlign: "center",
                      }}
                    >
                      {emergencyDetails.address}
                    </pre>
                  </div>
                </div>
              )}
              <hr
                style={{
                  borderTop: "2px solid #dee2e6",
                  margin: "12px 0 16px 0",
                }}
              />

              <Row className="emergency-details custom-emergency-details">
                <Col xs={12} md={6} className="mb-2">
                  <div className="d-flex align-items-center">
                    {emergencyDetails.contactPerson ? (
                      <>
                        <FaPhoneAlt
                          className="me-2"
                          style={{ color: "#198754", fontSize: 18 }}
                        />
                        <div>
                          <div className="text-muted small">Contact Person</div>
                          <div className="fw-bold" style={{ fontSize: 16 }}>
                            {emergencyDetails.contactPerson}
                          </div>
                        </div>
                      </>
                    ) : null}
                  </div>
                </Col>
                <Col xs={12} md={6} className="mb-2">
                  <div className="d-flex align-items-center">
                    {emergencyDetails.contact ? (
                      <>
                        <FaPhoneAlt
                          className="me-2"
                          style={{ color: "#198754", fontSize: 18 }}
                        />
                        <div>
                          <div className="text-muted small">
                            Emergency Contact
                          </div>
                          <div className="fw-bold" style={{ fontSize: 16 }}>
                            {emergencyDetails.contact}
                          </div>
                        </div>
                      </>
                    ) : null}
                  </div>
                </Col>
              </Row>

              <Row className="emergency-details custom-emergency-details">
                <Col xs={12} md={8} className="mb-2">
                  <div className="d-flex align-items-center">
                    {emergencyDetails.description ? (
                      <>
                        <FaInfoCircle
                          className="me-2"
                          style={{ color: "#0d6efd", fontSize: 18 }}
                        />
                        <div>
                          <div className="text-muted small">Description</div>
                          <div className="fw-bold" style={{ fontSize: 15 }}>
                            {emergencyDetails.description}
                          </div>
                        </div>
                      </>
                    ) : null}
                  </div>
                </Col>
                <Col xs={12} md={4} className="mb-2">
                  <div className="d-flex align-items-center">
                    <FaMapMarkerAlt
                      className="me-2"
                      style={{ color: "#6c757d", fontSize: 16 }}
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
                          style={{ fontSize: 13 }}
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
