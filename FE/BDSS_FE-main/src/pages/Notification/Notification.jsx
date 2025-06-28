import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table, Form, Button } from "react-bootstrap";

export default function Notification() {
  const [form, setForm] = useState({
    title: "",
    detail: "",
    date: "",
    time: "",
    donorId: "",
  });

  const [notification, setNotification] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await axios.get(
        "http://localhost:8080/notifications/all",
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );
      setNotification(response.data);
    };
    fetchNotifications();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const now = new Date();
    const currentDate = now.toISOString().slice(0, 10);
    const currentTime = now.toTimeString().slice(0, 5);

    const dataToSend = {
      ...form,
      date: form.date || currentDate,
      time: form.time || currentTime,
    };
    console.log("Data to send:", dataToSend);
    try {
      await axios.post("http://localhost:8080/notifications", dataToSend, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      });
      const response = await axios.get(
        "http://localhost:8080/notifications/all",
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );
      setNotification(response.data);
      setForm({
        title: "",
        detail: "",
        date: "",
        time: "",
        donorId: "",
      });
    } catch (error) {
      alert("Failed to create notification.");
    }
  };

  const [donor, setDonor] = useState([]);
  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await axios.get("http://localhost:8080/users", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        });
        setDonor(response.data);
        console.log("Donor list:", response.data);
      } catch (error) {
        console.error("Failed to fetch donors:", error);
      }
    };
    fetchDonors();
  }, []);

  return (
    <>
      <Form onSubmit={handleSubmit} style={{ marginBottom: 32, maxWidth: 600 }}>
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
          <Form.Control
            type="hidden"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control
            type="hidden"
            name="time"
            value={form.time}
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
              <option key={d.id || d.userId} value={d.id || d.userId}>
                {d.userId ? d.fullName : d.username || d.email || "Unknown"}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Button variant="danger" type="submit">
          Create Notification
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
              <td>{note.donorId}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
