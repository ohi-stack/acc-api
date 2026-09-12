# ACC API

ACC API — interface-layer development repository for the Agent Command Console.

## Production source-of-record boundary

**Current canonical integrated ACC runtime:** [`ohi-stack/acc`](https://github.com/ohi-stack/acc)  
**This repository:** component / experimental split-service source, version `0.1.0`  
**Production designation:** **Not Production; do not deploy as the canonical ACC API without an explicit architecture decision.**

As of September 12, 2026, the integrated `ohi-stack/acc` repository is the authoritative runtime path for ACC production-readiness work. It contains the current control-plane API, production authentication boundary, server-bound operator authority, remote PostgreSQL requirement, production-safe migrations, health/readiness surfaces, build/smoke/preflight gates, and deployment evidence contract.

This `acc-api` repository remains useful as a separately evolvable API-edge/component design. It must not be treated as newer or more authoritative merely because it has an API-specific name.

If ACC is later decomposed into separately deployed services, that change must be explicit and should define:

1. which repository owns the canonical API contract;
2. authentication and operator identity boundaries;
3. source-of-record ownership for approvals, audit, tasks, executions, and policies;
4. compatibility/versioning with `ohi-stack/acc`;
5. independent CI, deployment, rollback, and exact-SHA evidence;
6. migration/cutover rules preventing two authoritative ACC APIs from existing simultaneously.

## Current component scope

This service models a governed API edge for ACC. It contains request-routing and authority-check concepts before work moves deeper into OCP, OEG, adapters, or runners.

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
npm start      # run this component server locally
npm run dev    # run watch mode
npm test       # run Node test runner
npm run check  # syntax-check server/app entrypoints
npm run health # call /health on a running server
```

`npm start` does **not** mean this repository is the approved production ACC runtime.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/` | service identity |
| `GET` | `/health` | component healthcheck |
| `GET` | `/api/v1/authority/model` | authority-model summary |
| `POST` | `/api/v1/authorize` | role/action authorization decision |

## Governance rule

No agent should self-authorize privileged execution. Requests must pass through an authoritative authorization decision before execution is routed to OEG or an adapter/runner. A caller-supplied role or approval flag is not, by itself, authoritative production approval.

## If this component is promoted later

Before this repository can become an independently deployable production service, it needs at minimum:

1. persistent authoritative decision/audit storage;
2. production authentication bound to server-controlled identities/roles;
3. policy files and policy-hash/provenance output;
4. approval request and approval-resolution flows;
5. fail-closed dependency handling and readiness probes;
6. production-safe migrations;
7. CI build/security/smoke gates;
8. exact deployed-SHA and restart/redeploy evidence;
9. explicit cutover from or contract with `ohi-stack/acc`.
