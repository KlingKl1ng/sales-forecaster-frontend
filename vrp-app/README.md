# Operartis Vehicle Routing frontend

This directory contains the React, TypeScript, Vite, MapLibre, and TanStack Query source for the Operartis VRP module.

The production build is emitted to `frontend/vrp/`, which lets the existing static Nginx application serve the module at `/vrp/` without changing the legacy module runtime.

## Commands

Run from `frontend/`:

```bash
pnpm install
pnpm dev:vrp
pnpm build:vrp
```

## Integration

- Existing Operartis theme, language, API, authentication UI, and access-gate scripts are loaded from the frontend root.
- Authentication is bypassed only on `localhost`, `127.0.0.1`, and `::1` so the interface can be developed against mock data.
- Production and staging continue to require the current Operartis session and CSRF flow.
- The default local basemap uses OSM Standard tiles for interactive development only.
- Non-local builds expect a same-origin tile endpoint at `/map-tiles/{z}/{x}/{y}.png` unless `VITE_VRP_TILE_URL` is provided during the build.

## Current status

The frontend is an interactive contract-first prototype. Optimization and data-management actions use representative scenario data while the `/vrp` backend endpoints are developed. The visual data model follows `Docs/OPERARTIS_VRP_MODULE_LAUNCH_PLAN.md`.
