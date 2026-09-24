import React from 'react';
import PropTypes from 'prop-types';
import IndexPage from './IndexPage';

Pagination.propTypes = {
    pagination: PropTypes.object,
    handlerChangePage: PropTypes.func,
    totalPage: PropTypes.number
};

Pagination.defaultProps = {
    pagination: {},
    handlerChangePage: null,
    totalPage: null
}

function Pagination(props) {

    const { pagination, handlerChangePage, totalPage } = props

    const { page } = pagination

    let indexPage = []

    //Tạo ra số nút bấm cho từng trang
    for (var i = 1; i <= totalPage; i++){
        indexPage.push(i)
    }

    const onDownPage = (value) => {
        
        if (!handlerChangePage){
            return
        }

        const newPage = parseInt(value, 10) - 1
        handlerChangePage(newPage)

    }

    const onUpPage = (value) => {
                
        if (!handlerChangePage){
            return
        }

        const newPage = parseInt(value, 10) + 1
        handlerChangePage(newPage)
    }

    return (
        <nav aria-label="Phân trang sản phẩm" className="pt-4">
            <ul className="pagination justify-content-center justify-content-lg-end">
                <li className="page-item">
                    <button type="button" className="page-link" aria-label="Trang trước"
                        onClick={() => onDownPage(page)} 
                        disabled={page <= 1 }>
                        <span>«</span>
                    </button>
                </li>
                <IndexPage indexPage={indexPage} handlerChangePage={handlerChangePage} pagination={pagination}/>
                <li className="page-item">
                    <button type="button" className="page-link" aria-label="Trang sau"
                        onClick={() => onUpPage(page)} 
                        disabled={page >= totalPage}>
                            <span>»</span>
                    </button>
                </li>
            </ul>
        </nav>
    );
}

export default Pagination;
