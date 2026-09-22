import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import queryString from "query-string";

import UserAPI from "../API/UserAPI";
import CartAPI from "../API/CartAPI";
import { addSession } from "../Redux/Action/ActionSession";

import "./Auth.css";

function SignIn() {
  const history = useHistory();
  const dispatch = useDispatch();

  const listCart = useSelector((state) => state.Cart.listCart);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errorLogin, setErrorLogin] = useState("");
  const [loading, setLoading] = useState(false);

  const syncCartToServer = async (idUser) => {
    if (!Array.isArray(listCart) || listCart.length === 0) {
      return;
    }

    for (let i = 0; i < listCart.length; i++) {
      const params = {
        idUser: idUser,
        idProduct: listCart[i].idProduct,
        count: listCart[i].count,
      };

      const query = "?" + queryString.stringify(params);

      await CartAPI.postAddToCart(query);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    setErrorLogin("");

    if (!email.trim() || !password) {
      setErrorLogin("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const body = {
        email: email.trim().toLowerCase(),
        password,
      };

      const response = await UserAPI.postLogin(body);

      console.log("LOGIN RESPONSE:", response);

      if (!response || !response.user) {
        setErrorLogin("Invalid login data.");
        return;
      }

      const user = response.user;

      sessionStorage.setItem("id_user", user._id);
      sessionStorage.setItem("name_user", user.fullname);
      sessionStorage.setItem("role", user.role);

      dispatch(addSession(user._id));

      if (user.role === "admin") {
        window.location.href =
          process.env.REACT_APP_ADMIN_URL || "http://localhost:3001";

        return;
      }

      if (user.role === "customer") {
        try {
          await syncCartToServer(user._id);
        } catch (cartError) {
          console.error("Unable to sync shopping cart:", cartError);
        }

        history.push("/");
        return;
      }

      setErrorLogin("This account does not have permission to access.");
    } catch (error) {
      console.error("Login error:", error);

      setErrorLogin(
        error.response?.data?.message || "Incorrect email or password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-visual">
          <div className="auth-visual-overlay"></div>

          <div className="auth-visual-content">
            <Link to="/" className="auth-brand">
              <span className="auth-brand-icon">
                <i className="fa fa-camera"></i>
              </span>
              CAMERA
              <strong>SHOP</strong>
            </Link>

            <div className="auth-visual-text">
              <span className="auth-eyebrow">CAMERA SHOP</span>

              <h1>
                Capture every
                <br />
                moment.
              </h1>

              <p>
                Discover high-quality cameras and accessories. Sign in to
                continue shopping and manage your account.
              </p>
            </div>

            <div className="auth-benefits">
              <span>
                <i className="fa fa-circle"></i>
                Genuine Products
              </span>

              <span>
                <i className="fa fa-circle"></i>
                Secure Payment
              </span>

              <span>
                <i className="fa fa-circle"></i>
                Customer Support
              </span>
            </div>
          </div>
        </div>

        <div className="auth-form-panel">
          <div className="auth-form-wrapper">
            <div className="auth-mobile-logo">
              <Link to="/" className="auth-brand">
                <span className="auth-brand-icon">
                  <i className="fa fa-camera"></i>
                </span>
                CAMERA
                <strong>SHOP</strong>
              </Link>
            </div>

            <div className="auth-form-heading">
              <h2>Sign In</h2>

              <p>Welcome back. Please sign in to continue.</p>
            </div>

            {errorLogin && (
              <div className="auth-general-error">
                <i className="fa fa-exclamation-circle"></i>

                <span>{errorLogin}</span>
              </div>
            )}

            <form className="auth-form" onSubmit={onSubmit}>
              <div className="auth-field">
                <label>Email</label>

                <div
                  className={`auth-input ${
                    errorLogin && !email ? "error" : ""
                  }`}
                >
                  <i className="fa fa-envelope"></i>

                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="auth-field">
                <label>Password</label>

                <div
                  className={`auth-input ${
                    errorLogin && !password ? "error" : ""
                  }`}
                >
                  <i className="fa fa-lock"></i>

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    <i
                      className={showPassword ? "fa fa-eye-slash" : "fa fa-eye"}
                    ></i>
                  </button>
                </div>
              </div>

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? (
                  <>
                    <i className="fa fa-spinner fa-spin"></i>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <i className="fa fa-arrow-right"></i>
                  </>
                )}
              </button>
            </form>

            <div className="auth-switch">
              <span>Don't have an account?</span>

              <Link to="/signup">Sign Up</Link>
            </div>

            <Link to="/" className="auth-back-shop">
              <i className="fa fa-arrow-left"></i>
              Back to Store
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
