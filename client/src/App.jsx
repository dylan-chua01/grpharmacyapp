import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './pages/Layout';
import OrdersPage from './pages/OrdersPage'
import Dashboard from './pages/Dashboard';
import AllCustomersPage from './pages/Customers';
import Today from './pages/Today';
import CollectionDatesPage from './pages/Collection';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="customers" element={<AllCustomersPage />} />
          <Route path="today" element={<Today />} />
          <Route path="collection" element={<CollectionDatesPage />} />
          {/* Add more routes as needed */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;