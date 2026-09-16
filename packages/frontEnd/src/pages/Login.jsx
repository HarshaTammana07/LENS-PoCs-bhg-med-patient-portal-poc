import React, { useState } from 'react';
import { ArrowRight, Building2, ClipboardCheck, Eye, EyeOff, HeartHandshake, LockKeyhole, ShieldCheck } from 'lucide-react';
import { BhgLogo } from '../components/brand/BhgLogo';

export default function Login({ onLogin }) {
  const [role, setRole] = useState('patient');
  const [email, setEmail] = useState('patient@demo.com');
  const [password, setPassword] = useState('Password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onLogin(email, password, role);
    } catch (err) {
      setError(err.message || 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  const selectRole = (nextRole) => {
    setRole(nextRole);
    setEmail(nextRole === 'admin' ? 'admin@demo.com' : 'patient@demo.com');
    setPassword('Password123');
    setError('');
  };

  return (
    <div className="bhg-login">
      <section className="bhg-login-story">
        <div className="bhg-login-logo">
          <BhgLogo size="sidebar" alt="Behavioral Health Group" />
        </div>
        <div className="bhg-login-message">
          <span className="bhg-login-kicker">{role === 'admin' ? 'Connected care. Clear follow-up. One clinical view.' : 'Your care. Your progress. Your privacy.'}</span>
          <h1>{role === 'admin' ? 'Coordinate each patient’s next step with clarity.' : 'Support for every step of your recovery.'}</h1>
          <p>
            {role === 'admin'
              ? 'Manage caseload, appointments, outcomes, recovery goals, patient requests, and care coordination in one secure view.'
              : 'View your medication schedule, counseling appointments, care team and coverage information in one secure place.'}
          </p>
          <div className="bhg-login-points">
            {role === 'admin' ? (
              <>
                <div><Building2 size={20} /><span><strong>See your caseload</strong> and prioritized follow-up.</span></div>
                <div><ClipboardCheck size={20} /><span><strong>Coordinate appointments</strong>, outcomes, and recovery goals.</span></div>
                <div><ShieldCheck size={20} /><span><strong>Protect treatment information</strong> through role-based access.</span></div>
              </>
            ) : (
              <>
                <div><HeartHandshake size={20} /><span><strong>Stay connected</strong> with your counselor and treatment center.</span></div>
                <div><ShieldCheck size={20} /><span><strong>Know what’s next</strong> in your personal care plan.</span></div>
                <div><LockKeyhole size={20} /><span><strong>Your information is private</strong> and protected.</span></div>
              </>
            )}
          </div>
        </div>
        <div className="bhg-login-help">
          Need help accessing your account? Call your BHG treatment center.
        </div>
      </section>

      <main className="bhg-login-panel">
        <form className="bhg-login-form" onSubmit={submit}>
          <div className="bhg-login-mobile-logo">
            <BhgLogo size="sidebar" alt="Behavioral Health Group" />
          </div>
          <span className="bhg-eyebrow">BHG Secure Portal</span>
          <h2>Welcome back</h2>
          <p>Choose your portal and sign in with the demonstration account.</p>

          <div className="bhg-login-role" aria-label="Portal type">
            <button type="button" className={role === 'patient' ? 'active' : ''} onClick={() => selectRole('patient')}>
              Patient portal
            </button>
            <button type="button" className={role === 'admin' ? 'active' : ''} onClick={() => selectRole('admin')}>
              Clinician portal
            </button>
          </div>

          {error && <div className="bhg-login-error" role="alert">{error}</div>}

          <label>
            Email address
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" required />
          </label>
          <label>
            Password
            <span className="bhg-password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
              <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </span>
          </label>
          <button className="bhg-login-submit" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : <>Sign in <ArrowRight size={17} /></>}
          </button>
          <button className="bhg-forgot-button" type="button">Forgot your password?</button>

          <div className="bhg-demo-note">
            <strong>{role === 'admin' ? 'Clinician demo account' : 'Patient demo account'}</strong>
            <span>{role === 'admin' ? 'admin@demo.com' : 'patient@demo.com'}</span>
            <span>Password123</span>
          </div>
          <small className="bhg-login-privacy">
            This demonstration uses fictional patient information and does not provide medical advice.
          </small>
        </form>
      </main>
    </div>
  );
}
