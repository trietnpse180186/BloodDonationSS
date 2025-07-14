import React, { useEffect, useState } from "react";
import "./staffPage.css";
import "./StaffPage.css";
import BlogManager from "../Blog/BlogManager";
import logout from "../../helpers/authLogout";
import ContactManager from "../Contact/ContactManager";
import MedicalSchedule from "../DonationSchedule/MedicalSchedule";
import Notification from "../Notification/Notification";
import FAQManager from "../FAQ/FAQManager";
import AppointmentManager from "../Appointment/AppointmentManager";

import { FaBell, FaBlog, FaCalendarAlt, FaEnvelope, FaQuestionCircle, FaSignOutAlt, FaUserFriends } from "react-icons/fa";
import getUserById, { getUserIdFromToken } from "../../helpers/getUserById";

const menuItems = [
  { key: "schedule", label: "Donation Schedule", icon: <FaCalendarAlt /> },
  {
    key: "appointment",
    label: "Donor Appointment Manager",
    icon: <FaUserFriends />,
  },
  { key: "blog", label: "Blog Manager", icon: <FaBlog /> },
  { key: "faq", label: "FAQ Manager", icon: <FaQuestionCircle /> },
  { key: "notification", label: "Notification", icon: <FaBell /> },
  { key: "contact", label: "Contact", icon: <FaEnvelope /> },
  { key: "logout", label: "Logout", icon: <FaSignOutAlt /> },
];

export default function StaffPage() {
  const [selected, setSelected] = useState("schedule");
  const handleLogout = () => {
    logout();
  };
  const renderContent = () => {
    switch (selected) {
      case "schedule":
        return (
          <div className="staff-content-box">
            <MedicalSchedule />
          </div>
        );
      case "appointment":
        return (
          <div className="admin-content-box">
            <AppointmentManager />
          </div>
        );
      case "blog":
        return (
          <div className="staff-content-box">
            <BlogManager />
          </div>
        );
      case "faq":
        return (
          <div className="staff-content-box">
            <FAQManager />
          </div>
        );

      case "notification":
        return (
          <div className="staff-content-box">
            <Notification />
          </div>
        );
      case "contact":
        return (
          <div className="staff-content-box">
            <ContactManager />
          </div>
        );
      default:
        return null;
      case "logout":
        handleLogout();
        return;
    }
  };
  const [staffInfo, setStaffInfo] = useState(null);

  useEffect(() => {
    const staffId = getUserIdFromToken();
    getUserById(staffId).then((data) => setStaffInfo(data));
  }, []);
  if (!staffInfo) {
    return <div className="staff-page">Loading...</div>;
  }
  console.log("Staff Info:", staffInfo);
  return (
    <div className="staff-page">
      <aside className="staff-sidebar">
        <h2 className="staff-title">Staff Workspace</h2>
        <div className="staff-info">
          <h5 className="staff-username">Name: {staffInfo.fullName}</h5>
          <h5 className="staff-email">Email: {staffInfo.email}</h5>
        </div>
        <ul className="staff-menu">
          {menuItems.map((item) => (
            <li
              key={item.key}
              className={selected === item.key ? "active" : ""}
              onClick={() => setSelected(item.key)}
              style={{ display: "flex", alignItems: "center", gap: 10 }}
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              {item.label}
            </li>
          ))}
        </ul>
      </aside>
      <main className="staff-main">{renderContent()}</main>
    </div>
  );
}
