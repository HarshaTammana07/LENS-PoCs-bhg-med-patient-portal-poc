import React, { useState } from 'react';
import { 
  Settings, Shield, Key, Database, Save, Server, Activity,
  Copy, Calendar, Video, Archive, Users, Zap, Globe, Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';

// Standardized UI Component for Settings Rows
const SettingRow = ({ title, description, control, isLast, danger }) => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: '22px 24px', 
    borderBottom: isLast ? 'none' : '1px solid var(--border-light)',
    background: '#fff',
    transition: 'background 0.2s'
  }}>
    <div style={{ paddingRight: 40, flex: 1 }}>
      <div style={{ fontWeight: 800, fontSize: 14.5, color: danger ? 'var(--danger)' : 'var(--text-primary)', letterSpacing: '-0.2px' }}>
        {title}
      </div>
      <div style={{ fontSize: 13, color: danger ? 'rgba(239, 68, 68, 0.85)' : 'var(--text-muted)', marginTop: 5, lineHeight: 1.5, fontWeight: 500 }}>
        {description}
      </div>
    </div>
    <div style={{ flexShrink: 0 }}>
      {control}
    </div>
  </div>
);

// Basic Toggle Component
function Toggle({ on, onToggle }) {
  return (
    <div 
      onClick={onToggle} 
      style={{ 
        width: 44, 
        height: 24, 
        borderRadius: 12, 
        background: on ? 'var(--primary)' : 'var(--border)', 
        position: 'relative', 
        cursor: 'pointer', 
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: on ? '0 2px 8px rgba(10, 37, 64, 0.2)' : 'none'
      }}
    >
      <div style={{ 
        width: 18, 
        height: 18, 
        borderRadius: '50%', 
        background: '#fff', 
        position: 'absolute', 
        top: 3, 
        left: on ? 23 : 3, 
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }} />
    </div>
  );
}

