import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserAPI from "../API/UserAPI";

function Name() {
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await UserAPI.getDetailData(
        sessionStorage.getItem("id_user"),
      );

      setName(response);
    };

    fetchData();
  }, []);

  return (
    <li className="nav-item dropdown">
      <button
        type="button"
        className="nav-link dropdown-toggle"
        style={{
          cursor: "pointer",
          border: "none",
          background: "transparent",
        }}
        id="pagesDropdown"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <i className="fas fa-user-alt mr-1 text-gray"></i>

        {name?.fullname}
      </button>

      <div className="dropdown-menu mt-3" aria-labelledby="pagesDropdown">
        <Link className="dropdown-item border-0 transition-link" to="/history">
          History
        </Link>
      </div>
    </li>
  );
}

export default Name;
