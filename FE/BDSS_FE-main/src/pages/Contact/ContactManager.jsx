import axios from "../../helpers/axiosInstance";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getUserRole } from "../../helpers/getUserName";
import { Table, Button } from "react-bootstrap";
import "./ContactManager.css";
import { baseUrl } from "../../Utils/baseUrl";

export default function ContactManager() {
  const [contacts, setContacts] = useState([]);
  const accessToken = sessionStorage.getItem("accessToken");

  useEffect(() => {
    const role = getUserRole(accessToken);
    if (role !== "STAFF") {
      toast.error("You do not have permission to access this page.");
      return;
    }
    axios
      .get(`${baseUrl}/contact`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => setContacts(res.data))
      .catch((err) => {
        console.error("Error fetching contacts:", err);
        toast.error("Failed to fetch contacts.");
      });
  }, [accessToken]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?"))
      return;
    try {
      await axios.delete(`${baseUrl}/contact/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setContacts((prev) => prev.filter((c) => c.id !== id));
      toast.success("Contact deleted successfully.");
    } catch (err) {
      toast.error("Failed to delete contact.");
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete ALL contacts?"))
      return;
    try {
      await axios.delete(`${baseUrl}/contact/all`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setContacts([]);
      toast.success("All contacts deleted successfully.");
    } catch (err) {
      toast.error("Failed to delete all contacts.");
    }
  };

  return (
    <div className="contact-manager">
      <h2>Contact List</h2>
      <div style={{ marginBottom: 16 }}>
        <Button
          variant="danger"
          size="sm"
          onClick={handleDeleteAll}
          disabled={contacts.length === 0}
        >
          Delete All
        </Button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Support details</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((c) => (
            <tr key={c.id}>
              <td>{c.fullName}</td>
              <td>{c.phoneNumber}</td>
              <td>{c.email}</td>
              <td>{c.details}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(c.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
