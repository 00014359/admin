import React, { useState } from "react";
import axios from "axios";
import c from "./Login.module.scss";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const response = await axios.post(
        "http://localhost:9000/api/user/login",
        {
          name: username,
          password,
        }
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        alert("Login successful!");

        window.location.href = "/";
      }
    } catch (error) {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className={c.loginContainer}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className={c.error}>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
