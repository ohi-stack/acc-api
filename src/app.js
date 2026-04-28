import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { z } from 'zod';

const AuthorizeSchema = z.object({
  actorType: z.enum(['human', 'agent', 'system']).default('agent'),
  actorId: z.string().min(1).max(120),
  role: z.enum(['super_admin', 'acc_admin', 'acc_operator', 'domain_lead', 'agent_executor', 'observer']),
  action: z.string().min(1).max(120),
  resource: z.string().min(1).max(200).optional(),
  environment: z.enum(['dev', 'staging', 'prod']).default('dev'),
  metadata: z.record(z.unknown()).optional()
});

const allowedByRole = {
  super_admin: ['*'],
  acc_admin: ['agent.read', 'task.read', 'task.create', 'task.assign', 'workflow.start', 'workflow.pause', 'agent.register', 'registry.update', 'policy.read', 'logs.read', 'decision_log.read'],
  acc_operator: ['agent.read', 'task.read', 'task.create', 'task.assign', 'workflow.start', 'workflow.pause', 'policy.read', 'logs.read', 'decision_log.read'],
  domain_lead: ['agent.read', 'task.read', 'task.create', 'task.assign', 'workflow.start', 'workflow.pause', 'registry.update.scoped', 'policy.read', 'logs.read', 'decision_log.read'],
  agent_executor: ['agent.read', 'task.read', 'task.create.scoped', 'workflow.start.scoped', 'logs.read'],
  observer: ['agent.read', 'task.read', 'logs.read']
};

const approvalRequired = new Map([
  ['workflow.override', 'level_2'],
  ['registry.update.canonical', 'level_2'],
  ['identity.role.assign', 'level_3'],
  ['policy.update', 'level_3'],
  ['agent.disable.critical', 'level_3'],
  ['financial.execute', 'level_3']
]);

const prohibited = new Set(['policy.bypass', 'audit.delete', 'decision_log.alter', 'timestamp.override', 'registry.delete.canonical']);

function makeId(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function isAllowed(role, action) {
  const allowed = allowedByRole[role] || [];
  return allowed.includes('*') || allowed.includes(action) || allowed.includes(`${action}.scoped`);
}

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

  app.use((req, res, next) => {
    req.requestId = req.headers['x-request-id'] || makeId('acc_req');
    res.setHeader('x-request-id', req.requestId);
    next();
  });

  app.get('/', (req, res) => res.json({
    name: 'acc-api',
    status: 'online',
    version: '0.1.0',
    purpose: 'Agent Command Console interface layer',
    requestId: req.requestId
  }));

  app.get('/health', (req, res) => res.json({
    ok: true,
    service: 'acc-api',
    timestampUtc: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
    requestId: req.requestId
  }));

  app.get('/api/v1/authority/model', (req, res) => res.json({
    version: '0.1',
    authorityPath: ['ACC', 'OCP', 'OEG', 'Adapter/Runner'],
    principles: ['non_self_authorization', 'least_privilege', 'explicit_action_scope', 'approval_before_override', 'deterministic_decision_logging'],
    roles: Object.keys(allowedByRole),
    prohibited: [...prohibited],
    approvalRequired: Object.fromEntries(approvalRequired),
    requestId: req.requestId
  }));

  app.post('/api/v1/authorize', (req, res) => {
    const parsed = AuthorizeSchema.safeParse(req.body || {});
    if (!parsed.success) {
      return res.status(400).json({ error: 'invalid_authorize_payload', details: parsed.error.flatten(), requestId: req.requestId });
    }

    const input = parsed.data;
    const decisionId = makeId('dec');
    const timestampUtc = new Date().toISOString();

    if (prohibited.has(input.action)) {
      return res.status(403).json({
        decisionId,
        decision: 'deny',
        reason: 'prohibited_action',
        approvalStatus: 'not_available',
        timestampUtc,
        requestId: req.requestId
      });
    }

    if (approvalRequired.has(input.action)) {
      return res.status(202).json({
        decisionId,
        decision: 'escalate',
        reason: 'approval_required',
        approvalLevel: approvalRequired.get(input.action),
        approvalStatus: 'pending',
        timestampUtc,
        requestId: req.requestId
      });
    }

    if (!isAllowed(input.role, input.action)) {
      return res.status(403).json({
        decisionId,
        decision: 'deny',
        reason: 'insufficient_role_scope',
        approvalStatus: 'not_requested',
        timestampUtc,
        requestId: req.requestId
      });
    }

    return res.json({
      decisionId,
      decision: 'allow',
      authorityScope: { role: input.role, action: input.action, environment: input.environment, resource: input.resource || null },
      approvalStatus: 'not_required',
      timestampUtc,
      requestId: req.requestId
    });
  });

  app.use((req, res) => res.status(404).json({ error: 'not_found', path: req.path, requestId: req.requestId }));
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'internal_server_error', requestId: req.requestId });
  });

  return app;
}
