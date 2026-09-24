import React, { useState } from 'react';
import UserAPI from '../API/UserAPI';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handlerLogin = async (e) => {
      e.preventDefault();

      try {
        const body = {
          email: email.trim().toLowerCase(),
          password,
        };

        const response = await UserAPI.postLogin(body);

        if (!response || !response.user || !response.token) {
          alert("Invalid login response.");
          return;
        }

        const user = response.user;
        const token = response.token;

        if (user.role !== "admin") {
          alert("This account does not have admin permission.");
          return;
        }

        sessionStorage.setItem("token", token);
        sessionStorage.setItem("id_user", user._id);
        sessionStorage.setItem("name_user", user.fullname);
        sessionStorage.setItem("role", user.role);

        window.location.href = "/";
      } catch (error) {
        console.error("Admin login error:", error);

        alert(error.response?.data?.message || "Incorrect email or password.");
      }
    };

    return (
  <div
    className="d-flex justify-content-center align-items-center"
    style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea, #764ba2)"
    }}
  >
    <div
      style={{
        width: "100%",
        maxWidth: "420px",
        background: "#fff",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
      }}
    >
      <div className="text-center mb-4">
        <img
          src="/assets/images/big/icon.png"
          alt="logo"
          style={{ width: "60px" }}
        />
        <h2 className="mt-3">Sign In</h2>
        <p className="text-muted" style={{ fontSize: "14px" }}>
          Welcome back! Please login to your account.
        </p>
      </div>

      <form onSubmit={handlerLogin}>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ borderRadius: "8px", padding: "10px" }}
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ borderRadius: "8px", padding: "10px" }}
          />
        </div>

        <button
          type="submit"
          className="btn w-100"
          style={{
            background: "#667eea",
            color: "#fff",
            padding: "10px",
            borderRadius: "8px",
            fontWeight: "bold"
          }}
        >
          Sign In
        </button>
      </form>

    </div>
  </div>
);
}

export default Login;
