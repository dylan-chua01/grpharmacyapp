import React, { useState, useEffect } from 'react';
import { Users, Package, TrendingUp, Calendar, Search, RefreshCw, ArrowLeft, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch data from your API
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ordersRes, customersRes] = await Promise.all([
        fetch('http://localhost:5050/api/orders'),
        fetch('http://localhost:5050/api/customers')
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
      const response = await fetch(`http://localhost:5050/api/customers/${patientNumber}/orders`);
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
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
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

  // Inline styles
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    loadingContainer: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    loadingContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    loadingText: {
      fontSize: '18px',
      color: '#6b7280'
    },
    header: {
      backgroundColor: 'white',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      borderBottom: '1px solid #e5e7eb'
    },
    headerContainer: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 16px'
    },
    headerContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '24px 0'
    },
    title: {
      fontSize: '30px',
      fontWeight: 'bold',
      color: '#111827',
      margin: 0
    },
    subtitle: {
      color: '#6b7280',
      marginTop: '4px',
      fontSize: '16px'
    },
    refreshButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: '#2563eb',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'background-color 0.2s'
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: '#6b7280',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'background-color 0.2s',
      marginRight: '12px'
    },
    mainContainer: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '32px 16px'
    },
    errorAlert: {
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '24px'
    },
    errorText: {
      color: '#991b1b'
    },
    errorButton: {
      marginTop: '8px',
      color: '#dc2626',
      textDecoration: 'underline',
      background: 'none',
      border: 'none',
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
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      padding: '24px',
      border: '1px solid #f3f4f6'
    },
    metricContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    metricLabel: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#6b7280',
      margin: '0 0 4px 0'
    },
    metricValue: {
      fontSize: '30px',
      fontWeight: 'bold',
      margin: 0
    },
    metricIcon: {
      padding: '12px',
      borderRadius: '8px'
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
      border: '1px solid #f3f4f6'
    },
    customerHeader: {
      padding: '24px',
      borderBottom: '1px solid #f3f4f6'
    },
    customerTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#111827',
      margin: 0
    },
    customerSubtitle: {
      fontSize: '14px',
      color: '#6b7280',
      marginTop: '4px'
    },
    searchContainer: {
      marginTop: '16px',
      position: 'relative'
    },
    searchInput: {
      width: '80%',
      paddingLeft: '40px',
      paddingRight: '16px',
      paddingTop: '8px',
      paddingBottom: '8px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none'
    },
    searchIcon: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9ca3af',
      width: '16px',
      height: '16px'
    },
    customerContent: {
      padding: '24px'
    },
    customerList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      maxHeight: '320px',
      overflowY: 'auto'
    },
    customerItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px',
      backgroundColor: '#f9fafb',
      borderRadius: '8px',
      transition: 'all 0.2s',
      cursor: 'pointer',
      border: '1px solid transparent'
    },
    customerItemHover: {
      backgroundColor: '#f3f4f6',
      borderColor: '#e5e7eb'
    },
    customerInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    customerRank: {
      backgroundColor: '#dbeafe',
      color: '#2563eb',
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: '600'
    },
    customerName: {
      fontWeight: '500',
      color: '#111827',
      margin: 0
    },
    customerNumber: {
      fontSize: '14px',
      color: '#6b7280',
      margin: 0
    },
    customerStats: {
      textAlign: 'right'
    },
    customerOrders: {
      fontWeight: '600',
      color: '#111827',
      margin: 0
    },
    customerDate: {
      fontSize: '14px',
      color: '#6b7280',
      margin: 0
    },
    emptyState: {
      textAlign: 'center',
      padding: '32px',
      color: '#6b7280'
    },
    emptyIcon: {
      width: '48px',
      height: '48px',
      margin: '0 auto 16px',
      opacity: 0.5
    },
    // Customer Orders View Styles
    customerOrdersContainer: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f3f4f6'
    },
    customerOrdersHeader: {
      padding: '24px',
      borderBottom: '1px solid #f3f4f6',
      backgroundColor: '#f8fafc'
    },
    customerOrdersTitle: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#111827',
      margin: '0 0 8px 0'
    },
    customerOrdersSubtitle: {
      fontSize: '16px',
      color: '#6b7280',
      margin: 0
    },
    ordersTable: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    tableHeader: {
      backgroundColor: '#f9fafb',
      borderBottom: '1px solid #f3f4f6'
    },
    tableHeaderCell: {
      padding: '16px',
      textAlign: 'left',
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      borderBottom: '1px solid #e5e7eb'
    },
    tableRow: {
      borderBottom: '1px solid #f3f4f6',
      transition: 'background-color 0.2s'
    },
    tableRowHover: {
      backgroundColor: '#f9fafb'
    },
    tableCell: {
      padding: '16px',
      fontSize: '14px',
      color: '#374151',
      borderBottom: '1px solid #f3f4f6'
    },
    statusBadge: {
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '500',
      textTransform: 'capitalize'
    },
    statusCompleted: {
      backgroundColor: '#dcfce7',
      color: '#166534'
    },
    statusProcessing: {
      backgroundColor: '#dbeafe',
      color: '#1e40af'
    },
    statusShipped: {
      backgroundColor: '#e0e7ff',
      color: '#5b21b6'
    },
    trackingNumber: {
      fontFamily: 'monospace',
      backgroundColor: '#f3f4f6',
      padding: '2px 6px',
      borderRadius: '4px',
      fontSize: '13px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      color: '#2563eb',
      textDecoration: 'underline'
    },
    // Modal Styles
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      maxWidth: '800px',
      width: '100%',
      maxHeight: '90vh',
      overflowY: 'auto'
    },
    modalHeader: {
      padding: '24px',
      borderBottom: '1px solid #f3f4f6',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#f8fafc'
    },
    modalTitle: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#111827',
      margin: 0
    },
    modalCloseButton: {
      backgroundColor: 'transparent',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#6b7280',
      padding: '4px',
      borderRadius: '4px',
      transition: 'background-color 0.2s'
    },
    modalBody: {
      padding: '24px'
    },
    detailsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '24px'
    },
    detailSection: {
      backgroundColor: '#f9fafb',
      padding: '20px',
      borderRadius: '8px',
      border: '1px solid #f3f4f6'
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '16px',
      paddingBottom: '8px',
      borderBottom: '2px solid #e5e7eb'
    },
    detailRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '12px',
      gap: '12px'
    },
    detailLabel: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#6b7280',
      minWidth: '120px',
      flexShrink: 0
    },
    detailValue: {
      fontSize: '14px',
      color: '#111827',
      fontWeight: '400',
      textAlign: 'right',
      wordBreak: 'break-word'
    },
    detailValueMono: {
      fontSize: '13px',
      color: '#111827',
      fontWeight: '400',
      textAlign: 'right',
      fontFamily: 'monospace',
      backgroundColor: '#f3f4f6',
      padding: '2px 6px',
      borderRadius: '4px'
    },
    detailValueCurrency: {
      fontSize: '14px',
      color: '#059669',
      fontWeight: '600',
      textAlign: 'right'
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingContent}>
          <RefreshCw style={{ width: '24px', height: '24px', color: '#2563eb' }} />
          <span style={styles.loadingText}>Loading dashboard...</span>
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
                          <span style={getStatusStyle(order.status)}>
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

export default Dashboard;