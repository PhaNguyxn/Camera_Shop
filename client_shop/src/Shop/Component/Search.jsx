import React, { useEffect, useRef, useState } from "react";

import PropTypes from "prop-types";

import { useHistory } from "react-router-dom";

import "./Search.css";

function Search({ handlerSearch, products }) {
  const history = useHistory();

  const searchRef = useRef(null);

  const timerRef = useRef(null);

  const [search, setSearch] = useState("");

  const [suggestions, setSuggestions] = useState([]);

  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const handleOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleChange = (event) => {
    const value = event.target.value;

    setSearch(value);

    const keyword = value.trim().toLowerCase();

    if (!keyword) {
      setSuggestions([]);

      setShowSuggestions(false);
    } else {
      const results = products
        .filter((product) => product.name?.toLowerCase().includes(keyword))
        .slice(0, 5);

      setSuggestions(results);

      setShowSuggestions(true);
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      if (handlerSearch) {
        handlerSearch(value);
      }
    }, 350);
  };

  const handleClear = () => {
    setSearch("");

    setSuggestions([]);

    setShowSuggestions(false);

    if (handlerSearch) {
      handlerSearch("");
    }
  };

  const handleSuggestion = (product) => {
    setSearch(product.name);

    setShowSuggestions(false);

    history.push(`/detail/${product._id}`);
  };

  return (
    <div className="shop-search" ref={searchRef}>
      <div className="shop-search-input-wrapper">
        <i className="fas fa-search shop-search-icon" />

        <input
          type="text"
          value={search}
          onChange={handleChange}
          onFocus={() => {
            if (search.trim() && suggestions.length) {
              setShowSuggestions(true);
            }
          }}
          placeholder="Search cameras..."
          aria-label="Search cameras"
        />

        {search && (
          <button
            type="button"
            className="shop-search-clear"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <i className="fas fa-times" />
          </button>
        )}
      </div>

      {showSuggestions && (
        <div className="shop-search-suggestions">
          {suggestions.length > 0 ? (
            <>
              <div className="shop-search-suggestions-title">Suggestions</div>

              {suggestions.map((product) => (
                <button
                  type="button"
                  className="shop-search-suggestion"
                  key={product._id}
                  onClick={() => handleSuggestion(product)}
                >
                  <div className="shop-search-suggestion-image">
                    <img src={product.img1} alt={product.name} />
                  </div>

                  <div className="shop-search-suggestion-info">
                    <strong>{product.name}</strong>

                    <span>{product.price}</span>
                  </div>

                  <i className="fas fa-chevron-right shop-search-arrow" />
                </button>
              ))}
            </>
          ) : (
            <div className="shop-search-no-result">
              <i className="fas fa-search" />

              <div>
                <strong>No products found</strong>

                <span>Try another search term.</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

Search.propTypes = {
  handlerSearch: PropTypes.func,

  products: PropTypes.array,
};

Search.defaultProps = {
  handlerSearch: null,

  products: [],
};

export default Search;
