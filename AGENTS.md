# AGENTS.md

Guidance for AI agents working in this repository.

## Repository overview

This is a **greenfield timer application** repository (`heyditto/timer`). The timer app itself is not implemented yet. The only checked-in runnable code today is the **UI/UX Pro Max** Cursor skill under `.cursor/skills/ui-ux-pro-max/`, which provides design-system recommendations for building the timer UI.

## Cursor Cloud specific instructions

### What runs today

| Component | Required? | How to run |
|-----------|-----------|------------|
| Timer web/mobile app | Not present yet | N/A until application code is added |
| UI/UX Pro Max skill (Python CLI) | Yes (only runnable component) | See commands below |

### Dependencies

- **Python 3** — required for the UI/UX skill scripts. Uses **stdlib only** (no `pip install`, no `requirements.txt`).
- **Node.js** — available on the Cloud VM but not used by any project code yet. Add `package.json` and install steps when the timer frontend is scaffolded.

### UI/UX skill commands

Generate a design system for the timer (recommended starting point):

```bash
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "timer productivity fun" --design-system -p "Timer"
```

Persist design tokens to `design-system/timer/`:

```bash
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "timer productivity fun" --design-system --persist -p "Timer"
```

Stack-specific guidelines (e.g. when using HTML + Tailwind):

```bash
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "<query>" --stack html-tailwind -n 5
```

### Lint, test, and build

There are **no** project-level lint, test, or build scripts yet (`package.json`, `Makefile`, `pyproject.toml`, and CI configs are absent).

Until application code lands, the smoke check is:

```bash
python3 -m py_compile .cursor/skills/ui-ux-pro-max/scripts/*.py
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "timer" --design-system -p "Timer"
```

When a frontend or backend is added, update this section with the real `dev`, `lint`, and `test` commands from that stack's tooling.

### Gotchas

- Skill script paths are relative to the repo root; run commands from `/workspace`.
- The `--persist` flag writes under `design-system/<project-name>/` (lowercased). Generated design-system files are local artifacts and may be gitignored once the app scaffold exists.
- No Docker, database, or external services are required for current development.
