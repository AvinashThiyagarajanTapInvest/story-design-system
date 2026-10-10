# Working in this repo

This repo is a design system for scrolling story pages. `DESIGN.md` is the spec; `src/` is the source of truth for values.

When building a story page:
- Start from `template/index.html`. Keep the shell (progress bar, rail, menu button, presenter hint, `main > .col`) and the required ids `#prog`, `#toc`, `#rail`, `#menuBtn`.
- Agree an outline (one sentence per chapter) with the person before writing HTML.
- Use only existing classes and tokens. No raw colours, no new fonts. New components follow DESIGN.md §18.
- Persona deep-dives are `.sub.cont` siblings after the `article.persona`, never nested inside it.
- Only state facts you can source. Mark mocks ("real exchange", "example", "illustrative"), mark capabilities live or planned, and list sources in `.foot`.
- No ids, tokens, emails, ratings or private names on any page.
- Before calling it done: render light, dark and phone width (headless Chrome commands in DESIGN.md §17), confirm no horizontal page scroll, and look at every diagram and terminal by eye.
- Ship with `python3 scripts/inline.py <page>.html`.

When changing the system itself, update `src/`, `DESIGN.md` and the template together, and refresh `docs/screenshots/`.
