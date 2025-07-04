import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './pages/Layout';
import OrdersPage from './pages/OrdersPage'
import Dashboard from './pages/Dashboard';
import AllCustomersPage from './pages/Customers';
import Today from './pages/Today';
import CollectionDatesPage from './pages/Collection';
import OrderDetails from './pages/OrderDetails';
import PasswordModal from './components/PasswordModal';

function App() {
  const [userRole, setUserRole] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(true);

  useEffect(() => {
    // Check if user has already authenticated in this session
    const storedRole = sessionStorage.getItem('userRole');
    if (storedRole) {
      setUserRole(storedRole);
      setShowPasswordModal(false);
    }
  }, []);

  const handlePasswordSuccess = (role) => {
    setUserRole(role);
    setShowPasswordModal(false);
    // Store in sessionStorage so it persists during the session but clears on browser close
    sessionStorage.setItem('userRole', role);
  };

  // Protected Route Component
  const ProtectedRoute = ({ children, allowedRoles = ['gorush', 'jpmc', 'moh'] }) => {
    if (!userRole) {
      return null; // Don't render anything while password modal is shown
    }
    
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/collection" replace />;
    }
    
    return children;
  };

  // Show password modal if not authenticated
  if (showPasswordModal) {
    return <PasswordModal onSuccess={handlePasswordSuccess} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={
            <ProtectedRoute allowedRoles={['gorush']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="orders" element={
            <ProtectedRoute allowedRoles={['gorush', 'jpmc', 'moh']}>
              <OrdersPage />
            </ProtectedRoute>
          } />
          <Route path="dashboard" element={
            <ProtectedRoute allowedRoles={['gorush']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="customers" element={
            <ProtectedRoute allowedRoles={['gorush']}>
              <AllCustomersPage />
            </ProtectedRoute>
          } />
          <Route path="today" element={
            <ProtectedRoute allowedRoles={['gorush', 'jpmc', 'moh']}>
              <Today />
            </ProtectedRoute>
          } />
          <Route path="collection" element={
            <ProtectedRoute allowedRoles={['gorush', 'jpmc', 'moh']}>
              <CollectionDatesPage />
            </ProtectedRoute>
          } />
          <Route path="/orders/:id" element={
            <ProtectedRoute allowedRoles={['gorush', 'jpmc', 'moh']}>
              <OrderDetails />
            </ProtectedRoute>
          } />
          
          {/* Redirect JPMC users to collection page if they try to access restricted routes */}
          <Route path="*" element={
            userRole === 'jpmc' ? <Navigate to="/today" replace /> : <Navigate to="/dashboard" replace />
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;