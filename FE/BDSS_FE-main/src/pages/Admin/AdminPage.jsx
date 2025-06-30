import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import './AdminPage.css'; // Assuming you have a CSS file for styling

export default function AdminPage() {
  return (
    <div className="admin-page">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Admin Page</h2>
        </div>
        <nav className="sidebar-nav">
          <NavLink className="nav-link" to="blog-manager">Doner Manager</NavLink>
          <NavLink className="nav-link" to="faq-manager">Staff Manager</NavLink>
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
