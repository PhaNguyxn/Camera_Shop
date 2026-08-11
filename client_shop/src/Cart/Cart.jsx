import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Redirect } from "react-router-dom";

import alertify from "alertifyjs";
import queryString from "query-string";

import { deleteCart, updateCart } from "../Redux/Action/ActionCart";
import ListCart from "./Component/ListCart";
import CartAPI from "../API/CartAPI";

const calculateTotal = (carts = []) => {
  let subTotal = 0;

  carts.forEach((value) => {
    const price = value.priceProduct
      .toString()
      .replace(/\./g, "")
      .replace(" đ", "");

    subTotal += parseInt(price, 10) * parseInt(value.count, 10);
  });

  return subTotal;
};

function Cart() {

  const listCart = useSelector((state) => state.Cart.listCart);

  const [cart, setCart] = useState([]);

  const [total, setTotal] = useState(0);

  const [redirect, setRedirect] = useState(false);

  const dispatch = useDispatch();

  const idUser = sessionStorage.getItem("id_user");


  const fetchCartFromAPI = useCallback(async () => {
    if (!idUser) {
      return;
    }

    try {
      const params = {
        idUser,
      };

      const query = "?" + queryString.stringify(params);

      const response = await CartAPI.getCarts(query);

      const carts = Array.isArray(response) ? response : [];

      setCart(carts);

      setTotal(calculateTotal(carts));
    } catch (error) {
      console.error("Load cart error:", error);

      setCart([]);
      setTotal(0);
    }
  }, [idUser]);

  useEffect(() => {

    if (idUser) {
      fetchCartFromAPI();

      return;
    }

    const carts = Array.isArray(listCart) ? listCart : [];

    setCart(carts);

    setTotal(calculateTotal(carts));
  }, [idUser, listCart, fetchCartFromAPI]);

  const onDeleteCart = async (getUser, getProduct) => {
    if (idUser) {
      try {
        const params = {
          idUser: getUser,
          idProduct: getProduct,
        };

        const query = "?" + queryString.stringify(params);

        await CartAPI.deleteToCart(query);

        await fetchCartFromAPI();

        alertify.set("notifier", "position", "bottom-left");

        alertify.success("Bạn đã xóa sản phẩm thành công!");
      } catch (error) {
        console.error("Delete cart error:", error);

        alertify.set("notifier", "position", "bottom-left");

        alertify.error("Xóa sản phẩm thất bại!");
      }

      return;
    }

    const data = {
      idProduct: getProduct,
      idUser: getUser,
    };

    const action = deleteCart(data);

    dispatch(action);

    alertify.set("notifier", "position", "bottom-left");

    alertify.success("Bạn đã xóa sản phẩm thành công!");
  };

  const onUpdateCount = async (getUser, getProduct, getCount) => {
    if (idUser) {
      try {
        const params = {
          idUser: getUser,
          idProduct: getProduct,
          count: getCount,
        };

        const query = "?" + queryString.stringify(params);

        await CartAPI.putToCart(query);

        await fetchCartFromAPI();

        alertify.set("notifier", "position", "bottom-left");

        alertify.success("Bạn đã cập nhật giỏ hàng thành công!");
      } catch (error) {
        console.error("Update cart error:", error);

        alertify.set("notifier", "position", "bottom-left");

        alertify.error("Cập nhật giỏ hàng thất bại!");
      }

      return;
    }

    const data = {
      idProduct: getProduct,
      idUser: getUser,
      count: getCount,
    };

    const action = updateCart(data);

    dispatch(action);

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

  return (
    <div className="container">
      {/* HEADER */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row px-4 px-lg-5 py-lg-4 align-items-center">
            <div className="col-lg-6">
              <h1 className="h2 text-uppercase mb-0">Cart</h1>
            </div>

            <div className="col-lg-6 text-lg-right">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-lg-end mb-0 px-0">
                  <li className="breadcrumb-item active" aria-current="page">
                    Cart
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>

      {/* CART */}
      <section className="py-5">
        <h2 className="h5 text-uppercase mb-4">Shopping cart</h2>

        <div className="row">
          <div className="col-lg-8 mb-4 mb-lg-0">
            <ListCart
              listCart={cart}
              onDeleteCart={onDeleteCart}
              onUpdateCount={onUpdateCount}
            />

            <div className="bg-light px-4 py-3">
              <div className="row align-items-center text-center">
                <div className="col-md-6 mb-3 mb-md-0 text-md-left">
                  <Link
                    className="btn btn-link p-0 text-dark btn-sm"
                    to="/shop"
                  >
                    <i className="fas fa-long-arrow-alt-left mr-2"></i>
                    Continue shopping
                  </Link>
                </div>

                <div className="col-md-6 text-md-right">
                  {redirect && <Redirect to="/checkout" />}

                  <button
                    type="button"
                    className="btn btn-outline-dark btn-sm"
                    onClick={onCheckout}
                  >
                    Proceed to checkout
                    <i className="fas fa-long-arrow-alt-right ml-2"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* TOTAL */}
          <div className="col-lg-4">
            <div className="card border-0 rounded-0 p-lg-4 bg-light">
              <div className="card-body">
                <h5 className="text-uppercase mb-4">Cart total</h5>

                <ul className="list-unstyled mb-0">
                  <li className="d-flex align-items-center justify-content-between">
                    <strong className="text-uppercase small font-weight-bold">
                      Subtotal
                    </strong>

                    <span className="text-muted small">
                      {total.toLocaleString("vi-VN")}đ
                    </span>
                  </li>

                  <li className="border-bottom my-2"></li>

                  <li className="d-flex align-items-center justify-content-between mb-4">
                    <strong className="text-uppercase small font-weight-bold">
                      Total
                    </strong>

                    <span>{total.toLocaleString("vi-VN")}đ</span>
                  </li>

                  <li>
                    <form onSubmit={(e) => e.preventDefault()}>
                      <div className="form-group mb-0">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Enter your coupon"
                        />

                        <button
                          className="btn btn-dark btn-sm btn-block"
                          type="submit"
                        >
                          <i className="fas fa-gift mr-2"></i>
                          Apply coupon
                        </button>
                      </div>
                    </form>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Cart;
