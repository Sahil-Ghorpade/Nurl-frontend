import { useState, useEffect, useCallback } from 'react';
import {
  Trash2,
  RotateCcw,
  Globe,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import useToast from '../hooks/useToast';
import linkApi from '../services/linkApi';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Modal from '../components/ui/Modal';
import Skeleton from '../components/ui/Skeleton';

export default function DeletedLinks() {
  const { addToast } = useToast();

  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hard delete modal
  const [hardDeleteTarget, setHardDeleteTarget] = useState(null);
  const [hardDeleting, setHardDeleting] = useState(false);

  // Restore modal
  const [restoreTarget, setRestoreTarget] = useState(null);
  const [restoreExpiresAt, setRestoreExpiresAt] = useState('');
  const [restoring, setRestoring] = useState(false);

  // Pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const PAGE_SIZE = 10;

  const fetchDeleted = useCallback(async (p = 0) => {
    setLoading(true);
    try {
      const res = await linkApi.getDeletedLinks(p, PAGE_SIZE);
      const content = res?.data?.content ?? res?.data ?? [];
      setLinks(Array.isArray(content) ? content : []);
      setTotalPages(res?.data?.totalPages ?? 0);
    } catch {
      addToast('Failed to load deleted links.', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchDeleted(page);
  }, [fetchDeleted, page]);

  // Open restore modal
  const handleOpenRestore = (link) => {
    setRestoreTarget(link);
    setRestoreExpiresAt('');
  };

  // Restore
  const confirmRestore = async () => {
    if (!restoreTarget) return;
    setRestoring(true);
    try {
      const payload = {};
      if (restoreExpiresAt) {
        payload.expiresAt = new Date(restoreExpiresAt).toISOString();
      }
      await linkApi.restoreLink(restoreTarget.id, payload);
      addToast('Link restored successfully!', 'success');
      setLinks((prev) => prev.filter((l) => l.id !== restoreTarget.id));
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to restore link.', 'error');
    } finally {
      setRestoring(false);
      setRestoreTarget(null);
      setRestoreExpiresAt('');
    }
  };

  // Hard delete
  const confirmHardDelete = async () => {
    if (!hardDeleteTarget) return;
    setHardDeleting(true);
    try {
      await linkApi.deleteLinkPermanently(hardDeleteTarget.id);
      addToast('Link permanently deleted.', 'info');
      setLinks((prev) => prev.filter((l) => l.id !== hardDeleteTarget.id));
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to permanently delete link.', 'error');
    } finally {
      setHardDeleting(false);
      setHardDeleteTarget(null);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    }).format(new Date(iso));
  };

  const checkIsExpired = (link) => {
    return Boolean(link.expiresAt && new Date(link.expiresAt) < new Date());
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '2rem 1.25rem 4rem' }}>
        <div className="container">
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h1 className="h1" style={{ marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Trash2 size={26} style={{ color: 'var(--danger)' }} /> Deleted Links
            </h1>
            <p className="text-secondary text-sm">
              Restore non-expired links to make them active again, or permanently delete them.
            </p>
          </div>

          {/* Table */}
          {loading ? (
            <div className="card">
              <Skeleton height="40px" style={{ marginBottom: '1rem' }} />
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} height="50px" style={{ marginBottom: '0.75rem' }} />
              ))}
            </div>
          ) : links.length === 0 ? (
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
              <h3 className="h3" style={{ marginBottom: '0.25rem' }}>No deleted links</h3>
              <p className="text-secondary text-sm">Links you delete will appear here for recovery.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Short Link</th>
                    <th>Original Destination</th>
                    <th>Deleted On</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {links.map((link) => {
                    const isExpired = checkIsExpired(link);
                    return (
                      <tr key={link.id} style={{ opacity: isExpired ? 0.65 : 0.9 }}>
                        {/* Short Code */}
                        <td>
                          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                            {link.shortCode || link.alias || '—'}
                          </span>
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

                        {/* Deleted At */}
                        <td className="text-muted text-xs">
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Clock size={12} /> {formatDate(link.deletedAt)}
                          </span>
                        </td>

                        {/* Status */}
                        <td>
                          {isExpired ? (
                            <span className="badge badge-danger">Expired</span>
                          ) : (
                            <span className="badge badge-neutral">Deleted</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                            {/* Restore */}
                            <button
                              onClick={() => handleOpenRestore(link)}
                              disabled={isExpired}
                              className="btn btn-secondary btn-sm"
                              style={{
                                gap: '0.35rem',
                                color: isExpired ? 'var(--text-muted)' : 'var(--success)',
                                cursor: isExpired ? 'not-allowed' : 'pointer',
                              }}
                              title={isExpired ? 'Expired links cannot be restored' : 'Restore link'}
                            >
                              <RotateCcw size={14} /> Restore
                            </button>

                            {/* Hard Delete */}
                            <button
                              onClick={() => setHardDeleteTarget(link)}
                              className="btn btn-danger btn-sm"
                              style={{ gap: '0.35rem' }}
                              title="Delete permanently"
                            >
                              <Trash2 size={14} /> Delete Forever
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

      {/* ── Restore Confirmation Modal ── */}
      <Modal
        isOpen={Boolean(restoreTarget)}
        onClose={() => { setRestoreTarget(null); setRestoreExpiresAt(''); }}
        title="Restore Link"
      >
        <p className="text-secondary text-sm" style={{ marginBottom: '1rem' }}>
          Restore <strong>{restoreTarget?.shortCode}</strong>? It will become active again.
        </p>

        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label className="form-label">New Expiration Date (Optional)</label>
          <input
            type="datetime-local"
            value={restoreExpiresAt}
            onChange={(e) => setRestoreExpiresAt(e.target.value)}
            className="form-input"
            min={new Date().toISOString().slice(0, 16)}
          />
          <span className="text-xs text-muted" style={{ marginTop: '0.25rem', display: 'block' }}>
            Set a new expiry date, or leave blank to restore without expiration.
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button onClick={() => { setRestoreTarget(null); setRestoreExpiresAt(''); }} className="btn btn-secondary btn-sm">
            Cancel
          </button>
          <button
            onClick={confirmRestore}
            disabled={restoring}
            className="btn btn-primary btn-sm"
            style={{ gap: '0.4rem' }}
          >
            <RotateCcw size={14} />
            {restoring ? 'Restoring...' : 'Restore Link'}
          </button>
        </div>
      </Modal>

      {/* ── Hard Delete Confirmation Modal ── */}
      <Modal
        isOpen={Boolean(hardDeleteTarget)}
        onClose={() => setHardDeleteTarget(null)}
        title="Delete Permanently?"
      >
        <div
          style={{
            display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
            padding: '0.875rem', borderRadius: 'var(--radius-md)',
            backgroundColor: 'color-mix(in srgb, var(--danger) 10%, transparent)',
            border: '1px solid color-mix(in srgb, var(--danger) 25%, transparent)',
            marginBottom: '1.25rem',
          }}
        >
          <AlertTriangle size={18} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: '0.1rem' }} />
          <p className="text-sm">
            <strong>{hardDeleteTarget?.shortCode}</strong> will be permanently removed.
            This action <strong>cannot be undone</strong>.
          </p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button onClick={() => setHardDeleteTarget(null)} className="btn btn-secondary btn-sm">
            Cancel
          </button>
          <button
            onClick={confirmHardDelete}
            disabled={hardDeleting}
            className="btn btn-danger btn-sm"
            style={{ gap: '0.4rem' }}
          >
            <Trash2 size={14} />
            {hardDeleting ? 'Deleting...' : 'Delete Forever'}
          </button>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}
