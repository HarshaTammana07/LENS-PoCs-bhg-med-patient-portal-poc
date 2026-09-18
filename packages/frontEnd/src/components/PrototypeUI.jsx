import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, Clock3, X } from 'lucide-react';

function useBodyScrollLock(active = true) {
  useEffect(() => {
    if (!active) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [active]);
}

export function WorkflowDrawer({ title, subtitle, children, onClose, footer, size = 'md' }) {
  useBodyScrollLock(true);

  return createPortal(
    <div className="bhg-workflow-drawer-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside className={`bhg-workflow-drawer ${size}`} role="dialog" aria-modal="true" aria-label={title}>
        <header>
          <div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </header>
        <div className="bhg-workflow-body">{children}</div>
        {footer && <footer>{footer}</footer>}
      </aside>
    </div>,
    document.body
  );
}

export function WorkflowModal({ title, subtitle, eyebrow, children, onClose, footer, actions, size = 'md' }) {
  useBodyScrollLock(true);

  const modalFooter = footer || actions;

  return createPortal(
    <div className="bhg-workflow-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className={`bhg-workflow-modal ${size}`} role="dialog" aria-modal="true" aria-label={title}>
        <header>
          <div>
            {eyebrow && <div className="bhg-eyebrow" style={{ marginBottom: 2 }}>{eyebrow}</div>}
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </header>
        <div className="bhg-workflow-body">{children}</div>
        {modalFooter && <footer>{modalFooter}</footer>}
      </section>
    </div>,
    document.body
  );
}

export function Field({ label, hint, children }) {
  return (
    <label className="bhg-workflow-field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}

export function RequestStatus({ status, response }) {
  const resolved = status === 'Resolved';
  return (
    <div className={`bhg-request-status ${resolved ? 'resolved' : ''}`}>
      <span>{resolved ? <CheckCircle2 size={17} /> : <Clock3 size={17} />}</span>
      <div>
        <strong>{resolved ? 'Clinic responded' : 'Sent to your care team'}</strong>
        <p>{response || 'Your request is waiting for clinic review. For time-sensitive needs, call the center.'}</p>
      </div>
    </div>
  );
}

export function DemoBanner({ children = 'Interactive demonstration — updates are saved only in this browser.' }) {
  return <div className="bhg-demo-banner"><span>Live demo</span>{children}</div>;
}
