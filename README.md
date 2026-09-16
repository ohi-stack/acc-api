# ACC API

ACC API is the governed API edge for the canonical ACC™ platform at `https://acc.onegodian.com`.

## Current status

Version: `0.1.0`

This service handles request routing and authority checks before work is allowed to move deeper into OCP, OEG, adapters, runners, or connected execution systems.

## Canonical architecture

```text
Authorized Human Judgment
→ Oru’Valen™ / OMOS™ decision support
→ ACC Web / ACC API
→ OCP policy + authorization
→ OEG governed execution
→ adapters / runners / agents
→ verification + audit evidence
```

Oru’Valen and OMOS may prepare or contextualize requests, but they do not bypass ACC authorization or self-authorize privileged actions.

## Runtime requirements

- Node.js `>=20`
- npm

## Local development

```bash
npm install
npm run dev
```

Default port: `3010`.

## Scripts

```bash
npm start      # run production server
npm run dev    # run watch mode
npm test       # run Node test runner
npm run check  # syntax-check server/app entrypoints
npm run health # call /health on a running server
```

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/` | service identity |
| `GET` | `/health` | healthcheck |
| `GET` | `/api/v1/authority/model` | current authority model summary |
| `POST` | `/api/v1/authorize` | role/action authorization decision |

## Planned integration contracts

The ACC platform now reserves governed adapter contracts for:

- Oru’Valen / OneGodian LLM decision-support requests
- OMOS runtime and reference-run records
- OneGodian API services
- QR-V verification and registry evidence

These are integration contracts only until implemented, verified, repeatable, and deployed.

## Governance rule

No agent, model, twin, adapter, workflow, or provider may self-authorize privileged execution. Requests must pass through an applicable authorization decision before execution is routed to OEG or an adapter/runner.

## Next production tasks

1. Persist decision records.
2. Add JWT/API-key authentication.
3. Add policy files and policy hash output.
4. Add approval request and approval resolution flows.
5. Connect ACC Web to `/api/v1/authority/model` and `/api/v1/authorize`.
6. Add explicit Oru’Valen and OMOS adapter contracts without weakening approval gates.
7. Record deployment evidence before representing integrations as production-operational.

## Source of truth

The canonical ACC platform repository is `ohi-stack/acc`. This repository is an API module and must remain contract-compatible with the primary platform.

Synchronized to ACC platform `v1.3.0` architecture on September 16, 2026.
