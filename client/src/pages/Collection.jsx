import React, { useState, useEffect } from 'react';
import { Calendar, Package, ChevronRight, Clock, User, MapPin, Phone, X, CreditCard, FileText, Building, DollarSign, Users } from 'lucide-react';
import { format, parseISO, isToday, isTomorrow } from 'date-fns';

const CollectionDatesPage = () => {
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersWithoutDates, setOrdersWithoutDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // Styles
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    title: {
      fontSize: '24px',
      marginBottom: '20px',
      color: '#111827',
      fontWeight: '600'
    },
    selectPrompt: {
      textAlign: 'center',
      padding: '40px 20px',
      background: 'white',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      marginBottom: '20px'
    },
    promptText: {
      fontSize: '18px',
      color: '#666',
      marginBottom: '20px'
    },
    dateSelector: {
      display: 'flex',
      gap: '10px',
      marginBottom: '20px',
      overflowX: 'auto',
      paddingBottom: '10px',
      flexWrap: 'wrap'
    },
    dateButton: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '15px 20px',
      borderRadius: '8px',
      background: '#f5f5f5',
      border: 'none',
      cursor: 'pointer',
      minWidth: '120px',
      transition: 'all 0.2s'
    },
    activeDateButton: {
      background: '#3b82f6',
      color: 'white'
    },
    noDateButton: {
      background: '#fbbf24',
      color: 'white'
    },
    dateLabel: {
      fontWeight: '500',
      marginBottom: '5px'
    },
    orderCount: {
      fontSize: '12px',
      opacity: '0.8'
    },
    ordersContainer: {
      background: 'white',
      borderRadius: '10px',
      padding: '20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    dateTitle: {
      fontSize: '20px',
      marginBottom: '20px',
      color: '#111827'
    },
    ordersList: {
      display: 'grid',
      gap: '15px'
    },
    orderCard: {
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '15px',
      transition: 'all 0.2s'
    },
    orderCardHover: {
      borderColor: '#3b82f6'
    },
    orderHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '10px'
    },
    orderTime: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      fontSize: '14px',
      color: '#666'
    },
    statusBadge: {
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '500',
      textTransform: 'capitalize'
    },
    statusPending: {
      background: '#fef3c7',
      color: '#92400e'
    },
    statusReady: {
      background: '#dbeafe',
      color: '#1e40af'
    },
    statusCollected: {
      background: '#dcfce7',
      color: '#166534'
    },
    statusDelayed: {
      background: '#fed7d7',
      color: '#c53030'
    },
    statusCancelled: {
      background: '#fee2e2',
      color: '#991b1b'
    },
    orderDetails: {
      marginBottom: '10px'
    },
    customerInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '5px',
      fontSize: '14px'
    },
    patientNumber: {
      background: '#f3f4f6',
      padding: '2px 6px',
      borderRadius: '4px',
      fontFamily: 'monospace'
    },
    orderFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    trackingNumber: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      fontFamily: 'monospace',
      background: '#f3f4f6',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '13px'
    },
    actions: {
      display: 'flex',
      gap: '10px'
    },
    statusSelect: {
      padding: '6px 10px',
      borderRadius: '4px',
      border: '1px solid #d1d5db',
      background: 'white',
      cursor: 'pointer'
    },
    viewButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      background: '#3b82f6',
      color: 'white',
      border: 'none',
      padding: '6px 12px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px'
    },
    viewButtonHover: {
      background: '#2563eb'
    },
    loading: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px',
      fontSize: '16px',
      color: '#666'
    },
    error: {
      color: '#dc2626',
      padding: '20px',
      textAlign: 'center'
    },
    popup: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    popupContent: {
      background: 'white',
      borderRadius: '10px',
      padding: '30px',
      maxWidth: '600px',
      width: '90%',
      maxHeight: '80vh',
      overflowY: 'auto',
      position: 'relative'
    },
    popupHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    popupTitle: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#111827'
    },
    closeButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '5px',
      borderRadius: '4px',
      color: '#666'
    },
    popupSection: {
      marginBottom: '20px'
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '10px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '15px'
    },
    infoItem: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2px'
    },
    infoLabel: {
      fontSize: '12px',
      color: '#666',
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    infoValue: {
      fontSize: '14px',
      color: '#111827',
      fontWeight: '400'
    },
    groupedSection: {
      background: '#f9fafb',
      padding: '15px',
      borderRadius: '8px',
      marginBottom: '20px'
    },
    groupTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '15px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }
  };

  useEffect(() => {
    fetchCollectionDates();
    fetchOrdersWithoutCollectionDates();
  }, []);

  useEffect(() => {
    if (selectedDate && selectedDate !== 'no-date') {
      fetchOrdersForDate(selectedDate);
    }
  }, [selectedDate]);

  const fetchCollectionDates = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5050/api/collection-dates');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDates(data);
    } catch (error) {
      console.error('Error fetching dates:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrdersWithoutCollectionDates = async () => {
    try {
      // Fetch all orders and filter client-side for those without collectionDate
      const response = await fetch('http://localhost:5050/api/orders');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const allOrders = await response.json();
      
      // Filter orders that don't have a collectionDate (null, undefined, or empty string)
      const data = allOrders.filter(order => 
        !order.collectionDate || 
        order.collectionDate === '' || 
        order.collectionDate === null
      );
      
      // Group by creation date
      const grouped = data.reduce((acc, order) => {
        const dateKey = format(parseISO(order.creationDate), 'yyyy-MM-dd');
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(order);
        return acc;
      }, {});
      
      setOrdersWithoutDates(grouped);
    } catch (error) {
      console.error('Error fetching orders without collection dates:', error);
      // Set empty object on error to prevent UI issues
      setOrdersWithoutDates({});
    }
  };

  const fetchOrdersForDate = async (dateString) => {
    try {
      const response = await fetch(
        `http://localhost:5050/api/orders/collection-dates?date=${dateString}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleDateChange = (dateString) => {
    setSelectedDate(dateString);
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await fetch(`http://localhost:5050/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: status
        }),
      });
      if (selectedDate === 'no-date') {
        fetchOrdersWithoutCollectionDates();
      } else {
        fetchOrdersForDate(selectedDate);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedOrder(null);
  };

  const getDateLabel = (dateString) => {
    if (dateString === 'no-date') return 'No Collection Date';
    const date = parseISO(dateString);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEEE, MMMM d');
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'ready':
        return { ...styles.statusBadge, ...styles.statusReady };
      case 'collected':
        return { ...styles.statusBadge, ...styles.statusCollected };
      case 'delayed':
        return { ...styles.statusBadge, ...styles.statusDelayed };
      case 'cancelled':
        return { ...styles.statusBadge, ...styles.statusCancelled };
      default:
        return { ...styles.statusBadge, ...styles.statusPending };
    }
  };

  const getTotalOrdersWithoutDates = () => {
    return Object.values(ordersWithoutDates).reduce((total, orders) => total + orders.length, 0);
  };

  const renderOrderCard = (order) => (
    <div 
      key={order._id} 
      style={styles.orderCard}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
    >
      <div style={styles.orderHeader}>
        <span style={styles.orderTime}>
          <Clock size={16} />
          {format(parseISO(order.creationDate), 'h:mm a')}
        </span>
        <span style={getStatusStyle(order.status)}>
          {order.status || 'pending'}
        </span>
      </div>
      
      <div style={styles.orderDetails}>
        <div style={styles.customerInfo}>
          <User size={16} />
          <span>{order.receiverName}</span>
          <span style={styles.patientNumber}>{order.patientNumber}</span>
        </div>
        
        <div style={styles.customerInfo}>
          <Phone size={16} />
          <span>{order.receiverPhoneNumber}</span>
        </div>
        
        {order.receiverAddress && (
          <div style={styles.customerInfo}>
            <MapPin size={16} />
            <span>{order.receiverAddress}</span>
          </div>
        )}
      </div>
      
      <div style={styles.orderFooter}>
        <span style={styles.trackingNumber}>
          <Package size={16} />
          {order.doTrackingNumber}
        </span>
        
        <div style={styles.actions}>
          <select
            value={order.status || 'pending'}
            onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
            style={styles.statusSelect}
          >
            <option value="pending">Pending</option>
            <option value="collected">Collected</option>
            <option value="delayed">Delayed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <button
            onClick={() => handleViewOrder(order)}
            style={styles.viewButton}
            onMouseEnter={(e) => e.currentTarget.style.background = '#2563eb'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#3b82f6'}
          >
            View <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderOrderPopup = () => {
    if (!selectedOrder) return null;

    return (
      <div style={styles.popup} onClick={closePopup}>
        <div style={styles.popupContent} onClick={(e) => e.stopPropagation()}>
          <div style={styles.popupHeader}>
            <h2 style={styles.popupTitle}>Order Details</h2>
            <button style={styles.closeButton} onClick={closePopup}>
              <X size={24} />
            </button>
          </div>

          <div style={styles.popupSection}>
            <div style={styles.sectionTitle}>
              <Package size={20} />
              Order Information
            </div>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Tracking Number</span>
                <span style={styles.infoValue}>{selectedOrder.doTrackingNumber}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Created On</span>
                <span style={styles.infoValue}>
                  {selectedOrder.creationDate}
                </span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Delivery Type</span>
                <span style={styles.infoValue}>{selectedOrder.jobMethod || 'N/A'}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Status</span>
                <span style={getStatusStyle(selectedOrder.status)}>
                  {selectedOrder.status || 'pending'}
                </span>
              </div>
            </div>
          </div>

          <div style={styles.popupSection}>
            <div style={styles.sectionTitle}>
              <User size={20} />
              Patient Information
            </div>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Patient Name</span>
                <span style={styles.infoValue}>{selectedOrder.receiverName}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Patient Number</span>
                <span style={styles.infoValue}>{selectedOrder.patientNumber}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Date of Birth</span>
                <span style={styles.infoValue}>
                  {selectedOrder.dateOfBirth}
                </span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>IC Number</span>
                <span style={styles.infoValue}>{selectedOrder.icPassNum || 'N/A'}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Passport</span>
                <span style={styles.infoValue}>{selectedOrder.passport || 'N/A'}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Paying Patient</span>
                <span style={styles.infoValue}>{selectedOrder.payingPatient || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div style={styles.popupSection}>
            <div style={styles.sectionTitle}>
              <Phone size={20} />
              Contact Information
            </div>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Customer Phone</span>
                <span style={styles.infoValue}>{selectedOrder.receiverPhoneNumber}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Additional Phone</span>
                <span style={styles.infoValue}>{selectedOrder.additionalPhoneNumber || 'N/A'}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Customer Address</span>
                <span style={styles.infoValue}>{selectedOrder.receiverAddress || 'N/A'}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Appointment Place</span>
                <span style={styles.infoValue}>{selectedOrder.appointmentPlace || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div style={styles.popupSection}>
            <div style={styles.sectionTitle}>
              <CreditCard size={20} />
              Payment Information
            </div>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Payment Method</span>
                <span style={styles.infoValue}>{selectedOrder.paymentMethod || 'N/A'}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Payment Amount</span>
                <span style={styles.infoValue}>
                  {selectedOrder.paymentAmount ? `$${selectedOrder.paymentAmount}` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {selectedOrder.remarks && (
            <div style={styles.popupSection}>
              <div style={styles.sectionTitle}>
                <FileText size={20} />
                Patient Remarks
              </div>
              <div style={styles.infoValue}>
                {selectedOrder.remarks}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) return <div style={styles.loading}>Loading collection dates...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Collection Dates</h1>
      
      {!selectedDate ? (
        <div style={styles.selectPrompt}>
          <p style={styles.promptText}>Please select a collection date to view orders</p>
        </div>
      ) : null}

      <div style={styles.dateSelector}>
        {dates.map((date) => (
          <button
            key={date.dateString}
            style={{
              ...styles.dateButton,
              ...(selectedDate === date.dateString ? styles.activeDateButton : {})
            }}
            onClick={() => handleDateChange(date.dateString)}
          >
            <span style={styles.dateLabel}>{getDateLabel(date.dateString)}</span>
            <span style={styles.orderCount}>{date.orderCount} orders</span>
          </button>
        ))}
        
        {getTotalOrdersWithoutDates() > 0 && (
          <button
            style={{
              ...styles.dateButton,
              ...styles.noDateButton,
              ...(selectedDate === 'no-date' ? { background: '#f59e0b' } : {})
            }}
            onClick={() => handleDateChange('no-date')}
          >
            <span style={styles.dateLabel}>No Collection Date</span>
            <span style={styles.orderCount}>{getTotalOrdersWithoutDates()} orders</span>
          </button>
        )}
      </div>

      {selectedDate && selectedDate !== 'no-date' && (
        <div style={styles.ordersContainer}>
          <h2 style={styles.dateTitle}>
            {getDateLabel(selectedDate)} - {orders.length} orders
          </h2>
          
          <div style={styles.ordersList}>
            {orders.map(renderOrderCard)}
          </div>
        </div>
      )}

      {selectedDate === 'no-date' && (
        <div style={styles.ordersContainer}>
          <h2 style={styles.dateTitle}>
            Orders without Collection Date - {getTotalOrdersWithoutDates()} orders
          </h2>
          
          {Object.entries(ordersWithoutDates).map(([dateKey, dateOrders]) => (
            <div key={dateKey} style={styles.groupedSection}>
              <div style={styles.groupTitle}>
                <Calendar size={20} />
                Created on {format(parseISO(dateKey), 'EEEE, MMMM d, yyyy')} ({dateOrders.length} orders)
              </div>
              <div style={styles.ordersList}>
                {dateOrders.map(renderOrderCard)}
              </div>
            </div>
          ))}
        </div>
      )}

      {showPopup && renderOrderPopup()}
    </div>
  );
};

export default CollectionDatesPage;