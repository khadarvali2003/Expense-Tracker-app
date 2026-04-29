import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useNotifications } from '../context/NotificationContext';
import {
  LayoutDashboard, ArrowLeftRight, PlusCircle, Tags, BarChart3,
  Target, Settings, Wallet, LogOut, Menu, X, Plus,
  CreditCard, Bell, RefreshCw, Sparkles, ChevronDown, Check
} from 'lucide-react';

const AppLayout = () => {
  const { user, logout } = useAuth();
  const { currency } = useData();
  const { notifications, markAsRead, clearAll, showToast } = useNotifications();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (user) {
      showToast(`Welcome back, ${user.displayName || 'User'}!`, 'success');
    }
  }, [user?.uid]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const mainNav = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
    { to: '/add', icon: PlusCircle, label: 'Add New' },
    { to: '/reports', icon: BarChart3, label: 'Reports' },
    { to: '/budget', icon: Target, label: 'Budget' },
  ];

  const advancedNav = [
    { to: '/categories', icon: Tags, label: 'Categories' },
    { to: '/wallets', icon: CreditCard, label: 'Wallets' },
    { to: '/recurring', icon: RefreshCw, label: 'Recurring' },
    { to: '/insights', icon: Sparkles, label: 'AI Insights' },
  ];

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon"><Wallet size={22} color="white" /></div>
          <h1>Expensy<span>Pro</span></h1>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-title">Main</div>
          {mainNav.map(item => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
              <item.icon size={18} /> {item.label}
            </NavLink>
          ))}

          <div className="sidebar-section-title">Advanced</div>
          {advancedNav.map(item => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
              <item.icon size={18} /> {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
            <Settings size={18} /> Settings
          </NavLink>
          <button className="nav-link" onClick={handleLogout} style={{ color: 'var(--danger)' }}>
            <LogOut size={18} /> Logout
          </button>
          <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <div style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>{user?.displayName || 'User'}</div>
            {user?.email}
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }} onClick={closeSidebar} />}

      {/* Main content area */}
      <div className="main-content">
        {/* Desktop Header */}
        <header className="desktop-header">
          <div className="breadcrumb">
            <span style={{ color: 'var(--text-muted)' }}>Pages</span>
            <span style={{ margin: '0 8px', color: 'var(--text-muted)' }}>/</span>
            <span style={{ fontWeight: 600 }}>{location.pathname.substring(1).charAt(0).toUpperCase() + location.pathname.substring(2) || 'Dashboard'}</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {/* Search */}
            <div className="search-bar" style={{ width: 240, height: 36, display: 'flex' }}>
              <Menu size={14} className="search-icon" />
              <input placeholder="Search..." style={{ fontSize: '0.8rem' }} />
            </div>

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button className="btn-icon" onClick={() => setNotifOpen(!notifOpen)}>
                <Bell size={20} />
                {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
              </button>

              {notifOpen && (
                <div className="glass dropdown notif-dropdown">
                  <div className="dropdown-header">
                    <span>Notifications</span>
                    <button onClick={clearAll}>Mark all as read</button>
                  </div>
                  <div className="dropdown-list">
                    {notifications.length > 0 ? notifications.map(n => (
                      <div key={n.id} className={`notif-item ${n.read ? 'read' : ''}`} onClick={() => markAsRead(n.id)}>
                        <div className="notif-icon">
                          <Bell size={14} />
                        </div>
                        <div className="notif-content">
                          <div className="notif-title">{n.title}</div>
                          <div className="notif-message">{n.message}</div>
                          <div className="notif-time">{n.time}</div>
                        </div>
                        {!n.read && <div className="notif-dot" />}
                      </div>
                    )) : (
                      <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No new notifications</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 20, border: '1px solid var(--border)' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'white' }}>
                {(user?.displayName || user?.email || 'U')[0].toUpperCase()}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.displayName || 'User'}</span>
            </div>
          </div>
        </header>

        {/* Mobile top bar */}
        <div style={{ display: 'none', padding: '12px 16px', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--bg-color)', zIndex: 50 }} className="mobile-topbar">
          <button className="btn-icon" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wallet size={14} color="white" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>Expensy<span style={{ color: 'var(--primary)' }}>Pro</span></span>
          </div>
          <button className="btn-icon" onClick={() => setNotifOpen(!notifOpen)}>
            <Bell size={20} />
            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
          </button>
        </div>

        <Outlet />
        
        {/* Desktop FAB */}
        <button className="fab" onClick={() => navigate('/add')} style={{ display: window.innerWidth > 768 ? 'flex' : 'none' }}>
          <Plus size={28} />
        </button>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="bottom-nav">
        <div className="bottom-nav-items">
          <NavLink to="/dashboard" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} /><span>Home</span>
          </NavLink>
          <NavLink to="/transactions" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
            <ArrowLeftRight size={20} /><span>History</span>
          </NavLink>
          <button className="bottom-nav-fab" onClick={() => navigate('/add')}>
            <Plus size={24} />
          </button>
          <NavLink to="/reports" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
            <BarChart3 size={20} /><span>Reports</span>
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
            <Settings size={20} /><span>Settings</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
