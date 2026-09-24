import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import feather from 'feather-icons';

function Header({ onToggleMenu }) {

    useEffect(() => {
        feather.replace();
    }, []);

    const onLogout = (e) => {
      e.preventDefault();

      sessionStorage.removeItem("token");
      sessionStorage.removeItem("id_user");
      sessionStorage.removeItem("name_user");
      sessionStorage.removeItem("role");

      window.location.href = "/login";
    };

    const LogoIcon = "/assets/images/logo-icon.png";
    const LogoText = "/assets/images/logo-text.png";
    const LogoLight = "/assets/images/logo-light-text.png";
    const UserImg = "/assets/images/img3.jpg"; 

    return (
        <header className="topbar" data-navbarbg="skin6">
            <nav className="navbar top-navbar navbar-expand-md">
                <div className="navbar-header" data-logobg="skin6">
                    <button className="admin-nav-toggle waves-effect waves-light d-block d-md-none border-0 bg-transparent" type="button" aria-label="Mở menu" onClick={onToggleMenu}>
                        <i className="ti-menu ti-close"></i>
                    </button>
                    
                    <div className="navbar-brand">
                        <Link to="/">
                            <b className="logo-icon">
                                <img src={LogoIcon} alt="homepage" className="dark-logo" />
                                <img src={LogoIcon} alt="homepage" className="light-logo" />
                            </b>
                            <span className="logo-text">
                                <img src={LogoText} alt="homepage" className="dark-logo" />
                                <img src={LogoLight} className="light-logo" alt="homepage" />
                            </span>
                        </Link>
                    </div>

                    <button className="topbartoggler d-block d-md-none waves-effect waves-light border-0 bg-transparent" 
                            type="button" data-toggle="collapse" data-target="#navbarSupportedContent">
                        <i className="ti-more"></i>
                    </button>
                </div>

                <div className="navbar-collapse collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav float-left mr-auto ml-3 pl-1">
                        <li className="nav-item dropdown">
                            <button className="nav-link dropdown-toggle border-0 bg-transparent" id="navbarDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i data-feather="settings" className="svg-icon"></i>
                            </button>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <Link className="dropdown-item" to="/settings">Cài đặt</Link>
                                <div className="dropdown-divider"></div>
                                <button className="dropdown-item border-0 bg-transparent">Trợ giúp</button>
                            </div>
                        </li>
                    </ul>

                    <ul className="navbar-nav float-right">
                        <li className="nav-item dropdown">
                            <button className="nav-link dropdown-toggle border-0 bg-transparent" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img 
                                    src={UserImg} 
                                    alt="user" 
                                    className="rounded-circle" 
                                    width="40" 
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/40' }}
                                />
                                <span className="ml-2 d-none d-lg-inline-block">
                                    <span>Xin chào,</span> <span className="text-dark">ADMIN</span> 
                                    <i data-feather="chevron-down" className="svg-icon"></i>
                                </span>
                            </button>
                            <div className="dropdown-menu dropdown-menu-right user-dd animated flipInY">
                                <button 
                                    className="dropdown-item border-0 bg-transparent w-100 text-left" 
                                    onClick={onLogout}
                                >
                                    <i data-feather="power" className="svg-icon mr-2 ml-1"></i>
                                    Đăng xuất
                                </button>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}

export default Header;
