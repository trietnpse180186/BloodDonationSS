import React, { useEffect, useState } from "react";
import axios from "../../assets/axiosInstance";
import { Modal, Button, Form } from "react-bootstrap";
import "./MedicalSchedule.css";

export default function MedicalSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);

  const [formData, setFormData] = useState({
    center: "",
    location: "",
    date: "",
    numberOfDonor: "",
    timeSlots: [{ startTime: "", endTime: "" }]
  });

  const accessToken = sessionStorage.getItem("accessToken");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/schedule-donations/", {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      .then((res) => setSchedules(res.data))
      .catch((err) => {
        console.error("Error fetching schedules:", err);
      });
  }, [accessToken]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTimeSlotChange = (index, field, value) => {
    const updatedSlots = [...formData.timeSlots];
    updatedSlots[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      timeSlots: updatedSlots
    }));
  };

  const addTimeSlot = () => {
    setFormData((prev) => ({
      ...prev,
      timeSlots: [...prev.timeSlots, { startTime: "", endTime: "" }]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:8080/api/schedule-donations",
        {
          center: formData.center,
          address: formData.location,
          date: formData.date,
          numberOfDonor: Number(formData.numberOfDonor),
          timeSlots: formData.timeSlots
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      alert("Schedule created successfully!");
      setShowModal(false);

      const res = await axios.get("http://localhost:8080/api/schedule-donations/", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setSchedules(res.data);

      setFormData({
        center: "",
        location: "",
        date: "",
        numberOfDonor: "",
        timeSlots: [{ startTime: "", endTime: "" }]
      });
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to create schedule.");
    }
  };

  const handleEditClick = (schedule) => {
    setEditingId(schedule.scheduleId);
    setEditForm({
      center: schedule.center,
      address: schedule.location, // 🟢 Sửa tên thành address
      date: schedule.date,
      numberOfDonor: schedule.donorCount,
      timeSlots: schedule.timeSlots.map(slot => ({
        startTime: slot.startTime,
        endTime: slot.endTime
      }))
    });
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8080/api/schedule-donations/${editingId}`,
        {
          center: editForm.center,
          address: editForm.address, // 🟢 Sửa thành address
          date: editForm.date,
          numberOfDonor: Number(editForm.numberOfDonor),
          timeSlots: editForm.timeSlots
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      alert("Schedule updated!");
      setShowModal(false);
      setEditingId(null);

      const res = await axios.get("http://localhost:8080/api/schedule-donations/", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setSchedules(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to update schedule.");
    }
  };

  const handleDelete = async (scheduleId) => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) return;
    try {
      await axios.delete(
        `http://localhost:8080/api/schedule-donations/${scheduleId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setSchedules(prev => prev.filter(s => s.scheduleId !== scheduleId));
    } catch (err) {
      alert("Failed to delete schedule.");
    }
  };

  return (
    <div className="medical-schedule">
      <h2>Donation Schedules</h2>
      <div className="schedule-actions">
        <Button onClick={() => setShowModal(true)}>Add New Schedule</Button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Center</th>
            <th>Location</th>
            <th>Date</th>
            <th>Time</th>
            <th>Number of Donor</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((s) => (
            <tr key={s.scheduleId}>
              <td>{s.center}</td>
              <td>{s.location}</td>
              <td>{s.date}</td>
              <td>
                {s.timeSlots &&
                  s.timeSlots.map((slot, idx) => (
                    <div key={idx}>
                      {slot.startTime} - {slot.endTime}
                    </div>
                  ))}
              </td>
              <td>{s.donorCount}</td>
              <td>
                <button onClick={() => handleEditClick(s)}>Update</button>
                <button onClick={() => handleDelete(s.scheduleId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={() => { setShowModal(false); setEditingId(null); }}>
        <Form onSubmit={editingId ? handleUpdate : handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{editingId ? "Update Schedule" : "Add New Schedule"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Center</Form.Label>
              <Form.Control
                type="text"
                name="center"
                value={editingId ? editForm.center : formData.center}
                onChange={e =>
                  editingId
                    ? setEditForm({ ...editForm, center: e.target.value })
                    : handleInputChange(e)
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={editingId ? editForm.address : formData.location} 
                onChange={e =>
                  editingId
                    ? setEditForm({ ...editForm, address: e.target.value })
                    : handleInputChange(e)
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={editingId ? editForm.date : formData.date}
                onChange={e =>
                  editingId
                    ? setEditForm({ ...editForm, date: e.target.value })
                    : handleInputChange(e)
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Number of Donor</Form.Label>
              <Form.Control
                type="number"
                name="numberOfDonor"
                min="1"
                value={editingId ? editForm.numberOfDonor : formData.numberOfDonor}
                onChange={e =>
                  editingId
                    ? setEditForm({ ...editForm, numberOfDonor: e.target.value })
                    : handleInputChange(e)
                }
                required
              />
            </Form.Group>

            <Form.Label>Time Slots</Form.Label>
            {editingId
              ? editForm.timeSlots.map((slot, idx) => (
                  <div key={idx} className="d-flex gap-2 mb-2">
                    <Form.Control
                      type="time"
                      value={slot.startTime}
                      onChange={e => {
                        const updated = [...editForm.timeSlots];
                        updated[idx].startTime = e.target.value;
                        setEditForm({ ...editForm, timeSlots: updated });
                      }}
                      required
                    />
                    <Form.Control
                      type="time"
                      value={slot.endTime}
                      onChange={e => {
                        const updated = [...editForm.timeSlots];
                        updated[idx].endTime = e.target.value;
                        setEditForm({ ...editForm, timeSlots: updated });
                      }}
                      required
                    />
                  </div>
                ))
              : formData.timeSlots.map((slot, idx) => (
                  <div key={idx} className="d-flex gap-2 mb-2">
                    <Form.Control
                      type="time"
                      value={slot.startTime}
                      onChange={e =>
                        handleTimeSlotChange(idx, "startTime", e.target.value)
                      }
                      required
                    />
                    <Form.Control
                      type="time"
                      value={slot.endTime}
                      onChange={e =>
                        handleTimeSlotChange(idx, "endTime", e.target.value)
                      }
                      required
                    />
                  </div>
                ))
            }

            {editingId ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  setEditForm({
                    ...editForm,
                    timeSlots: [...editForm.timeSlots, { startTime: "", endTime: "" }]
                  })
                }
              >
                + Add Time Slot
              </Button>
            ) : (
              <Button variant="secondary" size="sm" onClick={addTimeSlot}>
                + Add Time Slot
              </Button>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}