import { useState } from "react";
import API from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    await API.post("/auth/register", { email, password });
    alert("Registered successfully");
    navigate("/login");
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-left-content">
          <h1>NEWS DIGEST</h1>
          <p>Just the News You Need</p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2>Register</h2>

          <input
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm your password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          <button onClick={submit}>Register</button>

          <p>
            Already registered? <Link to="/login">Login →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
