import React from "react";

import { Link } from "react-router-dom";

import { useDispatch } from "react-redux";

import { deleteSession } from "../Redux/Action/ActionSession";

function LoginLink() {
  const dispatch = useDispatch();

  const handleLogout = () => {

    sessionStorage.removeItem("id_user");

    sessionStorage.removeItem("name_user");

    dispatch(deleteSession(""));

    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <Link to="/signin" className="header-account-action" onClick={handleLogout}>
      <i className="fas fa-sign-out-alt" />

      <span>Logout</span>
    </Link>
  );
}

export default LoginLink;
