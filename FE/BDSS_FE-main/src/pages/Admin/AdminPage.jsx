import React, { useEffect, useState } from "react";
import axios from "../../helpers/axiosInstance";
import logout from "../../helpers/authLogout";
import "./AdminPage.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";

import {
  FaSignOutAlt,
  FaTachometerAlt,
  FaUserCog,
  FaTimes,
} from "react-icons/fa";
import {
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { baseUrl } from "../../Utils/baseUrl";

const menuItems = [
  { key: "dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
  { key: "staff", label: "Staff Manager", icon: <FaUserCog /> },
  { key: "logout", label: "Logout", icon: <FaSignOutAlt /> },
];

const COLORS = ["#2563eb", "#22c55e", "#f97316"];

export default function AdminPage() {
  const [selected, setSelected] = useState("dashboard");
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [modalUser, setModalUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newUser, setNewUser] = useState({});
  const token = sessionStorage.getItem("accessToken");

  useEffect(() => {
    if (selected === "dashboard") {
      axios
        .get(`${baseUrl}/api/v1/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setDashboardData(res.data))
        .catch(() => setDashboardData(null));
    } else if (selected === "staff") {
      fetchStaff();
    } else if (selected === "logout") {
      logout();
    }
  }, [selected]);

  const fetchStaff = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/v1/admin/staff`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch {
      alert("Failed to load staff list.");
    }
  };
  const isAtLeast18YearsOld = (birthday) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    const age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    const d = today.getDate() - birthDate.getDate();
    return age > 18 || (age === 18 && (m > 0 || (m === 0 && d >= 0)));
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!isAtLeast18YearsOld(newUser.birthday)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Birthday",
        text: "Staff must be at least 18 years old.",
      });
      return;
    }

    try {
      await axios.post(`${baseUrl}/api/v1/admin/staff`, newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire("Success", "Staff created successfully.", "success");
      setNewUser({});
      fetchStaff();
    } catch {
      Swal.fire("Error", "Failed to create staff.", "error");
    }
  };

  const handleDelete = (userId) => {
    Swal.fire({
      title: "Delete Confirmation",
      text: "Are you sure you want to delete this staff member?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `${baseUrl}/api/v1/admin/staff/${userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          Swal.fire(
            "Deleted!",
            "The staff member was removed successfully.",
            "success"
          );
          fetchStaff();
        } catch (error) {
          Swal.fire("Error", "Failed to delete staff.", "error");
        }
      }
    });
  };

  const chartData = [
    { name: "Jan", value: 20 },
    { name: "Feb", value: 25 },
    { name: "Mar", value: 30 },
    { name: "Apr", value: 28 },
    { name: "May", value: 22 },
    { name: "Jun", value: 18 },
  ];

  const pieData = dashboardData
    ? [
        { name: "Total Donors", value: dashboardData.totalDonors },
        { name: "Total Staff", value: dashboardData.totalStaff },
        { name: "Total Donations", value: dashboardData.totalDonations },
      ]
    : [
        { name: "Total Donors", value: 0 },
        { name: "Total Staff", value: 0 },
        { name: "Total Donations", value: 0 },
      ];

  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderContent = () => {
    if (selected === "dashboard") {
      return (
        <div className="dashboard-layout">
          <h2 className="dashboard-title">Dashboard Overview</h2>
          {!dashboardData ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="dashboard-top-cards">
                <div className="card blue">
                  <h4>Total Donors</h4>
                  <p>{dashboardData.totalDonors}</p>
                </div>
                <div className="card green">
                  <h4>Total Staff</h4>
                  <p>{dashboardData.totalStaff}</p>
                </div>
                <div className="card orange">
                  <h4>Total Donations</h4>
                  <p>{dashboardData.totalDonations}</p>
                </div>
              </div>
              <div className="dashboard-charts">
                <div className="chart-box">
                  <h4>Total Donor</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient
                          id="colorValue"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#2563eb"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#2563eb"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#2563eb"
                        fillOpacity={1}
                        fill="url(#colorValue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="chart-box">
                  <h4>Overview</h4>
                  <PieChart width={300} height={250}>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </div>
              </div>
            </>
          )}
        </div>
      );
    }

    if (selected === "staff") {
      return (
        <div className="staff-section">
          <h3 className="section-title">Staff Management</h3>

          <div className="search-bar-wrapper">
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                marginBottom: 12,
              }}
            >
              <input
                className="search-input small-input"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <table className="staff-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Occupation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.phoneNumber}</td>
                  <td>{user.occupation || "Staff"}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="view-btn"
                        onClick={() => setModalUser(user)}
                      >
                        View
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(user.userId)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {modalUser && (
            <div className="modal-overlay" onClick={() => setModalUser(null)}>
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="modal-close"
                  onClick={() => setModalUser(null)}
                >
                  <FaTimes />
                </button>
                <h3>{modalUser.fullName}</h3>
                <p>
                  <strong>Email:</strong> {modalUser.email}
                </p>
                <p>
                  <strong>Phone:</strong> {modalUser.phoneNumber}
                </p>
                <p>
                  <strong>Address:</strong> {modalUser.address}
                </p>
                <p>
                  <strong>Blood Type:</strong> {modalUser.bloodType}
                </p>
                <p>
                  <strong>Birthday:</strong> {modalUser.birthday}
                </p>
                <p>
                  <strong>Sex:</strong> {modalUser.sex}
                </p>
                <p>
                  <strong>Occupation:</strong> {modalUser.occupation}
                </p>
              </div>
            </div>
          )}

          <div className="staff-form-section">
            <h4 className="sub-heading">Add New Staff</h4>
            <form onSubmit={handleCreate} className="edit-form">
              <input
                required
                value={newUser.fullName || ""}
                onChange={(e) =>
                  setNewUser({ ...newUser, fullName: e.target.value })
                }
                placeholder="Full Name"
              />
              <div className="horizontal-fields">
                <input
                  required
                  value={newUser.email || ""}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  placeholder="Email"
                />
                <input
                  required
                  type="password"
                  value={newUser.password || ""}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  placeholder="Password"
                />
              </div>
              <input
                required
                value={newUser.phoneNumber || ""}
                onChange={(e) =>
                  setNewUser({ ...newUser, phoneNumber: e.target.value })
                }
                placeholder="Phone Number"
              />
              <input
                required
                value={newUser.address || ""}
                onChange={(e) =>
                  setNewUser({ ...newUser, address: e.target.value })
                }
                placeholder="Address"
              />
              <select
                required
                value={newUser.bloodType || ""}
                onChange={(e) =>
                  setNewUser({ ...newUser, bloodType: e.target.value })
                }
              >
                <option value="">Select Blood Type</option>
                <option value="A_POSITIVE">A+</option>
                <option value="A_NEGATIVE">A-</option>
                <option value="B_POSITIVE">B+</option>
                <option value="B_NEGATIVE">B-</option>
                <option value="O_POSITIVE">O+</option>
                <option value="O_NEGATIVE">O-</option>
                <option value="AB_POSITIVE">AB+</option>
                <option value="AB_NEGATIVE">AB-</option>
              </select>
              <DatePicker
                selected={newUser.birthday ? new Date(newUser.birthday) : null}
                onChange={(date) =>
                  setNewUser({
                    ...newUser,
                    birthday: date.toISOString().split("T")[0],
                  })
                }
                dateFormat="dd/MM/yyyy"
                placeholderText="Chọn ngày sinh (dd/mm/yyyy)"
                className="custom-datepicker-input"
                maxDate={
                  new Date(
                    new Date().setFullYear(new Date().getFullYear() - 18)
                  )
                }
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
              />

              <select
                required
                value={newUser.sex || ""}
                onChange={(e) =>
                  setNewUser({ ...newUser, sex: e.target.value })
                }
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
              <input
                required
                value={newUser.occupation || ""}
                onChange={(e) =>
                  setNewUser({ ...newUser, occupation: e.target.value })
                }
                placeholder="Occupation"
              />
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  Add
                </button>
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => setNewUser({})}
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="admin-page">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Admin Page</h2>
        </div>
        <ul className="sidebar-nav">
          {menuItems.map((item) => (
            <li
              key={item.key}
              className={selected === item.key ? "active" : ""}
              onClick={() => {
                if (item.key === "logout") {
                  logout();
                } else {
                  setSelected(item.key);
                }
              }}
            >
              <span className="menu-icon">{item.icon}</span>
              {item.label}
            </li>
          ))}
        </ul>
      </aside>
      <main className="admin-main">{renderContent()}</main>
    </div>
  );
}
