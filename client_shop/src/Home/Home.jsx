import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import ProductAPI from "../API/ProductAPI";

import Image from "../Share/img/Image";

import alertify from "alertifyjs";

import { getWishlist, toggleWishlist } from "../utils/wishlist";

import "./Home.css";

function Home() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [subscribeEmail, setSubscribeEmail] = useState("");

  const [subscribeMessage, setSubscribeMessage] = useState("");

  const [favoriteIds, setFavoriteIds] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        setError("");

        const response = await ProductAPI.getAPI();

        const productList = Array.isArray(response) ? response.slice(0, 8) : [];

        setProducts(productList);
      } catch (error) {
        console.error("Load home products error:", error);

        setProducts([]);

        setError("Unable to load products at the moment.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();

    const email = subscribeEmail.trim();

    if (!email) {
      setSubscribeMessage("Please enter your email address.");

      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setSubscribeMessage("Please enter a valid email address.");

      return;
    }

    setSubscribeMessage("Thanks for subscribing!");

    setSubscribeEmail("");
  };

  const categories = [
    {
      id: 1,
      title: "Mirrorless",
      subtitle: "Explore",
      image: Image.img1,
    },

    {
      id: 2,
      title: "Film Camera",
      subtitle: "Classic photography",
      image: Image.img2,
    },

    {
      id: 3,
      title: "Action Camera",
      subtitle: "Capture adventures",
      image: Image.img4,
    },

    {
      id: 4,
      title: "Compact",
      subtitle: "Travel light",
      image: Image.img3,
    },

    {
      id: 5,
      title: "DSLR",
      subtitle: "Professional gear",
      image: Image.img5,
    },
  ];

  const refreshWishlist = () => {
    const wishlist = getWishlist();

    setFavoriteIds(wishlist.map((item) => String(item._id)));
  };

  useEffect(() => {
    refreshWishlist();

    const handleUpdate = () => {
      refreshWishlist();
    };

    window.addEventListener("wishlistUpdated", handleUpdate);

    return () => {
      window.removeEventListener("wishlistUpdated", handleUpdate);
    };
  }, []);

  const handleWishlist = (product) => {
    const result = toggleWishlist(product);

    refreshWishlist();

    alertify.set("notifier", "position", "bottom-left");

    if (result.added) {
      alertify.success("Đã thêm sản phẩm vào danh sách yêu thích!");
    } else {
      alertify.success("Đã xóa sản phẩm khỏi danh sách yêu thích!");
    }
  };

  return (
    <main className="home-page">
      {products.map((product) => (
        <div
          className="modal fade"
          id={`product_${product._id}`}
          tabIndex="-1"
          role="dialog"
          aria-hidden="true"
          key={`modal-${product._id}`}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            role="document"
          >
            <div className="modal-content home-product-modal">
              <div className="modal-body p-0">
                <div className="row no-gutters align-items-stretch">
                  <div className="col-lg-6">
                    <div className="home-modal-image">
                      <img
                        src={product.img1}
                        alt={product.name || "Camera product"}
                      />
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <button
                      type="button"
                      className="close home-modal-close"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">×</span>
                    </button>

                    <div className="home-modal-content">
                      <div className="home-modal-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <i className="fas fa-star" key={star} />
                        ))}
                      </div>

                      <span className="home-modal-label">Featured camera</span>

                      <h2>{product.name}</h2>

                      <div className="home-modal-price">{product.price}</div>

                      <p className="home-modal-description">
                        {product.description ||
                          "Discover this camera and explore its features, specifications and performance."}
                      </p>

                      <div className="home-modal-actions">
                        <Link
                          to={`/detail/${product._id}`}
                          className="shop-btn shop-btn-primary"
                          data-dismiss="modal"
                        >
                          View Product
                          <i className="fas fa-arrow-right ml-2" />
                        </Link>

                        <button
                          type="button"
                          className={`home-modal-wishlist ${
                            favoriteIds.includes(String(product._id))
                              ? "active"
                              : ""
                          }`}
                          onClick={() => handleWishlist(product)}
                          aria-label={
                            favoriteIds.includes(String(product._id))
                              ? "Remove from wishlist"
                              : "Add to wishlist"
                          }
                        >
                          <i
                            className={
                              favoriteIds.includes(String(product._id))
                                ? "fas fa-heart"
                                : "far fa-heart"
                            }
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <section
        className="camera-hero"
        style={{
          backgroundImage: `url(${Image.banner})`,
        }}
      >
        <div className="camera-hero-overlay" />

        <div className="shop-container camera-hero-inner">
          <div className="camera-hero-content">
            <span className="camera-hero-eyebrow">
              Professional Photography Gear
            </span>

            <h1>
              Capture Every
              <span> Moment.</span>
            </h1>

            <p>
              Discover cameras and photography gear designed for creators,
              travelers and professionals.
            </p>

            <div className="camera-hero-actions">
              <Link to="/shop" className="shop-btn shop-btn-primary">
                Shop Cameras
                <i className="fas fa-arrow-right ml-2" />
              </Link>

              <a href="#categories" className="shop-btn shop-btn-outline">
                Explore Collections
              </a>
            </div>

            <div className="camera-hero-features">
              <span>
                <i className="fas fa-check" />
                Genuine products
              </span>

              <span>
                <i className="fas fa-check" />
                Secure shopping
              </span>

              <span>
                <i className="fas fa-check" />
                Expert support
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="shop-section home-category-section" id="categories">
        <div className="shop-container">
          <div className="home-section-heading">
            <div>
              <div className="section-eyebrow">Find your perfect camera</div>

              <h2 className="section-title">Shop by category</h2>

              <p className="section-description">
                Explore cameras designed for every shooting style, from everyday
                photography to professional work.
              </p>
            </div>

            <Link to="/shop" className="home-view-all">
              View all products
              <i className="fas fa-arrow-right" />
            </Link>
          </div>

          <div className="row">
            {categories.map((category, index) => (
              <div
                className={
                  index < 3
                    ? "col-lg-4 col-md-6 mb-4"
                    : "col-lg-6 col-md-6 mb-4"
                }
                key={category.id}
              >
                <Link
                  className="camera-category-card"
                  to={`/shop?category=${encodeURIComponent(category.title)}`}
                >
                  <img src={category.image} alt={`${category.title} cameras`} />

                  <div className="camera-category-overlay" />

                  <div className="camera-category-content">
                    <span>{category.subtitle}</span>

                    <h3>{category.title}</h3>

                    <div>
                      Shop now
                      <i className="fas fa-arrow-right ml-2" />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="shop-section home-products-section">
        <div className="shop-container">
          <div className="home-section-heading">
            <div>
              <div className="section-eyebrow">Customer favorites</div>

              <h2 className="section-title">Trending cameras</h2>

              <p className="section-description">
                Explore the cameras our customers are choosing for everyday
                moments and professional work.
              </p>
            </div>

            <Link to="/shop" className="home-view-all">
              Shop all
              <i className="fas fa-arrow-right" />
            </Link>
          </div>

          {loading && (
            <div className="home-products-loading">
              <div className="home-products-spinner" />

              <p>Loading products...</p>
            </div>
          )}

          {!loading && error && (
            <div className="home-products-empty">
              <i className="fas fa-exclamation-circle" />

              <h4>Products unavailable</h4>

              <p>{error}</p>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="row">
              {products.map((product) => (
                <div
                  className="col-xl-3 col-lg-4 col-sm-6 mb-4"
                  key={product._id}
                >
                  <article className="camera-product-card">
                    <div className="camera-product-image">
                      <Link to={`/detail/${product._id}`}>
                        <img
                          src={product.img1}
                          alt={product.name || "Camera"}
                        />
                      </Link>

                      <span className="camera-product-badge">Popular</span>

                      <div className="camera-product-actions">
                        <button
                          type="button"
                          className={`home-product-favorite ${
                            favoriteIds.includes(String(product._id))
                              ? "active"
                              : ""
                          }`}
                          onClick={() => handleWishlist(product)}
                          aria-label={
                            favoriteIds.includes(String(product._id))
                              ? "Remove from wishlist"
                              : "Add to wishlist"
                          }
                        >
                          <i
                            className={
                              favoriteIds.includes(String(product._id))
                                ? "fas fa-heart"
                                : "far fa-heart"
                            }
                          />
                        </button>

                        <button
                          type="button"
                          data-toggle="modal"
                          data-target={`#product_${product._id}`}
                          aria-label={`Quick view ${product.name || "product"}`}
                        >
                          <i className="fas fa-expand" />
                        </button>
                      </div>
                    </div>

                    <div className="camera-product-info">
                      <div className="camera-product-rating">
                        <i className="fas fa-star" />
                        <i className="fas fa-star" />
                        <i className="fas fa-star" />
                        <i className="fas fa-star" />
                        <i className="fas fa-star" />
                      </div>

                      <Link
                        to={`/detail/${product._id}`}
                        className="camera-product-name"
                      >
                        {product.name}
                      </Link>

                      <div className="camera-product-bottom">
                        <span className="camera-product-price">
                          {product.price}
                        </span>

                        <Link
                          to={`/detail/${product._id}`}
                          className="camera-product-cart"
                          aria-label={`View ${product.name || "product"}`}
                        >
                          <i className="fas fa-arrow-right" />
                        </Link>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="home-products-empty">
              <i className="fas fa-camera" />

              <h4>No products available</h4>

              <p>New products will appear here soon.</p>

              <Link to="/shop" className="shop-btn shop-btn-primary">
                Browse Shop
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="home-promo-section">
        <div className="shop-container">
          <div className="home-promo">
            <div className="home-promo-content">
              <span className="section-eyebrow">Find the right gear</span>

              <h2>Built for every creative journey.</h2>

              <p>
                Whether you are starting photography or upgrading your
                professional setup, find the gear that matches your vision.
              </p>

              <Link to="/shop" className="shop-btn home-promo-button">
                Explore Cameras
                <i className="fas fa-arrow-right ml-2" />
              </Link>
            </div>

            <div className="home-promo-decoration">
              <i className="fas fa-camera-retro" />
            </div>
          </div>
        </div>
      </section>

      <section className="home-benefits">
        <div className="shop-container">
          <div className="home-benefit-grid">
            <div className="home-benefit">
              <div className="home-benefit-icon">
                <i className="fas fa-shipping-fast" />
              </div>

              <div>
                <h4>Fast delivery</h4>

                <p>Reliable delivery for every order.</p>
              </div>
            </div>

            <div className="home-benefit">
              <div className="home-benefit-icon">
                <i className="fas fa-shield-alt" />
              </div>

              <div>
                <h4>Genuine products</h4>

                <p>Carefully selected camera equipment.</p>
              </div>
            </div>

            <div className="home-benefit">
              <div className="home-benefit-icon">
                <i className="fas fa-headset" />
              </div>

              <div>
                <h4>Expert support</h4>

                <p>Get help choosing the right camera.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="shop-section home-newsletter-section">
        <div className="shop-container">
          <div className="home-newsletter">
            <div className="home-newsletter-content">
              <span className="section-eyebrow">Stay inspired</span>

              <h2>Join our camera community.</h2>

              <p>
                Subscribe for product updates, photography tips and exclusive
                offers.
              </p>
            </div>

            <div className="home-newsletter-form-wrapper">
              <form className="home-newsletter-form" onSubmit={handleSubscribe}>
                <div className="home-newsletter-input">
                  <i className="far fa-envelope" />

                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={subscribeEmail}
                    onChange={(e) => setSubscribeEmail(e.target.value)}
                    aria-label="Email address"
                  />
                </div>

                <button type="submit" className="shop-btn shop-btn-primary">
                  Subscribe
                </button>
              </form>

              {subscribeMessage && (
                <p className="home-subscribe-message">{subscribeMessage}</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
