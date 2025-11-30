import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartItem from '../components/CartItem';

const Cart = () => {
  const { items, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  const cartTotal = getCartTotal();
  const shippingCost = cartTotal > 50 ? 0 : 9.99;
  const finalTotal = cartTotal + shippingCost;

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any products to your cart yet.</p>
          <Link to="/products" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </div>

        <style jsx>{`
          .cart-page {
            min-height: 60vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem 1rem;
          }

          .empty-cart {
            text-align: center;
            max-width: 500px;
          }

          .empty-cart-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
          }

          .empty-cart h2 {
            margin: 0 0 1rem 0;
            color: #333;
            font-size: 1.75rem;
          }

          .empty-cart p {
            margin: 0 0 2rem 0;
            color: #666;
            font-size: 1rem;
          }

          .continue-shopping-btn {
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 1rem 2rem;
            border-radius: 4px;
            text-decoration: none;
            font-weight: 500;
            transition: background-color 0.3s;
          }

          .continue-shopping-btn:hover {
            background-color: #0056b3;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <p>{items.length} {items.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {items.map((item, index) => (
              <CartItem key={`${item.productId}-${item.size}-${index}`} item={item} />
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h2>Order Summary</h2>
              
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <span>
                  {shippingCost === 0 ? (
                    <span className="free-shipping">FREE</span>
                  ) : (
                    `$${shippingCost.toFixed(2)}`
                  )}
                </span>
              </div>
              
              {shippingCost > 0 && (
                <div className="shipping-note">
                  Add ${(50 - cartTotal).toFixed(2)} more for free shipping!
                </div>
              )}
              
              <div className="summary-divider"></div>
              
              <div className="summary-row total">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>

              {!isAuthenticated && (
                <div className="auth-notice">
                  <p>Please <Link to="/login">sign in</Link> to checkout</p>
                </div>
              )}

              <Link 
                to={isAuthenticated ? "/checkout" : "/login"}
                className="checkout-btn"
              >
                {isAuthenticated ? 'Proceed to Checkout' : 'Sign In to Checkout'}
              </Link>

              <div className="cart-actions">
                <Link to="/products" className="continue-shopping-link">
                  Continue Shopping
                </Link>
                
                <button onClick={clearCart} className="clear-cart-btn">
                  Clear Cart
                </button>
              </div>
            </div>

            <div className="security-info">
              <div className="security-item">
                <span className="security-icon">🔒</span>
                <span>Secure checkout</span>
              </div>
              <div className="security-item">
                <span className="security-icon">↩️</span>
                <span>Easy returns</span>
              </div>
              <div className="security-item">
                <span className="security-icon">🚚</span>
                <span>Fast delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cart-page {
          padding: 2rem 1rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .cart-header {
          margin-bottom: 2rem;
        }

        .cart-header h1 {
          margin: 0 0 0.5rem 0;
          color: #333;
          font-size: 2rem;
        }

        .cart-header p {
          margin: 0;
          color: #666;
        }

        .cart-content {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 2rem;
        }

        .cart-items {
          display: flex;
          flex-direction: column;
        }

        .cart-summary {
          position: sticky;
          top: 100px;
          height: fit-content;
        }

        .summary-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .summary-card h2 {
          margin: 0 0 1.5rem 0;
          color: #333;
          font-size: 1.25rem;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          font-size: 1rem;
        }

        .summary-row.total {
          font-weight: 600;
          font-size: 1.125rem;
          color: #333;
        }

        .free-shipping {
          color: #28a745;
          font-weight: 600;
        }

        .shipping-note {
          background-color: #e7f3ff;
          color: #0066cc;
          padding: 0.75rem;
          border-radius: 4px;
          font-size: 0.875rem;
          margin-bottom: 1rem;
          text-align: center;
        }

        .summary-divider {
          height: 1px;
          background-color: #e9ecef;
          margin: 1rem 0;
        }

        .auth-notice {
          background-color: #fff3cd;
          border: 1px solid #ffeaa7;
          padding: 0.75rem;
          border-radius: 4px;
          margin-bottom: 1rem;
          text-align: center;
          font-size: 0.875rem;
        }

        .auth-notice a {
          color: #007bff;
          text-decoration: none;
          font-weight: 500;
        }

        .auth-notice a:hover {
          text-decoration: underline;
        }

        .checkout-btn {
          display: block;
          width: 100%;
          background-color: #28a745;
          color: white;
          padding: 1rem;
          border: none;
          border-radius: 4px;
          text-align: center;
          text-decoration: none;
          font-weight: 600;
          font-size: 1rem;
          margin-bottom: 1rem;
          transition: background-color 0.3s;
        }

        .checkout-btn:hover {
          background-color: #218838;
        }

        .cart-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
        }

        .continue-shopping-link {
          color: #007bff;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .continue-shopping-link:hover {
          text-decoration: underline;
        }

        .clear-cart-btn {
          background: transparent;
          border: none;
          color: #dc3545;
          font-size: 0.875rem;
          cursor: pointer;
          font-weight: 500;
        }

        .clear-cart-btn:hover {
          text-decoration: underline;
        }

        .security-info {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          padding: 1rem;
        }

        .security-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
          font-size: 0.875rem;
          color: #666;
        }

        .security-item:last-child {
          margin-bottom: 0;
        }

        .security-icon {
          font-size: 1rem;
        }

        @media (max-width: 1024px) {
          .cart-content {
            grid-template-columns: 1fr;
          }

          .cart-summary {
            position: static;
            order: -1;
          }
        }

        @media (max-width: 768px) {
          .cart-page {
            padding: 1rem;
          }

          .cart-header h1 {
            font-size: 1.75rem;
          }

          .cart-actions {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .continue-shopping-link {
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Cart;
