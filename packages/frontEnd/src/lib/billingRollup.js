/** Per-statement and aggregate totals from line items (billed vs insurance vs patient). */

export function rollupStatement(stmt) {
  const items = stmt.items || [];
  const billed = items.reduce((a, it) => a + (it.amount || 0), 0);
  const insurancePaid = items.reduce((a, it) => a + (it.covered || 0), 0);
  const yourShare = items.reduce((a, it) => a + (it.patient || 0), 0);
  return { billed, insurancePaid, yourShare };
}

export function rollupAllStatements(stmts) {
  return (stmts || []).reduce(
    (acc, s) => {
      const r = rollupStatement(s);
      return {
        billed: acc.billed + r.billed,
        insurancePaid: acc.insurancePaid + r.insurancePaid,
        yourShare: acc.yourShare + r.yourShare,
      };
    },
    { billed: 0, insurancePaid: 0, yourShare: 0 }
  );
}
