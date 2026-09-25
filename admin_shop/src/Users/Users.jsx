import useResource from "../hooks/useResource";
import React, { useState } from "react";
import UserAPI from "../API/UserAPI";

import {
  Page,
  Panel,
  LoadState,
  Notice,
  Search,
  Pager,
  EmptyRow,
  Field,
  Badge,
} from "../components/AdminUI";

import {
  asList,
  matches,
  paginate,
  errorMessage,
} from "../utils/admin";

const loadUsers = async () => asList(await UserAPI.getAllData());

export default function Users() {
  const resource = useResource(loadUsers);

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const users = resource.data || [];
  const filtered = users.filter((user) =>
    matches(query, user.fullname, user.email, user.phone),
  );
  const result = paginate(filtered, page);

  const save = async (event) => {
    event.preventDefault();
    if (!editing || busy) return;

    if (!editing.fullname.trim() || !editing.email.trim()) {
      setError("Vui lòng nhập họ tên và email.");
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");

    try {
      await UserAPI.updateUser(editing._id, {
        fullname: editing.fullname.trim(),
        email: editing.email.trim(),
        phone: editing.phone.trim(),
      });

      setEditing(null);
      setMessage("Đã cập nhật thông tin người dùng.");
      resource.reload();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (user) => {
    if (!window.confirm(`Xóa tài khoản "${user.fullname || user.email}"?`)) {
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");

    try {
      await UserAPI.deleteUser(user._id);

      if (editing?._id === user._id) setEditing(null);

      setMessage("Đã xóa người dùng.");
      resource.reload();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Page
      title="Người dùng"
      subtitle="Tra cứu và cập nhật thông tin các tài khoản."
    >
      <Notice>{error}</Notice>
      <Notice success>{message}</Notice>

      {editing && (
        <Panel title="Chỉnh sửa người dùng" subtitle={editing.email}>
          <form className="ad-panel-body" onSubmit={save}>
            <div className="ad-form-grid">
              <Field label="Họ và tên">
                <input
                  className="ad-input"
                  value={editing.fullname}
                  required
                  disabled={busy}
                  onChange={(event) =>
                    setEditing({ ...editing, fullname: event.target.value })
                  }
                />
              </Field>

              <Field label="Email">
                <input
                  className="ad-input"
                  type="email"
                  value={editing.email}
                  required
                  disabled={busy}
                  onChange={(event) =>
                    setEditing({ ...editing, email: event.target.value })
                  }
                />
              </Field>

              <Field label="Số điện thoại">
                <input
                  className="ad-input"
                  type="tel"
                  value={editing.phone}
                  disabled={busy}
                  onChange={(event) =>
                    setEditing({ ...editing, phone: event.target.value })
                  }
                />
              </Field>
            </div>

            <div className="ad-form-footer">
              <button
                className="ad-btn"
                type="button"
                disabled={busy}
                onClick={() => setEditing(null)}
              >
                Hủy
              </button>
              <button
                className="ad-btn ad-btn-primary"
                type="submit"
                disabled={busy}
              >
                {busy ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </form>
        </Panel>
      )}

      <Panel
        title="Danh sách người dùng"
        subtitle={`${users.length} tài khoản`}
      >
        <div className="ad-toolbar">
          <Search
            value={query}
            placeholder="Tìm tên, email, số điện thoại..."
            onChange={(value) => {
              setQuery(value);
              setPage(1);
            }}
          />
          <button
            type="button"
            className="ad-btn"
            disabled={resource.loading || busy}
            onClick={resource.reload}
          >
            Làm mới
          </button>
        </div>

        {resource.loading || resource.error ? (
          <LoadState {...resource} />
        ) : (
          <>
            <div className="ad-table-wrap">
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>Người dùng</th>
                    <th>Email</th>
                    <th>Điện thoại</th>
                    <th>Vai trò</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="ad-person">
                          <span className="ad-avatar">
                            {String(user.fullname || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                          <strong className="ad-cell-title">
                            {user.fullname || "Chưa có tên"}
                          </strong>
                        </div>
                      </td>
                      <td>{user.email || "—"}</td>
                      <td className="ad-nowrap">{user.phone || "—"}</td>
                      <td>
                        <Badge dark={user.role === "admin"}>
                          {user.role === "admin"
                            ? "Quản trị viên"
                            : "Người dùng"}
                        </Badge>
                      </td>
                      <td>
                        <div className="ad-actions">
                          <button
                            className="ad-btn ad-btn-small"
                            type="button"
                            disabled={busy}
                            onClick={() => {
                              setEditing({
                                _id: user._id,
                                fullname: user.fullname || "",
                                email: user.email || "",
                                phone: String(user.phone || ""),
                              });
                              setError("");
                              setMessage("");
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                          >
                            Sửa
                          </button>
                          <button
                            className="ad-btn ad-btn-small ad-btn-danger"
                            type="button"
                            disabled={busy}
                            onClick={() => remove(user)}
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!result.rows.length && <EmptyRow columns={5} />}
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
