import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

Search.propTypes = {
    handlerSearch: PropTypes.func,
    products: PropTypes.array
};

Search.defaultProps = {
    handlerSearch: null,
    products: []
};

function Search(props) {
    const { handlerSearch, products } = props;
    const [search, setSearch] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    
    const delaySearchTextTimeOut = useRef(null);
    const searchRef = useRef(null);

    // Xử lý đóng gợi ý khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const onChangeText = (e) => {
        const value = e.target.value;
        setSearch(value);

        // Logic gợi ý thông minh
        if (value.trim() !== '') {
            const filter = products
                .filter(item => item.name.toLowerCase().includes(value.toLowerCase()))
                .slice(0, 5); // Giới hạn 5 kết quả đầu tiên
            setSuggestions(filter);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }

        // Debounce để thực hiện tìm kiếm chính
        if (handlerSearch) {
            if (delaySearchTextTimeOut.current) {
                clearTimeout(delaySearchTextTimeOut.current);
            }
            delaySearchTextTimeOut.current = setTimeout(() => {
                handlerSearch(value);
            }, 500);
        }
    };

    const handleSelectSuggestion = (productName) => {
        setSearch(productName);
        setShowSuggestions(false);
        handlerSearch(productName); // Gọi tìm kiếm ngay khi chọn
    };

    return (
        <div className="col-lg-4 position-relative" ref={searchRef}>
            <input 
                className="form-control form-control-lg" 
                type="text" 
                placeholder="Enter Search Here!"
                onChange={onChangeText}
                value={search}
                onFocus={() => search.length > 0 && setShowSuggestions(true)}
            />

            {/* Gợi ý thông minh (CSS Bootstrap) */}
            {showSuggestions && suggestions.length > 0 && (
                <ul className="list-group position-absolute w-100 shadow-lg" 
                    style={{ zIndex: 1000, top: '100%' }}>
                    {suggestions.map((item) => (
                        <li 
                            key={item._id}
                            className="list-group-item list-group-item-action d-flex align-items-center"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleSelectSuggestion(item.name)}
                        >
                            <img 
                                src={item.img1} 
                                alt={item.name} 
                                style={{ width: '30px', height: '30px', objectFit: 'cover' }} 
                                className="mr-2"
                            />
                            <span className="small">{item.name}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Search;