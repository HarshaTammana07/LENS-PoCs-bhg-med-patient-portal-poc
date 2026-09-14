import React, { useState } from 'react';
import {
  Search, Calendar, FileText, CreditCard, Wrench,
  ChevronDown, ChevronUp, Phone, Mail, MessageSquare,
  HelpCircle, ExternalLink, X
} from 'lucide-react';
import { helpCategories as seedHelp } from '../data/mockData';
import { useApp } from '../context/AppContext';

const iconMap = { Calendar, FileText, CreditCard, Wrench, HelpCircle };
const colorStyles = {
  primary: { icon: 'var(--primary)', bg: 'var(--primary-light)' },
  accent:  { icon: 'var(--accent)',  bg: 'var(--accent-light)' },
  warning: { icon: '#d97706',        bg: 'var(--warning-light)' },
  purple:  { icon: 'var(--purple)',  bg: 'var(--purple-light)' },
};

export default function HelpCenter() {
  const { addToast, helpCategories: portalHelp } = useApp();
  const helpCategories = portalHelp?.length ? portalHelp : seedHelp;
  const [query, setQuery] = useState('');
  const [openFaq, setOpenFaq] = useState({});
  const [activeCategory, setActiveCategory] = useState(null);

  const toggleFaq = (key) => setOpenFaq(prev => ({ ...prev, [key]: !prev[key] }));

  const filteredCategories = helpCategories.map(cat => ({
    ...cat,
    faqs: cat.faqs.filter(f =>
      !query || f.q.toLowerCase().includes(query.toLowerCase()) || f.a.toLowerCase().includes(query.toLowerCase())
    ),
  })).filter(cat => !query || cat.faqs.length > 0);

  const displayCategories = activeCategory
    ? filteredCategories.filter(c => c.id === activeCategory)
    : filteredCategories;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Help Center</h1>
          <p className="page-header-subtitle">FAQs, guides, and support resources</p>
        </div>
      </div>

      {/* Search hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0c1b3a 0%, #0f2657 100%)',
        borderRadius: 16, padding: '32px 36px', marginBottom: 28, textAlign: 'center',
      }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 8 }}>How can we help you?</div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 20 }}>Search our knowledge base or browse by topic</div>
        <div style={{ maxWidth: 540, margin: '0 auto' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: '#fff', borderRadius: 10, padding: '0 16px',
          }}>
            <Search size={17} color="var(--text-muted)" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search help articles..."
              style={{ border: 'none', background: 'transparent', padding: '14px 0', flex: 1, fontSize: 15, color: 'var(--text-primary)' }}
            />
            {query && <X size={14} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setQuery('')} />}
          </div>
        </div>
      </div>

      {/* Category pills */}
      <div className="filter-bar" style={{ marginBottom: 20 }}>
        <button className={`filter-chip${!activeCategory ? ' active' : ''}`} onClick={() => setActiveCategory(null)}>All Topics</button>
        {helpCategories.map(cat => {
          const cs = colorStyles[cat.color] || colorStyles.primary;
          return (
            <button
              key={cat.id}
              className={`filter-chip${activeCategory === cat.id ? ' active' : ''}`}
              onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
            >
              {cat.title}
            </button>
          );
        })}
      </div>

      {/* Category cards */}
      {!query && !activeCategory && (
        <div className="grid grid-4" style={{ marginBottom: 28 }}>
          {helpCategories.map(cat => {
            const cs = colorStyles[cat.color] || colorStyles.primary;
            const Icon = iconMap[cat.icon] || HelpCircle;
            return (
              <div
                key={cat.id}
                className="card"
                style={{ cursor: 'pointer', padding: 20, textAlign: 'center', transition: 'var(--transition)' }}
                onClick={() => setActiveCategory(cat.id)}
              >
                <div style={{ width: 52, height: 52, borderRadius: 14, background: cs.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <Icon size={24} color={cs.icon} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{cat.title}</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{cat.count} articles</div>
              </div>
            );
          })}
        </div>
      )}

      {/* FAQ sections */}
      {displayCategories.map(cat => (
        <div key={cat.id} className="card" style={{ marginBottom: 16 }}>
          <div className="card-header" style={{ paddingBottom: 16 }}>
            <div className="card-title">{cat.title}</div>
            <span className="badge badge-muted">{cat.faqs.length} articles</span>
          </div>
          <div className="card-body" style={{ paddingTop: 0 }}>
            {cat.faqs.map((faq, i) => {
              const key = `${cat.id}-${i}`;
              return (
                <div key={key} className="faq-item">
                  <div className="faq-question" onClick={() => toggleFaq(key)}>
                    <span>{faq.q}</span>
                    {openFaq[key] ? <ChevronUp size={16} color="var(--primary)" style={{ flexShrink: 0 }} /> : <ChevronDown size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />}
                  </div>
                  {openFaq[key] && <div className="faq-answer">{faq.a}</div>}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Contact options */}
      <div className="card" style={{ marginTop: 8 }}>
        <div className="card-header"><div className="card-title">Still need help?</div></div>
        <div className="card-body">
          <div className="grid grid-3" style={{ gap: 14 }}>
            {[
              {
                icon: MessageSquare, label: 'Live Chat', sub: 'Available Mon–Fri, 8AM–6PM',
                color: 'var(--primary)', bg: 'var(--primary-light)',
                action: () => addToast('Live chat is starting...', 'success'),
              },
              {
                icon: Phone, label: 'Call Support', sub: '1-800-MED-HELP (24/7)',
                color: 'var(--accent)', bg: 'var(--accent-light)',
                action: () => addToast('Calling 1-800-MED-HELP...', 'info'),
              },
              {
                icon: Mail, label: 'Email Support', sub: 'Response within 24 hours',
                color: 'var(--purple)', bg: 'var(--purple-light)',
                action: () => addToast('Opening email support...', 'success'),
              },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="card"
                  style={{ cursor: 'pointer', padding: '18px 20px', border: '1px solid var(--border)', transition: 'var(--transition)' }}
                  onClick={item.action}
                >
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                    <Icon size={19} color={item.color} />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{item.sub}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
