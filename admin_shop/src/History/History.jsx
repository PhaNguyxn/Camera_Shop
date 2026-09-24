import React, { useState } from "react";
import { Link } from "react-router-dom";
import HistoryAPI from "../API/HistoryAPI";

import {
  Page,
  Panel,
  Search,
  Pager,
  LoadState,
  Notice,
  EmptyRow,
  Stat,
  Badge,
} from "../components/AdminUI";

import {
  asList,
  amount,
  money,
  dateTime,
  shortId,
  matches,
  paginate,
  orderStatus,
  paymentStatus,
  ORDER_LABELS,
  PAYMENT_LABELS,
  useResource,
  errorMessage,
} from "../utils/admin";

const loadOrders = async () => asList(await HistoryAPI.getAll());

export default function History() {
  const resource = useResource(loadOrders);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  const orders = resource.data || [];

  const filtered = orders.filter((order) => {
    const found = matches(
      query,
      order._id,
      order.orderCode,
      order.fullname,
      order.phone,
      order.email,
    );

    return found && (filter === "ALL" || orderStatus(order) === filter);
  });

  const result = paginate(filtered, page);

  const pending = orders.filter(
    (order) => orderStatus(order) === "PENDING",
  ).length;

  const shipping = orders.filter(
    (order) => orderStatus(order) === "SHIPPING",
  ).length;

  const revenue = orders
    .filter((order) => paymentStatus(order) === "PAID")
    .reduce((sum, order) => sum + amount(order.totalAmount ?? order.total), 0);

  const update = async (id, body) => {
    if (busyId) return;

    setBusyId(id);
    setError("");

    try {
      await HistoryAPI.updateOrder(id, body);
      resource.reload();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusyId("");
    }
  };

  return (
    <Page
      title="Đơn hàng"
      subtitle="Theo dõi thanh toán và cập nhật tiến độ xử lý đơn."
    >
      <Notice>{error}</Notice>

      {!resource.loading && !resource.error && (
        <div className="ad-stats">
          <Stat label="Tổng đơn hàng" value={orders.length} icon="bag" />
          <Stat label="Chờ xác nhận" value={pending} icon="layers" />
          <Stat label="Đang giao" value={shipping} icon="bag" />
          <Stat label="Đã thanh toán" value={money(revenue)} icon="money" />
        </div>
      )}

      <Panel title="Danh sách đơn hàng" subtitle="Quản lý tất cả đơn hàng">
        <div className="ad-toolbar">
          <Search
            value={query}
            placeholder="Tìm mã đơn, khách hàng, số điện thoại..."
            onChange={(value) => {
              setQuery(value);
              setPage(1);
            }}
          />

          <select
            className="ad-select"
            value={filter}
            aria-label="Lọc trạng thái đơn hàng"
            onChange={(event) => {
              setFilter(event.target.value);
              setPage(1);
            }}
          >
            <option value="ALL">Tất cả trạng thái</option>
            {Object.entries(ORDER_LABELS).map(([value, label]) => (
              <option value={value} key={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {resource.loading || resource.error ? (
          <LoadState {...resource} />
        ) : (
          <>
            <div className="ad-table-wrap">
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>Đơn hàng</th>
                    <th>Khách hàng</th>
                    <th>Tổng tiền</th>
                    <th>Thanh toán</th>
                    <th>Trạng thái đơn</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>

                <tbody>
                  {result.rows.map((order) => {
                    const status = orderStatus(order);
                    const payment = paymentStatus(order);
                    const isPayOS = order.paymentMethod === "PAYOS";

                    return (
                      <tr key={order._id}>
                        <td>
                          <strong>
                            #{order.orderCode || shortId(order._id)}
                          </strong>
                          <span className="ad-cell-sub ad-nowrap">
                            {dateTime(order.createdAt)}
                          </span>
                        </td>

                        <td>
                          <strong className="ad-cell-title">
                            {order.fullname || "—"}
                          </strong>
                          <span className="ad-cell-sub">
                            {order.phone || "—"}
                          </span>
                        </td>

                        <td className="ad-nowrap">
                          <strong>
                            {money(order.totalAmount ?? order.total)}
                          </strong>
                          <div style={{ marginTop: 6 }}>
                            <Badge>{isPayOS ? "QR / payOS" : "COD"}</Badge>
                          </div>
                        </td>

                        <td>
                          <select
                            className="ad-select"
                            value={payment}
                            disabled={Boolean(busyId) || isPayOS}
                            aria-label={`Thanh toán đơn ${order.orderCode || order._id}`}
                            onChange={(event) =>
                              update(order._id, {
                                paymentStatus: event.target.value,
                              })
                            }
                          >
                            {!PAYMENT_LABELS[payment] && (
                              <option value={payment}>{payment}</option>
                            )}
                            {Object.entries(PAYMENT_LABELS).map(
                              ([value, label]) => (
                                <option key={value} value={value}>
                                  {label}
                                </option>
                              ),
                            )}
                          </select>

                          {isPayOS && (
                            <span className="ad-cell-sub">
                              Đồng bộ từ payOS
                            </span>
                          )}
                        </td>

                        <td>
                          <select
                            className="ad-select"
                            value={status}
                            disabled={Boolean(busyId)}
                            aria-label={`Trạng thái đơn ${order.orderCode || order._id}`}
                            onChange={(event) =>
                              update(order._id, {
                                orderStatus: event.target.value,
                              })
                            }
                          >
                            {!ORDER_LABELS[status] && (
                              <option value={status}>{status}</option>
                            )}
                            {Object.entries(ORDER_LABELS).map(
                              ([value, label]) => (
                                <option key={value} value={value}>
                                  {label}
                                </option>
                              ),
                            )}
                          </select>
                          {busyId === order._id && (
                            <span className="ad-cell-sub">
                              Đang cập nhật...
                            </span>
                          )}
                        </td>

                        <td>
                          <Link
                            className="ad-btn ad-btn-small"
                            to={`/history/view?id=${order._id}`}
                          >
                            Chi tiết
                          </Link>
                        </td>
                      </tr>
                    );
                  })}

                  {!result.rows.length && <EmptyRow columns={6} />}
                </tbody>
              </table>
            </div>

            <Pager data={result} onChange={setPage} />
          </>
        )}
      </Panel>
    </Page>
  );
}
