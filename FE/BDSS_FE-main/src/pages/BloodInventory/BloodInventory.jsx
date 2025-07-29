import React, { useState, useEffect } from "react";
import UseBloodHistoryModal from "../../components/UseBloodHistoryModal";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Spinner,
  Alert,
  Tabs,
  Tab,
  Badge,
  Modal,
} from "react-bootstrap";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  FaArrowTrendUp,
  FaArrowTrendDown,
  FaDroplet,
  FaCalendarDays,
  FaTriangleExclamation,
} from "react-icons/fa6";
import "./BloodInventory.css";
import { saveAs } from "file-saver";
import { baseUrl } from "../../Utils/baseUrl";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const bloodTypeDisplay = {
  A_POSITIVE: "A+",
  A_NEGATIVE: "A-",
  B_POSITIVE: "B+",
  B_NEGATIVE: "B-",
  AB_POSITIVE: "AB+",
  AB_NEGATIVE: "AB-",
  O_POSITIVE: "O+",
  O_NEGATIVE: "O-",
};

const bloodTypeColors = {
  A_POSITIVE: "#FF5252",
  A_NEGATIVE: "#FF8A80",
  B_POSITIVE: "#536DFE",
  B_NEGATIVE: "#8C9EFF",
  AB_POSITIVE: "#9C27B0",
  AB_NEGATIVE: "#CE93D8",
  O_POSITIVE: "#43A047",
  O_NEGATIVE: "#81C784",
};

