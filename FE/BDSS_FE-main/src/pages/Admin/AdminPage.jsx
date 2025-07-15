import React, { useEffect, useState } from "react";
import axios from "../../helpers/axiosInstance";
import logout from "../../helpers/authLogout";
import "./AdminPage.css";
import {
  FaSignOutAlt,
  FaTachometerAlt,
  FaUserCog,
} from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const menuItems = [
  { key: "dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
  { key: "staff", label: "Staff Manager", icon: <FaUserCog /> },
  { key: "logout", label: "Logout", icon: <FaSignOutAlt /> },
];

export default function AdminPage() {
  const [selected, setSelected] = useState("dashboard");
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({});
  const [error, setError] = useState("");
  const token = sessionStorage.getItem("accessToken");

  useEffect(() => {
    if (selected === "dashboard") {
      axios
        .get("http://localhost:8080/api/v1/admin/dashboard", {
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
      const res = await axios.get("http://localhost:8080/api/v1/admin/staff", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to load list.";
      setError(message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/v1/admin/staff/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/v1/admin/staff", newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Staff created successfully");
      setNewUser({});
      fetchStaff();
    } catch (err) {
      alert("Failed to create staff");
    }
  };

  const chartData = [
    { name: "Jan", value: 20 },
    { name: "Feb", value: 25 },
    { name: "Mar", value: 30 },
    { name: "Apr", value: 28 },
    { name: "May", value: 22 },
    { name: "Jun", value: 18 },
  ];

  const renderContent = () => {
    if (selected === "dashboard") {
      return (
        <div className="dashboard">
          <h3>Bảng điều khiển</h3>
          {!dashboardData ? (
            <p>Loading data...</p>
          ) : (
            <>
              <div className="stat-cards">
                <div className="stat-card">
                  <h4>Tổng người hiến</h4>
                  <p>{dashboardData.totalDonors}</p>
                </div>
                <div className="stat-card">
                  <h4>Nhân viên</h4>
                  <p>{dashboardData.totalStaff}</p>
                </div>
                <div className="stat-card">
                  <h4>Tổng lượt hiến</h4>
                  <p>{dashboardData.totalDonations}</p>
                </div>
                <div className="stat-card">
                  <h4>Lượng máu</h4>
                  <p>{dashboardData.totalBloodVolume} L</p>
                </div>
              </div>

              <div style={{ width: "100%", height: 300, marginTop: 40 }}>
                <ResponsiveContainer>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      );
    }

    if (selected === "staff") {
      return (
        <div className="user-management">
          <h3>Staff Management</h3>
          {error ? (
            <p>{error}</p>
          ) : (
            <div className="staff-content-grid">
              <div className="staff-table-section">
                <table className="user-table">
                  <thead>
                    <tr>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Address</th>
                      <th>Gender</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.fullName}</td>
                        <td>{user.email}</td>
                        <td>{user.phoneNumber}</td>
                        <td>{user.address}</td>
                        <td>{user.sex}</td>
                        <td>
                          <button className="delete-btn" onClick={() => handleDelete(user.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="staff-form-section">
                <h4>Add New Staff</h4>
                <form onSubmit={handleCreate} className="edit-form">
                  <input
                    required
                    value={newUser.fullName || ""}
                    onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                    placeholder="Full Name"
                  />
                  <div className="horizontal-fields">
                    <input
                      required
                      value={newUser.email || ""}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="Email"
                    />
                    <input
                      required
                      type="password"
                      value={newUser.password || ""}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      placeholder="Password"
                    />
                  </div>
                  <input
                    required
                    value={newUser.phoneNumber || ""}
                    onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
                    placeholder="Phone Number"
                  />
                  <input
                    required
                    value={newUser.address || ""}
                    onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                    placeholder="Address"
                  />
                  <select
                    required
                    value={newUser.bloodType || ""}
                    onChange={(e) => setNewUser({ ...newUser, bloodType: e.target.value })}
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
                  <input
                    required
                    type="date"
                    value={newUser.birthday || ""}
                    onChange={(e) => setNewUser({ ...newUser, birthday: e.target.value })}
                    placeholder="yyyy-MM-dd"
                  />
                  <select
                    required
                    value={newUser.sex || ""}
                    onChange={(e) => setNewUser({ ...newUser, sex: e.target.value })}
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                  <input
                    required
                    value={newUser.occupation || ""}
                    onChange={(e) => setNewUser({ ...newUser, occupation: e.target.value })}
                    placeholder="Occupation"
                  />
                  <button type="submit" className="save-btn">Add</button>
                  <button type="button" className="delete-btn" onClick={() => setNewUser({})}>Clear</button>
                </form>
              </div>
            </div>
          )}
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
              onClick={() => setSelected(item.key)}
              style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
            >
              <span>{item.icon}</span>
              {item.label}
            </li>
          ))}
        </ul>
      </aside>
      <main className="admin-main">{renderContent()}</main>
    </div>
  );
}
