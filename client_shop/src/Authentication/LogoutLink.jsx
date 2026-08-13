import React from "react";

import { Link } from "react-router-dom";

function LogoutLink() {
  return (
    <Link to="/signin" className="header-account-action">
      <i className="far fa-user" />

      <span>Sign In</span>
    </Link>
  );
}

export default LogoutLink;
