import React, { useState } from "react";

import { Link, useHistory } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import queryString from "query-string";
import alertify from "alertifyjs";

import UserAPI from "../API/UserAPI";
import CartAPI from "../API/CartAPI";

import { addSession } from "../Redux/Action/ActionSession";

import { deleteAllCart } from "../Redux/Action/ActionCart";

import "./Auth.css";

function SignIn() {
  const history = useHistory();

  const dispatch = useDispatch();

  const guestCart = useSelector((state) => state.Cart.listCart);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const validateEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const validateForm = () => {
    const newErrors = {};

    const emailValue = email.trim();

    if (!emailValue) {
      newErrors.email = "Vui lòng nhập email.";
    } else if (!validateEmail(emailValue)) {
      newErrors.email = "Định dạng email không hợp lệ.";
    }

    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const syncCartToServer = async (idUser) => {
    if (!Array.isArray(guestCart) || guestCart.length === 0) {
      return;
    }

    const requests = guestCart.map((item) => {
      const params = {
        idUser,

        idProduct: item.idProduct,

        count: Number(item.count) || 1,
      };

      const query = "?" + queryString.stringify(params);

      return CartAPI.postAddToCart(query);
    });

    await Promise.all(requests);

    dispatch(deleteAllCart([]));
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const body = {
        email: email.trim(),
        password,
      };

      const response = await UserAPI.postLogin(body);

      if (!response || !response._id) {
        setErrors({
          general: "Email hoặc mật khẩu không đúng.",
        });

        alertify.set("notifier", "position", "bottom-left");

        alertify.error("Email hoặc mật khẩu không đúng!");

        setLoading(false);

        return;
      }

      const idUser = response._id;

      sessionStorage.setItem("id_user", idUser);

      sessionStorage.setItem("name_user", response.fullname || "User");


      dispatch(addSession(idUser));

      await syncCartToServer(idUser);


      window.dispatchEvent(new Event("cartUpdated"));

      alertify.set("notifier", "position", "bottom-left");

      alertify.success("Đăng nhập thành công!");

      setLoading(false);

      history.push("/");
    } catch (error) {
      console.error("Login error:", error);

      setErrors({
        general: "Không thể đăng nhập. Vui lòng thử lại.",
      });

      alertify.set("notifier", "position", "bottom-left");

      alertify.error("Đăng nhập thất bại, vui lòng thử lại!");

      setLoading(false);
    }
  };


  const handleEmailChange = (event) => {
    setEmail(event.target.value);

    if (errors.email || errors.general) {
      setErrors((current) => ({
        ...current,

        email: "",

        general: "",
      }));
    }
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);

    if (errors.password || errors.general) {
      setErrors((current) => ({
        ...current,

        password: "",

        general: "",
      }));
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-container">

        <div className="auth-visual">
          <div className="auth-visual-overlay" />

          <div className="auth-visual-content">
            <Link to="/" className="auth-brand">
              <span className="auth-brand-icon">
                <i className="fas fa-camera" />
              </span>

              <span>
                CAMERA
                <strong>SHOP</strong>
              </span>
            </Link>

            <div className="auth-visual-text">
              <span className="auth-eyebrow">Welcome back</span>

              <h1>Continue your photography journey.</h1>

              <p>Sign in to manage your orders, wishlist and shopping cart.</p>
            </div>

            <div className="auth-benefits">
              <span>
                <i className="fas fa-check" />
                Track your orders
              </span>

              <span>
                <i className="fas fa-check" />
                Save favorite cameras
              </span>

              <span>
                <i className="fas fa-check" />
                Faster checkout
              </span>
            </div>
          </div>
        </div>


        <div className="auth-form-panel">
          <div className="auth-form-wrapper">
            <div className="auth-mobile-logo">
              <Link to="/" className="auth-brand">
                <span className="auth-brand-icon">
                  <i className="fas fa-camera" />
                </span>

                <span>
                  CAMERA
                  <strong>SHOP</strong>
                </span>
              </Link>
            </div>

            <div className="auth-form-heading">
              <span className="section-eyebrow">Account</span>

              <h2>Sign in</h2>

              <p>Enter your account details to continue.</p>
            </div>

            {errors.general && (
              <div className="auth-general-error">
                <i className="fas fa-exclamation-circle" />

                <span>{errors.general}</span>
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>

              <div className="auth-field">
                <label htmlFor="loginEmail">Email Address</label>

                <div className={`auth-input ${errors.email ? "error" : ""}`}>
                  <i className="far fa-envelope" />

                  <input
                    id="loginEmail"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter your email"
                    autoComplete="email"
                  />
                </div>

                {errors.email && (
                  <span className="auth-error">{errors.email}</span>
                )}
              </div>

              <div className="auth-field">
                <label htmlFor="loginPassword">Password</label>

                <div className={`auth-input ${errors.password ? "error" : ""}`}>
                  <i className="fas fa-lock" />

                  <input
                    id="loginPassword"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    <i
                      className={
                        showPassword ? "far fa-eye-slash" : "far fa-eye"
                      }
                    />
                  </button>
                </div>

                {errors.password && (
                  <span className="auth-error">{errors.password}</span>
                )}
              </div>

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? (
                  <>
                    <i className="fas fa-circle-notch fa-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <i className="fas fa-arrow-right" />
                  </>
                )}
              </button>
            </form>

            <div className="auth-switch">
              <span>Don't have an account?</span>

              <Link to="/signup">Create Account</Link>
            </div>

            <Link to="/shop" className="auth-back-shop">
              <i className="fas fa-arrow-left" />
              Continue as guest
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default SignIn;
