import { useEffect, useState } from 'react';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [qbStartDate, setQbStartDate] = useState(null);
  const [qbEndDate, setQbEndDate] = useState(null);

  // Styles object
  const styles = {
    pageContainer: {
      padding: '1.5rem',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    header: {
      fontSize: '2rem',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    filtersContainer: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '1rem',
      flexWrap: 'wrap'
    },
    dateFilter: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem'
    },
    dateInput: {
      padding: '0.5rem',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '1rem'
    },
    clearButton: {
      padding: '0.5rem 1rem',
      background: '#f44336',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '500',
      ':hover': {
        background: '#d32f2f'
      }
    },
    statsContainer: {
      background: '#e0f7fa',
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '2rem'
    },
    statsHeading: {
      fontSize: '1.25rem',
      marginBottom: '0.5rem',
      color: '#006064'
    },
    statsText: {
      color: '#00838f'
    },
    tableContainer: {
      maxHeight: '500px',
      overflowY: 'auto',
      overflowX: 'auto'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      minWidth: '1200px'
    },
    tableHeader: {
      background: '#006064',
      color: 'white',
      position: 'sticky',
      top: 0
    },
    th: {
      padding: '0.75rem',
      textAlign: 'left',
      borderBottom: '1px solid #e2e8f0',
      whiteSpace: 'nowrap',
      fontSize: '0.9rem',
      backgroundColor: '#f8fafc',
      fontWeight: '600',
      color: '#334155'
    },
    td: {
      padding: '0.75rem',
      borderBottom: '1px solid #e2e8f0',
      verticalAlign: 'top',
      fontSize: '0.85rem',
      maxWidth: '200px',
      wordWrap: 'break-word',
      color: '#475569'
    },
    evenRow: {
      background: '#fff'
    },
    oddRow: {
      background: '#f1f1f1'
    }
  };

  useEffect(() => {
    fetch('/api/orders') 
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setFilteredOrders(data);
      })
      .catch(err => console.error("Error fetching orders:", err));
  }, []);

  useEffect(() => {
    let filtered = [...orders];

    // Filter by QB Creation Date
    if (qbStartDate && qbEndDate) {
      filtered = filtered.filter(order => {
        if (!order.creationDate) return false;
        const qbDate = new Date(order.creationDate);
        return qbDate >= qbStartDate && qbDate <= qbEndDate;
      });
    }

    setFilteredOrders(filtered);
  }, [qbStartDate, qbEndDate, orders]);

  const clearFilters = () => {
    setQbStartDate(null);
    setQbEndDate(null);
    setFilteredOrders(orders);
  };

  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.header}>
        <span role="img" aria-label="receipt">🧾</span> Pharmacy JPMC Orders Dashboard
      </h1>

      {/* Date Filters */}
      <div style={styles.filtersContainer}>
        <div style={styles.dateFilter}>
          <label>Start Date:</label>
          <input
            type="date"
            style={styles.dateInput}
            value={qbStartDate ? qbStartDate.toISOString().split('T')[0] : ''}
            onChange={(e) => setQbStartDate(e.target.value ? new Date(e.target.value) : null)}
          />
        </div>
        <div style={styles.dateFilter}>
          <label>End Date:</label>
          <input
            type="date"
            style={styles.dateInput}
            value={qbEndDate ? qbEndDate.toISOString().split('T')[0] : ''}
            onChange={(e) => setQbEndDate(e.target.value ? new Date(e.target.value) : null)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button 
            onClick={clearFilters}
            style={styles.clearButton}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsContainer}>
        <h2 style={styles.statsHeading}>Total Orders: {filteredOrders.length}</h2>
        <p style={styles.statsText}>Orders with Creation Date: {orders.filter(o => o.creationDate).length}</p>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>Tracking Number</th>
              <th style={styles.th}>CreatedOn</th>
              <th style={styles.th}>Customer Phone</th>
              <th style={styles.th}>Patient Name</th>
              <th style={styles.th}>Payment Method</th>
              <th style={styles.th}>Delivery Type</th>
              <th style={styles.th}>Patient Remarks</th>
              <th style={styles.th}>Date of Birth</th>
              <th style={styles.th}>Customer Address</th>
              <th style={styles.th}>IC Number</th>
              <th style={styles.th}>Additional Phone</th>
              <th style={styles.th}>Patient Number</th>
              <th style={styles.th}>Appointment Place</th>
              <th style={styles.th}>Payment Amount</th>
              <th style={styles.th}>Paying Patient</th>
              <th style={styles.th}>Passport</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, idx) => (
              <tr key={idx} style={idx % 2 === 0 ? styles.evenRow : styles.oddRow}>
                <td style={styles.td}>{order.doTrackingNumber || 'N/A'}</td>
                <td style={styles.td}>
                  {order.creationDate 
                    ? new Date(order.creationDate).toLocaleString()
                    : 'N/A'}
                </td>
                <td style={styles.td}>{order.receiverPhoneNumber || 'N/A'}</td>
                <td style={styles.td}>{order.receiverName || 'N/A'}</td>
                <td style={styles.td}>{order.paymentMethod || 'N/A'}</td>
                <td style={styles.td}>{order.jobMethod || 'N/A'}</td>
                <td style={styles.td}>{order.remarks || 'N/A'}</td>
                <td style={styles.td}>{order.dateOfBirth || 'N/A'}</td>
                <td style={styles.td}>{order.receiverAddress || 'N/A'}</td>
                <td style={styles.td}>{order.icNum || 'N/A'}</td>
                <td style={styles.td}>{order.additionalPhoneNumber || 'N/A'}</td>
                <td style={styles.td}>{order.patientNumber || 'N/A'}</td>
                <td style={styles.td}>{order.appointmentPlace || 'N/A'}</td>
                <td style={styles.td}>{order.paymentAmount || 'N/A'}</td>
                <td style={styles.td}>{order.payingPatient || 'N/A'}</td>
                <td style={styles.td}>{order.passport || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrdersPage;