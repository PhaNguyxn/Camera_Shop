import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import UserAPI from "../API/UserAPI";
import CartAPI from "../API/CartAPI";
import queryString from "query-string";

import { useDispatch, useSelector } from "react-redux";
import { addSession } from "../Redux/Action/ActionSession";

import "./Auth.css";

function SignIn() {
  const history = useHistory();
  const dispatch = useDispatch();

  const listCart = useSelector((state) => state.Cart.listCart);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorLogin, setErrorLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const syncCartToServer = async (idUser) => {
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

    setErrorLogin(false);

    if (!email || !password) {
      setErrorLogin(true);
      return;
    }

    try {
      setLoading(true);

      const body = {
        email: email.trim(),
        password: password,
      };

      const response = await UserAPI.postLogin(body);

      console.log("LOGIN RESPONSE:", response);

      if (!response || !response.user) {
        setErrorLogin(true);
        return;
      }

      const user = response.user;

      sessionStorage.setItem("id_user", user._id);

      sessionStorage.setItem("name_user", user.fullname);

      sessionStorage.setItem("role", user.role);

      dispatch(addSession(user._id));

      if (
        user.role === "customer" &&
        Array.isArray(listCart) &&
        listCart.length > 0
      ) {
        await syncCartToServer(user._id);
      }

      if (user.role === "admin") {
        window.location.href =
          process.env.REACT_APP_ADMIN_URL || "http://localhost:3001";

        return;
      }

      history.push("/");
    } catch (error) {
      console.error("Login error:", error);

      setErrorLogin(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="limiter">
      <div className="container-login100">
        <div className="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-50">
          <span className="login100-form-title p-b-33">Sign In</span>

          <div className="d-flex justify-content-center pb-4">
            {errorLogin && (
              <span className="text-danger">
                * Email hoặc mật khẩu không đúng
              </span>
            )}
          </div>

          <form onSubmit={onSubmit}>
            <div className="wrap-input100 validate-input">
              <input
                className="input100"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="wrap-input100 rs1 validate-input">
              <input
                className="input100"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="container-login100-form-btn m-t-20">
              <button
                type="submit"
                className="login100-form-btn"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>

          <div className="text-center p-t-45 p-b-4">
            <span className="txt1">Create an account?</span>
            &nbsp;
            <Link to="/signup" className="txt2 hov1">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
