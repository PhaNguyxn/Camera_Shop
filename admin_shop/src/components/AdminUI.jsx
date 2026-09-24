import React from "react";
import { Link } from "react-router-dom";

const ICONS = {
  dashboard: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
  users:
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M16 3a4 4 0 0 1 0 8 M22 21v-2a4 4 0 0 0-3-3.87 M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
  camera:
    "M14.5 4h-5L7 7H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-4z M16 13a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
  layers: "M12 3 2 8l10 5 10-5-10-5z M2 12l10 5 10-5 M2 16l10 5 10-5",
  bag: "M6 3h12l3 5v13H3V8l3-5z M3 8h18 M8 12a4 4 0 0 0 8 0",
  money: "M3 5h18v14H3z M3 9h18 M7 15h3 M15 15h2",
  search: "M21 21l-5-5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  menu: "M3 6h18 M3 12h18 M3 18h18",
  close: "M6 6l12 12 M6 18 18 6",
  plus: "M12 5v14 M5 12h14",
  back: "M15 5l-7 7 7 7",
  logout: "M9 21H3V3h6 M16 17l5-5-5-5 M21 12H9",
};

export function Icon({ name, size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={ICONS[name] || ICONS.dashboard} />
    </svg>
  );
}

export function Page({ title, subtitle, action, children }) {
  return (
    <section className="ad-page">
      <div className="ad-page-heading">
        <div>
          <p className="ad-eyebrow">CAMERA SHOP / QUẢN TRỊ</p>
          <h1>{title}</h1>
          {subtitle && <p className="ad-muted">{subtitle}</p>}
        </div>
        {action && <div className="ad-actions">{action}</div>}
      </div>
      {children}
    </section>
  );
}

export function Panel({ title, subtitle, action, children }) {
  return (
    <section className="ad-panel">
      {(title || action) && (
        <div className="ad-panel-heading">
          <div>
            {title && <h2>{title}</h2>}
            {subtitle && <p className="ad-muted">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Notice({ children, success = false }) {
  if (!children) return null;

  return (
    <div
      className={`ad-notice ${success ? "is-success" : ""}`}
      role={success ? "status" : "alert"}
    >
      {children}
    </div>
  );
}

export function LoadState({ loading, error, reload }) {
  if (loading) {
    return (
      <div className="ad-empty" role="status">
        <span className="ad-spinner" />
        <strong>Đang tải dữ liệu</strong>
        <span className="ad-muted">Vui lòng chờ trong giây lát.</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ad-empty">
        <strong>Không thể tải dữ liệu</strong>
        <p className="ad-muted" role="alert">
          {error}
        </p>
        <button className="ad-btn" type="button" onClick={reload}>
          Thử lại
        </button>
      </div>
    );
  }

  return null;
}

export function EmptyRow({ columns, text = "Không tìm thấy dữ liệu." }) {
  return (
    <tr>
      <td colSpan={columns}>
        <div className="ad-empty">
          <Icon name="search" size={28} />
          <strong>{text}</strong>
          <span className="ad-muted">Thử thay đổi từ khóa hoặc bộ lọc.</span>
        </div>
      </td>
    </tr>
  );
}

export function Search({ value, onChange, placeholder = "Tìm kiếm..." }) {
  return (
    <label className="ad-search">
      <Icon name="search" size={18} />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </label>
  );
}

export function Pager({ data, onChange }) {
  return (
    <div className="ad-pager">
      <span className="ad-muted">
        Hiển thị {data.from}–{data.to} trong {data.total} kết quả
      </span>

      <div className="ad-actions">
        <button
          className="ad-btn ad-btn-small"
          type="button"
          disabled={data.page <= 1}
          onClick={() => onChange(data.page - 1)}
        >
          Trước
        </button>

        <span className="ad-page-number">
          {data.page} / {data.pages}
        </span>

        <button
          className="ad-btn ad-btn-small"
          type="button"
          disabled={data.page >= data.pages}
          onClick={() => onChange(data.page + 1)}
        >
          Sau
        </button>
      </div>
    </div>
  );
}

export function Field({ label, children, hint }) {
  return (
    <label className="ad-field">
      <span>{label}</span>
      {children}
      {hint && <small className="ad-muted">{hint}</small>}
    </label>
  );
}

export function Badge({ children, dark = false }) {
  return (
    <span className={`ad-badge ${dark ? "is-dark" : ""}`}>{children}</span>
  );
}

export function Stat({ label, value, icon, note }) {
  return (
    <div className="ad-stat">
      <div className="ad-stat-top">
        <span>{label}</span>
        <span className="ad-stat-icon">
          <Icon name={icon} />
        </span>
      </div>
      <strong>{value}</strong>
      {note && <small>{note}</small>}
    </div>
  );
}

export function BackLink({ to, children = "Quay lại danh sách" }) {
  return (
    <Link to={to} className="ad-btn">
      <Icon name="back" size={16} />
      {children}
    </Link>
  );
}

export function Picture({ src, alt = "", large = false }) {
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <div className={`ad-picture ${large ? "is-large" : ""}`}>
      {src && !failed ? (
        <img src={src} alt={alt} onError={() => setFailed(true)} />
      ) : (
        <Icon name="camera" size={large ? 42 : 22} />
      )}
    </div>
  );
}
