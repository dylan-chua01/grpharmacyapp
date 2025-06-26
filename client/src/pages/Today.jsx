import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Package, 
  Search, 
  RefreshCw, 
  Filter, 
  Clock, 
  User, 
  MapPin, 
  Phone,
  Eye,
  X,
  ChevronDown,
  TrendingUp,
  AlertCircle
} from 'lucide-react';


const Today = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchTodaysOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const fetchTodaysOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5050/api/orders');
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const allOrders = await response.json();
      
      // Filter orders for today
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      const todaysOrders = allOrders.filter(order => {
        if (!order.dateTimeSubmission) return false;
        
        // Handle different date formats
        let orderDate;
        if (order.creationDate.includes('T')) {
          orderDate = new Date(order.creationDate).toISOString().split('T')[0];
        } else {
          // Assume format is already YYYY-MM-DD or similar
          orderDate = order.creationDate.split(' ')[0];
        }
        
        return orderDate === todayStr;
      });
      
      setOrders(todaysOrders);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.receiverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.patientNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.doTrackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.medicationName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => 
        order.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredOrders(filtered);
  };

  const getStatusCounts = () => {
    const counts = {
      all: orders.length,
      pending: 0,
      processing: 0,
      completed: 0,
      shipped: 0
    };

    orders.forEach(order => {
      const status = order.status?.toLowerCase();
      if (counts.hasOwnProperty(status)) {
        counts[status]++;
      }
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  // Inline styles
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      fontFamily: 'system-ui, -apple-system, sans-serif'
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
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
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
      padding: '10px 20px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'background-color 0.2s'
    },
    mainContainer: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '32px 16px'
    },
    loadingContainer: {
      minHeight: '400px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    loadingContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    errorAlert: {
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    errorText: {
      color: '#991b1b',
      margin: 0
    },
    errorButton: {
      marginLeft: 'auto',
      color: '#dc2626',
      backgroundColor: 'transparent',
      border: '1px solid #dc2626',
      padding: '6px 12px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginBottom: '32px'
    },
    statCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f3f4f6',
      transition: 'transform 0.2s, box-shadow 0.2s'
    },
    statCardHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    },
    statHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '8px'
    },
    statTitle: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#6b7280',
      margin: 0
    },
    statValue: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#111827',
      margin: 0
    },
    statIcon: {
      padding: '8px',
      borderRadius: '8px'
    },
    controlsContainer: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f3f4f6'
    },
    controlsHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    controlsTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#111827',
      margin: 0
    },
    filtersToggle: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: '#f3f4f6',
      color: '#374151',
      padding: '8px 12px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'background-color 0.2s'
    },
    controlsContent: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      alignItems: 'end'
    },
    searchContainer: {
      position: 'relative'
    },
    searchInput: {
      width: '100%',
      paddingLeft: '40px',
      paddingRight: '16px',
      paddingTop: '10px',
      paddingBottom: '10px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.2s'
    },
    searchIcon: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9ca3af',
      width: '18px',
      height: '18px'
    },
    filterSelect: {
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      backgroundColor: 'white',
      cursor: 'pointer',
      outline: 'none',
      transition: 'border-color 0.2s'
    },
    filterLabel: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '6px'
    },
    ordersContainer: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f3f4f6',
      overflow: 'hidden'
    },
    ordersHeader: {
      backgroundColor: '#f8fafc',
      padding: '20px 24px',
      borderBottom: '1px solid #f3f4f6'
    },
    ordersTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#111827',
      margin: 0
    },
    ordersSubtitle: {
      fontSize: '14px',
      color: '#6b7280',
      marginTop: '4px'
    },
    ordersTable: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    tableHeader: {
      backgroundColor: '#f9fafb'
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
      transition: 'background-color 0.2s',
      cursor: 'pointer'
    },
    tableCell: {
      padding: '16px',
      fontSize: '14px',
      color: '#374151',
      verticalAlign: 'top'
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
    statusPending: {
      backgroundColor: '#fef3c7',
      color: '#92400e'
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
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '13px',
      fontWeight: '500'
    },
    viewButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      backgroundColor: '#2563eb',
      color: 'white',
      padding: '6px 12px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '500',
      transition: 'background-color 0.2s'
    },
    emptyState: {
      textAlign: 'center',
      padding: '48px 24px',
      color: '#6b7280'
    },
    emptyIcon: {
      width: '48px',
      height: '48px',
      margin: '0 auto 16px',
      opacity: 0.5
    },
    // Modal styles
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
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      maxWidth: '900px',
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
      fontSize: '20px',
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
      borderBottom: '2px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
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
      fontWeight: '500',
      textAlign: 'right',
      fontFamily: 'monospace',
      backgroundColor: '#f3f4f6',
      padding: '4px 8px',
      borderRadius: '4px'
    }
  };

  const getStatusStyle = (status) => {
    const baseStyle = styles.statusBadge;
    switch (status?.toLowerCase()) {
      case 'completed':
        return { ...baseStyle, ...styles.statusCompleted };
      case 'pending':
        return { ...baseStyle, ...styles.statusPending };
      case 'processing':
        return { ...baseStyle, ...styles.statusProcessing };
      case 'shipped':
        return { ...baseStyle, ...styles.statusShipped };
      default:
        return { ...baseStyle, backgroundColor: '#f3f4f6', color: '#6b7280' };
    }
  };

  const getStatIconStyle = (type) => {
    const baseStyle = styles.statIcon;
    switch (type) {
      case 'total':
        return { ...baseStyle, backgroundColor: '#dbeafe' };
      case 'pending':
        return { ...baseStyle, backgroundColor: '#fef3c7' };
      case 'processing':
        return { ...baseStyle, backgroundColor: '#dbeafe' };
      case 'completed':
        return { ...baseStyle, backgroundColor: '#dcfce7' };
      case 'shipped':
        return { ...baseStyle, backgroundColor: '#e0e7ff' };
      default:
        return { ...baseStyle, backgroundColor: '#f3f4f6' };
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.headerContainer}>
            <div style={styles.headerContent}>
              <div>
                <h1 style={styles.title}>
                  <Calendar style={{ width: '28px', height: '28px', color: '#2563eb' }} />
                  Today's Orders
                </h1>
                <p style={styles.subtitle}>Orders placed today - {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
        <div style={styles.mainContainer}>
          <div style={styles.loadingContainer}>
            <div style={styles.loadingContent}>
              <RefreshCw style={{ width: '24px', height: '24px', color: '#2563eb' }} />
              <span style={{ fontSize: '16px', color: '#6b7280' }}>Loading today's orders...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContainer}>
          <div style={styles.headerContent}>
            <div>
              <h1 style={styles.title}>
                <Calendar style={{ width: '28px', height: '28px', color: '#2563eb' }} />
                Today's Orders
              </h1>
              <p style={styles.subtitle}>Orders placed today - {new Date().toLocaleDateString()}</p>
            </div>
            <button
              onClick={fetchTodaysOrders}
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
            <AlertCircle style={{ width: '20px', height: '20px', color: '#dc2626' }} />
            <p style={styles.errorText}>Failed to load orders: {error}</p>
            <button onClick={fetchTodaysOrders} style={styles.errorButton}>
              Retry
            </button>
          </div>
        )}

        {/* Statistics */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <h3 style={styles.statTitle}>Total Orders</h3>
              <div style={getStatIconStyle('total')}>
                <Package style={{ width: '20px', height: '20px', color: '#2563eb' }} />
              </div>
            </div>
            <p style={styles.statValue}>{statusCounts.all}</p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <h3 style={styles.statTitle}>Pending</h3>
              <div style={getStatIconStyle('pending')}>
                <Clock style={{ width: '20px', height: '20px', color: '#eab308' }} />
              </div>
            </div>
            <p style={{...styles.statValue, color: '#eab308'}}>{statusCounts.pending}</p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <h3 style={styles.statTitle}>Processing</h3>
              <div style={getStatIconStyle('processing')}>
                <TrendingUp style={{ width: '20px', height: '20px', color: '#2563eb' }} />
              </div>
            </div>
            <p style={{...styles.statValue, color: '#2563eb'}}>{statusCounts.processing}</p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <h3 style={styles.statTitle}>Completed</h3>
              <div style={getStatIconStyle('completed')}>
                <Package style={{ width: '20px', height: '20px', color: '#16a34a' }} />
              </div>
            </div>
            <p style={{...styles.statValue, color: '#16a34a'}}>{statusCounts.completed}</p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <h3 style={styles.statTitle}>Shipped</h3>
              <div style={getStatIconStyle('shipped')}>
                <Package style={{ width: '20px', height: '20px', color: '#7c3aed' }} />
              </div>
            </div>
            <p style={{...styles.statValue, color: '#7c3aed'}}>{statusCounts.shipped}</p>
          </div>
        </div>

        {/* Controls */}
        <div style={styles.controlsContainer}>
          <div style={styles.controlsHeader}>
            <h3 style={styles.controlsTitle}>Search & Filter</h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={styles.filtersToggle}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            >
              <Filter style={{ width: '16px', height: '16px' }} />
              <span>Filters</span>
              <ChevronDown style={{ 
                width: '16px', 
                height: '16px',
                transform: showFilters ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s'
              }} />
            </button>
          </div>

          {showFilters && (
            <div style={styles.controlsContent}>
              <div style={styles.searchContainer}>
                <label style={styles.filterLabel}>Search Orders</label>
                <Search style={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search by customer, patient number, tracking..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={styles.searchInput}
                  onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>

              <div>
                <label style={styles.filterLabel}>Filter by Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={styles.filterSelect}
                  onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                >
                  <option value="all">All Statuses ({statusCounts.all})</option>
                  <option value="pending">Pending ({statusCounts.pending})</option>
                  <option value="processing">Processing ({statusCounts.processing})</option>
                  <option value="completed">Completed ({statusCounts.completed})</option>
                  <option value="shipped">Shipped ({statusCounts.shipped})</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Orders Table */}
        {/* Orders Table */}
<div style={styles.ordersContainer}>
  <div style={styles.ordersHeader}>
    <h3 style={styles.ordersTitle}>Orders ({filteredOrders.length})</h3>
    <p style={styles.ordersSubtitle}>
      {filteredOrders.length} of {orders.length} orders shown
    </p>
  </div>

  {filteredOrders.length > 0 ? (
    <div style={{ overflowX: 'auto' }}>
      <table style={styles.ordersTable}>
        <thead style={styles.tableHeader}>
          <tr>
            <th style={styles.tableHeaderCell}>Created On</th>
            <th style={styles.tableHeaderCell}>Tracking #</th>
            <th style={styles.tableHeaderCell}>Patient Name</th>
            <th style={styles.tableHeaderCell}>Patient #</th>
            <th style={styles.tableHeaderCell}>Phone</th>
            <th style={styles.tableHeaderCell}>Payment Method</th>
            <th style={styles.tableHeaderCell}>Delivery Type</th>
            <th style={styles.tableHeaderCell}>Amount</th>
            <th style={styles.tableHeaderCell}>Status</th>
            <th style={styles.tableHeaderCell}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order, index) => (
            <tr 
              key={order._id} 
              style={styles.tableRow}
              onMouseEnter={(e) => e.target.closest('tr').style.backgroundColor = '#f9fafb'}
              onMouseLeave={(e) => e.target.closest('tr').style.backgroundColor = 'transparent'}
            >
              <td style={styles.tableCell}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock style={{ width: '14px', height: '14px', color: '#6b7280' }} />
                  <span style={{ fontSize: '13px', fontWeight: '500' }}>
                    {formatTime(order.creationDate)}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                  {order.creationDate ? new Date(order.creationDate).toLocaleDateString() : 'N/A'}
                </div>
              </td>
              <td style={styles.tableCell}>
                <span style={styles.trackingNumber}>
                  {order.doTrackingNumber || 'N/A'}
                </span>
              </td>
              <td style={styles.tableCell}>
                <div>
                  <p style={{ margin: 0, fontWeight: '500', fontSize: '14px' }}>
                    {order.receiverName || 'N/A'}
                  </p>
                  {order.dateOfBirth && (
                    <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#6b7280' }}>
                      DOB: {order.dateOfBirth}
                    </p>
                  )}
                </div>
              </td>
              <td style={styles.tableCell}>
                <span style={{ fontFamily: 'monospace', fontSize: '13px' }}>
                  {order.patientNumber || 'N/A'}
                </span>
              </td>
              <td style={styles.tableCell}>
                <div>
                  <p style={{ margin: 0, fontSize: '13px' }}>
                    {order.receiverPhoneNumber || 'N/A'}
                  </p>
                  {order.additionalPhoneNumber && (
                    <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#6b7280' }}>
                      Alt: {order.additionalPhoneNumber}
                    </p>
                  )}
                </div>
              </td>
              <td style={styles.tableCell}>
                {order.paymentMethod || 'N/A'}
              </td>
              <td style={styles.tableCell}>
                {order.jobMethod || 'N/A'}
              </td>
              <td style={styles.tableCell}>
                <span style={{ fontWeight: '600', color: '#059669' }}>
                  ${order.paymentAmount ? order.paymentAmount : '0.00'}
                </span>
              </td>
              <td style={styles.tableCell}>
                <span style={getStatusStyle(order.status)}>
                  {order.status || 'Unknown'}
                </span>
              </td>
              <td style={styles.tableCell}>
                <button
                  onClick={() => setSelectedOrder(order)}
                  style={styles.viewButton}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
                >
                  <Eye style={{ width: '14px', height: '14px' }} />
                  <span>View</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <div style={styles.emptyState}>
      <Package style={styles.emptyIcon} />
      <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: '600' }}>
        No orders found
      </h3>
      <p style={{ margin: 0, fontSize: '14px' }}>
        {searchTerm || statusFilter !== 'all' 
          ? 'Try adjusting your search or filter criteria' 
          : 'There are no orders placed today'}
      </p>
    </div>
  )}
</div>
      </div>

      {/* Order Details Modal */}
      {/* Order Details Modal */}
{selectedOrder && (
  <div style={styles.modalOverlay} onClick={() => setSelectedOrder(null)}>
    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
      <div style={styles.modalHeader}>
        <h2 style={styles.modalTitle}>
          Order Details - {selectedOrder.doTrackingNumber || 'N/A'}
        </h2>
        <button 
          onClick={() => setSelectedOrder(null)} 
          style={styles.modalCloseButton}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          <X />
        </button>
      </div>
      <div style={styles.modalBody}>
        <div style={styles.detailsGrid}>
          {/* Patient Information */}
          <div style={styles.detailSection}>
            <h3 style={styles.sectionTitle}>
              <User style={{ width: '18px', height: '18px' }} />
              Patient Information
            </h3>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Patient Name:</span>
              <span style={styles.detailValue}>{selectedOrder.receiverName || 'N/A'}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Patient #:</span>
              <span style={styles.detailValueMono}>{selectedOrder.patientNumber || 'N/A'}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Date of Birth:</span>
              <span style={styles.detailValue}>
                {selectedOrder.dateOfBirth}
              </span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>IC Number:</span>
              <span style={styles.detailValueMono}>{selectedOrder.icNum || 'N/A'}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Passport:</span>
              <span style={styles.detailValueMono}>{selectedOrder.passport || 'N/A'}</span>
            </div>
<div style={styles.detailRow}>
  <span style={styles.detailLabel}>Collection Date:</span>
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <input
      type="date"
      value={selectedOrder.collectionDate ? 
        new Date(selectedOrder.collectionDate).toISOString().split('T')[0] : ''
      }
      onChange={(e) => {
        const updatedOrder = { ...selectedOrder, collectionDate: e.target.value };
        setSelectedOrder(updatedOrder);
      }}
      style={{ 
        padding: '6px', 
        borderRadius: '4px', 
        border: '1px solid #d1d5db',
        marginRight: '10px'
      }}
    />
    
    <button 
    
     onClick={async () => {
  try {
    const response = await fetch(
      `http://localhost:5050/api/orders/${selectedOrder._id}/collection-date`,
      {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          collectionDate: selectedOrder.collectionDate
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update collection date: ${response.statusText}`);
    }

    const updatedOrder = await response.json();
    
    // Update local state
    setOrders(orders.map(order => 
      order._id === updatedOrder._id ? updatedOrder : order
    ));
    setSelectedOrder(updatedOrder);
    
    // Show success feedback
    alert('Collection date updated successfully!');
  } catch (error) {
    console.error('Error updating collection date:', error);
    alert(`Error: ${error.message}`);
  }
}}
      onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
      onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
    >
      Save
    </button>
    
  </div>
</div>
          </div>

          {/* Contact Information */}
          <div style={styles.detailSection}>
            <h3 style={styles.sectionTitle}>
              <Phone style={{ width: '18px', height: '18px' }} />
              Contact Information
            </h3>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Phone:</span>
              <span style={styles.detailValue}>
                {selectedOrder.receiverPhoneNumber ? (
                  <a href={`tel:${selectedOrder.receiverPhoneNumber}`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone style={{ width: '14px', height: '14px' }} />
                    {selectedOrder.receiverPhoneNumber}
                  </a>
                ) : 'N/A'}
              </span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Additional Phone:</span>
              <span style={styles.detailValue}>
                {selectedOrder.additionalPhoneNumber || 'N/A'}
              </span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Address:</span>
              <span style={styles.detailValue}>
                {selectedOrder.receiverAddress ? (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                    <MapPin style={{ width: '14px', height: '14px', flexShrink: 0, marginTop: '2px' }} />
                    <span>{selectedOrder.receiverAddress}</span>
                  </div>
                ) : 'N/A'}
              </span>
            </div>
          </div>

          {/* Order Information */}
          <div style={styles.detailSection}>
            <h3 style={styles.sectionTitle}>
              <Package style={{ width: '18px', height: '18px' }} />
              Order Information
            </h3>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Tracking #:</span>
              <span style={styles.detailValueMono}>{selectedOrder.doTrackingNumber || 'N/A'}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Created On:</span>
              <span style={styles.detailValue}>
                {selectedOrder.dateTimeSubmission}
              </span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Status:</span>
              <span style={getStatusStyle(selectedOrder.status)}>
                {selectedOrder.status || 'Unknown'}
              </span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Payment Method:</span>
              <span style={styles.detailValue}>{selectedOrder.paymentMethod || 'N/A'}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Delivery Type:</span>
              <span style={styles.detailValue}>{selectedOrder.jobMethod || 'N/A'}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Appointment Place:</span>
              <span style={styles.detailValue}>{selectedOrder.appointmentPlace || 'N/A'}</span>
            </div>
          </div>

          {/* Payment Information */}
          <div style={styles.detailSection}>
            <h3 style={styles.sectionTitle}>
              <TrendingUp style={{ width: '18px', height: '18px' }} />
              Payment Information
            </h3>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Payment Amount:</span>
              <span style={{ ...styles.detailValue, fontWeight: '600', color: '#059669' }}>
                ${selectedOrder.paymentAmount ? selectedOrder.paymentAmount : '0.00'}
              </span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Paying Patient:</span>
              <span style={styles.detailValue}>
                {selectedOrder.payingPatient ? 'Yes' : 'No'}
              </span>
            </div>
          </div>

          {/* Additional Information */}
          <div style={{ ...styles.detailSection, gridColumn: '1 / -1' }}>
            <h3 style={styles.sectionTitle}>
              <AlertCircle style={{ width: '18px', height: '18px' }} />
              Additional Information
            </h3>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Patient Remarks:</span>
              <span style={styles.detailValue}>
                {selectedOrder.remarks || 'No remarks'}
              </span>
            </div>
          </div>

          {/* Items Section */}
          <div style={{ ...styles.detailSection, gridColumn: '1 / -1' }}>
            <h3 style={styles.sectionTitle}>
              <Package style={{ width: '18px', height: '18px' }} />
              Items
            </h3>
            {selectedOrder.items ? (
              Array.isArray(selectedOrder.items) ? (
                <div style={{ display: 'grid', gap: '12px' }}>
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} style={{ 
                      backgroundColor: '#f3f4f6', 
                      padding: '12px', 
                      borderRadius: '6px',
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gap: '12px'
                    }}>
                      <div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Name</div>
                        <div style={{ fontWeight: '500' }}>{item.name || 'N/A'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Quantity</div>
                        <div>{item.quantity || '1'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Price</div>
                        <div>${item.price ? item.price.toFixed(2) : '0.00'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ 
                  backgroundColor: '#f3f4f6', 
                  padding: '12px', 
                  borderRadius: '6px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '12px'
                }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Name</div>
                    <div style={{ fontWeight: '500' }}>{selectedOrder.medicationName || 'N/A'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Quantity</div>
                    <div>1</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Price</div>
                    <div>${selectedOrder.paymentAmount ? selectedOrder.paymentAmount : '0.00'}</div>
                  </div>
                </div>
              )
            ) : (
              <p style={{ margin: 0, color: '#6b7280' }}>No items information available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Today;