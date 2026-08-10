import React, { useEffect, useState } from 'react';
import HistoryAPI from '../API/HistoryAPI';
import { useHistory } from 'react-router-dom';

function History() {

    const historyRouter = useHistory();

    const [history, setHistory] = useState([]);
    const [temp, setTemp] = useState([]);
    const [loadingIds, setLoadingIds] = useState([]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await HistoryAPI.getAll();
                setHistory(response);
                setTemp(response);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    // 🔍 SEARCH
    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();

        if (!value) {
            setHistory(temp);
            return;
        }

        const filterData = temp.filter(item =>
            item.fullname?.toLowerCase().includes(value) ||
            item.phone?.toLowerCase().includes(value) ||
            item.address?.toLowerCase().includes(value)
        );

        setHistory(filterData);
    };

    // 👉 VIEW PAGE
    const handleView = (id) => {
        historyRouter.push(`/history/view?id=${id}`);
    };

    // 🕒 FORMAT DATE
    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleString('en-US');
    };

    const handleUpdateStatus = async (id, value) => {
    try {
        setLoadingIds(prev => [...prev, id]);

        await HistoryAPI.updateStatus(id, { 
            status: value ? 1 : 0   // 🔥 FIX QUAN TRỌNG
        });

        const newData = history.map(item =>
            item._id === id ? { ...item, status: value ? 1 : 0 } : item
        );

        setHistory(newData);
        setTemp(newData);

    } catch (error) {
        console.log(error);
    } finally {
        setLoadingIds(prev => prev.filter(item => item !== id));
    }
};


    
    return (
        <div className="page-wrapper">
            <div className="page-breadcrumb">
                <div className="row">
                    <div className="col-7 align-self-center">
                        <h4 className="page-title text-dark font-weight-medium mb-1">
                            Order History Manage
                        </h4>
                    </div>
                </div>
            </div>

            <div className="container-fluid">
                <div className="card">
                    <div className="card-body">

                        <h4 className="card-title">Order List</h4>

                        <input
                            className="form-control w-25"
                            type="text"
                            placeholder="Enter Search!"
                            onChange={handleSearch}
                        />

                        <br />

                        <div className="table-responsive">
                            <table className="table table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th>User ID</th>
                                        <th>Name</th>
                                        <th>Phone</th>
                                        <th>Address</th>
                                        <th>Total</th>
                                        <th>Order Date</th>
                                        <th>Delivery</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        history?.map(item => {
                                            const isLoading = loadingIds.includes(item._id);
                                            const statusBool = item.status === 1 || item.status === true;
                                            return (
                                                <tr key={item._id}>
                                                    <td>{item.idUser}</td>
                                                    <td>{item.fullname}</td>
                                                    <td>{item.phone}</td>
                                                    <td>{item.address}</td>
                                                    <td>{item.total}</td>
                                                    <td>{formatDate(item.createdAt)}</td>
                                                    <td>
                                                        {item.delivery ? 'Đã Vận Chuyển' : 'Chưa Vận Chuyển'}
                                                    </td>

                                                    {/* ✅ SELECT STATUS */}
                                                    <td>
                                                        <select
    value={String(statusBool)}
    disabled={isLoading}
    onChange={(e) =>
        handleUpdateStatus(item._id, e.target.value === "true")
    }
    style={{
        padding: '4px 8px',
            borderRadius: '20px',
            border: '1px solid #ccc',
            backgroundColor: (item.status === 1 || item.status === true) ? '#d4edda' : '#f8d7da',
            color: (item.status === 1 || item.status === true) ? '#155724' : '#721c24',
            fontWeight: '500',
            fontSize: '13px',
            width: '140px',        
            height: '32px',
            outline: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer'
    }}
>
    <option value="false">Chưa Thanh Toán</option>
    <option value="true">Đã Thanh Toán</option>
</select>

                                                        {isLoading && (
                                                            <div style={{ fontSize: '12px', color: '#999' }}>
                                                                Đang cập nhật...
                                                            </div>
                                                        )}
                                                    </td>

                                                    <td>
                                                        <a
    href={`/history/view?id=${item._id}`}
    style={{ cursor: 'pointer', color: 'white' }}
    className="btn btn-success"
>
    View
</a>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    }
                                </tbody>

                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default History;