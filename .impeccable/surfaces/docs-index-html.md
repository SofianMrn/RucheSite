---
version: 1
slug: "docs-index-html"
primary_target: "docs/index.html"
related_targets: []
---

# Surface brief: site vitrine La Ruche (docs/index.html)

Scope: single-page marketing site plus legal pages and 404, static HTML/CSS/JS on GitHub Pages (served from `docs/`). Visitor mode: **Persuade**.

Audience and job: sales leads and managers at French IT, office-equipment and B2B e-commerce resellers whose clients ask them to equip meeting rooms. They must leave believing La Ruche gathers every piece of AV information (catalogues, compatibilities, prices, stock, lead times, installers, experts) in one place and turns a room description into a priced quote in minutes, and they must request a demo or pilot slot.
Secondary readers: brands, wholesalers, installers (ecosystem section).

Proof and content: launch film and explainer film (web encodes in docs/assets/media with French captions), the 4-step journey, features, traceability rules, tier structure without prices, public roadmap with the 2027 pilot programme, InovElite's existing practice. Demonstration data (kit, quote lines, timings) is authored and labelled fictive. No customers, logos, testimonials or metrics are invented.

Constraints: user-pinned headline "Vendez l'audiovisuel comme un expert." with no "sans recruter". Launch film is the visual reference. No prices. Demo form complete but its endpoint is unwired (config file plus honest fallback). Self-hosted fonts, no third-party requests, no tracking cookies. WCAG 2.2 AA, reduced motion.

Unresolved: contact email, form endpoint, legal identity of InovElite (SIREN, address, publication director), final domain (default https://sofianmrn.github.io/RucheSite/).

## Direction contract

THESIS: The page is the hive. The whole AV market lights up around the reseller and everything it knows flows into one quote, in minutes. It refuses the category default: a centred headline over a product screenshot, a logo strip and three equal feature cards.

OWN-WORLD: The launch film's night. Navy #070A1F to #0A0F2C ground; electric blue #2B59FF light living inside flat-top hexagon cells and dotted light arcs; ice #C9D6FF for data. One red #FF2D55 cell is always "Vous", the reseller, and red is otherwise reserved for the demo action (#E5174B fill). Hexagons are the structural unit for actors, kit items, steps and quotas. The white quote sheet is the only paper surface. Poppins (the film's display face) for headlines and the wordmark, Inter (the film's text face) for text, with tabular figures for timestamps and counts.

STORY: A client asks to equip a meeting room. Today that means days of calls and the project is lost. La Ruche connects brands, wholesalers, installers and InovElite experts, so catalogues, compatibilities, prices and stock sit in one place. You describe the room, get a compatible in-stock kit and a priced quote in minutes, and an expert steps in when needed while the client stays yours. Every configuration is traced. Three tiers. Pilots in 2027. The visitor requests a demo.

FIRST VIEWPORT: A full-bleed canvas honeycomb plane in the film's perspective. The raised red "Vous" cell sits right of centre, and four lit actor cells (Marques, Grossistes, Installateurs, Experts InovElite) send packet-bearing dotted arcs into it; one arc leaves toward "Client final · devis". The wordmark nav sits top left with the red demo button top right. In the left column, the H1 "Vendez l'audiovisuel comme un expert." at about 5.5rem, then one sentence on all information in one place and the quote in minutes. The working action is a professional email field fused to the red "Demander une démo" button, with "Voir le film · 2 min" secondary.
Signature interaction: actor cells are real buttons. Hover, focus or tap isolates that actor's flow and a caption says what it brings and gains; when idle, the flows cycle like the film. The second authored moment is a sticky 01–04 film-style sequence (wireframe room, assembling hex kit, white quote stamped "Devis prêt", escalation row), driven by the visitor's room choice. Motion grammar: light travels with exponential ease-out, cells breathe slowly, and scrolling lowers the camera; reduced motion shows the lit still.

FORM: Ruche-réseau (hive network), position 4 on the ordered structural list, dealt card picked by the user; seed key 412423a3.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