export default function AdminSettings() {
  const { addToast, addAuditLog } = useApp();
  
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    mfaEnforced: true,
    sessionTimeout: '30',
    dataSync: true,
    emailAlerts: true,
    auditLogging: true,
    allowSelfSchedule: true,
    directMessaging: false,
    autoReleaseLabs: true,
    autoArchive: true,
    retentionPeriod: '7',
    telehealthProvider: 'zoom',
    waitingRoom: true
  });

  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      addToast('System governance policies propagated across hospital network.', 'success');
      addAuditLog('Save Admin Settings', 'admin', 'settings', 'Success', 'Updated system governance configuration');
    }, 1200);
  };

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const copyApiKey = () => {
    addToast('Production API Access Token copied to secure clipboard.', 'info');
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 60 }}>
      
      <header style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 28, fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)', letterSpacing: '-0.8px' }}>
            <Settings size={30} color="var(--primary)" /> System Configuration Center
          </h1>
          <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text-muted)', fontWeight: 500 }}>
            Active Root: <strong>Justin Coran</strong> (Platform Admin) • Governance & Data Retention Protocols
          </p>
        </div>
        <button className="btn btn-primary" style={{ padding: '10px 24px', boxShadow: '0 4px 12px rgba(10,37,64,0.15)' }} onClick={handleSave} disabled={saving}>
          {saving ? 'Propagating…' : <><Save size={16} /> Save Configuration</>}
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: 24 }}>
        
        {/* Security Policies */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ background: '#fcfcfd', padding: '18px 24px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Lock size={18} color="var(--primary)" />
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>Governance & Access</h3>
          </div>
          <SettingRow 
            title="Enforce Multi-Factor Auth (MFA)" 
            description="Require hardware or app-based MFA for all administrative and provider clearance levels."
            control={<Toggle on={settings.mfaEnforced} onToggle={() => toggleSetting('mfaEnforced')} />}
          />
          <SettingRow 
            title="Session Termination Delta" 
            description="Inactive duration in minutes before immediate administrative session revocation."
            control={
              <select className="input-field" value={settings.sessionTimeout} onChange={(e) => setSettings({...settings, sessionTimeout: e.target.value})} style={{ width: 130, height: 36, fontSize: 13, fontWeight: 600 }}>
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes</option>
                <option value="60">1 Hour</option>
              </select>
            }
          />
          <SettingRow 
            title="Continuous Audit Logging" 
            description="Real-time reporting of all PII/PHI read/write operations to the compliance ledger."
            isLast={true}
            control={<Toggle on={settings.auditLogging} onToggle={() => toggleSetting('auditLogging')} />}
          />
        </div>

        {/* Clinical Operations */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ background: '#fcfcfd', padding: '18px 24px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Activity size={18} color="var(--success)" />
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>Clinical Workflow Rules</h3>
          </div>
          <SettingRow 
            title="Automated Patient Scheduling" 
            description="Allow direct appointment provisioning via Patient Portal based on provider block rules."
            control={<Toggle on={settings.allowSelfSchedule} onToggle={() => toggleSetting('allowSelfSchedule')} />}
          />
          <SettingRow 
            title="Normal Result Auto-Release" 
            description="Bypass provider review for lab results falling within standard reference ranges."
            control={<Toggle on={settings.autoReleaseLabs} onToggle={() => toggleSetting('autoReleaseLabs')} />}
          />
          <SettingRow 
            title="Direct Clinical Messaging" 
            description="Enable asynchronous, encrypted communication between patients and active care teams."
            isLast={true}
            control={<Toggle on={settings.directMessaging} onToggle={() => toggleSetting('directMessaging')} />}
          />
        </div>

        {/* Infrastructure & Data */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ background: '#fcfcfd', padding: '18px 24px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Server size={18} color="var(--accent)" />
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>Infrastructure & Storage</h3>
          </div>
          <SettingRow 
            title="Hybrid Cloud Data Sync" 
            description="Synchronize local facility EMR data with centralized BHG clearinghouse."
            control={<Toggle on={settings.dataSync} onToggle={() => toggleSetting('dataSync')} />}
          />
          <SettingRow 
            title="Institutional Retention Policy" 
            description="Legal holding period for all clinical data before automated cold-storage migration."
            control={
              <select className="input-field" value={settings.retentionPeriod} onChange={(e) => setSettings({...settings, retentionPeriod: e.target.value})} style={{ width: 130, height: 36, fontSize: 13, fontWeight: 600 }}>
                <option value="5">5 Years (Min)</option>
                <option value="7">7 Years (Std)</option>
                <option value="10">10 Years (Max)</option>
              </select>
            }
          />
          <SettingRow 
            title="System Maintenance Mode" 
            description="Restrict all non-administrative ingress for scheduled infrastructure updates."
            danger={true}
            isLast={true}
            control={<Toggle on={settings.maintenanceMode} onToggle={() => toggleSetting('maintenanceMode')} />}
          />
        </div>

        {/* Network Ecosystem */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ background: '#fcfcfd', padding: '18px 24px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Globe size={18} color="#8b5cf6" />
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>Interoperability</h3>
          </div>
          <SettingRow 
            title="External Telehealth Gateway" 
            description="Primary third-party video engine for remote clinical consultations."
            control={
              <select className="input-field" value={settings.telehealthProvider} onChange={(e) => setSettings({...settings, telehealthProvider: e.target.value})} style={{ width: 130, height: 36, fontSize: 13, fontWeight: 600 }}>
                <option value="zoom">Zoom Health</option>
                <option value="teams">MS Teams</option>
                <option value="native">Native WebRTC</option>
              </select>
            }
          />
          <SettingRow 
            title="Virtual Waiting Reception" 
            description="Provision secure digital staging for patients prior to telehealth session start."
            control={<Toggle on={settings.waitingRoom} onToggle={() => toggleSetting('waitingRoom')} />}
          />
          <SettingRow 
            title="EMR Connectivity Status" 
            description="Connection health for institutional EMR interface (Epic/Cerner Gateway)."
            isLast={true}
            control={<span className="badge badge-success" style={{ padding: '6px 12px', fontSize: 11, fontWeight: 800 }}>OPERATIONAL</span>}
          />
        </div>

      </div>
    </div>
  );
}
