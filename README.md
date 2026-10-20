# 🧬 ARMS Atlas — demo

A working **demonstration prototype** of a searchable literature database for
**Alveolar Rhabdomyosarcoma (ARMS)**, linking published papers to their
**fusions**, **genes** and **signalling pathways**.

> ⚠️ This is a *demo*, not the final product. The goal is to show the quality of
> the interface and the underlying data model before building the full pipeline.
> It is for research-workflow evaluation only — **not** a medical/clinical tool.

---

## What it shows

- **35 real, PMID-verified papers** — every record links to its genuine PubMed entry.
- Each paper is tagged across **three separate, linked layers**: fusion · gene · pathway.
- A plain-language **AI-style summary** of every paper's key finding.
- **Full-text search** + combinable filters (fusion / pathway / gene).
- A **Pathway Explorer** that answers the key question:
  *"which papers on a pathway such as YAP1 are relevant to PAX3::FOXO1?"* — each
  pathway card explains how it connects back to the fusion.
- A **Fusions** view covering all eight fusions on the client's list
  (PAX3::FOXO1, PAX7::FOXO1, PAX3::NCOA1, PAX3::NCOA2, PAX3::INO80D, PAX3::FOXO4,
  FOXO1::FGFR1, PAX3::MAML3) plus the fusion-negative context.

## How the real product is built

```
PubMed / Europe PMC harvest  ->  AI tagging (fusion / gene / pathway)  ->  database  ->  this UI
```

In this demo the data is a hand-curated **export** (`assets/data.js`) so the whole
thing runs in the browser with **no server** and can be hosted free on GitHub Pages.
Swapping the demo export for a live database query is the stage-1 build.

## Roadmap

| Stage | Scope |
|------|-------|
| **1 — this demo** | ARMS papers tagged by fusion & gene, searchable, with pathway links. |
| **2 — pathways** | Pull in papers from other cancers / general cell biology per pathway. New data, no rebuild. |
| **3 — data & modelling** | Connect expression datasets (GEO / TCGA-style) and build models. |

---

## Run locally

It's a static site — no build step, no dependencies.

```bash
# easiest: just open the file
#   double-click index.html
#
# or serve it (recommended):
python -m http.server 8000
# then open http://localhost:8000
```

## Deploy to GitHub Pages

1. Create a repo and push these files to the `main` branch (root).
2. In the repo: **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Branch: **main**, folder: **/ (root)**. Save.
5. Wait ~1 minute — your live preview is at
   `https://<username>.github.io/<repo>/`.

The `.nojekyll` file is included so GitHub Pages serves the assets as-is.

## Project structure

```
index.html          # app shell + all four views
assets/
  styles.css        # styling
  app.js            # search / filter / pathway-explorer logic
  data.js           # the "database export" — 35 PMID-verified papers, fusions, pathways
.nojekyll           # tells GitHub Pages to skip Jekyll processing
README.md
```

## Data provenance

Every paper's PMID was verified against the NCBI PubMed/E-utilities API. Summaries
are concise paraphrases of each paper's main finding — always consult the linked
primary source for detail. One record (Liu 2011, FOXO1::FGFR1) carries a note about
a later re-interpretation, included deliberately to show how source-level evidence
is surfaced.
