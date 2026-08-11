import { useState, useEffect, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Link2,
  Plus,
  BarChart3,
  Globe,
  Clock,
  Activity,
  ArrowRight,
  Copy,
  Check,
  ExternalLink,
  List,
  Trash2,
  Sparkles,
  Zap,
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import useToast from '../hooks/useToast';
import linkApi from '../services/linkApi';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Skeleton from '../components/ui/Skeleton';

export default function Dashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const { addToast } = useToast();

  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // Form state
  const [originalUrl, setOriginalUrl] = useState(() => location.state?.initialUrl || '');
  const [customAlias, setCustomAlias] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  // Created link banner
  const [createdLink, setCreatedLink] = useState(null);
  const [copiedCreated, setCopiedCreated] = useState(false);

  const refreshMetrics = useCallback(async () => {
    try {
      const dashRes = await linkApi.getDashboard().catch(() => null);
      if (dashRes?.data) setMetrics(dashRes.data);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    linkApi
      .getDashboard()
      .then((res) => {
        if (!isMounted) return;
        if (res?.data) setMetrics(res.data);
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  const handleCreateLink = async (e) => {
    e.preventDefault();
    if (!originalUrl.trim()) {
      addToast('Please enter a valid URL', 'warning');
      return;
    }
    setCreating(true);
    setCreatedLink(null);
    try {
      const payload = {
        originalUrl: originalUrl.trim(),
        alias: customAlias.trim() || undefined,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
      };
      const res = await linkApi.createLink(payload);
      addToast('Short link created successfully!', 'success');
      setOriginalUrl('');
      setCustomAlias('');
      setExpiresAt('');
      if (res?.data) setCreatedLink(res.data);
      refreshMetrics();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Unable to create short link. Check URL format or alias availability.';
      addToast(msg, 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleCopyCreated = () => {
    if (!createdLink) return;
    const url = createdLink.shortUrl || `${window.location.origin}/${createdLink.shortCode}`;
    navigator.clipboard.writeText(url);
    setCopiedCreated(true);
    addToast('Short link copied!', 'success');
    setTimeout(() => setCopiedCreated(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '2.5rem 1.25rem 4rem' }}>
        <div className="container">
          {/* Welcome Banner */}
          <div
            className="card animate-fade-in"
            style={{
              padding: '1.75rem',
              marginBottom: '2rem',
              background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-surface-hover) 100%)',
              border: '1px solid var(--border)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div aria-hidden style={{
              position: 'absolute', top: '-60%', right: '-5%',
              width: 280, height: 280, borderRadius: '50%',
              background: 'radial-gradient(circle, color-mix(in srgb, var(--primary) 14%, transparent), transparent 70%)',
              pointerEvents: 'none',
            }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div className="badge badge-primary" style={{ marginBottom: '0.625rem', gap: '0.35rem' }}>
                  <Sparkles size={12} /> Overview
                </div>
                <h1 className="h1" style={{ marginBottom: '0.375rem' }}>
                  Welcome back, {user?.name || 'User'}!
                </h1>
                <p className="text-secondary text-sm">
                  Create clean short links, track performance, and manage your URLs effortlessly.
                </p>
              </div>

              <Link to="/links" className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
                <List size={14} /> View All Links
              </Link>
            </div>
          </div>

          {/* Metrics Grid */}
          {loading ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.25rem',
                marginBottom: '2rem',
              }}
            >
              <Skeleton height="95px" />
              <Skeleton height="95px" />
              <Skeleton height="95px" />
              <Skeleton height="95px" />
            </div>
          ) : (
            metrics && (
              <div
                className="animate-fade-in"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1.25rem',
                  marginBottom: '2rem',
                }}
              >
                {/* Total Links */}
                <div className="card card-hover" style={{ padding: '1.25rem' }}>
                  <div className="text-xs text-muted" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.625rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ padding: '0.35rem', borderRadius: 'var(--radius-sm)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex' }}>
                      <Link2 size={14} />
                    </div>
                    Total Links
                  </div>
                  <div className="h1" style={{ fontSize: '2rem' }}>{metrics.totalLinks ?? 0}</div>
                </div>

                {/* Active Links */}
                <div className="card card-hover" style={{ padding: '1.25rem' }}>
                  <div className="text-xs text-muted" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.625rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ padding: '0.35rem', borderRadius: 'var(--radius-sm)', background: 'var(--success-light)', color: 'var(--success)', display: 'flex' }}>
                      <Activity size={14} />
                    </div>
                    Active Links
                  </div>
                  <div className="h1" style={{ fontSize: '2rem', color: 'var(--success)' }}>{metrics.activeLinks ?? 0}</div>
                </div>

                {/* Total Clicks */}
                <div
                  className="card card-hover"
                  style={{
                    padding: '1.25rem',
                    background: 'linear-gradient(135deg, color-mix(in srgb, var(--primary) 10%, transparent), var(--bg-surface))',
                    border: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)',
                  }}
                >
                  <div className="text-xs text-muted" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.625rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ padding: '0.35rem', borderRadius: 'var(--radius-sm)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex' }}>
                      <BarChart3 size={14} />
                    </div>
                    Total Clicks
                  </div>
                  <div className="h1" style={{ fontSize: '2rem', color: 'var(--primary)' }}>{metrics.totalClicks ?? 0}</div>
                </div>

                {/* Expired Links */}
                <div className="card card-hover" style={{ padding: '1.25rem' }}>
                  <div className="text-xs text-muted" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.625rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ padding: '0.35rem', borderRadius: 'var(--radius-sm)', background: 'var(--warning-light)', color: 'var(--warning)', display: 'flex' }}>
                      <Clock size={14} />
                    </div>
                    Expired Links
                  </div>
                  <div className="h1" style={{ fontSize: '2rem', color: 'var(--warning)' }}>{metrics.expiredLinks ?? 0}</div>
                </div>
              </div>
            )
          )}

          {/* Create Link Section */}
          <div
            className="card animate-fade-in"
            style={{
              marginBottom: '2rem',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  padding: '0.45rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 70%, #8b5cf6))',
                  color: '#fff',
                  display: 'flex',
                }}
              >
                <Zap size={16} />
              </div>
              <div>
                <h2 className="h3" style={{ margin: 0 }}>Create a Short Link</h2>
                <p className="text-xs text-muted">Paste your destination URL and optionally set a custom alias or expiry date.</p>
              </div>
            </div>

            <form onSubmit={handleCreateLink}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                {/* Destination URL */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="create-url" className="form-label">
                    Destination URL <span style={{ color: 'var(--danger)' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Globe
                      size={15}
                      style={{
                        position: 'absolute', left: '0.875rem', top: '50%',
                        transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none',
                      }}
                    />
                    <input
                      id="create-url"
                      type="url"
                      placeholder="https://example.com/very/long/destination/path"
                      value={originalUrl}
                      onChange={(e) => setOriginalUrl(e.target.value)}
                      className="form-input"
                      style={{ paddingLeft: '2.35rem' }}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  {/* Custom Alias */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="create-alias" className="form-label">
                      Custom Alias <span className="text-muted" style={{ fontWeight: 400 }}>(Optional)</span>
                    </label>
                    <input
                      id="create-alias"
                      type="text"
                      placeholder="e.g. custom-alias"
                      value={customAlias}
                      onChange={(e) => setCustomAlias(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  {/* Expires At */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="create-expires" className="form-label">
                      Expires At <span className="text-muted" style={{ fontWeight: 400 }}>(Optional)</span>
                    </label>
                    <input
                      id="create-expires"
                      type="datetime-local"
                      value={expiresAt}
                      onChange={(e) => setExpiresAt(e.target.value)}
                      className="form-input"
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  disabled={creating}
                  className="btn btn-primary"
                  style={{ gap: '0.5rem', minWidth: 140 }}
                >
                  {creating ? 'Shortening…' : <>Shorten Link <ArrowRight size={15} /></>}
                </button>
              </div>
            </form>

            {/* Success Created Link Banner */}
            {createdLink && (
              <div
                className="animate-fade-in"
                style={{
                  marginTop: '1.25rem',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, color-mix(in srgb, var(--primary) 12%, transparent), color-mix(in srgb, var(--primary) 5%, transparent))',
                  border: '1px solid color-mix(in srgb, var(--primary) 30%, transparent)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.875rem',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="text-xs text-muted" style={{ marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Check size={13} style={{ color: 'var(--success)' }} /> Link created successfully
                  </div>
                  <a
                    href={createdLink.shortUrl || `${window.location.origin}/${createdLink.shortCode}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontWeight: 700,
                      fontSize: '1rem',
                      color: 'var(--primary)',
                      wordBreak: 'break-all',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    {createdLink.shortUrl || `${window.location.origin}/${createdLink.shortCode}`}
                    <ExternalLink size={14} />
                  </a>
                </div>
                <button
                  onClick={handleCopyCreated}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '0.4rem', flexShrink: 0 }}
                >
                  {copiedCreated ? <Check size={14} style={{ color: 'var(--success)' }} /> : <Copy size={14} />}
                  {copiedCreated ? 'Copied!' : 'Copy'}
                </button>
              </div>
            )}
          </div>

          {/* Quick Navigation Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.25rem',
            }}
          >
            <Link to="/links" style={{ textDecoration: 'none' }}>
              <div
                className="card card-hover"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  transition: 'all var(--t-fast)',
                }}
              >
                <div
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                  }}
                >
                  <List size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>My Links</div>
                  <div className="text-xs text-muted">View & manage active links</div>
                </div>
                <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
              </div>
            </Link>

            <Link to="/links/deleted" style={{ textDecoration: 'none' }}>
              <div
                className="card card-hover"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  transition: 'all var(--t-fast)',
                }}
              >
                <div
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--danger-light)',
                    color: 'var(--danger)',
                    display: 'flex',
                  }}
                >
                  <Trash2 size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Deleted Links</div>
                  <div className="text-xs text-muted">Restore or permanently remove</div>
                </div>
                <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
              </div>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}