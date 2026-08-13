import React from "react";

import { Link } from "react-router-dom";

function Name() {
  const name = sessionStorage.getItem("name_user") || "Account";

  const firstName = name.trim().split(/\s+/).pop();

  return (
    <div className="header-user">
      <div className="header-user-avatar">{name.charAt(0).toUpperCase()}</div>

      <div className="header-user-info">
        <span>Hello</span>

        <Link to="/history">{firstName}</Link>
      </div>
    </div>
  );
}

export default Name;
