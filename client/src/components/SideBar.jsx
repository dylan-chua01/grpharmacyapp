import React, { useState, useEffect } from 'react';
import { Menu, X, Home, Users, Package, ChevronRight, Activity, Settings, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/NavBar.css';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Get user role from sessionStorage
    const role = sessionStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  const allMenuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      path: '/dashboard',
      badge: null,
      roles: ['gorush']
    },
    {
      id: 'today',
      label: 'Today',
      icon: Home,
      path: '/today',
      badge: null,
      roles: ['gorush', 'jpmc']
    },
    {
      id: 'customers',
      label: 'All Customers',
      icon: Users,
      path: '/customers',
      roles: ['gorush']
    },
    {
      id: 'orders',
      label: 'All Orders',
      icon: Package,
      path: '/orders',
      roles: ['gorush', 'jpmc']
    },
    {
      id: 'collection',
      label: 'Collection Dates',
      icon: Package,
      path: '/collection',
      roles: ['gorush', 'jpmc']
    },
  ];

  const bottomMenuItems = [
    {
      id: 'logout',
      label: 'Logout',
      icon: LogOut,
      path: '/logout',
      action: 'logout',
      roles: ['gorush', 'jpmc']
    }
  ];

  // Filter menu items based on user role
  const menuItems = allMenuItems.filter(item => 
    item.roles.includes(userRole)
  );

  const filteredBottomMenuItems = bottomMenuItems.filter(item => 
    item.roles.includes(userRole)
  );

  const handleLogout = () => {
    sessionStorage.removeItem('userRole');
    window.location.reload(); // This will trigger the password modal again
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Header */}
      <div className="sidebar-header">
        <div className="brand">
          <div className="brand-icon">
            <div className="pharmacy-icon">
              <div className="pill pill-1"></div>
              <div className="pill pill-2"></div>
              <div className="cross">+</div>
            </div>
          </div>
          {!isCollapsed && (
            <div className="brand-text">
              <h2>Pharmacy</h2>
              <span>
                {userRole === 'jpmc' ? 'JPMC Healthcare' : 'Go Rush System'}
              </span>
            </div>
          )}
        </div>
        <button 
          className="toggle-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <Menu size={18} /> : <X size={18} />}
        </button>
      </div>

      {/* User Role Indicator */}
      {!isCollapsed && (
        <div className="user-role-indicator" style={{
          padding: '0.5rem 1rem',
          margin: '0.5rem',
          backgroundColor: userRole === 'jpmc' ? '#fef3c7' : '#dbeafe',
          borderRadius: '6px',
          fontSize: '0.75rem',
          fontWeight: '500',
          color: userRole === 'jpmc' ? '#92400e' : '#1e40af',
          textAlign: 'center'
        }}>
          {userRole === 'jpmc' ? 'JPMC Access' : 'Go Rush Access'}
        </div>
      )}

      {/* Main Menu */}
      <div className="menu-section">
        <nav className="menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.includes(item.path);
            const isHovered = hoveredItem === item.id;
            
            return (
              <Link
                to={item.path}
                key={item.id}
                className={`menu-item ${isActive ? 'active' : ''} ${isHovered ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="menu-item-content">
                  <div className="icon-wrapper">
                    <Icon size={20} />
                  </div>
                  {!isCollapsed && (
                    <>
                      <span className="label">{item.label}</span>
                      <div className="menu-item-end">
                        {item.badge && (
                          <span className="badge">{item.badge}</span>
                        )}
                        <ChevronRight size={14} className="chevron" />
                      </div>
                    </>
                  )}
                </div>
                {isActive && <div className="active-indicator"></div>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Menu */}
      <div className="bottom-menu">
        {filteredBottomMenuItems.map((item) => {
          const Icon = item.icon;
          const isHovered = hoveredItem === item.id;
          
          if (item.action === 'logout') {
            return (
              <button
                key={item.id}
                className={`menu-item ${isHovered ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  width: '100%',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <div className="menu-item-content">
                  <div className="icon-wrapper">
                    <Icon size={20} />
                  </div>
                  {!isCollapsed && <span className="label">{item.label}</span>}
                </div>
              </button>
            );
          }
          
          return (
            <Link
              to={item.path}
              key={item.id}
              className={`menu-item ${isHovered ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="menu-item-content">
                <div className="icon-wrapper">
                  <Icon size={20} />
                </div>
                {!isCollapsed && <span className="label">{item.label}</span>}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <div className="sidebar-footer">
          <div className="footer-content">
            <div className="version">v2.1.0</div>
            <div className="copyright">© 2025 {userRole === 'jpmc' ? 'JPMC' : 'Go Rush'}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;