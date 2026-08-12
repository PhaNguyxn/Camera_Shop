import React, { useEffect, useMemo, useState } from "react";

import { useHistory } from "react-router-dom";

import HistoryAPI from "../API/HistoryAPI";

import "./History.css";

function History() {
  const historyRouter = useHistory();

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [loadingIds, setLoadingIds] = useState([]);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("ALL");


  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await HistoryAPI.getAll();

      setOrders(response || []);
    } catch (error) {
      console.error("Lỗi tải đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };


  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("vi-VN");
  };

  const normalizeMoney = (value) => {
    if (typeof value === "number") {
      return value;
    }

    return Number(String(value || "").replace(/[^\d]/g, "")) || 0;
  };

  const formatMoney = (value) => {
    return `${normalizeMoney(value).toLocaleString("vi-VN")} ₫`;
  };


  const getPaymentStatus = (order) => {
    if (order.paymentStatus) {
      return order.paymentStatus;
    }

    return order.status ? "PAID" : "UNPAID";
  };

  const getOrderStatus = (order) => {
    if (order.orderStatus) {
      return order.orderStatus;
    }

    return order.delivery ? "SHIPPING" : "PENDING";
  };

  const getPaymentMethod = (order) => {
    return order.paymentMethod || "COD";
  };


  const handleUpdateOrder = async (id, data) => {
    try {
      setLoadingIds((prev) => [...prev, id]);

      const response = await HistoryAPI.updateOrder(id, data);

      const updatedOrder = response.order || response;

      setOrders((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                ...updatedOrder,
              }
            : item,
        ),
      );
    } catch (error) {
      console.error("Update order error:", error);

      alert(error?.response?.data?.message || "Không thể cập nhật đơn hàng");
    } finally {
      setLoadingIds((prev) => prev.filter((item) => item !== id));
    }
  };


  const filteredOrders = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return orders.filter((order) => {
      const matchSearch =
        !keyword ||
        order.fullname?.toLowerCase().includes(keyword) ||
        order.phone?.toLowerCase().includes(keyword) ||
        order.email?.toLowerCase().includes(keyword) ||
        order.address?.toLowerCase().includes(keyword) ||
        String(order.orderCode || "").includes(keyword) ||
        order._id?.toLowerCase().includes(keyword);

      const matchStatus =
        statusFilter === "ALL" || getOrderStatus(order) === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [orders, search, statusFilter]);


  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => getOrderStatus(order) === "PENDING",
  ).length;

  const shippingOrders = orders.filter(
    (order) => getOrderStatus(order) === "SHIPPING",
  ).length;

  const revenue = orders
    .filter((order) => getPaymentStatus(order) === "PAID")
    .reduce(
      (sum, order) => sum + normalizeMoney(order.totalAmount ?? order.total),
      0,
    );


  const orderStatusText = {
    PENDING: "Chờ xác nhận",
    CONFIRMED: "Đã xác nhận",
    SHIPPING: "Đang giao",
    DELIVERED: "Đã giao",
    CANCELLED: "Đã hủy",
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container-fluid">Đang tải đơn hàng...</div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="page-breadcrumb">
        <div className="row">
          <div className="col-12">
            <h4 className="page-title text-dark font-weight-medium mb-1">
              Quản lý đơn hàng
            </h4>

            <p className="text-muted">
              Theo dõi và cập nhật trạng thái đơn hàng.
            </p>
          </div>
        </div>
      </div>

      <div className="container-fluid">

        <div className="order-stat-grid">
          <div className="order-stat-card">
            <span>Tổng đơn hàng</span>

            <strong>{totalOrders}</strong>
          </div>

          <div className="order-stat-card">
            <span>Chờ xác nhận</span>

            <strong>{pendingOrders}</strong>
          </div>

          <div className="order-stat-card">
            <span>Đang giao</span>

            <strong>{shippingOrders}</strong>
          </div>

          <div className="order-stat-card">
            <span>Doanh thu đã thanh toán</span>

            <strong>{formatMoney(revenue)}</strong>
          </div>
        </div>

        <div className="card">
          <div className="card-body">

            <div className="order-toolbar">
              <input
                type="text"
                className="form-control"
                placeholder="Tìm mã đơn, khách hàng, SĐT..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className="form-control"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">Tất cả trạng thái</option>

                <option value="PENDING">Chờ xác nhận</option>

                <option value="CONFIRMED">Đã xác nhận</option>

                <option value="SHIPPING">Đang giao</option>

                <option value="DELIVERED">Đã giao</option>

                <option value="CANCELLED">Đã hủy</option>
              </select>
            </div>


            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Mã đơn</th>

                    <th>Khách hàng</th>

                    <th>Tổng tiền</th>

                    <th>Phương thức</th>

                    <th>Thanh toán</th>

                    <th>Trạng thái đơn</th>

                    <th>Ngày đặt</th>

                    <th>Thao tác</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((order) => {
                    const isLoading = loadingIds.includes(order._id);

                    const paymentMethod = getPaymentMethod(order);

                    const paymentStatus = getPaymentStatus(order);

                    const orderStatus = getOrderStatus(order);

                    return (
                      <tr key={order._id}>
                        <td>
                          <strong>
                            #{order.orderCode || order._id.slice(-6)}
                          </strong>
                        </td>

                        <td>
                          <div>
                            <strong>{order.fullname}</strong>
                          </div>

                          <small className="text-muted">{order.phone}</small>
                        </td>

                        <td>
                          <strong>
                            {formatMoney(order.totalAmount ?? order.total)}
                          </strong>
                        </td>

                        <td>
                          <span className="payment-method-badge">
                            {paymentMethod === "PAYOS" ? "QR / payOS" : "COD"}
                          </span>
                        </td>

                        <td>
                          <select
                            value={paymentStatus}
                            className={`form-control payment-select ${
                              paymentStatus === "PAID"
                                ? "payment-paid"
                                : "payment-unpaid"
                            }`}
                            disabled={isLoading || paymentMethod === "PAYOS"}
                            onChange={(e) =>
                              handleUpdateOrder(order._id, {
                                paymentStatus: e.target.value,
                              })
                            }
                          >
                            <option value="UNPAID">Chưa thanh toán</option>

                            <option value="PAID">Đã thanh toán</option>
                          </select>
                        </td>

                        <td>
                          <select
                            className="form-control order-status-select"
                            value={orderStatus}
                            disabled={isLoading}
                            onChange={(e) =>
                              handleUpdateOrder(order._id, {
                                orderStatus: e.target.value,
                              })
                            }
                          >
                            {Object.entries(orderStatusText).map(
                              ([value, label]) => (
                                <option value={value} key={value}>
                                  {label}
                                </option>
                              ),
                            )}
                          </select>
                        </td>

                        <td>{formatDate(order.createdAt)}</td>

                        <td>
                          <button
                            className="btn btn-dark btn-sm"
                            onClick={() =>
                              historyRouter.push(
                                `/history/view?id=${order._id}`,
                              )
                            }
                          >
                            Chi tiết
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {!filteredOrders.length && (
                    <tr>
                      <td colSpan="8" className="text-center py-4 text-muted">
                        Không tìm thấy đơn hàng.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default History;
