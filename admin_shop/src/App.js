import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import Header from "./Header/Header";
import History from "./History/History";
import Home from "./Home/Home";
import Menu from "./Menu/Menu";
import Products from "./Products/Products";
import Users from "./Users/Users";
import ViewEdit from "./Products/Component/ViewEdit";
import Categories from "./Categories/Categories";
import ViewCategories from "./Categories/ViewCategories";
import ViewHistory from "./History/ViewHistory";
import Login from "./Authentication/Login";

function Layout() {
  const role = sessionStorage.getItem("role");
  const idUser = sessionStorage.getItem("id_user");
  const token = sessionStorage.getItem("token");

  if (!token || !idUser || role !== "admin") {
    return <Redirect to="/login" />;
  }

  return (
    <div
      id="main-wrapper"
      data-theme="light"
      data-layout="vertical"
      data-navbarbg="skin6"
      data-sidebartype="full"
      data-sidebar-position="fixed"
      data-header-position="fixed"
      data-boxed-layout="full"
    >
      <Header />
      <Menu />

      <Switch>
        <Route exact path="/" component={Home} />

        <Route path="/users" component={Users} />

        <Route path="/products/view-edit" component={ViewEdit} />
        <Route exact path="/products" component={Products} />

        <Route exact path="/categories" component={Categories} />
        <Route path="/categories/view-edit" component={ViewCategories} />

        <Route exact path="/history" component={History} />
        <Route path="/history/view" component={ViewHistory} />

        <Redirect to="/" />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/login" component={Login} />

        <Route path="/" component={Layout} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
