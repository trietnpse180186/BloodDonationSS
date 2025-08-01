import React, { useEffect, useState } from "react";
import axios from "../../helpers/axiosInstance";
import { Modal, Button, Form } from "react-bootstrap";
import "./MedicalSchedule.css";
import { baseUrl } from "../../Utils/baseUrl";
import Swal from "sweetalert2";

export default function MedicalSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split("/");
      return `${year}-${month}-${day}`;
    }
    return dateStr;
  };
  const formatTime = (timeString) => {
    if (!timeString) return "";
    if (/^\d{2}:\d{2}:\d{2}$/.test(timeString))
      return timeString.substring(0, 5);
    return timeString;
  };

  const [formData, setFormData] = useState({
    center: "",
    location: "",
    bloodNeed: [""],
    date: "",
    numberOfDonor: "",
    timeSlots: [{ startTime: "", endTime: "" }],
  });

  const accessToken = sessionStorage.getItem("accessToken");

  useEffect(() => {
    axios
      .get(`${baseUrl}/api/schedule-donations/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
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
      [name]: value,
    }));
  };

  const handleTimeSlotChange = (index, field, value) => {
    const updatedSlots = [...formData.timeSlots];
    updatedSlots[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      timeSlots: updatedSlots,
    }));
  };

  const addTimeSlot = () => {
    setFormData((prev) => ({
      ...prev,
      timeSlots: [...prev.timeSlots, { startTime: "", endTime: "" }],
    }));
  };

  const bloodTypeLabel = (type) => {
    switch (type) {
      case "A_POSITIVE":
        return "A+";
      case "A_NEGATIVE":
        return "A-";
      case "B_POSITIVE":
        return "B+";
      case "B_NEGATIVE":
        return "B-";
      case "AB_POSITIVE":
        return "AB+";
      case "AB_NEGATIVE":
        return "AB-";
      case "O_POSITIVE":
        return "O+";
      case "O_NEGATIVE":
        return "O-";
      default:
        return type;
    }
  };

  const handleEditClick = (schedule) => {
    setEditingId(schedule.scheduleId);
    setEditForm({
      center: schedule.center,
      address: schedule.location,
      date: schedule.date,
      bloodNeed:
        schedule.bloodNeed && schedule.bloodNeed.length > 0
          ? schedule.bloodNeed
          : [""],
      numberOfDonor: schedule.donorCount,
      timeSlots: schedule.timeSlots.map((slot) => ({
        startTime: slot.startTime,
        endTime: slot.endTime,
      })),
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const bloodNeedFiltered = formData.bloodNeed.filter((bn) => bn);
    try {
      await axios.post(
        `${baseUrl}/api/schedule-donations`,
        {
          center: formData.center,
          address: formData.location,
          bloodNeed: bloodNeedFiltered,
          date: formData.date,
          numberOfDonor: Number(formData.numberOfDonor),
          timeSlots: formData.timeSlots,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      await Swal.fire({
        icon: "success",
        title: "Schedule created successfully!",
        confirmButtonColor: "#2563eb",
      });
      setShowModal(false);

      const res = await axios.get(`${baseUrl}/api/schedule-donations/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setSchedules(res.data);

      setFormData({
        center: "",
        location: "",
        bloodNeed: [""],
        date: "",
        numberOfDonor: "",
        timeSlots: [{ startTime: "", endTime: "" }],
      });
    } catch (err) {
      console.error(err.response?.data || err.message);
      await Swal.fire({
        icon: "error",
        title: "Failed to create schedule.",
        text: err.response?.data?.message || err.message || "",
        confirmButtonColor: "#2563eb",
      });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const bloodNeedFiltered = editForm.bloodNeed.filter((bn) => bn);
    try {
      await axios.put(
        `${baseUrl}/api/schedule-donations/${editingId}`,
        {
          center: editForm.center,
          bloodNeed: bloodNeedFiltered,
          address: editForm.address,
          date: formatDate(editForm.date),
          numberOfDonor: Number(editForm.numberOfDonor),
          timeSlots: editForm.timeSlots,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      await Swal.fire({
        icon: "success",
        title: "Schedule updated!",
        confirmButtonColor: "#2563eb",
      });
      setShowModal(false);
      setEditingId(null);

      const res = await axios.get(`${baseUrl}/api/schedule-donations/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setSchedules(res.data);
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      Swal.fire({
        icon: "error",
        title: "Failed to update schedule.",
        text: err.response?.data?.message || err.message || "",
        confirmButtonColor: "#2563eb",
      });
    }
  };

  const handleDelete = async (scheduleId) => {
    Swal.fire({
      icon: "warning",
      title: "Delete Confirmation",
      text: "Are you sure you want to delete this schedule?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `${baseUrl}/api/schedule-donations/${scheduleId}`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
          setSchedules((prev) =>
            prev.filter((s) => s.scheduleId !== scheduleId)
          );
          Swal.fire(
            "Deleted!",
            "The schedule was removed successfully.",
            "success"
          );
        } catch (err) {
          console.error("Delete error:", err.response?.data || err.message);
          await Swal.fire({
            icon: "error",
            title: "Failed to delete schedule.",
            text: err.response?.data?.message || err.message || "",
            confirmButtonColor: "#2563eb",
          });
        }
      }
    });
  };

  const renderBloodNeed = () => {
    const arr = editingId ? editForm.bloodNeed : formData.bloodNeed;
    const setArr = editingId
      ? (newArr) => setEditForm({ ...editForm, bloodNeed: newArr })
      : (newArr) => setFormData({ ...formData, bloodNeed: newArr });

    return (
      <Form.Group className="mb-3">
        <Form.Label>Blood Need</Form.Label>
        {arr.map((bn, idx) => (
          <div key={idx} className="d-flex gap-2 mb-2 align-items-center">
            <Form.Select
              value={bn}
              onChange={(e) => {
                const newArr = [...arr];
                newArr[idx] = e.target.value;
                setArr(newArr);
              }}
              required
            >
              <option value="">-- Select Blood Type --</option>
              <option value="A_POSITIVE">A+</option>
              <option value="A_NEGATIVE">A-</option>
              <option value="B_POSITIVE">B+</option>
              <option value="B_NEGATIVE">B-</option>
              <option value="AB_POSITIVE">AB+</option>
              <option value="AB_NEGATIVE">AB-</option>
              <option value="O_POSITIVE">O+</option>
              <option value="O_NEGATIVE">O-</option>
            </Form.Select>
            {arr.length > 1 && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  const newArr = [...arr];
                  newArr.splice(idx, 1);
                  setArr(newArr);
                }}
              >
                X
              </Button>
            )}
          </div>
        ))}
        <Button
          variant="secondary"
          size="sm"
          className="mt-1"
          onClick={() => setArr([...arr, ""])}
        >
          + Add Blood Need
        </Button>
      </Form.Group>
    );
  };
  function formatDateDMY(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
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
            <th>Blood Need</th>
            <th width="10%">Date</th>
            <th>Time</th>
            <th>Number of Donor</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((s) => (
            <tr key={s.scheduleId}>
              <td>{s.center}</td>
              <td>{s.address || s.location}</td>
              <td>
                {s.bloodNeed &&
                  s.bloodNeed.map((bt) => bloodTypeLabel(bt)).join(", ")}
              </td>
              <td>{formatDateDMY(s.date)}</td>
              <td className="time-column">
                {s.timeSlots &&
                  s.timeSlots.map((slot, idx) => (
                    <div key={idx}>
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </div>
                  ))}
              </td>
              <td>{s.donorCount}</td>
              <td>
                <div className="schedule-actions">
                  <button onClick={() => handleEditClick(s)}>
                    Update Schedule
                  </button>
                  <button onClick={() => handleDelete(s.scheduleId)}>
                    Delete Schedule
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setEditingId(null);
        }}
      >
        <Form onSubmit={editingId ? handleUpdate : handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingId ? "Update Schedule" : "Add New Schedule"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Center</Form.Label>
              <Form.Control
                type="text"
                name="center"
                value={editingId ? editForm.center : formData.center}
                onChange={(e) =>
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
                onChange={(e) =>
                  editingId
                    ? setEditForm({ ...editForm, address: e.target.value })
                    : handleInputChange(e)
                }
                required
              />
            </Form.Group>

            {/* BLOOD NEED */}
            {renderBloodNeed()}

            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={editingId ? editForm.date : formData.date}
                onChange={(e) =>
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
                value={
                  editingId ? editForm.numberOfDonor : formData.numberOfDonor
                }
                onChange={(e) =>
                  editingId
                    ? setEditForm({
                        ...editForm,
                        numberOfDonor: e.target.value,
                      })
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
                      onChange={(e) => {
                        const updated = [...editForm.timeSlots];
                        updated[idx].startTime = e.target.value;
                        setEditForm({ ...editForm, timeSlots: updated });
                      }}
                      required
                    />
                    <Form.Control
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => {
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
                      onChange={(e) =>
                        handleTimeSlotChange(idx, "startTime", e.target.value)
                      }
                      required
                    />
                    <Form.Control
                      type="time"
                      value={slot.endTime}
                      onChange={(e) =>
                        handleTimeSlotChange(idx, "endTime", e.target.value)
                      }
                      required
                    />
                  </div>
                ))}

            {editingId ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  setEditForm({
                    ...editForm,
                    timeSlots: [
                      ...editForm.timeSlots,
                      { startTime: "", endTime: "" },
                    ],
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
