import React, { useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import UserAPI from "../API/UserAPI";
import { Field, Icon, Notice } from "../components/AdminUI";
import { errorMessage } from "../utils/admin";

export default function Login() {
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const loggedIn =
    sessionStorage.getItem("token") &&
    sessionStorage.getItem("id_user") &&
    sessionStorage.getItem("role") === "admin";

  if (loggedIn) {
    return <Redirect to="/" />;
  }

  const submit = async (event) => {
    event.preventDefault();

    if (busy) return;

    setBusy(true);
    setError("");

    try {
      const response = await UserAPI.postLogin({
        email: email.trim().toLowerCase(),
        password,
      });

      if (!response?.token || !response?.user?._id) {
        throw new Error("Phản hồi đăng nhập không hợp lệ.");
      }

      if (response.user.role !== "admin") {
        throw new Error("Tài khoản này không có quyền quản trị.");
      }

      sessionStorage.setItem("token", response.token);
      sessionStorage.setItem("id_user", response.user._id);
      sessionStorage.setItem("name_user", response.user.fullname || "");
      sessionStorage.setItem("role", response.user.role);

      history.replace("/");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="ad-login">
      <section className="ad-login-intro">
        <div className="ad-login-brand">
          <Icon name="camera" size={28} />
          CAMERA SHOP
        </div>

        <div>
          <p className="ad-eyebrow">ADMIN WORKSPACE</p>
          <h1>Quản lý cửa hàng, trong một không gian.</h1>
          <p>
            Theo dõi đơn hàng, cập nhật sản phẩm và chăm sóc khách hàng từ hệ
            thống quản trị Camera Shop.
          </p>
        </div>

      </section>

      <section className="ad-login-content">
        <form className="ad-login-form" onSubmit={submit}>
          <p className="ad-eyebrow">CHÀO MỪNG TRỞ LẠI</p>
          <h2>Đăng nhập quản trị</h2>
          <p className="ad-muted">
            Nhập tài khoản để tiếp tục quản lý cửa hàng.
          </p>

          <Notice>{error}</Notice>

          <Field label="Địa chỉ email">
            <input
              className="ad-input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@example.com"
              autoComplete="username"
              required
              disabled={busy}
            />
          </Field>

          <Field label="Mật khẩu">
            <input
              className="ad-input"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Nhập mật khẩu"
              autoComplete="current-password"
              required
              disabled={busy}
            />
          </Field>

          <label className="ad-login-check">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(event) => setShowPassword(event.target.checked)}
            />
            Hiện mật khẩu
          </label>

          <button
            className="ad-btn ad-btn-primary ad-btn-wide"
            type="submit"
            disabled={busy}
          >
            {busy ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </section>
    </div>
  );
}
