import React, { useEffect, useState } from 'react';
import UserAPI from '../API/UserAPI';

function Users() {



    const [users, setUsers] = useState([]);

    const [search, setSearch] = useState('');

    const [editingUser, setEditingUser] = useState(null);



    

    const fetchData = async () => {

        try {

            const response = await UserAPI.getAllData();

            setUsers(response);

        } catch (err) {

            console.error(err);

        }

    };



    useEffect(() => {

        fetchData();

    }, []);



    // 🔍 SEARCH

    const filteredUsers = users.filter(u =>

        u.fullname.toLowerCase().includes(search.toLowerCase()) ||

        u.email.toLowerCase().includes(search.toLowerCase())

    );



    // 🗑 DELETE

    const handleDelete = async (id) => {

        if (!window.confirm("Bạn có chắc muốn xóa?")) return;



        try {

            await UserAPI.deleteUser(id);

            fetchData();

        } catch (err) {

            console.error(err);

            alert("Xóa thất bại!");

        }

    };



    // ✏️ UPDATE

    const handleUpdate = (user) => {

        setEditingUser(user);

    };



    const handleSave = async () => {

        try {

            await UserAPI.updateUser(editingUser._id, editingUser);

            setEditingUser(null);

            fetchData();

        } catch (err) {

            console.error(err);

            alert("Update thất bại!");

        }

    };

    return (
        <div className="page-wrapper">
            <div className="page-breadcrumb">
                <div className="row">
                    <div className="col-7 align-self-center">
                        <h4 className="page-title text-truncate text-dark font-weight-medium mb-1">Users Manage</h4>

                    </div>
                </div>
            </div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Users</h4>
                                 <input

                    className="form-control w-25"

                    placeholder="Enter Search!"

                    value={search}

                    onChange={(e) => setSearch(e.target.value)}

                />
                                <br/>
                                <div className="table-responsive">
                                    <table className="table table-striped table-bordered no-wrap">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Fullname</th>
                                                <th>Email</th>
                                                <th>Phone</th>
                                                <th>Edit</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                        
                                                {filteredUsers.map(user => (

                            <tr key={user._id}>



                                <td>{user._id}</td>



                                <td>

                                    {editingUser?._id === user._id ? (

                                        <input

                                            value={editingUser.fullname}

                                            onChange={(e) =>

                                                setEditingUser({

                                                    ...editingUser,

                                                    fullname: e.target.value

                                                })

                                            }

                                        />

                                    ) : user.fullname}

                                </td>



                                <td>

                                    {editingUser?._id === user._id ? (

                                        <input

                                            value={editingUser.email}

                                            onChange={(e) =>

                                                setEditingUser({

                                                    ...editingUser,

                                                    email: e.target.value

                                                })

                                            }

                                        />

                                    ) : user.email}

                                </td>



                                <td>

                                    {editingUser?._id === user._id ? (

                                        <input

                                            value={editingUser.phone}

                                            onChange={(e) =>

                                                setEditingUser({

                                                    ...editingUser,

                                                    phone: e.target.value

                                                })

                                            }

                                        />

                                    ) : user.phone}

                                </td>



                                <td>

                                    {editingUser?._id === user._id ? (

                                        <>

                                            <button

                                                className="btn btn-primary"

                                                onClick={handleSave}

                                            >

                                                Save

                                            </button>

                                            &nbsp;

                                            <button

                                                className="btn btn-secondary"

                                                onClick={() => setEditingUser(null)}

                                            >

                                                Cancel

                                            </button>

                                        </>

                                    ) : (

                                        <>

                                            <button

                                                className="btn btn-success"

                                                onClick={() => handleUpdate(user)}

                                            >

                                                Update

                                            </button>

                                            &nbsp;

                                            <button

                                                className="btn btn-danger"

                                                onClick={() => handleDelete(user._id)}

                                            >

                                                Delete

                                            </button>

                                        </>

                                    )}

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

export default Users;