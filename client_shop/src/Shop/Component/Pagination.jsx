import React from "react";

import PropTypes from "prop-types";

import "./Pagination.css";

function Pagination({
  pagination,
  handlerChangePage,
  totalPage,
  totalProducts,
}) {
  const currentPage = Number(pagination.page) || 1;

  const count = Number(pagination.count) || 9;

  if (totalProducts === 0) {
    return null;
  }

  const start = (currentPage - 1) * count + 1;

  const end = Math.min(currentPage * count, totalProducts);

  const getPages = () => {
    if (totalPage <= 5) {
      return Array.from(
        {
          length: totalPage,
        },
        (_, index) => index + 1,
      );
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, totalPage];
    }

    if (currentPage >= totalPage - 2) {
      return [1, totalPage - 3, totalPage - 2, totalPage - 1, totalPage];
    }

    return [1, currentPage - 1, currentPage, currentPage + 1, totalPage];
  };

  const pages = getPages();

  return (
    <div className="shop-pagination">
      <div className="shop-pagination-info">
        Showing <strong>{start}</strong> – <strong>{end}</strong> of{" "}
        <strong>{totalProducts}</strong> products
      </div>

      <div className="shop-pagination-controls">
        <button
          type="button"
          className="shop-page-button shop-page-direction"
          disabled={currentPage <= 1}
          onClick={() => handlerChangePage(currentPage - 1)}
          aria-label="Previous page"
        >
          <i className="fas fa-chevron-left" />
        </button>

        {pages.map((page, index) => {
          const previous = pages[index - 1];

          const showDots = previous && page - previous > 1;

          return (
            <React.Fragment key={page}>
              {showDots && <span className="shop-page-dots">…</span>}

              <button
                type="button"
                className={`shop-page-button ${
                  currentPage === page ? "active" : ""
                }`}
                onClick={() => handlerChangePage(page)}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            </React.Fragment>
          );
        })}

        <button
          type="button"
          className="shop-page-button shop-page-direction"
          disabled={currentPage >= totalPage}
          onClick={() => handlerChangePage(currentPage + 1)}
          aria-label="Next page"
        >
          <i className="fas fa-chevron-right" />
        </button>
      </div>
    </div>
  );
}

Pagination.propTypes = {
  pagination: PropTypes.object,

  handlerChangePage: PropTypes.func,

  totalPage: PropTypes.number,

  totalProducts: PropTypes.number,
};

Pagination.defaultProps = {
  pagination: {
    page: 1,
    count: 9,
  },

  handlerChangePage: null,

  totalPage: 1,

  totalProducts: 0,
};

export default Pagination;
