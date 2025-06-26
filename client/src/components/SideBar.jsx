import React, { useState, useEffect } from 'react';
import { Menu, X, Home, Users, Package, ChevronRight, Activity, Settings, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/NavBar.css';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      path: '/dashboard',
      badge: null
    },
    {
      id: 'today',
      label: 'Today',
      icon: Home,
      path: '/today',
      badge: null
    },
    {
      id: 'customers',
      label: 'All Customers',
      icon: Users,
      path: '/customers',
    },
    {
      id: 'orders',
      label: 'All Orders',
      icon: Package,
      path: '/orders'
    },
    {
      id: 'collection',
      label: 'Collection Dates',
      icon: Package,
      path: '/collection'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: Activity,
      path: '/analytics',
      badge: null
    }
  ];

  const bottomMenuItems = [
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/settings'
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: LogOut,
      path: '/logout'
    }
  ];

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
              <span>JPMC Healthcare</span>
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
        {bottomMenuItems.map((item) => {
          const Icon = item.icon;
          const isHovered = hoveredItem === item.id;
          
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
            <div className="copyright">© 2025 JPMC</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;