# Joseph Prada - profile landing page

Bilingual (ES/EN) single-page professional profile. React 19 + Vite, Bun as
runtime and package manager, Biome for lint and format.

## Commands

```bash
bun install
bun run dev
bun run build
bun run lint
bun run format
```

## Structure

```
src/
  i18n/content.ts          every visible string, both languages
  i18n/LanguageProvider    language state, persisted, drives <html lang> and meta
  lib/scroll.ts            Lenis + GSAP ScrollTrigger handshake
  components/sections/     one file per page section
public/hero/frames/        72 WebP stills scrubbed by the hero canvas
assets-src/                original source assets (video, logo, CV)
```

## Hero frame sequence

The hero is a scroll-scrubbed frame sequence rather than a `<video>`, because
tying `currentTime` to scroll stalls on Safari and mobile. The source clip is
pre-extracted to 72 WebP stills (~1.4 MB total) painted on a canvas.

To regenerate the frames from a new clip:

```bash
ffmpeg -i assets-src/<clip>.mp4 -vf "crop=1280:658:0:0,fps=9" -c:v libwebp -quality 92 -compression_level 6 -f image2 public/hero/frames/f%03d.webp
```

The `crop` removes the generator watermark from the bottom of the frame. Keep
the stills at the source's native 1280 width and do not downscale them: the clip
is only 720p and the canvas already upscales it roughly 2.3x on a retina
display, so any resolution given up before encoding shows as mush on the face.
Quality 92 is deliberate for the same reason. Sharpening filters were tried and
rejected, they ring around the hairline.

The canvas also sets `imageSmoothingQuality = "high"`; Chrome defaults it to
`"low"`, which undoes most of the above. It is reapplied on every resize because
resizing the backing store resets context state.

If the frame count changes, update `FRAME_COUNT` in
`src/components/sections/Hero.tsx`.

`START_FRAME` is 0 on purpose. The clip has real motion blur while the subject
walks, so the mid-walk stills are genuinely soft (roughly half the edge energy
of the settled ones, measured with a Laplacian). Opening the sequence mid-walk
freezes that softness at the top of the page. Starting at 0 trades a nearly
empty first paint for the guarantee that every resting position is sharp. Do
not "fix" the empty opening by raising `START_FRAME` without checking the
sharpness of the frame you land on.

The mobile still is a separate crop whose right edge falls near the centre of
the subject's face. Regenerate it alongside the frames:

```bash
ffmpeg -i public/hero/frames/f072.webp -vf "crop=304:658:610:0" -c:v libwebp -quality 92 -f image2 public/hero/poster-mobile.webp
```

**Horizontal framing on mobile lives in that crop offset (`581`), not in CSS.**
Phone viewports are proportionally wider than the 304x658 crop, so object-cover
scales it to the container width exactly and leaves zero horizontal overflow.
`object-position` can only shift an image along an axis where it overflows, so
its X component is inert here, and a `translate` would just expose a gap. To
move the subject sideways, change the crop offset: raising it slides the window
right in source space, which renders the subject further left. Five source
pixels is roughly five to six CSS pixels on a typical handset.

The `object-right-top` utility on that image is kept for its `top` half, which
is not inert: it stops object-cover from centring the vertical overflow and
slicing the head off on handsets proportionally wider than the crop.

Below `md`, and whenever `prefers-reduced-motion` is set, the canvas is replaced
by `public/hero/poster.webp` and no frames are downloaded.

## Two scroll rules that must not be reverted

`body` uses `overflow-x: clip`, not `hidden`. On body, `hidden` promotes the
element to a scroll container (its computed `overflow-y` resolves to `auto`),
which moves the scrolling element off the document and breaks touch scrolling on
mobile. `clip` suppresses horizontal overflow without creating a scroll
container.

Lenis only runs behind `(hover: hover) and (pointer: fine)`. Touch devices have
momentum scrolling that beats anything Lenis interpolates, and layering the two
only adds a place for touch handling to fail.

Neither of these is observable through programmatic `window.scrollTo`, so a
passing scripted scroll test proves nothing about them. Check on a real handset.

## Typography note

Display type is Anton, which places its acute accents high. Display line-height
is locked at 1.12 in `src/index.css`; below ~1.10 the marks on CÓDIGO, ESTÁ and
DISEÑO collide with the line above. Two headlines override it with a tighter
value on purpose (the hero name and the contact headline) because neither
contains a diacritic. Check that before changing either string.

## Still needed

- LinkedIn and GitHub profile URLs (the footer omits both rather than linking
  them to the wrong destination).
- A signed-in screenshot of JP-WALLET. The current image is the login screen,
  since the app is behind Google auth.
