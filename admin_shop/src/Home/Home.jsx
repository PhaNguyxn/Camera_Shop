import useResource from "../hooks/useResource";
import React from "react";
import { Link } from "react-router-dom";
import HistoryAPI from "../API/HistoryAPI";
import ProductAPI from "../API/ProductAPI";
import UserAPI from "../API/UserAPI";

import {
  Page,
  Panel,
  LoadState,
  Stat,
  Badge,
  EmptyRow,
} from "../components/AdminUI";

import {
  asList,
  amount,
  money,
  shortId,
  orderStatus,
  paymentStatus,
  ORDER_LABELS,
} from "../utils/admin";

async function loadDashboard() {
  const [orders, products, users] = await Promise.all([
    HistoryAPI.getAll(),
    ProductAPI.getAPI(),
    UserAPI.getAllData(),
  ]);

  return {
    orders: asList(orders),
    products: asList(products),
    users: asList(users),
  };
}

export default function Home() {
  const resource = useResource(loadDashboard);

  if (resource.loading || resource.error) {
    return (
      <Page title="Tổng quan" subtitle="Hoạt động cửa hàng của bạn.">
        <Panel>
          <LoadState {...resource} />
        </Panel>
      </Page>
    );
  }

  const { orders, products, users } = resource.data;

  const revenue = orders
    .filter((order) => paymentStatus(order) === "PAID")
    .reduce((sum, order) => sum + amount(order.totalAmount ?? order.total), 0);

  const pending = orders.filter(
    (order) => orderStatus(order) === "PENDING",
  ).length;

  const recent = [...orders]
    .sort((a, b) => {
      const first = new Date(a.createdAt).getTime() || 0;
      const second = new Date(b.createdAt).getTime() || 0;
      return second - first;
    })
    .slice(0, 5);

  return (
    <Page
      title="Tổng quan"
      subtitle="Theo dõi hoạt động bán hàng và các đơn hàng mới nhất."
      action={
        <Link className="ad-btn ad-btn-primary" to="/products/view-edit">
          + Thêm sản phẩm
        </Link>
      }
    >
      <div className="ad-stats">
        <Stat
          label="Doanh thu đã thanh toán"
          value={money(revenue)}
          icon="money"
          note="Tổng giá trị các đơn đã thanh toán"
        />
        <Stat
          label="Tổng đơn hàng"
          value={orders.length}
          icon="bag"
          note={`${pending} đơn đang chờ xác nhận`}
        />
        <Stat
          label="Sản phẩm"
          value={products.length}
          icon="camera"
          note="Sản phẩm hiện có trong hệ thống"
        />
        <Stat
          label="Người dùng"
          value={users.length}
          icon="users"
          note="Tổng tài khoản trong hệ thống"
        />
      </div>

      <div className="ad-split">
        <Panel
          title="Đơn hàng gần đây"
          subtitle="Năm đơn hàng mới nhất"
          action={
            <Link className="ad-btn ad-btn-small" to="/history">
              Xem tất cả
            </Link>
          }
        >
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Đơn hàng</th>
                  <th>Khách hàng</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <Link to={`/history/view?id=${order._id}`}>
                        <strong>
                          #{order.orderCode || shortId(order._id)}
                        </strong>
                      </Link>
                    </td>
                    <td>
                      <strong>{order.fullname || "—"}</strong>
                      <span className="ad-cell-sub">{order.phone}</span>
                    </td>
                    <td className="ad-nowrap">
                      {money(order.totalAmount ?? order.total)}
                    </td>
                    <td>
                      <Badge dark={orderStatus(order) === "DELIVERED"}>
                        {ORDER_LABELS[orderStatus(order)] || orderStatus(order)}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {!recent.length && (
                  <EmptyRow columns={4} text="Chưa có đơn hàng." />
                )}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel
          title="Trạng thái đơn hàng"
          subtitle="Phân bố theo tiến độ xử lý"
        >
          <div className="ad-panel-body">
            {Object.entries(ORDER_LABELS).map(([value, label]) => {
              const count = orders.filter(
                (order) => orderStatus(order) === value,
              ).length;

              const percent = orders.length ? (count / orders.length) * 100 : 0;

              return (
                <div className="ad-progress-row" key={value}>
                  <div className="ad-progress-label">
                    <span>{label}</span>
                    <strong>{count}</strong>
                  </div>
                  <div className="ad-progress-track" aria-hidden="true">
                    <div
                      className="ad-progress-fill"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>
    </Page>
  );
}
