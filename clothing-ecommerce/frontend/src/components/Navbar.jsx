import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { getCartItemCount } = useCart();

  const cartItemCount = getCartItemCount();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Clothing Store
        </Link>

        <div className="navbar-menu">
          <Link to="/products" className="navbar-link">
            Products
          </Link>

          <Link to="/cart" className="navbar-link cart-link">
            Cart
            {cartItemCount > 0 && (
              <span className="cart-count">{cartItemCount}</span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="navbar-user">
              <span className="navbar-welcome">Welcome, {user?.name}</span>
              <button onClick={logout} className="navbar-btn logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <div className="navbar-auth">
              <Link to="/login" className="navbar-btn login-btn">
                Login
              </Link>
              <Link to="/register" className="navbar-btn register-btn">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
