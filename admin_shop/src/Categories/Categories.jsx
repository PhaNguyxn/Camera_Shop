import React, { useState } from "react";
import { Link } from "react-router-dom";
import ProductAPI from "../API/ProductAPI";

import {
  Page,
  Panel,
  Search,
  Pager,
  Notice,
  LoadState,
  EmptyRow,
  Icon,
} from "../components/AdminUI";

import {
  asList,
  matches,
  paginate,
  useResource,
  errorMessage,
} from "../utils/admin";

const loadCategories = async () => asList(await ProductAPI.getCategories());

export default function Categories() {
  const resource = useResource(loadCategories);

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  const categories = resource.data || [];
  const filtered = categories.filter((category) =>
    matches(query, category.category, category._id),
  );
  const result = paginate(filtered, page);

  const remove = async (category) => {
    if (!window.confirm(`Xóa danh mục "${category.category}"?`)) return;

    setBusyId(category._id);
    setError("");

    try {
      await ProductAPI.deleteCategory(category._id);
      resource.reload();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusyId("");
    }
  };

  return (
    <Page
      title="Danh mục"
      subtitle="Tổ chức sản phẩm thành các nhóm dễ tìm kiếm."
      action={
        <Link className="ad-btn ad-btn-primary" to="/categories/view-edit">
          <Icon name="plus" size={16} />
          Thêm danh mục
        </Link>
      }
    >
      <Notice>{error}</Notice>

      <Panel
        title="Danh sách danh mục"
        subtitle={`${categories.length} danh mục`}
      >
        <div className="ad-toolbar">
          <Search
            value={query}
            placeholder="Tìm tên hoặc mã danh mục..."
            onChange={(value) => {
              setQuery(value);
              setPage(1);
            }}
          />
          <button
            type="button"
            className="ad-btn"
            disabled={resource.loading}
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
                    <th>Danh mục</th>
                    <th>Mã danh mục</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((category) => (
                    <tr key={category._id}>
                      <td>
                        <div className="ad-person">
                          <span className="ad-avatar">
                            <Icon name="layers" size={17} />
                          </span>
                          <strong>{category.category}</strong>
                        </div>
                      </td>

                      <td>{category._id}</td>

                      <td>
                        <div className="ad-actions">
                          <Link
                            className="ad-btn ad-btn-small"
                            to={`/categories/view-edit?id=${category._id}`}
                          >
                            Chỉnh sửa
                          </Link>

                          <button
                            type="button"
                            className="ad-btn ad-btn-small ad-btn-danger"
                            disabled={Boolean(busyId)}
                            onClick={() => remove(category)}
                          >
                            {busyId === category._id ? "Đang xóa..." : "Xóa"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!result.rows.length && <EmptyRow columns={3} />}
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
