import React, { useState, useEffect } from "react";
import { Container, Row, Col, Badge, Spinner, Alert } from "react-bootstrap";
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
import { baseUrl } from "../../Utils/baseUrl";
export default function EmergencyDonation() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .donation-card-modern {
        will-change: transform, box-shadow;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStatusBadge = (status) => {
    if (!status)
      return (
        <Badge
          style={{
            background: "linear-gradient(135deg, #8e9aaf, #738290)",
            border: "none",
            padding: "6px 12px",
            borderRadius: "15px",
            fontSize: "0.7rem",
            fontWeight: "600",
            color: "white",
            textShadow: "0 1px 2px rgba(0,0,0,0.2)",
          }}
        >
          Unknown
        </Badge>
      );

    const getStatusStyle = (statusType) => {
      const styles = {
        PENDING: {
          background: "linear-gradient(135deg, #f39c12, #e67e22)",
          color: "white",
          boxShadow: "0 2px 8px rgba(243, 156, 18, 0.3)",
        },
        COMPLETED: {
          background: "linear-gradient(135deg, #27ae60, #2ecc71)",
          color: "white",
          boxShadow: "0 2px 8px rgba(39, 174, 96, 0.3)",
        },
        CANCELLED: {
          background: "linear-gradient(135deg, #e74c3c, #c0392b)",
          color: "white",
          boxShadow: "0 2px 8px rgba(231, 76, 60, 0.3)",
        },
        NO_SHOW: {
          background: "linear-gradient(135deg, #7f8c8d, #95a5a6)",
          color: "white",
          boxShadow: "0 2px 8px rgba(127, 140, 141, 0.3)",
        },
        IN_PROGRESS: {
          background: "linear-gradient(135deg, #3498db, #2980b9)",
          color: "white",
          boxShadow: "0 2px 8px rgba(52, 152, 219, 0.3)",
        },
      };
      return styles[statusType] || styles.PENDING;
    };

    const statusStyle = getStatusStyle(status.toUpperCase());

    return (
      <Badge
        style={{
          ...statusStyle,
          border: "none",
          padding: "6px 12px",
          borderRadius: "15px",
          fontSize: "0.8rem",
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: "0.3px",
          textShadow: "0 1px 2px rgba(0,0,0,0.2)",
        }}
      >
        {status}
      </Badge>
    );
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
          `${baseUrl}/api/emergency/user/history`,
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

  return (
    <>
      <Navbar />
      <div
        style={{
          background:
            "linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #e9ecef 100%)",
          minHeight: "100vh",
        }}
      >
        <Container
          fluid
          className="py-5"
          style={{ maxWidth: "1600px", margin: "0 auto", padding: "0 30px" }}
        >
          {/* Medical Professional Header */}
          <div className="text-center mb-5">
            <div
              style={{
                background: "linear-gradient(135deg, #dc3545 0%, #b02a37 100%)",
                borderRadius: "15px",
                padding: "40px 30px",
                boxShadow: "0 10px 30px rgba(220, 53, 69, 0.2)",
                color: "white",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-50px",
                  right: "-50px",
                  width: "100px",
                  height: "100px",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "50%",
                }}
              ></div>
              <div
                style={{
                  position: "absolute",
                  bottom: "-30px",
                  left: "-30px",
                  width: "60px",
                  height: "60px",
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: "50%",
                }}
              ></div>

              <div style={{ fontSize: "48px", marginBottom: "15px" }}>🩸</div>
              <h1
                style={{
                  fontWeight: "700",
                  fontSize: "2.3rem",
                  marginBottom: "12px",
                  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                Emergency Blood Donation History
              </h1>
              <p
                style={{
                  fontSize: "1.1rem",
                  margin: "0",
                  opacity: "0.95",
                  fontWeight: "400",
                }}
              >
                📋 Your lifesaving contributions to emergency medical situations
              </p>
            </div>
          </div>

          {loading ? (
            <div className="text-center my-5">
              <div
                style={{
                  background: "white",
                  borderRadius: "15px",
                  padding: "50px",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
                  border: "1px solid #f1f3f4",
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    background: "linear-gradient(135deg, #dc3545, #b02a37)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    animation: "pulse 2s infinite",
                  }}
                >
                  <Spinner
                    animation="border"
                    style={{ color: "white" }}
                    size="sm"
                  />
                </div>
                <h4
                  style={{
                    color: "#495057",
                    marginBottom: "8px",
                    fontWeight: "600",
                  }}
                >
                  Loading your donation history...
                </h4>
                <p
                  style={{ color: "#6c757d", margin: "0", fontSize: "0.95rem" }}
                >
                  Please wait while we fetch your medical records
                </p>
              </div>
            </div>
          ) : error ? (
            <div
              style={{
                background: "white",
                borderRadius: "12px",
                padding: "25px",
                boxShadow: "0 6px 20px rgba(220, 53, 69, 0.15)",
                border: "1px solid rgba(220, 53, 69, 0.2)",
              }}
            >
              <Alert
                variant="danger"
                style={{
                  background: "transparent",
                  border: "none",
                  padding: "0",
                  margin: "0",
                }}
              >
                <div className="d-flex align-items-center">
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "linear-gradient(135deg, #dc3545, #b02a37)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "15px",
                    }}
                  >
                    <FaInfoCircle size={18} color="white" />
                  </div>
                  <div>
                    <h5
                      style={{
                        margin: "0 0 5px 0",
                        color: "#721c24",
                        fontWeight: "600",
                      }}
                    >
                      Error Loading Data
                    </h5>
                    <p style={{ margin: "0", color: "#721c24" }}>{error}</p>
                  </div>
                </div>
              </Alert>
            </div>
          ) : (
            <>
              {donations.length === 0 ? (
                <div
                  style={{
                    background: "white",
                    borderRadius: "15px",
                    padding: "50px",
                    textAlign: "center",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
                    border: "1px solid #f1f3f4",
                  }}
                >
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 20px",
                      fontSize: "32px",
                    }}
                  >
                    📋
                  </div>
                  <h4
                    style={{
                      color: "#495057",
                      marginBottom: "10px",
                      fontWeight: "600",
                    }}
                  >
                    No Donation Records Found
                  </h4>
                  <p
                    style={{
                      color: "#6c757d",
                      margin: "0",
                      fontSize: "0.95rem",
                    }}
                  >
                    No donations found in this category.
                  </p>
                </div>
              ) : (
                <Row className="g-2">
                  {donations.map((donation, index) => (
                    <Col xs={12} key={donation.donationId}>
                      <div
                        className="donation-card-modern"
                        style={{
                          background: "white",
                          borderRadius: "12px",
                          overflow: "hidden",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                          transition: "all 0.3s ease",
                          border: "1px solid rgba(220, 53, 69, 0.1)",
                          animation: `slideUp 0.6s ease ${index * 0.1}s both`,
                          marginBottom: "15px",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow =
                            "0 8px 30px rgba(220, 53, 69, 0.12)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow =
                            "0 4px 20px rgba(0,0,0,0.08)";
                        }}
                      >
                        {/* Professional Header with Status */}
                        <div
                          style={{
                            background:
                              "linear-gradient(135deg, #dc3545 0%, #b02a37 100%)",
                            padding: "15px 25px",
                            color: "white",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div className="d-flex align-items-center">
                            <div>
                              <h6
                                style={{
                                  margin: "0 0 2px 0",
                                  fontWeight: "700",
                                  fontSize: "1.1rem",
                                }}
                              >
                                Emergency Donation #
                                {donation.donationId.substring(0, 8)}
                              </h6>
                            </div>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            {getStatusBadge(donation.status)}
                            {donation.requestStatus && (
                              <Badge
                                style={{
                                  background:
                                    donation.requestStatus === "ACTIVE"
                                      ? "rgba(255,255,255,0.25)"
                                      : "rgba(255,255,255,0.15)",
                                  border: "1px solid rgba(255,255,255,0.3)",
                                  fontSize: "0.65rem",
                                  padding: "4px 8px",
                                  borderRadius: "12px",
                                  color: "white",
                                }}
                              >
                                {donation.requestStatus}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Main Content Grid */}
                        <div style={{ padding: "20px 25px" }}>
                          <Row className="align-items-center">
                            {/* Hospital Information */}
                            <Col lg={4} md={12} className="mb-3 mb-lg-0">
                              <div className="d-flex align-items-center">
                                <div
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    background:
                                      "linear-gradient(135deg, #dc3545, #b02a37)",
                                    borderRadius: "10px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginRight: "15px",
                                    boxShadow:
                                      "0 4px 12px rgba(220, 53, 69, 0.25)",
                                  }}
                                >
                                  <FaHospital size={22} color="white" />
                                </div>
                                <div style={{ flex: 1 }}>
                                  <h6
                                    style={{
                                      margin: "0 0 4px 0",
                                      color: "#2c3e50",
                                      fontWeight: "600",
                                      fontSize: "1.1rem",
                                    }}
                                  >
                                    {donation.hospitalName ||
                                      "Unknown Hospital"}
                                  </h6>
                                  <p
                                    style={{
                                      margin: "0",
                                      color: "#6c757d",
                                      fontSize: "0.95rem",
                                      display: "flex",
                                      alignItems: "flex-start",
                                      gap: "5px",
                                      lineHeight: "1.3",
                                    }}
                                  >
                                    <FaMapMarkerAlt
                                      style={{
                                        color: "#dc3545",
                                        fontSize: "0.75rem",
                                        marginTop: "2px",
                                        flexShrink: 0,
                                      }}
                                    />
                                    <span style={{ wordBreak: "break-word" }}>
                                      {donation.hospitalAddress ||
                                        "No address provided"}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </Col>

                            {/* Blood Type & Medical Info */}
                            <Col lg={3} md={4} className="mb-3 mb-lg-0">
                              <div className="text-center">
                                <div
                                  style={{
                                    background:
                                      "linear-gradient(135deg, #dc3545 0%, #b02a37 100%)",
                                    borderRadius: "10px",
                                    padding: "12px 16px",
                                    color: "white",
                                    display: "inline-block",
                                    minWidth: "120px",
                                  }}
                                >
                                  <FaTint
                                    size={20}
                                    style={{ marginBottom: "4px" }}
                                  />
                                  <p
                                    style={{
                                      margin: "0 0 2px 0",
                                      fontSize: "0.85rem",
                                      opacity: "0.9",
                                      textTransform: "uppercase",
                                      fontWeight: "500",
                                      letterSpacing: "0.5px",
                                    }}
                                  >
                                    Blood Type
                                  </p>
                                  <h5
                                    style={{
                                      margin: "0",
                                      fontWeight: "800",
                                      fontSize: "1.6rem",
                                    }}
                                  >
                                    {donation.bloodType}
                                  </h5>
                                </div>
                              </div>
                            </Col>

                            <Col lg={3} md={4} className="mb-3 mb-lg-0">
                              <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                  <FaCalendarAlt
                                    size={20}
                                    style={{
                                      color: "#dc3545",
                                      marginRight: "8px",
                                    }}
                                  />
                                  <div>
                                    <small
                                      style={{
                                        color: "#6c757d",
                                        fontSize: "0.85rem",
                                        fontWeight: "600",
                                        textTransform: "uppercase",
                                        display: "block",
                                        lineHeight: "1",
                                      }}
                                    >
                                      Date
                                    </small>
                                    <span
                                      style={{
                                        color: "#2c3e50",
                                        fontWeight: "600",
                                        fontSize: "1rem",
                                      }}
                                    >
                                      {new Date(
                                        donation.responseTime
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>

                                <div className="d-flex align-items-center">
                                  <FaClock
                                    size={20}
                                    style={{
                                      color: "#dc3545",
                                      marginRight: "8px",
                                    }}
                                  />
                                  <div>
                                    <small
                                      style={{
                                        color: "#6c757d",
                                        fontSize: "0.85rem",
                                        fontWeight: "600",
                                        textTransform: "uppercase",
                                        display: "block",
                                        lineHeight: "1",
                                      }}
                                    >
                                      Time
                                    </small>
                                    <span
                                      style={{
                                        color: "#2c3e50",
                                        fontWeight: "600",
                                        fontSize: "1rem",
                                      }}
                                    >
                                      {new Date(
                                        donation.responseTime
                                      ).toLocaleTimeString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </Col>

                            {/* Action & Status Info */}
                            <Col lg={2} md={4}>
                              <div className="text-center">
                                <div
                                  style={{
                                    background:
                                      "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                                    borderRadius: "8px",
                                    padding: "10px 12px",
                                    border: "1px solid rgba(220, 53, 69, 0.1)",
                                  }}
                                >
                                  <FaClipboardCheck
                                    size={20}
                                    style={{
                                      color: "#dc3545",
                                      marginBottom: "4px",
                                    }}
                                  />
                                  <p
                                    style={{
                                      margin: "0 0 2px 0",
                                      fontSize: "0.85rem",
                                      color: "#6c757d",
                                      fontWeight: "600",
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    Record
                                  </p>
                                  <small
                                    style={{
                                      color: "#2c3e50",
                                      fontWeight: "600",
                                      fontSize: "0.9rem",
                                      display: "block",
                                    }}
                                  >
                                    Emergency
                                  </small>
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </div>

                        {/* Professional Footer */}
                        <div
                          style={{
                            background: "#f8f9fa",
                            padding: "10px 25px",
                            borderTop: "1px solid rgba(0,0,0,0.05)",
                            display: "flex",
                            justifyContent: "between",
                            alignItems: "center",
                          }}
                        >
                          <small
                            style={{
                              color: "#6c757d",
                              fontSize: "0.75rem",
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                            }}
                          >
                            <FaClock
                              style={{ fontSize: "0.7rem", color: "#dc3545" }}
                            />
                            Last updated: {formatDate(donation.lastUpdatedTime)}
                          </small>
                          <div
                            style={{
                              width: "6px",
                              height: "6px",
                              background: "#dc3545",
                              borderRadius: "50%",
                              opacity: "0.6",
                            }}
                          />
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              )}
            </>
          )}
        </Container>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </>
  );
}
