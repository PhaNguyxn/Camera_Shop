import React, { useEffect, useState } from "react";

import queryString from "query-string";

import ProductAPI from "../API/ProductAPI";

import Search from "./Component/Search";
import Pagination from "./Component/Pagination";
import Products from "./Component/Products";


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
  } else if (sortType === "high") {
    sorted.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
  }

  return sorted;
};

function Shop() {

  const [products, setProducts] = useState([]);

  const [temp, setTemp] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [sort, setSort] = useState("default");

  const [totalPage, setTotalPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: "1",
    count: "9",
    category: "all",
  });

  const [activeCategory, setActiveCategory] = useState("all");

  const [categories, setCategories] = useState([]);

  const handlerChangePage = (value) => {
    setPagination((prev) => ({
      ...prev,
      page: value,
    }));
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
  };


  const handleSortChange = (value) => {
    setSort(value);
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
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

        setTemp(productData);
        const count = Number(pagination.count) || 9;

        const total = Number(response?.total) || 0;

        setTotalPage(Math.max(1, Math.ceil(total / count)));
      } catch (error) {
        console.error("Load products error:", error);

        setTemp([]);

        setProducts([]);

        setTotalPage(1);
      }
    };

    fetchAllData();
  }, [pagination.page, pagination.count, pagination.category]);


  useEffect(() => {
    let filtered = [...temp];

    if (searchTerm.trim()) {
      const keyword = searchTerm.trim().toLowerCase();

      filtered = filtered.filter((item) =>
        item.name?.toLowerCase().includes(keyword),
      );
    }

    const sorted = sortProducts(filtered, sort);

    setProducts(sorted);
  }, [temp, sort, searchTerm]);

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

  return (
    <div className="container">

      <section className="py-5 bg-light">
        <div className="container">
          <h1 className="h2 text-uppercase">Shop</h1>
        </div>
      </section>

      <section className="py-5">
        <div className="container p-0">
          <div className="row">

            <div className="col-lg-3">
              <div className="mb-4 p-3 bg-dark text-white rounded">
                <strong>Categories</strong>
              </div>

              <ul className="list-unstyled category-list">

                <li>
                  <button
                    type="button"
                    className={`category-btn ${
                      activeCategory === "all" ? "active" : ""
                    }`}
                    onClick={() => handlerCategory("all")}
                  >
                    All
                  </button>
                </li>


                {categories.map((item) => (
                  <li key={item._id}>
                    <button
                      type="button"
                      className={`category-btn ${
                        activeCategory === item._id ? "active" : ""
                      }`}
                      onClick={() => handlerCategory(item._id)}
                    >
                      {item.category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-lg-9">

              <div className="row mb-3 align-items-center">

                <Search handlerSearch={handlerSearch} products={temp} />

                <div className="col-lg-4 text-right">
                  <select
                    className="form-control"
                    value={sort}
                    onChange={(e) => handleSortChange(e.target.value)}
                    aria-label="Sort products"
                  >
                    <option value="default">Default sorting</option>

                    <option value="low">Price: Low to High</option>

                    <option value="high">Price: High to Low</option>
                  </select>
                </div>
              </div>

              <Products products={products} />

              <Pagination
                pagination={pagination}
                handlerChangePage={handlerChangePage}
                totalPage={totalPage}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Shop;
