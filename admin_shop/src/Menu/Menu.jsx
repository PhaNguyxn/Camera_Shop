import React from 'react';
import { NavLink } from 'react-router-dom';

function Menu({ onNavigate }) {
    return (
        <aside className="left-sidebar" data-sidebarbg="skin6">
            <div className="scroll-sidebar" data-sidebarbg="skin6">
                <nav className="sidebar-nav">
                    <ul id="sidebarnav">
                        {/* --- DASHBOARD --- */}
                        <li className="sidebar-item"> 
                            <NavLink exact className="sidebar-link" activeClassName="active" to='/' onClick={onNavigate}>
                                <i data-feather="home" className="feather-icon"></i>
                                <span className="hide-menu">Dashboard</span>
                            </NavLink>
                        </li>

                        <li className="list-divider"></li>

                        {/* --- COMPONENTS / DATATABLES --- */}
                        <li className="nav-small-cap"><span className="hide-menu">Management</span></li>

                        {/* Mục Users */}
                        <li className="sidebar-item"> 
                            <NavLink className="sidebar-link" activeClassName="active" to="/users" onClick={onNavigate}>
                                <i data-feather="users" className="feather-icon"></i>
                                <span className="hide-menu">Users</span>
                            </NavLink>
                        </li>

                        {/* Mục Products */}
                        <li className="sidebar-item"> 
                            <NavLink className="sidebar-link" activeClassName="active" to="/products" onClick={onNavigate}>
                                <i data-feather="camera" className="feather-icon"></i>
                                <span className="hide-menu">Products</span>
                            </NavLink>
                        </li>

                        {/* Mục Categories */}
                        <li className="sidebar-item"> 
                            <NavLink className="sidebar-link" activeClassName="active" to="/categories" onClick={onNavigate}>
                                <i data-feather="layers" className="feather-icon"></i>
                                <span className="hide-menu">Categories</span>
                            </NavLink>
                        </li>

                        {/* Mục History */}
                        <li className="sidebar-item"> 
                            <NavLink className="sidebar-link" activeClassName="active" to="/history" onClick={onNavigate}>
                                <i data-feather="file-text" className="feather-icon"></i>
                                <span className="hide-menu">History</span>
                            </NavLink>
                        </li>

                        <li className="list-divider"></li>
                    </ul>
                </nav>
            </div>
        </aside>
    );
}

export default Menu;
