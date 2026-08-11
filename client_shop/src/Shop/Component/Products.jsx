import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

Products.propTypes = {
  products: PropTypes.array,
  sort: PropTypes.string,
};

Products.defaultProps = {
  products: [],
  sort: "",
};

function Products(props) {
  const { products, sort } = props;

  const parsePrice = (price) => {
    if (typeof price === "number") {
      return price;
    }

    if (!price) {
      return 0;
    }

    return Number(price.toString().replace(/[^\d]/g, ""));
  };


  const sortedProducts = [...products];

  if (sort === "DownToUp") {
    sortedProducts.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
  } else if (sort === "UpToDown") {
    sortedProducts.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
  }

  return (
    <div className="row">

      {sortedProducts.length > 0 ? (
        sortedProducts.map((value) => (
          <div className="col-lg-4 col-sm-6 Section_Category" key={value._id}>
            <div className="product text-center">

              <div className="position-relative mb-3">
                <div className="badge text-white"></div>

                <Link className="d-block" to={`/detail/${value._id}`}>
                  <img
                    className="img-fluid w-100"
                    src={value.img1}
                    alt={value.name || "Product"}
                  />
                </Link>

                <div className="product-overlay">
                  <ul className="mb-0 list-inline">

                    <li className="list-inline-item m-0 p-0">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-dark"
                        aria-label={`Add ${value.name || "product"} to wishlist`}
                      >
                        <i className="far fa-heart"></i>
                      </button>
                    </li>

                    <li className="list-inline-item m-0 p-0">
                      <Link
                        className="btn btn-sm btn-dark"
                        to={`/detail/${value._id}`}
                      >
                        Add to cart
                      </Link>
                    </li>


                    <li className="list-inline-item mr-0">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-dark"
                        data-toggle="modal"
                        data-target={`#product_${value._id}`}
                        aria-label={`Quick view ${value.name || "product"}`}
                      >
                        <i className="fas fa-expand"></i>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>


              <h6>
                <Link className="reset-anchor" to={`/detail/${value._id}`}>
                  {value.name}
                </Link>
              </h6>

              <p className="small text-muted">{value.price}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="col-12">
          <p className="text-center text-muted">Không có sản phẩm.</p>
        </div>
      )}
    </div>
  );
}

export default Products;
