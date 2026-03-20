/**
 * Routeur principal — React Router v6
 * Guards : PrivateRoute (JWT requis) | AdminRoute (rôle admin)
 */
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from '../components/common/Spinner';

// Layout
import Layout from '../pages/Layout';

// Pages publiques
import Home           from '../pages/Home';
import Shop           from '../pages/Shop';
import ProductPage    from '../pages/ProductPage';
import CartPage       from '../pages/CartPage';
import Contact        from '../pages/Contact';

// Auth
import Login    from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Checkout
import Checkout          from '../pages/Checkout';
import OrderConfirmation from '../pages/OrderConfirmation';

// Espace client
import AccountLayout   from '../pages/account/AccountLayout';
import AccountDashboard from '../pages/account/AccountDashboard';
import MyOrders        from '../pages/account/MyOrders';
import OrderDetail     from '../pages/account/OrderDetail';
import Profile         from '../pages/account/Profile';
import Addresses       from '../pages/account/Addresses';

// Admin
import AdminLayout    from '../pages/admin/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProducts  from '../pages/admin/AdminProducts';
import AdminOrders    from '../pages/admin/AdminOrders';
import AdminCustomers from '../pages/admin/AdminCustomers';
import AdminInventory from '../pages/admin/AdminInventory';
import AdminCategories from '../pages/admin/AdminCategories';

/** Protège les routes qui nécessitent une connexion */
function PrivateRoute({ children }) {
  const { isAuth, loading } = useAuth();
  if (loading) return <PageLoader />;
  return isAuth ? children : <Navigate to="/login" replace />;
}

/** Protège les routes d'administration */
function AdminRoute({ children }) {
  const { isAuth, user, loading } = useAuth();
  if (loading)           return <PageLoader />;
  if (!isAuth)           return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/"     replace />;
  return children;
}

export default function AppRouter() {
  return (
    <Routes>
      {/* ── Publiques ── */}
      <Route path="/" element={<Layout />}>
        <Route index          element={<Home />} />
        <Route path="shop"    element={<Shop />} />
        <Route path="product/:slug" element={<ProductPage />} />
        <Route path="cart"    element={<CartPage />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login"    element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* ── Checkout (auth requis) ── */}
        <Route path="checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
        <Route path="order/confirmation/:id" element={<PrivateRoute><OrderConfirmation /></PrivateRoute>} />

        {/* ── Espace client ── */}
        <Route path="account" element={<PrivateRoute><AccountLayout /></PrivateRoute>}>
          <Route index          element={<AccountDashboard />} />
          <Route path="orders"  element={<MyOrders />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="profile" element={<Profile />} />
          <Route path="addresses" element={<Addresses />} />
        </Route>
      </Route>

      {/* ── Administration (layout différent) ── */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index              element={<AdminDashboard />} />
        <Route path="products"    element={<AdminProducts />} />
        <Route path="orders"      element={<AdminOrders />} />
        <Route path="customers"   element={<AdminCustomers />} />
        <Route path="inventory"   element={<AdminInventory />} />
        <Route path="categories"  element={<AdminCategories />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
