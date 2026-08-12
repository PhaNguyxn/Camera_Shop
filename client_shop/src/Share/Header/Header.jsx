import React, { useEffect, useState } from "react";

import { Link, useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { addUser } from "../../Redux/Action/ActionCart";

import { addSession } from "../../Redux/Action/ActionSession";

import LoginLink from "../../Authentication/LoginLink";
import LogoutLink from "../../Authentication/LogoutLink";
import Name from "../../Authentication/Name";

import "./Header.css";

function Header() {
  const dispatch = useDispatch();

  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  const idUser = useSelector((state) => state.Session.idUser);

  useEffect(() => {
    const savedUser = sessionStorage.getItem("id_user");

    if (savedUser) {
      dispatch(addSession(savedUser));
    } else {
      let tempId = sessionStorage.getItem("id_temp");

      if (!tempId) {
        tempId = "abc999";

        sessionStorage.setItem("id_temp", tempId);
      }

      dispatch(addUser(tempId));
    }
  }, [dispatch]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const isLoggedIn = Boolean(idUser);

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  return (
    <header className="shop-header">

      <div className="header-announcement">
        Free shipping on selected orders · Support available 24/7
      </div>

      <div className="header-container">

        <Link to="/" className="header-logo">
          <span className="header-logo-icon">
            <i className="fas fa-camera" />
          </span>

          <span>
            CAMERA
            <strong>SHOP</strong>
          </span>
        </Link>

        <nav className={`header-nav ${menuOpen ? "header-nav-open" : ""}`}>
          <Link
            to="/"
            className={`header-nav-link ${isActive("/") ? "active" : ""}`}
          >
            Home
          </Link>

          <Link
            to="/shop"
            className={`header-nav-link ${isActive("/shop") ? "active" : ""}`}
          >
            Shop
          </Link>

          <Link
            to="/history"
            className={`header-nav-link ${
              isActive("/history") ? "active" : ""
            }`}
          >
            Orders
          </Link>
        </nav>

        <div className="header-actions">
          <Link
            to="/shop"
            className="header-action"
            aria-label="Search products"
          >
            <i className="fas fa-search" />
          </Link>

          <Link
            to="/cart"
            className={`header-action ${isActive("/cart") ? "active" : ""}`}
            aria-label="Shopping cart"
          >
            <i className="fas fa-shopping-bag" />

            <span className="header-action-text">Cart</span>
          </Link>

          <div className="header-account">
            {isLoggedIn && <Name />}

            {isLoggedIn ? <LoginLink /> : <LogoutLink />}
          </div>

          <button
            type="button"
            className={`header-menu-button ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
