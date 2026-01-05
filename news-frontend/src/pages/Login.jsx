import { useState } from "react";
import API from "../api/api";
import { Link } from "react-router-dom";
import "../styles/auth.css";

export default function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    const res = await API.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
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
          <h2>Login</h2>

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

          <button onClick={submit}>Login</button>

          <p>
            New User? <Link to="/register">Register →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
