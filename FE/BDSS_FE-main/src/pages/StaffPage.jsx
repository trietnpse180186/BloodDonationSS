import React, { useState } from "react";
import "./staffPage.css";
import "./StaffPage.css";
import BlogManager from "../components/BlogManager";
import FAQManager from "../components/FAQManager";
import logout from "../assets/authLogout";
const menuItems = [
  { key: "schedule", label: "Donation Schedule" },
  { key: "appointment", label: "Donor Appointment Manager" },
  { key: "blog", label: "Blog Manager" },
  { key: "faq", label: "FAQ Manager" },

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
            Edit Donation Schedule content
          </div>
        );
      case "appointment":
        return (
          <div className="admin-content-box">
            Donor Appointment Manager content
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

      case "contact":
        return <div className="admin-content-box">Contact content</div>;
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
