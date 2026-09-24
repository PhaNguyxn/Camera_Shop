import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Route,
  Switch,
  Redirect,
  useLocation,
} from "react-router-dom";

import Header from "./Header/Header";
import Menu from "./Menu/Menu";
import Home from "./Home/Home";
import Users from "./Users/Users";
import Products from "./Products/Products";
import ViewEdit from "./Products/Component/ViewEdit";
import Categories from "./Categories/Categories";
import ViewCategories from "./Categories/ViewCategories";
import History from "./History/History";
import ViewHistory from "./History/ViewHistory";
import Login from "./Authentication/Login";

function Layout() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  const allowed =
    sessionStorage.getItem("token") &&
    sessionStorage.getItem("id_user") &&
    sessionStorage.getItem("role") === "admin";

  if (!allowed) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="ad-app">
      <Menu open={menuOpen} onClose={() => setMenuOpen(false)} />

      {menuOpen && (
        <button
          className="ad-mobile-overlay"
          type="button"
          aria-label="Đóng menu"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div className="ad-main">
        <Header
          menuOpen={menuOpen}
          onMenu={() => setMenuOpen((value) => !value)}
        />

        <main id="admin-content">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/users" component={Users} />

            <Route
              path="/products/view-edit"
              render={({ location: routeLocation }) => (
                <ViewEdit key={routeLocation.search} />
              )}
            />
            <Route exact path="/products" component={Products} />

            <Route
              path="/categories/view-edit"
              render={({ location: routeLocation }) => (
                <ViewCategories key={routeLocation.search} />
              )}
            />
            <Route exact path="/categories" component={Categories} />

            <Route path="/history/view" component={ViewHistory} />
            <Route exact path="/history" component={History} />

            <Redirect to="/" />
          </Switch>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route path="/" component={Layout} />
      </Switch>
    </BrowserRouter>
  );
}
