import React, { useEffect, useState } from "react";

import { Link, useHistory } from "react-router-dom";

import queryString from "query-string";
import alertify from "alertifyjs";

import HistoryAPI from "../../API/HistoryAPI";
import "../History.css";

function MainHistory() {
  const history = useHistory();

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchOrders = async () => {
      const idUser = sessionStorage.getItem("id_user");

      if (!idUser) {
        alertify.set("notifier", "position", "bottom-left");

        alertify.error("Vui lòng đăng nhập để xem lịch sử đơn hàng!");

        history.replace("/signin");

        return;
      }

      try {
        setLoading(true);

        const params = {
          idUser,
        };

        const query = "?" + queryString.stringify(params);

        const response = await HistoryAPI.getHistoryAPI(query);

        const orderList = Array.isArray(response) ? response : [];

        orderList.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
        );

        setOrders(orderList);
      } catch (error) {
        console.error("Load order history error:", error);

        setOrders([]);

        alertify.set("notifier", "position", "bottom-left");

        alertify.error("Không thể tải lịch sử đơn hàng!");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [history]);


  const getDeliveryStatus = (order) => {
    return order.delivery
      ? {
          label: "Processed",

          className: "processed",
        }
      : {
          label: "Processing",

          className: "processing",
        };
  };

  const getPaymentStatus = (order) => {
    return order.status
      ? {
          label: "Paid",

          className: "paid",
        }
      : {
          label: "COD",

          className: "cod",
        };
  };

  const formatDate = (date) => {
    if (!date) {
      return "Updating";
    }

    return new Date(date).toLocaleDateString("en-US", {
      day: "2-digit",

      month: "short",

      year: "numeric",
    });
  };


  return (
    <main className="history-page">

      <section className="history-heading">
        <div className="shop-container">
          <div className="history-breadcrumb">
            <Link to="/">Home</Link>

            <i className="fas fa-chevron-right" />

            <span>Orders</span>
          </div>

          <h1>My Orders</h1>

          <p>View your recent purchases and follow their current status.</p>
        </div>
      </section>


      <section className="history-content">
        <div className="shop-container">
          {loading ? (
            <div className="history-loading">
              <div className="history-spinner" />

              <p>Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="history-empty">
              <div className="history-empty-icon">
                <i className="fas fa-box-open" />
              </div>

              <h2>No orders yet</h2>

              <p>When you place an order, it will appear here.</p>

              <Link to="/shop" className="shop-btn shop-btn-primary">
                Start Shopping
              </Link>
            </div>
          ) : (
            <>
              <div className="history-toolbar">
                <div>
                  <h2>Order History</h2>

                  <span>
                    {orders.length} {orders.length === 1 ? "order" : "orders"}
                  </span>
                </div>

                <Link to="/shop" className="history-shop-link">
                  Continue Shopping
                  <i className="fas fa-arrow-right" />
                </Link>
              </div>

              <div className="history-list">
                {orders.map((order) => {
                  const delivery = getDeliveryStatus(order);

                  const payment = getPaymentStatus(order);

                  return (
                    <article className="history-card" key={order._id}>
                      <div className="history-card-top">
                        <div className="history-order-id">
                          <span>Order</span>

                          <strong>#{order._id?.slice(-8).toUpperCase()}</strong>
                        </div>

                        <div className="history-card-date">
                          <i className="far fa-calendar" />

                          {formatDate(order.createdAt)}
                        </div>
                      </div>

                      <div className="history-card-body">
                        <div className="history-customer">
                          <span>Customer</span>

                          <strong>{order.fullname}</strong>

                          <small>{order.phone}</small>
                        </div>

                        <div className="history-address">
                          <span>Delivery Address</span>

                          <strong>{order.address}</strong>
                        </div>

                        <div className="history-status-group">
                          <div>
                            <span>Delivery</span>

                            <strong
                              className={`history-status ${delivery.className}`}
                            >
                              {delivery.label}
                            </strong>
                          </div>

                          <div>
                            <span>Payment</span>

                            <strong
                              className={`history-status ${payment.className}`}
                            >
                              {payment.label}
                            </strong>
                          </div>
                        </div>

                        <div className="history-order-total">
                          <span>Total</span>

                          <strong>
                            {Number(order.total || 0).toLocaleString("vi-VN")}
                            {" ₫"}
                          </strong>
                        </div>
                      </div>

                      <div className="history-card-footer">
                        <Link to={`/history/${order._id}`}>
                          View Order Details
                          <i className="fas fa-arrow-right" />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default MainHistory;
