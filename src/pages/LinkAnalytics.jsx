import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  ExternalLink,
  Copy,
  Check,
  QrCode,
  Download,
  Calendar,
  MousePointerClick,
  Globe,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import useToast from '../hooks/useToast';
import linkApi from '../services/linkApi';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Skeleton from '../components/ui/Skeleton';

export default function LinkAnalytics() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [copied, setCopied] = useState(false);
  const [qrDownloading, setQrDownloading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    linkApi
      .getLink(id)
      .then((res) => {
        if (!isMounted) return;
        setLink(res?.data || null);
      })
      .catch((err) => {
        if (!isMounted) return;
        if (err.response?.status === 404) {
          navigate(`/link/${id}`, { replace: true });
        } else {
          setError('Failed to load link analytics.');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, [id, navigate]);

  const handleCopy = () => {
    if (!link) return;
    const url = link.shortUrl || `${window.location.origin}/${link.shortCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    addToast('Short link copied!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = async () => {
    if (!link) return;
    setQrDownloading(true);
    try {
      const qrUrl = linkApi.getQrCodeUrl(link.id);
      const resp = await fetch(qrUrl);
      const blob = await resp.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = `qr-${link.shortCode || link.id}.png`;
      a.click();
      URL.revokeObjectURL(objectUrl);
    } catch {
      addToast('Failed to download QR code.', 'error');
    } finally {
      setQrDownloading(false);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }).format(new Date(iso));
  };

  const getTimeRemaining = (iso) => {
    if (!iso) return null;
    const diff = new Date(iso).getTime() - new Date().getTime();
    if (diff <= 0) return 'Expired';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} left`;
    const mins = Math.floor(diff / (1000 * 60));
    return `${mins} min${mins > 1 ? 's' : ''} left`;
  };

  const isExpired = link?.expiresAt && new Date(link.expiresAt) < new Date();
  const displayShortUrl = link
    ? link.shortUrl || `${window.location.origin}/${link.shortCode}`
    : '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '2.5rem 1.25rem 4rem' }}>
        <div className="container" style={{ maxWidth: '840px' }}>
          {/* Back button */}
          <button
            onClick={() => navigate('/links')}
            className="btn btn-ghost btn-sm"
            style={{ gap: '0.4rem', marginBottom: '1.5rem', paddingLeft: 0 }}
          >
            <ArrowLeft size={16} /> Back to My Links
          </button>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="card">
                <Skeleton height="36px" style={{ marginBottom: '1rem', width: '35%' }} />
                <Skeleton height="20px" style={{ marginBottom: '0.75rem', width: '60%' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <Skeleton height="110px" />
                <Skeleton height="110px" />
                <Skeleton height="110px" />
              </div>
            </div>
          ) : error ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p className="text-secondary" style={{ marginBottom: '1rem' }}>{error}</p>
              <button onClick={() => navigate('/links')} className="btn btn-secondary btn-sm">
                Return to links
              </button>
            </div>
          ) : link && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Header Hero Card */}
              <div
                className="card"
                style={{
                  padding: '1.75rem',
                  background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-surface-hover) 100%)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-md)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div aria-hidden style={{
                  position: 'absolute', top: '-50%', right: '-10%',
                  width: 250, height: 250, borderRadius: '50%',
                  background: 'radial-gradient(circle, color-mix(in srgb, var(--primary) 12%, transparent), transparent 70%)',
                  pointerEvents: 'none',
                }} />

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
                      <span className="badge badge-primary" style={{ gap: '0.3rem' }}>
                        <Sparkles size={11} /> Link Performance
                      </span>
                      {isExpired ? (
                        <span className="badge badge-danger">Expired</span>
                      ) : (
                        <span className="badge badge-success">Active</span>
                      )}
                    </div>
                    <h1 className="h1" style={{ margin: 0, fontSize: '1.75rem' }}>
                      /{link.shortCode || link.alias}
                    </h1>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                    <button
                      onClick={handleCopy}
                      className="btn btn-secondary btn-sm"
                      style={{ gap: '0.4rem' }}
                    >
                      {copied ? <Check size={14} style={{ color: 'var(--success)' }} /> : <Copy size={14} />}
                      {copied ? 'Copied' : 'Copy Link'}
                    </button>
                    <a
                      href={displayShortUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary btn-sm"
                      style={{ gap: '0.4rem' }}
                    >
                      <ExternalLink size={14} /> Test Short Link
                    </a>
                  </div>
                </div>

                {/* Short URL Banner */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border)',
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    color: 'var(--primary)',
                    fontWeight: 600,
                  }}
                >
                  <span>{displayShortUrl}</span>
                  <span className="text-xs text-muted" style={{ fontWeight: 400, fontFamily: 'var(--font-sans)' }}>
                    Short URL
                  </span>
                </div>
              </div>

              {/* Stat Metric Cards (NO ID SHOWING!) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                {/* Total Clicks */}
                <div
                  className="card card-hover"
                  style={{
                    padding: '1.5rem',
                    background: 'linear-gradient(135deg, color-mix(in srgb, var(--primary) 12%, transparent), var(--bg-surface))',
                    border: '1px solid color-mix(in srgb, var(--primary) 25%, transparent)',
                  }}
                >
                  <div className="text-xs text-muted" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MousePointerClick size={15} style={{ color: 'var(--primary)' }} /> Total Clicks
                  </div>
                  <div className="h1" style={{ fontSize: '2.5rem', color: 'var(--primary)', lineHeight: 1 }}>
                    {link.clickCount ?? link.clicks ?? 0}
                  </div>
                  <p className="text-xs text-muted" style={{ marginTop: '0.5rem' }}>
                    All-time total redirects
                  </p>
                </div>

                {/* Expiry Status */}
                <div className="card card-hover" style={{ padding: '1.5rem' }}>
                  <div className="text-xs text-muted" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clock size={15} style={{ color: isExpired ? 'var(--danger)' : 'var(--warning)' }} /> Expiration
                  </div>
                  <div
                    className="h2"
                    style={{ fontSize: '1.35rem', color: isExpired ? 'var(--danger)' : 'var(--text-primary)' }}
                  >
                    {link.expiresAt ? getTimeRemaining(link.expiresAt) : 'Never Expires'}
                  </div>
                  <p className="text-xs text-muted" style={{ marginTop: '0.5rem' }}>
                    {link.expiresAt ? formatDate(link.expiresAt) : 'Permanent link'}
                  </p>
                </div>

                {/* Created Date */}
                <div className="card card-hover" style={{ padding: '1.5rem' }}>
                  <div className="text-xs text-muted" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={15} style={{ color: 'var(--success)' }} /> Created On
                  </div>
                  <div className="h2" style={{ fontSize: '1.25rem' }}>
                    {formatDate(link.createdAt)}
                  </div>
                  <p className="text-xs text-muted" style={{ marginTop: '0.5rem' }}>
                    Registration date
                  </p>
                </div>
              </div>

              {/* Destination URL & QR Code Side-by-Side */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                {/* Destination URL Card */}
                <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div className="text-xs text-muted" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Globe size={15} style={{ color: 'var(--primary)' }} /> Destination URL
                    </div>
                    <p
                      style={{
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        wordBreak: 'break-all',
                        color: 'var(--text-primary)',
                        lineHeight: 1.6,
                        marginBottom: '1rem',
                        padding: '0.875rem',
                        backgroundColor: 'var(--bg-subtle)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      {link.originalUrl}
                    </p>
                  </div>
                  <a
                    href={link.originalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ width: 'fit-content', gap: '0.4rem' }}
                  >
                    Visit Destination <ExternalLink size={14} />
                  </a>
                </div>

                {/* Inline QR Code Card */}
                <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                  <div className="text-xs text-muted" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                    <QrCode size={15} style={{ color: 'var(--primary)' }} /> Instant QR Code
                  </div>

                  <div
                    style={{
                      display: 'inline-block',
                      padding: '0.75rem',
                      backgroundColor: '#ffffff',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      marginBottom: '1rem',
                      boxShadow: 'var(--shadow-xs)',
                    }}
                  >
                    <img
                      src={linkApi.getQrCodeUrl(link.id)}
                      alt={`QR code for ${link.shortCode}`}
                      style={{ width: '150px', height: '150px', display: 'block' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div style={{ display: 'none', color: 'var(--text-muted)', fontSize: '0.8125rem', padding: '1rem' }}>
                      <AlertTriangle size={20} style={{ color: 'var(--warning)', margin: '0 auto 0.5rem' }} />
                      Failed to load QR code
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <button
                      onClick={handleDownloadQr}
                      disabled={qrDownloading}
                      className="btn btn-primary btn-sm"
                      style={{ gap: '0.4rem' }}
                    >
                      <Download size={14} />
                      {qrDownloading ? 'Downloading...' : 'Download QR'}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
