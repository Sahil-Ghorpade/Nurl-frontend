import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import useToast from '../hooks/useToast';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'transparent' };
    if (pass.length < 8) return { score: 1, label: 'Weak (min 8 chars)', color: 'var(--danger)' };
    const hasNum = /\d/.test(pass);
    const hasSpecial = /[^A-Za-z0-9]/.test(pass);
    if (hasNum && hasSpecial && pass.length >= 10) {
      return { score: 3, label: 'Strong', color: 'var(--success)' };
    }
    return { score: 2, label: 'Medium', color: 'var(--warning)' };
  };

  const strength = getPasswordStrength(formData.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (formData.name.trim().length < 2) {
      setErrorMsg('Name must be at least 2 characters.');
      return;
    }

    if (formData.password.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      addToast('Account created successfully! Please sign in.', 'success');
      navigate('/login');
    } catch (err) {
      const backendMessage =
        err.response?.data?.message ||
        (err.response?.status === 409
          ? 'An account with this email already exists.'
          : 'Unable to create account. Please check your inputs.');
      setErrorMsg(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 1.25rem' }}>
        <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '440px' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <h1 className="h2" style={{ marginBottom: '0.375rem' }}>
              Create your account
            </h1>
            <p className="text-secondary text-sm">Start shortening and tracking your links today.</p>
          </div>

          {errorMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--danger-light)',
                color: 'var(--danger-text)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                marginBottom: '1.25rem',
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="reg-name" className="form-label">
                Full Name
              </label>
              <input
                id="reg-name"
                type="text"
                name="name"
                placeholder="Jane Doe"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-email" className="form-label">
                Email address
              </label>
              <input
                id="reg-email"
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-password" className="form-label">
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  style={{ paddingRight: '2.5rem' }}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {formData.password && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '4px', height: '4px', marginBottom: '0.25rem' }}>
                    <div style={{ flex: 1, backgroundColor: strength.score >= 1 ? strength.color : 'var(--border)', borderRadius: '2px' }} />
                    <div style={{ flex: 1, backgroundColor: strength.score >= 2 ? strength.color : 'var(--border)', borderRadius: '2px' }} />
                    <div style={{ flex: 1, backgroundColor: strength.score >= 3 ? strength.color : 'var(--border)', borderRadius: '2px' }} />
                  </div>
                  <span className="text-xs text-muted">Password strength: {strength.label}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="reg-confirm" className="form-label">
                Confirm Password
              </label>
              <input
                id="reg-confirm"
                type="password"
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-input ${formData.confirmPassword && formData.confirmPassword !== formData.password ? 'error' : ''
                  }`}
                required
                autoComplete="new-password"
              />
              {formData.confirmPassword && formData.confirmPassword === formData.password && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--success)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  <CheckCircle2 size={14} /> Passwords match
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.75rem', gap: '0.5rem' }}
            >
              {loading ? (
                'Creating account...'
              ) : (
                <>
                  <UserPlus size={18} />
                  <span>Create account</span>
                </>
              )}
            </button>
          </form>

          <div
            style={{
              marginTop: '1.5rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border)',
              textAlign: 'center',
            }}
          >
            <p className="text-sm text-secondary">
              Already have an account?{' '}
              <Link to="/login" style={{ fontWeight: 600 }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}