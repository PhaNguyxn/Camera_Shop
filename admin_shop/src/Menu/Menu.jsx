import React, { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import feather from "feather-icons";

const menuItems = [
  { to: "/", label: "Tổng quan", icon: "grid", exact: true },
  { to: "/users", label: "Người dùng", icon: "users" },
  { to: "/products", label: "Sản phẩm", icon: "camera" },
  { to: "/categories", label: "Danh mục", icon: "layers" },
  { to: "/history", label: "Đơn hàng", icon: "shopping-bag" },
];

function Menu() {
  const location = useLocation();

  useEffect(() => {
    feather.replace();
  }, [location.pathname]);

  return (
    <aside className="left-sidebar" data-sidebarbg="skin6">
      <div className="scroll-sidebar" data-sidebarbg="skin6">
        <nav className="sidebar-nav" aria-label="Menu quản trị">
          <ul id="sidebarnav">
            <li className="nav-small-cap">
              <span className="hide-menu">QUẢN TRỊ</span>
            </li>

            {menuItems.map((item) => (
              <li className="sidebar-item" key={item.to}>
                <NavLink
                  exact={item.exact}
                  to={item.to}
                  className="sidebar-link"
                  activeClassName="active"
                >
                  <i
                    data-feather={item.icon}
                    className="feather-icon"
                    aria-hidden="true"
                  />
                  <span className="hide-menu">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}

export default Menu;
