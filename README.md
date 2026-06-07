# Papercraft Timer

A cozy interactive papercraft timer. The camera revolves around a central handmade-style paper character as you scroll, building toward a layered cut-paper diorama with timer interactions.

Built with React + TypeScript + Vite + Three.js (React Three Fiber + Drei), Lenis smooth scroll, and Zustand.

## Getting started

```bash
npm install
npm run dev
```

Other scripts:

- `npm run build` — type-check and production build
- `npm run preview` — preview the production build
- `npm run typecheck` — TypeScript checks only
- `npm run lint` — ESLint

## Architecture

Feature-based, per the project guide:

```
src/
  app/                      Experience (Lenis + Canvas) wiring
  features/
    papercraftScene/        camera rig, curves, scene state
      components/           Scene, OrbitCamera
      curves/               procedural camera path + look-at curves
      state/                Zustand stores (scroll progress, zoom)
      config.ts             named constants (no magic numbers)
    characters/             reusable paper character models
  lib/three/                shared Three.js utilities
  styles/                   global CSS
```

### Camera rig

Scroll is normalized to a `scrollProgress` value (0–1) by Lenis. Each frame the
`OrbitCamera` samples two closed `CatmullRomCurve3` splines — `cameraPathCurve`
(a ring around the target) and `cameraLookAtCurve` (a concentric ring at the
target center) — and lerps the camera group toward them, so the camera revolves
around the centered character while staying aimed at it. A nested camera adds
subtle mouse parallax. This mirrors the spline-driven rig from the credited
project below; the ring curves are generated procedurally so they can later be
replaced with Blender-authored paths.

## Credits

Character model (`Moving_Characters-transformed.glb`) and its baked texture
atlas (`Moving_Characters_1.webp`) are reused from
[Aimee Wei's Papercraft World](https://github.com/heyditto) by Andrew Woan,
licensed under the MIT License (Copyright (c) 2026 Andrew Woan). The
scroll-driven dual-spline camera approach is adapted from the same project.
