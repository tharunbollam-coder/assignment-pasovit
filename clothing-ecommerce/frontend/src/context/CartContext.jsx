import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items || [],
        loading: false,
      };
    case 'ADD_TO_CART':
      return {
        ...state,
        items: action.payload.items || [],
      };
    case 'UPDATE_CART_ITEM':
      return {
        ...state,
        items: action.payload.items || [],
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: action.payload.items || [],
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'CART_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

const initialState = {
  items: [],
  loading: false,
  error: null,
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      const guestCart = localStorage.getItem('guestCart');
      if (guestCart) {
        dispatch({ type: 'SET_CART', payload: { items: JSON.parse(guestCart) } });
      }
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await cartAPI.getCart();
      dispatch({ type: 'SET_CART', payload: response.data });
    } catch (error) {
      console.error('Fetch cart error:', error);
      dispatch({ type: 'CART_ERROR', payload: error.response?.data?.message });
    }
  };

  const addToCart = async (product, size, qty) => {
    const newItem = {
      productId: product._id,
      size,
      qty,
      product: {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
      },
    };

    if (isAuthenticated) {
      try {
        const response = await cartAPI.addToCart({ productId: product._id, size, qty });
        dispatch({ type: 'SET_CART', payload: response.data });
        return { success: true };
      } catch (error) {
        dispatch({ type: 'CART_ERROR', payload: error.response?.data?.message });
        return { success: false, error: error.response?.data?.message };
      }
    } else {
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      const existingItemIndex = guestCart.findIndex(
        item => item.productId === product._id && item.size === size
      );

      if (existingItemIndex > -1) {
        guestCart[existingItemIndex].qty += qty;
      } else {
        guestCart.push(newItem);
      }

      localStorage.setItem('guestCart', JSON.stringify(guestCart));
      dispatch({ type: 'SET_CART', payload: { items: guestCart } });
      return { success: true };
    }
  };

  const updateCartItem = async (productId, size, qty) => {
    if (isAuthenticated) {
      try {
        const response = await cartAPI.updateCartItem({ productId, size, qty });
        dispatch({ type: 'SET_CART', payload: response.data });
        return { success: true };
      } catch (error) {
        dispatch({ type: 'CART_ERROR', payload: error.response?.data?.message });
        return { success: false, error: error.response?.data?.message };
      }
    } else {
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      const itemIndex = guestCart.findIndex(
        item => item.productId === productId && item.size === size
      );

      if (itemIndex > -1) {
        guestCart[itemIndex].qty = qty;
        localStorage.setItem('guestCart', JSON.stringify(guestCart));
        dispatch({ type: 'SET_CART', payload: { items: guestCart } });
      }
      return { success: true };
    }
  };

  const removeFromCart = async (productId, size) => {
    console.log('removeFromCart called:', { productId, size, isAuthenticated });
    if (isAuthenticated) {
      try {
        console.log('Calling API to remove item');
        const response = await cartAPI.removeFromCart({ productId, size });
        console.log('API response:', response.data);
        dispatch({ type: 'SET_CART', payload: response.data });
        return { success: true };
      } catch (error) {
        console.error('Remove from cart API error:', error);
        dispatch({ type: 'CART_ERROR', payload: error.response?.data?.message });
        return { success: false, error: error.response?.data?.message };
      }
    } else {
      console.log('Removing from guest cart');
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      const updatedCart = guestCart.filter(
        item => !(item.productId === productId && item.size === size)
      );
      console.log('Guest cart before:', guestCart);
      console.log('Guest cart after:', updatedCart);
      localStorage.setItem('guestCart', JSON.stringify(updatedCart));
      dispatch({ type: 'SET_CART', payload: { items: updatedCart } });
      return { success: true };
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await cartAPI.clearCart();
      } catch (error) {
        console.error('Clear cart error:', error);
      }
    } else {
      localStorage.removeItem('guestCart');
    }
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + (item.product.price * item.qty), 0);
  };

  const getCartItemCount = () => {
    return state.items.reduce((count, item) => count + item.qty, 0);
  };

  const value = {
    ...state,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    fetchCart,
    getCartTotal,
    getCartItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
