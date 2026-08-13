import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import alertify from "alertifyjs";
import queryString from "query-string";

import CartAPI from "../API/CartAPI";

import { addCart } from "../Redux/Action/ActionCart";

import { getWishlist, removeFromWishlist } from "../utils/wishlist";

import "./Wishlist.css";

function Wishlist() {
  const dispatch = useDispatch();

  const guestUserId = useSelector((state) => state.Cart.id_user);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(getWishlist());
  }, []);


  const handleRemove = (productId) => {
    const updated = removeFromWishlist(productId);

    setProducts(updated);

    alertify.set("notifier", "position", "bottom-left");

    alertify.success("Đã xóa sản phẩm khỏi danh sách yêu thích!");
  };

  const handleAddToCart = async (product) => {
    const sessionUserId = sessionStorage.getItem("id_user");

    try {
      if (sessionUserId) {
        const params = {
          idUser: sessionUserId,

          idProduct: product._id,

          count: 1,
        };

        const query = "?" + queryString.stringify(params);

        await CartAPI.postAddToCart(query);

        window.dispatchEvent(new Event("cartUpdated"));
      } else {
        dispatch(
          addCart({
            idUser: guestUserId,

            idProduct: product._id,

            nameProduct: product.name,

            priceProduct: product.price,

            count: 1,

            img: product.img1,

            description: product.description,
          }),
        );
      }

      alertify.set("notifier", "position", "bottom-left");

      alertify.success("Bạn đã thêm sản phẩm vào giỏ hàng thành công!");
    } catch (error) {
      console.error("Add wishlist product to cart error:", error);

      alertify.error("Thêm sản phẩm vào giỏ hàng thất bại!");
    }
  };

  return (
    <main className="wishlist-page">

      <section className="wishlist-heading">
        <div className="shop-container">
          <div className="wishlist-breadcrumb">
            <Link to="/">Home</Link>

            <i className="fas fa-chevron-right" />

            <span>Wishlist</span>
          </div>

          <h1>My Wishlist</h1>

          <p>Save the cameras you love and come back to them anytime.</p>
        </div>
      </section>

      <section className="wishlist-content">
        <div className="shop-container">
          {products.length === 0 ? (
            <div className="wishlist-empty">
              <div className="wishlist-empty-icon">
                <i className="far fa-heart" />
              </div>

              <h2>Your wishlist is empty</h2>

              <p>Browse our collection and save your favorite cameras here.</p>

              <Link to="/shop" className="shop-btn shop-btn-primary">
                Explore Cameras
              </Link>
            </div>
          ) : (
            <>
              <div className="wishlist-toolbar">
                <h2>Saved Products</h2>

                <span>
                  {products.length}{" "}
                  {products.length === 1 ? "product" : "products"}
                </span>
              </div>

              <div className="wishlist-grid">
                {products.map((product) => (
                  <article className="wishlist-card" key={product._id}>
                    <div className="wishlist-image">
                      <Link to={`/detail/${product._id}`}>
                        <img src={product.img1} alt={product.name} />
                      </Link>

                      <button
                        type="button"
                        className="wishlist-remove"
                        onClick={() => handleRemove(product._id)}
                        aria-label="Remove from wishlist"
                      >
                        <i className="fas fa-times" />
                      </button>
                    </div>

                    <div className="wishlist-info">
                      <Link
                        to={`/detail/${product._id}`}
                        className="wishlist-name"
                      >
                        {product.name}
                      </Link>

                      <strong>{product.price}</strong>

                      <div className="wishlist-actions">
                        <button
                          type="button"
                          onClick={() => handleAddToCart(product)}
                        >
                          <i className="fas fa-shopping-bag" />
                          Add to Cart
                        </button>

                        <Link to={`/detail/${product._id}`}>View</Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default Wishlist;
