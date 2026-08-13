import React, { useEffect, useState } from "react";

import { Link, useHistory, useLocation } from "react-router-dom";

import queryString from "query-string";

import ProductAPI from "../API/ProductAPI";

import Search from "./Component/Search";
import Pagination from "./Component/Pagination";
import Products from "./Component/Products";

import "./Shop.css";

const parsePrice = (price) => {
  if (price === null || price === undefined) {
    return 0;
  }

  const cleanPrice = price.toString().replace(/\D/g, "");

  return Number(cleanPrice);
};

const sortProducts = (list, sortType) => {
  const sorted = [...list];

  if (sortType === "low") {
    sorted.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
  }

  if (sortType === "high") {
    sorted.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
  }

  return sorted;
};

function Shop() {
  const location = useLocation();

  const history = useHistory();

  const [products, setProducts] = useState([]);

  const [temp, setTemp] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [sort, setSort] = useState("default");

  const [totalPage, setTotalPage] = useState(1);

  const [totalProducts, setTotalProducts] = useState(0);

  const [activeCategory, setActiveCategory] = useState("all");

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [filterOpen, setFilterOpen] = useState(false);

  const [pagination, setPagination] = useState({
    page: "1",
    count: "9",
    category: "all",
  });

  const [allProducts, setAllProducts] = useState([]);

  const handlerChangePage = (value) => {
    const page = Number(value);

    if (page < 1 || page > totalPage) {
      return;
    }

    setPagination((prev) => ({
      ...prev,

      page: String(page),
    }));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handlerSearch = (value) => {
    setSearchTerm(value || "");
  };

  const handlerCategory = (value) => {
    setActiveCategory(value);

    setPagination((prev) => ({
      ...prev,
      page: "1",
      category: value,
    }));

    setSearchTerm("");

    setFilterOpen(false);

    /*
     * ALL CAMERAS
     */
    if (value === "all") {
      history.push("/shop");

      return;
    }

    /*
     * Tìm tên category
     */
    const selectedCategory = categories.find(
      (item) => String(item._id) === String(value),
    );

    if (selectedCategory) {
      history.push(
        `/shop?category=${encodeURIComponent(selectedCategory.category)}`,
      );
    }
  };

  const handleSortChange = (value) => {
    setSort(value);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        setError("");

        const params = {
          page: pagination.page,

          count: pagination.count,

          category: pagination.category,
        };

        const query = "?" + queryString.stringify(params);

        const response = await ProductAPI.getPagination(query);

        const productData = Array.isArray(response?.products)
          ? response.products
          : [];

        const total = Number(response?.total) || 0;

        const count = Number(pagination.count) || 9;

        setTemp(productData);

        setTotalProducts(total);

        setTotalPage(Math.max(1, Math.ceil(total / count)));
      } catch (error) {
        console.error("Load products error:", error);

        setTemp([]);

        setProducts([]);

        setTotalProducts(0);

        setTotalPage(1);

        setError("Unable to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [pagination.page, pagination.count, pagination.category]);

  useEffect(() => {
    let source = searchTerm.trim() ? [...allProducts] : [...temp];

    if (searchTerm.trim() && activeCategory !== "all") {
      source = source.filter((item) => {
        const categoryId =
          typeof item.category === "object"
            ? item.category?._id
            : item.category;

        return String(categoryId) === String(activeCategory);
      });
    }

    if (searchTerm.trim()) {
      const keyword = searchTerm.trim().toLowerCase();

      source = source.filter((item) =>
        item.name?.toLowerCase().includes(keyword),
      );
    }

    const sorted = sortProducts(source, sort);

    setProducts(sorted);
  }, [temp, allProducts, searchTerm, sort, activeCategory]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await ProductAPI.getCategories();

        setCategories(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Load categories error:", error);

        setCategories([]);
      }
    };

    fetchCategories();
  }, []);


  useEffect(() => {

    if (!categories.length) {
      return;
    }

    const params = queryString.parse(location.search);

    const categoryFromUrl = params.category;

    if (!categoryFromUrl) {
      return;
    }

    const matchedCategory = categories.find(
      (item) =>
        String(item.category).trim().toLowerCase() ===
        String(categoryFromUrl).trim().toLowerCase(),
    );

    if (!matchedCategory) {
      return;
    }

    setActiveCategory(matchedCategory._id);


    setPagination((prev) => {
      if (
        String(prev.category) === String(matchedCategory._id) &&
        String(prev.page) === "1"
      ) {
        return prev;
      }

      return {
        ...prev,
        page: "1",
        category: matchedCategory._id,
      };
    });
  }, [categories, location.search]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await ProductAPI.getAPI();

        setAllProducts(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Load search products error:", error);

        setAllProducts([]);
      }
    };

    fetchAllProducts();
  }, []);

  const activeCategoryName =
    activeCategory === "all"
      ? "All Cameras"
      : categories.find((item) => item._id === activeCategory)?.category ||
        "Products";

  return (
    <main className="shop-page">
      <section className="shop-page-heading">
        <div className="shop-container">
          <div className="shop-page-heading-inner">
            <div>
              <div className="shop-simple-breadcrumb">
                <Link to="/">Home</Link>

                <i className="fas fa-chevron-right" />

                <span>Shop</span>
              </div>

              <h1>Shop</h1>

              <p>Explore our collection of cameras and photography gear.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="shop-content">
        <div className="shop-container">
          <div className="shop-toolbar">
            <div className="shop-toolbar-left">
              <button
                type="button"
                className="shop-filter-mobile-btn"
                onClick={() => setFilterOpen(true)}
              >
                <i className="fas fa-sliders-h" />
                Filters
              </button>
              <Search
                handlerSearch={handlerSearch}
                products={allProducts}
              />{" "}
            </div>

            <div className="shop-toolbar-right">
              <div className="shop-result-count">
                <strong>
                  {searchTerm.trim() ? products.length : totalProducts}
                </strong>

                <span>products</span>
              </div>

              <div className="shop-sort">
                <i className="fas fa-sort-amount-down" />

                <select
                  value={sort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  aria-label="Sort products"
                >
                  <option value="default">Featured</option>

                  <option value="low">Price: Low to High</option>

                  <option value="high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {filterOpen && (
            <button
              type="button"
              className="shop-filter-overlay"
              onClick={() => setFilterOpen(false)}
              aria-label="Close filters"
            />
          )}

          <div className="shop-layout">
            <aside
              className={`shop-sidebar ${
                filterOpen ? "shop-sidebar-open" : ""
              }`}
            >
              <div className="shop-sidebar-mobile-header">
                <h3>Filters</h3>

                <button
                  type="button"
                  onClick={() => setFilterOpen(false)}
                  aria-label="Close filters"
                >
                  <i className="fas fa-times" />
                </button>
              </div>

              <div className="shop-filter-card">
                <div className="shop-filter-heading">
                  <div>
                    <span>Browse</span>

                    <h3>Categories</h3>
                  </div>

                  <i className="fas fa-camera" />
                </div>

                <div className="shop-category-list">
                  <button
                    type="button"
                    className={`shop-category-btn ${
                      activeCategory === "all" ? "active" : ""
                    }`}
                    onClick={() => handlerCategory("all")}
                  >
                    <span className="shop-category-name">
                      <span className="shop-category-icon">
                        <i className="fas fa-th-large" />
                      </span>
                      All Cameras
                    </span>

                    {activeCategory === "all" && (
                      <i className="fas fa-check shop-category-check" />
                    )}
                  </button>

                  {categories.map((item) => (
                    <button
                      type="button"
                      key={item._id}
                      className={`shop-category-btn ${
                        activeCategory === item._id ? "active" : ""
                      }`}
                      onClick={() => handlerCategory(item._id)}
                    >
                      <span className="shop-category-name">
                        <span className="shop-category-icon">
                          <i className="fas fa-camera-retro" />
                        </span>

                        {item.category}
                      </span>

                      {activeCategory === item._id && (
                        <i className="fas fa-check shop-category-check" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="shop-help-card">
                <div className="shop-help-icon">
                  <i className="fas fa-headset" />
                </div>

                <h4>Need help choosing?</h4>

                <p>
                  Our camera advisor can help you find equipment that matches
                  your needs.
                </p>

                <Link to="/shop" className="shop-help-link">
                  Get expert advice
                  <i className="fas fa-arrow-right" />
                </Link>
              </div>
            </aside>

            <div className="shop-products-area">
              <div className="shop-products-header">
                <div>
                  <span className="shop-products-label">Browse collection</span>

                  <h2>{activeCategoryName}</h2>
                </div>

                {activeCategory !== "all" && (
                  <button
                    type="button"
                    className="shop-clear-filter"
                    onClick={() => handlerCategory("all")}
                  >
                    Clear filter
                    <i className="fas fa-times" />
                  </button>
                )}
              </div>

              {searchTerm && (
                <div className="shop-search-status">
                  <i className="fas fa-search" />

                  <span>
                    Results for <strong>"{searchTerm}"</strong>
                  </span>

                  <button type="button" onClick={() => handlerSearch("")}>
                    Clear
                  </button>
                </div>
              )}

              {loading && (
                <div className="shop-loading">
                  <div className="shop-loading-spinner" />

                  <h4>Loading cameras</h4>

                  <p>Finding the best products for you...</p>
                </div>
              )}

              {!loading && error && (
                <div className="shop-error">
                  <div className="shop-error-icon">
                    <i className="fas fa-exclamation" />
                  </div>

                  <h3>Something went wrong.</h3>

                  <p>{error}</p>

                  <button
                    type="button"
                    className="shop-btn shop-btn-primary"
                    onClick={() => window.location.reload()}
                  >
                    Try Again
                  </button>
                </div>
              )}

              {!loading && !error && (
                <>
                  <Products products={products} />

                  {products.length > 0 && !searchTerm.trim() && (
                    <Pagination
                      pagination={pagination}
                      handlerChangePage={handlerChangePage}
                      totalPage={totalPage}
                      totalProducts={totalProducts}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Shop;
