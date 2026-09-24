import React from 'react';
import PropTypes from 'prop-types';

IndexPage.propTypes = {
    indexPage: PropTypes.array,
    handlerChangePage: PropTypes.func,
    pagination: PropTypes.object
};

IndexPage.defaultProps = {
    indexPage: null,
    handlerChangePage: null,
    pagination: {}
}

function IndexPage(props) {

    const { indexPage, handlerChangePage, pagination } = props

    const { page } = pagination

    const onIndexPage = (value) => {

        if (!handlerChangePage){
            return
        }

        handlerChangePage(value)

    }

    console.log(indexPage)

    return (
      <div className="d-flex">
        {indexPage &&
          indexPage.map((value) => (
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
                aria-label={`Trang ${value}`}
                aria-current={value === parseInt(page, 10) ? "page" : undefined}
              >
                {value}
              </button>
            </li>
          ))}
      </div>
    );
}

export default IndexPage;