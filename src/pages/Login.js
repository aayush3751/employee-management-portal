import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminId, setAdminId] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleFromHome = searchParams.get("role"); // employee or admin

  const handleLogin = async () => {
  if (roleFromHome === "admin") {
    try {
      const res = await fetch("http://localhost:5001/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: adminId, password }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem("isAdmin", "true");
        navigate("/admin");
      } else {
        alert(data.message || "Incorrect admin credentials!");
      }
    } catch (error) {
      alert("Login failed!");
    }
    return;
  }

    // Employee login - check against existing employee data
    console.log("Attempting login with:", { email, password });
    
    try {
      const res = await fetch("http://localhost:5001/api/employees");
      console.log("Response status:", res.status);
      const employees = await res.json();
      console.log("Employees data:", employees);

      // Find employee by email
      const employee = employees.find(emp => emp.email === email);
      
      if (!employee) {
        alert("Employee not found with this email!");
        return;
      }

      // For demo purposes, accept any password for existing employees
      // In production, you should have proper password authentication
      if (employee.email === email) {
        localStorage.setItem("employeeId", employee.id);
        console.log("Login successful, navigating to /employee");
        navigate("/employee");
      } else {
        alert("Invalid credentials!");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login error: " + error.message);
    }
  };


  return (
    <div style={{ textAlign: "center", marginTop: "60px" }}>
      <h2>{roleFromHome === "admin" ? "Admin Login" : "Employee Login"}</h2>

      {roleFromHome === "admin" ? (
        <>
          <input
            placeholder="Admin ID"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
        </>
      ) : (
        <>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
        </>
      )}
      
      <button onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}