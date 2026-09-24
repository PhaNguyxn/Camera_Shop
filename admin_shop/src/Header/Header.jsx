import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import feather from "feather-icons";

function Header() {
  useEffect(() => {
    feather.replace();
  }, []);

  const onLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("id_user");
    sessionStorage.removeItem("name_user");
    sessionStorage.removeItem("role");

    window.location.href = "/login";
  };

  const adminName = sessionStorage.getItem("name_user") || "ADMIN";

  return (
    <header className="topbar" data-navbarbg="skin6">
      <nav className="navbar top-navbar navbar-expand-md">
        <div className="navbar-header" data-logobg="skin6">
          <button
            className="nav-toggler waves-effect waves-light d-block d-md-none border-0 bg-transparent"
            type="button"
            aria-label="Mở menu"
          >
            <i className="ti-menu ti-close" />
          </button>

          <div className="navbar-brand">
            <Link to="/">
              <span className="admin-brand-name">CAMERA SHOP</span>
            </Link>
          </div>

          <button
            className="topbartoggler d-block d-md-none waves-effect waves-light border-0 bg-transparent"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-label="Mở tài khoản"
          >
            <i className="ti-more" />
          </button>
        </div>

        <div className="navbar-collapse collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item dropdown">
              <button
                type="button"
                className="nav-link dropdown-toggle border-0 bg-transparent"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <span className="text-dark font-weight-medium">
                  Xin chào, {adminName}
                </span>
                <i data-feather="chevron-down" className="svg-icon ml-2" />
              </button>

              <div className="dropdown-menu dropdown-menu-right user-dd">
                <button
                  type="button"
                  className="dropdown-item border-0 bg-transparent w-100 text-left"
                  onClick={onLogout}
                >
                  <i data-feather="log-out" className="svg-icon mr-2" />
                  Đăng xuất
                </button>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Header;