export default function BloodInventory() {
  const handleDownloadPdf = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");
      const response = await axios.get(
        `${baseUrl}/api/blood-inventory/usage-report/pdf`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
      saveAs(response.data, "blood-usage-report.pdf");
    } catch (err) {
      alert("Failed to download PDF report.");
    }
  };
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("summary");
  const [showLowStock, setShowLowStock] = useState(false);
  const [usageStats, setUsageStats] = useState({});
  const [usageStatsLoading, setUsageStatsLoading] = useState(false);
  const [usageStatsError, setUsageStatsError] = useState(null);

  const [useBloodModal, setUseBloodModal] = useState(false);
  const [useBloodForm, setUseBloodForm] = useState({
    bloodType: "",
    quantity: "",
    reason: "",
  });
  const [useBloodResult, setUseBloodResult] = useState(null);

  const [detailModal, setDetailModal] = useState({
    show: false,
    bloodType: null,
  });
  const [detailData, setDetailData] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);

  const handleShowDetail = async (bloodType) => {
    setDetailModal({ show: true, bloodType });
    setDetailLoading(true);
    setDetailError(null);
    try {
      const token = sessionStorage.getItem("accessToken");
      const res = await axios.get(
        `${baseUrl}/api/blood-inventory/details?bloodType=${bloodType}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDetailData(res.data);
    } catch (err) {
      setDetailError("Can not load!");
      setDetailData([]);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseDetail = () => {
    setDetailModal({ show: false, bloodType: null });
    setDetailData([]);
    setDetailError(null);
  };
  const fetchInventoryData = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");
      const response = await axios.get(
        `${baseUrl}/api/blood-inventory/summary`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setInventoryData(response.data);
    } catch (err) {
      console.error("Error fetching blood inventory data:", err);
      setError("Failed to load blood inventory data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleUseBlood = async () => {
    setUseBloodResult(null);
    try {
      const token = sessionStorage.getItem("accessToken");
      await axios.post(
        `${baseUrl}/api/blood-inventory/use`,
        {
          bloodType: useBloodForm.bloodType,
          quantity: Number(useBloodForm.quantity),
          reason: useBloodForm.reason,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUseBloodResult({ success: true, message: "Blood used successfully!" });
      setUseBloodForm({ bloodType: "", quantity: "", reason: "" });
      fetchInventoryData();
    } catch (err) {
      setUseBloodResult({
        success: false,
        message: err?.response?.data || "Failed to use blood.",
      });
    }
  };

  function getCurrentMonthRange() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    };
  }

  useEffect(() => {
    fetchInventoryData();
    const { startDate, endDate } = getCurrentMonthRange();
    const fetchUsageStats = async () => {
      setUsageStatsLoading(true);
      setUsageStatsError(null);
      try {
        const token = sessionStorage.getItem("accessToken");
        const res = await axios.get(
          `${baseUrl}/api/blood-inventory/usage-statistics?startDate=${encodeURIComponent(
            startDate
          )}&endDate=${encodeURIComponent(endDate)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsageStats(res.data);
      } catch (err) {
        setUsageStatsError("Can not load!");
        setUsageStats({});
      } finally {
        setUsageStatsLoading(false);
      }
    };
    fetchUsageStats();
  }, []);

  const totalAvailableUnits = inventoryData.reduce(
    (sum, item) => sum + item.availableUnits,
    0
  );
  function formatDateDMY(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  const totalExpiringUnits = inventoryData.reduce(
    (sum, item) => sum + item.expiringUnits,
    0
  );
  const totalUsedThisMonth = usageStats.totalUsed ? usageStats.totalUsed : 0;
  const totalReceivedThisMonth = inventoryData.reduce(
    (sum, item) => sum + item.receivedThisMonth,
    0
  );

  const barChartData = {
    labels: inventoryData.map(
      (item) => bloodTypeDisplay[item.bloodType] || item.bloodType
    ),
    datasets: [
      {
        label: "Available Units",
        data: inventoryData.map((item) => item.availableUnits),
        backgroundColor: inventoryData.map(
          (item) => `${bloodTypeColors[item.bloodType]}CC`
        ),
        borderColor: inventoryData.map(
          (item) => bloodTypeColors[item.bloodType]
        ),
        borderWidth: 1,
      },
      {
        label: "Expiring Units",
        data: inventoryData.map((item) => item.expiringUnits),
        backgroundColor: inventoryData.map(
          (item) => `${bloodTypeColors[item.bloodType]}77`
        ),
        borderColor: inventoryData.map(
          (item) => bloodTypeColors[item.bloodType]
        ),
        borderWidth: 1,
      },
    ],
  };

  const doughnutData = {
    labels: inventoryData.map(
      (item) => bloodTypeDisplay[item.bloodType] || item.bloodType
    ),
    datasets: [
      {
        data: inventoryData.map((item) => item.availableQuantity),
        backgroundColor: inventoryData.map(
          (item) => bloodTypeColors[item.bloodType]
        ),
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const lineChartData = {
    labels: inventoryData.map(
      (item) => bloodTypeDisplay[item.bloodType] || item.bloodType
    ),
    datasets: [
      {
        label: "Received This Month",
        data: inventoryData.map((item) => item.receivedThisMonth),
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Used This Month (ml)",
        data: inventoryData.map((item) =>
          usageStats.bloodTypeDetails &&
          usageStats.bloodTypeDetails[item.bloodType]
            ? usageStats.bloodTypeDetails[item.bloodType].amount || 0
            : 0
        ),
        borderColor: "#FF5722",
        backgroundColor: "rgba(255, 87, 34, 0.1)",
        tension: 0.4,
        fill: false,
      },
    ],
  };

  if (loading) {
    return (
      <div className="blood-inventory-loading">
        <Spinner animation="border" variant="danger" />
        <p>Loading blood inventory data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  const filteredData = showLowStock
    ? inventoryData.filter((item) => item.availableUnits < 10)
    : inventoryData;
  return (
    <Container fluid className="blood-inventory-container">
      <h1 className="blood-inventory-title">Blood Inventory Management</h1>

      <Row className="mb-3">
        <Col md={3} className="mb-2">
          <button
            className="btn-use-blood"
            onClick={() => setUseBloodModal(true)}
          >
            Use Blood
          </button>
        </Col>
        <Col md={3} className="mb-2">
          <button
            className="btn btn-outline-primary w-100"
            onClick={() => setShowHistoryModal(true)}
          >
            View Usage History
          </button>
        </Col>
        <Col md={3} className="mb-2">
          <button
            className="btn btn-outline-success w-100"
            onClick={handleDownloadPdf}
          >
            Download Usage Report (PDF)
          </button>
        </Col>
      </Row>

      <UseBloodHistoryModal
        show={showHistoryModal}
        onHide={() => setShowHistoryModal(false)}
      />

      <Modal show={useBloodModal} onHide={() => setUseBloodModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Use Blood</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Blood Type</label>
            <select
              className="form-select"
              value={useBloodForm.bloodType}
              onChange={(e) =>
                setUseBloodForm((f) => ({ ...f, bloodType: e.target.value }))
              }
            >
              <option value="">Select Blood Type...</option>
              {Object.keys(bloodTypeDisplay).map((type) => (
                <option key={type} value={type}>
                  {bloodTypeDisplay[type]}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Quantity (ml)</label>
            <input
              type="number"
              className="form-control"
              value={useBloodForm.quantity}
              onChange={(e) =>
                setUseBloodForm((f) => ({ ...f, quantity: e.target.value }))
              }
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Reason</label>
            <input
              type="text"
              className="form-control"
              value={useBloodForm.reason}
              onChange={(e) =>
                setUseBloodForm((f) => ({ ...f, reason: e.target.value }))
              }
            />
          </div>
          {useBloodResult && (
            <Alert variant={useBloodResult.success ? "success" : "danger"}>
              {useBloodResult.message}
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={() => setUseBloodModal(false)}
          >
            Close
          </button>
          <button
            className="btn btn-primary"
            onClick={handleUseBlood}
            disabled={
              !useBloodForm.bloodType ||
              !useBloodForm.quantity ||
              !useBloodForm.reason
            }
          >
            Use Blood
          </button>
        </Modal.Footer>
      </Modal>

      <Row className="mb-4">
        <Col xs={12} md={6} lg={3}>
          <Card className="dashboard-card">
            <Card.Body>
              <div className="dashboard-card-content">
                <div className="dashboard-card-icon available">
                  <FaDroplet />
                </div>
                <div className="dashboard-card-stats">
                  <h3>{totalAvailableUnits}</h3>
                  <p>Available Units</p>
                </div>
              </div>
              <div className="mt-2 text-center"></div>
            </Card.Body>
          </Card>
        </Col>
        <Modal show={detailModal.show} onHide={handleCloseDetail} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              Detail:{" "}
              {detailModal.bloodType && bloodTypeDisplay[detailModal.bloodType]}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {detailLoading ? (
              <div className="text-center">
                <Spinner animation="border" />
              </div>
            ) : detailError ? (
              <Alert variant="danger">{detailError}</Alert>
            ) : (
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Blood Unit ID</th>
                      <th>Blood Type</th>
                      <th>Received Date</th>
                      <th>Expiry Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailData.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center">
                          No data available
                        </td>
                      </tr>
                    ) : (
                      detailData.map((d) => (
                        <tr key={d.id}>
                          <td>{d.id}</td>
                          <td>
                            {bloodTypeDisplay[d.bloodType] || d.bloodType}
                          </td>
                          <td>{formatDateDMY(d.receivedDate)}</td>
                          <td>{formatDateDMY(d.expiryDate)}</td>
                          <td>{d.status}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-secondary" onClick={handleCloseDetail}>
              Close
            </button>
          </Modal.Footer>
        </Modal>

        <Col xs={12} md={6} lg={3}>
          <Card className="dashboard-card">
            <Card.Body>
              <div className="dashboard-card-content">
                <div className="dashboard-card-icon expiring">
                  <FaTriangleExclamation />
                </div>
                <div className="dashboard-card-stats">
                  <h3>{totalExpiringUnits}</h3>
                  <p>Expiring Units</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6} lg={3}>
          <Card className="dashboard-card">
            <Card.Body>
              <div className="dashboard-card-content">
                <div className="dashboard-card-icon used">
                  <FaArrowTrendDown />
                </div>
                <div className="dashboard-card-stats">
                  <h3>{totalUsedThisMonth.toFixed(1)} ml</h3>
                  <p>Used This Month</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6} lg={3}>
          <Card className="dashboard-card">
            <Card.Body>
              <div className="dashboard-card-content">
                <div className="dashboard-card-icon received">
                  <FaArrowTrendUp />
                </div>
                <div className="dashboard-card-stats">
                  <h3>{totalReceivedThisMonth.toFixed(1)} ml</h3>
                  <p>Received This Month</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4 justify-content-center">
        <Col xs={12}>
          <div className="bloodtype-detail-grid">
            {Array.from(
              new Set(inventoryData.map((item) => item.bloodType))
            ).map((type) => (
              <button
                key={type}
                className="btn btn-bloodtype-detail m-2"
                onClick={() => handleShowDetail(type)}
              >
                View {bloodTypeDisplay[type] || type} Details
              </button>
            ))}
          </div>
        </Col>
      </Row>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        id="inventory-tabs"
        className="mb-4"
      >
        <Tab eventKey="summary" title="Summary">
          <Row>
            <Col md={6}>
              <Card className="chart-card mb-4">
                <Card.Header>
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Blood Units Distribution</h5>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={showLowStock}
                        onChange={() => setShowLowStock(!showLowStock)}
                        id="lowStockSwitch"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="lowStockSwitch"
                      >
                        Show Low Stock Only
                      </label>
                    </div>
                  </div>
                </Card.Header>
                <Card.Body>
                  <Bar
                    data={barChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "top",
                        },
                        title: {
                          display: false,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                    height={300}
                  />
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="chart-card mb-4">
                <Card.Header>
                  <h5 className="mb-0">Blood Type Availability</h5>
                </Card.Header>
                <Card.Body className="d-flex justify-content-center">
                  <div style={{ height: "300px", width: "80%" }}>
                    <Doughnut
                      data={doughnutData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "right",
                          },
                        },
                        cutout: "65%",
                      }}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Card className="chart-card">
                <Card.Header>
                  <h5 className="mb-0">Monthly Activity</h5>
                </Card.Header>
                <Card.Body>
                  <Line
                    data={lineChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "top",
                        },
                      },
                    }}
                    height={250}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="details" title="Inventory Details">
          <Card>
            <Card.Body>
              <div className="table-responsive">
                <Table striped hover className="inventory-table">
                  <thead>
                    <tr>
                      <th>Blood Type</th>
                      <th>Total Quantity (L)</th>
                      <th>Available Quantity (L)</th>
                      <th>Available Units</th>
                      <th>Expiring Units</th>
                      <th>Used This Month (ml)</th>
                      <th>Received This Month (L)</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item) => (
                      <tr key={item.bloodType}>
                        <td>
                          <Badge
                            bg="light"
                            text="dark"
                            className="blood-type-badge"
                            style={{
                              borderColor: bloodTypeColors[item.bloodType],
                            }}
                          >
                            {bloodTypeDisplay[item.bloodType] || item.bloodType}
                          </Badge>
                        </td>
                        <td>{item.totalQuantity.toFixed(1)}</td>
                        <td>{item.availableQuantity.toFixed(1)}</td>
                        <td>{item.availableUnits}</td>
                        <td>
                          {item.expiringUnits > 0 ? (
                            <Badge bg="warning" text="dark">
                              {item.expiringUnits}
                            </Badge>
                          ) : (
                            item.expiringUnits
                          )}
                        </td>
                        <td>
                          {usageStats.bloodTypeDetails &&
                          usageStats.bloodTypeDetails[item.bloodType]
                            ? usageStats.bloodTypeDetails[
                                item.bloodType
                              ].amount.toFixed(1)
                            : 0}
                        </td>
                        <td>{item.receivedThisMonth.toFixed(1)}</td>
                        <td>
                          {item.availableUnits < 5 ? (
                            <Badge bg="danger">Used up</Badge>
                          ) : item.availableUnits < 10 ? (
                            <Badge bg="warning" text="dark">
                              Low
                            </Badge>
                          ) : (
                            <Badge bg="success">Adequate</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
}

