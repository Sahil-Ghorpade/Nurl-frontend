import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Copy,
  Check,
  ExternalLink,
  Trash2,
  QrCode,
  Search,
  BarChart3,
  Globe,
  Clock,
  Pencil,
  Download,
  X,
  Plus,
  Link2,
} from 'lucide-react';
import useToast from '../hooks/useToast';
import linkApi from '../services/linkApi';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Modal from '../components/ui/Modal';
import Skeleton from '../components/ui/Skeleton';

export default function Links() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // QR modal
  const [qrModalLink, setQrModalLink] = useState(null);
  const [qrDownloading, setQrDownloading] = useState(false);

  // Edit modal
  const [editTarget, setEditTarget] = useState(null);
  const [editUrl, setEditUrl] = useState('');
  const [editExpiresAt, setEditExpiresAt] = useState('');
  const [updating, setUpdating] = useState(false);

  // Pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const PAGE_SIZE = 10;

  const fetchLinks = useCallback(async (p = 0) => {
    setLoading(true);
    try {
      const res = await linkApi.getLinks(p, PAGE_SIZE);
      const content = res?.data?.content ?? res?.data ?? [];
      setLinks(Array.isArray(content) ? content : []);
      setTotalPages(res?.data?.totalPages ?? 0);
    } catch {
      addToast('Failed to load links.', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchLinks(page);
  }, [fetchLinks, page]);

  // Copy
  const handleCopy = (link) => {
    const url = link.shortUrl || `${window.location.origin}/${link.shortCode}`;
    navigator.clipboard.writeText(url);
    setCopiedId(link.id);
    addToast('Link copied!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Soft delete
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await linkApi.deleteLink(deleteTarget.id);
      addToast('Link moved to Deleted.', 'info');
      setLinks((prev) => prev.filter((l) => l.id !== deleteTarget.id));
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete link.', 'error');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  // QR Download
  const handleDownloadQr = async (link) => {
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

  // Open edit modal
  const openEdit = (link) => {
    setEditTarget(link);
    setEditUrl(link.originalUrl || '');
    setEditExpiresAt(
      link.expiresAt ? new Date(link.expiresAt).toISOString().slice(0, 16) : ''
    );
  };

  // Submit edit
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editTarget) return;
    setUpdating(true);
    try {
      const payload = {
        originalUrl: editUrl.trim() || undefined,
        expiresAt: editExpiresAt ? new Date(editExpiresAt).toISOString() : null,
      };
      const res = await linkApi.updateLink(editTarget.id, payload);
      addToast('Link updated!', 'success');
      if (res?.data) {
        setLinks((prev) => prev.map((l) => (l.id === editTarget.id ? res.data : l)));
      } else {
        fetchLinks(page);
      }
      setEditTarget(null);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update link.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    }).format(new Date(iso));
  };

  const filteredLinks = links.filter((l) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      l.shortCode?.toLowerCase().includes(q) ||
      l.shortUrl?.toLowerCase().includes(q) ||
      l.originalUrl?.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '2.5rem 1.25rem 4rem' }}>
        <div className="container">
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            <div>
              <h1 className="h1" style={{ marginBottom: '0.25rem' }}>My Links</h1>
              <p className="text-secondary text-sm">Manage, edit, inspect analytics, and download QR codes for active short links.</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              {/* Search */}
              <div style={{ position: 'relative', minWidth: '220px' }}>
                <Search
                  size={15}
                  style={{
                    position: 'absolute', left: '0.75rem', top: '50%',
                    transform: 'translateY(-50%)', color: 'var(--text-muted)',
                  }}
                />
                <input
                  type="text"
                  placeholder="Search links…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input text-sm"
                  style={{ paddingLeft: '2.25rem' }}
                />
              </div>

              <button onClick={() => navigate('/dashboard')} className="btn btn-primary btn-sm" style={{ gap: '0.4rem' }}>
                <Plus size={15} /> Create Link
              </button>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="card">
              <Skeleton height="40px" style={{ marginBottom: '1rem' }} />
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} height="50px" style={{ marginBottom: '0.75rem' }} />
              ))}
            </div>
          ) : filteredLinks.length === 0 ? (
            <div
              className="card"
              style={{
                textAlign: 'center', padding: '4rem 1.5rem',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
              }}
            >
              <div
                style={{
                  padding: '1rem', borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)',
                }}
              >
                <Globe size={32} />
              </div>
              <h3 className="h3" style={{ marginBottom: '0.25rem' }}>
                {searchQuery ? 'No links matching search' : 'No active links yet'}
              </h3>
              <p className="text-secondary text-sm" style={{ maxWidth: '400px' }}>
                {searchQuery ? 'Try adjusting your search query.' : 'Create your first short URL from your dashboard to get started.'}
              </p>
              {!searchQuery && (
                <button onClick={() => navigate('/dashboard')} className="btn btn-primary btn-sm" style={{ gap: '0.4rem', marginTop: '0.5rem' }}>
                  <Plus size={15} /> Create First Link
                </button>
              )}
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Short Link</th>
                    <th>Destination URL</th>
                    <th>Created</th>
                    <th>Expires</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLinks.map((link) => {
                    const displayShortUrl = link.shortUrl || `${window.location.origin}/${link.shortCode}`;
                    const isExpired = link.expiresAt && new Date(link.expiresAt) < new Date();

                    return (
                      <tr key={link.id}>
                        {/* Short URL */}
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <a
                              href={displayShortUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'monospace' }}
                            >
                              /{link.shortCode || link.alias}
                            </a>
                          </div>
                        </td>

                        {/* Original URL */}
                        <td style={{ maxWidth: '280px' }}>
                          <span
                            className="text-secondary"
                            title={link.originalUrl}
                            style={{
                              display: 'block', overflow: 'hidden',
                              textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}
                          >
                            {link.originalUrl}
                          </span>
                        </td>

                        {/* Created */}
                        <td className="text-muted text-xs">{formatDate(link.createdAt)}</td>

                        {/* Expires */}
                        <td className="text-muted text-xs">
                          {link.expiresAt ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                              <Clock size={12} style={{ color: isExpired ? 'var(--danger)' : 'var(--warning)' }} />
                              {formatDate(link.expiresAt)}
                            </span>
                          ) : (
                            <span className="text-muted">Never</span>
                          )}
                        </td>

                        {/* Status */}
                        <td>
                          {isExpired ? (
                            <span className="badge badge-warning">Expired</span>
                          ) : (
                            <span className="badge badge-success">Active</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            {/* Copy */}
                            <button onClick={() => handleCopy(link)} className="btn btn-secondary btn-sm" title="Copy short link" style={{ padding: '0.35rem 0.5rem' }}>
                              {copiedId === link.id
                                ? <Check size={14} style={{ color: 'var(--success)' }} />
                                : <Copy size={14} />}
                            </button>

                            {/* Open */}
                            <a
                              href={displayShortUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-secondary btn-sm"
                              title="Test link"
                              style={{ padding: '0.35rem 0.5rem' }}
                            >
                              <ExternalLink size={14} />
                            </a>

                            {/* QR */}
                            <button onClick={() => setQrModalLink(link)} className="btn btn-secondary btn-sm" title="QR Code" style={{ padding: '0.35rem 0.5rem' }}>
                              <QrCode size={14} />
                            </button>

                            {/* Analytics */}
                            <button
                              onClick={() => navigate(`/links/${link.id}/analytics`)}
                              className="btn btn-secondary btn-sm"
                              title="View Analytics"
                              style={{ padding: '0.35rem 0.5rem' }}
                            >
                              <BarChart3 size={14} />
                            </button>

                            {/* Edit */}
                            <button onClick={() => openEdit(link)} className="btn btn-secondary btn-sm" title="Edit link" style={{ padding: '0.35rem 0.5rem' }}>
                              <Pencil size={14} />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => setDeleteTarget(link)}
                              className="btn btn-ghost btn-sm"
                              style={{ color: 'var(--danger)', padding: '0.35rem 0.5rem' }}
                              title="Delete link"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
              <button
                className="btn btn-secondary btn-sm"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                ← Prev
              </button>
              <span className="text-sm text-muted" style={{ alignSelf: 'center' }}>
                Page {page + 1} of {totalPages}
              </span>
              <button
                className="btn btn-secondary btn-sm"
                disabled={page + 1 >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </main>

      {/* ── Delete Modal ── */}
      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Move to Deleted?"
      >
        <p className="text-secondary text-sm" style={{ marginBottom: '1.5rem' }}>
          The link <strong>/{deleteTarget?.shortCode}</strong> will be moved to Deleted Links.
          You can restore it anytime later.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button onClick={() => setDeleteTarget(null)} className="btn btn-secondary btn-sm">
            Cancel
          </button>
          <button onClick={confirmDelete} disabled={deleting} className="btn btn-danger btn-sm">
            {deleting ? 'Deleting...' : 'Move to Deleted'}
          </button>
        </div>
      </Modal>

      {/* ── QR Modal ── */}
      <Modal
        isOpen={Boolean(qrModalLink)}
        onClose={() => setQrModalLink(null)}
        title="Link QR Code"
      >
        {qrModalLink && (
          <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
            <div
              style={{
                display: 'inline-block', padding: '1rem',
                backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)', marginBottom: '1rem',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <img
                src={linkApi.getQrCodeUrl(qrModalLink.id)}
                alt={`QR code for ${qrModalLink.shortCode}`}
                style={{ width: '200px', height: '200px', display: 'block' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
                }}
              />
              <div style={{ display: 'none', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Failed to load QR code
              </div>
            </div>

            <p className="text-xs text-muted" style={{ marginBottom: '1.25rem' }}>
              Scan to open: {qrModalLink.shortUrl || `${window.location.origin}/${qrModalLink.shortCode}`}
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={() => handleDownloadQr(qrModalLink)}
                disabled={qrDownloading}
                className="btn btn-primary btn-sm"
                style={{ gap: '0.4rem' }}
              >
                <Download size={14} />
                {qrDownloading ? 'Downloading...' : 'Download QR'}
              </button>
              <button
                onClick={() => setQrModalLink(null)}
                className="btn btn-secondary btn-sm"
              >
                <X size={14} /> Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Edit Modal ── */}
      <Modal
        isOpen={Boolean(editTarget)}
        onClose={() => setEditTarget(null)}
        title="Edit Link"
      >
        {editTarget && (
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label htmlFor="edit-url" className="form-label">Destination URL</label>
              <input
                id="edit-url"
                type="url"
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                className="form-input"
                placeholder="https://example.com/..."
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="edit-expires" className="form-label">
                Expires At <span className="text-muted" style={{ fontWeight: 400 }}>(Optional)</span>
              </label>
              <input
                id="edit-expires"
                type="datetime-local"
                value={editExpiresAt}
                onChange={(e) => setEditExpiresAt(e.target.value)}
                className="form-input"
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setEditTarget(null)}
                className="btn btn-secondary btn-sm"
              >
                Cancel
              </button>
              <button type="submit" disabled={updating} className="btn btn-primary btn-sm">
                {updating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      <Footer />
    </div>
  );
}
