import React from 'react';
import { 
  Layers, Activity, Lock, Share2, Server, Database, Smartphone, 
  ShieldCheck, CheckCircle, Cloud, Scale, ArrowRight, XCircle
} from 'lucide-react';

function Block({ icon: Icon, title, desc, color = "var(--primary)", bg = "var(--primary-light)", isMain = false }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: isMain ? '32px 20px' : '24px 16px', background: isMain ? 'linear-gradient(135deg, #0c1b3a 0%, #0f2657 100%)' : 'var(--bg)', borderColor: isMain ? 'transparent' : 'var(--border)', color: isMain ? '#fff' : 'inherit' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: isMain ? 'rgba(255,255,255,0.1)' : bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={24} color={isMain ? '#fff' : color} />
        </div>
      </div>
      <div style={{ fontSize: isMain ? 18 : 14, fontWeight: 700, marginBottom: 6, color: isMain ? '#fff' : 'var(--text-primary)' }}>{title}</div>
      <div style={{ fontSize: 12.5, color: isMain ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)' }}>{desc}</div>
    </div>
  );
}

export default function PlatformView() {
  return (
    <div className="animate-fade-in" style={{ paddingBottom: 60 }}>
      {/* Header */}
      <div style={{ marginBottom: 32, maxWidth: 600 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 }}>
          <Layers size={13} /> Executive Briefing
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
          Platform Architecture & Strategy
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 8, lineHeight: 1.6 }}>
          Addressing BHG's core objectives: integrating with Azure-native infrastructure, unifying fragmented data without creating new silos, and evaluating the Build vs. Buy implications.
        </p>
      </div>

      {/* 1. Azure Architecture Mapping */}
      <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Cloud size={20} color="var(--primary)" /> 1. Azure-Native Integration Strategy
      </h2>
      <div className="grid grid-3" style={{ gap: 20, marginBottom: 40 }}>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Presentation Layer</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>POC: React 18 / Vite</div>
          <div style={{ padding: '8px 12px', background: 'rgba(26,109,212,0.1)', color: '#1a6dd4', borderRadius: 8, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            <ArrowRight size={14} /> Azure Static Web Apps
          </div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Identity & Access</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>POC: Supabase Auth (JWT)</div>
          <div style={{ padding: '8px 12px', background: 'rgba(26,109,212,0.1)', color: '#1a6dd4', borderRadius: 8, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            <ArrowRight size={14} /> Microsoft Entra ID
          </div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Data & Rules Engine</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>POC: PostgreSQL (RLS)</div>
          <div style={{ padding: '8px 12px', background: 'rgba(26,109,212,0.1)', color: '#1a6dd4', borderRadius: 8, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            <ArrowRight size={14} /> Azure DB for PostgreSQL
          </div>
        </div>
      </div>

      {/* 2. Anti-Silo Diagram (Using your awesome layout!) */}
      <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Layers size={20} color="var(--accent)" /> 2. The "Anti-Silo" Aggregation Layer
      </h2>
      <div style={{ background: '#f8fafc', borderRadius: 20, padding: 40, border: '1px solid var(--border-light)', marginBottom: 40 }}>
        
        {/* Layer 1: Experience */}
        <div style={{ maxWidth: 400, margin: '0 auto' }}>
          <Block 
            icon={Smartphone} 
            title="BHG Unified UI" 
            desc="A read-heavy, API-driven frontend. It owns the experience, but does not own the persistent data." 
            isMain={true} 
          />
        </div>

        {/* Connectors */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
          <div style={{ height: 40, width: 2, background: 'var(--primary)', opacity: 0.3 }}></div>
        </div>

        {/* Layer 2: Aggregation */}
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div className="card" style={{ padding: 20, textAlign: 'center', border: '2px dashed var(--primary)', background: 'transparent' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>
              <ShieldCheck size={18} /> API Gateway & Row Level Security
            </div>
            <p style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>Normalizes payloads on the fly and enforces zero-trust data isolation (RBAC) before reaching the UI.</p>
          </div>
        </div>

        {/* Connectors */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0', position: 'relative' }}>
          <div style={{ height: 40, width: 2, background: 'var(--border)', opacity: 0.8 }}></div>
          <div style={{ position: 'absolute', top: 20, height: 2, width: '70%', background: 'var(--border)', opacity: 0.8 }}></div>
          <div style={{ position: 'absolute', top: 20, left: '15%', height: 20, width: 2, background: 'var(--border)', opacity: 0.8 }}></div>
          <div style={{ position: 'absolute', top: 20, right: '15%', height: 20, width: 2, background: 'var(--border)', opacity: 0.8 }}></div>
        </div>

        {/* Layer 3: Fragmented Systems */}
        <div className="grid grid-3" style={{ gap: 20 }}>
          <Block 
            icon={Database} 
            title="Core EMR (e.g., Epic)" 
            desc="Clinical notes, legacy medical records, and demographic syncing."
            color="var(--success)" bg="var(--success-light)"
          />
          <Block 
            icon={Activity} 
            title="Diagnostic Networks" 
            desc="Lab results and imaging systems from provincial or external databases."
            color="var(--accent)" bg="var(--accent-light)"
          />
          <Block 
            icon={Share2} 
            title="Billing & Claims" 
            desc="Third-party revenue cycle engines and insurance clearinghouses."
            color="var(--warning)" bg="var(--warning-light)"
          />
        </div>
      </div>

      {/* 3. Build vs Buy */}
      <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Scale size={20} color="var(--warning)" /> 3. Build vs. Buy Scorecard
      </h2>
      <div className="grid grid-2" style={{ gap: 20 }}>
        {/* BUILD */}
        <div className="card">
          <div className="card-header" style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: 16 }}>
            <div className="card-title">The "Build" Case</div>
          </div>
          <div className="card-body">
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <li style={{ display: 'flex', gap: 10, fontSize: 13.5, color: 'var(--text-secondary)' }}>
                <CheckCircle size={16} color="var(--success)" style={{ flexShrink: 0, marginTop: 2 }} />
                <span><strong>Total UX Control:</strong> Combine disparate scheduling, clinical, and billing workflows into one seamless patient journey.</span>
              </li>
              <li style={{ display: 'flex', gap: 10, fontSize: 13.5, color: 'var(--text-secondary)' }}>
                <CheckCircle size={16} color="var(--success)" style={{ flexShrink: 0, marginTop: 2 }} />
                <span><strong>No Vendor Licensing:</strong> Utilize existing Azure consumption commitments rather than paying rigid per-patient software fees.</span>
              </li>
              <li style={{ display: 'flex', gap: 10, fontSize: 13.5, color: 'var(--text-secondary)' }}>
                <XCircle size={16} color="var(--danger)" style={{ flexShrink: 0, marginTop: 2 }} />
                <span><strong>Engineering Overhead:</strong> Requires a dedicated internal team to continuously manage integrations, security (RLS), and HIPAA compliance.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* BUY */}
        <div className="card" style={{ background: '#f8fafc' }}>
          <div className="card-header" style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: 16 }}>
            <div className="card-title">The "Buy" Case</div>
          </div>
          <div className="card-body">
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <li style={{ display: 'flex', gap: 10, fontSize: 13.5, color: 'var(--text-secondary)' }}>
                <CheckCircle size={16} color="var(--success)" style={{ flexShrink: 0, marginTop: 2 }} />
                <span><strong>Out-of-the-Box Compliance:</strong> Third-party vendor assumes the liability for HIPAA, HITRUST, and baseline security maintenance.</span>
              </li>
              <li style={{ display: 'flex', gap: 10, fontSize: 13.5, color: 'var(--text-secondary)' }}>
                <CheckCircle size={16} color="var(--success)" style={{ flexShrink: 0, marginTop: 2 }} />
                <span><strong>Immediate Deployment:</strong> Off-the-shelf integration with major EMR systems (Epic/Cerner) with minimal custom development.</span>
              </li>
              <li style={{ display: 'flex', gap: 10, fontSize: 13.5, color: 'var(--text-secondary)' }}>
                <XCircle size={16} color="var(--danger)" style={{ flexShrink: 0, marginTop: 2 }} />
                <span><strong>Data Silos & Rigidity:</strong> Forces patients into the vendor's walled garden, completely disrupting the unified "BHG" brand experience.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}