# Wick

Wick is a browser survival game about one lamplighter holding back a living night. Move through an endless moonlit field while an expanding arsenal fires automatically, gather fallen light, grow stronger, open elite chests, and keep the flame alive until dawn at ten minutes.

The game is fully self-contained. Its pixel art, animated enemy and effect sheets, synthesized sound effects, looping ambient hum, and 32-second musical nocturne are committed under `assets/` and bundled into the static build.

## Install and run

```bash
npm ci
npm run dev
```

Open the local address Vite prints. To create and preview the production build:

```bash
npm run build
npm run preview
```

The deployable site is written to `dist/`; it works at a server root or beneath a sub-path.

## Controls

- Move: `WASD` or arrow keys
- Confirm/select: `Enter` or `Space`
- Back: `Escape`
- Pause/resume: `P`
- Mute: `M`
- Diagnostics: backtick (`` ` ``)

Menus also support mouse, pen, and touch. Touch devices receive an on-screen directional pad and menu controls.

## Quality checks

```bash
npm run typecheck
npm run lint
npm run format
npm test
```
