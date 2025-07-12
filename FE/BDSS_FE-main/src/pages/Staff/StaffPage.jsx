import React, { useState } from "react";
import "./staffPage.css";
import "./StaffPage.css";
import BlogManager from "../Blog/BlogManager";
import logout from "../../assets/authLogout";
import ContactManager from "../Contact/ContactManager";
import MedicalSchedule from "../DonationSchedule/MedicalSchedule";
import Notification from "../Notification/Notification";
import FAQManager from "../FAQ/FAQManager";
import AppointmentManager from "../Appointment/AppointmentManager";
const menuItems = [
  { key: "schedule", label: "Donation Schedule" },
  { key: "appointment", label: "Donor Appointment Manager" },
  { key: "blog", label: "Blog Manager" },
  { key: "faq", label: "FAQ Manager" },
  { key: "notification", label: "Notification" },
  { key: "contact", label: "Contact" },
  { key: "logout", label: "Logout" },
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
          <div className="admin-content-box">
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
          <div className="admin-content-box">
            <BlogManager />
          </div>
        );
      case "faq":
        return (
          <div className="admin-content-box">
            <FAQManager />
          </div>
        );

      case "notification":
        return (
          <div className="admin-content-box">
            <Notification />
          </div>
        );
      case "contact":
        return (
          <div className="admin-content-box">
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

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <h2 className="admin-title">Staff Panel</h2>
        <ul className="admin-menu">
          {menuItems.map((item) => (
            <li
              key={item.key}
              className={selected === item.key ? "active" : ""}
              onClick={() => setSelected(item.key)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </aside>
      <main className="admin-main">{renderContent()}</main>
    </div>
  );
}
