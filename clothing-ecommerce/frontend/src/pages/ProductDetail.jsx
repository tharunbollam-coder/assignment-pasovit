import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { productAPI } from '../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productAPI.getProductById(id);
        setProduct(response.data);
        setSelectedSize(response.data.sizes[0]);
      } catch (error) {
        setError('Product not found');
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    setAddingToCart(true);
    try {
      await addToCart(product, selectedSize, quantity);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return <div className="loading">Loading product...</div>;
  }

  if (error || !product) {
    return (
      <div className="error-container">
        <h2>Product Not Found</h2>
        <p>{error}</p>
        <Link to="/products" className="back-btn">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="product-container">
        <div className="product-image-section">
          <div className="product-image">
            <img src={product.image} alt={product.name} />
          </div>
        </div>

        <div className="product-info-section">
          <div className="product-breadcrumb">
            <Link to="/">Home</Link> / <Link to="/products">Products</Link> / {product.name}
          </div>

          <h1 className="product-title">{product.name}</h1>
          
          <div className="product-category">{product.category}</div>
          
          <div className="product-price">${product.price.toFixed(2)}</div>
          
          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="product-stock">
            {product.stock > 0 ? (
              <span className="in-stock">In Stock ({product.stock} available)</span>
            ) : (
              <span className="out-stock">Out of Stock</span>
            )}
          </div>

          <div className="product-options">
            <div className="size-selection">
              <h3>Select Size</h3>
              <div className="size-options">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="quantity-selection">
              <h3>Quantity</h3>
              <div className="quantity-controls">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="quantity-btn"
                >
                  -
                </button>
                <span className="quantity-display">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 99}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="product-actions">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || addingToCart}
              className="add-to-cart-btn"
            >
              {addingToCart ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>

          <div className="product-features">
            <div className="feature">
              <span className="feature-icon">🚚</span>
              <span>Free shipping on orders over $50</span>
            </div>
            <div className="feature">
              <span className="feature-icon">↩️</span>
              <span>30-day return policy</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🔒</span>
              <span>Secure payment</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .product-detail {
          padding: 2rem 1rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .product-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: start;
        }

        .product-image-section {
          position: sticky;
          top: 100px;
        }

        .product-image {
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
          background-color: #f8f9fa;
        }

        .product-image img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
        }

        .product-info-section {
          padding: 1rem 0;
        }

        .product-breadcrumb {
          margin-bottom: 1rem;
          font-size: 0.875rem;
          color: #666;
        }

        .product-breadcrumb a {
          color: #007bff;
          text-decoration: none;
        }

        .product-breadcrumb a:hover {
          text-decoration: underline;
        }

        .product-title {
          font-size: 2.5rem;
          margin: 0 0 1rem 0;
          color: #333;
          font-weight: 700;
          line-height: 1.2;
        }

        .product-category {
          font-size: 1.125rem;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 1rem;
        }

        .product-price {
          font-size: 2rem;
          font-weight: bold;
          color: #007bff;
          margin-bottom: 2rem;
        }

        .product-description {
          margin-bottom: 2rem;
        }

        .product-description h3 {
          margin: 0 0 0.5rem 0;
          color: #333;
          font-size: 1.125rem;
        }

        .product-description p {
          margin: 0;
          color: #666;
          line-height: 1.6;
        }

        .product-stock {
          margin-bottom: 2rem;
        }

        .in-stock {
          color: #28a745;
          font-weight: 500;
        }

        .out-stock {
          color: #dc3545;
          font-weight: 500;
        }

        .product-options {
          margin-bottom: 2rem;
        }

        .size-selection, .quantity-selection {
          margin-bottom: 1.5rem;
        }

        .size-selection h3, .quantity-selection h3 {
          margin: 0 0 1rem 0;
          color: #333;
          font-size: 1.125rem;
        }

        .size-options {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .size-btn {
          padding: 0.75rem 1.5rem;
          border: 2px solid #ddd;
          background: white;
          color: #333;
          cursor: pointer;
          border-radius: 4px;
          font-weight: 500;
          transition: all 0.3s;
        }

        .size-btn:hover {
          border-color: #007bff;
        }

        .size-btn.selected {
          border-color: #007bff;
          background-color: #007bff;
          color: white;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          overflow: hidden;
          width: fit-content;
        }

        .quantity-btn {
          background: transparent;
          border: none;
          width: 40px;
          height: 40px;
          cursor: pointer;
          font-size: 1.25rem;
          font-weight: 500;
          color: #495057;
          transition: background-color 0.3s;
        }

        .quantity-btn:hover:not(:disabled) {
          background-color: #f8f9fa;
        }

        .quantity-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .quantity-display {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 50px;
          font-weight: 500;
          color: #333;
        }

        .product-actions {
          margin-bottom: 2rem;
        }

        .add-to-cart-btn {
          width: 100%;
          padding: 1rem;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1.125rem;
          font-weight: 600;
          transition: background-color 0.3s;
        }

        .add-to-cart-btn:hover:not(:disabled) {
          background-color: #0056b3;
        }

        .add-to-cart-btn:disabled {
          background-color: #6c757d;
          cursor: not-allowed;
        }

        .product-features {
          border-top: 1px solid #e9ecef;
          padding-top: 2rem;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
          color: #666;
        }

        .feature-icon {
          font-size: 1.25rem;
        }

        .loading, .error-container {
          text-align: center;
          padding: 3rem;
        }

        .error-container h2 {
          color: #dc3545;
          margin-bottom: 1rem;
        }

        .back-btn {
          display: inline-block;
          background-color: #007bff;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          text-decoration: none;
          margin-top: 1rem;
        }

        @media (max-width: 968px) {
          .product-container {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .product-image-section {
            position: static;
          }

          .product-title {
            font-size: 2rem;
          }

          .product-price {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .product-detail {
            padding: 1rem;
          }

          .product-title {
            font-size: 1.75rem;
          }

          .size-options {
            gap: 0.25rem;
          }

          .size-btn {
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;
