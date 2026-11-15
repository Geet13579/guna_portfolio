# GUNANIDHI BHOJ — The Cinematic Universe

An immersive cyberpunk-cinematic 3D portfolio for **Gunanidhi Bhoj**, Director of Photography (Raipur, Chhattisgarh).

**Stack:** React 18 · Vite · Three.js · React Three Fiber · Drei · postprocessing · GSAP + ScrollTrigger · Framer Motion · Lenis · Tailwind CSS · Lucide

All content comes from the CV. No awards, clients, specifications or proficiency percentages are invented.

---

## Quick start

Requires **Node.js 18+**.

```bash
npm install        # install dependencies
npm run dev        # development server  → http://localhost:5173
npm run build      # production build    → ./dist
npm run preview    # serve the production build locally
```

---

## Project structure

```
src/
  config/site.js          ← ALL content & asset paths live here
  App.jsx                 ← page composition, intro gate, smooth scroll
  index.css               ← global styles (HUD panels, glitch, grain…)
  lib/
    scroll.js             ← Lenis + GSAP ScrollTrigger setup
    ambient.js            ← original generated ambient audio (Web Audio)
  hooks/useEnv.js         ← WebGL / reduced-motion / mobile / in-view hooks
  components/
    Intro.jsx             ← camera boot, aperture, name reveal, skip
    Hero.jsx              ← hero copy + lazy 3D scene
    three/HeroScene.jsx   ← 3D cinema camera, city, particles, post-FX
    three/EquipmentScene.jsx ← per-card 3D equipment models
    Showreel.jsx · About.jsx · Projects.jsx · ProjectModal.jsx
    Equipment.jsx · Skills.jsx · Experience.jsx · Contact.jsx · Footer.jsx
    Nav.jsx · Cursor.jsx · Overlays.jsx · BackToTop.jsx · LensFallback.jsx
```

---

## Asset replacement guide

Static files go in `public/` (create a `public/media/` folder). Reference them with a leading slash, e.g. `/media/showreel.mp4`. Everything below is edited in **`src/config/site.js`**.

| What | Where in `site.js` | Notes |
| --- | --- | --- |
| Showreel video | `showreel.src` | `.mp4` / `.webm` path or hosted URL. Empty → generated placeholder reel. |
| Showreel poster | `showreel.poster` | Shown before the video loads. |
| Project thumbnail | `projects[n].thumbnail` | Any image. Replaced independently per project. |
| Project video | `projects[n].video` | Plays on card hover and in the full-screen view. |
| Equipment photo | `equipment[n].image` | Replaces the 3D model with a photo (optional). |
| Equipment details | `equipment[n].info` | Array of `['LABEL', 'value']` pairs. Only add verified specs. |
| Social links | `socials[n].url` | Empty → shown as a “soon” placeholder. |
| Contact form | `contactForm.endpoint` | Empty → opens the visitor’s mail app. Set to Formspree/Getform/etc. to POST JSON. |
| Portrait | `src/components/About.jsx` (`Portrait`) | Swap the placeholder block for an `<img src="/media/portrait.jpg" />`. |

**Tips**
- Compress video (H.264 MP4, ≤ 10 MB for the reel is ideal) and images (WebP/AVIF, ~1600 px wide).
- Videos only load when near the viewport; project videos only load on hover/open.

### Replacing the 3D camera with a real model (optional)
Export a compressed `.glb` (Draco/Meshopt), place it in `public/models/`, and load it in `HeroScene.jsx` with `useGLTF('/models/camera.glb')` in place of `<CinemaCamera />`.

---

## Sound
Sound is **OFF by default**. The toggle in the top bar starts an original ambient drone generated in the browser with the Web Audio API — no audio files, nothing to license.

---

## Performance & accessibility
- 3D scenes are code-split and lazy-loaded; they pause when off-screen.
- Mobile uses a lower pixel ratio, fewer particles and skips depth-of-field.
- `prefers-reduced-motion`: native scrolling, no auto-rotation, no grain/glitch animation, static particles, shortened intro.
- No WebGL (or a 3D error) → automatic 2D lens fallback; the rest of the site is unaffected.
- Keyboard: `Esc` / `Enter` skips the intro; `←` `→` `Esc` navigate the project viewer.

---

## Deployment

The build output (`dist/`) is a static site and works on any static host.

**Netlify** — build command `npm run build`, publish directory `dist`.

**Vercel** — framework preset *Vite* (build `npm run build`, output `dist`).

**GitHub Pages**
1. If deploying to `https://<user>.github.io/<repo>/`, set `base: '/<repo>/'` in `vite.config.js`.
2. `npm run build`, then publish the `dist/` folder (e.g. with the `gh-pages` package or a GitHub Action).

**Any server** — upload the contents of `dist/`. No server-side code is required.

---

## Contact details used on the site
Phone `+91 7999313761` · Email `gunanidhi.bhoj048@gmail.com` · Raipur, Chhattisgarh, India (edit in `src/config/site.js`).
