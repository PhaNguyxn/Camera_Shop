import React, { useEffect, useState } from 'react';
import ProductAPI from '../API/ProductAPI';

function Categories(props) {

    const [categories, setCategories] = useState([]);
    const [temp, setTemp] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await ProductAPI.getCategories();
            setCategories(response);
            setTemp(response); // lưu dữ liệu gốc để search
        };

        fetchData();
    }, []);

    // 🔍 SEARCH
    const handleSearch = (e) => {
        const value = e.target.value;

        if (!value) {
            setCategories(temp);
            return;
        }

        const filterData = temp.filter(item =>
            item.category.toLowerCase().includes(value.toLowerCase())
        );

        setCategories(filterData);
    };

    // 🗑 DELETE
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Bạn có chắc muốn xóa không?");
        if (!confirmDelete) return;

        try {
            await ProductAPI.deleteCategory(id);

            // cập nhật UI không reload
            const newData = categories.filter(item => item._id !== id);
            setCategories(newData);
            setTemp(newData);

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="page-wrapper">
            <div className="page-breadcrumb">
                <div className="row">
                    <div className="col-7 align-self-center">
                        <h4 className="page-title text-truncate text-dark font-weight-medium mb-1">Categories Manage</h4>
                    </div>
                </div>
            </div>

            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">

                                <h4 className="card-title">Categories</h4>

                                <div className='d-flex justify-content-between'>
                                    <input
                                        className="form-control w-25"
                                        type="text"
                                        placeholder="Enter Search!"
                                        onChange={handleSearch}
                                    />

                                    <a
                                        href={'/categories/view-edit'}
                                        className='btn btn-success'
                                        style={{ color: 'white' }}
                                    >
                                        Create Category
                                    </a>
                                </div>

                                <br />

                                <div className="table-responsive">
                                    <table className="table table-striped table-bordered no-wrap">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Category</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {
                                                categories?.map(value => (
                                                    <tr key={value._id}>
                                                        <td>{value._id}</td>
                                                        <td>{value.category}</td>
                                                        <td>
                                                            <a
                                                                href={`/categories/view-edit?id=${value._id}`}
                                                                className="btn btn-success"
                                                                style={{ color: 'white' }}
                                                            >
                                                                Update
                                                            </a>

                                                            &nbsp;

                                                            <button
                                                                onClick={() => handleDelete(value._id)}
                                                                className="btn btn-danger"
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>

                                    </table>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Categories;