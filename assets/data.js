/*
 * ARMS Atlas — demo seed dataset
 * ---------------------------------
 * This file is the "database export" that powers the demo UI. In the real
 * product this content is produced by an automated pipeline:
 *   PubMed / Europe PMC harvest  ->  AI tagging (fusion / gene / pathway)  ->  database
 * Here it is hand-curated from 35 real, PMID-verified publications so the
 * client can judge the quality of the interface and the data model.
 *
 * Every paper below has a genuine PubMed ID (verified via NCBI E-utilities).
 * The `fusions`, `genes` and `pathways` arrays use the controlled vocabularies
 * defined in ARMS_DATA.fusions and ARMS_DATA.pathways.
 */
window.ARMS_DATA = {

  /* ----------------------------------------------------------------------
   * FUSIONS  — the molecular subtypes of alveolar rhabdomyosarcoma (ARMS)
   * -------------------------------------------------------------------- */
  fusions: [
    {
      id: "PAX3::FOXO1",
      label: "PAX3::FOXO1",
      color: "#7c3aed",
      partners: "PAX3 (2q36) · FOXO1 (13q14)",
      translocation: "t(2;13)(q35;q14)",
      frequency: "~55–60% of fusion-positive ARMS",
      prognosis: "Adverse",
      prognosisClass: "adverse",
      description:
        "The canonical and most common ARMS fusion. The PAX3 DNA-binding domains are fused to the FOXO1 transactivation domain, producing an aberrant transcription factor that drives a myogenic super-enhancer programme and blocks differentiation. Associated with the worst outcomes."
    },
    {
      id: "PAX7::FOXO1",
      label: "PAX7::FOXO1",
      color: "#2563eb",
      partners: "PAX7 (1p36) · FOXO1 (13q14)",
      translocation: "t(1;13)(p36;q14)",
      frequency: "~20% of fusion-positive ARMS",
      prognosis: "More favourable",
      prognosisClass: "good",
      description:
        "The second major fusion variant. Mechanistically similar to PAX3::FOXO1 but, especially in metastatic disease, carries a notably better prognosis — one of the first examples of fusion subtype guiding risk."
    },
    {
      id: "PAX3::NCOA1",
      label: "PAX3::NCOA1",
      color: "#0891b2",
      partners: "PAX3 (2q36) · NCOA1 (2p23)",
      translocation: "variant fusion",
      frequency: "Rare variant",
      prognosis: "Uncertain",
      prognosisClass: "unknown",
      description:
        "A variant fusion in which FOXO1 is replaced by the nuclear receptor coactivator NCOA1. Reported in alveolar RMS and in biphenotypic sinonasal sarcoma with rhabdomyoblastic differentiation; prognostic value still being defined."
    },
    {
      id: "PAX3::NCOA2",
      label: "PAX3::NCOA2",
      color: "#0d9488",
      partners: "PAX3 (2q36) · NCOA2 (8q13)",
      translocation: "variant fusion",
      frequency: "Rare variant",
      prognosis: "Uncertain",
      prognosisClass: "unknown",
      description:
        "A variant fusion with the coactivator NCOA2. Shown to have a dual role — promoting proliferation while blocking myogenic differentiation — most often described in embryonal-type RMS."
    },
    {
      id: "PAX3::INO80D",
      label: "PAX3::INO80D",
      color: "#4f46e5",
      partners: "PAX3 (2q36) · INO80D (2q33)",
      translocation: "variant fusion",
      frequency: "Very rare variant",
      prognosis: "Uncertain",
      prognosisClass: "unknown",
      description:
        "An emerging variant fusion identified through DNA-methylation profiling, which clusters alongside classic FOXO1-rearranged ARMS — supporting its classification as a true 'fusion-positive' subtype."
    },
    {
      id: "PAX3::FOXO4",
      label: "PAX3::FOXO4",
      color: "#9333ea",
      partners: "PAX3 (2q36) · FOXO4 / AFX (Xq13)",
      translocation: "t(X;2)(q13;q36)",
      frequency: "Very rare variant",
      prognosis: "Uncertain",
      prognosisClass: "unknown",
      description:
        "A rare fusion joining PAX3 to the forkhead family member FOXO4 (AFX). Part of the original spectrum of PAX/FOX fusions catalogued in ARMS."
    },
    {
      id: "FOXO1::FGFR1",
      label: "FOXO1::FGFR1",
      color: "#db2777",
      partners: "FOXO1 (13q14) · FGFR1 (8p11)",
      translocation: "complex / amplified",
      frequency: "Very rare variant",
      prognosis: "Uncertain",
      prognosisClass: "unknown",
      description:
        "A rare fusion found in a solid-variant ARMS, placing the FGFR1 receptor tyrosine kinase under FOXO1 control. Notably therapeutically interesting because it directly implicates a druggable kinase."
    },
    {
      id: "PAX3::MAML3",
      label: "PAX3::MAML3",
      color: "#e11d48",
      partners: "PAX3 (2q36) · MAML3 (4q31)",
      translocation: "variant fusion",
      frequency: "Newly described variant",
      prognosis: "Uncertain",
      prognosisClass: "unknown",
      description:
        "A novel fusion recently identified in ARMS using DNA-methylation profiling. Links the disease to the Notch transcriptional coactivator MAML3; also seen in biphenotypic sinonasal sarcoma."
    },
    {
      id: "fusion-negative",
      label: "Fusion-negative",
      color: "#64748b",
      partners: "No PAX::FOXO1 fusion",
      translocation: "—",
      frequency: "Context subtype",
      prognosis: "Behaves like embryonal RMS",
      prognosisClass: "variable",
      description:
        "ARMS lacking any PAX/FOXO1 fusion. Clinically and molecularly indistinguishable from embryonal RMS, typically driven by RAS-pathway and RTK mutations rather than a fusion. Included so pathway papers from this subtype can be compared."
    }
  ],

  /* ----------------------------------------------------------------------
   * PATHWAYS — the signalling / regulatory layers of the PAX3::FOXO1 cell.
   * `linkToFusion` is the key "stage 2" capability: it explains how each
   * pathway connects back to the PAX3::FOXO1 fusion, so papers from other
   * cancers and general cell biology become relevant to ARMS.
   * -------------------------------------------------------------------- */
  pathways: [
    {
      id: "PI3K/AKT/mTOR",
      category: "Growth & survival",
      color: "#2563eb",
      description:
        "The central growth, metabolism and survival axis, activated downstream of receptor tyrosine kinases such as IGF1R and FGFR4.",
      linkToFusion:
        "Part of the RTK/RAS/PI3K axis altered in ~93% of rhabdomyosarcomas (Shern 2014). A CRISPRi screen showed GATOR2-dependent mTORC1 activity is a specific dependency of FOXO1-fusion-positive tumours (Morales 2022)."
    },
    {
      id: "MAPK/ERK",
      category: "Growth & proliferation",
      color: "#8b5cf6",
      description:
        "The RAS–RAF–MEK–ERK cascade transmitting proliferative signals from the cell surface to the nucleus.",
      linkToFusion:
        "Predominantly a fusion-negative driver — RAS isoform mutations (NRAS/KRAS/HRAS) converge here — but it is part of the same RTK axis the fusion also exploits, making combined PI3K+MAPK blockade attractive."
    },
    {
      id: "Hippo/YAP1",
      category: "Mechano-transcription",
      color: "#0d9488",
      description:
        "A tumour-suppressor kinase cascade (MST1/2 → LATS1/2) that restrains the transcriptional co-activators YAP1 and TAZ.",
      linkToFusion:
        "A direct molecular bridge: PAX3::FOXO1 suppresses the Hippo component RASSF4, inhibiting MST1 and releasing YAP1 to drive proliferation and block differentiation (Crose 2014). This is exactly why a 'YAP1 paper' from another cancer can be relevant to ARMS."
    },
    {
      id: "Wnt/β-catenin",
      category: "Developmental",
      color: "#d97706",
      description:
        "Developmental signalling that stabilises β-catenin to regulate proliferation and the myogenic differentiation programme.",
      linkToFusion:
        "CTNNB1 and Wnt-pathway alterations appear mainly in fusion-negative disease; Wnt stimulation modulates the MyoD/Myogenin differentiation block shared across RMS subtypes."
    },
    {
      id: "Notch",
      category: "Stemness & self-renewal",
      color: "#16a34a",
      description:
        "A cell-fate pathway controlling stemness and self-renewal via the NICD transcriptional complex.",
      linkToFusion:
        "A NOTCH1→SNAIL1→MEF2C axis expands self-renewing tumour-propagating cells and represses myogenic differentiation in RMS (Ignatius 2017). The novel PAX3::MAML3 fusion links the disease to the Notch co-activator MAML3."
    },
    {
      id: "CDK4/6 cell cycle",
      category: "Cell cycle",
      color: "#db2777",
      description:
        "The CDK4/6–Cyclin D–RB–E2F axis that gates entry into the cell cycle.",
      linkToFusion:
        "CDK4 (12q13-14) amplification marks an aggressive fusion-positive ARMS subset and cooperates with CDKN2A/TP53 loss in fusion-driven mouse models (Keller 2004, Olanich 2015)."
    },
    {
      id: "FGFR",
      category: "Receptor tyrosine kinase",
      color: "#0891b2",
      description:
        "Fibroblast growth factor receptor signalling (notably FGFR4) feeding the RAS/MAPK and PI3K cascades.",
      linkToFusion:
        "FGFR4 is a direct transcriptional target of PAX3::FOXO1 (Marshall 2012); activating FGFR4 mutations promote metastasis (Taylor 2009), and rare FGFR1 fusions give the receptor itself an oncogenic role."
    },
    {
      id: "IGF",
      category: "Receptor tyrosine kinase",
      color: "#4f46e5",
      description:
        "Insulin-like growth factor signalling (IGF2 → IGF1R), a classic rhabdomyosarcoma growth driver feeding PI3K and MAPK.",
      linkToFusion:
        "An IGF2 autocrine loop is a long-recognised RMS growth and motility driver (El-Badry 1990); blocking IGF1R suppresses RMS growth in vivo (Kalebic 1994) and has been tested clinically (Pappo 2014)."
    },
    {
      id: "Myogenic differentiation",
      category: "Lineage identity",
      color: "#b45309",
      description:
        "The MyoD/Myogenin muscle-differentiation programme whose arrest defines the rhabdomyosarcoma phenotype.",
      linkToFusion:
        "The fusion's defining act: PAX3::FOXO1 and PAX7::FOXO1 suppress MyoD target genes, locking cells in an undifferentiated, proliferative state (Calhabeu 2013)."
    },
    {
      id: "Apoptosis",
      category: "Cell survival",
      color: "#dc2626",
      description:
        "The BCL-2 / BAX balance governing programmed cell death and chemotherapy response.",
      linkToFusion:
        "Loss of TP53/CDKN2A tumour-suppressor control cooperates with the fusion to enable survival in fusion-driven models (Keller 2004)."
    },
    {
      id: "Epigenetic/super-enhancer",
      category: "Transcriptional / epigenetic",
      color: "#6d28d9",
      description:
        "The chromatin and super-enhancer machinery (BRD4/BET) that amplifies the fusion's transcriptional output.",
      linkToFusion:
        "PAX3::FOXO1 establishes de novo myogenic super-enhancers and recruits BRD4, creating a BET-bromodomain dependency that is a leading therapeutic target (Gryder 2017, 2020)."
    }
  ],

  /* ----------------------------------------------------------------------
   * PAPERS — 35 PMID-verified publications.
   * -------------------------------------------------------------------- */
  papers: [
    {
      pmid: "8275086", doi: "10.1038/ng1193-230", year: 1993,
      title: "Fusion of a fork head domain gene to PAX3 in the solid tumour alveolar rhabdomyosarcoma",
      authors: "Galili et al.", journal: "Nature Genetics", category: "Fusion biology",
      finding: "Identified the t(2;13) translocation in ARMS, showing it fuses PAX3 to a novel forkhead gene (FKHR/FOXO1) to create a chimeric transcription factor — the discovery of the defining PAX3::FOXO1 fusion.",
      fusions: ["PAX3::FOXO1"], genes: ["PAX3", "FOXO1"], pathways: ["Myogenic differentiation"]
    },
    {
      pmid: "8187070", doi: null, year: 1994,
      title: "Fusion of PAX7 to FKHR by the variant t(1;13)(p36;q14) translocation in alveolar rhabdomyosarcoma",
      authors: "Davis et al.", journal: "Cancer Research", category: "Fusion biology",
      finding: "Characterised the variant t(1;13) translocation, showing it fuses PAX7 (rather than PAX3) to FKHR/FOXO1 — defining the second major fusion subtype of ARMS.",
      fusions: ["PAX7::FOXO1"], genes: ["PAX7", "FOXO1", "PAX3"], pathways: ["Myogenic differentiation"]
    },
    {
      pmid: "7862145", doi: "10.1128/MCB.15.3.1522", year: 1995,
      title: "The PAX3-FKHR fusion protein created by the t(2;13) translocation is a more potent transcriptional activator than PAX3",
      authors: "Fredericks et al.", journal: "Molecular and Cellular Biology", category: "Fusion biology",
      finding: "Showed the fusion keeps PAX3's DNA-binding domains but acts as a far stronger transcriptional activator than wild-type PAX3 — establishing it as a dysregulated oncogenic transcription factor.",
      fusions: ["PAX3::FOXO1"], genes: ["PAX3", "FOXO1"], pathways: ["Myogenic differentiation"]
    },
    {
      pmid: "15489287", doi: "10.1101/gad.1244004", year: 2004,
      title: "Alveolar rhabdomyosarcomas in conditional Pax3:Fkhr mice: cooperativity of Ink4a/ARF and Trp53 loss of function",
      authors: "Keller et al.", journal: "Genes & Development", category: "Fusion biology",
      finding: "First conditional knock-in mouse model of ARMS: Pax3:Fkhr is required but not sufficient, cooperating with Ink4a/ARF or Trp53 loss to drive tumours.",
      fusions: ["PAX3::FOXO1"], genes: ["PAX3", "FOXO1", "CDKN2A", "TP53"], pathways: ["CDK4/6 cell cycle", "Apoptosis", "Myogenic differentiation"]
    },
    {
      pmid: "12039929", doi: "10.1200/JCO.2002.03.137", year: 2002,
      title: "PAX3-FKHR and PAX7-FKHR gene fusions are prognostic indicators in alveolar rhabdomyosarcoma: a report from the Children's Oncology Group",
      authors: "Sorensen et al.", journal: "Journal of Clinical Oncology", category: "Clinical / outcome",
      finding: "In a large COG cohort, fusion subtype was prognostic: among metastatic ARMS, PAX7::FOXO1 patients fared far better than PAX3::FOXO1 — establishing fusion status as a clinical biomarker.",
      fusions: ["PAX3::FOXO1", "PAX7::FOXO1", "fusion-negative"], genes: ["PAX3", "PAX7", "FOXO1"], pathways: []
    },
    {
      pmid: "20351326", doi: "10.1200/JCO.2009.26.3814", year: 2010,
      title: "Fusion gene-negative alveolar rhabdomyosarcoma is clinically and molecularly indistinguishable from embryonal rhabdomyosarcoma",
      authors: "Williamson et al.", journal: "Journal of Clinical Oncology", category: "Clinical / outcome",
      finding: "ARMS lacking a PAX/FOXO1 fusion behaves like embryonal RMS — arguing that fusion status, not histology, drives biology and outcome.",
      fusions: ["PAX3::FOXO1", "PAX7::FOXO1", "fusion-negative"], genes: ["PAX3", "PAX7", "FOXO1"], pathways: []
    },
    {
      pmid: "20663909", doi: "10.1158/0008-5472.CAN-10-0582", year: 2010,
      title: "Genome-wide identification of PAX3-FKHR binding sites in rhabdomyosarcoma reveals candidate target genes important for development and cancer",
      authors: "Cao et al.", journal: "Cancer Research", category: "Fusion biology",
      finding: "Mapped PAX3::FOXO1 binding genome-wide, identifying direct targets including FGFR4, MET and IGF2 that define the fusion's oncogenic transcriptional programme.",
      fusions: ["PAX3::FOXO1"], genes: ["PAX3", "FOXO1", "FGFR4", "MET", "IGF2", "MYCN"], pathways: ["FGFR", "IGF", "Myogenic differentiation"]
    },
    {
      pmid: "22710712", doi: "10.1038/onc.2012.73", year: 2013,
      title: "ARMS-associated PAX3/FOXO1A and PAX7/FOXO1A suppress the transcriptional activity of MyoD-target genes in muscle stem cells",
      authors: "Calhabeu et al.", journal: "Oncogene", category: "Fusion biology",
      finding: "Both PAX3::FOXO1 and PAX7::FOXO1 block myogenic differentiation by suppressing MyoD target genes (myogenin, muscle creatine kinase) in muscle stem cells.",
      fusions: ["PAX3::FOXO1", "PAX7::FOXO1"], genes: ["PAX3", "PAX7", "FOXO1", "MYOD1", "MYOG"], pathways: ["Myogenic differentiation"]
    },
    {
      pmid: "24436047", doi: "10.1158/2159-8290.CD-13-0639", year: 2014,
      title: "Comprehensive genomic analysis of rhabdomyosarcoma reveals a landscape of alterations affecting a common genetic axis in fusion-positive and fusion-negative tumors",
      authors: "Shern et al.", journal: "Cancer Discovery", category: "Genomics",
      finding: "Landmark sequencing of 147 tumours: the RTK/RAS/PI3K axis is altered in ~93% of RMS, with RAS, FGFR4, PIK3CA and CTNNB1 changes concentrated in fusion-negative disease — framing genomics-directed therapy.",
      fusions: ["PAX3::FOXO1", "PAX7::FOXO1", "fusion-negative"],
      genes: ["PAX3", "PAX7", "FOXO1", "NRAS", "KRAS", "HRAS", "FGFR4", "PIK3CA", "CTNNB1", "FBXW7", "BCOR", "MYCN", "CDK4"],
      pathways: ["PI3K/AKT/mTOR", "MAPK/ERK", "FGFR", "Wnt/β-catenin", "CDK4/6 cell cycle"]
    },
    {
      pmid: "28446439", doi: "10.1158/2159-8290.CD-16-1297", year: 2017,
      title: "PAX3-FOXO1 establishes myogenic super enhancers and confers BET bromodomain vulnerability",
      authors: "Gryder et al.", journal: "Cancer Discovery", category: "Epigenetic / super-enhancer",
      finding: "PAX3::FOXO1 reprograms the epigenome by creating de novo myogenic super-enhancers that recruit BRD4, creating a BET-bromodomain dependency exploitable with BET inhibitors (e.g. JQ1).",
      fusions: ["PAX3::FOXO1"], genes: ["PAX3", "FOXO1", "BRD4", "MYOD1", "MYOG", "MYCN"], pathways: ["Epigenetic/super-enhancer", "Myogenic differentiation"]
    },
    {
      pmid: "32416589", doi: "10.1016/j.isci.2020.101103", year: 2020,
      title: "Miswired enhancer logic drives a cancer of the muscle lineage",
      authors: "Gryder et al.", journal: "iScience", category: "Epigenetic / super-enhancer",
      finding: "A translocated FOXO1 super-enhancer drives PAX3::FOXO1 expression and rewires the normal PAX3–MyoD–Myogenin circuitry into a self-reinforcing loop that locks cells in an undifferentiated state.",
      fusions: ["PAX3::FOXO1"], genes: ["PAX3", "FOXO1", "MYOD1", "MYOG", "BRD4"], pathways: ["Epigenetic/super-enhancer", "Myogenic differentiation"]
    },
    {
      pmid: "34166060", doi: "10.1200/JCO.20.03060", year: 2021,
      title: "Genomic classification and clinical outcome in rhabdomyosarcoma: a report from an international consortium",
      authors: "Shern et al.", journal: "Journal of Clinical Oncology", category: "Genomics",
      finding: "Largest clinically-annotated genomic study (641 tumours): FOXO1 fusion status plus cooperating events (MYCN, CDK4, TP53, MYOD1) refine risk stratification beyond histology — now informing prospective trials.",
      fusions: ["PAX3::FOXO1", "PAX7::FOXO1", "fusion-negative"],
      genes: ["PAX3", "PAX7", "FOXO1", "MYCN", "CDK4", "TP53", "MYOD1", "NRAS", "KRAS", "HRAS", "CDKN2A", "NF1", "BCOR"],
      pathways: ["MAPK/ERK", "PI3K/AKT/mTOR", "CDK4/6 cell cycle", "Myogenic differentiation", "Apoptosis"]
    },
    {
      pmid: "36282590", doi: "10.1172/jci.insight.162207", year: 2022,
      title: "GATOR2-dependent mTORC1 activity is a therapeutic vulnerability in FOXO1 fusion-positive rhabdomyosarcoma",
      authors: "Morales et al.", journal: "JCI Insight", category: "Pathway biology",
      finding: "A CRISPRi screen identified the GATOR2 complex as a FOXO1-fusion-specific dependency that keeps mTORC1 active; disrupting it blocks amino-acid-driven mTORC1 signalling and tumour growth.",
      fusions: ["PAX3::FOXO1", "PAX7::FOXO1"], genes: ["MTOR", "FOXO1", "PAX3"], pathways: ["PI3K/AKT/mTOR"]
    },
    {
      pmid: "24097859", doi: "10.1158/1078-0432.CCR-13-2177", year: 2013,
      title: "It takes two to tango: dual inhibition of PI3K and MAPK in rhabdomyosarcoma",
      authors: "Jahangiri et al.", journal: "Clinical Cancer Research", category: "Pathway biology",
      finding: "Because of pathway cross-talk, single-pathway targeting fails in RMS; combined PI3K/AKT/mTOR and RAS/MEK/ERK inhibition synergistically suppresses growth.",
      fusions: ["fusion-negative"], genes: ["PIK3CA", "AKT1", "MTOR", "NRAS", "HRAS", "KRAS"], pathways: ["PI3K/AKT/mTOR", "MAPK/ERK"]
    },
    {
      pmid: "19809159", doi: "10.1172/JCI39703", year: 2009,
      title: "Identification of FGFR4-activating mutations in human rhabdomyosarcomas that promote metastasis in xenotransplanted models",
      authors: "Taylor et al.", journal: "Journal of Clinical Investigation", category: "Pathway biology",
      finding: "Recurrent activating FGFR4 mutations (K535, E550) in ~7.5% of RMS increase signalling, proliferation and metastatic potential — establishing FGFR4 as an oncogenic driver and target.",
      fusions: [], genes: ["FGFR4", "STAT3"], pathways: ["FGFR"]
    },
    {
      pmid: "21882254", doi: "10.1002/mc.20848", year: 2012,
      title: "PAX3-FOXO1 and FGFR4 in alveolar rhabdomyosarcoma",
      authors: "Marshall et al.", journal: "Molecular Carcinogenesis", category: "Pathway biology",
      finding: "FGFR4 is a direct transcriptional target of PAX3::FOXO1, and a constitutively active FGFR4 enhances myoblast proliferation and transformation — linking the fusion to FGFR4-driven tumorigenesis.",
      fusions: ["PAX3::FOXO1"], genes: ["FGFR4", "PAX3", "FOXO1"], pathways: ["FGFR"]
    },
    {
      pmid: "2177632", doi: null, year: 1990,
      title: "Insulin-like growth factor II acts as an autocrine growth and motility factor in human rhabdomyosarcoma tumors",
      authors: "El-Badry et al.", journal: "Cell Growth & Differentiation", category: "Pathway biology",
      finding: "Classic study: RMS cells overproduce IGF-II, acting through IGF1R as an autocrine growth and motility factor — establishing IGF signalling as a core RMS driver.",
      fusions: [], genes: ["IGF2", "IGF1R"], pathways: ["IGF"]
    },
    {
      pmid: "7923191", doi: null, year: 1994,
      title: "In vivo treatment with antibody against IGF-1 receptor suppresses growth of human rhabdomyosarcoma and down-regulates p34cdc2",
      authors: "Kalebic et al.", journal: "Cancer Research", category: "Pathway biology",
      finding: "Blocking IGF1R with a specific antibody suppressed RMS growth in vivo and downregulated the cell-cycle kinase p34cdc2 — early in vivo proof of IGF1R as a therapeutic target.",
      fusions: [], genes: ["IGF1R"], pathways: ["IGF", "CDK4/6 cell cycle"]
    },
    {
      pmid: "35459782", doi: "10.1038/s41388-022-02305-x", year: 2022,
      title: "Targeting farnesylation as a novel therapeutic approach in HRAS-mutant rhabdomyosarcoma",
      authors: "Odeniyide et al.", journal: "Oncogene", category: "Pathway biology",
      finding: "HRAS-mutant (mostly fusion-negative) RMS depends on RAS farnesylation; the farnesyltransferase inhibitor tipifarnib mislocalises HRAS and blocks tumour growth.",
      fusions: ["fusion-negative"], genes: ["HRAS"], pathways: ["MAPK/ERK"]
    },
    {
      pmid: "25087979", doi: "10.1016/j.ccr.2014.05.029", year: 2014,
      title: "The Hippo transducer YAP1 transforms activated satellite cells and is a potent effector of embryonal rhabdomyosarcoma formation",
      authors: "Tremblay et al.", journal: "Cancer Cell", category: "Pathway biology",
      finding: "Sustained YAP1 in satellite cells drives embryonal RMS with high penetrance; normalising YAP1 reduces tumour burden and restores differentiation — identifying YAP1 as a driver and differentiation-therapy target.",
      fusions: ["fusion-negative"], genes: ["YAP1"], pathways: ["Hippo/YAP1", "Myogenic differentiation"]
    },
    {
      pmid: "24334454", doi: "10.1172/JCI67087", year: 2014,
      title: "Alveolar rhabdomyosarcoma-associated PAX3-FOXO1 promotes tumorigenesis via Hippo pathway suppression",
      authors: "Crose et al.", journal: "Journal of Clinical Investigation", category: "Pathway biology",
      finding: "A direct fusion–Hippo link: PAX3::FOXO1 suppresses the tumour-suppressor RASSF4, inhibiting MST1 and activating YAP1 to promote proliferation and block differentiation.",
      fusions: ["PAX3::FOXO1"], genes: ["PAX3", "FOXO1", "YAP1", "RASSF4", "STK4"], pathways: ["Hippo/YAP1", "Myogenic differentiation"]
    },
    {
      pmid: "27184927", doi: "10.1002/path.4745", year: 2016,
      title: "The Hippo effector TAZ (WWTR1) transforms myoblasts and TAZ abundance is associated with reduced survival in embryonal rhabdomyosarcoma",
      authors: "Mohamed et al.", journal: "Journal of Pathology", category: "Pathway biology",
      finding: "The Hippo effector TAZ transforms myoblasts, and high TAZ abundance correlates with reduced survival in embryonal RMS — implicating TAZ alongside YAP1.",
      fusions: ["fusion-negative"], genes: ["WWTR1", "YAP1"], pathways: ["Hippo/YAP1"]
    },
    {
      pmid: "23999248", doi: "10.1038/labinvest.2013.97", year: 2013,
      title: "Characterization of Wnt/β-catenin signaling in rhabdomyosarcoma",
      authors: "Annavarapu et al.", journal: "Laboratory Investigation", category: "Pathway biology",
      finding: "Across RMS cell lines, Wnt3a stabilises β-catenin and upregulates myogenic factors (MyoD1, Myf5, Myogenin) — implicating Wnt in the myogenic differentiation block.",
      fusions: [], genes: ["CTNNB1", "MYOD1", "MYF5", "MYOG"], pathways: ["Wnt/β-catenin", "Myogenic differentiation"]
    },
    {
      pmid: "28614716", doi: "10.1016/j.celrep.2017.05.061", year: 2017,
      title: "The NOTCH1/SNAIL1/MEF2C pathway regulates growth and self-renewal in embryonal rhabdomyosarcoma",
      authors: "Ignatius et al.", journal: "Cell Reports", category: "Pathway biology",
      finding: "In a zebrafish model, intracellular NOTCH1 expands self-renewing tumour-propagating cells ~23-fold via SNAIL1, which represses the differentiation factor MEF2C.",
      fusions: ["fusion-negative"], genes: ["NOTCH1", "SNAI1", "MEF2C"], pathways: ["Notch", "Myogenic differentiation"]
    },
    {
      pmid: "25810375", doi: "10.1158/1078-0432.CCR-14-2955", year: 2015,
      title: "CDK4 amplification reduces sensitivity to CDK4/6 inhibition in fusion-positive rhabdomyosarcoma",
      authors: "Olanich et al.", journal: "Clinical Cancer Research", category: "Pathway biology",
      finding: "CDK4 (12q13-14) amplification marks an aggressive fusion-positive subset; CDK4 drives proliferation via RB-E2F, yet amplified tumours are paradoxically less sensitive to CDK4/6 inhibitors.",
      fusions: ["PAX3::FOXO1", "PAX7::FOXO1"], genes: ["CDK4", "CDKN2A", "MYCN", "RB1", "PAX3", "PAX7", "FOXO1"], pathways: ["CDK4/6 cell cycle"]
    },
    {
      pmid: "11607823", doi: "10.1038/sj.onc.1204599", year: 2001,
      title: "Gene fusions involving PAX and FOX family members in alveolar rhabdomyosarcoma",
      authors: "Barr et al.", journal: "Oncogene", category: "Variant fusion",
      finding: "Foundational review cataloguing the spectrum of PAX3/PAX7 fusion partners in ARMS, including the classic FOXO1 fusions and rare variants such as PAX3::NCOA1 and PAX3::FOXO4.",
      fusions: ["PAX3::FOXO1", "PAX7::FOXO1", "PAX3::NCOA1", "PAX3::FOXO4"], genes: ["PAX3", "PAX7", "FOXO1", "NCOA1", "FOXO4"], pathways: ["Myogenic differentiation"]
    },
    {
      pmid: "34424607", doi: "10.1002/pbc.29288", year: 2021,
      title: "PAX3-NCOA1 alveolar rhabdomyosarcoma of the tongue: a rare entity with challenging diagnosis and management",
      authors: "Di Carlo et al.", journal: "Pediatric Blood & Cancer", category: "Variant fusion",
      finding: "Case report of PAX3::NCOA1 ARMS of the tongue with nodal spread, documenting diagnosis and treatment and highlighting the uncertain prognostic value of this variant.",
      fusions: ["PAX3::NCOA1"], genes: ["PAX3", "NCOA1"], pathways: ["Myogenic differentiation"]
    },
    {
      pmid: "26371783", doi: "10.1097/PAS.0000000000000492", year: 2016,
      title: "Novel PAX3-NCOA1 fusions in biphenotypic sinonasal sarcoma with focal rhabdomyoblastic differentiation",
      authors: "Huang et al.", journal: "American Journal of Surgical Pathology", category: "Variant fusion",
      finding: "Identified novel PAX3::NCOA1 fusions in biphenotypic sinonasal sarcoma with rhabdomyoblastic differentiation — expanding the spectrum of PAX3 variant fusions beyond classic ARMS.",
      fusions: ["PAX3::NCOA1"], genes: ["PAX3", "NCOA1"], pathways: ["Myogenic differentiation"]
    },
    {
      pmid: "39209443", doi: "10.1136/jcp-2024-209640", year: 2025,
      title: "Sinonasal alveolar rhabdomyosarcoma with PAX3::NCOA1 fusion expressing SOX10 and with nodal metastases: a double diagnostic pitfall",
      authors: "Crane et al.", journal: "Journal of Clinical Pathology", category: "Variant fusion",
      finding: "A sinonasal ARMS with PAX3::NCOA1 and aberrant SOX10 expression — cautioning that this variant can mimic other sinonasal tumours and create a diagnostic pitfall.",
      fusions: ["PAX3::NCOA1"], genes: ["PAX3", "NCOA1", "SOX10"], pathways: ["Myogenic differentiation"]
    },
    {
      pmid: "24213582", doi: "10.1038/onc.2013.491", year: 2014,
      title: "PAX3-NCOA2 fusion gene has a dual role in promoting the proliferation and inhibiting the myogenic differentiation of rhabdomyosarcoma cells",
      authors: "Yoshida et al.", journal: "Oncogene", category: "Variant fusion",
      finding: "The PAX3::NCOA2 fusion both promotes proliferation and blocks myogenic differentiation — a dual oncogenic role in rhabdomyosarcoma.",
      fusions: ["PAX3::NCOA2"], genes: ["PAX3", "NCOA2"], pathways: ["Myogenic differentiation"]
    },
    {
      pmid: "39147032", doi: "10.1016/j.modpat.2024.100594", year: 2024,
      title: "Novel PAX3::MAML3 fusion identified in alveolar rhabdomyosarcoma, using DNA methylation profiling to expand the genetic spectrum of 'fusion-positive' cases",
      authors: "Dermawan et al.", journal: "Modern Pathology", category: "Variant fusion",
      finding: "Describes ARMS with a novel PAX3::MAML3 fusion that, by methylation profiling, clusters with FOXO1-rearranged and variant PAX3::NCOA1 / PAX3::INO80D ARMS — broadening the 'fusion-positive' definition.",
      fusions: ["PAX3::MAML3", "PAX3::NCOA1", "PAX3::INO80D"], genes: ["PAX3", "MAML3", "NCOA1", "INO80D", "FOXO1"], pathways: ["Myogenic differentiation", "Epigenetic/super-enhancer", "Notch"]
    },
    {
      pmid: "21666686", doi: "10.1038/modpathol.2011.98", year: 2011,
      title: "FOXO1-FGFR1 fusion and amplification in a solid variant of alveolar rhabdomyosarcoma",
      authors: "Liu et al.", journal: "Modern Pathology", category: "Variant fusion",
      finding: "First report of FGFR1 as a FOXO1 fusion partner in a solid-variant ARMS, with co-amplification of the chimeric gene — directly implicating a druggable kinase.",
      note: "A later analysis has proposed this case may be better interpreted as an NSD3::FOXO1 fusion — a good example of why source-level evidence matters.",
      fusions: ["FOXO1::FGFR1"], genes: ["FOXO1", "FGFR1"], pathways: ["FGFR"]
    },
    {
      pmid: "38607246", doi: "10.1002/gcc.23232", year: 2024,
      title: "FGFR1 fusions as a novel molecular driver in rhabdomyosarcoma",
      authors: "de Traux de Wardin et al.", journal: "Genes, Chromosomes & Cancer", category: "Variant fusion",
      finding: "Identifies recurrent FGFR1 fusions (FGFR1::ANK1, FGFR1::TACC1) retaining the kinase domain as novel RMS drivers — suggesting sensitivity to FGFR-targeted therapy.",
      fusions: [], genes: ["FGFR1", "ANK1", "TACC1"], pathways: ["FGFR"]
    },
    {
      pmid: "24797726", doi: "10.1002/cncr.28728", year: 2014,
      title: "A phase 2 trial of R1507, a monoclonal antibody to IGF-1R, in recurrent or refractory rhabdomyosarcoma and other sarcomas (SARC study)",
      authors: "Pappo et al.", journal: "Cancer", category: "Clinical / therapy",
      finding: "The IGF1R antibody R1507 showed only modest single-agent activity in relapsed/refractory sarcomas — establishing IGF1R as a tractable but insufficient monotherapy target.",
      fusions: ["fusion-negative"], genes: ["IGF1R"], pathways: ["IGF", "PI3K/AKT/mTOR"]
    },
    {
      pmid: "38936378", doi: "10.1016/S1470-2045(24)00255-9", year: 2024,
      title: "Addition of temsirolimus to chemotherapy in intermediate-risk rhabdomyosarcoma (ARST1431): a randomised phase 3 trial from the Children's Oncology Group",
      authors: "Gupta et al.", journal: "Lancet Oncology", category: "Clinical / therapy",
      finding: "Adding the mTOR inhibitor temsirolimus to standard VAC/VI chemotherapy did not improve event-free survival in intermediate-risk RMS.",
      fusions: ["fusion-negative", "PAX3::FOXO1", "PAX7::FOXO1"], genes: ["MTOR"], pathways: ["PI3K/AKT/mTOR"]
    }
  ]
};
