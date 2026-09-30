# ACC API

ACC API is the governed API edge for the canonical ACC™ platform at `https://acc.onegodian.com`.

## Current status

Production module baseline: `0.1.0`  
ACC V2 synchronization target: `2.0.0-alpha.1` delegation foundation

This service handles request routing and authority checks before work is allowed to move deeper into OCP, OEG, adapters, runners, or connected execution systems.

## Canonical architecture

```text
Authorized Human Judgment
→ Oru’Valen™ / OMOS™ decision support
→ ACC Web / ACC API
→ Project / Responsibility / Work Order
→ OCP policy + authorization
→ OEG governed execution
→ approved provider adapters / runners / agents
→ verification + audit evidence
```

Oru’Valen and OMOS may prepare or contextualize requests, but they do not bypass ACC authorization or self-authorize privileged actions.

## ACC V2 API contract

The canonical ACC platform now defines these delegation surfaces:

- `GET /api/v1/execution-providers`
- `GET /api/v1/work-orders`
- `GET /api/v1/work-orders/:id`
- `POST /api/v1/work-orders`
- `POST /api/v1/work-orders/:id/status`
- `GET /api/v1/responsibilities`
- `POST /api/v1/responsibilities`

ACC API modules must preserve these rules when these routes are split into the dedicated API service:

- reject unknown provider identifiers;
- permit planning against known non-executable providers without dispatching them;
- preserve human approval requirements for privileged work;
- keep provider maturity separate from provider identity;
- never mark a reserved provider as executable without verified adapter support.

`openai-dot` is currently reserved and non-executable.

## Runtime requirements

- Node.js `>=20`
- npm

## Local development

```bash
npm install
npm run dev
```

Default port: `3010`.

## Existing endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/` | service identity |
| `GET` | `/health` | healthcheck |
| `GET` | `/api/v1/authority/model` | current authority model summary |
| `POST` | `/api/v1/authorize` | role/action authorization decision |

## Integration contracts

The ACC platform reserves governed adapter contracts for:

- Oru’Valen / OneGodian LLM decision-support requests
- OMOS runtime and reference-run records
- OneGodian API services
- QR-V verification and registry evidence
- OpenAI Agents
- OpenAI Codex
- ChatGPT Work
- future OpenAI Dot compatibility
- MCP-compatible external execution providers

Provider names are contracts only until implemented, verified, repeatable, and deployed.

## Governance rule

No agent, model, twin, adapter, workflow, provider, or external runtime may self-authorize privileged execution. Requests must pass through applicable authorization and approval decisions before execution is routed to OEG, an adapter, or a runner.

## Next production tasks

1. Persist decision records.
2. Add JWT/API-key authentication where not already supplied by the canonical ACC edge.
3. Add policy files and policy hash output.
4. Add approval request and approval resolution flows.
5. Split canonical Work Order / Responsibility routes from `ohi-stack/acc` only when contract parity is verified.
6. Add provider adapters without weakening approval gates.
7. Record deployment evidence before representing integrations as production-operational.

## Source of truth

The canonical ACC platform repository is `ohi-stack/acc`. This repository is an API module and must remain contract-compatible with the primary platform and `ohi-stack/acc-core` schemas.
