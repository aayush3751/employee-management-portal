import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../user.css";
export const User = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const employeeId = localStorage.getItem("employeeId");
    if (!employeeId) {
      navigate("/");
      return;
    }

    // Fetch all employees and find the one with matching ID
    fetch("http://localhost:5001/api/employees")
      .then(res => res.json())
      .then(employees => {
        const employee = employees.find(emp => emp.id == employeeId);
        if (employee) {
          setUserData(employee);
        } else {
          alert("Employee not found");
          navigate("/");
        }
      })
      .catch(err => {
        console.error("Error:", err);
        alert("Error fetching user data");
        navigate("/");
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("employeeId");
    navigate("/");
  };

  if (!userData) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <h2>User Dashboard</h2>
      </div>
      
      <div className="user-card">
        <div className="employee-details">
          <h3>Employee Details</h3>
          <div className="detail-item">
            <strong>Name:</strong>
            <span>{userData.name}</span>
          </div>
          <div className="detail-item">
            <strong>Email:</strong>
            <span>{userData.email}</span>
          </div>
          <div className="detail-item">
            <strong>Department:</strong>
            <span>{userData.department}</span>
          </div>
          <div className="detail-item">
            <strong>Position:</strong>
            <span>{userData.position}</span>
          </div>
          <div className="detail-item">
            <strong>Employee ID:</strong>
            <span>{userData.id}</span>
          </div>
          <div className="detail-item">
            <strong>Join Date:</strong>
            <span>{userData.hire_date}</span>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="logout-btn"
        >
          Logout
        </button>
      </div>
    </div>
  );
};
