---
name: La Ruche by InovElite
description: The launch film's night: a navy honeycomb where electric-blue light flows between cells, and one red cell is always the reseller.
colors:
  night-950: "#04061a"
  night-900: "#070a1f"
  night-850: "#0a0f2c"
  night-700: "#151d4a"
  night-600: "#1e2860"
  line: "rgba(127, 160, 255, 0.14)"
  line-strong: "rgba(127, 160, 255, 0.3)"
  blue: "#2b59ff"
  blue-hi: "#4f75ff"
  blue-soft: "#7fa0ff"
  ice: "#c9d6ff"
  ink: "#f2f5ff"
  muted: "#a3add3"
  signal: "#ff2d55"
  signal-strong: "#e5174b"
  signal-deep: "#c80f3c"
  signal-text: "#ff6b86"
  ok: "#34d399"
  paper: "#ffffff"
  paper-ink: "#0a0f2c"
  paper-muted: "#4b5578"
  paper-line: "#e4e8f1"
  stamp-green: "#0b7a55"
typography:
  display:
    fontFamily: "Poppins, Avenir Next, Segoe UI, sans-serif"
    fontSize: "clamp(2.5rem, 1.1rem + 4.4vw, 4.75rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Poppins, Avenir Next, Segoe UI, sans-serif"
    fontSize: "clamp(1.95rem, 1.25rem + 2.7vw, 3.45rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Poppins, Avenir Next, Segoe UI, sans-serif"
    fontSize: "clamp(1.6rem, 1.2rem + 1.4vw, 2.3rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  title-sm:
    fontFamily: "Poppins, Avenir Next, Segoe UI, sans-serif"
    fontSize: "clamp(1.12rem, 1rem + 0.45vw, 1.35rem)"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.015em"
  figure:
    fontFamily: "Poppins, Avenir Next, Segoe UI, sans-serif"
    fontSize: "clamp(2.6rem, 1.8rem + 3.2vw, 4.2rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.04em"
    fontFeature: "\"tnum\""
  wordmark:
    fontFamily: "Poppins, Avenir Next, Segoe UI, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.04em"
  lead:
    fontFamily: "Inter, Segoe UI, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(1.06rem, 0.98rem + 0.4vw, 1.3rem)"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Inter, Segoe UI, system-ui, -apple-system, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "\"cv11\", \"ss01\""
  label:
    fontFamily: "Inter, Segoe UI, system-ui, -apple-system, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 550
    lineHeight: 1.4
  data-label:
    fontFamily: "Inter, Segoe UI, system-ui, -apple-system, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.08em"
    fontFeature: "\"tnum\""
rounded:
  tag: "6px"
  inner: "12px"
  sheet: "14px"
  md: "16px"
  lg: "24px"
  pill: "999px"
spacing:
  gutter: "clamp(1.25rem, 4vw, 3rem)"
  section: "clamp(5.5rem, 3.5rem + 8vw, 10.5rem)"
  header: "72px"
  wrap: "1240px"
  header-wrap: "1360px"
  card-pad: "clamp(1.25rem, 2.5vw, 2rem)"
  grid-gap: "1rem"
