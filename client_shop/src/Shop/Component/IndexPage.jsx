import React from "react";
import PropTypes from "prop-types";

IndexPage.propTypes = {
  indexPage: PropTypes.array,
  handlerChangePage: PropTypes.func,
  pagination: PropTypes.object,
};

IndexPage.defaultProps = {
  indexPage: [],
  handlerChangePage: null,
  pagination: {
    page: 1,
  },
};

function IndexPage(props) {
  const { indexPage, handlerChangePage, pagination } = props;

  const { page } = pagination;


  const onIndexPage = (value) => {
    if (!handlerChangePage) {
      return;
    }

    handlerChangePage(value);
  };

  return (
    <nav aria-label="Product pagination">
      <ul className="pagination d-flex mb-0">
        {indexPage.map((value) => (
          <li
            className={
              value === parseInt(page, 10) ? "page-item active" : "page-item"
            }
            key={value}
          >
            <button
              type="button"
              className="page-link"
              onClick={() => onIndexPage(value)}
              aria-label={`Go to page ${value}`}
              aria-current={value === parseInt(page, 10) ? "page" : undefined}
            >
              {value}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default IndexPage;
