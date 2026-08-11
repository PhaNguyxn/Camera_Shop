import React, { useCallback, useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import alertify from "alertifyjs";
import queryString from "query-string";

import ProductAPI from "../API/ProductAPI";
import CartAPI from "../API/CartAPI";
import CommentAPI from "../API/CommentAPI";

import { addCart } from "../Redux/Action/ActionCart";


const renderCommentStars = (commentItem) => {
  const rating = Number(commentItem.star);

  if (Number.isFinite(rating) && rating > 0) {
    return [1, 2, 3, 4, 5].map((starNumber) => (
      <li key={starNumber} className="list-inline-item m-0">
        <i
          className={
            starNumber <= rating
              ? "fas fa-star text-warning"
              : "far fa-star text-muted"
          }
        ></i>
      </li>
    ));
  }

  const legacyStars = [
    commentItem.star1,
    commentItem.star2,
    commentItem.star3,
    commentItem.star4,
    commentItem.star5,
  ];

  return legacyStars.map((starClass, index) => (
    <li key={index} className="list-inline-item m-0">
      <i className={starClass || "far fa-star text-muted"}></i>
    </li>
  ));
};

function Detail() {
  const { id } = useParams();

  const dispatch = useDispatch();

  const id_user = useSelector((state) => state.Cart.id_user);


  const [detail, setDetail] = useState({});

  const [text, setText] = useState(1);

  const [star, setStar] = useState(1);

  const [comment, setComment] = useState("");

  const [listComment, setListComment] = useState([]);

  const [review, setReview] = useState("description");

  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await ProductAPI.getDetail(id);

        setDetail(response || {});
      } catch (error) {
        console.error("Load product detail error:", error);
      }
    };

    fetchProductDetail();
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
      console.error("Load comments error:", error);

      setListComment([]);
    }
  }, [id]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const onChangeStar = (e) => {
    const value = Number(e.target.value);

    if (value >= 1 && value <= 5) {
      setStar(value);
    }
  };

  const onChangeComment = (e) => {
    setComment(e.target.value);
  };


  const handlerComment = async () => {
    const sessionUserId = sessionStorage.getItem("id_user");

    const fullname = sessionStorage.getItem("name_user");

    if (!sessionUserId) {
      alertify.set("notifier", "position", "bottom-left");

      alertify.error("Vui Lòng Kiểm Tra Đăng Nhập!");

      return;
    }

    if (!comment.trim()) {
      alertify.set("notifier", "position", "bottom-left");

      alertify.error("Vui lòng nhập nội dung bình luận!");

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

      setStar(1);

      await fetchComments();

      alertify.set("notifier", "position", "bottom-left");

      alertify.success("Bình luận thành công!");
    } catch (error) {
      console.error("Send comment error:", error);

      alertify.set("notifier", "position", "bottom-left");

      alertify.error("Gửi bình luận thất bại!");
    }
  };

  const onChangeText = (e) => {
    const value = e.target.value;

    if (value === "") {
      setText("");

      return;
    }

    const numberValue = Number(value);

    if (Number.isInteger(numberValue) && numberValue >= 1) {
      setText(numberValue);
    }
  };

  const upText = () => {
    const current = Number(text) || 1;

    setText(current + 1);
  };

  const downText = () => {
    const current = Number(text) || 1;

    if (current <= 1) {
      return;
    }

    setText(current - 1);
  };

  const addToCart = async () => {
    if (!detail || !detail._id) {
      alertify.set("notifier", "position", "bottom-left");

      alertify.error("Không tìm thấy sản phẩm!");

      return;
    }

    const sessionUserId = sessionStorage.getItem("id_user");

    const idUserCart = sessionUserId || id_user;

    const count = Number(text) || 1;

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
      }
      else {
        const action = addCart(data);

        dispatch(action);
      }

      alertify.set("notifier", "position", "bottom-left");

      alertify.success("Bạn Đã Thêm Hàng Thành Công!");
    } catch (error) {
      console.error("Add to cart error:", error);

      alertify.set("notifier", "position", "bottom-left");

      alertify.error("Thêm sản phẩm thất bại!");
    }
  };

  const handlerReview = (value) => {
    setReview(value);
  };

  useEffect(() => {
    if (!detail || !detail._id) {
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

    const filtered = viewed.filter((item) => item._id !== id);

    setRecentProducts(filtered);
  }, [id, detail]);

  const categoryName =
    typeof detail.category === "object"
      ? detail.category?.category || detail.category?.name || ""
      : detail.category || "";


  return (
    <section className="py-5">
      <div className="container">

        <div className="row mb-5">

          <div className="col-lg-6">
            <div
              className="row m-sm-0"
              style={{
                position: "relative",
              }}
            >

              <Link
                to="/shop"
                className="back-button-circle"
                style={{
                  position: "absolute",

                  top: "-50px",

                  left: "-25px",

                  zIndex: 100,

                  cursor: "pointer",

                  width: "42px",

                  height: "42px",

                  backgroundColor: "rgba(255, 255, 255, 0.9)",

                  borderRadius: "50%",

                  display: "flex",

                  alignItems: "center",

                  justifyContent: "center",

                  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",

                  border: "1px solid #ddd",

                  textDecoration: "none",
                }}
                aria-label="Back to shop"
              >
                <i
                  className="fas fa-chevron-left"
                  style={{
                    color: "#333",

                    fontSize: "18px",
                  }}
                ></i>
              </Link>

              <div
                id="carouselExampleControls"
                className="carousel slide col-sm-10 order-1 order-sm-2"
                data-ride="carousel"
              >
                <div className="carousel-inner owl-carousel product-slider">
                  <div className="carousel-item active">
                    {detail.img1 && (
                      <img
                        className="d-block w-100"
                        src={detail.img1}
                        alt={detail.name || "Product"}
                      />
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  className="carousel-control-prev"
                  data-target="#carouselExampleControls"
                  data-slide="prev"
                  aria-label="Previous image"
                >
                  <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                  ></span>

                  <span className="sr-only">Previous</span>
                </button>

                <button
                  type="button"
                  className="carousel-control-next"
                  data-target="#carouselExampleControls"
                  data-slide="next"
                  aria-label="Next image"
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>

                  <span className="sr-only">Next</span>
                </button>
              </div>
            </div>
          </div>

          <div className="col-lg-6">

            <ul className="list-inline mb-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <li key={value} className="list-inline-item m-0">
                  <i className="fas fa-star small text-warning"></i>
                </li>
              ))}
            </ul>

            <h1>{detail.name}</h1>

            <p className="text-muted lead">{detail.price}</p>

            <p className="text-small mb-4">
              {detail.description || "No description available."}
            </p>

            <div className="row align-items-stretch mb-4">
              <div className="col-sm-5 pr-sm-0">
                <div className="border d-flex align-items-center justify-content-between py-1 px-3 bg-white border-white">
                  <span className="small text-uppercase text-gray mr-4 no-select">
                    Quantity
                  </span>

                  <div className="quantity">
                    <button
                      type="button"
                      className="dec-btn p-0"
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={downText}
                      aria-label="Decrease quantity"
                    >
                      <i className="fas fa-caret-left"></i>
                    </button>

                    <input
                      className="form-control border-0 shadow-0 p-0"
                      type="number"
                      min="1"
                      value={text}
                      onChange={onChangeText}
                      aria-label="Product quantity"
                    />

                    <button
                      type="button"
                      className="inc-btn p-0"
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={upText}
                      aria-label="Increase quantity"
                    >
                      <i className="fas fa-caret-right"></i>
                    </button>
                  </div>
                </div>
              </div>


              <div className="col-sm-3 pl-sm-0">
                <button
                  type="button"
                  className="btn btn-dark btn-sm btn-block d-flex align-items-center justify-content-center px-0 text-white"
                  onClick={addToCart}
                >
                  Add to cart
                </button>
              </div>


              <button type="button" className="btn btn-link text-dark p-1 mb-4">
                <i className="far fa-heart mr-2"></i>
                Add to wish list
              </button>

              <br />


              <ul className="list-unstyled small d-inline-block">
                <li className="px-3 py-2 mb-1 bg-white">
                  <strong className="text-uppercase">SKU:</strong>

                  <span className="ml-2 text-muted">039</span>
                </li>

                <li className="px-3 py-2 mb-1 bg-white text-muted">
                  <strong className="text-uppercase text-dark">
                    Category:
                  </strong>

                  <span className="ml-2">{categoryName || "N/A"}</span>
                </li>

                <li className="px-3 py-2 mb-1 bg-white text-muted">
                  <strong className="text-uppercase text-dark">Tags:</strong>

                  <span className="ml-2">Innovation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="comment">Comment:</label>

          <textarea
            id="comment"
            className="form-control"
            rows="3"
            onChange={onChangeComment}
            value={comment}
          ></textarea>
        </div>

        <div className="d-flex justify-content-between">

          <div className="d-flex w-25">
            <label htmlFor="star" className="mt-2">
              Evaluate:
            </label>
            &nbsp; &nbsp;
            <input
              id="star"
              className="form-control w-25"
              type="number"
              min="1"
              max="5"
              value={star}
              onChange={onChangeStar}
            />
            &nbsp; &nbsp;
            <span className="mt-2">Star</span>
          </div>

          <div>
            <button
              type="button"
              className="btn btn-dark btn-sm btn-block px-0 text-white"
              style={{
                width: "12rem",
              }}
              onClick={handlerComment}
            >
              Send
            </button>
          </div>
        </div>

        <br />


        <ul className="nav nav-tabs border-0">

          <li className="nav-item">
            <button
              type="button"
              className="nav-link fix_comment border-0"
              onClick={() => handlerReview("description")}
              style={
                review === "description"
                  ? {
                      backgroundColor: "#383838",

                      color: "#ffffff",
                    }
                  : {
                      backgroundColor: "transparent",

                      color: "#383838",
                    }
              }
            >
              Description
            </button>
          </li>

          <li className="nav-item">
            <button
              type="button"
              className="nav-link fix_comment border-0"
              onClick={() => handlerReview("review")}
              style={
                review === "review"
                  ? {
                      backgroundColor: "#383838",

                      color: "#ffffff",
                    }
                  : {
                      backgroundColor: "transparent",

                      color: "#383838",
                    }
              }
            >
              Reviews
            </button>
          </li>
        </ul>

        <div className="tab-content mb-5">
          {review === "description" ? (
            <div className="tab-pane fade show active">
              <div className="p-4 p-lg-5 bg-white">
                <h6 className="text-uppercase">Product description</h6>

                <p className="text-muted text-small mb-0">
                  {detail.description || "No description available."}
                </p>
              </div>
            </div>
          ) : (
            <div className="tab-pane fade show active">
              <div className="p-4 p-lg-5 bg-white">
                <div className="row">
                  <div className="col-lg-8">
                    {listComment.length > 0 ? (
                      listComment.map((value) => (
                        <div className="media mb-3" key={value._id}>
                          <img
                            className="rounded-circle"
                            src="https://img.icons8.com/color/36/000000/administrator-male.png"
                            alt="User avatar"
                            width="50"
                          />

                          <div className="media-body ml-3">
                            <h6 className="mb-0 text-uppercase">
                              {value.fullname}
                            </h6>

                            <p className="small text-muted mb-0 text-uppercase">
                              {value.createdAt
                                ? new Date(value.createdAt).toLocaleDateString(
                                    "vi-VN",
                                  )
                                : ""}
                            </p>

                            <ul className="list-inline mb-1 text-xs">
                              {renderCommentStars(value)}
                            </ul>

                            <p className="text-small mb-0 text-muted">
                              {value.content}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted">Chưa có đánh giá nào.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>


        <div className="mt-5">
          <h5 className="text-uppercase mb-4">Recently Viewed</h5>

          <div className="row">
            {recentProducts.length > 0 ? (
              recentProducts.map((item) => (
                <div className="col-lg-3 col-md-4 col-6 mb-4" key={item._id}>
                  <div className="card border-0 shadow-sm h-100">
                    <Link to={`/detail/${item._id}`}>
                      <img
                        src={item.img1}
                        className="card-img-top"
                        style={{
                          height: "200px",

                          objectFit: "cover",
                        }}
                        alt={item.name}
                      />
                    </Link>

                    <div className="card-body p-2">
                      <h6
                        style={{
                          fontSize: "14px",
                        }}
                      >
                        {item.name}
                      </h6>

                      <p className="text-danger mb-0">{item.price}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <p className="text-muted">Chưa có sản phẩm nào</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Detail;
