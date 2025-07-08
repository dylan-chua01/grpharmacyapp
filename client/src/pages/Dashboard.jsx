import React, { useState, useEffect } from 'react';
import { Users, Package, TrendingUp, Calendar, Search, RefreshCw, ArrowLeft, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [userSubrole, setUserSubrole] = useState(null);
  const [isRoleLoaded, setIsRoleLoaded] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Load user role first - same pattern as OrdersPage
  useEffect(() => {
    const role = sessionStorage.getItem('userRole');
    const subrole = sessionStorage.getItem('userSubrole');
    setUserRole(role || 'jpmc');
    setUserSubrole(subrole || null);
    setIsRoleLoaded(true);
  }, []);

  // Fetch data from your API - only after role is loaded
  useEffect(() => {
    if (!isRoleLoaded) return;
    fetchData();
  }, [isRoleLoaded, userRole]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ordersRes, customersRes] = await Promise.all([
        fetch('http://localhost:5050/api/orders', {
          headers: {
            'Content-Type': 'application/json',
            'X-User-Role': userRole || 'jpmc'
          }
        }),
        fetch('http://localhost:5050/api/customers', {
          headers: {
            'Content-Type': 'application/json',
            'X-User-Role': userRole || 'jpmc'
          }
        })
      ]);
        
      if (!ordersRes.ok || !customersRes.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const ordersData = await ordersRes.json();
      const customersData = await customersRes.json();
      
      setOrders(ordersData);
      setCustomers(customersData);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackingNumberClick = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  const fetchCustomerOrders = async (patientNumber) => {
    setLoadingOrders(true);
    try {
      const response = await fetch(`http://localhost:5050/api/customers/${patientNumber}/orders`, {
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': userRole || 'jpmc'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch customer orders');
      }
      const ordersData = await response.json();
      setCustomerOrders(ordersData);
    } catch (err) {
      console.error('Failed to fetch customer orders:', err);
      setCustomerOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    fetchCustomerOrders(customer.patientNumber);
  };

  const handleBackToDashboard = () => {
    setSelectedCustomer(null);
    setCustomerOrders([]);
    setSelectedOrder(null);
  };

  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseOrderDetails = () => {
    setSelectedOrder(null);
  };

  // Calculate dashboard metrics
  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const today = new Date().toISOString().split('T')[0];
  const todaysParcels = orders.filter(order => 
    order.collectionDate && order.collectionDate.split('T')[0] === today
  ).length;

  // Filter customers based on search
  const filteredCustomers = customers.filter(customer =>
    customer.receiverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.patientNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const topCustomers = customers
    .sort((a, b) => b.totalOrders - a.totalOrders)
    .slice(0, 5);

  // Show loading state until role is loaded - same pattern as OrdersPage
  if (!isRoleLoaded || loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingContent}>
          <div style={{
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #2563eb',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            animation: 'spin 1s linear infinite'
          }}></div>
          <span style={styles.loadingText}>Loading dashboard...</span>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  // Customer Orders View
  if (selectedCustomer) {
    return (
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerContainer}>
            <div style={styles.headerContent}>
              <div>
                <h1 style={styles.title}>Customer Orders</h1>
                <p style={styles.subtitle}>View all orders for selected customer</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  onClick={handleBackToDashboard}
                  style={styles.backButton}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#4b5563'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#6b7280'}
                >
                  <ArrowLeft style={{ width: '16px', height: '16px' }} />
                  <span>Back to Dashboard</span>
                </button>
                <button
                  onClick={() => fetchCustomerOrders(selectedCustomer.patientNumber)}
                  style={styles.refreshButton}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
                >
                  <RefreshCw style={{ width: '16px', height: '16px' }} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.mainContainer}>
          <div style={styles.customerOrdersContainer}>
            <div style={styles.customerOrdersHeader}>
              <h2 style={styles.customerOrdersTitle}>{selectedCustomer.receiverName}</h2>
              <p style={styles.customerOrdersSubtitle}>
                Patient Number: {selectedCustomer.patientNumber} • Total Orders: {selectedCustomer.totalOrders}
              </p>
            </div>

            {loadingOrders ? (
              <div style={{ ...styles.emptyState, padding: '48px' }}>
                <RefreshCw style={{ width: '32px', height: '32px', color: '#2563eb', marginBottom: '16px' }} />
                <p>Loading orders...</p>
              </div>
            ) : customerOrders.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={styles.ordersTable}>
                  <thead style={styles.tableHeader}>
                    <tr>
                      <th style={styles.tableHeaderCell}>Tracking Number</th>
                      <th style={styles.tableHeaderCell}>Order Date</th>
                      <th style={styles.tableHeaderCell}>Status</th>
                      <th style={styles.tableHeaderCell}>Items</th>
                      <th style={styles.tableHeaderCell}>Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerOrders.map((order, index) => (
                      <tr 
                        key={order._id} 
                        style={styles.tableRow}
                        onMouseEnter={(e) => e.target.closest('tr').style.backgroundColor = '#f9fafb'}
                        onMouseLeave={(e) => e.target.closest('tr').style.backgroundColor = 'transparent'}
                      >
                       <td style={styles.tableCell}>
                          <span 
                            style={styles.trackingNumber}
                            onClick={() => handleTrackingNumberClick(order._id)}
                          >
                            {order.doTrackingNumber || 'N/A'}
                          </span>
                        </td> 
                        <td style={styles.tableCell}>
                          {order.creationDate}
                        </td>
                        <td style={styles.tableCell}>
                          <span>
                            {order.status || 'Unknown'}
                          </span>
                        </td>
                        <td style={styles.tableCell}>
                          {order.items ? (
                            Array.isArray(order.items) ? `${order.items.length} items` : '1 item'
                          ) : (
                            order.medicationName || 'N/A'
                          )}
                        </td>
                        <td style={styles.tableCell}>
                          ${order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={styles.emptyState}>
                <Package style={styles.emptyIcon} />
                <p>No orders found for this customer.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard View
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContainer}>
          <div style={styles.headerContent}>
            <div>
              <h1 style={styles.title}>Pharmacy Dashboard</h1>
              <p style={styles.subtitle}>Monitor orders and customer activity</p>
            </div>
            <button
              onClick={fetchData}
              style={styles.refreshButton}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
            >
              <RefreshCw style={{ width: '16px', height: '16px' }} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      <div style={styles.mainContainer}>
        {error && (
          <div style={styles.errorAlert}>
            <p style={styles.errorText}>
              ❌ Failed to load data from API: {error}
            </p>
            <button onClick={fetchData} style={styles.errorButton}>
              Try again
            </button>
          </div>
        )}

        {/* Key Metrics */}
        <div style={styles.metricsGrid}>
          <div style={styles.metricCard}>
            <div style={styles.metricContent}>
              <div>
                <p style={styles.metricLabel}>Total Orders</p>
                <p style={{...styles.metricValue, color: '#111827'}}>{totalOrders}</p>
              </div>
              <div style={{...styles.metricIcon, backgroundColor: '#dbeafe'}}>
                <Package style={{ width: '24px', height: '24px', color: '#2563eb' }} />
              </div>
            </div>
          </div>

          <div style={styles.metricCard}>
            <div style={styles.metricContent}>
              <div>
                <p style={styles.metricLabel}>Total Customers</p>
                <p style={{...styles.metricValue, color: '#111827'}}>{totalCustomers}</p>
              </div>
              <div style={{...styles.metricIcon, backgroundColor: '#dcfce7'}}>
                <Users style={{ width: '24px', height: '24px', color: '#16a34a' }} />
              </div>
            </div>
          </div>

          <div style={styles.metricCard}>
            <div style={styles.metricContent}>
              <div>
                <p style={styles.metricLabel}>Today's Collections</p>
                <p style={{...styles.metricValue, color: '#2563eb'}}>{todaysParcels}</p>
              </div>
              <div style={{...styles.metricIcon, backgroundColor: '#dbeafe'}}>
                <Calendar style={{ width: '24px', height: '24px', color: '#2563eb' }} />
              </div>
            </div>
          </div>
        </div>

        <div style={styles.customersGrid}>
          {/* Top Customers */}
          <div style={styles.customerCard}>
            <div style={styles.customerHeader}>
              <h3 style={styles.customerTitle}>Top Customers</h3>
              <p style={styles.customerSubtitle}>Customers with most orders (click to view orders)</p>
            </div>
            <div style={styles.customerContent}>
              <div style={styles.customerList}>
                {topCustomers.map((customer, index) => (
                  <div 
                    key={customer.patientNumber} 
                    style={styles.customerItem}
                    onClick={() => handleCustomerSelect(customer)}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f3f4f6';
                      e.target.style.borderColor = '#e5e7eb';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#f9fafb';
                      e.target.style.borderColor = 'transparent';
                    }}
                  >
                    <div style={styles.customerInfo}>
                      <div style={styles.customerRank}>
                        {index + 1}
                      </div>
                      <div>
                        <p style={styles.customerName}>{customer.receiverName}</p>
                        <p style={styles.customerNumber}>{customer.patientNumber}</p>
                      </div>
                    </div>
                    <div style={styles.customerStats}>
                      <p style={styles.customerOrders}>{customer.totalOrders} orders</p>
                      <p style={styles.customerDate}>
                        Last: {new Date(customer.lastOrderDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer List */}
          <div style={styles.customerCard}>
            <div style={styles.customerHeader}>
              <div>
                <h3 style={styles.customerTitle}>Customer List</h3>
                <p style={styles.customerSubtitle}>Search and browse customers (click to view orders)</p>
              </div>
              <div style={styles.searchContainer}>
                <div style={{ position: 'relative' }}>
                  <Search style={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                    onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>
              </div>
            </div>
            <div style={styles.customerContent}>
              <div style={styles.customerList}>
                {filteredCustomers.slice(0, 10).map((customer) => (
                  <div 
                    key={customer.patientNumber} 
                    style={styles.customerItem}
                    onClick={() => handleCustomerSelect(customer)}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f3f4f6';
                      e.target.style.borderColor = '#e5e7eb';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#f9fafb';
                      e.target.style.borderColor = 'transparent';
                    }}
                  >
                    <div>
                      <p style={styles.customerName}>{customer.receiverName}</p>
                      <p style={styles.customerNumber}>{customer.patientNumber}</p>
                    </div>
                    <div style={styles.customerStats}>
                      <p style={styles.customerOrders}>{customer.totalOrders} orders</p>
                      <p style={styles.customerDate}>
                        {new Date(customer.lastOrderDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {filteredCustomers.length === 0 && (
                <div style={styles.emptyState}>
                  <Users style={styles.emptyIcon} />
                  <p>No customers found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles object (you'll need to add this or import it)
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f9fafb'
  },
  loadingContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px'
  },
  loadingText: {
    fontSize: '16px',
    color: '#6b7280'
  },
  header: {
    backgroundColor: 'white',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    borderBottom: '1px solid #e5e7eb'
  },
  headerContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '16px 24px'
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
    margin: 0
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '4px 0 0 0'
  },
  refreshButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s'
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    marginRight: '12px',
    transition: 'all 0.2s'
  },
  mainContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px'
  },
  errorAlert: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  errorText: {
    color: '#dc2626',
    margin: 0,
    fontSize: '14px'
  },
  errorButton: {
    padding: '8px 16px',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
  },
  metricCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb'
  },
  metricContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  metricLabel: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '0 0 8px 0'
  },
  metricValue: {
    fontSize: '32px',
    fontWeight: '700',
    margin: 0
  },
  metricIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  customersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px'
  },
  customerCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    overflow: 'hidden'
  },
  customerHeader: {
    padding: '24px 24px 16px 24px',
    borderBottom: '1px solid #f3f4f6'
  },
  customerTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 4px 0'
  },
  customerSubtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0
  },
  customerContent: {
    padding: '0'
  },
  customerList: {
    display: 'flex',
    flexDirection: 'column'
  },
  customerItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    cursor: 'pointer',
    borderTop: '1px solid transparent',
    backgroundColor: '#f9fafb',
    transition: 'all 0.2s'
  },
  customerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  customerRank: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#2563eb',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '600'
  },
  customerName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#111827',
    margin: '0 0 2px 0'
  },
  customerNumber: {
    fontSize: '12px',
    color: '#6b7280',
    margin: 0
  },
  customerStats: {
    textAlign: 'right'
  },
  customerOrders: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#111827',
    margin: '0 0 2px 0'
  },
  customerDate: {
    fontSize: '12px',
    color: '#6b7280',
    margin: 0
  },
  searchContainer: {
    marginTop: '16px'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '16px',
    height: '16px',
    color: '#9ca3af'
  },
  searchInput: {
    width: '100%',
    padding: '8px 8px 8px 36px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  customerOrdersContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    overflow: 'hidden'
  },
  customerOrdersHeader: {
    padding: '24px',
    borderBottom: '1px solid #f3f4f6'
  },
  customerOrdersTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 8px 0'
  },
  customerOrdersSubtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0
  },
  ordersTable: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  tableHeader: {
    backgroundColor: '#f9fafb'
  },
  tableHeaderCell: {
    padding: '12px 16px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#374151',
    textAlign: 'left',
    borderBottom: '1px solid #e5e7eb'
  },
  tableRow: {
    transition: 'background-color 0.2s'
  },
  tableCell: {
    padding: '12px 16px',
    fontSize: '14px',
    color: '#374151',
    borderBottom: '1px solid #f3f4f6'
  },
  trackingNumber: {
    color: '#2563eb',
    cursor: 'pointer',
    fontWeight: '500',
    textDecoration: 'none'
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 24px',
    textAlign: 'center'
  },
  emptyIcon: {
    width: '48px',
    height: '48px',
    color: '#9ca3af',
    marginBottom: '16px'
  }
};

export default Dashboard;