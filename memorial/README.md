# Memorial

A single self-contained page. Open `index.html` by double-clicking it — no server, no build step,
no internet connection required.

Nothing here is part of the Next.js portfolio. This folder sits outside `public/`, so Vercel does
not serve it and it is not reachable from the portfolio site.

---

## Design decisions

**Depth is built with CSS 3D transforms, not WebGL.** Real perspective, real Z-positioning, real
parallax — but text and photographs stay natively sharp rather than being resampled into textures on
planes, which matters for a page carried by serif type and old photographs. It also loads near-
instantly, holds 60fps on a phone, adds no library, and works when the file is double-clicked.
(Modern Three.js is ESM-only, and ES modules are blocked under `file://`, so a WebGL build would
require inlining a ~600KB bundle.) Atmospheric WebGL — drifting dust, distance haze — can be layered
behind the cards later without disturbing any of this.

**The engine knows nothing about whose memorial it is.** Everything personal — name, dates, opening
line, accent colour — lives in a `SITE` block next to `MEMORIES`. Nothing below those two blocks
references a specific person. A different memorial is therefore a different data file against the
same engine: copy the folder, replace `SITE`, `MEMORIES` and `media/`, and it is someone else's
timeline. This costs nothing to maintain and keeps that door open.

---

## Adding a memory

Open `index.html` in any text editor. At the very top there is one block:

```js
const MEMORIES = [ ... ];
```

Everything above it is configuration; everything below it is machinery you never need to touch.
Add an object to that array, drop the files into `media/`, save, refresh. That's the whole workflow.

### The memory shape

Every field is optional except `sort`. Leave out anything you don't have — omit the line entirely
rather than leaving it empty.

```js
{
  sort:  "1994-06",              // REQUIRED. Orders the timeline. See "Dates" below.
  date:  "Summer 1994",          // What the viewer reads. Free text. Omit to show nothing.
  title: "The kitchen in Reseda",// Short heading. Omit for an untitled moment.
  text:  "She always...",        // Body. Any length. Line breaks are preserved.
  audio: "audio/voicemail-01.m4a",
  images: ["images/kitchen.jpg"],// One or many. Many becomes a quiet sequence.
  video: "video/birthday.mp4",
  caption: "Her voice, March"    // Small line under audio when there's no other text.
}
```

### How a memory renders itself

There are no memory "types." The page looks at which pieces are present and composes from that.
The same object is a full immersive moment or a single line of text depending only on what it holds.

| What's present          | How it presents                                        |
|-------------------------|--------------------------------------------------------|
| image + audio + text    | Immersive — image fills, audio fades in, text below     |
| image only              | A still, quiet page                                     |
| audio + short text      | Her voice, with the text as a caption                   |
| text only               | A written fragment floating in the space                |
| video (± anything)      | Video takes the visual slot; audio field is ignored     |
| several images          | A slow sequence, not a grid                             |

Missing pieces are never rendered as empty containers, placeholder frames, or broken controls.

---

## Dates

`sort` orders the timeline. `date` is what people read. They are deliberately separate, because most
old photographs have no real date and the timeline should not demand a precision that doesn't exist.

- `sort` accepts `"1994"`, `"1994-06"`, or `"1994-06-12"` — whatever precision you actually have.
- If you only know roughly, guess the year and write the truth in `date`:
  `sort: "1997"`, `date: "Sometime in the late nineties"`.
- Two memories sharing a `sort` value keep the order you wrote them in.

---

## Media conventions

Files go in `media/audio/`, `media/images/`, `media/video/`. Paths in the data block are relative to
`media/`, so `audio: "audio/voicemail-01.m4a"`.

**Name files in lowercase with hyphens, no spaces** — `voicemail-march.m4a`, not `Voicemail March.m4a`.
Spaces work only when URL-encoded and are a reliable source of silent breakage.

### Formats that actually play in a browser

Getting this wrong produces a control that appears but never plays — the exact failure this site
must not have.

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

`media/` is therefore git-ignored by default. Real photographs and recordings stay on your machine
and are uploaded directly to whatever host you choose, never through this repository — unless you
decide otherwise and we change the ignore rule deliberately.

Placeholder files used by the seed memories are the one exception, and are committed explicitly.

---

## Fonts

`fonts/` holds local copies of Cormorant Garamond and Manrope, taken from the portfolio. The page
loads these from disk rather than from Google Fonts, so typography is identical offline and the page
makes no network requests of any kind.
