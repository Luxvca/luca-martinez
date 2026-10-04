# Homepage lettering

The homepage currently uses the restored deboss from commit `1d9c0d3`, including
its blue fill and mobile highlight refinement.

The saved `components/EmbossTitle.js` renders raised lettering using a blurred positive
height field and central-difference lighting from the supplied Realistic emboss
reference. Defaults live in `EMBOSS_DEFAULTS`. Its transparent highlight/shadow
overlay preserves the page's background and grain without adding a face color.
The latest tighter settings are preserved: depth 0.78, size 0.7, soften 0.12.

The previous deboss is preserved unchanged in `components/DebossTitle.js` and
`components/deboss-field.js`, with its tuning page at `/deboss-lab` in development.
The complete saved deboss version is also in Git commit `1d9c0d3`.

To try the saved emboss again, replace the `DebossTitle` import and JSX component
name with `EmbossTitle` in `components/Hero.js` and `components/ProjectList.js`.
Both components accept the same `word` and `className` props; the emboss CSS is
retained alongside the active deboss CSS. No other page changes are needed.
