import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Icon } from "../components/AdminUI";

const items = [
  { to: "/", label: "Tổng quan", icon: "dashboard", exact: true },
  { to: "/products", label: "Sản phẩm", icon: "camera" },
  { to: "/categories", label: "Danh mục", icon: "layers" },
  { to: "/history", label: "Đơn hàng", icon: "bag" },
  { to: "/users", label: "Người dùng", icon: "users" },
];

export default function Menu({ open, onClose }) {
  return (
    <aside id="admin-sidebar" className={`ad-sidebar ${open ? "is-open" : ""}`}>
      <Link className="ad-brand" to="/" onClick={onClose}>
        <span className="ad-brand-mark">
          <Icon name="camera" size={22} />
        </span>

        <span>
          <strong>CAMERA SHOP</strong>
          <small>ADMIN WORKSPACE</small>
        </span>
      </Link>

      <button
        type="button"
        className="ad-btn ad-sidebar-close"
        onClick={onClose}
      >
        <Icon name="close" size={16} />
        Đóng menu
      </button>

      <div className="ad-nav-label">QUẢN LÝ CỬA HÀNG</div>

      <nav className="ad-nav" aria-label="Menu quản trị">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            exact={item.exact}
            className="ad-nav-link"
            activeClassName="active"
            onClick={onClose}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
