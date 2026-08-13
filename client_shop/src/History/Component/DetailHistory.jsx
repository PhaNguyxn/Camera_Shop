import React, { useEffect, useMemo, useState } from "react";

import { Link, useParams } from "react-router-dom";

import HistoryAPI from "../../API/HistoryAPI";
import "../History.css";

const parsePrice = (value) => {
  return Number(String(value || "").replace(/\D/g, "")) || 0;
};

function DetailHistory() {
  const { id } = useParams();

  const [order, setOrder] = useState({});

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);

        const response = await HistoryAPI.getDetail(id);

        setOrder(response || {});

        setProducts(Array.isArray(response?.cart) ? response.cart : []);
      } catch (error) {
        console.error("Load order detail error:", error);

        setOrder({});

        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);


  const totalItems = useMemo(
    () =>
      products.reduce((total, item) => total + (Number(item.count) || 0), 0),
    [products],
  );


  const formatDate = (date) => {
    if (!date) {
      return "Updating";
    }

    return new Date(date).toLocaleString("en-US", {
      day: "2-digit",

      month: "short",

      year: "numeric",

      hour: "2-digit",

      minute: "2-digit",
    });
  };


  if (loading) {
    return (
      <main className="history-page">
        <div className="history-loading">
          <div className="history-spinner" />

          <p>Loading order...</p>
        </div>
      </main>
    );
  }


  if (!order?._id) {
    return (
      <main className="history-page">
        <div className="shop-container">
          <div className="history-empty">
            <div className="history-empty-icon">
              <i className="fas fa-receipt" />
            </div>

            <h2>Order not found</h2>

            <p>This order is unavailable or no longer exists.</p>

            <Link to="/history" className="shop-btn shop-btn-primary">
              Back to Orders
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="history-page">

      <section className="history-heading">
        <div className="shop-container">
          <div className="history-breadcrumb">
            <Link to="/">Home</Link>

            <i className="fas fa-chevron-right" />

            <Link to="/history">Orders</Link>

            <i className="fas fa-chevron-right" />

            <span>Order Details</span>
          </div>

          <h1>Order Details</h1>

          <p>Order #{order._id?.slice(-8).toUpperCase()}</p>
        </div>
      </section>


      <section className="history-content">
        <div className="shop-container">
          <Link to="/history" className="history-back">
            <i className="fas fa-arrow-left" />
            Back to Orders
          </Link>

          <div className="history-detail-layout">

            <div className="history-detail-main">
              <div className="history-detail-title">
                <div>
                  <span className="section-eyebrow">Order items</span>

                  <h2>Products</h2>
                </div>

                <span>
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </span>
              </div>

              <div className="history-products">
                {products.map((product, index) => {
                  const price = parsePrice(product.priceProduct);

                  const count = Number(product.count) || 1;

                  return (
                    <article
                      className="history-product"
                      key={product.idProduct || index}
                    >
                      <Link
                        to={`/detail/${product.idProduct}`}
                        className="history-product-image"
                      >
                        <img
                          src={product.img}
                          alt={product.nameProduct || "Product"}
                        />
                      </Link>

                      <div className="history-product-info">
                        <Link to={`/detail/${product.idProduct}`}>
                          {product.nameProduct}
                        </Link>

                        <span>
                          {price.toLocaleString("vi-VN")}
                          {" ₫"}
                        </span>
                      </div>

                      <div className="history-product-quantity">
                        <span>Quantity</span>

                        <strong>{count}</strong>
                      </div>

                      <div className="history-product-total">
                        <span>Total</span>

                        <strong>
                          {(price * count).toLocaleString("vi-VN")}
                          {" ₫"}
                        </strong>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>


            <aside className="history-detail-sidebar">
              <div className="history-info-card">
                <span className="section-eyebrow">Order information</span>

                <h3>Summary</h3>

                <div className="history-info-row">
                  <span>Order ID</span>

                  <strong>#{order._id?.slice(-8).toUpperCase()}</strong>
                </div>

                <div className="history-info-row">
                  <span>Date</span>

                  <strong>{formatDate(order.createdAt)}</strong>
                </div>

                <div className="history-info-row">
                  <span>Delivery</span>

                  <strong
                    className={`history-status ${
                      order.delivery ? "processed" : "processing"
                    }`}
                  >
                    {order.delivery ? "Processed" : "Processing"}
                  </strong>
                </div>

                <div className="history-info-row">
                  <span>Payment</span>

                  <strong
                    className={`history-status ${
                      order.status ? "paid" : "cod"
                    }`}
                  >
                    {order.status ? "Paid" : "COD"}
                  </strong>
                </div>

                <div className="history-info-divider" />

                <div className="history-info-total">
                  <span>Total</span>

                  <strong>
                    {Number(order.total || 0).toLocaleString("vi-VN")}
                    {" ₫"}
                  </strong>
                </div>
              </div>

              <div className="history-info-card">
                <span className="section-eyebrow">Shipping</span>

                <h3>Customer</h3>

                <div className="history-customer-info">
                  <div>
                    <i className="far fa-user" />

                    <span>{order.fullname || "Updating"}</span>
                  </div>

                  <div>
                    <i className="fas fa-phone-alt" />

                    <span>{order.phone || "Updating"}</span>
                  </div>

                  {order.email && (
                    <div>
                      <i className="far fa-envelope" />

                      <span>{order.email}</span>
                    </div>
                  )}

                  <div>
                    <i className="fas fa-map-marker-alt" />

                    <span>{order.address || "Updating"}</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

export default DetailHistory;
