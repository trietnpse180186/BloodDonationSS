import React, { useEffect, useState } from "react";
import { Modal, Table, Spinner, Alert, Badge } from "react-bootstrap";
import axios from "axios";
import { baseUrl } from "../Utils/baseUrl";

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

function formatDateTime(dt) {
  if (!dt) return "-";
  const d = new Date(dt);
  return d.toLocaleString();
}

export default function UseBloodHistoryModal({ show, onHide }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!show) return;
    setLoading(true);
    setError(null);
    fetchUsageHistory();
  }, [show]);

  const fetchUsageHistory = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");
      const res = await axios.get(
        `${baseUrl}/api/blood-inventory/usage-history`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setHistory(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch usage history"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Blood Usage History</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center my-4">
            <Spinner animation="border" variant="primary" />
            <div>Loading usage history...</div>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <div className="table-responsive">
            <Table striped bordered hover className="align-middle">
              <thead>
                <tr>
                  <th>Blood Unit ID</th>
                  <th>Blood Type</th>
                  <th>Quantity (ml)</th>
                  <th>Status</th>
                  <th>Used For / Notes</th>
                  <th>Used Time</th>
                  <th>Donor</th>
                  <th>Received Date</th>
                  <th>Expiry Date</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center text-muted">
                      No usage history found.
                    </td>
                  </tr>
                ) : (
                  history.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>
                        {bloodTypeDisplay[item.bloodType] || item.bloodType}
                      </td>
                      <td>{item.quantity}</td>
                      <td>
                        <Badge
                          bg={item.status === "USED" ? "danger" : "secondary"}
                        >
                          {item.status}
                        </Badge>
                      </td>
                      <td style={{ maxWidth: 260, whiteSpace: "pre-line" }}>
                        {item.notes || "-"}
                      </td>
                      <td>{formatDateTime(item.lastUpdatedTime)}</td>
                      <td>{item.donorName || "-"}</td>
                      <td>{formatDateTime(item.receivedDate)}</td>
                      <td>{formatDateTime(item.expiryDate)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={onHide}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}
