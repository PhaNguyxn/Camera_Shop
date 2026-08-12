import React from "react";

import { Link } from "react-router-dom";

import "./Footer.css";

function Footer() {
  return (
    <footer className="camera-footer">
      <div className="shop-container">
        <div className="camera-footer-main">

          <div className="camera-footer-brand">
            <Link to="/" className="camera-footer-logo">
              <span className="camera-footer-logo-icon">
                <i className="fas fa-camera" />
              </span>

              <span>
                CAMERA
                <strong>SHOP</strong>
              </span>
            </Link>

            <p>
              Discover cameras and photography gear for creators, travelers and
              professionals.
            </p>

            <div className="camera-footer-socials">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f" />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram" />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
              >
                <i className="fab fa-youtube" />
              </a>
            </div>
          </div>

          <div className="camera-footer-column">
            <h4>Shop</h4>

            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>

              <li>
                <Link to="/shop">Cameras</Link>
              </li>

              <li>
                <Link to="/cart">Shopping Cart</Link>
              </li>

              <li>
                <Link to="/history">My Orders</Link>
              </li>
            </ul>
          </div>


          <div className="camera-footer-column">
            <h4>Customer Care</h4>

            <ul className="camera-footer-info-list">
              <li>
                <i className="fas fa-shipping-fast" />
                Fast Delivery
              </li>

              <li>
                <i className="fas fa-shield-alt" />
                Genuine Products
              </li>

              <li>
                <i className="fas fa-lock" />
                Secure Shopping
              </li>

              <li>
                <i className="fas fa-headset" />
                Customer Support
              </li>
            </ul>
          </div>


          <div className="camera-footer-column">
            <h4>Contact</h4>

            <ul className="camera-footer-contact">
              <li>
                <i className="fas fa-map-marker-alt" />

                <span>Can Tho, Vietnam</span>
              </li>

              <li>
                <i className="fas fa-phone-alt" />

                <a href="tel:+84123456789">+84 123 456 789</a>
              </li>

              <li>
                <i className="fas fa-envelope" />

                <a href="mailto:support@camerashop.com">
                  support@camerashop.com
                </a>
              </li>

              <li>
                <i className="fas fa-clock" />

                <span>Mon - Sat: 8:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>
        </div>


        <div className="camera-footer-bottom">
          <p>© 2026 Camera Shop. All rights reserved.</p>

          <p>Made for photographers and creators.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
