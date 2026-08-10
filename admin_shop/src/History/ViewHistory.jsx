import React, { useEffect, useState, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import HistoryAPI from "../API/HistoryAPI";

function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}

const ViewHistory = () => {
    const historyId = useQuery().get('id');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleString('vi-VN');
    };

    useEffect(() => {
        if (historyId) {
            const fetchDetail = async () => {
                try {
                    setLoading(true);
                    const res = await HistoryAPI.getDetail(historyId);
                    
                    if (res && res._id) {
                        setOrder(res);
                    }
                } catch (error) {
                    console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchDetail();
        }
    }, [historyId]);

    if (loading) {
        return (
            <div className="page-wrapper">
                <div className="container-fluid">Đang tải dữ liệu...</div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="page-wrapper">
                <div className="container-fluid">Không tìm thấy thông tin đơn hàng!</div>
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            <div className="page-breadcrumb">
                <div className="row">
                    <div className="col-7 align-self-center">
                        <h4 className="page-title text-truncate text-dark font-weight-medium mb-1">
                            Order Detail
                        </h4>
                        <div className="d-flex align-items-center">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb m-0 p-0">
                                    <li className="breadcrumb-item">
                                        <Link to="/" className="text-muted">Home</Link>
                                    </li>
                                    <li className="breadcrumb-item text-muted active">
                                        Order History
                                    </li>
                                    <li className="breadcrumb-item text-muted active">
                                        ID: {order._id}
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
                                <h5 className="card-title">Information Order</h5>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label>Full Name:</label>
                                        <input className="form-control" value={order.fullname || ''} disabled />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label>Phone:</label>
                                        <input className="form-control" value={order.phone || ''} disabled />
                                    </div>
                                    <div className="col-12 mb-3">
                                        <label>Address:</label>
                                        <input className="form-control" value={order.address || ''} disabled />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label>Total:</label>
                                        <input 
                                            className="form-control text-danger font-weight-bold" 
                                            value={`${parseInt(order.total).toLocaleString()} đ`} 
                                            disabled 
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label>Order Date:</label>
                                        <input 
                                            className="form-control" 
                                            value={formatDate(order.createdAt)} 
                                            disabled 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={{ margin: '0 1.5rem 1.5rem' }}>
                                <h5 className="card-title">Products List</h5>
                                <div className="table-responsive">
                                    <table className="table table-bordered">
                                        <thead className="bg-light">
                                            <tr>
                                                <th>ID Product</th>
                                                <th>Image</th>
                                                <th>Name</th>
                                                <th>Price</th>
                                                <th>Count</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.cart && order.cart.map((p, i) => (
                                                <tr key={i}>
                                                    <td className="text-truncate" style={{ maxWidth: '150px' }}>{p.idProduct}</td>
                                                    <td>
                                                        <img src={p.img} alt={p.nameProduct} style={{ width: '60px' }} />
                                                    </td>
                                                    <td>{p.nameProduct}</td>
                                                    <td>{p.priceProduct.toLocaleString()}</td>
                                                    <td>{p.count}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="d-flex" style={{ margin: '0 1.5rem 1.5rem' }}>
                                <a
                                    href={`/history`}
                                    className="btn btn-secondary"
                                    style={{ color: 'white' }}
                                >
                                    Back to History
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewHistory;