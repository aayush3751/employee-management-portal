import React from "react";
import "../Home.css";
import {useNavigate} from "react-router-dom";
export const Home = () => {
     const navigate = useNavigate();
  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
        <h1>Employee Management System</h1>
        <nav>
          <ul className="nav-links">
            <li>Dashboard</li>
            <li>Employees</li>
            <li>Departments</li>
            <li>Attendance</li>
            <li>Logout</li>
          </ul>
        </nav>
      </header>

      {/* Welcome Section */}
      <section className="welcome-section">
        <h2>Welcome, Admin 👋</h2>
        <p>Manage your employees, departments, and attendance efficiently.</p>
      </section>

      {/* Stats Dashboard */}
      <section className="stats-section">
        <div className="stat-card">
          <h3>Total Employees</h3>
          <p>120</p>
        </div>
        <div className="stat-card">
          <h3>Departments</h3>
          <p>8</p>
        </div>
        <div className="stat-card">
          <h3>Present Today</h3>
          <p>105</p>
        </div>
        <div className="stat-card">
          <h3>On Leave</h3>
          <p>15</p>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="actions-section">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button onClick={() => navigate("/info")}>Add Employee</button>
          <button onClick={() => navigate("/profile")}>View Employees</button>
          <button>Mark Attendance</button>
          <button onClick={() => navigate("/")}>Generate Report</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 Employee Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;