import React, { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Shield, Bell, Globe,
  Edit3, Check, Briefcase, Award, Stethoscope, AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

function Toggle({ on, onToggle }) {
  return <div className={`toggle-switch${on ? ' on' : ''}`} onClick={onToggle} />;
}

export default function Profile() {
  const { addToast, userRole, user, patient } = useApp();
  const isDoc = userRole === 'doctor';
  const [editMode, setEditMode] = useState(false);

  const profileData = isDoc
    ? {
        name: 'Dr. Marcus Webb',
        id: 'PRV-609FEF4',
        initials: 'MW',
        specialty: 'Cardiology',
        location: 'BHG Med Hospital',
        personal: { 'Full Name': 'Dr. Marcus Webb, MD', 'Specialty': 'Cardiology', 'Board Certification': 'Active', 'Medical School': 'Harvard Medical School', 'Languages': 'English, Spanish' },
        contact: { 'Professional Email': 'doctor@demo.com', 'Office Line': '(555) 012-3456', 'Office Address': '700 BHG Med Center, Suite 304' },
        extra: { 'NPI Number': '1098472615', 'License': 'NY-45902', 'Hospital Privileges': 'Full Admitting', 'Telehealth': 'Available' }
      }
    : {
        name: patient?.name || user?.name || 'Sarah Jenkins',
        id: patient?.id || '0630262C',
        initials: patient?.avatar || 'SJ',
        age: patient?.age ? String(patient.age) : '46',
        location: patient?.primaryCare ? `Care team: ${patient.primaryCare}` : 'BHG Behavioral Health',
        personal: {
          'Full Name': patient?.name || 'Sarah Jenkins',
          'Date of Birth': patient?.dob || 'March 14, 1980',
          'Gender': patient?.gender || 'Female',
          'Blood Type': patient?.bloodType || 'O+',
          'Language': patient?.language || 'English',
        },
        contact: {
          'Email Address': patient?.email || user?.email || 'patient@demo.com',
          'Phone Number': patient?.phone || '(555) 987-6543',
          'Address': patient?.address
            ? `${patient.address}${patient.city ? `, ${patient.city}` : ''}${patient.province ? `, ${patient.province}` : ''}`
            : '124 Oak Street, New York, NY',
        },
        extra: {
          'Emergency Contact': patient?.emergencyContact?.name || 'Michael Jenkins',
          'Relationship': patient?.emergencyContact?.relation || 'Spouse',
          'Emergency Phone': patient?.emergencyContact?.phone || '(555) 987-6544',
        },
        insurance: {
          'Provider': patient?.insurance?.provider || 'BlueCross BCBS',
          'Policy': patient?.insurance?.policyNumber || 'SH-7842910',
          'Group': patient?.insurance?.groupNumber || 'GRP-4410',
          'Type': patient?.insurance?.coverageType || 'Comprehensive',
          'Status': patient?.insurance?.status || 'Active',
        }
      };

  const [form, setForm] = useState(profileData);
  const handleSave = () => { setEditMode(false); addToast('Profile updated.', 'success'); };

  const Field = ({ label, value }) => (
    <div className="profile-field">
      <div className="profile-field-label">{label}</div>
      <div className="profile-field-value">{editMode ? <input className="input-field" defaultValue={value} /> : <span>{value}</span>}</div>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 40 }}>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Profile & Preferences</h1>
          <p className="page-header-subtitle">Manage your {isDoc ? 'professional' : 'personal'} information</p>
        </div>
        <button className={editMode ? "btn btn-primary" : "btn btn-secondary"} onClick={() => editMode ? handleSave() : setEditMode(true)}>
          {editMode ? <><Check size={14} /> Save Changes</> : <><Edit3 size={14} /> Edit Profile</>}
        </button>
      </div>

      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {/* Left Column */}
        <div style={{ width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ textAlign: 'center', padding: 24 }}>
            <div className="avatar avatar-xl" style={{ margin: '0 auto 16px', fontSize: 28, background: isDoc ? 'var(--primary)' : 'var(--accent)' }}>
              {profileData.initials}
            </div>
            <div style={{ fontWeight: 800, fontSize: 17 }}>{profileData.name}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{profileData.id}</div>
            <div style={{ marginTop: 12 }}><span className={`badge ${isDoc ? 'badge-primary' : 'badge-success'} badge-dot`}>{isDoc ? 'Active Provider' : 'Active Patient'}</span></div>
            <div className="divider" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', fontSize: 13 }}><Briefcase size={14} /> {isDoc ? profileData.specialty : `Age ${profileData.age}`}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', fontSize: 13 }}><MapPin size={14} /> {profileData.location}</div>
          </div>

          {/* Conditional Insurance Card */}
          {!isDoc && (
            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Shield size={14} color="var(--primary)" /> Insurance Information
              </div>
              {Object.entries(profileData.insurance).map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12.5, borderBottom: '1px solid var(--border-light)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{l}</span>
                  <span style={{ fontWeight: 600, color: l === 'Status' ? 'var(--success)' : 'var(--text-primary)' }}>{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <div className="card-header"><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><User size={16} color="var(--primary)" /> <div className="card-title">Personal Information</div></div></div>
            <div className="card-body">
              {Object.entries(profileData.personal).map(([l, v]) => <Field key={l} label={l} value={v} />)}
            </div>
          </div>

          <div className="card">
            <div className="card-header"><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Mail size={16} color="var(--accent)" /> <div className="card-title">Contact Information</div></div></div>
            <div className="card-body">
              {Object.entries(profileData.contact).map(([l, v]) => <Field key={l} label={l} value={v} />)}
            </div>
          </div>

          <div className="card">
            <div className="card-header"><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><AlertTriangle size={16} color="var(--warning)" /> <div className="card-title">{isDoc ? 'Practice Details' : 'Emergency Contact'}</div></div></div>
            <div className="card-body">
              {Object.entries(profileData.extra).map(([l, v]) => <Field key={l} label={l} value={v} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}