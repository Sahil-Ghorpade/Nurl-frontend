import { Link } from 'react-router-dom';
import { Link2 } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

export default function Footer() {
  const { isAuthenticated } = useAuth();

  const navLinks = isAuthenticated
    ? [
        { to: '/', label: 'Home' },
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/links', label: 'My Links' },
        { to: '/links/deleted', label: 'Deleted Links' },
      ]
    : [
        { to: '/', label: 'Home' },
        { to: '/login', label: 'Sign in' },
        { to: '/register', label: 'Get Started' },
      ];

  return (
    <footer
      style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border)',
        backgroundColor: 'var(--bg-surface)',
        padding: '2.5rem 0 1.75rem',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              padding: '0.35rem',
              background: 'linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 70%, #8b5cf6))',
              color: '#fff',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Link2 size={14} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em' }}>NURL</span>
        </div>

        {/* Links row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="text-xs text-muted"
              style={{ fontWeight: 500, textDecoration: 'none', transition: 'color var(--t-fast)' }}
              onMouseEnter={(e) => { e.target.style.color = 'var(--primary)'; }}
              onMouseLeave={(e) => { e.target.style.color = ''; }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Divider + copyright */}
        <div style={{ width: '100%', height: 1, background: 'var(--border)' }} />
        <p className="text-xs text-muted" style={{ textAlign: 'center' }}>
          © {new Date().getFullYear()} NURL — Clean, simple URL management. Built for speed, reliability, and security.
        </p>
      </div>
    </footer>
  );
}
