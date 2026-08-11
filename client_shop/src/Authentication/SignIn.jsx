import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import queryString from "query-string";

import UserAPI from "../API/UserAPI";
import CartAPI from "../API/CartAPI";

import { addSession } from "../Redux/Action/ActionSession";

import "./Auth.css";

function SignIn() {
  
  const listCart = useSelector((state) => state.Cart.listCart);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorEmail, setErrorEmail] = useState(false);
  const [emailRegex, setEmailRegex] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [errorLogin, setErrorLogin] = useState(false);

  const history = useHistory();
  const dispatch = useDispatch();

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

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

  const onSubmit = async () => {
    setErrorEmail(false);
    setErrorPassword(false);
    setEmailRegex(false);
    setErrorLogin(false);

    if (!email) {
      setErrorEmail(true);
      return;
    }

    if (!validateEmail(email)) {
      setEmailRegex(true);
      return;
    }

    if (!password) {
      setErrorPassword(true);
      return;
    }

    try {
      const body = {
        email,
        password,
      };

      const res = await UserAPI.postLogin(body);

      if (res && res._id) {
        const idUser = res._id;

        sessionStorage.setItem("id_user", idUser);

        sessionStorage.setItem("name_user", res.fullname);

        const action = addSession(idUser);

        dispatch(action);

        if (Array.isArray(listCart) && listCart.length > 0) {
          await syncCartToServer(idUser);
        }


        history.push("/");
      }

      else if (res === "false") {
        setErrorLogin(true);
      } else {
        setErrorLogin(true);
      }
    } catch (error) {
      console.error("Login error:", error);

      setErrorLogin(true);
    }
  };

  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(String(email).toLowerCase());
  }

  return (
    <div className="limiter">
      <div className="container-login100">
        <div className="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-50">
          <span className="login100-form-title p-b-33">Sign In</span>

          <div className="d-flex justify-content-center pb-5">
            {emailRegex && (
              <span className="text-danger">* Incorrect Email Format</span>
            )}

            {errorEmail && (
              <span className="text-danger">* Please Check Your Email</span>
            )}

            {errorPassword && (
              <span className="text-danger">* Please Check Your Password</span>
            )}

            {errorLogin && (
              <span className="text-danger">
                * Please Check Your Email or Password
              </span>
            )}
          </div>

          <div className="wrap-input100 validate-input">
            <input
              className="input100"
              type="text"
              placeholder="Email"
              value={email}
              onChange={onChangeEmail}
            />
          </div>

          <div className="wrap-input100 rs1 validate-input">
            <input
              className="input100"
              type="password"
              placeholder="Password"
              value={password}
              onChange={onChangePassword}
            />
          </div>

          <div className="container-login100-form-btn m-t-20">
            <button
              type="button"
              className="login100-form-btn"
              onClick={onSubmit}
            >
              Sign in
            </button>
          </div>

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
