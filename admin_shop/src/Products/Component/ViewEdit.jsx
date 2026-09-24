import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import ProductAPI from "../../API/ProductAPI";

import {
  Page,
  Panel,
  Field,
  Notice,
  Picture,
  BackLink,
} from "../../components/AdminUI";

import { asList, amount, errorMessage } from "../../utils/admin";

export default function ViewEdit() {
  const history = useHistory();
  const { search } = useLocation();
  const productId = new URLSearchParams(search).get("id");

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    img1: "",
  });

  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setLoadError("");

      try {
        const [categoryData, product] = await Promise.all([
          ProductAPI.getCategories(),
          productId ? ProductAPI.getDetail(productId) : Promise.resolve(null),
        ]);

        if (!active) return;

        setCategories(asList(categoryData));

        if (productId) {
          if (!product?._id) {
            throw new Error("Không tìm thấy sản phẩm.");
          }

          setForm({
            name: product.name || "",
            price: amount(product.price),
            category:
              product.category && typeof product.category === "object"
                ? product.category._id || ""
                : product.category || "",
            description: product.description || "",
            img1: product.img1 || "",
          });
        }
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
  }, [productId]);

  useEffect(() => {
    if (!file) {
      setPreview(form.img1 || "");
      return undefined;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [file, form.img1]);

  const change = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const save = async (event) => {
    event.preventDefault();

    if (busy || loading || loadError) return;

    if (!form.name.trim() || !form.category) {
      setError("Vui lòng nhập tên sản phẩm và chọn danh mục.");
      return;
    }

    if (
      form.price === "" ||
      !Number.isFinite(Number(form.price)) ||
      Number(form.price) < 0
    ) {
      setError("Giá bán phải là số không âm.");
      return;
    }

    if (!productId && !file) {
      setError("Vui lòng chọn ảnh cho sản phẩm mới.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const body = new FormData();
      body.append("name", form.name.trim());
      body.append("price", String(form.price));
      body.append("category", form.category);
      body.append("description", form.description.trim());

      if (file) body.append("file", file);

      if (productId) {
        await ProductAPI.updateProduct(productId, body);
      } else {
        await ProductAPI.createProduct(body);
      }

      history.push("/products");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Page
      title={productId ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}
      subtitle="Hoàn thiện thông tin sản phẩm trước khi lưu."
      action={<BackLink to="/products" />}
    >
      <Notice>{loadError || error}</Notice>

      {loading ? (
        <Panel>
          <div className="ad-empty" role="status">
            Đang tải thông tin...
          </div>
        </Panel>
      ) : (
        <form onSubmit={save}>
          <div className="ad-split">
            <Panel title="Thông tin sản phẩm" subtitle="Tên, mô tả và giá bán">
              <div className="ad-panel-body">
                <div className="ad-form-grid">
                  <div className="ad-full">
                    <Field label="Tên sản phẩm">
                      <input
                        className="ad-input"
                        name="name"
                        value={form.name}
                        onChange={change}
                        placeholder="Ví dụ: Canon EOS R50"
                        required
                        disabled={busy || Boolean(loadError)}
                      />
                    </Field>
                  </div>

                  <Field label="Giá bán (VNĐ)">
                    <input
                      className="ad-input"
                      type="number"
                      min="0"
                      step="1"
                      name="price"
                      value={form.price}
                      onChange={change}
                      placeholder="0"
                      required
                      disabled={busy || Boolean(loadError)}
                    />
                  </Field>

                  <Field label="Danh mục">
                    <select
                      className="ad-select"
                      name="category"
                      value={form.category}
                      onChange={change}
                      required
                      disabled={busy || Boolean(loadError)}
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.category}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <div className="ad-full">
                    <Field label="Mô tả sản phẩm">
                      <textarea
                        className="ad-textarea"
                        name="description"
                        value={form.description}
                        onChange={change}
                        placeholder="Mô tả đặc điểm và thông tin sản phẩm..."
                        disabled={busy || Boolean(loadError)}
                      />
                    </Field>
                  </div>
                </div>
              </div>
            </Panel>

            <Panel
              title="Hình ảnh sản phẩm"
              subtitle="Ảnh đại diện hiển thị tại cửa hàng"
            >
              <div className="ad-panel-body">
                <Picture src={preview} alt={form.name} large />

                <Field label="Chọn hình ảnh">
                  <input
                    className="ad-file"
                    type="file"
                    accept="image/*"
                    disabled={busy || Boolean(loadError)}
                    onChange={(event) => {
                      setFile(event.target.files?.[0] || null);
                    }}
                  />
                </Field>

                <p className="ad-muted" style={{ marginTop: 12, fontSize: 12 }}>
                  {productId
                    ? "Không chọn ảnh mới sẽ giữ ảnh hiện tại."
                    : "Chọn ảnh rõ nét để khách hàng dễ xem sản phẩm."}
                </p>
              </div>
            </Panel>
          </div>

          <div className="ad-actions">
            <button
              type="submit"
              className="ad-btn ad-btn-primary"
              disabled={busy || loading || Boolean(loadError)}
            >
              {busy
                ? "Đang lưu..."
                : productId
                  ? "Lưu thay đổi"
                  : "Tạo sản phẩm"}
            </button>
            <BackLink to="/products">Hủy</BackLink>
          </div>
        </form>
      )}
    </Page>
  );
}
