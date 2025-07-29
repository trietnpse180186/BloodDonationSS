import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../../helpers/axiosInstance";
import { Table, Button, Modal, Badge } from "react-bootstrap";
import { FaPlus, FaEye, FaEdit, FaTrash, FaMapMarkerAlt } from "react-icons/fa";
import "./EmergencyRequest.css";
import { getUserRole } from "../../helpers/getUserName";
import { getUserIdFromToken } from "../../helpers/getUserById";
import { baseUrl } from "../../Utils/baseUrl";
export default function EmergencyRequest() {
  const [activeTab, setActiveTab] = useState("list");
  const [loading, setLoading] = useState(false);
  const [emergencyRequests, setEmergencyRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [addressSuggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const token = sessionStorage.getItem("accessToken");
  const userId = getUserIdFromToken();
  const userRole = getUserRole(token);
  const bloodTypes = [
    { value: "A_POSITIVE", label: "A+" },
    { value: "A_NEGATIVE", label: "A-" },
    { value: "B_POSITIVE", label: "B+" },
    { value: "B_NEGATIVE", label: "B-" },
    { value: "AB_POSITIVE", label: "AB+" },
    { value: "AB_NEGATIVE", label: "AB-" },
    { value: "O_POSITIVE", label: "O+" },
    { value: "O_NEGATIVE", label: "O-" },
  ];

  const priorities = [
    { value: "LOW", label: "Low" },
    { value: "NORMAL", label: "Normal" },
    { value: "HIGH", label: "High" },
    { value: "URGENT", label: "Urgent" },
  ];

  const rareBloodTypes = [
    "AB_POSITIVE",
    "AB_NEGATIVE",
    "A_NEGATIVE",
    "B_NEGATIVE",
    "O_NEGATIVE",
  ];

  const validationSchema = Yup.object().shape({
    hospitalName: Yup.string()
      .required("Hospital name is required")
      .min(2, "Hospital name must be at least 2 characters")
      .max(100, "Hospital name must be less than 100 characters"),

    address: Yup.string()
      .required("Address is required")
      .min(5, "Address must be at least 5 characters")
      .max(255, "Address must be less than 255 characters"),

    contactPerson: Yup.string()
      .required("Contact person is required")
      .min(2, "Contact person name must be at least 2 characters")
      .max(50, "Contact person name must be less than 50 characters"),

    contactPhone: Yup.string()
      .required("Phone number is required")
      .matches(/^[0-9]{10,11}$/, "Phone number must be 10-11 digits"),

    description: Yup.string().max(
      1000,
      "Description must be less than 1000 characters"
    ),

    bloodTypeNeeded: Yup.string()
      .required("Blood type needed is required")
      .oneOf(
        [
          "A_POSITIVE",
          "A_NEGATIVE",
          "B_POSITIVE",
          "B_NEGATIVE",
          "AB_POSITIVE",
          "AB_NEGATIVE",
          "O_POSITIVE",
          "O_NEGATIVE",
        ],
        "Invalid blood type"
      ),

    unitsNeeded: Yup.number()
      .required("Number of blood units is required")
      .min(1, "Minimum number of blood units is 1")
      .max(100, "Maximum number of blood units is 100")
      .integer("Number of units must be an integer"),

    expirationTime: Yup.date()
      .nullable()
      .min(new Date(), "Expiration time must be after current time"),

    priority: Yup.string().oneOf(
      ["LOW", "NORMAL", "HIGH", "URGENT", ""],
      "Invalid priority"
    ),

    latitude: Yup.number()
      .nullable()
      .min(-90, "Invalid latitude")
      .max(90, "Invalid latitude"),

    longitude: Yup.number()
      .nullable()
      .min(-180, "Invalid longitude")
      .max(180, "Invalid longitude"),
  });

  const initialValues = {
    hospitalName: "",
    address: "",
    contactPerson: "",
    contactPhone: "",
    description: "",
    bloodTypeNeeded: "",
    unitsNeeded: "",
    priority: "",
    expirationTime: "",
    latitude: "",
    longitude: "",
  };

  useEffect(() => {
    fetchEmergencyRequests();
  }, []);

  const fetchEmergencyRequests = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("accessToken");
      const response = await axios.get(`${baseUrl}/api/emergency`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmergencyRequests(response.data);
    } catch (error) {
      console.error("Error fetching emergency requests:", error);
      toast.error("Error loading emergency requests");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (isoDateTime) => {
    if (!isoDateTime) return "";
    const date = new Date(isoDateTime);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      ACTIVE: { variant: "success", text: "Active" },
      EXPIRED: { variant: "danger", text: "Expired" },
      FULFILLED: { variant: "primary", text: "Fulfilled" },
      CANCELLED: { variant: "secondary", text: "Cancelled" },
    };

    const config = statusConfig[status] || {
      variant: "secondary",
      text: status,
    };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      LOW: { variant: "secondary", text: "Low" },
      NORMAL: { variant: "info", text: "Normal" },
      HIGH: { variant: "warning", text: "High" },
      URGENT: { variant: "danger", text: "Urgent" },
    };

    const config = priorityConfig[priority] || {
      variant: "secondary",
      text: priority,
    };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const isExpired = (expirationTime) => {
    return new Date(expirationTime) < new Date();
  };

  const handleBloodTypeChange = (bloodType, setFieldValue, values) => {
    setFieldValue("bloodTypeNeeded", bloodType);

    if (rareBloodTypes.includes(bloodType)) {
      const extendedExpiration = new Date();
      extendedExpiration.setHours(extendedExpiration.getHours() + 48);

      if (!values.priority) {
        setFieldValue("priority", "HIGH");
      }

      if (!values.expirationTime) {
        const formattedDateTime = extendedExpiration.toISOString().slice(0, 16);
        setFieldValue("expirationTime", formattedDateTime);
      }

      toast.info(
        "Rare blood type detected. Priority and expiration auto-adjusted."
      );
    } else if (!values.expirationTime) {
      const defaultExpiration = new Date();
      defaultExpiration.setHours(defaultExpiration.getHours() + 24);
      const formattedDateTime = defaultExpiration.toISOString().slice(0, 16);
      setFieldValue("expirationTime", formattedDateTime);
    }
  };

  const getCurrentLocation = (setFieldValue) => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported");
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          setFieldValue("latitude", latitude);
          setFieldValue("longitude", longitude);
          setFieldValue(
            "address",
            data.display_name || `${latitude}, ${longitude}`
          );

          toast.success("Location retrieved successfully");
        } catch (error) {
          setFieldValue("latitude", latitude);
          setFieldValue("longitude", longitude);
          toast.success("Coordinates retrieved");
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        setLocationLoading(false);
        toast.error("Unable to get location");
      }
    );
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (!values.hospitalName.trim()) {
        toast.error("Hospital name is required");
        return;
      }
      if (!values.bloodTypeNeeded) {
        toast.error("Blood type is required");
        return;
      }
      if (!values.unitsNeeded || parseInt(values.unitsNeeded) < 1) {
        toast.error("Valid number of units is required");
        return;
      }

      let formattedExpirationTime = null;
      if (values.expirationTime) {
        try {
          const date = new Date(values.expirationTime);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const hours = String(date.getHours()).padStart(2, "0");
          const minutes = String(date.getMinutes()).padStart(2, "0");
          const seconds = String(date.getSeconds()).padStart(2, "0");

          formattedExpirationTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
        } catch (error) {
          toast.error("Invalid expiration time format");
          return;
        }
      }

      const requestData = {
        hospitalName: values.hospitalName.trim(),
        address: values.address.trim(),
        contactPerson: values.contactPerson.trim(),
        contactPhone: values.contactPhone.trim(),
        description: values.description.trim() || "",
        bloodTypeNeeded: values.bloodTypeNeeded,
        unitsNeeded: parseInt(values.unitsNeeded),
        priority: values.priority || "NORMAL",
        expirationTime: formattedExpirationTime,
        latitude: values.latitude ? parseFloat(values.latitude) : null,
        longitude: values.longitude ? parseFloat(values.longitude) : null,
      };

      console.log("Sending request data:", requestData);

      const response = await axios.post(
        `${baseUrl}/api/emergency`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Success response:", response.data);
      toast.success("Emergency request created successfully!");
      setShowCreateModal(false);
      resetForm();
      fetchEmergencyRequests();
    } catch (error) {
      console.error("Error creating request:", error);

      if (error.response) {
        console.error(error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (requestId, newStatus) => {
    try {
      const token = sessionStorage.getItem("accessToken");

      const currentRequest = emergencyRequests.find(
        (req) => req.requestId === requestId
      );
      if (!currentRequest) {
        toast.error("Request not found");
        return;
      }

      const updateDTO = {
        hospitalName: currentRequest.hospitalName,
        address: currentRequest.address,
        contactPerson: currentRequest.contactPerson,
        contactPhone: currentRequest.contactPhone,
        description: currentRequest.description,
        expirationTime: currentRequest.expirationTime,
        priority:
          newStatus === "FULFILLED" ? "URGENT" : currentRequest.priority,
      };

      console.log("Updating status to:", newStatus);
      console.log("Update DTO (only allowed fields):", updateDTO);

      await axios.put(`${baseUrl}/api/emergency/${requestId}`, updateDTO, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success(`Status updated to ${newStatus} successfully`);
      fetchEmergencyRequests();
    } catch (error) {
      console.error("Error updating status:", error);
      if (error.response?.status === 404) {
        toast.error("Emergency request not found");
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to update this request");
      } else {
        toast.error("Error updating status");
      }
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm("Cancel this request?")) {
      try {
        const response = await axios.delete(`/api/emergency/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchEmergencyRequests();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleEdit = (request) => {
    setEditingRequest(request);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (!values.hospitalName.trim()) {
        toast.error("Hospital name is required");
        return;
      }

      let formattedExpirationTime = null;
      if (values.expirationTime) {
        try {
          const date = new Date(values.expirationTime);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const hours = String(date.getHours()).padStart(2, "0");
          const minutes = String(date.getMinutes()).padStart(2, "0");
          const seconds = String(date.getSeconds()).padStart(2, "0");

          formattedExpirationTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
        } catch (error) {
          toast.error("Invalid expiration time format");
          return;
        }
      }

      const updateDTO = {
        hospitalName: values.hospitalName.trim(),
        address: values.address.trim(),
        contactPerson: values.contactPerson.trim(),
        contactPhone: values.contactPhone.trim(),
        description: values.description.trim() || "",
        expirationTime: formattedExpirationTime,
        priority: values.priority || "NORMAL",
      };

      console.log("Updating request:", updateDTO);

      await axios.put(
        `${baseUrl}/api/emergency/${editingRequest.requestId}`,
        updateDTO,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Emergency request updated successfully!");
      setShowEditModal(false);
      setEditingRequest(null);
      resetForm();
      fetchEmergencyRequests();
    } catch (error) {
      console.error("Error updating request:", error);
      if (error.response?.status === 404) {
        toast.error("Emergency request not found");
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to update this request");
      } else {
        toast.error("Error updating emergency request");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="emergency-request-container">
      <div className="emergency-header">
        <h2>Emergency Blood Requests</h2>
        <Button
          variant="danger"
          onClick={() => setShowCreateModal(true)}
          className="create-btn"
        >
          <FaPlus /> Create New Request
        </Button>
      </div>

      <div className="emergency-content">
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Hospital</th>
                  <th>Blood Type</th>
                  <th>Units</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Expires</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {emergencyRequests.map((request) => (
                  <tr
                    key={request.requestId}
                    className={
                      isExpired(request.expirationTime) ? "table-warning" : ""
                    }
                  >
                    <td>
                      <div>
                        <strong>{request.hospitalName}</strong>
                        <br />
                        <small className="text-muted">
                          {request.contactPerson}
                        </small>
                      </div>
                    </td>
                    <td>
                      <strong className="text-danger">
                        {request.bloodTypeNeeded}
                      </strong>
                      {request.isRareBloodType && (
                        <Badge bg="warning" className="ms-1">
                          Rare
                        </Badge>
                      )}
                    </td>
                    <td>{request.unitsNeeded}</td>
                    <td>{getPriorityBadge(request.priority)}</td>
                    <td>{getStatusBadge(request.status)}</td>
                    <td>{formatDateTime(request.requestTime)}</td>
                    <td>
                      <span
                        className={
                          isExpired(request.expirationTime) ? "text-danger" : ""
                        }
                      >
                        {formatDateTime(request.expirationTime)}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowDetailModal(true);
                          }}
                        >
                          <FaEye />
                        </Button>

                        {request.status === "ACTIVE" && (
                          <>
                            <Button
                              variant="outline-warning"
                              size="sm"
                              onClick={() => handleEdit(request)}
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() =>
                                updateStatus(request.requestId, "FULFILLED")
                              }
                            >
                              Complete
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => handleCancel(request.requestId)}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Create Emergency Blood Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form>
                {/* Hospital Information */}
                <div className="mb-4">
                  <h5>Hospital Information</h5>
                  <div className="row">
                    <div className="col-md-6">
                      <label>Hospital Name *</label>
                      <Field
                        name="hospitalName"
                        className="form-control"
                        placeholder="Enter hospital name"
                      />
                      <ErrorMessage
                        name="hospitalName"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div className="col-md-6">
                      <label>Contact Person *</label>
                      <Field
                        name="contactPerson"
                        className="form-control"
                        placeholder="Contact person name"
                      />
                      <ErrorMessage
                        name="contactPerson"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                  </div>

                  <div className="row mt-2">
                    <div className="col-md-6">
                      <label>Phone Number *</label>
                      <Field
                        name="contactPhone"
                        className="form-control"
                        placeholder="Phone number"
                      />
                      <ErrorMessage
                        name="contactPhone"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div className="col-md-6">
                      <label>Address *</label>
                      <div className="d-flex gap-2">
                        <Field
                          name="address"
                          className="form-control"
                          placeholder="Hospital address"
                        />
                        <Button
                          type="button"
                          variant="outline-secondary"
                          onClick={() => getCurrentLocation(setFieldValue)}
                          disabled={locationLoading}
                        >
                          <FaMapMarkerAlt />
                        </Button>
                      </div>
                      <ErrorMessage
                        name="address"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                  </div>
                </div>

                {/* Blood Request Information */}
                <div className="mb-4">
                  <h5>Blood Request Information</h5>
                  <div className="row">
                    <div className="col-md-6">
                      <label>Blood Type Needed *</label>
                      <Field
                        as="select"
                        name="bloodTypeNeeded"
                        className="form-control"
                        onChange={(e) =>
                          handleBloodTypeChange(
                            e.target.value,
                            setFieldValue,
                            values
                          )
                        }
                      >
                        <option value="">Select blood type</option>
                        {bloodTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}{" "}
                            {rareBloodTypes.includes(type.value)
                              ? "(Rare)"
                              : ""}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="bloodTypeNeeded"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div className="col-md-6">
                      <label>Number of Units *</label>
                      <Field
                        name="unitsNeeded"
                        type="number"
                        className="form-control"
                        min="1"
                      />
                      <ErrorMessage
                        name="unitsNeeded"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                  </div>

                  <div className="row mt-2">
                    <div className="col-md-6">
                      <label>Priority Level</label>
                      <Field
                        as="select"
                        name="priority"
                        className="form-control"
                      >
                        <option value="">Auto (based on blood type)</option>
                        {priorities.map((priority) => (
                          <option key={priority.value} value={priority.value}>
                            {priority.label}
                          </option>
                        ))}
                      </Field>
                    </div>
                    <div className="col-md-6">
                      <label>Expiration Time</label>
                      <Field
                        name="expirationTime"
                        type="datetime-local"
                        className="form-control"
                      />
                      <ErrorMessage
                        name="expirationTime"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                  </div>

                  <div className="mt-2">
                    <label>Description</label>
                    <Field
                      as="textarea"
                      name="description"
                      className="form-control"
                      rows="3"
                      placeholder="Describe the emergency situation..."
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="danger"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating..." : "Create Request"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      {/* Detail Modal - cập nhật hiển thị thông tin chi tiết hơn */}
      <Modal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        size="lg"
      >
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>
            <span className="text-danger">Emergency Request Details</span>
            <div className="mt-1">
              <Badge bg="secondary" className="me-2">
                ID: {selectedRequest?.requestId}
              </Badge>
              {getStatusBadge(selectedRequest?.status)}
            </div>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedRequest && (
            <>
              <div className="card mb-4">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Hospital Information</h5>
                </div>
                <div className="card-body">
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <strong>Hospital:</strong> {selectedRequest.hospitalName}
                    </div>
                    <div className="col-md-6">
                      <strong>Contact Person:</strong>{" "}
                      {selectedRequest.contactPerson}
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <strong>Phone:</strong> {selectedRequest.contactPhone}
                    </div>
                    <div className="col-md-6">
                      <strong>Address:</strong> {selectedRequest.address}
                    </div>
                  </div>

                  {selectedRequest.latitude && selectedRequest.longitude && (
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <strong>Coordinates:</strong> {selectedRequest.latitude}
                        , {selectedRequest.longitude}
                      </div>
                      {selectedRequest.distance && (
                        <div className="col-md-6">
                          <strong>Distance:</strong>{" "}
                          {Math.round(selectedRequest.distance * 10) / 10} km
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="card mb-4">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Request Details</h5>
                </div>
                <div className="card-body">
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <strong>Blood Type:</strong>{" "}
                      <span className="text-danger fw-bold">
                        {selectedRequest.bloodTypeNeeded}
                        {selectedRequest.isRareBloodType && (
                          <Badge bg="warning" text="dark" className="ms-1">
                            Rare
                          </Badge>
                        )}
                      </span>
                    </div>
                    <div className="col-md-6">
                      <strong>Category:</strong>{" "}
                      {selectedRequest.bloodTypeCategory || "Standard"}
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <strong>Units Needed:</strong>{" "}
                      {selectedRequest.unitsNeeded}
                    </div>
                    <div className="col-md-6">
                      <strong>Units Donated:</strong>{" "}
                      <span
                        className={
                          selectedRequest.unitsDonated >=
                          selectedRequest.unitsNeeded
                            ? "text-success"
                            : "text-danger"
                        }
                      >
                        {selectedRequest.unitsDonated || 0} /{" "}
                        {selectedRequest.unitsNeeded}
                      </span>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <strong>Priority:</strong>{" "}
                      {getPriorityBadge(selectedRequest.priority)}
                    </div>
                    <div className="col-md-6">
                      <strong>Status:</strong>{" "}
                      {getStatusBadge(selectedRequest.status)}
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <strong>Created:</strong>{" "}
                      {formatDateTime(selectedRequest.requestTime)}
                    </div>
                    <div className="col-md-6">
                      <strong>Expires:</strong>{" "}
                      <span
                        className={
                          isExpired(selectedRequest.expirationTime)
                            ? "text-danger"
                            : ""
                        }
                      >
                        {formatDateTime(selectedRequest.expirationTime)}
                      </span>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <strong>Created By:</strong>{" "}
                      {selectedRequest.createdByName || "N/A"}
                    </div>
                    <div className="col-md-6">
                      <strong>Last Updated:</strong>{" "}
                      {formatDateTime(selectedRequest.lastUpdatedTime)}
                    </div>
                  </div>

                  {selectedRequest.description && (
                    <div className="mb-3">
                      <strong>Description:</strong>
                      <div className="p-2 border rounded mt-1 bg-light">
                        {selectedRequest.description}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Donor Information Section - Phần mới */}
              <div className="card mb-4">
                <div className="card-header bg-light d-flex justify-content-between">
                  <h5 className="mb-0">Donor Information</h5>
                  <Badge bg="info">
                    {selectedRequest.donors?.length || 0} Donors
                  </Badge>
                </div>
                <div className="card-body">
                  {selectedRequest.donors &&
                  selectedRequest.donors.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Blood Type</th>
                            <th>Status</th>
                            <th>Response Time</th>
                            <th>Contact</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedRequest.donors.map((donor) => (
                            <tr key={donor.donationId}>
                              <td>{donor.donorName || "Anonymous"}</td>
                              <td>{donor.bloodType}</td>
                              <td>
                                <Badge
                                  bg={
                                    donor.status === "COMPLETED"
                                      ? "success"
                                      : donor.status === "PENDING"
                                      ? "warning"
                                      : donor.status === "CANCELLED"
                                      ? "danger"
                                      : "secondary"
                                  }
                                >
                                  {donor.status}
                                </Badge>
                              </td>
                              <td>{formatDateTime(donor.responseTime)}</td>
                              <td>{donor.phoneNumber || "N/A"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center p-3">
                      <p className="text-muted mb-0">
                        No donors have responded yet
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Close
          </Button>
          {selectedRequest?.status === "ACTIVE" && (
            <Button
              variant="primary"
              onClick={() => {
                // Chuyển đến trang chi tiết để phản hồi
                navigate(`/emergency/${selectedRequest.requestId}`);
              }}
            >
              View Full Details
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal
        show={showEditModal}
        onHide={() => {
          setShowEditModal(false);
          setEditingRequest(null);
        }}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Emergency Blood Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingRequest && (
            <Formik
              initialValues={{
                hospitalName: editingRequest.hospitalName || "",
                address: editingRequest.address || "",
                contactPerson: editingRequest.contactPerson || "",
                contactPhone: editingRequest.contactPhone || "",
                description: editingRequest.description || "",
                priority: editingRequest.priority || "",
                expirationTime: editingRequest.expirationTime
                  ? new Date(editingRequest.expirationTime)
                      .toISOString()
                      .slice(0, 16)
                  : "",
                latitude: editingRequest.latitude || "",
                longitude: editingRequest.longitude || "",
              }}
              validationSchema={Yup.object().shape({
                hospitalName: Yup.string()
                  .required("Hospital name is required")
                  .min(2, "Hospital name must be at least 2 characters")
                  .max(100, "Hospital name must be less than 100 characters"),
                address: Yup.string()
                  .required("Address is required")
                  .min(5, "Address must be at least 5 characters"),
                contactPerson: Yup.string()
                  .required("Contact person is required")
                  .min(2, "Contact person name must be at least 2 characters"),
                contactPhone: Yup.string()
                  .required("Phone number is required")
                  .matches(
                    /^[0-9]{10,11}$/,
                    "Phone number must be 10-11 digits"
                  ),
                description: Yup.string().max(
                  1000,
                  "Description must be less than 1000 characters"
                ),
                priority: Yup.string().oneOf(
                  ["LOW", "NORMAL", "HIGH", "URGENT", ""],
                  "Invalid priority"
                ),
                expirationTime: Yup.date()
                  .nullable()
                  .min(
                    new Date(),
                    "Expiration time must be after current time"
                  ),
              })}
              onSubmit={handleEditSubmit}
            >
              {({ values, setFieldValue, isSubmitting }) => (
                <Form>
                  {/* Hospital Information */}
                  <div className="mb-4">
                    <h5>Hospital Information</h5>
                    <div className="row">
                      <div className="col-md-6">
                        <label>Hospital Name *</label>
                        <Field
                          name="hospitalName"
                          className="form-control"
                          placeholder="Enter hospital name"
                        />
                        <ErrorMessage
                          name="hospitalName"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                      <div className="col-md-6">
                        <label>Contact Person *</label>
                        <Field
                          name="contactPerson"
                          className="form-control"
                          placeholder="Contact person name"
                        />
                        <ErrorMessage
                          name="contactPerson"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div>

                    <div className="row mt-2">
                      <div className="col-md-6">
                        <label>Phone Number *</label>
                        <Field
                          name="contactPhone"
                          className="form-control"
                          placeholder="Phone number"
                        />
                        <ErrorMessage
                          name="contactPhone"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                      <div className="col-md-6">
                        <label>Address *</label>
                        <div className="d-flex gap-2">
                          <Field
                            name="address"
                            className="form-control"
                            placeholder="Hospital address"
                          />
                          <Button
                            type="button"
                            variant="outline-secondary"
                            onClick={() => getCurrentLocation(setFieldValue)}
                            disabled={locationLoading}
                          >
                            <FaMapMarkerAlt />
                          </Button>
                        </div>
                        <ErrorMessage
                          name="address"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Request Information - Chỉ cho edit các trường được phép */}
                  <div className="mb-4">
                    <h5>Request Information</h5>

                    {/* Hiển thị blood type và units (readonly) */}
                    <div className="row">
                      <div className="col-md-6">
                        <label>Blood Type Needed (Cannot be changed)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editingRequest.bloodTypeNeeded}
                          disabled
                          style={{ backgroundColor: "#f8f9fa" }}
                        />
                        <small className="text-muted">
                          Blood type cannot be changed after creation
                        </small>
                      </div>
                      <div className="col-md-6">
                        <label>Number of Units (Cannot be changed)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editingRequest.unitsNeeded}
                          disabled
                          style={{ backgroundColor: "#f8f9fa" }}
                        />
                        <small className="text-muted">
                          Units cannot be changed after creation
                        </small>
                      </div>
                    </div>

                    <div className="row mt-2">
                      <div className="col-md-6">
                        <label>Priority Level</label>
                        <Field
                          as="select"
                          name="priority"
                          className="form-control"
                        >
                          <option value="">Select priority</option>
                          {priorities.map((priority) => (
                            <option key={priority.value} value={priority.value}>
                              {priority.label}
                            </option>
                          ))}
                        </Field>
                      </div>
                      <div className="col-md-6">
                        <label>Expiration Time</label>
                        <Field
                          name="expirationTime"
                          type="datetime-local"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="expirationTime"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div>

                    <div className="mt-2">
                      <label>Description</label>
                      <Field
                        as="textarea"
                        name="description"
                        className="form-control"
                        rows="3"
                        placeholder="Describe the emergency situation..."
                      />
                      <ErrorMessage
                        name="description"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setShowEditModal(false);
                        setEditingRequest(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="warning"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Updating..." : "Update Request"}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
