import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, AlertCircle, Link2 } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import useToast from '../hooks/useToast';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!formData.email || !formData.password) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      await login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });
      addToast('Welcome back!', 'success');
      navigate('/dashboard');
    } catch (err) {
      const backendMessage =
        err.response?.data?.message ||
        (err.response?.status === 401 ? 'Invalid email or password.' : 'Unable to connect. Please try again.');
      setErrorMsg(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2.5rem 1.25rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decoration */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 70% 50% at 50% 0%, color-mix(in srgb, var(--primary) 10%, transparent), transparent)',
          pointerEvents: 'none',
        }} />

        <div
          className="card animate-fade-in-scale"
          style={{ width: '100%', maxWidth: '420px', boxShadow: 'var(--shadow-xl)', position: 'relative', zIndex: 1 }}
        >
          {/* Brand logo */}
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div
              style={{
                display: 'inline-flex',
                padding: '0.625rem',
                background: 'linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 70%, #8b5cf6))',
                color: '#fff',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1rem',
                boxShadow: '0 4px 12px var(--primary-glow)',
              }}
            >
              <Link2 size={22} />
            </div>
            <h1 className="h2" style={{ marginBottom: '0.375rem' }}>Welcome back</h1>
            <p className="text-secondary text-sm">Sign in to manage your short links.</p>
          </div>

          {/* Error banner */}
          {errorMsg && (
            <div
              className="animate-fade-in"
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '0.625rem',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--danger-light)',
                color: 'var(--danger-text)',
                border: '1px solid color-mix(in srgb, var(--danger) 20%, transparent)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                marginBottom: '1.25rem',
              }}
            >
              <AlertCircle size={17} style={{ flexShrink: 0, marginTop: '0.05rem', color: 'var(--danger)' }} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="login-email" className="form-label">Email address</label>
              <input
                id="login-email"
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errorMsg ? 'error' : ''}`}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="login-password" className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${errorMsg ? 'error' : ''}`}
                  style={{ paddingRight: '2.75rem' }}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute', right: '0.75rem', top: '50%',
                    transform: 'translateY(-50%)', color: 'var(--text-muted)',
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', gap: '0.5rem', padding: '0.7rem 1.25rem' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                  Signing in…
                </span>
              ) : (
                <><LogIn size={17} /> Sign in</>
              )}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
            <p className="text-sm text-secondary">
              Don&apos;t have an account?{' '}
              <Link to="/register" style={{ fontWeight: 700, color: 'var(--primary)' }}>Create one</Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}