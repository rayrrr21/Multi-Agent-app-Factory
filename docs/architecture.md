# Architecture Overview

This repository implements a **multi‑agent mobile app factory** using Antigravity agents.

- **Orchestrator**: coordinates work, defines contracts, merges branches.
- **Expo Builder**: owns the front‑end monorepo (`apps/`, `packages/ui`).
- **Supabase Engineer**: owns backend schema and auth (`supabase/`).
- **Product Logic Engineer**: business‑logic packages.
- **QA Engineer**: testing infrastructure.
- **Release Engineer**: EAS build and release pipelines.

The repo is a **monorepo** (Yarn workspaces) to share TypeScript types and UI components across apps.
