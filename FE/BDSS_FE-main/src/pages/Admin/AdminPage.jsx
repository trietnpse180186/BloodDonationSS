import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

export default function AdminPage() {
  const [selected, setSelected] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  const token = sessionStorage.getItem("accessToken");

  useEffect(() => {
    if (selected === "dashboard") {
      axios
        .get("http://localhost:8080/api/dashboard/statistics", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setDashboardData(res.data))
        .catch((err) => {
          console.error("Lỗi khi tải dashboard:", err);
          setDashboardData(null);
        });
    } else {
      axios
        .get("http://localhost:8080/users", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUsers(res.data))
        .catch((err) => {
          const message = err.response?.data?.message || "Lỗi khi tải danh sách.";
          setError(message);
        });
    }
  }, [selected]);

  const handleLogout = () => logout();

  const handleDelete = async (email) => {
    if (!window.confirm("Bạn có chắc muốn xoá người dùng này?")) return;
    try {
      await axios.delete(`http://localhost:8080/users/${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((user) => user.email !== email));
    } catch (err) {
      alert("Xoá thất bại");
    }
  };

  const handleEdit = (user) => setEditingUser(user);

  const handleUpdate = async (e, email) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/users/${email}`, editingUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Cập nhật thành công");
      setEditingUser(null);
      const res = await axios.get("http://localhost:8080/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      alert("Cập nhật thất bại");
    }
  };

  const renderContent = () => {
    if (selected === "dashboard") {
      return (
        <div className="dashboard">
          <h3>Bảng điều khiển</h3>
          {!dashboardData ? (
            <p>Đang tải dữ liệu...</p>
          ) : (
            <div className="dashboard-grid">
              <div className="stat-box">Tổng người hiến: {dashboardData.totalDonors}</div>
              <div className="stat-box">Lịch hẹn: {dashboardData.totalAppointments}</div>
              <div className="stat-box">Trung tâm: {dashboardData.totalCenters}</div>
              <div className="stat-box">Hiến máu hôm nay: {dashboardData.todayDonations}</div>
            </div>
          )}
        </div>
      );
    }

    const filtered = users.filter((u) => {
      if (selected === "donor-management") {
        return u.occupation === "Donor";
      }
      if (selected === "staff-management") {
        return u.occupation === "Staff";
      }
      return false;
    });

    return (
      <div className="user-management">
        <h3>{menuItems.find((item) => item.key === selected)?.label}</h3>

        {error ? (
          <p>{error}</p>
        ) : (
          <>
            <table className="user-table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Blood Type</th>
                  <th>Birthday</th>
                  <th>Address</th>
                  <th>Gender</th>
                  <th>Occupation</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user, i) => (
                  <tr key={i}>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>{user.phoneNumber}</td>
                    <td>{user.bloodType}</td>
                    <td>{user.birthday}</td>
                    <td>{user.address}</td>
                    <td>{user.sex}</td>
                    <td>{user.occupation}</td>
                    <td>
                      {user.occupation === "Staff" && (
                        <>
                          <button onClick={() => handleEdit(user)}>Edit</button>
                          <button onClick={() => handleDelete(user.email)}>Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {selected === "staff-management" && (
              <div className="add-staff-wrapper">
                <button
                  className="add-staff-button"
                  onClick={() =>
                    setEditingUser({
                      email: "",
                      fullName: "",
                      phoneNumber: "",
                      address: "",
                      sex: "Male",
                      occupation: "Staff",
                    })
                  }
                >
                  + Thêm Staff
                </button>
              </div>
            )}
          </>
        )}

        {editingUser?.occupation === "Staff" && (
          <form onSubmit={(e) => handleUpdate(e, editingUser.email)} className="edit-form">
            <input
              value={editingUser.fullName}
              onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
              placeholder="Full Name"
            />
            <input
              value={editingUser.phoneNumber}
              onChange={(e) => setEditingUser({ ...editingUser, phoneNumber: e.target.value })}
              placeholder="Phone"
            />
            <input
              value={editingUser.address}
              onChange={(e) => setEditingUser({ ...editingUser, address: e.target.value })}
              placeholder="Address"
            />
            <select
              value={editingUser.sex}
              onChange={(e) => setEditingUser({ ...editingUser, sex: e.target.value })}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditingUser(null)}>Cancel</button>
          </form>
        )}
      </div>
    );
  };

  return (
    <div className="admin-page">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Admin Page</h2>
        </div>
        <nav className="sidebar-nav">
          <NavLink className="nav-link" to="donation-schedule">Donation Schedule</NavLink>
          <NavLink className="nav-link" to="blog-manager">Blog Manager</NavLink>
          <NavLink className="nav-link" to="faq-manager">FAQ Manager</NavLink>
          <NavLink className="nav-link" to="appointment-manager">Donor Appointment Manager</NavLink>
          <NavLink className="nav-link" to="contact">Contact</NavLink>
        </nav>
      </aside>
      <main className="admin-main">{renderContent()}</main>
    </div>
  );
}
