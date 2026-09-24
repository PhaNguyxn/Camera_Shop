import React, { useCallback } from "react";
import { useLocation } from "react-router-dom";
import HistoryAPI from "../API/HistoryAPI";

import {
  Page,
  Panel,
  LoadState,
  BackLink,
  Badge,
  Picture,
  EmptyRow,
} from "../components/AdminUI";

import {
  amount,
  money,
  dateTime,
  shortId,
  orderStatus,
  paymentStatus,
  ORDER_LABELS,
  PAYMENT_LABELS,
  useResource,
} from "../utils/admin";

export default function ViewHistory() {
  const { search } = useLocation();
  const orderId = new URLSearchParams(search).get("id");

  const loader = useCallback(async () => {
    if (!orderId) {
      throw new Error("Thiếu mã đơn hàng trong đường dẫn.");
    }

    const response = await HistoryAPI.getDetail(orderId);

    if (!response?._id) {
      throw new Error("Không tìm thấy đơn hàng.");
    }

    return response;
  }, [orderId]);

  const resource = useResource(loader);

  if (resource.loading || resource.error) {
    return (
      <Page title="Chi tiết đơn hàng" action={<BackLink to="/history" />}>
        <Panel>
          <LoadState {...resource} />
        </Panel>
      </Page>
    );
  }

  const order = resource.data;
  const cart = Array.isArray(order.cart) ? order.cart : [];
  const status = orderStatus(order);
  const payment = paymentStatus(order);

  return (
    <Page
      title={`Đơn hàng #${order.orderCode || shortId(order._id)}`}
      subtitle={`Đặt lúc ${dateTime(order.createdAt)}`}
      action={<BackLink to="/history" />}
    >
      <div className="ad-split">
        <Panel
          title="Sản phẩm trong đơn"
          subtitle={`${cart.length} dòng sản phẩm`}
        >
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Đơn giá</th>
                  <th>Số lượng</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>

              <tbody>
                {cart.map((product, index) => (
                  <tr key={`${product.idProduct || "product"}-${index}`}>
                    <td>
                      <div className="ad-product-cell">
                        <Picture src={product.img} alt={product.nameProduct} />
                        <div>
                          <strong className="ad-cell-title">
                            {product.nameProduct || "Sản phẩm"}
                          </strong>
                          <span className="ad-cell-sub">
                            {product.idProduct}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="ad-nowrap">{money(product.priceProduct)}</td>

                    <td>{product.count}</td>

                    <td className="ad-nowrap">
                      <strong>
                        {money(
                          amount(product.priceProduct) *
                            Number(product.count || 0),
                        )}
                      </strong>
                    </td>
                  </tr>
                ))}

                {!cart.length && (
                  <EmptyRow
                    columns={4}
                    text="Đơn hàng chưa có thông tin sản phẩm."
                  />
                )}
              </tbody>
            </table>
          </div>

          <div className="ad-panel-body">
            <div className="ad-total" style={{ marginTop: 0 }}>
              <span>Tổng giá trị đơn hàng</span>
              <strong>{money(order.totalAmount ?? order.total)}</strong>
            </div>
          </div>
        </Panel>

        <div>
          <Panel title="Thông tin khách hàng">
            <div className="ad-panel-body">
              <dl className="ad-detail-grid">
                <div>
                  <dt>Họ và tên</dt>
                  <dd>{order.fullname || "—"}</dd>
                </div>

                <div>
                  <dt>Số điện thoại</dt>
                  <dd>{order.phone || "—"}</dd>
                </div>

                <div className="ad-full">
                  <dt>Email</dt>
                  <dd>{order.email || "—"}</dd>
                </div>

                <div className="ad-full">
                  <dt>Địa chỉ nhận hàng</dt>
                  <dd>{order.address || "—"}</dd>
                </div>
              </dl>
            </div>
          </Panel>

          <Panel title="Thanh toán & vận chuyển">
            <div className="ad-panel-body">
              <dl className="ad-detail-grid">
                <div className="ad-full">
                  <dt>Phương thức thanh toán</dt>
                  <dd>
                    {order.paymentMethod === "PAYOS"
                      ? "QR / payOS"
                      : "Thanh toán khi nhận hàng (COD)"}
                  </dd>
                </div>

                <div>
                  <dt>Thanh toán</dt>
                  <dd>
                    <Badge dark={payment === "PAID"}>
                      {PAYMENT_LABELS[payment] || payment}
                    </Badge>
                  </dd>
                </div>

                <div>
                  <dt>Trạng thái đơn</dt>
                  <dd>
                    <Badge dark={status === "DELIVERED"}>
                      {ORDER_LABELS[status] || status}
                    </Badge>
                  </dd>
                </div>

                <div className="ad-full">
                  <dt>Mã hệ thống</dt>
                  <dd>{order._id}</dd>
                </div>
              </dl>
            </div>
          </Panel>
        </div>
      </div>
    </Page>
  );
}
