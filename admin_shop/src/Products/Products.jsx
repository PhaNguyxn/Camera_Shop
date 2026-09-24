import React, { useState } from "react";
import { Link } from "react-router-dom";
import ProductAPI from "../API/ProductAPI";

import {
  Page,
  Panel,
  Search,
  Pager,
  LoadState,
  Notice,
  EmptyRow,
  Picture,
  Icon,
} from "../components/AdminUI";

import {
  asList,
  money,
  matches,
  paginate,
  useResource,
  errorMessage,
} from "../utils/admin";


function resolveCategoryName(category, categoryMap) {
  if (!category) {
    return "Chưa phân loại";
  }

  if (typeof category === "object") {
    const name = category.category || category.name;

    if (typeof name === "string" && name.trim()) {
      return name.trim();
    }

    return categoryMap.get(String(category._id || "")) || "Chưa xác định";
  }

  const value = String(category).trim();

  if (!value) {
    return "Chưa phân loại";
  }

  const matchedName = categoryMap.get(value);

  if (matchedName) {
    return matchedName;
  }

  if (/^[a-f\d]{24}$/i.test(value)) {
    return "Chưa xác định";
  }

  return value;
}

async function loadProducts() {
  const [productsResponse, categoriesResponse] = await Promise.all([
    ProductAPI.getAPI(),
    ProductAPI.getCategories(),
  ]);

  const products = asList(productsResponse);
  const categories = asList(categoriesResponse);

  const categoryMap = new Map(
    categories.map((category) => [
      String(category._id),
      category.category || category.name || "Chưa xác định",
    ]),
  );

  return products.map((product) => ({
    ...product,
    displayCategory: resolveCategoryName(product.category, categoryMap),
  }));
}

export default function Products() {
  const resource = useResource(loadProducts);

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  const products = resource.data || [];

  const filtered = products.filter((product) =>
    matches(query, product.name, product.displayCategory),
  );

  const result = paginate(filtered, page);

  const remove = async (product) => {
    if (busyId) return;

    if (!window.confirm(`Xóa sản phẩm "${product.name}"?`)) {
      return;
    }

    setBusyId(product._id);
    setError("");

    try {
      await ProductAPI.deleteProduct(product._id);
      resource.reload();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusyId("");
    }
  };

  return (
    <Page
      title="Sản phẩm"
      subtitle="Quản lý sản phẩm, giá bán và hình ảnh của cửa hàng."
      action={
        <Link className="ad-btn ad-btn-primary" to="/products/view-edit">
          <Icon name="plus" size={16} />
          Thêm sản phẩm
        </Link>
      }
    >
      <Notice>{error}</Notice>

      <Panel
        title="Danh sách sản phẩm"
        subtitle={`${products.length} sản phẩm`}
      >
        <div className="ad-toolbar">
          <Search
            value={query}
            placeholder="Tìm tên sản phẩm hoặc danh mục..."
            onChange={(value) => {
              setQuery(value);
              setPage(1);
            }}
          />

          <button
            className="ad-btn"
            type="button"
            disabled={resource.loading || Boolean(busyId)}
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
                    <th>Sản phẩm</th>
                    <th>Danh mục</th>
                    <th>Giá bán</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>

                <tbody>
                  {result.rows.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <div className="ad-product-cell">
                          <Picture src={product.img1} alt={product.name} />

                          <div>
                            <Link
                              className="ad-cell-title"
                              to={`/products/view-edit?id=${product._id}`}
                            >
                              {product.name}
                            </Link>

                            <span className="ad-cell-sub">{product._id}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="ad-badge">
                          {product.displayCategory}
                        </span>
                      </td>

                      <td className="ad-nowrap">
                        <strong>{money(product.price)}</strong>
                      </td>

                      <td>
                        <div className="ad-actions">
                          <Link
                            className="ad-btn ad-btn-small"
                            to={`/products/view-edit?id=${product._id}`}
                          >
                            Chỉnh sửa
                          </Link>

                          <button
                            className="ad-btn ad-btn-small ad-btn-danger"
                            type="button"
                            disabled={Boolean(busyId)}
                            onClick={() => remove(product)}
                          >
                            {busyId === product._id ? "Đang xóa..." : "Xóa"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {!result.rows.length && <EmptyRow columns={4} />}
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
