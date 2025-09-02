import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Register from './pages/Register';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CustomerProducts from './pages/CustomerProducts';  // new import
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import TrackOrderPage from './pages/TrackOrderPage';
import ProductDetail from './pages/ProductDetail';
import MyOrders from './pages/MyOrders';
import ProfilePage from './pages/ProfilePage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import ComplaintForm from './pages/ComplaintForm';
import Container from '@mui/material/Container';
import Donate from './pages/Donate';
import DonationHistory from './pages/DonationHistory';

function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return null; // or a spinner
  if (!user) {
    // Remember last attempted path to restore after login
    if (typeof window !== 'undefined') {
      try { sessionStorage.setItem('lastPath', window.location.pathname + window.location.search); } catch {}
    }
    return <Navigate to="/login" />;
  }
  const role = user.role === 'seller' ? 'host' : (user.role === 'customer' ? 'adopter' : user.role);
  if (roles && !roles.includes(role)) return <Navigate to="/products" />;
  return children;
}

function App() {
  return (
    <AuthProvider>
  <CartProvider>
  <Navbar />
  <ToastContainer position="top-right" autoClose={2500} hideProgressBar newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="colored" />
  <Container sx={{ py: 2 }}>
  <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/seller"
          element={
              <PrivateRoute roles={['host']}>
              <SellerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute roles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        {/* Customer browsing routes */}
        <Route path="/products" element={<CustomerProducts />} />
  <Route path="/product" element={<ProductDetail />} />
  <Route
    path="/complaint"
    element={
            <PrivateRoute roles={['customer','adopter']}>
        <ComplaintForm />
      </PrivateRoute>
    }
  />
  <Route
    path="/donate"
    element={
            <PrivateRoute roles={['customer','adopter']}>
        <Donate />
      </PrivateRoute>
    }
  />
  <Route
    path="/donations"
    element={
            <PrivateRoute roles={['customer','adopter','admin']}>
        <DonationHistory />
      </PrivateRoute>
    }
  />
  <Route path="/cart" element={<CartPage />} />
  <Route path="/checkout" element={<CheckoutPage />} />
  <Route path="/track/:id" element={<TrackOrderPage />} />
        <Route
          path="/profile"
          element={
              <PrivateRoute roles={['customer','adopter','admin']}>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
              <PrivateRoute roles={['customer','adopter','admin']}>
              <MyOrders />
            </PrivateRoute>
          }
        />
        
  <Route path="*" element={<Navigate to="/products" />} />
    </Routes>
  </Container>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
