import React, { useEffect, useState } from 'react';
import queryString from 'query-string';
import ProductAPI from '../API/ProductAPI';
import Search from './Component/Search';
import Pagination from './Component/Pagination';
import Products from './Component/Products';

function Shop(props) {

    const [products, setProducts] = useState([]);
    const [temp, setTemp] = useState([]);

    const [sort, setSort] = useState('default');
    const [totalPage, setTotalPage] = useState();

    const [activeCategory, setActiveCategory] = useState('all');

    const [pagination, setPagination] = useState({
        page: '1',
        count: '9',
        category: 'all'
    });

    const [categories, setCategories] = useState([]);

    const parsePrice = (price) => {
    if (price === null || price === undefined) return 0;
    const cleanPrice = price.toString().replace(/\D/g, '');
    return Number(cleanPrice);
};

    const handlerChangePage = (value) => {
        setPagination({
            ...pagination,
            page: value
        });
    }

    const handlerSearch = (value) => {
        let filtered = [...temp];

        if (value) {
            filtered = filtered.filter(item =>
                item.name.toUpperCase().includes(value.toUpperCase())
            );
        }

        applySort(filtered, sort);
    }

    const handlerCategory = (value) => {
        setActiveCategory(value);
        setPagination({
            ...pagination,
            page: '1',
            category: value
        });
    }

    const handleSortChange = (value) => {
    setSort(value);
    applySort(temp, value); 
    }

const applySort = (list, sortType) => {
    let sorted = [...list];

    if (sortType === 'low') {
        sorted.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else if (sortType === 'high') {
        sorted.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    }
    
    setProducts(sorted);
};

    useEffect(() => {
    const fetchAllData = async () => {
        const params = {
            page: pagination.page,
            count: pagination.count,
            category: pagination.category
        };

        const query = '?' + queryString.stringify(params);
        const response = await ProductAPI.getPagination(query);

        // Lưu vào temp để làm dữ liệu gốc cho Search/Sort
        setTemp(response.products); 
        
        // Áp dụng sort ngay cho dữ liệu vừa fetch về
        applySort(response.products, sort);

        const totalPage = Math.ceil(response.total / pagination.count);
        setTotalPage(totalPage);
    }

    fetchAllData();
}, [pagination]); // Khi chuyển trang hoặc category, fetch lại và tự sort

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const response = await ProductAPI.getCategories();
        setCategories(response);
    }


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

                        {/* SIDEBAR */}
                        <div className="col-lg-3">

                            <div className="mb-4 p-3 bg-dark text-white rounded">
                                <strong>Categories</strong>
                            </div>

                            <ul className="list-unstyled category-list">
                                <li>
                                    <button
                                        className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
                                        onClick={() => handlerCategory('all')}
                                    >
                                        All
                                    </button>
                                </li>

                                {categories.map(item => (
                                    <li key={item._id}>
                                        <button
                                            className={`category-btn ${activeCategory === item._id ? 'active' : ''}`}
                                            onClick={() => handlerCategory(item._id)}
                                        >
                                            {item.category}
                                        </button>
                                    </li>
                                ))}
                            </ul>

                        </div>

                        {/* MAIN */}
                        <div className="col-lg-9">

                            <div className="row mb-3 align-items-center">
                                <Search 
                                handlerSearch={handlerSearch}
                                products={temp}
                                 />

                                {/* SORT DROPDOWN */}
                                <div className="col-lg-4 text-right">
                                    <select
                                        className="form-control"
                                        value={sort}
                                        onChange={(e) => handleSortChange(e.target.value)}
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
