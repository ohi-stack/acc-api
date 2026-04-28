# ACC API

ACC API — interface layer for the Agent Command Console.

## Current status

Version: `0.1.0`

This service is the governed API edge for ACC. It handles request routing and authority checks before work is allowed to move deeper into OCP, OEG, adapters, or runners.

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

## Governance rule

No agent should self-authorize privileged execution. Requests must pass through an authorization decision before execution is routed to OEG or an adapter/runner.

## Next production tasks

1. Persist decision records.
2. Add JWT/API-key authentication.
3. Add policy files and policy hash output.
4. Add approval request and approval resolution flows.
5. Connect ACC Web to `/api/v1/authority/model` and `/api/v1/authorize`.
