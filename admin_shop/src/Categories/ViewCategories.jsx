import React, { useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import ProductAPI from "../API/ProductAPI";

import { Page, Panel, Field, Notice, BackLink } from "../components/AdminUI";

import { errorMessage } from "../utils/admin";

export default function ViewCategories() {
  const history = useHistory();

  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const { search } = useLocation();
  const categoryId = new URLSearchParams(search).get("id");

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(Boolean(categoryId));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!categoryId) return undefined;

    let active = true;

    async function load() {
      try {
        const category = await ProductAPI.getDetailCategory(categoryId);

        if (!category?._id) {
          throw new Error("Không tìm thấy danh mục.");
        }

        if (active) setName(category.category || "");
      } catch (err) {
        if (active) setLoadError(errorMessage(err));
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [categoryId]);

  const save = async (event) => {
    event.preventDefault();

    if (busy || loading || loadError) return;

    if (!name.trim()) {
      setError("Vui lòng nhập tên danh mục.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const body = { category: name.trim() };

      if (categoryId) {
        await ProductAPI.updateCategory(categoryId, body);
      } else {
        await ProductAPI.createCategory(body);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(errorMessage(err));
      }

      return;
    } finally {
      if (mountedRef.current) {
        setBusy(false);
      }
    }
    
    if (mountedRef.current) {
      history.push("/categories");
    }
  };

  return (
    <Page
      title={categoryId ? "Chỉnh sửa danh mục" : "Thêm danh mục"}
      subtitle="Đặt tên rõ ràng để khách hàng dễ tìm sản phẩm."
      action={<BackLink to="/categories" />}
    >
      <Notice>{loadError || error}</Notice>

      <div style={{ maxWidth: 760 }}>
        <Panel title="Thông tin danh mục" subtitle="Thông tin cơ bản">
          {loading ? (
            <div className="ad-empty" role="status">
              Đang tải danh mục...
            </div>
          ) : (
            <form className="ad-panel-body" onSubmit={save}>
              <Field
                label="Tên danh mục"
                hint="Ví dụ: Máy ảnh, Ống kính, Phụ kiện."
              >
                <input
                  className="ad-input"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Nhập tên danh mục"
                  required
                  disabled={busy || Boolean(loadError)}
                />
              </Field>

              <div className="ad-form-footer">
                <BackLink to="/categories">Hủy</BackLink>

                <button
                  className="ad-btn ad-btn-primary"
                  type="submit"
                  disabled={busy || Boolean(loadError)}
                >
                  {busy
                    ? "Đang lưu..."
                    : categoryId
                      ? "Lưu thay đổi"
                      : "Tạo danh mục"}
                </button>
              </div>
            </form>
          )}
        </Panel>
      </div>
    </Page>
  );
}
