import React, { useEffect, useState } from "react";
import ProductAPI from "../../API/ProductAPI";
import { useLocation, useHistory } from "react-router-dom"; // Đổi useNavigate thành useHistory

function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

const ViewEdit = () => {
    const history = useHistory(); // Sử dụng history thay cho navigate
    const productId = useQuery().get('id');
    const [product, setProduct] = useState({
        name: '',
        price: '',
        category: '',
        description: '',
        file: null
    });
    const [categoires, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await ProductAPI.getCategories();
                if (res?.length > 0) {
                    setCategories(res);
                }
            } catch (err) { console.error(err); }
        };
        fetchCategories();

        if (productId) {
            const fetchDetail = async () => {
                try {
                    const res = await ProductAPI.getDetail(productId);
                    if (res?._id) {
                        setProduct({ ...res });
                    }
                } catch (err) { console.error(err); }
            };
            fetchDetail();
        }
    }, [productId]);

    const handleCreateProduct = async () => {
        if (!productId && !product?.file) {
            alert("Vui lòng chọn file hình ảnh!");
            return;
        }

        const formData = new FormData();
        formData.append('name', product.name || '');
        formData.append('price', product.price || '');
        formData.append('category', product.category || '');
        formData.append('description', product.description || '');
        
        if (product.file) {
            formData.append('file', product.file);
        }

        try {
            let res;
            if (productId) {
                res = await ProductAPI.updateProduct(productId, formData);
            } else {
                res = await ProductAPI.createProduct(formData);
            }

            if (res) {
                // FIX: Dùng history.push để chuyển trang mượt mà trong v5
                history.push('/products');
            }
        } catch (err) {
            console.error(err);
            alert("Lỗi khi lưu dữ liệu!");
        }
    };

    const onSelectImage = (e) => {
        if (e.target.files[0]) {
            setProduct({ ...product, file: e.target.files[0] });
        }
    };

    return (
        <div className="page-wrapper">
            <div className="page-breadcrumb">
                <div className="row">
                    <div className="col-7 align-self-center">
                        <h4 className="page-title text-truncate text-dark font-weight-medium mb-1">
                            {productId ? 'Update Product' : 'Create Product'}
                        </h4>
                        <div className="d-flex align-items-center">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb m-0 p-0">
                                    <li className="breadcrumb-item"><a href="/" className="text-muted">Home</a></li>
                                    <li className="breadcrumb-item text-muted active" aria-current="page">
                                        {productId ? 'Edit' : 'Create'}
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card" style={{ paddingTop: '1.5rem' }}>
                            <div style={{ margin: '0 1.5rem 1.5rem' }}>
                                <h5 className="card-title">Name Product</h5>
                                <input
                                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                                    value={product?.name || ''}
                                    className="form-control w-50"
                                    type="text"
                                    placeholder="Enter Name Product!"
                                />
                            </div>
                            
                            <div style={{ margin: '0 1.5rem 1.5rem' }}>
                                <h5 className="card-title">Description</h5>
                                <input
                                    onChange={(e) => setProduct({ ...product, description: e.target.value })}
                                    value={product?.description || ''}
                                    className="form-control w-50"
                                    type="text"
                                    placeholder="Enter Description Product!"
                                />
                            </div>

                            <div style={{ margin: '0 1.5rem 1.5rem' }}>
                                <h5 className="card-title">Price Product</h5>
                                <input
                                    onChange={(e) => setProduct({ ...product, price: e.target.value })}
                                    value={product?.price || ''}
                                    className="form-control w-50"
                                    type="text"
                                    placeholder="Enter Price Product!"
                                />
                            </div>

                            <div style={{ margin: '0 1.5rem 1.5rem' }}>
                                <h5 className="card-title">Image</h5>
                                <input 
                                    type="file" 
                                    onChange={onSelectImage}
                                    className="product-file__upload-btn"
                                />
                            </div>

                            <div style={{ margin: '0 1.5rem 1.5rem' }}>
                                <h5 className="card-title">Category</h5>
                                <select 
                                    className="form-control w-50"
                                    value={product?.category || ''} 
                                    onChange={(e) => setProduct({ ...product, category: e.target.value })}
                                >
                                    <option value="">Choose Category</option>
                                    {categoires?.map(item => (
                                        <option key={item._id} value={item._id}>{item?.category}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="d-flex" style={{ margin: '0 1.5rem 1.5rem' }}>
                                <button
                                    disabled={!product?.name || !product?.price || !product?.category}
                                    onClick={handleCreateProduct}
                                    style={{ color: 'white' }}
                                    className='btn btn-success'>
                                    {productId ? 'Update Product' : 'Create Product'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewEdit;