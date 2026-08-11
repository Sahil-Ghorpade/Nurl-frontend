import { Link } from 'react-router-dom';
import { Link2, ExternalLink } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const GithubIcon = ({ size = 14, className = '', style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 14, className = '', style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const LeetCodeIcon = ({ size = 14, className = '', style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
  >
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.17 5.79a1.375 1.375 0 0 0-.001 1.946l.24.238a1.375 1.375 0 0 0 1.946 0l5.35-5.353a.56.56 0 0 1 .792 0l4.168 4.168a.56.56 0 0 1 0 .792l-9.52 9.52a1.376 1.376 0 0 1-1.947 0l-3.238-3.237a1.375 1.375 0 0 0-1.946 0l-.24.239a1.375 1.375 0 0 0 0 1.946l3.237 3.237a3.864 3.864 0 0 0 5.467 0l9.52-9.52a3.864 3.864 0 0 0 0-5.467L14.444.438A1.375 1.375 0 0 0 13.483 0zm-8.3 8.358a1.375 1.375 0 0 0-.974.403L.403 12.567a1.375 1.375 0 0 0 0 1.946l3.806 3.806a1.375 1.375 0 0 0 1.946 0l.24-.239a1.375 1.375 0 0 0 0-1.946l-3.08-3.08a.56.56 0 0 1 0-.792l3.806-3.806a1.375 1.375 0 0 0-.974-2.35 1.374 1.374 0 0 0-.024 0z" />
  </svg>
);

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

  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/Sahil-Ghorpade',
      icon: GithubIcon,
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/sahilghorpade/',
      icon: LinkedinIcon,
    },
    {
      name: 'LeetCode',
      url: 'https://leetcode.com/u/Nhdui1uvFI/',
      icon: LeetCodeIcon,
    },
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

        {/* Creator Info Card */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.625rem',
            padding: '0.875rem 1.25rem',
            borderRadius: 'var(--radius-lg, 12px)',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border)',
            width: '100%',
            maxWidth: '480px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Created by <span style={{ fontWeight: 700, color: 'var(--primary)' }}>Sahil Ghorpade</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {socialLinks.map(({ name, url, icon: Icon }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.3rem 0.65rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-secondary)',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--primary)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Icon size={13} />
                <span>{name}</span>
                <ExternalLink size={10} style={{ opacity: 0.6 }} />
              </a>
            ))}
          </div>
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
