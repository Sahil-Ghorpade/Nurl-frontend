import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Link2, Sun, Moon, Monitor, LogOut, Menu, X, User, LayoutDashboard, List, Trash2, ChevronDown } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useTheme from '../../hooks/useTheme';
import useToast from '../../hooks/useToast';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
        setThemeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    addToast('Logged out successfully', 'info');
    navigate('/login');
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun size={16} />;
    if (theme === 'dark') return <Moon size={16} />;
    return <Monitor size={16} />;
  };

  const navLinkStyle = (path) => ({
    fontWeight: 500,
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.35rem 0.6rem',
    borderRadius: 'var(--radius-sm)',
    color: isActive(path) ? 'var(--primary)' : 'var(--text-secondary)',
    backgroundColor: isActive(path) ? 'var(--primary-light)' : 'transparent',
    transition: 'all var(--t-fast)',
    textDecoration: 'none',
  });

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 990,
        backgroundColor: 'color-mix(in srgb, var(--bg-surface) 85%, transparent)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '3.75rem',
          gap: '1rem',
        }}
      >
        {/* Brand */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 800,
            fontSize: '1.2rem',
            color: 'var(--text-primary)',
            textDecoration: 'none',
            letterSpacing: '-0.02em',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              padding: '0.4rem',
              background: 'linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 70%, #8b5cf6))',
              color: '#ffffff',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px var(--primary-glow)',
            }}
          >
            <Link2 size={16} />
          </div>
          <span>NURL</span>
        </Link>

        {/* Desktop Nav */}
        <div
          style={{ display: 'none', alignItems: 'center', gap: '0.25rem', flex: 1, justifyContent: 'center' }}
          className="desktop-nav"
        >
          <Link to="/" style={navLinkStyle('/')}>Home</Link>
          {isAuthenticated && (
            <>
              <Link to="/dashboard" style={navLinkStyle('/dashboard')}>
                <LayoutDashboard size={14} /> Dashboard
              </Link>
              <Link to="/links" style={navLinkStyle('/links')}>
                <List size={14} /> My Links
              </Link>
              <Link to="/links/deleted" style={navLinkStyle('/links/deleted')}>
                <Trash2 size={14} /> Deleted
              </Link>
            </>
          )}
        </div>

        {/* Desktop Right Controls */}
        <div
          ref={dropdownRef}
          style={{ display: 'none', alignItems: 'center', gap: '0.5rem', position: 'relative', flexShrink: 0 }}
          className="desktop-controls"
        >
          {/* Theme toggle */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => { setThemeDropdownOpen(!themeDropdownOpen); setUserDropdownOpen(false); }}
              className="btn-icon"
              title="Switch theme"
              aria-label="Switch theme"
              style={{ fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.45rem 0.6rem', borderRadius: 'var(--radius-sm)' }}
            >
              {getThemeIcon()}
            </button>

            {themeDropdownOpen && (
              <div
                className="card animate-slide-down"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 0.5rem)',
                  right: 0,
                  minWidth: '140px',
                  padding: '0.375rem',
                  zIndex: 1000,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.125rem',
                  boxShadow: 'var(--shadow-lg)',
                }}
              >
                {[
                  { val: 'light', icon: <Sun size={14} />, label: 'Light' },
                  { val: 'dark',  icon: <Moon size={14} />, label: 'Dark' },
                  { val: 'system',icon: <Monitor size={14} />, label: 'System' },
                ].map(({ val, icon, label }) => (
                  <button
                    key={val}
                    onClick={() => { setTheme(val); setThemeDropdownOpen(false); }}
                    className="btn btn-ghost btn-sm"
                    style={{
                      justifyContent: 'flex-start',
                      gap: '0.5rem',
                      color: theme === val ? 'var(--primary)' : undefined,
                      backgroundColor: theme === val ? 'var(--primary-light)' : undefined,
                    }}
                  >
                    {icon} {label}
                    {theme === val && <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)', display: 'inline-block' }} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auth */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => { setUserDropdownOpen(!userDropdownOpen); setThemeDropdownOpen(false); }}
                className="btn btn-secondary btn-sm"
                style={{ gap: '0.4rem', paddingRight: '0.6rem' }}
              >
                <div
                  style={{
                    width: 24, height: 24,
                    borderRadius: 'var(--radius-full)',
                    background: 'linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 60%, #8b5cf6))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: '0.7rem', fontWeight: 700,
                  }}
                >
                  {(user?.name || 'U')[0].toUpperCase()}
                </div>
                <span style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name || 'Account'}
                </span>
                <ChevronDown size={13} style={{ opacity: 0.6 }} />
              </button>

              {userDropdownOpen && (
                <div
                  className="card animate-slide-down"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 0.5rem)',
                    right: 0,
                    minWidth: '210px',
                    padding: '0.5rem',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                    boxShadow: 'var(--shadow-lg)',
                  }}
                >
                  <div style={{
                    padding: '0.5rem 0.625rem 0.75rem',
                    borderBottom: '1px solid var(--border)',
                    marginBottom: '0.25rem',
                  }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{user?.name || 'User'}</div>
                    <div className="text-xs text-muted">{user?.email || ''}</div>
                  </div>
                  <button
                    onClick={() => { setUserDropdownOpen(false); handleLogout(); }}
                    className="btn btn-ghost btn-sm"
                    style={{ justifyContent: 'flex-start', color: 'var(--danger)', gap: '0.5rem' }}
                  >
                    <LogOut size={15} /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-ghost btn-sm">Sign in</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="mobile-only">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="btn-icon"
            aria-label="Toggle navigation menu"
            style={{ padding: '0.5rem' }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          style={{
            padding: '1rem 1.25rem 1.5rem',
            borderTop: '1px solid var(--border)',
            backgroundColor: 'var(--bg-surface)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
          }}
          className="mobile-only animate-slide-down"
        >
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem', marginBottom: '0.75rem' }}>
            {[
              { to: '/', label: 'Home', icon: null },
              ...(isAuthenticated ? [
                { to: '/dashboard',    label: 'Dashboard', icon: <LayoutDashboard size={15} /> },
                { to: '/links',        label: 'My Links',  icon: <List size={15} /> },
                { to: '/links/deleted',label: 'Deleted',   icon: <Trash2 size={15} /> },
              ] : [])
            ].map(({ to, label, icon }) => (
              <Link
                key={to}
                to={to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  color: isActive(to) ? 'var(--primary)' : 'var(--text-secondary)',
                  backgroundColor: isActive(to) ? 'var(--primary-light)' : 'transparent',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                }}
              >
                {icon} {label}
              </Link>
            ))}
          </nav>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {/* Theme row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="text-xs text-muted" style={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Theme</span>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {[
                  { val: 'light', icon: <Sun size={14} /> },
                  { val: 'dark',  icon: <Moon size={14} /> },
                  { val: 'system',icon: <Monitor size={14} /> },
                ].map(({ val, icon }) => (
                  <button
                    key={val}
                    onClick={() => setTheme(val)}
                    className={`btn btn-sm ${theme === val ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '0.3rem 0.5rem' }}
                    aria-label={val}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Auth row */}
            {isAuthenticated ? (
              <div style={{ paddingTop: '0.25rem' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.125rem' }}>{user?.name}</div>
                <div className="text-xs text-muted" style={{ marginBottom: '0.625rem' }}>{user?.email}</div>
                <button
                  onClick={() => { setMobileOpen(false); handleLogout(); }}
                  className="btn btn-danger btn-sm"
                  style={{ width: '100%', gap: '0.5rem' }}
                >
                  <LogOut size={15} /> Log out
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                  Sign in
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav      { display: flex !important; }
          .desktop-controls { display: flex !important; }
          .mobile-only      { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-nav      { display: none !important; }
          .desktop-controls { display: none !important; }
          .mobile-only      { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
