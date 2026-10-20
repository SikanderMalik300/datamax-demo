# ARMS Atlas — demo

A **demonstration prototype** of a searchable literature reference for
**Alveolar Rhabdomyosarcoma (ARMS)**, linking published papers to their
**fusions**, **genes** and **signalling pathways**.

> This is a *demo*, not the final product — built to show the quality of the
> interface and the data model before building the full pipeline. It is for
> research-workflow evaluation only, **not** a medical/clinical tool.

**Live preview:** https://sikandermalik300.github.io/datamax-demo/

---

## What it shows

- **35 real, PMID-verified papers** — every record links to its genuine PubMed entry.
- Each paper tagged across **three linked layers**: fusion · gene · pathway.
- A plain-language **summary** of every paper's key finding.
- **Full-text search** + combinable filters (fusion / pathway / gene).
- A **Pathways** view that states, for each pathway, how it connects back to
  PAX3::FOXO1 — answering *"which papers on a pathway such as YAP1 are relevant
  to PAX3::FOXO1?"*
- A **Fusions** comparison table covering all eight fusions on the client's list
  (PAX3::FOXO1, PAX7::FOXO1, PAX3::NCOA1, PAX3::NCOA2, PAX3::INO80D, PAX3::FOXO4,
  FOXO1::FGFR1, PAX3::MAML3) plus the fusion-negative context.

## Design

An editorial / scientific direction: warm off-white canvas, a single deep
ink-blue accent, hairline-separated reference lists (no dashboard cards), and a
deliberate typeface pairing — **Newsreader** (serif) + **Libre Franklin** (sans)
+ **IBM Plex Mono** for identifiers. No gradients, no emoji.

## How the real product is built

```
PubMed / Europe PMC harvest  ->  tagging (fusion / gene / pathway)  ->  database  ->  this UI
```

In this demo the data is a curated **export** (`assets/data.js`) so the whole
thing runs in the browser with **no server** and hosts free on GitHub Pages.

## Roadmap

| Stage | Scope |
|------|-------|
| **1 — this demo** | ARMS papers tagged by fusion & gene, searchable, with pathway links. |
| **2 — pathways** | Pull in papers from other cancers / general cell biology per pathway. New data, no rebuild. |
| **3 — data & modelling** | Connect expression datasets (GEO / TCGA-style) and build models. |

---

## Run locally

Static site — no build step, no dependencies.

```bash
# easiest: double-click index.html
# or serve it:
python -m http.server 8000      # then open http://localhost:8000
```

## Deploy to GitHub Pages

1. Push these files to the `main` branch (root).
2. Repo **Settings → Pages**.
3. **Build and deployment → Source → Deploy from a branch**.
4. Branch **main**, folder **/ (root)** → Save.
5. ~1 min later it's live at `https://<username>.github.io/<repo>/`.

The `.nojekyll` file is included so Pages serves the assets as-is.

## Project structure

```
index.html          # app shell + four views
assets/
  styles.css        # editorial/scientific theme
  app.js            # search / filter / pathway + fusion views
  data.js           # the "database export" — 35 PMID-verified papers, fusions, pathways
screenshots/        # rendered previews
.nojekyll
README.md
```

## Data provenance

Every paper's PMID was verified against the NCBI PubMed / E-utilities API.
Summaries are concise paraphrases of each paper's main finding — always consult
the linked primary source. One record (Liu 2011, FOXO1::FGFR1) carries a note
about a later re-interpretation, shown deliberately to surface source-level rigor.
