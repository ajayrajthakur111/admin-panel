// src/App.jsx
import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loadAdmin } from './features/auth/authSlice';
import './App.css'

// Lazy load components
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const ForgotPasswordPage = React.lazy(() => import('./pages/ForgotPasswordPage'));
const DashboardLayout = React.lazy(() => import('./components/Layout/DashboardLayout'));
const DashboardHome = React.lazy(() => import('./pages/DashboardHome'));
const ArticlePage = React.lazy(() => import('./pages/ArticlePage'));
const AutoDealershipPage = React.lazy(() => import('./pages/AutoDealershipPage'));

// Loading fallback component
const LoadingSpinner = () => <div>Loading...</div>;

// Component to protect routes
const ProtectedRoute = ({ element }) => {
  const token = useSelector((state) => state.auth.token);
  return token ? element : <Navigate to="/login" replace />;
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadAdmin());
  }, [dispatch]);

  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={<ProtectedRoute element={<DashboardLayout />} />}
          >
            {/* Nested Routes for Dashboard Content */}
            <Route index element={<DashboardHome />} />
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="article" element={<ArticlePage />} />
            <Route path="auto-dealership" element={<AutoDealershipPage />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
