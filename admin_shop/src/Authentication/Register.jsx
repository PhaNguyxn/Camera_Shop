import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import UserAPI from "../API/UserAPI";

function Register() {
  const history = useHistory();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    // validate
    if (!fullname || !email || !password || !rePassword) {
      return setError("Vui lòng nhập đầy đủ thông tin!");
    }

    if (password !== rePassword) {
      return setError("Mật khẩu nhập lại không khớp!");
    }

    try {
      setLoading(true);
      setError("");

      const body = { fullname, email, password };
      await UserAPI.postSignUp(body);

      alert("Đăng ký thành công!");
      history.push("/login");
    } catch (err) {
      setError("Email đã tồn tại hoặc lỗi hệ thống!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#fff",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        <div className="text-center mb-4">
          <img
            src="/assets/images/big/icon.png"
            alt="logo"
            style={{ width: "60px" }}
          />
          <h2 className="mt-3">Sign Up</h2>
          <p className="text-muted" style={{ fontSize: "14px" }}>
            Create your account to get started
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="alert alert-danger text-center">{error}</div>
        )}

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label>Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              style={{ borderRadius: "8px", padding: "10px" }}
            />
          </div>

          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ borderRadius: "8px", padding: "10px" }}
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ borderRadius: "8px", padding: "10px" }}
            />
          </div>

          <div className="mb-3">
            <label>Confirm Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Re-enter password"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              style={{ borderRadius: "8px", padding: "10px" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn w-100"
            style={{
              background: "#667eea",
              color: "#fff",
              padding: "10px",
              borderRadius: "8px",
              fontWeight: "bold",
            }}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-4">
          <span style={{ fontSize: "14px" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#ff4d6d", fontWeight: "bold" }}>
              Sign In
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Register;