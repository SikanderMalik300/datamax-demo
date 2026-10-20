/* ===========================================================
   ARMS Atlas — application logic (vanilla JS, no build step)
   =========================================================== */
(function () {
  "use strict";

  const DATA = window.ARMS_DATA;
  const { fusions, pathways, papers } = DATA;

  /* Muted, harmonious editorial palette — overrides any colours in data.js
     so category colours read as quiet indicators, not a rainbow. */
  const PALETTE = {
    "PAX3::FOXO1": "#2f5d8a", "PAX7::FOXO1": "#2f7d7a", "PAX3::NCOA1": "#b06a4f",
    "PAX3::NCOA2": "#5c7a4a", "PAX3::INO80D": "#53617a", "PAX3::FOXO4": "#7a5a78",
    "FOXO1::FGFR1": "#9a4f46", "PAX3::MAML3": "#a8824a", "fusion-negative": "#8c897f",
    "PI3K/AKT/mTOR": "#2f5d8a", "MAPK/ERK": "#53617a", "Hippo/YAP1": "#2f7d7a",
    "Wnt/β-catenin": "#a8824a", "Notch": "#5c7a4a", "CDK4/6 cell cycle": "#9a4f46",
    "FGFR": "#3f7c8c", "IGF": "#4a5a82", "Myogenic differentiation": "#b06a4f",
    "Apoptosis": "#884b63", "Epigenetic/super-enhancer": "#6a5a86"
  };
  fusions.forEach(f => { if (PALETTE[f.id]) f.color = PALETTE[f.id]; });
  pathways.forEach(p => { if (PALETTE[p.id]) p.color = PALETTE[p.id]; });

  const fusionById = Object.fromEntries(fusions.map(f => [f.id, f]));
  const pathwayById = Object.fromEntries(pathways.map(p => [p.id, p]));

  // Derived
  const geneCount = {};
  papers.forEach(p => p.genes.forEach(g => { geneCount[g] = (geneCount[g] || 0) + 1; }));
  const genesSorted = Object.keys(geneCount).sort((a, b) => geneCount[b] - geneCount[a] || a.localeCompare(b));
  const fusionCount = {}; fusions.forEach(f => fusionCount[f.id] = papers.filter(p => p.fusions.includes(f.id)).length);
  const pathwayCount = {}; pathways.forEach(p => pathwayCount[p.id] = papers.filter(x => x.pathways.includes(p.id)).length);

  // State
  const state = { q: "", fusions: new Set(), pathways: new Set(), genes: new Set(), sort: "year-desc" };

  // Helpers
  const $ = s => document.querySelector(s);
  const el = (t, c, h) => { const n = document.createElement(t); if (c) n.className = c; if (h != null) n.innerHTML = h; return n; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // Tag fragments
  const fusionTag = id => `<span class="t-fusion"><span class="d" style="background:${fusionById[id].color}"></span>${esc(fusionById[id].label)}</span>`;
  const pathTag = id => `<span class="t-path"><span class="d" style="background:${pathwayById[id].color}"></span>${esc(id)}</span>`;
  const geneTag = g => `<span class="t-gene">${esc(g)}</span>`;

  // =====================================================
  // CORPUS LINE (replaces stat cards)
  // =====================================================
  function renderCorpus() {
    $("#corpus").innerHTML =
      `A curated corpus of <b>${papers.length}</b> PMID-verified papers` +
      `<span class="sep">·</span><b>${fusions.length - 1}</b> fusion subtypes` +
      `<span class="sep">·</span><b>${pathways.length}</b> signalling pathways` +
      `<span class="sep">·</span><b>${genesSorted.length}</b> genes`;
    $("#footer-count").textContent = papers.length;
  }

  // =====================================================
  // FILTERS
  // =====================================================
  function renderFilters() {
    $("#filter-fusion").innerHTML = "";
    fusions.forEach(f => {
      const row = el("label", "opt");
      row.dataset.fusion = f.id;
      row.innerHTML = `<input type="checkbox"><span class="box"></span>
        <span class="dot" style="background:${f.color}"></span>
        <span class="name">${esc(f.label)}</span><span class="cnt">${fusionCount[f.id]}</span>`;
      row.querySelector("input").addEventListener("change", e => {
        toggle(state.fusions, f.id, e.target.checked); row.classList.toggle("checked", e.target.checked); update();
      });
      $("#filter-fusion").appendChild(row);
    });

    $("#filter-pathway").innerHTML = "";
    pathways.forEach(p => {
      const row = el("label", "opt");
      row.dataset.pathway = p.id;
      row.innerHTML = `<input type="checkbox"><span class="box"></span>
        <span class="dot" style="background:${p.color}"></span>
        <span class="name">${esc(p.id)}</span><span class="cnt">${pathwayCount[p.id]}</span>`;
      row.querySelector("input").addEventListener("change", e => {
        toggle(state.pathways, p.id, e.target.checked); row.classList.toggle("checked", e.target.checked); update();
      });
      $("#filter-pathway").appendChild(row);
    });

    $("#filter-gene").innerHTML = "";
    genesSorted.forEach(g => {
      const chip = el("button", "gene-chip", `${esc(g)}<span class="gc">${geneCount[g]}</span>`);
      chip.dataset.gene = g;
      chip.addEventListener("click", () => {
        const on = !state.genes.has(g); toggle(state.genes, g, on); chip.classList.toggle("checked", on); update();
      });
      $("#filter-gene").appendChild(chip);
    });

    document.querySelectorAll('.facet[data-group="gene"] h3').forEach(h =>
      h.addEventListener("click", () => h.parentElement.classList.toggle("collapsed")));
  }

  function toggle(set, v, on) { on ? set.add(v) : set.delete(v); }

  function syncUI() {
    document.querySelectorAll("#filter-fusion .opt").forEach(r => {
      const on = state.fusions.has(r.dataset.fusion); r.querySelector("input").checked = on; r.classList.toggle("checked", on);
    });
    document.querySelectorAll("#filter-pathway .opt").forEach(r => {
      const on = state.pathways.has(r.dataset.pathway); r.querySelector("input").checked = on; r.classList.toggle("checked", on);
    });
    document.querySelectorAll("#filter-gene .gene-chip").forEach(c => c.classList.toggle("checked", state.genes.has(c.dataset.gene)));
    $("#search").value = state.q;
  }

  // =====================================================
  // FILTER + SORT
  // =====================================================
  function matches(p) {
    if (state.fusions.size && !p.fusions.some(f => state.fusions.has(f))) return false;
    if (state.pathways.size && !p.pathways.some(x => state.pathways.has(x))) return false;
    if (state.genes.size && !p.genes.some(g => state.genes.has(g))) return false;
    if (state.q) {
      const hay = (p.title + " " + p.finding + " " + p.authors + " " + p.journal + " " +
        p.genes.join(" ") + " " + p.fusions.join(" ") + " " + p.pathways.join(" ")).toLowerCase();
      if (!state.q.toLowerCase().split(/\s+/).every(t => hay.includes(t))) return false;
    }
    return true;
  }
  function sortPapers(list) {
    const s = state.sort;
    return list.slice().sort((a, b) =>
      s === "year-asc" ? (a.year - b.year || a.title.localeCompare(b.title)) :
      s === "title" ? a.title.localeCompare(b.title) :
      (b.year - a.year || a.title.localeCompare(b.title)));
  }

  // =====================================================
  // PAPER LIST
  // =====================================================
  function renderPapers() {
    const list = sortPapers(papers.filter(matches));
    const wrap = $("#paper-list"); wrap.innerHTML = "";
    $("#result-count").innerHTML = `<b>${list.length}</b> of ${papers.length} papers`;
    $("#empty-state").hidden = list.length !== 0;
    list.forEach(p => wrap.appendChild(paperItem(p)));
    renderActiveChips();
    $("#clear-all").hidden = !(state.q || state.fusions.size || state.pathways.size || state.genes.size);
  }

  function paperItem(p) {
    const li = el("li", "paper-item");
    const fus = p.fusions.map(fusionTag).join("");
    const pth = p.pathways.map(pathTag).join("");
    const shownGenes = p.genes.slice(0, 4).map(geneTag).join("");
    const moreGenes = p.genes.length > 4 ? `<span class="t-more">+${p.genes.length - 4}</span>` : "";
    const sep1 = (fus && (pth || shownGenes)) ? '<span class="t-sep"></span>' : "";
    const sep2 = (pth && shownGenes) ? '<span class="t-sep"></span>' : "";

    li.innerHTML = `
      <div class="pi-top">
        <span class="pi-cat">${esc(p.category)}</span>
        <span class="pi-src"><span class="j">${esc(p.journal)}</span> · ${p.year}</span>
      </div>
      <h3>${esc(p.title)}</h3>
      <div class="pi-authors">${esc(p.authors)} &middot; <span class="pmid">PMID ${p.pmid}</span></div>
      <p class="pi-finding">${esc(p.finding)}</p>
      <div class="tags">${fus}${sep1}${pth}${sep2}${shownGenes}${moreGenes}</div>`;
    li.addEventListener("click", () => openPaperModal(p));
    return li;
  }

  // =====================================================
  // ACTIVE CHIPS
  // =====================================================
  function renderActiveChips() {
    const box = $("#active-chips"); box.innerHTML = "";
    const add = (lbl, rm) => {
      const c = el("span", "achip", `${esc(lbl)} <button aria-label="Remove">&times;</button>`);
      c.querySelector("button").addEventListener("click", rm); box.appendChild(c);
    };
    if (state.q) add(`“${state.q}”`, () => { state.q = ""; syncUI(); update(); });
    state.fusions.forEach(f => add(fusionById[f].label, () => { state.fusions.delete(f); syncUI(); update(); }));
    state.pathways.forEach(p => add(p, () => { state.pathways.delete(p); syncUI(); update(); }));
    state.genes.forEach(g => add(g, () => { state.genes.delete(g); syncUI(); update(); }));
  }

  // =====================================================
  // PATHWAY LIST
  // =====================================================
  function renderPathwayList() {
    const wrap = $("#pathway-list"); wrap.innerHTML = "";
    pathways.forEach(pw => {
      const row = el("div", "pw-row");
      row.innerHTML = `
        <div>
          <div class="pw-name"><span class="d" style="background:${pw.color}"></span><h3>${esc(pw.id)}</h3></div>
          <div class="pw-cat">${esc(pw.category)}</div>
        </div>
        <div class="pw-link"><span class="lead-in">Connection to PAX3::FOXO1</span>${esc(pw.linkToFusion)}</div>
        <div class="pw-meta"><div class="pc">${pathwayCount[pw.id]}</div><div class="pl">paper${pathwayCount[pw.id] === 1 ? "" : "s"}</div><div class="go">View &rarr;</div></div>`;
      row.addEventListener("click", () => openPathwayModal(pw));
      wrap.appendChild(row);
    });
  }

  function openPathwayModal(pw) {
    const linked = sortPapers(papers.filter(p => p.pathways.includes(pw.id)));
    const rows = linked.map(p => `
      <div class="m-prow" data-pmid="${p.pmid}">
        <div><div class="m-pt">${esc(p.title)}</div><div class="m-pm">${esc(p.authors)} · ${esc(p.journal)} · ${p.year}</div></div>
        <span class="m-parrow">&rarr;</span>
      </div>`).join("");

    openModal(`
      <div class="m-cat">${esc(pw.category)} · pathway</div>
      <h2>${esc(pw.id)}</h2>
      <div class="m-src">${esc(pw.description)}</div>
      <div class="connect">
        <span class="label">Connection to PAX3::FOXO1</span>
        <p>${esc(pw.linkToFusion)}</p>
      </div>
      <div class="m-block">
        <span class="label">${linked.length} linked paper${linked.length === 1 ? "" : "s"} in the database</span>
        <div class="m-papers">${rows || '<p class="note-inline">No papers yet — this is where stage-2 cross-pathway literature would appear.</p>'}</div>
      </div>
      <div class="m-actions"><button class="btn primary" id="pw-filter">Show these in Papers view</button></div>`);

    $("#pw-filter").addEventListener("click", () => {
      state.fusions.clear(); state.genes.clear(); state.q = ""; state.pathways = new Set([pw.id]);
      closeModal(); switchView("papers"); syncUI(); update();
    });
    document.querySelectorAll("#modal-body .m-prow").forEach(r =>
      r.addEventListener("click", () => { const p = papers.find(x => x.pmid === r.dataset.pmid); if (p) openPaperModal(p); }));
  }

  // =====================================================
  // FUSION TABLE
  // =====================================================
  function renderFusionTable() {
    const tb = $("#fusion-tbody"); tb.innerHTML = "";
    fusions.forEach(f => {
      const tr = el("tr");
      tr.innerHTML = `
        <td>
          <div class="fu-name"><span class="d" style="background:${f.color}"></span>${esc(f.label)}</div>
          <div class="fu-partners">${esc(f.partners)}</div>
          <div class="fu-desc">${esc(f.description)}</div>
        </td>
        <td class="c-trans">${esc(f.translocation)}</td>
        <td class="c-freq">${esc(f.frequency)}</td>
        <td><span class="badge ${f.prognosisClass}">${esc(f.prognosis)}</span></td>
        <td class="num"><span class="fu-papers">${fusionCount[f.id]}</span></td>`;
      tr.addEventListener("click", () => {
        state.pathways.clear(); state.genes.clear(); state.q = ""; state.fusions = new Set([f.id]);
        switchView("papers"); syncUI(); update();
      });
      tb.appendChild(tr);
    });
  }

  // =====================================================
  // PAPER MODAL
  // =====================================================
  function openPaperModal(p) {
    const fus = p.fusions.length ? p.fusions.map(fusionTag).join("") : '<span class="t-gene">—</span>';
    const pth = p.pathways.length ? p.pathways.map(pathTag).join("") : '<span class="t-gene">—</span>';
    const gns = p.genes.map(geneTag).join("");
    const note = p.note ? `<div class="m-note"><span class="label">Note</span> ${esc(p.note)}</div>` : "";
    const doi = p.doi ? `<a class="btn" href="https://doi.org/${encodeURIComponent(p.doi)}" target="_blank" rel="noopener">DOI</a>` : "";

    openModal(`
      <div class="m-cat">${esc(p.category)}</div>
      <h2>${esc(p.title)}</h2>
      <div class="m-src">${esc(p.authors)} · <span class="j">${esc(p.journal)}</span> · ${p.year} · <span class="pmid">PMID ${p.pmid}</span></div>
      <div class="m-block">
        <span class="label">Summary — key finding</span>
        <p class="m-finding">${esc(p.finding)}</p>${note}
      </div>
      <div class="m-block"><span class="label">Fusion</span><div class="m-tags">${fus}</div></div>
      <div class="m-block"><span class="label">Pathways</span><div class="m-tags">${pth}</div></div>
      <div class="m-block"><span class="label">Genes</span><div class="m-tags">${gns}</div></div>
      <div class="m-actions">
        <a class="btn primary" href="https://pubmed.ncbi.nlm.nih.gov/${p.pmid}/" target="_blank" rel="noopener">View on PubMed</a>${doi}
      </div>`);
  }

  // =====================================================
  // MODAL
  // =====================================================
  function openModal(html) { $("#modal-body").innerHTML = html; $("#modal").hidden = false; document.body.style.overflow = "hidden"; }
  function closeModal() { $("#modal").hidden = true; document.body.style.overflow = ""; }
  document.querySelectorAll("[data-close]").forEach(e => e.addEventListener("click", closeModal));
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  // =====================================================
  // VIEWS
  // =====================================================
  function switchView(name) {
    document.querySelectorAll(".tab").forEach(t => t.classList.toggle("is-active", t.dataset.view === name));
    document.querySelectorAll(".view").forEach(v => v.classList.toggle("is-active", v.id === "view-" + name));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  $("#tabs").addEventListener("click", e => { const t = e.target.closest(".tab"); if (t) switchView(t.dataset.view); });

  // =====================================================
  // WIRING
  // =====================================================
  function update() { renderPapers(); }
  let timer;
  $("#search").addEventListener("input", e => { clearTimeout(timer); timer = setTimeout(() => { state.q = e.target.value.trim(); update(); }, 110); });
  $("#sort-select").addEventListener("change", e => { state.sort = e.target.value; update(); });
  $("#clear-all").addEventListener("click", clearAll);
  $("#reset-from-empty").addEventListener("click", clearAll);
  function clearAll() { state.q = ""; state.fusions.clear(); state.pathways.clear(); state.genes.clear(); syncUI(); update(); }

  // Init
  renderCorpus();
  renderFilters();
  renderPathwayList();
  renderFusionTable();
  update();
})();