components:
  button-signal:
    backgroundColor: "{colors.signal-strong}"
    textColor: "#ffffff"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 1.5rem"
    height: "52px"
  button-signal-hover:
    backgroundColor: "{colors.signal-deep}"
    textColor: "#ffffff"
  button-ghost:
    backgroundColor: "rgba(127, 160, 255, 0.06)"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 1.5rem"
    height: "52px"
  button-ghost-hover:
    backgroundColor: "rgba(127, 160, 255, 0.12)"
    textColor: "#ffffff"
  button-sm:
    rounded: "{rounded.pill}"
    padding: "0 1.1rem"
    height: "42px"
  button-lg:
    rounded: "{rounded.pill}"
    padding: "0 1.9rem"
    height: "58px"
  actor-pill:
    backgroundColor: "rgba(7, 10, 31, 0.74)"
    textColor: "{colors.ice}"
    rounded: "{rounded.pill}"
    padding: "0 0.85rem 0 0.7rem"
    height: "34px"
  actor-pill-active:
    backgroundColor: "rgba(21, 29, 74, 0.9)"
    textColor: "#ffffff"
  hex-cell:
    backgroundColor: "rgba(127, 160, 255, 0.18)"
    width: "22px"
    height: "25px"
  hex-cell-lit:
    backgroundColor: "{colors.blue}"
  request-card:
    backgroundColor: "rgba(21, 29, 74, 0.92)"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "1rem 1.15rem"
  quote-paper:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.paper-ink}"
    rounded: "{rounded.sheet}"
    padding: "1.1rem 1.15rem 1rem"
    width: "440px"
  report:
    backgroundColor: "{colors.night-850}"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "{spacing.card-pad}"
  ledger:
    backgroundColor: "{colors.night-950}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "1.25rem"
  tier:
    backgroundColor: "rgba(7, 10, 31, 0.7)"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "clamp(1.5rem, 2.5vw, 2rem)"
  chip:
    backgroundColor: "rgba(43, 89, 255, 0.14)"
    textColor: "{colors.ice}"
    rounded: "{rounded.pill}"
    padding: "0.38rem 0.75rem"
  field:
    backgroundColor: "{colors.night-950}"
    textColor: "{colors.ink}"
    rounded: "{rounded.inner}"
    padding: "0.75rem 0.95rem"
    height: "50px"
  choice-pill:
    textColor: "{colors.muted}"
    rounded: "{rounded.pill}"
    padding: "0 1rem"
    height: "42px"
  choice-pill-checked:
    backgroundColor: "rgba(43, 89, 255, 0.22)"
    textColor: "#ffffff"
  film-close:
    backgroundColor: "rgba(10, 15, 44, 0.9)"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    size: "44px"
---

# Design System: La Ruche by InovElite

## Overview

**Creative North Star: "The Night Hive"**

Every surface is the launch film's night: a deep navy honeycomb where electric-blue light lives inside cells and travels between them along dotted arcs. Information is light. When something is known, available or done, its cell lights and breathes; when it moves from one actor to another, a cluster of bright packets runs along a dotted arc. Exactly one cell in the world is red, and it is always "Vous", the reseller. The only other red thing is the button that asks for a demo.

Density is calm and editorial: wide night sections (up to 10.5rem of vertical rhythm), one idea per section, asymmetric two-column compositions, and dense data only inside its own instruments (the quote sheet, the ledger, the monthly report). Depth comes from stepping between navy tones and from emitted light, not from lifted cards. The single paper surface in the world is the white quote sheet and the documents it produces; everything else stays in the night.

Type pairs the film's own faces: Poppins carries headlines, figures and the wordmark; Inter carries reading text and data, with tabular figures for every count, time and amount.

