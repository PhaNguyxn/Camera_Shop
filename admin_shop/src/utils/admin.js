import { useCallback, useEffect, useState } from "react";

export function errorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Không thể thực hiện thao tác. Vui lòng thử lại."
  );
}

export function asList(value) {
  if (!Array.isArray(value)) {
    throw new Error("Dữ liệu danh sách trả về không đúng định dạng.");
  }

  return value;
}

export function amount(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  const normalized = String(value ?? "").replace(/[.,\s₫đ]/gi, "");

  const number = Number(normalized);
  return Number.isFinite(number) ? number : 0;
}

export function money(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount(value));
}

export function dateTime(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function shortId(value) {
  return String(value || "")
    .slice(-6)
    .toUpperCase();
}

export function matches(query, ...values) {
  const keyword = String(query || "")
    .trim()
    .toLowerCase();

  return values.some((value) =>
    String(value ?? "")
      .toLowerCase()
      .includes(keyword),
  );
}

export function paginate(items, page, size = 8) {
  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / size));
  const current = Math.min(Math.max(1, page), pages);
  const start = (current - 1) * size;

  return {
    rows: items.slice(start, start + size),
    page: current,
    pages,
    total,
    from: total ? start + 1 : 0,
    to: Math.min(start + size, total),
  };
}

export const ORDER_LABELS = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  SHIPPING: "Đang giao",
  DELIVERED: "Đã giao",
  CANCELLED: "Đã hủy",
};

export const PAYMENT_LABELS = {
  UNPAID: "Chưa thanh toán",
  PAID: "Đã thanh toán",
};

export function orderStatus(order) {
  return order.orderStatus || (order.delivery ? "SHIPPING" : "PENDING");
}

export function paymentStatus(order) {
  return order.paymentStatus || (order.status ? "PAID" : "UNPAID");
}

export function categoryName(category) {
  if (category && typeof category === "object") {
    return category.category || category.name || "Chưa phân loại";
  }

  return category || "Chưa phân loại";
}


export function useResource(loader) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);

  const reload = useCallback(() => {
    setRevision((value) => value + 1);
  }, []);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const result = await loader();

        if (active) {
          setData(result);
        }
      } catch (err) {
        if (active) {
          setError(errorMessage(err));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [loader, revision]);

  return { data, loading, error, reload };
}
