import React, { useState } from 'react';
import { MessageSquare, Phone, X, CheckCircle, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';

const TEAM = [
  {
    id: 'marie',
    initials: 'ML',
    name: 'Marie Laurent',
    role: 'Care Concierge',
    tagline: 'Your primary point of contact',
    description:
      'Your dedicated point of contact for scheduling, logistics, billing, and general support. Marie is available Monday to Friday, 8 AM to 6 PM.',
    canMessage: true,
    canCallback: true,
    canProfile: false,
  },
  {
    id: 'chen',
    initials: 'JC',
    name: 'Dr. James Chen',
    role: 'Surgeon',
    tagline: 'General Surgery',
    description:
      'Performing your Laparoscopic Cholecystectomy on June 25, 2026. Dr. Chen is a board-certified general surgeon with 15 years of experience in minimally invasive procedures at Ottawa ASC.',
    canMessage: false,
    canCallback: false,
    canProfile: true,
  },
  {
    id: 'lisa',
    initials: 'LP',
    name: 'Lisa Park, RN',
    role: 'Nurse Navigator',
    tagline: 'Pre-Op & Post-Op Clinical Support',
    description:
      'Your clinical guide for pre-op assessment, medical questions about your procedure, medication management, and post-op follow-up. Lisa is your first call for any health-related concerns.',
    canMessage: true,
    canCallback: true,
    canProfile: false,
  },
];

function SurgeonModal({ member, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">{member.name}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>{member.tagline}</div>
          </div>
          <button className="modal-close" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 20 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                fontWeight: 800,
                color: '#fff',
                flexShrink: 0,
              }}
            >
              {member.initials}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>{member.name}</div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>{member.role} · {member.tagline}</div>
            </div>
          </div>
          <div style={{ padding: '14px 16px', background: 'var(--bg)', borderRadius: 10, marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>About</div>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{member.description}</p>
          </div>
          <div style={{ padding: '14px 16px', background: 'var(--primary-light)', borderRadius: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>Your procedure</div>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              Dr. Chen will be performing your Laparoscopic Cholecystectomy on <strong>June 25, 2026</strong> at Ottawa ASC, 3rd Floor.
              Questions about your surgery should be directed through your Nurse Navigator, Lisa Park.
            </p>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            <CheckCircle size={14} /> Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CareTeam() {
  const { navigate, addToast } = useApp();
  const [profileMember, setProfileMember] = useState(null);

  const handleCallback = (member) => {
    addToast(`Callback request submitted for ${member.name}. You will be contacted within 2 hours during business hours.`, 'success');
  };

  return (
    <div className="animate-fade-in">
      {profileMember && (
        <SurgeonModal member={profileMember} onClose={() => setProfileMember(null)} />
      )}

      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-header-title">My Care Team</h1>
          <p className="page-header-subtitle">
            The people supporting you through your surgery at Ottawa ASC
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {TEAM.map((member) => (
          <div key={member.id} className="card" style={{ padding: '24px 26px' }}>
            <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              {/* Avatar */}
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  fontWeight: 800,
                  color: '#fff',
                  flexShrink: 0,
                }}
              >
                {member.initials}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>
                  {member.name}
                </div>
                <div style={{ fontSize: 13.5, color: 'var(--primary)', fontWeight: 600, marginTop: 2 }}>
                  {member.role}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 1 }}>
                  {member.tagline}
                </div>
                <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.65, marginTop: 12, maxWidth: 600 }}>
                  {member.description}
                </p>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
                  {member.canMessage && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => navigate('messages')}
                    >
                      <MessageSquare size={14} /> Send Message
                    </button>
                  )}
                  {member.canCallback && (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleCallback(member)}
                    >
                      <Phone size={14} /> Request Callback
                    </button>
                  )}
                  {member.canProfile && (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setProfileMember(member)}
                    >
                      <ExternalLink size={14} /> View surgeon profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info footer */}
      <div
        style={{
          marginTop: 24,
          padding: '16px 20px',
          borderRadius: 12,
          background: 'var(--bg)',
          border: '1px solid var(--border)',
        }}
      >
        <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
          <strong>Messaging policy:</strong> All patient messages are routed to your Care Concierge first. For urgent clinical concerns after hours, please call Ottawa ASC at <strong>(613) 555-0191</strong>.
          For medical emergencies, call <strong>911</strong>.
        </div>
      </div>
    </div>
  );
}
