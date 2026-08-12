import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import queryString from "query-string";

import CartAPI from "../API/CartAPI";
import HistoryAPI from "../API/HistoryAPI";

import "./Checkout.css";

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

function Checkout() {
  const [carts, setCarts] = useState([]);

  const [total, setTotal] = useState(0);

  const [fullname, setFullname] = useState("");
  const [fullnameError, setFullnameError] = useState(false);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailRegex, setEmailRegex] = useState(false);

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);

  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState(false);

  const [success, setSuccess] = useState(false);

  const [load, setLoad] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("COD");

  useEffect(() => {
    const fetchData = async () => {
      const idUser = sessionStorage.getItem("id_user");

      if (!idUser) {
        window.location.replace("/cart");
        return;
      }

      try {
        const params = {
          idUser,
        };

        const query = "?" + queryString.stringify(params);

        const response = await CartAPI.getCarts(query);

        const cartData = Array.isArray(response) ? response : [];

        if (cartData.length === 0) {
          window.location.replace("/cart");

          return;
        }

        setCarts(cartData);

        setTotal(calculateTotal(cartData));
      } catch (error) {
        console.error("Lỗi tải giỏ hàng:", error);
      }
    };

    fetchData();
  }, []);

  const validateEmail = (emailValue) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(String(emailValue).toLowerCase());
  };


  const resetErrors = () => {
    setFullnameError(false);
    setEmailError(false);
    setEmailRegex(false);
    setPhoneError(false);
    setAddressError(false);
  };


  const handlerSubmit = async (e) => {
    e.preventDefault();

    resetErrors();

    if (!fullname.trim()) {
      setFullnameError(true);

      return;
    }

    if (!email.trim()) {
      setEmailError(true);

      return;
    }

    if (!validateEmail(email)) {
      setEmailRegex(true);

      return;
    }

    if (!phone.trim()) {
      setPhoneError(true);

      return;
    }

    if (!address.trim()) {
      setAddressError(true);

      return;
    }

    if (carts.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");

      return;
    }

    const idUser = sessionStorage.getItem("id_user");

    if (!idUser) {
      alert("Vui lòng đăng nhập trước khi đặt hàng!");

      return;
    }

    setLoad(true);

    const data = {
      idUser,

      fullname: fullname.trim(),

      email: email.trim(),

      phone: phone.trim(),

      address: address.trim(),

      paymentMethod,
    };

    try {

      const response = await HistoryAPI.postHistory(data);

      console.log("Order:", response);

      setCarts([]);

      setTotal(0);

      setSuccess(true);

    } catch (error) {
      console.error("Lỗi đặt hàng:", error);

      alert("Đặt hàng thất bại, vui lòng thử lại!");
    } finally {
      setLoad(false);
    }
  };

  return (
    <div>
      {load && (
        <div className="wrapper_loader">
          <div className="loader"></div>
        </div>
      )}

      <div className="container">
        <section className="py-5 bg-light">
          <div className="container">
            <div className="row px-4 px-lg-5 py-lg-4 align-items-center">
              <div className="col-lg-6">
                <h1 className="h2 text-uppercase mb-0">Checkout</h1>
              </div>

              <div className="col-lg-6 text-lg-right">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb justify-content-lg-end mb-0 px-0">
                    <li className="breadcrumb-item">
                      <Link to="/">Home</Link>
                    </li>

                    <li className="breadcrumb-item">
                      <Link to="/cart">Cart</Link>
                    </li>

                    <li className="breadcrumb-item active" aria-current="page">
                      Checkout
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </section>

        {!success && (
          <section className="py-5">
            <h2 className="h5 text-uppercase mb-4">Billing details</h2>

            <div className="row">
              <div className="col-lg-8">
                <form onSubmit={handlerSubmit}>
                  <div className="row">
                    <div className="col-lg-12 form-group">
                      <label
                        className="text-small text-uppercase"
                        htmlFor="fullname"
                      >
                        Full Name:
                      </label>

                      <input
                        id="fullname"
                        className="form-control form-control-lg"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                        type="text"
                        placeholder="Enter Your Full Name Here!"
                      />

                      {fullnameError && (
                        <span className="text-danger">
                          * Please Check Your Full Name!
                        </span>
                      )}
                    </div>

                    <div className="col-lg-12 form-group">
                      <label
                        className="text-small text-uppercase"
                        htmlFor="email"
                      >
                        Email:
                      </label>

                      <input
                        id="email"
                        className="form-control form-control-lg"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="Enter Your Email Here!"
                      />

                      {emailError && (
                        <span className="text-danger">
                          * Please Check Your Email!
                        </span>
                      )}

                      {emailRegex && (
                        <span className="text-danger">
                          * Incorrect Email Format
                        </span>
                      )}
                    </div>

                    <div className="col-lg-12 form-group">
                      <label
                        className="text-small text-uppercase"
                        htmlFor="phone"
                      >
                        Phone Number:
                      </label>

                      <input
                        id="phone"
                        className="form-control form-control-lg"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        type="tel"
                        placeholder="Enter Your Phone Number Here!"
                      />

                      {phoneError && (
                        <span className="text-danger">
                          * Please Check Your Phone Number!
                        </span>
                      )}
                    </div>

                    <div className="col-lg-12 form-group">
                      <label
                        className="text-small text-uppercase"
                        htmlFor="address"
                      >
                        Address:
                      </label>

                      <input
                        id="address"
                        className="form-control form-control-lg"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        type="text"
                        placeholder="Enter Your Address Here!"
                      />

                      {addressError && (
                        <span className="text-danger">
                          * Please Check Your Address!
                        </span>
                      )}
                    </div>

                    <div className="col-lg-12 form-group">
                      <label className="text-small text-uppercase">
                        Payment methods
                      </label>

                      <div className="payment-methods">
                        <label
                          className={`payment-method ${
                            paymentMethod === "COD"
                              ? "payment-method-active"
                              : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="COD"
                            checked={paymentMethod === "COD"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                          />

                          <div>
                            <strong>Cash on delivery</strong>

                            <p>Pay in cash upon receipt of the product.</p>
                          </div>
                        </label>

                        <label
                          className={`payment-method ${
                            paymentMethod === "PAYOS"
                              ? "payment-method-active"
                              : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="PAYOS"
                            checked={paymentMethod === "PAYOS"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            disabled
                          />

                          <div>
                            <strong>QR Payment</strong>

                            <p>Bank payment via QR code.</p>

                            <small>Coming soon</small>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="col-lg-12 form-group">
                      <button
                        className="btn btn-dark"
                        type="submit"
                        disabled={load}
                      >
                        {load
                          ? "Processing..."
                          : paymentMethod === "COD"
                            ? "Place order"
                            : "Pay now"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              <div className="col-lg-4">
                <div className="card border-0 rounded-0 p-lg-4 bg-light">
                  <div className="card-body">
                    <h5 className="text-uppercase mb-4">Your order</h5>

                    <ul className="list-unstyled mb-0">
                      {carts.map((value) => (
                        <React.Fragment key={value._id || value.idProduct}>
                          <li className="d-flex align-items-center justify-content-between">
                            <div>
                              <strong className="small font-weight-bold">
                                {value.nameProduct}
                              </strong>
                              <div className="text-muted small">
                                Quantity: {value.count}
                              </div>
                            </div>

                            <span className="text-muted small">
                              {(
                                Number(
                                  value.priceProduct
                                    .toString()
                                    .replace(/\D/g, ""),
                                ) * Number(value.count)
                              ).toLocaleString("vi-VN")}

                              {" đ"}
                            </span>
                          </li>

                          <li className="border-bottom my-2"></li>
                        </React.Fragment>
                      ))}

                      <li className="d-flex align-items-center justify-content-between">
                        <strong className="text-uppercase small font-weight-bold">
                          Total
                        </strong>

                        <span>
                          {total.toLocaleString("vi-VN")}

                          {" đ"}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {success && (
          <section className="py-5">
            <div className="p-5">
              <div className="order-success">
                <div className="order-success-icon">✓</div>

                <h2>Order placed successfully!</h2>

                <p>Thank you for your order. Your order is being processed.</p>

                <div className="order-success-actions">
                  <Link to="/history" className="btn btn-dark">
                    View order
                  </Link>

                  <Link to="/shop" className="btn btn-outline-dark">
                    Continue shopping
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default Checkout;
