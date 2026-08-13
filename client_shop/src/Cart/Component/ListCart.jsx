import React from "react";

import { Link } from "react-router-dom";

import PropTypes from "prop-types";

const parsePrice = (value) => {
  return Number(String(value || "").replace(/\D/g, "")) || 0;
};

function ListCart({ listCart, onDeleteCart, onUpdateCount }) {
  return (
    <div className="cart-list">
      {listCart.map((item, index) => {
        const price = parsePrice(item.priceProduct);

        const quantity = Number(item.count) || 1;

        const itemTotal = price * quantity;

        return (
          <article className="cart-item" key={item.idProduct || index}>

            <Link to={`/detail/${item.idProduct}`} className="cart-item-image">
              <img src={item.img} alt={item.nameProduct || "Product"} />
            </Link>


            <div className="cart-item-info">
              <Link to={`/detail/${item.idProduct}`} className="cart-item-name">
                {item.nameProduct}
              </Link>

              <span className="cart-item-price">
                {price.toLocaleString("vi-VN")}
                {" ₫"}
              </span>
            </div>


            <div className="cart-item-quantity">
              <button
                type="button"
                disabled={quantity <= 1}
                onClick={() =>
                  onUpdateCount(item.idUser, item.idProduct, quantity - 1)
                }
                aria-label="Decrease quantity"
              >
                <i className="fas fa-minus" />
              </button>

              <span>{quantity}</span>

              <button
                type="button"
                onClick={() =>
                  onUpdateCount(item.idUser, item.idProduct, quantity + 1)
                }
                aria-label="Increase quantity"
              >
                <i className="fas fa-plus" />
              </button>
            </div>


            <strong className="cart-item-total">
              {itemTotal.toLocaleString("vi-VN")}
              {" ₫"}
            </strong>


            <button
              type="button"
              className="cart-item-remove"
              onClick={() => onDeleteCart(item.idUser, item.idProduct)}
              aria-label="Remove product"
            >
              <i className="far fa-trash-alt" />
            </button>
          </article>
        );
      })}
    </div>
  );
}

ListCart.propTypes = {
  listCart: PropTypes.array,

  onDeleteCart: PropTypes.func,

  onUpdateCount: PropTypes.func,
};

ListCart.defaultProps = {
  listCart: [],

  onDeleteCart: () => {},

  onUpdateCount: () => {},
};

export default ListCart;
