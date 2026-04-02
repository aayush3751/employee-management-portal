import React from "react";
import "../Info.css";

export const Info = () => {
  return (
    <div className="info-page">
      <form className="employee-form">
        <h2 className="form-title">Add New Employee</h2>

        {/* id */}
        <div className="form-group">
          <label>ID</label>
          <input type="text"/>
        </div>

        {/* Name */}
        <div className="form-group">
          <label>Name</label>
          <input type="text" />
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" />
        </div>

        {/* Password */}
        <div className="form-group">
          <label>Password</label>
          <input type="password" />
        </div>

        {/* Department */}
        <div className="form-group">
          <label>Department</label>
          <input type="text" />
        </div>

        {/* Checkbox */}
        <div className="checkbox-group">
          <input type="checkbox" id="check" />
          <label htmlFor="check">I confirm the details are correct</label>
        </div>

        <button type="submit" className="submit-btn">Add Employee</button>
      </form>
    </div>
  );
};