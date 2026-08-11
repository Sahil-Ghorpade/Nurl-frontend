import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, ShieldCheck, QrCode, BarChart3, Copy, Check, Link2, Clock, ExternalLink, Sparkles } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import useToast from '../hooks/useToast';
import linkApi from '../services/linkApi';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const FEATURES = [
  {
    icon: <Zap size={22} />,
    color: 'var(--primary)',
    bg: 'var(--primary-light)',
    title: 'Lightning Fast',
    desc: 'Sub-millisecond redirects powered by Spring Boot & PostgreSQL. Your links never keep visitors waiting.',
  },
  {
    icon: <ShieldCheck size={22} />,
    color: 'var(--success)',
    bg: 'var(--success-light)',
    title: 'Secure by Default',
    desc: 'HttpOnly cookie auth prevents XSS token leaks. Enterprise-grade security, zero configuration.',
  },
  {
    icon: <QrCode size={22} />,
    color: 'var(--warning)',
    bg: 'var(--warning-light)',
    title: 'Instant QR Codes',
    desc: 'Auto-generate downloadable QR codes for every short link. Perfect for print and offline use.',
  },
  {
    icon: <BarChart3 size={22} />,
    color: 'var(--primary)',
    bg: 'var(--bg-accent)',
    title: 'Real Analytics',
    desc: 'Track clicks, monitor active vs expired links, and get insights straight from your dashboard.',
  },
  {
    icon: <Clock size={22} />,
    color: 'var(--warning)',
    bg: 'var(--warning-light)',
    title: 'Link Expiry',
    desc: 'Set custom expiration dates on links. Guest links automatically expire in 24 hours.',
  },
  {
    icon: <Link2 size={22} />,
    color: 'var(--success)',
    bg: 'var(--success-light)',
    title: 'Custom Aliases',
    desc: 'Choose a memorable alias for any link. Make your short URLs as descriptive as you need.',
  },
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [inputUrl, setInputUrl] = useState('');
  const [shortening, setShortening] = useState(false);
  const [demoResult, setDemoResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleShorten = async (e) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    if (isAuthenticated) {
      navigate('/dashboard', { state: { initialUrl: inputUrl } });
      return;
    }

    setShortening(true);
    try {
      const res = await linkApi.createPublicLink(inputUrl);
      const created = res.data;
      setDemoResult(created.shortUrl || `${window.location.origin}/${created.shortCode}`);
      addToast('Short URL generated! Valid for 24 hours.', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to generate short link.', 'error');
    } finally {
      setShortening(false);
    }
  };

  const handleCopyDemo = () => {
    if (!demoResult) return;
    navigator.clipboard.writeText(demoResult);
    setCopied(true);
    addToast('Link copied!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <main style={{ flex: 1 }}>
        {/* ── Hero ── */}
        <section
          style={{
            padding: 'clamp(3rem, 8vw, 6rem) 1.25rem clamp(3rem, 6vw, 5rem)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative gradient blobs */}
          <div aria-hidden style={{
            position: 'absolute', inset: 0, zIndex: 0,
            background: 'radial-gradient(ellipse 80% 60% at 50% -10%, color-mix(in srgb, var(--primary) 14%, transparent), transparent)',
            pointerEvents: 'none',
          }} />

          <div className="container" style={{ maxWidth: '820px', position: 'relative', zIndex: 1 }}>
            {/* Pill badge */}
            <div
              className="badge badge-primary animate-fade-in"
              style={{ marginBottom: '1.5rem', gap: '0.4rem', padding: '0.35rem 0.9rem', fontSize: '0.75rem' }}
            >
              <Zap size={12} /> Modern URL Shortener
            </div>

            {/* Headline */}
            <h1
              className="animate-fade-in"
              style={{
                fontSize: 'clamp(2.25rem, 6vw, 3.75rem)',
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: '-0.04em',
                marginBottom: '1.25rem',
                animationDelay: '60ms',
              }}
            >
              Short links.{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 60%, #8b5cf6))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Simple sharing.
              </span>
            </h1>

            {/* Subheading */}
            <p
              className="text-secondary animate-fade-in"
              style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', marginBottom: '2.5rem', lineHeight: 1.7, animationDelay: '120ms' }}
            >
              Turn long, cluttered URLs into clean, memorable links in seconds.
              <br />No account required — guest links are active for 24 hours.
            </p>

            {/* CTA Buttons */}
            <div
              className="animate-fade-in"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.875rem', flexWrap: 'wrap', marginBottom: '3rem', animationDelay: '180ms' }}
            >
              <Link
                to={isAuthenticated ? '/dashboard' : '/register'}
                className="btn btn-primary btn-lg"
                style={{ gap: '0.5rem', minWidth: 180 }}
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Start for Free'}
                <ArrowRight size={18} />
              </Link>
              {!isAuthenticated && (
                <Link to="/login" className="btn btn-secondary btn-lg">
                  Sign in
                </Link>
              )}
            </div>

            {/* URL Shortener Card */}
            <div
              className="card animate-fade-in"
              style={{
                textAlign: 'left',
                boxShadow: 'var(--shadow-xl)',
                padding: '1.25rem',
                border: '1px solid var(--border)',
                animationDelay: '240ms',
              }}
            >
              <form
                onSubmit={handleShorten}
                style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}
              >
                <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)',
                      color: 'var(--text-muted)', pointerEvents: 'none',
                    }}
                  >
                    <Link2 size={15} />
                  </div>
                  <input
                    type="url"
                    placeholder="Paste a long URL to shorten…"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '2.25rem' }}
                    required
                  />
                </div>
                <button type="submit" disabled={shortening} className="btn btn-primary" style={{ minWidth: '130px', gap: '0.4rem' }}>
                  {shortening ? 'Generating…' : <>Shorten <ArrowRight size={15} /></>}
                </button>
              </form>

              {demoResult && (
                <div
                  className="animate-fade-in"
                  style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    backgroundColor: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="badge badge-warning" style={{ gap: '0.25rem' }}>
                        <Clock size={11} /> 1-Day Expiry (Guest Link)
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={handleCopyDemo} className="btn btn-secondary btn-sm" style={{ gap: '0.375rem' }}>
                        {copied ? <Check size={13} style={{ color: 'var(--success)' }} /> : <Copy size={13} />}
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                      <a href={demoResult} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm" style={{ gap: '0.35rem' }}>
                        Open Link <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '0.625rem 0.875rem',
                      backgroundColor: 'var(--bg-surface)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)',
                      fontFamily: 'monospace',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: 'var(--primary)',
                      wordBreak: 'break-all',
                    }}
                  >
                    {demoResult}
                  </div>

                  {!isAuthenticated && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <Sparkles size={12} style={{ color: 'var(--primary)' }} />
                      <span>Want permanent links, custom aliases & analytics? <Link to="/register" style={{ fontWeight: 600, color: 'var(--primary)' }}>Create a free account →</Link></span>
                    </div>
                  )}
                </div>
              )}

              <p className="text-xs text-muted" style={{ marginTop: '0.75rem', textAlign: 'center' }}>
                {isAuthenticated ? 'Link created! Manage it anytime in your dashboard.' : 'Guest links are instant and active for 24 hours. Sign in to save & track permanent links.'}
              </p>
            </div>
          </div>
        </section>

        {/* ── Feature Grid ── */}
        <section
          style={{
            padding: 'clamp(3rem, 6vw, 5rem) 1.25rem',
            background: 'linear-gradient(180deg, var(--bg-page) 0%, var(--bg-surface) 100%)',
            borderTop: '1px solid var(--border)',
          }}
        >
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div className="badge badge-neutral" style={{ marginBottom: '0.875rem' }}>Features</div>
              <h2 className="h2" style={{ marginBottom: '0.75rem' }}>
                Everything you need for link management
              </h2>
              <p className="text-secondary" style={{ maxWidth: '520px', margin: '0 auto', lineHeight: 1.6 }}>
                Engineered for speed, security, and developer-grade simplicity.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {FEATURES.map(({ icon, color, bg, title, desc }) => (
                <div
                  key={title}
                  className="card card-hover"
                  style={{ transition: 'all var(--t-normal)' }}
                >
                  <div
                    style={{
                      padding: '0.65rem',
                      backgroundColor: bg,
                      color: color,
                      borderRadius: 'var(--radius-md)',
                      width: 'fit-content',
                      marginBottom: '1rem',
                      border: `1px solid color-mix(in srgb, ${color} 20%, transparent)`,
                    }}
                  >
                    {icon}
                  </div>
                  <h3 className="h3" style={{ marginBottom: '0.5rem' }}>{title}</h3>
                  <p className="text-secondary text-sm" style={{ lineHeight: 1.65 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        {!isAuthenticated && (
          <section
            style={{
              padding: 'clamp(2.5rem, 5vw, 4rem) 1.25rem',
              textAlign: 'center',
              background: 'linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 70%, #8b5cf6))',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div aria-hidden style={{
              position: 'absolute', top: '-40%', right: '-10%',
              width: 400, height: 400, borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
              pointerEvents: 'none',
            }} />
            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
              <h2
                style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
                  fontWeight: 800,
                  color: '#fff',
                  marginBottom: '0.875rem',
                  letterSpacing: '-0.025em',
                }}
              >
                Ready to shorten your first link?
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2rem', fontSize: '1.05rem' }}>
                Free forever. No credit card required.
              </p>
              <Link
                to="/register"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 2rem',
                  backgroundColor: '#fff',
                  color: 'var(--primary)',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '1rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  transition: 'all var(--t-fast)',
                }}
              >
                Create Free Account <ArrowRight size={18} />
              </Link>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}