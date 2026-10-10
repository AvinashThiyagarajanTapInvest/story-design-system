# Story Page design language

A specification for pitch pages that read like a story: one scrolling column, numbered chapters, a sticky chapter rail, proof rebuilt as live mocks, and a presenter mode that shows one block at a time.

The source of truth for values is `src/tokens.css` and `src/story.css`. This document explains what those values are for, how the parts fit together, and the rules that keep a page honest and readable. When this document and the CSS disagree, fix whichever is wrong; don't leave them out of step.

---

## Contents

1. [What a story page is](#1-what-a-story-page-is)
2. [Principles](#2-principles)
3. [Narrative architecture](#3-narrative-architecture)
4. [Layout and vertical rhythm](#4-layout-and-vertical-rhythm)
5. [Typography](#5-typography)
6. [Colour](#6-colour)
7. [Shape, borders and depth](#7-shape-borders-and-depth)
8. [Icons](#8-icons)
9. [Motion](#9-motion)
10. [Components](#10-components)
11. [Navigation: rail, scroll spy, progress](#11-navigation-rail-scroll-spy-progress)
12. [Presenter mode](#12-presenter-mode)
13. [Responsive behaviour](#13-responsive-behaviour)
14. [Accessibility](#14-accessibility)
15. [Content and voice](#15-content-and-voice)
16. [Theming](#16-theming)
17. [Building, checking and shipping](#17-building-checking-and-shipping)
18. [Extending the system](#18-extending-the-system)

---

## 1. What a story page is

A story page is a single HTML file that makes one argument from top to bottom. It replaces a slide deck when:

- the audience is non-technical or mixed, and needs the *why* before the *how*;
- the page will be forwarded and read by people who never hear it presented;
- the proof (chats, terminal sessions, documents, numbers) matters more than decoration;
- the presenter wants to control pace in a meeting without a separate deck.

It is **not** a dashboard, a docs site or a landing page. It has one reading order, and every block exists to move the argument forward.

## 2. Principles

1. **Story, not slides.** Content flows in one column, in order. Chapters are numbered so the reader always knows where they are in the arc.
2. **Every heading is a sentence.** A chapter title states the claim ("Decks lose the room halfway through"), not a topic ("Problems"). Someone who reads only the headings should get the whole argument.
3. **Proof sits next to the claim.** A claim on the left, its evidence (a chat, a terminal, a chart) on the right, in a *scene*. Evidence is rebuilt as real text, never pasted as a screenshot.
4. **Visible at rest.** Content is fully visible without JavaScript. Animation only *replays* an entrance when a block scrolls into view. A page that fails to run its script still reads perfectly.
5. **Motion explains.** Each animation shows something true: messages arrive in order, a terminal types line by line, bars grow from zero, a flow line moves in the direction data moves. No motion for its own sake.
6. **Honest by construction.** Real, planned and illustrative are always visually distinct: filled versus dashed, green versus gold, and an "Illustrative" label on anything made up.
7. **Calm surfaces, one accent.** Paper, panel, hairline and ink do most of the work. The accent marks the subject of the story; gold and risk mark exceptions. Colour is rarely decoration.
8. **Works alone, works everywhere.** It reads without a presenter, on a phone, in light and dark, with reduced motion, and as one self-contained file.

## 3. Narrative architecture

### 3.1 The hierarchy

```
hero (#top)                         title, lede, meta, scroll cue
└─ chapter (section.chapter#chN)    one claim; numbered 01, 02, …
   ├─ chapter head (.ch-head)       big outlined number, sentence title, one-line lede
   ├─ sub-section (.sub#id)         one point inside the claim; has an h3 and optional .sub-lede
   │  └─ scene / grid / mock        the evidence for that point
   ├─ persona (article.persona#id)  one person's before → after, with a scene
   │  └─ continuation (.sub.cont)   deep-dives on that person, as siblings, never nested
   └─ closing (.closing)            the ask, in one sentence, on the last chapter only
footer (.foot)                      sources, and which parts are illustrative
```

### 3.2 The default arc

Eight or nine chapters. Rename freely, but keep the order of *kinds*:

| # | Kind | Job | Typical components |
|---|---|---|---|
| 01 | Problem | What was broken, in the audience's words | `.grid4` risk cards, `.pillars` + `.hub` |
| 02 | Turning point | The moment it clicked; where the idea came from | `.steps` (last one `.next`), `.quote` |
| 03 | What we built | Define it in one sentence, then show how it works | `.split` + `.big-def` + `.chat`, `.accented` cards, `.arch`, `.stages` |
| 04 | Proof | It already works, on something real | `.tl` timeline, thread `.chat`, `.stats`, `.caveats` |
| 05 | Where it goes | The expansion path, clearly planned | `.grid3` cards with `.pill.plan`, `.quote` |
| 06 | People | One persona per audience member | `.persona` + `.ba` + scene, `.sub.cont` deep-dives, `.swim` |
| 07 | Safety | Why it won't go wrong | `.layers` |
| 08 | Cost | What it costs, and why it stays flat | `.ledger` (`.tbl` + `.counter`), `.grid4` |
| 09 | Ask | Small, priced, reversible phases | `.phases`, `.closing`, `.foot` |

### 3.3 Pacing rules

- **One point per sub-section.** If a sub-section needs two scenes, it is two sub-sections.
- **One scene per point.** Not every paragraph needs a mock. A chapter usually has two to four sub-sections.
- **Alternate density.** Follow a dense block (a terminal, a table) with a light one (a quote, a stat row).
- **A quote closes a chapter** when the chapter ends on an idea rather than a fact (`.sub > .quote`, accent on the punchline).
- **Personas are parallel.** Every persona has the same parts in the same order: head with pills → before and after → scene. Readers learn the pattern once.
- **Deep-dives follow the persona, as siblings.** When one persona needs more (for example, how an engineer works), add `.sub.cont` blocks right after the `article.persona`, each with a `.cont-tag` naming the persona in their colour. Never nest a `.sub` inside a `.persona`: both are presenter stops, and nesting breaks J/K paging.
- **The hero says how long it takes** ("About 15 minutes") and how many parts there are.

## 4. Layout and vertical rhythm

### 4.1 The shell

```
┌────────────┬──────────────────────────────────────────────┐
│ rail 272px │ main: padding-inline clamp(16px, 5vw, 72px)  │
│ sticky     │   .col  max-width 1040px, centred            │
│ 100vh      │                                              │
└────────────┴──────────────────────────────────────────────┘
```

- `.shell` is a two-column grid: `272px minmax(0,1fr)`.
- `.rail` is `position: sticky; top: 0; height: 100vh`, scrolls on its own, with a right hairline. Padding `32px 20px 32px 24px`, gap `22px`.
- `main` gutter `clamp(16px, 5vw, 72px)`; bottom padding `120px` so the closing never hits the screen edge.
- `.col` caps the reading column at **1040px**. Prose inside is capped again by `ch` widths (see 5.3).
- A 3px reading-progress bar is fixed to the very top, above everything (`z-index: 40`).

### 4.2 Vertical rhythm

All spacing is in px and comes from this table. Don't invent new gaps.

| Element | Spacing |
|---|---|
| Hero | `padding-block: clamp(56px, 10vh, 120px) 72px`, internal gap `28px` |
| Chapter | `padding-block: 96px 24px`, `border-top: 1px solid var(--line)` |
| Chapter head | gap `14px`, `margin-bottom: 48px` |
| Sub-section | `padding-block: 40px` |
| Sub h3 → lede | `12px`; lede → content `28px` |
| Persona | `padding-block: 56px`, `border-top: 1px dashed var(--line)` |
| Persona head → body | `22px` |
| Continuation (`.cont`) | `padding-top: 8px` (it reads as part of the persona above) |
| Closing | `padding-block: 96px 40px`, gap `18px` |
| Footer | `margin-top: 40px`, `padding-top: 20px`, top hairline |
| Grid gaps | `16px` (grid3, grid4, stats, steps); `20px` (grid2); `10–12px` (vertical lists) |
| Scene gap | `32px`; split gap `40px`; ledger gap `40px` |
| Inside a card | padding `22px`, gap `10px` |
| Inside list rows (gate, layer, phase) | padding `14px 18px` to `18px 20px` |

Anchors land 24px below the top (`scroll-padding-top` and `scroll-margin-top: 24px`).

### 4.3 Grids

| Class | Columns | Use |
|---|---|---|
| `.grid4` | 4 equal | Problems, "why it stays flat", toolkit facts |
| `.grid3` | 3 equal | Jobs, parts, caveats, planned items |
| `.grid2` | 2 equal | A document next to a flow |
| `.scene` | `.95fr` / `1.05fr` | Claim or before/after on the left, mock on the right |
| `.split` | `1.1fr` / `1fr`, centred | Big definition next to a chat |
| `.ledger` | `1.3fr` / `1fr`, centred | Cost table next to the big counter |

Every grid track is `minmax(0, …)` and every grid child has `min-width: 0`, so long words and code never push the page wider than the screen.

## 5. Typography

### 5.1 Families

| Token | Family | Role |
|---|---|---|
| `--f-display` | **Bricolage Grotesque** (500, 700, 800; optical size 12–96) | All headings, chapter numbers, stats, avatars, the big counter |
| `--f-body` | **Source Sans 3** (400, 600, 700, italic 400) | Body text, cards, chat text, SVG labels |
| `--f-mono` | **JetBrains Mono** (400, 600) | Labels, eyebrows, pills, timestamps, terminals, codes, table headers |

Loaded from Google Fonts with `display=swap`. Each family falls back to a system stack (`Avenir Next`/`Segoe UI`, `Helvetica`/`Arial`, `ui-monospace`/`Menlo`).

### 5.2 Scale

| Role | Size | Weight | Notes |
|---|---|---|---|
| Hero h1 | `clamp(44px, 7.4vw, 96px)` | 800 | `max-width: 14ch`; one word in `<em>`, coloured accent, not italic |
| Chapter number | `clamp(64px, 9vw, 120px)` | 800 | Outlined: fill `--accent-soft`, `-webkit-text-stroke: 1.5px var(--accent)`, line-height .9 |
| Closing h2 | `clamp(36px, 5vw, 64px)` | 800 | `max-width: 18ch` |
| Chapter h2 | `clamp(34px, 4.6vw, 58px)` | 800 | `max-width: 20ch` |
| Big counter | `clamp(64px, 9vw, 120px)` | 800 | Accent, tabular numbers |
| Stat | `clamp(36px, 4.2vw, 56px)` | 800 | Accent, tabular numbers |
| Quote | `clamp(28px, 3.6vw, 44px)` | 700 | Display face, `max-width: 24ch`, punchline in accent |
| Persona name | `clamp(28px, 3vw, 38px)` | 800 | |
| Big definition | `clamp(26px, 3vw, 36px)` | 700 | Key phrase in `<mark>` on `--gold-soft` |
| Sub h3 | `clamp(24px, 2.6vw, 32px)` | 700 | |
| Step h4 | 24px | 700 | |
| Lede (hero) | `clamp(19px, 2vw, 23px)` | 400 | Muted, `max-width: 60ch` |
| Chapter lede, closing p | 20px | 400 | Muted |
| Card h4 | 21px | 700 | Pillar h4 20px, timeline h4 19px |
| **Body** | **18px / 1.55** | 400 | 17px under 560px |
| Card text | 16.5px | 400 | Muted |
| Chat text | 15.5px / 1.45 | 400 | |
| Secondary rows | 14.5–15.5px | 400 | Muted |
| Terminal | 14px / 1.7 | 400 | Mono |
| Labels (`.lbl`) | 12px | 600 | Mono, uppercase, letter-spacing .1em |
| Eyebrow | 13px | 600 | Mono, uppercase, .12em, accent |
| Pills | 11.5px | 600 | Mono, uppercase, .06em |
| Micro (tags, codes, owners) | 11–12.5px | 600 | Mono, uppercase, .05–.08em |

### 5.3 Rules

- Headings: `line-height: 1.08`, `letter-spacing: -.01em`, `text-wrap: balance`.
- Prose measure: ledes 60–64ch, chapter ledes 62ch, timeline text 64ch. Never let a paragraph run the full 1040px.
- **Mono means metadata.** Uppercase mono is reserved for things that label other things: labels, eyebrows, pills, timestamps, owners, stage codes, table headers. Never set a sentence in it.
- Numbers that line up use `font-variant-numeric: tabular-nums` (stats, tables, counters).
- Antialiasing is on (`-webkit-font-smoothing: antialiased`).

## 6. Colour

### 6.1 Tokens

| Token | Light | Dark | Means |
|---|---|---|---|
| `--paper` | `#F1F4F2` | `#0C1716` | Page background; also text on accent fills |
| `--panel` | `#FBFCFA` | `#132321` | Cards, mocks, diagram frames |
| `--ink` | `#12221F` | `#E4EEEA` | Text, headings, strong rules (stat tops, table totals) |
| `--muted` | `#56696A` | `#93A8A3` | Secondary text, labels, captions, "before" |
| `--line` | `#D3DCD8` | `#26403B` | Every border and divider |
| `--accent` | `#1B6B57` | `#5CC9A5` | The subject: links, live, highlighted box, filled dots, progress |
| `--accent-soft` | `#DCEBE4` | `#173A31` | Tint behind accent text; active TOC row |
| `--gold` | `#9A6516` | `#E9B657` | Planned, illustrative, human review comments, verdicts |
| `--gold-soft` | `#F4E6CB` | `#3A2E17` | Tint behind gold; `<mark>` highlight |
| `--risk` | `#A9432E` | `#EE8A72` | Problems, at risk, dropped, limits, projections past a limit |
| `--risk-soft` | `#F6E1DA` | `#3D221B` | Tint behind risk |
| `--term` | `#0E1C1B` | `#07100F` | Terminal background (dark in both themes) |
| `--term-fg` / `--term-dim` / `--term-ok` | `#D5E5E0` / `#7F9792` / `#63D1A8` | same | Terminal text, prompts and comments, success |

Terminal-only literals, the same in both themes: warning `#F2C46B`, error `#F29A86`, window dots `#3A4A48`.

### 6.2 Persona and series palette

`--p1` to `--p7`, assigned in order, one per person or data series. A person keeps their colour everywhere: avatar, `.cont-tag`, swimlane dots, chat avatar.

| Token | Light | Dark |
|---|---|---|
| `--p1` blue | `#2D64C8` | `#7DA6F2` |
| `--p2` green (= accent) | `#1B6B57` | `#5CC9A5` |
| `--p3` violet | `#7448BC` | `#B497EE` |
| `--p4` brick (= risk) | `#A9432E` | `#EE8A72` |
| `--p5` ochre (= gold) | `#9A6516` | `#E9B657` |
| `--p6` teal | `#0B7F8F` | `#5FC6D3` |
| `--p7` magenta | `#B0397A` | `#EE8CC2` |

Leadership or "everyone" rows use `--ink` as their colour.

### 6.3 Rules

- **No raw colours in components.** Use a token. A one-off tint is `color-mix(in srgb, var(--c) 14%, transparent)` (as in pillar icons).
- **Pass colours in with `--c`.** Components that take a colour (`.p-av`, `.av`, `.pillar`, `.dotc`, `.hub-dots i`, `.cont-tag`, `.rc.me`) read `var(--c)`; set it inline: `style="--c:var(--p3)"`.
- **The semantic triad never changes meaning:** accent = real and ours, gold = planned, illustrative or a person's judgement, risk = wrong or at risk.
- **Text on a solid accent or persona fill is `--paper`**, never white, so it inverts properly in dark mode.
- **Contrast:** body text on paper and on panel passes WCAG AA in both themes. Muted is for secondary text at 14.5px and up, not for anything the reader must not miss.

## 7. Shape, borders and depth

| Radius | Used on |
|---|---|
| 4px | `<mark>`, bot badge, focus ring |
| 5px | `.kbd` |
| 8px | TOC rows, file chips, review avatars |
| 9px | Chat avatars, brand mark |
| 10px | Icon tiles, review items, review comments (right side) |
| 12px | Kit items, gates, layers, flow steps, stage bottoms |
| 14px | Cards, pillars, steps, phases, document and review panels, hub bar |
| 16px | Chats, terminals, charts, swimlane |
| 18px | Architecture frame, persona avatar |
| 999px | Pills, badges, progress bars, owner tags |

- **Borders:** 1px `--line` everywhere. Emphasis is a thicker *coloured edge*, never a thicker grey border:
  - 4px top accent: `.accented .card`, `.stg`;
  - 4px left gold: `.caveats .card`;
  - 4px left `--c`: `.pillar`;
  - 3px left: `.rc` review comments;
  - 2px top ink: `.stat`;
  - 2px bottom ink: table totals.
- **Dashed means "not yet"** (it also marks sections, as in the persona divider):
  - `.step.next`;
  - `.stg.plan`;
  - hollow `.dotc.o`;
  - `.pi.verdict`;
  - projection lines;
  - the persona divider (`1px dashed`).
- **Shadow (`--shadow`) is only for things that float**: chat mocks, terminals, the presenter hint, the mobile drawer and its button. Cards are flat.

## 8. Icons

- Inline SVG, `viewBox="0 0 24 24"`, `fill="none" stroke="currentColor" stroke-width="2"`, drawn from simple primitives (lines, circles, rects). No icon font, no external sprite.
- Rendered at 20×20 inside a 38×38 `.ico` tile, 10px radius, on `--accent-soft` with accent stroke. `.ico.risk` for problems. In pillars the tile uses the pillar's `--c` at 14%.
- Glyphs in mocks are plain Unicode: ✓ ✗ ! $ · → 📄.

## 9. Motion

### 9.1 How reveal works

1. All content is visible by default.
2. `story.js` observes every element matching `ANIMATED` (`.rv,.stagger,.chat,.term,.chart,.swim,.layers,.arch,.gates,.kit,.doc,.prv`) with `threshold: 0.22` and `rootMargin: 0px 0px -8% 0px`.
3. On first intersection it adds `.in` and unobserves the element, so each block animates once.
4. CSS keyed on `.in` plays the entrance with `animation-fill-mode: both`.
5. With `prefers-reduced-motion: reduce`, or without `IntersectionObserver`, nothing is observed and the page stays still.

### 9.2 Easing and timing

- `--ease-out: cubic-bezier(.2,.7,.2,1)` for every entrance, a fast start with a long settle.
- `--ease-draw: cubic-bezier(.3,.7,.2,1)` for edges and dots that draw themselves.
- Pop (swimlane dots): `cubic-bezier(.3,1.6,.5,1)`, a slight overshoot.
- Children are ordered with an inline `--i` index (`style="--i:3"`), and the delay is `calc(var(--i) * step)`.

| Trigger | Keyframe | What happens | Duration | Step per `--i` |
|---|---|---|---|---|
| `.rv.in` | `rise` | opacity 0→1, translateY 28px→0 | .8s | n/a |
| `.stagger.in > *` | `rise` | children rise in order | .7s | 110ms |
| `.chat.in .msg, .sep` | `msg` | messages arrive, translateY 14px | .55s | **520ms** (reading pace) |
| `.term.in .ln` | `type` | each line wipes left to right, `steps(8)` | .35s | 300ms |
| `.chart.in .bar` | `grow` | bars scale up from the baseline | .7s | 90ms |
| `.chart.in .line` | `draw` | the line draws left to right (clip-path) | 1.6s | n/a |
| `.chart.in .proj-wrap` | `draw` | the projection draws after the line | 1.6s, +1.4s delay | n/a |
| `.chart.in .prog-b i` | `fillw` | progress fills from 0 | 1.1s | 120ms |
| `.swim.in .dotc` | `pop` | dots pop in | .45s | 60ms |
| `.layers.in .layer`, `.gates.in .gate` | `slide` | rows slide from the left, 24px | .6s | 120ms / 110ms |
| `.prv.in .pi` | `slide` | review items, +.3s | .6s | 220ms |
| `.doc.in .rc` | `rise` | review comments, +.5s | .6s | **350ms** |
| `.kit.in .k` | `rise` | kit items, +.2s | .6s | 90ms |
| `.kit.in .core::before/after` | transition | dashed connectors grow out of the hub | .8s, +.3s | n/a |
| `.kit.in .agent` | `pulse` | the hub halo breathes twice | 2.4s, +.9s, ×2 | n/a |
| `.pillars.in .pillar::before` | transition | coloured edge draws downwards | .8s, +.25s | 120ms |
| `.hub.in .hub-dots i` | transition | five dots fly in and converge | .9s, +.5s | n/a |
| `.arch.in .flow` | `dash` | dashed flow lines march in the direction of data | 1.2s linear, infinite | n/a |
| `.scroll-cue i` | `cue` | the hero cue line stretches and retracts | 1.8s, infinite | n/a |
| `[data-count]` | JS | count-up with ease-out cubic, `en-IN` grouping | 1.2s | n/a |
| presenter dimming | transition | `filter` on `.stop` | .5s | n/a |

### 9.3 Rules

- **Animate only `opacity`, `transform`, `clip-path` and `filter`.** The exception is progress-bar `width`, which is tiny.
- **Only the arch flow lines and the scroll cue loop.** Everything else plays once.
- **Order matches meaning.** Chat messages at reading pace; review comments after the document they comment on; projections after the actual line.
- **Every animated state has a still state.** Under reduced motion all animations and transitions are removed, and the two transition-driven pieces are forced to their end state (`.pillar::before` to `scaleY(1)`, `.core` lines to `scaleX(1)`).

## 10. Components

Each entry gives the purpose, the markup skeleton and the rules. `template/index.html` uses every one of them.

### 10.1 Hero

```html
<header class="hero" id="top">
  <p class="eyebrow">Team · Month Year</p>
  <h1>Tell the pitch as a <em>story</em>, not a deck</h1>
  <p class="lede">A short story in eight parts: …</p>
  <div class="hero-meta"><span>Presented by …</span><span>About 15 minutes</span><span>…</span></div>
  <div class="scroll-cue"><i></i>Scroll to begin</div>
</header>
```

- One accent word in the title (`<em>`), the subject of the story.
- The lede names the number of parts and walks the arc in one sentence.
- Meta holds presenter, duration and one headline fact. The id `top` is the first presenter stop.

### 10.2 Chapter head

```html
<section class="chapter" id="ch3">
  <div class="ch-head rv"><span class="ch-num">03</span><h2>Sentence-case claim</h2><p>One-line lede.</p></div>
```

- Two-digit numbers. Ids `ch1`…`chN` match the TOC `data-ch`.

### 10.3 Sub-section and continuation

```html
<div class="sub" id="unique-id"><h3>Point</h3><p class="sub-lede">Context.</p> … </div>
<div class="sub cont" id="b-kit"><span class="cont-tag" style="--c:var(--p2)"><i></i>Persona name</span><h3>…</h3> … </div>
```

- Every `.sub` with a TOC link needs a unique id. Continuations get indented TOC rows (`li.toc-in`).

### 10.4 Cards and grids

- `.card` holds an optional `.ico` or `.lbl` or `.pill`, an `h4` and a muted `p`.
- Variants:
  - `.accented` (4px accent top, accent label) for "the parts of the thing";
  - `.caveats` (4px gold left edge) for lessons and warnings;
  - `.ico.risk` for problems.

### 10.5 Pills

```html
<span class="pill live">Live: what works</span>
<span class="pill plan">Planned: what's next</span>
<span class="pill risk">At risk</span>
```

- A dot plus uppercase mono text.
- **Every capability claim in a persona head or pillar carries one.**
- Write "Live: …" and "Planned: …" so the meaning survives greyscale printing.

### 10.6 Pillars and hub

A short list (three to six) of needs, each with an icon, a definition, examples and status pills, then a solid accent bar that says one thing answers them all.

```html
<div class="pillars stagger">
  <div class="pillar" style="--i:0;--c:var(--p1)">
    <div class="nh"><div class="ico">…svg…</div><div><h4>Need</h4><p>One-line definition.</p></div></div>
    <ul><li>Example</li><li>Example</li></ul>
    <div class="tags"><span class="pill live">…</span></div>
  </div>
</div>
<div class="hub rv"><span class="hub-dots"><i style="--c:var(--p1)"></i>…</span><b>Name</b><span>covers all five</span></div>
```

- The hub's dots use the same colours as the pillars, in the same order. The fly-in animation is tuned for five dots.

### 10.7 Steps and quote

- `.steps`: three cards with a mono `.when` ("Step 1 · Done"). The future step is `.step.next` (dashed).
- `.quote`: one or two sentences in the display face. The `<span>` part is the punchline, in accent. Put it alone in a `.sub` to end a chapter.

### 10.8 Split and big definition

- `.split` puts a `.big-def` (with one `<mark>` phrase) and a muted line on the left, and a chat on the right.
- Use it once, to define the subject.

### 10.9 Architecture diagram

```html
<div class="arch rv"><svg viewBox="0 0 900 300" role="img" aria-label="Plain-language summary">
  <rect class="box" …/> <rect class="box hl" …/>   <!-- one highlighted box: the subject -->
  <text class="t" …>Title</text> <text …>Body</text> <text class="m" …>edge label</text>
  <text class="t inv" …> <text class="inv" …>     <!-- text on the highlighted box -->
  <path class="flow" d="…"/>                         <!-- dashed, animated, in the direction of data -->
</svg></div>
```

- viewBox 900 wide; boxes 200–240 wide with 14px radius (16px for the highlight).
- Titles 18px display, body 15px, edge labels 13px muted.
- **Render and check it by eye.** Labels must sit clear of boxes and lines.
- The SVG keeps `min-width: 640px` and the frame scrolls sideways on phones.
- Always write a real `aria-label`.

### 10.10 Stage strip

- `.stages` holds seven `.stg` blocks, each with a mono `.code` ("STAGE 3"), a display `b` and a muted description.
- The not-yet stage is `.stg.plan` (dashed grey top). It reflows to 4 columns at 1100px and 2 at 560px.

### 10.11 Scene

`.scene` is the workhorse: claim or before/after on the left (often a `.stack` of blocks), and the evidence mock on the right. It collapses to one column at 1100px, and the evidence then follows the claim.

### 10.12 Chat mock

```html
<div class="chat rv">
  <div class="chat-head"><span># channel</span><span class="tag">real exchange | example | illustrative</span></div>
  <div class="chat-body">
    <div class="msg" style="--i:0"><span class="av" style="--c:var(--p1)">AB</span>
      <div><div class="who">Name<span class="t">16:09</span></div><p>Text with <span class="at">@mention</span></p></div></div>
    <div class="sep" style="--i:1">next morning</div>
    <div class="msg" style="--i:2"><span class="av hl">S</span>
      <div><div class="who">Bot<span class="bot">APP</span><span class="t">16:10</span></div><p>…</p><ul><li>…</li></ul><p class="meta">2 calls · $0.03</p></div></div>
  </div>
</div>
```

- **The head tag always says what it is.** Use "real exchange", "real, shortened", "example" or "illustrative".
- Avatars are two-letter initials on the person's `--c`; the subject or bot uses `.av.hl`.
- `.file` for attachments; `.sep` for time passing; `.meta` for cost or footnotes.
- Keep threads to two to six messages, because they arrive 520ms apart.

### 10.13 Terminal mock

```html
<div class="term rv"><div class="bar"><i></i><i></i><i></i></div>
  <div class="ln" style="--i:0"><span class="d">$</span> command</div>
  <div class="ln" style="--i:1"><span class="ok">✓</span> result <span class="d">(note)</span></div>
  <div class="ln" style="--i:2"><span class="y">!</span> warning</div>
  <div class="ln" style="--i:3"><span class="r">✗</span> failure</div>
</div>
```

- Dark in both themes.
- **Keep lines short enough not to wrap** at the scene's width (about 48 characters). Shorten the text rather than letting a line wrap.
- About 5 to 9 lines.

### 10.14 Document mock with review comments

```html
<div class="doc rv">
  <div class="doc-head"><span>plan.md</span><span class="tag">illustrative</span></div>
  <div class="doc-body">
    <p class="h"># Heading</p><p><b>Goal</b>One line.</p>
    <div class="rc" style="--i:0"><span class="av" style="--c:var(--gold)">RE</span><div><b>Reviewer</b><p>Challenge.</p></div></div>
    <div class="rc me" style="--i:1;--c:var(--p2)"><span class="av" style="--c:var(--p2)">AU</span><div><b>Author · v2</b><p>Response.</p></div></div>
    <div class="rc ok" style="--i:2"><span class="av" style="--c:var(--accent)">✓</span><div><b>Approved</b><p>…</p></div></div>
  </div>
</div>
```

- Comment states:
  - the reviewer's comment is gold;
  - the author's reply (`.me`) has a `--c` edge on paper;
  - approval (`.ok`) is accent.
- Comments arrive after the document, 350ms apart.

### 10.15 Review panel

```html
<div class="prv rv"><div class="doc-head">…</div><div class="prv-body">
  <div class="pi kept" style="--i:0"><span class="st">Posted</span><p>…</p></div>
  <div class="pi drop" style="--i:1"><span class="st">Dropped</span><p>… <em>Reason.</em></p></div>
  <div class="pi verdict" style="--i:2"><span class="st">Verdict</span><p>…</p></div>
</div></div>
```

- Shows AI suggestions that a person judged.
- **Dropped items stay visible**, struck through and with the reason, because they prove a person decided.

### 10.16 Numbered flow

`.flow4 > .f` rows hold a round `.n` number and a `b` plus muted `p`. Use three to five steps, next to a document or on their own.

### 10.17 Kit (hub and spoke)

- `.kit` is three columns: `.kcol` | `.core > .agent` | `.kcol`.
- Each `.k` has a `b`, a muted `span` and an optional `.acc` (accent mono note, for access level or limits).
- Inputs go on the left and reach on the right. Dashed connectors draw out of the hub, and on phones they hide and the columns stack.

### 10.18 Gates and layers

- **`.gates`**: ordered checks.
  - Each row has a solid round `.num`, `b` plus `p`, and an owner pill `.own`.
  - Use it for "what must pass before X".
- **`.layers`**: unordered defences.
  - Each row has an `.ico`, `b` plus `span`, and a plain mono `.lane` naming where the layer lives.
  - Use it for "why it won't go wrong".
- **`.rules`** is a tight bullet list inside a card. **`.note-line`** is a muted footnote under a block.

### 10.19 Persona

```html
<article class="persona" id="p-name">
  <div class="p-head rv"><div class="p-av" style="--c:var(--p1)">A</div>
    <div><h3>Name</h3><p class="role">Role</p></div>
    <div class="p-pills"><span class="pill live">Live: …</span><span class="pill plan">Planned: …</span></div></div>
  <div class="scene">
    <div class="stack">
      <div class="ba rv">
        <div class="row"><span class="lbl">Before</span><p class="before">One muted sentence.</p></div>
        <div class="row"><span class="lbl">Now</span><ul><li>…</li></ul></div>
      </div>
      <div class="chart rv">…</div>
    </div>
    <div class="chat rv">…</div>
  </div>
</article>
```

- "Before" is one muted sentence; "Now" is three or four bullets.
- Pills sit at the right of the head and wrap below on small screens.
- The avatar is the initial, or a short role (CTO), on `--c`.

### 10.20 Charts

- **Hand-written SVG, never images.**
- Frame: `.chart` with a `.chart-cap` on top (`.lbl` title left, `.ill` "Illustrative" right when the data is not real).
- Axes: `.ax` hairlines; a dashed top gridline is `stroke-dasharray="2 4"`.
- Bars: `.bar` in `--p1`, with the latest or highlighted bar `.bar.last` in accent. Each bar gets `--i`.
- Lines:
  - `.line` is a 3px solid `--p2` with round caps;
  - `.proj` is a dashed risk-coloured projection, wrapped in `<g class="proj-wrap">` so it draws after the line;
  - `.lim` is a dashed risk limit.
- Portfolio table:
  - `.pf`, with `.st` muted sub-text in cells;
  - `.prog-b` progress bars (`--w` width, `.risk` variant);
  - `.roi` pills (`.up`, `.down`, `.na`).

### 10.21 Timeline and stats

- **`.tl`**: a vertical line with dot markers.
  - Each `.e` has a mono date `.d`, an `h4` and a muted `p`.
  - `.e.hl` fills the dot to mark moments where the subject acted; hollow dots are people or context.
- **`.stats`**: four numbers under a 2px ink rule, in accent display type.
  - Wrap a number in `<span data-count="N">N</span>` to count up. Write the final value in the markup too, so it reads without JS.

### 10.22 Swimlane

- `.swim` table: people down the side, stages across the top.
- Cells hold `.dotc` dots in the person's `--c`: filled means today, `.dotc.o` (dashed, hollow) means planned.
- It has a 760px minimum width and scrolls inside its frame on phones.
- Number the dots with `--i` across the whole table so they pop in reading order.

### 10.23 Ledger (cost)

- `.tbl` rows hold item, basis (with a `<small>` muted detail) and a right-aligned `.r` amount. The total is `tr.total` (bold, 2px ink bottom rule).
- `.counter` shows one huge accent number, its meaning, then a smaller `.per` figure (per person, per month, …).

### 10.24 Phases, closing and footer

- **`.phase`** rows hold a display `.ph` label, `b` plus `p`, and a mono cost `.c` aligned right. `.phase.opt` greys the label.
  - Every phase has a price, even if it is "no change".
- **`.closing`** states the ask in one sentence (`h2`), then a muted next step. It is the last presenter stop.
- **`.foot`** lists the sources and **says exactly which parts are illustrative**.

## 11. Navigation: rail, scroll spy, progress

```html
<nav class="rail" id="rail" aria-label="Story chapters">
  <div class="brand"><div class="dot">S</div><div><b>Title</b><span>Subtitle</span></div></div>
  <ol class="toc" id="toc">
    <li data-ch="ch1"><a href="#ch1"><span class="n">01</span>Short chapter name</a>
      <ul><li><a href="#sub-id">Sub-section</a></li><li class="toc-in"><a href="#deep-id">Deep-dive</a></li></ul></li>
  </ol>
  <div class="rail-foot"><span><span class="kbd">J</span> <span class="kbd">K</span> present step by step</span><span><span class="kbd">Esc</span> leave presenting</span><span>Team · Month Year</span></div>
</nav>
<button class="menu-btn" id="menuBtn" aria-controls="rail" aria-expanded="false">Contents</button>
```

- **Rail labels are short** (two to four words). The chapter *title* is the sentence; the rail is the index.
- **Scroll spy.** The reading line is **32% down the viewport**. The chapter whose top has passed it gets `li.on`, which highlights the row and expands its sub-list. The sub-section that has passed it gets `a.on` (an accent left edge).
- **Only the active chapter's sub-list is open**, so the rail stays short.
- **Progress.** The 3px top bar's width equals `scrollY / (scrollHeight − innerHeight)`.
- **Mobile drawer (860px and below).**
  - The rail becomes a fixed drawer, `min(300px, 86vw)` wide, that slides in from the left.
  - A pill button opens it, fixed bottom-right with a safe-area inset. Its label toggles between "Contents" and "Close", and it updates `aria-expanded`.
  - Tapping any link closes the drawer.
- Ids `#prog`, `#toc`, `#rail` and `#menuBtn` are required by the script.

## 12. Presenter mode

For presenting in a meeting without a separate deck.

| Key | Action |
|---|---|
| **J** | Next block. A block taller than the screen pages down first (up to 80% of the viewport per press), then moves on. |
| **K** | Previous block, paging up through tall blocks the same way. |
| **Esc** | Leave presenter mode. |

- **Stops** are `#top, .ch-head, .sub, .persona, .closing`, collected once and given `.stop`.
- **The first J or K** turns presenting on and focuses the block nearest the centre of the screen, instead of jumping.
- **Focus** marks one stop `.focus`; every other stop gets `filter: opacity(.14) blur(1.5px)`, with a 0.5s transition. The next block never leaks half-read into view.
- **Placement.** A block that fits (height ≤ viewport − 64px) is centred vertically; a taller block is aligned 24px from the top.
- **Animations fire on focus.** Focusing a stop adds `.in` to the animated containers inside it, so nothing waits for the scroll observer.
- **Manual scrolling while presenting** re-focuses the block at the centre. Programmatic scrolls lock this for 900ms to avoid a fight.
- **TOC clicks while presenting** focus and place the target stop.
- **A hint pill** ("Presenting · J next · K back · Esc exit") is fixed bottom-centre while active.
- Keys are ignored with ⌘, Ctrl or Alt held, or while typing in an input.

**Rules:**

- Never nest one stop inside another; that is why continuations are siblings.
- Keep each stop to about a screen or two.
- Every block the presenter should talk to must be inside a stop.

## 13. Responsive behaviour

| Breakpoint | Changes |
|---|---|
| **≤ 1100px** | `.grid4` → 2 columns; `.stages` → 4; `.scene`, `.split`, `.ledger` → 1 column; `.stats` → 2 |
| **≤ 860px** | Rail becomes a drawer with the "Contents" button; `.grid3`, `.grid2`, `.steps`, `.phase`, `.pillar` → 1 column (pillar tags become a wrapping row); `.layer` and `.gate` drop to number or icon + text, with the owner below; `.kit` stacks and hides connectors; `.pi` stacks the status above the text; `.phase .c` aligns left |
| **≤ 560px** | Body 17px; `.grid4`, `.stats` → 1 column; `.stages` → 2 |

- **No horizontal page scroll at any width.** Wide content scrolls *inside its own frame*: `.arch` (SVG min 640px), `.swim` (table min 760px), `.term`, and tables wrapped in `overflow-x: auto`.
- The minimum gutter is 16px (`clamp(16px, 5vw, 72px)`).
- Fixed elements respect `env(safe-area-inset-*)`.

## 14. Accessibility

- **Semantic structure:**
  - `nav[aria-label]` for the rail;
  - `main` for the content;
  - `section.chapter` with an `h2` per chapter, `h3` for sub-sections and personas, `h4` inside;
  - `article` for personas.
- **Focus:** a 2px accent `:focus-visible` outline at a 3px offset.
- **Diagrams and charts:** `role="img"` with a plain-language `aria-label` that states the takeaway, not the shapes.
- **Mocks:** chats and terminals carry `aria-label` ("Example chat exchange").
- **The progress bar** is `aria-hidden`; the presenter hint is `aria-live="polite"`.
- **Reduced motion** removes every animation and transition and forces end states. Smooth scrolling is turned off too.
- **Meaning is never colour alone.** Live and planned pills carry words; dashed versus solid carries status; dropped items are struck through.
- **Count-up numbers** hold their final value in the markup.

## 15. Content and voice

The design only works if the words are honest and plain.

**Voice:**

- **Plain English, short sentences.** Write for a non-technical founder. Explain a technical term the first time with an everyday comparison (for example, "a skill is like the SOP you hand a new hire").
- **Claims as sentences.** Chapter titles, quotes and the closing state a position.
- **Active and concrete.** "The bot files the transcript into the record", not "transcripts are processed".
- **Show people, not features.** Personas are named by role (or by name, with consent), each with a before and after.

**Honesty:**

- **Mark everything.**
  - Live or planned on every capability.
  - "Real exchange", "real, shortened", "example" or "illustrative" on every mock.
  - `.ill` "Illustrative" on every chart with made-up data.
  - A footer line naming the illustrative parts.
- **No invented numbers.** Every real number has a source in the footer. Illustrative numbers stay consistent across the page: the same total in every place it appears.
- **Placeholders are visible.** Write `[__ % of 2 people]`, not a guess.

**Privacy:**

- **No sensitive data.** No user ids, tokens, emails, phone numbers, account numbers, performance ratings or names of people who have not agreed to appear.
- Describe security gaps generically, or leave them out of a page meant for sharing.

**Format:**

- **Dates and money:**
  - day-first dates ("7 Oct");
  - a 24-hour clock in mocks;
  - currency with its symbol;
  - approximate figures marked with ≈ or ~;
  - Indian grouping (`en-IN`) for count-ups. Change the locale in `story.js` if the audience expects another.

## 16. Theming

- Both themes come from `tokens.css`. Components never branch on the theme.
- Dark follows the OS by default (`prefers-color-scheme`). A host can force a theme with `data-theme="light"` or `data-theme="dark"` on `<html>`.
- **The dark values are tuned, not inverted.**
  - Accents get lighter, and soft tints get darker and greener.
  - The terminal gets darker still, so it stays distinct from panels.
  - Shadows get heavier (`rgba(0,0,0,.3)`) so floating mocks still lift.
- `color-scheme: dark` is set in dark mode so native scrollbars and form controls match.
- `body` always has an explicit background.

## 17. Building, checking and shipping

### Build

1. Copy `template/index.html`, and keep the shell (progress, rail, menu button, presenter hint, `main > .col`).
2. Write the outline first: one sentence per chapter. Get it reviewed before building.
3. Replace the chapters, reusing components. Update the TOC so every linked `.sub` id exists.
4. Run `python3 scripts/inline.py your-page.html` to get one self-contained file in `dist/`.

### Check (every time, before sharing)

- [ ] **Light, dark and phone width (≤ 500px)**, by eye, with screenshots.
- [ ] **No horizontal page scroll.** `document.documentElement.scrollWidth === innerWidth` at phone width.
- [ ] Diagram labels clear of boxes and lines; terminal lines don't wrap.
- [ ] J/K walks every chapter in order, and no stop is nested in another.
- [ ] Every TOC link lands; the scroll spy highlights the right row.
- [ ] Every capability has a pill, every mock a tag, and every made-up chart an "Illustrative" label.
- [ ] Every real number has a source in the footer; illustrative numbers agree with each other.
- [ ] No ids, tokens, emails, ratings or private names.
- [ ] Reduced motion: the page is complete and still.

Headless Chrome is enough for screenshots:

```bash
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CH" --headless=new --hide-scrollbars --window-size=1440,900  --screenshot=light.png --blink-settings=preferredColorScheme=1 "file://$PWD/dist/index.html"
"$CH" --headless=new --hide-scrollbars --window-size=1440,900  --screenshot=dark.png  --blink-settings=preferredColorScheme=0 "file://$PWD/dist/index.html"
"$CH" --headless=new --hide-scrollbars --window-size=500,4000  --screenshot=phone.png "file://$PWD/dist/index.html"
```

To look at one chapter, inject `.hero,.chapter:not(#ch3){display:none}` into a temporary copy rather than relying on anchor scrolling.

### Ship

- The file is self-contained apart from Google Fonts, so it can be hosted anywhere, attached, or published as an artifact.
- Update in place at the same link, so people who bookmarked it get the latest version.

## 18. Extending the system

- **New component checklist:**
  1. Tokens only.
  2. A still state that reads without JS.
  3. If it animates on entry, add its container to `ANIMATED` in `story.js` and key its CSS on `.in`.
  4. Use `--i` for order.
  5. Add a reduced-motion end state if it uses transitions.
  6. Add rules for 860px and 560px.
  7. Document it in section 10 and use it once in the template.
- **Watch class-name collisions.** Short names like `.k`, `.st`, `.bar` and `.n` are always scoped under a parent (`.kit .k`, `.pi .st`, `.chart .bar`, `.flow4 .n`). Never style a short name globally if another component already uses it; that is why the stage label is `.stg .code`, not `.stg .k`.
- **New colours** go into `tokens.css` in **all three** blocks (light, OS-dark, forced-dark), with a documented meaning in section 6.
- **New personas** take the next free `--pN`. Add an eighth token (light and dark) before reusing a colour.
