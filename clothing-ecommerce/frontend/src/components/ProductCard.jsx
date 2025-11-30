import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const defaultSize = product.sizes[0];
    addToCart(product, defaultSize, 1);
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="product-link">
        <div className="product-image">
          <img src={product.image} alt={product.name} />
        </div>
        
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-category">{product.category}</p>
          <p className="product-price">${product.price.toFixed(2)}</p>
          
          <div className="product-sizes">
            <span className="sizes-label">Sizes:</span>
            {product.sizes.map((size, index) => (
              <span key={size} className="size-badge">
                {size}
              </span>
            ))}
          </div>
        </div>
      </Link>
      
      <button 
        onClick={handleAddToCart}
        className="add-to-cart-btn"
        disabled={product.stock === 0}
      >
        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>

      <style jsx>{`
        .product-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          overflow: hidden;
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }

        .product-link {
          text-decoration: none;
          color: inherit;
          display: block;
        }

        .product-image {
          width: 100%;
          height: 250px;
          overflow: hidden;
          background-color: #f8f9fa;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }

        .product-card:hover .product-image img {
          transform: scale(1.05);
        }

        .product-info {
          padding: 1rem;
        }

        .product-name {
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 0.5rem 0;
          color: #333;
          line-height: 1.4;
        }

        .product-category {
          font-size: 0.875rem;
          color: #666;
          margin: 0 0 0.5rem 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .product-price {
          font-size: 1.25rem;
          font-weight: bold;
          color: #007bff;
          margin: 0 0 1rem 0;
        }

        .product-sizes {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .sizes-label {
          font-size: 0.75rem;
          color: #666;
          font-weight: 500;
        }

        .size-badge {
          background-color: #e9ecef;
          color: #495057;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .add-to-cart-btn {
          width: 100%;
          padding: 0.75rem;
          background-color: #007bff;
          color: white;
          border: none;
          border-top: 1px solid #e9ecef;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.3s;
        }

        .add-to-cart-btn:hover:not(:disabled) {
          background-color: #0056b3;
        }

        .add-to-cart-btn:disabled {
          background-color: #6c757d;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .product-image {
            height: 200px;
          }

          .product-info {
            padding: 0.75rem;
          }

          .product-name {
            font-size: 0.9rem;
          }

          .product-price {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductCard;
