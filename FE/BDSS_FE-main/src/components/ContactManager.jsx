import axios from "../assets/axiosInstance";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getUserRole } from "../assets/getUserName";
import { Table } from "react-bootstrap";

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
      .get("http://localhost:8080/contact", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => setContacts(res.data))
      .catch((err) => {
        console.error("Error fetching contacts:", err);
        toast.error("Failed to fetch contacts.");
      });
  }, [accessToken]);

  return (
    <div className="contact-manager">
      <h2>Contact List</h2>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Support details</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((c) => (
            <tr key={c.id}>
              <td>{c.fullName}</td>
              <td>{c.phoneNumber}</td>
              <td>{c.email}</td>
              <td>{c.details}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
