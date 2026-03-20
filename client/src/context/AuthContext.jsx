/**
 * AuthContext — État d'authentification global
 * useReducer pour les transitions d'état
 */
import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING': return { ...state, loading: action.payload };
    case 'LOGIN'      : return { user: action.payload, isAuth: true,  loading: false };
    case 'LOGOUT'     : return { user: null,           isAuth: false, loading: false };
    case 'UPDATE_USER': return { ...state, user: { ...state.user, ...action.payload } };
    default           : return state;
  }
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    user   : JSON.parse(localStorage.getItem('pc_user') || 'null'),
    isAuth : !!localStorage.getItem('pc_token'),
    loading: false,
  });

  // Revalider le token au montage
  useEffect(() => {
    const token = localStorage.getItem('pc_token');
    if (!token) return;
    authService.getMe()
      .then(user => {
        localStorage.setItem('pc_user', JSON.stringify(user));
        dispatch({ type: 'LOGIN', payload: user });
      })
      .catch(() => {
        localStorage.removeItem('pc_token');
        localStorage.removeItem('pc_user');
        dispatch({ type: 'LOGOUT' });
      });
  }, []);

  const login = useCallback(async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    const { token, user } = await authService.login({ email, password });
    localStorage.setItem('pc_token', token);
    localStorage.setItem('pc_user', JSON.stringify(user));
    dispatch({ type: 'LOGIN', payload: user });
    return user;
  }, []);

  const register = useCallback(async (data) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    const { token, user } = await authService.register(data);
    localStorage.setItem('pc_token', token);
    localStorage.setItem('pc_user', JSON.stringify(user));
    dispatch({ type: 'LOGIN', payload: user });
    return user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('pc_token');
    localStorage.removeItem('pc_user');
    dispatch({ type: 'LOGOUT' });
  }, []);

  const updateUser = useCallback((data) => {
    const updated = { ...state.user, ...data };
    localStorage.setItem('pc_user', JSON.stringify(updated));
    dispatch({ type: 'UPDATE_USER', payload: data });
  }, [state.user]);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
