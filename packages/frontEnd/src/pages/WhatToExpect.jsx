import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

const SECTIONS = [
  {
    id: 'before',
    title: 'Before You Arrive',
    color: 'var(--warning-light)',
    borderColor: 'rgba(245,158,11,0.2)',
    iconColor: '#d97706',
    items: [
      'Stop eating by 11:30 PM the night before your surgery (March 17)',
      'Stop drinking clear liquids by 5:30 AM on the morning of surgery',
      'Take only approved medications with a small sip of water. Check with your Nurse Navigator first.',
      'Wear comfortable, loose-fitting clothing. You will change into a gown on arrival.',
      'Leave jewelry and valuables at home',
      'Bring: photo ID, insurance card, and a list of your current medications',
      'Arrange a licensed adult escort. You cannot leave the facility alone after surgery.',
    ],
  },
  {
    id: 'arrive',
    title: 'When You Arrive',
    color: 'var(--primary-light)',
    borderColor: 'rgba(109,40,217,0.15)',
    iconColor: 'var(--primary)',
    items: [
      'Check in via the portal (tap "I have arrived" in My Surgery) or at the front desk on the 3rd Floor',
      'Your Care Concierge Marie Laurent will greet you at the entrance',
      'You will be taken to the pre-op preparation area within 10 minutes of arrival',
      'Your escort / family member can wait in our comfortable family lounge (Wi-Fi, beverages available)',
      'The nursing team will review your consent forms and answer any last-minute questions',
    ],
  },
  {
    id: 'during',
    title: 'During Your Procedure',
    color: '#f0fdf4',
    borderColor: 'rgba(22,163,74,0.15)',
    iconColor: 'var(--success)',
    items: [
      'Typical procedure time for a Laparoscopic Cholecystectomy is 30–60 minutes',
      'You will receive general anaesthesia. You will be asleep throughout the procedure.',
      'Our anaesthesia team will monitor your vitals throughout',
      'Your family / escort will be updated on your status by our team in the lounge',
      'After surgery, you will rest in our recovery area where nurses monitor your awakening',
    ],
  },
  {
    id: 'home',
    title: 'Going Home',
    color: '#eff6ff',
    borderColor: 'rgba(59,130,246,0.15)',
    iconColor: '#2563eb',
    items: [
      'Most patients go home within 2–3 hours of their surgery ending',
      'Your escort will be notified when you are ready to leave',
      'You will receive written discharge instructions. A copy is also in My Records.',
      'Our team will call you the next day to check on your recovery',
      'Your Day 3 follow-up with Nurse Navigator Lisa Park is already scheduled (March 21, virtual)',
      'For any urgent concerns after discharge, call Ottawa ASC at (613) 555-0191',
    ],
  },
];

export default function WhatToExpect() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-header-title">What to Expect</h1>
          <p className="page-header-subtitle">
            A step-by-step guide to your surgery day at Ottawa ASC
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
        {SECTIONS.map((section) => (
          <div
            key={section.id}
            style={{
              padding: '20px 24px',
              borderRadius: 14,
              background: section.color,
              border: `1px solid ${section.borderColor}`,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: section.iconColor,
                textTransform: 'uppercase',
                letterSpacing: 0.8,
                marginBottom: 14,
              }}
            >
              {section.title}
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9 }}>
              {section.items.map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  <span style={{ color: section.iconColor, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Facility info */}
      <div className="card" style={{ padding: '22px 26px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <MapPin size={20} color="var(--primary)" />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>Ottawa ASC</div>
              <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.5 }}>
                100 Main Street, 3rd Floor<br />
                Ottawa, ON K1A 0A1<br />
                <span style={{ color: 'var(--text-muted)' }}>Tel: (613) 555-0191</span>
              </div>
            </div>
          </div>
          <button
            className="btn btn-secondary"
            onClick={() => window.open('https://maps.google.com/?q=100+Main+Street+Ottawa+ON+K1A+0A1', '_blank')}
          >
            <ExternalLink size={14} /> Get Directions
          </button>
        </div>

        <div
          style={{
            marginTop: 18,
            padding: '12px 16px',
            borderRadius: 10,
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            fontSize: 13,
            color: 'var(--text-muted)',
            lineHeight: 1.6,
          }}
        >
          <strong>Parking:</strong> Free patient parking is available in the underground lot accessible from Main Street. Enter via the Main Street entrance and take the elevator to the 3rd Floor.
          <br />
          <strong>Phase 2 update:</strong> A virtual facility tour video will be added here to help you familiarize yourself with the space before your arrival.
        </div>
      </div>
    </div>
  );
}
