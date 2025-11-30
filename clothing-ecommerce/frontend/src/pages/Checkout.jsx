import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';

const Checkout = () => {
  const { items, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const cartTotal = getCartTotal();
  const shippingCost = cartTotal > 50 ? 0 : 9.99;
  const finalTotal = cartTotal + shippingCost;

  React.useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const handleShippingChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentChange = (e) => {
    setPaymentInfo({
      ...paymentInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setProcessing(true);

    try {
      // Create order
      const response = await orderAPI.createOrder();
      
      if (response.data) {
        clearCart();
        navigate(`/order/${response.data._id}`);
      }
    } catch (error) {
      setError('Failed to process order. Please try again.');
      console.error('Checkout error:', error);
    } finally {
      setProcessing(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <div className="checkout-steps">
            <div className="step active">
              <span className="step-number">1</span>
              <span className="step-label">Shipping</span>
            </div>
            <div className="step active">
              <span className="step-number">2</span>
              <span className="step-label">Payment</span>
            </div>
            <div className="step">
              <span className="step-number">3</span>
              <span className="step-label">Review</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="checkout-content">
            <div className="checkout-main">
              <div className="checkout-section">
                <h2>Shipping Information</h2>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label htmlFor="address">Street Address</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleShippingChange}
                      required
                      placeholder="123 Main St"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleShippingChange}
                      required
                      placeholder="New York"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="state">State</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleShippingChange}
                      required
                      placeholder="NY"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="zipCode">ZIP Code</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={handleShippingChange}
                      required
                      placeholder="10001"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleShippingChange}
                      required
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              <div className="checkout-section">
                <h2>Payment Information</h2>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label htmlFor="cardNumber">Card Number</label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={paymentInfo.cardNumber}
                      onChange={(e) => {
                        const formatted = formatCardNumber(e.target.value);
                        setPaymentInfo({...paymentInfo, cardNumber: formatted});
                      }}
                      required
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="cardName">Cardholder Name</label>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      value={paymentInfo.cardName}
                      onChange={handlePaymentChange}
                      required
                      placeholder="John Doe"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="expiryDate">Expiry Date</label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={paymentInfo.expiryDate}
                      onChange={handlePaymentChange}
                      required
                      placeholder="MM/YY"
                      maxLength="5"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="cvv">CVV</label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={paymentInfo.cvv}
                      onChange={handlePaymentChange}
                      required
                      placeholder="123"
                      maxLength="4"
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
            </div>

            <div className="checkout-sidebar">
              <div className="order-summary">
                <h2>Order Summary</h2>
                
                <div className="order-items">
                  {items.map((item, index) => (
                    <div key={`${item.productId}-${item.size}-${index}`} className="order-item">
                      <div className="order-item-info">
                        <div className="order-item-name">{item.product.name}</div>
                        <div className="order-item-details">
                          Size: {item.size} | Qty: {item.qty}
                        </div>
                      </div>
                      <div className="order-item-price">
                        ${(item.product.price * item.qty).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="summary-divider"></div>
                
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>
                    {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                
                <div className="summary-divider"></div>
                
                <div className="summary-row total">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="place-order-btn"
              >
                {processing ? 'Processing...' : 'Place Order'}
              </button>

              <div className="security-notice">
                <span className="security-icon">🔒</span>
                <span>Your payment information is secure and encrypted</span>
              </div>
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        .checkout-page {
          padding: 2rem 1rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .checkout-header {
          margin-bottom: 2rem;
        }

        .checkout-header h1 {
          margin: 0 0 1.5rem 0;
          color: #333;
          font-size: 2rem;
        }

        .checkout-steps {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .step {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #999;
        }

        .step.active {
          color: #007bff;
        }

        .step-number {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 2px solid currentColor;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .step.active .step-number {
          background-color: #007bff;
          color: white;
          border-color: #007bff;
        }

        .step-label {
          font-weight: 500;
          font-size: 0.875rem;
        }

        .checkout-content {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 2rem;
        }

        .checkout-section {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .checkout-section h2 {
          margin: 0 0 1.5rem 0;
          color: #333;
          font-size: 1.25rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: #333;
          font-weight: 500;
          font-size: 0.875rem;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }

        .form-input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
        }

        .checkout-sidebar {
          position: sticky;
          top: 100px;
          height: fit-content;
        }

        .order-summary {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .order-summary h2 {
          margin: 0 0 1.5rem 0;
          color: #333;
          font-size: 1.25rem;
        }

        .order-items {
          margin-bottom: 1.5rem;
        }

        .order-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .order-item-info {
          flex: 1;
          margin-right: 1rem;
        }

        .order-item-name {
          font-weight: 500;
          color: #333;
          margin-bottom: 0.25rem;
        }

        .order-item-details {
          font-size: 0.875rem;
          color: #666;
        }

        .order-item-price {
          font-weight: 600;
          color: #333;
        }

        .summary-divider {
          height: 1px;
          background-color: #e9ecef;
          margin: 1rem 0;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          font-size: 0.875rem;
        }

        .summary-row.total {
          font-weight: 600;
          font-size: 1rem;
          color: #333;
        }

        .place-order-btn {
          width: 100%;
          padding: 1rem;
          background-color: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s;
          margin-bottom: 1rem;
        }

        .place-order-btn:hover:not(:disabled) {
          background-color: #218838;
        }

        .place-order-btn:disabled {
          background-color: #6c757d;
          cursor: not-allowed;
        }

        .security-notice {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #666;
          text-align: center;
          justify-content: center;
        }

        .error-message {
          background-color: #f8d7da;
          color: #721c24;
          padding: 1rem;
          border-radius: 4px;
          margin-bottom: 1.5rem;
          border: 1px solid #f5c6cb;
        }

        @media (max-width: 1024px) {
          .checkout-content {
            grid-template-columns: 1fr;
          }

          .checkout-sidebar {
            position: static;
            order: -1;
          }
        }

        @media (max-width: 768px) {
          .checkout-page {
            padding: 1rem;
          }

          .checkout-steps {
            gap: 1rem;
          }

          .step-label {
            display: none;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .checkout-section {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Checkout;
