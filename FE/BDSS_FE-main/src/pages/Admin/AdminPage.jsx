import React from "react";
import { Outlet, NavLink } from "react-router-dom";

export default function AdminPage() {
  return (
    <div className="staff-page">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Admin Page</h2>
        </div>
        <nav className="sidebar-nav">
          <NavLink className="nav-link" to="donation-schedule">
            Donation Schedule
          </NavLink>
          <NavLink className="nav-link" to="blog-manager">
            Blog Manager
          </NavLink>
          <NavLink className="nav-link" to="faq-manager">
            FAQ Manager
          </NavLink>
          <NavLink className="nav-link" to="appointment-manager">
            Donor Appointment Manager
          </NavLink>
          <NavLink className="nav-link" to="contact">
            Contact
          </NavLink>
        </nav>
      </aside>

      <main className="main-content">
        <div className="main-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
