import React, { useEffect, useMemo, useState } from "react";

import { Link, useHistory } from "react-router-dom";

import queryString from "query-string";
import alertify from "alertifyjs";

import CartAPI from "../API/CartAPI";
import HistoryAPI from "../API/HistoryAPI";

import "./Checkout.css";

const parsePrice = (price) => {
  if (price === null || price === undefined) {
    return 0;
  }

  return Number(String(price).replace(/\D/g, "")) || 0;
};

const calculateTotal = (carts = []) => {
  return carts.reduce(
    (total, item) =>
      total + parsePrice(item.priceProduct) * (Number(item.count) || 0),
    0,
  );
};

function Checkout() {
  const history = useHistory();

  const [carts, setCarts] = useState([]);

  const [loadingCart, setLoadingCart] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [success, setSuccess] = useState(false);

  const [fullname, setFullname] = useState("");

  const [email, setEmail] = useState("");

  const [phone, setPhone] = useState("");

  const [address, setAddress] = useState("");

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCart = async () => {
      const idUser = sessionStorage.getItem("id_user");

      if (!idUser) {
        alertify.set("notifier", "position", "bottom-left");

        alertify.error("Vui lòng đăng nhập trước khi thanh toán!");

        history.replace("/cart");

        return;
      }

      try {
        setLoadingCart(true);

        const params = {
          idUser,
        };

        const query = "?" + queryString.stringify(params);

        const response = await CartAPI.getCarts(query);

        const cartData = Array.isArray(response) ? response : [];

        if (cartData.length === 0) {
          alertify.set("notifier", "position", "bottom-left");

          alertify.error("Giỏ hàng của bạn đang trống!");

          history.replace("/cart");

          return;
        }

        setCarts(cartData);
      } catch (error) {
        console.error("Load cart error:", error);

        alertify.set("notifier", "position", "bottom-left");

        alertify.error("Không thể tải giỏ hàng!");
      } finally {
        setLoadingCart(false);
      }
    };

    fetchCart();
  }, [history]);


  const total = useMemo(() => calculateTotal(carts), [carts]);

  const totalItems = useMemo(
    () => carts.reduce((sum, item) => sum + (Number(item.count) || 0), 0),
    [carts],
  );


  const validateEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const validatePhone = (value) => {
    const normalized = value.replace(/\s/g, "");

    return /^[0-9+]{9,15}$/.test(normalized);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!fullname.trim()) {
      newErrors.fullname = "Full name is required.";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!validateEmail(email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!validatePhone(phone.trim())) {
      newErrors.phone = "Please enter a valid phone number.";
    }

    if (!address.trim()) {
      newErrors.address = "Delivery address is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  const handleInput = (setter, field) => (event) => {
    setter(event.target.value);

    if (errors[field]) {
      setErrors((current) => ({
        ...current,
        [field]: "",
      }));
    }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      alertify.set("notifier", "position", "bottom-left");

      alertify.error("Vui lòng kiểm tra lại thông tin đặt hàng!");

      return;
    }

    if (carts.length === 0) {
      alertify.set("notifier", "position", "bottom-left");

      alertify.error("Giỏ hàng của bạn đang trống!");

      return;
    }

    const idUser = sessionStorage.getItem("id_user");

    if (!idUser) {
      alertify.set("notifier", "position", "bottom-left");

      alertify.error("Vui lòng đăng nhập trước khi đặt hàng!");

      history.push("/signin");

      return;
    }

    const data = {
      idUser,

      fullname: fullname.trim(),

      email: email.trim(),

      phone: phone.trim(),

      address: address.trim(),

      total,

      cart: [...carts],
    };

    try {
      setSubmitting(true);

      await HistoryAPI.postHistory(data);

      const params = {
        idUser,
      };

      const query = "?" + queryString.stringify(params);

      await CartAPI.deleteToCart(query);

      setCarts([]);

      window.dispatchEvent(new Event("cartUpdated"));

      setSuccess(true);

      alertify.set("notifier", "position", "bottom-left");

      alertify.success("Đặt hàng thành công!");
    } catch (error) {
      console.error("Place order error:", error);

      alertify.set("notifier", "position", "bottom-left");

      alertify.error("Đặt hàng thất bại, vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
  };


  if (loadingCart) {
    return (
      <main className="checkout-page">
        <div className="checkout-loading">
          <div className="checkout-spinner" />

          <p>Loading checkout...</p>
        </div>
      </main>
    );
  }


  if (success) {
    return (
      <main className="checkout-page">
        <section className="checkout-success-section">
          <div className="shop-container">
            <div className="checkout-success">
              <div className="checkout-success-icon">
                <i className="fas fa-check" />
              </div>

              <span className="section-eyebrow">Order completed</span>

              <h1>Thank you for your order.</h1>

              <p>
                Your order has been placed successfully. You can view the latest
                status in your order history.
              </p>

              <div className="checkout-success-actions">
                <Link to="/history" className="shop-btn shop-btn-primary">
                  View Orders
                </Link>

                <Link to="/shop" className="shop-btn shop-btn-outline">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="checkout-page">

      <section className="checkout-heading">
        <div className="shop-container">
          <div className="checkout-breadcrumb">
            <Link to="/">Home</Link>

            <i className="fas fa-chevron-right" />

            <Link to="/cart">Cart</Link>

            <i className="fas fa-chevron-right" />

            <span>Checkout</span>
          </div>

          <h1>Checkout</h1>

          <p>Complete your delivery information and review your order.</p>
        </div>
      </section>


      <section className="checkout-content">
        <div className="shop-container">
          <div className="checkout-layout">

            <div className="checkout-form-section">
              <div className="checkout-section-heading">
                <span className="checkout-step">01</span>

                <div>
                  <h2>Delivery Information</h2>

                  <p>Enter the information required to deliver your order.</p>
                </div>
              </div>

              <form className="checkout-form" onSubmit={handleSubmit}>

                <div className="checkout-form-group">
                  <label htmlFor="fullname">Full Name</label>

                  <div
                    className={`checkout-input ${
                      errors.fullname ? "error" : ""
                    }`}
                  >
                    <i className="far fa-user" />

                    <input
                      id="fullname"
                      type="text"
                      value={fullname}
                      onChange={handleInput(setFullname, "fullname")}
                      placeholder="Enter your full name"
                      autoComplete="name"
                    />
                  </div>

                  {errors.fullname && (
                    <span className="checkout-error">{errors.fullname}</span>
                  )}
                </div>


                <div className="checkout-form-group">
                  <label htmlFor="email">Email Address</label>

                  <div
                    className={`checkout-input ${errors.email ? "error" : ""}`}
                  >
                    <i className="far fa-envelope" />

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={handleInput(setEmail, "email")}
                      placeholder="Enter your email"
                      autoComplete="email"
                    />
                  </div>

                  {errors.email && (
                    <span className="checkout-error">{errors.email}</span>
                  )}
                </div>


                <div className="checkout-form-group">
                  <label htmlFor="phone">Phone Number</label>

                  <div
                    className={`checkout-input ${errors.phone ? "error" : ""}`}
                  >
                    <i className="fas fa-phone-alt" />

                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={handleInput(setPhone, "phone")}
                      placeholder="Enter your phone number"
                      autoComplete="tel"
                    />
                  </div>

                  {errors.phone && (
                    <span className="checkout-error">{errors.phone}</span>
                  )}
                </div>


                <div className="checkout-form-group checkout-form-group-full">
                  <label htmlFor="address">Delivery Address</label>

                  <div
                    className={`checkout-input ${
                      errors.address ? "error" : ""
                    }`}
                  >
                    <i className="fas fa-map-marker-alt" />

                    <input
                      id="address"
                      type="text"
                      value={address}
                      onChange={handleInput(setAddress, "address")}
                      placeholder="Enter your delivery address"
                      autoComplete="street-address"
                    />
                  </div>

                  {errors.address && (
                    <span className="checkout-error">{errors.address}</span>
                  )}
                </div>


                <div className="checkout-payment">
                  <div className="checkout-payment-title">
                    <span className="checkout-step">02</span>

                    <div>
                      <h2>Payment</h2>

                      <p>Choose your payment method.</p>
                    </div>
                  </div>

                  <div className="checkout-payment-option active">
                    <div className="checkout-radio">
                      <span />
                    </div>

                    <div className="checkout-payment-icon">
                      <i className="fas fa-money-bill-wave" />
                    </div>

                    <div>
                      <strong>Cash on Delivery</strong>

                      <span>Pay when your order arrives.</span>
                    </div>
                  </div>
                </div>


                <button
                  type="submit"
                  className="checkout-submit checkout-submit-mobile"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <i className="fas fa-circle-notch fa-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Place Order
                      <i className="fas fa-arrow-right" />
                    </>
                  )}
                </button>
              </form>
            </div>


            <aside className="checkout-summary">
              <div className="checkout-summary-header">
                <div>
                  <span>Order summary</span>

                  <h2>Your Order</h2>
                </div>

                <Link to="/cart">Edit Cart</Link>
              </div>

              <div className="checkout-items">
                {carts.map((item, index) => {
                  const price = parsePrice(item.priceProduct);

                  const count = Number(item.count) || 1;

                  return (
                    <div
                      className="checkout-item"
                      key={item._id || item.idProduct || index}
                    >
                      <div className="checkout-item-image">
                        <img
                          src={item.img}
                          alt={item.nameProduct || "Product"}
                        />

                        <span>{count}</span>
                      </div>

                      <div className="checkout-item-info">
                        <strong>{item.nameProduct}</strong>

                        <span>
                          {price.toLocaleString("vi-VN")}
                          {" ₫"}
                        </span>
                      </div>

                      <strong className="checkout-item-total">
                        {(price * count).toLocaleString("vi-VN")}
                        {" ₫"}
                      </strong>
                    </div>
                  );
                })}
              </div>

              <div className="checkout-summary-details">
                <div>
                  <span>Items</span>

                  <strong>{totalItems}</strong>
                </div>

                <div>
                  <span>Subtotal</span>

                  <strong>
                    {total.toLocaleString("vi-VN")}
                    {" ₫"}
                  </strong>
                </div>

                <div>
                  <span>Shipping</span>

                  <strong className="checkout-free">Free</strong>
                </div>
              </div>

              <div className="checkout-summary-total">
                <span>Total</span>

                <strong>
                  {total.toLocaleString("vi-VN")}
                  {" ₫"}
                </strong>
              </div>

              <button
                type="button"
                className="checkout-submit checkout-submit-desktop"
                disabled={submitting}
                onClick={handleSubmit}
              >
                {submitting ? (
                  <>
                    <i className="fas fa-circle-notch fa-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Place Order
                    <i className="fas fa-arrow-right" />
                  </>
                )}
              </button>

              <div className="checkout-security">
                <i className="fas fa-lock" />

                <div>
                  <strong>Secure checkout</strong>

                  <span>Your information is protected.</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Checkout;
