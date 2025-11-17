import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import {
  FiUser,
  FiShoppingBag,
  FiLogOut,
  FiMenu,
  FiX,
  FiPackage,
  FiGrid
} from 'react-icons/fi';
import { MdSpaceDashboard } from 'react-icons/md';
import './Header.scss';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { getCartCount } = useContext(CartContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="header">
        <div className="header-main">
          <div className="container">
            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>

            <Link to="/" className="logo">
              <img
                src="/Bastard.png"
                alt="Bastard Logo"
                height={94}
                className="logo h-12 w-auto object-contain"
              />
            </Link>

            <nav className={`nav-icons ${mobileMenuOpen ? 'mobile-active' : ''}`}>
              {/* Products Link - Replaces Search */}
              <Link
                to="/products"
                className="nav-icon"
                data-tooltip="Products"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiGrid />
              </Link>

              {user ? (
                <>
                  {user.isAdmin ? (
                    <Link to="/admin" className="nav-icon" data-tooltip="Dashboard">
                      <MdSpaceDashboard />
                    </Link>
                  ) : (
                    <>
                      <Link to="/orders" className="nav-icon" data-tooltip="Orders">
                        <FiPackage />
                      </Link>
                      <Link to="/profile" className="nav-icon" data-tooltip="Profile">
                        <FiUser />
                      </Link>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="nav-icon"
                    data-tooltip="Logout"
                  >
                    <FiLogOut />
                  </button>
                </>
              ) : (
                <Link to="/login" className="nav-icon" data-tooltip="Login">
                  <FiUser />
                </Link>
              )}

              {!user?.isAdmin && (
                <Link to="/cart" className="nav-icon cart-icon" data-tooltip="Cart">
                  <FiShoppingBag />
                  {getCartCount() > 0 && (
                    <span className="cart-count">{getCartCount()}</span>
                  )}
                </Link>
              )}
            </nav>
          </div>
        </div>

        {/* Free Shipping Banner */}
        <div className="shipping-banner">
          <div className="container">
            <p>🎉 Free Shipping Above ₹1399</p>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;