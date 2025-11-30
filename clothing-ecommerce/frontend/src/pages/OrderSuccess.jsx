import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderAPI } from '../services/api';

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await orderAPI.getOrderById(id);
        setOrder(response.data);
      } catch (error) {
        setError('Order not found');
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="order-success-page">
        <div className="loading">Loading order details...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-success-page">
        <div className="error-container">
          <div className="error-icon">❌</div>
          <h2>Order Not Found</h2>
          <p>{error}</p>
          <Link to="/" className="home-btn">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="order-success-page">
      <div className="success-container">
        <div className="success-header">
          <div className="success-icon">✅</div>
          <h1>Order Confirmed!</h1>
          <p>Thank you for your purchase. Your order has been successfully placed.</p>
        </div>

        <div className="order-details">
          <div className="order-info-card">
            <h2>Order Information</h2>
            
            <div className="order-info-grid">
              <div className="info-item">
                <span className="info-label">Order ID:</span>
                <span className="info-value">#{order._id}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Order Date:</span>
                <span className="info-value">
                  {new Date(order.orderDate).toLocaleDateString()}
                </span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Status:</span>
                <span className={`info-value status ${order.status}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Total Amount:</span>
                <span className="info-value total">${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="order-items-card">
            <h2>Order Items</h2>
            
            <div className="order-items-list">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="item-image">
                    <img src={item.product?.image || '/placeholder.jpg'} alt={item.name} />
                  </div>
                  
                  <div className="item-details">
                    <h4 className="item-name">{item.name}</h4>
                    <p className="item-specs">Size: {item.size} | Quantity: {item.qty}</p>
                    <p className="item-price">${item.price.toFixed(2)} each</p>
                  </div>
                  
                  <div className="item-total">
                    <p>${(item.price * item.qty).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="next-steps">
          <h2>What's Next?</h2>
          
          <div className="steps-grid">
            <div className="step-item">
              <div className="step-icon">📧</div>
              <h3>Confirmation Email</h3>
              <p>You'll receive an order confirmation email shortly with all the details.</p>
            </div>
            
            <div className="step-item">
              <div className="step-icon">📦</div>
              <h3>Order Processing</h3>
              <p>We're preparing your order and will notify you when it ships.</p>
            </div>
            
            <div className="step-item">
              <div className="step-icon">🚚</div>
              <h3>Shipping</h3>
              <p>Your order will be delivered within 3-5 business days.</p>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <Link to="/products" className="continue-shopping-btn">
            Continue Shopping
          </Link>
          
          <Link to="/orders" className="view-orders-btn">
            View My Orders
          </Link>
        </div>

        <div className="support-info">
          <h3>Need Help?</h3>
          <p>If you have any questions about your order, please contact our customer support:</p>
          <p>Email: support@clothingstore.com | Phone: 1-800-CLOTHING</p>
        </div>
      </div>

      <style jsx>{`
        .order-success-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem 1rem;
        }

        .success-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .success-header {
          text-align: center;
          background: white;
          border-radius: 12px;
          padding: 3rem 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }

        .success-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .success-header h1 {
          margin: 0 0 1rem 0;
          color: #333;
          font-size: 2.5rem;
          font-weight: 700;
        }

        .success-header p {
          margin: 0;
          color: #666;
          font-size: 1.125rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .order-details {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .order-info-card, .order-items-card {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }

        .order-info-card h2, .order-items-card h2 {
          margin: 0 0 1.5rem 0;
          color: #333;
          font-size: 1.5rem;
        }

        .order-info-grid {
          display: grid;
          gap: 1rem;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid #f8f9fa;
        }

        .info-item:last-child {
          border-bottom: none;
        }

        .info-label {
          color: #666;
          font-weight: 500;
        }

        .info-value {
          color: #333;
          font-weight: 600;
        }

        .info-value.status {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
        }

        .info-value.status.pending {
          background-color: #fff3cd;
          color: #856404;
        }

        .info-value.status.processing {
          background-color: #cce5ff;
          color: #004085;
        }

        .info-value.status.shipped {
          background-color: #d4edda;
          color: #155724;
        }

        .info-value.total {
          color: #28a745;
          font-size: 1.125rem;
        }

        .order-items-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .order-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background-color: #f8f9fa;
          border-radius: 8px;
        }

        .item-image {
          width: 60px;
          height: 60px;
          border-radius: 4px;
          overflow: hidden;
          background-color: white;
        }

        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .item-details {
          flex: 1;
        }

        .item-name {
          margin: 0 0 0.25rem 0;
          color: #333;
          font-size: 1rem;
          font-weight: 600;
        }

        .item-specs {
          margin: 0 0 0.25rem 0;
          color: #666;
          font-size: 0.875rem;
        }

        .item-price {
          margin: 0;
          color: #007bff;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .item-total {
          text-align: right;
        }

        .item-total p {
          margin: 0;
          color: #333;
          font-weight: 600;
          font-size: 1rem;
        }

        .next-steps {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }

        .next-steps h2 {
          margin: 0 0 1.5rem 0;
          color: #333;
          font-size: 1.5rem;
          text-align: center;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
        }

        .step-item {
          text-align: center;
        }

        .step-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .step-item h3 {
          margin: 0 0 0.5rem 0;
          color: #333;
          font-size: 1.125rem;
        }

        .step-item p {
          margin: 0;
          color: #666;
          font-size: 0.875rem;
          line-height: 1.4;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .continue-shopping-btn, .view-orders-btn {
          padding: 1rem 2rem;
          border-radius: 4px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s;
        }

        .continue-shopping-btn {
          background-color: #007bff;
          color: white;
        }

        .continue-shopping-btn:hover {
          background-color: #0056b3;
        }

        .view-orders-btn {
          background-color: transparent;
          color: white;
          border: 2px solid white;
        }

        .view-orders-btn:hover {
          background-color: white;
          color: #667eea;
        }

        .support-info {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }

        .support-info h3 {
          margin: 0 0 1rem 0;
          color: #333;
          font-size: 1.25rem;
        }

        .support-info p {
          margin: 0.5rem 0;
          color: #666;
        }

        .loading, .error-container {
          text-align: center;
          padding: 3rem;
          color: white;
        }

        .error-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .error-container h2 {
          margin: 0 0 1rem 0;
          font-size: 2rem;
        }

        .home-btn {
          display: inline-block;
          background-color: white;
          color: #667eea;
          padding: 1rem 2rem;
          border-radius: 4px;
          text-decoration: none;
          font-weight: 600;
          margin-top: 1rem;
        }

        @media (max-width: 768px) {
          .success-header {
            padding: 2rem 1rem;
          }

          .success-header h1 {
            font-size: 2rem;
          }

          .order-details {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .order-info-card, .order-items-card {
            padding: 1.5rem;
          }

          .steps-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .action-buttons {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderSuccess;