**Key Characteristics:**
- Navy ground in four steps (#04061a to #151d4a); electric blue is light, never fill-for-fill's-sake.
- The pointy-top hexagon is the structural unit for actors, kit items, quotas, steps, badges, rooms and bullets.
- Lit, breathing cells are the state signal; dim cells are potential.
- Dotted arcs with travelling packet clusters are the grammar of information flow.
- One red cell (Vous) and one red action (the demo); nothing else is red by choice.
- Pills act, cells mean: interactive controls are pills, meaning-bearing units are hexagons.

## Colors

A cold night palette in which blue is light, ice is data, and red is a person.

### Primary
- **Hive Electric Blue** (`blue`): the light of the hive. Fills lit hex cells, signed configurations, used quota cells, the hub and core hexes, step markers, checked controls and the featured-tier flag. Always reads as something switched on.
- **Lit Cell Highlight** (`blue-hi`): the top stop of the lit-cell gradient (`blue-hi` to `blue`), giving every lit hexagon a faint top-lit volume.
- **Soft Signal Blue** (`blue-soft`): the most-used accent. Links, icons, dotted arc bases, hover borders, focus-adjacent borders, the second line of the hero and closing headlines, timestamps and ledger column heads.

### Secondary
- **Vous Red** (`signal`): the reseller's cell. The raised red cell in the hero hive, the "Vous" actor dot, the red node in the ecosystem chain, the reseller figure in the expert relay, the red core in the wordmark.
- **Demo Red** (`signal-strong`): the fill of every "Demander une démo" action. Chosen over `signal` because white text on it passes WCAG AA; this is the only red fill a control may carry.
- **Demo Red Pressed** (`signal-deep`): hover state of the demo button.
- **Vous Red Text** (`signal-text`): red as text on navy, legible at small sizes: the "VOUS" caption tag in the hero.

### Tertiary
- **Available Green** (`ok`): in stock, kept, traced. Small dots, check icons in the ledger, the margin result, "kept" sources. Never a fill larger than a tag.
- **Stamp Green** (`stamp-green`): the "Devis prêt" stamp and totals column on the white quote sheet, where `ok` would fail contrast.

### Neutral
- **Abyss Navy** (`night-950`): the deepest ground. Hero, ecosystem, origin, closing and footer sections; form field wells; the ledger body.
- **Film Night** (`night-900`): the page ground and default section background.
- **Hive Navy** (`night-850`): raised ground for the "how it works" band, offers, scene panels and the problem scene.
- **Cell Navy** (`night-700`): solid fill for raised cards on the night (request card, kit items, reference pills at 0.9 to 0.95 alpha) and the film close hover.
- **Unlit Cell Navy** (`night-600`): unlit timeline cells and the scrollbar thumb.
- **Hairline** (`line`): default 1px dividers and quiet card borders.
- **Hairline Strong** (`line-strong`): borders on controls, panels and instruments.
- **Ice** (`ice`): data on the night. Actor pill text, chip text, kit labels, captions and the focus ring.
- **Starlight Ink** (`ink`): primary reading text.
- **Haze** (`muted`): secondary text, leads, metadata, inactive tabs.
- **Quote Paper** (`paper`), **Paper Ink** (`paper-ink`), **Paper Muted** (`paper-muted`), **Paper Rule** (`paper-line`): only on the white quote sheet and its document chips.

### Named Rules

**The One Red Cell Rule.** Red belongs to "Vous" and to the demo action, nowhere else. Status, alerts, deadlines, "now" markers, cost bars and day counters are blue, ice or muted; the build moved every one of them off red. Red fills on controls use `signal-strong` (#E5174B), never `signal`, because the button text must pass AA.

**The Ice Is Data Rule.** Values, labels inside instruments and pill text use `ice`, not white; white (`#fff`) is reserved for headlines, lit-cell glyphs and emphasised figures.

**The Only Paper Rule.** White surfaces exist only as the quote sheet and the documents it generates. No other white card, panel or section.

## Typography

**Display Font:** Poppins 600 / 700 (with Avenir Next, Segoe UI, sans-serif), self-hosted
**Body Font:** Inter variable 100–900 (with Segoe UI, system-ui, -apple-system, sans-serif), self-hosted, stylistic sets `cv11` and `ss01` on
**Label/Mono Font:** none distinct; data labels and timestamps use Inter with tabular figures

**Character:** The film's geometric display face gives headlines a confident, rounded broadcast voice; Inter keeps reading text and dense data neutral and exact.

### Hierarchy
- **Display** (700, `clamp(2.5rem, 1.1rem + 4.4vw, 4.75rem)`, 1.02, -0.035em): the hero H1 only, white, second clause in `blue-soft` on its own line. Drops to `clamp(2.2rem, 1.2rem + 5vw, 2.6rem)` under 560px.
- **Headline** (700, `clamp(1.95rem, 1.25rem + 2.7vw, 3.45rem)`, 1.08, -0.025em, balanced wrap): every section H2.
- **Title** (700, `clamp(1.6rem, 1.2rem + 1.4vw, 2.3rem)`, 1.1): step titles in the 01–04 sequence; tier names (1.7rem) and timeline titles (600, 1.35rem) sit on the same ladder.
- **Title Small** (600, `clamp(1.12rem, 1rem + 0.45vw, 1.35rem)`, -0.015em): feature titles, FAQ questions (1.08rem), room options, gains tabs.
- **Figure** (700, up to 4.2rem, 1, -0.04em, tabular): money and count heroes: report amount, tier quota, growth figure, day counter. Outlined step numerals (01–04) use the same face with a 1.5px `blue-soft` stroke and transparent fill.
- **Lead** (400, `clamp(1.06rem, 0.98rem + 0.4vw, 1.3rem)`, 1.55): the one paragraph under each H2, in `muted`, capped near 34–40rem.
- **Body** (400, 1.0625rem, 1.6): reading text, capped 30–46rem.
- **Label** (550–600, 0.82–0.94rem): buttons, pills, chips, nav links, field labels.
- **Data Label** (500, 0.72–0.78rem, 0.06–0.08em, uppercase, tabular): labels that sit inside an instrument and name a value: the hero caption actor tag, the request-card type, ledger column heads, the stage label. Never used above a section heading.

### Named Rules

**The Film Pairing Rule.** Poppins for headlines, figures and the wordmark; Inter for everything read. No third face.

**The Tabular Figures Rule.** Every timestamp, counter, quote line, amount and quota uses tabular numerals so values do not jitter as they animate or align in columns.

## Layout

Content sits in a centred wrap of `min(1240px, 100% - 2 × gutter)`; the fixed 72px header uses a wider 1360px track. Sections are full-bleed night bands with vertical padding `section` (5.5rem to 10.5rem), alternating `night-900`, `night-850` and `night-950` grounds, some with a soft radial blue light pool and a faint flat-top hex-tile pattern (60 × 34.64px, 7.5% `blue-soft` stroke) masked to fade at the band edges.

Compositions are asymmetric two-column grids (ratios like 0.9 : 1.1, 0.8 : 1.2, 0.7 : 1.3) with column gaps of `clamp(2rem, 5–6vw, 5–6rem)`. Two sequences are pinned: the "gather" field is a 270vh sticky scene, and the 01–04 steps scroll beside a sticky stage frame. Features use a 12-column bento (5/7, 7/5, 6/6) with 1rem gaps.

Responsive rules, as shipped:
- **Under 1200px:** the nav collapses to a 44px toggle; the list drops as a full-width blurred panel under the header with 48px rows and a full-width demo button.
- **Under 1024px:** feature bento becomes two equal columns.
- **Under 900px:** every two-column grid stacks to one column. The hero becomes a mobile hive band: the canvas sits behind a gap of `clamp(230px, 64vw, 300px)` between the H1 and the lead, masked top and bottom, with no scroll parallax. The steps' stage becomes sticky under the header above the text. The gather scene unpins. Tiers, ledger (2 columns with inline column titles), timeline (vertical, left rail) and forms stack. A persistent bottom demo bar appears once the hero leaves view.
- **Under 700px:** the ecosystem chain turns vertical (nodes right-aligned in a column beside the hub hexagon), features go single-column, the footer nav goes to two columns.
- **Under 560px:** buttons may wrap to two centred lines (line-height 1.25); the email + demo pill splits into a stacked field and full-width button; the ledger goes to one column; form rows stack; actor pills shrink and drop their long label.

## Elevation & Depth

The system is tonal and luminous, not lifted. Depth is built by stepping navy grounds (`night-950` to `night-700`) and by translucent navy panels with hairline borders and occasional backdrop blur over the hive. Light, not shadow, signals importance: lit cells, hub hexagons and travelling packets emit blue glow because in this world they are light sources. Real cast shadows exist only on the quote paper and its document chips, which are physical sheets lying on the night.

### Shadow Vocabulary
- **Demo glow** (`0 10px 30px -12px rgba(255, 45, 85, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.18)`; hover `0 14px 38px -10px rgba(255, 45, 85, 0.75)`): red light pooling under the demo pill, as in the film. Brand exception.
- **Closing wordmark glow** (`text-shadow: 0 0 44px rgba(127, 160, 255, 0.55), 0 0 2px rgba(255, 255, 255, 0.5)`): the blue-white halo on the large LA RUCHE wordmark in the closing frame. Brand exception.
- **Cell light** (`drop-shadow(0 0 22–30px rgba(43, 89, 255, 0.55–0.7))`): hub and core hexagons; signed cells use `0 0 12px rgba(43, 89, 255, 0.8)`.
- **Packet light** (`drop-shadow(0 0 4–5px rgba(127, 160, 255, 0.9–0.95))`): the travelling dots on arcs and beams.
- **Paper drop** (`0 40px 70px -30px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.4)`): the quote sheet; document chips use `0 10px 20px -12px rgba(0, 0, 0, 0.8)`.
- **Focus halo** (`0 0 0 4px rgba(43, 89, 255, 0.2–0.25)`): fields and the hero email pill on focus.
- **Legibility veil** (`text-shadow: 0 2px 30px rgba(4, 6, 26, 0.6)` and stronger on the closing frame): dark, not luminous; keeps type readable over imagery.

### Named Rules

**The Light Not Shadow Rule.** Glow is emitted only by things that are lit in the world (cells, hubs, packets, the growth line). On interface chrome, exactly two glows are allowed: red under the demo pill and blue-white on the closing wordmark.

## Shapes

Two silhouettes carry the whole system. The **pointy-top hexagon** (`polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)`, or the SVG `50,4 90,27 90,73 50,96 10,73 10,27`) is the unit of meaning: actor and chain nodes (64 × 72px), kit items (50 × 56px), reference sources (52 × 60px), report and quota cells (22 × 25px), tier quota cells (14 × 16px), room cells (40 × 46px, offset rows), numbered steps (30–32 × 34–36px), badges, timeline markers and list bullets (10 × 11px). The honeycomb floor itself (the canvas hive plane and the background tile) is drawn flat-top, as a ground the pointy-top cells stand on.

The **pill** (999px) is the unit of action: buttons, nav links, actor pills, chips, choice pills, the email + demo field, flags. Panels and instruments use soft rectangles: 24px for section-level panels (report, ledger, tiers, features, form, stage), 16px for request cards, room options and tabs, 14px for the quote sheet and tickets, 12px for fields, inner tiles and icon wells, 6px for tags.

Lines are dotted when they carry information (arcs, beams, the expert relay, orbit rings in the gather field) and solid hairlines when they only divide.

## Components

### Buttons
- **Shape:** full pill (999px), 52px tall by default; small 42px, large 58px; Inter 600 at 1rem, trailing arrow icon that slides 3px right on hover; press scales to 0.98.
- **Primary (Demo):** `signal-strong` fill, white text, demo glow. Hover deepens to `signal-deep`. Focus ring switches to white. Used only for demo / pilot requests.
- **Ghost:** 6% blue-soft wash, `line-strong` border, `ink` text; hover 12% wash with `blue-soft` border.
- **Film link:** a 44px circular play well (16% blue wash) plus label and tabular duration; hover fills the well `blue` and scales it 1.08.

### Wordmark
- A 30px pointy-top hexagon in `blue` with a navy inner cell stroked `ice` and a small red core cell, beside "LA RUCHE" in Poppins 700 uppercase at 0.04em and "by InovElite" in 0.7rem `muted`. Large variant 40px / 1.5rem in the footer. The closing frame sets LA RUCHE alone at up to 6.75rem with the blue-white glow.

### Actor Pills (hero)
- Pills anchored over cells of the canvas hive: 34px tall, 74% navy glass with 6px blur, `line-strong` border, `ice` text, 8px dot with a 3px halo. They are real buttons. Hover, focus or active isolates that actor's flows: border `blue-soft`, 4px blue halo. The "Vous" pill has a red dot and red border and turns its halo red. A caption beside the hero names the active actor in a data label (red text for Vous) and says what it brings.

### Chips and Choice Pills
- **Chips:** pill, 14% blue fill, 35% blue-soft border, `ice` 0.82rem 550 text, optional 14px icon; the available variant uses an `ok` dot with green-tinted text.
- **Choice pills / room options:** unselected = `line-strong` border, `muted` text; hover `blue-soft` border; checked = 16–22% `blue` fill, `blue` border (room options add a 1px blue ring), white or `ice` text; focus ring `ice` 2px offset 3px.

### Request Card
- A 16px-radius cell-navy card centred in the problem scene: 42px icon well (12px radius, 20% blue), uppercase data label in `blue-soft`, white title, `muted` meta. Sits on the hex-tile ground with a soft blue light pool.

### Quote Paper
- The only white surface. 440px max, 14px radius, paper drop, tilted -1.2deg (flat on mobile). Brand row with a blue hex mark and a tabular reference; a table in 0.78rem tabular figures with `paper-line` rules, uppercase 0.7rem column heads, green totals and a 2px `paper-ink` total rule. The "Devis prêt" stamp is Poppins 700 uppercase in `stamp-green` with a 2px border, rotated -7deg, landing from scale 1.6 after a 700ms delay.

### Ledger
- A 24px-radius `night-950` table of four columns separated by hairlines; header row in `blue-soft` data labels on a 5% wash; each cell repeats its column title in Poppins 600 so it survives stacking; values as tabular figures with `ok` check icons and `muted` notes. Two columns under 900px, one under 560px.

### Monthly Report
- A 24px-radius panel on a navy vertical gradient with `line-strong` border. Head row (blue hex mark, title, tabular period), a hero amount in the Figure style, a KPI row divided by hairlines (rows, not nested cards), a strip of report cells where signed configurations light blue with cell light, and comparison bars (10px, 6px radius) that grow from the left over 1.2s.

### Tiers
- Three equal 24px-radius panels at 70% abyss with `line-strong` borders: Poppins name, quota figure at 3rem, a field of tiny quota cells, a hairline-ruled facts list, full-width button at the bottom. The featured tier adds a blue-to-abyss top gradient, a stronger border, a `blue` pill flag and a rotating conic light along its edge (6s, removed under reduced motion).

### Timeline
- Four columns on a 2px rail that is `blue-soft` for the elapsed segment and 28% blue-soft after; each item starts with a 20 × 22px hex marker (`night-600`, current = `blue-soft`), a tabular `blue-soft` date, a Poppins 600 title and an `ice` "now" pill. Under 900px the rail turns vertical on the left.

### Inputs / Fields
- **Style:** 50px min height, 12px radius, `night-950` well, `line-strong` border, `ink` text, placeholder `#8892bb`; textareas 120px min. Custom select with a muted chevron. Checkboxes are 22px, 6px radius, filling `blue` with a white tick.
- **Hover / Focus:** border to 50% blue-soft on hover; focus sets `blue-soft` border plus a 4px blue halo (no outline).
- **Error:** `aria-invalid` fields take a `signal-text` border with a 3px red halo; messages in `signal-text` 0.84rem; a summary box lists errors with links; status boxes switch to green or red tints for success or failure. Validation is the one place the build still uses red outside Vous and the demo; it is recorded here as shipped and unresolved, not as precedent for other states.
- **Hero email pill:** field and demo button fused in a single pill of navy glass; focus-within lights the whole pill border and halo.

### Navigation
- Fixed 72px header, transparent over the hero, turning to 82% night glass with 14px blur and a hairline once scrolled. Links are 42px pills in `muted` 0.94rem 500, hover / current = `ink` on an 8% blue wash; the demo button closes the row. Under 1200px a 44px bordered toggle opens the stacked panel.

### Film Dialog
- A native dialog up to 1120px wide over an 86% abyss backdrop with 10px blur; enters with a 420ms rise and scale from 0.97. Bar with Poppins title and a 44px round close; player with 16px radius, black ground and `line-strong` border; captions styled as navy chips; a collapsible transcript in a 12px-radius scroll well.

### Hex Cells and the Breathing State (signature)
- Unlit cells are a navy vertical gradient (`#24306e` to `#151d4a`, or 18% blue-soft for small cells). Lit cells use the `blue-hi` to `blue` gradient with white glyphs and breathe: brightness rises to 1.28 and back over 2.4s (3s for room cells, each with its own phase offset), `ease-in-out`, infinite. Waiting cells drop back to a dim indigo gradient and stop breathing. In the hero canvas the same logic drives per-cell glow sprites, with the Vous cell raised and lit red.

### Light Arcs and Packets (signature)
- Every arc is an SVG path with `pathLength="100"` and round caps. The base is a dotted track: 2px stroke, 55% `blue-soft`, `stroke-dasharray: 0 3.2` (beams: 50%, `0 2.4`). On top, a packet cluster is three white 3.5px dots in one dash pattern (`0 2.6 0 2.6 0 2.6 0 92.2`, beams `0 2.4 … 0 92.8`) with packet light, animated by `stroke-dashoffset` 100 → 0 over 1.8s linear, so a bright triplet runs along the track toward its destination. In the hero canvas the same grammar is drawn per frame: dotted trails plus three packets, each a six-dot fading comet; idle flows cycle actor by actor every 3.4s like the film.

### Motion and Reduced Motion
- Transitions use `ease-out` (cubic-bezier(0.16, 1, 0.3, 1)) at 180ms for colour and border, 560ms for movement and glow, 900ms for scene reveals; `ease-in-out` for breathing and pulses. Scenes enter with a 14px rise and a 0.985 scale; staggered items step by 70–140ms. On desktop the hero hive drifts down at 0.28× scroll speed (the lowering camera); it does not on mobile.
- Under `prefers-reduced-motion: reduce`, every animation and transition is collapsed to 0.01ms, packet and beam animations are removed, the featured-tier beam is hidden, the hero canvas renders one lit still with packets parked along their arcs, counters show their final value and pinned sequences jump to their end state.

## Do's and Don'ts

### Do:
- **Do** make every new unit of meaning (an actor, an item, a step, a quota, a status) a pointy-top hexagon, and every control a pill.
- **Do** signal "available / done / selected" by lighting the cell (`blue-hi` → `blue` gradient, white glyph, 2.4s breathe), not by adding a badge or colour block.
- **Do** draw any movement of information as a dotted `pathLength="100"` arc with a three-dot packet cluster travelling toward the receiver.
- **Do** fill demo and pilot actions with `signal-strong` (#E5174B) and white text, with the demo glow underneath.
- **Do** keep data text in `ice` and figures tabular; reserve pure white for headlines, lit-cell glyphs and emphasised values.
- **Do** split dense instruments into hairline-divided rows inside one panel.
- **Do** provide a lit still for every animated scene under reduced motion.

### Don't:
- **Don't** use red for alerts, deadlines, "now" markers, costs or counters; red is only Vous and the demo action.
- **Don't** put a red fill on any control other than a demo or pilot request.
- **Don't** add glows to buttons, text or panels beyond the demo pill and the closing wordmark; glow belongs to lit cells and packets.
- **Don't** introduce a second white surface; paper is only the quote and its documents.
- **Don't** nest cards inside cards; the report KPIs and feature details were rebuilt as rows for this reason.
- **Don't** set display text in a system face; Poppins and Inter are self-hosted and are the only faces.
- **Don't** place uppercase labels above section headings; uppercase data labels live only inside instruments.
