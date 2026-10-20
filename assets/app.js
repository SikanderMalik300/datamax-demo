/* ===========================================================
   ARMS Atlas — demo application logic (vanilla JS, no build step)
   =========================================================== */
(function () {
  "use strict";

  const DATA = window.ARMS_DATA;
  const { fusions, pathways, papers } = DATA;

  // Lookup maps
  const fusionById = Object.fromEntries(fusions.map(f => [f.id, f]));
  const pathwayById = Object.fromEntries(pathways.map(p => [p.id, p]));

  // ---- Derived: gene frequency ----
  const geneCount = {};
  papers.forEach(p => p.genes.forEach(g => { geneCount[g] = (geneCount[g] || 0) + 1; }));
  const genesSorted = Object.keys(geneCount).sort((a, b) => geneCount[b] - geneCount[a] || a.localeCompare(b));

  // ---- Facet counts ----
  const fusionCount = {};
  fusions.forEach(f => fusionCount[f.id] = papers.filter(p => p.fusions.includes(f.id)).length);
  const pathwayCount = {};
  pathways.forEach(p => pathwayCount[p.id] = papers.filter(x => x.pathways.includes(p.id)).length);

  // ---- State ----
  const state = {
    q: "",
    fusions: new Set(),
    pathways: new Set(),
    genes: new Set(),
    sort: "year-desc"
  };

  // ---- Helpers ----
  const $ = sel => document.querySelector(sel);
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // =====================================================
  // STATS BAR
  // =====================================================
  function renderStats() {
    const stats = [
      { num: papers.length, lbl: "PMID-verified papers" },
      { num: fusions.length - 1, lbl: "Fusion subtypes" }, // minus fusion-negative context
      { num: pathways.length, lbl: "Signalling pathways" },
      { num: genesSorted.length, lbl: "Genes tagged" }
    ];
    $("#stats-bar").innerHTML = stats.map(s =>
      `<div class="stat"><div class="num">${s.num}</div><div class="lbl">${s.lbl}</div></div>`
    ).join("");
    $("#footer-count").textContent = papers.length;
  }

  // =====================================================
  // FILTERS
  // =====================================================
  function renderFilters() {
    // Fusions
    $("#filter-fusion").innerHTML = "";
    fusions.forEach(f => {
      const row = el("label", "opt");
      row.innerHTML = `<input type="checkbox" value="${f.id}">
        <span class="dot" style="background:${f.color}"></span>
        <span>${esc(f.label)}</span>
        <span class="cnt">${fusionCount[f.id]}</span>`;
      row.querySelector("input").addEventListener("change", e => {
        toggleSet(state.fusions, f.id, e.target.checked);
        row.classList.toggle("checked", e.target.checked);
        update();
      });
      row.dataset.fusion = f.id;
      $("#filter-fusion").appendChild(row);
    });

    // Pathways
    $("#filter-pathway").innerHTML = "";
    pathways.forEach(p => {
      const row = el("label", "opt");
      row.innerHTML = `<input type="checkbox" value="${p.id}">
        <span class="dot" style="background:${p.color}"></span>
        <span>${esc(p.id)}</span>
        <span class="cnt">${pathwayCount[p.id]}</span>`;
      row.querySelector("input").addEventListener("change", e => {
        toggleSet(state.pathways, p.id, e.target.checked);
        row.classList.toggle("checked", e.target.checked);
        update();
      });
      row.dataset.pathway = p.id;
      $("#filter-pathway").appendChild(row);
    });

    // Genes (chips)
    $("#filter-gene").innerHTML = "";
    genesSorted.forEach(g => {
      const chip = el("button", "gene-chip", `${esc(g)} <span style="opacity:.6">${geneCount[g]}</span>`);
      chip.dataset.gene = g;
      chip.addEventListener("click", () => {
        const on = !state.genes.has(g);
        toggleSet(state.genes, g, on);
        chip.classList.toggle("checked", on);
        update();
      });
      $("#filter-gene").appendChild(chip);
    });

    // Collapsible groups
    document.querySelectorAll(".filter-group h3").forEach(h => {
      h.addEventListener("click", () => h.parentElement.classList.toggle("collapsed"));
    });
  }

  function toggleSet(set, val, on) { on ? set.add(val) : set.delete(val); }

  function syncFilterUI() {
    document.querySelectorAll("#filter-fusion .opt").forEach(r => {
      const on = state.fusions.has(r.dataset.fusion);
      r.querySelector("input").checked = on; r.classList.toggle("checked", on);
    });
    document.querySelectorAll("#filter-pathway .opt").forEach(r => {
      const on = state.pathways.has(r.dataset.pathway);
      r.querySelector("input").checked = on; r.classList.toggle("checked", on);
    });
    document.querySelectorAll("#filter-gene .gene-chip").forEach(c => {
      c.classList.toggle("checked", state.genes.has(c.dataset.gene));
    });
    $("#search").value = state.q;
  }

  // =====================================================
  // FILTER + SORT LOGIC
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
    return list.slice().sort((a, b) => {
      if (s === "year-asc") return a.year - b.year || a.title.localeCompare(b.title);
      if (s === "title") return a.title.localeCompare(b.title);
      return b.year - a.year || a.title.localeCompare(b.title); // year-desc
    });
  }

  // =====================================================
  // RENDER PAPER LIST
  // =====================================================
  function renderPapers() {
    const list = sortPapers(papers.filter(matches));
    const wrap = $("#paper-list");
    wrap.innerHTML = "";

    $("#result-count").innerHTML = `<b>${list.length}</b> of ${papers.length} papers`;
    $("#empty-state").hidden = list.length !== 0;

    list.forEach(p => wrap.appendChild(paperCard(p)));
    renderActiveChips();
    $("#clear-all").hidden = !(state.q || state.fusions.size || state.pathways.size || state.genes.size);
  }

  function paperCard(p) {
    const accent = p.fusions.length ? fusionById[p.fusions[0]].color : "#94a3b8";
    const card = el("article", "paper-card");
    card.style.setProperty("--card-accent", accent);

    const fusionTags = p.fusions.map(f =>
      `<span class="tag fusion" style="background:${fusionById[f].color}">${esc(fusionById[f].label)}</span>`).join("");
    const pathTags = p.pathways.map(x =>
      `<span class="tag pathway" style="color:${pathwayById[x].color};border-color:${pathwayById[x].color}44">${esc(x)}</span>`).join("");
    const geneTags = p.genes.slice(0, 5).map(g => `<span class="tag gene">${esc(g)}</span>`).join("");
    const moreGenes = p.genes.length > 5 ? `<span class="tag more">+${p.genes.length - 5} genes</span>` : "";

    card.innerHTML = `
      <div class="pc-top">
        <span class="pc-cat">${esc(p.category)}</span>
        <span class="pc-meta">${esc(p.journal)} · ${p.year}</span>
      </div>
      <h3>${esc(p.title)}</h3>
      <div class="authors">${esc(p.authors)} <em>· PMID ${p.pmid}</em></div>
      <p class="finding">${esc(p.finding)}</p>
      <div class="tag-row">${fusionTags}${pathTags}${geneTags}${moreGenes}</div>`;
    card.addEventListener("click", () => openPaperModal(p));
    return card;
  }

  // =====================================================
  // ACTIVE CHIPS
  // =====================================================
  function renderActiveChips() {
    const box = $("#active-chips");
    box.innerHTML = "";
    const add = (label, onRemove) => {
      const c = el("span", "achip", `${esc(label)} <button aria-label="Remove">✕</button>`);
      c.querySelector("button").addEventListener("click", onRemove);
      box.appendChild(c);
    };
    if (state.q) add(`“${state.q}”`, () => { state.q = ""; syncFilterUI(); update(); });
    state.fusions.forEach(f => add(fusionById[f].label, () => { state.fusions.delete(f); syncFilterUI(); update(); }));
    state.pathways.forEach(p => add(p, () => { state.pathways.delete(p); syncFilterUI(); update(); }));
    state.genes.forEach(g => add(g, () => { state.genes.delete(g); syncFilterUI(); update(); }));
  }

  // =====================================================
  // PATHWAY EXPLORER
  // =====================================================
  function renderPathwayGrid() {
    const grid = $("#pathway-grid");
    grid.innerHTML = "";
    pathways.forEach(pw => {
      const card = el("article", "pathway-card");
      card.style.setProperty("--pw", pw.color);
      card.innerHTML = `
        <div class="pw-cat">${esc(pw.category)}</div>
        <h3>${esc(pw.id)}</h3>
        <p>${esc(pw.description)}</p>
        <div class="pw-foot">
          <span class="pw-count">${pathwayCount[pw.id]} paper${pathwayCount[pw.id] === 1 ? "" : "s"}</span>
          <span class="pw-open">Explore →</span>
        </div>`;
      card.addEventListener("click", () => openPathwayModal(pw));
      grid.appendChild(card);
    });
  }

  function openPathwayModal(pw) {
    const linked = sortPapers(papers.filter(p => p.pathways.includes(pw.id)));
    const rows = linked.map(p => `
      <div class="m-paper-row" data-pmid="${p.pmid}">
        <div>
          <div class="m-paper-title">${esc(p.title)}</div>
          <div class="m-paper-meta">${esc(p.authors)} · ${esc(p.journal)} · ${p.year}</div>
        </div>
        <span class="m-paper-arrow" style="color:${pw.color}">→</span>
      </div>`).join("");

    const body = `
      <div class="modal-body-cat" style="color:${pw.color}">${esc(pw.category)} · pathway</div>
      <h2>${esc(pw.id)}</h2>
      <p class="m-meta">${esc(pw.description)}</p>
      <div class="pathway-link-box" style="border-color:${pw.color}44;background:linear-gradient(135deg, ${pw.color}12, #fff)">
        <h4 style="color:${pw.color}">🔗 Connection to PAX3::FOXO1</h4>
        <p>${esc(pw.linkToFusion)}</p>
      </div>
      <div class="m-section">
        <h4>${linked.length} linked paper${linked.length === 1 ? "" : "s"} in the database</h4>
        <div class="m-paper-list">${rows || '<p class="muted">No papers yet — this is where stage-2 cross-pathway literature would appear.</p>'}</div>
      </div>
      <div class="m-actions">
        <button class="btn primary" id="pw-filter" style="background:${pw.color};border-color:${pw.color}">Show these in Papers view</button>
      </div>`;
    openModal(body);

    $("#pw-filter").addEventListener("click", () => {
      state.fusions.clear(); state.genes.clear(); state.q = "";
      state.pathways = new Set([pw.id]);
      closeModal(); switchView("papers"); syncFilterUI(); update();
    });
    document.querySelectorAll("#modal-body .m-paper-row").forEach(r => {
      r.addEventListener("click", () => {
        const p = papers.find(x => x.pmid === r.dataset.pmid);
        if (p) openPaperModal(p);
      });
    });
  }

  // =====================================================
  // FUSIONS VIEW
  // =====================================================
  function renderFusionGrid() {
    const grid = $("#fusion-grid");
    grid.innerHTML = "";
    fusions.forEach(f => {
      const card = el("article", "fusion-card");
      card.style.setProperty("--fu", f.color);
      card.innerHTML = `
        <div class="fu-name">${esc(f.label)}</div>
        <div class="fu-partners">${esc(f.partners)}</div>
        <p>${esc(f.description)}</p>
        <div class="fu-facts">
          <div class="fu-fact"><div class="k">Translocation</div><div class="v">${esc(f.translocation)}</div></div>
          <div class="fu-fact"><div class="k">Frequency</div><div class="v">${esc(f.frequency)}</div></div>
        </div>
        <div style="margin-bottom:13px"><span class="prog ${f.prognosisClass}">${esc(f.prognosis)}</span></div>
        <div class="fu-foot">
          <span class="fu-count"><b>${fusionCount[f.id]}</b> paper${fusionCount[f.id] === 1 ? "" : "s"}</span>
          <span class="fu-open">Filter papers →</span>
        </div>`;
      card.addEventListener("click", () => {
        state.pathways.clear(); state.genes.clear(); state.q = "";
        state.fusions = new Set([f.id]);
        switchView("papers"); syncFilterUI(); update();
      });
      grid.appendChild(card);
    });
  }

  // =====================================================
  // PAPER MODAL
  // =====================================================
  function openPaperModal(p) {
    const fusionTags = p.fusions.length
      ? p.fusions.map(f => `<span class="tag fusion" style="background:${fusionById[f].color}">${esc(fusionById[f].label)}</span>`).join("")
      : '<span class="muted">—</span>';
    const pathTags = p.pathways.length
      ? p.pathways.map(x => `<span class="tag pathway" style="color:${pathwayById[x].color};border-color:${pathwayById[x].color}44">${esc(x)}</span>`).join("")
      : '<span class="muted">—</span>';
    const geneTags = p.genes.map(g => `<span class="tag gene">${esc(g)}</span>`).join("");
    const noteHtml = p.note ? `<div class="m-note">⚠️ ${esc(p.note)}</div>` : "";
    const doiBtn = p.doi ? `<a class="btn" href="https://doi.org/${encodeURIComponent(p.doi)}" target="_blank" rel="noopener">DOI ↗</a>` : "";

    const body = `
      <div class="modal-body-cat">${esc(p.category)}</div>
      <h2>${esc(p.title)}</h2>
      <div class="m-meta">${esc(p.authors)} · ${esc(p.journal)} · ${p.year} · PMID ${p.pmid}</div>
      <div class="m-section">
        <h4>AI summary — key finding</h4>
        <div class="m-finding">${esc(p.finding)}</div>
        ${noteHtml}
      </div>
      <div class="m-section"><h4>Fusion</h4><div class="m-tags">${fusionTags}</div></div>
      <div class="m-section"><h4>Pathways</h4><div class="m-tags">${pathTags}</div></div>
      <div class="m-section"><h4>Genes</h4><div class="m-tags">${geneTags}</div></div>
      <div class="m-actions">
        <a class="btn primary" href="https://pubmed.ncbi.nlm.nih.gov/${p.pmid}/" target="_blank" rel="noopener">View on PubMed ↗</a>
        ${doiBtn}
      </div>`;
    openModal(body);
  }

  // =====================================================
  // MODAL PLUMBING
  // =====================================================
  function openModal(html) {
    $("#modal-body").innerHTML = html;
    $("#modal").hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    $("#modal").hidden = true;
    document.body.style.overflow = "";
  }
  document.querySelectorAll("[data-close]").forEach(e => e.addEventListener("click", closeModal));
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  // =====================================================
  // VIEW SWITCHING
  // =====================================================
  function switchView(name) {
    document.querySelectorAll(".tab").forEach(t => t.classList.toggle("is-active", t.dataset.view === name));
    document.querySelectorAll(".view").forEach(v => v.classList.toggle("is-active", v.id === "view-" + name));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  $("#tabs").addEventListener("click", e => {
    const t = e.target.closest(".tab");
    if (t) switchView(t.dataset.view);
  });

  // =====================================================
  // WIRING
  // =====================================================
  function update() { renderPapers(); }

  let searchTimer;
  $("#search").addEventListener("input", e => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { state.q = e.target.value.trim(); update(); }, 120);
  });
  $("#sort-select").addEventListener("change", e => { state.sort = e.target.value; update(); });
  $("#clear-all").addEventListener("click", clearAll);
  $("#reset-from-empty").addEventListener("click", clearAll);

  function clearAll() {
    state.q = ""; state.fusions.clear(); state.pathways.clear(); state.genes.clear();
    syncFilterUI(); update();
  }

  // =====================================================
  // INIT
  // =====================================================
  renderStats();
  renderFilters();
  renderPathwayGrid();
  renderFusionGrid();
  update();
})();
