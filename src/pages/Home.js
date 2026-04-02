import { useNavigate } from "react-router-dom";
import "../Home.css";
export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="header">
        <h1>Employee Management System</h1>
      </div>

      <div className="welcome-section">
        <h2>Welcome to Employee Management Portal</h2>
        <p>Choose your login type to continue</p>
      </div>

      <div className="actions-section">
        <h2>Login Options</h2>
        <div className="action-buttons">
          <button onClick={() => navigate("/login?role=employee")}>
            User Login
          </button>

          <button style={{ marginLeft: "20px" }} onClick={() => navigate("/login?role=admin")}>
            Admin Login
          </button>
        </div>
      </div>
    </div>
  );
}