import { useState } from 'react';

const PasswordModal = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    sessionStorage.removeItem('userRole');


    let role = null;

    // Check password and assign role
    if (password === 'gorush123') {
      role = 'gorush';
    } else if (password === 'jpmc123') {
      role = 'jpmc';
    } else if (password === 'moh123') {
      role = 'moh';
    } else {
      setError('Invalid password');
      return;
    }

    // Save role and pass to parent
    sessionStorage.setItem('userRole', role);
    console.log('✅ Logged in as role:', role);
    onSuccess(role);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        background: '#fff',
        padding: '2rem',
        borderRadius: '8px',
        minWidth: '300px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>Access Required</h2>
        <p style={{ marginBottom: '1rem', color: '#666', fontSize: '0.9rem', textAlign: 'center' }}>
          Enter your organization password to continue
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={e => {
              setPassword(e.target.value);
              setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder="Enter password"
            style={{ 
              padding: '0.75rem', 
              width: '100%', 
              marginBottom: '1rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
            autoFocus
          />
          {error && (
            <p style={{ 
              color: '#dc2626', 
              marginBottom: '1rem', 
              fontSize: '0.875rem',
              textAlign: 'center'
            }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            style={{ 
              padding: '0.75rem 1.5rem', 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              borderRadius: '4px',
              width: '100%',
              border: 'none',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Access Application
          </button>
        </form>
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          backgroundColor: '#f9fafb',
          borderRadius: '4px',
          fontSize: '0.8rem',
          color: '#6b7280'
        }}>
          <strong>Access Levels:</strong><br />
          • Go Rush: Full system access<br />
          • JPMC: JPMC Specific Access<br />
          • MOH: MOH Specific Access
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;
