import React from "react";
import { Link } from "react-router-dom";
import ChatIcon from "./ChatIcon";
import { formatPrice } from "./chatUtils";

export default function ChatProducts({
  products,
  addingId,
  onAddToCart,
  onNavigate,
}) {
  return (
    <div className="csai-products">
      <span className="csai-product-label">SẢN PHẨM GỢI Ý</span>
      {products
        .filter((product) => product && (product._id || product.id))
        .map((product) => {
          const id = product._id || product.id;
          return (
            <article className="csai-product" key={id}>
              <Link
                className="csai-product-image"
                to={`/detail/${id}`}
                onClick={onNavigate}
                aria-label={`Xem ${product.name}`}
              >
                {product.img1 ? (
                  <img
                    src={product.img1}
                    alt={product.name || "Sản phẩm"}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <ChatIcon size={28} />
                )}
              </Link>
              <div className="csai-product-info">
                <Link to={`/detail/${id}`} onClick={onNavigate}>
                  {product.name}
                </Link>
                <strong>{formatPrice(product.price)}</strong>
                <button
                  type="button"
                  disabled={addingId !== null}
                  onClick={() => onAddToCart(product)}
                >
                  <ChatIcon name="plus" size={14} />
                  {addingId === id ? "Đang thêm…" : "Thêm vào giỏ"}
                </button>
              </div>
            </article>
          );
        })}
    </div>
  );
}
