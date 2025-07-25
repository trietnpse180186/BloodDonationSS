import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table, Form, Button, Toast } from "react-bootstrap";
import { ClipLoader } from "react-spinners";

export default function Notification() {
  const [form, setForm] = useState({
    title: "",
    detail: "",
    date: "",
    time: "",
    donorId: "",
  });

  const [notification, setNotification] = useState([]);
  const [loading, setLoading] = useState(false);
  const [donor, setDonor] = useState([]);

  useEffect(() => {
    fetchNotifications();
    fetchDonors();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/notifications/all",
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );
      setNotification(response.data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const fetchDonors = async () => {
    try {
      const response = await axios.get("http://localhost:8080/users", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      });
      setDonor(response.data);
    } catch (error) {
      console.error("Failed to fetch donors:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const now = new Date();
    const currentDate = now.toISOString().slice(0, 10);
    const currentTime = now.toTimeString().slice(0, 5);

    const dataToSend = {
      ...form,
      date: form.date || currentDate,
      time: form.time || currentTime,
    };

    try {
      await axios.post("http://localhost:8080/notifications", dataToSend, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      });

      setForm({
        title: "",
        detail: "",
        date: "",
        time: "",
        donorId: "",
      });

      await fetchNotifications();

      alert("Notification sent successfully!");
    } catch (error) {
      alert("Failed to create notification.");
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <>
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", margin: 20 }}>
          <ClipLoader color="#b30000" size={48} speedMultiplier={1.1} />
        </div>
      )}

      <Form
        onSubmit={handleSubmit}
        style={{
          marginBottom: 32,
          maxWidth: 600,
          opacity: loading ? 0.5 : 1,
          pointerEvents: loading ? "none" : "auto",
        }}
      >
        <Form.Group className="mb-2">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Details</Form.Label>
          <Form.Control
            as="textarea"
            name="detail"
            value={form.detail}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>For Donor</Form.Label>
          <Form.Select
            name="donorId"
            value={form.donorId}
            onChange={handleChange}
            required
          >
            <option value="">Select a donor</option>
            {donor.map((d) => (
              <option key={d.userId} value={d.userId}>
                {d.fullName ? `${d.fullName} (${d.email})` : d.email}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button variant="danger" type="submit" disabled={loading}>
          {loading ? "Sending..." : "Create Notification"}
        </Button>
      </Form>

      <h2>Notification List</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Details</th>
            <th>Date - time</th>
            <th>For Donor</th>
          </tr>
        </thead>
        <tbody>
          {notification.map((note, index) => (
            <tr key={note.id}>
              <td>{index + 1}</td>
              <td>{note.title}</td>
              <td>{note.detail}</td>
              <td>
                {note.date} - {note.time}
              </td>
              <td>{note.donorName}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
