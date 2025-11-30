import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  console.log('CartItem item structure:', item);
  const { updateCartItem, removeFromCart } = useCart();
  const [quantity, setQuantity] = useState(item.qty);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1 || newQuantity > 99) return;

    setQuantity(newQuantity);
    setIsUpdating(true);

    try {
      await updateCartItem(item.product._id, item.size, newQuantity);
    } catch (error) {
      console.error('Error updating cart item:', error);
      setQuantity(item.qty); // Revert on error
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    console.log('Removing item:', { productId: item.product._id, size: item.size });
    try {
      const result = await removeFromCart(item.product._id, item.size);
      console.log('Remove result:', result);
    } catch (error) {
      console.error('Error removing cart item:', error);
    }
  };

  const totalPrice = item.product.price * quantity;

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img src={item.product.image} alt={item.product.name} />
      </div>

      <div className="cart-item-details">
        <h4 className="cart-item-name">{item.product.name}</h4>
        <p className="cart-item-size">Size: {item.size}</p>
        <p className="cart-item-price">
          ${item.product.price.toFixed(2)} each
        </p>
      </div>

      <div className="cart-item-quantity">
        <div className="quantity-controls">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1 || isUpdating}
            className="quantity-btn"
          >
            -
          </button>
          <span className="quantity-display">{quantity}</span>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= 99 || isUpdating}
            className="quantity-btn"
          >
            +
          </button>
        </div>
      </div>

      <div className="cart-item-total">
        <p className="total-price">${totalPrice.toFixed(2)}</p>
        <button onClick={handleRemove} className="remove-btn">
          Remove
        </button>
      </div>

      <style jsx>{`
        .cart-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
          margin-bottom: 1rem;
        }

        .cart-item-image {
          width: 80px;
          height: 80px;
          flex-shrink: 0;
          overflow: hidden;
          border-radius: 4px;
          background-color: #f8f9fa;
        }

        .cart-item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cart-item-details {
          flex: 1;
          min-width: 0;
        }

        .cart-item-name {
          margin: 0 0 0.5rem 0;
          font-size: 1rem;
          font-weight: 600;
          color: #333;
          line-height: 1.4;
        }

        .cart-item-size {
          margin: 0 0 0.25rem 0;
          font-size: 0.875rem;
          color: #666;
        }

        .cart-item-price {
          margin: 0;
          font-size: 0.875rem;
          color: #007bff;
          font-weight: 500;
        }

        .cart-item-quantity {
          flex-shrink: 0;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          overflow: hidden;
        }

        .quantity-btn {
          background: transparent;
          border: none;
          width: 32px;
          height: 32px;
          cursor: pointer;
          font-size: 1rem;
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
          min-width: 40px;
          font-weight: 500;
          color: #333;
        }

        .cart-item-total {
          flex-shrink: 0;
          text-align: right;
        }

        .total-price {
          margin: 0 0 0.5rem 0;
          font-size: 1.125rem;
          font-weight: bold;
          color: #333;
        }

        .remove-btn {
          background: transparent;
          border: 1px solid #dc3545;
          color: #dc3545;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.75rem;
          transition: all 0.3s;
        }

        .remove-btn:hover {
          background-color: #dc3545;
          color: white;
        }

        @media (max-width: 768px) {
          .cart-item {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }

          .cart-item-image {
            width: 100%;
            height: 200px;
          }

          .cart-item-details {
            text-align: center;
          }

          .cart-item-quantity {
            display: flex;
            justify-content: center;
          }

          .cart-item-total {
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default CartItem;
