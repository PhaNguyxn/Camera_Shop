import React, { useState, useEffect } from 'react';
import feather from 'feather-icons';
import HistoryAPI from '../API/HistoryAPI';
import ProductAPI from '../API/ProductAPI';

function Home(props) {
    const [statistics, setStatistics] = useState({
        totalClients: 0,
        totalEarnings: 0,
        totalOrders: 0,
        totalProducts: 0
    });
    const [historyList, setHistoryList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [allHistories, allProducts] = await Promise.all([
                    HistoryAPI.getAll(),
                    ProductAPI.getAPI()
                ]);

                const histories = allHistories || [];
                const products = allProducts || [];

                const earnings = histories.reduce((sum, item) => sum + Number(item.total || 0), 0);
                const uniqueClients = new Set(histories.map(item => item.idUser)).size;

                setStatistics({
                    totalClients: uniqueClients,
                    totalEarnings: earnings,
                    totalOrders: histories.length,
                    totalProducts: products.length
                });

                const sortedHistories = [...histories].reverse().slice(0, 5);
                setHistoryList(sortedHistories);
                setLoading(false);
            } catch (error) {
                console.error("Lỗi khi kết nối dữ liệu thật:", error);
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    useEffect(() => {
        if (!loading) {
            feather.replace();
        }
    }, [loading, historyList]);

    const formatVND = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(Number(price || 0));
    };

    if (loading) return <div className="page-wrapper p-5 text-center">Đang đồng bộ dữ liệu hệ thống...</div>;

    return (
        <div className="page-wrapper">
            <div className="page-breadcrumb">
                <div className="row">
                    <div className="col-7 align-self-center">
                        <h3 className="page-title text-truncate text-dark font-weight-medium mb-1">
                            Management System
                        </h3>
                    </div>
                </div>
            </div>

            <div className="container-fluid">
                <div className="card-group">
                    {/* Khách hàng */}
                    <div className="card border-right">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div className="mr-3">
                                    <span className="btn btn-primary btn-circle">
                                        <i data-feather="users"></i>
                                    </span>
                                </div>
                                <div>
                                    <h2 className="text-dark mb-1 font-weight-medium">{statistics.totalClients}</h2>
                                    <h6 className="text-muted font-weight-normal mb-0">Clients</h6>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Doanh thu */}
                    <div className="card border-right">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div className="mr-3">
                                    <span className="btn btn-success btn-circle text-white">
                                        <i data-feather="dollar-sign"></i>
                                    </span>
                                </div>
                                <div>
                                    <h2 className="text-dark mb-1 font-weight-medium" style={{ fontSize: '1.2rem' }}>
                                        {formatVND(statistics.totalEarnings)}
                                    </h2>
                                    <h6 className="text-muted font-weight-normal mb-0">Earnings</h6>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Đơn hàng */}
                    <div className="card border-right">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div className="mr-3">
                                    <span className="btn btn-danger btn-circle">
                                        <i data-feather="file-text"></i>
                                    </span>
                                </div>
                                <div>
                                    <h2 className="text-dark mb-1 font-weight-medium">{statistics.totalOrders}</h2>
                                    <h6 className="text-muted font-weight-normal mb-0">Orders</h6>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sản phẩm */}
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div className="mr-3">
                                    <span className="btn btn-warning btn-circle text-white">
                                        <i data-feather="package"></i>
                                    </span>
                                </div>
                                <div>
                                    <h2 className="text-dark mb-1 font-weight-medium">{statistics.totalProducts}</h2>
                                    <h6 className="text-muted font-weight-normal mb-0">Products</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table đơn hàng giữ nguyên cấu hình của bạn */}
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card shadow-sm" style={{ borderRadius: '15px' }}>
                            <div className="card-body">
                                <h4 className="card-title">Recent Orders</h4>
                                <div className="table-responsive">
                                    <table className="table no-wrap v-middle mb-0">
                                        <thead>
                                            <tr className="border-0">
                                                <th className="border-0 font-14 font-weight-medium text-muted">Customer</th>
                                                <th className="border-0 font-14 font-weight-medium text-muted">Phone Number</th>
                                                <th className="border-0 font-14 font-weight-medium text-muted">Total Amount</th>
                                                <th className="border-0 font-14 font-weight-medium text-muted text-center">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {historyList.map((item) => (
                                                <tr key={item._id}>
                                                    <td className="px-2 py-4">
                                                        <h5 className="text-dark mb-0 font-16 font-weight-medium">{item.fullname}</h5>
                                                        <small className="text-muted">{item.idUser}</small>
                                                    </td>
                                                    <td className="text-muted px-2 py-4 font-14">{item.phone}</td>
                                                    <td className="text-dark px-2 py-4 font-weight-medium">{formatVND(item.total)}</td>
                                                    <td className="text-center px-2 py-4">
                                                        <span className={`badge ${item.status ? 'bg-success' : 'bg-warning'} text-white px-3 py-1`}>
                                                            {item.status ? 'Delivery' : 'Pending'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
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

export default Home;