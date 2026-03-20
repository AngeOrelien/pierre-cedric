import { Outlet } from 'react-router-dom';
import Navbar     from '../components/common/Navbar';
import Footer     from '../components/common/Footer';
import CartDrawer from '../components/cart/CartDrawer';
import { Toaster } from 'react-hot-toast';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <Toaster
        position="top-right"
        gutter={8}
        toastOptions={{
          className: '',
          style: {
            fontFamily: 'Outfit, system-ui, sans-serif',
            fontSize: '0.875rem',
            fontWeight: 500,
            borderRadius: '12px',
            padding: '12px 16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
          },
          success: { iconTheme: { primary:'#16A34A', secondary:'#fff' }, duration: 3000 },
          error:   { iconTheme: { primary:'#DC2626', secondary:'#fff' }, duration: 4000 },
        }}
      />
    </div>
  );
}
