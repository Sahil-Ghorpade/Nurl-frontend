import { useNavigate, useLocation } from 'react-router-dom';
import { Link2, ArrowLeft, Home, Search } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();

  // Detect if this is a short-link 404 (single path segment like /abc123)
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const isShortLinkAttempt = pathSegments.length === 1;
  const attemptedCode = pathSegments[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem 1.25rem',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '520px', width: '100%' }}>

          {/* Animated 404 number */}
          <div
            style={{
              position: 'relative',
              display: 'inline-block',
              marginBottom: '2rem',
            }}
          >
            <div
              style={{
                fontSize: 'clamp(6rem, 20vw, 10rem)',
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: '-0.04em',
                background: 'linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 50%, var(--text-muted)))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                userSelect: 'none',
              }}
            >
              404
            </div>

            {/* Floating icon */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                padding: '0.875rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-surface)',
                border: '2px solid var(--border)',
                color: 'var(--text-muted)',
                boxShadow: 'var(--shadow-md)',
                animation: 'float 3s ease-in-out infinite',
              }}
            >
              <Link2 size={22} style={{ color: 'var(--primary)' }} />
            </div>
          </div>

          {/* Heading */}
          <h1 className="h2" style={{ marginBottom: '0.75rem' }}>
            {isShortLinkAttempt ? 'Link not found' : 'Page not found'}
          </h1>

          {/* Description */}
          <p className="text-secondary" style={{ marginBottom: '0.5rem', lineHeight: 1.6 }}>
            {isShortLinkAttempt ? (
              <>
                The short link{' '}
                <code
                  style={{
                    padding: '0.15rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border)',
                    fontFamily: 'monospace',
                    fontSize: '0.9em',
                    color: 'var(--primary)',
                  }}
                >
                  /{attemptedCode}
                </code>{' '}
                doesn&apos;t exist or may have expired.
              </>
            ) : (
              "The page you're looking for doesn't exist or has been moved."
            )}
          </p>

          <p className="text-sm text-muted" style={{ marginBottom: '2.5rem' }}>
            {isShortLinkAttempt
              ? 'Double-check the link or contact the person who shared it with you.'
              : 'Check the URL or use the links below to get back on track.'}
          </p>

          {/* CTA buttons */}
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={() => navigate(-1)}
              className="btn btn-secondary"
              style={{ gap: '0.5rem' }}
            >
              <ArrowLeft size={16} /> Go Back
            </button>
            <button
              onClick={() => navigate('/')}
              className="btn btn-primary"
              style={{ gap: '0.5rem' }}
            >
              <Home size={16} /> Home
            </button>
          </div>

          {/* Subtle hint for short link attempts */}
          {isShortLinkAttempt && (
            <div
              style={{
                marginTop: '2.5rem',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                textAlign: 'left',
              }}
            >
              <Search size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <p className="text-xs text-muted" style={{ margin: 0 }}>
                Want to shorten your own links?{' '}
                <a
                  href="/"
                  style={{ color: 'var(--primary)', fontWeight: 600 }}
                >
                  Create one for free →
                </a>
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Float animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(-50%, -50%) translateY(0); }
          50% { transform: translate(-50%, -50%) translateY(-8px); }
        }
      `}</style>

      <Footer />
    </div>
  );
}
