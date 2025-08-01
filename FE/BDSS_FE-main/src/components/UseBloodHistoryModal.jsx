import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Badge, Button } from "react-bootstrap";
import CustomModal from "./CustomModal";
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
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function formatUsageNotes(notes) {
  if (!notes) return "-";

  const usagePattern =
    /^Used\s+([\d.]+)ml\s+for:\s+(.+?)\s+at\s+(\d{4}-\d{2}-\d{2}T[\d:.]+)$/;
  const match = notes.match(usagePattern);

  if (match) {
    const [, quantity, reason, dateTime] = match;
    const formattedDate = formatDateTime(dateTime);
    return `Used ${quantity}ml for: ${reason}\nAt: ${formattedDate}`;
  }

  return notes;
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
    <CustomModal
      show={show}
      onHide={onHide}
      size="xlarge"
      headerClass="primary"
      title="Blood Usage History"
      footer={
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      }
    >
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
                <th>Blood Type</th>
                <th>Status</th>
                <th>Used For / Notes</th>
                <th>Used Time</th>
                <th>Received Date</th>
                <th>Expiry Date</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-muted">
                    No usage history found.
                  </td>
                </tr>
              ) : (
                history.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {bloodTypeDisplay[item.bloodType] || item.bloodType}
                    </td>
                    <td>
                      <Badge
                        bg={item.status === "USED" ? "danger" : "secondary"}
                      >
                        {item.status}
                      </Badge>
                    </td>
                    <td style={{ maxWidth: 260, whiteSpace: "pre-line" }}>
                      {formatUsageNotes(item.notes)}
                    </td>
                    <td>{formatDateTime(item.lastUpdatedTime)}</td>
                    <td>{formatDateTime(item.receivedDate)}</td>
                    <td>{formatDateTime(item.expiryDate)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      )}
    </CustomModal>
  );
}
