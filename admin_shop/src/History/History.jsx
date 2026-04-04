import React, { useEffect, useState } from 'react';
import HistoryAPI from '../API/HistoryAPI';
import { useHistory } from 'react-router-dom';

function History(props) {

    const historyRouter = useHistory();

    const [history, setHistory] = useState([]);
    const [temp, setTemp] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await HistoryAPI.getAll();
            setHistory(response);
            setTemp(response);
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

    return (
        <div className="page-wrapper">
            <div className="page-breadcrumb">
                <div className="row">
                    <div className="col-7 align-self-center">
                        <h4 className="page-title text-truncate text-dark font-weight-medium mb-1">Order History Manage</h4>
                        
                    </div>
                </div>
            </div>


            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">

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
                                                history?.map(item => (
                                                    <tr key={item._id}>
                                                        <td>{item.idUser}</td>
                                                        <td>{item.fullname}</td>
                                                        <td>{item.phone}</td>
                                                        <td>{item.address}</td>
                                                        <td>{item.total}</td>
                                                        <td>{formatDate(item.createdAt)}</td>
                                                        <td>{item.delivery ? 'Đã Vận Chuyển' : 'Chưa Vận Chuyển'}</td>
                                                        <td>{item.status ? 'Đã Thanh Toán' : 'Chưa Thanh Toán'}</td>
                                                        <td>
                                                            <a href={`/history/view?id=${item._id}`} style={{cursor: 'pointer', color: 'white'}} className="btn btn-success">View</a>
                
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

export default History;