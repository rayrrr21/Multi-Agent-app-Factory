# Release Process

1. **Orchestrator** creates feature branches for each agent (ui, backend, product) using the worktree helper.
2. Agents push their work to their isolated branches.
3. When all branches are **review‑approved**, the Orchestrator merges them into `main`.
4. **QA Engineer** runs the full test suite (`npm test`).
5. If QA passes, **Release Engineer**:
   - Updates version numbers in `package.json` (semantic versioning).
   - Runs `eas build --profile production --platform all`.
   - Verifies build artifacts and generated app identifiers.
   - Prepares metadata files for App Store / Google Play (icons, screenshots, `eas.json` fields).
   - Stores the release artefacts in the `releases/` folder (optional).
6. Release Engineer **does not** publish automatically – a manual approval step is required.
7. After successful release, tags the commit (`vX.Y.Z`).

The process is fully reproducible via the `scripts/release.sh` helper (to be added).
