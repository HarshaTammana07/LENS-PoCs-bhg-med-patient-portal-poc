import React, { useState } from 'react';
import {
  Lock, Bell, Globe, Eye, Shield, Smartphone,
  Monitor, Key, AlertTriangle, CheckCircle, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

function Toggle({ on, onToggle }) {
  return <div className={`toggle-switch${on ? ' on' : ''}`} onClick={onToggle} />;
}

function Section({ icon: Icon, color, title, children }) {
  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div className="card-header" style={{ marginBottom: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={16} color={color} />
          </div>
          <div className="card-title">{title}</div>
        </div>
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}

export default function Settings() {
  const navigateRouter = useNavigate();
  const { addToast, logout, user } = useApp();
  const [notifications, setNotifications] = useState({
    email: true, sms: true, push: false, weekly: true, promo: false,
  });
  const [security, setSecurity] = useState({
    twoFactor: false, loginAlerts: true, sessionTimeout: '30',
  });

  const handleLogout = async () => {
    await logout();
    navigateRouter('/login');
  };
  const [privacy, setPrivacy] = useState({
    shareWithProviders: true, anonymousData: false, marketingData: false,
  });
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('light');

  const handleSave = () => addToast('Settings saved successfully.', 'success');
  const handlePasswordChange = () => addToast('Password reset email sent to patient@demo.com.', 'success');
  const handleEnable2FA = () => {
    setSecurity(prev => ({ ...prev, twoFactor: !prev.twoFactor }));
    addToast(!security.twoFactor ? 'Two-factor authentication enabled.' : 'Two-factor authentication disabled.', 'success');
  };

  const Row = ({ label, sub, children }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '14px 0', borderBottom: '1px solid var(--border-light)' }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Settings</h1>
          <p className="page-header-subtitle">Manage your portal account and preferences</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave}>
          <CheckCircle size={14} /> Save Changes
        </button>
      </div>

      {/* Notifications */}
      <Section icon={Bell} color="var(--primary)" title="Notification Settings">
        <Row label="Email Notifications" sub="Alerts sent to patient@demo.com">
          <Toggle on={notifications.email} onToggle={() => setNotifications(p => ({ ...p, email: !p.email }))} />
        </Row>
        <Row label="SMS Notifications" sub="Text alerts to +1 (613) 555-0192">
          <Toggle on={notifications.sms} onToggle={() => setNotifications(p => ({ ...p, sms: !p.sms }))} />
        </Row>
        <Row label="Push Notifications" sub="Browser and mobile app alerts">
          <Toggle on={notifications.push} onToggle={() => setNotifications(p => ({ ...p, push: !p.push }))} />
        </Row>
        <Row label="Weekly Summary" sub="Receive a weekly digest of your health activity">
          <Toggle on={notifications.weekly} onToggle={() => setNotifications(p => ({ ...p, weekly: !p.weekly }))} />
        </Row>
        <Row label="Promotional Communications" sub="News, tips, and health resources from BHG Med">
          <Toggle on={notifications.promo} onToggle={() => setNotifications(p => ({ ...p, promo: !p.promo }))} />
        </Row>
      </Section>

      {/* Security */}
      <Section icon={Shield} color="var(--success)" title="Security & Authentication">
        <Row label="Two-Factor Authentication" sub={security.twoFactor ? 'Enabled via SMS to +1 (613) 555-0192' : 'Highly recommended for account security'}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {security.twoFactor && <span className="badge badge-success">Enabled</span>}
            <button className={`btn btn-sm ${security.twoFactor ? 'btn-danger' : 'btn-primary'}`} onClick={handleEnable2FA}>
              {security.twoFactor ? 'Disable' : 'Enable 2FA'}
            </button>
          </div>
        </Row>
        <Row label="Login Activity Alerts" sub="Get notified of new device logins">
          <Toggle on={security.loginAlerts} onToggle={() => setSecurity(p => ({ ...p, loginAlerts: !p.loginAlerts }))} />
        </Row>
        <Row label="Session Timeout" sub="Automatically sign out after inactivity">
          <select
            className="select-field"
            value={security.sessionTimeout}
            onChange={e => setSecurity(p => ({ ...p, sessionTimeout: e.target.value }))}
            style={{ width: 140 }}
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="120">2 hours</option>
          </select>
        </Row>
        <Row label="Change Password" sub="Last changed: January 5, 2026">
          <button className="btn btn-secondary btn-sm" onClick={handlePasswordChange}>
            <Key size={13} /> Reset Password
          </button>
        </Row>
        <Row label="Active Sessions" sub="1 active session · Chrome · New York, NY">
          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => addToast('All other sessions have been terminated.', 'success')}>
            End Other Sessions
          </button>
        </Row>
      </Section>

      {/* Privacy */}
      <Section icon={Eye} color="var(--accent)" title="Privacy & Data">
        <Row label="Share Data with Care Providers" sub="Allow your providers to access your portal records">
          <Toggle on={privacy.shareWithProviders} onToggle={() => setPrivacy(p => ({ ...p, shareWithProviders: !p.shareWithProviders }))} />
        </Row>
        <Row label="Anonymous Usage Analytics" sub="Help improve BHG Med with anonymized usage data">
          <Toggle on={privacy.anonymousData} onToggle={() => setPrivacy(p => ({ ...p, anonymousData: !p.anonymousData }))} />
        </Row>
        <Row label="Marketing Data Usage" sub="Allow data to be used for personalized health campaigns">
          <Toggle on={privacy.marketingData} onToggle={() => setPrivacy(p => ({ ...p, marketingData: !p.marketingData }))} />
        </Row>
        <Row label="Download My Data" sub="Export all your health data in a portable format">
          <button className="btn btn-secondary btn-sm" onClick={() => addToast(`Data export request submitted. You'll receive an email within 24 hours.`, 'success')}>
            Request Export
          </button>
        </Row>
        <Row label="Delete Account" sub="Permanently remove your data from BHG Med">
          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => {
            if (window.confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) {
              addToast('Account deletion request submitted. You will receive a confirmation email.', 'warning');
            }
          }}>
            <AlertTriangle size={13} /> Delete Account
          </button>
        </Row>
      </Section>

      {/* Preferences */}
      <Section icon={Globe} color="var(--purple)" title="Language & Display">
        <Row label="Preferred Language" sub="Language used throughout the portal">
          <select className="select-field" value={language} onChange={e => setLanguage(e.target.value)} style={{ width: 160 }}>
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="es">Español</option>
            <option value="ar">العربية</option>
          </select>
        </Row>
        <Row label="Display Theme" sub="Portal appearance preference">
          <div style={{ display: 'flex', gap: 8 }}>
            {['light', 'dark', 'system'].map(t => (
              <button
                key={t}
                className={`btn btn-sm ${theme === t ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => { setTheme(t); if (t !== 'light') addToast('Theme preview coming soon.', 'info'); }}
                style={{ textTransform: 'capitalize' }}
              >
                {t === 'light' ? <Monitor size={12} /> : t === 'dark' ? <Smartphone size={12} /> : <Globe size={12} />}
                {t}
              </button>
            ))}
          </div>
        </Row>
      </Section>

      {/* Danger zone */}
      <div style={{ padding: '16px 20px', background: 'var(--danger-light)', borderRadius: 14, border: '1px solid rgba(232,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--danger)' }}>Sign Out</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 3 }}>
            You are signed in as {user?.name || 'Demo User'} · {user?.email || 'demo@demo.com'}
          </div>
        </div>
        <button className="btn btn-danger btn-sm" onClick={handleLogout}>
          <LogOut size={13} /> Sign Out
        </button>
      </div>
    </div>
  );
}
