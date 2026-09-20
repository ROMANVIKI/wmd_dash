/* ══════════════════════════════════════════════════════════════════════════
   doExcel  — full data export with breed/farm filter support
   Call: doExcel(data, selectedYear, selectedBreed, selectedFarm)
══════════════════════════════════════════════════════════════════════════ */



/* ══════════════════════════════════════════════════════════════════════════
   doPptx  — full data export with breed/farm filter support
   Call: doPptx(data, selectedYear, selectedBreed, selectedFarm)
══════════════════════════════════════════════════════════════════════════ */

async function doPptx(data, selectedYear, selectedBreed = "All Breeds", selectedFarm = "All Farms") {

  const p = new PptxGenJS();
  p.layout  = "LAYOUT_16x9";
  p.title   = "WAFAD Executive Dashboard";
  p.subject = "Poultry Operations";
  p.author  = "WAFAD Group";

  // ── Resolve active filters ──────────────────────────────────────────────
  const isBreedFiltered = selectedBreed !== "All Breeds";
  const isFarmFiltered  = selectedFarm  !== "All Farms";
  const isFiltered      = isBreedFiltered || isFarmFiltered;

  const filterLabel = isFiltered
    ? [
        isFarmFiltered  ? `Farm: ${selectedFarm}`   : null,
        isBreedFiltered ? `Breed: ${selectedBreed}` : null,
      ].filter(Boolean).join(" · ")
    : null;

  // ── Pick the right egg/hatch/feed data buckets ──────────────────────────
  let eD = null;
  if (isFarmFiltered && isBreedFiltered) {
    eD = data?.farmBreedEggData?.[selectedFarm]?.[selectedBreed] || emptyBreedEgg();
  } else if (isFarmFiltered) {
    eD = data?.farmEggData?.[selectedFarm] || emptyBreedEgg();
  } else if (isBreedFiltered) {
    eD = data?.breedEggData?.[selectedBreed] || emptyBreedEgg();
  }
  const hD = isBreedFiltered ? (data?.breedHatchData?.[selectedBreed] || emptyBreedHatch()) : null;

  // ── Helper: pick filtered or global value ───────────────────────────────
  const kpi = (globalVal, filteredVal) =>
    isFiltered ? (filteredVal ?? 0) : (globalVal ?? 0);

  // ── Filtered birds placed ────────────────────────────────────────────────
  const filteredBirdsPlaced = isBreedFiltered
    ? (data?.breedMap?.[selectedBreed] || 0)
    : isFarmFiltered
      ? (data?.farmBirdsPlacedMap?.[selectedFarm] || 0)
      : (data?.kpi?.totalBirdsPlaced || 0);

  // ── Filtered hatchery values ─────────────────────────────────────────────
  const eggsSetWk = hD ? hD.eggsSetWeek  : (data?.hatchery?.eggsSetWeek  || 0);
  const eggsSetMo = hD ? hD.eggsSetMonth : (data?.hatchery?.eggsSetMonth || 0);
  const eggsSetYr = hD ? hD.eggsSetYear  : (data?.hatchery?.eggsSetYear  || 0);
  const goodChkWk = hD ? hD.goodChicksWeek  : (data?.kpi?.goodChicksWeek  || 0);
  const goodChkMo = hD ? hD.goodChicksMonth : (data?.kpi?.goodChicksMonth || 0);
  const goodChkYr = hD ? hD.goodChicksYear  : (data?.kpi?.goodChicksYear  || 0);
  const hatchPctWk = eggsSetWk > 0
    ? parseFloat(((goodChkWk / eggsSetWk) * 100).toFixed(1))
    : (data?.hatchery?.hatchabilityWeek || 0);
  const hatchPctMo = eggsSetMo > 0
    ? parseFloat(((goodChkMo / eggsSetMo) * 100).toFixed(1))
    : (data?.hatchery?.hatchabilityMonth || 0);

  /* ── Palette ──────────────────────────────────────────────────────────── */
  const BG = "F8FAFC", SF = "FFFFFF", SF2 = "E2E8F0", SF3 = "F1F5F9";
  const BL = "1D6FE8", GR = "059669", RD = "DC2626";
  const AM = "D97706", PU = "7C3AED", CY = "0891B2";
  const OR = "EA580C", TX = "1E293B", SO = "64748B", TF = "94A3B8";
  const YL = "FCD34D";
  // Filter accent colour
  const FL = "7C3AED"; // purple for filter badge

  /* ── Layout constants ───────────────────────────────────────────────────── */
  const SLIDE_W  = 10;
  const HDR_H    = 0.52;
  const FOOT_Y   = 5.28;
  const FOOT_H   = 0.345;
  const MARGIN   = 0.20;
  const CONTENT_W = SLIDE_W - MARGIN * 2;
  const CARD_PAD_X = 0.10;
  const LBL_H = 0.18;
  const VAL_H = 0.36;
  const SUB_H = 0.16;

  const k    = data?.kpi                 || {};
  const h    = data?.hatchery            || {};
  const f    = data?.finance             || {};
  const s    = data?.sales               || {};
  const inv  = data?.inventory           || {};
  const wf   = data?.workforce           || {};
  const fm   = data?.feedmill            || {};
  const c4u  = data?.chicken4u           || {};
  const c4uS = c4u?.sales               || {};
  const fd   = data?.feedDeliveries      || {};
  const or   = data?.operationalRequests || {};
  const de   = data?.deptExpenses        || {};
  const now  = new Date().toLocaleString("en-US");
  const targets = data?.targets || {};
  const rawTarget = (metric, period) => {
    const key = `${metric}_${period}`;
    return Object.prototype.hasOwnProperty.call(targets, key) ? targets[key] : null;
  };

  const curYear  = selectedYear || new Date().getFullYear();
  const prevYear = curYear - 1;

  const ALL_BATCHES = (h.allBatches && h.allBatches.length > 0)
    ? h.allBatches
    : (h.weeklyTrend || []).map(w => ({
        batch: w.w, set: w.set, fertile: w.fertile, hatched: w.hatched,
        hatchPct: w.set > 0 ? parseFloat(((w.hatched / w.set) * 100).toFixed(1)) : 0,
        settingDate: "—", hatchedDate: "—", scheduledDate: "—",
      }));

  const fmtN   = (v, dp = 0) => { const n = Number(v ?? 0); return isNaN(n) ? "—" : n.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp }); };
  const fmtCur = v => { const n = Number(v ?? 0); if (isNaN(n) || n === 0) return "—"; if (Math.abs(n) >= 1_000_000) return "GHC " + (n / 1_000_000).toFixed(1) + "M"; if (Math.abs(n) >= 1_000) return "GHC " + (n / 1_000).toFixed(0) + "K"; return "GHC " + n.toLocaleString("en-US", { maximumFractionDigits: 0 }); };
  const fmtK   = v => { const n = Number(v ?? 0); if (isNaN(n) || n === 0) return "—"; if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M"; if (Math.abs(n) >= 1_000) return (n / 1_000).toFixed(1) + "K"; return String(n); };
  const pct    = (a, b) => b > 0 ? parseFloat(((a / b) * 100).toFixed(1)) : 0;

  const bg  = sl => { sl.background = { color: BG }; };

  // ── Header: with optional filter badge ──────────────────────────────────
  const hdr = (sl, title, accent = BL) => {
    sl.addShape(p.shapes.RECTANGLE, { x: 0, y: 0, w: SLIDE_W, h: HDR_H, fill: { color: accent }, line: { color: accent } });

    // Title — narrower when filter badge is shown
    const titleW = filterLabel ? 5.20 : 7.50;
    sl.addText(title, {
      x: 0.28, y: 0, w: titleW, h: HDR_H,
      fontSize: 14, bold: true, color: "FFFFFF",
      fontFace: "Trebuchet MS", valign: "middle", margin: 0,
    });

    // Filter badge
    if (filterLabel) {
      sl.addShape(p.shapes.RECTANGLE, {
        x: 5.52, y: 0.07, w: 3.58, h: HDR_H - 0.14,
        fill: { color: "FFFFFF", transparency: 75 },
        line: { color: "FFFFFF", transparency: 50, pt: 1 },
      });
      sl.addText(`⚡ ${filterLabel}`, {
        x: 5.56, y: 0.07, w: 3.50, h: HDR_H - 0.14,
        fontSize: 7.5, bold: true, color: "FFFFFF",
        fontFace: "Calibri", valign: "middle", margin: 2,
        shrinkText: true,
      });
    }

    sl.addText(`Generated: ${now}`, {
      x: filterLabel ? 9.15 : 7.50, y: 0, w: filterLabel ? 0.75 : 2.30, h: HDR_H,
      fontSize: 7.5, color: "D1E8FF",
      fontFace: "Calibri", align: "right", valign: "middle", margin: 0,
    });
  };

  const footer = sl => {
    sl.addShape(p.shapes.RECTANGLE, { x: 0, y: FOOT_Y, w: SLIDE_W, h: FOOT_H, fill: { color: SF2 }, line: { color: SF2 } });
    const footText = filterLabel
      ? `WAFAD GROUP  ·  Executive Operations Dashboard  ·  Filter: ${filterLabel}  ·  Confidential`
      : "WAFAD GROUP  ·  Executive Operations Dashboard  ·  Confidential";
    sl.addText(footText, {
      x: 0.30, y: FOOT_Y, w: 9.40, h: FOOT_H,
      fontSize: 7, color: SO, fontFace: "Calibri", valign: "middle", align: "center",
    });
  };

  const card = (sl, x, y, w, h, label, value, color, sub = "") => {
    sl.addShape(p.shapes.RECTANGLE, { x, y, w, h, fill: { color: SF }, line: { color: SF2, pt: 1 } });
    sl.addShape(p.shapes.RECTANGLE, { x, y, w, h: 0.04, fill: { color }, line: { color } });
    const innerW = w - CARD_PAD_X * 2;
    const lx = x + CARD_PAD_X;
    sl.addText(label.toUpperCase(), {
      x: lx, y: y + 0.08, w: innerW, h: LBL_H,
      fontSize: 6, color: SO, fontFace: "Calibri", bold: true, margin: 0, valign: "top",
    });
    const valLen = String(value ?? "—").length;
    const valFontSize = valLen <= 8 ? 15 : valLen <= 12 ? 13 : 11;
    sl.addText(String(value ?? "—"), {
      x: lx, y: y + LBL_H + 0.11, w: innerW, h: VAL_H,
      fontSize: valFontSize, bold: true, color, fontFace: "Trebuchet MS",
      margin: 0, valign: "middle", shrinkText: true,
    });
    if (sub) {
      sl.addText(sub, {
        x: lx, y: y + LBL_H + VAL_H + 0.13, w: innerW, h: SUB_H,
        fontSize: 6, color: SO, fontFace: "Calibri", margin: 0, valign: "top", shrinkText: true,
      });
    }
  };

  const cardRow = (count, yTop, cardH, opts = {}) => {
    const gap = opts.gap ?? 0.06, left = opts.left ?? MARGIN, right = opts.right ?? MARGIN;
    const totalW = SLIDE_W - left - right;
    const w = (totalW - gap * (count - 1)) / count;
    return Array.from({ length: count }, (_, i) => ({ x: left + i * (w + gap), y: yTop, w, h: cardH }));
  };

  const tblHdr = (cols, color = BL) =>
    cols.map(text => ({ text, options: { bold: true, color: "FFFFFF", fill: { color }, fontSize: 7.5, fontFace: "Calibri", align: "left" } }));

  const tblRow = (cells, idx, colorsArr = []) =>
    cells.map((text, ci) => ({
      text: String(text ?? "—"),
      options: { color: colorsArr[ci] || TX, fill: { color: idx % 2 === 0 ? SF : SF3 }, fontSize: 7, fontFace: "Calibri", align: "left" },
    }));

  const sectionLabel = (sl, text, x, y, color = SO) => {
    sl.addShape(p.shapes.RECTANGLE, { x, y, w: 0.04, h: 0.22, fill: { color }, line: { color } });
    sl.addText(text, {
      x: x + 0.10, y, w: SLIDE_W - x - 0.20, h: 0.22,
      fontSize: 8, bold: true, color: TX, fontFace: "Calibri", charSpacing: 0.3, margin: 0, valign: "middle",
    });
  };

  // ── "Data not available for filter" notice helper ────────────────────────
  const filterNotice = (sl, y, msg) => {
    sl.addShape(p.shapes.RECTANGLE, {
      x: MARGIN, y, w: CONTENT_W, h: 0.34,
      fill: { color: "F3F0FF" }, line: { color: FL + "44", pt: 1 },
    });
    sl.addText(`ℹ ${msg}`, {
      x: MARGIN + 0.10, y: y + 0.07, w: CONTENT_W - 0.20, h: 0.20,
      fontSize: 8, color: FL, fontFace: "Calibri", valign: "middle",
    });
  };

  /* ════════════════════════════════════════════════════════════════════════
     SLIDE 1 — TITLE
  ════════════════════════════════════════════════════════════════════════ */
  {
    const sl = p.addSlide();
    sl.background = { color: BG };
    sl.addShape(p.shapes.RECTANGLE, { x: 0, y: 0, w: 0.14, h: 5.625, fill: { color: BL }, line: { color: BL } });
    sl.addShape(p.shapes.RECTANGLE, { x: 0, y: 0, w: SLIDE_W, h: 0.05, fill: { color: BL }, line: { color: BL } });
    sl.addImage({ data: LOGO_IMG, x: 0.42, y: 0.28, w: 1.4, h: 1.4 });
    sl.addText("WAFAD GROUP", { x: 0.42, y: 2.05, w: 9, h: 0.50, fontSize: 34, bold: true, color: TX, fontFace: "Trebuchet MS", charSpacing: 4 });
    sl.addText("Executive Operations Dashboard", { x: 0.42, y: 2.62, w: 9, h: 0.62, fontSize: 24, bold: true, color: BL, fontFace: "Trebuchet MS" });
    sl.addText(`Live · CEO & Chairman View  ·  All Divisions  ·  Year: ${curYear}`, { x: 0.42, y: 3.32, w: 9, h: 0.36, fontSize: 12, color: SO, fontFace: "Calibri", charSpacing: 1 });

    // ── Filter badge on title slide ──
    if (filterLabel) {
      sl.addShape(p.shapes.RECTANGLE, { x: 0.42, y: 3.82, w: 5.50, h: 0.42, fill: { color: FL + "1A" }, line: { color: FL + "55", pt: 1 } });
      sl.addText(`⚡ Filtered View: ${filterLabel}`, {
        x: 0.56, y: 3.82, w: 5.20, h: 0.42,
        fontSize: 11, bold: true, color: FL, fontFace: "Calibri", valign: "middle",
      });
    }

    sl.addShape(p.shapes.RECTANGLE, { x: 0, y: 4.82, w: SLIDE_W, h: 0.805, fill: { color: YL }, line: { color: YL } });
    sl.addText(`Generated: ${now}`, { x: 0.32, y: 4.82, w: 9.36, h: 0.805, fontSize: 11, color: TX, fontFace: "Calibri", valign: "middle", align: "center" });
  }

  /* ════════════════════════════════════════════════════════════════════════
     SLIDE 2 — TABLE OF CONTENTS
  ════════════════════════════════════════════════════════════════════════ */
  {
    const sl = p.addSlide(); bg(sl); hdr(sl, "Contents", BL);
    const sections = [
      ["1",  "Flock & Production KPIs",       BL],
      ["2",  "Egg Collection & Quality",       CY],
      ["3",  "Hatchery Performance",           AM],
      ["4",  "Feed Operations",                AM],
      ["5",  "Feed Deliveries (Invoiced)",     CY],
      ["6",  "Feed Cost Analysis",             OR],
      ["7",  "Cost Analysis — Pricing",        OR],
      ["8",  "Chicken4U Field Sales",          AM],
      ["9",  "Financial Snapshot",             GR],
      ["10", "Expenditure Breakdown",          RD],
      ["11", "Operational Requests",           PU],
      ["12", "Breed Performance Detail",       BL],
      ["13", "Farm Performance Detail",        CY],
      ["14", "Inventory & Supply Chain",       PU],
      ["15", "Workforce & HR",                 CY],
      ["16", "Monthly Year-on-Year Trend",     BL],
      ["17", "Risk & Alerts",                  RD],
    ];
    sections.forEach(([num, title, col], i) => {
      const col2 = Math.floor(i / 10), row = i % 10;
      const x = MARGIN + col2 * 4.80, y = 0.64 + row * 0.46;
      sl.addShape(p.shapes.RECTANGLE, { x, y, w: 4.56, h: 0.38, fill: { color: SF }, line: { color: col + "44", pt: 1 } });
      sl.addShape(p.shapes.RECTANGLE, { x, y, w: 0.04, h: 0.38, fill: { color: col }, line: { color: col } });
      sl.addText(num, { x: x + 0.10, y, w: 0.32, h: 0.38, fontSize: 10, bold: true, color: col, fontFace: "Trebuchet MS", valign: "middle", margin: 0 });
      sl.addText(title, { x: x + 0.46, y, w: 3.96, h: 0.38, fontSize: 9, color: TX, fontFace: "Calibri", valign: "middle", margin: 0 });
    });
    if (filterLabel) {
      sl.addShape(p.shapes.RECTANGLE, { x: MARGIN, y: 5.10, w: CONTENT_W, h: 0.14, fill: { color: FL + "1A" }, line: { color: FL + "44" } });
      sl.addText(`⚡ Filtered View: ${filterLabel} — KPI slides show filtered data where available. Financial, C4U & Workforce slides show global totals.`, {
        x: MARGIN + 0.10, y: 5.10, w: CONTENT_W - 0.20, h: 0.14,
        fontSize: 6.5, color: FL, fontFace: "Calibri", valign: "middle",
      });
    }
    footer(sl);
  }

  /* ════════════════════════════════════════════════════════════════════════
     SLIDE 3 — FLOCK & PRODUCTION KPIs  (filter-aware)
  ════════════════════════════════════════════════════════════════════════ */
  {
    const sl = p.addSlide(); bg(sl);
    hdr(sl, "Flock & Production KPIs", BL);

    const CH = 0.90;
    const ROW1_Y = 0.64, ROW2_Y = 0.64 + CH + 0.08;

    const kpis = [
      ["Birds Placed",        fmtN(filteredBirdsPlaced),       BL, isFiltered ? filterLabel : "Total housed"],
      ["Pullets Housed",      isFiltered ? "—" : fmtN(k.totalPulletsHoused),   BL, isFiltered ? "Global only" : "Female birds"],
      ["Cockerels Housed",    isFiltered ? "—" : fmtN(k.totalCockerelsHoused), BL, isFiltered ? "Global only" : "Male birds"],
      ["Female Alive (F)",    isFiltered ? "—" : fmtN(k.femaleAlive),          GR, isFiltered ? "Global only" : "Current female"],
      ["Male Alive (M)",      isFiltered ? "—" : fmtN(k.maleAlive),            GR, isFiltered ? "Global only" : "Current male"],
      ["Eggs Produced (Wk)",
        fmtN(kpi(k.eggsThisWeek, eD?.eggsWeek)), CY,
        isFiltered ? `${filterLabel} · Mo: ${fmtN(kpi(k.eggsThisMonth, eD?.eggsMonth))}` : `Month: ${fmtN(k.eggsThisMonth)}`],
      ["Hatching Eggs (Wk)",
        fmtN(kpi(k.hatchingEggsWeek, eD?.hatchableWeek)), PU,
        `Mo: ${fmtN(kpi(k.hatchingEggsMonth, eD?.hatchableMonth))}`],
      ["Feed Intake (MT Wk)",
        fmtN(eD ? (eD.feedKgWeek / 1000) : k.feedIntakeTonsWeek, 1), AM,
        `Mo: ${fmtN(eD ? (eD.feedKgMonth / 1000) : k.feedIntakeTons, 1)} MT`],
      ["Farm Rejected (Wk)",
        fmtN(kpi(k.farmRejectedEggsWeek, eD?.farmRejectedWeek)), OR,
        `Mo: ${fmtN(kpi(k.farmRejectedEggsMonth, eD?.farmRejectedMonth))}`],
      ["Critical Issues", k.criticalIssues || 0, k.criticalIssues > 0 ? RD : GR, k.criticalIssues > 0 ? "Immediate attention" : "All clear"],
    ];

    const row1 = cardRow(5, ROW1_Y, CH);
    const row2 = cardRow(5, ROW2_Y, CH);
    kpis.forEach(([lbl, val, col, sub], i) => {
      const pos = i < 5 ? row1[i] : row2[i - 5];
      card(sl, pos.x, pos.y, pos.w, pos.h, lbl, val, col, sub);
    });

    // Mortality summary
    const MORT_Y = ROW2_Y + CH + 0.14;
    sectionLabel(sl, "MORTALITY SUMMARY" + (isFiltered ? ` — ${filterLabel}` : ""), MARGIN, MORT_Y, RD);

    const mortCards = cardRow(6, MORT_Y + 0.26, 0.80);
    [
      ["Mortality (Week)",  fmtN(kpi(k.mortalityThisWeek,  eD?.mortalityWeek)),  RD, `Target ≤ ${fmtN(k.mortalityTarget)}`],
      ["Mortality (Month)", fmtN(kpi(k.mortalityThisMonth, eD?.mortalityMonth)), RD, "Monthly total"],
      [`Mortality (${curYear})`, fmtN(kpi(k.mortalityThisYear, eD?.mortalityYear)), RD, `${curYear} cumulative`],
      ["Female Mort (Px)",  fmtN(kpi(k.mortalityFemaleYear, eD?.mortalityFemale)), "#B91C1C", `Wk: ${fmtN(kpi(k.mortalityFemaleWeek, 0))}`],
      ["Male Mort (Cx)",    fmtN(kpi(k.mortalityMaleYear,   eD?.mortalityMale)),   "#7F1D1D", `Wk: ${fmtN(kpi(k.mortalityMaleWeek, 0))}`],
      ["Mortality %", `${k.mortalityPct || 0}%`, k.mortalityPct > 3 ? RD : GR, `Worst: ${isFiltered ? (isFarmFiltered ? selectedFarm : selectedBreed) : k.worstFarm || "—"}`],
    ].forEach(([lbl, val, col, sub], i) => {
      card(sl, mortCards[i].x, mortCards[i].y, mortCards[i].w, mortCards[i].h, lbl, val, col, sub);
    });

    footer(sl);
  }

  /* ════════════════════════════════════════════════════════════════════════
     SLIDE 4 — EGG COLLECTION & QUALITY  (filter-aware)
  ════════════════════════════════════════════════════════════════════════ */
  {
    const sl = p.addSlide(); bg(sl);
    hdr(sl, "Egg Collection & Quality", CY);
    const CH = 0.82;
    const ROW1_Y = 0.64, ROW2_Y = 0.64 + CH + 0.07;

    const kpis = [
      ["Total Eggs (Week)",       fmtN(kpi(k.eggsThisWeek,  eD?.eggsWeek)),  CY, `Target: ${fmtN(k.eggsWeekTarget)}`],
      ["Total Eggs (Month)",      fmtN(kpi(k.eggsThisMonth, eD?.eggsMonth)), CY, `Target: ${fmtN(k.eggsMonthTarget)}`],
      [`Total Eggs (${curYear})`, fmtN(kpi(k.eggsThisYear,  eD?.eggsYear)),  CY, `${curYear} year total`],
      ["Hatching Eggs (Week)",    fmtN(kpi(k.hatchingEggsWeek,  eD?.hatchableWeek)),  PU, `Mo: ${fmtN(kpi(k.hatchingEggsMonth, eD?.hatchableMonth))}`],
      [`Hatching Eggs (${curYear})`, fmtN(kpi(k.hatchingEggsYear, 0)), PU, `${curYear} year total`],
      ["Storage Eggs Available",
        fmtN(isBreedFiltered ? (data?.breedStorageEggs?.[selectedBreed] || 0) : k.storageEggsAvailable),
        PU, isBreedFiltered ? `Breed: ${selectedBreed}` : "All breeds in storage"],
      ["Farm Rejected (Week)",    fmtN(kpi(k.farmRejectedEggsWeek,  eD?.farmRejectedWeek)),  OR, ""],
      ["Farm Rejected (Month)",   fmtN(kpi(k.farmRejectedEggsMonth, eD?.farmRejectedMonth)), OR, ""],
      ["Cracked Eggs (Cum.)",     fmtN(isFiltered ? (eD?.crackedTotal ?? "—") : k.crackedEggs), OR, isFiltered ? "Filtered" : "Cumulative"],
      ["Floor Eggs (Cum.)",       fmtN(isFiltered ? (eD?.floorTotal   ?? "—") : k.floorEggs),   AM, isFiltered ? "Filtered" : "Cumulative"],
    ];

    const row1 = cardRow(5, ROW1_Y, CH);
    const row2 = cardRow(5, ROW2_Y, CH);
    kpis.forEach(([lbl, val, col, sub], i) => {
      const pos = i < 5 ? row1[i] : row2[i - 5];
      card(sl, pos.x, pos.y, pos.w, pos.h, lbl, val, col, sub);
    });

    const storageY = ROW2_Y + CH + 0.14;
    const storageBreeds = isBreedFiltered
      ? [[selectedBreed, data?.breedStorageEggs?.[selectedBreed] || 0]]
      : Object.entries(data?.breedStorageEggs || {}).sort((a, b) => b[1] - a[1]);

    if (storageBreeds.length > 0) {
      sectionLabel(sl, `STORAGE EGGS BY BREED${isBreedFiltered ? ` — ${selectedBreed}` : ` — ${storageBreeds.length} BREEDS`}`, MARGIN, storageY, PU);
      sl.addTable([
        tblHdr(["Breed", "Available Eggs"], PU),
        ...storageBreeds.map(([b, q], idx) => tblRow([b, fmtN(q)], idx, [TX, PU])),
      ], {
        x: MARGIN, y: storageY + 0.26, w: CONTENT_W,
        colW: [CONTENT_W * 0.7, CONTENT_W * 0.3],
        fontSize: 7, border: { type: "solid", color: SF2 }, fill: { color: SF }, rowH: 0.22,
        autoPage: true, autoPageRepeatHeader: true,
      });
    }
    footer(sl);
  }

  /* ════════════════════════════════════════════════════════════════════════
     SLIDE 5 — HATCHERY PERFORMANCE  (filter-aware)
  ════════════════════════════════════════════════════════════════════════ */
  {
    const sl = p.addSlide(); bg(sl);
    hdr(sl, "Hatchery Performance", AM);
    const CH = 0.82;
    const ROW1_Y = 0.64, ROW2_Y = 0.64 + CH + 0.07;

    const kpis = [
      ["Eggs Set (Week)",      fmtN(eggsSetWk), AM, `Target: ${fmtN(k.eggsSetWeekTarget)}`],
      ["Eggs Set (Month)",     fmtN(eggsSetMo), AM, `Target: ${fmtN(k.eggsSetMonthTarget)}`],
      ["Eggs Set (Year)",      fmtN(eggsSetYr), AM, "Year to date"],
      ["Good Chicks (Week)",   fmtN(goodChkWk), GR, `Target: ${fmtN(k.goodChicksWeekTarget)}`],
      ["Good Chicks (Month)",  fmtN(goodChkMo), GR, `Target: ${fmtN(k.goodChicksMonthTarget)}`],
      ["Good Chicks (Year)",   fmtN(goodChkYr), GR, "Year to date"],
      ["Poor Chicks / Culls",  isFiltered ? "—" : fmtN(h.poorChicks), RD, isFiltered ? "Global only" : "Month"],
      ["DOC Available",        fmtN(isBreedFiltered ? (data?.breedDOC?.[selectedBreed] || 0) : k.totalDOC), BL, isBreedFiltered ? `Breed: ${selectedBreed}` : "Day Old Chicks"],
      ["Hatch Forecast (Wk)",  fmtN(k.hatchForecastWeek),  PU, "Scheduled hatch dates"],
      ["Hatch Forecast (Mo)",  fmtN(k.hatchForecastMonth), PU, "This month forecast"],
    ];

    const row1 = cardRow(5, ROW1_Y, CH);
    const row2 = cardRow(5, ROW2_Y, CH);
    kpis.forEach(([lbl, val, col, sub], i) => {
      const pos = i < 5 ? row1[i] : row2[i - 5];
      card(sl, pos.x, pos.y, pos.w, pos.h, lbl, val, col, sub);
    });

    const RATE_Y = ROW2_Y + CH + 0.14;
    sectionLabel(sl, `HATCH RATES${isBreedFiltered ? ` — ${selectedBreed}` : ""}`, MARGIN, RATE_Y, AM);
    const rateCards = cardRow(5, RATE_Y + 0.26, 0.82);
    const hatchTgtWk = rawTarget("hatchability", "week");
    const hatchTgtMo = rawTarget("hatchability", "month");
    const fertTgt    = rawTarget("fertility", "month");

    [
      ["Hatchability % (Wk)", `${hatchPctWk}%`, hatchPctWk >= (hatchTgtWk ?? 85) ? GR : RD,
        hatchTgtWk != null ? `Target Config: ${hatchTgtWk}%` : "Default 85%"],
      ["Hatchability % (Mo)", `${hatchPctMo}%`, hatchPctMo >= (hatchTgtMo ?? 85) ? GR : RD,
        hatchTgtMo != null ? `Target Config: ${hatchTgtMo}%` : "Default 85%"],
      ["Fertility Rate %",    isFiltered ? "—" : `${h.fertilityRate || 0}%`,
        isFiltered ? SO : (h.fertilityRate >= (fertTgt ?? 90) ? GR : AM),
        isFiltered ? "Global only" : (fertTgt != null ? `Target: ${fertTgt}%` : "Default 90%")],
      ["Eggs Set Target (Wk)", k.eggsSetWeekTarget > 0 ? fmtN(k.eggsSetWeekTarget) : "Not Set", AM, ""],
      ["Chicks Target (Wk)",   k.goodChicksWeekTarget > 0 ? fmtN(k.goodChicksWeekTarget) : "Not Set", GR, ""],
    ].forEach(([lbl, val, col, sub], i) => {
      card(sl, rateCards[i].x, rateCards[i].y, rateCards[i].w, rateCards[i].h, lbl, val, col, sub);
    });

    // Recent batches preview
    const recentBatches = ALL_BATCHES.slice(-6);
    if (recentBatches.length > 0) {
      const TBL_Y = RATE_Y + 0.26 + 0.82 + 0.10;
      sectionLabel(sl, `RECENT ${recentBatches.length} BATCHES — See next slide for all ${ALL_BATCHES.length}`, MARGIN, TBL_Y, AM);
      sl.addTable([
        tblHdr(["Batch", "Eggs Set", "Fertile", "Hatched", "Hatch %"], AM),
        ...recentBatches.map((b, idx) => {
          const hp = b.set > 0 ? ((b.hatched / b.set) * 100).toFixed(1) + "%" : "—";
          return tblRow([b.batch, fmtN(b.set), fmtN(b.fertile), fmtN(b.hatched), hp], idx, [AM, TX, CY, GR, GR]);
        }),
      ], { x: MARGIN, y: TBL_Y + 0.26, w: CONTENT_W, colW: [1.93, 1.93, 1.93, 1.93, 1.88], fontSize: 7, border: { type: "solid", color: SF2 }, fill: { color: SF }, rowH: 0.22 });
    }
    footer(sl);
  }

  /* ════════════════════════════════════════════════════════════════════════
     SLIDE 5b — COMPLETE BATCH HISTORY
  ════════════════════════════════════════════════════════════════════════ */
  {
    const sl = p.addSlide(); bg(sl);
    hdr(sl, `Complete Hatchery Batch History — All ${ALL_BATCHES.length} Batches`, GR);
    const totalSet     = ALL_BATCHES.reduce((s, b) => s + b.set,     0);
    const totalFertile = ALL_BATCHES.reduce((s, b) => s + b.fertile, 0);
    const totalHatched = ALL_BATCHES.reduce((s, b) => s + b.hatched, 0);
    const overallHatch = totalSet > 0 ? parseFloat(((totalHatched / totalSet) * 100).toFixed(1)) : 0;
    const overallFert  = totalSet > 0 ? parseFloat(((totalFertile / totalSet) * 100).toFixed(1)) : 0;
    const peakBatch    = ALL_BATCHES.reduce((best, b) => b.hatched > best.hatched ? b : best, { hatched: 0, batch: "—" });

    const topCards = cardRow(6, 0.64, 0.82);
    [
      ["Total Batches",        fmtN(ALL_BATCHES.length), AM, "Start to today"],
      ["Total Eggs Set",       fmtN(totalSet),            AM, "All batches combined"],
      ["Total Fertile",        fmtN(totalFertile),        CY, `Fertility: ${overallFert}%`],
      ["Total Good Chicks",    fmtN(totalHatched),        GR, "All batches combined"],
      ["Overall Hatchability", `${overallHatch}%`,        overallHatch >= 85 ? GR : RD, `Target ≥${k.hatchabilityTarget || 85}%`],
      ["Best Batch",           peakBatch.batch,           BL, `${fmtN(peakBatch.hatched)} chicks hatched`],
    ].forEach(([lbl, val, col, sub], i) => {
      card(sl, topCards[i].x, topCards[i].y, topCards[i].w, topCards[i].h, lbl, val, col, sub);
    });

    if (ALL_BATCHES.length > 0) {
      sl.addTable([
        tblHdr(["#", "Batch", "Set Date", "Hatch Date", "Eggs Set", "Fertile", "Fert %", "Hatched", "Hatch %", "Culls"], GR),
        ...ALL_BATCHES.map((b, idx) => {
          const fertPct  = b.set > 0 ? ((b.fertile / b.set) * 100).toFixed(1) + "%" : "—";
          const hatchPct = b.set > 0 ? ((b.hatched / b.set) * 100).toFixed(1) + "%" : "—";
          const infert   = b.fertile > b.hatched ? fmtN(b.fertile - b.hatched) : "—";
          return tblRow(
            [idx + 1, b.batch, b.settingDate || "—", b.hatchedDate || "—",
             fmtN(b.set), fmtN(b.fertile), fertPct, fmtN(b.hatched), hatchPct, infert],
            idx, [SO, AM, TF, TF, TX, CY, CY, GR, b.set > 0 && parseFloat(hatchPct) >= 85 ? GR : RD, OR]);
        }),
        [
          { text: "TOTAL", options: { bold: true, color: TX, fill: { color: SF2 }, fontSize: 7, fontFace: "Calibri", align: "left" } },
          { text: "",       options: { bold: true, color: TX, fill: { color: SF2 }, fontSize: 7, fontFace: "Calibri", align: "left" } },
          { text: "",       options: { bold: false,color: TF, fill: { color: SF2 }, fontSize: 7, fontFace: "Calibri", align: "left" } },
          { text: "",       options: { bold: false,color: TF, fill: { color: SF2 }, fontSize: 7, fontFace: "Calibri", align: "left" } },
          { text: fmtN(totalSet),     options: { bold: true, color: AM, fill: { color: SF2 }, fontSize: 7, fontFace: "Calibri", align: "left" } },
          { text: fmtN(totalFertile), options: { bold: true, color: CY, fill: { color: SF2 }, fontSize: 7, fontFace: "Calibri", align: "left" } },
          { text: `${overallFert}%`,  options: { bold: true, color: CY, fill: { color: SF2 }, fontSize: 7, fontFace: "Calibri", align: "left" } },
          { text: fmtN(totalHatched), options: { bold: true, color: GR, fill: { color: SF2 }, fontSize: 7, fontFace: "Calibri", align: "left" } },
          { text: `${overallHatch}%`, options: { bold: true, color: overallHatch >= 85 ? GR : RD, fill: { color: SF2 }, fontSize: 7, fontFace: "Calibri", align: "left" } },
          { text: "",                 options: { bold: false,color: TX, fill: { color: SF2 }, fontSize: 7, fontFace: "Calibri", align: "left" } },
        ],
      ], {
        x: MARGIN, y: 0.64 + 0.82 + 0.14, w: CONTENT_W,
        colW: [0.38, 1.00, 0.92, 0.92, 0.88, 0.88, 0.72, 0.88, 0.72, 1.30],
        fontSize: 7, border: { type: "solid", color: SF2 }, fill: { color: SF }, rowH: 0.22,
        autoPage: true, autoPageRepeatHeader: true,
      });
    }
    footer(sl);
  }

  /* ════════════════════════════════════════════════════════════════════════
     SLIDE 6 — FEED OPERATIONS  (filter-aware)
  ════════════════════════════════════════════════════════════════════════ */
  {
    const sl = p.addSlide(); bg(sl);
    hdr(sl, "Feed Operations — Feed Mill", AM);

    if (isFiltered) {
      filterNotice(sl, 0.64, "Feed Mill production data is global (plant-level). Breed/farm-specific consumed kg is shown below.");
    }

    const Y0 = isFiltered ? 1.04 : 0.64;
    const CH = 0.82;
    const ROW1_Y = Y0, ROW2_Y = Y0 + CH + 0.07;

    // Filtered feed kg consumed
    const filtFeedKgWk = eD ? eD.feedKgWeek  : (k.feedIntakeTonsWeek  || 0) * 1000;
    const filtFeedKgMo = eD ? eD.feedKgMonth : (k.feedIntakeTons      || 0) * 1000;
    const filtFeedKgYr = eD ? eD.feedKgYear  : (k.feedIntakeTonsYear  || 0) * 1000;
    const filtFeedCostMo = isBreedFiltered
      ? (fd.breedCostMonth?.[selectedBreed] || 0)
      : isFarmFiltered ? (fd.byFarm?.[selectedFarm] || 0) : fd.costMonth;

    const kpis = [
      ["Produced (MT/Month)",  fmtN(fm.producedMT, 1),    AM, `Day: ${fmtN(fm.producedDay, 1)} MT · Wk: ${fmtN(fm.producedWeekMT, 1)} MT`],
      ["Produced (MT/Year)",   fmtN(fm.producedYearMT, 1),AM, "Year to date — global"],
      ["Consumed kg (Wk)",     fmtN(filtFeedKgWk) + " kg", isFiltered ? PU : BL, isFiltered ? filterLabel : "from daily ops"],
      ["Consumed kg (Mo)",     fmtN(filtFeedKgMo) + " kg", isFiltered ? PU : BL, isFiltered ? filterLabel : "from daily ops"],
      ["Set Price/kg",
        k.costPerFeedKg > 0 ? `GHC ${k.costPerFeedKg}` : "—", GR,
        k.feedCostKgTarget > 0 ? `Target Config: GHC ${k.feedCostKgTarget}` : "Auto"],
      ["Delivery Cost/kg (Mo)", fd.costPerKg > 0 ? `GHC ${fd.costPerKg}` : "—", CY, "Weighted avg from invoices"],
      ["Feed Delivery Cost (Mo)", fmtCur(filtFeedCostMo), OR,
        isFiltered ? filterLabel : `Week: ${fmtCur(fd.costWeek)}`],
      ["Feed Delivery Cost (Yr)", fmtCur(isBreedFiltered ? (fd.breedCostYear?.[selectedBreed] || 0) : fd.costYear), OR, "Year to date"],
      ["Prod vs Demand %", `${fm.productionVsDemand || 0}%`, fm.productionVsDemand >= 95 ? GR : AM, "Issued ÷ Produced — global"],
      ["Consumed kg (Yr)",  fmtN(filtFeedKgYr) + " kg", isFiltered ? PU : CY, isFiltered ? filterLabel : "Year to date"],
    ];

    const row1 = cardRow(5, ROW1_Y, CH);
    const row2 = cardRow(5, ROW2_Y, CH);
    kpis.forEach(([lbl, val, col, sub], i) => {
      const pos = i < 5 ? row1[i] : row2[i - 5];
      card(sl, pos.x, pos.y, pos.w, pos.h, lbl, val, col, sub);
    });

    // Variance table
    const TBL_Y = ROW2_Y + CH + 0.14;
    sectionLabel(sl, "CONSUMED vs ACTUAL DELIVERY COST", MARGIN, TBL_Y, AM);
    sl.addTable([
      tblHdr(["Period", "Consumed kg", "Std Cost (kg × set price)", "Actual Delivery Cost", "Variance", "Direction"], AM),
      ...["Week", "Month", "Year"].map((period, idx) => {
        const kgMap  = { Week: fd.consumedKgWeek,   Month: fd.consumedKgMonth,   Year: fd.consumedKgYear   };
        const ccMap  = { Week: fd.consumedCostWeek, Month: fd.consumedCostMonth, Year: fd.consumedCostYear };
        const acMap  = { Week: fd.costWeek,         Month: fd.costMonth,         Year: fd.costYear          };
        const varMap = { Week: fd.varianceWeek,     Month: fd.varianceMonth,     Year: fd.varianceYear      };
        const variance = varMap[period] || 0;
        const dir = variance > 0 ? "Over Standard" : variance < 0 ? "Under Standard" : "On Target";
        return tblRow(
          [period, fmtN(kgMap[period]) + " kg", fmtCur(ccMap[period]), fmtCur(acMap[period]),
           variance !== 0 ? `${variance > 0 ? "+" : ""}${fmtCur(variance)}` : "—", dir],
          idx, [TX, CY, AM, OR, variance > 0 ? RD : GR, variance > 0 ? RD : GR]);
      }),
    ], { x: MARGIN, y: TBL_Y + 0.26, w: CONTENT_W, colW: [0.80, 1.50, 2.10, 2.10, 1.55, 1.55],
         fontSize: 7, border: { type: "solid", color: SF2 }, fill: { color: SF }, rowH: 0.26 });
    footer(sl);
  }

  /* ════════════════════════════════════════════════════════════════════════
     SLIDE 7 — FEED DELIVERIES  (filter-aware)
  ════════════════════════════════════════════════════════════════════════ */
  {
    const sl = p.addSlide(); bg(sl);
    hdr(sl, "Feed Deliveries — Actual Invoiced Cost", CY);

    const filtFeedCostWk = isBreedFiltered ? (fd.breedCostWeek?.[selectedBreed]  || 0) : isFarmFiltered ? (fd.byFarm?.[selectedFarm] || 0) : fd.costWeek;
    const filtFeedCostMo = isBreedFiltered ? (fd.breedCostMonth?.[selectedBreed] || 0) : isFarmFiltered ? (fd.byFarm?.[selectedFarm] || 0) : fd.costMonth;
    const filtFeedCostYr = isBreedFiltered ? (fd.breedCostYear?.[selectedBreed]  || 0) : fd.costYear;

    const topCards = cardRow(4, 0.64, 0.88);
    [
      ["Delivery Cost (Wk)", fmtCur(filtFeedCostWk), AM, isFiltered ? filterLabel : `kg: ${fmtN(fd.kgWeek)}`],
      ["Delivery Cost (Mo)", fmtCur(filtFeedCostMo), AM, isFiltered ? filterLabel : `kg: ${fmtN(fd.kgMonth)}`],
      ["Delivery Cost (Yr)", fmtCur(filtFeedCostYr), AM, isFiltered ? filterLabel : `kg: ${fmtN(fd.kgYear)}`],
      ["Actual Cost/kg (Mo)", `GHC ${fd.costPerKg || 0}`, CY, "Weighted avg — global"],
    ].forEach(([lbl, val, col, sub], i) => {
      card(sl, topCards[i].x, topCards[i].y, topCards[i].w, topCards[i].h, lbl, val, col, sub);
    });

    const SEC_Y   = 0.64 + 0.88 + 0.14;
    const LEFT_W  = 4.64, RIGHT_W = CONTENT_W - LEFT_W - 0.10;
    const LEFT_X  = MARGIN, RIGHT_X = MARGIN + LEFT_W + 0.10;

    // Breeds — filtered or full
    const breedFeedList = isBreedFiltered
      ? [[selectedBreed, fd.breedCostMonth?.[selectedBreed] || 0]]
      : Object.entries(fd.breedCostMonth || {}).sort((a, b) => b[1] - a[1]);

    sectionLabel(sl, `FEED COST BY BREED${isBreedFiltered ? ` — ${selectedBreed}` : ` — THIS MONTH (${breedFeedList.length})`}`, LEFT_X, SEC_Y, CY);
    if (breedFeedList.length) {
      sl.addTable([
        tblHdr(["Breed", "Cost (GHC)", "kg (Mo)", "Cost/kg"], CY),
        ...breedFeedList.map(([breed, cost], idx) => {
          const kg = fd.breedKgMonth?.[breed] || 0;
          return tblRow([breed, fmtCur(cost), fmtN(kg), kg > 0 ? `GHC ${(cost / kg).toFixed(2)}` : "—"], idx, [AM, TX, CY, OR]);
        }),
      ], { x: LEFT_X, y: SEC_Y + 0.26, w: LEFT_W, colW: [1.60, 1.20, 1.02, 0.82],
           fontSize: 7, border: { type: "solid", color: SF2 }, fill: { color: SF }, rowH: 0.24,
           autoPage: true, autoPageRepeatHeader: true });
    }

    // Farms — filtered or full
    const farmFeedList = isFarmFiltered
      ? [[selectedFarm, fd.byFarm?.[selectedFarm] || 0]]
      : Object.entries(fd.byFarm || {}).sort((a, b) => b[1] - a[1]);

    sectionLabel(sl, `FEED COST BY FARM${isFarmFiltered ? ` — ${selectedFarm}` : ` — ALL TIME (${farmFeedList.length})`}`, RIGHT_X, SEC_Y, CY);
    if (farmFeedList.length) {
      sl.addTable([
        tblHdr(["Farm", "Total Cost (GHC)"], CY),
        ...farmFeedList.map(([farm, cost], idx) => tblRow([farm, fmtCur(cost)], idx, [TX, OR])),
      ], { x: RIGHT_X, y: SEC_Y + 0.26, w: RIGHT_W, colW: [3.36, 1.50],
           fontSize: 7, border: { type: "solid", color: SF2 }, fill: { color: SF }, rowH: 0.24,
           autoPage: true, autoPageRepeatHeader: true });
    }

    // Recent deliveries
    const safeDelY = 4.10;
    sectionLabel(sl, `RECENT DELIVERIES (${(fd.recent || []).length})`, MARGIN, safeDelY, CY);
    if ((fd.recent || []).length) {
      sl.addTable([
        tblHdr(["Date", "Feed Name", "Type", "Qty (kg)", "Cost (GHC)", "Cost/kg", "Bins"], CY),
        ...(fd.recent || []).map((r, idx) =>
          tblRow([r.date?.slice(0, 10) || "—", r.feedName, r.feedType, fmtN(r.qtyKg), fmtCur(r.feedCost), `GHC ${r.costPerKg || 0}`, r.binCount], idx, [TF, TX, SO, CY, GR, OR, TX])),
      ], { x: MARGIN, y: safeDelY + 0.26, w: CONTENT_W, colW: [0.88, 2.10, 1.00, 0.96, 1.28, 1.08, 2.30],
           fontSize: 7, border: { type: "solid", color: SF2 }, fill: { color: SF }, rowH: 0.22,
           autoPage: true, autoPageRepeatHeader: true });
    }
    footer(sl);
  }

  /* ════════════════════════════════════════════════════════════════════════
     SLIDE 8 — COST ANALYSIS  (not filtered — global pricing)
  ════════════════════════════════════════════════════════════════════════ */
  {
    const sl = p.addSlide(); bg(sl);
    hdr(sl, "Cost Analysis — Pricing & Margins", OR);

    if (isFiltered) {
      filterNotice(sl, 0.64, "Pricing calculations are global (company-wide cost chain). Breed/farm splits do not apply.");
    }

    const Y0 = isFiltered ? 1.04 : 0.64;
    const LEFT_W = 5.72, RIGHT_X = MARGIN + LEFT_W + 0.10, RIGHT_W = CONTENT_W - LEFT_W - 0.10;

    const sections = [
      { title: "COST PER HATCHING EGG", y0: Y0,        col: OR,
        vals: [[k.costPerHatchingEggWeek,"Week",""],[k.costPerHatchingEggMonth,"Month",""],[k.costPerHatchingEggYear,"Year",""]] },
      { title: "SELLING PRICE / HATCHING EGG", y0: Y0 + 1.14, col: CY,
        vals: [[k.sellingPxHatchingEggWeek,"Week",`Margin: ${k.hatchingEggMarginPct||66}%`],[k.sellingPxHatchingEggMonth,"Month",""],[k.sellingPxHatchingEggYear,"Year",""]] },
      { title: "COST PER CHICK DOC", y0: Y0 + 2.28, col: AM,
        vals: [[k.costPerChickWeek,"Week",""],[k.costPerChickMonth,"Month",""],[k.costPerChickYear,"Year",""]] },
    ];

    sections.forEach(({ title, y0, col, vals }) => {
      sectionLabel(sl, title, MARGIN, y0, col);
      const cw = (LEFT_W - 0.12) / 3;
      vals.forEach(([val, lbl, sub], i) => {
        card(sl, MARGIN + i * (cw + 0.06), y0 + 0.26, cw, 0.82, lbl,
          val > 0 ? `GHC ${fmtN(val, 2)}` : "—", col, sub || "");
      });
    });

    sectionLabel(sl, "CHICK SELLING PRICE", RIGHT_X, Y0, GR);
    [[k.chickSellingPxWeek,"Week"],[k.chickSellingPxMonth,"Month"],[k.chickSellingPxYear,"Year"]].forEach(([val, lbl], i) => {
      const ry = Y0 + 0.26 + i * 0.52;
      sl.addShape(p.shapes.RECTANGLE, { x: RIGHT_X, y: ry, w: RIGHT_W, h: 0.44, fill: { color: SF }, line: { color: GR + "44", pt: 1 } });
      sl.addText(lbl,   { x: RIGHT_X + 0.10, y: ry, w: 1.00, h: 0.44, fontSize: 9,  color: SO,  fontFace: "Calibri", valign: "middle", margin: 0 });
      sl.addText(val > 0 ? `GHC ${fmtN(val)}` : "—", { x: RIGHT_X + 1.10, y: ry, w: RIGHT_W - 1.20, h: 0.44, fontSize: 13, bold: true, color: GR, fontFace: "Trebuchet MS", align: "right", valign: "middle", margin: 0 });
    });

    const configRows = [
      ["Hatching Egg Margin %",  `${k.hatchingEggMarginPct || 66}%`,    AM],
      ["Chick Selling Margin %", `${k.chickSellingMarginPct || 40}%`,   GR],
      ["Salary Expense / Month", fmtCur(k.salaryExpenseMonth),           PU],
      ["Feed Cost/kg (Set)",     `GHC ${k.costPerFeedKg || 0}`,         OR],
      ["Feed Cost/kg (Target)",  k.feedCostKgTarget > 0 ? `GHC ${k.feedCostKgTarget}` : "Not set", CY],
      ["Max Chick Price (Wk)",   `GHC ${fmtN(k.maxChickPriceWeek)}`,    BL],
      ["Max Chick Price (Mo)",   `GHC ${fmtN(k.maxChickPriceMonth)}`,   BL],
    ];
    sectionLabel(sl, "MARGIN CONFIGURATION", RIGHT_X, Y0 + 1.60, OR);
    configRows.forEach(([lbl, val, col], i) => {
      const ry = Y0 + 1.86 + i * 0.28;
      sl.addShape(p.shapes.RECTANGLE, { x: RIGHT_X, y: ry, w: RIGHT_W, h: 0.24, fill: { color: i % 2 === 0 ? SF : SF3 }, line: { color: SF2, pt: 1 } });
      sl.addText(lbl, { x: RIGHT_X + 0.10, y: ry, w: RIGHT_W - 1.20, h: 0.24, fontSize: 7, color: SO, fontFace: "Calibri", valign: "middle", margin: 0 });
      sl.addText(val, { x: RIGHT_X + RIGHT_W - 1.10, y: ry, w: 1.00, h: 0.24, fontSize: 7, bold: true, color: col, fontFace: "Calibri", align: "right", valign: "middle", margin: 0 });
    });
    footer(sl);
  }

  /* ════════════════════════════════════════════════════════════════════════
     SLIDE 9 — CHICKEN4U  (global — no breed/farm split)
  ════════════════════════════════════════════════════════════════════════ */
  {
    const sl = p.addSlide(); bg(sl);
    hdr(sl, "Chicken4U — Field Sales Dashboard", AM);

    if (isFiltered) {
      filterNotice(sl, 0.64, "Chicken4U data is global (not split by breed/farm). Showing all-farms totals.");
    }

    const Y0 = isFiltered ? 1.04 : 0.64;
    const CH = 0.80;

    sectionLabel(sl, "MUO NETWORK & LEARNERS", MARGIN, Y0, AM);
    const muoCards = cardRow(6, Y0 + 0.26, CH);
    [
      ["Total MUOs",          fmtN(c4u?.muo?.total),    BL, `F:${c4u?.muo?.female} M:${c4u?.muo?.male}`],
      ["Female MUOs",         fmtN(c4u?.muo?.female),   PU, c4u?.muo?.total > 0 ? `${pct(c4u?.muo?.female, c4u?.muo?.total)}%` : "0%"],
      ["Male MUOs",           fmtN(c4u?.muo?.male),     CY, c4u?.muo?.total > 0 ? `${pct(c4u?.muo?.male, c4u?.muo?.total)}%` : "0%"],
      ["SHF/SSPs Reached",    fmtN(c4u?.muo?.sspTotal), GR, "Small-holder farmers"],
      ["Certified Learners",  fmtN(c4u?.learners),      AM, ""],
      ["C4U Revenue (Month)", fmtCur(f.c4uRevenueMonth),GR, `Year: ${fmtCur(f.c4uRevenueYear)}`],
    ].forEach(([lbl, val, col, sub], i) => {
      card(sl, muoCards[i].x, muoCards[i].y, muoCards[i].w, muoCards[i].h, lbl, val, col, sub);
    });

    sectionLabel(sl, "CHICK ORDERS SUMMARY", MARGIN, Y0 + 0.26 + CH + 0.10, AM);
    const ordCards = cardRow(6, Y0 + 0.26 + CH + 0.36, CH);
    [
      ["Total Ordered",    fmtN(c4uS.chicksOrdered),   BL, "All breeds combined"],
      ["Total Delivered",  fmtN(c4uS.chicksDelivered), GR, ""],
      ["Total Pending",    fmtN(c4uS.chicksPending),   RD, ""],
      ["Orders Delivered", fmtN(c4uS.ordersDelivered), GR, "Order count"],
      ["Orders Pending",   fmtN(c4uS.ordersPending),   OR, "Order count"],
      ["Feed kg Ordered",  fmtN(c4uS.feedKgOrdered),   AM, `Del: ${fmtN(c4uS.feedKgDelivered)} kg`],
    ].forEach(([lbl, val, col, sub], i) => {
      card(sl, ordCards[i].x, ordCards[i].y, ordCards[i].w, ordCards[i].h, lbl, val, col, sub);
    });

    const SEC2_Y = Y0 + 0.26 + CH * 2 + 0.56;
    const LEFT_W = 4.70, RIGHT_X = MARGIN + LEFT_W + 0.10, RIGHT_W = CONTENT_W - LEFT_W - 0.10;

    sectionLabel(sl, "BY CHICK TYPE — ORDERED vs DELIVERED vs PENDING", MARGIN, SEC2_Y, AM);
    const chickTypes = [
      { label: "Grangers", ord: c4uS.grangers, del: c4uS.grangersDelivered, pend: c4uS.grangersPending, col: AM },
      { label: "Layers",   ord: c4uS.layers,   del: c4uS.layersDelivered,   pend: c4uS.layersPending,   col: GR },
      { label: "Broilers", ord: c4uS.broilers, del: c4uS.broilersDelivered, pend: c4uS.broilersPending, col: BL },
    ];
    sl.addTable([
      tblHdr(["Type", "Ordered", "Delivered", "Pending", "Delivery %"], AM),
      ...chickTypes.map((ct, idx) => {
        const delPct = ct.ord > 0 ? pct(ct.del, ct.ord) : 0;
        return tblRow([ct.label, fmtN(ct.ord), fmtN(ct.del), fmtN(ct.pend), `${delPct}%`], idx, [ct.col, TX, GR, OR, delPct >= 80 ? GR : AM]);
      }),
    ], { x: MARGIN, y: SEC2_Y + 0.26, w: LEFT_W, colW: [0.94, 0.94, 0.94, 0.94, 0.94],
         fontSize: 7, border: { type: "solid", color: SF2 }, fill: { color: SF }, rowH: 0.26 });

    const topMuos = (c4uS.topMuos || []);
    sectionLabel(sl, `TOP MUOs (${topMuos.length})`, RIGHT_X, SEC2_Y, CY);
    if (topMuos.length) {
      sl.addTable([
        tblHdr(["#", "MUO Name", "Delivered", "Ordered"], CY),
        ...topMuos.map((m, idx) => tblRow([idx+1, m.name, fmtN(m.value), fmtN(m.ordered)], idx, [TF, TX, CY, SO])),
      ], { x: RIGHT_X, y: SEC2_Y + 0.26, w: RIGHT_W, colW: [0.38, 2.20, 1.12, 1.10],
           fontSize: 7, border: { type: "solid", color: SF2 }, fill: { color: SF }, rowH: 0.26,
           autoPage: true, autoPageRepeatHeader: true });
    }
    footer(sl);
  }

  /* ════════════════════════════════════════════════════════════════════════
     SLIDE 10 — FINANCIAL SNAPSHOT  (global)
  ════════════════════════════════════════════════════════════════════════ */
  {
    const sl = p.addSlide(); bg(sl);
    hdr(sl, "Financial Snapshot", GR);

    if (isFiltered) {
      filterNotice(sl, 0.64, "Finance totals are global (revenue & expenses are not split by breed/farm in source data).");
    }

    const Y0 = isFiltered ? 1.04 : 0.64;
    const CH = 0.80;

    sectionLabel(sl, "REVENUE", MARGIN, Y0, GR);
    const revCards = cardRow(6, Y0 + 0.26, CH);
    [
      ["Poultry Invoices (Wk)",    fmtCur(f.revenueWeek),          GR, "Paid invoices"],
      ["Poultry Invoices (Mo)",    fmtCur(f.revenueMonth),         GR, ""],
      ["Poultry Invoices (Yr)",    fmtCur(f.revenueYear),          GR, "Year to date"],
      ["C4U Paid Rev (Wk)",        fmtCur(f.c4uRevenueWeek),       AM, "Field visit — paid orders"],
      ["C4U Paid Rev (Mo)",        fmtCur(f.c4uRevenueMonth),      AM, `Yr: ${fmtCur(f.c4uRevenueYear)}`],
      ["Combined Revenue (Mo)",    fmtCur(f.combinedRevenueMonth), BL, `Yr: ${fmtCur(f.combinedRevenueYear)}`],
    ].forEach(([lbl, val, col, sub], i) => {
      card(sl, revCards[i].x, revCards[i].y, revCards[i].w, revCards[i].h, lbl, val, col, sub);
    });

    sectionLabel(sl, "CASH, RECEIVABLES & PAYABLES", MARGIN, Y0 + 0.26 + CH + 0.10, CY);
    const cashCards = cardRow(6, Y0 + 0.26 + CH + 0.36, CH);
    [
      ["Cash Received (Wk)",  fmtCur(f.cashReceivedWeek),  CY, ""],
      ["Cash Received (Mo)",  fmtCur(f.cashReceivedMonth), CY, `Year: ${fmtCur(f.cashReceivedYear)}`],
      ["Receivables (Mo)",    fmtCur(f.receivablesMonth),  AM, `Total: ${fmtCur(f.receivablesTotal)}`],
      ["Receivables (Total)", fmtCur(f.receivablesTotal),  AM, "All open invoices"],
      ["Payables Due (Wk)",   fmtCur(f.payablesWeek),      RD, ""],
      ["Payables Due (Mo)",   fmtCur(f.payablesMonth),     RD, ""],
    ].forEach(([lbl, val, col, sub], i) => {
      card(sl, cashCards[i].x, cashCards[i].y, cashCards[i].w, cashCards[i].h, lbl, val, col, sub);
    });

    sectionLabel(sl, "MARGINS & APPROVAL STATUS", MARGIN, Y0 + 0.26 + CH * 2 + 0.50, GR);
    const margCards = cardRow(6, Y0 + 0.26 + CH * 2 + 0.76, CH);
    [
      ["Gross Margin %",       `${f.grossMargin || 0}%`,    f.grossMargin > 20 ? GR : AM, "Revenue vs expense"],
      ["Pending Payments",     fmtN(f.pendingPayments),     AM, "Awaiting approval"],
      ["Approved Not Paid",    fmtN(f.approvedNotPaid),     RD, "Requires payment"],
      ["Total Expense (Wk)",   fmtCur(f.totalExpenseWeek),  RD, ""],
      ["Total Expense (Mo)",   fmtCur(f.totalExpenseMonth), RD, `Year: ${fmtCur(f.totalExpenseYear)}`],
      ["Combined Rev (Yr)",    fmtCur(f.combinedRevenueYear), GR, ""],
    ].forEach(([lbl, val, col, sub], i) => {
      card(sl, margCards[i].x, margCards[i].y, margCards[i].w, margCards[i].h, lbl, val, col, sub);
    });
    footer(sl);
  }

  /* ════════════════════════════════════════════════════════════════════════
     SLIDE 11 — BREED PERFORMANCE  (filter-aware)
  ════════════════════════════════════════════════════════════════════════ */
  {
    const sl = p.addSlide(); bg(sl);
    hdr(sl, "Breed Performance — Eggs, Mortality & Feed", BL);

    const breedRowsToShow = isBreedFiltered
      ? Object.entries(data?.breedEggData || {}).filter(([b]) => b === selectedBreed)
      : Object.entries(data?.breedEggData || {}).sort((a, b) => (b[1].eggsMonth || 0) - (a[1].eggsMonth || 0));

    sectionLabel(sl, `EGGS · HATCHING · FARM REJECTED · MORTALITY · FEED — BY BREED${isBreedFiltered ? ` — ${selectedBreed} ONLY` : ` (${breedRowsToShow.length})`}`, MARGIN, 0.64, BL);

    if (breedRowsToShow.length) {
      sl.addTable([
        tblHdr(["Breed", "Birds Placed", "Eggs (Wk)", "Eggs (Mo)", "Hatch Eggs (Mo)", "Rej (Mo)", "Mort (Wk)", "Mort (Mo)", "Feed kg (Mo)"], BL),
        ...breedRowsToShow.map(([breed, e], idx) => tblRow([
          breed, fmtN(data?.breedMap?.[breed] || 0), fmtN(e.eggsWeek), fmtN(e.eggsMonth),
          fmtN(e.hatchableMonth), fmtN(e.farmRejectedMonth || 0), fmtN(e.mortalityWeek), fmtN(e.mortalityMonth), fmtN(e.feedKgMonth),
        ], idx, [AM, TX, CY, CY, PU, OR, RD, RD, AM])),
      ], {
        x: MARGIN, y: 0.90, w: CONTENT_W,
        colW: [1.36, 0.90, 0.90, 0.90, 1.10, 0.90, 0.90, 0.90, 0.74],
        fontSize: 6.5, border: { type: "solid", color: SF2 }, fill: { color: SF }, rowH: 0.23,
        autoPage: true, autoPageRepeatHeader: true,
      });
    }
    footer(sl);
  }

  /* ════════════════════════════════════════════════════════════════════════
     SLIDE 12 — FARM PERFORMANCE  (filter-aware)
  ════════════════════════════════════════════════════════════════════════ */
  {
    const sl = p.addSlide(); bg(sl);
    hdr(sl, "Farm Performance — Eggs, Mortality & Feed", CY);

    const farmRowsToShow = isFarmFiltered
      ? Object.entries(data?.farmEggData || {}).filter(([f]) => f === selectedFarm)
      : Object.entries(data?.farmEggData || {}).sort((a, b) => (b[1].eggsMonth || 0) - (a[1].eggsMonth || 0));

    sectionLabel(sl, `PRODUCTION & MORTALITY BY FARM${isFarmFiltered ? ` — ${selectedFarm} ONLY` : ` (${farmRowsToShow.length})`}`, MARGIN, 0.64, CY);
    if (farmRowsToShow.length) {
      sl.addTable([
        tblHdr(["Farm", "Birds", "Eggs (Wk)", "Eggs (Mo)", "Eggs (Yr)", "Hatch (Wk)", "Rej (Mo)", "Mort (Wk)", "Mort (Mo)", "Feed kg (Mo)", "Feed Cost"], CY),
        ...farmRowsToShow.map(([farm, e], idx) => tblRow([
          farm?.slice(0, 22) || "—",
          fmtN(data?.farmBirdsPlacedMap?.[farm] || 0),
          fmtN(e.eggsWeek), fmtN(e.eggsMonth), fmtN(e.eggsYear),
          fmtN(e.hatchableWeek), fmtN(e.farmRejectedMonth || 0),
          fmtN(e.mortalityWeek), fmtN(e.mortalityMonth),
          fmtN(e.feedKgMonth), fmtCur(fd.byFarm?.[farm] || 0),
        ], idx, [AM, TX, CY, CY, CY, PU, OR, RD, RD, AM, OR])),
      ], {
        x: MARGIN, y: 0.90, w: CONTENT_W,
        colW: [1.50, 0.76, 0.72, 0.72, 0.72, 0.72, 0.66, 0.72, 0.72, 0.76, 0.78],
        fontSize: 6.5, border: { type: "solid", color: SF2 }, fill: { color: SF }, rowH: 0.22,
        autoPage: true, autoPageRepeatHeader: true,
      });
    }
    footer(sl);
  }

  /* ════════════════════════════════════════════════════════════════════════
     SLIDE 13 — INVENTORY  (filter-aware for storage/DOC)
  ════════════════════════════════════════════════════════════════════════ */
  {
    const sl = p.addSlide(); bg(sl);
    hdr(sl, "Inventory & Supply Chain", PU);
    const CH = 0.80;

    sectionLabel(sl, "STOCK OVERVIEW", MARGIN, 0.64, PU);
    const stockCards = cardRow(6, 0.90, CH);
    [
      ["Feed Stock (MT)",   `${fmtN(inv.finishedFeedTons, 1)} MT`, inv.finishedFeedTons > 50 ? GR : AM, "Finished feed — global"],
      ["Raw Material Days", fmtN(inv.rawMaterialDays),             AM, "Days coverage"],
      ["Vaccine Status",    inv.vaccineStatus || "—",              inv.vaccineStatus === "Critical" ? RD : inv.vaccineStatus === "Low" ? AM : GR, ""],
      ["Storage Eggs",      fmtN(isBreedFiltered ? (data?.breedStorageEggs?.[selectedBreed] || 0) : k.storageEggsAvailable),
        PU, isBreedFiltered ? `Breed: ${selectedBreed}` : "All breeds"],
      ["DOC Available",     fmtN(isBreedFiltered ? (data?.breedDOC?.[selectedBreed] || 0) : k.totalDOC),
        GR, isBreedFiltered ? `Breed: ${selectedBreed}` : "Day Old Chicks"],
      ["Pending POs",       fmtN(inv.pendingPOs), BL, ""],
    ].forEach(([lbl, val, col, sub], i) => {
      card(sl, stockCards[i].x, stockCards[i].y, stockCards[i].w, stockCards[i].h, lbl, val, col, sub);
    });

    const SEC2_Y  = 0.90 + CH + 0.14;
    const LEFT_W  = 4.70, RIGHT_X = MARGIN + LEFT_W + 0.10, RIGHT_W = CONTENT_W - LEFT_W - 0.10;

    const storBreeds = isBreedFiltered
      ? [[selectedBreed, data?.breedStorageEggs?.[selectedBreed] || 0]]
      : Object.entries(data?.breedStorageEggs || {}).sort((a, b) => b[1] - a[1]);

    sectionLabel(sl, `STORAGE EGGS BY BREED${isBreedFiltered ? ` — ${selectedBreed}` : ` (${storBreeds.length})`}`, MARGIN, SEC2_Y, PU);
    if (storBreeds.length) {
      sl.addTable([
        tblHdr(["Breed", "Available Eggs"], PU),
        ...storBreeds.map(([b, q], idx) => tblRow([b, fmtN(q)], idx, [TX, PU])),
      ], { x: MARGIN, y: SEC2_Y + 0.26, w: LEFT_W, colW: [3.20, 1.50],
           fontSize: 7, border: { type: "solid", color: SF2 }, fill: { color: SF }, rowH: 0.24,
           autoPage: true, autoPageRepeatHeader: true });
    }

    const docBreeds = isBreedFiltered
      ? [[selectedBreed, data?.breedDOC?.[selectedBreed] || 0]]
      : Object.entries(data?.breedDOC || {}).sort((a, b) => b[1] - a[1]);

    sectionLabel(sl, `DAY OLD CHICKS BY BREED${isBreedFiltered ? ` — ${selectedBreed}` : ` (${docBreeds.length})`}`, RIGHT_X, SEC2_Y, GR);
    if (docBreeds.length) {
      sl.addTable([
        tblHdr(["Breed", "Available Chicks"], GR),
        ...docBreeds.map(([b, q], idx) => tblRow([b, fmtN(q)], idx, [TX, GR])),
      ], { x: RIGHT_X, y: SEC2_Y + 0.26, w: RIGHT_W, colW: [3.36, 1.44],
           fontSize: 7, border: { type: "solid", color: SF2 }, fill: { color: SF }, rowH: 0.24,
           autoPage: true, autoPageRepeatHeader: true });
    }
    footer(sl);
  }

  /* ════════════════════════════════════════════════════════════════════════
     SLIDE 14 — WORKFORCE  (global)
  ════════════════════════════════════════════════════════════════════════ */
  {
    const sl = p.addSlide(); bg(sl);
    hdr(sl, "Workforce & HR", CY);

    if (isFiltered) {
      filterNotice(sl, 0.64, "Workforce data is global (not split by breed/farm). Showing all-staff totals.");
    }

    const Y0 = isFiltered ? 1.04 : 0.64;
    const CH = 0.80;

    sectionLabel(sl, "HEADCOUNT & ATTENDANCE", MARGIN, Y0, CY);
    const hcCards = cardRow(6, Y0 + 0.26, CH);
    [
      ["Total Staff",       fmtN(wf.totalStaff),          BL, ""],
      ["Active Staff",      fmtN(wf.activeStaff),         GR, ""],
      ["On Duty Today",     fmtN(wf.staffTurnoutToday),   GR, ""],
      ["On Leave Today",    fmtN(wf.staffOnLeave),        AM, `Absenteeism: ${wf.absenteeismPct || 0}%`],
      ["Leave This Week",   fmtN(wf.leaveThisWeek),       BL, ""],
      ["Leave This Month",  fmtN(wf.leaveThisMonth),      BL, ""],
    ].forEach(([lbl, val, col, sub], i) => {
      card(sl, hcCards[i].x, hcCards[i].y, hcCards[i].w, hcCards[i].h, lbl, val, col, sub);
    });

    sectionLabel(sl, "DEPARTMENT HEADCOUNT", MARGIN, Y0 + 0.26 + CH + 0.10, CY);
    if ((wf.deptProductivity || []).length) {
      sl.addTable([
        tblHdr(["Department", "Headcount"], CY),
        ...(wf.deptProductivity || []).map((d, idx) => tblRow([d.dept, fmtN(d.score)], idx, [TX, CY])),
      ], { x: MARGIN, y: Y0 + 0.26 + CH + 0.36, w: 4.70, colW: [3.20, 1.50],
           fontSize: 7, border: { type: "solid", color: SF2 }, fill: { color: SF }, rowH: 0.24,
           autoPage: true, autoPageRepeatHeader: true });
    }

    sectionLabel(sl, "LEAVE BY DEPARTMENT", MARGIN + 4.80, Y0 + 0.26 + CH + 0.10, AM);
    if ((wf.leaveByDept || []).length) {
      sl.addTable([
        tblHdr(["Department", "Staff on Leave"], AM),
        ...(wf.leaveByDept || []).map((d, idx) => tblRow([d.dept, fmtN(d.count)], idx, [TX, AM])),
      ], { x: MARGIN + 4.80, y: Y0 + 0.26 + CH + 0.36, w: CONTENT_W - 4.80, colW: [3.36, 1.44],
           fontSize: 7, border: { type: "solid", color: SF2 }, fill: { color: SF }, rowH: 0.24,
           autoPage: true, autoPageRepeatHeader: true });
    }
    footer(sl);
  }

  /* ════════════════════════════════════════════════════════════════════════
     SLIDE 15 — MONTHLY YoY TREND  (global)
  ════════════════════════════════════════════════════════════════════════ */
  {
    const sl = p.addSlide(); bg(sl);
    hdr(sl, `Monthly Year-on-Year Trend — ${prevYear} vs ${curYear}`, BL);

    if (isFiltered) {
      filterNotice(sl, 0.64, "Monthly trend uses global aggregates. Breed/farm-specific monthly breakdowns are not available.");
    }

    const Y0 = isFiltered ? 0.92 : 0.66;
    const MNAMES_S = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const mkKey   = (y, m) => `${y}-${String(m + 1).padStart(2, "0")}`;
    const ops     = data?.monthlyOpsData   || {};
    const htch    = data?.monthlyHatchData || {};
    const fin     = data?.monthlyFinData   || {};
    const cPerKg  = k.costPerFeedKg || 0;
    const tColW   = [0.50, 0.64, 0.64, 0.64, 0.64, 0.58, 0.58, 0.58, 0.66, 0.66, 0.72, 0.70, 0.70, 0.68, 0.68];

    const tblData = [
      [[
        "Month",
        `${curYear} Eggs`, `${prevYear} Eggs`,
        `${curYear} Chicks`, `${prevYear} Chicks`,
        `${curYear} Mort`, `${prevYear} Mort`,
        `${curYear} Hatch%`,
        `${curYear} Feed MT`, `${prevYear} Feed MT`,
        `${curYear} Feed Cost`, `${prevYear} Feed Cost`,
        `${curYear} Revenue`, `${prevYear} Rev`,
        `${curYear} Cash In`,
      ].map(text => ({ text, options: { bold: true, color: "FFFFFF", fontFace: "Calibri", fontSize: 7, fill: { color: BL }, align: "left" } }))],
      ...MNAMES_S.map((mon, i) => {
        const ck = mkKey(curYear, i), pk = mkKey(curYear - 1, i);
        const co = ops[ck] || {}, po = ops[pk] || {};
        const ch = htch[ck] || {}, ph = htch[pk] || {};
        const cf = fin[ck] || {}, pf = fin[pk] || {};
        const cHatch = ch.eggsSet > 0 ? ((ch.goodChicks / ch.eggsSet) * 100).toFixed(1) + "%" : "—";
        const fill = i % 2 === 0 ? { color: SF } : { color: SF3 };
        const r = (txt, col) => ({ text: txt, options: { color: col, fontFace: "Calibri", fontSize: 7, fill, align: "left" } });
        return [
          r(mon, TX),
          r(fmtK(co.eggs || 0), CY),  r(fmtK(po.eggs || 0), OR),
          r(fmtK(ch.goodChicks || 0), GR), r(fmtK(ph.goodChicks || 0), OR),
          r(fmtK(co.mort || 0), RD),  r(fmtK(po.mort || 0), OR),
          r(cHatch, GR),
          r(co.feedKg > 0 ? ((co.feedKg) / 1000).toFixed(1) + " MT" : "—", AM),
          r(po.feedKg > 0 ? ((po.feedKg) / 1000).toFixed(1) + " MT" : "—", OR),
          r((co.feedKg || 0) * cPerKg > 0 ? fmtCur((co.feedKg) * cPerKg) : "—", AM),
          r((po.feedKg || 0) * cPerKg > 0 ? fmtCur((po.feedKg) * cPerKg) : "—", OR),
          r(cf.revenue > 0 ? fmtCur(cf.revenue) : "—", GR),
          r(pf.revenue > 0 ? fmtCur(pf.revenue) : "—", OR),
          r(cf.cashIn  > 0 ? fmtCur(cf.cashIn)  : "—", CY),
        ];
      }),
    ];

    sl.addTable(tblData, {
      x: MARGIN, y: Y0, w: CONTENT_W, colW: tColW,
      fontSize: 7, border: { type: "solid", color: SF2 }, fill: { color: SF }, rowH: 0.25,
      autoPage: true, autoPageRepeatHeader: true,
    });
    footer(sl);
  }

  /* ════════════════════════════════════════════════════════════════════════
     SLIDE 16 — RISK & ALERTS
  ════════════════════════════════════════════════════════════════════════ */
  {
    const alerts = data?.alerts || [];
    const tc = t => t === "critical" ? RD : t === "warning" ? AM : BL;
    const ROW_H = 0.52;
    const ROWS_PER_SLIDE = Math.floor((FOOT_Y - 0.66) / ROW_H);
    const pages = [];
    for (let i = 0; i < alerts.length; i += ROWS_PER_SLIDE) pages.push(alerts.slice(i, i + ROWS_PER_SLIDE));
    if (pages.length === 0) pages.push([]);

    pages.forEach((pageAlerts, pageIdx) => {
      const sl = p.addSlide(); bg(sl);
      hdr(sl, pageIdx === 0 ? "Risk & Alerts — Operations Status" : `Risk & Alerts (cont. ${pageIdx + 1})`, RD);

      pageAlerts.forEach((a, i) => {
        const col = tc(a.type);
        const bgT = a.type === "critical" ? "FEF2F2" : a.type === "warning" ? "FFFBEB" : "EFF6FF";
        const y   = 0.66 + i * ROW_H;
        sl.addShape(p.shapes.RECTANGLE, { x: MARGIN, y, w: CONTENT_W, h: 0.44, fill: { color: bgT }, line: { color: col + "77", pt: 1 } });
        sl.addShape(p.shapes.RECTANGLE, { x: MARGIN, y, w: 0.06, h: 0.44, fill: { color: col }, line: { color: col } });
        sl.addText(a.type.toUpperCase(), { x: MARGIN + 0.12, y: y + 0.04, w: 1.10, h: 0.16, fontSize: 6, bold: true, color: col, fontFace: "Calibri", charSpacing: 1, margin: 0 });
        sl.addText(a.title || "",        { x: MARGIN + 0.12, y: y + 0.20, w: 5.60, h: 0.20, fontSize: 9.5, bold: true, color: TX, fontFace: "Calibri", margin: 0 });
        sl.addText(a.detail || "",       { x: MARGIN + 5.82, y: y + 0.06, w: 3.60, h: 0.32, fontSize: 7.5, color: SO, fontFace: "Calibri", valign: "middle", align: "right", margin: 0 });
      });

      if (alerts.length === 0) {
        sl.addText("✓  All Systems Normal — No critical issues detected", {
          x: 0.5, y: 1.8, w: 9, h: 0.6, fontSize: 18, bold: true, color: GR, fontFace: "Trebuchet MS", align: "center", valign: "middle",
        });
      }
      footer(sl);
    });
  }

  /* ════════════════════════════════════════════════════════════════════════
     SLIDE 17 — CLOSING
  ════════════════════════════════════════════════════════════════════════ */
  {
    const sl = p.addSlide();
    sl.background = { color: BG };
    sl.addShape(p.shapes.RECTANGLE, { x: 0, y: 0, w: 0.14, h: 5.625, fill: { color: BL }, line: { color: BL } });
    sl.addShape(p.shapes.RECTANGLE, { x: 0, y: 0, w: SLIDE_W, h: 0.05, fill: { color: BL }, line: { color: BL } });
    sl.addImage({ data: LOGO_IMG, x: 0.50, y: 0.65, w: 3.6, h: 3.5 });
    const rx = 4.6;
    sl.addText("WAFAD GROUP", { x: rx, y: 0.72, w: 5.2, h: 0.55, fontSize: 28, bold: true, color: TX, fontFace: "Trebuchet MS" });
    sl.addText("Plot 1A, Melcom Road,\nNear Pacific Filling Station\nAdum-Afrancho\nKumasi – Ghana", { x: rx, y: 1.36, w: 5.2, h: 1.22, fontSize: 12, color: SO, fontFace: "Calibri", lineSpacingMultiple: 1.35 });
    sl.addText("Call / WhatsApp", { x: rx, y: 2.72, w: 5.2, h: 0.28, fontSize: 11, bold: true, color: TX, fontFace: "Calibri" });
    sl.addText("+233 551 555 528\n+233 551 555 529\n+233 540 112 711", { x: rx, y: 3.04, w: 5.2, h: 0.82, fontSize: 12, color: SO, fontFace: "Calibri", lineSpacingMultiple: 1.3 });
    sl.addText("wafadgroup", { x: rx, y: 3.96, w: 5.2, h: 0.28, fontSize: 11, bold: true, color: BL, fontFace: "Calibri" });
    sl.addShape(p.shapes.RECTANGLE, { x: 0, y: 4.82, w: SLIDE_W, h: 0.805, fill: { color: YL }, line: { color: YL } });
    sl.addText("Grow food.  Earn Income.  Changing lives.", { x: 0.5, y: 4.82, w: 9, h: 0.805, fontSize: 18, bold: true, color: TX, fontFace: "Trebuchet MS", align: "center", valign: "middle" });
  }

  /* ── Save ──────────────────────────────────────────────────────────────── */
  const filterSuffix = isFiltered
    ? `_${[
        isBreedFiltered ? selectedBreed.replace(/\s+/g, "_") : null,
        isFarmFiltered  ? selectedFarm.replace(/\s+/g, "_")  : null,
      ].filter(Boolean).join("_")}`
    : "";

  await p.writeFile({
    fileName: `WAFAD_Executive_${curYear}${filterSuffix}_${new Date().toISOString().slice(0, 10)}.pptx`,
  });
}
