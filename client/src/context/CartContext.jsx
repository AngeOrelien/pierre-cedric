/**
 * CartContext — État du panier global
 */
import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART'    : return { ...state, cart: action.payload, loading: false };
    case 'SET_LOADING' : return { ...state, loading: action.payload };
    case 'OPEN_DRAWER' : return { ...state, drawerOpen: true  };
    case 'CLOSE_DRAWER': return { ...state, drawerOpen: false };
    default            : return state;
  }
};

export function CartProvider({ children }) {
  const { isAuth } = useAuth();
  const [state, dispatch] = useReducer(reducer, {
    cart: null, loading: false, drawerOpen: false,
  });

  const fetchCart = useCallback(async () => {
    if (!isAuth) return dispatch({ type: 'SET_CART', payload: null });
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const cart = await cartService.get();
      dispatch({ type: 'SET_CART', payload: cart });
    } catch { dispatch({ type: 'SET_LOADING', payload: false }); }
  }, [isAuth]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addItem = useCallback(async (productId, quantity = 1) => {
    const cart = await cartService.addItem({ productId, quantity });
    dispatch({ type: 'SET_CART', payload: cart });
    dispatch({ type: 'OPEN_DRAWER' });
  }, []);

  const updateItem = useCallback(async (id, quantity) => {
    const cart = await cartService.updateItem(id, { quantity });
    dispatch({ type: 'SET_CART', payload: cart });
  }, []);

  const removeItem = useCallback(async (id) => {
    const cart = await cartService.removeItem(id);
    dispatch({ type: 'SET_CART', payload: cart });
  }, []);

  const clearCart = useCallback(async () => {
    await cartService.clear();
    dispatch({ type: 'SET_CART', payload: null });
  }, []);

  // Totaux calculés côté client
  const itemCount = state.cart?.items?.reduce((s, i) => s + i.quantity, 0) || 0;
  const subtotal  = state.cart?.items?.reduce((s, i) => s + parseFloat(i.priceSnapshot) * i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{
      ...state, itemCount, subtotal, fetchCart,
      addItem, updateItem, removeItem, clearCart,
      openDrawer : () => dispatch({ type:'OPEN_DRAWER'  }),
      closeDrawer: () => dispatch({ type:'CLOSE_DRAWER' }),
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
