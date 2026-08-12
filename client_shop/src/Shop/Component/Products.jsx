import React from "react";

import { Link } from "react-router-dom";

import "./Products.css";

function Products({ products = [] }) {

  if (!products.length) {
    return (
      <div className="shop-product-empty">
        <div className="shop-product-empty-icon">
          <i className="fas fa-camera" />
        </div>

        <h3>No products found</h3>

        <p>Try another category, search term or sorting option.</p>
      </div>
    );
  }

  return (
    <div className="shop-product-grid">
      {products.map((product) => (
        <article className="shop-product-card" key={product._id}>

          <div className="shop-product-image">
            <Link
              to={`/detail/${product._id}`}
              className="shop-product-image-link"
            >
              <img src={product.img1} alt={product.name || "Camera"} />
            </Link>

            <div className="shop-product-badge">Featured</div>

            <div className="shop-product-actions">
              <button type="button" aria-label="Add to wishlist">
                <i className="far fa-heart" />
              </button>

              <Link to={`/detail/${product._id}`} aria-label="View product">
                <i className="fas fa-eye" />
              </Link>
            </div>

            <Link
              to={`/detail/${product._id}`}
              className="shop-product-quick-view"
            >
              View Product
              <i className="fas fa-arrow-right" />
            </Link>
          </div>

          <div className="shop-product-info">
            <div className="shop-product-top">
              <span className="shop-product-category">Camera</span>

              <div className="shop-product-rating">
                <i className="fas fa-star" />

                <span>5.0</span>
              </div>
            </div>

            <Link to={`/detail/${product._id}`} className="shop-product-title">
              {product.name}
            </Link>

            <p className="shop-product-description">
              {product.description ||
                "Explore this camera and discover its features and performance."}
            </p>

            <div className="shop-product-footer">
              <span className="shop-product-price">{product.price}</span>

              <Link
                to={`/detail/${product._id}`}
                className="shop-product-arrow"
                aria-label="View details"
              >
                <i className="fas fa-arrow-right" />
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export default Products;
