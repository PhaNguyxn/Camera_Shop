import React, { useEffect, useState, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import HistoryAPI from "../API/HistoryAPI";

function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}

const ViewHistory = () => {
    const historyId = useQuery().get('id');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleString('vi-VN');
    };

    const formatMoney = (value) => {
      const number =
        typeof value === "number"
          ? value
          : Number(String(value || "").replace(/[^\d]/g, "")) || 0;

      return `${number.toLocaleString("vi-VN")} ₫`;
    };

    useEffect(() => {
        if (historyId) {
            const fetchDetail = async () => {
                try {
                    setLoading(true);
                    const res = await HistoryAPI.getDetail(historyId);
                    
                    if (res && res._id) {
                        setOrder(res);
                    }
                } catch (error) {
                    console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchDetail();
        }
    }, [historyId]);

    if (loading) {
        return (
            <div className="page-wrapper">
                <div className="container-fluid">Đang tải dữ liệu...</div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="page-wrapper">
                <div className="container-fluid">Không tìm thấy thông tin đơn hàng!</div>
            </div>
        );
    }

    return (
      <div className="page-wrapper">
        <div className="page-breadcrumb">
          <div className="row">
            <div className="col-7 align-self-center">
              <h4 className="page-title text-truncate text-dark font-weight-medium mb-1">
                Chi tiết đơn hàng
              </h4>
              <div className="d-flex align-items-center">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb m-0 p-0">
                    <li className="breadcrumb-item">
                      <Link to="/" className="text-muted">
                        Home
                      </Link>
                    </li>
                    <li className="breadcrumb-item text-muted active">
                      Order History
                    </li>
                    <li className="breadcrumb-item text-muted active">
                      ID: {order._id}
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card" style={{ paddingTop: "1.5rem" }}>
                <div style={{ margin: "0 1.5rem 1.5rem" }}>
                  <h5 className="card-title">Thông tin đơn hàng</h5>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label>Full Name:</label>
                      <input
                        className="form-control"
                        value={order.fullname || ""}
                        disabled
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Phone:</label>
                      <input
                        className="form-control"
                        value={order.phone || ""}
                        disabled
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Email:</label>

                      <input
                        className="form-control"
                        value={order.email || ""}
                        disabled
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Mã đơn hàng:</label>

                      <input
                        className="form-control"
                        value={order.orderCode || order._id}
                        disabled
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Phương thức thanh toán:</label>

                      <input
                        className="form-control"
                        value={
                          order.paymentMethod === "PAYOS"
                            ? "QR / payOS"
                            : "Thanh toán khi nhận hàng"
                        }
                        disabled
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Trạng thái thanh toán:</label>

                      <input
                        className="form-control"
                        value={
                          (order.paymentStatus ||
                            (order.status ? "PAID" : "UNPAID")) === "PAID"
                            ? "Đã thanh toán"
                            : "Chưa thanh toán"
                        }
                        disabled
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Trạng thái đơn hàng:</label>

                      <input
                        className="form-control"
                        value={
                          {
                            PENDING: "Chờ xác nhận",

                            CONFIRMED: "Đã xác nhận",

                            SHIPPING: "Đang giao",

                            DELIVERED: "Đã giao",

                            CANCELLED: "Đã hủy",
                          }[
                            order.orderStatus ||
                              (order.delivery ? "SHIPPING" : "PENDING")
                          ]
                        }
                        disabled
                      />
                    </div>
                    <div className="col-12 mb-3">
                      <label>Address:</label>
                      <input
                        className="form-control"
                        value={order.address || ""}
                        disabled
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Total:</label>
                      <input
                        className="form-control text-danger font-weight-bold"
                        value={formatMoney(order.totalAmount ?? order.total)}
                        disabled
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Order Date:</label>
                      <input
                        className="form-control"
                        value={formatDate(order.createdAt)}
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div style={{ margin: "0 1.5rem 1.5rem" }}>
                  <h5 className="card-title">Sản phẩm trong đơn hàng</h5>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead className="bg-light">
                        <tr>
                          <th>Ảnh</th>
                          <th>Sản phẩm</th>
                          <th>Đơn giá</th>
                          <th>Số lượng</th>
                          <th>Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.cart?.map((product, index) => (
                          <tr key={index}>
                            <td>
                              <img
                                src={product.img}
                                alt={product.nameProduct}
                                style={{
                                  width: "70px",
                                  height: "70px",
                                  objectFit: "cover",
                                  borderRadius: "6px",
                                }}
                              />
                            </td>

                            <td>
                              <strong>{product.nameProduct}</strong>

                              <div className="text-muted small">
                                ID: {product.idProduct}
                              </div>
                            </td>

                            <td>{formatMoney(product.priceProduct)}</td>

                            <td>{product.count}</td>

                            <td>
                              <strong>
                                {formatMoney(
                                  Number(product.priceProduct) *
                                    Number(product.count),
                                )}
                              </strong>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="d-flex" style={{ margin: "0 1.5rem 1.5rem" }}>
                  <Link to="/history" className="btn btn-secondary">
                    Quay lại danh sách đơn hàng
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default ViewHistory;