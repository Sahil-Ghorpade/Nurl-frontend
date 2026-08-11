import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Home, Clock, AlertTriangle } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function LinkExpired() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const shortCode = searchParams.get('code');

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

          {/* Icon with pulse animation */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '6rem',
              height: '6rem',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, color-mix(in srgb, var(--warning) 20%, transparent), color-mix(in srgb, var(--warning) 8%, transparent))',
              border: '2px solid color-mix(in srgb, var(--warning) 30%, transparent)',
              marginBottom: '1.75rem',
              animation: 'pulse 2.5s ease-in-out infinite',
              position: 'relative',
            }}
          >
            <Clock size={36} style={{ color: 'var(--warning)' }} />
            <div
              style={{
                position: 'absolute',
                bottom: '-4px',
                right: '-4px',
                padding: '3px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-surface)',
                border: '2px solid var(--border)',
              }}
            >
              <AlertTriangle size={14} style={{ color: 'var(--warning)', display: 'block' }} />
            </div>
          </div>

          {/* Heading */}
          <h1 className="h2" style={{ marginBottom: '0.75rem' }}>
            This link has expired
          </h1>

          {/* Description */}
          <p className="text-secondary" style={{ marginBottom: '0.5rem', lineHeight: 1.6 }}>
            {shortCode ? (
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
                    color: 'var(--warning)',
                  }}
                >
                  /{shortCode}
                </code>{' '}
                was valid but its expiry date has passed.
              </>
            ) : (
              'This short link was valid but its expiry date has passed.'
            )}
          </p>

          <p className="text-sm text-muted" style={{ marginBottom: '2.5rem' }}>
            Contact the link creator to get an updated link, or create your own below.
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

          {/* Create your own hint */}
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
            <Clock size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <p className="text-xs text-muted" style={{ margin: 0 }}>
              Want to create short links with custom expiry?{' '}
              <a href="/" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                Try NURL for free →
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--warning) 30%, transparent); }
          50% { box-shadow: 0 0 0 12px color-mix(in srgb, var(--warning) 0%, transparent); }
        }
      `}</style>

      <Footer />
    </div>
  );
}
