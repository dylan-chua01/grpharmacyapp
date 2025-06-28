import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { 
  Calendar, Phone, User, CreditCard, Truck, MapPin, Hash, FileText, 
  Building, AlertCircle, Shield 
} from 'lucide-react';

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    padding: '2rem',
  },
  container: {
    maxWidth: '1024px',
    margin: '0 auto',
    padding: '1rem',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    border: '1px solid #e5e7eb',
    padding: '1.5rem',
    marginBottom: '1.5rem',
  },
  cardTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
  },
  label: {
    color: '#6b7280',
    fontSize: '0.875rem',
  },
  value: {
    fontWeight: '500',
    color: '#111827',
  },
  valueGreen: {
    fontWeight: '500',
    color: '#16a34a',
    fontSize: '1.125rem',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0',
    borderBottom: '1px solid #f3f4f6',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1.5rem',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
    '@media (maxWidth: 768px)': {
      gridTemplateColumns: '1fr',
    }
  },
  remarks: {
    backgroundColor: '#f9fafb',
    borderRadius: '0.5rem',
    padding: '1rem',
    color: '#374151',
    lineHeight: '1.6',
  },
  notice: {
    backgroundColor: '#fef3c7',
    border: '1px solid #f59e0b',
    borderRadius: '0.5rem',
    padding: '0.75rem 1rem',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.875rem',
    color: '#92400e',
  },
  logEntry: {
    borderLeft: '4px solid #3b82f6',
    padding: '1rem',
    marginBottom: '1rem',
    backgroundColor: '#f8fafc',
    borderRadius: '0.5rem',
  },
  remarkEntry: {
    borderLeft: '4px solid #10b981',
    padding: '1rem',
    marginBottom: '1rem',
    backgroundColor: '#f0fdf4',
    borderRadius: '0.5rem',
  },
  inputGroup: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '1rem',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  input: {
    padding: '0.5rem 0.75rem',
    borderRadius: '0.375rem',
    border: '1px solid #d1d5db',
    fontSize: '0.875rem',
    flex: '1',
    minWidth: '200px',
  },
  select: {
    padding: '0.5rem 0.75rem',
    borderRadius: '0.375rem',
    border: '1px solid #d1d5db',
    fontSize: '0.875rem',
    minWidth: '150px',
  },
  button: {
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.2s ease',
  },
  buttonPrimary: {
    backgroundColor: '#3b82f6',
    color: 'white',
    '&:hover': {
      backgroundColor: '#2563eb',
    }
  },
  buttonSuccess: {
    backgroundColor: '#10b981',
    color: 'white',
    '&:hover': {
      backgroundColor: '#059669',
    }
  },
  badge: {
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
};

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  
  // Form states
  const [logNote, setLogNote] = useState('');
  const [logCategory, setLogCategory] = useState('');
  const [logCreatedBy, setLogCreatedBy] = useState('');
  const [pharmacyRemark, setPharmacyRemark] = useState('');
  const [pharmacyUser, setPharmacyUser] = useState('');

  useEffect(() => {
    // Get user role from sessionStorage
    const role = sessionStorage.getItem('userRole');
    setUserRole(role);
    
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/orders/${id}`);
        if (!response.ok) throw new Error('Failed to fetch order');
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleAddLog = async () => {
    if (!logNote.trim() || !logCategory || !logCreatedBy.trim()) {
      alert('Please fill all fields');
      return;
    }

    try {
      const response = await fetch(`/api/orders/${id}/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          note: logNote,
          category: logCategory,
          createdBy: logCreatedBy
        }),
      });

      if (!response.ok) throw new Error('Failed to add log');
      
      const newLog = await response.json();
      setOrder(prev => ({
        ...prev,
        logs: [newLog.log, ...(prev.logs || [])]
      }));
      
      setLogNote('');
      setLogCategory('');
      setLogCreatedBy('');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddPharmacyRemark = async () => {
    if (!pharmacyRemark.trim() || !pharmacyUser.trim()) {
      alert('Please fill all fields');
      return;
    }

    try {
      const response = await fetch(`/api/orders/${id}/pharmacy-remarks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          remark: pharmacyRemark,
          createdBy: pharmacyUser
        }),
      });

      if (!response.ok) throw new Error('Failed to add remark');
      
      const newRemark = await response.json();
      setOrder(prev => ({
        ...prev,
        pharmacyRemarks: [newRemark.remark, ...(prev.pharmacyRemarks || [])]
      }));
      
      setPharmacyRemark('');
      setPharmacyUser('');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.card}>Loading order details...</div>
      </div>
    </div>
  );

  if (error) return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={{ ...styles.card, color: '#dc2626' }}>{error}</div>
      </div>
    </div>
  );

  if (!order) return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.card}>Order not found</div>
      </div>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>Order Details</h1>
              <p style={styles.label}>Order ID: {order._id}</p>
            </div>
            <div style={styles.badge}>
              {order.doTrackingNumber || 'No tracking number'}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div style={styles.grid2}>
          {/* Order Info */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              <FileText style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem', color: '#2563eb' }} /> 
              Order Information
            </h2>
            <div>
              <div style={styles.row}>
                <span style={styles.label}>Tracking Number:</span>
                <span style={styles.value}>{order.doTrackingNumber || 'N/A'}</span>
              </div>
              <div style={styles.row}>
                <span style={styles.label}>Created On:</span>
                <span style={styles.value}>{new Date(order.creationDate).toLocaleString()}</span>
              </div>
              <div style={styles.row}>
                <span style={styles.label}>Payment Method:</span>
                <span style={styles.value}>{order.paymentMethod || 'N/A'}</span>
              </div>
              <div style={styles.row}>
                <span style={styles.label}>Delivery Type:</span>
                <span style={styles.value}>{order.jobMethod || 'N/A'}</span>
              </div>
              <div style={{ ...styles.row, borderBottom: 'none' }}>
                <span style={styles.label}>Payment Amount:</span>
                <span style={styles.valueGreen}>{order.paymentAmount || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Patient Info */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              <User style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem', color: '#16a34a' }} /> 
              Patient Information
            </h2>
            <div>
              <div style={styles.row}>
                <span style={styles.label}>Patient Name:</span>
                <span style={styles.value}>{order.receiverName || 'N/A'}</span>
              </div>
              <div style={styles.row}>
                <span style={styles.label}>Date of Birth:</span>
                <span style={styles.value}>{order.dateOfBirth || 'N/A'}</span>
              </div>
              <div style={styles.row}>
                <span style={styles.label}>IC Number:</span>
                <span style={styles.value}>{order.icPassNum || 'N/A'}</span>
              </div>
              <div style={styles.row}>
                <span style={styles.label}>Patient Number:</span>
                <span style={styles.value}>{order.patientNumber || 'N/A'}</span>
              </div>
              <div style={styles.row}>
                <span style={styles.label}>Paying Patient:</span>
                <span style={styles.value}>{order.payingPatient || 'N/A'}</span>
              </div>
              <div style={{ ...styles.row, borderBottom: 'none' }}>
                <span style={styles.label}>Passport:</span>
                <span style={styles.value}>{order.passport || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              <Phone style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem', color: '#9333ea' }} /> 
              Contact Information
            </h2>
            <div>
              <div style={styles.row}>
                <span style={styles.label}>Customer Phone:</span>
                <span style={styles.value}>{order.receiverPhoneNumber || 'N/A'}</span>
              </div>
              <div style={{ ...styles.row, borderBottom: 'none' }}>
                <span style={styles.label}>Additional Phone:</span>
                <span style={styles.value}>{order.additionalPhoneNumber || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Address Info */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              <MapPin style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem', color: '#dc2626' }} /> 
              Address & Appointment
            </h2>
            <div>
              <div style={styles.row}>
                <span style={styles.label}>Customer Address:</span>
                <span style={styles.value}>{order.receiverAddress || 'N/A'}</span>
              </div>
              <div style={{ ...styles.row, borderBottom: 'none' }}>
                <span style={styles.label}>Appointment Place:</span>
                <span style={styles.value}>{order.appointmentPlace || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Remarks */}
        {order.remarks && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              <FileText style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem', color: '#f97316' }} /> 
              Patient Remarks
            </h2>
            <div style={styles.remarks}>
              <p>{order.remarks}</p>
            </div>
          </div>
        )}

        {/* Go Rush Internal Logs Section - Show for both roles but only allow Go Rush to add */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            <Shield style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem', color: '#3b82f6' }} /> 
            Go Rush Internal Logs
          </h2>
          
          {userRole === 'gorush' ? (
            <>
              <div style={styles.notice}>
                <AlertCircle style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                <strong>Go Rush Staff Only:</strong> Internal tracking and communication
              </div>

              <div style={styles.inputGroup}>
                <input
                  value={logCreatedBy}
                  onChange={(e) => setLogCreatedBy(e.target.value)}
                  placeholder="Your name"
                  style={styles.input}
                  aria-label="Log creator name"
                />
                <select
                  value={logCategory}
                  onChange={(e) => setLogCategory(e.target.value)}
                  style={styles.select}
                  aria-label="Log category"
                >
                  <option value="">Select Category</option>
                  <option value="Delivery Issue">Delivery Issue</option>
                  <option value="Payment Query">Payment Query</option>
                  <option value="Customer Feedback">Customer Feedback</option>
                  <option value="Status Update">Status Update</option>
                  <option value="Other">Other</option>
                </select>
                <input
                  value={logNote}
                  onChange={(e) => setLogNote(e.target.value)}
                  placeholder="Enter internal note"
                  style={styles.input}
                  aria-label="Log note"
                />
                <button
                  onClick={handleAddLog}
                  style={{ ...styles.button, ...styles.buttonPrimary }}
                >
                  Add Log
                </button>
              </div>
            </>
          ) : (
            <div style={{ ...styles.notice, backgroundColor: '#f3f4f6', borderColor: '#9ca3af', color: '#374151' }}>
              <AlertCircle style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
              <strong>View Only:</strong> Internal logs from Go Rush staff
            </div>
          )}

          {order.logs?.length > 0 ? (
            <div style={{ marginTop: '1rem' }}>
              {order.logs.map((log, idx) => (
                <div key={idx} style={styles.logEntry}>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    {new Date(log.createdAt).toLocaleString()} by <strong>{log.createdBy}</strong>
                  </div>
                  <div style={{ fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>
                    {log.category}
                  </div>
                  <div style={{ color: '#4b5563' }}>
                    {log.note}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#6b7280', textAlign: 'center', fontStyle: 'italic' }}>
              No internal logs yet
            </p>
          )}
        </div>

        {/* Pharmacy Remarks Section - Show for both roles but only allow JPMC to add */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            <Building style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem', color: '#10b981' }} /> 
            Pharmacy Remarks
          </h2>

          {userRole === 'jpmc' ? (
            <>
              <div style={{ ...styles.notice, backgroundColor: '#dcfce7', borderColor: '#10b981', color: '#166534' }}>
                <AlertCircle style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                <strong>JPMC Pharmacy Staff:</strong> Clinical notes and medication-related remarks
              </div>

              <div style={styles.inputGroup}>
                <input
                  value={pharmacyUser}
                  onChange={(e) => setPharmacyUser(e.target.value)}
                  placeholder="Pharmacist name"
                  style={styles.input}
                  aria-label="Pharmacist name"
                />
                <input
                  value={pharmacyRemark}
                  onChange={(e) => setPharmacyRemark(e.target.value)}
                  placeholder="Enter pharmacy remark"
                  style={styles.input}
                  aria-label="Pharmacy remark"
                />
                <button
                  onClick={handleAddPharmacyRemark}
                  style={{ ...styles.button, ...styles.buttonSuccess }}
                >
                  Add Remark
                </button>
              </div>
            </>
          ) : (
            <div style={{ ...styles.notice, backgroundColor: '#f3f4f6', borderColor: '#9ca3af', color: '#374151' }}>
              <AlertCircle style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
              <strong>View Only:</strong> Pharmacy remarks from JPMC staff
            </div>
          )}

          {order.pharmacyRemarks?.length > 0 ? (
            <div style={{ marginTop: '1rem' }}>
              {order.pharmacyRemarks.map((remark, idx) => (
                <div key={idx} style={styles.remarkEntry}>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    {new Date(remark.createdAt).toLocaleString()} by <strong>{remark.createdBy}</strong>
                  </div>
                  <div style={{ color: '#374151' }}>
                    {remark.remark}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#6b7280', textAlign: 'center', fontStyle: 'italic' }}>
              No pharmacy remarks yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;