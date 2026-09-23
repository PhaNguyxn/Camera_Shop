import React, { useState } from "react";

import { Link, useHistory } from "react-router-dom";

import alertify from "alertifyjs";

import UserAPI from "../API/UserAPI";

import "./Auth.css";

function SignUp() {
  const history = useHistory();

  const [fullname, setFullname] = useState("");

  const [email, setEmail] = useState("");

  const [phone, setPhone] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const validateEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const validatePhone = (value) => {
    return /^[0-9+]{9,15}$/.test(value.replace(/\s/g, ""));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!fullname.trim()) {
      newErrors.fullname = "Vui lòng nhập họ tên.";
    }

    if (!email.trim()) {
      newErrors.email = "Vui lòng nhập email.";
    } else if (!validateEmail(email.trim())) {
      newErrors.email = "Định dạng email không hợp lệ.";
    }

    if (!phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại.";
    } else if (!validatePhone(phone.trim())) {
      newErrors.phone = "Số điện thoại không hợp lệ.";
    }

    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu.";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  const updateField = (setter, field) => (event) => {
    setter(event.target.value);

    if (errors[field] || errors.general) {
      setErrors((current) => ({
        ...current,

        [field]: "",

        general: "",
      }));
    }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const params = {
        fullname: fullname.trim(),

        email: email.trim(),

        password,

        phone: phone.trim(),
      };

      await UserAPI.postSignUp(params);

      alertify.set("notifier", "position", "bottom-left");

      alertify.success("Đăng ký tài khoản thành công!");

      setLoading(false);

      history.push("/signin");
    } catch (error) {
      console.error("Sign up error:", error);

      setErrors({
        general: "Không thể tạo tài khoản. Email có thể đã được sử dụng.",
      });

      alertify.set("notifier", "position", "bottom-left");

      alertify.error("Đăng ký thất bại, vui lòng thử lại!");

      setLoading(false);
    }
  };

  return (
    <main className="auth-page auth-signup-page">
      <div className="auth-container auth-signup-container">
        <div className="auth-visual">
          <div className="auth-visual-overlay" />

          <div className="auth-visual-content">

            <div className="auth-visual-text">
              <span className="auth-eyebrow">Join Camera Shop</span>

              <h1>Create your photography account.</h1>

              <p>
                Save your favorite cameras, manage orders and enjoy a faster
                shopping experience.
              </p>
            </div>

            <div className="auth-benefits">
              <span>
                <i className="fas fa-check" />
                Save your wishlist
              </span>

              <span>
                <i className="fas fa-check" />
                Track every order
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
              <span className="section-eyebrow">New account</span>

              <h2>Create Account</h2>

              <p>Enter your information to create a Camera Shop account.</p>
            </div>

            {errors.general && (
              <div className="auth-general-error">
                <i className="fas fa-exclamation-circle" />

                <span>{errors.general}</span>
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-field">
                <label htmlFor="signupName">Full Name</label>

                <div className={`auth-input ${errors.fullname ? "error" : ""}`}>
                  <i className="far fa-user" />

                  <input
                    id="signupName"
                    type="text"
                    value={fullname}
                    onChange={updateField(setFullname, "fullname")}
                    placeholder="Enter your full name"
                    autoComplete="name"
                  />
                </div>

                {errors.fullname && (
                  <span className="auth-error">{errors.fullname}</span>
                )}
              </div>

              <div className="auth-field">
                <label htmlFor="signupEmail">Email Address</label>

                <div className={`auth-input ${errors.email ? "error" : ""}`}>
                  <i className="far fa-envelope" />

                  <input
                    id="signupEmail"
                    type="email"
                    value={email}
                    onChange={updateField(setEmail, "email")}
                    placeholder="Enter your email"
                    autoComplete="email"
                  />
                </div>

                {errors.email && (
                  <span className="auth-error">{errors.email}</span>
                )}
              </div>

              <div className="auth-field">
                <label htmlFor="signupPhone">Phone Number</label>

                <div className={`auth-input ${errors.phone ? "error" : ""}`}>
                  <i className="fas fa-phone-alt" />

                  <input
                    id="signupPhone"
                    type="tel"
                    value={phone}
                    onChange={updateField(setPhone, "phone")}
                    placeholder="Enter your phone number"
                    autoComplete="tel"
                  />
                </div>

                {errors.phone && (
                  <span className="auth-error">{errors.phone}</span>
                )}
              </div>

              <div className="auth-field">
                <label htmlFor="signupPassword">Password</label>

                <div className={`auth-input ${errors.password ? "error" : ""}`}>
                  <i className="fas fa-lock" />

                  <input
                    id="signupPassword"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={updateField(setPassword, "password")}
                    placeholder="Create a password"
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label="Show password"
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

              <div className="auth-field">
                <label htmlFor="confirmPassword">Confirm Password</label>

                <div
                  className={`auth-input ${
                    errors.confirmPassword ? "error" : ""
                  }`}
                >
                  <i className="fas fa-lock" />

                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={updateField(
                      setConfirmPassword,
                      "confirmPassword",
                    )}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                  />
                </div>

                {errors.confirmPassword && (
                  <span className="auth-error">{errors.confirmPassword}</span>
                )}
              </div>

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? (
                  <>
                    <i className="fas fa-circle-notch fa-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <i className="fas fa-arrow-right" />
                  </>
                )}
              </button>
            </form>

            <div className="auth-switch">
              <span>Already have an account?</span>

              <Link to="/signin">Sign In</Link>
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

export default SignUp;
