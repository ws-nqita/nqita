# nqita web

This app is the live surface for `nqita.wokspec.org`.

## Direction

The website should not feel like a generic SaaS landing page.

It should feel like:

- a pink pixel environment
- a waitlist-first surface
- a living control room for Nqita
- a project hub for artists, runtime engineers, and plugin builders

## Canonical product framing

- Nqita is pronounced `Nick-ee-tah`
- Nqita starts in the terminal
- Nqita becomes a local daemon-backed OS companion
- privacy is local-first by default
- Web3 features are optional and plugin-based, not core identity

## Site editing surface

Primary homepage:

- `src/app/page.tsx`
- `src/content/site.ts`
- `src/app/globals.css`

## Assets

Tracked public assets live in:

- `public/nqita-sprites/`

Raw user drop folders currently live at the platform root and are intentionally not committed:

- `../../nqitasprites/`
- `../../site assets/`

## Local work

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```
