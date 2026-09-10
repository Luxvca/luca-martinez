# Memorial

A single self-contained page. Open `index.html` by double-clicking it — no server, no build step,
no internet connection required. It also works hosted statically, unchanged.

Nothing here is part of the Next.js portfolio. This folder sits outside `public/`, so Vercel does
not serve it and it is not reachable from the portfolio site.

---

## Design decisions

**Depth is built with CSS 3D transforms, not WebGL.** Real perspective, real Z-positioning, real
parallax — but text and photographs stay natively sharp rather than being resampled into textures on
planes, which matters for a page carried by serif type and old photographs. It also loads near-
instantly, holds 60fps on a phone, adds no library, and works when the file is double-clicked.
Modern Three.js is ESM-only, and ES modules are blocked under `file://`, so a CDN `<script>` tag
cannot load it from a double-clicked file at all — a WebGL build would mean inlining a ~600KB bundle
and giving up sharp type.

**Light, not dark.** Off-white near you, eggshell in the distance. Depth reads as atmospheric
perspective: distant memories wash out toward the background and soften, the way distance behaves
in real air. Nothing has a hard edge — surfaces are gradients that dissolve before they reach one,
and photographs are feathered into the page rather than cropped into rectangles.

**The engine knows nothing about whose memorial it is.** Everything personal — name, dates, opening
line, nicknames — lives in a `SITE` block next to `MEMORIES`. Nothing below those two blocks
references a specific person. A different memorial is therefore a different data file against the
same engine: copy the folder, replace `SITE`, `MEMORIES` and `media/`, and it is someone else's
timeline.

---

## Adding a memory

Open `index.html` in any text editor. Near the top there is one block:

```js
const MEMORIES = [ ... ];
```

Everything above it is configuration; everything below the marked line is machinery you never need
to touch. Add an object to that array, drop the files into `media/`, save, refresh.

### The memory shape

**Every field is optional.** Leave out anything you don't have — omit the line entirely rather than
leaving it empty.

```js
{
  date:  "Summer 1994",           // read by the viewer, and orders the timeline
  title: "The kitchen in Reseda",
  text:  "She always...",         // any length; line breaks preserved
  image: "kitchen.jpg",           // or several: ["a.jpg", "b.jpg"]
  audio: "voicemail-01.m4a",
  video: "birthday.mp4",
  caption: "Her voice, March",    // small line under audio when there's no other text
  sort:  "1994-06-12"             // only if the timeline lands in the wrong order
}
```

### How a memory renders itself

There are no memory "types." The page looks at which pieces are present and composes from that. The
same object is a full immersive moment or a single line of text depending only on what it holds.

| What's present          | How it presents                                        |
|-------------------------|--------------------------------------------------------|
| image + audio + text    | Immersive — image, audio fading in, text below          |
| image only              | A still, quiet page                                     |
| audio + short text      | Her voice, with the text as a caption                   |
| text only               | A written fragment floating in the air, with no surface |
| video (± anything)      | Video takes the visual slot; images are skipped         |
| several images          | A slow sequence, not a grid                             |

Missing pieces are never rendered as empty containers, placeholder frames, or broken controls. A
file that fails to load is struck off and the memory recomposes as though that piece were never
there — so a typo in a filename degrades to a quieter layout instead of a broken player.

---

## Ordering

`date` both orders the timeline and is what people read — a year is read out of it automatically,
so `"Summer 1994"` and `"March 2001"` sort correctly on their own.

Add `sort` only when that isn't enough: two memories in the same year that need a specific order, or
a date with no year in it. `sort` accepts `"1994"`, `"1994-06"`, or `"1994-06-12"`.

Memories with no usable date at all keep the order you wrote them in.

---

## Media

```
mom-memorial/
├── index.html          ← the whole site
├── fonts/              ← Cormorant Garamond + Manrope, for offline use
└── media/
    ├── audio/          voicemails and recordings
    ├── images/         photographs, scans, drawings
    └── video/          clips
```

Paths in the data block are relative to `media/`, so `"audio/voicemail.m4a"` means
`media/audio/voicemail.m4a`. A bare `"voicemail.m4a"` means `media/voicemail.m4a` — the subfolders
are a convenience, not a requirement. Organise however you like.

**Name files in lowercase with hyphens, no spaces** — `voicemail-march.m4a`, not
`Voicemail March.m4a`. Spaces work only when URL-encoded and are a reliable source of silent
breakage.

### Formats that actually play in a browser

Getting this wrong produces a control that appears but never plays.

| Type   | Use            | Will NOT work                                 |
|--------|----------------|-----------------------------------------------|
| Audio  | `.m4a`, `.mp3` | `.amr`, `.3gp` (common voicemail exports)      |
| Images | `.jpg`, `.png`, `.webp` | `.heic` (default iPhone photo format) |
| Video  | `.mp4` (H.264) | `.mov` HEVC (default iPhone video)            |

Convert with `ffmpeg`, preserving the originals:

```sh
ffmpeg -i voicemail.amr  -c:a aac -b:a 192k voicemail.m4a
ffmpeg -i photo.heic     -q:v 2                photo.jpg
ffmpeg -i clip.mov       -c:v libx264 -crf 20 -c:a aac clip.mp4
```

Keep untouched originals somewhere outside this folder. Conversion is lossy and one-way.

---

## Privacy

**The repository this lives in is public** (`Luxvca/luca-martinez`, deployed at
`luca-martinez.vercel.app`). Any media committed here is publicly downloadable and indexable by
search engines.

`media/` is therefore git-ignored. Real photographs and recordings stay on your machine and go
straight to whatever host you choose, never through this repository.

---

## Fonts

`fonts/` holds local copies of Cormorant Garamond and Manrope, taken from the portfolio. The page
loads these from disk, so typography is identical offline and the page makes no network requests of
any kind. The Google Fonts link in the head is a fallback that only matters when hosted.
