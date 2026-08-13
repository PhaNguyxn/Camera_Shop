import React, { useCallback, useEffect, useState } from "react";

import { Link, useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import queryString from "query-string";

import CartAPI from "../../API/CartAPI";

import { addUser } from "../../Redux/Action/ActionCart";

import { addSession } from "../../Redux/Action/ActionSession";

import LoginLink from "../../Authentication/LoginLink";
import LogoutLink from "../../Authentication/LogoutLink";
import Name from "../../Authentication/Name";

import { getWishlist } from "../../utils/wishlist";

import "./Header.css";

function Header() {
  const dispatch = useDispatch();

  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  const [cartCount, setCartCount] = useState(0);

  const [wishlistCount, setWishlistCount] = useState(0);

  const idUser = useSelector((state) => state.Session.idUser);

  const guestCart = useSelector((state) => state.Cart.listCart);

  

  useEffect(() => {
    const savedUser = sessionStorage.getItem("id_user");

    if (savedUser) {
      dispatch(addSession(savedUser));
    } else {
      let tempId = sessionStorage.getItem("id_temp");

      if (!tempId) {
        tempId = `guest_${Date.now()}`;

        sessionStorage.setItem("id_temp", tempId);
      }

      dispatch(addUser(tempId));
    }
  }, [dispatch]);

  const calculateCartCount = (items) => {
    if (!Array.isArray(items)) {
      return 0;
    }

    return items.reduce((total, item) => total + (Number(item.count) || 0), 0);
  };

  const refreshCartCount = useCallback(async () => {
    const sessionUserId = sessionStorage.getItem("id_user");

    if (sessionUserId) {
      try {
        const params = {
          idUser: sessionUserId,
        };

        const query = "?" + queryString.stringify(params);

        const response = await CartAPI.getCarts(query);

        const count = calculateCartCount(response);

        setCartCount(count);
      } catch (error) {
        console.error("Load cart count error:", error);

        setCartCount(0);
      }

      return;
    }

    const count = calculateCartCount(guestCart);

    setCartCount(count);
  }, [guestCart]);

  useEffect(() => {
    refreshCartCount();
  }, [refreshCartCount]);

  useEffect(() => {
    const handleCartUpdate = () => {
      refreshCartCount();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [refreshCartCount]);


  const refreshWishlistCount = useCallback(() => {
    setWishlistCount(getWishlist().length);
  }, []);

  useEffect(() => {
    refreshWishlistCount();

    const handleWishlist = () => {
      refreshWishlistCount();
    };

    const handleStorage = () => {
      refreshWishlistCount();
    };

    window.addEventListener("wishlistUpdated", handleWishlist);

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("wishlistUpdated", handleWishlist);

      window.removeEventListener("storage", handleStorage);
    };
  }, [refreshWishlistCount]);


  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  const isLoggedIn = Boolean(idUser || sessionStorage.getItem("id_user"));


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

          <Link to="/shop" className="header-action" aria-label="Search">
            <i className="fas fa-search" />
          </Link>


          <Link
            to="/wishlist"
            className={`header-action header-action-with-badge ${
              isActive("/wishlist") ? "active" : ""
            }`}
            aria-label="Wishlist"
          >
            <i className="far fa-heart" />

            {wishlistCount > 0 && (
              <span className="header-count-badge">
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </span>
            )}
          </Link>


          <Link
            to="/cart"
            className={`header-action header-action-with-badge ${
              isActive("/cart") ? "active" : ""
            }`}
            aria-label="Shopping cart"
          >
            <i className="fas fa-shopping-bag" />

            {cartCount > 0 && (
              <span className="header-count-badge">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}

            <span className="header-action-text">Cart</span>
          </Link>


          <div className="header-account">
            {isLoggedIn && <Name />}

            {isLoggedIn ? <LoginLink /> : <LogoutLink />}
          </div>


          <button
            type="button"
            className={`header-menu-button ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen((value) => !value)}
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
