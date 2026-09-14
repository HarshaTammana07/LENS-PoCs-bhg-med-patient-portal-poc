/**
 * Demo-only: deterministic “next available” slots per doctor for chat reschedule UI.
 */
export function generateNextAvailableSlots(doctorName) {
  const pool = [
    { date: 'May 28, 2026', day: '28', month: 'MAY', time: '10:00 AM' },
    { date: 'May 29, 2026', day: '29', month: 'MAY', time: '2:30 PM' },
    { date: 'June 2, 2026', day: '02', month: 'JUN', time: '9:15 AM' },
    { date: 'June 5, 2026', day: '05', month: 'JUN', time: '11:45 AM' },
    { date: 'June 9, 2026', day: '09', month: 'JUN', time: '3:00 PM' },
  ];
  let h = 0;
  for (let i = 0; i < doctorName.length; i += 1) h += doctorName.charCodeAt(i);
  const start = h % pool.length;
  const ordered = [...pool.slice(start), ...pool.slice(0, start)];
  return ordered.slice(0, 4).map((s, i) => ({
    ...s,
    slotKey: `slot-${doctorName}-${i}-${s.date}-${s.time}`,
    label: `${s.date} · ${s.time}`,
  }));
}
