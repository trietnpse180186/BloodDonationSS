import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Badge,
  Button,
  Tab,
  Tabs,
  Spinner,
  Alert,
} from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaHospital,
  FaTint,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClipboardCheck,
  FaClock,
  FaInfoCircle,
} from "react-icons/fa";
import Navbar from "../../components/navbar";

export default function EmergencyDonation() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Get status badge
  const getStatusBadge = (status) => {
    if (!status) return <Badge bg="secondary">Unknown</Badge>;

    switch (status.toUpperCase()) {
      case "PENDING":
        return <Badge bg="warning">Pending</Badge>;
      case "COMPLETED":
        return <Badge bg="success">Completed</Badge>;
      case "CANCELLED":
        return <Badge bg="danger">Cancelled</Badge>;
      case "NO_SHOW":
        return <Badge bg="dark">No Show</Badge>;
      case "IN_PROGRESS":
        return <Badge bg="info">In Progress</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  // Fetch donations
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem("accessToken");

        if (!token) {
          throw new Error("Authentication required");
        }

        const response = await axios.get(
          "http://localhost:8080/api/emergency/user/history",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Donations data:", response.data);
        setDonations(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching donations:", err);
        setError(
          err.response?.data?.message || "Failed to load donation history"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  // Filter donations based on active tab
  const filteredDonations = donations.filter((donation) => {
    if (activeTab === "all") return true;
    return donation.status.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <>
      <Navbar />
      <Container className="py-5">
        <h2 className="mb-4">Your Emergency Blood Donations</h2>

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="danger" />
            <p className="mt-3">Loading your donation history...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">
            <FaInfoCircle className="me-2" />
            {error}
          </Alert>
        ) : (
          <>
            {filteredDonations.length === 0 ? (
              <Alert variant="info" className="text-center">
                No donations found in this category.
              </Alert>
            ) : (
              filteredDonations.map((donation) => (
                <Card key={donation.donationId} className="mb-4 donation-card">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="mb-0">
                        Donation #{donation.donationId.substring(0, 8)}
                      </h5>
                      <small className="text-muted">
                        Request ID: {donation.requestId}
                      </small>
                    </div>
                    <div className="d-flex align-items-center">
                      {getStatusBadge(donation.status)}
                      {donation.requestStatus && (
                        <Badge
                          bg={
                            donation.requestStatus === "ACTIVE"
                              ? "success"
                              : "secondary"
                          }
                          className="ms-2"
                        >
                          Request: {donation.requestStatus}
                        </Badge>
                      )}
                    </div>
                  </Card.Header>

                  <Card.Body className="p-0">
                    {/* Phần thông tin bệnh viện */}
                    <div className="hospital-section p-4 border-bottom">
                      <div className="d-flex">
                        <div className="icon-wrapper">
                          <FaHospital size={24} />
                        </div>
                        <div className="ms-3">
                          <h5>{donation.hospitalName || "Unknown Hospital"}</h5>
                          <p className="mb-0 text-muted">
                            {donation.hospitalAddress || "No address provided"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Phần thông tin hiến máu */}
                    <div className="donation-info-section p-4">
                      <Row>
                        <Col xs={12} md={4} className="mb-3 mb-md-0">
                          <div className="d-flex flex-column align-items-center p-3 bg-light rounded">
                            <FaTint className="mb-2 text-danger" size={20} />
                            <p className="mb-1 text-secondary small">
                              Blood Type
                            </p>
                            <h6 className="mb-0 fw-bold">
                              {donation.bloodType}
                            </h6>
                          </div>
                        </Col>

                        <Col xs={12} md={4} className="mb-3 mb-md-0">
                          <div className="d-flex flex-column align-items-center p-3 bg-light rounded">
                            <FaCalendarAlt
                              className="mb-2 text-info"
                              size={20}
                            />
                            <p className="mb-1 text-secondary small">
                              Response Date
                            </p>
                            <h6 className="mb-0 fw-bold">
                              {new Date(
                                donation.responseTime
                              ).toLocaleDateString()}
                            </h6>
                          </div>
                        </Col>

                        <Col xs={12} md={4}>
                          <div className="d-flex flex-column align-items-center p-3 bg-light rounded">
                            <FaClock className="mb-2 text-primary" size={20} />
                            <p className="mb-1 text-secondary small">
                              Response Time
                            </p>
                            <h6 className="mb-0 fw-bold">
                              {new Date(
                                donation.responseTime
                              ).toLocaleTimeString()}
                            </h6>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Card.Body>

                  <Card.Footer className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      Last updated: {formatDate(donation.lastUpdatedTime)}
                    </small>
                  </Card.Footer>
                </Card>
              ))
            )}
          </>
        )}
      </Container>
    </>
  );
}
