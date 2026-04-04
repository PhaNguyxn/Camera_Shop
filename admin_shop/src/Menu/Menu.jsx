import React from 'react';

function Menu(props) {
    return (
        <aside className="left-sidebar" data-sidebarbg="skin6">
            <div className="scroll-sidebar" data-sidebarbg="skin6">
                <nav className="sidebar-nav">
                    <ul id="sidebarnav">
                        {/* --- DASHBOARD --- */}
                        <li className="sidebar-item"> 
                            <a className="sidebar-link sidebar-link" href='/'>
                                <i data-feather="home" className="feather-icon"></i>
                                <span className="hide-menu">Dashboard</span>
                            </a>
                        </li>

                        <li className="list-divider"></li>

                        {/* --- COMPONENTS / DATATABLES --- */}
                        <li className="nav-small-cap"><span className="hide-menu">Management</span></li>

                        {/* Mục Users */}
                        <li className="sidebar-item"> 
                            <a className="sidebar-link" href="/users">
                                <i data-feather="users" className="feather-icon"></i>
                                <span className="hide-menu">Users</span>
                            </a>
                        </li>

                        {/* Mục Products */}
                        <li className="sidebar-item"> 
                            <a className="sidebar-link" href="/products">
                                <i data-feather="camera" className="feather-icon"></i>
                                <span className="hide-menu">Products</span>
                            </a>
                        </li>

                        {/* Mục Categories */}
                        <li className="sidebar-item"> 
                            <a className="sidebar-link" href="/categories">
                                <i data-feather="layers" className="feather-icon"></i>
                                <span className="hide-menu">Categories</span>
                            </a>
                        </li>

                        {/* Mục History */}
                        <li className="sidebar-item"> 
                            <a className="sidebar-link" href="/history">
                                <i data-feather="file-text" className="feather-icon"></i>
                                <span className="hide-menu">History</span>
                            </a>
                        </li>

                        <li className="list-divider"></li>
                    </ul>
                </nav>
            </div>
        </aside>
    );
}

export default Menu;