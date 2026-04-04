import { BrowserRouter, Route, Switch, useLocation } from "react-router-dom";
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
import Register from "./Authentication/Register";

function Layout() {
  const location = useLocation();

  // các trang không cần layout
  const hideLayout = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      {!hideLayout && (
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
            <Route exact path='/' component={Home} />
            <Route path='/users' component={Users} />

            <Route exact path='/products' component={Products} />
            <Route path='/products/view-edit' component={ViewEdit} />

            <Route exact path='/categories' component={Categories} />
            <Route path='/categories/view-edit' component={ViewCategories} />

            <Route exact path='/history' component={History} />
            <Route path='/history/view' component={ViewHistory} />
          </Switch>
        </div>
      )}

      {hideLayout && (
        <Switch>
          <Route path='/login' component={Login} />
          <Route path='/register' component={Register} />
        </Switch>
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;