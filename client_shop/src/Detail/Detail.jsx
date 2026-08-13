import React, { useCallback, useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import alertify from "alertifyjs";
import queryString from "query-string";

import ProductAPI from "../API/ProductAPI";
import CartAPI from "../API/CartAPI";
import CommentAPI from "../API/CommentAPI";

import { addCart } from "../Redux/Action/ActionCart";

import "./Detail.css";

function Detail() {
  const { id } = useParams();

  const dispatch = useDispatch();

  const guestUserId = useSelector((state) => state.Cart.id_user);

  const [detail, setDetail] = useState({});
  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);

  const [star, setStar] = useState(5);
  const [comment, setComment] = useState("");
  const [listComment, setListComment] = useState([]);

  const [activeTab, setActiveTab] = useState("description");

  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response = await ProductAPI.getDetail(id);

        setDetail(response || {});
      } catch (error) {
        console.error("Load product detail error:", error);

        setDetail({});
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [id]);

  const fetchComments = useCallback(async () => {
    try {
      const params = {
        idProduct: id,
      };

      const query = "?" + queryString.stringify(params);

      const response = await CommentAPI.getCommentProduct(query);

      setListComment(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Load reviews error:", error);

      setListComment([]);
    }
  }, [id]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);


  useEffect(() => {
    if (!detail?._id) {
      return;
    }

    let viewed = [];

    try {
      viewed = JSON.parse(localStorage.getItem("recently_viewed")) || [];
    } catch (error) {
      viewed = [];
    }

    viewed = viewed.filter((item) => item._id !== detail._id);

    viewed.unshift(detail);

    if (viewed.length > 5) {
      viewed = viewed.slice(0, 5);
    }

    localStorage.setItem("recently_viewed", JSON.stringify(viewed));
  }, [detail]);

  useEffect(() => {
    let viewed = [];

    try {
      viewed = JSON.parse(localStorage.getItem("recently_viewed")) || [];
    } catch (error) {
      viewed = [];
    }

    setRecentProducts(viewed.filter((item) => item._id !== id));
  }, [id, detail]);


  const categoryName =
    typeof detail.category === "object"
      ? detail.category?.category || detail.category?.name || "Camera"
      : detail.category || "Camera";


  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, Number(current) - 1));
  };

  const increaseQuantity = () => {
    setQuantity((current) => Number(current) + 1);
  };

  const handleQuantityChange = (event) => {
    const value = Number(event.target.value);

    if (Number.isInteger(value) && value >= 1) {
      setQuantity(value);
    }
  };


  const addToCart = async () => {
    if (!detail?._id) {
      alertify.set("notifier", "position", "bottom-left");

      alertify.error("Product not found.");

      return;
    }

    const sessionUserId = sessionStorage.getItem("id_user");

    const idUserCart = sessionUserId || guestUserId;

    const count = Number(quantity) || 1;

    const data = {
      idUser: idUserCart,
      idProduct: detail._id,
      nameProduct: detail.name,
      priceProduct: detail.price,
      count,
      img: detail.img1,
      description: detail.description,
    };

    try {
      if (sessionUserId) {
        const params = {
          idUser: sessionUserId,
          idProduct: detail._id,
          count,
        };

        const query = "?" + queryString.stringify(params);

        await CartAPI.postAddToCart(query);
      } else {
        dispatch(addCart(data));
      }

      alertify.set("notifier", "position", "bottom-left");

      alertify.success("Product added to cart successfully!");
    } catch (error) {
      console.error("Add to cart error:", error);

      alertify.set("notifier", "position", "bottom-left");

      alertify.error("Unable to add product to cart.");
    }
  };


  const handleComment = async () => {
    const sessionUserId = sessionStorage.getItem("id_user");

    const fullname = sessionStorage.getItem("name_user");

    if (!sessionUserId) {
      alertify.set("notifier", "position", "bottom-left");

      alertify.error("Please sign in before leaving a review.");

      return;
    }

    if (!comment.trim()) {
      alertify.set("notifier", "position", "bottom-left");

      alertify.error("Please enter your review.");

      return;
    }

    try {
      const params = {
        idProduct: id,
        idUser: sessionUserId,
        fullname: fullname || "User",
        content: comment.trim(),
        star,
      };

      const query = "?" + queryString.stringify(params);

      await CommentAPI.postCommentProduct(query);

      setComment("");
      setStar(5);

      await fetchComments();

      alertify.set("notifier", "position", "bottom-left");

      alertify.success("Your review has been submitted.");
    } catch (error) {
      console.error("Submit review error:", error);

      alertify.set("notifier", "position", "bottom-left");

      alertify.error("Unable to submit your review.");
    }
  };


  const renderReviewStars = (reviewItem) => {
    const rating = Number(reviewItem.star);

    return [1, 2, 3, 4, 5].map((value) => (
      <i
        key={value}
        className={value <= rating ? "fas fa-star" : "far fa-star"}
      />
    ));
  };

  const formatDate = (value) => {
    if (!value) {
      return "";
    }

    return new Date(value).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };


  if (loading) {
    return (
      <main className="detail-page">
        <div className="detail-loading">
          <div className="detail-loading-spinner" />

          <p>Loading product...</p>
        </div>
      </main>
    );
  }


  if (!detail?._id) {
    return (
      <main className="detail-page">
        <div className="shop-container">
          <div className="detail-not-found">
            <i className="fas fa-camera" />

            <h2>Product not found</h2>

            <p>The product you are looking for is no longer available.</p>

            <Link to="/shop" className="shop-btn shop-btn-primary">
              Back to Shop
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="detail-page">

      <section className="detail-heading">
        <div className="shop-container">
          <div className="detail-breadcrumb">
            <Link to="/">Home</Link>

            <i className="fas fa-chevron-right" />

            <Link to="/shop">Shop</Link>

            <i className="fas fa-chevron-right" />

            <span>{detail.name}</span>
          </div>
        </div>
      </section>

      <section className="detail-product-section">
        <div className="shop-container">
          <div className="detail-product-grid">

            <div className="detail-gallery">
              <Link to="/shop" className="detail-back-button">
                <i className="fas fa-arrow-left" />
                Back to Shop
              </Link>

              <div className="detail-main-image">
                {detail.img1 ? (
                  <img src={detail.img1} alt={detail.name} />
                ) : (
                  <div className="detail-image-placeholder">
                    <i className="fas fa-camera" />

                    <span>No image available</span>
                  </div>
                )}
              </div>
            </div>

            <div className="detail-information">
              <span className="detail-category">{categoryName}</span>

              <div className="detail-rating-row">
                <div className="detail-stars">
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                </div>

                <span>
                  {listComment.length}{" "}
                  {listComment.length === 1 ? "review" : "reviews"}
                </span>
              </div>

              <h1>{detail.name}</h1>

              <div className="detail-price">{detail.price}</div>

              <p className="detail-summary">
                {detail.description ||
                  "Discover this camera and explore its features, performance and creative possibilities."}
              </p>


              <div className="detail-benefits">
                <div>
                  <i className="fas fa-shield-alt" />

                  <span>Genuine product</span>
                </div>

                <div>
                  <i className="fas fa-shipping-fast" />

                  <span>Fast delivery</span>
                </div>

                <div>
                  <i className="fas fa-headset" />

                  <span>Customer support</span>
                </div>
              </div>


              <div className="detail-purchase">
                <div className="detail-quantity">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    aria-label="Decrease quantity"
                  >
                    <i className="fas fa-minus" />
                  </button>

                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={handleQuantityChange}
                  />

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    aria-label="Increase quantity"
                  >
                    <i className="fas fa-plus" />
                  </button>
                </div>

                <button
                  type="button"
                  className="detail-add-cart"
                  onClick={addToCart}
                >
                  <i className="fas fa-shopping-bag" />
                  Add to Cart
                </button>

                <button
                  type="button"
                  className="detail-wishlist"
                  aria-label="Add to wishlist"
                >
                  <i className="far fa-heart" />
                </button>
              </div>


              <div className="detail-meta">
                <div>
                  <span>Category</span>

                  <strong>{categoryName}</strong>
                </div>

                <div>
                  <span>Product ID</span>

                  <strong>{detail._id?.slice(-8).toUpperCase()}</strong>
                </div>

                <div>
                  <span>Availability</span>

                  <strong className="detail-stock">
                    <i className="fas fa-circle" />
                    In stock
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="detail-tabs-section">
        <div className="shop-container">
          <div className="detail-tabs">
            <button
              type="button"
              className={activeTab === "description" ? "active" : ""}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>

            <button
              type="button"
              className={activeTab === "reviews" ? "active" : ""}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews
              <span>{listComment.length}</span>
            </button>
          </div>

          {activeTab === "description" ? (
            <div className="detail-description-panel">
              <div>
                <span className="section-eyebrow">Product information</span>

                <h2>About this camera</h2>
              </div>

              <p>
                {detail.description ||
                  "No additional description is available for this product."}
              </p>
            </div>
          ) : (
            <div className="detail-reviews-layout">

              <div className="detail-review-list">
                <div className="detail-review-heading">
                  <div>
                    <span className="section-eyebrow">Customer feedback</span>

                    <h2>Reviews</h2>
                  </div>

                  <span className="detail-review-count">
                    {listComment.length}{" "}
                    {listComment.length === 1 ? "review" : "reviews"}
                  </span>
                </div>

                {listComment.length > 0 ? (
                  listComment.map((item) => (
                    <article className="detail-review-card" key={item._id}>
                      <div className="detail-review-avatar">
                        {item.fullname?.charAt(0)?.toUpperCase() || "U"}
                      </div>

                      <div className="detail-review-body">
                        <div className="detail-review-top">
                          <div>
                            <strong>{item.fullname || "Customer"}</strong>

                            <span>{formatDate(item.createdAt)}</span>
                          </div>

                          <div className="detail-review-stars">
                            {renderReviewStars(item)}
                          </div>
                        </div>

                        <p>{item.content}</p>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="detail-no-reviews">
                    <i className="far fa-comment-dots" />

                    <h3>No reviews yet</h3>

                    <p>
                      Be the first to share your experience with this product.
                    </p>
                  </div>
                )}
              </div>

              <aside className="detail-review-form">
                <span className="section-eyebrow">Share your experience</span>

                <h3>Write a review</h3>

                <p>Tell other customers what you think about this product.</p>

                <label>Your rating</label>

                <div className="detail-rating-picker">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      type="button"
                      key={value}
                      className={value <= star ? "active" : ""}
                      onClick={() => setStar(value)}
                      aria-label={`${value} stars`}
                    >
                      <i className="fas fa-star" />
                    </button>
                  ))}
                </div>

                <label htmlFor="reviewText">Your review</label>

                <textarea
                  id="reviewText"
                  rows="5"
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder="Write your review here..."
                />

                <button
                  type="button"
                  className="detail-submit-review"
                  onClick={handleComment}
                >
                  Submit Review
                </button>
              </aside>
            </div>
          )}
        </div>
      </section>


      {recentProducts.length > 0 && (
        <section className="detail-recent-section">
          <div className="shop-container">
            <div className="detail-section-heading">
              <div>
                <span className="section-eyebrow">Keep exploring</span>

                <h2>Recently viewed</h2>
              </div>

              <Link to="/shop">
                View all products
                <i className="fas fa-arrow-right" />
              </Link>
            </div>

            <div className="detail-recent-grid">
              {recentProducts.slice(0, 4).map((item) => (
                <article className="detail-recent-card" key={item._id}>
                  <Link
                    to={`/detail/${item._id}`}
                    className="detail-recent-image"
                  >
                    <img src={item.img1} alt={item.name} />
                  </Link>

                  <div className="detail-recent-info">
                    <Link to={`/detail/${item._id}`}>{item.name}</Link>

                    <strong>{item.price}</strong>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default Detail;
