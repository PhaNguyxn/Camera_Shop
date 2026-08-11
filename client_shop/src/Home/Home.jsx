import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import ProductAPI from "../API/ProductAPI";
import Image from "../Share/img/Image";

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ProductAPI.getAPI();

        const productList = Array.isArray(response) ? response.slice(0, 8) : [];

        setProducts(productList);
      } catch (error) {
        console.error("Load home products error:", error);

        setProducts([]);
      }
    };

    fetchData();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
  };

  return (
    <div className="page-holder">
      <header className="header bg-white">


        {products.map((value) => (
          <div
            className="modal fade"
            id={`product_${value._id}`}
            tabIndex="-1"
            role="dialog"
            aria-hidden="true"
            key={`modal-${value._id}`}
          >
            <div
              className="modal-dialog modal-lg modal-dialog-centered"
              role="document"
            >
              <div className="modal-content">
                <div className="modal-body p-0">
                  <div className="row align-items-stretch">

                    <div className="col-lg-6 p-lg-0">
                      <img
                        style={{
                          width: "100%",
                        }}
                        className="product-view d-block h-100 bg-cover bg-center"
                        src={value.img1}
                        alt={value.name || "Product"}
                      />
                    </div>


                    <div className="col-lg-6">

                      <button
                        type="button"
                        className="close p-4"
                        data-dismiss="modal"
                        aria-label="Close"
                      >
                        <span aria-hidden="true">×</span>
                      </button>

                      <div className="p-5 my-md-4">

                        <ul className="list-inline mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <li className="list-inline-item m-0" key={star}>
                              <i className="fas fa-star small text-warning"></i>
                            </li>
                          ))}
                        </ul>

                        <h2 className="h4">{value.name}</h2>

                        <p className="text-muted">{value.price}</p>

                        <p className="text-small mb-4">
                          {value.description || "No description available."}
                        </p>

                        <div className="row align-items-stretch mb-4">
                          <div className="col-sm-5 pl-sm-0 fix_addwish">
                            <button
                              type="button"
                              className="btn btn-dark btn-sm btn-block h-100 d-flex align-items-center justify-content-center px-0"
                            >
                              <i className="far fa-heart mr-2"></i>
                              Add To Wish List
                            </button>
                          </div>
                        </div>

                        <Link
                          to={`/detail/${value._id}`}
                          className="btn btn-outline-dark btn-sm"
                          data-dismiss="modal"
                        >
                          View Detail
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="container">

          <section
            className="hero pb-3 bg-cover bg-center d-flex align-items-center"
            style={{
              backgroundImage: `url(${Image.banner})`,
            }}
          >
            <div className="container py-5">
              <div className="row px-4 px-lg-5">
                <div className="col-lg-6">
                  <p className="text-muted small text-uppercase mb-2">
                    New Inspiration 2026
                  </p>

                  <h1 className="h2 text-uppercase mb-3">
                    20% off on new season
                  </h1>

                  <Link className="btn btn-dark" to="/shop">
                    Buy Now!
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="pt-5">
            <header className="text-center">
              <p className="small text-muted text-uppercase mb-1">
                Carefully created collections
              </p>

              <h2 className="h5 text-uppercase mb-4">Browse our categories</h2>
            </header>

            <div className="row">

              <div className="col-md-4 mb-4">
                <Link className="category-item" to="/shop">
                  <img
                    className="img-fluid"
                    src={Image.img1}
                    alt="Mirrorless cameras"
                  />

                  <strong className="category-item-title">Mirrorless</strong>
                </Link>
              </div>


              <div className="col-md-4 mb-4">
                <Link className="category-item" to="/shop">
                  <img
                    className="img-fluid"
                    src={Image.img2}
                    alt="Film cameras"
                  />

                  <strong className="category-item-title">Film</strong>
                </Link>
              </div>


              <div className="col-md-4 mb-4">
                <Link className="category-item" to="/shop">
                  <img
                    className="img-fluid"
                    src={Image.img4}
                    alt="Action cameras"
                  />

                  <strong className="category-item-title">Action</strong>
                </Link>
              </div>


              <div className="col-md-6 mb-4">
                <Link className="category-item" to="/shop">
                  <img
                    className="img-fluid"
                    src={Image.img3}
                    alt="Compact cameras"
                  />

                  <strong className="category-item-title">Compact</strong>
                </Link>
              </div>


              <div className="col-md-6 mb-4">
                <Link className="category-item" to="/shop">
                  <img
                    className="img-fluid"
                    src={Image.img5}
                    alt="DSLR cameras"
                  />

                  <strong className="category-item-title">DSLR</strong>
                </Link>
              </div>
            </div>
          </section>

          <section className="py-5" id="section_product">
            <header>
              <p className="small text-muted text-uppercase mb-1">
                Made the hard way
              </p>

              <h2 className="h5 text-uppercase mb-4">Top trending products</h2>
            </header>

            <div className="row">
              {products.length > 0 ? (
                products.map((value) => (
                  <div className="col-xl-3 col-lg-4 col-sm-6" key={value._id}>
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
                        <Link
                          className="reset-anchor"
                          to={`/detail/${value._id}`}
                        >
                          {value.name}
                        </Link>
                      </h6>

                      <p className="small text-muted">{value.price}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12">
                  <p className="text-center text-muted">
                    No products available.
                  </p>
                </div>
              )}
            </div>
          </section>


          <section className="py-5 bg-light">
            <div className="container">
              <div className="row text-center">

                <div className="col-lg-4 mb-3 mb-lg-0">
                  <div className="d-inline-block">
                    <div className="media align-items-end">
                      <svg className="svg-icon svg-icon-big svg-icon-light">
                        <use xlinkHref="#delivery-time-1"></use>
                      </svg>

                      <div className="media-body text-left ml-3">
                        <h6 className="text-uppercase mb-1">Free shipping</h6>

                        <p className="text-small mb-0 text-muted">
                          Free shipping worldwide
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4 mb-3 mb-lg-0">
                  <div className="d-inline-block">
                    <div className="media align-items-end">
                      <svg className="svg-icon svg-icon-big svg-icon-light">
                        <use xlinkHref="#helpline-24h-1"></use>
                      </svg>

                      <div className="media-body text-left ml-3">
                        <h6 className="text-uppercase mb-1">24 x 7 service</h6>

                        <p className="text-small mb-0 text-muted">
                          Customer support 24/7
                        </p>
                      </div>
                    </div>
                  </div>
                </div>


                <div className="col-lg-4">
                  <div className="d-inline-block">
                    <div className="media align-items-end">
                      <svg className="svg-icon svg-icon-big svg-icon-light">
                        <use xlinkHref="#label-tag-1"></use>
                      </svg>

                      <div className="media-body text-left ml-3">
                        <h6 className="text-uppercase mb-1">Festival offer</h6>

                        <p className="text-small mb-0 text-muted">
                          Special seasonal offers
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>


          <section className="py-5">
            <div className="container p-0">
              <div className="row">
                <div className="col-lg-6 mb-3 mb-lg-0">
                  <h5 className="text-uppercase">Let's be friends!</h5>

                  <p className="text-small text-muted mb-0">
                    Subscribe to receive our latest news and offers.
                  </p>
                </div>

                <div className="col-lg-6">
                  <form onSubmit={handleSubscribe}>
                    <div className="input-group flex-column flex-sm-row mb-3">
                      <input
                        className="form-control form-control-lg py-3"
                        type="email"
                        placeholder="Enter your email address"
                        aria-label="Email address"
                        aria-describedby="button-addon2"
                      />

                      <div className="input-group-append">
                        <button
                          className="btn btn-dark btn-block"
                          id="button-addon2"
                          type="submit"
                        >
                          Subscribe
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>
      </header>
    </div>
  );
}

export default Home;
