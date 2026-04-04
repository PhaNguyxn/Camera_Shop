import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import UserAPI from '../API/UserAPI';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handlerLogin = async (e) => {
        e.preventDefault();
        const body = { email, password };
        try {
            const response = await UserAPI.postLogin(body);
            sessionStorage.setItem('id_user', response._id);
            sessionStorage.setItem('name_user', response.fullname);
            alert("Đăng nhập thành công!");
            window.location.href = '/'; 
        } catch (error) {
            alert("Sai email hoặc mật khẩu!");
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

      <div className="text-center mt-4">
        <span style={{ fontSize: "14px" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#ff4d6d", fontWeight: "bold" }}>
            Sign Up
          </Link>
        </span>
      </div>
    </div>
  </div>
);
}

export default Login;