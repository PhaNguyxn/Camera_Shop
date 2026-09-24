import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Icon } from "../components/AdminUI";

const titles = {
  users: "Người dùng",
  products: "Sản phẩm",
  categories: "Danh mục",
  history: "Đơn hàng",
};

export default function Header({ onMenu, menuOpen }) {
  const history = useHistory();
  const location = useLocation();

  const section = location.pathname.split("/")[1];
  const title = titles[section] || "Tổng quan";
  const name = sessionStorage.getItem("name_user") || "Quản trị viên";

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const logout = () => {
    ["token", "id_user", "name_user", "role"].forEach((key) => {
      sessionStorage.removeItem(key);
    });

    history.replace("/login");
  };

  return (
    <header className="ad-topbar">
      <div className="ad-actions">
        <button
          type="button"
          className="ad-btn ad-mobile-menu"
          onClick={onMenu}
          aria-label="Mở menu"
          aria-expanded={menuOpen}
          aria-controls="admin-sidebar"
        >
          <Icon name="menu" />
        </button>

        <span className="ad-topbar-title">{title}</span>
      </div>

      <div className="ad-topbar-account">
        <span className="ad-avatar">{initials || "AD"}</span>

        <div className="ad-account-info">
          <div className="ad-account-name">{name}</div>
          <div className="ad-account-role">Quản trị viên</div>
        </div>

        <button type="button" className="ad-btn ad-btn-small" onClick={logout}>
          <Icon name="logout" size={16} />
          Đăng xuất
        </button>
      </div>
    </header>
  );
}
