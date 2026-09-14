import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import pg from 'pg';

const { Pool } = pg;

const PORT = Number(process.env.PORT || 4100);
const API_PREFIX = (process.env.PUBLIC_API_BASE_PATH || '/bhg-patientportal/api').replace(/\/$/, '');
const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://postgres:uat%40c0nn%40ct@74.208.13.200:5432/BHG_appointments?sslmode=disable';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: false,
  max: 3,
  idleTimeoutMillis: 10_000,
});

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

async function getGlobalBundle() {
  const { rows } = await pool.query(`SELECT key, payload FROM portal_bundle`);
  const out = {};
  for (const row of rows) {
    if (!String(row.key).startsWith('patient:')) {
      out[row.key] = row.payload;
    }
  }
  return out;
}

async function getPatientBundle(workflowPatientId) {
  const prefix = `patient:${workflowPatientId}:`;
  const { rows } = await pool.query(
    `SELECT key, payload FROM portal_bundle WHERE key LIKE $1`,
    [`${prefix}%`]
  );
  const out = {};
  for (const row of rows) {
    const sliceKey = row.key.slice(prefix.length);
    out[sliceKey] = row.payload;
  }

  if (!out.patient) {
    const patientRes = await pool.query(
      `SELECT data FROM portal_patients WHERE workflow_patient_id = $1`,
      [workflowPatientId]
    );
    if (patientRes.rows[0]?.data) out.patient = patientRes.rows[0].data;
  }

  if (!out.appointments) {
    const apptRes = await pool.query(
      `SELECT data FROM portal_appointments WHERE workflow_patient_id = $1 ORDER BY id`,
      [workflowPatientId]
    );
    out.appointments = apptRes.rows.map((r) => r.data);
  }

  if (!out.preOpChecklistItems) {
    const checklistRes = await pool.query(
      `SELECT data FROM portal_checklist_items WHERE workflow_patient_id = $1 ORDER BY id`,
      [workflowPatientId]
    );
    out.preOpChecklistItems = checklistRes.rows.map((r) => r.data);
  }

  return out;
}

async function lookupPortalUser(email) {
  const { rows } = await pool.query(
    `SELECT email, role, name, mrn, workflow_patient_id
     FROM portal_users WHERE lower(email) = $1`,
    [String(email || '').trim().toLowerCase()]
  );
  return rows[0] ?? null;
}

async function getBundleForEmail(email) {
  const user = await lookupPortalUser(email);
  if (!user) return null;

  if (user.role !== 'patient') {
    return getGlobalBundle();
  }

  if (user.workflow_patient_id) {
    const patientBundle = await getPatientBundle(user.workflow_patient_id);
    return {
      ...patientBundle,
      workflowPatientId: user.workflow_patient_id,
      hasSyncedPatient: Boolean(
        patientBundle.patient ||
          (Array.isArray(patientBundle.appointments) && patientBundle.appointments.length)
      ),
    };
  }

  return {
    patient: null,
    appointments: [],
    preOpChecklistItems: [],
    visits: [],
    timelineEvents: [],
    hasSyncedPatient: false,
  };
}

