import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { Link, Redirect } from "react-router-dom";

import alertify from "alertifyjs";
import queryString from "query-string";

import { deleteCart, updateCart } from "../Redux/Action/ActionCart";

import ListCart from "./Component/ListCart";

import CartAPI from "../API/CartAPI";

import "./Cart.css";

const parsePrice = (price) => {
  return Number(String(price || "").replace(/\D/g, "")) || 0;
};

const calculateTotal = (carts = []) => {
  return carts.reduce(
    (total, item) =>
      total + parsePrice(item.priceProduct) * Number(item.count || 0),
    0,
  );
};

function Cart() {
  const dispatch = useDispatch();

  const reduxCart = useSelector((state) => state.Cart.listCart);

  const idUser = sessionStorage.getItem("id_user");

  const [cart, setCart] = useState([]);

  const [loading, setLoading] = useState(true);

  const [redirect, setRedirect] = useState(false);


  const fetchCartFromAPI = useCallback(async () => {
    if (!idUser) {
      setLoading(false);

      return;
    }

    try {
      setLoading(true);

      const params = {
        idUser,
      };

      const query = "?" + queryString.stringify(params);

      const response = await CartAPI.getCarts(query);

      setCart(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Load cart error:", error);

      setCart([]);
    } finally {
      setLoading(false);
    }
  }, [idUser]);

  useEffect(() => {
    if (idUser) {
      fetchCartFromAPI();

      return;
    }

    setCart(Array.isArray(reduxCart) ? reduxCart : []);

    setLoading(false);
  }, [idUser, reduxCart, fetchCartFromAPI]);


  const total = useMemo(() => calculateTotal(cart), [cart]);

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + (Number(item.count) || 0), 0),
    [cart],
  );


  const onDeleteCart = async (getUser, getProduct) => {

    if (idUser) {
      try {
        const params = {
          idUser: getUser,
          idProduct: getProduct,
        };

        const query = "?" + queryString.stringify(params);

        await CartAPI.deleteToCart(query);

        setCart((currentCart) =>
          currentCart.filter(
            (item) => String(item.idProduct) !== String(getProduct),
          ),
        );

        window.dispatchEvent(new Event("cartUpdated"));

        alertify.set("notifier", "position", "bottom-left");

        alertify.success("Bạn đã xóa sản phẩm thành công!");
      } catch (error) {
        console.error("Delete cart error:", error);

        alertify.set("notifier", "position", "bottom-left");

        alertify.error("Xóa sản phẩm thất bại!");
      }

      return;
    }

    dispatch(
      deleteCart({
        idProduct: getProduct,
        idUser: getUser,
      }),
    );

    setCart((currentCart) =>
      currentCart.filter(
        (item) => String(item.idProduct) !== String(getProduct),
      ),
    );

    window.dispatchEvent(new Event("cartUpdated"));

    alertify.set("notifier", "position", "bottom-left");

    alertify.success("Bạn đã xóa sản phẩm thành công!");
  };


  const onUpdateCount = async (getUser, getProduct, getCount) => {
    const newCount = Number(getCount);

    if (newCount < 1) {
      return;
    }

    if (idUser) {
      try {
        const params = {
          idUser: getUser,
          idProduct: getProduct,
          count: newCount,
        };

        const query = "?" + queryString.stringify(params);

        await CartAPI.putToCart(query);

        setCart((currentCart) =>
          currentCart.map((item) =>
            String(item.idProduct) === String(getProduct)
              ? {
                  ...item,
                  count: newCount,
                }
              : item,
          ),
        );

        window.dispatchEvent(new Event("cartUpdated"));

        alertify.set("notifier", "position", "bottom-left");

        alertify.success("Bạn đã cập nhật giỏ hàng thành công!");
      } catch (error) {
        console.error("Update cart error:", error);

        alertify.set("notifier", "position", "bottom-left");

        alertify.error("Cập nhật giỏ hàng thất bại!");
      }

      return;
    }

    dispatch(
      updateCart({
        idProduct: getProduct,

        idUser: getUser,

        count: newCount,
      }),
    );

    setCart((currentCart) =>
      currentCart.map((item) =>
        String(item.idProduct) === String(getProduct)
          ? {
              ...item,
              count: newCount,
            }
          : item,
      ),
    );

    window.dispatchEvent(new Event("cartUpdated"));

    alertify.set("notifier", "position", "bottom-left");

    alertify.success("Bạn đã cập nhật giỏ hàng thành công!");
  };


  const onCheckout = () => {
    if (!idUser) {
      alertify.set("notifier", "position", "bottom-left");

      alertify.error("Vui lòng đăng nhập trước khi thanh toán!");

      return;
    }

    if (cart.length === 0) {
      alertify.set("notifier", "position", "bottom-left");

      alertify.error("Giỏ hàng đang trống!");

      return;
    }

    setRedirect(true);
  };

  if (redirect) {
    return <Redirect to="/checkout" />;
  }

  return (
    <main className="cart-page">

      <section className="cart-heading">
        <div className="shop-container">
          <div className="cart-breadcrumb">
            <Link to="/">Home</Link>

            <i className="fas fa-chevron-right" />

            <span>Cart</span>
          </div>

          <h1>Shopping Cart</h1>

          <p>Review your items before proceeding to checkout.</p>
        </div>
      </section>

      <section className="cart-content">
        <div className="shop-container">
          {loading ? (
            <div className="cart-loading">
              <div className="cart-spinner" />

              <p>Loading cart...</p>
            </div>
          ) : cart.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">
                <i className="fas fa-shopping-bag" />
              </div>

              <h2>Your cart is empty</h2>

              <p>
                Explore our camera collection and add your favorite products.
              </p>

              <Link to="/shop" className="shop-btn shop-btn-primary">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="cart-layout">

              <div className="cart-products">
                <div className="cart-products-header">
                  <div>
                    <h2>Your Items</h2>

                    <span>
                      {totalItems} {totalItems === 1 ? "item" : "items"}
                    </span>
                  </div>

                  <Link to="/shop" className="cart-continue-link">
                    <i className="fas fa-arrow-left" />
                    Continue Shopping
                  </Link>
                </div>

                <ListCart
                  listCart={cart}
                  onDeleteCart={onDeleteCart}
                  onUpdateCount={onUpdateCount}
                />
              </div>


              <aside className="cart-summary">
                <span className="cart-summary-label">Order summary</span>

                <h2>Cart Total</h2>

                <div className="cart-summary-row">
                  <span>Items</span>

                  <strong>{totalItems}</strong>
                </div>

                <div className="cart-summary-row">
                  <span>Subtotal</span>

                  <strong>
                    {total.toLocaleString("vi-VN")}
                    {" ₫"}
                  </strong>
                </div>

                <div className="cart-summary-row">
                  <span>Shipping</span>

                  <strong className="cart-free">Free</strong>
                </div>

                <div className="cart-summary-divider" />

                <div className="cart-summary-total">
                  <span>Total</span>

                  <strong>
                    {total.toLocaleString("vi-VN")}
                    {" ₫"}
                  </strong>
                </div>

                <button
                  type="button"
                  className="cart-checkout-button"
                  onClick={onCheckout}
                >
                  Proceed to Checkout
                  <i className="fas fa-arrow-right" />
                </button>

                <div className="cart-secure">
                  <i className="fas fa-lock" />

                  <span>Secure checkout</span>
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Cart;