function registerRoutes(router) {
  router.get('/health', async (_req, res) => {
    try {
      await pool.query('SELECT 1');
      res.json({ ok: true, db: 'BHG_appointments' });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  router.post('/auth/demo-login', async (req, res) => {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    try {
      const { rows } = await pool.query(
        `SELECT email, role, name, mrn, workflow_patient_id
         FROM portal_users WHERE lower(email) = $1 AND password = $2`,
        [email, password]
      );
      if (!rows.length) {
        return res.status(401).json({ error: 'Invalid demo credentials' });
      }
      const u = rows[0];
      res.json({
        user: {
          id: `demo-${u.email.split('@')[0]}`,
          email: u.email,
          name: u.name,
          ...(u.mrn ? { mrn: u.mrn } : {}),
          ...(u.workflow_patient_id ? { workflowPatientId: u.workflow_patient_id } : {}),
        },
        role: u.role,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/portal/bundle', async (req, res) => {
    try {
      const email = String(req.query.email || req.headers['x-portal-email'] || '').trim().toLowerCase();
      if (!email) {
        const bundle = await getGlobalBundle();
        return res.json(bundle);
      }
      const bundle = await getBundleForEmail(email);
      if (!bundle) return res.status(404).json({ error: 'User not found' });
      res.json(bundle);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/portal/patient', async (req, res) => {
    try {
      const email = String(req.query.email || '').trim().toLowerCase();
      const user = email ? await lookupPortalUser(email) : null;
      if (user?.workflow_patient_id) {
        const { rows } = await pool.query(
          `SELECT data FROM portal_patients WHERE workflow_patient_id = $1`,
          [user.workflow_patient_id]
        );
        return res.json(rows[0]?.data ?? null);
      }
      const { rows } = await pool.query(`SELECT data FROM portal_patients LIMIT 1`);
      res.json(rows[0]?.data ?? null);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/portal/appointments', async (req, res) => {
    try {
      const email = String(req.query.email || '').trim().toLowerCase();
      const user = email ? await lookupPortalUser(email) : null;
      if (user?.workflow_patient_id) {
        const { rows } = await pool.query(
          `SELECT data FROM portal_appointments WHERE workflow_patient_id = $1 ORDER BY id`,
          [user.workflow_patient_id]
        );
        return res.json(rows.map((r) => r.data));
      }
      const { rows } = await pool.query(`SELECT data FROM portal_appointments ORDER BY id`);
      res.json(rows.map((r) => r.data));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.patch('/portal/appointments/:id', async (req, res) => {
    try {
      const email = String(req.query.email || req.headers['x-portal-email'] || '').trim().toLowerCase();
      const user = email ? await lookupPortalUser(email) : null;
      const workflowPatientId = user?.workflow_patient_id ?? null;

      const { rows } = await pool.query(
        workflowPatientId
          ? `SELECT id, data FROM portal_appointments
             WHERE workflow_patient_id = $1 AND data->>'id' = $2`
          : `SELECT id, data FROM portal_appointments WHERE data->>'id' = $1`,
        workflowPatientId ? [workflowPatientId, req.params.id] : [req.params.id]
      );
      if (!rows.length) return res.status(404).json({ error: 'Not found' });
      const next = { ...rows[0].data, ...req.body };
      await pool.query(
        `UPDATE portal_appointments SET data = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [rows[0].id, JSON.stringify(next)]
      );

      if (workflowPatientId) {
        const all = await pool.query(
          `SELECT data FROM portal_appointments WHERE workflow_patient_id = $1 ORDER BY id`,
          [workflowPatientId]
        );
        await pool.query(
          `INSERT INTO portal_bundle (key, payload) VALUES ($1, $2)
           ON CONFLICT (key) DO UPDATE SET payload = EXCLUDED.payload, updated_at = CURRENT_TIMESTAMP`,
          [`patient:${workflowPatientId}:appointments`, JSON.stringify(all.rows.map((r) => r.data))]
        );
      }

      res.json(next);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/portal/billing', async (_req, res) => {
    try {
      const { rows } = await pool.query(`SELECT data FROM portal_billing LIMIT 1`);
      res.json(rows[0]?.data ?? null);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/portal/billing', async (req, res) => {
    try {
      const patientId = '0630262C';
      await pool.query(
        `INSERT INTO portal_billing (patient_id, data) VALUES ($1,$2)
         ON CONFLICT (patient_id) DO UPDATE SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP`,
        [patientId, JSON.stringify(req.body)]
      );
      await pool.query(
        `INSERT INTO portal_bundle (key, payload) VALUES ('billing', $1)
         ON CONFLICT (key) DO UPDATE SET payload = EXCLUDED.payload, updated_at = CURRENT_TIMESTAMP`,
        [JSON.stringify(req.body)]
      );
      res.json(req.body);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/portal/checklist', async (req, res) => {
    try {
      const email = String(req.query.email || '').trim().toLowerCase();
      const user = email ? await lookupPortalUser(email) : null;
      if (user?.workflow_patient_id) {
        const { rows } = await pool.query(
          `SELECT data FROM portal_checklist_items WHERE workflow_patient_id = $1 ORDER BY id`,
          [user.workflow_patient_id]
        );
        return res.json(rows.map((r) => r.data));
      }
      const { rows } = await pool.query(`SELECT data FROM portal_checklist_items ORDER BY id`);
      res.json(rows.map((r) => r.data));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.patch('/portal/checklist/:id', async (req, res) => {
    try {
      const email = String(req.query.email || req.headers['x-portal-email'] || '').trim().toLowerCase();
      const user = email ? await lookupPortalUser(email) : null;
      const workflowPatientId = user?.workflow_patient_id ?? null;

      const { rows } = await pool.query(
        workflowPatientId
          ? `SELECT id, data FROM portal_checklist_items
             WHERE workflow_patient_id = $1 AND data->>'id' = $2`
          : `SELECT id, data FROM portal_checklist_items WHERE data->>'id' = $1`,
        workflowPatientId ? [workflowPatientId, req.params.id] : [req.params.id]
      );
      if (!rows.length) return res.status(404).json({ error: 'Not found' });
      const next = { ...rows[0].data, ...req.body };
      await pool.query(
        `UPDATE portal_checklist_items SET data = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [rows[0].id, JSON.stringify(next)]
      );

      if (workflowPatientId) {
        const all = await pool.query(
          `SELECT data FROM portal_checklist_items WHERE workflow_patient_id = $1 ORDER BY id`,
          [workflowPatientId]
        );
        await pool.query(
          `INSERT INTO portal_bundle (key, payload) VALUES ($1, $2)
           ON CONFLICT (key) DO UPDATE SET payload = EXCLUDED.payload, updated_at = CURRENT_TIMESTAMP`,
          [`patient:${workflowPatientId}:preOpChecklistItems`, JSON.stringify(all.rows.map((r) => r.data))]
        );
      }

      res.json(next);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/portal/roster', async (_req, res) => {
    try {
      const { rows } = await pool.query(`SELECT data FROM portal_roster ORDER BY id`);
      res.json(rows.map((r) => r.data));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/portal/labs', async (_req, res) => {
    try {
      const { rows } = await pool.query(`SELECT data FROM portal_labs ORDER BY id`);
      res.json(rows.map((r) => r.data));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
}

const apiRouter = express.Router();
registerRoutes(apiRouter);

app.use(API_PREFIX, apiRouter);
app.use(apiRouter);

app.listen(PORT, () => {
  console.log(`Portal API listening on http://localhost:${PORT}`);
  console.log(`Public base path: ${API_PREFIX}`);
});
