const ZOHO_APP = "poultry-management";

/* ─── Helpers ────────────────────────────────────── */
const num = (v) => {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
};
const fv = (rec, f) => {
  if (!rec || !f) return null;
  const v = rec[f];
  if (!v) return null;
  return typeof v === "object"
    ? v.zc_display_value || v.display_value || v.Name || null
    : v;
};
const displayVal = (v) => {
  if (v === null || v === undefined) return "";
  if (typeof v === "object")
    return (v.zc_display_value ?? v.display_value ?? v.name ?? "").toString();
  return v.toString();
};
const fmtN = (n, d = 0) =>
  n == null
    ? "—"
    : Number(n).toLocaleString("en-US", {
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    });
const fmtCur = (n) => {
  if (!n) return "GHC 0";
  if (n >= 1e9) return `GHC ${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `GHC ${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `GHC ${(n / 1e3).toFixed(0)}K`;
  return `GHC ${n}`;
};
// ─── REPLACE WITH ────────────────────────────────────
const fmtK = (n) =>
  n >= 1e6
    ? `${(n / 1e6).toFixed(1)}M`
    : n >= 1e3
      ? `${(n / 1e3).toFixed(0)}K`
      : `${n}`;

/* Robust Zoho date parser — handles "17-Mar-2026", "2026-04-12", "12-Apr-2026 10:30:00" */
const ZOHO_MONTHS = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};
function parseZohoDate(raw) {
  if (!raw) return null;
  const s = String(raw).trim();
  // "17-Mar-2026" or "17-Mar-2026 10:30:00"
  const m1 = s.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})/);
  if (m1) {
    const mo = ZOHO_MONTHS[m1[2].toLowerCase()];
    if (mo !== undefined) {
      const d = new Date(parseInt(m1[3]), mo, parseInt(m1[1]));
      return isNaN(d.getTime()) ? null : d;
    }
  }
  // "2026-04-12" or "2026-04-12T10:30:00"
  const m2 = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m2) {
    const d = new Date(parseInt(m2[1]), parseInt(m2[2]) - 1, parseInt(m2[3]));
    return isNaN(d.getTime()) ? null : d;
  }
  // "Apr 12, 2026" or "April 12 2026"
  const m3 = s.match(/^([A-Za-z]+)\s+(\d{1,2})[,\s]+(\d{4})/);
  if (m3) {
    const mo = ZOHO_MONTHS[m3[1].slice(0, 3).toLowerCase()];
    if (mo !== undefined) {
      const d = new Date(parseInt(m3[3]), mo, parseInt(m3[2]));
      return isNaN(d.getTime()) ? null : d;
    }
  }
  // fallback
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}
const addBreed = (map, breed, qty) => {
  if (!breed) return;
  map[breed] = (map[breed] ?? 0) + qty;
};
const isFeedProduct = (name, type) => {
  const u = (name + " " + type).toUpperCase();
  return (
    u.includes("FEED") ||
    u.includes("MASH") ||
    u.includes("PELLET") ||
    u.includes("STARTER") ||
    u.includes("FINISHER") ||
    u.includes("GROWER")
  );
};
const classifyC4uProduct = (productName, productType) => {
  const u = (productName + " " + productType).toUpperCase();
  if (
    u.includes("GRANGER") ||
    u.includes("COCK") ||
    u.includes("LAYER") ||
    u.includes("NOVO") ||
    u.includes("BROILER")
  )
    return "chick";
  if (isFeedProduct(productName, productType)) return "feed";
  if (
    u.includes("MEDIC") ||
    u.includes("VACCINE") ||
    u.includes("DRUG") ||
    u.includes("VITAMIN") ||
    u.includes("ANTIBIOTIC") ||
    u.includes("DEWORM")
  )
    return "medication";
  if (u.includes("DISINFECT") || u.includes("CLEAN") || u.includes("SANITIZ"))
    return "sanitation";
  if (
    u.includes("EQUIP") ||
    u.includes("FEEDER") ||
    u.includes("DRINKER") ||
    u.includes("WATERER") ||
    u.includes("CAGE") ||
    u.includes("LAMP") ||
    u.includes("BULB")
  )
    return "equipment";
  return "other";
};


function HatchabilityDetailModal({ data, onClose }) {
  const h = data?.hatchery || {};
  const ex = h.trueHatchExampleBatch;

  const sections = [
    {
      title: "TRUE HATCHABILITY (THIS WEEK)",
      tag: "ACTUAL",
      tagColor: C.green,
      icon: CheckCircle2,
      color: C.green,
      value: `${h.hatchabilityWeek || "-"}%`,
      body: (
        <>
          <p style={{ fontSize: 11, color: C.textMd, marginBottom: 10 }}>
            Definition: completed batches hatched this week only — each batch's own eggs set
            vs. its own good chicks, matched by <strong>Hatched Date</strong> (not Setting Date).
          </p>
          {ex ? (
            <div style={{
              background: C.greenLt, border: `1px solid ${C.green}33`,
              borderRadius: 10, padding: "10px 14px", fontSize: 12,
            }}>
              <p style={{ fontWeight: 700, color: C.green, marginBottom: 4 }}>{ex.batch}</p>
              <p style={{ color: C.textMd }}>
                {fmtN(ex.set)} set → {fmtN(ex.hatched)} good chicks
              </p>
              <p style={{ fontWeight: 700, color: C.green, fontSize: 16, marginTop: 4 }}>
                {ex.pct}%
              </p>
            </div>
          ) : (
            <p style={{ fontSize: 11, color: C.textSf }}>
              No batches completed hatching this week.
            </p>
          )}
          <p style={{ fontSize: 10.5, color: C.green, marginTop: 10, fontWeight: 600 }}>
            ✓ This is the KPI management should use.
          </p>
        </>
      ),
    },
    {
      title: "TRUE HATCHABILITY (MONTH)",
      tag: "ACTUAL",
      tagColor: C.green,
      icon: CheckCircle2,
      color: C.green,
      value: `${h.hatchabilityMonth || "-"}%`,
      body: (
        <p style={{ fontSize: 11, color: C.textMd }}>
          Definition: completed batches hatched during the month — same batch-matched logic as
          the weekly figure, aggregated across all batches whose Hatched Date falls in this month.
        </p>
      ),
    },
    {
      title: "HATCH OUTPUT (THIS WEEK)",
      tag: "ACTUAL",
      tagColor: C.blue,
      icon: Egg,
      color: C.blue,
      value: fmtN(h.hatchOutputWeek),
      sub: "chicks",
      body: (
        <p style={{ fontSize: 11, color: C.textMd }}>
          Raw chick output for the week. <strong>Not a percentage</strong> — just volume produced,
          regardless of which batch or week the eggs were set in.
        </p>
      ),
    },
    {
      title: "HATCH OUTPUT (THIS MONTH)",
      tag: "ACTUAL",
      tagColor: C.blue,
      icon: Egg,
      color: C.blue,
      value: fmtN(h.hatchOutputMonth),
      sub: "chicks",
      body: (
        <p style={{ fontSize: 11, color: C.textMd }}>
          Raw chick output for the month. <strong>Not a percentage</strong> — just volume produced,
          regardless of which batch or week the eggs were set in.
        </p>
      ),
    },
    {
      title: "ACTIVE HATCH PIPELINE",
      tag: "PIPELINE",
      tagColor: C.amber,
      icon: Layers,
      color: C.amber,
      value: fmtN(h.activeHatchPipelineEggs),
      sub: "eggs",
      body: (
        <p style={{ fontSize: 11, color: C.textMd }}>
          Eggs currently incubating across {fmtN(h.activeHatchPipelineBatches)} active batch
          {h.activeHatchPipelineBatches !== 1 ? "es" : ""}. Future production —
          <strong> not yet included in hatchability</strong> since these haven't completed yet.
        </p>
      ),
    },
    {
      title: "FORECAST HATCHES (NEXT 21 DAYS)",
      tag: "CAPACITY",
      tagColor: C.purple,
      icon: TrendingUp,
      color: C.purple,
      value: fmtN(h.forecastChicksNext21),
      sub: "chicks",
      body: (
        <p style={{ fontSize: 11, color: C.textMd }}>
          Planning figure: {fmtN(h.forecastEggsNext21)} eggs scheduled to hatch in the next 21
          days, projected at a {h.referenceHatchRatePct}% reference hatch rate
          (from completed-batch history). Not a guarantee — for capacity planning only.
        </p>
      ),
    },
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.surf, border: `1px solid ${C.border}`,
          borderRadius: 16, maxWidth: 640, width: "100%",
          maxHeight: "88vh", overflowY: "auto",
          boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px", borderBottom: `1px solid ${C.border}`,
          position: "sticky", top: 0, background: C.surf, zIndex: 1,
        }}>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: C.text }}>
              Hatchability — KPI Breakdown
            </h2>
            <p style={{ fontSize: 11, color: C.textMd, marginTop: 2 }}>
              Actual Results · Pipeline Metrics · Capacity Metrics
            </p>
          </div>
          <button onClick={onClose} style={{
            background: C.surf2, border: `1px solid ${C.border}`,
            borderRadius: 8, padding: 6, cursor: "pointer", color: C.textMd,
            display: "flex",
          }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
          {sections.map((s) => (
            <div key={s.title} style={{
              background: C.surf2, border: `1px solid ${s.color}33`,
              borderRadius: 12, padding: "14px 16px",
              borderLeft: `3px solid ${s.color}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <s.icon size={14} color={s.color} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.text }}>{s.title}</span>
                </div>
                <span style={{
                  fontSize: 8.5, fontWeight: 700, padding: "2px 8px", borderRadius: 8,
                  background: s.tagColor + "18", color: s.tagColor,
                  textTransform: "uppercase", letterSpacing: ".05em",
                }}>
                  {s.tag}
                </span>
              </div>
              <p style={{
                fontSize: 24, fontWeight: 800, color: s.color,
                fontFamily: C.mono, marginBottom: 8, display: "flex", alignItems: "baseline", gap: 6,
              }}>
                {s.value}
                {s.sub && <span style={{ fontSize: 12, fontWeight: 500, color: s.color + "99" }}>{s.sub}</span>}
              </p>
              {s.body}
            </div>
          ))}
        </div>

        {/* <div style={{ */}
        {/*   padding: "12px 20px 18px", borderTop: `1px solid ${C.border}`, */}
        {/*   fontSize: 10, color: C.textSf, lineHeight: 1.5, */}
        {/* }}> */}
        {/*   KPI governance note: Hatchability is calculated only from completed batches */}
        {/*   (renamed "True Hatchability") to avoid mixing incubation-pipeline data with */}
        {/*   completed hatch results. Active batches are excluded from hatchability and shown */}
        {/*   under Hatch Pipeline instead. Risk alerts are driven by completed-batch performance only. */}
        {/* </div> */}
      </div>
    </div>
  );
}

/* ─── Zoho sequential fetcher with pagination ──────── */
async function zohoGetAll(report, max = 1000) {
  console.log(`[WAFAD] Fetching report: ${report}`);
  const all = [];
  let cursor = null;
  let page = 1;
  try {
    while (true) {
      const config = {
        app_name: ZOHO_APP,
        report_name: report,
        field_config: "all",
        max_records: max,
      };
      if (cursor) config.record_cursor = cursor;
      const r = await window.ZOHO?.CREATOR?.DATA?.getRecords(config);
      if (!r || (r.code !== 3000 && r.code !== undefined)) {
        console.warn(`[WAFAD] ${report} page ${page} → code:${r?.code}`);
        break;
      }
      const records = r?.data ?? [];
      all.push(...records);
      console.log(
        `[WAFAD] ${report} page ${page}: +${records.length} (total: ${all.length})`,
      );
      cursor = r?.record_cursor ?? null;
      if (!cursor || records.length < max) break;
      page++;
    }
  } catch (e) {
    console.error(`[WAFAD] zohoGetAll(${report}) ERROR:`, e);
  }
  console.log(`[WAFAD] ${report} TOTAL: ${all.length}`);
  return all;
}

/* ─── Date helpers ───────────────────────────────── */

function getDateBounds(selectedYear = null) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const isPastYear = selectedYear && selectedYear !== currentYear;

  const year = selectedYear || currentYear;
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year, 11, 31, 23, 59, 59, 999);

  // For past years: week/month = full year (no partial period filtering)
  // For current year: use actual current week and month
  let weekStart, weekEnd, monthStart, monthEnd, referenceDate;

  if (isPastYear) {
    weekStart = yearStart;
    weekEnd = yearEnd;
    monthStart = yearStart;
    monthEnd = yearEnd;
    referenceDate = new Date(year, 11, 31, 23, 59, 59, 999);
  } else {
    referenceDate = now;
    // Friday-based week
    const dow = now.getDay();
    const daysFromFriday = dow === 5 ? 0 : dow === 6 ? 1 : dow + 2;
    weekStart = new Date(now);
    weekStart.setDate(now.getDate() - daysFromFriday);
    weekStart.setHours(0, 0, 0, 0);
    weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    monthStart = new Date(year, now.getMonth(), 1);
    monthEnd = new Date(year, now.getMonth() + 1, 0);
    monthEnd.setHours(23, 59, 59, 999);
  }

  console.log(
    "[WAFAD] Date bounds → weekStart:", weekStart.toDateString(),
    "| monthStart:", monthStart.toDateString(),
    "| yearStart:", yearStart.toDateString(),
    "| year:", year,
    "| isPastYear:", isPastYear
  );
  return { now: referenceDate, weekStart, monthStart, weekEnd, monthEnd, yearStart, yearEnd, year };
}
// ─── REPLACE WITH ────────────────────────────────────
/* ══════════════════════════════════════════════════════
   BREED-KEYED ACCUMULATOR helpers
══════════════════════════════════════════════════════ */
// ─── REPLACE WITH ────────────────────────────────────

function emptyBreedEgg() {
  return {
    eggsWeek: 0,
    eggsMonth: 0,
    eggsYear: 0,
    hatchableWeek: 0,
    hatchableMonth: 0,
    farmRejectedTotal: 0,
    farmRejectedWeek: 0,
    farmRejectedMonth: 0,
    farmRejectedYear: 0,
    crackedTotal: 0,
    dirtyTotal: 0,
    floorTotal: 0,
    mortalityWeek: 0,
    mortalityMonth: 0,
    mortalityYear: 0,
    mortalityFemale: 0,
    mortalityMale: 0,
    feedKgWeek: 0,
    feedKgMonth: 0,
    feedKgYear: 0,
  };
}
function emptyBreedHatch() {
  return {
    eggsSetWeek: 0,
    eggsSetMonth: 0,
    eggsSetYear: 0,
    goodChicksWeek: 0,
    goodChicksMonth: 0,
    goodChicksYear: 0,
    fertileEggs: 0,
    settableEggs: 0,
    poorChicks: 0,
  };
}

function mkMonthKey(d) {
  if (!d) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function ensureMonth(map, key, template) {
  if (key && !map[key]) map[key] = { ...template };
}
const OPS_TPL = { eggs: 0, hatchable: 0, mort: 0, feedKg: 0 };
const HATCH_TPL = { eggsSet: 0, goodChicks: 0, fertile: 0, grangers: 0, layers: 0, broilers: 0 };
const FIN_TPL = { revenue: 0, expense: 0, cashIn: 0 };

/* ═════════════════════════════════════════════════════
   loadAllData  — v3  (breed-specific edition)
═════════════════════════════════════════════════════ */
async function loadAllData(selectedYear = null) {
  console.log("=== [WAFAD] Starting full data load v4 ===");
  const { now, weekStart, monthStart, weekEnd, monthEnd, yearStart, yearEnd, year } =
    getDateBounds(selectedYear);
  // async function loadAllData() {
  //   console.log("=== [WAFAD] Starting full data load v4 ===");
  //   const { now, weekStart, monthStart, weekEnd, monthEnd } = getDateBounds();

  const lastWeekStart = new Date(weekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);
  const lastWeekEnd = new Date(weekStart);
  lastWeekEnd.setDate(lastWeekEnd.getDate() - 1);
  const lastMonthStart = new Date(monthStart);
  lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
  const lastMonthEnd = new Date(monthStart);
  lastMonthEnd.setDate(lastMonthEnd.getDate() - 1);
  // const yearStart = new Date(now.getFullYear(), 0, 1);

  const monthlyOpsData = {};   // YYYY-MM → ops metrics
  const monthlyHatchData = {};  // YYYY-MM → hatch metrics
  const monthlyFinData = {};   // YYYY-MM → revenue/expense

  // costPerFeedKg is declared early; assigned after products section
  let costPerFeedKg = 0;

  const round100 = (n) => Math.round(n / 100) * 100;

  /* ─── 1. FLOCK ──────────────────────────────────────────────────── */
  const flocks = await zohoGetAll("All_Flock_Management");
  console.group("✅ [1] FLOCK REPORT");
  console.log("Total records:", flocks.length);
  console.log("Sample keys:", flocks[0] ? Object.keys(flocks[0]) : "EMPTY");
  console.groupEnd();

  let totalPulletsHoused = 0, totalCockerelsHoused = 0, totalBirdsPlaced = 0;
  let femaleAliveCurrent = 0, maleAliveCurrent = 0;
  const breedMap = {};
  const breedSet = new Set();
  const flockIdBreedMap = {};
  const farmBirdsPlacedMap = {};

  flocks.forEach((f) => {
    const pullets = num(fv(f, "Pullets_Housed"));
    const cockerels = num(fv(f, "Cockerels_Housed"));
    const femaleCur = num(fv(f, "Birds_Female_Current"));
    const maleCur = num(fv(f, "Birds_Male_Current"));
    const total = num(fv(f, "Total_Birds_Housed")) || pullets + cockerels;
    const breed = displayVal(f.Breed_Name || "") || "Unknown";

    totalPulletsHoused += pullets;
    totalCockerelsHoused += cockerels;
    totalBirdsPlaced += total;
    femaleAliveCurrent += femaleCur > 0 ? femaleCur : pullets;
    maleAliveCurrent += maleCur > 0 ? maleCur : cockerels;

    if (breed && breed !== "Unknown") {
      breedMap[breed] = (breedMap[breed] || 0) + total;
      breedSet.add(breed);
    }
    const flockId = f.ID || f.id || "";
    if (flockId && breed && breed !== "Unknown") flockIdBreedMap[flockId] = breed;
  });

  const allBreeds = ["All Breeds", ...Array.from(breedSet).sort()];
  const birdsAliveTotal = femaleAliveCurrent + maleAliveCurrent;

  /* ─── 1b. BREEDER FARMS ─────────────────────────────────────────── */
  const breederFarms = await zohoGetAll("All_Breeder_Farms");
  console.group("✅ [1b] BREEDER FARMS");
  console.log("Total records:", breederFarms.length);
  console.groupEnd();

  const farmSet = new Set();
  const farmIdNameMap = {};
  breederFarms.forEach((f) => {
    const name = displayVal(f.Farm_Name || f.Breeder_Farm_Name || f.Name || "").trim();
    const id = String(f.ID || f.id || "");
    if (name) { farmSet.add(name); if (id) farmIdNameMap[id] = name; }
  });
  const allFarms = ["All Farms", ...Array.from(farmSet).sort()];
  console.log("[WAFAD] allFarms:", allFarms);

  // Rebuild farmBirdsPlacedMap now that farmIdNameMap is available
  flocks.forEach((f) => {
    const pullets = num(fv(f, "Pullets_Housed"));
    const cockerels = num(fv(f, "Cockerels_Housed"));
    const total = num(fv(f, "Total_Birds_Housed")) || pullets + cockerels;
    if (total === 0) return;
    const farmRef = f.Breeder_Farm;
    let farmName = null;
    if (farmRef) {
      if (typeof farmRef === "object") {
        farmName = farmRef.zc_display_value || farmRef.display_value || farmRef.Farm_Name || farmRef.Name || null;
        const fId = String(farmRef.ID || farmRef.id || "");
        if (!farmName && fId) farmName = farmIdNameMap[fId] || null;
      } else {
        farmName = String(farmRef).trim() || null;
      }
    }
    if (farmName) farmBirdsPlacedMap[farmName] = (farmBirdsPlacedMap[farmName] || 0) + total;
  });
  console.log("[WAFAD] farmBirdsPlacedMap:", farmBirdsPlacedMap);

  /* ─── helper: resolve farm name from a record ───────────────────── */
  function resolveFarmName(r) {
    const farmRef = r.Breeder_Farm;
    if (!farmRef) return null;
    if (typeof farmRef === "object") {
      let n = farmRef.zc_display_value || farmRef.display_value || farmRef.Name || null;
      const fId = String(farmRef.ID || farmRef.id || "");
      if (!n && fId) n = farmIdNameMap[fId] || null;
      return n || displayVal(farmRef) || null;
    }
    return String(farmRef).trim() || null;
  }


  /* ─── SECTION A: FEED DELIVERIES ─────────────────────── */
  const feedDeliveries = await zohoGetAll("All_Feed_Deliveries");

  let feedDeliveryCostWeek = 0, feedDeliveryCostMonth = 0, feedDeliveryCostYear = 0;
  let feedDeliveryKgWeek = 0, feedDeliveryKgMonth = 0, feedDeliveryKgYear = 0;
  const feedDeliveryByFarm = {};
  const feedDeliveryByBreed = {};
  const recentFeedDeliveries = [];

  // Per-breed kg and cost accumulators (week / month / year)
  const breedFeedCostWeek = {};
  const breedFeedCostMonth = {};
  const breedFeedCostYear = {};
  const breedFeedKgWeek = {};
  const breedFeedKgMonth = {};
  const breedFeedKgYear = {};

  feedDeliveries.forEach((d) => {
    const status = (fv(d, "Status") || "").toLowerCase();
    if (status !== "delivered") return;

    const rawDate = fv(d, "Delivery_Date") || fv(d, "Added_Time");
    const recDate = parseZohoDate(rawDate);
    const isYear = recDate && recDate >= yearStart && recDate <= yearEnd;
    const isWeek = recDate && recDate >= weekStart && recDate <= weekEnd;
    const isMonth = recDate && recDate >= monthStart && recDate <= monthEnd;
    // const isWeek = recDate && recDate >= weekStart;
    // const isMonth = recDate && recDate >= monthStart;
    // const isYear = recDate && recDate >= yearStart;

    // ── Parent-level fields (exact names from console) ────
    const feedCost = num(d.Feed_Cost || 0);
    const qtyKg = num(d.Quantity_delivered_kg || 0);   // lowercase 'd'
    const costPerKg = num(d.Feed_Cost_Per_Kg || 0);
    const costPerTon = num(d.Feed_Cost_per_Ton || 0);
    const feedName = displayVal(d.Feed_Trade_Name || "") || "Unknown Feed";
    const feedType = displayVal(d.Feed_Type || "") || "";

    // ── Parent-level period bucketing ─────────────────────
    if (isYear) { feedDeliveryCostYear += feedCost; feedDeliveryKgYear += qtyKg; }
    if (isMonth) { feedDeliveryCostMonth += feedCost; feedDeliveryKgMonth += qtyKg; }
    if (isWeek) { feedDeliveryCostWeek += feedCost; feedDeliveryKgWeek += qtyKg; }

    // ── Bin Splits → per-breed / per-farm breakdown ───────
    const binSplits = d.Bin_Splits || [];
    if (Array.isArray(binSplits) && binSplits.length > 0) {
      binSplits.forEach((bin) => {
        // Exact field names from console log
        const binKg = num(bin.Total_kg || 0);
        const binCost = num(bin.Cost || 0);

        // ── Resolve breed via Flock.ID → flockIdBreedMap ──
        let breedName = null;
        const flockRef = bin.Flock;
        if (flockRef && typeof flockRef === "object") {
          const flockId = String(flockRef.ID || flockRef.id || "");
          breedName = flockIdBreedMap[flockId] || null;

          // Fallback: parse breed from Flock_Code or zc_display_value
          if (!breedName) {
            const flockCode = (flockRef.Flock_Code || flockRef.zc_display_value || "").toUpperCase();
            if (flockCode.includes("EP") || flockCode.includes("EFFICIENCY")) breedName = "Efficiency Plus";
            else if (flockCode.includes("RB") || flockCode.includes("REDBRO")) breedName = "Redbro";
            else if (flockCode.includes("NW") || flockCode.includes("NOVO W")) breedName = "Novo White";
            else if (flockCode.includes("NB") || flockCode.includes("NOVO B")) breedName = "Novo Brown";
            else if (flockCode.includes("JA") || flockCode.includes("JA57")) breedName = "Ja57Ki";
          }
        }

        // ── Resolve farm via Breeder_House or parent record ─
        let farmName = null;
        const houseRef = bin.Breeder_House;
        if (houseRef && typeof houseRef === "object") {
          // Try to get farm from flockIdBreedMap's companion farmIdNameMap
          const flockId = String(flockRef?.ID || flockRef?.id || "");
          farmName = farmIdNameMap[flockId] || null;
        }
        if (!farmName) farmName = resolveFarmName(d) || null;

        // ── Accumulate by breed ───────────────────────────
        if (breedName && binCost > 0) {
          if (isYear) {
            breedFeedCostYear[breedName] = (breedFeedCostYear[breedName] || 0) + binCost;
            breedFeedKgYear[breedName] = (breedFeedKgYear[breedName] || 0) + binKg;
          }
          if (isMonth) {
            breedFeedCostMonth[breedName] = (breedFeedCostMonth[breedName] || 0) + binCost;
            breedFeedKgMonth[breedName] = (breedFeedKgMonth[breedName] || 0) + binKg;
          }
          if (isWeek) {
            breedFeedCostWeek[breedName] = (breedFeedCostWeek[breedName] || 0) + binCost;
            breedFeedKgWeek[breedName] = (breedFeedKgWeek[breedName] || 0) + binKg;
          }
          feedDeliveryByBreed[breedName] = (feedDeliveryByBreed[breedName] || 0) + binCost;
        }

        // ── Accumulate by farm ────────────────────────────
        if (farmName && binCost > 0) {
          feedDeliveryByFarm[farmName] = (feedDeliveryByFarm[farmName] || 0) + binCost;
        }
      });
    }

    // ── Recent deliveries list (last 10) ─────────────────
    if (recentFeedDeliveries.length < 10) {
      recentFeedDeliveries.push({
        date: rawDate || "",
        feedName,
        feedType,
        qtyKg,
        feedCost,
        costPerKg,
        costPerTon,
        status,
        binCount: binSplits.length,
      });
    }
  });

  console.log("[WAFAD] Feed Deliveries → Month cost:", feedDeliveryCostMonth,
    "| Kg:", feedDeliveryKgMonth,
    "| By breed:", feedDeliveryByBreed,
    "| By farm:", feedDeliveryByFarm);
  console.log("[WAFAD] Breed feed cost month:", breedFeedCostMonth);
  console.log("[WAFAD] Breed feed kg month:", breedFeedKgMonth);



  /* ─── 2. DAILY OPS ──────────────────────────────────────────────── */
  const dailyOps = await zohoGetAll("Detailed_Daily_Ops_Report", 1000);
  console.group("✅ [2] DAILY OPS REPORT");
  console.log("Total records:", dailyOps.length);
  console.log("Sample keys:", dailyOps[0] ? Object.keys(dailyOps[0]) : "EMPTY");
  console.groupEnd();

  // Global mortality / egg / feed accumulators
  let totalMortality = 0;
  let mortalityThisWeek = 0, mortalityThisMonth = 0, mortalityThisYear = 0;
  let mortalityLastWeek = 0, mortalityLastMonth = 0;
  let mortalityFemale = 0, mortalityMale = 0;
  let eggsThisWeek = 0, eggsThisMonth = 0, eggsThisYear = 0;
  let hatchingEggsYear = 0;
      let mortalityFemaleWeek = 0, mortalityFemaleMonth = 0, mortalityFemaleYear = 0;
    let mortalityMaleWeek = 0, mortalityMaleMonth = 0, mortalityMaleYear = 0;

  let hatchingEggsWeek = 0, hatchingEggsMonth = 0;
  let farmRejectedEggs = 0, crackedEggs = 0, dirtyEggs = 0, floorEggs = 0;
  let feedIntakeTonsWeek = 0, feedIntakeTonsMonth = 0;

  const weeklyEggTrend = {}, farmMort = {};
  let farmRejectedEggsWeek = 0, farmRejectedEggsMonth = 0, farmRejectedEggsYear = 0;

  // Breed / farm egg accumulators
  const breedEggData = {};
  const farmEggData = {};
  const farmBreedEggData = {};
  const ensureBreedEgg = (b) => { if (b && !breedEggData[b]) breedEggData[b] = emptyBreedEgg(); };
  const ensureFarmEgg = (f) => { if (f && !farmEggData[f]) farmEggData[f] = emptyBreedEgg(); };

  // Feed usage rows collected from subform (used later for cost reconciliation)
  const feedUsageRows = [];
const weeklyGenderFeed = {};

  dailyOps.forEach((r) => {
    const rawDate = fv(r, "Date_field") || fv(r, "Date") || fv(r, "Added_Time");
    const recDate = parseZohoDate(rawDate);
    const isYear = recDate && recDate >= yearStart && recDate <= yearEnd;
    const isWeek = recDate && recDate >= weekStart && recDate <= weekEnd;
    const isMonth = recDate && recDate >= monthStart && recDate <= monthEnd;
    // const isWeek = recDate && recDate >= weekStart;
    // const isMonth = recDate && recDate >= monthStart;
    // const isYear = recDate && recDate >= yearStart;
    const isLWk = recDate && recDate >= lastWeekStart && recDate <= lastWeekEnd && recDate <= yearEnd;
    const isLMon = recDate && recDate >= lastMonthStart && recDate <= lastMonthEnd && recDate <= yearEnd;

    // ── Feed_Details subform ──────────────────────────────
    const feedRows = r.Feed_Details;
    if (Array.isArray(feedRows) && feedRows.length > 0) {
      feedRows.forEach((row) => {
        const prodName = displayVal(
          row["Product_Name.Product_Name"] || row["Product_Name.Name"] || row.Product_Name || ""
        ).trim().toUpperCase();
        const consumedKg = num(row.Consumed_KG ?? row.Consumed_Kg ?? 0);
        const gender = (row.Gender || "").toString().toLowerCase().trim();
        if (!window._feedSubformLogged) {
          window._feedSubformLogged = true;
          console.log("[WAFAD] Feed_Details keys:", Object.keys(row));
          console.log("[WAFAD] → prodName:", prodName, "| kg:", consumedKg, "| gender:", gender);
        }
        if (prodName && consumedKg > 0) feedUsageRows.push({ prodName, consumedKg, gender, recDate });
      });
    }

    // ── Mortality ─────────────────────────────────────────
    const mortFemale = num(fv(r, "Mortality_Count_Px") || fv(r, "Female_Mortality") || fv(r, "Dead_Female"));
    const mortMale = num(fv(r, "Mortality_Count_Cx") || fv(r, "Male_Mortality") || fv(r, "Dead_Male"));
    const mortTotalRaw = num(fv(r, "Total_Mortality_Count") || fv(r, "Total_Quantity_Mortality") || fv(r, "Mortality_Count") || fv(r, "Total_Dead_Birds"));
    const mortTotal = mortTotalRaw > 0 ? mortTotalRaw : mortFemale + mortMale;


    // const feedKg = num(fv(r, "Total_Feed_Consumed") || fv(r, "Feed_Consumed") || fv(r, "Feed_Consumed_Kg"));
   const feedKgPx   = num(fv(r, "Feed_Consumed_Kg_Px") || 0);
const feedKgCx   = num(fv(r, "Feed_Consumed_Kg_Cx") || 0);
const feedKgBase = num(fv(r, "Total_Feed_Consumed") || fv(r, "Feed_Consumed") || fv(r, "Feed_Consumed_Kg"));
const feedKg     = feedKgBase > 0 ? feedKgBase : (feedKgPx + feedKgCx); 
    const weekNum = num(fv(r, "Week_Number") || fv(r, "Age_of_Birds_Weeks") || fv(r, "Bird_Age_Week"));

// ── Breed resolution via Flock lookup ────────────────
    let recBreed = null;
    const flockRef = r.Flock;
    if (flockRef) {
      if (typeof flockRef === "object") {
        const flockId = String(flockRef.ID || flockRef.id || "");
        recBreed = flockIdBreedMap[flockId] ||
          displayVal(flockRef["Breed_Name"] || flockRef["Breed_Name.Breed_Name"] || "") ||
          displayVal(flockRef) || null;
      } else {
        recBreed = flockIdBreedMap[String(flockRef)] || String(flockRef).trim() || null;
      }
    }

    // ── Farm resolution ───────────────────────────────────
    const recFarm = resolveFarmName(r);

    totalMortality += mortTotal;
    mortalityFemale += mortFemale;
    mortalityMale += mortMale;
    if (recFarm) farmMort[recFarm] = (farmMort[recFarm] || 0) + mortTotal;
    if (isWeek) { mortalityThisWeek += mortTotal; feedIntakeTonsWeek += feedKg / 1000; }
    if (isMonth) { mortalityThisMonth += mortTotal; feedIntakeTonsMonth += feedKg / 1000; }
    if (isYear) mortalityThisYear += mortTotal;
    if (isLWk) mortalityLastWeek += mortTotal;
    if (isLMon) mortalityLastMonth += mortTotal;

  // inside the loop, right after the existing mortality lines
if (isWeek)  { mortalityFemaleWeek  += mortFemale; mortalityMaleWeek  += mortMale; }
if (isMonth) { mortalityFemaleMonth += mortFemale; mortalityMaleMonth += mortMale; }
if (isYear)  { mortalityFemaleYear  += mortFemale; mortalityMaleYear  += mortMale; }

    // ── Egg fields ────────────────────────────────────────
    const eggs = num(fv(r, "Total_Egg_Collected"));
    const hatchEgg = num(fv(r, "Total_Hatchable_Eggs"));
    const farmRej = num(fv(r, "Total_Farm_Rejected_Eggs"));
    const cracked = num(fv(r, "Total_Cracked_Eggs"));
    const dirty = num(fv(r, "Total_Dirty_Eggs"));
    const floor_ = num(fv(r, "Total_Floor_Eggs"));

    // ── Placement-cumulative week-by-week gender feed (no year filter) ──
if (recBreed && weekNum > 0) {
  const wKey = `${recBreed}||${weekNum}`;
  if (!weeklyGenderFeed[wKey]) {
    weeklyGenderFeed[wKey] = {
      breed:      recBreed,
      week:       weekNum,
      feedPx:     0,   // female (Px)
      feedCx:     0,   // male   (Cx)
      feedTotal:  0,
      mortPx:     0,
      mortCx:     0,
      eggs:       0,
      hatchable:  0,
      firstDate:  recDate,
    };
  }
  const wg = weeklyGenderFeed[wKey];
  wg.feedPx    += feedKgPx;
  wg.feedCx    += feedKgCx;
  wg.feedTotal += (feedKgPx + feedKgCx) > 0 ? (feedKgPx + feedKgCx) : feedKg;
  wg.mortPx    += mortFemale;
  wg.mortCx    += mortMale;
  wg.eggs      += eggs;
  wg.hatchable += hatchEgg;
  if (recDate < wg.firstDate) wg.firstDate = recDate;
}

    const mKey = mkMonthKey(recDate);
    if (mKey) {
      ensureMonth(monthlyOpsData, mKey, OPS_TPL);
      monthlyOpsData[mKey].eggs += eggs;
      monthlyOpsData[mKey].hatchable += hatchEgg;
      monthlyOpsData[mKey].mort += mortTotal;
      monthlyOpsData[mKey].feedKg += feedKg;
    }

    farmRejectedEggs += farmRej;
    crackedEggs += cracked;
    dirtyEggs += dirty;
    floorEggs += floor_;
    if (isWeek) { eggsThisWeek += eggs; hatchingEggsWeek += hatchEgg; farmRejectedEggsWeek += farmRej; }
    if (isMonth) { eggsThisMonth += eggs; hatchingEggsMonth += hatchEgg; farmRejectedEggsMonth += farmRej; }
    if (isYear) { eggsThisYear += eggs; hatchingEggsYear += hatchEgg; farmRejectedEggsYear += farmRej; }

    // ── Breed resolution via Flock lookup ────────────────

    // ── breedEggData accumulation ─────────────────────────
    if (recBreed) {
      ensureBreedEgg(recBreed);
      const b = breedEggData[recBreed];
      if (isWeek) { b.eggsWeek += eggs; b.hatchableWeek += hatchEgg; b.mortalityWeek += mortTotal; b.feedKgWeek += feedKg; b.farmRejectedWeek += farmRej; }
      if (isMonth) { b.eggsMonth += eggs; b.hatchableMonth += hatchEgg; b.mortalityMonth += mortTotal; b.feedKgMonth += feedKg; b.farmRejectedMonth += farmRej; }
      if (isYear) { b.eggsYear += eggs; b.mortalityYear += mortTotal; b.feedKgYear += feedKg; b.farmRejectedYear += farmRej; }
      b.farmRejectedTotal += farmRej;
      b.crackedTotal += cracked;
      b.dirtyTotal += dirty;
      b.floorTotal += floor_;
      b.mortalityFemale += mortFemale;
      b.mortalityMale += mortMale;
    }
    // ── farmEggData accumulation ──────────────────────────

    if (recFarm) {
      ensureFarmEgg(recFarm);
      const f = farmEggData[recFarm];
      if (isWeek) { f.eggsWeek += eggs; f.hatchableWeek += hatchEgg; f.mortalityWeek += mortTotal; f.feedKgWeek += feedKg; f.farmRejectedWeek += farmRej; }
      if (isMonth) { f.eggsMonth += eggs; f.hatchableMonth += hatchEgg; f.mortalityMonth += mortTotal; f.feedKgMonth += feedKg; f.farmRejectedMonth += farmRej; }
      if (isYear) { f.eggsYear += eggs; f.mortalityYear += mortTotal; f.feedKgYear += feedKg; f.farmRejectedYear += farmRej; }
      f.farmRejectedTotal += farmRej;
      f.crackedTotal += cracked;
      f.dirtyTotal += dirty;
      f.floorTotal += floor_;
      f.mortalityFemale += mortFemale;
      f.mortalityMale += mortMale;
    }
    // ── farmBreedEggData accumulation ─────────────────────

    if (recFarm && recBreed) {
      if (!farmBreedEggData[recFarm]) farmBreedEggData[recFarm] = {};
      if (!farmBreedEggData[recFarm][recBreed]) farmBreedEggData[recFarm][recBreed] = emptyBreedEgg();
      const fb = farmBreedEggData[recFarm][recBreed];
      if (isWeek) { fb.eggsWeek += eggs; fb.hatchableWeek += hatchEgg; fb.mortalityWeek += mortTotal; fb.feedKgWeek += feedKg; fb.farmRejectedWeek += farmRej; }
      if (isMonth) { fb.eggsMonth += eggs; fb.hatchableMonth += hatchEgg; fb.mortalityMonth += mortTotal; fb.feedKgMonth += feedKg; fb.farmRejectedMonth += farmRej; }
      if (isYear) { fb.eggsYear += eggs; fb.mortalityYear += mortTotal; fb.feedKgYear += feedKg; fb.farmRejectedYear += farmRej; }
      fb.farmRejectedTotal += farmRej;
      fb.mortalityFemale += mortFemale;
      fb.mortalityMale += mortMale;
    }
    if (weekNum > 0) {
      if (!weeklyEggTrend[weekNum]) weeklyEggTrend[weekNum] = { week: weekNum, eggs: 0, feed: 0, mort: 0 };
      weeklyEggTrend[weekNum].eggs += eggs;
      weeklyEggTrend[weekNum].feed += feedKg / 1000;
      weeklyEggTrend[weekNum].mort += mortTotal;
    }
  });

  // ── Sort week-by-week feed rows: by breed then week number ──
const weeklyGenderFeedRows = Object.values(weeklyGenderFeed)
  .sort((a, b) =>
    a.breed.localeCompare(b.breed) || a.week - b.week
  );

console.log("[WAFAD] Weekly gender feed rows:", weeklyGenderFeedRows.length);

  const birdsAlive = Math.max(0, totalBirdsPlaced - totalMortality);
  const mortalityPct = birdsAliveTotal > 0
    ? parseFloat(((mortalityThisWeek / birdsAliveTotal) * 100).toFixed(2)) : 0;
  const mortalityPctCumulative = totalBirdsPlaced > 0
    ? parseFloat(((totalMortality / totalBirdsPlaced) * 100).toFixed(2)) : 0;
  const worstFarm = Object.entries(farmMort).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
  // For past years: use eggsThisYear/365 as daily rate × 30 to normalise to monthly
  const isPastYear = selectedYear && selectedYear !== new Date().getFullYear();
  // Egg production rate = eggs per hen per day expressed as %
// Formula: (Total Eggs in Period) / (Hens Alive × Days in Period) × 100
// Only female birds (pullets) lay eggs so we use femaleAliveCurrent as denominator

const now_date = new Date();
const daysInCurrentMonth = new Date(now_date.getFullYear(), now_date.getMonth() + 1, 0).getDate();

const eggsForRateCalc = isPastYear
  ? Math.round(eggsThisYear / 365)   // daily average for past year
  : Math.round(eggsThisMonth / daysInCurrentMonth); // daily average for current month

const hensForRate = Math.max(1, femaleAliveCurrent); // only hens lay eggs

const avgEggProductionRate = hensForRate > 0
  ? parseFloat(((eggsForRateCalc / hensForRate) * 100).toFixed(1))
  : 0;
  // const avgEggProductionRate = birdsAliveTotal > 0
  //   ? parseFloat(((eggsThisMonth / Math.max(1, birdsAliveTotal)) * 100).toFixed(1)) : 0;
  const eggsWeeklyTrend = Object.values(weeklyEggTrend)
    .sort((a, b) => a.week - b.week).slice(-6)
    .map((w) => ({ w: `Wk ${w.week}`, eggs: w.eggs, feed: parseFloat(w.feed.toFixed(1)), mort: w.mort }));

  /* ─── 3. DETAILED DAILY OPS (Feed consumption per gender) ───────── */
  // NOTE: We reuse the same "Detailed_Daily_Ops_Report" as section 2.
  // Here we pull gender-split feed consumption for expense calculation.
  const detailedOps = await zohoGetAll("Detailed_Daily_Ops_Report", 1000);
  console.group("✅ [3] DETAILED DAILY OPS (Feed Mill)");
  console.log("Total records:", detailedOps.length);
  console.groupEnd();

  let feedProducedMT = 0, feedIssuedMT = 0;
  let feedProducedWeekMT = 0, feedIssuedWeekMT = 0, feedProducedYearMT = 0;
  const feedDayMap = {};

  // Collect feed kg consumed per period (cost computed after section 11 when costPerFeedKg is known)
  let feedKgWeekFromOps = 0, feedKgMonthFromOps = 0, feedKgYearFromOps = 0;

  detailedOps.forEach((r) => {
    const rawDate = fv(r, "Date_field") || fv(r, "Added_Time");
    const recDate = parseZohoDate(rawDate);
    const feedPx = num(fv(r, "Feed_Consumed_Kg_Px"));
    const feedCx = num(fv(r, "Feed_Consumed_Kg_Cx"));
    const totalFeed = feedPx + feedCx;

    if (recDate && recDate >= yearStart && recDate <= yearEnd) {
      feedProducedYearMT += totalFeed / 1000;
      feedKgYearFromOps += totalFeed;
    }
    if (recDate && recDate >= monthStart && recDate <= monthEnd) {
      feedProducedMT += totalFeed / 1000;
      feedIssuedMT += (totalFeed * 0.97) / 1000;
      feedKgMonthFromOps += totalFeed;
      // Past year: group by month name. Current year: group by day of week
      const isPastYr = selectedYear && selectedYear !== new Date().getFullYear();
      const dayKey = isPastYr
        ? recDate.toLocaleDateString("en-US", { month: "short" })
        : recDate.toLocaleDateString("en-US", { weekday: "short" });
      if (!feedDayMap[dayKey]) feedDayMap[dayKey] = { d: dayKey, prod: 0, issued: 0 };
      feedDayMap[dayKey].prod += parseFloat((totalFeed / 1000).toFixed(2));
      feedDayMap[dayKey].issued += parseFloat(((totalFeed * 0.97) / 1000).toFixed(2));
    }
    // if (recDate && recDate >= monthStart && recDate <= monthEnd) {
    //   feedProducedMT += totalFeed / 1000;
    //   feedIssuedMT += (totalFeed * 0.97) / 1000;
    //   feedKgMonthFromOps += totalFeed;
    //   const dayKey = recDate.toLocaleDateString("en-US", { weekday: "short" });
    //   if (!feedDayMap[dayKey]) feedDayMap[dayKey] = { d: dayKey, prod: 0, issued: 0 };
    //   feedDayMap[dayKey].prod += parseFloat((totalFeed / 1000).toFixed(2));
    //   feedDayMap[dayKey].issued += parseFloat(((totalFeed * 0.97) / 1000).toFixed(2));
    // }
    if (recDate && recDate >= weekStart && recDate <= weekEnd) {
      feedProducedWeekMT += totalFeed / 1000;
      feedIssuedWeekMT += (totalFeed * 0.97) / 1000;
      feedKgWeekFromOps += totalFeed;
    }
  });


  const DAYS_ORDER = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const MONTHS_ORDER = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const isPastYrFeed = selectedYear && selectedYear !== new Date().getFullYear();
  const feedTrend = isPastYrFeed
    ? MONTHS_ORDER.filter((m) => feedDayMap[m]).map((m) => ({
      d: m,
      prod: parseFloat(feedDayMap[m].prod.toFixed(1)),
      issued: parseFloat(feedDayMap[m].issued.toFixed(1)),
    }))
    : DAYS_ORDER.filter((d) => feedDayMap[d]).map((d) => ({
      d,
      prod: parseFloat(feedDayMap[d].prod.toFixed(1)),
      issued: parseFloat(feedDayMap[d].issued.toFixed(1)),
    }));

  // const DAYS_ORDER = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  // const feedTrend = DAYS_ORDER.filter((d) => feedDayMap[d]).map((d) => ({
  //   d,
  //   prod: parseFloat(feedDayMap[d].prod.toFixed(1)),
  //   issued: parseFloat(feedDayMap[d].issued.toFixed(1)),
  // }));

  /* ─── 4. HATCHERY ───────────────────────────────────────────────── */
  const hatchSF = await zohoGetAll("Detailed_Hatches");
  console.group("✅ [4] HATCHERY REPORT");
  console.log("Total records:", hatchSF.length);
  console.log("Statuses present:", [...new Set(hatchSF.map((h) => fv(h, "Status") || "null"))]);
  console.groupEnd();

  // ✅ ADD THIS DEBUG SECTION:
console.log("[WAFAD] 🔍 HATCHERY DEBUG - Total hatch records:", hatchSF.length);
if (hatchSF.length > 0) {
  console.log("[WAFAD] First hatch record keys:", Object.keys(hatchSF[0]));
  console.log("[WAFAD] First hatch record:", hatchSF[0]);
  console.log("[WAFAD] Eggs_Details subform exists?", !!hatchSF[0].Eggs_Details);
  console.log("[WAFAD] Eggs_Details content:", hatchSF[0].Eggs_Details);
  if (Array.isArray(hatchSF[0].Eggs_Details) && hatchSF[0].Eggs_Details.length > 0) {
    console.log("[WAFAD] First egg row keys:", Object.keys(hatchSF[0].Eggs_Details[0]));
    console.log("[WAFAD] First egg row:", hatchSF[0].Eggs_Details[0]);
  }
}

  let eggsSetWeek = 0, eggsSetMonth = 0, eggsSetYear = 0; 
  let hatchForecastWeek = 0, hatchForecastMonth = 0, hatchForecastYear = 0;
  let eggsSetLastWeek = 0, eggsSetLastMonth = 0;
  let goodChicksWeek = 0, goodChicksMonth = 0, goodChicksYear = 0;
  let goodChicksLastWeek = 0, goodChicksLastMonth = 0;
  let poorChicksMonth = 0, fertileEggsMonth = 0;
  const hatchBatchMap = {};
  const breedHatchData = {};
  const ensureBreedHatch = (b) => { if (b && !breedHatchData[b]) breedHatchData[b] = emptyBreedHatch(); };

  hatchSF.forEach((h) => {
    const status = (fv(h, "Status") || "").toLowerCase().trim();
    const isHatched = status === "hatched";
    const settingDate = parseZohoDate(fv(h, "Setting_Date"));
    const hatchedDateRaw = fv(h, "Hatched_Date");


    // Settable eggs → only count toward batch totals if the setting date falls in the selected year
// if (settingDate && settingDate >= yearStart && settingDate <= yearEnd) {
//   hatchBatchMap[batch].set += settable;
// }
// // inside the isHatched block
// if (isHatched && hatchedDate && hatchedDate >= yearStart && hatchedDate <= yearEnd) {
//   hatchBatchMap[batch].fertile += fertile;
//   hatchBatchMap[batch].hatched += good;
// }

    const hatchedDate = hatchedDateRaw ? parseZohoDate(hatchedDateRaw) : null;
    const scheduledDate = parseZohoDate(fv(h, "Scheduled_Date") || fv(h, "Expected_Hatch_Date") || fv(h, "Scheduled_Hatch_Date"));
    const batch = fv(h, "Hatch_No") || "B";
    if (!hatchBatchMap[batch]) hatchBatchMap[batch] = { set: 0, fertile: 0, hatched: 0 };

  if (!hatchBatchMap[batch].hatchedDateRaw && isHatched && hatchedDate && !isNaN(hatchedDate)) {
  hatchBatchMap[batch].hatchedDateRaw = hatchedDate;
}

    const eggRows = h.Eggs_Details;
    if (!Array.isArray(eggRows) || eggRows.length === 0) return;

    eggRows.forEach((row) => {
      const breed = displayVal(row.Birds || row["Birds.Name"] || row.Breed_Name1 || "").trim() || "Unknown";
      const settable = num(row.Settable_Eggs ?? 0);
      const fertile = num(row.Fertile_Eggs ?? 0);
      const good = num(row.Good_Chicks ?? 0);
      const poor = num(row.Poor_Hatch_Culls ?? 0);

      ensureBreedHatch(breed);

      // Settable eggs keyed by settingDate
      if (settingDate && !isNaN(settingDate)) {
        const mKeySet = mkMonthKey(settingDate);
        if (mKeySet) {
          ensureMonth(monthlyHatchData, mKeySet, HATCH_TPL);
          monthlyHatchData[mKeySet].eggsSet += settable;
        }
        if (settingDate >= yearStart && settingDate <= yearEnd) { eggsSetYear += settable; breedHatchData[breed].eggsSetYear += settable; }
        if (settingDate >= monthStart && settingDate <= monthEnd) { eggsSetMonth += settable; breedHatchData[breed].eggsSetMonth += settable; }
        if (settingDate >= weekStart && settingDate <= weekEnd) { eggsSetWeek += settable; breedHatchData[breed].eggsSetWeek += settable; }
        // if (settingDate >= yearStart) { eggsSetYear += settable; breedHatchData[breed].eggsSetYear += settable; }
        // if (settingDate >= monthStart) { eggsSetMonth += settable; breedHatchData[breed].eggsSetMonth += settable; }
        // if (settingDate >= weekStart) { eggsSetWeek += settable; breedHatchData[breed].eggsSetWeek += settable; }
        if (settingDate >= lastWeekStart && settingDate <= lastWeekEnd) eggsSetLastWeek += settable;
        if (settingDate >= lastMonthStart && settingDate <= lastMonthEnd) eggsSetLastMonth += settable;
      }
            // ADD THIS BLOCK ↓ — forecast by scheduled hatch date (all statuses: Setted, Candled, Hatched)
      if (scheduledDate) {
        if (scheduledDate >= yearStart && scheduledDate <= yearEnd) hatchForecastYear += settable;
        if (scheduledDate >= monthStart && scheduledDate <= monthEnd) hatchForecastMonth += settable;
        if (scheduledDate >= weekStart && scheduledDate <= weekEnd) hatchForecastWeek += settable;
      }
      breedHatchData[breed].settableEggs += settable;
      hatchBatchMap[batch].set += settable;

      // Good chicks / fertile keyed by hatchedDate (only when hatched)
      if (isHatched && hatchedDate && !isNaN(hatchedDate)) {
        const mKeyHatch = mkMonthKey(hatchedDate);
        if (mKeyHatch) {
  ensureMonth(monthlyHatchData, mKeyHatch, HATCH_TPL);
  monthlyHatchData[mKeyHatch].goodChicks += good;
  monthlyHatchData[mKeyHatch].fertile    += fertile;

  // ── Chick type distribution (mirrors C4U module classification) ──
  const bu = breed.toUpperCase();
if (
  bu.includes("GRANGER") || bu.includes("COCK") ||
  bu.includes("REDBRO")  || bu.includes("JA57") || bu.includes("JA")
) {
  // Granger Gold, Granger TR, Granger Plus, Granger Black, etc.
  monthlyHatchData[mKeyHatch].grangers =
    (monthlyHatchData[mKeyHatch].grangers || 0) + good;
} else if (
  bu.includes("LAYER") || bu.includes("NOVO") ||
  bu.includes("NW")    || bu.includes("NB")
) {
  // Novobrown, Novowhite, etc.
  monthlyHatchData[mKeyHatch].layers =
    (monthlyHatchData[mKeyHatch].layers || 0) + good;
} else if (
  bu.includes("BROILER") || bu.includes("EFFICIENCY")   // ← moved here
) {
  // Efficiency Plus, etc.
  monthlyHatchData[mKeyHatch].broilers =
    (monthlyHatchData[mKeyHatch].broilers || 0) + good;
} else {
  // Unknown breed — counts toward grangers (parent-stock default)
  monthlyHatchData[mKeyHatch].grangers =
    (monthlyHatchData[mKeyHatch].grangers || 0) + good;
}
}
        // if (mKeyHatch) {
        //   ensureMonth(monthlyHatchData, mKeyHatch, HATCH_TPL);
        //   monthlyHatchData[mKeyHatch].goodChicks += good;
        //   monthlyHatchData[mKeyHatch].fertile += fertile;
        // }
        hatchBatchMap[batch].fertile += fertile;
        hatchBatchMap[batch].hatched += good;
        if (hatchedDate >= yearStart && hatchedDate <= yearEnd) { goodChicksYear += good; breedHatchData[breed].goodChicksYear += good; }
        if (hatchedDate >= monthStart && hatchedDate <= monthEnd) {
          goodChicksMonth += good; poorChicksMonth += poor; fertileEggsMonth += fertile;
          breedHatchData[breed].goodChicksMonth += good;
          breedHatchData[breed].fertileEggs += fertile;
          breedHatchData[breed].poorChicks += poor;
        }
        if (hatchedDate >= weekStart && hatchedDate <= weekEnd) { goodChicksWeek += good; breedHatchData[breed].goodChicksWeek += good; }
        // if (hatchedDate >= yearStart) { goodChicksYear += good; breedHatchData[breed].goodChicksYear += good; }
        // if (hatchedDate >= monthStart) {
        //   goodChicksMonth += good; poorChicksMonth += poor; fertileEggsMonth += fertile;
        //   breedHatchData[breed].goodChicksMonth += good;
        //   breedHatchData[breed].fertileEggs += fertile;
        //   breedHatchData[breed].poorChicks += poor;
        // }
        // if (hatchedDate >= weekStart) { goodChicksWeek += good; breedHatchData[breed].goodChicksWeek += good; }
        if (hatchedDate >= lastWeekStart && hatchedDate <= lastWeekEnd) goodChicksLastWeek += good;
        if (hatchedDate >= lastMonthStart && hatchedDate <= lastMonthEnd) goodChicksLastMonth += good;
      }
    });
  });


  const allBatchesSorted = Object.entries(hatchBatchMap)
  .sort((a, b) => String(a[0]).localeCompare(String(b[0])));

const hatchWeeklyTrend = allBatchesSorted
  .slice(-6)
  .map(([name, d], i) => ({ w: name || `Batch ${i + 1}`, set: d.set, fertile: d.fertile, hatched: d.hatched }));

  // First, build a map of batch name → dates from hatchSF
const batchDatesMap = {};
hatchSF.forEach((h) => {
  const batch = fv(h, "Hatch_No") || "B";
  const settingDate = parseZohoDate(fv(h, "Setting_Date"));
  const hatchedDate = parseZohoDate(fv(h, "Hatched_Date"));
  const scheduledDate = parseZohoDate(fv(h, "Scheduled_Date") || fv(h, "Expected_Hatch_Date") || fv(h, "Scheduled_Hatch_Date"));
  if (!batchDatesMap[batch]) {
    batchDatesMap[batch] = {
      settingDate: settingDate ? settingDate.toLocaleDateString("en-US", { day:"2-digit", month:"short", year:"numeric" }) : "—",
      hatchedDate: hatchedDate ? hatchedDate.toLocaleDateString("en-US", { day:"2-digit", month:"short", year:"numeric" }) : "—",
      scheduledDate: scheduledDate ? scheduledDate.toLocaleDateString("en-US", { day:"2-digit", month:"short", year:"numeric" }) : "—",
    };
  }
});

const allBatchesExport = allBatchesSorted.map(([name, d], i) => ({
  batch        : name || `Batch ${i + 1}`,
  set          : d.set,
  fertile      : d.fertile,
  hatched      : d.hatched,
  hatchPct     : d.set > 0 ? parseFloat(((d.hatched / d.set) * 100).toFixed(1)) : 0,
  settingDate  : batchDatesMap[name]?.settingDate  || "—",
  hatchedDate  : batchDatesMap[name]?.hatchedDate  || "—",
  scheduledDate: batchDatesMap[name]?.scheduledDate || "—",
}));

// const allBatchesExport = allBatchesSorted.map(([name, d], i) => ({
//   batch   : name || `Batch ${i + 1}`,
//   set     : d.set,
//   fertile : d.fertile,
//   hatched : d.hatched,
//   hatchPct: d.set > 0 ? parseFloat(((d.hatched / d.set) * 100).toFixed(1)) : 0,
// }));

  // const hatchWeeklyTrend = Object.entries(hatchBatchMap)
  //   .sort((a, b) => String(a[0]).localeCompare(String(b[0]))).slice(-4)
  //   .map(([, d], i) => ({ w: `Batch ${i + 1}`, set: d.set, fertile: d.fertile, hatched: d.hatched }));

  // const hatchabilityWeek = eggsSetWeek > 0 ? parseFloat(((goodChicksWeek / eggsSetWeek) * 100).toFixed(1)) : 0;
  // const hatchabilityMonth = eggsSetMonth > 0 ? parseFloat(((goodChicksMonth / eggsSetMonth) * 100).toFixed(1)) : 0;
  // const hatchabilityYear = eggsSetYear > 0 ? parseFloat(((goodChicksYear / eggsSetYear) * 100).toFixed(1)) : 0;

  function trueHatchForRange(rangeStart, rangeEnd) {
  let setSum = 0, hatchedSum = 0;
  Object.values(hatchBatchMap).forEach((b) => {
    if (!b.hatchedDateRaw || b.hatched <= 0 || b.set <= 0) return;
    if (b.hatchedDateRaw >= rangeStart && b.hatchedDateRaw <= rangeEnd) {
      setSum += b.set;
      hatchedSum += b.hatched;
    }
  });
  return setSum > 0 ? parseFloat(((hatchedSum / setSum) * 100).toFixed(1)) : 0;
}

const hatchabilityWeek  = trueHatchForRange(weekStart, weekEnd);
const hatchabilityMonth = trueHatchForRange(monthStart, monthEnd);
const hatchabilityYear  = trueHatchForRange(yearStart, yearEnd);

  const fertilityRate = eggsSetMonth > 0 ? parseFloat(((fertileEggsMonth / eggsSetMonth) * 100).toFixed(1)) : 0;

  /* ─── 5. STORAGE DETAILS ─────────────────────────────────────────── */
  const storageDetails = await zohoGetAll("Storage_Details_SF_Report");
  console.group("✅ [5] STORAGE DETAILS");
  console.log("Total records:", storageDetails.length);
  console.groupEnd();

  const breedStorageEggs = {};
  let totalStorageEggs = 0;

  storageDetails.forEach((s) => {
    const eggRows = s.Eggs_Details || s.Storage_SF || s.Egg_Storage_Details;
    if (Array.isArray(eggRows) && eggRows.length > 0) {
      eggRows.forEach((row) => {
        const breed = displayVal(
          row["Birds.Name"] || row["Bird_Type.Name"] || row.Birds || row.Bird_Type || row.Breed_Name || row.Breed || ""
        ).trim();
        const avail = num(row.Available_Eggs ?? row.Available ?? 0);
        if (!breed) return;
        breedStorageEggs[breed] = (breedStorageEggs[breed] || 0) + avail;
        totalStorageEggs += avail;
      });
    } else {
      const breed = displayVal(
        s["Birds.Name"] || s["Bird_Type.Name"] || s["Breed.Name"] || s.Birds ||
        s.Bird_Type || s.Breed_Name || s.Breed || s.Bird || ""
      ).trim();
      const avail = num(s.Available_Eggs ?? s.Available ?? 0);
      if (!breed) return;
      breedStorageEggs[breed] = (breedStorageEggs[breed] || 0) + avail;
      totalStorageEggs += avail;
    }
  });
  console.log("[WAFAD] Storage eggs by breed:", breedStorageEggs);




  /* ─── 6. DOC — derived from hatchery good chicks (year filtered) ─── */
// const breedDOC = {};
// let totalDOC = 0;

// hatchSF.forEach((h) => {
//   const status = (fv(h, "Status") || "").toLowerCase().trim();
//   if (status !== "hatched") return;
//
//   // Year filter — only count chicks hatched within selected year
//   const hatchedDate = parseZohoDate(fv(h, "Hatched_Date"));
//   if (!hatchedDate || hatchedDate < yearStart || hatchedDate > yearEnd) return;
//
//   const eggRows = h.Eggs_Details;
//   if (!Array.isArray(eggRows) || eggRows.length === 0) return;
//
//   eggRows.forEach((row) => {
//     const breed = displayVal(
//       row.Birds || row["Birds.Name"] || row.Breed_Name1 || ""
//     ).trim() || "Unknown";
//     const good = num(row.Good_Chicks ?? 0);
//     breedDOC[breed] = (breedDOC[breed] || 0) + good;
//     totalDOC += good;
//   });
// });

// console.log("[WAFAD] DOC by breed (from hatchery, year filtered):", breedDOC);
// console.log("[WAFAD] Total DOC (from hatchery, year filtered):", totalDOC);


  /* ─── 6. DAY OLD CHICKS ──────────────────────────────────────────── */
const docRecords = await zohoGetAll("Day_Old_Chicks_Report");
console.group("✅ [6] DAY OLD CHICKS");
console.log("Total records:", docRecords.length);
console.groupEnd();

const breedDOC = {};
let totalDOC = 0;
docRecords.forEach((d) => {
  const breed = displayVal(d.Breed_Name || d["Breed_Name.Breed_Name"] || "") || "Unknown";
  const avail = num(d.Available_Chicks ?? d.Available_Qty ?? 0);
  breedDOC[breed] = (breedDOC[breed] || 0) + avail;
  totalDOC += avail;
});
console.log("[WAFAD] DOC by breed (from Day_Old_Chicks_Report):", breedDOC);
console.log("[WAFAD] Total DOC available:", totalDOC);

  /* ─── 6. DAY OLD CHICKS ──────────────────────────────────────────── */
  // const docRecords = await zohoGetAll("Day_Old_Chicks_Report");
  // console.group("✅ [6] DAY OLD CHICKS");
  // console.log("Total records:", docRecords.length);
  // console.groupEnd();
  //
  // const breedDOC = {};
  // let totalDOC = 0;
  // docRecords.forEach((d) => {
  //   const breed = displayVal(d.Breed_Name || d["Breed_Name.Breed_Name"] || "") || "Unknown";
  //   const avail = num(d.Available_Chicks ?? d.Available_Qty ?? 0);
  //   breedDOC[breed] = (breedDOC[breed] || 0) + avail;
  //   totalDOC += avail;
  // });
  // console.log("[WAFAD] DOC by breed:", breedDOC);

  /* ─── 7. INVOICES ───────────────────────────────────────────────── */
  const invoices = await zohoGetAll("All_Invoices");
  console.group("✅ [7] INVOICES");
  console.log("Total records:", invoices.length);
  console.log("Statuses:", [...new Set(invoices.map((i) => fv(i, "Status") || "null"))]);
  console.groupEnd();

  // Revenue will be accumulated here; C4U paid orders added in section 14
  let revenueWeek = 0, revenueMonth = 0, revenueYear = 0;
  let receivablesWeek = 0, receivablesMonth = 0, receivablesTotal = 0;
  const custMap = {}, productRevenueMap = {};
  let sellingPriceEggWeekSum = 0, sellingPriceEggWeekQty = 0;


  // ─── ENHANCED INVOICE PROCESSING WITH MONTHLY AGGREGATION ───

  invoices.forEach((inv) => {
    const rawDate = fv(inv, "Date_field") || fv(inv, "Invoice_Date") || fv(inv, "Date") || fv(inv, "Added_Time");
    const recDate = parseZohoDate(rawDate);
    const amount  = num(fv(inv, "Total_Amount"));
    const customer = displayVal(
      fv(inv, "Customer_Name") || fv(inv, "Contact_Name") || fv(inv, "Account_Name") || ""
    );
    const prodName = displayVal(fv(inv, "Product_Name") || "");

    const rawStatus = fv(inv, "Status") || "";
    const status  = (typeof rawStatus === "string" ? rawStatus : displayVal(rawStatus)).toLowerCase().trim();
    const isPaid   = status === "paid" || status === "invoiced";
    const isUnpaid = status === "draft" || status === "submitted" || status === "viewed" || status === "open";

    // if (isPaid && recDate && amount > 0) {
    //   const mKey = mkMonthKey(recDate);
    //   if (mKey) {
    //     ensureMonth(monthlyFinData, mKey, FIN_TPL);
    //     monthlyFinData[mKey].revenue += amount;
    //   }
    //   if (recDate >= yearStart  && recDate <= yearEnd)  revenueYear  += amount;
    //   if (recDate >= monthStart && recDate <= monthEnd) revenueMonth += amount;
    //   if (recDate >= weekStart  && recDate <= weekEnd)  revenueWeek  += amount;
    // }

    if (isUnpaid && amount > 0) {
      receivablesTotal += amount;
      if (recDate && recDate >= monthStart && recDate <= monthEnd) receivablesMonth += amount;
      if (recDate && recDate >= weekStart  && recDate <= weekEnd)  receivablesWeek  += amount;
    }

    if (status !== "void" && status !== "draft" && amount > 0 && customer)
      custMap[customer] = (custMap[customer] || 0) + amount;

    if (prodName && amount > 0)
      productRevenueMap[prodName] = (productRevenueMap[prodName] || 0) + amount;

    if (isPaid && recDate) {
      const prodLines = inv.Product_Details_SF || inv.Line_Items || [];
      if (Array.isArray(prodLines)) {
        prodLines.forEach((p) => {
          const pName  = displayVal(p.Product_Name || "").toUpperCase();
          const pUnit  = displayVal(p.Unit || p.Unit_Details || "").toLowerCase();
          const pPrice = num(fv(p, "Unit_Price") || fv(p, "Rate") || 0);
          const pQty   = num(fv(p, "Quantity") || 0);
          const isEgg  = pUnit.includes("egg") || pName.includes("EGG") || pName.includes("HATCHING");
          if (isEgg && pPrice > 0 && pQty > 0) {
            sellingPriceEggWeekSum += pPrice * pQty;
            sellingPriceEggWeekQty += pQty;
          }
        });
      }
    }
  }); // ← single correct close


const sellingPriceHatchingEgg = sellingPriceEggWeekQty > 0
  ? Math.round(sellingPriceEggWeekSum / sellingPriceEggWeekQty) : 0;

const top20Customers = Object.entries(custMap)
  .sort((a, b) => b[1] - a[1]).slice(0, 20)
  .map(([name, revenue]) => ({ name, qty: revenue }));


  function resolveBreedFromProductName(nameUp) {
  if (!nameUp) return null;
  const n = nameUp.toUpperCase().replace(/[\s\-_]/g, "");

  // Build a normalized lookup of real breed names from breedSet (source of truth)
  for (const b of breedSet) {
    const bNorm = b.toUpperCase().replace(/[\s\-_]/g, "");
    if (n.includes(bNorm) || bNorm.includes(n)) return b;
  }

  const tryMatch = (keyword) => {
    const candidate = Array.from(breedSet).find(b => b.toUpperCase().replace(/[\s\-_]/g, "").includes(keyword));
    return candidate || null;
  };

  if (n.includes("EFFICIENCY")) return tryMatch("EFFICIENCY");
  if (n.includes("REDBRO")) return tryMatch("REDBRO");
  if (n.includes("NOVOW")) return tryMatch("NOVOW");
  if (n.includes("NOVOB")) return tryMatch("NOVOB");

  // ── Specific Granger variants MUST be checked before the generic GRANGER fallback ──
  if (n.includes("GRANGERPLUS")) return tryMatch("REDBRO"); // Grangers Plus == Redbro
  if (n.includes("GRANGERGOLD")) return tryMatch("JA57");
  if (n.includes("GRANGERTR"))   return tryMatch("JA57");

  // Generic fallback — only reached if none of the specific variants matched
  if (n.includes("JA57") || n.includes("GRANGER") || n.includes("COCK")) return tryMatch("JA57");

  return null;
}

  /* ─── helper: resolve canonical breed name from a product/line name ──── */
// function resolveBreedFromProductName(nameUp) {
//   if (!nameUp) return null;
//   const n = nameUp.toUpperCase();
//   if (n.includes("EFFICIENCY")) return "Efficiency Plus";
//   if (n.includes("REDBRO")) return "Redbro";
//   if (n.includes("NOVO W") || n.includes("NOVOWHITE")) return "Novo White";
//   if (n.includes("NOVO B") || n.includes("NOVOBROWN")) return "Novo Brown";
//     if (n.includes("JA57") || n.includes("JA57KI") || n.includes("GRANGER") || n.includes("COCK")) return "Ja57Ki";
//   // generic fallbacks matched against breedSet, in case product naming differs slightly
//   for (const b of breedSet) {
//     if (n.includes(b.toUpperCase())) return b;
//   }
//   return null;
// }

/* ─── 8. SALES ORDERS ───────────────────────────────────────────── */
const productPriceMap = {}; // populated in section 11; declared here for use in sections 8+

const CONFIRMED_STATUSES = new Set([
  "invoiced", "closed", "fulfilled", "confirmed",
  "delivered", "completed", "approved", "dispatched",
  "Invoiced", "Delivered", "Completed", "Approved",
]);
const PENDING_STATUSES = new Set([
  "draft", "open", "pending", "submitted", "Draft",
  "new", "in progress", "processing", "null",
  "Pending", "New", "Open",
]);

const salesOrders = await zohoGetAll("Sales_Order_Report");
console.group("✅ [8] SALES ORDERS");
console.log("Total records:", salesOrders.length);
console.log("Statuses:", [...new Set(salesOrders.map((o) => fv(o, "Status") || "null"))]);
console.groupEnd();

let confirmedOrdersWeek = 0, confirmedOrdersMonth = 0, confirmedOrdersYear = 0;
let pendingOrdersWeek = 0, pendingOrdersMonth = 0;
let confirmedChicksWeek = 0, confirmedChicksMonth = 0, confirmedChicksYear = 0;
let pendingChicksWeek = 0, pendingChicksMonth = 0;
const regionMap = {};
const breedRevenueMonth = {}, breedRevenueYear = {};
const c4uRegionMap = {};

let sellingPriceYTDSum = 0, sellingPriceYTDQty = 0;
let sellingPriceWeekSum = 0, sellingPriceWeekQty = 0;
let sellingPriceLastWeekSum = 0, sellingPriceLastWeekQty = 0;

let maxChickPriceWeek = 0;
let maxChickPriceMonth = 0;
let maxChickPriceYear = 0;


salesOrders.forEach((o) => {
  const statusRaw = fv(o, "Status") || fv(o, "Order_Status") || "";
  const status = (typeof statusRaw === "string" ? statusRaw : displayVal(statusRaw)).toLowerCase().trim();
  const rawDate = fv(o, "Date_field") || fv(o, "Order_Date") || fv(o, "Date") || fv(o, "Added_Time");
  const recDate = parseZohoDate(rawDate);

  const productLines = o.Product_Details_SF || o.Product_Details || o.Line_Items || [];
  let orderQty = 0, chickQty = 0;

  if (Array.isArray(productLines) && productLines.length > 0) {
    productLines.forEach((p) => {
      const qty = num(fv(p, "Quantity") || fv(p, "Qty") || fv(p, "Total_Quantity") || 0);
      const unit = (displayVal(p.Unit_Details || p.Unit || "") || "").toLowerCase();
      const prodName = (displayVal(p.Product_Name || p.Product || "") || "").toLowerCase();
      orderQty += qty;
      if (unit.includes("chick") || unit === "chicks" || prodName.includes("chick")) chickQty += qty;
    });
  }
  if (orderQty === 0) {
    orderQty = num(fv(o, "Total_Quantity") || fv(o, "Quantity") || fv(o, "Total_Qty") || 0);
    chickQty = orderQty;
  }

  // Chick selling price accumulation (single clean block — no duplicates)
  if (CONFIRMED_STATUSES.has(status) && Array.isArray(productLines)) {
    productLines.forEach((p) => {
      const pQty = num(fv(p, "Quantity") || 0);
      if (pQty === 0) return;
      const pNameUp = displayVal(p.Product_Name || p.Product || "").trim().toUpperCase();
      const unitRaw = (displayVal(p.Unit_Details || p.Unit || "") || "").toLowerCase();

      let linePrice = num(p.Rate || fv(p, "Unit_Price") || 0);
      if (linePrice === 0 && pNameUp && productPriceMap[pNameUp]?.sellingPrice > 0)
        linePrice = productPriceMap[pNameUp].sellingPrice;
      if (linePrice === 0) return;

      const isChickLine =
        unitRaw.includes("chick") || unitRaw === "pcs" ||
        pNameUp.includes("DOC") || pNameUp.includes("GRANGER") ||
        pNameUp.includes("SASSO") || pNameUp.includes("NOVO") ||
        pNameUp.includes("JA57") || pNameUp.includes("BROILER") ||
        pNameUp.includes("LAYER") || pNameUp.includes("REDBRO") ||
        pNameUp.includes("EFFICIENCY") || pNameUp.includes("COCK");
      if (!isChickLine) return;

if (recDate && recDate >= weekStart && recDate <= weekEnd) { sellingPriceWeekSum += linePrice * pQty; sellingPriceWeekQty += pQty; maxChickPriceWeek = Math.max(maxChickPriceWeek, linePrice); }
      if (recDate && recDate >= lastWeekStart && recDate <= lastWeekEnd) { sellingPriceLastWeekSum += linePrice * pQty; sellingPriceLastWeekQty += pQty; }
      if (recDate && recDate >= yearStart && recDate <= yearEnd) { sellingPriceYTDSum += linePrice * pQty; sellingPriceYTDQty += pQty; }
      if (recDate && recDate >= monthStart && recDate <= monthEnd) {
        maxChickPriceMonth = Math.max(maxChickPriceMonth, linePrice);
      }
      if (recDate && recDate >= yearStart && recDate <= yearEnd) {
        maxChickPriceYear = Math.max(maxChickPriceYear, linePrice);
      }
        // ── Breed revenue accumulation (fixes Breed Profit Margins showing 0) ──
const lineRevenue = linePrice * pQty;
const breedLabelSO = resolveBreedFromProductName(pNameUp);
if (breedLabelSO) {
  if (recDate && recDate >= monthStart && recDate <= monthEnd) {
    breedRevenueMonth[breedLabelSO] = (breedRevenueMonth[breedLabelSO] || 0) + lineRevenue;
  }
  if (recDate && recDate >= yearStart && recDate <= yearEnd) {
    breedRevenueYear[breedLabelSO] = (breedRevenueYear[breedLabelSO] || 0) + lineRevenue;
  }
}

      // ── Breed revenue accumulation (fixes Breed Profit Margins showing 0) ──
      // const lineRevenue = linePrice * pQty;
      // const breedLabelSO = pNameUp || "Unknown";
      // if (recDate && recDate >= monthStart && recDate <= monthEnd) {
      //   breedRevenueMonth[breedLabelSO] = (breedRevenueMonth[breedLabelSO] || 0) + lineRevenue;
      // }
      // if (recDate && recDate >= yearStart && recDate <= yearEnd) {
      //   breedRevenueYear[breedLabelSO] = (breedRevenueYear[breedLabelSO] || 0) + lineRevenue;
      // }
    });
  }

  const qty = orderQty || 1;
  const region = displayVal(o.Region || o["Customer.Region"] || "") || "Other";
  regionMap[region] = (regionMap[region] || 0) + qty;

  // if (CONFIRMED_STATUSES.has(status)) {
  //   if (recDate && recDate >= yearStart && recDate <= yearEnd) { confirmedOrdersYear += qty; confirmedChicksYear += chickQty; }
  //   if (recDate && recDate >= monthStart && recDate <= monthEnd) { confirmedOrdersMonth += qty; confirmedChicksMonth += chickQty; }
  //   if (recDate && recDate >= weekStart && recDate <= weekEnd) { confirmedOrdersWeek += qty; confirmedChicksWeek += chickQty; }
 if (CONFIRMED_STATUSES.has(status)) {
  // ── Revenue from confirmed sales orders ──
  const soAmount = num(fv(o, "Total_Amount") || fv(o, "Grand_Total") || 0);
  if (recDate && recDate >= yearStart && recDate <= yearEnd) {
    confirmedOrdersYear += qty;
    confirmedChicksYear += chickQty;
    if (soAmount > 0) {
      revenueYear += soAmount;
      const mKey = mkMonthKey(recDate);
      if (mKey) {
        ensureMonth(monthlyFinData, mKey, FIN_TPL);
        monthlyFinData[mKey].revenue += soAmount;
      }
    }
  }
  if (recDate && recDate >= monthStart && recDate <= monthEnd) {
    confirmedOrdersMonth += qty;
    confirmedChicksMonth += chickQty;
    if (soAmount > 0) revenueMonth += soAmount;
  }
  if (recDate && recDate >= weekStart && recDate <= weekEnd) {
    confirmedOrdersWeek += qty;
    confirmedChicksWeek += chickQty;
    if (soAmount > 0) revenueWeek += soAmount;
  } 
  } else if (PENDING_STATUSES.has(status)) {
    if (recDate && recDate >= monthStart && recDate <= monthEnd) { pendingOrdersMonth += qty; pendingChicksMonth += chickQty; }
    if (recDate && recDate >= weekStart && recDate <= weekEnd) { pendingOrdersWeek += qty; pendingChicksWeek += chickQty; }
  }
});

/* ─── 9. PAYMENTS ───────────────────────────────────────────────── */
const payments = await zohoGetAll("Payment_Received_Report");
console.group("✅ [9] PAYMENTS");
console.log("Total records:", payments.length);
console.groupEnd();

let cashReceivedWeek = 0, cashReceivedMonth = 0, cashReceivedYear = 0;
payments.forEach((p) => {
  const amt = num(fv(p, "Amount_Received"));
  const rawDate = fv(p, "Payment_Date") || fv(p, "Date") || fv(p, "Added_Time");
  const recDate = parseZohoDate(rawDate);
  const mKey = mkMonthKey(recDate);
  if (mKey) { ensureMonth(monthlyFinData, mKey, FIN_TPL); monthlyFinData[mKey].cashIn += amt; }
  if (recDate && recDate >= yearStart && recDate <= yearEnd) cashReceivedYear += amt;
  if (recDate && recDate >= monthStart && recDate <= monthEnd) cashReceivedMonth += amt;
  if (recDate && recDate >= weekStart && recDate <= weekEnd) cashReceivedWeek += amt;
});

/* ─── SECTION 10 (ENHANCED): OPERATIONAL REQUESTS AS EXPENDITURE ─── */
const opRequests = await zohoGetAll("Detailed_Operational_Request_Report");

let opExpenseWeek = 0, opExpenseMonth = 0, opExpenseYear = 0;
let opExpensePaidWeek = 0, opExpensePaidMonth = 0;
let pendingPaymentsCount = 0, approvedNotPaidCount = 0;
const opExpenseByCategoryMonth = {};
const opExpenseByFarmMonth = {};
const recentOpRequests = [];

opRequests.forEach((r) => {
  const status = (fv(r, "Status") || "").toLowerCase().trim();
  const finStatus = (fv(r, "Finance_Status") || "").toLowerCase().trim();
  const payStatus = (fv(r, "Payment_Status") || "").toLowerCase().trim();
  const mainCat = displayVal(r.Main_Category || "") || "Other";
  const farmRef = displayVal(r.Farm || "") || null;

  const rawDate = fv(r, "Requested_Date_And_Time") ||
    fv(r, "Payment_Date") ||
    fv(r, "Added_Time");
  const recDate = parseZohoDate(rawDate);

  // Use Actual_Total_Cost as the real expenditure
  const actualCost = num(fv(r, "Actual_Total_Cost") || 0);
  const weeklyAmortised = num(fv(r, "Weekly_Amortised_Cost") || 0);
  const costToUse = actualCost > 0 ? actualCost : weeklyAmortised;

  const isPosted = finStatus === "posted";
  const isFinApproved = finStatus === "approved" || isPosted;
  const isPaid = payStatus === "paid";
  const isApproved = status === "approved" || isFinApproved;

  // Expenditure: only count finance-approved/posted records
  if (isFinApproved && costToUse > 0 && recDate) {
    if (recDate >= yearStart && recDate <= yearEnd) opExpenseYear += costToUse;
    if (recDate >= monthStart && recDate <= monthEnd) {
      opExpenseMonth += costToUse;
      opExpenseByCategoryMonth[mainCat] = (opExpenseByCategoryMonth[mainCat] || 0) + costToUse;
      if (farmRef) { opExpenseByFarmMonth[farmRef] = (opExpenseByFarmMonth[farmRef] || 0) + costToUse; }
    }
    if (recDate >= weekStart && recDate <= weekEnd) opExpenseWeek += costToUse;
    if (isPaid) {
      if (recDate >= monthStart && recDate <= monthEnd) opExpensePaidMonth += costToUse;
      if (recDate >= weekStart && recDate <= weekEnd) opExpensePaidWeek += costToUse;
    }
  }

  if (!isPaid && isApproved) approvedNotPaidCount++;
  if (status === "pending" || status === "requested" || status === "new" ||
    status === "draft") pendingPaymentsCount++;

  // Recent requests list (last 15 for display)
  if (recentOpRequests.length < 15) {
    recentOpRequests.push({
      requestId: fv(r, "Request_ID") || "",
      requestType: fv(r, "Request_Type") || "",
      mainCategory: mainCat,
      status,
      financeStatus: finStatus,
      paymentStatus: payStatus,
      actualCost,
      weeklyAmortised,
      date: rawDate || "",
      farm: farmRef || "—",
      urgency: fv(r, "Urgency") || "Normal",
      description: fv(r, "Item_Description") || fv(r, "Product_Name") || "",
    });
  }
});

console.log("[WAFAD] Op Requests Expenditure → Month:", opExpenseMonth,
  "| Week:", opExpenseWeek, "| Year:", opExpenseYear);

/* ─── 11. PRODUCTS & STOCK ──────────────────────────────────────── */
const products = await zohoGetAll("Product_Details_Report");
console.group("✅ [11] PRODUCTS / STOCK");
console.log("Total records:", products.length);
console.log("Product sample record", products[0])
console.groupEnd();

let totalStockValue = 0;
const criticalStock = [], productStockList = [];
let sellingPriceChickSum = 0, sellingPriceChickCount = 0;
let sellingPriceEggSum = 0, sellingPriceEggCount = 0;
let feedPricePerKgSum = 0, feedPricePerKgCount = 0;
let c4uFeedRevenueMonth = 0, c4uFeedQtyMonth = 0;

let hatchingEggCatPrice = 0;

products.forEach((prod) => {
  const name = (fv(prod, "Product_Name") || "").trim();
  const docName = displayVal(prod.DOC_Name || "").trim();
  const minStock = num(fv(prod, "Min_Stock"));
  const totalAvail = num(fv(prod, "Total_Available_Stock"));
  const sellingPrice = num(fv(prod, "Selling_Price") || 0);
  const status = (fv(prod, "Status") || "").toLowerCase();
  const unit = displayVal(prod.Unit || "").toLowerCase().trim();
  const categoryName = displayVal(prod.Category_Name || "").toLowerCase().trim();

  if (name.toUpperCase().includes("HATCHING EGG")
    && sellingPrice > 0) {
    hatchingEggCatPrice = sellingPrice;
  }


  // C4U product flag
  const c4uFlag = displayVal(prod.Chicken4U_Product || "").toLowerCase();
  if (c4uFlag === "yes" || c4uFlag === "true") {
    const docKey = docName.toUpperCase();
    if (docKey) productPriceMap[docKey] = { sellingPrice, unit, category: categoryName };
  }

  // Feed price per kg from catalogue
  if (isFeedProduct(name, categoryName) && sellingPrice > 0) {
    let pricePerKg = 0;
    if (unit === "kg") pricePerKg = sellingPrice;
    else if (unit.includes("50kg") || unit === "50 kg bag") pricePerKg = sellingPrice / 50;
    else if (unit.includes("25kg") || unit === "25 kg bag") pricePerKg = sellingPrice / 25;
    else pricePerKg = sellingPrice / 50;
    if (pricePerKg > 5) { feedPricePerKgSum += pricePerKg; feedPricePerKgCount++; }
  }

  // Price lookup map
  [name.toUpperCase(), docName.toUpperCase()].filter(Boolean).forEach((k) => {
    if (k) productPriceMap[k] = { sellingPrice, unit, category: categoryName };
  });

  totalStockValue += totalAvail;

  if (sellingPrice > 0) {
    const isChickUnit = unit === "chicks" || unit === "chick";
    const isChickCat = categoryName.includes("day old") || categoryName.includes("chick");
    const isEggUnit = unit === "egg" || unit === "eggs";
    const isEggCat = categoryName.includes("egg");
    if (isChickUnit || isChickCat) { sellingPriceChickSum += sellingPrice; sellingPriceChickCount++; }
    else if (isEggUnit || isEggCat) { sellingPriceEggSum += sellingPrice; sellingPriceEggCount++; }
  }

  if (status !== "inactive") {
    productStockList.push({ name: name || "—", stock: totalAvail, min: minStock, sellingPrice, unit });
    if (totalAvail <= minStock && minStock > 0)
      criticalStock.push({ item: name || "—", status: totalAvail === 0 ? "Critical" : "Low", stock: totalAvail });
  }
});

// Average catalogue selling prices (now properly defined before use)
const avgSellingPriceChick = sellingPriceChickCount > 0 ? Math.round(sellingPriceChickSum / sellingPriceChickCount) : 0;
const avgSellingPriceEgg = sellingPriceEggCount > 0 ? Math.round(sellingPriceEggSum / sellingPriceEggCount) : 0;
const avgFeedPriceFromProducts = feedPricePerKgCount > 0 ? Math.round(feedPricePerKgSum / feedPricePerKgCount) : 0;

/* ─── 14b. TARGET CONFIG ─────────────────────────────────────────── */
const targetConfig = await zohoGetAll("Target_Config_Report");
console.group("✅ [14b] TARGET CONFIG");
console.log("Total records:", targetConfig.length);
console.groupEnd();

const targets = {};
targetConfig.forEach((t) => {
  const active = fv(t, "Active");
  const isActive = active === true || active === "true" || active === 1 || active === "1" || active == null;
  if (!isActive) return;
  const key = (fv(t, "Metric_Name") || fv(t, "Target_Name") || fv(t, "Name") || "").trim();
  const val = num(fv(t, "Target_Value") || fv(t, "Value") || 0);
  const period = (fv(t, "Period") || "week").toLowerCase().trim();
  if (key) targets[`${key}_${period}`] = val;
});
console.log("[WAFAD] Loaded targets:", targets);

const getTarget = (metric, period) => targets[`${metric}_${period}`] ?? 0;



  const satoGrangerCommission  = getTarget("sato_granger_commission",  "month") || 0.30;
const satoLayerCommission    = getTarget("sato_layer_commission",    "month") || 0.20;
const satoBroilerCommission  = getTarget("sato_broiler_commission",  "month") || 0.20;
const satoLayerTarget        = getTarget("sato_layer_target",        "month") || 0;
const satoBroilerTarget      = getTarget("sato_broiler_target",      "month") || 0;

  console.log("[WAFAD] SATO Commission Config →",
  "Granger/chick: GHC", satoGrangerCommission,
  "| Layer/chick: GHC", satoLayerCommission,
  "| Broiler/chick: GHC", satoBroilerCommission,
  );

// ── Target Config stores WEEKLY expense values (period = "week") ──

// ── Target Config stores WEEKLY expense values (period = "week") ──
const chicken4uDeptExpenseWeek  = getTarget("chicken4u", "week")           || 0;
const hatcheryDeptExpenseWeek   = getTarget("hatchery", "week")            || 0;
const breederFarmDeptExpenseWeek= getTarget("breeder_farm_expense", "week")|| 0;

// ── Derive monthly (× 4.33) and yearly (× 52) ──
const chicken4uDeptExpenseMonth  = round100(chicken4uDeptExpenseWeek  * 4.33);
const hatcheryDeptExpenseMonth   = round100(hatcheryDeptExpenseWeek   * 4.33);
const breederFarmDeptExpenseMonth= round100(breederFarmDeptExpenseWeek* 4.33);

const chicken4uDeptExpenseYear   = round100(chicken4uDeptExpenseWeek  * 52);
const hatcheryDeptExpenseYear    = round100(hatcheryDeptExpenseWeek   * 52);
const breederFarmDeptExpenseYear = round100(breederFarmDeptExpenseWeek* 52);

// ── Total department expense ──
const deptExpenseTotalWeek  = round100(chicken4uDeptExpenseWeek  + hatcheryDeptExpenseWeek  + breederFarmDeptExpenseWeek);
const deptExpenseTotalMonth = round100(chicken4uDeptExpenseMonth + hatcheryDeptExpenseMonth + breederFarmDeptExpenseMonth);
const deptExpenseTotalYear  = round100(chicken4uDeptExpenseYear  + hatcheryDeptExpenseYear  + breederFarmDeptExpenseYear);

console.log("[WAFAD] Dept expenses (corrected) →",
  "C4U/mo:", chicken4uDeptExpenseMonth,
  "| Hatchery/mo:", hatcheryDeptExpenseMonth,
  "| Breeder/mo:", breederFarmDeptExpenseMonth,
  "| Total/mo:", deptExpenseTotalMonth,
);

console.log("[WAFAD] Dept expenses → C4U:", chicken4uDeptExpenseMonth,
  "| Hatchery:", hatcheryDeptExpenseMonth,
  "| Breeder:", breederFarmDeptExpenseMonth,
  "| Total/mo:", deptExpenseTotalMonth);


/* ─── Feed cost reconciliation using Feed_Details subform ───────── */
let feedCostFromSubformMonth = 0, feedKgFromSubformMonth = 0;
let feedCostFromSubformWeek = 0, feedKgFromSubformWeek = 0;
let feedCostFromSubformYear = 0, feedKgFromSubformYear = 0;
let feedCostMaleMonth = 0, feedCostFemaleMonth = 0;

console.group("🔍 [Feed Subform Cost Reconciliation]");
console.log("Total feed usage rows:", feedUsageRows.length);
console.log("productPriceMap keys sample:", Object.keys(productPriceMap).slice(0, 10));

feedUsageRows.forEach(({ prodName, consumedKg, gender, recDate }) => {
  if (!recDate) return;

  let priceEntry = productPriceMap[prodName];
  if (!priceEntry) {
    const matchKey = Object.keys(productPriceMap).find((k) => k.includes(prodName) || prodName.includes(k));
    if (matchKey) priceEntry = productPriceMap[matchKey];
  }
  if (!priceEntry) {
    if (prodName.includes("COCK")) priceEntry = productPriceMap["COCK MASH"];
    else if (prodName.includes("LAYER")) priceEntry = productPriceMap["LAYER MASH"];
  }
  if (!priceEntry?.sellingPrice) { console.warn("[WAFAD] No price for feed product:", prodName); return; }

  const sp = num(priceEntry.sellingPrice);
  const unit = (priceEntry.unit || "").toLowerCase();
  let pricePerKg = 0;
  if (unit === "kg") pricePerKg = sp;
  else if (unit.includes("50") || unit === "bag" || unit === "50kg bag") pricePerKg = sp / 50;
  else if (unit.includes("25")) pricePerKg = sp / 25;
  else if (sp > 0) pricePerKg = sp / 50;
  if (pricePerKg <= 0 || consumedKg <= 0) return;

  const lineCost = pricePerKg * consumedKg;
  if (recDate >= yearStart && recDate <= yearEnd) { feedCostFromSubformYear += lineCost; feedKgFromSubformYear += consumedKg; }
  if (recDate >= monthStart && recDate <= monthEnd) {
    feedCostFromSubformMonth += lineCost; feedKgFromSubformMonth += consumedKg;
    if (gender === "male") feedCostMaleMonth += lineCost;
    else if (gender === "female") feedCostFemaleMonth += lineCost;
  }
  if (recDate >= weekStart && recDate <= weekEnd) { feedCostFromSubformWeek += lineCost; feedKgFromSubformWeek += consumedKg; }
  // if (recDate >= yearStart) { feedCostFromSubformYear += lineCost; feedKgFromSubformYear += consumedKg; }
  // if (recDate >= monthStart) {
  //   feedCostFromSubformMonth += lineCost; feedKgFromSubformMonth += consumedKg;
  //   if (gender === "male") feedCostMaleMonth += lineCost;
  //   else if (gender === "female") feedCostFemaleMonth += lineCost;
  // }
  // if (recDate >= weekStart) { feedCostFromSubformWeek += lineCost; feedKgFromSubformWeek += consumedKg; }
});

console.log("feedCostFromSubformMonth:", feedCostFromSubformMonth, "| feedKgFromSubformMonth:", feedKgFromSubformMonth);
console.log("feedCostFromSubformWeek:", feedCostFromSubformWeek, "| Year:", feedCostFromSubformYear);
console.groupEnd();

const costPerFeedKgFromSubform = feedKgFromSubformMonth > 0
  ? Math.round(feedCostFromSubformMonth / feedKgFromSubformMonth) : 0;

/* ─── COMBINED EXPENDITURE (Feed Deliveries + Op Requests) ─── */

/* ─── COMBINED EXPENDITURE (Feed + OpRequests + Dept Workers) ─── */

// Feed delivery cost (actual invoiced)
const feedCostWeek = feedDeliveryCostWeek > 0 ? feedDeliveryCostWeek : feedCostFromSubformWeek;
const feedCostMonth = feedDeliveryCostMonth > 0 ? feedDeliveryCostMonth : feedCostFromSubformMonth;
const feedCostYear = feedDeliveryCostYear > 0 ? feedDeliveryCostYear : feedCostFromSubformYear;

// Grand total = feed + operational requests + department worker expenses

// Grand total = feed + operational requests + department worker expenses

const totalExpenseWeek  = round100(feedCostWeek  + opExpenseWeek  + deptExpenseTotalWeek);
const totalExpenseMonth = round100(feedCostMonth + opExpenseMonth + deptExpenseTotalMonth);
const totalExpenseYear  = round100(feedCostYear  + opExpenseYear  + deptExpenseTotalYear);


// Aliases (kept for backward compat with downstream references)
const feedExpenseWeek  = totalExpenseWeek;
const feedExpenseMonth = totalExpenseMonth;
const feedExpenseYear  = totalExpenseYear;

console.log("[WAFAD] TOTAL expenses →",
  "Week:", totalExpenseWeek,
  "| Month:", totalExpenseMonth,
  "| Year:", totalExpenseYear,
  "| Feed/mo:", feedCostMonth,
  "| OpReq/mo:", opExpenseMonth,
  "| Dept/mo:", deptExpenseTotalMonth
);


// // Priority: Feed Deliveries (actual invoiced cost) > Op Requests > Subform estimate

// ── Cost per kg: weighted average from Feed_Cost_Per_Kg field ──
let weightedCostKgSum = 0, weightedKgTotal = 0;
feedDeliveries.forEach((d) => {
  if ((fv(d, "Status") || "").toLowerCase() !== "delivered") return;
  const rawDate = fv(d, "Delivery_Date") || fv(d, "Added_Time");
  const recDate = parseZohoDate(rawDate);
  if (!recDate || recDate < monthStart || recDate > monthEnd) return;
  // if (!recDate || recDate < monthStart) return;
  const cpkg = num(d.Feed_Cost_Per_Kg || 0);
  const qty = num(d.Quantity_delivered_kg || 0);
  if (cpkg > 0 && qty > 0) {
    weightedCostKgSum += cpkg * qty;
    weightedKgTotal += qty;
  }
});
const costPerFeedKgFromDeliveries = weightedKgTotal > 0
  ? parseFloat((weightedCostKgSum / weightedKgTotal).toFixed(2))
  : 0;

const feedCostKgFromTarget =
  getTarget("feed_cost_kg", "week")  ||
  getTarget("feed_cost_kg", "month") ||
  getTarget("feed_cost_per_kg", "week") ||
  getTarget("feed_cost_per_kg", "month") ||
  0;

costPerFeedKg = feedCostKgFromTarget > 0
  ? feedCostKgFromTarget           // ← Target Config wins
  : costPerFeedKgFromDeliveries > 0
    ? costPerFeedKgFromDeliveries
    : costPerFeedKgFromSubform > 0
      ? costPerFeedKgFromSubform
      : avgFeedPriceFromProducts > 0
        ? avgFeedPriceFromProducts : 0;


// ── Consumed cost = kg consumed × client-set price (standard cost) ──
const consumedCostWeek = feedKgWeekFromOps * costPerFeedKg;
const consumedCostMonth = feedKgMonthFromOps * costPerFeedKg;
const consumedCostYear = feedKgYearFromOps * costPerFeedKg;

// ── Variance = Actual delivery cost vs Standard consumed cost ──
const feedCostVarianceWeek = feedDeliveryCostWeek - consumedCostWeek;
const feedCostVarianceMonth = feedDeliveryCostMonth - consumedCostMonth;
const feedCostVarianceYear = feedDeliveryCostYear - consumedCostYear;

console.log("[WAFAD] Feed Cost Comparison →",
  "Set Price/kg:", costPerFeedKg,
  "| Consumed kg (Mo):", feedKgMonthFromOps,
  "| Consumed Cost (Mo):", consumedCostMonth,
  "| Actual Delivery (Mo):", feedDeliveryCostMonth,
  "| Variance (Mo):", feedCostVarianceMonth
);

console.log("[WAFAD] Final expenses → Week:", totalExpenseWeek,
  "| Month:", totalExpenseMonth, "| Year:", totalExpenseYear,
  "| costPerFeedKg:", costPerFeedKg);




// Update margins to also use grossMarginFinal context
const margins = Object.entries(productRevenueMap)
  .sort((a, b) => b[1] - a[1]).slice(0, 4)
  .map(([product, rev]) => ({
    product: product.length > 14 ? product.slice(0, 14) + "…" : product,
    margin: revenueMonth > 0 ? parseFloat(((rev / revenueMonth) * 100).toFixed(1)) : 0,
  })).filter((m) => m.margin > 0);

const budgetVsActual = [
  feedExpenseMonth > 0 ? { line: "Feed Cost", budget: feedKgMonthFromOps * (costPerFeedKg || 0) * 1.05, actual: feedExpenseMonth } : null,
  totalExpenseMonth > 0 ? { line: "Total OpEx", budget: 0, actual: totalExpenseMonth } : null,
].filter(Boolean).filter((b) => b.actual > 0);






/* ─── 12. EMPLOYEES ─────────────────────────────────────────────── */
const employees = await zohoGetAll("All_Employees");
console.group("✅ [12] EMPLOYEES");
console.log("Total records:", employees.length);
console.groupEnd();

// let totalStaff = 0, activeStaff = 0;
// const deptMap = {};
// employees.forEach((e) => {
let totalStaff = 0, activeStaff = 0;
const deptMap = {};

// Filter employees by year
const employeesThisYear = employees.filter((e) => {
  const addedTime = fv(e, "Added_Time");
  if (!addedTime) return true; // Include if no date (assume current)
  const addedDate = parseZohoDate(addedTime);
  return !addedDate || addedDate >= yearStart; // Only if added in selected year or later
});

console.log(`[WAFAD] Employees filtered: ${employeesThisYear.length} / ${employees.length} (year: ${year})`);

employeesThisYear.forEach((e) => {
  totalStaff++;
  const empStatus = (fv(e, "Employee_Status") || "").toLowerCase();
  if (empStatus === "active" || empStatus === "") activeStaff++;
  const dept = displayVal(e.Department || "") || "Other";
  deptMap[dept] = (deptMap[dept] || 0) + 1;
});
const deptProductivity = Object.entries(deptMap)
  .map(([dept, count]) => ({ dept: dept.length > 12 ? dept.slice(0, 12) + "…" : dept, score: count }))
  .sort((a, b) => b.score - a.score).slice(0, 6);

/* ─── 13. LEAVE ─────────────────────────────────────────────────── */
const leaves = await zohoGetAll("Leave_Form_Report");
console.group("✅ [13] LEAVE");
console.log("Total records:", leaves.length);
console.groupEnd();

let staffOnLeaveToday = 0, openLeaveRequests = 0;
let leaveThisWeek = 0, leaveThisMonth = 0;
const leaveByDept = {};
leaves.forEach((l) => {
  const leaveStatus = (fv(l, "Status") || "").toLowerCase().trim();
  const fromDate = fv(l, "From") ? new Date(fv(l, "From")) : null;
  const toDate = fv(l, "To") ? new Date(fv(l, "To")) : null;
  const dept = displayVal(l.Department || "") || "Unknown";
  if (leaveStatus === "approved") {
    if (fromDate && toDate && fromDate <= now && toDate >= now) {
      staffOnLeaveToday++;
      leaveByDept[dept] = (leaveByDept[dept] || 0) + 1;
    }
    if (fromDate && toDate && fromDate <= weekEnd && toDate >= weekStart) leaveThisWeek++;
    if (fromDate && toDate && fromDate <= monthEnd && toDate >= monthStart) leaveThisMonth++;
  } else if (leaveStatus === "requested" || leaveStatus === "pending") {
    openLeaveRequests++;
  }
});
const absenteeismPct = activeStaff > 0
  ? parseFloat(((staffOnLeaveToday / activeStaff) * 100).toFixed(1)) : 0;

/* ─── 14. CHICKEN4U ─────────────────────────────────────────────── */
const c4uParents = await zohoGetAll("Field_Visit_Sales_Order_Report");
const c4uSF = await zohoGetAll("Field_Visit_Sales_Order_Master_SF_Report");
const muoProfiles = await zohoGetAll("All_Muo_Profiles");
const learnerRecs = await zohoGetAll("All_Muo_Profiles");


// console.log("Chicken4u sales order main form data ---->> ", c4uParents);
//
//   console.log("Chicken4u Field Visit Sales Order Subform Data ------->>>", c4uSF)

// Filter MUO profiles by year
const muoProfilesThisYear = muoProfiles.filter((r) => {
  const addedTime = fv(r, "Added_Time");
  if (!addedTime) return true; // Include if no date
  const addedDate = parseZohoDate(addedTime);
  return !addedDate || addedDate >= yearStart; // Only if added in selected year or later
});

const learnerRecsThisYear = learnerRecs.filter((r) => {
  const addedTime = fv(r, "Added_Time");
  if (!addedTime) return true;
  const addedDate = parseZohoDate(addedTime);
  return !addedDate || addedDate >= yearStart;
});

console.log(`[WAFAD] MUO Profiles filtered: ${muoProfilesThisYear.length} / ${muoProfiles.length} (year: ${year})`);

const certifiedLearners = learnerRecsThisYear.filter(
  (r) => (r.Certified_ID != null)
).length;


console.group("✅ [14] CHICKEN4U");
console.log("Parent orders:", c4uParents.length, "| SF lines:", c4uSF.length);
console.log("MUO profiles:", muoProfilesThisYear.length, " / ", muoProfiles.length, "| Certified learners:", certifiedLearners);
console.groupEnd();


let muoMale = 0, muoFemale = 0;
// muoProfiles.forEach((r) => {
muoProfilesThisYear.forEach((r) => {

  const g = (r.Gender ?? "").toString().toLowerCase().trim();
  if (g === "male") muoMale++; else if (g === "female") muoFemale++;
});

const orderMetaMap = new Map();
let c4uConfirmedOrders = 0, c4uPendingOrdersCount = 0;
let c4uConfirmedWeekCount = 0, c4uConfirmedMonthCount = 0;
let c4uPendingWeekCount = 0, c4uPendingMonthCount = 0;

// C4U revenue: field visit orders where payment_status = paid
// Combined with invoices to form total revenue
let c4uRevenueWeek = 0, c4uRevenueMonth = 0, c4uRevenueYear = 0;

for (const rec of c4uParents) {
  const orderId = String(rec.ID ?? "");

  // Declare c4uOrderDate FIRST — used throughout this block
  const c4uOrderDate = parseZohoDate(
    fv(rec, "Date_field") || fv(rec, "Order_Date") || fv(rec, "Date") || fv(rec, "Added_Time")
  );

  const payStatusRaw = displayVal(rec.Payment_Status ?? "").toLowerCase().trim();
  const isPaid = payStatusRaw === "paid";
  const isPartial = payStatusRaw === "partial";
  const statusRaw = displayVal(rec.Order_Status ?? rec.Status ?? "").toLowerCase().trim();
  const isDelivered = statusRaw === "delivered";

  const totalAmt = num(fv(rec, "Total_Amount") || fv(rec, "Grand_Total") || 0);
  const paidAmt = isPaid ? totalAmt
    : isPartial ? num(fv(rec, "Amount_Paid") || fv(rec, "Paid_Amount") || totalAmt * 0.5)
      : 0;


  if (paidAmt > 0 && c4uOrderDate) {
    if (c4uOrderDate >= yearStart && c4uOrderDate <= yearEnd) c4uRevenueYear += paidAmt;
    if (c4uOrderDate >= monthStart && c4uOrderDate <= monthEnd) c4uRevenueMonth += paidAmt;
    if (c4uOrderDate >= weekStart && c4uOrderDate <= weekEnd) c4uRevenueWeek += paidAmt;
    // Also add to monthly financial data
    const mKey = mkMonthKey(c4uOrderDate);
    if (mKey) { ensureMonth(monthlyFinData, mKey, FIN_TPL); monthlyFinData[mKey].revenue += paidAmt; }
  }

  const muoName = displayVal(
    rec["MUO.MUO_Name"] ?? rec["MUO.Name"] ?? rec["MUO.Full_Name"] ?? rec.MUO ?? ""
  ).trim();
  const satoName = displayVal(
    rec["SATO.SATO_Name"] ?? rec["SATO.Name"] ?? rec["SATO.Full_Name"] ?? rec.SATO ?? ""
  ).trim();

  let expectedDate = null;
  const edd = rec.Expected_Delivery_Date ?? rec.Expected_Date ?? rec.Delivery_Date ?? "";
  if (edd) { try { expectedDate = parseZohoDate(edd); } catch (e) { } }

  orderMetaMap.set(orderId, { isDelivered, isPaid, muoName, satoName, expectedDate, statusRaw, orderDate: c4uOrderDate });

  const c4uRegion = displayVal(rec.Region ?? rec["Customer.Region"] ?? rec.District ?? "").trim() || "Other";

  if (CONFIRMED_STATUSES.has(statusRaw)) {
    c4uConfirmedOrders++;
    c4uRegionMap[c4uRegion] = (c4uRegionMap[c4uRegion] || 0) + 1;
    if (c4uOrderDate) {
      if (c4uOrderDate >= weekStart && c4uOrderDate <= weekEnd) c4uConfirmedWeekCount++;
      if (c4uOrderDate >= monthStart && c4uOrderDate <= monthEnd) c4uConfirmedMonthCount++;
    }
  } else if (PENDING_STATUSES.has(statusRaw) || statusRaw === "") {
    c4uPendingOrdersCount++;
    if (c4uOrderDate) {
      if (c4uOrderDate >= weekStart && c4uOrderDate <= weekEnd) c4uPendingWeekCount++;
      if (c4uOrderDate >= monthStart && c4uOrderDate <= monthEnd) c4uPendingMonthCount++;
    }
  }
}

  const poultryRevenueWeek  = revenueWeek;
const poultryRevenueMonth = revenueMonth;
const poultryRevenueYear  = revenueYear;

// Total revenue = invoices (paid) + C4U field visit orders (paid)
revenueWeek += c4uRevenueWeek;
revenueMonth += c4uRevenueMonth;
revenueYear += c4uRevenueYear;

let c4uGrangers = 0, c4uLayers = 0, c4uBroilers = 0;
const c4uGrangerBreeds = {}, c4uLayerBreeds = {}, c4uBroilerBreeds = {};
let c4uGrangersDel = 0, c4uLayersDel = 0, c4uBroilersDel = 0;
let c4uGrangersPend = 0, c4uLayersPend = 0, c4uBroilersPend = 0;
const c4uGrangerBreedsDel = {}, c4uLayerBreedsDel = {}, c4uBroilerBreedsDel = {};
const c4uGrangerBreedsPend = {}, c4uLayerBreedsPend = {}, c4uBroilerBreedsPend = {};
let c4uOrdersDel = 0, c4uOrdersPend = 0;
let c4uFeedKgOrdered = 0, c4uFeedKgDelivered = 0, c4uFeedKgPending = 0;
const c4uMuoMap = {}, c4uSatoMap = {}, c4uAllProducts = {};
let c4uPendingWeekQty = 0, c4uPendingMonthQty = 0;
const seenOrders = new Set(), seenWeekOrders = new Set(), seenMonthOrders = new Set();
const c4uPendingWeekList = [], c4uPendingMonthList = [];
let c4uSellingPriceWeekSum = 0, c4uSellingPriceWeekQty = 0;
let c4uSellingPriceLastWeekSum = 0, c4uSellingPriceLastWeekQty = 0;
let c4uSellingYTDSum = 0, c4uSellingYTDQty = 0;



for (const row of c4uSF) {
  const qty = Number(row.Quantity ?? 0);
  if (qty === 0) continue;
  const orderId = row.SO_Reference?.ID;
  if (!orderId) continue;
  const meta = orderMetaMap.get(String(orderId));
  if (!meta) continue;
  const { isDelivered, isPaid, muoName, satoName, expectedDate, statusRaw, orderDate } = meta;

  if (!seenOrders.has(orderId)) {
    seenOrders.add(orderId);
    if (isDelivered) c4uOrdersDel++; else c4uOrdersPend++;
  }

  const productCategory = displayVal(row.Product ?? "").trim();

  const productDetail = displayVal(
    row["Product_Type.Product_Name"] || row["Product_Type.Name"] || (row.Product_Type ?? "")
  ).trim();

    const rowDateForSato = parseZohoDate(fv(row, "Date_field") || fv(row, "Added_Time")) || orderDate;
const mKeySato = mkMonthKey(rowDateForSato);

    console.log("[WAFAD] C4U row →",
  "Product(category):", productCategory,
  "| Product_Type(detail):", productDetail,
  "| resolved breed:", resolveBreedFromProductName(productDetail) || resolveBreedFromProductName(productCategory)
);

  const productKey = productDetail || productCategory || "Unknown";
  const nameUp = productCategory.toUpperCase();

  const isFeedRow = nameUp.includes("SAVANNA") || nameUp.includes("FEED");
  const category = isFeedRow ? "feed"
    : (nameUp.includes("GRANGER") || nameUp.includes("COCK") || nameUp.includes("LAYER") || nameUp.includes("BROILER")) ? "chick"
      : (nameUp.includes("VACCINE") || nameUp.includes("MEDIC")) ? "medication"
        : "other";

  if (category === "feed") {
    const feedUnitPrice = num(fv(row, "Unit_Price") || fv(row, "Rate") || 0);
    const feedOrderDate = parseZohoDate(fv(row, "Date_field") || fv(row, "Added_Time")) || meta.expectedDate;
    if (feedOrderDate && feedOrderDate >= monthStart) {
      c4uFeedRevenueMonth += feedUnitPrice * qty;
      c4uFeedQtyMonth += qty;
    }
  }

  if (!c4uAllProducts[productKey])
    c4uAllProducts[productKey] = { ordered: 0, delivered: 0, pending: 0, category };
  c4uAllProducts[productKey].ordered += qty;
  if (isDelivered) c4uAllProducts[productKey].delivered += qty;
  else c4uAllProducts[productKey].pending += qty;

  // Chick selling price from C4U SF
  const isChickRow = nameUp.includes("GRANGER") || nameUp.includes("LAYER") ||
    nameUp.includes("BROILER") || nameUp.includes("NOVO") ||
    nameUp.includes("EFFICIENCY") || nameUp.includes("COCK");

  if (isChickRow) {
    let linePrice = num(row.Rate || fv(row, "Unit_Price") || 0);
    if (linePrice === 0 && productDetail && productPriceMap[productDetail.toUpperCase()]?.sellingPrice > 0)
      linePrice = productPriceMap[productDetail.toUpperCase()].sellingPrice;
    if (linePrice === 0 && productCategory && productPriceMap[productCategory.toUpperCase()]?.sellingPrice > 0)
      linePrice = productPriceMap[productCategory.toUpperCase()].sellingPrice;

      const rowDate = parseZohoDate(fv(row, "Date_field") || fv(row, "Added_Time")) || orderDate;
    if (linePrice > 0 && rowDate) {
      if (rowDate >= weekStart && rowDate <= weekEnd) { c4uSellingPriceWeekSum += linePrice * qty; c4uSellingPriceWeekQty += qty; maxChickPriceWeek = Math.max(maxChickPriceWeek, linePrice); }
      if (rowDate >= monthStart && rowDate <= monthEnd) { maxChickPriceMonth = Math.max(maxChickPriceMonth, linePrice); }
      if (rowDate >= yearStart && rowDate <= yearEnd) { maxChickPriceYear = Math.max(maxChickPriceYear, linePrice); }
      if (rowDate >= lastWeekStart && rowDate <= lastWeekEnd) { c4uSellingPriceLastWeekSum += linePrice * qty; c4uSellingPriceLastWeekQty += qty; }
      if (rowDate >= yearStart && rowDate <= yearEnd) { c4uSellingYTDSum += linePrice * qty; c4uSellingYTDQty += qty; }

        // ── Breed revenue accumulation (fixes Breed Profit Margins showing 0) ──
const c4uLineRevenue = linePrice * qty;
const breedLabelC4U = resolveBreedFromProductName(productDetail) || resolveBreedFromProductName(productCategory) || resolveBreedFromProductName(nameUp);
if (breedLabelC4U) {
  if (rowDate >= monthStart && rowDate <= monthEnd) {
    breedRevenueMonth[breedLabelC4U] = (breedRevenueMonth[breedLabelC4U] || 0) + c4uLineRevenue;
  }
  if (rowDate >= yearStart && rowDate <= yearEnd) {
    breedRevenueYear[breedLabelC4U] = (breedRevenueYear[breedLabelC4U] || 0) + c4uLineRevenue;
  }
}

      // ── Breed revenue accumulation (fixes Breed Profit Margins showing 0) ──
      // const c4uLineRevenue = linePrice * qty;
      // const breedLabelC4U = productDetail || productCategory || "Unknown";
      // if (rowDate >= monthStart && rowDate <= monthEnd) {
      //   breedRevenueMonth[breedLabelC4U] = (breedRevenueMonth[breedLabelC4U] || 0) + c4uLineRevenue;
      // }
      // if (rowDate >= yearStart && rowDate <= yearEnd) {
      //   breedRevenueYear[breedLabelC4U] = (breedRevenueYear[breedLabelC4U] || 0) + c4uLineRevenue;
      // }
    }
  }

  if (category === "feed") {
    c4uFeedKgOrdered += qty;
    if (isDelivered) c4uFeedKgDelivered += qty; else c4uFeedKgPending += qty;
  }

  const breedLabel = productDetail || productCategory || "Unknown";
  if (nameUp.includes("GRANGER") || nameUp.includes("COCK")) {
    c4uGrangers += qty; addBreed(c4uGrangerBreeds, breedLabel, qty);
    if (isDelivered) { c4uGrangersDel += qty; addBreed(c4uGrangerBreedsDel, breedLabel, qty); }
    else { c4uGrangersPend += qty; addBreed(c4uGrangerBreedsPend, breedLabel, qty); }
  } else if (nameUp.includes("LAYER") || nameUp.includes("NOVO")) {
    c4uLayers += qty; addBreed(c4uLayerBreeds, breedLabel, qty);
    if (isDelivered) { c4uLayersDel += qty; addBreed(c4uLayerBreedsDel, breedLabel, qty); }
    else { c4uLayersPend += qty; addBreed(c4uLayerBreedsPend, breedLabel, qty); }
  } else if (nameUp.includes("BROILER")) {
    c4uBroilers += qty; addBreed(c4uBroilerBreeds, breedLabel, qty);
    if (isDelivered) { c4uBroilersDel += qty; addBreed(c4uBroilerBreedsDel, breedLabel, qty); }
    else { c4uBroilersPend += qty; addBreed(c4uBroilerBreedsPend, breedLabel, qty); }
  }

  if (muoName && category === "chick") {
    if (!c4uMuoMap[muoName]) c4uMuoMap[muoName] = { ordered: 0, delivered: 0 };
    c4uMuoMap[muoName].ordered += qty;
    if (isDelivered) c4uMuoMap[muoName].delivered += qty;
  }

    if (satoName && category === "chick" && isDelivered) {
    if (!c4uSatoMap[satoName]) {
      c4uSatoMap[satoName] = {
        paidQty: 0, totalQty: 0,
        grangersDelivered: 0,
        layersDelivered: 0,
        broilersDelivered: 0,
        monthly: {},
      };
    }
    if (mKeySato) {
      if (!c4uSatoMap[satoName].monthly[mKeySato]) {
        c4uSatoMap[satoName].monthly[mKeySato] = { grangersDelivered: 0, layersDelivered: 0, broilersDelivered: 0 };
      }
    }
    c4uSatoMap[satoName].totalQty += qty;
    if (isPaid) c4uSatoMap[satoName].paidQty += qty;

    const nu = nameUp;                     // already computed above in the loop

      const smMonthly = mKeySato ? c4uSatoMap[satoName].monthly[mKeySato] : null;
      if (nu.includes("GRANGER") || nu.includes("COCK")) {
  c4uSatoMap[satoName].grangersDelivered += qty;
  if (smMonthly) smMonthly.grangersDelivered += qty;
} else if (
  nu.includes("LAYER") || nu.includes("NOVO") ||
  nu.includes("NOVOWHITE") || nu.includes("NOVOBROWN")
) {
  c4uSatoMap[satoName].layersDelivered += qty;
  if (smMonthly) smMonthly.layersDelivered += qty;
} else if (nu.includes("BROILER") || nu.includes("EFFICIENCY")) {
  c4uSatoMap[satoName].broilersDelivered += qty;
  if (smMonthly) smMonthly.broilersDelivered += qty;
}

    // if (nu.includes("GRANGER") || nu.includes("COCK")) {
    //   c4uSatoMap[satoName].grangersDelivered += qty;
    // } else if (
    //   nu.includes("LAYER") || nu.includes("NOVO") ||
    //   nu.includes("EFFICIENCY") || nu.includes("NOVOWHITE") ||
    //   nu.includes("NOVOBROWN")
    // ) {
    //   c4uSatoMap[satoName].layersDelivered += qty;
    // } else if (nu.includes("BROILER")) {
    //   c4uSatoMap[satoName].broilersDelivered += qty;
    // }
  }

  if (!isDelivered && expectedDate && !isNaN(expectedDate)) {
    if (expectedDate >= weekStart && expectedDate <= weekEnd) {
      c4uPendingWeekQty += qty;
      if (!seenWeekOrders.has(String(orderId))) {
        seenWeekOrders.add(String(orderId));
        c4uPendingWeekList.push({ orderId: String(orderId), muoName, satoName, expectedDate: expectedDate.toISOString().split("T")[0], status: statusRaw });
      }
    }
    if (expectedDate >= monthStart && expectedDate <= monthEnd) {
      c4uPendingMonthQty += qty;
      if (!seenMonthOrders.has(String(orderId))) {
        seenMonthOrders.add(String(orderId));
        c4uPendingMonthList.push({ orderId: String(orderId), muoName, satoName, expectedDate: expectedDate.toISOString().split("T")[0], status: statusRaw });
      }
    }
  }
}

  // ── Compute SATO commissions (after loop, targets now known) ──
let totalSatoCommissionPayable = 0;
Object.entries(c4uSatoMap).forEach(([name, s]) => {
  const grangerComm  = s.grangersDelivered * satoGrangerCommission;

  // Target-based: only earn commission if they hit the monthly target
  const meetsLayerTarget   = satoLayerTarget   > 0
    ? s.layersDelivered   >= satoLayerTarget   : true;  // if no target set, always qualifies
  const meetsBroilerTarget = satoBroilerTarget > 0
    ? s.broilersDelivered >= satoBroilerTarget : true;

  const layerComm   = meetsLayerTarget   ? s.layersDelivered   * satoLayerCommission   : 0;
  const broilerComm = meetsBroilerTarget ? s.broilersDelivered * satoBroilerCommission : 0;
  const total       = grangerComm + layerComm + broilerComm;

  s.grangerCommission       = parseFloat(grangerComm.toFixed(2));
  s.layerCommission         = parseFloat(layerComm.toFixed(2));
  s.broilerCommission       = parseFloat(broilerComm.toFixed(2));
  s.totalCommission         = parseFloat(total.toFixed(2));
  s.meetsLayerTarget        = meetsLayerTarget;
  s.meetsBroilerTarget      = meetsBroilerTarget;

  totalSatoCommissionPayable += total;
});
  // ── Per-month commission breakdown, per SATO ──
Object.entries(c4uSatoMap).forEach(([name, s]) => {
  s.monthlyCommission = Object.entries(s.monthly || {}).map(([mk, md]) => {
    const grangerComm = md.grangersDelivered * satoGrangerCommission;
    const meetsLayerTarget = satoLayerTarget > 0 ? md.layersDelivered >= satoLayerTarget : true;
    const meetsBroilerTarget = satoBroilerTarget > 0 ? md.broilersDelivered >= satoBroilerTarget : true;
    const layerComm = meetsLayerTarget ? md.layersDelivered * satoLayerCommission : 0;
    const broilerComm = meetsBroilerTarget ? md.broilersDelivered * satoBroilerCommission : 0;
    return {
      month: mk,
      monthLabel: new Date(mk + "-01").toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      grangersDelivered: md.grangersDelivered,
      layersDelivered: md.layersDelivered,
      broilersDelivered: md.broilersDelivered,
      grangerComm: parseFloat(grangerComm.toFixed(2)),
      layerComm: parseFloat(layerComm.toFixed(2)),
      broilerComm: parseFloat(broilerComm.toFixed(2)),
      total: parseFloat((grangerComm + layerComm + broilerComm).toFixed(2)),
      meetsLayerTarget,
      meetsBroilerTarget,
    };
  }).sort((a, b) => a.month.localeCompare(b.month));
});

totalSatoCommissionPayable = parseFloat(totalSatoCommissionPayable.toFixed(2));
console.log("[WAFAD] Total SATO commission payable:", totalSatoCommissionPayable);

c4uPendingWeekList.sort((a, b) => new Date(a.expectedDate) - new Date(b.expectedDate));
c4uPendingMonthList.sort((a, b) => new Date(a.expectedDate) - new Date(b.expectedDate));

const c4uTopMuos = Object.entries(c4uMuoMap).map(([name, d]) => ({ name, value: d.delivered, ordered: d.ordered })).sort((a, b) => b.value - a.value).slice(0, 10);
  const c4uTopSatos = Object.entries(c4uSatoMap)
  .map(([name, d]) => ({
    name,
    value:               d.paidQty,
    totalQty:            d.totalQty,
    grangersDelivered:   d.grangersDelivered   || 0,
    layersDelivered:     d.layersDelivered     || 0,
    broilersDelivered:   d.broilersDelivered   || 0,
    grangerCommission:   d.grangerCommission   || 0,
    layerCommission:     d.layerCommission     || 0,
    broilerCommission:   d.broilerCommission   || 0,
    totalCommission:     d.totalCommission     || 0,
    meetsLayerTarget:    d.meetsLayerTarget,
    meetsBroilerTarget:  d.meetsBroilerTarget,
    monthly: d.monthlyCommission || [],
  }))
  .sort((a, b) => b.totalCommission - a.totalCommission)   // sort by commission desc
  .slice(0, 20);                                            // show top 20
  const c4uSatoCommissionByMonth = [];
Object.entries(c4uSatoMap).forEach(([name, d]) => {
  (d.monthlyCommission || []).forEach((m) => {
    c4uSatoCommissionByMonth.push({ sato: name, ...m });
  });
});
c4uSatoCommissionByMonth.sort((a, b) => a.month.localeCompare(b.month) || b.total - a.total);
const sspTotal = Math.floor(c4uGrangers / 5);

const REGION_COLORS = [C.blue, C.green, C.amber, C.purple, C.cyan, C.orange];
const regionalDemand = Object.entries(regionMap).sort((a, b) => b[1] - a[1]).slice(0, 6)
  .map(([region, orders], i) => ({ region, orders, color: REGION_COLORS[i] }));

const c4uRegionalDemand = Object.entries(c4uRegionMap).sort((a, b) => b[1] - a[1]).slice(0, 6)
  .map(([region, orders], i) => ({ region, orders, color: REGION_COLORS[i] }));

const combinedRegionMap = { ...regionMap };
Object.entries(c4uRegionMap).forEach(([region, count]) => {
  combinedRegionMap[region] = (combinedRegionMap[region] || 0) + count;
});
const combinedRegionalDemand = Object.entries(combinedRegionMap).sort((a, b) => b[1] - a[1]).slice(0, 8)
  .map(([region, orders], i) => ({ region, orders, color: REGION_COLORS[i % REGION_COLORS.length] }));

// grossMargin calculated AFTER C4U revenue is already merged into revenueMonth
const grossMarginFinal = revenueMonth > 0
  ? parseFloat((((revenueMonth - totalExpenseMonth) / revenueMonth) * 100).toFixed(1)) : 0;

const grossMargin = revenueMonth > 0
  ? parseFloat((((revenueMonth - totalExpenseMonth) / revenueMonth) * 100).toFixed(1)) : 0;


// ── Margin percentages from Target Config (with hardcoded defaults) ──
const salaryExpenseMonth = getTarget("salary_expense", "month") || 0;
const salaryExpenseWeek = Math.round(salaryExpenseMonth / 4.33);
const salaryExpenseYear = salaryExpenseMonth * 12;

// Total expenditure including salary placeholder
const totalExpenseWithSalaryWeek = totalExpenseWeek + salaryExpenseWeek;
const totalExpenseWithSalaryMonth = totalExpenseMonth + salaryExpenseMonth;
const totalExpenseWithSalaryYear = totalExpenseYear + salaryExpenseYear;



  const breederFarmExpenseWeek  = feedCostWeek  + breederFarmDeptExpenseWeek + opExpenseWeek;
const breederFarmExpenseMonth = feedCostMonth + breederFarmDeptExpenseMonth + opExpenseMonth;
const breederFarmExpenseYear  = feedCostYear  + breederFarmDeptExpenseYear  + opExpenseYear;

// Hatchery: ONLY dept workers (op requests are breeder-farm-level costs)
const hatcheryOnlyExpenseWeek  = hatcheryDeptExpenseWeek;
const hatcheryOnlyExpenseMonth = hatcheryDeptExpenseMonth;
const hatcheryOnlyExpenseYear  = hatcheryDeptExpenseYear;

// ══════════════════════════════════════════════════════════════════
// COST CHAIN — must run in this exact order:
// 1. breederFarmExpense  (already above)
// 2. costPerHatchingEgg
// 3. sellingPxHatchingEgg   ← needed as INPUT to costPerChick
// 4. costPerChick
// 5. chickSellingPx
// ══════════════════════════════════════════════════════════════════

// ── Margin % from Target Config ──────────────────────────────────
// Declared HERE so they are available for both egg and chick calcs
const hatchingEggMarginPct  = getTarget("hatching_egg_margin",  "week") || 66;
const chickSellingMarginPct = getTarget("chick_selling_margin", "week") || 40;

// ── STEP 2: Cost Per Hatching Egg ────────────────────────────────
// Formula: Breeder Farm Expense ÷ Hatchable Eggs (from daily ops)
// Breeder Farm Expense = Feed cost (ops) + Breeder dept workers + Op requests
const costPerHatchingEggWeek = (() => {
  if (hatchingEggsWeek <= 0 || breederFarmExpenseWeek <= 0) return 0;
  const cost = Math.round(breederFarmExpenseWeek / hatchingEggsWeek);
  console.log(`[WAFAD] Cost/Hatching Egg (Week) = GHC${breederFarmExpenseWeek} ÷ ${hatchingEggsWeek} eggs = GHC${cost}`);
  return cost;
})();

const costPerHatchingEggMonth = (() => {
  if (hatchingEggsMonth <= 0 || breederFarmExpenseMonth <= 0) return 0;
  const cost = Math.round(breederFarmExpenseMonth / hatchingEggsMonth);
  console.log(`[WAFAD] Cost/Hatching Egg (Month) = GHC${breederFarmExpenseMonth} ÷ ${hatchingEggsMonth} eggs = GHC${cost}`);
  return cost;
})();

const costPerHatchingEggYear = (() => {
  if (hatchingEggsYear <= 0 || breederFarmExpenseYear <= 0) return 0;
  return Math.round(breederFarmExpenseYear / hatchingEggsYear);
})();

const costPerHatchingEgg = costPerHatchingEggMonth;

// ── STEP 3: Hatching Egg Selling Price ───────────────────────────
// Formula: Cost/Egg × (1 + margin%)
// MUST be before costPerChick — used as egg input cost in Step 4
const sellingPxHatchingEggWeek = (() => {
  if (costPerHatchingEggWeek <= 0) return 0;
  const multiplier = 1 + (hatchingEggMarginPct / 100);
  const px = parseFloat((costPerHatchingEggWeek * multiplier).toFixed(2));
  console.log(`[WAFAD] Hatching Egg Selling Px (Week) = GHC${costPerHatchingEggWeek} × ${multiplier.toFixed(2)} = GHC${px}`);
  return px;
})();

const sellingPxHatchingEggMonth = (() => {
  if (costPerHatchingEggMonth <= 0) return 0;
  const multiplier = 1 + (hatchingEggMarginPct / 100);
  const px = parseFloat((costPerHatchingEggMonth * multiplier).toFixed(2));
  console.log(`[WAFAD] Hatching Egg Selling Px (Month) = GHC${costPerHatchingEggMonth} × ${multiplier.toFixed(2)} = GHC${px}`);
  return px;
})();

const sellingPxHatchingEggYear = (() => {
  if (costPerHatchingEggYear <= 0) return 0;
  return parseFloat((costPerHatchingEggYear * (1 + hatchingEggMarginPct / 100)).toFixed(2));
})();

// ── STEP 4: Cost Per Chick (DOC) ─────────────────────────────────
// Formula: (Egg selling price × Hatching eggs from daily ops + Hatchery workers) ÷ Good chicks
// Uses hatchingEggsWeek (daily ops Total_Hatchable_Eggs) NOT eggsSetWeek (hatchery records)
// Uses sellingPxHatchingEgg as transfer price — avoids double-counting breeder farm costs
const costPerChickWeek = (() => {
  if (goodChicksWeek <= 0) return 0;
  const eggInputCost  = hatchingEggsWeek * (sellingPxHatchingEggWeek || 0);
  const hatcheryTotal = eggInputCost + hatcheryOnlyExpenseWeek;
  if (hatcheryTotal <= 0) return 0;
  const cost = Math.round(hatcheryTotal / goodChicksWeek);
  console.log(`[WAFAD] Cost/Chick (Week) = (${hatchingEggsWeek} eggs × GHC${sellingPxHatchingEggWeek} + GHC${hatcheryOnlyExpenseWeek}) ÷ ${goodChicksWeek} chicks = GHC${cost}`);
  return cost;
})();

const costPerChickMonth = (() => {
  if (goodChicksMonth <= 0) return 0;
  const eggInputCost  = hatchingEggsMonth * (sellingPxHatchingEggMonth || 0);
  const hatcheryTotal = eggInputCost + hatcheryOnlyExpenseMonth;
  if (hatcheryTotal <= 0) return 0;
  const cost = Math.round(hatcheryTotal / goodChicksMonth);
  console.log(`[WAFAD] Cost/Chick (Month) = (${hatchingEggsMonth} eggs × GHC${sellingPxHatchingEggMonth} + GHC${hatcheryOnlyExpenseMonth}) ÷ ${goodChicksMonth} chicks = GHC${cost}`);
  return cost;
})();

const costPerChickYear = (() => {
  if (goodChicksYear <= 0) return 0;
  const eggInputCost  = hatchingEggsYear * (sellingPxHatchingEggYear || 0);
  const hatcheryTotal = eggInputCost + hatcheryOnlyExpenseYear;
  if (hatcheryTotal <= 0) return 0;
  return Math.round(hatcheryTotal / goodChicksYear);
})();

const costPerChickForDisplay = costPerChickMonth;

// ── STEP 5: Chick Selling Price ──────────────────────────────────
// Formula: Cost/Chick × (1 + margin%)
// 40% margin from Target Config → multiplier = 1.40
const chickSellingPxWeek = (() => {
  if (costPerChickWeek <= 0) return 0;
  const multiplier = 1 + (chickSellingMarginPct / 100);
  const px = Math.round(costPerChickWeek * multiplier);
  console.log(`[WAFAD] Chick Selling Px (Week) = GHC${costPerChickWeek} × ${multiplier.toFixed(2)} = GHC${px} (profit: GHC${px - costPerChickWeek})`);
  return px;
})();

const chickSellingPxMonth = (() => {
  if (costPerChickMonth <= 0) return 0;
  const multiplier = 1 + (chickSellingMarginPct / 100);
  const px = Math.round(costPerChickMonth * multiplier);
  console.log(`[WAFAD] Chick Selling Px (Month) = GHC${costPerChickMonth} × ${multiplier.toFixed(2)} = GHC${px} (profit: GHC${px - costPerChickMonth})`);
  return px;
})();

const chickSellingPxYear = (() => {
  if (costPerChickYear <= 0) return 0;
  return Math.round(costPerChickYear * (1 + chickSellingMarginPct / 100));
})();

// ── Verification logs ─────────────────────────────────────────────
const hatchingEggCostTarget = getTarget("hatching_egg_cost", "month") || 0;
if (hatchingEggCostTarget > 0 && Math.abs(costPerHatchingEggMonth - hatchingEggCostTarget) > 5) {
  console.warn(`[WAFAD] ⚠️ Cost/Egg mismatch: Calculated GHC${costPerHatchingEggMonth} vs Target GHC${hatchingEggCostTarget}`);
}
const chickCostTarget = getTarget("chick_cost", "month") || 0;
if (chickCostTarget > 0 && Math.abs(costPerChickMonth - chickCostTarget) > 10) {
  console.warn(`[WAFAD] ⚠️ Cost/Chick mismatch: Calculated GHC${costPerChickMonth} vs Target GHC${chickCostTarget}`);
}

  const costPerChickLastWk = goodChicksLastWeek > 0 && totalExpenseWithSalaryWeek > 0
  ? Math.round(totalExpenseWithSalaryWeek / goodChicksLastWeek) : 0;



console.log("[WAFAD] Cost KPIs →",
  "costPerHatchingEgg:", costPerHatchingEgg,
  "| sellingPxHatchingEggMonth:", sellingPxHatchingEggMonth,
  "| costPerChickWeek:", costPerChickWeek,
  "| chickSellingPxWeek:", chickSellingPxWeek,
  "| hatchingEggMarginPct:", hatchingEggMarginPct,
  "| chickSellingMarginPct:", chickSellingMarginPct,
);


/* ─── Final selling price aggregation ──────────────────────────── */
const sellingPriceWeek = (() => {
  const wSum = sellingPriceWeekSum + c4uSellingPriceWeekSum;
  const wQty = sellingPriceWeekQty + c4uSellingPriceWeekQty;
  if (wQty > 0) return Math.round(wSum / wQty);
  const ytdSum = sellingPriceYTDSum + c4uSellingYTDSum;
  const ytdQty = sellingPriceYTDQty + c4uSellingYTDQty;
  if (ytdQty > 0) return Math.round(ytdSum / ytdQty);
  return avgSellingPriceChick || 0;
})();

const sellingPriceLastWeek = (() => {
  const lSum = sellingPriceLastWeekSum + c4uSellingPriceLastWeekSum;
  const lQty = sellingPriceLastWeekQty + c4uSellingPriceLastWeekQty;
  return lQty > 0 ? Math.round(lSum / lQty) : 0;
})();



  /* ─── Breed Profit Margins (moved here — must run AFTER C4U revenue accumulation) ── */
const breedProfitMargins = Object.keys(breedEggData).map((breed) => {
  const feedCost = breedFeedCostMonth[breed]
    || (breedEggData[breed].feedKgMonth || 0) * (costPerFeedKg || 285);
  const revenue = breedRevenueMonth[breed] || 0;
  const grossProfit = revenue - feedCost;
  const marginPct = revenue > 0
    ? parseFloat(((grossProfit / revenue) * 100).toFixed(1)) : 0;
  return { breed, revenue, feedCost, grossProfit, marginPct };
}).filter((b) => b.revenue > 0 || b.feedCost > 0)
  .sort((a, b) => b.revenue - a.revenue);

console.log("[WAFAD] breedEggData keys (exact):", Object.keys(breedEggData));
console.log("[WAFAD] breedRevenueMonth keys (exact):", Object.keys(breedRevenueMonth));
console.log("[WAFAD] breedRevenueMonth values:", breedRevenueMonth);
console.log("[WAFAD] breedFeedCostMonth keys (exact):", Object.keys(breedFeedCostMonth));
console.log("[WAFAD] breedProfitMargins result:", breedProfitMargins);

/* ─── Income vs Expenditure trend (moved here — uses revenue, not just cash received) ── */
const incomeExpTrend = [
  { period: "This Week", income: revenueWeek, expense: totalExpenseWeek },
  { period: "This Month", income: revenueMonth, expense: totalExpenseMonth },
  { period: "This Year", income: revenueYear, expense: totalExpenseYear },
];

/* ─── 15. ALERTS ─────────────────────────────────────────────────── */
// const alerts = [];
// if (mortalityPctCumulative > 3)
//   alerts.push({ type: "critical", icon: "mortality", title: `High Mortality — ${worstFarm}`, detail: `Cumulative mortality at ${mortalityPctCumulative}% — above 3% threshold`, time: "Live" });
// if (hatchabilityWeek < 85 && eggsSetWeek > 0)
//   alerts.push({ type: "critical", icon: "hatchery", title: "Hatchability Below Target", detail: `Hatchability at ${hatchabilityWeek}% (target ≥85%)`, time: "Live" });
// criticalStock.slice(0, 3).forEach((s) =>
//   alerts.push({ type: s.status === "Critical" ? "critical" : "warning", icon: "vaccine", title: `Low Stock — ${s.item}`, detail: `Current stock: ${s.stock} unit(s) — below minimum`, time: "Live" })
// );
// if (absenteeismPct > 10)
//   alerts.push({ type: "warning", icon: "equipment", title: "High Absenteeism Detected", detail: `${absenteeismPct}% of staff currently on leave`, time: "Live" });
// if (openLeaveRequests > 5)
//   alerts.push({ type: "info", icon: "biosecurity", title: `${openLeaveRequests} Pending Leave Requests`, detail: "Requires HR approval", time: "Live" });
// if (approvedNotPaidCount > 10)
//   alerts.push({ type: "warning", icon: "feed", title: `${approvedNotPaidCount} Requests Awaiting Payment`, detail: "Approved operational requests — payment pending", time: "Live" });
// if (alerts.length === 0)
//   alerts.push({ type: "info", icon: "biosecurity", title: "All Systems Normal", detail: "No critical issues detected at this time", time: "Live" });

  /* ─── 15. ALERTS ─────────────────────────────────────────────────── */
const alerts = [];

/* ─── Build ALL_BATCHES for alerts ─── */
const ALL_BATCHES = [...allBatchesExport].sort((a, b) => {
  const da = a.settingDate ? new Date(a.settingDate) : new Date(0);
  const db = b.settingDate ? new Date(b.settingDate) : new Date(0);
  return da - db;
});


  /* ── KPI GOVERNANCE: separate Actual / Pipeline / Capacity metrics ── */

// Re-derive ALL_BATCHES-equivalent locally from hatchBatchMap + batchDatesMap
// (this mirrors what allBatchesExport already builds, reused here)
const activeBatchesData = Object.entries(hatchBatchMap)
  .filter(([, b]) => b.hatched === 0 && b.set > 0)
  .map(([batch, b]) => ({
    batch,
    set: b.set,
    scheduledDate: batchDatesMap[batch]?.scheduledDate || null,
  }));

// ACTIVE HATCH PIPELINE — eggs currently incubating, not yet hatched
const activeHatchPipelineEggs = activeBatchesData.reduce((s, b) => s + b.set, 0);
const activeHatchPipelineBatches = activeBatchesData.length;

// Reference hatchability rate to project pipeline → forecast chicks.
// Uses overall true hatchability from completed batches (fallback to target/85%).
const completedForGov = Object.values(hatchBatchMap).filter(b => b.hatched > 0 && b.set > 0);
const govSetTotal = completedForGov.reduce((s, b) => s + b.set, 0);
const govHatchedTotal = completedForGov.reduce((s, b) => s + b.hatched, 0);
const referenceHatchRate = govSetTotal > 0
  ? govHatchedTotal / govSetTotal
  : (getTarget("hatchability", "week") || 85) / 100;

// FORECAST HATCHES (NEXT 21 DAYS) — active batches with a scheduled hatch
// date falling within the next 21 days, projected using referenceHatchRate
const next21Start = new Date();
const next21End = new Date();
next21End.setDate(next21End.getDate() + 21);

let forecastEggsNext21 = 0, forecastBatchesNext21 = 0;
activeBatchesData.forEach((b) => {
  if (!b.scheduledDate || b.scheduledDate === "—") return;
  const sd = parseZohoDate(b.scheduledDate);
  if (sd && sd >= next21Start && sd <= next21End) {
    forecastEggsNext21 += b.set;
    forecastBatchesNext21++;
  }
});
const forecastChicksNext21 = Math.round(forecastEggsNext21 * referenceHatchRate);

console.log("[WAFAD] KPI Governance →",
  "Active pipeline eggs:", activeHatchPipelineEggs,
  "| Forecast 21d chicks:", forecastChicksNext21,
  "| Reference rate:", (referenceHatchRate * 100).toFixed(1) + "%"
);

// Overall hatchability — from completed batches only (avoid the active-batch denominator trap)
const completedForAlert = ALL_BATCHES.filter(b => b.hatched > 0);
const overallSet = completedForAlert.reduce((s, b) => s + b.set, 0);
const overallHatched = completedForAlert.reduce((s, b) => s + b.hatched, 0);
const overallHatchPct = overallSet > 0
  ? parseFloat(((overallHatched / overallSet) * 100).toFixed(1)) : 0;

if (mortalityPctCumulative > 3)
  alerts.push({ type: "critical", icon: "mortality", title: `High Mortality — ${worstFarm}`, detail: `Cumulative mortality at ${mortalityPctCumulative}% — above 3% threshold`, time: "Live" });

if (hatchabilityWeek < (getTarget("hatchability", "week") || 85) && eggsSetWeek > 0)
  alerts.push({ type: "critical", icon: "hatchery", title: "Hatchability Below Target (Week)", detail: `Hatchability at ${hatchabilityWeek}% (target ≥${getTarget("hatchability", "week") || 85}%)`, time: "Live" });

if (overallHatchPct > 0 && overallHatchPct < (getTarget("hatchability", "overall") || 85))
  alerts.push({ type: "critical", icon: "hatchery", title: "Overall Hatchability Critically Low", detail: `Overall hatchability at ${overallHatchPct}% across ${completedForAlert.length} completed batches — well below target. Immediate management review required.`, time: "Live" });

if (fertilityRate > 0 && fertilityRate < (getTarget("fertility", "month") || 90))
  alerts.push({ type: "warning", icon: "hatchery", title: "Fertility Below Target", detail: `Fertility at ${fertilityRate}% (target ≥${getTarget("fertility", "month") || 90}%)`, time: "Live" });

criticalStock.slice(0, 3).forEach((s) =>
  alerts.push({ type: s.status === "Critical" ? "critical" : "warning", icon: "vaccine", title: `Low Stock — ${s.item}`, detail: `Current stock: ${s.stock} unit(s) — below minimum`, time: "Live" })
);
if (absenteeismPct > 10)
  alerts.push({ type: "warning", icon: "equipment", title: "High Absenteeism Detected", detail: `${absenteeismPct}% of staff currently on leave`, time: "Live" });
if (openLeaveRequests > 5)
  alerts.push({ type: "info", icon: "biosecurity", title: `${openLeaveRequests} Pending Leave Requests`, detail: "Requires HR approval", time: "Live" });
if (approvedNotPaidCount > 10)
  alerts.push({ type: "warning", icon: "feed", title: `${approvedNotPaidCount} Requests Awaiting Payment`, detail: "Approved operational requests — payment pending", time: "Live" });
if (alerts.length === 0)
  alerts.push({ type: "info", icon: "biosecurity", title: "All Systems Normal", detail: "No critical issues detected at this time", time: "Live" });

  console.log("=== [WAFAD] Data load v4 complete ===",
  "year:", year,
  "yearStart:", yearStart.toDateString(),
  "yearEnd:", yearEnd.toDateString(),
  "eggsThisYear:", eggsThisYear,
  "eggsThisMonth:", eggsThisMonth
);
/* ─── Collect available years from all record sets ─── */
const availableYearsSet = new Set();
const addYear = (raw) => {
  const d = parseZohoDate(raw);
  if (d) availableYearsSet.add(d.getFullYear());
};
dailyOps.forEach(r => addYear(fv(r, "Date_field") || fv(r, "Added_Time")));
invoices.forEach(r => addYear(fv(r, "Date_field") || fv(r, "Invoice_Date") || fv(r, "Added_Time")));
hatchSF.forEach(r => addYear(fv(r, "Setting_Date") || fv(r, "Added_Time")));
salesOrders.forEach(r => addYear(fv(r, "Date_field") || fv(r, "Order_Date") || fv(r, "Added_Time")));
payments.forEach(r => addYear(fv(r, "Payment_Date") || fv(r, "Added_Time")));
const availableYears = Array.from(availableYearsSet)
  .filter(y => y >= 2020 && y <= new Date().getFullYear() + 1)
  .sort((a, b) => b - a);
console.log("[WAFAD] Available years from records:", availableYears);
console.group("📊 [SUMMARY]");
console.log("Birds placed:", totalBirdsPlaced, "| Birds alive:", birdsAliveTotal);
console.log("Mortality total:", totalMortality, "| Pct:", mortalityPct);
console.log("Eggs week:", eggsThisWeek, "| Month:", eggsThisMonth);
console.log("Good chicks week:", goodChicksWeek, "| Month:", goodChicksMonth);
console.log("Hatchability week:", hatchabilityWeek + "%", "| Month:", hatchabilityMonth + "%");
console.log("Revenue week:", revenueWeek, "| Month:", revenueMonth, "| (C4U month:", c4uRevenueMonth, ")");
console.log("Expense week:", totalExpenseWeek, "| Month:", totalExpenseMonth, "| costPerFeedKg:", costPerFeedKg);
console.log("Gross margin:", grossMargin + "%");
console.groupEnd();

/* ─── RETURN ─────────────────────────────────────────────────────── */
return {
  availableYears,
  allBreeds,
  allFarms,
  farmBirdsPlacedMap,
  breedEggData,
  farmEggData,
  farmBreedEggData,
  breedProfitMargins,
  incomeExpTrend,
  breedMap,
  breedHatchData,
  breedStorageEggs,
  breedDOC,
  targets,
  getTarget,
  monthlyOpsData,
  monthlyHatchData,
  monthlyFinData,
    weeklyGenderFeedRows,

  deptExpenses: {
    chicken4u: { week: chicken4uDeptExpenseWeek, month: chicken4uDeptExpenseMonth, year: chicken4uDeptExpenseYear },
    hatchery: { week: hatcheryDeptExpenseWeek, month: hatcheryDeptExpenseMonth, year: hatcheryDeptExpenseYear },
    breederFarm: { week: breederFarmDeptExpenseWeek, month: breederFarmDeptExpenseMonth, year: breederFarmDeptExpenseYear },
    total: { week: deptExpenseTotalWeek, month: deptExpenseTotalMonth, year: deptExpenseTotalYear },
  },

  kpi: {
    // Inside kpi: { ... }
    deptExpenseTotalMonth,
    deptExpenseTotalWeek,
    deptExpenseTotalYear,
    chicken4uDeptExpenseMonth,
    hatcheryDeptExpenseMonth,
    breederFarmDeptExpenseMonth,
    totalBirdsPlaced,
    totalPulletsHoused,
    totalCockerelsHoused,
    femaleAlive: femaleAliveCurrent,
    maleAlive: maleAliveCurrent,
    birdsAlive: birdsAliveTotal || birdsAlive,
    breedBreakdown: Object.entries(breedMap).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([breed, count]) => ({ breed, count })),

    mortalityThisWeek, mortalityThisMonth, mortalityThisYear,
    mortalityLastWeek, mortalityLastMonth,
    mortalityFemale, mortalityMale,
      mortalityFemaleWeek,mortalityFemaleMonth,mortalityFemaleYear,mortalityMaleWeek, mortalityMaleMonth,mortalityMaleYear,

    eggsWeekTarget: getTarget("eggs_production", "week") || Math.round((birdsAliveTotal || birdsAlive) * 0.8 * 7),
    eggsMonthTarget: getTarget("eggs_production", "month") || Math.round((birdsAliveTotal || birdsAlive) * 0.8 * 30),
    eggsYearTarget: getTarget("eggs_production", "year") || 0,
    mortalityTarget: getTarget("mortality", "week") || Math.round((birdsAliveTotal || birdsAlive) * 0.003),
    mortalityTargetMonth: getTarget("mortality", "month") || 0,
    mortalityTargetYear: getTarget("mortality", "year") || 0,
    hatchabilityTarget: getTarget("hatchability", "week") || 85,
    hatchabilityTargetMonth: getTarget("hatchability", "month") || 85,
    fertilityTarget: getTarget("fertility", "month") || 90,
    feedCostKgTarget: getTarget("feed_cost_kg", "week") || 0,
    costPerChickTarget: getTarget("cost_per_chick", "week") || 0,
    sellingPriceTarget: getTarget("selling_price_chick", "week") || 0,
    eggsSetWeekTarget: getTarget("eggs_set", "week") || 0,
    eggsSetMonthTarget: getTarget("eggs_set", "month") || 0,
    goodChicksWeekTarget: getTarget("good_chicks", "week") || 0,
    goodChicksMonthTarget: getTarget("good_chicks", "month") || 0,
    feedProducedTarget: getTarget("feed_produced", "month") || 0,
    confirmedOrdersWeekTarget: getTarget("confirmed_orders", "week") || 0,
    confirmedOrdersMonthTarget: getTarget("confirmed_orders", "month") || 0,

    mortalityPct, worstFarm,
    feedIntakeTonsWeek: parseFloat(feedIntakeTonsWeek.toFixed(1)),
    feedIntakeTons: parseFloat(feedIntakeTonsMonth.toFixed(1)),
    feedIntakeTonsMonth: parseFloat(feedIntakeTonsMonth.toFixed(1)),
    feedIntakeTonsYear: parseFloat(feedProducedYearMT.toFixed(1)),
    feedCostTotal: feedExpenseMonth > 0 ? feedExpenseMonth : feedIntakeTonsMonth * 1000 * 285,
    costPerFeedKg,
    feedCostKgFromTarget,        // the target-config set price specifically
    feedCostKgSource: feedCostKgFromTarget > 0 ? "Target Config" : "Auto",
    // costPerFeedKg,
    eggsThisWeek, eggsThisMonth, eggsThisYear,
    hatchingEggsWeek, hatchingEggsMonth,
    hatchingEggsAvailableWeek: Math.round(hatchingEggsWeek * 0.63),
    hatchingEggsAvailableMonth: Math.round(hatchingEggsMonth * 0.63),
    storageEggsAvailable: totalStorageEggs,
    farmRejectedEggs,farmRejectedEggsWeek, farmRejectedEggsMonth,farmRejectedEggsYear, crackedEggs, dirtyEggs, floorEggs,
    avgEggProductionRate,
    goodChicksWeek, goodChicksMonth, goodChicksYear,
    goodChicksLastWeek, goodChicksLastMonth,
    totalDOC,
    hatchabilityWeek, hatchabilityMonth, hatchabilityYear,
    hatchabilityPrev: parseFloat((hatchabilityMonth * 0.98).toFixed(1)),
    confirmedOrdersWeek, confirmedOrdersMonth, confirmedOrdersYear,
    confirmedChicksWeek, confirmedChicksMonth, confirmedChicksYear,
    pendingOrdersWeek, pendingOrdersMonth,
    pendingChicksWeek, pendingChicksMonth,
    revenueWeek, revenueMonth, revenueYear,
    cashReceivedWeek, cashReceivedMonth, cashReceivedYear,
    hatchingEggsYear,
    costPerHatchingEgg,
    costPerHatchingEggWeek,
    costPerHatchingEggMonth,
    costPerHatchingEggYear,
    sellingPxHatchingEggWeek,
    sellingPxHatchingEggMonth,
    sellingPxHatchingEggYear,
    costPerChickWeek,
    costPerChickMonth,
    costPerChickYear,
    chickSellingPxWeek,
    chickSellingPxMonth,
    chickSellingPxYear,
    hatchingEggMarginPct,
    chickSellingMarginPct,
    salaryExpenseMonth,
    costPerChickLastWeek: costPerChickLastWk,
    sellingPriceHatchingEgg,
    hatchingEggCatPrice,
    maxChickPriceWeek,   // ADD
    maxChickPriceMonth,  // ADD
    maxChickPriceYear,
    sellingPriceWeek,
    sellingPriceLastWeek,
            hatchForecastWeek: hatchForecastWeek,
      hatchForecastMonth: hatchForecastMonth,
      hatchForecastYear: hatchForecastYear,
    // hatchForecastWeek: eggsSetWeek,
    // hatchForecastMonth: eggsSetMonth,
    // hatchForecastYear: eggsSetYear,
    criticalIssues: alerts.filter((a) => a.type === "critical").length,
  },
  feedDeliveries: {
    // Actual invoiced delivery costs
    costWeek: feedDeliveryCostWeek,
    costMonth: feedDeliveryCostMonth,
    costYear: feedDeliveryCostYear,
    kgWeek: feedDeliveryKgWeek,
    kgMonth: feedDeliveryKgMonth,
    kgYear: feedDeliveryKgYear,
    costPerKg: costPerFeedKgFromDeliveries,
    byFarm: feedDeliveryByFarm,
    byBreed: feedDeliveryByBreed,
    breedCostWeek: breedFeedCostWeek,
    breedCostMonth: breedFeedCostMonth,
    breedCostYear: breedFeedCostYear,
    breedKgWeek: breedFeedKgWeek,
    breedKgMonth: breedFeedKgMonth,
    breedKgYear: breedFeedKgYear,
    recent: recentFeedDeliveries,

    setPrice: costPerFeedKg,              // client-set price per kg
    setSource: feedCostKgFromTarget > 0   // where the price came from
      ? "Target Config"
      : costPerFeedKgFromDeliveries > 0
        ? "Feed Deliveries (auto)"
        : "Product Catalogue (auto)",

    // Consumed kg (from daily ops)
    consumedKgWeek: feedKgWeekFromOps,
    consumedKgMonth: feedKgMonthFromOps,
    consumedKgYear: feedKgYearFromOps,

    // Consumed cost = consumed kg × set price
    consumedCostWeek,
    consumedCostMonth,
    consumedCostYear,

    // Variance = actual delivery - consumed standard cost
    varianceWeek: feedCostVarianceWeek,
    varianceMonth: feedCostVarianceMonth,
    varianceYear: feedCostVarianceYear,
  },

  operationalRequests: {
    expenseWeek: opExpenseWeek,
    expenseMonth: opExpenseMonth,
    expenseYear: opExpenseYear,
    paidMonth: opExpensePaidMonth,
    pendingCount: pendingPaymentsCount,
    approvedNotPaid: approvedNotPaidCount,
    byCategory: opExpenseByCategoryMonth,
    byFarm: opExpenseByFarmMonth,
    recent: recentOpRequests,
  },

  hatchery: {
        overallHatchabilityPct: overallHatchPct,
  overallBatchesCompleted: completedForAlert.length,
    eggsSetWeek, eggsSetMonth, eggsSetYear,
    eggsSetLastWeek, eggsSetLastMonth,
    hatchDueWeek: goodChicksWeek, hatchDueMonth: goodChicksMonth,
    hatchabilityWeek, hatchabilityMonth, hatchabilityYear,
    hatchabilityPrev: parseFloat((hatchabilityMonth * 0.98).toFixed(1)),
    goodChicks: goodChicksWeek, poorChicks: Math.round(poorChicksMonth / 4),
    goodChicksMonth, goodChicksYear, fertilityRate,
    infertilityRate: parseFloat((100 - fertilityRate).toFixed(1)),
    weeklyTrend: hatchWeeklyTrend.length >= 2 ? hatchWeeklyTrend : [{ w: "Batch 1", set: 0, fertile: 0, hatched: 0 }],
    allBatches: allBatchesExport,   // ← ADD THIS LINE

        hatchOutputWeek: goodChicksWeek,           // ACTUAL — raw count, not a %
    hatchOutputMonth: goodChicksMonth,

    activeHatchPipelineEggs,                   // PIPELINE — not yet hatched
    activeHatchPipelineBatches,

    forecastChicksNext21,                      // CAPACITY — planning figure
    forecastEggsNext21,
    forecastBatchesNext21,
    referenceHatchRatePct: parseFloat((referenceHatchRate * 100).toFixed(1)),

    // Top example batch for the "True Hatchability" explainer card
    trueHatchExampleBatch: (() => {
      const completedThisWeek = Object.entries(hatchBatchMap)
        .filter(([, b]) => b.hatchedDateRaw && b.hatchedDateRaw >= weekStart && b.hatchedDateRaw <= weekEnd && b.hatched > 0);
      if (completedThisWeek.length === 0) return null;
      const [batch, b] = completedThisWeek[0];
      return {
        batch, set: b.set, hatched: b.hatched,
        pct: parseFloat(((b.hatched / b.set) * 100).toFixed(1)),
      };
    })(),

  },

  feedmill: {
    producedWeekMT: parseFloat(feedProducedWeekMT.toFixed(1)),
    producedMT: parseFloat(feedProducedMT.toFixed(1)),
    producedDay: parseFloat((feedProducedMT / 30).toFixed(1)),
    producedYearMT: parseFloat(feedProducedYearMT.toFixed(1)),
    issuedWeek: parseFloat(feedIssuedWeekMT.toFixed(1)),
    issuedMonth: parseFloat(feedIssuedMT.toFixed(1)),
    productionVsDemand: feedProducedMT > 0 ? parseFloat(((feedIssuedMT / feedProducedMT) * 100).toFixed(1)) : 0,
    rawMaterialEff: null, machineUptime: null,
    trend: feedTrend.length > 0 ? feedTrend : [{ d: "Mon", prod: 0, issued: 0 }],
  },

  sales: {
    confirmedWeek: confirmedOrdersWeek, confirmedMonth: confirmedOrdersMonth, confirmedYear: confirmedOrdersYear,
    confirmedChicksWeek, confirmedChicksMonth, confirmedChicksYear,
    pendingWeek: pendingOrdersWeek, pendingMonth: pendingOrdersMonth,
    pendingChicksWeek, pendingChicksMonth,
    ordersVsProduction: goodChicksMonth > 0 && confirmedOrdersMonth > 0
      ? parseFloat(Math.min(100, (confirmedOrdersMonth / goodChicksMonth) * 100).toFixed(1)) : 0,
    fulfilledPct: confirmedOrdersMonth + pendingOrdersMonth > 0
      ? parseFloat(((confirmedOrdersMonth / (confirmedOrdersMonth + pendingOrdersMonth)) * 100).toFixed(1)) : 0,
    c4uConfirmedOrders, c4uPendingOrdersCount,
    c4uConfirmedWeek: c4uConfirmedWeekCount, c4uConfirmedMonth: c4uConfirmedMonthCount,
    c4uPendingWeek: c4uPendingWeekCount, c4uPendingMonth: c4uPendingMonthCount,
    c4uRegionalDemand: c4uRegionalDemand.length > 0 ? c4uRegionalDemand : [],
    combinedConfirmedWeek: confirmedOrdersWeek + c4uConfirmedWeekCount,
    combinedConfirmedMonth: confirmedOrdersMonth + c4uConfirmedMonthCount,
    combinedPendingWeek: pendingOrdersWeek + c4uPendingWeekCount,
    combinedPendingMonth: pendingOrdersMonth + c4uPendingMonthCount,
    combinedRegionalDemand: combinedRegionalDemand.length > 0 ? combinedRegionalDemand : [{ region: "No Data", orders: 0, color: C.blue }],
    regionalDemand: regionalDemand.length > 0 ? regionalDemand : [{ region: "No Data", orders: 0, color: C.blue }],
    top20: top20Customers,
    avgSellingChick: avgSellingPriceChick,
    avgSellingEgg: avgSellingPriceEgg,
  },

  finance: {
    cashReceivedWeek, cashReceivedMonth, cashReceivedYear,
    receivablesWeek: Math.round(receivablesWeek),
    receivablesMonth: Math.round(receivablesMonth),
    receivablesTotal: Math.round(receivablesTotal),
    totalExpenseWeek, totalExpenseMonth, totalExpenseYear,
    payablesWeek: Math.round(totalExpenseWeek * 0.3),
    payablesMonth: Math.round(totalExpenseMonth * 0.3),
    // grossMargin, margins,
    grossMargin: grossMarginFinal,
    margins,
    budgetVsActual: budgetVsActual.length > 0 ? budgetVsActual : [],
    pendingPayments: pendingPaymentsCount,
    approvedNotPaid: approvedNotPaidCount,
    revenueWeek: poultryRevenueWeek,
  revenueMonth: poultryRevenueMonth,
  revenueYear: poultryRevenueYear,
  c4uRevenueWeek, c4uRevenueMonth, c4uRevenueYear,
  combinedRevenueWeek:  poultryRevenueWeek  + c4uRevenueWeek,
  combinedRevenueMonth: poultryRevenueMonth + c4uRevenueMonth,
  combinedRevenueYear:  poultryRevenueYear  + c4uRevenueYear, 
      // Combined = already merged into revenueWeek/Month/Year above
  },

  inventory: {
    rawMaterialDays: feedIssuedMT > 0 ? Math.round(feedProducedMT / (feedIssuedMT / 30)) : 0,
    finishedFeedTons: parseFloat(feedProducedMT.toFixed(1)),
    vaccineStatus: criticalStock.some((s) => s.status === "Critical") ? "Critical"
      : criticalStock.some((s) => s.status === "Low") ? "Low" : "OK",
    eggTrays: 0, chickBoxes: 0,
    criticalAlerts: criticalStock.slice(0, 5),
    pendingPOs: pendingPaymentsCount, supplierDelays: 0,
    productStockList: productStockList.slice(0, 10),
  },

  alerts,

  workforce: {
    staffTurnoutToday: activeStaff - staffOnLeaveToday,
    totalStaff, activeStaff,
    staffOnLeave: staffOnLeaveToday,
    leaveThisWeek, leaveThisMonth, absenteeismPct,
    overtime: null, extendedHours: null,
    openHRIssues: openLeaveRequests, deptProductivity,
    leaveByDept: Object.entries(leaveByDept).map(([dept, count]) => ({ dept, count })).sort((a, b) => b.count - a.count),
  },

  eggsWeeklyTrend,

  chicken4u: {
    muo: { total: muoProfiles.length, male: muoMale, female: muoFemale, sspTotal },
    learners: certifiedLearners,
    sales: {
      grangers: c4uGrangers, layers: c4uLayers, broilers: c4uBroilers,
      grangerBreeds: c4uGrangerBreeds, layerBreeds: c4uLayerBreeds, broilerBreeds: c4uBroilerBreeds,
      grangerBreedsDel: c4uGrangerBreedsDel, layerBreedsDel: c4uLayerBreedsDel, broilerBreedsDel: c4uBroilerBreedsDel,
      grangerBreedsPend: c4uGrangerBreedsPend, layerBreedsPend: c4uLayerBreedsPend, broilerBreedsPend: c4uBroilerBreedsPend,
      grangersDelivered: c4uGrangersDel, layersDelivered: c4uLayersDel, broilersDelivered: c4uBroilersDel,
      grangersPending: c4uGrangersPend, layersPending: c4uLayersPend, broilersPending: c4uBroilersPend,
      chicksOrdered: c4uGrangers + c4uLayers + c4uBroilers,
      chicksDelivered: c4uGrangersDel + c4uLayersDel + c4uBroilersDel,
      chicksPending: c4uGrangersPend + c4uLayersPend + c4uBroilersPend,
      feedKgOrdered: c4uFeedKgOrdered, feedKgDelivered: c4uFeedKgDelivered, feedKgPending: c4uFeedKgPending,
      ordersDelivered: c4uOrdersDel, ordersPending: c4uOrdersPend,
      allProducts: c4uAllProducts, topMuos: c4uTopMuos, topSatos: c4uTopSatos, 
        totalSatoCommissionPayable,
        satoCommissionByMonth: c4uSatoCommissionByMonth,
satoCommissionConfig: {
  grangerRate:    satoGrangerCommission,
  layerRate:      satoLayerCommission,
  broilerRate:    satoBroilerCommission,
  layerTarget:    satoLayerTarget,
  broilerTarget:  satoBroilerTarget,
},
      pendingWeek: { qty: c4uPendingWeekQty, orders: seenWeekOrders.size, list: c4uPendingWeekList.slice(0, 20) },
      pendingMonth: { qty: c4uPendingMonthQty, orders: seenMonthOrders.size, list: c4uPendingMonthList.slice(0, 20) },
    },
  },
};
}


/* ══════════════════════════════════════════════════════
   computePrevPeriod
   Reads already-loaded data and computes previous period
   values by scanning monthlyOpsData / monthlyHatchData /
   monthlyFinData.  No Zoho calls needed.
══════════════════════════════════════════════════════ */
function computePrevPeriod(data, selectedYear) {
  if (!data) return null;

  const now        = new Date();
  const currentYear= now.getFullYear();
  const year       = selectedYear || currentYear;
  const isPastYear = selectedYear && selectedYear !== currentYear;

  // ── Reproduce the same week/month bounds as getDateBounds ──
  let weekStart, weekEnd, monthStart, monthEnd;
  if (isPastYear) {
    weekStart  = new Date(year, 0, 1);
    weekEnd    = new Date(year, 11, 31, 23, 59, 59, 999);
    monthStart = weekStart;
    monthEnd   = weekEnd;
  } else {
    const dow = now.getDay();
    const daysFromFriday = dow === 5 ? 0 : dow === 6 ? 1 : dow + 2;
    weekStart = new Date(now);
    weekStart.setDate(now.getDate() - daysFromFriday);
    weekStart.setHours(0,0,0,0);
    weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23,59,59,999);
    monthStart = new Date(year, now.getMonth(), 1);
    monthEnd   = new Date(year, now.getMonth() + 1, 0);
    monthEnd.setHours(23,59,59,999);
  }

  // ── Previous period bounds ──
  const prevWeekStart = new Date(weekStart);
  prevWeekStart.setDate(prevWeekStart.getDate() - 7);
  const prevWeekEnd = new Date(weekEnd);
  prevWeekEnd.setDate(prevWeekEnd.getDate() - 7);

  const prevMonthStart = new Date(monthStart);
  prevMonthStart.setMonth(prevMonthStart.getMonth() - 1);
  const prevMonthEnd = new Date(monthStart);
  prevMonthEnd.setDate(prevMonthEnd.getDate() - 1);
  prevMonthEnd.setHours(23,59,59,999);

  const prevYearStart = new Date(year - 1, 0, 1);
  const prevYearEnd   = new Date(year - 1, 11, 31, 23, 59, 59, 999);

  // ── Helper: YYYY-MM key range ──
  function keysInRange(fromDate, toDate) {
    const keys = [];
    let d = new Date(fromDate.getFullYear(), fromDate.getMonth(), 1);
    const end = new Date(toDate.getFullYear(), toDate.getMonth(), 1);
    while (d <= end) {
      keys.push(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`);
      d.setMonth(d.getMonth() + 1);
    }
    return keys;
  }

  function sumKeys(map, keys, field) {
    return keys.reduce((s, k) => s + ((map[k]||{})[field]||0), 0);
  }

  // ── Resolve keys for each period ──
  const curWeekKeys   = keysInRange(weekStart,  weekEnd);
  const curMonthKeys  = keysInRange(monthStart, monthEnd);
  const curYearKeys   = keysInRange(new Date(year,0,1), new Date(year,11,31));
  const prevWeekKeys  = keysInRange(prevWeekStart,  prevWeekEnd);
  const prevMonthKeys = keysInRange(prevMonthStart, prevMonthEnd);
  const prevYearKeys  = keysInRange(prevYearStart,  prevYearEnd);

  const ops   = data.monthlyOpsData   || {};
  const hatch = data.monthlyHatchData || {};
  const fin   = data.monthlyFinData   || {};

  // ── Helper: hatchability from keys ──
  function hatchabilityFromKeys(keys) {
    const set   = sumKeys(hatch, keys, "eggsSet");
    const chicks= sumKeys(hatch, keys, "goodChicks");
    return set > 0 ? parseFloat(((chicks / set) * 100).toFixed(1)) : 0;
  }

  // ── Labels ──
  const weekLabel = isPastYear
    ? String(year)
    : `${prevWeekStart.toLocaleDateString("en-US",{month:"short",day:"numeric"})}–`+
      `${prevWeekEnd.toLocaleDateString("en-US",{month:"short",day:"numeric"})}`;

  const monthLabel = isPastYear
    ? String(year - 1)
    : prevMonthStart.toLocaleDateString("en-US",{month:"long",year:"numeric"});

  const yearLabel = String(year - 1);

  return {
    // Labels
    weekLabel, monthLabel, yearLabel,

    // ── Eggs ──
    eggsWeek:  sumKeys(ops, prevWeekKeys,  "eggs"),
    eggsMonth: sumKeys(ops, prevMonthKeys, "eggs"),
    eggsYear:  sumKeys(ops, prevYearKeys,  "eggs"),

    // ── Hatching eggs ──
    hatchingEggsWeek:  sumKeys(ops, prevWeekKeys,  "hatchable"),
    hatchingEggsMonth: sumKeys(ops, prevMonthKeys, "hatchable"),

    // ── Mortality ──
    mortalityWeek:  sumKeys(ops, prevWeekKeys,  "mort"),
    mortalityMonth: sumKeys(ops, prevMonthKeys, "mort"),
    mortalityYear:  sumKeys(ops, prevYearKeys,  "mort"),

    // ── Feed ──
    feedKgWeek:  sumKeys(ops, prevWeekKeys,  "feedKg"),
    feedKgMonth: sumKeys(ops, prevMonthKeys, "feedKg"),
    feedMTWeek:  parseFloat((sumKeys(ops, prevWeekKeys,  "feedKg")/1000).toFixed(1)),
    feedMTMonth: parseFloat((sumKeys(ops, prevMonthKeys, "feedKg")/1000).toFixed(1)),

    // ── Hatchery ──
    eggsSetWeek:      sumKeys(hatch, prevWeekKeys,  "eggsSet"),
    eggsSetMonth:     sumKeys(hatch, prevMonthKeys, "eggsSet"),
    goodChicksWeek:   sumKeys(hatch, prevWeekKeys,  "goodChicks"),
    goodChicksMonth:  sumKeys(hatch, prevMonthKeys, "goodChicks"),
    goodChicksYear:   sumKeys(hatch, prevYearKeys,  "goodChicks"),
    hatchabilityWeek:  hatchabilityFromKeys(prevWeekKeys),
    hatchabilityMonth: hatchabilityFromKeys(prevMonthKeys),
    fertilityWeek:  sumKeys(hatch, prevWeekKeys,  "fertile"),
    fertilityMonth: sumKeys(hatch, prevMonthKeys, "fertile"),

    // ── Finance ──
    revenueWeek:  sumKeys(fin, prevWeekKeys,  "revenue"),
    revenueMonth: sumKeys(fin, prevMonthKeys, "revenue"),
    revenueYear:  sumKeys(fin, prevYearKeys,  "revenue"),
    cashWeek:     sumKeys(fin, prevWeekKeys,  "cashIn"),
    cashMonth:    sumKeys(fin, prevMonthKeys, "cashIn"),
    expenseWeek:  sumKeys(fin, prevWeekKeys,  "expense"),
    expenseMonth: sumKeys(fin, prevMonthKeys, "expense"),
    expenseYear:  sumKeys(fin, prevYearKeys,  "expense"),

    // ── For feed cost, use feedDeliveries byBreed data ──
    // (approximated from monthly ops feed cost)
    feedCostWeek:  parseFloat(
      (sumKeys(ops, prevWeekKeys,  "feedKg") *
       (data.kpi?.costPerFeedKg || 0)).toFixed(0)),
    feedCostMonth: parseFloat(
      (sumKeys(ops, prevMonthKeys, "feedKg") *
       (data.kpi?.costPerFeedKg || 0)).toFixed(0)),

    // ── Current period mirrors (for the comparison table) ──
    cur: {
      eggsWeek:  sumKeys(ops, curWeekKeys,  "eggs"),
      eggsMonth: sumKeys(ops, curMonthKeys, "eggs"),
      eggsYear:  sumKeys(ops, curYearKeys,  "eggs"),
      hatchingEggsWeek:  sumKeys(ops, curWeekKeys,  "hatchable"),
      hatchingEggsMonth: sumKeys(ops, curMonthKeys, "hatchable"),
      mortalityWeek:  sumKeys(ops, curWeekKeys,  "mort"),
      mortalityMonth: sumKeys(ops, curMonthKeys, "mort"),
      mortalityYear:  sumKeys(ops, curYearKeys,  "mort"),
      eggsSetWeek:    sumKeys(hatch, curWeekKeys,  "eggsSet"),
      eggsSetMonth:   sumKeys(hatch, curMonthKeys, "eggsSet"),
      goodChicksWeek:  sumKeys(hatch, curWeekKeys,  "goodChicks"),
      goodChicksMonth: sumKeys(hatch, curMonthKeys, "goodChicks"),
      goodChicksYear:  sumKeys(hatch, curYearKeys,  "goodChicks"),
      hatchabilityWeek:  hatchabilityFromKeys(curWeekKeys),
      hatchabilityMonth: hatchabilityFromKeys(curMonthKeys),
      revenueWeek:  sumKeys(fin, curWeekKeys,  "revenue"),
      revenueMonth: sumKeys(fin, curMonthKeys, "revenue"),
      revenueYear:  sumKeys(fin, curYearKeys,  "revenue"),
      cashWeek:     sumKeys(fin, curWeekKeys,  "cashIn"),
      cashMonth:    sumKeys(fin, curMonthKeys, "cashIn"),
      expenseWeek:  sumKeys(fin, curWeekKeys,  "expense"),
      expenseMonth: sumKeys(fin, curMonthKeys, "expense"),
    },
  };
}




/* ══════════════════════════════════════════════════════
   applyCustomRange
   Filters monthly aggregated data to a from→to window.
   Returns a summary object with the same shape as
   individual kpi/hatchery/finance fields so sections
   can consume it uniformly.
══════════════════════════════════════════════════════ */
function applyCustomRange(data, customFrom, customTo) {
  if (!data || !customFrom || !customTo) return null;

  const from = new Date(customFrom); from.setHours(0,0,0,0);
  const to   = new Date(customTo);   to.setHours(23,59,59,999);

  function keysInRange(fromDate, toDate) {
    const keys = [];
    let d = new Date(fromDate.getFullYear(), fromDate.getMonth(), 1);
    const end = new Date(toDate.getFullYear(), toDate.getMonth(), 1);
    while (d <= end) {
      keys.push(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`);
      d.setMonth(d.getMonth() + 1);
    }
    return keys;
  }
  function sumKeys(map, keys, field) {
    return keys.reduce((s,k) => s + ((map[k]||{})[field]||0), 0);
  }

  const keys  = keysInRange(from, to);
  const ops   = data.monthlyOpsData   || {};
  const hatch = data.monthlyHatchData || {};
  const fin   = data.monthlyFinData   || {};

  const eggsSet   = sumKeys(hatch, keys, "eggsSet");
  const goodChicks= sumKeys(hatch, keys, "goodChicks");
  const fertile   = sumKeys(hatch, keys, "fertile");
  const revenue   = sumKeys(fin,   keys, "revenue");
  const expense   = sumKeys(fin,   keys, "expense");
  const feedKg    = sumKeys(ops,   keys, "feedKg");

  // Previous period = same duration shifted back
  const durationMs = to - from;
  const prevFrom   = new Date(from - durationMs);
  const prevTo     = new Date(from.getTime() - 1);
  const prevKeys   = keysInRange(prevFrom, prevTo);

  const prevEggs      = sumKeys(ops,   prevKeys, "eggs");
  const prevGoodChicks= sumKeys(hatch, prevKeys, "goodChicks");
  const prevRevenue   = sumKeys(fin,   prevKeys, "revenue");
  const prevExpense   = sumKeys(fin,   prevKeys, "expense");
  const prevMort      = sumKeys(ops,   prevKeys, "mort");

  const fmtDate = d => d.toLocaleDateString("en-US",
    {month:"short",day:"numeric",year:"numeric"});

  return {
    from, to, keys,
    rangeLabel:     `${fmtDate(from)} → ${fmtDate(to)}`,
    prevRangeLabel: `${fmtDate(prevFrom)} → ${fmtDate(prevTo)}`,

    // Production
    eggs:       sumKeys(ops,   keys, "eggs"),
    hatchable:  sumKeys(ops,   keys, "hatchable"),
    mortality:  sumKeys(ops,   keys, "mort"),
    feedKg,
    feedMT:     parseFloat((feedKg/1000).toFixed(1)),

    // Hatchery
    eggsSet,
    goodChicks,
    fertile,
    hatchabilityPct: eggsSet > 0
      ? parseFloat(((goodChicks/eggsSet)*100).toFixed(1)) : 0,
    fertilityPct: eggsSet > 0
      ? parseFloat(((fertile/eggsSet)*100).toFixed(1)) : 0,

    // Finance
    revenue,
    expense,
    cashIn:  sumKeys(fin, keys, "cashIn"),
    profit:  revenue - expense,
    grossMarginPct: revenue > 0
      ? parseFloat((((revenue-expense)/revenue)*100).toFixed(1)) : 0,

    // Previous period (same duration, shifted back)
    prev: {
      eggs:       prevEggs,
      goodChicks: prevGoodChicks,
      mortality:  prevMort,
      revenue:    prevRevenue,
      expense:    prevExpense,
      rangeLabel: `${fmtDate(prevFrom)} → ${fmtDate(prevTo)}`,
    },

    // Monthly breakdown for trend chart
    monthlyBreakdown: keys.map(k => ({
      label: k,
      eggs:       (ops[k]||{}).eggs       || 0,
      goodChicks: (hatch[k]||{}).goodChicks|| 0,
      mort:       (ops[k]||{}).mort       || 0,
      revenue:    (fin[k]||{}).revenue    || 0,
      expense:    (fin[k]||{}).expense    || 0,
      feedKg:     (ops[k]||{}).feedKg     || 0,
    })),
  };
}



/* ══════════════════════════════════════════════════════
   doExcel  — full data export (drop-in replacement)
══════════════════════════════════════════════════════ */

async function doExcel(data, selectedYear, selectedBreed = "All Breeds", selectedFarm = "All Farms") {
  await loadScript("https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js");
  const XLSX = window.XLSX;
  if (!XLSX) { alert("SheetJS failed to load"); return; }

  // ── Resolve active filters ──────────────────────────────────────────────
  const isBreedFiltered = selectedBreed !== "All Breeds";
  const isFarmFiltered  = selectedFarm  !== "All Farms";
  const isFiltered      = isBreedFiltered || isFarmFiltered;

  const filterLabel = isFiltered
    ? [
        isFarmFiltered  ? `Farm: ${selectedFarm}`   : null,
        isBreedFiltered ? `Breed: ${selectedBreed}` : null,
      ].filter(Boolean).join(" · ")
    : "All Farms · All Breeds (Unfiltered)";

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

  // ── Helper: pick filtered or global value (returns 0 if null) ───────────
  const kpi = (globalVal, filteredVal) =>
    isFiltered ? (filteredVal ?? 0) : (globalVal ?? 0);

  // ── Filtered birds placed ────────────────────────────────────────────────
  const filteredBirdsPlaced = isBreedFiltered
    ? (data?.breedMap?.[selectedBreed] || 0)
    : isFarmFiltered
      ? (data?.farmBirdsPlacedMap?.[selectedFarm] || 0)
      : (data?.kpi?.totalBirdsPlaced || 0);

  const wb = XLSX.utils.book_new();
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

  const now = new Date().toLocaleString("en-US");
  const curYear  = selectedYear || new Date().getFullYear();
  const prevYear = curYear - 1;

  // ── Filtered hatchery values ─────────────────────────────────────────────
  const eggsSetWk  = hD ? hD.eggsSetWeek  : h.eggsSetWeek;
  const eggsSetMo  = hD ? hD.eggsSetMonth : h.eggsSetMonth;
  const eggsSetYr  = hD ? hD.eggsSetYear  : h.eggsSetYear;
  const goodChkWk  = hD ? hD.goodChicksWeek  : k.goodChicksWeek;
  const goodChkMo  = hD ? hD.goodChicksMonth : k.goodChicksMonth;
  const goodChkYr  = hD ? hD.goodChicksYear  : k.goodChicksYear;
  const hatchPctWk = eggsSetWk > 0 ? parseFloat(((goodChkWk / eggsSetWk) * 100).toFixed(1)) : h.hatchabilityWeek;
  const hatchPctMo = eggsSetMo > 0 ? parseFloat(((goodChkMo / eggsSetMo) * 100).toFixed(1)) : h.hatchabilityMonth;

  // ── Filtered feed values ─────────────────────────────────────────────────
  const feedKgWk = eD ? eD.feedKgWeek  : (k.feedIntakeTonsWeek  || 0) * 1000;
  const feedKgMo = eD ? eD.feedKgMonth : (k.feedIntakeTons      || 0) * 1000;
  const feedKgYr = eD ? eD.feedKgYear  : (k.feedIntakeTonsYear  || 0) * 1000;

  const add = (name, rows) => {
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws["!cols"] = rows[0]?.map((_, i) => ({
      wch: Math.max(18, ...rows.map((r) => String(r[i] ?? "").length + 4)),
    }));
    XLSX.utils.book_append_sheet(wb, ws, name.slice(0, 31));
  };

  // ── Filter banner rows (prepended to every sheet) ────────────────────────
  const filterBanner = [
    ["WAFAD GROUP – Executive Dashboard Export"],
    [`Generated: ${now}`],
    [`Year: ${curYear}`],
    [`Active Filter: ${filterLabel}`],
    isFiltered ? [`⚠ Data shown is filtered. To see all data, export with "All Farms · All Breeds" selected.`] : [],
    [],
  ].filter(r => r.length > 0);

  /* All batches */
  // const ALL_BATCHES = (h.allBatches && h.allBatches.length > 0)
  //   ? h.allBatches
  //   : (h.weeklyTrend || []).map(w => ({
  //       batch: w.w, set: w.set, fertile: w.fertile, hatched: w.hatched,
  //       hatchPct: w.set > 0 ? parseFloat(((w.hatched / w.set) * 100).toFixed(1)) : 0,
  //       settingDate: "—", hatchedDate: "—", scheduledDate: "—",
  //     }));

  const ALL_BATCHES_RAW = (h.allBatches && h.allBatches.length > 0)
    ? h.allBatches
    : (h.weeklyTrend || []).map(w => ({
        batch   : w.w,
        set     : w.set,
        fertile : w.fertile,
        hatched : w.hatched,
        hatchPct: w.set > 0 ? parseFloat(((w.hatched / w.set) * 100).toFixed(1)) : 0,
      }));

const ALL_BATCHES = [...ALL_BATCHES_RAW].sort((a, b) => {
  const da = a.settingDate ? new Date(a.settingDate) : new Date(0);
  const db = b.settingDate ? new Date(b.settingDate) : new Date(0);
  return da - db; // ascending: oldest set date first
});


  const completedBatches = ALL_BATCHES.filter(
  b => b.hatched > 0 || (b.hatchedDate && b.hatchedDate !== "—" && b.hatched > 0)
);
const activeBatches = ALL_BATCHES.filter(
  b => b.hatched === 0 && b.set > 0
);
const pendingBatches = activeBatches.filter(
  b => !b.hatchedDate || b.hatchedDate === "—"
);
const dueNotHatchedBatches = activeBatches.filter(
  b => b.hatchedDate && b.hatchedDate !== "—" && b.hatched === 0
);


  /* ── 1. Executive KPIs ──────────────────────────────────────────────────── */
  add("Executive KPIs", [
    ...filterBanner,
    ["── FLOCK ──"],
    ["KPI", "Week", "Month", "Year", "Target (Wk)", "Status"],
    ["Total Birds Placed", filteredBirdsPlaced, "", "", "", ""],
    ["Pullets Housed",     isFiltered ? "—" : k.totalPulletsHoused,  "", "", "", ""],
    ["Cockerels Housed",   isFiltered ? "—" : k.totalCockerelsHoused,"", "", "", ""],
    ["Female Alive (Current)", isFiltered ? "—" : k.femaleAlive, "", "", "", ""],
    ["Male Alive (Current)",   isFiltered ? "—" : k.maleAlive,   "", "", "", ""],
    ["Birds Alive Total",  isFiltered ? "—" : k.birdsAlive, "", "", "", ""],
    [],
    ["── PRODUCTION ──"],
    ["KPI", "Week", "Month", "Year", "Target (Wk)", "Status"],
    ["Eggs Produced",
      kpi(k.eggsThisWeek,  eD?.eggsWeek),
      kpi(k.eggsThisMonth, eD?.eggsMonth),
      kpi(k.eggsThisYear,  eD?.eggsYear),
      k.eggsWeekTarget,
      kpi(k.eggsThisWeek, eD?.eggsWeek) >= k.eggsWeekTarget ? "On Target" : "Below"],
    ["Hatching Eggs",
      kpi(k.hatchingEggsWeek,  eD?.hatchableWeek),
      kpi(k.hatchingEggsMonth, eD?.hatchableMonth),
      kpi(k.hatchingEggsYear,  0), "", ""],
    ["Storage Eggs Available",
      isBreedFiltered ? (data?.breedStorageEggs?.[selectedBreed] || 0) : k.storageEggsAvailable,
      "", "", "", ""],
    ["Farm Rejected Eggs (Wk/Mo/Yr)",
      kpi(k.farmRejectedEggsWeek,  eD?.farmRejectedWeek),
      kpi(k.farmRejectedEggsMonth, eD?.farmRejectedMonth),
      kpi(k.farmRejectedEggsYear,  eD?.farmRejectedYear), "", ""],
    ["Farm Rejected Eggs (Cumulative)", isFiltered ? (eD?.farmRejectedTotal ?? 0) : k.farmRejectedEggs, "", "", "", ""],
    ["Cracked Eggs",  isFiltered ? (eD?.crackedTotal ?? "—") : k.crackedEggs, "", "", "", ""],
    ["Dirty Eggs",    isFiltered ? (eD?.dirtyTotal   ?? "—") : k.dirtyEggs,   "", "", "", ""],
    ["Floor Eggs",    isFiltered ? (eD?.floorTotal   ?? "—") : k.floorEggs,   "", "", "", ""],
    ["Avg Egg Production Rate %", k.avgEggProductionRate, "", "", "", ""],
    [],
    ["── MORTALITY ──"],
    ["KPI", "Week", "Month", "Year", "Target (Wk)", "Status"],
    ["Total Mortality",
      kpi(k.mortalityThisWeek,  eD?.mortalityWeek),
      kpi(k.mortalityThisMonth, eD?.mortalityMonth),
      kpi(k.mortalityThisYear,  eD?.mortalityYear),
      k.mortalityTarget,
      kpi(k.mortalityThisWeek, eD?.mortalityWeek) <= k.mortalityTarget ? "OK" : "Over"],
    ["Female Mortality (Px) — Wk/Mo/Yr",
      kpi(k.mortalityFemaleWeek,  eD?.mortalityFemale ?? 0),
      kpi(k.mortalityFemaleMonth, eD?.mortalityFemale ?? 0),
      kpi(k.mortalityFemaleYear,  eD?.mortalityFemale ?? 0), "", ""],
    ["Male Mortality (Cx) — Wk/Mo/Yr",
      kpi(k.mortalityMaleWeek,  eD?.mortalityMale ?? 0),
      kpi(k.mortalityMaleMonth, eD?.mortalityMale ?? 0),
      kpi(k.mortalityMaleYear,  eD?.mortalityMale ?? 0), "", ""],
    ["Female Mortality (Cumulative)", isFiltered ? (eD?.mortalityFemale ?? 0) : k.mortalityFemale, "", "", "", ""],
    ["Male Mortality (Cumulative)",   isFiltered ? (eD?.mortalityMale   ?? 0) : k.mortalityMale,   "", "", "", ""],
    ["Mortality %", k.mortalityPct + "%", "", "", "", ""],
    ["Worst Farm", isFiltered ? (isFarmFiltered ? selectedFarm : selectedBreed) : k.worstFarm, "", "", "", ""],
    [],
    ["── HATCHERY ──"],
    ["KPI", "Week", "Month", "Year", "Target (Wk)", "Status"],
    ["Eggs Set",    eggsSetWk,  eggsSetMo,  eggsSetYr,  k.eggsSetWeekTarget, ""],
    ["Good Chicks", goodChkWk,  goodChkMo,  goodChkYr,  k.goodChicksWeekTarget,
      goodChkWk >= k.goodChicksWeekTarget ? "On Target" : "Below"],
    ["Poor Chicks / Culls",   isFiltered ? "—" : h.poorChicks, "", "", "", ""],
    ["Hatchability % (Week)",  hatchPctWk + "%", hatchPctMo + "%",
      (hD ? (eggsSetYr > 0 ? parseFloat(((goodChkYr/eggsSetYr)*100).toFixed(1)) : 0) : h.hatchabilityYear) + "%",
      k.hatchabilityTarget + "%",
      hatchPctWk >= k.hatchabilityTarget ? "OK" : "Below"],
    ["Fertility Rate %",       isFiltered ? "—" : h.fertilityRate + "%", "", "", k.fertilityTarget + "%", ""],
    ["DOC Available",
      isBreedFiltered ? (data?.breedDOC?.[selectedBreed] || 0) : k.totalDOC, "", "", "", ""],
    ["Hatch Forecast (Eggs Due) Wk/Mo/Yr", k.hatchForecastWeek, k.hatchForecastMonth, k.hatchForecastYear, "", ""],
    [],
    ["── FEED ──"],
    ["KPI", "Week", "Month", "Year"],
    ["Feed Intake (kg, from Daily Ops)", feedKgWk, feedKgMo, feedKgYr],
    ["Feed Intake (MT)",
      parseFloat((feedKgWk / 1000).toFixed(1)),
      parseFloat((feedKgMo / 1000).toFixed(1)),
      parseFloat((feedKgYr / 1000).toFixed(1))],
    ["Feed Delivery Cost (Actual Invoiced, GHC)",
      isFiltered ? (fd.breedCostWeek?.[selectedBreed]  || (isFarmFiltered ? (fd.byFarm?.[selectedFarm] || 0) : 0)) : fd.costWeek,
      isFiltered ? (fd.breedCostMonth?.[selectedBreed] || (isFarmFiltered ? (fd.byFarm?.[selectedFarm] || 0) : 0)) : fd.costMonth,
      isFiltered ? (fd.breedCostYear?.[selectedBreed]  || 0) : fd.costYear],
    ["Cost Per Feed kg (Set Price)", k.costPerFeedKg, "", ""],
    ["Cost Per Feed kg (Set Source)", k.feedCostKgSource, "", ""],
    ["Actual Avg Cost/kg (Deliveries)", fd.costPerKg, "", ""],
    [],
    ["── COST ANALYSIS ──"],
    ["KPI", "Week", "Month", "Year"],
    ["Cost Per Hatching Egg (GHC)", k.costPerHatchingEggWeek, k.costPerHatchingEggMonth, k.costPerHatchingEggYear],
    ["Selling Px / Hatching Egg (GHC)", k.sellingPxHatchingEggWeek, k.sellingPxHatchingEggMonth, k.sellingPxHatchingEggYear],
    ["Cost Per Chick DOC (GHC)", k.costPerChickWeek, k.costPerChickMonth, k.costPerChickYear],
    ["Chick Selling Px (GHC)", k.chickSellingPxWeek, k.chickSellingPxMonth, k.chickSellingPxYear],
    ["Hatching Egg Margin %", k.hatchingEggMarginPct + "%", "", ""],
    ["Chick Selling Margin %", k.chickSellingMarginPct + "%", "", ""],
    ["Salary Expense / Month (GHC)", k.salaryExpenseMonth, "", ""],
    [],
    ["── FINANCE ──"],
    isFiltered ? ["NOTE: Finance totals are global (not breed/farm split in source data)"] : [],
    ["KPI", "Week", "Month", "Year"],
    ["Revenue (Invoices, Poultry)", f.revenueWeek, f.revenueMonth, f.revenueYear],
    ["C4U Revenue", f.c4uRevenueWeek, f.c4uRevenueMonth, f.c4uRevenueYear],
    ["Combined Revenue", f.combinedRevenueWeek, f.combinedRevenueMonth, f.combinedRevenueYear],
    ["Cash Received", f.cashReceivedWeek, f.cashReceivedMonth, f.cashReceivedYear],
    ["Receivables", f.receivablesWeek, f.receivablesMonth, f.receivablesTotal],
    ["Total Expenditure", f.totalExpenseWeek, f.totalExpenseMonth, f.totalExpenseYear],
    ["Gross Margin %", f.grossMargin + "%", "", ""],
    ["Pending Payments Count", f.pendingPayments, "", ""],
    ["Approved Not Paid Count", f.approvedNotPaid, "", ""],
    [],
    ["── DEPARTMENT WORKER EXPENSES (Target Config) ──"],
    ["Department", "Week", "Month", "Year"],
    ["Chicken4U",    de.chicken4u?.week,    de.chicken4u?.month,    de.chicken4u?.year],
    ["Hatchery",     de.hatchery?.week,     de.hatchery?.month,     de.hatchery?.year],
    ["Breeder Farm", de.breederFarm?.week,  de.breederFarm?.month,  de.breederFarm?.year],
    ["TOTAL Dept Expense", de.total?.week,  de.total?.month,        de.total?.year],
    [],
    ["── WORKFORCE ──"],
    isFiltered ? ["NOTE: Workforce data is global (not breed/farm split in source data)"] : [],
    ["Total Staff",    wf.totalStaff],
    ["Active Staff",   wf.activeStaff],
    ["On Duty Today",  wf.staffTurnoutToday],
    ["On Leave Today", wf.staffOnLeave],
    ["Absenteeism %",  wf.absenteeismPct + "%"],
    ["Leave This Week",  wf.leaveThisWeek],
    ["Leave This Month", wf.leaveThisMonth],
    ["Open HR Issues",   wf.openHRIssues],
    [],
    ["Critical Issues", k.criticalIssues, k.criticalIssues > 0 ? "URGENT — see Alerts tab" : "All Clear"],
  ].filter(r => r.length > 0));

  /* ── 2. Breed Breakdown ─────────────────────────────────────────────────── */
  const breedRowsToExport = isBreedFiltered
    ? Object.entries(data?.breedEggData || {}).filter(([b]) => b === selectedBreed)
    : Object.entries(data?.breedEggData || {}).sort((a, b) => (b[1].eggsMonth || 0) - (a[1].eggsMonth || 0));

  const breedRows = [
    ...filterBanner,
    [isBreedFiltered ? `Showing breed: ${selectedBreed} only` : "All breeds shown"],
    [],
    [
      "Breed", "Birds Placed",
      "Eggs (Wk)", "Eggs (Mo)", "Eggs (Yr)",
      "Hatchable (Wk)", "Hatchable (Mo)",
      "Farm Rejected (Wk)", "Farm Rejected (Mo)", "Farm Rejected (Total)",
      "Cracked (Total)", "Dirty (Total)", "Floor (Total)",
      "Mortality (Wk)", "Mortality (Mo)", "Mortality (Yr)", "Female Mort", "Male Mort",
      "Feed kg (Wk)", "Feed kg (Mo)", "Feed kg (Yr)",
      "Eggs Set (Wk)", "Eggs Set (Mo)", "Eggs Set (Yr)",
      "Good Chicks (Wk)", "Good Chicks (Mo)", "Good Chicks (Yr)",
      "Fertile Eggs", "Poor Chicks",
      "Storage Eggs", "DOC Available",
      "Feed Cost (Wk, GHC)", "Feed Cost (Mo, GHC)", "Feed Cost (Yr, GHC)",
    ],
  ];
  breedRowsToExport.forEach(([breed, e]) => {
    const bHD = data?.breedHatchData?.[breed] || emptyBreedHatch();
    breedRows.push([
      breed,
      data?.breedMap?.[breed] || 0,
      e.eggsWeek, e.eggsMonth, e.eggsYear,
      e.hatchableWeek, e.hatchableMonth,
      e.farmRejectedWeek || 0, e.farmRejectedMonth || 0, e.farmRejectedTotal,
      e.crackedTotal, e.dirtyTotal, e.floorTotal,
      e.mortalityWeek, e.mortalityMonth, e.mortalityYear, e.mortalityFemale, e.mortalityMale,
      e.feedKgWeek, e.feedKgMonth, e.feedKgYear,
      bHD.eggsSetWeek, bHD.eggsSetMonth, bHD.eggsSetYear,
      bHD.goodChicksWeek, bHD.goodChicksMonth, bHD.goodChicksYear,
      bHD.fertileEggs, bHD.poorChicks,
      data?.breedStorageEggs?.[breed] || 0,
      data?.breedDOC?.[breed] || 0,
      fd.breedCostWeek?.[breed] || 0,
      fd.breedCostMonth?.[breed] || 0,
      fd.breedCostYear?.[breed] || 0,
    ]);
  });
  add("Breed Breakdown", breedRows);

  /* ── 3. Farm Breakdown ──────────────────────────────────────────────────── */
  const farmRowsToExport = isFarmFiltered
    ? Object.entries(data?.farmEggData || {}).filter(([f]) => f === selectedFarm)
    : Object.entries(data?.farmEggData || {}).sort((a, b) => (b[1].eggsMonth || 0) - (a[1].eggsMonth || 0));

  const farmRows = [
    ...filterBanner,
    [isFarmFiltered ? `Showing farm: ${selectedFarm} only` : "All farms shown"],
    [],
    [
      "Farm", "Birds Placed",
      "Eggs (Wk)", "Eggs (Mo)", "Eggs (Yr)",
      "Hatchable (Wk)", "Hatchable (Mo)",
      "Farm Rejected (Wk)", "Farm Rejected (Mo)",
      "Mortality (Wk)", "Mortality (Mo)", "Mortality (Yr)",
      "Feed kg (Wk)", "Feed kg (Mo)", "Feed kg (Yr)",
      "Feed Cost (Mo, GHC)",
    ],
  ];
  farmRowsToExport.forEach(([farm, e]) => {
    farmRows.push([
      farm,
      data?.farmBirdsPlacedMap?.[farm] || 0,
      e.eggsWeek, e.eggsMonth, e.eggsYear,
      e.hatchableWeek, e.hatchableMonth,
      e.farmRejectedWeek || 0, e.farmRejectedMonth || 0,
      e.mortalityWeek, e.mortalityMonth, e.mortalityYear,
      e.feedKgWeek, e.feedKgMonth, e.feedKgYear,
      fd.byFarm?.[farm] || 0,
    ]);
  });
  add("Farm Breakdown", farmRows);

  /* ── 4. Hatchery Detail ─────────────────────────────────────────────────── */
  const totalSetAll     = ALL_BATCHES.reduce((s, b) => s + b.set,     0);
  const totalFertileAll = ALL_BATCHES.reduce((s, b) => s + b.fertile, 0);
  const totalHatchedAll = ALL_BATCHES.reduce((s, b) => s + b.hatched, 0);
  add("Hatchery", [
    ...filterBanner,
    ["Metric", "Week", "Month", "Year"],
    ["Eggs Set",            eggsSetWk,  eggsSetMo,  eggsSetYr],
    ["Last Week Eggs Set",  h.eggsSetLastWeek,  "", ""],
    ["Last Month Eggs Set", "", h.eggsSetLastMonth, ""],
    ["Good Chicks",         goodChkWk,  goodChkMo,  goodChkYr],
    ["Good Chicks Last Week",  k.goodChicksLastWeek, "", ""],
    ["Good Chicks Last Month", "", k.goodChicksLastMonth, ""],
    ["Poor Chicks / Culls",    isFiltered ? "—" : h.poorChicks, "", ""],
    ["Hatchability %",
      hatchPctWk + "%", hatchPctMo + "%",
      (hD && eggsSetYr > 0 ? parseFloat(((goodChkYr/eggsSetYr)*100).toFixed(1)) : h.hatchabilityYear) + "%"],
    ["Hatchability Target %", k.hatchabilityTarget + "%", k.hatchabilityTargetMonth + "%", ""],
    ["Fertility Rate %",  isFiltered ? "—" : h.fertilityRate + "%", "", ""],
    ["Fertility Target %", k.fertilityTarget + "%", "", ""],
    ["Infertility Rate %", isFiltered ? "—" : h.infertilityRate + "%", "", ""],
    [],
    [`── Complete Batch History — ${ALL_BATCHES.length} Batches ──`],
    ["#", "Batch", "Set Date", "Hatched Date", "Scheduled Date", "Eggs Set", "Fertile", "Fertile %", "Hatched", "Hatch %", "Infertile/Culls"],
    ...ALL_BATCHES.map((b, idx) => [
      idx + 1, b.batch,
      b.settingDate || "—", b.hatchedDate || "—", b.scheduledDate || "—",
      b.set, b.fertile,
      b.set > 0 ? parseFloat(((b.fertile / b.set) * 100).toFixed(1)) : 0,
      b.hatched, b.hatchPct,
      b.fertile > b.hatched ? b.fertile - b.hatched : 0,
    ]),
    ["TOTAL", "", "", "", "", totalSetAll, totalFertileAll,
      totalSetAll > 0 ? parseFloat(((totalFertileAll / totalSetAll) * 100).toFixed(1)) : 0,
      totalHatchedAll,
      totalSetAll > 0 ? parseFloat(((totalHatchedAll / totalSetAll) * 100).toFixed(1)) : 0, ""],
  ]);

  /* ── 5. Feed Deliveries ─────────────────────────────────────────────────── */
  const filteredFeedCostWk  = isBreedFiltered ? (fd.breedCostWeek?.[selectedBreed]  || 0)
                            : isFarmFiltered   ? (fd.byFarm?.[selectedFarm] || 0) : fd.costWeek;
  const filteredFeedCostMo  = isBreedFiltered ? (fd.breedCostMonth?.[selectedBreed] || 0)
                            : isFarmFiltered   ? (fd.byFarm?.[selectedFarm] || 0) : fd.costMonth;
  const filteredFeedCostYr  = isBreedFiltered ? (fd.breedCostYear?.[selectedBreed]  || 0) : fd.costYear;
  const filteredFeedKgMo    = isBreedFiltered ? (fd.breedKgMonth?.[selectedBreed]   || 0) : fd.kgMonth;

  const feedDelRows = [
    ...filterBanner,
    ["Metric", "Week", "Month", "Year"],
    ["Feed Delivery Cost (GHC)", filteredFeedCostWk, filteredFeedCostMo, filteredFeedCostYr],
    ["Feed Delivered (kg)", fd.kgWeek, fd.kgMonth, fd.kgYear],
    ["Avg Cost Per kg (Weighted, GHC)", fd.costPerKg, "", ""],
    [],
  ];

  if (isBreedFiltered) {
    feedDelRows.push(
      [`── FEED COST FOR BREED: ${selectedBreed} ──`],
      ["Period", "Cost (GHC)", "kg"],
      ["Week",  fd.breedCostWeek?.[selectedBreed]  || 0, fd.breedKgWeek?.[selectedBreed]  || 0],
      ["Month", fd.breedCostMonth?.[selectedBreed] || 0, fd.breedKgMonth?.[selectedBreed] || 0],
      ["Year",  fd.breedCostYear?.[selectedBreed]  || 0, fd.breedKgYear?.[selectedBreed]  || 0],
      [],
    );
  } else {
    feedDelRows.push(
      ["── By Breed (Full List) ──"],
      ["Breed", "Cost (Mo, GHC)", "Cost (Yr, GHC)", "kg (Mo)", "kg (Yr)"],
      ...Object.keys({ ...fd.breedCostMonth, ...fd.breedCostYear }).map(breed => [
        breed,
        fd.breedCostMonth?.[breed] || 0,
        fd.breedCostYear?.[breed]  || 0,
        fd.breedKgMonth?.[breed]   || 0,
        fd.breedKgYear?.[breed]    || 0,
      ]),
    );
  }

  if (isFarmFiltered) {
    feedDelRows.push(
      [],
      [`── FEED COST FOR FARM: ${selectedFarm} ──`],
      ["Farm", "Total Cost (GHC)"],
      [selectedFarm, fd.byFarm?.[selectedFarm] || 0],
    );
  } else {
    feedDelRows.push(
      [],
      ["── By Farm (Full List) ──"],
      ["Farm", "Total Cost (GHC)"],
      ...Object.entries(fd.byFarm || {}).sort((a, b) => b[1] - a[1]).map(([farm, cost]) => [farm, cost]),
    );
  }

  feedDelRows.push(
    [],
    ["── Consumed (Daily Ops) vs Actual Invoiced Delivery ──"],
    ["Period", "Consumed kg", "Std Cost (kg × Set Price)", "Actual Delivery Cost", "Variance (Actual − Std)", "Direction"],
    ...["Week", "Month", "Year"].map(period => {
      const kgMap  = { Week: fd.consumedKgWeek,   Month: fd.consumedKgMonth,   Year: fd.consumedKgYear   };
      const stdMap = { Week: fd.consumedCostWeek, Month: fd.consumedCostMonth, Year: fd.consumedCostYear };
      const actMap = { Week: fd.costWeek,         Month: fd.costMonth,         Year: fd.costYear          };
      const varMap = { Week: fd.varianceWeek,     Month: fd.varianceMonth,     Year: fd.varianceYear      };
      const variance = varMap[period] || 0;
      const dir = variance > 0 ? "Over Standard" : variance < 0 ? "Under Standard" : "On Target";
      return [period, kgMap[period], stdMap[period], actMap[period], variance, dir];
    }),
    ["Set Price/kg (GHC)", fd.setPrice || 0, "Source:", fd.setSource || "", "", ""],
    [],
    ["── Recent Deliveries (Most Recent 10) ──"],
    ["Date", "Feed Name", "Type", "Qty (kg)", "Cost (GHC)", "Cost/kg", "Bins"],
    ...(fd.recent || []).map(r => [r.date, r.feedName, r.feedType, r.qtyKg, r.feedCost, r.costPerKg, r.binCount]),
  );
  add("Feed Deliveries", feedDelRows);

  /* ── 6. Operational Requests ────────────────────────────────────────────── */
  const opRows = [
    ...filterBanner,
    isFiltered ? ["NOTE: Op Requests are global (not breed/farm split in source data)"] : [],
    [],
    ["Metric", "Week", "Month", "Year"],
    ["Total Expenditure (GHC)", or.expenseWeek, or.expenseMonth, or.expenseYear],
    ["Paid This Month (GHC)", "", or.paidMonth, ""],
    ["Pending Payment Count", or.pendingCount, "", ""],
    ["Approved Not Paid Count", or.approvedNotPaid, "", ""],
    [],
    ["── By Category (This Month) ──"],
    ["Category", "Cost (GHC)"],
    ...Object.entries(or.byCategory || {}).sort((a, b) => b[1] - a[1]).map(([cat, cost]) => [cat, cost]),
    [],
    ["── By Farm (This Month) ──"],
    ...(isFarmFiltered
      ? [
          ["Farm", "Cost (GHC)"],
          [selectedFarm, or.byFarm?.[selectedFarm] || 0],
        ]
      : [
          ["Farm", "Cost (GHC)"],
          ...Object.entries(or.byFarm || {}).sort((a, b) => b[1] - a[1]).map(([farm, cost]) => [farm, cost]),
        ]),
    [],
    ["── Recent Requests (Full List, up to 15) ──"],
    ["Request ID", "Type", "Category", "Farm", "Actual Cost", "Weekly Amortised", "Finance Status", "Payment Status", "Urgency", "Date"],
    ...(or.recent || []).map(r => [
      r.requestId, r.requestType, r.mainCategory, r.farm,
      r.actualCost, r.weeklyAmortised, r.financeStatus, r.paymentStatus,
      r.urgency, r.date?.slice(0, 10) || "",
    ]),
  ].filter(r => r.length > 0);
  add("Op Requests", opRows);

  /* ── 7. Feed Mill ───────────────────────────────────────────────────────── */
  add("Feed Mill", [
    ...filterBanner,
    isFiltered ? ["NOTE: Feed Mill production data is global (not breed/farm split in source data)"] : [],
    [],
    ["Metric", "Value"],
    ["Produced (MT/Month)", fm.producedMT],
    ["Produced (MT/Day)",   fm.producedDay],
    ["Produced (MT/Week)",  fm.producedWeekMT],
    ["Produced (MT/Year)",  fm.producedYearMT],
    ["Issued (MT/Week)",    fm.issuedWeek],
    ["Issued (MT/Month)",   fm.issuedMonth],
    ["Production vs Demand %", fm.productionVsDemand],
    ["Raw Material Efficiency", fm.rawMaterialEff || "—"],
    ["Machine Uptime", fm.machineUptime || "—"],
    [],
    ["── Daily/Monthly Trend (Current Period) ──"],
    ["Day/Month", "Produced (MT)", "Issued (MT)"],
    ...(fm.trend || []).map(t => [t.d, t.prod, t.issued]),
  ].filter(r => r.length > 0));

  /* ── 8. Sales & Orders ──────────────────────────────────────────────────── */
  add("Sales & Orders", [
    ...filterBanner,
    isFiltered ? ["NOTE: Sales order totals are global. Chick quantities are filtered where breed data is available."] : [],
    [],
    ["── POULTRY SALES ORDERS ──"],
    ["Metric", "Week", "Month", "Year"],
    ["Confirmed Orders",
      isFiltered ? k.confirmedChicksWeek  : s.confirmedWeek,
      isFiltered ? k.confirmedChicksMonth : s.confirmedMonth,
      isFiltered ? k.confirmedChicksYear  : s.confirmedYear],
    ["Confirmed Chicks", s.confirmedChicksWeek, s.confirmedChicksMonth, s.confirmedChicksYear],
    ["Pending Orders",
      isFiltered ? k.pendingChicksWeek  : s.pendingWeek,
      isFiltered ? k.pendingChicksMonth : s.pendingMonth, ""],
    ["Pending Chicks", s.pendingChicksWeek, s.pendingChicksMonth, ""],
    ["Orders vs Production %", s.ordersVsProduction + "%", "", ""],
    ["Fulfilled %",            s.fulfilledPct + "%",       "", ""],
    [],
    ["── CHICKEN4U FIELD VISIT ORDERS ──"],
    isFiltered ? ["NOTE: C4U orders are global (not breed/farm split in source data)"] : [],
    ["Metric", "Week", "Month", "Total"],
    ["C4U Confirmed Orders", s.c4uConfirmedWeek, s.c4uConfirmedMonth, s.c4uConfirmedOrders],
    ["C4U Pending Orders",   s.c4uPendingWeek,   s.c4uPendingMonth,   s.c4uPendingOrdersCount],
    [],
    ["── COMBINED ──"],
    ["Metric", "Week", "Month"],
    ["Combined Confirmed", s.combinedConfirmedWeek, s.combinedConfirmedMonth],
    ["Combined Pending",   s.combinedPendingWeek,   s.combinedPendingMonth],
    ["Avg Selling Price / Chick (GHC)", s.avgSellingChick, ""],
    ["Avg Selling Price / Egg (GHC)",   s.avgSellingEgg,   ""],
    [],
    ["── REGIONAL DEMAND (Combined, Full List) ──"],
    ["Region", "Orders"],
    ...(s.combinedRegionalDemand || []).map(r => [r.region, r.orders]),
    [],
    ["── TOP 20 CUSTOMERS ──"],
    ["Rank", "Customer", "Revenue (GHC)"],
    ...(s.top20 || []).map((c, i) => [i + 1, c.name, c.qty]),
  ].filter(r => r.length > 0));

  /* ── 9. Finance ─────────────────────────────────────────────────────────── */
  add("Finance", [
    ...filterBanner,
    isFiltered ? ["NOTE: Finance totals are global (not breed/farm split in source data)"] : [],
    [],
    ["── REVENUE ──"],
    ["Source", "Week (GHC)", "Month (GHC)", "Year (GHC)"],
    ["Sales Order Revenue (Confirmed Orders)", f.revenueWeek, f.revenueMonth, f.revenueYear],
    ["Chicken4U Orders (Paid)", f.c4uRevenueWeek,      f.c4uRevenueMonth,      f.c4uRevenueYear],
    ["Combined Total",          f.combinedRevenueWeek, f.combinedRevenueMonth, f.combinedRevenueYear],
    [],
    ["── CASH & RECEIVABLES ──"],
    ["Metric", "Week (GHC)", "Month (GHC)", "Total (GHC)"],
    ["Cash Received", f.cashReceivedWeek, f.cashReceivedMonth, f.cashReceivedYear],
    ["Receivables",   f.receivablesWeek,  f.receivablesMonth,  f.receivablesTotal],
    ["Payables Due",  f.payablesWeek,     f.payablesMonth,     ""],
    [],
    ["── EXPENDITURE ──"],
    ["Source", "Week (GHC)", "Month (GHC)", "Year (GHC)"],
    ["Feed Deliveries (Actual Invoiced)", fd.costWeek,         fd.costMonth,         fd.costYear],
    ["Operational Requests",              or.expenseWeek,      or.expenseMonth,      or.expenseYear],
    ["Department Worker Expenses",        de.total?.week,      de.total?.month,      de.total?.year],
    ["Total Expenditure",                 f.totalExpenseWeek,  f.totalExpenseMonth,  f.totalExpenseYear],
    [],
    ["── MARGINS ──"],
    ["Gross Margin %", f.grossMargin + "%"],
    ["Pending Payments Count", f.pendingPayments],
    ["Approved Not Paid Count", f.approvedNotPaid],
    [],
    ["── PRODUCT MARGINS ──"],
    ["Product", "Margin %"],
    ...(f.margins || []).map(m => [m.product, m.margin + "%"]),
    [],
    ["── BREED PROFIT MARGINS (This Month) ──"],
    isBreedFiltered ? [`Showing breed: ${selectedBreed} only`] : [],
    ["Breed", "Revenue (GHC)", "Feed Cost (GHC)", "Gross Profit (GHC)", "Margin %"],
    ...(isBreedFiltered
      ? (data?.breedProfitMargins || []).filter(b => b.breed === selectedBreed)
      : (data?.breedProfitMargins || [])
    ).map(b => [b.breed, b.revenue, b.feedCost, b.grossProfit, b.marginPct + "%"]),
    [],
    ["── MONTHLY FINANCIALS (Full Year) ──"],
    ["Month", "Revenue (GHC)", "Cash In (GHC)", "Expense (GHC)", "Profit (GHC)"],
    ...Object.entries(data?.monthlyFinData || {}).sort(([a], [b]) => a.localeCompare(b)).map(([key, v]) => [
      key, v.revenue || 0, v.cashIn || 0, v.expense || 0, (v.revenue || 0) - (v.expense || 0),
    ]),
  ].filter(r => r.length > 0));

  /* ── 10. Inventory ──────────────────────────────────────────────────────── */
  const storageEggsToExport = isBreedFiltered
    ? [[selectedBreed, data?.breedStorageEggs?.[selectedBreed] || 0]]
    : Object.entries(data?.breedStorageEggs || {}).sort((a, b) => b[1] - a[1]);

  const docToExport = isBreedFiltered
    ? [[selectedBreed, data?.breedDOC?.[selectedBreed] || 0]]
    : Object.entries(data?.breedDOC || {}).sort((a, b) => b[1] - a[1]);

  add("Inventory", [
    ...filterBanner,
    [],
    ["── OVERVIEW ──"],
    ["Metric", "Value"],
    ["Finished Feed Stock (MT)", inv.finishedFeedTons],
    ["Raw Material Days",        inv.rawMaterialDays],
    ["Vaccine Status",           inv.vaccineStatus],
    ["Storage Eggs Total",       isBreedFiltered ? (data?.breedStorageEggs?.[selectedBreed] || 0) : k.storageEggsAvailable],
    ["DOC Total",                isBreedFiltered ? (data?.breedDOC?.[selectedBreed] || 0)         : k.totalDOC],
    ["Pending POs",   inv.pendingPOs],
    ["Supplier Delays", inv.supplierDelays],
    [],
    [isBreedFiltered ? `── STORAGE EGGS FOR BREED: ${selectedBreed} ──` : "── STORAGE EGGS BY BREED (Full List) ──"],
    ["Breed", "Available Eggs"],
    ...storageEggsToExport.map(([b, q]) => [b, q]),
    [],
    [isBreedFiltered ? `── DAY OLD CHICKS FOR BREED: ${selectedBreed} ──` : "── DAY OLD CHICKS BY BREED (Full List) ──"],
    ["Breed", "Available Chicks"],
    ...docToExport.map(([b, q]) => [b, q]),
    [],
    ["── CRITICAL/LOW STOCK ALERTS ──"],
    ["Item", "Stock", "Status"],
    ...(inv.criticalAlerts || []).map(a => [a.item, a.stock, a.status]),
    [],
    ["── PRODUCT STOCK LIST ──"],
    ["Product", "Available Stock", "Min Stock", "Selling Price (GHC)", "Unit"],
    ...(inv.productStockList || []).map(p => [p.name, p.stock, p.min, p.sellingPrice, p.unit]),
  ]);

  /* ── 11. Chicken4U ──────────────────────────────────────────────────────── */
  add("Chicken4U", [
    ...filterBanner,
    isFiltered ? ["NOTE: Chicken4U data is global (not breed/farm split in source data)"] : [],
    [],
    ["── MUO NETWORK ──"],
    ["Metric", "Value"],
    ["Total MUOs",        c4u?.muo?.total  ?? 0],
    ["Female MUOs",       c4u?.muo?.female ?? 0],
    ["Male MUOs",         c4u?.muo?.male   ?? 0],
    ["SHF/SSPs Reached",  c4u?.muo?.sspTotal ?? 0],
    ["Certified Learners", c4u?.learners ?? 0],
    [],
    ["── ORDERS SUMMARY ──"],
    ["Metric", "Ordered", "Delivered", "Pending"],
    ["Grangers",    c4uS.grangers,    c4uS.grangersDelivered, c4uS.grangersPending],
    ["Layers",      c4uS.layers,      c4uS.layersDelivered,   c4uS.layersPending],
    ["Broilers",    c4uS.broilers,    c4uS.broilersDelivered, c4uS.broilersPending],
    ["Total Chicks",c4uS.chicksOrdered,c4uS.chicksDelivered,  c4uS.chicksPending],
    ["Feed kg",     c4uS.feedKgOrdered,c4uS.feedKgDelivered,  c4uS.feedKgPending],
    ["Total Orders",c4uS.ordersDelivered + c4uS.ordersPending, c4uS.ordersDelivered, c4uS.ordersPending],
    [],
    ["── PENDING DELIVERIES THIS WEEK ──"],
    ["Order ID", "MUO", "SATO", "Expected Date", "Status"],
    ...(c4uS.pendingWeek?.list || []).map(o => [o.orderId, o.muoName, o.satoName, o.expectedDate, o.status]),
    [],
    ["── PENDING DELIVERIES THIS MONTH ──"],
    ["Order ID", "MUO", "SATO", "Expected Date", "Status"],
    ...(c4uS.pendingMonth?.list || []).map(o => [o.orderId, o.muoName, o.satoName, o.expectedDate, o.status]),
    [],
    ["── TOP 10 MUOs ──"],
    ["Rank", "MUO Name", "Delivered", "Ordered"],
    ...(c4uS.topMuos || []).map((m, i) => [i + 1, m.name, m.value, m.ordered]),
    [],
    ["── TOP 10 SATOs ──"],
    ["Rank", "SATO Name", "Paid Qty", "Total Qty"],
    ...(c4uS.topSatos || []).map((st, i) => [i + 1, st.name, st.value, st.totalQty]),
    [],
    ["── REGIONAL DEMAND ──"],
    ["Region", "Orders"],
    ...((data?.sales?.c4uRegionalDemand) || []).map(r => [r.region, r.orders]),
    [],
    ["── GRANGER BREEDS ──"],
    ["Breed", "Qty"],
    ...Object.entries(c4uS.grangerBreeds || {}).map(([b, q]) => [b, q]),
    [],
    ["── LAYER BREEDS ──"],
    ["Breed", "Qty"],
    ...Object.entries(c4uS.layerBreeds || {}).map(([b, q]) => [b, q]),
    [],
    ["── BROILER BREEDS ──"],
    ["Breed", "Qty"],
    ...Object.entries(c4uS.broilerBreeds || {}).map(([b, q]) => [b, q]),
  ].filter(r => r.length > 0));


  /* ── SATO Commissions Sheet ── */
const satoComm = c4uS.satoCommissionConfig || {};
const satoRows = [
  ...filterBanner,
  ["SATO COMMISSION REPORT"],
  [`Generated: ${now}`],
  [`Year: ${curYear}  ·  Active Filter: ${filterLabel}`],
  [],
  ["── COMMISSION RATE CONFIG ──"],
  ["Type",     "Rate / Chick (GHC)", "Basis",        "Monthly Target"],
  ["Granger",  satoComm.grangerRate  || 0.30, "Always paid",   "N/A"],
  ["Layer",    satoComm.layerRate    || 0.20, "Target-based",  satoComm.layerTarget   || "Not set"],
  ["Broiler",  satoComm.broilerRate  || 0.20, "Target-based",  satoComm.broilerTarget || "Not set"],
  [],
  ["── TOTAL COMMISSION PAYABLE ──"],
  ["Total SATO Commission Payable (GHC)", c4uS.totalSatoCommissionPayable || 0],
  [],
  ["── PER-SATO BREAKDOWN (Delivered Orders Only) ──"],
  [
    "Rank", "SATO Name",
    "Grangers Delivered", "Layers Delivered", "Broilers Delivered",
    "Granger Comm (GHC)", "Meets Layer Target?", "Layer Comm (GHC)",
    "Meets Broiler Target?", "Broiler Comm (GHC)", "TOTAL Commission (GHC)",
  ],
  ...(c4uS.topSatos || []).map((st, i) => [
    i + 1,
    st.name,
    st.grangersDelivered  || 0,
    st.layersDelivered    || 0,
    st.broilersDelivered  || 0,
    st.grangerCommission  || 0,
    st.meetsLayerTarget   ? "Yes ✓" : (st.layersDelivered > 0 ? "No ✗ (below target)" : "N/A"),
    st.layerCommission    || 0,
    st.meetsBroilerTarget ? "Yes ✓" : (st.broilersDelivered > 0 ? "No ✗ (below target)" : "N/A"),
    st.broilerCommission  || 0,
    st.totalCommission    || 0,
  ]),
  [],
  ["GRAND TOTAL", "",
    (c4uS.topSatos||[]).reduce((a,b)=>a+(b.grangersDelivered||0),0),
    (c4uS.topSatos||[]).reduce((a,b)=>a+(b.layersDelivered||0),0),
    (c4uS.topSatos||[]).reduce((a,b)=>a+(b.broilersDelivered||0),0),
    (c4uS.topSatos||[]).reduce((a,b)=>a+(b.grangerCommission||0),0),
    "", 
    (c4uS.topSatos||[]).reduce((a,b)=>a+(b.layerCommission||0),0),
    "",
    (c4uS.topSatos||[]).reduce((a,b)=>a+(b.broilerCommission||0),0),
    c4uS.totalSatoCommissionPayable || 0,
  ],
].filter(r => r.length > 0);
add("SATO Commissions", satoRows);

  /* ── 12. Workforce ──────────────────────────────────────────────────────── */
  add("Workforce", [
    ...filterBanner,
    isFiltered ? ["NOTE: Workforce data is global (not breed/farm split in source data)"] : [],
    [],
    ["Metric", "Value"],
    ["Total Staff",          wf.totalStaff],
    ["Active Staff",         wf.activeStaff],
    ["On Duty Today",        wf.staffTurnoutToday],
    ["Staff on Leave Today", wf.staffOnLeave],
    ["Absenteeism %",        wf.absenteeismPct + "%"],
    ["Leave This Week",      wf.leaveThisWeek],
    ["Leave This Month",     wf.leaveThisMonth],
    ["Open Leave Requests",  wf.openHRIssues],
    [],
    ["── DEPARTMENT HEADCOUNT ──"],
    ["Department", "Headcount"],
    ...(wf.deptProductivity || []).map(d => [d.dept, d.score]),
    [],
    ["── LEAVE BY DEPARTMENT ──"],
    ["Department", "Staff On Leave"],
    ...(wf.leaveByDept || []).map(d => [d.dept, d.count]),
  ].filter(r => r.length > 0));

  /* ── 13. Monthly YoY Trend ──────────────────────────────────────────────── */
  const MNAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const mkKey  = (y, m) => `${y}-${String(m + 1).padStart(2, "0")}`;
  const ops    = data?.monthlyOpsData   || {};
  const htch   = data?.monthlyHatchData || {};
  const fin    = data?.monthlyFinData   || {};
  const costPerKg = k.costPerFeedKg || 0;

  const monthlyRows = [
    ...filterBanner,
    isFiltered ? ["NOTE: Monthly trend uses global aggregates. Breed/farm splits are not available at monthly level."] : [],
    [],
    [
      "Month",
      `${curYear} Eggs`,   `${prevYear} Eggs`,
      `${curYear} Good Chicks`, `${prevYear} Good Chicks`,
      `${curYear} Grangers`, `${curYear} Layers`, `${curYear} Broilers`,
      `${curYear} Mortality`, `${prevYear} Mortality`,
      `${curYear} Hatch%`, `${prevYear} Hatch%`,
      `${curYear} Feed (MT)`, `${prevYear} Feed (MT)`,
      `${curYear} Feed Cost (GHC)`, `${prevYear} Feed Cost (GHC)`,
      `${curYear} Eggs Set`, `${prevYear} Eggs Set`,
      `${curYear} Revenue (GHC)`, `${prevYear} Revenue (GHC)`,
      `${curYear} Cash In (GHC)`, `${prevYear} Cash In (GHC)`,
    ],
  ];
  MNAMES.forEach((mon, i) => {
    const ck = mkKey(curYear, i); const pk = mkKey(curYear - 1, i);
    const co = ops[ck] || {}; const po = ops[pk] || {};
    const ch = htch[ck] || {}; const ph = htch[pk] || {};
    const cf = fin[ck] || {}; const pf = fin[pk] || {};
    const cHatch = ch.eggsSet > 0 ? ((ch.goodChicks / ch.eggsSet) * 100).toFixed(1) + "%" : 0;
    const pHatch = ph.eggsSet > 0 ? ((ph.goodChicks / ph.eggsSet) * 100).toFixed(1) + "%" : 0;
    monthlyRows.push([
      mon,
      co.eggs || 0, po.eggs || 0,
      ch.goodChicks || 0, ph.goodChicks || 0,
      ch.grangers || 0, ch.layers || 0, ch.broilers || 0,
      co.mort || 0, po.mort || 0,
      cHatch, pHatch,
      ((co.feedKg || 0) / 1000).toFixed(1), ((po.feedKg || 0) / 1000).toFixed(1),
      ((co.feedKg || 0) * costPerKg).toFixed(0), ((po.feedKg || 0) * costPerKg).toFixed(0),
      ch.eggsSet || 0, ph.eggsSet || 0,
      cf.revenue || 0, pf.revenue || 0,
      cf.cashIn || 0, pf.cashIn || 0,
    ]);
  });
  add("Monthly Trend YoY", monthlyRows.filter(r => r.length > 0));

  /* ── 14. Department Expenses ────────────────────────────────────────────── */
  add("Department Expenses", [
    ...filterBanner,
    ["Department", "Week (GHC)", "Month (GHC, ×4.33)", "Year (GHC, ×52)"],
    ["Chicken4U",    de.chicken4u?.week,   de.chicken4u?.month,   de.chicken4u?.year],
    ["Hatchery",     de.hatchery?.week,    de.hatchery?.month,    de.hatchery?.year],
    ["Breeder Farm", de.breederFarm?.week, de.breederFarm?.month, de.breederFarm?.year],
    ["TOTAL",        de.total?.week,       de.total?.month,       de.total?.year],
  ]);

  /* ── 15. Alerts ─────────────────────────────────────────────────────────── */
  add("Alerts", [
    ...filterBanner,
    ["Type", "Title", "Detail", "Time"],
    ...(data?.alerts || []).map(a => [a.type.toUpperCase(), a.title, a.detail, a.time]),
  ]);

  XLSX.writeFile(wb, `WAFAD_Executive_${curYear}${isFiltered ? `_${selectedBreed !== "All Breeds" ? selectedBreed : ""}${selectedFarm !== "All Farms" ? "_" + selectedFarm : ""}` : ""}_${new Date().toISOString().slice(0, 10)}.xlsx`);
}


/* ══════════════════════════════════════════════════════
   doPptx  — full data export (drop-in replacement)
══════════════════════════════════════════════════════ */

// ═══════════════════════════════════════════════════════════════════════════
// doPptx  — COMPLETE DATA EXPORT  (drop-in replacement)
// Covers every data section visible in the dashboard.
// Light palette · consistent card/table style · 16×9
// ═══════════════════════════════════════════════════════════════════════════


async function doPptx(data, selectedYear, selectedBreed = "All Breeds", selectedFarm = "All Farms") {

    await loadScript("https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js");
  const PptxGenJS = window.PptxGenJS;
  if (!PptxGenJS) { alert("PptxGenJS failed to load"); return; }

  const rawTarget = (metric, period) => {
    const key = `${metric}_${period}`;
    return Object.prototype.hasOwnProperty.call(targets, key) ? targets[key] : null;
  };

  const p = new PptxGenJS();
  p.layout = "LAYOUT_16x9";
  p.title   = "WAFAD Executive Dashboard";
  p.subject = "Poultry Operations";
  p.author  = "WAFAD Group";

  /* ── Palette ───────────────────────────────────────────────────────── */
  const BG  = "F8FAFC", SF  = "FFFFFF", SF2 = "E2E8F0", SF3 = "F1F5F9";
  const BL  = "1D6FE8", GR  = "059669", RD  = "DC2626";
  const AM  = "D97706", PU  = "7C3AED", CY  = "0891B2";
  const OR  = "EA580C", TX  = "1E293B", SO  = "64748B", TF  = "94A3B8";
  const YL  = "FCD34D";

  /* ── Layout constants ──────────────────────────────────────────────── */
  const SLIDE_W  = 10;
  const HDR_H    = 0.52;
  const FOOT_Y   = 5.28;
  const FOOT_H   = 0.345;
  const MARGIN   = 0.20;
  const CONTENT_W = SLIDE_W - MARGIN * 2;

  const CARD_PAD_X   = 0.10;
  const LBL_H  = 0.18;
  const VAL_H  = 0.36;
  const SUB_H  = 0.16;

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


  // ADD right after const k, h, f, s, etc. are declared:
const isBreedFiltered = selectedBreed !== "All Breeds";
const isFarmFiltered  = selectedFarm  !== "All Farms";
const isFiltered      = isBreedFiltered || isFarmFiltered;

let eD = null;
if (isFarmFiltered && isBreedFiltered) {
  eD = data?.farmBreedEggData?.[selectedFarm]?.[selectedBreed] || null;
} else if (isFarmFiltered) {
  eD = data?.farmEggData?.[selectedFarm] || null;
} else if (isBreedFiltered) {
  eD = data?.breedEggData?.[selectedBreed] || null;
}
const hDF = isBreedFiltered ? (data?.breedHatchData?.[selectedBreed] || null) : null;

const xEggsWeek   = isFiltered ? (eD?.eggsWeek   ?? k.eggsThisWeek)   : k.eggsThisWeek;
const xEggsMonth  = isFiltered ? (eD?.eggsMonth  ?? k.eggsThisMonth)  : k.eggsThisMonth;
const xEggsYear   = isFiltered ? (eD?.eggsYear   ?? k.eggsThisYear)   : k.eggsThisYear;
const xMortWeek   = isFiltered ? (eD?.mortalityWeek  ?? k.mortalityThisWeek)  : k.mortalityThisWeek;
const xMortMonth  = isFiltered ? (eD?.mortalityMonth ?? k.mortalityThisMonth) : k.mortalityThisMonth;
const xMortYear   = isFiltered ? (eD?.mortalityYear  ?? k.mortalityThisYear)  : k.mortalityThisYear;
const xChicksWeek  = hDF ? (hDF.goodChicksWeek  ?? k.goodChicksWeek)  : k.goodChicksWeek;
const xChicksMonth = hDF ? (hDF.goodChicksMonth ?? k.goodChicksMonth) : k.goodChicksMonth;
const xChicksYear  = hDF ? (hDF.goodChicksYear  ?? k.goodChicksYear)  : k.goodChicksYear;
const xEggsSetWeek  = hDF ? (hDF.eggsSetWeek  ?? h.eggsSetWeek)  : h.eggsSetWeek;
const xEggsSetMonth = hDF ? (hDF.eggsSetMonth ?? h.eggsSetMonth) : h.eggsSetMonth;
const xHatchWk  = isFiltered ? (eD?.hatchableWeek  ?? k.hatchingEggsWeek)  : k.hatchingEggsWeek;
const xHatchMo  = isFiltered ? (eD?.hatchableMonth ?? k.hatchingEggsMonth) : k.hatchingEggsMonth;
const xFeedKgMo = isFiltered ? (eD?.feedKgMonth ?? 0) : (k.feedIntakeTons * 1000);
const xRejWk    = isFiltered ? (eD?.farmRejectedWeek  ?? k.farmRejectedEggsWeek)  : k.farmRejectedEggsWeek;
const xRejMo    = isFiltered ? (eD?.farmRejectedMonth ?? k.farmRejectedEggsMonth) : k.farmRejectedEggsMonth;
const xBirds    = isBreedFiltered
  ? (data?.breedMap?.[selectedBreed] || k.totalBirdsPlaced)
  : isFarmFiltered
    ? (data?.farmBirdsPlacedMap?.[selectedFarm] || k.totalBirdsPlaced)
    : k.totalBirdsPlaced;
const filterLabel = isFiltered
  ? `${isBreedFiltered ? `Breed: ${selectedBreed}` : ""}${isBreedFiltered && isFarmFiltered ? " · " : ""}${isFarmFiltered ? `Farm: ${selectedFarm}` : ""}`
  : "All Breeds · All Farms";

  const targets = data?.targets || {};
  const getTarget = (metric, period) => targets[`${metric}_${period}`] ?? 0;

  const curYear = selectedYear || new Date().getFullYear();
  const prevYear = curYear - 1;

  // const ALL_BATCHES = (h.allBatches && h.allBatches.length > 0)
  //   ? h.allBatches
  //   : (h.weeklyTrend || []).map(w => ({
  //       batch   : w.w,
  //       set     : w.set,
  //       fertile : w.fertile,
  //       hatched : w.hatched,
  //       hatchPct: w.set > 0 ? parseFloat(((w.hatched / w.set) * 100).toFixed(1)) : 0,
  //     }));

 
  const ALL_BATCHES_RAW = (h.allBatches && h.allBatches.length > 0)
    ? h.allBatches
    : (h.weeklyTrend || []).map(w => ({
        batch   : w.w,
        set     : w.set,
        fertile : w.fertile,
        hatched : w.hatched,
        hatchPct: w.set > 0 ? parseFloat(((w.hatched / w.set) * 100).toFixed(1)) : 0,
      }));

const ALL_BATCHES = [...ALL_BATCHES_RAW].sort((a, b) => {
  const da = a.settingDate ? new Date(a.settingDate) : new Date(0);
  const db = b.settingDate ? new Date(b.settingDate) : new Date(0);
  return da - db; // ascending: oldest set date first
});



  // ← ADD THESE FOUR LINES RIGHT HERE:
const completedBatches = ALL_BATCHES.filter(
  b => b.hatched > 0
);
const activeBatches = ALL_BATCHES.filter(
  b => b.hatched === 0 && b.set > 0
);
const pendingBatches = activeBatches.filter(
  b => !b.hatchedDate || b.hatchedDate === "—"
);
const dueNotHatchedBatches = activeBatches.filter(
  b => b.hatchedDate && b.hatchedDate !== "—" && b.hatched === 0
);

  const fmtN = (v, dp = 0) => {
    const n = Number(v ?? 0);
    return isNaN(n) ? "—" : n.toLocaleString("en-US",
      { minimumFractionDigits: dp, maximumFractionDigits: dp });
  };
  const fmtCur = v => {
    const n = Number(v ?? 0);
    if (isNaN(n) || n === 0) return "—";
    if (Math.abs(n) >= 1_000_000) return "GHC " + (n / 1_000_000).toFixed(1) + "M";
    if (Math.abs(n) >= 1_000)     return "GHC " + (n / 1_000).toFixed(0) + "K";
    return "GHC " + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
  };
  const fmtK = v => {
    const n = Number(v ?? 0);
    if (isNaN(n) || n === 0) return "—";
    if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
    if (Math.abs(n) >= 1_000)     return (n / 1_000).toFixed(1) + "K";
    return String(n);
  };
  const pct = (a, b) => b > 0 ? parseFloat(((a / b) * 100).toFixed(1)) : 0;

  const bg = sl => { sl.background = { color: BG }; };

    const hdr = (sl, title, accent = BL) => {
    sl.addShape(p.shapes.RECTANGLE, {
      x: 0, y: 0, w: SLIDE_W, h: HDR_H,
      fill: { color: accent }, line: { color: accent },
    });
    sl.addText(title, {
      x: 0.28, y: 0, w: isFiltered ? 5.50 : 7.50, h: HDR_H,
      fontSize: 15, bold: true, color: "FFFFFF",
      fontFace: "Trebuchet MS", valign: "middle", margin: 0,
    });
    // ── Filter label in header ──
    if (isFiltered) {
      sl.addShape(p.shapes.RECTANGLE, {
        x: 5.60, y: 0.08, w: 3.80, h: HDR_H - 0.16,
        fill: { color: "FFFFFF", transparency: 80 },
        line: { color: "FFFFFF", transparency: 60 },
      });
      sl.addText(`⚡ ${filterLabel}`, {
        x: 5.64, y: 0.08, w: 3.72, h: HDR_H - 0.16,
        fontSize: 8, bold: true, color: "FFFFFF",
        fontFace: "Calibri", valign: "middle", margin: 2,
      });
    }
    sl.addText(`Generated: ${now}`, {
      x: isFiltered ? 9.10 : 7.50, y: 0, w: isFiltered ? 0.80 : 2.30, h: HDR_H,
      fontSize: 7.5, color: "D1E8FF",
      fontFace: "Calibri", align: "right", valign: "middle", margin: 0,
    });
  };

  const footer = sl => {
    sl.addShape(p.shapes.RECTANGLE, {
      x: 0, y: FOOT_Y, w: SLIDE_W, h: FOOT_H,
      fill: { color: SF2 }, line: { color: SF2 },
    });
    sl.addText("WAFAD GROUP  ·  Executive Operations Dashboard  ·  Confidential", {
      x: 0.30, y: FOOT_Y, w: 9.40, h: FOOT_H,
      fontSize: 7, color: SO, fontFace: "Calibri",
      valign: "middle", align: "center",
    });
  };

  const card = (sl, x, y, w, h, label, value, color, sub = "") => {
    sl.addShape(p.shapes.RECTANGLE, {
      x, y, w, h,
      fill: { color: SF }, line: { color: SF2, pt: 1 },
    });
    sl.addShape(p.shapes.RECTANGLE, {
      x, y, w, h: 0.04,
      fill: { color }, line: { color },
    });
    const innerW = w - CARD_PAD_X * 2;
    const lx = x + CARD_PAD_X;
    const lyLabel = y + 0.08;
    sl.addText(label.toUpperCase(), {
      x: lx, y: lyLabel, w: innerW, h: LBL_H,
      fontSize: 6, color: SO, fontFace: "Calibri", bold: true,
      margin: 0, valign: "top",
    });
    const lyValue = lyLabel + LBL_H + 0.03;
    const valLen = String(value ?? "—").length;
    const valFontSize = valLen <= 8 ? 15 : valLen <= 12 ? 13 : 11;
    sl.addText(String(value ?? "—"), {
      x: lx, y: lyValue, w: innerW, h: VAL_H,
      fontSize: valFontSize, bold: true, color,
      fontFace: "Trebuchet MS", margin: 0, valign: "middle",
      shrinkText: true,
    });
    if (sub) {
      const lySub = lyValue + VAL_H + 0.02;
      sl.addText(sub, {
        x: lx, y: lySub, w: innerW, h: SUB_H,
        fontSize: 6, color: SO, fontFace: "Calibri",
        margin: 0, valign: "top", shrinkText: true,
      });
    }
  };

  const cardRow = (count, yTop, cardH, opts = {}) => {
    const gap   = opts.gap   ?? 0.06;
    const left  = opts.left  ?? MARGIN;
    const right = opts.right ?? MARGIN;
    const totalW = SLIDE_W - left - right;
    const w = (totalW - gap * (count - 1)) / count;
    return Array.from({ length: count }, (_, i) => ({
      x: left + i * (w + gap), y: yTop, w, h: cardH,
    }));
  };

  const tblHdr = (cols, color = BL) =>
    cols.map(text => ({
      text,
      options: {
        bold: true, color: "FFFFFF",
        fill: { color }, fontSize: 7.5, fontFace: "Calibri",
        align: "left",
      },
    }));

  const tblRow = (cells, idx, colorsArr = []) =>
    cells.map((text, ci) => ({
      text: String(text ?? "—"),
      options: {
        color: colorsArr[ci] || TX,
        fill: { color: idx % 2 === 0 ? SF : SF3 },
        fontSize: 7, fontFace: "Calibri",
        align: "left",
      },
    }));

  const sectionLabel = (sl, text, x, y, color = SO) => {
    sl.addShape(p.shapes.RECTANGLE, {
      x, y, w: 0.04, h: 0.22,
      fill: { color }, line: { color },
    });
    sl.addText(text, {
      x: x + 0.10, y, w: SLIDE_W - x - 0.20, h: 0.22,
      fontSize: 8, bold: true, color: TX,
      fontFace: "Calibri", charSpacing: 0.3, margin: 0, valign: "middle",
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
    // ADD after the "Live · CEO & Chairman View" text line:
sl.addText(`Filter: ${filterLabel}`, {
  x: 0.42, y: 3.72, w: 9, h: 0.28,
  fontSize: 10, color: isFiltered ? "1D6FE8" : SO,
  fontFace: "Calibri", bold: isFiltered,
});
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
      ["9", "Financial Snapshot",             GR],
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
    footer(sl);
  }

  /* ════════════════════════════════════════════════════════════════════════
     SLIDE 3 — FLOCK & PRODUCTION KPIs
  ════════════════════════════════════════════════════════════════════════ */
  {
    const sl = p.addSlide(); bg(sl); hdr(sl, `Flock & Production KPIs${isFiltered ? " — " + filterLabel : ""}`, BL);

    const CH = 0.90;
    const ROW1_Y = 0.64, ROW2_Y = 0.64 + CH + 0.08;
    const kpis = [
      ["Birds Placed",     fmtN(xBirds), BL, isFiltered ? filterLabel : "Total housed"],

      ["Pullets Housed",      fmtN(k.totalPulletsHoused),     BL, "Female birds"],
      ["Cockerels Housed",    fmtN(k.totalCockerelsHoused),   BL, "Male birds"],
      ["Birds Alive (F)",     fmtN(k.femaleAlive),            GR, "Current female"],
      ["Birds Alive (M)",     fmtN(k.maleAlive),              GR, "Current male"],
      ["Total Birds Alive",   fmtN(k.birdsAlive),             GR, `Placed: ${fmtN(k.totalBirdsPlaced)}`],
      ["Avg Egg Rate %",   (k.avgEggProductionRate || 0) + "%", CY, "Production rate"],

      ["Feed Intake (Wk MT)", fmtN(k.feedIntakeTonsWeek, 1), AM, `Month: ${fmtN(k.feedIntakeTons, 1)} MT`],
      ["Feed Intake (Yr MT)", fmtN(k.feedIntakeTonsYear, 1), AM, "Year to date"],
      ["Critical Issues",     k.criticalIssues || 0,          k.criticalIssues > 0 ? RD : GR, k.criticalIssues > 0 ? "Immediate attention" : "All clear"],
    ];
    const row1 = cardRow(5, ROW1_Y, CH);
    const row2 = cardRow(5, ROW2_Y, CH);
    kpis.forEach(([lbl, val, col, sub], i) => {
      const pos = i < 5 ? row1[i] : row2[i - 5];
      card(sl, pos.x, pos.y, pos.w, pos.h, lbl, val, col, sub);
    });

    /* ── Mortality Summary ── */
    const MORT_Y = ROW2_Y + CH + 0.14;
    sectionLabel(sl, "MORTALITY SUMMARY", MARGIN, MORT_Y, RD);

    const mortCards = cardRow(6, MORT_Y + 0.26, 0.80);
    [
      ["Mortality (Week)",
        fmtN(k.mortalityThisWeek), RD,
        k.mortalityTarget > 0
          ? `Target ≤ ${fmtN(k.mortalityTarget)} · ${k.mortalityThisWeek <= k.mortalityTarget ? "✓ OK" : "⚠ Over"}`
          : "Weekly total"],
      ["Mortality (Month)",
        fmtN(k.mortalityThisMonth), RD,
        k.mortalityTargetMonth > 0
          ? `Target ≤ ${fmtN(k.mortalityTargetMonth)}`
          : "Monthly total"],
      [`Mortality (${curYear})`,
        fmtN(k.mortalityThisYear), RD,
        `${curYear} cumulative`],
      [`Female Mortality (Px)`,
        fmtN(k.mortalityFemaleYear), "#B91C1C",
        `Mo: ${fmtN(k.mortalityFemaleMonth)} · Wk: ${fmtN(k.mortalityFemaleWeek)}`],
      [`Male Mortality (Cx)`,
        fmtN(k.mortalityMaleYear), "#7F1D1D",
        `Mo: ${fmtN(k.mortalityMaleMonth)} · Wk: ${fmtN(k.mortalityMaleWeek)}`],
      ["Mortality %",
        `${k.mortalityPct || 0}%`,
        k.mortalityPct > 3 ? RD : GR,
        `Worst farm: ${k.worstFarm || "—"}`],
    ].forEach(([lbl, val, col, sub], i) => {
      card(sl, mortCards[i].x, mortCards[i].y, mortCards[i].w, mortCards[i].h, lbl, val, col, sub);
    });

    /* ── Female vs Male split bar ── */
    const totalMortSlide3 = (k.mortalityFemale || 0) + (k.mortalityMale || 0);
    if (totalMortSlide3 > 0) {
      const femalePct = parseFloat(((k.mortalityFemale / totalMortSlide3) * 100).toFixed(1));
      const malePct   = parseFloat((100 - femalePct).toFixed(1));
      const BAR_Y     = MORT_Y + 0.26 + 0.80 + 0.10;

      sl.addText("Female (Px) vs Male (Cx) — Cumulative Split", {
        x: MARGIN, y: BAR_Y, w: CONTENT_W, h: 0.18,
        fontSize: 7.5, color: SO, fontFace: "Calibri", bold: true,
      });
      sl.addShape(p.shapes.RECTANGLE, {
        x: MARGIN,
        y: BAR_Y + 0.20,
        w: parseFloat(((femalePct / 100) * CONTENT_W).toFixed(3)), h: 0.20,
        fill: { color: "DC2626" }, line: { color: "DC2626" },
      });
      sl.addShape(p.shapes.RECTANGLE, {
        x: MARGIN + parseFloat(((femalePct / 100) * CONTENT_W).toFixed(3)),
        y: BAR_Y + 0.20,
        w: parseFloat(((malePct / 100) * CONTENT_W).toFixed(3)), h: 0.20,
        fill: { color: "7F1D1D" }, line: { color: "7F1D1D" },
      });
      sl.addText(`Female (Px): ${fmtN(k.mortalityFemale)} — ${femalePct}%`, {
        x: MARGIN + 0.06, y: BAR_Y + 0.21, w: 4.50, h: 0.18,
        fontSize: 7, color: "FFFFFF", fontFace: "Calibri", bold: true, valign: "middle",
      });
      sl.addText(`Male (Cx): ${fmtN(k.mortalityMale)} — ${malePct}%`, {
        x: MARGIN + CONTENT_W * 0.52, y: BAR_Y + 0.21, w: 4.50, h: 0.18,
        fontSize: 7, color: "FFCCCC", fontFace: "Calibri", bold: true,
        valign: "middle", align: "right",
      });
    }

    footer(sl);
  }

  /* ════════════════════════════════════════════════════════════════════════
   SLIDE — FLOCK WEEKLY GENDER FEED CONSUMPTION (Placement → Today)
   Full cumulative table: Breed · Week · Female (Px) kg · Male (Cx) kg ·
   Total Feed · Eggs · Hatchable · Female Mort · Male Mort
════════════════════════════════════════════════════════════════════════ */
{
  // const wgRows = data?.weeklyGenderFeedRows || [];
  // const placementLabel = data?.feedDeliveries?.placementStart || "Placement Date";

    const wgRows = data?.weeklyGenderFeedRows || [];
  const earliestDate = wgRows.length > 0
    ? wgRows.reduce((min, r) => (r.firstDate && r.firstDate < min ? r.firstDate : min), wgRows[0].firstDate)
    : null;
  const placementLabel = earliestDate
    ? earliestDate.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })
    : "Start of Records";

  // ── Summary totals across all breeds / all weeks ──
  const grandFeedPx    = wgRows.reduce((s, r) => s + r.feedPx,    0);
  const grandFeedCx    = wgRows.reduce((s, r) => s + r.feedCx,    0);
  const grandFeedTotal = wgRows.reduce((s, r) => s + r.feedTotal,  0);
  const grandMortPx    = wgRows.reduce((s, r) => s + r.mortPx,    0);
  const grandMortCx    = wgRows.reduce((s, r) => s + r.mortCx,    0);
  const grandEggs      = wgRows.reduce((s, r) => s + r.eggs,       0);
  const grandHatch     = wgRows.reduce((s, r) => s + r.hatchable,  0);

  // ── How many distinct breeds and max week ──
  const distinctBreeds = [...new Set(wgRows.map(r => r.breed))];
  const maxWeek        = wgRows.reduce((m, r) => Math.max(m, r.week), 0);

  // ── Female % of total feed ──
  const pxSharePct = grandFeedTotal > 0
    ? parseFloat(((grandFeedPx / grandFeedTotal) * 100).toFixed(1)) : 0;
  const cxSharePct = parseFloat((100 - pxSharePct).toFixed(1));

  const sl = p.addSlide();
  bg(sl);
  hdr(sl,
    `Flock Weekly Feed — Female (Px) vs Male (Cx) · ${placementLabel} → Today`,
    AM
  );

  /* ── Summary KPI cards ── */
  const CH_SUM = 0.80;
  const sumCards = cardRow(7, 0.64, CH_SUM);
  [
    ["Breeds Tracked",      fmtN(distinctBreeds.length), BL,  "All active breeds"],
    ["Max Week Reached",    `Wk ${maxWeek}`,             AM,  "Highest week on record"],
    ["Total Feed (Px) kg",  fmtN(grandFeedPx),           PU,  `${pxSharePct}% of total`],
    ["Total Feed (Cx) kg",  fmtN(grandFeedCx),           CY,  `${cxSharePct}% of total`],
    ["Total Feed (All) kg", fmtN(grandFeedTotal),         OR,  "Female + Male combined"],
    ["Female Mortality",    fmtN(grandMortPx),            RD,  "Cumulative Px deaths"],
    ["Male Mortality",      fmtN(grandMortCx),            "#7F1D1D", "Cumulative Cx deaths"],
  ].forEach(([lbl, val, col, sub], i) => {
    card(sl, sumCards[i].x, sumCards[i].y, sumCards[i].w, sumCards[i].h,
         lbl, val, col, sub);
  });

  /* ── Female vs Male feed split bar ── */
  const BAR_Y = 0.64 + CH_SUM + 0.10;
  if (grandFeedTotal > 0) {
    sl.addText("Female (Px) vs Male (Cx) — Cumulative Feed Split", {
      x: MARGIN, y: BAR_Y, w: CONTENT_W, h: 0.18,
      fontSize: 7.5, color: SO, fontFace: "Calibri", bold: true,
    });
    sl.addShape(p.shapes.RECTANGLE, {
      x: MARGIN, y: BAR_Y + 0.20,
      w: parseFloat(((pxSharePct / 100) * CONTENT_W).toFixed(3)), h: 0.18,
      fill: { color: PU }, line: { color: PU },
    });
    sl.addShape(p.shapes.RECTANGLE, {
      x: MARGIN + parseFloat(((pxSharePct / 100) * CONTENT_W).toFixed(3)),
      y: BAR_Y + 0.20,
      w: parseFloat(((cxSharePct / 100) * CONTENT_W).toFixed(3)), h: 0.18,
      fill: { color: CY }, line: { color: CY },
    });
    sl.addText(`Female (Px): ${fmtN(grandFeedPx)} kg — ${pxSharePct}%`, {
      x: MARGIN + 0.06, y: BAR_Y + 0.20, w: 4.50, h: 0.18,
      fontSize: 7, color: "FFFFFF", fontFace: "Calibri", bold: true, valign: "middle",
    });
    sl.addText(`Male (Cx): ${fmtN(grandFeedCx)} kg — ${cxSharePct}%`, {
      x: MARGIN + CONTENT_W * 0.52, y: BAR_Y + 0.20, w: 4.00, h: 0.18,
      fontSize: 7, color: "FFFFFF", fontFace: "Calibri", bold: true,
      valign: "middle", align: "right",
    });
  }

  /* ── Main week-by-week table ── */
  const TBL_Y = BAR_Y + 0.44;
  sectionLabel(sl,
    `WEEK-BY-WEEK FEED CONSUMPTION BY BREED — ${wgRows.length} ROWS · ` +
    `${distinctBreeds.length} BREEDS · WEEKS 1–${maxWeek} · NO YEAR FILTER`,
    MARGIN, TBL_Y, AM
  );

  if (wgRows.length > 0) {
    // ── Build table rows grouped visually by breed (shading changes per breed) ──
    const breedColorMap = {};
    distinctBreeds.forEach((b, i) => {
      breedColorMap[b] = i % 2 === 0 ? SF : SF3;
    });

    sl.addTable([
      tblHdr([
        "Breed",
        "Week #",
        "Female (Px)\nFeed kg",
        "Male (Cx)\nFeed kg",
        "Total Feed kg",
        "Px Share %",
        "Cx Share %",
        "Eggs Collected",
        "Hatchable Eggs",
        "Female Mort",
        "Male Mort",
      ], AM),

      ...wgRows.map((r, idx) => {
        const rowFill  = breedColorMap[r.breed] || SF;
        const pxPct    = r.feedTotal > 0
          ? parseFloat(((r.feedPx / r.feedTotal) * 100).toFixed(1)) : 0;
        const cxPct    = r.feedTotal > 0
          ? parseFloat(((100 - pxPct)).toFixed(1)) : 0;
        const isFirst  = idx === 0 || wgRows[idx - 1].breed !== r.breed;

        return [
          // Breed — show name only on first row of each breed group
          {
            text: isFirst ? r.breed : "",
            options: {
              bold: isFirst, color: AM,
              fill: { color: rowFill },
              fontSize: 6.5, fontFace: "Calibri", align: "left",
            },
          },
          // Week #
          {
            text: `Wk ${r.week}`,
            options: {
              color: TX, fill: { color: rowFill },
              fontSize: 6.5, fontFace: "Calibri", align: "center",
            },
          },
          // Female feed kg
          {
            text: r.feedPx > 0 ? fmtN(r.feedPx) : "—",
            options: {
              color: PU, bold: r.feedPx > 0,
              fill: { color: rowFill },
              fontSize: 6.5, fontFace: "Calibri", align: "right",
            },
          },
          // Male feed kg
          {
            text: r.feedCx > 0 ? fmtN(r.feedCx) : "—",
            options: {
              color: CY, bold: r.feedCx > 0,
              fill: { color: rowFill },
              fontSize: 6.5, fontFace: "Calibri", align: "right",
            },
          },
          // Total feed
          {
            text: r.feedTotal > 0 ? fmtN(r.feedTotal) : "—",
            options: {
              color: OR, bold: true,
              fill: { color: rowFill },
              fontSize: 6.5, fontFace: "Calibri", align: "right",
            },
          },
          // Px share %
          {
            text: pxPct > 0 ? `${pxPct}%` : "—",
            options: {
              color: PU, fill: { color: rowFill },
              fontSize: 6.5, fontFace: "Calibri", align: "center",
            },
          },
          // Cx share %
          {
            text: cxPct > 0 ? `${cxPct}%` : "—",
            options: {
              color: CY, fill: { color: rowFill },
              fontSize: 6.5, fontFace: "Calibri", align: "center",
            },
          },
          // Eggs
          {
            text: r.eggs > 0 ? fmtN(r.eggs) : "—",
            options: {
              color: TX, fill: { color: rowFill },
              fontSize: 6.5, fontFace: "Calibri", align: "right",
            },
          },
          // Hatchable
          {
            text: r.hatchable > 0 ? fmtN(r.hatchable) : "—",
            options: {
              color: GR, fill: { color: rowFill },
              fontSize: 6.5, fontFace: "Calibri", align: "right",
            },
          },
          // Female mort
          {
            text: r.mortPx > 0 ? fmtN(r.mortPx) : "—",
            options: {
              color: RD, fill: { color: rowFill },
              fontSize: 6.5, fontFace: "Calibri", align: "right",
            },
          },
          // Male mort
          {
            text: r.mortCx > 0 ? fmtN(r.mortCx) : "—",
            options: {
              color: "#7F1D1D", fill: { color: rowFill },
              fontSize: 6.5, fontFace: "Calibri", align: "right",
            },
          },
        ];
      }),

      // ── Grand total row ──
      [
        { text: "GRAND TOTAL", options: { bold: true, color: TX, fill: { color: SF2 }, fontSize: 6.5, fontFace: "Calibri", align: "left" } },
        { text: `Wks 1–${maxWeek}`, options: { bold: true, color: SO, fill: { color: SF2 }, fontSize: 6.5, fontFace: "Calibri", align: "center" } },
        { text: fmtN(grandFeedPx),    options: { bold: true, color: PU, fill: { color: SF2 }, fontSize: 6.5, fontFace: "Calibri", align: "right" } },
        { text: fmtN(grandFeedCx),    options: { bold: true, color: CY, fill: { color: SF2 }, fontSize: 6.5, fontFace: "Calibri", align: "right" } },
        { text: fmtN(grandFeedTotal), options: { bold: true, color: OR, fill: { color: SF2 }, fontSize: 6.5, fontFace: "Calibri", align: "right" } },
        { text: `${pxSharePct}%`,     options: { bold: true, color: PU, fill: { color: SF2 }, fontSize: 6.5, fontFace: "Calibri", align: "center" } },
        { text: `${cxSharePct}%`,     options: { bold: true, color: CY, fill: { color: SF2 }, fontSize: 6.5, fontFace: "Calibri", align: "center" } },
        { text: fmtN(grandEggs),      options: { bold: true, color: TX, fill: { color: SF2 }, fontSize: 6.5, fontFace: "Calibri", align: "right" } },
        { text: fmtN(grandHatch),     options: { bold: true, color: GR, fill: { color: SF2 }, fontSize: 6.5, fontFace: "Calibri", align: "right" } },
        { text: fmtN(grandMortPx),    options: { bold: true, color: RD, fill: { color: SF2 }, fontSize: 6.5, fontFace: "Calibri", align: "right" } },
        { text: fmtN(grandMortCx),    options: { bold: true, color: "#7F1D1D", fill: { color: SF2 }, fontSize: 6.5, fontFace: "Calibri", align: "right" } },
      ],
    ], {
      x: MARGIN, y: TBL_Y + 0.26, w: CONTENT_W,
      colW: [1.40, 0.52, 0.86, 0.86, 0.86, 0.62, 0.62, 0.86, 0.86, 0.72, 0.72],
      fontSize: 6.5,
      border: { type: "solid", color: SF2 },
      fill: { color: SF },
      rowH: 0.21,
      autoPage: true,
      autoPageRepeatHeader: true,
    });

  } else {
    sl.addText("No weekly gender feed data available — check Feed_Consumed_Kg_Px / Feed_Consumed_Kg_Cx fields in Daily Ops.", {
      x: MARGIN, y: TBL_Y + 0.30, w: CONTENT_W, h: 0.50,
      fontSize: 11, color: TF, fontFace: "Calibri", align: "center",
    });
  }

  footer(sl);
}

  /* ════════════════════════════════════════════════════════════════════════
     SLIDE 4 — EGG COLLECTION & QUALITY
  ════════════════════════════════════════════════════════════════════════ */
  {
    const sl = p.addSlide(); bg(sl); hdr(sl, `Egg Collection & Quality${isFiltered ? " — " + filterLabel : ""}`, CY);

    const CH = 0.82;
    const ROW1_Y = 0.64, ROW2_Y = 0.64 + CH + 0.07;

    const kpis = [
      ["Total Eggs (Week)",        fmtN(xEggsWeek),             CY, `Target: ${fmtN(k.eggsWeekTarget)}`],
      ["Total Eggs (Month)",       fmtN(xEggsMonth),            CY, `Target: ${fmtN(k.eggsMonthTarget)}`],
      [`Total Eggs (${curYear})`,  fmtN(xEggsYear),             CY, `${curYear} year total`],
      ["Hatching Eggs (Week)",     fmtN(xHatchWk),         PU, `Month: ${fmtN(k.hatchingEggsMonth)}`],
      [`Hatching Eggs (${curYear})`, fmtN(k.hatchingEggsYear),       PU, `${curYear} year total`],
      ["Storage Eggs Available",   fmtN(k.storageEggsAvailable),     PU, "Currently in storage"],
      ["Farm Rejected Eggs",       fmtN(k.farmRejectedEggs),         OR, "Cumulative all time"],
      ["Cracked Eggs",             fmtN(k.crackedEggs),              OR, "Cumulative all time"],
      ["Dirty Eggs",               fmtN(k.dirtyEggs),                OR, "Cumulative all time"],
      ["Floor Eggs",               fmtN(k.floorEggs),                AM, "Cumulative all time"],
    ];

    const row1 = cardRow(5, ROW1_Y, CH);
    const row2 = cardRow(5, ROW2_Y, CH);
    kpis.forEach(([lbl, val, col, sub], i) => {
      const pos = i < 5 ? row1[i] : row2[i - 5];
      card(sl, pos.x, pos.y, pos.w, pos.h, lbl, val, col, sub);
    });

    const storageY = ROW2_Y + CH + 0.14;


    /* ── Storage eggs by breed — FULL LIST, no slice, autoPage ── */
    const storageBreeds4 = Object.entries(data?.breedStorageEggs || {})
      .sort((a, b) => b[1] - a[1]); // full list — was .slice(0, 6)
    if (storageBreeds4.length > 0) {
      sectionLabel(sl, `STORAGE EGGS BY BREED — ${storageBreeds4.length} BREEDS, ALL CURRENTLY AVAILABLE`, MARGIN, storageY, PU);
      sl.addTable([
        tblHdr(["Breed", "Available Eggs"], PU),
        ...storageBreeds4.map(([b, q], idx) => tblRow([b, fmtN(q)], idx, [TX, PU])),
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
     SLIDE 5 — HATCHERY PERFORMANCE
  ════════════════════════════════════════════════════════════════════════ */
  {
    const sl = p.addSlide(); bg(sl); hdr(sl, `Hatchery Performance${isFiltered ? " — " + filterLabel : ""}`, AM);

    const CH = 0.82;
    const ROW1_Y = 0.64, ROW2_Y = 0.64 + CH + 0.07;
    const kpis = [
      ["Eggs Set (Week)",      fmtN(xEggsSetWeek),              AM, `Target: ${fmtN(k.eggsSetWeekTarget)}`],
      ["Eggs Set (Month)",     fmtN(xEggsSetMonth),             AM, `Target: ${fmtN(k.eggsSetMonthTarget)}`],
      ["Eggs Set (Year)",      fmtN(h.eggsSetYear),              AM, "Year to date"],
      ["Good Chicks (Week)",   fmtN(xChicksWeek),           GR, `Target: ${fmtN(k.goodChicksWeekTarget)}`],
      ["Good Chicks (Month)",  fmtN(xChicksMonth),          GR, `Target: ${fmtN(k.goodChicksMonthTarget)}`],
      ["Good Chicks (Year)",   fmtN(k.goodChicksYear),           GR, "Year to date"],
      ["Poor Chicks / Culls",  fmtN(h.poorChicks),               RD, "Month"],
      ["DOC Available",        fmtN(k.totalDOC),                 BL, "Day Old Chicks"],
      ["Hatch Forecast (Wk)", fmtN(k.hatchForecastWeek),        PU, "Scheduled hatch dates"],
      ["Hatch Forecast (Mo)", fmtN(k.hatchForecastMonth),       PU, "This month forecast"],
    ];
    const row1 = cardRow(5, ROW1_Y, CH);
    const row2 = cardRow(5, ROW2_Y, CH);
    kpis.forEach(([lbl, val, col, sub], i) => {
      const pos = i < 5 ? row1[i] : row2[i - 5];
      card(sl, pos.x, pos.y, pos.w, pos.h, lbl, val, col, sub);
    });
    const RATE_Y = ROW2_Y + CH + 0.14;
    sectionLabel(sl, "HATCH RATES", MARGIN, RATE_Y, AM);
    const rateCards = cardRow(5, RATE_Y + 0.26, 0.82);
    const hatchTgtWk = rawTarget("hatchability", "week");
    const hatchTgtMo = rawTarget("hatchability", "month");
    const fertTgt    = rawTarget("fertility", "month");
    const eggsSetTgtWk = rawTarget("eggs_set", "week");
    const chicksTgtWk  = rawTarget("good_chicks", "week");

    [
      ["Hatchability % (Wk)", `${h.hatchabilityWeek || 0}%`,
        h.hatchabilityWeek >= (hatchTgtWk ?? 85) ? GR : RD,
        hatchTgtWk != null ? `Target Config: ${hatchTgtWk}%` : "Not configured (using 85% default)"],
      ["Hatchability % (Mo)", `${h.hatchabilityMonth || 0}%`,
        h.hatchabilityMonth >= (hatchTgtMo ?? 85) ? GR : RD,
        hatchTgtMo != null ? `Target Config: ${hatchTgtMo}%` : "Not configured (using 85% default)"],
      ["Fertility Rate %", `${h.fertilityRate || 0}%`,
        h.fertilityRate >= (fertTgt ?? 90) ? GR : AM,
        fertTgt != null ? `Target Config: ${fertTgt}%` : "Not configured (using 90% default)"],
      ["Eggs Set Target (Wk)", eggsSetTgtWk != null ? fmtN(eggsSetTgtWk) : "Not Set", AM, ""],
      ["Good Chicks Target (Wk)", chicksTgtWk != null ? fmtN(chicksTgtWk) : "Not Set", GR, ""],
    ].forEach(([lbl, val, col, sub], i) => {
      card(sl, rateCards[i].x, rateCards[i].y, rateCards[i].w, rateCards[i].h, lbl, val, col, sub);
    });

    /* Recent batches preview (full list lives on Slide 5b) */
    const recentBatches = ALL_BATCHES.slice(-6);
    if (recentBatches.length > 0) {
      const TBL_Y = RATE_Y + 0.26 + 0.82 + 0.10;
      const totalBatchCount = ALL_BATCHES.length;
      sectionLabel(sl, `RECENT ${recentBatches.length} BATCHES — See next slide for all ${totalBatchCount} batches`, MARGIN, TBL_Y, AM);
      sl.addTable([
        tblHdr(["Batch", "Eggs Set", "Fertile", "Hatched", "Hatch %"], AM),
        ...recentBatches.map((b, idx) => {
          const hp = b.set > 0 ? ((b.hatched / b.set) * 100).toFixed(1) + "%" : "—";
          return tblRow([b.batch, fmtN(b.set), fmtN(b.fertile), fmtN(b.hatched), hp], idx, [AM, TX, CY, GR, GR]);
        }),
      ], { x: MARGIN, y: TBL_Y + 0.26, w: CONTENT_W, colW: [1.93, 1.93, 1.93, 1.93, 1.88], fontSize: 7, border: { type: "solid", color: SF2 }, fill: { color: SF }, rowH: 0.22, autoPage: false });
    }
    footer(sl);
  }

  /* ══════════════════════════════════════════════════════════════════
   SLIDE 5b — COMPLETE HATCHERY BATCH HISTORY (CORRECTED)
   Completed batches → hatchability calculation
   Active batches   → pipeline / forecast (excluded from %)
══════════════════════════════════════════════════════════════════ */
{
  const sl = p.addSlide(); bg(sl);
  hdr(sl, `Complete Hatchery Batch History — All ${ALL_BATCHES.length} Batches`, GR);

  // ── Totals from COMPLETED batches only ──────────────────────────
  const totalSet      = completedBatches.reduce((s, b) => s + b.set,     0);
  const totalFertile  = completedBatches.reduce((s, b) => s + b.fertile, 0);
  const totalHatched  = completedBatches.reduce((s, b) => s + b.hatched, 0);
  const overallHatch  = totalSet > 0
    ? parseFloat(((totalHatched / totalSet) * 100).toFixed(1)) : 0;
  const overallFert   = totalSet > 0
    ? parseFloat(((totalFertile / totalSet) * 100).toFixed(1)) : 0;

  // ── Pipeline / forecast totals (active) ─────────────────────────
  const activeSetTotal = activeBatches.reduce((s, b) => s + b.set, 0);

  const peakBatch = completedBatches.reduce(
    (best, b) => b.hatched > best.hatched ? b : best,
    { hatched: 0, batch: "—" }
  );

  // ── Summary KPI cards ────────────────────────────────────────────
  const topCards = cardRow(6, 0.64, 0.82);
  [
    ["Total Batches",           fmtN(ALL_BATCHES.length),     AM,
     `Completed: ${completedBatches.length} · Active: ${activeBatches.length}`],
    ["Completed — Eggs Set",    fmtN(totalSet),                AM,
     `From ${completedBatches.length} hatched batches only`],
    ["Completed — Fertile",     fmtN(totalFertile),            CY,
     `Fertility (completed): ${overallFert}%`],
    ["Completed — Good Chicks", fmtN(totalHatched),            GR,
     "Hatched batches only"],
    ["Hatchability (Completed)",`${overallHatch}%`,
     overallHatch >= 85 ? GR : RD,
     `Target ≥${k.hatchabilityTarget || 85}%  ·  Best: ${peakBatch.batch}`],
    ["Active Pipeline Eggs",    fmtN(activeSetTotal),          BL,
     `${activeBatches.length} batches still incubating / forecast`],
  ].forEach(([lbl, val, col, sub], i) => {
    card(sl, topCards[i].x, topCards[i].y, topCards[i].w, topCards[i].h,
         lbl, val, col, sub);
  });

  const TBL_Y = 0.64 + 0.82 + 0.12;

  // ── SECTION A: Completed batches ─────────────────────────────────
  sectionLabel(sl,
    `COMPLETED BATCHES (${completedBatches.length}) — HATCHABILITY CALCULATED FROM THESE ONLY`,
    MARGIN, TBL_Y, GR
  );

  if (completedBatches.length > 0) {
    sl.addTable([
      tblHdr(["#", "Batch", "Set Date", "Hatch Date", "Eggs Set",
              "Fertile", "Fert %", "Hatched", "Hatch %", "Culls/Infertile"], GR),
      ...completedBatches.map((b, idx) => {
        const fertPct  = b.set > 0
          ? parseFloat(((b.fertile / b.set) * 100).toFixed(1)) + "%" : "—";
        const hatchPct = b.set > 0
          ? parseFloat(((b.hatched / b.set) * 100).toFixed(1)) + "%" : "—";
        const culls    = b.fertile > b.hatched
          ? fmtN(b.fertile - b.hatched) : "—";
        return tblRow(
          [idx + 1, b.batch,
           b.settingDate || "—", b.hatchedDate || "—",
           fmtN(b.set), fmtN(b.fertile), fertPct,
           fmtN(b.hatched), hatchPct, culls],
          idx,
          [SO, AM, TF, TF, TX, CY, CY, GR,
           b.set > 0 && parseFloat(hatchPct) >= 85 ? GR : RD, OR]
        );
      }),
      // Totals row
      [
        { text: "TOTAL", options: { bold:true, color:TX, fill:{color:SF2}, fontSize:7, fontFace:"Calibri", align:"left" } },
        { text: "",      options: { bold:false,color:TF, fill:{color:SF2}, fontSize:7, fontFace:"Calibri", align:"left" } },
        { text: "",      options: { bold:false,color:TF, fill:{color:SF2}, fontSize:7, fontFace:"Calibri", align:"left" } },
        { text: "",      options: { bold:false,color:TF, fill:{color:SF2}, fontSize:7, fontFace:"Calibri", align:"left" } },
        { text: fmtN(totalSet),     options: { bold:true, color:AM, fill:{color:SF2}, fontSize:7, fontFace:"Calibri", align:"left" } },
        { text: fmtN(totalFertile), options: { bold:true, color:CY, fill:{color:SF2}, fontSize:7, fontFace:"Calibri", align:"left" } },
        { text: `${overallFert}%`,  options: { bold:true, color:CY, fill:{color:SF2}, fontSize:7, fontFace:"Calibri", align:"left" } },
        { text: fmtN(totalHatched), options: { bold:true, color:GR, fill:{color:SF2}, fontSize:7, fontFace:"Calibri", align:"left" } },
        { text: `${overallHatch}%`, options: {
            bold:true, color:overallHatch>=85?GR:RD,
            fill:{color:SF2}, fontSize:7, fontFace:"Calibri", align:"left"
          }},
        { text: "",      options: { bold:false,color:TX, fill:{color:SF2}, fontSize:7, fontFace:"Calibri", align:"left" } },
      ],
    ], {
      x: MARGIN, y: TBL_Y + 0.26, w: CONTENT_W,
      colW: [0.38, 1.00, 0.90, 0.90, 0.88, 0.88, 0.72, 0.88, 0.72, 1.34],
      fontSize:7, border:{type:"solid",color:SF2}, fill:{color:SF}, rowH:0.22,
      autoPage:true, autoPageRepeatHeader:true,
    });
  } else {
    sl.addText("No completed (hatched) batches found.", {
      x: MARGIN, y: TBL_Y + 0.28, w: CONTENT_W, h: 0.30,
      fontSize: 10, color: TF, fontFace: "Calibri",
    });
  }

  // ── SECTION B: Active / pipeline batches (continuation slide) ────
  if (activeBatches.length > 0) {
    const sl5c = p.addSlide(); bg(sl5c);
    hdr(sl5c,
      `Hatchery Pipeline — ${activeBatches.length} Active Batches (Excluded from Hatchability %)`,
      AM
    );

    // Pipeline summary cards
    const pipeCards = cardRow(4, 0.64, 0.82);
    const pipeSetTotal     = activeBatches.reduce((s, b) => s + b.set, 0);
    const pendingCount     = pendingBatches.length;
    const dueCount         = dueNotHatchedBatches.length;
    [
      ["Active Batches",         fmtN(activeBatches.length),  BL,
       "Setted or Candled — not yet hatched"],
      ["Eggs in Incubation",     fmtN(pipeSetTotal),           AM,
       "Total settable eggs from active batches"],
      ["Batches Not Yet Due",    fmtN(pendingCount),            CY,
       "No scheduled hatch date yet"],
      ["Batches Past Due Date",  fmtN(dueCount),               dueCount > 0 ? RD : GR,
       dueCount > 0 ? "Hatch date passed — data may be missing" : "All on schedule"],
    ].forEach(([lbl, val, col, sub], i) => {
      card(sl5c, pipeCards[i].x, pipeCards[i].y, pipeCards[i].w, pipeCards[i].h,
           lbl, val, col, sub);
    });

    sectionLabel(sl5c,
      `ACTIVE / PIPELINE BATCHES — EXCLUDED FROM HATCHABILITY % (${activeBatches.length})`,
      MARGIN, 0.64 + 0.82 + 0.12, AM
    );

    sl5c.addTable([
      tblHdr(["#", "Batch", "Set Date", "Scheduled Hatch", "Eggs Set",
              "Status", "Note"], AM),
      ...activeBatches.map((b, idx) => {
        const isPastDue = b.scheduledDate && b.scheduledDate !== "—" &&
          new Date(b.scheduledDate) < new Date();
        const note = isPastDue
          ? "Past scheduled date — check status"
          : "Incubating / awaiting hatch";
        return tblRow(
          [idx + 1, b.batch,
           b.settingDate  || "—",
           b.scheduledDate|| b.hatchedDate || "—",
           fmtN(b.set),
           "Active (Setted/Candled)",
           note],
          idx,
          [SO, AM, TF, isPastDue ? RD : CY, TX, BL, isPastDue ? RD : SO]
        );
      }),
      [
        { text: "PIPELINE TOTAL", options:{ bold:true, color:TX, fill:{color:SF2}, fontSize:7, fontFace:"Calibri", align:"left" } },
        { text: "",               options:{ color:TF,  fill:{color:SF2}, fontSize:7, fontFace:"Calibri", align:"left" } },
        { text: "",               options:{ color:TF,  fill:{color:SF2}, fontSize:7, fontFace:"Calibri", align:"left" } },
        { text: "",               options:{ color:TF,  fill:{color:SF2}, fontSize:7, fontFace:"Calibri", align:"left" } },
        { text: fmtN(pipeSetTotal), options:{ bold:true, color:AM, fill:{color:SF2}, fontSize:7, fontFace:"Calibri", align:"left" } },
        { text: `${activeBatches.length} batches`, options:{ bold:true, color:BL, fill:{color:SF2}, fontSize:7, fontFace:"Calibri", align:"left" } },
        { text: "Forecast only — not in hatch%", options:{ color:SO, fill:{color:SF2}, fontSize:7, fontFace:"Calibri", align:"left" } },
      ],
    ], {
      x: MARGIN, y: 0.64 + 0.82 + 0.12 + 0.26, w: CONTENT_W,
      colW: [0.38, 1.00, 0.90, 1.00, 0.88, 1.60, 3.84],
      fontSize:7, border:{type:"solid",color:SF2}, fill:{color:SF}, rowH:0.24,
      autoPage:true, autoPageRepeatHeader:true,
    });

    footer(sl5c);
  }

  footer(sl);
}


/* ════════════════════════════════════════════════════════════════════════
   SLIDE — SATO COMMISSIONS
════════════════════════════════════════════════════════════════════════ */
{
  const sl = p.addSlide(); bg(sl);
  hdr(sl, "SATO Commissions — Monthly Payables (Delivered Orders Only)", GR);

  const satoComm  = c4uS.satoCommissionConfig || {};
  const satoList  = c4uS.topSatos || [];
  const totalComm = c4uS.totalSatoCommissionPayable || 0;

  // ── Summary cards ──
  const topCards = cardRow(5, 0.64, 0.82);
  [
    ["Total Commission Payable", `GHC ${fmtN(totalComm, 2)}`, GR,
      "All SATOs — delivered chicks only"],
    ["Granger Rate",  `GHC ${satoComm.grangerRate || 0.30}/chick`,  AM,
      "Always paid · no target"],
    ["Layer Rate",    `GHC ${satoComm.layerRate   || 0.20}/chick`,  GR,
      satoComm.layerTarget > 0
        ? `Target: ${fmtN(satoComm.layerTarget)} chicks/mo`
        : "No target set"],
    ["Broiler Rate",  `GHC ${satoComm.broilerRate || 0.20}/chick`,  BL,
      satoComm.broilerTarget > 0
        ? `Target: ${fmtN(satoComm.broilerTarget)} chicks/mo`
        : "No target set"],
    ["SATOs Tracked", fmtN(satoList.length), CY, "With delivered orders"],
  ].forEach(([lbl, val, col, sub], i) => {
    card(sl, topCards[i].x, topCards[i].y, topCards[i].w, topCards[i].h,
         lbl, val, col, sub);
  });

  const TBL_Y = 0.64 + 0.82 + 0.14;
  sectionLabel(sl,
    `PER-SATO COMMISSION BREAKDOWN — ${satoList.length} SATOs · DELIVERED ORDERS ONLY`,
    MARGIN, TBL_Y, GR
  );

  if (satoList.length > 0) {
    const totalGrangers  = satoList.reduce((a,b) => a + (b.grangersDelivered  || 0), 0);
    const totalLayers    = satoList.reduce((a,b) => a + (b.layersDelivered    || 0), 0);
    const totalBroilers  = satoList.reduce((a,b) => a + (b.broilersDelivered  || 0), 0);
    const totalGrComm    = satoList.reduce((a,b) => a + (b.grangerCommission  || 0), 0);
    const totalLayComm   = satoList.reduce((a,b) => a + (b.layerCommission    || 0), 0);
    const totalBroComm   = satoList.reduce((a,b) => a + (b.broilerCommission  || 0), 0);

    sl.addTable([
      tblHdr([
        "#", "SATO Name",
        "Grangers", "Layers", "Broilers",
        "Granger Comm\n(GHC)", "Layer Target\nMet?",
        "Layer Comm\n(GHC)", "Broiler Target\nMet?",
        "Broiler Comm\n(GHC)", "TOTAL Comm\n(GHC)",
      ], GR),

      ...satoList.map((st, idx) => {
        const layerOk   = st.meetsLayerTarget;
        const broilerOk = st.meetsBroilerTarget;
        const fill = idx % 2 === 0 ? { color: SF } : { color: SF3 };
        const cell = (txt, col) => ({
          text: String(txt ?? "—"),
          options: { color: col, fill, fontSize: 6.5, fontFace: "Calibri", align: "right" },
        });
        const cellL = (txt, col) => ({
          text: String(txt ?? "—"),
          options: { color: col, fill, fontSize: 6.5, fontFace: "Calibri", align: "left" },
        });
        return [
          cellL(idx + 1,  SO),
          cellL(st.name,  TX),
          cell(fmtN(st.grangersDelivered  || 0), AM),
          cell(fmtN(st.layersDelivered    || 0), layerOk   ? GR : RD),
          cell(fmtN(st.broilersDelivered  || 0), broilerOk ? GR : RD),
          cell(`GHC ${fmtN(st.grangerCommission || 0, 2)}`, AM),
          {
            text: layerOk ? "Yes ✓" : (st.layersDelivered > 0 ? "No ✗" : "N/A"),
            options: { color: layerOk ? GR : (st.layersDelivered > 0 ? RD : TF),
              fill, fontSize: 6.5, fontFace: "Calibri", align: "center", bold: true },
          },
          cell(layerOk
            ? `GHC ${fmtN(st.layerCommission || 0, 2)}`
            : "—", layerOk ? GR : TF),
          {
            text: broilerOk ? "Yes ✓" : (st.broilersDelivered > 0 ? "No ✗" : "N/A"),
            options: { color: broilerOk ? GR : (st.broilersDelivered > 0 ? RD : TF),
              fill, fontSize: 6.5, fontFace: "Calibri", align: "center", bold: true },
          },
          cell(broilerOk
            ? `GHC ${fmtN(st.broilerCommission || 0, 2)}`
            : "—", broilerOk ? GR : TF),
          {
            text: `GHC ${fmtN(st.totalCommission || 0, 2)}`,
            options: { color: GR, fill, fontSize: 7, fontFace: "Calibri",
              align: "right", bold: true },
          },
        ];
      }),

      // Totals row
      [
        { text: "TOTAL", options: { bold:true, color:TX, fill:{color:SF2}, fontSize:7, fontFace:"Calibri", align:"left" } },
        { text: `${satoList.length} SATOs`, options: { bold:false, color:SO, fill:{color:SF2}, fontSize:6.5, fontFace:"Calibri", align:"left" } },
        { text: fmtN(totalGrangers), options: { bold:true, color:AM, fill:{color:SF2}, fontSize:7, fontFace:"Calibri", align:"right" } },
        { text: fmtN(totalLayers),   options: { bold:true, color:GR, fill:{color:SF2}, fontSize:7, fontFace:"Calibri", align:"right" } },
        { text: fmtN(totalBroilers), options: { bold:true, color:BL, fill:{color:SF2}, fontSize:7, fontFace:"Calibri", align:"right" } },
        { text: `GHC ${fmtN(totalGrComm,  2)}`, options: { bold:true, color:AM, fill:{color:SF2}, fontSize:7, fontFace:"Calibri", align:"right" } },
        { text: "",  options: { fill:{color:SF2}, fontSize:6.5, fontFace:"Calibri", align:"center" } },
        { text: `GHC ${fmtN(totalLayComm, 2)}`, options: { bold:true, color:GR, fill:{color:SF2}, fontSize:7, fontFace:"Calibri", align:"right" } },
        { text: "",  options: { fill:{color:SF2}, fontSize:6.5, fontFace:"Calibri", align:"center" } },
        { text: `GHC ${fmtN(totalBroComm, 2)}`, options: { bold:true, color:GR, fill:{color:SF2}, fontSize:7, fontFace:"Calibri", align:"right" } },
        { text: `GHC ${fmtN(totalComm,    2)}`, options: { bold:true, color:GR, fill:{color:SF2}, fontSize:8, fontFace:"Calibri", align:"right" } },
      ],
    ], {
      x: MARGIN, y: TBL_Y + 0.26, w: CONTENT_W,
      colW: [0.32, 1.50, 0.68, 0.68, 0.68, 0.88, 0.68, 0.88, 0.74, 0.88, 0.96],
      fontSize: 6.5,
      border: { type: "solid", color: SF2 },
      fill: { color: SF },
      rowH: 0.22,
      autoPage: true,
      autoPageRepeatHeader: true,
    });

      /* ── Monthly SATO Commission Breakdown ── */
const satoMonthlyRows = c4uS.satoCommissionByMonth || [];
if (satoMonthlyRows.length > 0) {
  const monthGroups = [...new Set(satoMonthlyRows.map(r => r.month))].sort();
  monthGroups.forEach((mk) => {
    const monthRows = satoMonthlyRows.filter(r => r.month === mk).sort((a,b) => b.total - a.total);
    const monthLabel = monthRows[0]?.monthLabel || mk;
    const sl2 = p.addSlide(); bg(sl2);
    hdr(sl2, `SATO Commissions — ${monthLabel}`, GR);

    const totGr = monthRows.reduce((a,b)=>a+b.grangersDelivered,0);
    const totLy = monthRows.reduce((a,b)=>a+b.layersDelivered,0);
    const totBr = monthRows.reduce((a,b)=>a+b.broilersDelivered,0);
    const totComm = monthRows.reduce((a,b)=>a+b.total,0);

    const topCards2 = cardRow(4, 0.64, 0.82);
    [
      ["Total Commission", `GHC ${fmtN(totComm,2)}`, GR, `${monthRows.length} SATOs active`],
      ["Grangers Delivered", fmtN(totGr), AM, ""],
      ["Layers Delivered", fmtN(totLy), GR, ""],
      ["Broilers Delivered", fmtN(totBr), BL, ""],
    ].forEach(([lbl,val,col,sub],i) => {
      card(sl2, topCards2[i].x, topCards2[i].y, topCards2[i].w, topCards2[i].h, lbl, val, col, sub);
    });

    sectionLabel(sl2, `PER-SATO BREAKDOWN — ${monthLabel}`, MARGIN, 0.64+0.82+0.14, GR);
    sl2.addTable([
      tblHdr(["SATO", "Grangers", "Layers", "Broilers", "Granger Comm", "Layer Comm", "Broiler Comm", "Total"], GR),
      ...monthRows.map((r, idx) => tblRow([
        r.sato,
        fmtN(r.grangersDelivered),
        fmtN(r.layersDelivered),
        fmtN(r.broilersDelivered),
        `GHC ${fmtN(r.grangerComm,2)}`,
        r.meetsLayerTarget ? `GHC ${fmtN(r.layerComm,2)}` : "—",
        r.meetsBroilerTarget ? `GHC ${fmtN(r.broilerComm,2)}` : "—",
        `GHC ${fmtN(r.total,2)}`,
      ], idx, [AM, AM, GR, BL, AM, GR, GR, GR])),
    ], {
      x: MARGIN, y: 0.64+0.82+0.14+0.26, w: CONTENT_W,
      colW: [1.80, 0.90, 0.90, 0.90, 1.10, 1.10, 1.10, 1.10],
      fontSize: 7, border: { type: "solid", color: SF2 }, fill: { color: SF }, rowH: 0.22,
      autoPage: true, autoPageRepeatHeader: true,
    });
    footer(sl2);
  });
}
  } else {
    sl.addText("No SATO commission data available — no delivered orders found.", {
      x: MARGIN, y: TBL_Y + 0.30, w: CONTENT_W, h: 0.40,
      fontSize: 11, color: TF, fontFace: "Calibri", align: "center",
    });
  }

  footer(sl);
}

  /* ════════════════════════════════════════════════════════════════════════
     SLIDE 6 — FEED OPERATIONS
  ════════════════════════════════════════════════════════════════════════ */
  {
    const sl = p.addSlide(); bg(sl); hdr(sl, "Feed Operations — Feed Mill", AM);
    const CH = 0.82;
    const ROW1_Y = 0.64, ROW2_Y = 0.64 + CH + 0.07;
    const kpis = [
      ["Produced (MT/Month)", fmtN(fm.producedMT, 1),    AM, `Day: ${fmtN(fm.producedDay, 1)} MT · Wk: ${fmtN(fm.producedWeekMT,1)} MT`],
      ["Produced (MT/Year)",  fmtN(fm.producedYearMT, 1),AM, "Year to date"],
      ["Issued (MT/Month)",   fmtN(fm.issuedMonth, 1),   BL, `Week: ${fmtN(fm.issuedWeek, 1)} MT`],
      ["Prod vs Demand %",    `${fm.productionVsDemand || 0}%`, fm.productionVsDemand >= 95 ? GR : AM, "Issued ÷ Produced"],
      ["Cost Per Feed kg (Set)",
       k.costPerFeedKg > 0 ? `GHC ${k.costPerFeedKg}` : "—",
       k.feedCostKgTarget > 0 ? GR : AM,
       k.feedCostKgTarget > 0
         ? `Target Config: GHC ${k.feedCostKgTarget}`
         : fd.costPerKg > 0
           ? `Delivery avg: GHC ${fd.costPerKg}`
           : "Auto-calculated"],
      ["Actual Cost/kg (Deliveries)",
       fd.costPerKg > 0 ? `GHC ${fd.costPerKg}` : "—",
       CY,
       `Weighted avg from invoiced deliveries`],
      ["Feed Delivery Cost (Mo)",  fmtCur(fd.costMonth),      OR, `Week: ${fmtCur(fd.costWeek)}`],
      ["Feed Delivery Cost (Yr)",  fmtCur(fd.costYear),       OR, "Year to date"],
      ["Consumed kg (Month, Ops)", fmtN(fd.consumedKgMonth),  CY, `from Daily Ops records`],
      ["Consumed kg (Year, Ops)",  fmtN(fd.consumedKgYear),   CY, "Year to date"],
    ];
    const row1 = cardRow(5, ROW1_Y, CH);
    const row2 = cardRow(5, ROW2_Y, CH);
    kpis.forEach(([lbl, val, col, sub], i) => {
      const pos = i < 5 ? row1[i] : row2[i - 5];
      card(sl, pos.x, pos.y, pos.w, pos.h, lbl, val, col, sub);
    });
    const TBL_Y = ROW2_Y + CH + 0.14;
    sectionLabel(sl, "CONSUMED vs ACTUAL DELIVERY COST", MARGIN, TBL_Y, AM);
    sl.addTable([
      tblHdr(["Period", "Consumed kg", "Std Cost (kg × set price)", "Actual Delivery Cost", "Variance", "Direction"], AM),
      ...["Week", "Month", "Year"].map((period, idx) => {
        const kgMap  = { Week: fd.consumedKgWeek,   Month: fd.consumedKgMonth,   Year: fd.consumedKgYear   };
        const ccMap  = { Week: fd.consumedCostWeek, Month: fd.consumedCostMonth, Year: fd.consumedCostYear };
        const acMap  = { Week: fd.costWeek,         Month: fd.costMonth,         Year: fd.costYear         };
        const varMap = { Week: fd.varianceWeek,     Month: fd.varianceMonth,     Year: fd.varianceYear     };
        const variance = varMap[period] || 0;
        const dir = variance > 0 ? "Over Standard" : variance < 0 ? "Under Standard" : "On Target";
        return tblRow([period, fmtN(kgMap[period]) + " kg", fmtCur(ccMap[period]), fmtCur(acMap[period]),
          variance !== 0 ? `${variance > 0 ? "+" : ""}${fmtCur(variance)}` : "—", dir],
          idx, [TX, CY, AM, OR, variance > 0 ? RD : GR, variance > 0 ? RD : GR]);
      }),
    ], { x: MARGIN, y: TBL_Y + 0.26, w: CONTENT_W, colW: [0.80, 1.50, 2.10, 2.10, 1.55, 1.55], fontSize: 7, border: { type: "solid", color: SF2 }, fill: { color: SF }, rowH: 0.26 });

    sl.addText(
      `Set Price/kg: GHC ${fd.setPrice || 0}  ·  Actual Cost/kg: GHC ${fd.costPerKg || 0}  ·  Source: ${fd.setSource || "Auto"}`,
      { x: MARGIN, y: 5.00, w: CONTENT_W, h: 0.16, fontSize: 7, color: TF, fontFace: "Calibri" }
    );

    /* ── Feed consumed by breed — FULL LIST, no slice, on continuation slide ── */
    const breedFeedRows = Object.entries(data?.breedEggData || {})
      .filter(([, e]) => (e.feedKgMonth || 0) > 0)
      .sort((a, b) => (b[1].feedKgMonth || 0) - (a[1].feedKgMonth || 0)); // was .slice(0, 6)

    if (breedFeedRows.length > 0) {
      const sl6b = p.addSlide(); bg(sl6b); hdr(sl6b, "Feed Consumption by Breed — Daily Ops", AM);
      sectionLabel(sl6b, `FEED CONSUMED BY BREED (THIS MONTH) — ${breedFeedRows.length} BREEDS — FROM DAILY OPS REPORT`, MARGIN, 0.64, AM);
      sl6b.addTable([
        tblHdr(["Breed", "Feed kg (Week)", "Feed kg (Month)", "Feed kg (Year)",
                "Est. Cost (Mo, GHC)", "Cost/kg Source", "Delivery Cost (Mo)"], AM),
        ...breedFeedRows.map(([breed, e], idx) => {
          const estCost = (e.feedKgMonth || 0) * (k.costPerFeedKg || 0);
          const delCost = fd.breedCostMonth?.[breed] || 0;
          return tblRow([
            breed,
            fmtN(e.feedKgWeek || 0) + " kg",
            fmtN(e.feedKgMonth || 0) + " kg",
            fmtN(e.feedKgYear || 0) + " kg",
            estCost > 0 ? fmtCur(estCost) : "—",
            k.feedCostKgTarget > 0 ? "Target Config" : "Auto",
            delCost > 0 ? fmtCur(delCost) : "—",
          ], idx, [AM, CY, CY, CY, OR, TF, OR]);
        }),
      ], {
        x: MARGIN, y: 0.90, w: CONTENT_W,
        colW: [1.52, 1.18, 1.18, 1.18, 1.40, 1.10, 2.04],
        fontSize: 7, border: { type: "solid", color: SF2 }, fill: { color: SF }, rowH: 0.26,
        autoPage: true, autoPageRepeatHeader: true,
      });
      footer(sl6b);
    }

    footer(sl);
  }

  /* ════════════════════════════════════════════════════════════════════════
     SLIDE 7 — FEED DELIVERIES
  ════════════════════════════════════════════════════════════════════════ */
  {
    const sl = p.addSlide(); bg(sl); hdr(sl, "Feed Deliveries — Actual Invoiced Cost", CY);
    const topCards = cardRow(4, 0.64, 0.88);
    [
      ["Delivery Cost (Wk)",  fmtCur(fd.costWeek),    AM, `kg: ${fmtN(fd.kgWeek)}`],
      ["Delivery Cost (Mo)",  fmtCur(fd.costMonth),   AM, `kg: ${fmtN(fd.kgMonth)}`],
      ["Delivery Cost (Yr)",  fmtCur(fd.costYear),    AM, `kg: ${fmtN(fd.kgYear)}`],
      ["Actual Cost/kg (Mo)", `GHC ${fd.costPerKg || 0}`, CY, "Weighted avg"],
    ].forEach(([lbl, val, col, sub], i) => {
      card(sl, topCards[i].x, topCards[i].y, topCards[i].w, topCards[i].h, lbl, val, col, sub);
    });
    const SEC_Y = 0.64 + 0.88 + 0.14;
    const LEFT_W = 4.64, RIGHT_W = CONTENT_W - LEFT_W - 0.10;
    const LEFT_X = MARGIN, RIGHT_X = MARGIN + LEFT_W + 0.10;

    /* FULL LIST — no slice(0,8) */
    const breeds = Object.entries(fd.breedCostMonth || {}).sort((a, b) => b[1] - a[1]);
    sectionLabel(sl, `FEED COST BY BREED — THIS MONTH (${breeds.length})`, LEFT_X, SEC_Y, CY);
    if (breeds.length) {
      sl.addTable([
        tblHdr(["Breed", "Cost (GHC)", "kg (Mo)", "Cost/kg"], CY),
        ...breeds.map(([breed, cost], idx) => {
          const kg = fd.breedKgMonth?.[breed] || 0;
          const cpkg = kg > 0 ? (cost / kg).toFixed(2) : "—";
          return tblRow([breed, fmtCur(cost), fmtN(kg), `GHC ${cpkg}`], idx, [AM, TX, CY, OR]);
        }),
      ], { x: LEFT_X, y: SEC_Y + 0.26, w: LEFT_W, colW: [1.60, 1.20, 1.02, 0.82], fontSize: 7, border: { type: "solid", color: SF2 }, fill: { color: SF }, rowH: 0.24, autoPage: true, autoPageRepeatHeader: true });
    }

    /* FULL LIST — no slice(0,8) */
    const farms = Object.entries(fd.byFarm || {}).sort((a, b) => b[1] - a[1]);
    sectionLabel(sl, `FEED COST BY FARM — ALL TIME (${farms.length})`, RIGHT_X, SEC_Y, CY);
    if (farms.length) {
      sl.addTable([
        tblHdr(["Farm", "Total Cost (GHC)"], CY),
        ...farms.map(([farm, cost], idx) => tblRow([farm, fmtCur(cost)], idx, [TX, OR])),
      ], { x: RIGHT_X, y: SEC_Y + 0.26, w: RIGHT_W, colW: [3.36, 1.50], fontSize: 7, border: { type: "solid", color: SF2 }, fill: { color: SF }, rowH: 0.24, autoPage: true, autoPageRepeatHeader: true });
    }

    const DEL_Y = SEC_Y + 0.26 + 0.24 * (Math.max(breeds.length, farms.length) + 1) + 0.14;
    const safeDelY = Math.max(DEL_Y, 4.10);

    /* fd.recent is already capped at 10 by loadAllData — show all of it, no extra slice */
    sectionLabel(sl, `RECENT DELIVERIES (${(fd.recent || []).length})`, MARGIN, safeDelY, CY);
    if ((fd.recent || []).length) {
      sl.addTable([
        tblHdr(["Date", "Feed Name", "Type", "Qty (kg)", "Cost (GHC)", "Cost/kg", "Bins"], CY),
        ...(fd.recent || []).map((r, idx) =>
          tblRow([r.date?.slice(0, 10) || "—", r.feedName, r.feedType, fmtN(r.qtyKg), fmtCur(r.feedCost), `GHC ${r.costPerKg || 0}`, r.binCount], idx, [TF, TX, SO, CY, GR, OR, TX])),
      ], { x: MARGIN, y: safeDelY + 0.26, w: CONTENT_W, colW: [0.88, 2.10, 1.00, 0.96, 1.28, 1.08, 2.30], fontSize: 7, border: { type: "solid", color: SF2 }, fill: { color: SF }, rowH: 0.22, autoPage: true, autoPageRepeatHeader: true });
    }
    footer(sl);
  }

  /* ════════════════════════════════════════════════════════════════════════
     SLIDE 8 — COST ANALYSIS
  ════════════════════════════════════════════════════════════════════════ */
  {
    const sl = p.addSlide(); bg(sl); hdr(sl, "Cost Analysis — Pricing & Margins", OR);
    const LEFT_W = 5.72, RIGHT_X = MARGIN + LEFT_W + 0.10, RIGHT_W = CONTENT_W - LEFT_W - 0.10;
    const sections = [
      { title: "COST PER HATCHING EGG", y0: 0.64, col: OR,
        vals: [[k.costPerHatchingEggWeek,"Week",""],[k.costPerHatchingEggMonth,"Month",""],[k.costPerHatchingEggYear,"Year",""]],
        fmt: v => v > 0 ? `GHC ${fmtN(v, 2)}` : "—" },
      { title: "SELLING PRICE / HATCHING EGG", y0: 1.78, col: CY,
        vals: [[k.sellingPxHatchingEggWeek,"Week",`Margin: ${k.hatchingEggMarginPct||66}%`],[k.sellingPxHatchingEggMonth,"Month",""],[k.sellingPxHatchingEggYear,"Year",""]],
        fmt: v => v > 0 ? `GHC ${fmtN(v, 2)}` : "—" },
      { title: "COST PER CHICK DOC", y0: 2.92, col: AM,
        vals: [[k.costPerChickWeek,"Week",""],[k.costPerChickMonth,"Month",""],[k.costPerChickYear,"Year",""]],
        fmt: v => v > 0 ? `GHC ${fmtN(v)}` : "—" },
    ];
    sections.forEach(({ title, y0, col, vals, fmt }) => {
      sectionLabel(sl, title, MARGIN, y0, col);
      const cw = (LEFT_W - 0.12) / 3;
      vals.forEach(([val, lbl, sub], i) => {
        card(sl, MARGIN + i * (cw + 0.06), y0 + 0.26, cw, 0.82, lbl, fmt(val), col, sub || "");
      });
    });
    sectionLabel(sl, "CHICK SELLING PRICE", RIGHT_X, 0.64, GR);
    [[k.chickSellingPxWeek,"Week"],[k.chickSellingPxMonth,"Month"],[k.chickSellingPxYear,"Year"]].forEach(([val, lbl], i) => {
      const ry = 0.90 + i * 0.52;
      sl.addShape(p.shapes.RECTANGLE, { x: RIGHT_X, y: ry, w: RIGHT_W, h: 0.44, fill: { color: SF }, line: { color: GR + "44", pt: 1 } });
      sl.addText(lbl, { x: RIGHT_X + 0.10, y: ry, w: 1.00, h: 0.44, fontSize: 9, color: SO, fontFace: "Calibri", valign: "middle", margin: 0 });
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
    sectionLabel(sl, "MARGIN CONFIGURATION", RIGHT_X, 2.62, OR);
    configRows.forEach(([lbl, val, col], i) => {
      const ry = 2.88 + i * 0.28;
      sl.addShape(p.shapes.RECTANGLE, { x: RIGHT_X, y: ry, w: RIGHT_W, h: 0.24, fill: { color: i % 2 === 0 ? SF : SF3 }, line: { color: SF2, pt: 1 } });
      sl.addText(lbl, { x: RIGHT_X + 0.10, y: ry, w: RIGHT_W - 1.20, h: 0.24, fontSize: 7, color: SO, fontFace: "Calibri", valign: "middle", margin: 0 });
      sl.addText(val, { x: RIGHT_X + RIGHT_W - 1.10, y: ry, w: 1.00, h: 0.24, fontSize: 7, bold: true, color: col, fontFace: "Calibri", align: "right", valign: "middle", margin: 0 });
    });
    footer(sl);
  }

  /* ════════════════════════════════════════════════════════════════════════
     SLIDE 10 — CHICKEN4U FIELD SALES
  ════════════════════════════════════════════════════════════════════════ */
  {
    const sl = p.addSlide(); bg(sl); hdr(sl, "Chicken4U — Field Sales Dashboard", AM);
    const CH = 0.80;
    sectionLabel(sl, "MUO NETWORK & LEARNERS", MARGIN, 0.64, AM);
    const muoCards = cardRow(6, 0.90, CH);
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
    sectionLabel(sl, "CHICK ORDERS SUMMARY", MARGIN, 0.90 + CH + 0.10, AM);
    const ordCards = cardRow(6, 0.90 + CH + 0.36, CH);
    [
      ["Total Ordered",     fmtN(c4uS.chicksOrdered),   BL, "All breeds combined"],
      ["Total Delivered",   fmtN(c4uS.chicksDelivered), GR, ""],
      ["Total Pending",     fmtN(c4uS.chicksPending),   RD, ""],
      ["Orders Delivered",  fmtN(c4uS.ordersDelivered), GR, "Order count"],
      ["Orders Pending",    fmtN(c4uS.ordersPending),   OR, "Order count"],
      ["Feed kg Ordered",   fmtN(c4uS.feedKgOrdered),   AM, `Del: ${fmtN(c4uS.feedKgDelivered)} kg`],
    ].forEach(([lbl, val, col, sub], i) => {
      card(sl, ordCards[i].x, ordCards[i].y, ordCards[i].w, ordCards[i].h, lbl, val, col, sub);
    });
    const SEC2_Y = 0.90 + CH * 2 + 0.56;
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
    ], { x: MARGIN, y: SEC2_Y + 0.26, w: LEFT_W, colW: [0.94, 0.94, 0.94, 0.94, 0.94], fontSize: 7, border: { type: "solid", color: SF2 }, fill: { color: SF }, rowH: 0.26 });

    /* topMuos already capped at 10 by loadAllData — show all, no extra .slice(0,5) */
    sectionLabel(sl, `TOP MUOs (BY DELIVERED) — ${(c4uS.topMuos || []).length}`, RIGHT_X, SEC2_Y, CY);
    const topMuos = (c4uS.topMuos || []);
    if (topMuos.length) {
      sl.addTable([
        tblHdr(["#", "MUO Name", "Delivered", "Ordered"], CY),
        ...topMuos.map((m, idx) => tblRow([idx+1, m.name, fmtN(m.value), fmtN(m.ordered)], idx, [TF, TX, CY, SO])),
      ], { x: RIGHT_X, y: SEC2_Y + 0.26, w: RIGHT_W, colW: [0.38, 2.20, 1.12, 1.10], fontSize: 7, border: { type: "solid", color: SF2 }, fill: { color: SF }, rowH: 0.26, autoPage: true, autoPageRepeatHeader: true });
    }
    sl.addText(
      `Pending this week: ${c4uS.pendingWeek?.orders || 0} orders / ${fmtN(c4uS.pendingWeek?.qty)} qty  ·  Month pending: ${c4uS.pendingMonth?.orders || 0} orders / ${fmtN(c4uS.pendingMonth?.qty)} qty`,
      { x: MARGIN, y: 5.10, w: CONTENT_W, h: 0.16, fontSize: 7.5, color: SO, fontFace: "Calibri" }
    );
    footer(sl);
  }

  /* ════════════════════════════════════════════════════════════════════════
     SLIDE 11 — CHICKEN4U PENDING ORDERS LIST
     Restructured: full list with autoPage instead of position-math based on count
  ════════════════════════════════════════════════════════════════════════ */
  {
    const sl = p.addSlide(); bg(sl); hdr(sl, "Chicken4U — Pending Deliveries Detail (This Week)", OR);
    const ordColW = [1.10, 2.40, 2.40, 1.60, 2.10];
    const ROW_H   = 0.24;

    /* Full week-pending list (already capped at 20 in loadAllData) — autoPage handles overflow */
    const wkList = (c4uS.pendingWeek?.list || []);
    sectionLabel(sl, `PENDING THIS WEEK — ${c4uS.pendingWeek?.orders || 0} ORDERS (${wkList.length} shown)`, MARGIN, 0.64, OR);
    if (wkList.length) {
      sl.addTable([
        tblHdr(["Order ID", "MUO", "SATO", "Expected Date", "Status"], OR),
        ...wkList.map((o, idx) => tblRow([o.orderId?.slice(-8) || "—", o.muoName || "—", o.satoName || "—", o.expectedDate, o.status], idx, [BL, TX, SO, OR, AM])),
      ], { x: MARGIN, y: 0.90, w: CONTENT_W, colW: ordColW, fontSize: 7, border: { type: "solid", color: SF2 }, fill: { color: SF }, rowH: ROW_H, autoPage: true, autoPageRepeatHeader: true });
    } else {
      sl.addText("No pending deliveries this week.", { x: MARGIN, y: 0.92, w: 9, h: 0.26, fontSize: 10, color: GR, fontFace: "Calibri" });
    }
    footer(sl);
  }

  /* ── SLIDE 11b — Pending This Month (separate slide, full list) ── */
  {
    const sl = p.addSlide(); bg(sl); hdr(sl, "Chicken4U — Pending Deliveries Detail (This Month)", BL);
    const ordColW = [1.10, 2.40, 2.40, 1.60, 2.10];
    const ROW_H   = 0.24;

    const moList = (c4uS.pendingMonth?.list || []);
    sectionLabel(sl, `PENDING THIS MONTH — ${c4uS.pendingMonth?.orders || 0} ORDERS (${moList.length} shown)`, MARGIN, 0.64, BL);
    if (moList.length) {
      sl.addTable([
        tblHdr(["Order ID", "MUO", "SATO", "Expected Date", "Status"], BL),
        ...moList.map((o, idx) => tblRow([o.orderId?.slice(-8) || "—", o.muoName || "—", o.satoName || "—", o.expectedDate, o.status], idx, [BL, TX, SO, BL, AM])),
      ], { x: MARGIN, y: 0.90, w: CONTENT_W, colW: ordColW, fontSize: 7, border: { type: "solid", color: SF2 }, fill: { color: SF }, rowH: ROW_H, autoPage: true, autoPageRepeatHeader: true });
    } else {
      sl.addText("No additional pending deliveries this month.", { x: MARGIN, y: 0.92, w: 9, h: 0.26, fontSize: 10, color: GR, fontFace: "Calibri" });
    }

    /* C4U regional demand — fixed position, independent of table length above (own slide now) */
    const c4uReg = (s.c4uRegionalDemand || []);
    if (c4uReg.length) {
      const REG_Y = 4.30;
      sectionLabel(sl, `C4U REGIONAL DEMAND (${c4uReg.length})`, MARGIN, REG_Y, AM);
      const regW = CONTENT_W / Math.max(c4uReg.length, 1);
      c4uReg.forEach((r, i) => {
        const rx = MARGIN + i * regW;
        sl.addShape(p.shapes.RECTANGLE, { x: rx, y: REG_Y + 0.26, w: regW - 0.04, h: 0.36, fill: { color: SF }, line: { color: AM + "44", pt: 1 } });
        sl.addText(r.region, { x: rx + 0.06, y: REG_Y + 0.26, w: regW - 0.12, h: 0.16, fontSize: 6.5, color: SO, fontFace: "Calibri", margin: 0, valign: "middle" });
        sl.addText(fmtN(r.orders), { x: rx + 0.06, y: REG_Y + 0.43, w: regW - 0.12, h: 0.18, fontSize: 10, bold: true, color: AM, fontFace: "Trebuchet MS", margin: 0 });
      });
    }
    footer(sl);
  }

  /* ════════════════════════════════════════════════════════════════════════════
     SLIDE 11c — MONTHLY CHICKS PRODUCED (unchanged content, renumbered)
  ════════════════════════════════════════════════════════════════════════════ */
  {
    const sl = p.addSlide(); bg(sl); hdr(sl, "Monthly Chicks Produced — Year on Year", GR);

    const hatch = data?.monthlyHatchData || {};
    const MSHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const mkMonKey = (y, m) => `${y}-${String(m + 1).padStart(2, "0")}`;

    const monthRows = MSHORT.map((mon, i) => ({
      label: mon,
      cur:  ((hatch[mkMonKey(curYear,     i)] || {}).goodChicks || 0),
      prev: ((hatch[mkMonKey(curYear - 1, i)] || {}).goodChicks || 0),
    }));

    const curVals  = monthRows.map(r => r.cur);
    const prevVals = monthRows.map(r => r.prev);
    const totalYTD = curVals.reduce((s, v) => s + v, 0);
    const prevTotal= prevVals.reduce((s, v) => s + v, 0);
    const peakVal  = Math.max(...curVals, 0);
    const peakIdx  = curVals.indexOf(peakVal);
    const peakMon  = peakIdx >= 0 && peakVal > 0 ? `${MSHORT[peakIdx]} ${curYear}` : "—";
    const activeMo = curVals.filter(v => v > 0).length || 1;
    const avgPerMo = Math.round(totalYTD / activeMo);

    const topCards = cardRow(4, 0.64, 0.88);
    [
      [`${curYear} YTD Chicks`,  fmtN(totalYTD), GR, "Good chicks hatched"],
      ["Peak Month",             peakMon,        BL, peakVal > 0 ? `${fmtN(peakVal)} chicks` : "No data yet"],
      ["Avg / Active Month",     fmtN(avgPerMo), AM, `Based on ${activeMo} active months`],
      [`${curYear - 1} Full Yr`, fmtN(prevTotal),OR, "Prior year total"],
    ].forEach(([lbl, val, col, sub], i) => {
      card(sl, topCards[i].x, topCards[i].y, topCards[i].w, topCards[i].h, lbl, val, col, sub);
    });

    const BAR_TOP = 0.64 + 0.88 + 0.18;
    sectionLabel(sl, `MONTHLY PRODUCTION — ${curYear} vs ${curYear - 1}`, MARGIN, BAR_TOP, GR);

    const maxBar = Math.max(peakVal, ...prevVals, 1);
    const BAR_AREA_W = CONTENT_W;
    const BAR_AREA_H = 1.20;
    const BAR_Y      = BAR_TOP + 0.28;
    const colW_bar   = BAR_AREA_W / 12;

    MSHORT.forEach((mon, i) => {
      const cv = curVals[i]  || 0;
      const pv = prevVals[i] || 0;
      const x  = MARGIN + i * colW_bar;
      const bw = (colW_bar - 0.06) / 2;

      if (pv > 0) {
        const bh = (pv / maxBar) * (BAR_AREA_H - 0.20);
        sl.addShape(p.shapes.RECTANGLE, {
          x, y: BAR_Y + (BAR_AREA_H - 0.20 - bh), w: bw, h: bh,
          fill: { color: OR }, line: { color: OR }, rectRadius: 0.02,
        });
      }
      if (cv > 0) {
        const bh = (cv / maxBar) * (BAR_AREA_H - 0.20);
        const barColor = i === peakIdx ? AM : GR;
        sl.addShape(p.shapes.RECTANGLE, {
          x: x + bw + 0.03, y: BAR_Y + (BAR_AREA_H - 0.20 - bh), w: bw, h: bh,
          fill: { color: barColor }, line: { color: barColor }, rectRadius: 0.02,
        });
      }
      sl.addText(mon, {
        x, y: BAR_Y + BAR_AREA_H - 0.18, w: colW_bar, h: 0.16,
        fontSize: 6.5, color: SO, fontFace: "Calibri", align: "center", margin: 0,
      });
    });

    sl.addShape(p.shapes.RECTANGLE, { x: MARGIN, y: BAR_Y + BAR_AREA_H + 0.02, w: 0.10, h: 0.10, fill: { color: GR }, line: { color: GR } });
    sl.addText(`${curYear}`, { x: MARGIN + 0.14, y: BAR_Y + BAR_AREA_H + 0.02, w: 0.60, h: 0.12, fontSize: 7, color: GR, fontFace: "Calibri", margin: 0 });
    sl.addShape(p.shapes.RECTANGLE, { x: MARGIN + 0.80, y: BAR_Y + BAR_AREA_H + 0.02, w: 0.10, h: 0.10, fill: { color: OR }, line: { color: OR } });
    sl.addText(`${curYear - 1}`, { x: MARGIN + 0.94, y: BAR_Y + BAR_AREA_H + 0.02, w: 0.60, h: 0.12, fontSize: 7, color: OR, fontFace: "Calibri", margin: 0 });
    if (peakVal > 0) {
      sl.addShape(p.shapes.RECTANGLE, { x: MARGIN + 1.60, y: BAR_Y + BAR_AREA_H + 0.02, w: 0.10, h: 0.10, fill: { color: AM }, line: { color: AM } });
      sl.addText("Peak Month", { x: MARGIN + 1.74, y: BAR_Y + BAR_AREA_H + 0.02, w: 1.00, h: 0.12, fontSize: 7, color: AM, fontFace: "Calibri", margin: 0 });
    }

    const DIST_Y = BAR_Y + BAR_AREA_H + 0.14;
    sectionLabel(sl, "CHICK TYPE DISTRIBUTION — GRANGERS vs LAYERS vs BROILERS", MARGIN, DIST_Y, AM);

    const distCards = cardRow(3, DIST_Y + 0.26, 0.72);
    const totalGrangers = monthRows.reduce((s, r, i) => s + ((hatch[mkMonKey(curYear, i)]||{}).grangers||0), 0);
    const totalLayers   = monthRows.reduce((s, r, i) => s + ((hatch[mkMonKey(curYear, i)]||{}).layers  ||0), 0);
    const totalBroilers = monthRows.reduce((s, r, i) => s + ((hatch[mkMonKey(curYear, i)]||{}).broilers||0), 0);

    [
      ["Grangers / Cocks", fmtN(totalGrangers), AM,
        totalYTD > 0 ? `${((totalGrangers/totalYTD)*100).toFixed(1)}% of total` : ""],
      ["Layers / Novos",   fmtN(totalLayers),   GR,
        totalYTD > 0 ? `${((totalLayers/totalYTD)*100).toFixed(1)}% of total` : ""],
      ["Broilers",         fmtN(totalBroilers), BL,
        totalYTD > 0 ? `${((totalBroilers/totalYTD)*100).toFixed(1)}% of total` : ""],
    ].forEach(([lbl, val, col, sub], i) => {
      card(sl, distCards[i].x, distCards[i].y, distCards[i].w, distCards[i].h, lbl, val, col, sub);
    });

    const TBL_Y = DIST_Y + 0.26 + 0.72 + 0.14;
    sl.addTable([
      tblHdr(["Month", `${curYear} Chicks`, `${curYear - 1} Chicks`, "Change", "% Change", "Status"], GR),
      ...monthRows.map(({ label, cur, prev }, idx) => {
        const diff    = cur - prev;
        const pctStr  = prev > 0 ? `${diff >= 0 ? "+" : ""}${((diff / prev) * 100).toFixed(1)}%` : (cur > 0 ? "New" : "—");
        const isPeak  = idx === peakIdx && cur > 0;
        const dCol    = diff > 0 ? GR : diff < 0 ? RD : SO;
        const status  = isPeak ? "★ Peak" : cur > avgPerMo ? "Above Avg" : cur > 0 ? "Below Avg" : "No Data";
        return tblRow(
          [label, cur > 0 ? fmtN(cur) : "—", prev > 0 ? fmtN(prev) : "—",
           diff !== 0 ? `${diff >= 0 ? "+" : ""}${fmtN(diff)}` : "—", pctStr, status],
          idx,
          [isPeak ? AM : TX, cur > 0 ? GR : TF, prev > 0 ? OR : TF, dCol, dCol, isPeak ? AM : SO],
        );
      }),
      [
        { text: "TOTAL / AVG", options: { bold: true, color: TX, fill: { color: SF2 }, fontSize: 7, fontFace: "Calibri", align: "left" } },
        { text: fmtN(totalYTD), options: { bold: true, color: GR,  fill: { color: SF2 }, fontSize: 7, fontFace: "Calibri", align: "left" } },
        { text: fmtN(prevTotal), options: { bold: true, color: OR,  fill: { color: SF2 }, fontSize: 7, fontFace: "Calibri", align: "left" } },
        { text: `${totalYTD - prevTotal >= 0 ? "+" : ""}${fmtN(totalYTD - prevTotal)}`,
          options: { bold: true, color: totalYTD >= prevTotal ? GR : RD, fill: { color: SF2 }, fontSize: 7, fontFace: "Calibri", align: "left" } },
        { text: prevTotal > 0 ? `${(((totalYTD - prevTotal) / prevTotal) * 100).toFixed(1)}%` : "—",
          options: { bold: true, color: totalYTD >= prevTotal ? GR : RD, fill: { color: SF2 }, fontSize: 7, fontFace: "Calibri", align: "left" } },
        { text: `Avg/mo: ${fmtN(avgPerMo)}`,
          options: { bold: false, color: AM, fill: { color: SF2 }, fontSize: 7, fontFace: "Calibri", align: "left" } },
      ],
    ], {
      x: MARGIN, y: TBL_Y, w: CONTENT_W,
      colW: [0.64, 1.52, 1.52, 1.52, 1.52, 2.88],
      fontSize: 7, border: { type: "solid", color: SF2 }, fill: { color: SF }, rowH: 0.22,
      autoPage: true, autoPageRepeatHeader: true,
    });

    footer(sl);
  }

  /* ════════════════════════════════════════════════════════════════════════
     SLIDE 12 — FINANCIAL SNAPSHOT
  ════════════════════════════════════════════════════════════════════════ */
  {
    const sl = p.addSlide(); bg(sl); hdr(sl, "Financial Snapshot", GR);
    const CH = 0.80;
    sectionLabel(sl, "REVENUE", MARGIN, 0.64, GR);
    const revCards = cardRow(6, 0.90, CH);
    [
      ["Sales Order Revenue (Wk)",    fmtCur(f.revenueWeek),              GR,  "Confirmed Sales Orders"],
      ["Sales Order Revenue (Mo)",    fmtCur(f.revenueMonth),             GR,  "Confirmed Sales Orders"],
      ["Sales Order Revenue (Yr)",    fmtCur(f.revenueYear),              GR,  "Year to date"],
      ["C4U Paid Chick Rev (Wk)",     fmtCur(f.c4uRevenueWeek),          AM,  "Field visit — paid orders only"],
      ["C4U Paid Chick Rev (Mo)",     fmtCur(f.c4uRevenueMonth),         AM,  `Yr: ${fmtCur(f.c4uRevenueYear)}`],
      ["Combined Revenue (Mo)",       fmtCur(f.combinedRevenueMonth),    BL,  `Yr: ${fmtCur(f.combinedRevenueYear)}`],
    ].forEach(([lbl, val, col, sub], i) => {
      card(sl, revCards[i].x, revCards[i].y, revCards[i].w, revCards[i].h, lbl, val, col, sub);
    });
    sectionLabel(sl, "CASH, RECEIVABLES & PAYABLES", MARGIN, 0.90 + CH + 0.10, CY);
    const cashCards = cardRow(6, 0.90 + CH + 0.36, CH);
    [
      ["Cash Received (Wk)",     fmtCur(f.cashReceivedWeek),  CY, ""],
      ["Cash Received (Mo)",     fmtCur(f.cashReceivedMonth), CY, `Year: ${fmtCur(f.cashReceivedYear)}`],
      ["Receivables (Mo)",       fmtCur(f.receivablesMonth),  AM, `Total: ${fmtCur(f.receivablesTotal)}`],
      ["Receivables (Total)",    fmtCur(f.receivablesTotal),  AM, "All open invoices"],
      ["Payables Due (Wk)",      fmtCur(f.payablesWeek),      RD, ""],
      ["Payables Due (Mo)",      fmtCur(f.payablesMonth),     RD, ""],
    ].forEach(([lbl, val, col, sub], i) => {
      card(sl, cashCards[i].x, cashCards[i].y, cashCards[i].w, cashCards[i].h, lbl, val, col, sub);
    });
    sectionLabel(sl, "MARGINS & APPROVAL STATUS", MARGIN, 0.90 + CH * 2 + 0.50, GR);
    const margCards = cardRow(6, 0.90 + CH * 2 + 0.76, CH);
    [
      ["Gross Margin %",        `${f.grossMargin < 0 ? 0 : f.grossMargin || 0}%`,    f.grossMargin > 20 ? GR : AM, "Revenue vs expense"],
      ["Pending Payments",      fmtN(f.pendingPayments),     AM, "Awaiting approval"],
      ["Approved Not Paid",     fmtN(f.approvedNotPaid),     RD, "Requires payment"],
      ["Total Expense (Wk)",    fmtCur(f.totalExpenseWeek),  RD, ""],
      ["Total Expense (Mo)",    fmtCur(f.totalExpenseMonth), RD, `Year: ${fmtCur(f.totalExpenseYear)}`],
      ["Combined Revenue (Yr)", fmtCur(f.combinedRevenueYear), GR, ""],
    ].forEach(([lbl, val, col, sub], i) => {
      card(sl, margCards[i].x, margCards[i].y, margCards[i].w, margCards[i].h, lbl, val, col, sub);
    });
    footer(sl);
  }

  /* ════════════════════════════════════════════════════════════════════════
     SLIDE 13 — EXPENDITURE BREAKDOWN
  ════════════════════════════════════════════════════════════════════════ */
  {
    const sl = p.addSlide(); bg(sl); hdr(sl, "Expenditure Breakdown — Full Detail", RD);
    const CH = 0.72;

    sectionLabel(sl, "TOTAL EXPENDITURE BY PERIOD", MARGIN, 0.64, RD);
    const expCards = cardRow(6, 0.90, CH);
    [
      ["Total Expense (Wk)",  fmtCur(f.totalExpenseWeek),  RD, "Feed + OpReq + Dept"],
      ["Total Expense (Mo)",  fmtCur(f.totalExpenseMonth), RD, ""],
      ["Total Expense (Yr)",  fmtCur(f.totalExpenseYear),  RD, "Year to date"],
      ["Feed Del. Cost (Wk)", fmtCur(fd.costWeek),         AM, "Actual invoiced"],
      ["Feed Del. Cost (Mo)", fmtCur(fd.costMonth),        AM, ""],
      ["Feed Del. Cost (Yr)", fmtCur(fd.costYear),         AM, "Year to date"],
    ].forEach(([lbl, val, col, sub], i) => {
      card(sl, expCards[i].x, expCards[i].y, expCards[i].w, expCards[i].h, lbl, val, col, sub);
    });

    const OP_SEC_Y = 0.90 + CH + 0.12;
    sectionLabel(sl, "OPERATIONAL REQUESTS", MARGIN, OP_SEC_Y, OR);
    const opCards = cardRow(6, OP_SEC_Y + 0.26, CH);
    [
      ["OpEx (Week)",      fmtCur(or.expenseWeek),   OR, "Finance-approved"],
      ["OpEx (Month)",     fmtCur(or.expenseMonth),  OR, ""],
      ["OpEx (Year)",      fmtCur(or.expenseYear),   OR, "Year to date"],
      ["Paid (Month)",     fmtCur(or.paidMonth),     GR, ""],
      ["Approved Unpaid",  fmtN(or.approvedNotPaid), RD, "Requires payment"],
      ["Pending Count",    fmtN(or.pendingCount),    AM, "Awaiting approval"],
    ].forEach(([lbl, val, col, sub], i) => {
      card(sl, opCards[i].x, opCards[i].y, opCards[i].w, opCards[i].h, lbl, val, col, sub);
    });

    const DEPT_SEC_Y = OP_SEC_Y + 0.26 + CH + 0.12;
    sectionLabel(sl, "DEPARTMENT WORKER EXPENSES", MARGIN, DEPT_SEC_Y, PU);
    const deptCards = cardRow(6, DEPT_SEC_Y + 0.26, CH);
    [
      ["C4U Dept (Target/Wk)",      fmtCur(de.chicken4u?.week),    AM, `Mo: ${fmtCur(de.chicken4u?.month)} | Yr: ${fmtCur(de.chicken4u?.year)}`],
      ["Hatchery Dept (Target/Wk)", fmtCur(de.hatchery?.week),     CY, `Mo: ${fmtCur(de.hatchery?.month)} | Yr: ${fmtCur(de.hatchery?.year)}`],
      ["Breeder Dept (Target/Wk)",  fmtCur(de.breederFarm?.week),  GR, `Mo: ${fmtCur(de.breederFarm?.month)} | Yr: ${fmtCur(de.breederFarm?.year)}`],
      ["Total Dept Expense (Wk)",   fmtCur(de.total?.week),        PU, "All 3 departments"],
      ["Total Dept Expense (Mo)",   fmtCur(de.total?.month),       PU, "Auto × 4.33 from weekly target"],
      ["Total Dept Expense (Yr)",   fmtCur(de.total?.year),        PU, "Auto × 52 from weekly target"],
    ].forEach(([lbl, val, col, sub], i) => {
      card(sl, deptCards[i].x, deptCards[i].y, deptCards[i].w, deptCards[i].h, lbl, val, col, sub);
    });

    const BOT_Y    = DEPT_SEC_Y + 0.26 + CH + 0.14;
    const safeBot  = Math.min(BOT_Y, 4.08);
    const LEFT_W   = 4.70;
    const RIGHT_X  = MARGIN + LEFT_W + 0.10;
    const RIGHT_W  = CONTENT_W - LEFT_W - 0.10;

    /* FULL LIST — no slice(0, 5) */
    const cats = Object.entries(or.byCategory || {}).sort((a, b) => b[1] - a[1]);
    sectionLabel(sl, `OP REQUESTS BY CATEGORY — THIS MONTH (${cats.length})`, MARGIN, safeBot, OR);
    if (cats.length) {
      sl.addTable([
        tblHdr(["Category", "Cost (GHC)"], OR),
        ...cats.map(([cat, cost], idx) => tblRow([cat, fmtCur(cost)], idx, [TX, OR])),
      ], {
        x: MARGIN, y: safeBot + 0.26, w: LEFT_W,
        colW: [3.20, 1.50],
        fontSize: 7, border: { type: "solid", color: SF2 }, fill: { color: SF }, rowH: 0.22,
        autoPage: true, autoPageRepeatHeader: true,
      });
    } else {
      sl.addText("No category data available.", { x: MARGIN, y: safeBot + 0.28, w: LEFT_W, h: 0.22, fontSize: 8, color: TF, fontFace: "Calibri" });
    }

    /* FULL recent op-request list (already capped at 15 in loadAllData) */
    const recentOp = (or.recent || []);
    sectionLabel(sl, `RECENT OP REQUESTS (${recentOp.length})`, RIGHT_X, safeBot, PU);
    if (recentOp.length) {
      sl.addTable([
        tblHdr(["ID", "Category", "Cost (GHC)", "Payment"], PU),
        ...recentOp.map((r, idx) =>
          tblRow([r.requestId?.slice(-6) || "—", (r.mainCategory || "").slice(0, 18), fmtCur(r.actualCost), r.paymentStatus || "—"],
            idx, [BL, TX, GR, r.paymentStatus === "paid" ? GR : RD])),
      ], {
        x: RIGHT_X, y: safeBot + 0.26, w: RIGHT_W,
        colW: [0.72, 2.02, 1.18, 0.88],
        fontSize: 7, border: { type: "solid", color: SF2 }, fill: { color: SF }, rowH: 0.22,
        autoPage: true, autoPageRepeatHeader: true,
      });
    }
    footer(sl);
  }

  /* ════════════════════════════════════════════════════════════════════════
     SLIDE 14 — BREED PERFORMANCE DETAIL
  ════════════════════════════════════════════════════════════════════════ */
  {
    const sl = p.addSlide(); bg(sl); hdr(sl, "Breed Performance — Eggs, Mortality & Feed", BL);

    const breedRows = Object.entries(data?.breedEggData || {})
      .sort((a, b) => (b[1].eggsMonth || 0) - (a[1].eggsMonth || 0)); // was .slice(0, 8)

    sectionLabel(sl, `EGGS · HATCHING EGGS · FARM REJECTED · MORTALITY · FEED kg — BY BREED (${breedRows.length})`, MARGIN, 0.64, BL);

    if (breedRows.length) {
      sl.addTable([
        tblHdr(["Breed", "Birds Placed", "Eggs (Wk)", "Eggs (Mo)", "Hatch Eggs (Mo)", "Rej (Mo)", "Mort (Wk)", "Mort (Mo)", "Feed kg (Mo)"], BL),
        ...breedRows.map(([breed, e], idx) => tblRow([
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

    /* Hatchery detail by breed — full list, continuation slide */
    const breedHatchRows = Object.entries(data?.breedHatchData || {})
      .sort((a, b) => (b[1].goodChicksMonth || 0) - (a[1].goodChicksMonth || 0)); // was .slice(0, 6)

    const sl14b = p.addSlide(); bg(sl14b); hdr(sl14b, "Hatchery Detail by Breed", AM);
    sectionLabel(sl14b, `HATCHERY DETAIL BY BREED (${breedHatchRows.length})`, MARGIN, 0.64, AM);

    if (breedHatchRows.length) {
      sl14b.addTable([
        tblHdr(["Breed", "Eggs Set (Wk)", "Eggs Set (Mo)", "Good Chicks (Wk)", "Good Chicks (Mo)", "Fertile Eggs", "Poor Chicks", "Storage Eggs", "DOC"], AM),
        ...breedHatchRows.map(([breed, hd], idx) => tblRow([
          breed, fmtN(hd.eggsSetWeek), fmtN(hd.eggsSetMonth),
          fmtN(hd.goodChicksWeek), fmtN(hd.goodChicksMonth),
          fmtN(hd.fertileEggs), fmtN(hd.poorChicks),
          fmtN(data?.breedStorageEggs?.[breed] || 0), fmtN(data?.breedDOC?.[breed] || 0),
        ], idx, [AM, TX, AM, TX, GR, CY, RD, PU, GR])),
      ], {
        x: MARGIN, y: 0.90, w: CONTENT_W,
        colW: [1.36, 0.90, 0.90, 1.08, 1.08, 0.90, 0.90, 0.90, 0.58],
        fontSize: 6.5, border: { type: "solid", color: SF2 }, fill: { color: SF }, rowH: 0.23,
        autoPage: true, autoPageRepeatHeader: true,
      });
    }

    /* Breed profit margins — converted from fixed inline cards to a full table (was .slice(0, 6)) */
    const bpmData = (data?.breedProfitMargins || []);
    sectionLabel(sl14b, `BREED PROFIT MARGINS — THIS MONTH (${bpmData.length})`, MARGIN, 3.40, GR);
    if (bpmData.length > 0) {
      sl14b.addTable([
        tblHdr(["Breed", "Revenue (GHC)", "Feed Cost (GHC)", "Gross Profit (GHC)", "Margin %"], GR),
        ...bpmData.map((b, idx) => tblRow(
          [b.breed, fmtCur(b.revenue), fmtCur(b.feedCost), fmtCur(b.grossProfit), `${b.marginPct ?? "—"}%`],
          idx,
          [AM, TX, OR, b.grossProfit >= 0 ? GR : RD, b.marginPct >= 0 ? GR : RD]
        )),
      ], {
        x: MARGIN, y: 3.66, w: CONTENT_W,
        colW: [2.20, 1.85, 1.85, 1.85, 1.85],
        fontSize: 7, border: { type: "solid", color: SF2 }, fill: { color: SF }, rowH: 0.24,
        autoPage: true, autoPageRepeatHeader: true,
      });
    } else {
      sl14b.addText("No breed profit margin data available.", {
        x: MARGIN, y: 3.66, w: CONTENT_W, h: 0.30,
        fontSize: 9, color: TF, fontFace: "Calibri",
      });
    }

    footer(sl);
    footer(sl14b);
  }

  /* ════════════════════════════════════════════════════════════════════════
     SLIDE 15 — FARM PERFORMANCE DETAIL
  ════════════════════════════════════════════════════════════════════════ */
  {
    const sl = p.addSlide(); bg(sl); hdr(sl, "Farm Performance — Eggs, Mortality & Feed", CY);
    const farmRows = Object.entries(data?.farmEggData || {})
      .sort((a, b) => (b[1].eggsMonth || 0) - (a[1].eggsMonth || 0)); // was .slice(0, 12)

    sectionLabel(sl, `PRODUCTION & MORTALITY BY FARM (${farmRows.length})`, MARGIN, 0.64, CY);
    if (farmRows.length) {
      sl.addTable([
        tblHdr(["Farm", "Birds", "Eggs (Wk)", "Eggs (Mo)", "Eggs (Yr)", "Hatch (Wk)", "Rej (Mo)", "Mort (Wk)", "Mort (Mo)", "Feed kg (Mo)", "Feed Cost"], CY),
        ...farmRows.map(([farm, e], idx) => tblRow([
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
     SLIDE 16 — INVENTORY & SUPPLY CHAIN
  ════════════════════════════════════════════════════════════════════════ */
  {
    const sl = p.addSlide(); bg(sl); hdr(sl, "Inventory & Supply Chain", PU);
    const CH = 0.80;

    sectionLabel(sl, "STOCK OVERVIEW", MARGIN, 0.64, PU);
    const stockCards = cardRow(6, 0.90, CH);
    [
      ["Feed Stock (MT)",   `${fmtN(inv.finishedFeedTons, 1)} MT`, inv.finishedFeedTons > 50 ? GR : AM, "Finished feed"],
      ["Raw Material Days", fmtN(inv.rawMaterialDays),             AM, "Days coverage"],
      ["Vaccine Status",    inv.vaccineStatus || "—",              inv.vaccineStatus === "Critical" ? RD : inv.vaccineStatus === "Low" ? AM : GR, ""],
      ["Storage Eggs",      fmtN(k.storageEggsAvailable),          PU, "All breeds"],
      ["DOC Available", fmtN(k.totalDOC), BL, "Physical stock (Day_Old_Chicks_Report)"],
      ["Pending POs",       fmtN(inv.pendingPOs),                  BL, ""],
    ].forEach(([lbl, val, col, sub], i) => {
      card(sl, stockCards[i].x, stockCards[i].y, stockCards[i].w, stockCards[i].h, lbl, val, col, sub);
    });

    const SEC2_Y  = 0.90 + CH + 0.14;
    const LEFT_W  = 4.70;
    const RIGHT_X = MARGIN + LEFT_W + 0.10;
    const RIGHT_W = CONTENT_W - LEFT_W - 0.10;

    /* FULL LIST — no slice(0,6) */
    const storBreeds = Object.entries(data?.breedStorageEggs || {}).sort((a, b) => b[1] - a[1]);
    sectionLabel(sl, `STORAGE EGGS BY BREED (${storBreeds.length})`, MARGIN, SEC2_Y, PU);
    if (storBreeds.length) {
      sl.addTable([
        tblHdr(["Breed", "Available Eggs"], PU),
        ...storBreeds.map(([b, q], idx) => tblRow([b, fmtN(q)], idx, [TX, PU])),
      ], {
        x: MARGIN, y: SEC2_Y + 0.26, w: LEFT_W,
        colW: [3.20, 1.50],
        fontSize: 7, border: { type: "solid", color: SF2 }, fill: { color: SF }, rowH: 0.24,
        autoPage: true, autoPageRepeatHeader: true,
      });
    }

    /* FULL LIST — no slice(0,6) */
    const docBreeds = Object.entries(data?.breedDOC || {}).sort((a, b) => b[1] - a[1]);
    sectionLabel(sl, `DAY OLD CHICKS BY BREED (${docBreeds.length})`, RIGHT_X, SEC2_Y, GR);
    if (docBreeds.length) {
      sl.addTable([
        tblHdr(["Breed", "Available Chicks"], GR),
        ...docBreeds.map(([b, q], idx) => tblRow([b, fmtN(q)], idx, [TX, GR])),
      ], {
        x: RIGHT_X, y: SEC2_Y + 0.26, w: RIGHT_W,
        colW: [3.36, 1.44],
        fontSize: 7, border: { type: "solid", color: SF2 }, fill: { color: SF }, rowH: 0.24,
        autoPage: true, autoPageRepeatHeader: true,
      });
    }

    /* Critical stock + product stock — moved to a continuation slide with full lists (was .slice(0,4) each) */
    const sl16b = p.addSlide(); bg(sl16b); hdr(sl16b, "Inventory — Stock Alerts & Product List", RD);
    const critAlerts = (inv.criticalAlerts || []); // data-layer cap is 5, set in loadAllData
    sectionLabel(sl16b, `CRITICAL / LOW STOCK ALERTS (${critAlerts.length})`, MARGIN, 0.64, RD);
    if (critAlerts.length) {
      sl16b.addTable([
        tblHdr(["Item", "Stock", "Status"], RD),
        ...critAlerts.map((a, idx) =>
          tblRow([a.item, fmtN(a.stock), a.status], idx,
            [TX, TX, a.status === "Critical" ? RD : AM])),
      ], {
        x: MARGIN, y: 0.90, w: 4.70,
        colW: [3.20, 0.76, 0.74],
        fontSize: 7, border: { type: "solid", color: SF2 }, fill: { color: SF }, rowH: 0.24,
        autoPage: true, autoPageRepeatHeader: true,
      });
    } else {
      sl16b.addText("No critical stock alerts.", { x: MARGIN, y: 0.92, w: 4.70, h: 0.22, fontSize: 8, color: GR, fontFace: "Calibri" });
    }

    const prodStock = (inv.productStockList || []); // data-layer cap is 10, set in loadAllData
    sectionLabel(sl16b, `PRODUCT STOCK LIST (${prodStock.length})`, MARGIN + 4.80, 0.64, BL);
    if (prodStock.length) {
      sl16b.addTable([
        tblHdr(["Product", "Stock", "Min", "Price (GHC)"], BL),
        ...prodStock.map((ps, idx) =>
          tblRow([ps.name?.slice(0, 20) || "—", fmtN(ps.stock), fmtN(ps.min), fmtN(ps.sellingPrice)], idx,
            [TX, ps.stock <= ps.min && ps.min > 0 ? RD : GR, SO, AM])),
      ], {
        x: MARGIN + 4.80, y: 0.90, w: CONTENT_W - 4.80,
        colW: [2.46, 0.72, 0.68, 0.94],
        fontSize: 7, border: { type: "solid", color: SF2 }, fill: { color: SF }, rowH: 0.24,
        autoPage: true, autoPageRepeatHeader: true,
      });
    }

    /* Breed profit margins — full table on this continuation slide too */
    const bpmData = (data?.breedProfitMargins || []);
    sectionLabel(sl16b, `BREED PROFIT MARGINS — THIS MONTH (${bpmData.length})`, MARGIN, 3.20, GR);
    if (bpmData.length > 0) {
      sl16b.addTable([
        tblHdr(["Breed", "Revenue (GHC)", "Feed Cost (GHC)", "Gross Profit (GHC)", "Margin %"], GR),
        ...bpmData.map((b, idx) => tblRow(
          [b.breed, fmtCur(b.revenue), fmtCur(b.feedCost), fmtCur(b.grossProfit), `${b.marginPct ?? "—"}%`],
          idx,
          [AM, TX, OR, b.grossProfit >= 0 ? GR : RD, b.marginPct >= 0 ? GR : RD]
        )),
      ], {
        x: MARGIN, y: 3.46, w: CONTENT_W,
        colW: [2.20, 1.85, 1.85, 1.85, 1.85],
        fontSize: 7, border: { type: "solid", color: SF2 }, fill: { color: SF }, rowH: 0.24,
        autoPage: true, autoPageRepeatHeader: true,
      });
    }

    footer(sl);
    footer(sl16b);
  }

  /* ════════════════════════════════════════════════════════════════════════
     SLIDE 17 — WORKFORCE & HR
  ════════════════════════════════════════════════════════════════════════ */
  {
    const sl = p.addSlide(); bg(sl); hdr(sl, "Workforce & HR", CY);
    const CH = 0.80;
    sectionLabel(sl, "HEADCOUNT & ATTENDANCE", MARGIN, 0.64, CY);
    const hcCards = cardRow(6, 0.90, CH);
    [
      ["Total Staff",        fmtN(wf.totalStaff),           BL, ""],
      ["Active Staff",       fmtN(wf.activeStaff),          GR, ""],
      ["On Duty Today",      fmtN(wf.staffTurnoutToday),    GR, ""],
      ["On Leave Today",     fmtN(wf.staffOnLeave),         AM, `Absenteeism: ${wf.absenteeismPct || 0}%`],
      ["Leave This Week",    fmtN(wf.leaveThisWeek),        BL, ""],
      ["Leave This Month",   fmtN(wf.leaveThisMonth),       BL, ""],
    ].forEach(([lbl, val, col, sub], i) => {
      card(sl, hcCards[i].x, hcCards[i].y, hcCards[i].w, hcCards[i].h, lbl, val, col, sub);
    });
    sectionLabel(sl, "HR STATUS", MARGIN, 0.90 + CH + 0.10, RD);
    const hrCards = cardRow(3, 0.90 + CH + 0.36, CH);
    [
      ["Open Leave Requests", fmtN(wf.openHRIssues),    wf.openHRIssues > 0 ? RD : GR, "Pending approval"],
      ["Absenteeism %",       `${wf.absenteeismPct || 0}%`, wf.absenteeismPct > 10 ? RD : AM, "Today"],
      ["Overtime",            wf.overtime ? wf.overtime + "%" : "—", AM, ""],
    ].forEach(([lbl, val, col, sub], i) => {
      card(sl, hrCards[i].x, hrCards[i].y, hrCards[i].w, hrCards[i].h, lbl, val, col, sub);
    });
    const SEC2_Y = 0.90 + CH * 2 + 0.50;
    const LEFT_W = 4.70, RIGHT_X = MARGIN + LEFT_W + 0.10, RIGHT_W = CONTENT_W - LEFT_W - 0.10;

    /* FULL LIST — was .slice(0,8) (note: data-layer cap of 6 still applies inside loadAllData's deptProductivity) */
    sectionLabel(sl, `DEPARTMENT HEADCOUNT (${(wf.deptProductivity || []).length})`, MARGIN, SEC2_Y, CY);
    const depts = (wf.deptProductivity || []);
    if (depts.length) {
      sl.addTable([
        tblHdr(["Department", "Headcount"], CY),
        ...depts.map((d, idx) => tblRow([d.dept, fmtN(d.score)], idx, [TX, CY])),
      ], { x: MARGIN, y: SEC2_Y + 0.26, w: LEFT_W, colW: [3.20, 1.50], fontSize: 7, border: { type: "solid", color: SF2 }, fill: { color: SF }, rowH: 0.24, autoPage: true, autoPageRepeatHeader: true });
    }

    /* FULL LIST — was .slice(0,8) */
    sectionLabel(sl, `LEAVE BY DEPARTMENT (${(wf.leaveByDept || []).length})`, RIGHT_X, SEC2_Y, AM);
    const leaveByDept = (wf.leaveByDept || []);
    if (leaveByDept.length) {
      sl.addTable([
        tblHdr(["Department", "Staff on Leave"], AM),
        ...leaveByDept.map((d, idx) => tblRow([d.dept, fmtN(d.count)], idx, [TX, AM])),
      ], { x: RIGHT_X, y: SEC2_Y + 0.26, w: RIGHT_W, colW: [3.36, 1.44], fontSize: 7, border: { type: "solid", color: SF2 }, fill: { color: SF }, rowH: 0.24, autoPage: true, autoPageRepeatHeader: true });
    }

    /* Pie chart now at a FIXED position, independent of table row counts above
       (tables may now autopage to new slides — pie stays on this main slide) */
   /* Pie chart — guard against all-zero values which crash PptxGenJS embed */
    const activeCount  = Number(wf.activeStaff  || 0);
    const onLeaveCount = Number(wf.staffOnLeave || 0);
    const onDutyCount  = Math.max(activeCount - onLeaveCount, 0);
    const pieTotal     = onDutyCount + onLeaveCount;
    if (pieTotal > 0 && onDutyCount >= 0 && onLeaveCount >= 0) {
      sl.addChart(p.charts.PIE, [
        { name: "Status", labels: ["On Duty", "On Leave"], values: [onDutyCount, onLeaveCount] },
      ], {     
    x: RIGHT_X, y: 4.30,
        w: RIGHT_W, h: 0.90,
        chartColors: [GR, AM],
        chartArea: { fill: { color: SF } }, plotArea: { fill: { color: SF } },
        showPercent: true, dataLabelColor: TX, dataLabelFontSize: 8,
        legendPos: "r", showLegend: true, legendFontSize: 8, legendColor: SO,
      });
    }
    footer(sl);
  }

  /* ════════════════════════════════════════════════════════════════════════
     SLIDE 18 — MONTHLY YEAR-ON-YEAR TREND
  ════════════════════════════════════════════════════════════════════════ */
  {
    const sl = p.addSlide(); bg(sl);
    hdr(sl, `Monthly Year-on-Year Trend — ${curYear - 1} vs ${curYear}`, BL);
    const MNAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const mkKey  = (y, m) => `${y}-${String(m + 1).padStart(2, "0")}`;
    const ops    = data?.monthlyOpsData   || {};
    const htch   = data?.monthlyHatchData || {};
    const fin    = data?.monthlyFinData   || {};
    const costPerKg = k.costPerFeedKg || 0;
    const tColWFinal = [0.50, 0.64, 0.64, 0.64, 0.64, 0.58, 0.58, 0.58, 0.66, 0.66, 0.72, 0.70, 0.70, 0.68, 0.68];

    const tblData = [
      [
        ...[
          `Month`,
          `${curYear} Eggs`,   `${curYear-1} Eggs`,
          `${curYear} Chicks`, `${curYear-1} Chicks`,
          `${curYear} Mort`,   `${curYear-1} Mort`,
          `${curYear} Hatch%`,
          `${curYear} Feed MT`, `${curYear-1} Feed MT`,
          `${curYear} Feed Cost`, `${curYear-1} Feed Cost`,
          `${curYear} Revenue`, `${curYear-1} Rev`,
          `${curYear} Cash In`,
        ].map(text => ({
          text,
          options: { bold: true, color: "FFFFFF", fontFace: "Calibri", fontSize: 7, fill: { color: BL }, align: "left" },
        })),
      ],
      ...MNAMES.map((mon, i) => {
        const ck = mkKey(curYear, i), pk = mkKey(curYear - 1, i);
        const co = ops[ck] || {}, po = ops[pk] || {};
        const ch = htch[ck] || {}, ph = htch[pk] || {};
        const cf = fin[ck] || {}, pf = fin[pk] || {};
        const cHatch = ch.eggsSet > 0 ? ((ch.goodChicks / ch.eggsSet) * 100).toFixed(1) + "%" : "—";
        const fill = i % 2 === 0 ? { color: SF } : { color: SF3 };
        const r = (txt, col) => ({ text: txt, options: { color: col, fontFace: "Calibri", fontSize: 7, fill, align: "left" } });
        const curFeedCost  = (co.feedKg || 0) * costPerKg;
        const prevFeedCost = (po.feedKg || 0) * costPerKg;
        return [
          r(mon, TX),
          r(fmtK(co.eggs || 0), CY),
          r(fmtK(po.eggs || 0), OR),
          r(fmtK(ch.goodChicks || 0), GR),
          r(fmtK(ph.goodChicks || 0), OR),
          r(fmtK(co.mort || 0), RD),
          r(fmtK(po.mort || 0), OR),
          r(cHatch, GR),
          r(co.feedKg > 0 ? ((co.feedKg) / 1000).toFixed(1) + " MT" : "—", AM),
          r(po.feedKg > 0 ? ((po.feedKg) / 1000).toFixed(1) + " MT" : "—", OR),
          r(curFeedCost  > 0 ? fmtCur(curFeedCost)  : "—", AM),
          r(prevFeedCost > 0 ? fmtCur(prevFeedCost) : "—", OR),
          r(cf.revenue > 0 ? fmtCur(cf.revenue) : "—", GR),
          r(pf.revenue > 0 ? fmtCur(pf.revenue) : "—", OR),
          r(cf.cashIn  > 0 ? fmtCur(cf.cashIn)  : "—", CY),
        ];
      }),
    ];

    sl.addTable(tblData, {
      x: MARGIN, y: 0.66, w: CONTENT_W, colW: tColWFinal,
      fontSize: 7, border: { type: "solid", color: SF2 },
      fill: { color: SF }, rowH: 0.25, autoPage: true, autoPageRepeatHeader: true,
    });
    footer(sl);
  }

  /* ════════════════════════════════════════════════════════════════════════
     SLIDE 19 — RISK & ALERTS
  ════════════════════════════════════════════════════════════════════════ */
  {
    const sl = p.addSlide(); bg(sl); hdr(sl, "Risk & Alerts — Operations Status", RD);
    const alerts = data?.alerts || [];

    /* FULL LIST — alerts are computed per-period from loadAllData; no extra MAX_ALERTS cap.
       If the list is longer than one slide can fit, spill to continuation slides. */
    const ROW_H = 0.52;
    const ROWS_PER_SLIDE = Math.floor((FOOT_Y - 0.66) / ROW_H);
    const pages = [];
    for (let i = 0; i < alerts.length; i += ROWS_PER_SLIDE) {
      pages.push(alerts.slice(i, i + ROWS_PER_SLIDE));
    }
    if (pages.length === 0) pages.push([]);

    pages.forEach((pageAlerts, pageIdx) => {
      const pageSlide = pageIdx === 0 ? sl : p.addSlide();
      if (pageIdx > 0) { bg(pageSlide); hdr(pageSlide, `Risk & Alerts — Operations Status (cont. ${pageIdx + 1})`, RD); }

      pageAlerts.forEach((a, i) => {
        const col    = a.type === "critical" ? RD : a.type === "warning" ? AM : BL;
        const bgTint = a.type === "critical" ? "FEF2F2" : a.type === "warning" ? "FFFBEB" : "EFF6FF";
        const y = 0.66 + i * ROW_H;

        pageSlide.addShape(p.shapes.RECTANGLE, {
          x: MARGIN, y, w: CONTENT_W, h: 0.44,
          fill: { color: bgTint }, line: { color: col + "77", pt: 1 },
        });
        pageSlide.addShape(p.shapes.RECTANGLE, {
          x: MARGIN, y, w: 0.06, h: 0.44,
          fill: { color: col }, line: { color: col },
        });
        pageSlide.addText(a.type.toUpperCase(), {
          x: MARGIN + 0.12, y: y + 0.04, w: 1.10, h: 0.16,
          fontSize: 6, bold: true, color: col,
          fontFace: "Calibri", charSpacing: 1, margin: 0,
        });
        pageSlide.addText(a.title || "", {
          x: MARGIN + 0.12, y: y + 0.20, w: 5.60, h: 0.20,
          fontSize: 9.5, bold: true, color: TX,
          fontFace: "Calibri", margin: 0,
        });
        pageSlide.addText(a.detail || "", {
          x: MARGIN + 5.82, y: y + 0.06, w: 3.60, h: 0.32,
          fontSize: 7.5, color: SO, fontFace: "Calibri",
          valign: "middle", align: "right", margin: 0,
        });
      });

      if (alerts.length === 0) {
        pageSlide.addText("✓  All Systems Normal — No critical issues detected", {
          x: 0.5, y: 1.8, w: 9, h: 0.6,
          fontSize: 18, bold: true, color: GR,
          fontFace: "Trebuchet MS", align: "center", valign: "middle",
        });
      }

      footer(pageSlide);
    });
  }

  /* ════════════════════════════════════════════════════════════════════════
     SLIDE 20 — CLOSING / CONTACT
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

  /* ── Save ───────────────────────────────────────────────────────────── */
  await p.writeFile({
    fileName: `WAFAD_Executive_${curYear}_${new Date().toISOString().slice(0, 10)}.pptx`,
  });
}





// /* ─── Export helpers ─────────────────────────────── */


/* ══════════════════════════════════════════════════
   UI PRIMITIVES
══════════════════════════════════════════════════ */
const Sk = ({ w = "100%", h = 20 }) => (
  <div className="skeleton" style={{ width: w, height: h }} />
);

function Delta({ value, prev }) {
  if (!value || !prev) return null;
  const d = (((value - prev) / prev) * 100).toFixed(1),
    up = d > 0;
  const Ic = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 600,
        padding: "2px 7px",
        borderRadius: 20,
        background: up ? C.greenLt : C.redLt,
        color: up ? C.green : C.red,
        display: "inline-flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Ic size={10} />
      {Math.abs(d)}%
    </span>
  );
}
function VsBadge({ current, target, invertColor = false }) {
  if (!target) return null;
  const p = parseFloat(((current / target) * 100).toFixed(1));
  // For mortality: below target is GOOD (green), above is BAD (red)
  const color = invertColor
    ? p <= 100
      ? C.green
      : C.red
    : p >= 95
      ? C.green
      : p >= 80
        ? C.amber
        : C.red;
  return (
    <span style={{ fontSize: 10, color, fontWeight: 600 }}>
      {p}% of target {invertColor && p <= 100 ? "✓" : ""}
    </span>
  );
}
function SecHeader({ Ic, title, subtitle, iconColor = C.blue, right }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 18,
        flexWrap: "wrap",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: iconColor + "18",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Ic size={18} color={iconColor} strokeWidth={2} />
        </div>
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: C.text }}>
            {title}
          </h2>
          {subtitle && (
            <p style={{ fontSize: 11, color: C.textMd, marginTop: 2 }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {right}
    </div>
  );
}
function Panel({ children, sx = {}, delay = 0, glowRed = false }) {
  return (
    <div
      className={`panel-enter${glowRed ? " glow-red" : ""}`}
      style={{
        background: C.surf,
        border: `1px solid ${glowRed ? C.red + "44" : C.border}`,
        borderRadius: 16,
        padding: "18px 16px",
        boxShadow: "0 4px 28px rgba(0,0,0,0.32)",
        animationDelay: `${delay}ms`,
        ...sx,
      }}
    >
      {children}
    </div>
  );
}
function Mini({ label, value, sub, subNode, color = C.blue, loading }) {
  return (
    <div
      className="mini-card"
      style={{
        background: C.surf2,
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        padding: "12px 14px",
      }}
    >
      <p
        style={{
          fontSize: 9,
          color: C.textSf,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: ".08em",
          marginBottom: 5,
        }}
      >
        {label}
      </p>
      {loading ? (
        <Sk h={24} />
      ) : (
        <p
          className="num-rise"
          style={{ fontSize: 18, fontWeight: 700, color, fontFamily: C.mono }}
        >
          {value}
        </p>
      )}
      {(sub || subNode) && (
        <div style={{ fontSize: 10, color: C.textMd, marginTop: 4 }}>
          {loading ? <Sk h={12} w="60%" /> : subNode || sub}
        </div>
      )}
    </div>
  );
}
function Tip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: C.surf3,
        border: `1px solid ${C.borderMd}`,
        borderRadius: 10,
        padding: "10px 14px",
        fontSize: 12,
        fontFamily: "'Sora',sans-serif",
        boxShadow: "0 12px 36px rgba(0,0,0,0.5)",
      }}
    >
      <p style={{ fontWeight: 600, color: C.text, marginBottom: 6 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, margin: "2px 0" }}>
          {p.name}: <strong>{fmtN(p.value)}</strong>
        </p>
      ))}
    </div>
  );
}
function AlertIc({ iconKey, alertType }) {
  const color =
    alertType === "critical"
      ? C.red
      : alertType === "warning"
        ? C.amber
        : C.blue;
  const pr = { size: 17, color, strokeWidth: 2 };
  const map = {
    mortality: <Skull {...pr} />,
    hatchery: <Egg {...pr} />,
    vaccine: <Syringe {...pr} />,
    equipment: <Wrench {...pr} />,
    feed: <Wheat {...pr} />,
    biosecurity: <Lock {...pr} />,
  };
  return map[iconKey] || <AlertCircle {...pr} />;
}

/* ══════════════════════════════════════════════════
   BREED DROPDOWN COMPONENT
══════════════════════════════════════════════════ */
function BreedDropdown({ breeds, selected, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  return (
    <div ref={ref} className="breed-dropdown">
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 12px",
          borderRadius: 8,
          border: `1px solid ${selected !== "All Breeds" ? C.blue + "88" : C.borderMd}`,
          background: selected !== "All Breeds" ? C.blueLt : "transparent",
          color: selected !== "All Breeds" ? C.blue : C.textMd,
          fontSize: 11,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "'Sora',sans-serif",
          transition: "all 0.16s",
        }}
      >
        <Filter size={11} />
        {selected}
        {open ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
      </button>
      {open && (
        <div className="breed-menu">
          {breeds.map((breed) => (
            <div
              key={breed}
              className={`breed-option${selected === breed ? " selected" : ""}`}
              onClick={() => {
                onChange(breed);
                setOpen(false);
              }}
            >
              {selected === breed && (
                <span style={{ marginRight: 6, color: C.blue }}>✓</span>
              )}
              {breed}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   Utility: resolve breed-specific KPI value
   Returns breed-filtered value or global value
══════════════════════════════════════════════════ */
// ─── REPLACE WITH ────────────────────────────────────
function useBreedKpi(data, selectedBreed, selectedFarm, period = "week") {
  const k = data?.kpi || {};
  const h = data?.hatchery || {};

  const isFarmFiltered = selectedFarm !== "All Farms";
  const isBreedFiltered = selectedBreed !== "All Breeds";
  const isFiltered = isFarmFiltered || isBreedFiltered;

  // ── Pick the egg-data bucket ─────────────────────────
  let eD = null;
  if (isFarmFiltered && isBreedFiltered) {
    eD =
      data?.farmBreedEggData?.[selectedFarm]?.[selectedBreed] ||
      emptyBreedEgg();
  } else if (isFarmFiltered) {
    eD = data?.farmEggData?.[selectedFarm] || emptyBreedEgg();
  } else if (isBreedFiltered) {
    eD = data?.breedEggData?.[selectedBreed] || emptyBreedEgg();
  }

  // ── Hatchery breed data ──────────────────────────────
  let hD = null;
  if (isBreedFiltered)
    hD = data?.breedHatchData?.[selectedBreed] || emptyBreedHatch();

  // ── Period-aware GLOBAL values ───────────────────────
  const globalEggs =
    period === "year"
      ? k.eggsThisYear
      : period === "month"
        ? k.eggsThisMonth
        : k.eggsThisWeek;

  const globalMort =
    period === "year"
      ? k.mortalityThisYear
      : period === "month"
        ? k.mortalityThisMonth
        : k.mortalityThisWeek;

  const globalHatch =
    period === "month" ? k.hatchingEggsMonth : k.hatchingEggsWeek;

  const globalChicks =
    period === "year"
      ? k.goodChicksYear
      : period === "month"
        ? k.goodChicksMonth
        : k.goodChicksWeek;

  const globalEggsSet =
    period === "year"
      ? h.eggsSetYear
      : period === "month"
        ? h.eggsSetMonth
        : h.eggsSetWeek;

  const globalFeedTons =
    period === "year"
      ? k.feedIntakeTonsYear
      : period === "month"
        ? k.feedIntakeTonsMonth
        : k.feedIntakeTonsWeek;

  // ── Period-aware FILTERED values ─────────────────────
  const filteredEggs = eD
    ? period === "year"
      ? eD.eggsYear
      : period === "month"
        ? eD.eggsMonth
        : eD.eggsWeek
    : 0;

  const filteredMort = eD
    ? period === "year"
      ? eD.mortalityYear
      : period === "month"
        ? eD.mortalityMonth
        : eD.mortalityWeek
    : 0;

  const filteredHatch = eD
    ? period === "month"
      ? eD.hatchableMonth
      : eD.hatchableWeek
    : 0;

  const filteredFeedKg = eD
    ? period === "year"
      ? eD.feedKgYear
      : period === "month"
        ? eD.feedKgMonth
        : eD.feedKgWeek
    : 0;

  const filteredChicks = hD
    ? period === "year"
      ? hD.goodChicksYear
      : period === "month"
        ? hD.goodChicksMonth
        : hD.goodChicksWeek
    : null;

  const filteredEggsSet = hD
    ? period === "year"
      ? hD.eggsSetYear
      : period === "month"
        ? hD.eggsSetMonth
        : hD.eggsSetWeek
    : null;

  // ── Resolved values ──────────────────────────────────
  const eggs_val = isFiltered ? filteredEggs : globalEggs;
  const mort_val = isFiltered ? filteredMort : globalMort;
  const hatch_val = isFiltered ? filteredHatch : globalHatch;
  const feedTons_val = isFiltered ? filteredFeedKg / 1000 : globalFeedTons || 0;
  const feedCost_val = isFiltered
    ? filteredFeedKg * (k.costPerFeedKg || 285)
    : k.feedCostTotal;

  // Good chicks: prefer hD (hatchery) when breed-filtered, else eD or global
  const chicks_val = isFiltered
    ? filteredChicks != null
      ? filteredChicks
      : filteredEggs
    : globalChicks;

  const eggsSet_val = isFiltered
    ? filteredEggsSet != null
      ? filteredEggsSet
      : 0
    : globalEggsSet;

  // Hatchability — recompute from filtered data when possible
  let hatchabilityWeek_val = k.hatchabilityWeek;
  let hatchabilityMonth_val = k.hatchabilityMonth;
  if (hD) {
    const setWk = hD.eggsSetWeek || 0;
    const setMo = hD.eggsSetMonth || 0;
    const setYr = hD.eggsSetYear || 0;
    const chkWk = hD.goodChicksWeek || 0;
    const chkMo = hD.goodChicksMonth || 0;
    const chkYr = hD.goodChicksYear || 0;
    if (period === "year" && setYr > 0)
      hatchabilityWeek_val = parseFloat(((chkYr / setYr) * 100).toFixed(1));
    if (period === "month" && setMo > 0)
      hatchabilityWeek_val = parseFloat(((chkMo / setMo) * 100).toFixed(1));
    if (period === "week" && setWk > 0)
      hatchabilityWeek_val = parseFloat(((chkWk / setWk) * 100).toFixed(1));
    if (setMo > 0)
      hatchabilityMonth_val = parseFloat(((chkMo / setMo) * 100).toFixed(1));
  }

  // Mortality female / male
  const mortFemale_val = isFiltered
    ? (eD?.mortalityFemale ?? 0)
    : k.mortalityFemale;
  const mortMale_val = isFiltered ? (eD?.mortalityMale ?? 0) : k.mortalityMale;

  // ── period-resolved expense (including salary placeholder) ──

  // Dept expenses already baked into totalExpense — use directly
  const expenseForPeriod = period === "year"
    ? (data?.finance?.totalExpenseYear || 0)
    : period === "month"
      ? (data?.finance?.totalExpenseMonth || 0)
      : (data?.finance?.totalExpenseWeek || 0);
  // const expenseForPeriod = period === "year"
  //   ? (data?.finance?.totalExpenseYear || 0) + (k.salaryExpenseMonth || 0) * 12
  //   : period === "month"
  //     ? (data?.finance?.totalExpenseMonth || 0) + (k.salaryExpenseMonth || 0)
  //     : (data?.finance?.totalExpenseWeek || 0) + Math.round((k.salaryExpenseMonth || 0) / 4.33);

  // ── period-resolved hatchable eggs ──
  const hatchableForPeriod = isFiltered
    ? period === "month" ? (eD?.hatchableMonth ?? 0) : (eD?.hatchableWeek ?? 0)
    : period === "year" ? (k.hatchingEggsYear || 0)
      : period === "month" ? k.hatchingEggsMonth
        : k.hatchingEggsWeek;

  // ── period-resolved good chicks ──
  const goodChicksForPeriod = isFiltered
    ? period === "year" ? (hD?.goodChicksYear ?? chicks_val)
      : period === "month" ? (hD?.goodChicksMonth ?? chicks_val)
        : chicks_val
    : period === "year" ? k.goodChicksYear
      : period === "month" ? k.goodChicksMonth
        : k.goodChicksWeek;

  // ── period-resolved eggs set (for hatch forecast) ──
  const eggsSetForPeriod = isFiltered
    ? period === "month" ? (hD?.eggsSetMonth ?? 0) : (hD?.eggsSetWeek ?? 0)
    : period === "year" ? (data?.hatchery?.eggsSetYear || 0)
      : period === "month" ? (data?.hatchery?.eggsSetMonth || 0)
        : eggsSet_val;

  // ── compute cost/hatching egg for this period+filter ──
  const costPerHatchingEggPeriod = (() => {
    if (isBreedFiltered) {
      const breedExp = period === "year"
        ? (data?.feedDeliveries?.breedCostYear?.[selectedBreed] || 0)
        : period === "month"
          ? (data?.feedDeliveries?.breedCostMonth?.[selectedBreed] || 0)
          : (data?.feedDeliveries?.breedCostWeek?.[selectedBreed] || 0);
      const breedHatch = hatchableForPeriod;
      if (breedExp > 0 && breedHatch > 0) return Math.round(breedExp / breedHatch);
    }
    return period === "year" ? k.costPerHatchingEggYear
      : period === "month" ? k.costPerHatchingEggMonth
        : k.costPerHatchingEggWeek;
  })();

  const sellingPxHatchingEggPeriod = costPerHatchingEggPeriod > 0
    ? parseFloat((costPerHatchingEggPeriod * (1 + (k.hatchingEggMarginPct || 66) / 100)).toFixed(2))
    : 0;

  // ── compute cost/chick for this period+filter ──
  const costPerChickPeriod = (() => {
    // if (isBreedFiltered) {
    //   const breedExp = period === "year"
    //     ? (data?.feedDeliveries?.breedCostYear?.[selectedBreed] || 0)
    //     : period === "month"
    //       ? (data?.feedDeliveries?.breedCostMonth?.[selectedBreed] || 0)
    //       : (data?.feedDeliveries?.breedCostWeek?.[selectedBreed] || 0);
    //   const breedChicks = goodChicksForPeriod;
    //   if (breedExp > 0 && breedChicks > 0) return Math.round(breedExp / breedChicks);
    // }
    return period === "year" ? k.costPerChickYear
      : period === "month" ? k.costPerChickMonth
        : k.costPerChickWeek;
  })();

  const chickSellingPxPeriod = costPerChickPeriod > 0
    ? Math.round(costPerChickPeriod * (1 + (k.chickSellingMarginPct || 40) / 100))
    : 0;

  // ── period-resolved eggs produced ──
  const eggsPeriodVal = period === "year"
    ? (isFiltered ? (eD?.eggsYear ?? 0) : k.eggsThisYear)
    : period === "month"
      ? (isFiltered ? (eD?.eggsMonth ?? 0) : k.eggsThisMonth)
      : eggs_val;

  // ── period-resolved mortality ──
  const mortPeriodVal = period === "year"
    ? (isFiltered ? (eD?.mortalityYear ?? 0) : k.mortalityThisYear)
    : period === "month"
      ? (isFiltered ? (eD?.mortalityMonth ?? 0) : k.mortalityThisMonth)
      : mort_val;

  return {
    isFiltered,
    isFarmFiltered,
    isBreedFiltered,

    // ── eggs (period-aware) ──
    eggsThisWeek: eggsPeriodVal,
    eggsThisMonth: isFiltered ? (eD?.eggsMonth ?? 0) : k.eggsThisMonth,
    eggsThisYear: isFiltered ? (eD?.eggsYear ?? 0) : k.eggsThisYear,

    // ── hatching ──
    hatchingEggsWeek: hatchableForPeriod,
    hatchingEggsMonth: isFiltered ? (eD?.hatchableMonth ?? 0) : k.hatchingEggsMonth,
    hatchingEggsYear: k.hatchingEggsYear || 0,
    hatchingEggsThisPeriod: hatchableForPeriod,

    // ── rejected ──
    // farmRejectedEggs: isFiltered ? (eD?.farmRejectedTotal ?? 0) : k.farmRejectedEggs,

    farmRejectedEggs: (() => {
  if (!isFiltered) {
    if (period === "week")  return k.farmRejectedEggsWeek  ?? 0;
    if (period === "month") return k.farmRejectedEggsMonth ?? 0;
    if (period === "year")  return k.farmRejectedEggsYear  ?? 0;
    return k.farmRejectedEggs ?? 0;
  }
  if (period === "week")  return eD?.farmRejectedWeek  ?? 0;
  if (period === "month") return eD?.farmRejectedMonth ?? 0;
  if (period === "year")  return eD?.farmRejectedYear  ?? 0;
  return eD?.farmRejectedTotal ?? 0;
})(),

    // ── mortality (period-aware) ──
    mortalityThisWeek: mortPeriodVal,
    mortalityThisMonth: isFiltered ? (eD?.mortalityMonth ?? 0) : k.mortalityThisMonth,
    mortalityThisYear: isFiltered ? (eD?.mortalityYear ?? 0) : k.mortalityThisYear,
    mortalityFemale: mortFemale_val,
    mortalityMale: mortMale_val,

    // ── feed ──
    feedIntakeTons: (() => {
      if (!isFiltered) return parseFloat(feedTons_val.toFixed(1));
      const fKg = period === "year" ? (eD?.feedKgYear ?? 0)
        : period === "month" ? (eD?.feedKgMonth ?? 0)
          : (eD?.feedKgWeek ?? 0);
      return parseFloat((fKg / 1000).toFixed(1));
    })(),
    feedCostTotal: feedCost_val,

    // ── hatchery ──
    eggsSetWeek: eggsSetForPeriod,
    eggsSetMonth: isFiltered ? (hD?.eggsSetMonth ?? 0) : (data?.hatchery?.eggsSetMonth || 0),
    goodChicksWeek: goodChicksForPeriod,
    goodChicksMonth: isFiltered ? (hD?.goodChicksMonth ?? 0) : k.goodChicksMonth,
    goodChicksYear: isFiltered ? (hD?.goodChicksYear ?? 0) : k.goodChicksYear,
    hatchabilityWeek: hatchabilityWeek_val,
    hatchabilityMonth: hatchabilityMonth_val,

    // ── storage ──
    storageEggs: isBreedFiltered
      ? data?.breedStorageEggs?.[selectedBreed] || 0
      : k.storageEggsAvailable,
    docAvailable: isBreedFiltered
      ? data?.breedDOC?.[selectedBreed] || 0
      : k.totalDOC,

    // ── birds ──
    totalBirdsPlaced: isBreedFiltered
      ? data?.breedMap?.[selectedBreed] || 0
      : isFarmFiltered
        ? data?.farmBirdsPlacedMap?.[selectedFarm] || k.totalBirdsPlaced
        : k.totalBirdsPlaced,
    birdsAlive: isBreedFiltered
      ? Math.max(0, (data?.breedMap?.[selectedBreed] || 0) - (data?.breedEggData?.[selectedBreed]?.mortalityYear || 0))
      : isFarmFiltered
        ? Math.max(0, (data?.farmBirdsPlacedMap?.[selectedFarm] || 0) - (data?.farmEggData?.[selectedFarm]?.mortalityYear || 0))
        : k.birdsAlive,

    // ── COST KPIs (period + breed aware) ──
    costPerFeedKg: k.costPerFeedKg,
    costPerHatchingEgg: costPerHatchingEggPeriod,
    sellingPxHatchingEgg: sellingPxHatchingEggPeriod,
    costPerChick: costPerChickPeriod,
    chickSellingPx: chickSellingPxPeriod,
    hatchingEggMarginPct: k.hatchingEggMarginPct || 66,
    chickSellingMarginPct: k.chickSellingMarginPct || 40,
    salaryExpenseMonth: k.salaryExpenseMonth || 0,

    // ── expense/denominator display in card subtext ──
    expenseForPeriod,
    hatchableForPeriod,
    goodChicksForPeriod,

    // ── hatch forecast = eggs set (confirmed by client) ──
    // hatchForecastWeek: eggsSetForPeriod,
    // hatchForecastMonth: isFiltered ? (hD?.eggsSetMonth ?? 0) : (data?.hatchery?.eggsSetMonth || 0),
    //
        hatchForecastWeek: period === "year"
      ? (data?.kpi?.hatchForecastYear || 0)
      : period === "month"
        ? (data?.kpi?.hatchForecastMonth || 0)
        : (data?.kpi?.hatchForecastWeek || 0),
    hatchForecastMonth: data?.kpi?.hatchForecastMonth || 0,
    // ── delta ──
    costPerChickLastWeek: k.costPerChickLastWeek,

    // ── orders (period-aware) ──
    confirmedOrdersWeek: (() => {
      const base = isFiltered ? k.confirmedChicksWeek : k.confirmedOrdersWeek;
      if (period === "month") return isFiltered ? k.confirmedChicksMonth : k.confirmedOrdersMonth;
      if (period === "year") return isFiltered ? k.confirmedChicksYear : k.confirmedOrdersYear;
      return base;
    })(),
    confirmedOrdersMonth: isFiltered ? k.confirmedChicksMonth : k.confirmedOrdersMonth,
    pendingOrdersWeek: (() => {
      const base = isFiltered ? k.pendingChicksWeek : k.pendingOrdersWeek;
      if (period === "month") return isFiltered ? k.pendingChicksMonth : k.pendingOrdersMonth;
      return base;
    })(),
    pendingOrdersMonth: isFiltered ? k.pendingChicksMonth : k.pendingOrdersMonth,

    // ── avg rate ──
    avgEggProductionRate: k.avgEggProductionRate,

    // ── mortality % (period + filter aware) ──
    // mortalityPct: (() => {
    //   const deaths = mortPeriodVal;
    //   let placed = 0;
    //   if (isBreedFiltered) placed = data?.breedMap?.[selectedBreed] || 0;
    //   else if (isFarmFiltered) placed = data?.farmBirdsPlacedMap?.[selectedFarm] || 0;
    //   else placed = k.totalBirdsPlaced || 0;
    //   return placed > 0 ? parseFloat(((deaths / placed) * 100).toFixed(2)) : 0;
    // })(),
    mortalityPct: (() => {
      const deaths = mortPeriodVal;
      let alive = 0;
      if (isBreedFiltered) {
        // birds placed minus cumulative mortality for this breed
        const placed = data?.breedMap?.[selectedBreed] || 0;
        const cumMort = data?.breedEggData?.[selectedBreed]?.mortalityYear || 0;
        alive = Math.max(1, placed - cumMort);
      } else if (isFarmFiltered) {
        const placed = data?.farmBirdsPlacedMap?.[selectedFarm] || 0;
        const cumMort = data?.farmEggData?.[selectedFarm]?.mortalityYear || 0;
        alive = Math.max(1, placed - cumMort);
      } else {
        alive = k.birdsAlive || k.totalBirdsPlaced || 1;
      }
      return parseFloat(((deaths / alive) * 100).toFixed(2));
    })(),
    worstFarm: isFarmFiltered ? selectedFarm : isBreedFiltered ? selectedBreed : k.worstFarm,

    // ── targets ──
    eggsWeekTarget: k.eggsWeekTarget,
    eggsMonthTarget: k.eggsMonthTarget,
    eggsYearTarget: k.eggsYearTarget || 0,
    mortalityTarget: k.mortalityTarget || 0,
    mortalityTargetMonth: k.mortalityTargetMonth || 0,
    mortalityTargetYear: k.mortalityTargetYear || 0,
    hatchabilityTarget: k.hatchabilityTarget || 85,
    hatchabilityTargetMonth: k.hatchabilityTargetMonth || 85,
    fertilityTarget: k.fertilityTarget || 90,
    feedCostKgTarget: k.feedCostKgTarget || 0,
    costPerChickTarget: k.costPerChickTarget || 0,
    sellingPriceTarget: k.sellingPriceTarget || 0,
    eggsSetWeekTarget: k.eggsSetWeekTarget || 0,
    eggsSetMonthTarget: k.eggsSetMonthTarget || 0,
    goodChicksWeekTarget: k.goodChicksWeekTarget || 0,
    goodChicksMonthTarget: k.goodChicksMonthTarget || 0,
    confirmedOrdersWeekTarget: k.confirmedOrdersWeekTarget || 0,
    confirmedOrdersMonthTarget: k.confirmedOrdersMonthTarget || 0,
    criticalIssues: k.criticalIssues,
  };
}

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/* Build a sorted array of { key, label, year, month } for a given year */
function buildMonthsForYear(year) {
  return Array.from({ length: 12 }, (_, i) => ({
    key: `${year}-${String(i + 1).padStart(2, "0")}`,
    label: MONTH_NAMES[i],
    year,
    month: i,
  }));
}

/* Merge ops + hatch + fin into one row per month key */
function buildMonthRows(
  monthlyOpsData = {},
  monthlyHatchData = {},
  monthlyFinData = {},
  year,
) {
  return buildMonthsForYear(year).map(({ key, label }) => {
    const o = monthlyOpsData[key] || OPS_TPL;
    const h = monthlyHatchData[key] || HATCH_TPL;
    const f = monthlyFinData[key] || FIN_TPL;
    const hatchabilityPct =
      h.eggsSet > 0
        ? parseFloat(((h.goodChicks / h.eggsSet) * 100).toFixed(1))
        : 0;
    const feedMT = parseFloat((o.feedKg / 1000).toFixed(1));
    return {
      key,
      label,
      eggs: o.eggs,
      hatchable: o.hatchable,
      mort: o.mort,
      feedMT,
      eggsSet: h.eggsSet,
      goodChicks: h.goodChicks,
      fertile: h.fertile,
      hatchability: hatchabilityPct,
      revenue: f.revenue,
      expense: f.expense,
      cashIn: f.cashIn,
      profit: f.revenue - f.expense,
    };
  });
}

/* ── Colour palette (matches WAFAD dark palette) ── */
const MC = {
  blue: "#1E8CFF",
  green: "#10D97A",
  red: "#EF4444",
  amber: "#F59E0B",
  purple: "#8B5CF6",
  cyan: "#06B6D4",
  orange: "#F97316",
};

/* ── tiny sparkline bar ── */
function SparkBar({ values, color, height = 28 }) {
  if (!values || values.length === 0) return null;
  const max = Math.max(...values, 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height }}>
      {values.map((v, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${Math.max(2, (v / max) * height)}px`,
            background: color,
            borderRadius: "2px 2px 0 0",
            opacity: i === values.length - 1 ? 1 : 0.45,
          }}
        />
      ))}
    </div>
  );
}

/* ── compact metric row card ── */
function MRow({ label, curVal, prevVal, color, format = (v) => fmtN(v) }) {
  const diff = curVal - prevVal;
  const pct = prevVal > 0 ? ((diff / prevVal) * 100).toFixed(1) : null;
  const up = diff >= 0;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 12px",
        borderRadius: 8,
        background: C.surf2,
        border: `1px solid ${C.border}`,
        marginBottom: 6,
      }}
    >
      <span style={{ fontSize: 11, color: C.textMd, flex: 1 }}>{label}</span>
      <span
        style={{
          fontSize: 13,
          fontWeight: 700,
          color,
          fontFamily: C.mono,
          marginRight: 10,
        }}
      >
        {format(curVal)}
      </span>
      {pct !== null && (
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            padding: "2px 7px",
            borderRadius: 12,
            background: up ? C.green + "18" : C.red + "18",
            color: up ? C.green : C.red,
          }}
        >
          {up ? "▲" : "▼"} {Math.abs(pct)}%
        </span>
      )}
    </div>
  );
}

// function MonthlyTrendSection({ data, loading }) {
//   const curYear = new Date().getFullYear();
function MonthlyTrendSection({ data, loading, selectedYear }) {
  const curYear = selectedYear || new Date().getFullYear();
  const prevYear = curYear - 1;
  const [metric, setMetric] = useState("eggs");
  const [viewMode, setViewMode] = useState("chart"); // "chart" | "table"

  if (!data?.monthlyOpsData && !loading) {
    return (
      <Panel delay={0}>
        <SecHeader
          Ic={CalendarDays}
          title="Monthly Trend — Year on Year"
          subtitle="Add monthly aggregation to loadAllData (see Step 1–5 comments)"
          iconColor={MC.blue}
        />
        <div
          style={{
            padding: "32px",
            textAlign: "center",
            color: C.textSf,
            fontSize: 12,
          }}
        >
          <CalendarDays
            size={32}
            color={C.textSf}
            style={{ marginBottom: 10 }}
          />
          <p>Monthly data not yet wired.</p>
          <p style={{ marginTop: 6 }}>
            Follow Steps 1–5 in MonthlyTrendSection.jsx to add the aggregation
            blocks to loadAllData.
          </p>
        </div>
      </Panel>
    );
  }

  const curRows = buildMonthRows(
    data?.monthlyOpsData,
    data?.monthlyHatchData,
    data?.monthlyFinData,
    curYear,
  );
  const prevRows = buildMonthRows(
    data?.monthlyOpsData,
    data?.monthlyHatchData,
    data?.monthlyFinData,
    prevYear,
  );

  /* ── Total this year vs last year ── */
  const sumField = (rows, field) =>
    rows.reduce((s, r) => s + (r[field] || 0), 0);

  const METRIC_OPTIONS = [
  { key: "eggs", label: "Eggs Produced", color: MC.cyan, format: (v) => fmtN(v) },
  { key: "goodChicks", label: "Good Chicks", color: MC.green, format: (v) => fmtN(v) },
  { key: "hatchability", label: "Hatchability %", color: MC.blue, format: (v) => `${fmtN(v, 1)}%` },
  { key: "mort", label: "Mortality", color: MC.red, format: (v) => fmtN(v) },
  { key: "feedMT", label: "Feed (MT)", color: MC.amber, format: (v) => `${fmtN(v, 1)} MT` },
  { key: "revenue", label: "Revenue (GHC)", color: MC.green, format: (v) => fmtCur(v) },
  { key: "expense", label: "Expenses (GHC)", color: MC.red, format: (v) => fmtCur(v) },
  { key: "profit", label: "Net Profit (GHC)", color: MC.purple, format: (v) => fmtCur(v) },
  { key: "eggsSet", label: "Eggs Set", color: MC.amber, format: (v) => fmtN(v) },
];

  // const METRIC_OPTIONS = [
  //   {
  //     key: "eggs",
  //     label: "Eggs Produced",
  //     color: MC.cyan,
  //     format: (v) => fmtN(v),
  //   },
  //   {
  //     key: "goodChicks",
  //     label: "Good Chicks",
  //     color: MC.green,
  //     format: (v) => fmtN(v),
  //   },
  //   {
  //     key: "hatchability",
  //     label: "Hatchability %",
  //     color: MC.blue,
  //     format: (v) => `${v}%`,
  //   },
  //   { key: "mort", label: "Mortality", color: MC.red, format: (v) => fmtN(v) },
  //   {
  //     key: "feedMT",
  //     label: "Feed (MT)",
  //     color: MC.amber,
  //     format: (v) => `${fmtN(v, 1)} MT`,
  //   },
  //   {
  //     key: "revenue",
  //     label: "Revenue (GHC)",
  //     color: MC.green,
  //     format: (v) => fmtCur(v),
  //   },
  //   {
  //     key: "expense",
  //     label: "Expenses (GHC)",
  //     color: MC.red,
  //     format: (v) => fmtCur(v),
  //   },
  //   {
  //     key: "profit",
  //     label: "Net Profit (GHC)",
  //     color: MC.purple,
  //     format: (v) => fmtCur(v),
  //   },
  //   {
  //     key: "eggsSet",
  //     label: "Eggs Set",
  //     color: MC.amber,
  //     format: (v) => fmtN(v),
  //   },
  // ];

  const activeMeta =
    METRIC_OPTIONS.find((m) => m.key === metric) || METRIC_OPTIONS[0];
  const curValues = curRows.map((r) => r[metric] || 0);
  const prevValues = prevRows.map((r) => r[metric] || 0);
  // const curTotal = sumField(curRows, metric);
  // const prevTotal = sumField(prevRows, metric);
 
  const isPercentMetric = metric === "hatchability";

const curTotal = isPercentMetric
  ? parseFloat(
      (
        curValues.filter(v => v > 0).reduce((s, v) => s + v, 0) /
        Math.max(1, curValues.filter(v => v > 0).length)
      ).toFixed(1)
    )
  : sumField(curRows, metric);

const prevTotal = isPercentMetric
  ? parseFloat(
      (
        prevValues.filter(v => v > 0).reduce((s, v) => s + v, 0) /
        Math.max(1, prevValues.filter(v => v > 0).length)
      ).toFixed(1)
    )
  : sumField(prevRows, metric);
  const totalDiff = curTotal - prevTotal;
  const totalDiffPct =
    prevTotal > 0
      ? parseFloat(((totalDiff / prevTotal) * 100).toFixed(1))
      : null;

  /* ── Build chart bars (cur + prev side by side per month) ── */
  const maxVal = Math.max(...curValues, ...prevValues, 1);

  const summaryCards = [
    {
      label: `${curYear} YTD`,
      value: activeMeta.format(curTotal),
      color: activeMeta.color,
    },
    {
      label: `${prevYear} Full Year`,
      value: activeMeta.format(prevTotal),
      color: MC.orange,
    },
    {
      label: "YoY Change",
      value:
        totalDiffPct !== null
          ? `${totalDiffPct > 0 ? "+" : ""}${totalDiffPct}%`
          : "—",
      color: totalDiff >= 0 ? MC.green : MC.red,
    },
    {
      label: "Best Month",
      value: (() => {
        const idx = curValues.indexOf(Math.max(...curValues));
        return idx >= 0 ? MONTH_NAMES[idx] : "—";
      })(),
      color: MC.blue,
    },
  ];

  return (
    <Panel delay={0}>
      {/* Header */}
      <SecHeader
        Ic={CalendarDays}
        title="Monthly Trend — Year on Year"
        subtitle={`${curYear} vs ${prevYear} · Select metric below`}
        iconColor={MC.blue}
        right={
          <div style={{ display: "flex", gap: 5 }}>
            {["chart", "table"].map((v) => (
              <button
                key={v}
                className={`tab-btn${viewMode === v ? " active" : ""}`}
                onClick={() => setViewMode(v)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 7,
                  border: `1px solid ${C.border}`,
                  background: "transparent",
                  color: C.textMd,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'Sora',sans-serif",
                  textTransform: "capitalize",
                }}
              >
                {v}
              </button>
            ))}
          </div>
        }
      />

      {/* Metric selector pills */}
      <div
        style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}
      >
        {METRIC_OPTIONS.map((m) => (
          <button
            key={m.key}
            onClick={() => setMetric(m.key)}
            style={{
              padding: "5px 13px",
              borderRadius: 20,
              border: `1px solid ${metric === m.key ? m.color + "77" : C.border}`,
              background: metric === m.key ? m.color + "18" : "transparent",
              color: metric === m.key ? m.color : C.textMd,
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Sora',sans-serif",
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Summary KPI strip */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))",
          gap: 10,
          marginBottom: 20,
        }}
      >
        {summaryCards.map(({ label, value, color }) => (
          <div
            key={label}
            style={{
              background: C.surf2,
              border: `1px solid ${C.border}`,
              borderRadius: 10,
              padding: "12px 14px",
              borderTop: `3px solid ${color}`,
            }}
          >
            <p
              style={{
                fontSize: 9,
                color: C.textSf,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: ".07em",
                marginBottom: 6,
              }}
            >
              {label}
            </p>
            {loading ? (
              <div
                className="skeleton"
                style={{ height: 22, borderRadius: 4 }}
              />
            ) : (
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color,
                  fontFamily: C.mono,
                }}
              >
                {value}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          gap: 16,
          marginBottom: 12,
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              background: activeMeta.color,
            }}
          />
          <span style={{ fontSize: 11, color: C.textMd }}>{curYear}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              background: MC.orange,
              opacity: 0.6,
            }}
          />
          <span style={{ fontSize: 11, color: C.textMd }}>{prevYear}</span>
        </div>
      </div>

      {viewMode === "chart" ? (
        /* ── CHART VIEW ── */
        loading ? (
          <div className="skeleton" style={{ height: 220, borderRadius: 10 }} />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <div style={{ minWidth: 600 }}>
              {/* Bar chart */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 6,
                  height: 220,
                  padding: "0 4px",
                }}
              >
                {MONTH_NAMES.map((mon, i) => {
                  const cv = curValues[i] || 0;
                  const pv = prevValues[i] || 0;
                  const chPct = (cv / maxVal) * 200;
                  const phPct = (pv / maxVal) * 200;
                  return (
                    <div
                      key={mon}
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          gap: 2,
                          height: 200,
                          width: "100%",
                        }}
                      >
                        {/* prev year bar */}
                        <div
                          style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-end",
                            height: "100%",
                          }}
                        >
                          <div
                            style={{
                              height: `${phPct}px`,
                              background: MC.orange,
                              borderRadius: "3px 3px 0 0",
                              opacity: 0.55,
                              minHeight: pv > 0 ? 3 : 0,
                              position: "relative",
                            }}
                            title={`${prevYear} ${mon}: ${activeMeta.format(pv)}`}
                          />
                        </div>
                        {/* cur year bar */}
                        <div
                          style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-end",
                            height: "100%",
                          }}
                        >
                          <div
                            style={{
                              height: `${chPct}px`,
                              background: activeMeta.color,
                              borderRadius: "3px 3px 0 0",
                              minHeight: cv > 0 ? 3 : 0,
                              position: "relative",
                            }}
                            title={`${curYear} ${mon}: ${activeMeta.format(cv)}`}
                          />
                        </div>
                      </div>
                      <span
                        style={{ fontSize: 9, color: C.textSf, marginTop: 4 }}
                      >
                        {mon}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Month-by-month delta row */}
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  marginTop: 10,
                  padding: "0 4px",
                }}
              >
                {MONTH_NAMES.map((mon, i) => {
                  const cv = curValues[i] || 0;
                  const pv = prevValues[i] || 0;
                  const d = pv > 0 ? (((cv - pv) / pv) * 100).toFixed(0) : null;
                  const up = cv >= pv;
                  return (
                    <div key={mon} style={{ flex: 1, textAlign: "center" }}>
                      {d !== null && (
                        <span
                          style={{
                            fontSize: 8,
                            fontWeight: 700,
                            color: up ? MC.green : MC.red,
                          }}
                        >
                          {up ? "▲" : "▼"}
                          {Math.abs(d)}%
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )
      ) : (
        /* ── TABLE VIEW ── */
        <div style={{ overflowX: "auto" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}
          >
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {[
                  "Month",
                  `${curYear} Eggs`,
                  `${prevYear} Eggs`,
                  `${curYear} Chicks`,
                  `${prevYear} Chicks`,
                  `${curYear} Mort`,
                  `${prevYear} Mort`,
                  `${curYear} Hatch%`,
                  `${prevYear} Hatch%`,
                  `${curYear} Feed MT`,
                  `${prevYear} Feed MT`,
                  `${curYear} Revenue`,
                  `${prevYear} Revenue`,
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "7px 10px",
                      textAlign: "right",
                      color: C.textSf,
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      fontSize: 9,
                      textTransform: "uppercase",
                      letterSpacing: ".05em",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MONTH_NAMES.map((mon, i) => {
                const c = curRows[i];
                const p = prevRows[i];
                const hasData = c.eggs > 0 || c.goodChicks > 0 || c.revenue > 0;
                return (
                  <tr
                    key={mon}
                    style={{
                      borderBottom: `1px solid ${C.border}`,
                      background: hasData ? "transparent" : C.surf2 + "55",
                    }}
                  >
                    <td
                      style={{
                        padding: "7px 10px",
                        color: C.text,
                        fontWeight: 600,
                      }}
                    >
                      {mon}
                    </td>
                    {/* Eggs */}
                    <td
                      style={{
                        padding: "7px 10px",
                        textAlign: "right",
                        color: MC.cyan,
                        fontFamily: C.mono,
                      }}
                    >
                      {fmtN(c.eggs)}
                    </td>
                    <td
                      style={{
                        padding: "7px 10px",
                        textAlign: "right",
                        color: MC.orange,
                        fontFamily: C.mono,
                        opacity: 0.7,
                      }}
                    >
                      {fmtN(p.eggs)}
                    </td>
                    {/* Chicks */}
                    <td
                      style={{
                        padding: "7px 10px",
                        textAlign: "right",
                        color: MC.green,
                        fontFamily: C.mono,
                      }}
                    >
                      {fmtN(c.goodChicks)}
                    </td>
                    <td
                      style={{
                        padding: "7px 10px",
                        textAlign: "right",
                        color: MC.orange,
                        fontFamily: C.mono,
                        opacity: 0.7,
                      }}
                    >
                      {fmtN(p.goodChicks)}
                    </td>
                    {/* Mortality */}
                    <td
                      style={{
                        padding: "7px 10px",
                        textAlign: "right",
                        color: MC.red,
                        fontFamily: C.mono,
                      }}
                    >
                      {fmtN(c.mort)}
                    </td>
                    <td
                      style={{
                        padding: "7px 10px",
                        textAlign: "right",
                        color: MC.orange,
                        fontFamily: C.mono,
                        opacity: 0.7,
                      }}
                    >
                      {fmtN(p.mort)}
                    </td>
                    {/* Hatchability */}
                    <td
                      style={{
                        padding: "7px 10px",
                        textAlign: "right",
                        color: c.hatchability >= 85 ? MC.green : MC.amber,
                        fontFamily: C.mono,
                      }}
                    >
                      {c.hatchability}%
                    </td>
                    <td
                      style={{
                        padding: "7px 10px",
                        textAlign: "right",
                        color: MC.orange,
                        fontFamily: C.mono,
                        opacity: 0.7,
                      }}
                    >
                      {p.hatchability}%
                    </td>
                    {/* Feed */}
                    <td
                      style={{
                        padding: "7px 10px",
                        textAlign: "right",
                        color: MC.amber,
                        fontFamily: C.mono,
                      }}
                    >
                      {fmtN(c.feedMT, 1)}
                    </td>
                    <td
                      style={{
                        padding: "7px 10px",
                        textAlign: "right",
                        color: MC.orange,
                        fontFamily: C.mono,
                        opacity: 0.7,
                      }}
                    >
                      {fmtN(p.feedMT, 1)}
                    </td>
                    {/* Revenue */}
                    <td
                      style={{
                        padding: "7px 10px",
                        textAlign: "right",
                        color: MC.green,
                        fontFamily: C.mono,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {fmtCur(c.revenue)}
                    </td>
                    <td
                      style={{
                        padding: "7px 10px",
                        textAlign: "right",
                        color: MC.orange,
                        fontFamily: C.mono,
                        opacity: 0.7,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {fmtCur(p.revenue)}
                    </td>
                  </tr>
                );
              })}
              {/* Totals row */}
              <tr
                style={{
                  borderTop: `2px solid ${C.borderMd}`,
                  background: C.surf2,
                }}
              >
                <td
                  style={{
                    padding: "8px 10px",
                    color: C.text,
                    fontWeight: 700,
                  }}
                >
                  Total / Avg
                </td>
                {[
                  [
                    sumField(curRows, "eggs"),
                    sumField(prevRows, "eggs"),
                    MC.cyan,
                    (v) => fmtN(v),
                  ],
                  [
                    sumField(curRows, "goodChicks"),
                    sumField(prevRows, "goodChicks"),
                    MC.green,
                    (v) => fmtN(v),
                  ],
                  [
                    sumField(curRows, "mort"),
                    sumField(prevRows, "mort"),
                    MC.red,
                    (v) => fmtN(v),
                  ],
                  [
                    parseFloat(
                      (
                        curRows
                          .filter((r) => r.hatchability > 0)
                          .reduce((s, r) => s + r.hatchability, 0) /
                        Math.max(
                          1,
                          curRows.filter((r) => r.hatchability > 0).length,
                        )
                      ).toFixed(1),
                    ),
                    parseFloat(
                      (
                        prevRows
                          .filter((r) => r.hatchability > 0)
                          .reduce((s, r) => s + r.hatchability, 0) /
                        Math.max(
                          1,
                          prevRows.filter((r) => r.hatchability > 0).length,
                        )
                      ).toFixed(1),
                    ),
                    MC.blue,
                    (v) => `${v}%`,
                  ],
                  [
                    sumField(curRows, "feedMT"),
                    sumField(prevRows, "feedMT"),
                    MC.amber,
                    (v) => `${fmtN(v, 1)} MT`,
                  ],
                  [
                    sumField(curRows, "revenue"),
                    sumField(prevRows, "revenue"),
                    MC.green,
                    (v) => fmtCur(v),
                  ],
                ].map(([cv, pv, col, fmt], idx) => (
                  <React.Fragment key={idx}>
                    <td
                      style={{
                        padding: "8px 10px",
                        textAlign: "right",
                        color: col,
                        fontFamily: C.mono,
                        fontWeight: 700,
                      }}
                    >
                      {fmt(cv)}
                    </td>
                    <td
                      style={{
                        padding: "8px 10px",
                        textAlign: "right",
                        color: MC.orange,
                        fontFamily: C.mono,
                        opacity: 0.7,
                      }}
                    >
                      {fmt(pv)}
                    </td>
                  </React.Fragment>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Bottom YoY comparison sparklines */}
      {!loading && (
        <div
          style={{
            marginTop: 22,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))",
            gap: 12,
          }}
        >
          {METRIC_OPTIONS.filter((m) => !["hatchability"].includes(m.key)).map(
            (m) => {
              const cv = curRows.map((r) => r[m.key] || 0);
              const pv = prevRows.map((r) => r[m.key] || 0);
              const ct = cv.reduce((s, v) => s + v, 0);
              const pt = pv.reduce((s, v) => s + v, 0);
              const diffPct =
                pt > 0 ? parseFloat((((ct - pt) / pt) * 100).toFixed(1)) : null;
              return (
                <div
                  key={m.key}
                  style={{
                    background: C.surf2,
                    border: `1px solid ${C.border}`,
                    borderRadius: 10,
                    padding: "10px 12px",
                    borderTop: `2px solid ${m.color}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 6,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 9.5,
                        color: C.textSf,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: ".06em",
                      }}
                    >
                      {m.label}
                    </p>
                    {diffPct !== null && (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: diffPct >= 0 ? MC.green : MC.red,
                        }}
                      >
                        {diffPct >= 0 ? "▲" : "▼"}
                        {Math.abs(diffPct)}%
                      </span>
                    )}
                  </div>
                  <SparkBar values={cv} color={m.color} height={28} />
                  <SparkBar values={pv} color={MC.orange} height={16} />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: 6,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        color: m.color,
                        fontFamily: C.mono,
                        fontWeight: 700,
                      }}
                    >
                      {m.format(ct)}
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        color: MC.orange,
                        fontFamily: C.mono,
                        opacity: 0.7,
                      }}
                    >
                      {m.format(pt)}
                    </span>
                  </div>
                </div>
              );
            },
          )}
        </div>
      )}
    </Panel>
  );
}

/* ── Universal delta chip ── */
function DeltaChip({ cur, prev, invert = false }) {
  if (prev == null || prev === 0 || cur == null) return null;
  const diff = cur - prev;
  const pct  = parseFloat(((diff / Math.abs(prev)) * 100).toFixed(1));
  const good = invert ? diff <= 0 : diff >= 0;
  return (
    <span style={{
      fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 10,
      background: good ? C.greenLt : C.redLt,
      color: good ? C.green : C.red,
      display: "inline-flex", alignItems: "center", gap: 2,
      whiteSpace: "nowrap",
    }}>
      {diff >= 0 ? "▲" : "▼"} {Math.abs(pct)}%
    </span>
  );
}

/* ── Resolve prev-period value by period key ── */
function getPrev(prevPeriod, period) {
  if (!prevPeriod) return {};
  const isMonth = period === "month";
  const isYear  = period === "year";
  return {
    eggs:           isYear  ? prevPeriod.eggsYear  : isMonth ? prevPeriod.eggsMonth  : prevPeriod.eggsWeek,
    hatchingEggs:   isMonth ? prevPeriod.hatchingEggsMonth  : prevPeriod.hatchingEggsWeek,
    mortality:      isYear  ? prevPeriod.mortalityYear : isMonth ? prevPeriod.mortalityMonth : prevPeriod.mortalityWeek,
    goodChicks:     isYear  ? prevPeriod.goodChicksYear: isMonth ? prevPeriod.goodChicksMonth: prevPeriod.goodChicksWeek,
    eggsSet:        isMonth ? prevPeriod.eggsSetMonth  : prevPeriod.eggsSetWeek,
    hatchability:   isMonth ? prevPeriod.hatchabilityMonth  : prevPeriod.hatchabilityWeek,
    revenue:        isYear  ? prevPeriod.revenueYear : isMonth ? prevPeriod.revenueMonth : prevPeriod.revenueWeek,
    cash:           isMonth ? prevPeriod.cashMonth   : prevPeriod.cashWeek,
    expense:        isYear  ? prevPeriod.expenseYear : isMonth ? prevPeriod.expenseMonth : prevPeriod.expenseWeek,
    feedCost:       isMonth ? prevPeriod.feedCostMonth : prevPeriod.feedCostWeek,
    label:          isYear  ? prevPeriod.yearLabel : isMonth ? prevPeriod.monthLabel : prevPeriod.weekLabel,
  };
}

/* ══════════════════════════════════════════════════
   SECTION: KPI STRIP  (with Breed Dropdown)
══════════════════════════════════════════════════ */
// ─── REPLACE WITH ────────────────────────────────────
function KpiStrip({
  data,
  loading,
  selectedBreed,
  onBreedChange,
  selectedFarm,
  onFarmChange,
  selectedYear,
  prevPeriod,
}) {

  const [showHatchModal, setShowHatchModal] = useState(false);

  const marginMultiplier = (pct) =>
  (1 + (pct || 0) / 100).toFixed(2);

  const [period, setPeriod] = useState("week");
  const bk = useBreedKpi(data, selectedBreed, selectedFarm, period);
  const prev = getPrev(prevPeriod, period);


  const isPastYear = data?.kpi && selectedYear !== new Date().getFullYear();
  const periodLabel = period === "year"
    ? `${selectedYear || "Year"}`
    : period === "month"
      ? (isPastYear ? `${selectedYear} Total` : "Month")
      : (isPastYear ? `${selectedYear} Total` : "Week");
  // const periodLabel =
  //   period === "year" ? "Year" : period === "month" ? "Month" : "Week";

  const anyFilter =
    selectedBreed !== "All Breeds" || selectedFarm !== "All Farms";


  const kpis = [
    {
      Ic: Bird,
      label: "Total Birds Placed",
      color: C.blue,
      value: fmtN(bk.totalBirdsPlaced),
      sub: `Alive: ${fmtN(bk.birdsAlive)}`,
      subColor: C.green,
    },
    {
  Ic: TrendingDown,
  label: `Mortality (${periodLabel})`,
  color: C.red,
  value: fmtN(bk.mortalityThisWeek),
  subNode: (
    <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap"}}>
      {(() => {
        const tgt = period==="year"  ? bk.mortalityTargetYear
                  : period==="month" ? bk.mortalityTargetMonth
                  : bk.mortalityTarget;
        return tgt > 0
          ? <VsBadge current={bk.mortalityThisWeek} target={tgt} invertColor />
          : null;
      })()}
      <DeltaChip cur={bk.mortalityThisWeek} prev={prev.mortality} invert />
    </div>
  ),
},
    {
      Ic: Wheat,
      label: `Feed Intake MT (${periodLabel})`,
      color: C.amber,
      value: fmtN(bk.feedIntakeTons, 1),
      sub: `Cost: ${fmtCur(bk.feedCostTotal)}`,
    },
    {
  Ic: Egg,
  label: `Eggs Produced (${periodLabel})`,
  color: C.cyan,
  value: fmtN(bk.eggsThisWeek),
  subNode: (
    <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap"}}>
      <VsBadge current={bk.eggsThisWeek}
        target={period==="year" ? bk.eggsYearTarget
              : period==="month" ? bk.eggsMonthTarget
              : bk.eggsWeekTarget} />
      <DeltaChip cur={bk.eggsThisWeek} prev={prev.eggs} />
    </div>
  ),
},
    {
  Ic: PackageOpen,
  label: `Hatching Eggs (${periodLabel})`,
  color: C.purple,
  value: fmtN(bk.hatchingEggsWeek),
  subNode: (
    <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap"}}>
      <span style={{fontSize:10,color:C.textMd}}>Storage: {fmtN(bk.storageEggs)}</span>
      <DeltaChip cur={bk.hatchingEggsWeek} prev={prev.hatchingEggs} />
    </div>
  ),
},
    {
      Ic: Trash2,
      label: `Farm Rejected Eggs (${periodLabel})`,
      color: C.orange,
      value: fmtN(bk.farmRejectedEggs),
      subNode: (
        <span style={{ fontSize: 10, color: C.textMd }}>
          {anyFilter
            ? `${periodLabel} · Avg Rate: ${bk.avgEggProductionRate}%`
            : `Cumulative · Avg Rate: ${bk.avgEggProductionRate}%`}
        </span>
      ),
    },
    {
  Ic: CheckCircle2,
  label: `Good Chicks / DOC (${periodLabel})`,
  color: C.green,
  value: fmtN(bk.goodChicksWeek),
  subNode: (
    <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap"}}>
      {bk.goodChicksWeekTarget > 0
        ? <VsBadge current={bk.goodChicksWeek}
            target={period==="month" ? bk.goodChicksMonthTarget : bk.goodChicksWeekTarget} />
        : <span style={{fontSize:10,color:C.textMd}}>DOC: {fmtN(bk.docAvailable)}</span>}
      <DeltaChip cur={bk.goodChicksWeek} prev={prev.goodChicks} />
    </div>
  ),
},
    {
  Ic: ShoppingCart,
  label: `Confirmed Orders (${periodLabel})`,
  color: C.blue,
      value: fmtN(data?.sales?.c4uConfirmedWeek || 0),

  subNode: (
    <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap"}}>
      <span style={{fontSize:10,color:C.textMd}}>
        C4U: {fmtK(data?.sales?.c4uConfirmedWeek||0)}
      </span>
      <DeltaChip cur={bk.confirmedOrdersWeek} prev={prev.confirmedOrders} />
    </div>
  ),
},
    {
      Ic: Clock,
      label: `Pending Orders (${periodLabel})`,
      color: C.amber,
      value: fmtN(data?.sales?.c4uPendingWeek || 0),

      subNode: (
        <span style={{ fontSize: 10, color: C.textMd }}>
          C4U: {fmtK(data?.sales?.c4uPendingWeek || 0)}
        </span>
      ),
    },
    {
  Ic: Gauge,
  label: `Hatchability % (${periodLabel})`,
  color: C.green,
  value: `${bk.hatchabilityWeek||0}%`,
  isHatchability: true,
  subNode: (
    <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap"}}>
      <span style={{fontSize:10,
        color:bk.hatchabilityWeek>=(bk.hatchabilityTarget||85)?C.green:C.red}}>
        Target: {bk.hatchabilityTarget||85}% · Mo: {bk.hatchabilityMonth}%
      </span>
      <DeltaChip cur={bk.hatchabilityWeek} prev={prev.hatchability} />
    </div>
  ),
},
    {
      Ic: Skull,
      label: `Mortality % (${periodLabel})`,
      color: C.red,
      value: `${bk.mortalityPct || 0}%`,
      sub: bk.isFarmFiltered ? selectedFarm : bk.isBreedFiltered ? selectedBreed : bk.worstFarm,
    },
    {
      Ic: Banknote,
      label: `Cost / Feed kg (${periodLabel})`,
      color: C.amber,
      value: bk.costPerFeedKg > 0 ? `GHC${bk.costPerFeedKg}` : "—",
      subNode: bk.feedCostKgTarget > 0
        ? <span style={{ fontSize: 10, color: C.textMd }}>Target: GHC{bk.feedCostKgTarget}</span>
        : <span style={{ fontSize: 10, color: C.textMd }}>Egg cost: GHC{bk.costPerHatchingEgg || 0}</span>,
    },
    {
      Ic: Banknote,
      label: `Total Expense / ${periodLabel}`,
      color: C.red,
      value: fmtCur(
        period === "year" ? data?.finance?.totalExpenseYear :
          period === "month" ? data?.finance?.totalExpenseMonth :
            data?.finance?.totalExpenseWeek
      ),
      sub: `Feed + OpEx + Dept workers`,
      // subNode: (
      //   <span style={{ fontSize: 10, color: C.textMd }}>
      //     Feed: {fmtCur(
      //       period === "year" ? data?.feedDeliveries?.costYear :
      //         period === "month" ? data?.feedDeliveries?.costMonth :
      //           data?.feedDeliveries?.costWeek
      //     )} · Dept: {fmtCur(
      //       period === "year" ? data?.deptExpenses?.total?.year :
      //         period === "month" ? data?.deptExpenses?.total?.month :
      //           data?.deptExpenses?.total?.week
      //     )}
      //   </span>
      // ),
    },
        {
      Ic: Layers,
      label: `Hatch Forecast — Eggs Due (${periodLabel})`,
      color: C.purple,
      value: bk.hatchForecastWeek > 0 ? fmtN(bk.hatchForecastWeek) : "—",
      subNode: (
        <span style={{ fontSize: 10, color: C.textMd }}>
          {bk.hatchForecastWeek > 0
            ? `Based on scheduled hatch dates · Mo: ${fmtK(bk.hatchForecastMonth)}`
            : "No batches scheduled this period"}
        </span>
      ),
    },
    // {
    //   Ic: Layers,
    //   label: `Hatch Forecast / Eggs Set (${periodLabel})`,
    //   color: C.purple,
    //   value: bk.hatchForecastWeek > 0 ? fmtN(bk.hatchForecastWeek) : "—",
    //   sub: bk.hatchForecastMonth > 0 ? `Month: ${fmtK(bk.hatchForecastMonth)}` : "Eggs set in hatchery",
    // },
    // ── Cost / Hatching Egg card ──
{
  Ic: Egg,
  label: `Cost / Hatching Egg (${periodLabel})`,
  color: C.orange,
  value: bk.costPerHatchingEgg > 0 ? `GHC${fmtN(bk.costPerHatchingEgg)}` : "—",
  sub: `Breeder farm total ÷ hatchable eggs`,
  // subNode: (
  //   <span style={{ fontSize: 10, color: C.textMd }}>
  //     {`(Feed ops + Breeder GHC${fmtK(data?.deptExpenses?.breederFarm?.[period] ?? 0)} + OpEx) ÷ ${fmtN(bk.hatchableForPeriod)} eggs`}
  //   </span>
  // ),
},

// ── Selling Px / Hatching Egg card ──
{
  Ic: Tag,
  label: `Selling Px / Hatching Egg (${periodLabel})`,
  color: C.cyan,
  value: bk.sellingPxHatchingEgg > 0 ? `GHC${fmtN(bk.sellingPxHatchingEgg, 2)}` : "—",
  sub: `Margin: ${bk.hatchingEggMarginPct || 66}%`,

  // subNode: (
  //   <span style={{ fontSize: 10, color: C.textMd }}>
  //     {`GHC${bk.costPerHatchingEgg} × ${(1 + (bk.hatchingEggMarginPct || 66) / 100).toFixed(2)} · Profit: GHC${(bk.sellingPxHatchingEgg - bk.costPerHatchingEgg).toFixed(2)}`}
  //   </span>
  // ),
},

// ── Cost / Chick DOC card ──
{
  Ic: DollarSign,
  label: `Cost / Chick DOC (${periodLabel})`,
  color: C.orange,
  value: bk.costPerChick > 0 ? `GHC${fmtN(bk.costPerChick)}` : "—",
  subNode: (
  <div style={{display:"flex",gap:5,alignItems:"center"}}>
    <span style={{fontSize:10,color:C.textMd}}>Margin: {bk.chickSellingMarginPct||40}%</span>
    {bk.costPerChickLastWeek > 0 && <Delta value={bk.costPerChick} prev={bk.costPerChickLastWeek} />}
  </div>
),
  // subNode: (
  //   <span style={{ fontSize: 10, color: C.textMd, display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
  //     {`(GHC${fmtN(bk.sellingPxHatchingEgg, 2)}/egg × ${fmtN(bk.hatchingEggsWeek)} eggs + Hatchery GHC${fmtK(data?.deptExpenses?.hatchery?.[period] ?? 0)}) ÷ ${fmtN(bk.goodChicksForPeriod)} chicks`}
  //     {bk.costPerChickLastWeek > 0 && <Delta value={bk.costPerChick} prev={bk.costPerChickLastWeek} />}
  //   </span>
  // ),
},

// ── Chick Selling Px card ──
{
  Ic: Tag,
  label: `Chick Selling Px (${periodLabel})`,
  color: C.green,
  value: bk.chickSellingPx > 0 ? `GHC${fmtN(bk.chickSellingPx)}` : "—",
  sub: `Profit: GHC${fmtN(bk.chickSellingPx - bk.costPerChick)} / chick`,

  // subNode: (
  //   <span style={{ fontSize: 10, color: C.textMd }}>
  //     {`GHC${bk.costPerChick} × ${(1 + (bk.chickSellingMarginPct || 40) / 100).toFixed(2)} · Profit: GHC${fmtN(bk.chickSellingPx - bk.costPerChick)}/chick`}
  //   </span>
  // ),
},
    // ── Cost / Hatching Egg ──
    {
      Ic: AlertTriangle,
      label: "Critical Issues",
      color: bk.criticalIssues > 0 ? C.red : C.green,
      value: bk.criticalIssues || 0,
      sub: bk.criticalIssues > 0 ? "Immediate attention" : "All clear",
      pulse: bk.criticalIssues > 0,
    },
  ];


  return (
    <Panel delay={0}>
      {/* ── Header row ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: C.blue + "18",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BarChart2 size={18} color={C.blue} strokeWidth={2} />
          </div>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: C.text }}>
              Production Control Center
            </h2>
            <p style={{ fontSize: 11, color: C.textMd, marginTop: 2 }}>
              Live KPI Strip — CEO first-screen view
            </p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {/* Farm dropdown */}
          {data?.allFarms && data.allFarms.length > 1 && (
            <BreedDropdown
              breeds={data.allFarms}
              selected={selectedFarm}
              onChange={onFarmChange}
            />
          )}
          {/* Breed dropdown */}
          {data?.allBreeds && data.allBreeds.length > 1 && (
            <BreedDropdown
              breeds={data.allBreeds}
              selected={selectedBreed}
              onChange={onBreedChange}
            />
          )}
          {/* Period toggle */}
          <div style={{ display: "flex", gap: 5 }}>
            {["week", "month", "year"].map((p) => (
              <button
                key={p}
                className={`tab-btn${period === p ? " active" : ""}`}
                onClick={() => setPeriod(p)}
                style={{
                  padding: "5px 13px",
                  borderRadius: 20,
                  border: `1px solid ${C.border}`,
                  background: "transparent",
                  color: C.textMd,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'Sora',sans-serif",
                  textTransform: "capitalize",
                }}
              >
                {p}
              </button>
            ))}
          </div>
          {prevPeriod && (
  <div style={{
    display:"flex", alignItems:"center", gap:6,
    padding:"5px 12px", borderRadius:8,
    background: C.surf2, border:`1px solid ${C.border}`,
    marginBottom:10, flexWrap:"wrap",
  }}>
    <TrendingUp size={11} color={C.textSf} />
    <span style={{fontSize:10, color:C.textSf}}>
      Δ chips compare against:{" "}
      <strong style={{color:C.textMd}}>
        {period==="year"  ? prevPeriod.yearLabel  :
         period==="month" ? prevPeriod.monthLabel :
                            prevPeriod.weekLabel}
      </strong>
    </span>
  </div>
)}
        </div>
      </div>

      {/* ── Active filter banner ── */}
      {anyFilter && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 14px",
            borderRadius: 10,
            background: C.blueLt,
            border: `1px solid ${C.blue}33`,
            marginBottom: 14,
          }}
        >
          <Filter size={12} color={C.blue} />
          <span style={{ fontSize: 11, color: C.blue, fontWeight: 600 }}>
            Filtering:{" "}
            {selectedFarm !== "All Farms" ? `Farm — ${selectedFarm}` : ""}
            {selectedFarm !== "All Farms" && selectedBreed !== "All Breeds"
              ? " · "
              : ""}
            {selectedBreed !== "All Breeds" ? `Breed — ${selectedBreed}` : ""}
          </span>
          <button
            onClick={() => {
              onBreedChange("All Breeds");
              onFarmChange("All Farms");
            }}
            style={{
              marginLeft: "auto",
              fontSize: 10,
              color: C.textMd,
              background: "none",
              border: `1px solid ${C.borderMd}`,
              borderRadius: 6,
              padding: "2px 8px",
              cursor: "pointer",
              fontFamily: "'Sora',sans-serif",
            }}
          >
            ✕ Clear all
          </button>
        </div>
      )}

      {/* ── KPI cards grid ── */}
      <div
        className="kpi-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))",
          gap: 12,
        }}
      >
        {kpis.map((item, i) => (
          <div
            key={item.label}
            className="kpi-card"
            style={{
              background: C.surf2,
              border: `1px solid ${item.pulse ? C.red + "55" : C.border}`,
              borderRadius: 12,
              padding: "14px 14px",
              borderTop: `3px solid ${item.color}`,
              animationDelay: `${i * 40}ms`,
              boxShadow: item.pulse
                ? `0 0 18px rgba(239,68,68,0.22)`
                : undefined,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: item.color + "18",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <item.Ic size={14} color={item.color} strokeWidth={2} />
              </div>
              <span
                style={{
                  fontSize: 9,
                  color: C.textSf,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: ".07em",
                  textAlign: "right",
                  lineHeight: 1.3,
                }}
              >
                {item.label}
              </span>
            </div>
            {loading ? (
              <Sk h={28} />
            ) : (
              <p
                className="num-rise"
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: item.color,
                  fontFamily: C.mono,
                  letterSpacing: "-.5px",
                  animationDelay: `${i * 40 + 100}ms`,
                }}
              >
                {item.value}
              </p>
            )}
            <div
              style={{
                marginTop: 6,
                fontSize: 10,
                color: item.subColor || C.textMd,
              }}
            >
              {loading ? <Sk h={12} w="70%" /> : item.subNode || item.sub}
            </div>
                {item.isHatchability && (
      <button
        onClick={() => setShowHatchModal(true)}
        style={{
          position: "relative", top: 8, right: 8,
          fontSize: 9, fontWeight: 700, color: C.blue,
          background: C.blueLt, border: `1px solid ${C.blue}33`,
          borderRadius: 6, padding: "2px 7px", cursor: "pointer",
          fontFamily: "'Sora',sans-serif",
        }}
      >
        More →
      </button>
    )}
          </div>
        ))}
      </div>

      {/* ── Breed+Farm-specific extras (only when filtered) ── */}
      {anyFilter && !loading && (
        <div
          style={{
            marginTop: 16,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
            gap: 10,
          }}
        >
          {[
            {
              label: "Storage Eggs Available",
              value: fmtN(bk.storageEggs),
              color: C.purple,
              sub: "From Storage Details",
            },
            {
              label: "DOC Available",
              value: fmtN(bk.docAvailable),
              color: C.green,
              sub: "Day Old Chicks",
            },
            {
              label: `Eggs Set (${periodLabel})`,
              value: fmtN(bk.eggsSetWeek),
              color: C.amber,
              sub: `Month: ${fmtN(bk.eggsSetMonth)}`,
            },
            {
              label: "Female Mortality",
              value: fmtN(bk.mortalityFemale),
              color: C.red,
              sub: `Male: ${fmtN(bk.mortalityMale)}`,
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: item.color + "0D",
                border: `1px solid ${item.color}25`,
                borderRadius: 10,
                padding: "12px 14px",
              }}
            >
              <p
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: item.color,
                  textTransform: "uppercase",
                  letterSpacing: ".07em",
                  marginBottom: 5,
                }}
              >
                {item.label}
              </p>
              <p
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: item.color,
                  fontFamily: C.mono,
                }}
              >
                {item.value}
              </p>
              <p style={{ fontSize: 10, color: C.textMd, marginTop: 4 }}>
                {item.sub}
              </p>
            </div>
          ))}
        </div>
      )}
            {showHatchModal && (
        <HatchabilityDetailModal data={data} onClose={() => setShowHatchModal(false)} />
      )}
    </Panel>
  );
}

/* ══════════════════════════════════════════════════
   SECTION: HATCHERY
══════════════════════════════════════════════════ */
function HatcherySection({ data, loading, selectedBreed, prevPeriod }) {

  const isFiltered = selectedBreed !== "All Breeds";
  const hD = isFiltered
    ? data?.breedHatchData?.[selectedBreed] || emptyBreedHatch()
    : null;
  const h = data?.hatchery || {};

  const prevWk = getPrev(prevPeriod, "week");
  const prevMo = getPrev(prevPeriod, "month");


  const eggsSetWeek = isFiltered ? hD.eggsSetWeek : h.eggsSetWeek;
  const eggsSetMonth = isFiltered ? hD.eggsSetMonth : h.eggsSetMonth;
  const goodChicksWk = isFiltered ? hD.goodChicksWeek : h.goodChicks;
  const goodChicksMo = isFiltered ? hD.goodChicksMonth : h.goodChicksMonth;
  // remove the local recompute, just do:
const hatchabilityWk = isFiltered
  ? (eggsSetWeek > 0
      ? parseFloat(((goodChicksWk / eggsSetWeek) * 100).toFixed(1))
      : 0)   // breed-filtered case has no per-batch breed match, so this is the best approximation
  : h.hatchabilityWeek;   // unfiltered: always use the true batch-matched value
  // const hatchabilityWk =
  //   eggsSetWeek > 0
  //     ? parseFloat(((goodChicksWk / eggsSetWeek) * 100).toFixed(1))
  //     : h.hatchabilityWeek;
  // const hatchabilityMo =
  //   eggsSetMonth > 0
  //     ? parseFloat(((goodChicksMo / eggsSetMonth) * 100).toFixed(1))
  //     : h.hatchabilityMonth;
  // remove the local recompute, just do:
  const poorChicks = isFiltered ? hD.poorChicks : h.poorChicks;
  const fertileEggs = isFiltered
    ? hD.fertileEggs
    : (h.fertilityRate * eggsSetMonth) / 100;

  return (
    <Panel delay={80}>
      <SecHeader
        Ic={Egg}
        title="Hatchery Performance"
        subtitle={
          isFiltered
            ? `Filtered by breed: ${selectedBreed}`
            : "Eggs-to-chicks pipeline metrics"
        }
        iconColor={C.amber}
      />
      <div
        className="mini-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <Mini label="Eggs Set (Week)" value={fmtN(eggsSetWeek)} color={C.amber} loading={loading}
  subNode={
    <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
      {data?.kpi?.eggsSetWeekTarget > 0 &&
        <VsBadge current={eggsSetWeek} target={data.kpi.eggsSetWeekTarget} />}
      <DeltaChip cur={eggsSetWeek} prev={prevWk.eggsSet} />
    </div>
  }
/>
<Mini label="Eggs Set (Month)" value={fmtN(eggsSetMonth)} color={C.amber} loading={loading}
  subNode={
    <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
      {data?.kpi?.eggsSetMonthTarget > 0 &&
        <VsBadge current={eggsSetMonth} target={data.kpi.eggsSetMonthTarget} />}
      <DeltaChip cur={eggsSetMonth} prev={prevMo.eggsSet} />
    </div>
  }
/>
<Mini label="Hatch Due (Week)" value={fmtN(goodChicksWk)} color={C.blue} loading={loading}
  subNode={<DeltaChip cur={goodChicksWk} prev={prevWk.goodChicks} />}
/>
<Mini label="Hatch Due (Month)" value={fmtN(goodChicksMo)} color={C.blue} loading={loading}
  subNode={<DeltaChip cur={goodChicksMo} prev={prevMo.goodChicks} />}
/>
        <Mini
  label="Hatchability % (Wk)"
  value={`${hatchabilityWk || 0}%`}
  color={C.green}
  loading={loading}
  subNode={
    <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
      <span style={{fontSize:10,
        color:hatchabilityWk>=(data?.kpi?.hatchabilityTarget||85)?C.green:C.red}}>
        Target: {data?.kpi?.hatchabilityTarget||85}%
      </span>
      <DeltaChip cur={hatchabilityWk} prev={prevWk.hatchability} />
    </div>
  }
/>
        <Mini
          label="Fertility %"
          value={`${h.fertilityRate || 0}%`}
          color={C.cyan}
          loading={loading}
          subNode={
            <span
              style={{
                fontSize: 10,
                color:
                  h.fertilityRate >= (data?.kpi?.fertilityTarget || 90)
                    ? C.green
                    : C.amber,
              }}
            >
              Target: {data?.kpi?.fertilityTarget || 90}%
            </span>
          }
        />
      </div>
      {!loading && (h.weeklyTrend || []).every((w) => w.set === 0) ? (
        <div
          style={{
            textAlign: "center",
            padding: "24px",
            color: C.textSf,
            fontSize: 12,
          }}
        >
          <Egg size={28} color={C.textSf} style={{ marginBottom: 8 }} />
          <p>No hatchery batch data for current month</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <BarChart
            data={h.weeklyTrend || []}
            margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
            barCategoryGap="22%"
          >
            <XAxis
              dataKey="w"
              tick={{ fontSize: 10, fill: C.textSf, fontFamily: "'Sora'" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: C.textSf }}
              axisLine={false}
              tickLine={false}
              width={40}
              tickFormatter={fmtK}
            />
            <Tooltip
              content={<Tip />}
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
            />
            <Bar
              dataKey="set"
              name="Eggs Set"
              fill={C.amber}
              radius={[4, 4, 0, 0]}
              fillOpacity={0.85}
            />
            <Bar
              dataKey="fertile"
              name="Fertile"
              fill={C.cyan}
              radius={[4, 4, 0, 0]}
              fillOpacity={0.85}
            />
            <Bar
              dataKey="hatched"
              name="Hatched"
              fill={C.green}
              radius={[4, 4, 0, 0]}
              fillOpacity={0.85}
            />
            <Legend wrapperStyle={{ fontSize: 10, color: C.textMd }} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Panel>
  );
}

/* ══════════════════════════════════════════════════
   SECTION: FEED MILL
══════════════════════════════════════════════════ */
function FeedMillSection({ data, loading }) {
  const f = data?.feedmill || {};
  const fd = data?.feedDeliveries || {};

  const isTargetSet = fd.setSource === "Target Config";
  const hasComparison = fd.setPrice > 0 && fd.consumedKgWeek > 0;

  return (
    <Panel delay={130}>
      <SecHeader
        Ic={Wheat}
        title="Feed Mill Operations"
        subtitle="Production, issuance & efficiency from daily ops records"
        iconColor={C.amber}
      />
      <div
        className="mini-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <Mini label="Produced (MT/Month)" value={`${fmtN(f.producedMT, 1)} MT`} color={C.amber} loading={loading} />
        <Mini label="Produced (MT/Day)" value={`${fmtN(f.producedDay, 1)} MT`} color={C.amber} loading={loading} />
        <Mini label="Issued (Week)" value={`${fmtN(f.issuedWeek, 1)} MT`} color={C.blue} loading={loading} />
        <Mini label="Issued (Month)" value={`${fmtN(f.issuedMonth, 1)} MT`} color={C.blue} loading={loading} />
        <Mini label="Prod vs Demand" value={`${f.productionVsDemand || 0}%`} color={f.productionVsDemand >= 95 ? C.green : C.amber} loading={loading} />
        <Mini label="Raw Material Eff." value={f.rawMaterialEff ? `${f.rawMaterialEff}%` : "—"} color={C.cyan} loading={loading} />
        <Mini label="Machine Uptime" value={f.machineUptime ? `${f.machineUptime}%` : "—"} color={f.machineUptime >= 90 ? C.green : C.red} loading={loading} />
      </div>

      {/* ── Client Request: Feed Cost Comparison Panel ── */}
      {!loading && (
        <div style={{
          marginBottom: 20,
          background: C.surf2,
          border: `1px solid ${C.borderMd}`,
          borderRadius: 14,
          overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{
            padding: "12px 16px",
            background: `linear-gradient(135deg, ${C.amber}14, ${C.orange}0A)`,
            borderBottom: `1px solid ${C.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 8,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Wheat size={14} color={C.amber} />
              <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>
                Feed Cost: Consumed vs Actual Delivery
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 9, color: C.textSf }}>Set Price Source:</span>
              <span style={{
                fontSize: 9, fontWeight: 700, padding: "2px 8px",
                borderRadius: 8,
                background: isTargetSet ? C.greenLt : C.amberLt,
                color: isTargetSet ? C.green : C.amber,
              }}>
                {fd.setSource || "Auto"}
              </span>
              <span style={{
                fontSize: 13, fontWeight: 800, color: C.amber, fontFamily: C.mono,
              }}>
                GHC {fd.setPrice || 0} / kg
              </span>
            </div>
          </div>

          {/* Comparison rows */}
          <div style={{ padding: "14px 16px" }}>
            {/* Column headers */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "140px 1fr 1fr 1fr 1fr",
              gap: 8,
              marginBottom: 8,
              paddingBottom: 8,
              borderBottom: `1px solid ${C.border}`,
            }}>
              {["", "Consumed kg", "Consumed Cost\n(kg × set price)", "Actual Delivery\n(invoiced)", "Variance\n(Actual − Standard)"].map((h, i) => (
                <div key={i} style={{
                  fontSize: 9, fontWeight: 700, color: C.textSf,
                  textTransform: "uppercase", letterSpacing: ".06em",
                  textAlign: i > 0 ? "right" : "left",
                  whiteSpace: "pre-line", lineHeight: 1.3,
                }}>
                  {h}
                </div>
              ))}
            </div>

            {/* Data rows */}
            {[
              {
                label: "This Week",
                consumedKg: fd.consumedKgWeek,
                consumedCost: fd.consumedCostWeek,
                actualCost: fd.costWeek,
                variance: fd.varianceWeek,
              },
              {
                label: "This Month",
                consumedKg: fd.consumedKgMonth,
                consumedCost: fd.consumedCostMonth,
                actualCost: fd.costMonth,
                variance: fd.varianceMonth,
              },
              {
                label: "This Year",
                consumedKg: fd.consumedKgYear,
                consumedCost: fd.consumedCostYear,
                actualCost: fd.costYear,
                variance: fd.varianceYear,
              },
            ].map(({ label, consumedKg, consumedCost, actualCost, variance }, i) => {
              const varColor = variance > 0 ? C.red : variance < 0 ? C.green : C.textMd;
              const varLabel = variance > 0 ? "Over" : variance < 0 ? "Under" : "On target";
              return (
                <div key={label} style={{
                  display: "grid",
                  gridTemplateColumns: "140px 1fr 1fr 1fr 1fr",
                  gap: 8,
                  padding: "10px 0",
                  borderBottom: i < 2 ? `1px solid ${C.border}` : "none",
                  alignItems: "center",
                }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.text }}>{label}</span>

                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: C.cyan, fontFamily: C.mono }}>
                      {fmtN(consumedKg)} kg
                    </p>
                    <p style={{ fontSize: 9, color: C.textSf }}>from daily ops</p>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: C.amber, fontFamily: C.mono }}>
                      {fmtCur(consumedCost)}
                    </p>
                    <p style={{ fontSize: 9, color: C.textSf }}>standard cost</p>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: C.orange, fontFamily: C.mono }}>
                      {actualCost > 0 ? fmtCur(actualCost) : "—"}
                    </p>
                    <p style={{ fontSize: 9, color: C.textSf }}>actual invoiced</p>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: varColor, fontFamily: C.mono }}>
                      {actualCost > 0 && consumedCost > 0
                        ? `${variance > 0 ? "+" : ""}${fmtCur(variance)}`
                        : "—"}
                    </p>
                    <p style={{ fontSize: 9, color: varColor, fontWeight: 600 }}>{varLabel}</p>
                  </div>
                </div>
              );
            })}

            {/* Cost per kg comparison footer */}
            <div style={{
              marginTop: 12,
              padding: "10px 14px",
              borderRadius: 10,
              background: C.surf3,
              display: "flex",
              alignItems: "center",
              gap: 20,
              flexWrap: "wrap",
            }}>
              <div>
                <p style={{ fontSize: 9, color: C.textSf, textTransform: "uppercase", letterSpacing: ".06em" }}>Set Price / kg</p>
                <p style={{ fontSize: 16, fontWeight: 800, color: C.amber, fontFamily: C.mono }}>GHC {fd.setPrice || 0}</p>
              </div>
              <div style={{ width: 1, height: 36, background: C.border }} />
              <div>
                <p style={{ fontSize: 9, color: C.textSf, textTransform: "uppercase", letterSpacing: ".06em" }}>Actual Delivery / kg</p>
                <p style={{ fontSize: 16, fontWeight: 800, color: C.orange, fontFamily: C.mono }}>
                  GHC {fd.costPerKg || "—"}
                </p>
              </div>
              <div style={{ width: 1, height: 36, background: C.border }} />
              <div>
                <p style={{ fontSize: 9, color: C.textSf, textTransform: "uppercase", letterSpacing: ".06em" }}>Price Variance / kg</p>
                <p style={{
                  fontSize: 16, fontWeight: 800, fontFamily: C.mono,
                  color: (fd.costPerKg - fd.setPrice) > 0 ? C.red : C.green
                }}>
                  {fd.costPerKg && fd.setPrice
                    ? `${(fd.costPerKg - fd.setPrice) > 0 ? "+" : ""}GHC ${(fd.costPerKg - fd.setPrice).toFixed(2)}`
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* existing trend chart below */}
      {!loading && (f.trend || []).length === 0 ? (
        <div style={{ textAlign: "center", padding: "24px", color: C.textSf, fontSize: 12 }}>
          <Wheat size={28} color={C.textSf} style={{ marginBottom: 8 }} />
          <p>No feed data found for current month</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={f.trend || []} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gP" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.amber} stopOpacity={0.3} />
                <stop offset="95%" stopColor={C.amber} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gI" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.blue} stopOpacity={0.3} />
                <stop offset="95%" stopColor={C.blue} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="d" tick={{ fontSize: 10, fill: C.textSf, fontFamily: "'Sora'" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: C.textSf }} axisLine={false} tickLine={false} width={28} />
            <Tooltip content={<Tip />} cursor={{ stroke: C.borderMd }} />
            <Area type="monotone" dataKey="prod" name="Produced" stroke={C.amber} fill="url(#gP)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="issued" name="Issued" stroke={C.blue} fill="url(#gI)" strokeWidth={2} dot={false} />
            <Legend wrapperStyle={{ fontSize: 10, color: C.textMd }} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </Panel>
  );
}

/* ══════════════════════════════════════════════════
   SECTION: SALES
══════════════════════════════════════════════════ */
function SalesSection({ data, loading }) {
  const s = data?.sales || {};
  const [showAll, setShowAll] = useState(false);
  const [regionTab, setRegionTab] = useState("combined"); // "combined" | "poultry" | "c4u"
  const displayed = showAll ? s.top20 : (s.top20 || []).slice(0, 8);

  const regionData = {
    combined: s.combinedRegionalDemand || [],
    poultry: s.regionalDemand || [],
    c4u: s.c4uRegionalDemand || [],
  }[regionTab];

  return (
    <Panel delay={180}>
      <SecHeader
        Ic={TrendingUp}
        title="Sales & Demand — Poultry + Chicken4U"
        subtitle="Sales_Order_Report & Field_Visit_Sales_Order_Report combined"
        iconColor={C.green}
      />


      {/* ── Row 2: Chicken4U Field Visit Orders ── */}
      <div style={{ marginBottom: 6 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 2,
              background: C.amber,
            }}
          />
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: C.textMd,
              textTransform: "uppercase",
              letterSpacing: ".06em",
            }}
          >
            Chicken4U Field Visit Orders
          </p>
          <span
            style={{
              fontSize: 9,
              background: C.amberLt,
              color: C.amber,
              padding: "2px 7px",
              borderRadius: 8,
              fontWeight: 700,
            }}
          >
            Field_Visit_Sales_Order_Report
          </span>
        </div>
        <div
          className="mini-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))",
            gap: 9,
            marginBottom: 14,
          }}
        >
          <Mini
            label="Confirmed Total"
            value={fmtN(s.c4uConfirmedOrders)}
            color={C.amber}
            loading={loading}
          />
          <Mini
            label="Confirmed (Wk)"
            value={fmtN(s.c4uConfirmedWeek)}
            color={C.amber}
            loading={loading}
          />
          <Mini
            label="Confirmed (Mo)"
            value={fmtN(s.c4uConfirmedMonth)}
            color={C.amber}
            loading={loading}
          />
          <Mini
            label="Pending Total"
            value={fmtN(s.c4uPendingOrdersCount)}
            color={C.orange}
            loading={loading}
          />
          <Mini
            label="Pending (Wk)"
            value={fmtN(s.c4uPendingWeek)}
            color={C.orange}
            loading={loading}
          />
          <Mini
            label="Pending (Mo)"
            value={fmtN(s.c4uPendingMonth)}
            color={C.orange}
            loading={loading}
          />
          <Mini
            label="Chicks Delivered"
            value={fmtN(data?.chicken4u?.sales?.chicksDelivered)}
            color={C.green}
            loading={loading}
          />
          <Mini
            label="Chicks Pending"
            value={fmtN(data?.chicken4u?.sales?.chicksPending)}
            color={C.red}
            loading={loading}
          />
        </div>
      </div>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: C.border, margin: "4px 0 16px" }} />


      {/* ── Charts row ── */}
      <div
        className="two-col"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}
      >
        {/* Regional demand with tab toggle */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
              flexWrap: "wrap",
              gap: 6,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <MapPin size={13} color={C.textSf} />
              <p style={{ fontSize: 11, fontWeight: 600, color: C.textMd }}>
                Regional Demand
              </p>
            </div>
            {/* Source toggle */}
            <div style={{ display: "flex", gap: 4 }}>
              {[
                { key: "c4u", label: "C4U" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setRegionTab(key)}
                  style={{
                    padding: "3px 9px",
                    borderRadius: 6,
                    cursor: "pointer",
                    border: `1px solid ${regionTab === key ? C.blue + "77" : C.border}`,
                    background: regionTab === key ? C.blueLt : "transparent",
                    color: regionTab === key ? C.blue : C.textSf,
                    fontSize: 10,
                    fontWeight: 600,
                    fontFamily: "'Sora',sans-serif",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {!loading && regionData.every((r) => r.orders === 0) ? (
            <div
              style={{
                textAlign: "center",
                padding: "32px 16px",
                color: C.textSf,
                fontSize: 12,
              }}
            >
              <MapPin size={24} color={C.textSf} style={{ marginBottom: 8 }} />
              <p>No regional data for this view</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={regionData}
                layout="vertical"
                margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
              >
                <XAxis
                  type="number"
                  tick={{ fontSize: 9, fill: C.textSf }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={fmtK}
                />
                <YAxis
                  dataKey="region"
                  type="category"
                  tick={{ fontSize: 9, fill: C.textSf, fontFamily: "'Sora'" }}
                  axisLine={false}
                  tickLine={false}
                  width={80}
                />
                <Tooltip
                  content={<Tip />}
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                />
                <Bar dataKey="orders" name="Orders" radius={[0, 6, 6, 0]}>
                  {regionData.map((e, i) => (
                    <Cell key={i} fill={e.color || C.blue} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top 20 customers */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              marginBottom: 10,
            }}
          >
            <Users size={13} color={C.textSf} />
            <p style={{ fontSize: 11, fontWeight: 600, color: C.textMd }}>
              Top {showAll ? 20 : 8} Customers
            </p>
          </div>
          <div style={{ maxHeight: 215, overflowY: "auto" }}>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <Sk key={i} h={28} style={{ marginBottom: 6 }} />
              ))
            ) : displayed?.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "32px 16px",
                  color: C.textSf,
                  fontSize: 12,
                }}
              >
                <Users size={24} color={C.textSf} style={{ marginBottom: 8 }} />
                <p>No customer data available</p>
              </div>
            ) : (
              displayed?.map((c, i) => (
                <div
                  key={c.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "6px 10px",
                    borderRadius: 8,
                    marginBottom: 4,
                    background: i % 2 === 0 ? C.surf2 : "transparent",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        color: C.textSf,
                        fontFamily: C.mono,
                        width: 20,
                      }}
                    >
                      #{i + 1}
                    </span>
                    <span style={{ fontSize: 11, color: C.text }}>
                      {c.name}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: C.blue,
                      fontFamily: C.mono,
                    }}
                  >
                    {fmtN(c.qty)}
                  </span>
                </div>
              ))
            )}
          </div>
          {(s.top20 || []).length > 8 && (
            <button
              onClick={() => setShowAll((v) => !v)}
              style={{
                marginTop: 8,
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "5px 14px",
                borderRadius: 20,
                border: `1px solid ${C.borderMd}`,
                background: "transparent",
                color: C.textMd,
                fontSize: 11,
                cursor: "pointer",
                fontFamily: "'Sora',sans-serif",
              }}
            >
              {showAll ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {showAll ? "Show Less" : "Show All 20"}
            </button>
          )}
        </div>
      </div>
    </Panel>
  );
}
/* ══════════════════════════════════════════════════
   SECTION: FINANCE
══════════════════════════════════════════════════ */
function FinanceSection({ data, loading, prevPeriod }) {

  const prevWk = getPrev(prevPeriod, "week");
  const prevMo = getPrev(prevPeriod, "month");

  const f = data?.finance || {};
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 400);
    return () => clearTimeout(t);
  }, []);
  return (
    <Panel delay={230}>
      <SecHeader
        Ic={Banknote}
        title="Financial Snapshot"
        subtitle="Cash · Margins · Budget vs Actual"
        iconColor={C.green}
      />
      <div
        className="mini-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <Mini label="Cash Received (Wk)" value={fmtCur(f.cashReceivedWeek)} color={C.green} loading={loading}
  subNode={<DeltaChip cur={f.cashReceivedWeek} prev={prevWk.cash} />} />
<Mini label="Cash Received (Mo)" value={fmtCur(f.cashReceivedMonth)} color={C.green} loading={loading}
  subNode={<DeltaChip cur={f.cashReceivedMonth} prev={prevMo.cash} />} />
        <Mini
          label="Receivables (Wk)"
          value={fmtCur(f.receivablesWeek)}
          color={C.amber}
          loading={loading}
        />
        <Mini
          label="Receivables (Mo)"
          value={fmtCur(f.receivablesMonth)}
          color={C.amber}
          loading={loading}
        />
        <Mini
          label="Payables Due (Wk)"
          value={fmtCur(f.payablesWeek)}
          color={C.red}
          loading={loading}
        />
        <Mini
          label="Payables Due (Mo)"
          value={fmtCur(f.payablesMonth)}
          color={C.red}
          loading={loading}
        />
        <Mini
          label="Gross Margin"
          value={`${f.grossMargin || 0}%`}
          color={f.grossMargin > 20 ? C.green : C.amber}
          loading={loading}
        />
        <Mini label="Sales Order Revenue (Week)"
  value={fmtCur((f.revenueWeek||0)+(f.c4uRevenueWeek||0))} color={C.green} loading={loading}
  sub="Confirmed Sales Orders + C4U"
  subNode={<DeltaChip cur={f.revenueWeek} prev={prevWk.revenue} />} />
<Mini label="Sales Order Revenue (Month)"
  value={fmtCur((f.revenueMonth||0)+(f.c4uRevenueMonth||0))} color={C.green} loading={loading}
  sub="Confirmed Sales Orders + C4U"
  subNode={<DeltaChip cur={f.revenueMonth} prev={prevMo.revenue} />} />
        <Mini label="Total Expenditure (Mo)" value={fmtCur(f.totalExpenseMonth)} color={C.red} loading={loading}
  subNode={<DeltaChip cur={f.totalExpenseMonth} prev={prevMo.expense} invert />} />

      </div>
      {/* Op Requests & Feed Delivery Expense */}
      {/* Expenditure Breakdown */}
      <div style={{ marginTop: 18 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: C.textMd, marginBottom: 10 }}>
          Expenditure Breakdown (This Month)
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))",
          gap: 10
        }}>
          {[
            { label: "Feed Deliveries", value: fmtCur(data?.feedDeliveries?.costMonth), color: C.amber },
            { label: "Operational Requests", value: fmtCur(data?.operationalRequests?.expenseMonth), color: C.orange },
            { label: "C4U Dept Workers", value: fmtCur(data?.deptExpenses?.chicken4u?.month), color: C.blue },
            { label: "Hatchery Dept Workers", value: fmtCur(data?.deptExpenses?.hatchery?.month), color: C.cyan },
            { label: "Breeder Farm Workers", value: fmtCur(data?.deptExpenses?.breederFarm?.month), color: C.green },
            { label: "Total Dept Workers", value: fmtCur(data?.deptExpenses?.total?.month), color: C.purple },
            { label: "GRAND TOTAL Expense", value: fmtCur(data?.finance?.totalExpenseMonth), color: C.red },
            { label: "Gross Margin %", value: `${data?.finance?.grossMargin < 0 ? 0 : data?.finance?.grossMargin || 0}%`, color: data?.finance?.grossMargin > 20 ? C.green : C.amber },
          ].map(({ label, value, color }) => (
            <Mini key={label} label={label} value={value} color={color} loading={loading} />
          ))}
        </div>
      </div>

      {/* Recent Op Requests Table */}
      {(data?.operationalRequests?.recent || []).length > 0 && (
        <div style={{ marginTop: 18, marginBottom: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: C.textMd, marginBottom: 10 }}>
            Recent Operational Requests
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {["Request ID", "Type", "Category", "Farm",
                    "Actual Cost", "Finance", "Payment", "Date"].map(h => (
                      <th key={h} style={{
                        padding: "6px 10px", textAlign: "left",
                        color: C.textSf, fontSize: 9, textTransform: "uppercase",
                        letterSpacing: ".05em", whiteSpace: "nowrap"
                      }}>{h}</th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {(data.operationalRequests.recent).map((req, i) => (
                  <tr key={i} style={{
                    borderBottom: `1px solid ${C.border}`,
                    background: i % 2 === 0 ? C.surf2 : "transparent"
                  }}>
                    <td style={{
                      padding: "6px 10px", color: C.blue,
                      fontFamily: C.mono, fontSize: 10
                    }}>{req.requestId}</td>
                    <td style={{ padding: "6px 10px", color: C.text }}>{req.requestType}</td>
                    <td style={{ padding: "6px 10px", color: C.textMd }}>{req.mainCategory}</td>
                    <td style={{ padding: "6px 10px", color: C.textMd }}>{req.farm}</td>
                    <td style={{
                      padding: "6px 10px", color: C.green,
                      fontFamily: C.mono, fontWeight: 700
                    }}>{fmtCur(req.actualCost)}</td>
                    <td style={{ padding: "6px 10px" }}>
                      <span style={{
                        fontSize: 9, padding: "2px 7px", borderRadius: 8,
                        background: req.financeStatus === "posted" ? C.greenLt : C.amberLt,
                        color: req.financeStatus === "posted" ? C.green : C.amber,
                        fontWeight: 700, textTransform: "capitalize"
                      }}>
                        {req.financeStatus || "pending"}
                      </span>
                    </td>
                    <td style={{ padding: "6px 10px" }}>
                      <span style={{
                        fontSize: 9, padding: "2px 7px", borderRadius: 8,
                        background: req.paymentStatus === "paid" ? C.greenLt : C.redLt,
                        color: req.paymentStatus === "paid" ? C.green : C.red,
                        fontWeight: 700, textTransform: "capitalize"
                      }}>
                        {req.paymentStatus || "unpaid"}
                      </span>
                    </td>
                    <td style={{
                      padding: "6px 10px", color: C.textSf, fontSize: 10,
                      whiteSpace: "nowrap"
                    }}>{req.date?.slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div
        className="two-col"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 24 }}
      >
        <div>
          <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            marginBottom: 10,
          }}
          >
          <Activity size={13} color={C.textSf} />
          <p style={{ fontSize: 11, fontWeight: 600, color: C.textMd }}>
            Gross Margin by Product
          </p>
        </div>
        {!loading && (f.margins || []).every((m) => m.margin === 0) ? (
          <div
            style={{
              textAlign: "center",
              padding: "32px 16px",
              color: C.textSf,
              fontSize: 12,
            }}
          >
            <BarChart2
              size={24}
              color={C.textSf}
              style={{ marginBottom: 8 }}
            />
            <p>No margin data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={170}>
            <BarChart
              data={f.margins || []}
              margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
            >
              <XAxis
                dataKey="product"
                tick={{ fontSize: 9, fill: C.textSf, fontFamily: "'Sora'" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 9, fill: C.textSf }}
                axisLine={false}
                tickLine={false}
                width={28}
                tickFormatter={(v) => v + "%"}
              />
              <Tooltip
                content={<Tip />}
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
              />
              <Bar dataKey="margin" name="Margin %" radius={[6, 6, 0, 0]}>
                {(f.margins || []).map((_, i) => (
                  <Cell
                    key={i}
                    fill={[C.green, C.blue, C.amber, C.purple][i % 4]}
                    fillOpacity={0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            marginBottom: 10,
          }}
        >
          <BarChart2 size={13} color={C.textSf} />
          <p style={{ fontSize: 11, fontWeight: 600, color: C.textMd }}>
            Income vs Expenditure
          </p>
        </div>
        <ResponsiveContainer width="100%" height={170}>
          <BarChart
            data={data?.incomeExpTrend || []}
            margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
            barCategoryGap="28%"
          >
            <XAxis
              dataKey="period"
              tick={{ fontSize: 9, fill: C.textSf, fontFamily: "'Sora'" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 9, fill: C.textSf }}
              axisLine={false}
              tickLine={false}
              width={40}
              tickFormatter={fmtK}
            />
            <Tooltip
              content={<Tip />}
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
            />
            <Bar
              dataKey="income"
              name="Income"
              fill={C.green}
              radius={[4, 4, 0, 0]}
              fillOpacity={0.85}
            />
            <Bar
              dataKey="expense"
              name="Expenditure"
              fill={C.red}
              radius={[4, 4, 0, 0]}
              fillOpacity={0.85}
            />
            <Legend wrapperStyle={{ fontSize: 10, color: C.textMd }} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
      {
    (data?.breedProfitMargins || []).length > 0 && (
      <div style={{ marginTop: 18 }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: C.textMd,
            marginBottom: 10,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <TrendingUp size={13} color={C.green} /> Breed Profit Margins (This
          Month)
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
            gap: 10,
          }}
        >
          {data.breedProfitMargins.map((b) => (
            <div
              key={b.breed}
              style={{
                background: C.surf2,
                border: `1px solid ${b.marginPct >= 0 ? C.green : C.red}22`,
                borderRadius: 10,
                padding: "12px 14px",
              }}
            >
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: C.textMd,
                  marginBottom: 6,
                }}
              >
                {b.breed}
              </p>
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: b.marginPct >= 0 ? C.green : C.red,
                  fontFamily: C.mono,
                }}
              >
                {b.marginPct < 0 ? 0 : b.marginPct}%
              </p>
              <div style={{ fontSize: 9, color: C.textSf, marginTop: 4 }}>
                <span>Rev: {fmtCur(b.revenue)}</span> ·{" "}
                <span>Cost: {fmtCur(b.feedCost)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
    </Panel >
  );
}

/* ══════════════════════════════════════════════════
   SECTION: INVENTORY  (+ Storage Details + DOC)
══════════════════════════════════════════════════ */
function InventorySection({ data, loading }) {
  const inv = data?.inventory || {};
  const [showProducts, setShowProducts] = useState(false);
  const [showStorage, setShowStorage] = useState(false);
  const sc = (s) =>
    s === "Critical" ? C.red : s === "Low" ? C.amber : C.green;
  const si = (s) =>
    s === "Critical" ? (
      <AlertTriangle size={14} color={C.red} />
    ) : (
      <AlertCircle size={14} color={C.amber} />
    );

  const storageEggsByBreed = data?.breedStorageEggs || {};
  const docByBreed = data?.breedDOC || {};
  const storageBreeds = Object.entries(storageEggsByBreed).sort(
    (a, b) => b[1] - a[1],
  );
  const docBreeds = Object.entries(docByBreed).sort((a, b) => b[1] - a[1]);

  return (
    <Panel delay={280}>
      <SecHeader
        Ic={Boxes}
        title="Inventory & Supply Chain"
        subtitle="Stock · Storage Eggs · Day Old Chicks"
        iconColor={C.purple}
      />
      <div
        className="mini-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <Mini
          label="Feed Stock (MT)"
          value={`${fmtN(inv.finishedFeedTons, 1)} MT`}
          color={inv.finishedFeedTons > 50 ? C.green : C.amber}
          loading={loading}
        />
        <Mini
          label="Vaccine Status"
          value={inv.vaccineStatus ?? "—"}
          color={sc(inv.vaccineStatus)}
          loading={loading}
        />
        <Mini
          label="Storage Eggs Total"
          value={fmtN(data?.kpi?.storageEggsAvailable)}
          color={C.purple}
          loading={loading}
        />
        <Mini
          label="DOC Total"
          value={fmtN(data?.kpi?.totalDOC)}
          color={C.green}
          loading={loading}
        />
        <Mini
          label="Pending POs"
          value={inv.pendingPOs ?? 0}
          color={C.blue}
          loading={loading}
        />
        <Mini
          label="Supplier Delays"
          value={inv.supplierDelays ?? 0}
          color={inv.supplierDelays > 0 ? C.red : C.green}
          loading={loading}
        />
      </div>

      {/* Storage eggs by breed */}
      {storageBreeds.length > 0 && (
        <>
          <button
            onClick={() => setShowStorage((v) => !v)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "7px 14px",
              borderRadius: 10,
              border: `1px solid ${C.purple}44`,
              background: C.purpleLt,
              color: C.purple,
              fontSize: 11,
              cursor: "pointer",
              fontFamily: "'Sora',sans-serif",
              width: "100%",
              justifyContent: "space-between",
              marginBottom: showStorage ? 12 : 8,
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Egg size={12} />
              Storage Eggs by Breed ({storageBreeds.length} breeds)
            </span>
            {showStorage ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          {showStorage && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))",
                gap: 8,
                marginBottom: 14,
              }}
            >
              {storageBreeds.map(([breed, eggs]) => (
                <div
                  key={breed}
                  style={{
                    background: C.purpleLt,
                    border: `1px solid ${C.purple}25`,
                    borderRadius: 9,
                    padding: "10px 14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <p style={{ fontSize: 10, color: C.textMd }}>{breed}</p>
                    <p style={{ fontSize: 9, color: C.textSf, marginTop: 2 }}>
                      Available Eggs
                    </p>
                  </div>
                  <p
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: C.purple,
                      fontFamily: C.mono,
                    }}
                  >
                    {fmtN(eggs)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* DOC by breed */}
      {docBreeds.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: C.textMd,
              marginBottom: 8,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Bird size={12} color={C.green} />
            Day Old Chicks (DOC) by Breed
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))",
              gap: 8,
            }}
          >
            {docBreeds.map(([breed, chicks]) => (
              <div
                key={breed}
                style={{
                  background: C.greenLt,
                  border: `1px solid ${C.green}25`,
                  borderRadius: 9,
                  padding: "10px 14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <p style={{ fontSize: 10, color: C.textMd }}>{breed}</p>
                  <p style={{ fontSize: 9, color: C.textSf, marginTop: 2 }}>
                    Available Chicks
                  </p>
                </div>
                <p
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: C.green,
                    fontFamily: C.mono,
                  }}
                >
                  {fmtN(chicks)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {(inv.criticalAlerts || []).length > 0 && (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              marginBottom: 10,
            }}
          >
            <Zap size={13} color={C.red} />
            <p style={{ fontSize: 11, fontWeight: 600, color: C.textMd }}>
              Low / Critical Stock Alerts
            </p>
          </div>
          {(inv.criticalAlerts || []).map((a, i) => (
            <div
              key={i}
              className="alert-row"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 14px",
                borderRadius: 10,
                marginBottom: 6,
                background: sc(a.status) + "10",
                border: `1px solid ${sc(a.status)}30`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {si(a.status)}
                <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>
                  {a.item}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Package size={12} color={sc(a.status)} />
                <span
                  style={{ fontSize: 11, color: sc(a.status), fontWeight: 700 }}
                >
                  Stock: {a.stock} unit(s)
                </span>
              </div>
            </div>
          ))}
        </>
      )}

      {(inv.productStockList || []).length > 0 && (
        <>
          <button
            onClick={() => setShowProducts((v) => !v)}
            style={{
              marginTop: 12,
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "7px 14px",
              borderRadius: 10,
              border: `1px solid ${C.borderMd}`,
              background: "transparent",
              color: C.textMd,
              fontSize: 11,
              cursor: "pointer",
              fontFamily: "'Sora',sans-serif",
              width: "100%",
              justifyContent: "center",
            }}
          >
            {showProducts ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {showProducts ? "Hide" : "Show"} All Product Stock (
            {(inv.productStockList || []).length} items)
          </button>
          {showProducts && (
            <div style={{ marginTop: 10, maxHeight: 240, overflowY: "auto" }}>
              {(inv.productStockList || []).map((p, i) => (
                <div
                  key={p.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "7px 12px",
                    borderRadius: 8,
                    marginBottom: 4,
                    background: i % 2 === 0 ? C.surf2 : "transparent",
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <span style={{ fontSize: 11, color: C.text, flex: 1 }}>
                    {p.name}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: 11, color: C.textSf }}>
                      Min: {p.min}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: p.stock <= p.min && p.min > 0 ? C.red : C.green,
                        fontFamily: C.mono,
                      }}
                    >
                      {fmtN(p.stock)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Panel>
  );
}

/* ══════════════════════════════════════════════════
   SECTION: ALERTS
══════════════════════════════════════════════════ */
function AlertsSection({ data, loading }) {
  const alerts = data?.alerts || [];
  const tc = (t) =>
    t === "critical" ? C.red : t === "warning" ? C.amber : C.blue;
  const crit = alerts.filter((a) => a.type === "critical").length;
  return (
    <Panel delay={330} glowRed={crit > 0}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 18,
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <SecHeader
          Ic={ShieldAlert}
          title="Operations Risk & Alerts"
          subtitle="Auto-derived from real data thresholds"
          iconColor={C.red}
        />
        {crit > 0 && (
          <span
            className="crit-badge"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              fontWeight: 700,
              padding: "5px 14px",
              borderRadius: 20,
              background: C.redLt,
              color: C.red,
              border: `1px solid ${C.red}44`,
            }}
          >
            <Flame size={12} color={C.red} />
            {crit} Critical Active
          </span>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {loading
          ? [...Array(3)].map((_, i) => <Sk key={i} h={56} />)
          : alerts.map((a, i) => (
            <div
              key={i}
              className={`alert-row${a.type === "critical" ? " alert-pulse" : ""}`}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: "12px 14px",
                borderRadius: 12,
                background: tc(a.type) + "0C",
                border: `1px solid ${tc(a.type)}28`,
                animationDelay: `${i * 60}ms`,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: tc(a.type) + "18",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <AlertIc iconKey={a.icon} alertType={a.type} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: C.text }}>
                  {a.title}
                </p>
                <p style={{ fontSize: 11, color: C.textMd, marginTop: 2 }}>
                  {a.detail}
                </p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <span
                  style={{
                    fontSize: 9.5,
                    fontWeight: 700,
                    padding: "3px 9px",
                    borderRadius: 12,
                    background: tc(a.type) + "20",
                    color: tc(a.type),
                    textTransform: "uppercase",
                    letterSpacing: ".06em",
                  }}
                >
                  {a.type}
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    marginTop: 5,
                    justifyContent: "flex-end",
                  }}
                >
                  <Clock size={10} color={C.textSf} />
                  <p style={{ fontSize: 10, color: C.textSf }}>{a.time}</p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </Panel>
  );
}

/* ══════════════════════════════════════════════════
   SECTION: CHICKEN4U
══════════════════════════════════════════════════ */
function C4uChickCard({ label, color, bg, total, breeds, loading }) {
  const breedArr = Object.entries(breeds || {});
  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${color}33`,
        borderRadius: 10,
        padding: "12px 14px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          marginBottom: 8,
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: color + "1A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Egg size={14} color={color} strokeWidth={2} />
        </div>
        <div>
          <p
            style={{
              fontSize: 9,
              fontWeight: 700,
              color,
              textTransform: "uppercase",
              letterSpacing: ".07em",
            }}
          >
            {label}
          </p>
          {loading ? (
            <Sk h={18} w={60} />
          ) : (
            <p
              style={{
                fontSize: 18,
                fontWeight: 700,
                color,
                fontFamily: C.mono,
                letterSpacing: "-.4px",
                lineHeight: 1.1,
              }}
            >
              {total}
            </p>
          )}
        </div>
      </div>
      {breedArr.map(([breed, qty]) => (
        <div
          key={breed}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "4px 8px",
            borderRadius: 6,
            background: color + "10",
            border: `1px solid ${color}20`,
            marginTop: 4,
          }}
        >
          <span
            style={{
              fontSize: 10,
              color: C.textMd,
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: color,
                display: "inline-block",
              }}
            />
            {breed || "—"}
          </span>
          {loading ? (
            <Sk h={12} w={36} />
          ) : (
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color,
                fontFamily: C.mono,
              }}
            >
              {fmtN(qty)}
            </span>
          )}
        </div>
      ))}
      {!loading && breedArr.length === 0 && (
        <p
          style={{
            fontSize: 10,
            color: C.textSf,
            marginTop: 6,
            textAlign: "center",
          }}
        >
          No breed data
        </p>
      )}
    </div>
  );
}

function C4uPendingCard({ label, orders, qty, list, color, loading }) {
  const [showList, setShowList] = useState(false);
  return (
    <div
      style={{
        background: C.surf2,
        border: `1px solid ${color}33`,
        borderRadius: 12,
        padding: "14px 16px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 10,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            background: color + "1A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CalendarDays size={15} color={color} strokeWidth={2} />
        </div>
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              color,
              textTransform: "uppercase",
              letterSpacing: ".07em",
            }}
          >
            {label}
          </p>
          {loading ? (
            <Sk h={20} w={80} />
          ) : (
            <p
              style={{
                fontSize: 20,
                fontWeight: 700,
                color,
                fontFamily: C.mono,
                lineHeight: 1.1,
              }}
            >
              {fmtN(orders)}{" "}
              <span
                style={{ fontSize: 11, fontWeight: 500, color: color + "99" }}
              >
                orders
              </span>
            </p>
          )}
        </div>
        {!loading && (
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 15, fontWeight: 700, color }}>{fmtN(qty)}</p>
            <p style={{ fontSize: 9.5, color: C.textSf }}>total qty</p>
          </div>
        )}
      </div>
      {!loading && list.length > 0 && (
        <button
          onClick={() => setShowList((v) => !v)}
          style={{
            width: "100%",
            padding: "6px",
            borderRadius: 8,
            border: `1px solid ${color}33`,
            background: color + "14",
            color,
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'Sora',sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
          }}
        >
          {showList ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          {showList ? "Hide" : "View"} {list.length} order
          {list.length !== 1 ? "s" : ""}
        </button>
      )}
      {showList && list.length > 0 && (
        <div style={{ marginTop: 8, maxHeight: 180, overflowY: "auto" }}>
          {list.map((o, idx) => (
            <div
              key={o.orderId}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 10px",
                borderRadius: 7,
                marginBottom: 3,
                background: idx % 2 === 0 ? C.surf3 : "transparent",
                border: `1px solid ${C.border}`,
              }}
            >
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, color: C.text }}>
                  {o.muoName || o.orderId}
                </p>
                {o.satoName && (
                  <p style={{ fontSize: 10, color: C.textSf }}>
                    SATO: {o.satoName}
                  </p>
                )}
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 10.5, fontWeight: 600, color }}>
                  {o.expectedDate}
                </p>
                <p
                  style={{
                    fontSize: 9.5,
                    color: C.textSf,
                    textTransform: "capitalize",
                  }}
                >
                  {o.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Chicken4USection({ data, loading }) {
  const c4u = data?.chicken4u || {};
  const muo = c4u.muo || {};
  const s = c4u.sales || {};
  const [activeTab, setActiveTab] = useState("ordered");
  const [showTopMuos, setShowTopMuos] = useState(false);
  const [showTopSatos, setShowTopSatos] = useState(false);
  const [showProducts, setShowProducts] = useState(false);

  const tabConfig = {
    ordered: {
      grangerBreeds: s.grangerBreeds,
      layerBreeds: s.layerBreeds,
      broilerBreeds: s.broilerBreeds,
      grangerTotal: s.grangers ?? 0,
      layerTotal: s.layers ?? 0,
      broilerTotal: s.broilers ?? 0,
    },
    delivered: {
      grangerBreeds: s.grangerBreedsDel,
      layerBreeds: s.layerBreedsDel,
      broilerBreeds: s.broilerBreedsDel,
      grangerTotal: s.grangersDelivered ?? 0,
      layerTotal: s.layersDelivered ?? 0,
      broilerTotal: s.broilersDelivered ?? 0,
    },
    pending: {
      grangerBreeds: s.grangerBreedsPend,
      layerBreeds: s.layerBreedsPend,
      broilerBreeds: s.broilerBreedsPend,
      grangerTotal: s.grangersPending ?? 0,
      layerTotal: s.layersPending ?? 0,
      broilerTotal: s.broilersPending ?? 0,
    },
  };
  const tab = tabConfig[activeTab];

  const CHICK_KW = [
    "GRANGER",
    "LAYER",
    "BROILER",
    "NOVOBROWN",
    "NOVOWHITE",
    "NOVO",
    "COCK",
    "PULLET",
  ];
  const nonChickProducts = Object.entries(s.allProducts || {}).filter(
    ([name]) => !CHICK_KW.some((k) => name.toUpperCase().includes(k)),
  );
  const prodMeta = (name) => {
    const u = name.toUpperCase();
    if (
      u.includes("FEED") ||
      u.includes("MASH") ||
      u.includes("PELLET") ||
      u.includes("STARTER") ||
      u.includes("FINISHER") ||
      u.includes("GROWER")
    )
      return { icon: Wheat, color: C.amber, label: "Feed" };
    if (
      u.includes("MEDIC") ||
      u.includes("VACCINE") ||
      u.includes("DRUG") ||
      u.includes("VITAMIN")
    )
      return { icon: Syringe, color: C.red, label: "Medication" };
    if (u.includes("EQUIP") || u.includes("FEEDER") || u.includes("DRINKER"))
      return { icon: Wrench, color: C.blue, label: "Equipment" };
    return { icon: Package, color: C.purple, label: "Other" };
  };

  return (
    <Panel delay={380} sx={{ borderTop: `3px solid ${C.amber}` }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: C.amber + "18",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Store size={18} color={C.amber} strokeWidth={2} />
        </div>
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: C.text }}>
            Chicken4U — Field Sales Dashboard
          </h2>
          <p style={{ fontSize: 11, color: C.textMd, marginTop: 2 }}>
            Field_Visit_Sales_Order_Report + All_Muo_Profiles
          </p>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))",
          gap: 10,
          marginBottom: 20,
        }}
      >
        {[
          { label: "Total MUOs", value: muo.total ?? 0, color: C.blue },
          {
            label: "Female MUOs",
            value: muo.female ?? 0,
            color: C.purple,
            sub:
              muo.total > 0
                ? ((muo.female / muo.total) * 100).toFixed(0) + "%"
                : "0%",
          },
          {
            label: "Male MUOs",
            value: muo.male ?? 0,
            color: C.cyan,
            sub:
              muo.total > 0
                ? ((muo.male / muo.total) * 100).toFixed(0) + "%"
                : "0%",
          },
          {
            label: "SHF/SSPs Reached",
            value: muo.sspTotal ?? 0,
            color: C.green,
          },
          {
            label: "Certified Learners",
            value: c4u.learners ?? 0,
            color: C.amber,
          },
          {
            label: "Orders Delivered",
            value: s.ordersDelivered ?? 0,
            color: C.green,
          },
          {
            label: "Orders Pending",
            value: s.ordersPending ?? 0,
            color: C.orange,
          },
          {
            label: "Feed (kg) Ordered",
            value: s.feedKgOrdered ?? 0,
            color: C.amber,
          },
        ].map(({ label, value, color, sub }) => (
          <Mini
            key={label}
            label={label}
            value={fmtN(value)}
            color={color}
            sub={sub}
            loading={loading}
          />
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
          marginBottom: 20,
        }}
      >
        <C4uPendingCard
          label="Pending This Week"
          orders={s.pendingWeek?.orders ?? 0}
          qty={s.pendingWeek?.qty ?? 0}
          list={s.pendingWeek?.list ?? []}
          color={C.amber}
          loading={loading}
        />
        <C4uPendingCard
          label="Pending This Month"
          orders={s.pendingMonth?.orders ?? 0}
          qty={s.pendingMonth?.qty ?? 0}
          list={s.pendingMonth?.list ?? []}
          color={C.blue}
          loading={loading}
        />
      </div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          {[
            {
              key: "ordered",
              label: `Ordered (${fmtN((s.grangers ?? 0) + (s.layers ?? 0) + (s.broilers ?? 0))})`,
            },
            {
              key: "delivered",
              label: `Delivered (${fmtN((s.grangersDelivered ?? 0) + (s.layersDelivered ?? 0) + (s.broilersDelivered ?? 0))})`,
            },
            {
              key: "pending",
              label: `Pending (${fmtN((s.grangersPending ?? 0) + (s.layersPending ?? 0) + (s.broilersPending ?? 0))})`,
            },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`tab-btn${activeTab === key ? " active" : ""}`}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                border: `1px solid ${C.border}`,
                background: "transparent",
                color: C.textMd,
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'Sora',sans-serif",
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
            gap: 12,
          }}
        >
          <C4uChickCard
            label="Grangers"
            color={C.amber}
            bg={C.amberLt}
            total={fmtN(tab.grangerTotal)}
            breeds={tab.grangerBreeds || {}}
            loading={loading}
          />
          <C4uChickCard
            label="Layers"
            color={C.green}
            bg={C.greenLt}
            total={fmtN(tab.layerTotal)}
            breeds={tab.layerBreeds || {}}
            loading={loading}
          />
          <C4uChickCard
            label="Broilers"
            color={C.blue}
            bg={C.blueLt}
            total={fmtN(tab.broilerTotal)}
            breeds={tab.broilerBreeds || {}}
            loading={loading}
          />
        </div>
      </div>
      {/* Top MUOs & SATOs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
          marginBottom: 20,
        }}
      >
        <div>
          <button
            onClick={() => setShowTopMuos((v) => !v)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 14px",
              borderRadius: 10,
              border: `1px solid ${C.borderMd}`,
              background: "transparent",
              color: C.textMd,
              fontSize: 11,
              cursor: "pointer",
              fontFamily: "'Sora',sans-serif",
              width: "100%",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Users size={13} color={C.cyan} />
              Top MUOs (by delivered)
            </span>
            {showTopMuos ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          {showTopMuos && (
            <div style={{ maxHeight: 220, overflowY: "auto" }}>
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <Sk key={i} h={28} style={{ marginBottom: 4 }} />
                ))
              ) : (s.topMuos || []).length === 0 ? (
                <p
                  style={{
                    fontSize: 11,
                    color: C.textSf,
                    textAlign: "center",
                    padding: "16px",
                  }}
                >
                  No MUO data yet
                </p>
              ) : (
                (s.topMuos || []).slice(0, 10).map((m, i) => {
                  const pct =
                    s.topMuos[0]?.value > 0
                      ? (m.value / s.topMuos[0].value) * 100
                      : 0;
                  return (
                    <div
                      key={m.name}
                      style={{
                        padding: "8px 10px",
                        borderRadius: 8,
                        marginBottom: 4,
                        background: C.surf2,
                        border: `1px solid ${C.border}`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 4,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            color: C.text,
                            fontWeight: i < 3 ? 600 : 400,
                          }}
                        >
                          #{i + 1} {m.name}
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: C.cyan,
                            fontFamily: C.mono,
                          }}
                        >
                          {fmtN(m.value)}
                        </span>
                      </div>
                      <div
                        style={{
                          height: 4,
                          background: C.surf3,
                          borderRadius: 2,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${pct}%`,
                            background: C.cyan,
                            borderRadius: 2,
                          }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
        <div>
          <button
            onClick={() => setShowTopSatos(v => !v)}
            style={{
              display:"flex", alignItems:"center", gap:6,
              padding:"7px 14px", borderRadius:10,
              border:`1px solid ${C.borderMd}`, background:"transparent",
              color:C.textMd, fontSize:11, cursor:"pointer",
              fontFamily:"'Sora',sans-serif", width:"100%",
              justifyContent:"space-between", marginBottom:8,
            }}
          >
            <span style={{display:"flex", alignItems:"center", gap:6}}>
              <UserCog size={13} color={C.green} />
              SATO Commissions — Top {(s.topSatos||[]).length}
            </span>
            {showTopSatos ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
          </button>

          {/* Commission config badge */}
          {s.satoCommissionConfig && (
            <div style={{
              display:"flex", gap:8, flexWrap:"wrap", marginBottom:8,
            }}>
              {[
                { label:"Granger", rate: s.satoCommissionConfig.grangerRate, color:C.amber, always:true },
                { label:"Layer",   rate: s.satoCommissionConfig.layerRate,   color:C.green,
                  target: s.satoCommissionConfig.layerTarget },
                { label:"Broiler", rate: s.satoCommissionConfig.broilerRate, color:C.blue,
                  target: s.satoCommissionConfig.broilerTarget },
              ].map(({label, rate, color, always, target}) => (
                <div key={label} style={{
                  padding:"4px 10px", borderRadius:8,
                  background: color+"14", border:`1px solid ${color}33`,
                  fontSize:10,
                }}>
                  <span style={{color:C.textSf}}>{label}: </span>
                  <span style={{fontWeight:700, color, fontFamily:C.mono}}>
                    GHC {rate}/chick
                  </span>
                  {!always && target > 0 && (
                    <span style={{color:C.textSf, marginLeft:4}}>
                      (target: {fmtN(target)})
                    </span>
                  )}
                  {always && (
                    <span style={{color:C.textSf, marginLeft:4}}>(always)</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Total commission payable summary */}
          {s.totalSatoCommissionPayable > 0 && (
            <div style={{
              padding:"10px 14px", borderRadius:10, marginBottom:10,
              background:`linear-gradient(135deg,${C.green}14,${C.cyan}08)`,
              border:`1px solid ${C.green}33`,
              display:"flex", alignItems:"center", justifyContent:"space-between",
            }}>
              <div>
                <p style={{fontSize:9,color:C.textSf,fontWeight:700,
                  textTransform:"uppercase",letterSpacing:".07em"}}>
                  Total SATO Commission Payable
                </p>
                <p style={{fontSize:20,fontWeight:800,color:C.green,fontFamily:C.mono}}>
                  GHC {fmtN(s.totalSatoCommissionPayable,2)}
                </p>
              </div>
              <Banknote size={28} color={C.green} strokeWidth={1.5}/>
            </div>
          )}

          {showTopSatos && (
            <div style={{maxHeight:320, overflowY:"auto"}}>
              {loading ? (
                [...Array(4)].map((_,i) => <Sk key={i} h={56} style={{marginBottom:6}}/>)
              ) : (s.topSatos||[]).length === 0 ? (
                <p style={{fontSize:11,color:C.textSf,textAlign:"center",padding:"16px"}}>
                  No SATO data yet
                </p>
              ) : (
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:10}}>
                  <thead>
                    <tr style={{borderBottom:`1px solid ${C.border}`}}>
                      {["#","SATO","Grangers","Layers","Broilers",
                        "Granger Comm","Layer Comm","Broiler Comm","Total Comm"].map(h => (
                        <th key={h} style={{
                          padding:"5px 7px", textAlign: h==="#"||h==="SATO" ? "left":"right",
                          color:C.textSf, fontSize:8, fontWeight:700,
                          textTransform:"uppercase", letterSpacing:".05em",
                          whiteSpace:"nowrap",
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(s.topSatos||[]).map((st,i) => (
                      <tr key={st.name} style={{
                        borderBottom:`1px solid ${C.border}`,
                        background: i%2===0 ? C.surf2 : "transparent",
                      }}>
                        <td style={{padding:"6px 7px",color:C.textSf,fontSize:9}}>{i+1}</td>
                        <td style={{padding:"6px 7px",color:C.text,fontWeight:600,
                          whiteSpace:"nowrap", maxWidth:120,
                          overflow:"hidden", textOverflow:"ellipsis"}}>
                          {st.name}
                        </td>
                        <td style={{padding:"6px 7px",textAlign:"right",
                          color:C.amber,fontFamily:C.mono}}>
                          {fmtN(st.grangersDelivered)}
                        </td>
                        <td style={{padding:"6px 7px",textAlign:"right",fontFamily:C.mono}}>
                          <span style={{color:st.meetsLayerTarget ? C.green : C.red}}>
                            {fmtN(st.layersDelivered)}
                          </span>
                          {!st.meetsLayerTarget && st.layersDelivered > 0 && (
                            <span style={{fontSize:8,color:C.red,marginLeft:3}}>✗</span>
                          )}
                        </td>
                        <td style={{padding:"6px 7px",textAlign:"right",fontFamily:C.mono}}>
                          <span style={{color:st.meetsBroilerTarget ? C.green : C.red}}>
                            {fmtN(st.broilersDelivered)}
                          </span>
                          {!st.meetsBroilerTarget && st.broilersDelivered > 0 && (
                            <span style={{fontSize:8,color:C.red,marginLeft:3}}>✗</span>
                          )}
                        </td>
                        <td style={{padding:"6px 7px",textAlign:"right",
                          color:C.amber,fontFamily:C.mono,fontWeight:600}}>
                          GHC {fmtN(st.grangerCommission,2)}
                        </td>
                        <td style={{padding:"6px 7px",textAlign:"right",fontFamily:C.mono}}>
                          <span style={{color:st.meetsLayerTarget ? C.green : C.textSf,fontWeight:600}}>
                            {st.meetsLayerTarget
                              ? `GHC ${fmtN(st.layerCommission,2)}`
                              : "—"}
                          </span>
                        </td>
                        <td style={{padding:"6px 7px",textAlign:"right",fontFamily:C.mono}}>
                          <span style={{color:st.meetsBroilerTarget ? C.green : C.textSf,fontWeight:600}}>
                            {st.meetsBroilerTarget
                              ? `GHC ${fmtN(st.broilerCommission,2)}`
                              : "—"}
                          </span>
                        </td>
                        <td style={{padding:"6px 7px",textAlign:"right",
                          color:C.green,fontFamily:C.mono,fontWeight:800}}>
                          GHC {fmtN(st.totalCommission,2)}
                        </td>
                      </tr>
                    ))}
                    {/* Totals row */}
                    <tr style={{borderTop:`2px solid ${C.borderMd}`,background:C.surf2}}>
                      <td colSpan={2} style={{padding:"7px 7px",fontWeight:700,color:C.text,fontSize:10}}>
                        TOTAL
                      </td>
                      <td style={{padding:"7px 7px",textAlign:"right",color:C.amber,
                        fontFamily:C.mono,fontWeight:700}}>
                        {fmtN((s.topSatos||[]).reduce((a,b)=>a+b.grangersDelivered,0))}
                      </td>
                      <td style={{padding:"7px 7px",textAlign:"right",color:C.green,
                        fontFamily:C.mono,fontWeight:700}}>
                        {fmtN((s.topSatos||[]).reduce((a,b)=>a+b.layersDelivered,0))}
                      </td>
                      <td style={{padding:"7px 7px",textAlign:"right",color:C.blue,
                        fontFamily:C.mono,fontWeight:700}}>
                        {fmtN((s.topSatos||[]).reduce((a,b)=>a+b.broilersDelivered,0))}
                      </td>
                      <td style={{padding:"7px 7px",textAlign:"right",color:C.amber,
                        fontFamily:C.mono,fontWeight:700}}>
                        GHC {fmtN((s.topSatos||[]).reduce((a,b)=>a+b.grangerCommission,0),2)}
                      </td>
                      <td style={{padding:"7px 7px",textAlign:"right",color:C.green,
                        fontFamily:C.mono,fontWeight:700}}>
                        GHC {fmtN((s.topSatos||[]).reduce((a,b)=>a+b.layerCommission,0),2)}
                      </td>
                      <td style={{padding:"7px 7px",textAlign:"right",color:C.green,
                        fontFamily:C.mono,fontWeight:700}}>
                        GHC {fmtN((s.topSatos||[]).reduce((a,b)=>a+b.broilerCommission,0),2)}
                      </td>
                      <td style={{padding:"7px 7px",textAlign:"right",color:C.green,
                        fontFamily:C.mono,fontWeight:800,fontSize:12}}>
                        GHC {fmtN(s.totalSatoCommissionPayable,2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
      {(loading || nonChickProducts.length > 0) && (
        <>
          <button
            onClick={() => setShowProducts((v) => !v)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "7px 14px",
              borderRadius: 10,
              border: `1px solid ${C.borderMd}`,
              background: "transparent",
              color: C.textMd,
              fontSize: 11,
              cursor: "pointer",
              fontFamily: "'Sora',sans-serif",
              width: "100%",
              justifyContent: "center",
              marginBottom: showProducts ? 12 : 0,
            }}
          >
            {showProducts ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {showProducts ? "Hide" : "Show"} Other Products (Feed, Medication,
            Equipment) — {nonChickProducts.length} items
          </button>
          {showProducts && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))",
                gap: 10,
              }}
            >
              {loading
                ? [...Array(4)].map((_, i) => <Sk key={i} h={90} />)
                : nonChickProducts.map(([name, d]) => {
                  const { icon: Ic, color, label } = prodMeta(name);
                  return (
                    <div
                      key={name}
                      style={{
                        background: color + "0D",
                        border: `1px solid ${color}22`,
                        borderRadius: 10,
                        padding: "12px 14px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 7,
                          marginBottom: 8,
                        }}
                      >
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 7,
                            background: color + "1A",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Ic size={13} color={color} strokeWidth={2} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p
                            style={{
                              fontSize: 9,
                              fontWeight: 700,
                              color,
                              textTransform: "uppercase",
                              letterSpacing: ".07em",
                            }}
                          >
                            {label}
                          </p>
                          <p
                            style={{
                              fontSize: 10,
                              color: C.text,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                            title={name}
                          >
                            {name}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 5 }}>
                        {[
                          ["Ord", d.ordered, color],
                          ["Del", d.delivered, C.green],
                          ["Pend", d.pending, C.amber],
                        ].map(([lbl, val, c]) => (
                          <div
                            key={lbl}
                            style={{
                              flex: 1,
                              background: C.surf2,
                              borderRadius: 6,
                              padding: "4px 3px",
                              textAlign: "center",
                            }}
                          >
                            <p
                              style={{
                                fontSize: 12,
                                fontWeight: 700,
                                color: c,
                                fontFamily: C.mono,
                              }}
                            >
                              {fmtN(val)}
                            </p>
                            <p
                              style={{
                                fontSize: 8,
                                color: C.textSf,
                                textTransform: "uppercase",
                              }}
                            >
                              {lbl}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </>
      )}
    </Panel>
  );
}


function PrevPeriodPanel({ data, loading, prevPeriod }) {
  if (!prevPeriod) return null;
  const pp = prevPeriod;
  const k  = data?.kpi      || {};
  const h  = data?.hatchery || {};
  const f  = data?.finance  || {};
  const fd = data?.feedDeliveries || {};

  // Use prevPeriod.cur for current values (from monthly data)
  // and data.kpi for direct kpi values
  const rows = [
    { label:"Eggs Produced",    color:C.cyan,
      cW:k.eggsThisWeek,    pW:pp.eggsWeek,
      cM:k.eggsThisMonth,   pM:pp.eggsMonth,
      cY:k.eggsThisYear,    pY:pp.eggsYear },
    { label:"Hatching Eggs",    color:C.purple,
      cW:k.hatchingEggsWeek,  pW:pp.hatchingEggsWeek,
      cM:k.hatchingEggsMonth, pM:pp.hatchingEggsMonth },
    { label:"Eggs Set",         color:C.amber,
      cW:h.eggsSetWeek,    pW:pp.eggsSetWeek,
      cM:h.eggsSetMonth,   pM:pp.eggsSetMonth },
    { label:"Good Chicks",      color:C.green,
      cW:k.goodChicksWeek,  pW:pp.goodChicksWeek,
      cM:k.goodChicksMonth, pM:pp.goodChicksMonth,
      cY:k.goodChicksYear,  pY:pp.goodChicksYear },
    { label:"Hatchability %",   color:C.blue, isPercent:true,
      cW:h.hatchabilityWeek,  pW:pp.hatchabilityWeek,
      cM:h.hatchabilityMonth, pM:pp.hatchabilityMonth },
    { label:"Mortality",        color:C.red, invert:true,
      cW:k.mortalityThisWeek,  pW:pp.mortalityWeek,
      cM:k.mortalityThisMonth, pM:pp.mortalityMonth,
      cY:k.mortalityThisYear,  pY:pp.mortalityYear },
    { label:"Feed (MT)",        color:C.amber,
      cW:k.feedIntakeTonsWeek, pW:pp.feedMTWeek,
      cM:k.feedIntakeTons,     pM:pp.feedMTMonth },
    { label:"Revenue (GHC)",    color:C.green, isCur:true,
      cW:f.combinedRevenueWeek,  pW:pp.revenueWeek,
      cM:f.combinedRevenueMonth, pM:pp.revenueMonth,
      cY:f.combinedRevenueYear,  pY:pp.revenueYear },
    { label:"Cash Received",    color:C.green, isCur:true,
      cW:f.cashReceivedWeek,  pW:pp.cashWeek,
      cM:f.cashReceivedMonth, pM:pp.cashMonth },
    { label:"Total Expenses",   color:C.red, isCur:true, invert:true,
      cW:f.totalExpenseWeek,  pW:pp.expenseWeek,
      cM:f.totalExpenseMonth, pM:pp.expenseMonth,
      cY:f.totalExpenseYear,  pY:pp.expenseYear },
    { label:"Confirmed Orders", color:C.blue,
      cW:k.confirmedOrdersWeek,  pW:0,
      cM:k.confirmedOrdersMonth, pM:0 },
  ];

  const fmt = (v, isCur, isPct) =>
    v == null ? "—" : isCur ? fmtCur(v) : isPct ? `${v}%` : fmtN(v);

  return (
    <Panel delay={0} sx={{borderTop:`3px solid ${C.purple}`}}>
      <SecHeader Ic={TrendingUp}
        title="Period-over-Period Comparison"
        subtitle={`Week vs ${pp.weekLabel} · Month vs ${pp.monthLabel} · Year vs ${pp.yearLabel}`}
        iconColor={C.purple}
      />
      <div style={{overflowX:"auto"}}>
        <table style={{
          width:"100%", borderCollapse:"collapse",
          fontSize:11, minWidth:720,
        }}>
          <thead>
            <tr style={{borderBottom:`2px solid ${C.border}`}}>
              {[
                {h:"Metric",     al:"left"},
                {h:"This Wk",    al:"right"},
                {h:`Prev Wk\n(${pp.weekLabel})`,  al:"right"},
                {h:"Δ Wk",       al:"right"},
                {h:"This Mo",    al:"right"},
                {h:`Prev Mo\n(${pp.monthLabel})`, al:"right"},
                {h:"Δ Mo",       al:"right"},
                {h:"This Yr",    al:"right"},
                {h:`Prev Yr\n(${pp.yearLabel})`,  al:"right"},
                {h:"Δ Yr",       al:"right"},
              ].map(({h:hh,al}) => (
                <th key={hh} style={{
                  padding:"7px 10px", textAlign:al,
                  color:C.textSf, fontSize:9, textTransform:"uppercase",
                  letterSpacing:".05em", whiteSpace:"pre-line",
                  lineHeight:1.3, fontWeight:700,
                }}>{hh}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.label} style={{
                borderBottom:`1px solid ${C.border}`,
                background: i%2===0 ? C.surf2 : "transparent",
              }}>
                <td style={{padding:"8px 10px",fontWeight:600,
                  color:r.color,whiteSpace:"nowrap"}}>
                  {r.label}
                </td>
                {/* Week */}
                <td style={{padding:"8px 10px",textAlign:"right",
                  color:r.color,fontFamily:C.mono,fontWeight:700}}>
                  {loading?"…":fmt(r.cW,r.isCur,r.isPercent)}
                </td>
                <td style={{padding:"8px 10px",textAlign:"right",
                  color:C.textSf,fontFamily:C.mono}}>
                  {loading?"…":fmt(r.pW,r.isCur,r.isPercent)}
                </td>
                <td style={{padding:"8px 10px",textAlign:"right"}}>
                  {!loading&&<DeltaChip
                    cur={r.cW||0} prev={r.pW||0} invert={r.invert}/>}
                </td>
                {/* Month */}
                <td style={{padding:"8px 10px",textAlign:"right",
                  color:r.color,fontFamily:C.mono,fontWeight:700}}>
                  {loading?"…":fmt(r.cM,r.isCur,r.isPercent)}
                </td>
                <td style={{padding:"8px 10px",textAlign:"right",
                  color:C.textSf,fontFamily:C.mono}}>
                  {loading?"…":fmt(r.pM,r.isCur,r.isPercent)}
                </td>
                <td style={{padding:"8px 10px",textAlign:"right"}}>
                  {!loading&&<DeltaChip
                    cur={r.cM||0} prev={r.pM||0} invert={r.invert}/>}
                </td>
                {/* Year */}
                <td style={{padding:"8px 10px",textAlign:"right",
                  color:r.color,fontFamily:C.mono,fontWeight:700}}>
                  {loading?"…":fmt(r.cY,r.isCur,r.isPercent)}
                </td>
                <td style={{padding:"8px 10px",textAlign:"right",
                  color:C.textSf,fontFamily:C.mono}}>
                  {loading?"…":fmt(r.pY,r.isCur,r.isPercent)}
                </td>
                <td style={{padding:"8px 10px",textAlign:"right"}}>
                  {!loading&&r.cY!=null&&r.pY!=null&&
                    <DeltaChip cur={r.cY} prev={r.pY} invert={r.invert}/>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}


function CustomRangePanel({ customRange, loading }) {
  if (!customRange) return null;
  const cr = customRange;

  const kpis = [
    { label:"Eggs Produced",   value:fmtN(cr.eggs),       color:C.cyan,
      prev:cr.prev.eggs,       prevLabel:cr.prev.rangeLabel },
    { label:"Hatching Eggs",   value:fmtN(cr.hatchable),  color:C.purple, prev:null },
    { label:"Eggs Set",        value:fmtN(cr.eggsSet),    color:C.amber,  prev:null },
    { label:"Good Chicks",     value:fmtN(cr.goodChicks), color:C.green,
      prev:cr.prev.goodChicks, prevLabel:cr.prev.rangeLabel },
    { label:"Hatchability %",  value:`${cr.hatchabilityPct}%`, color:C.green, prev:null },
    { label:"Fertility %",     value:`${cr.fertilityPct}%`,    color:C.cyan,  prev:null },
    { label:"Mortality",       value:fmtN(cr.mortality),  color:C.red,
      prev:cr.prev.mortality,  prevLabel:cr.prev.rangeLabel, invert:true },
    { label:"Feed Consumed",   value:`${fmtN(cr.feedMT,1)} MT`, color:C.amber, prev:null },
    { label:"Revenue",         value:fmtCur(cr.revenue),  color:C.green,
      prev:cr.prev.revenue,    prevLabel:cr.prev.rangeLabel },
    { label:"Cash Received",   value:fmtCur(cr.cashIn),   color:C.green,  prev:null },
    { label:"Expenses",        value:fmtCur(cr.expense),  color:C.red,
      prev:cr.prev.expense,    prevLabel:cr.prev.rangeLabel, invert:true },
    { label:"Net Profit",
      value:fmtCur(cr.profit),
      color:cr.profit>=0?C.green:C.red, prev:null },
    { label:"Gross Margin %",  value:`${cr.grossMarginPct}%`,
      color:cr.grossMarginPct>20?C.green:C.amber, prev:null },
  ];

  return (
    <Panel delay={0} sx={{borderTop:`3px solid ${C.cyan}`}}>
      <SecHeader Ic={CalendarDays}
        title={`Custom Range: ${cr.rangeLabel}`}
        subtitle={`Compared against equivalent prior period: ${cr.prev.rangeLabel}`}
        iconColor={C.cyan}
      />

      {/* KPI grid */}
      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",
        gap:12, marginBottom:24,
      }}>
        {kpis.map(({label,value,color,prev,prevLabel,invert}) => (
          <div key={label} style={{
            background:C.surf2, border:`1px solid ${C.border}`,
            borderRadius:10, padding:"12px 14px",
            borderTop:`3px solid ${color}`,
          }}>
            <p style={{fontSize:9,color:C.textSf,fontWeight:700,
              textTransform:"uppercase",letterSpacing:".07em",marginBottom:6}}>
              {label}
            </p>
            <p style={{fontSize:18,fontWeight:700,color,fontFamily:C.mono}}>
              {value}
            </p>
            {prev != null && (
              <div style={{marginTop:5,display:"flex",
                alignItems:"center",gap:5,flexWrap:"wrap"}}>
                <span style={{fontSize:9,color:C.textSf}}>
                  vs {prevLabel}:
                </span>
                <span style={{fontSize:10,color:C.textSf,fontFamily:C.mono}}>
                  {typeof prev === "number" && prev > 1000
                    ? fmtCur(prev) : fmtN(prev)}
                </span>
                <DeltaChip cur={parseFloat(value.replace(/[^0-9.-]/g,""))||0}
                  prev={prev} invert={invert} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Monthly breakdown chart for the range */}
      {cr.monthlyBreakdown.length > 1 && (
        <>
          <p style={{fontSize:11,fontWeight:600,color:C.textMd,marginBottom:12}}>
            Month-by-Month Breakdown within Range
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={cr.monthlyBreakdown}
              margin={{top:4,right:4,left:0,bottom:0}}>
              <XAxis dataKey="label"
                tick={{fontSize:9,fill:C.textSf,fontFamily:"'Sora'"}}
                axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize:9,fill:C.textSf}}
                axisLine={false} tickLine={false}
                width={40} tickFormatter={fmtK} />
              <Tooltip content={<Tip />}
                cursor={{fill:"rgba(255,255,255,0.03)"}} />
              <Bar dataKey="eggs"       name="Eggs"
                fill={C.cyan}   radius={[4,4,0,0]} fillOpacity={0.85} />
              <Bar dataKey="goodChicks" name="Good Chicks"
                fill={C.green}  radius={[4,4,0,0]} fillOpacity={0.85} />
              <Bar dataKey="revenue"    name="Revenue"
                fill={C.blue}   radius={[4,4,0,0]} fillOpacity={0.85} />
              <Legend wrapperStyle={{fontSize:10,color:C.textMd}} />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </Panel>
  );
}

/* ══════════════════════════════════════════════════
   SECTION: WORKFORCE
══════════════════════════════════════════════════ */
function WorkforceSection({ data, loading }) {
  const wf = data?.workforce || {};
  return (
    <Panel delay={430}>
      <SecHeader
        Ic={Users}
        title="Workforce & HR"
        subtitle="Staff · Leave · Department headcount"
        iconColor={C.cyan}
      />
      <div
        className="mini-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <Mini
          label="Total Staff"
          value={fmtN(wf.totalStaff)}
          color={C.blue}
          loading={loading}
        />
        <Mini
          label="On Duty Today"
          value={fmtN(wf.staffTurnoutToday)}
          color={C.green}
          loading={loading}
        />
        <Mini
          label="Staff on Leave"
          value={fmtN(wf.staffOnLeave)}
          color={C.amber}
          loading={loading}
        />
        <Mini
          label="Absenteeism %"
          value={`${wf.absenteeismPct || 0}%`}
          color={wf.absenteeismPct > 10 ? C.red : C.amber}
          loading={loading}
        />
        <Mini
          label="Open HR Issues"
          value={wf.openHRIssues ?? 0}
          color={wf.openHRIssues > 0 ? C.red : C.green}
          loading={loading}
        />
        <Mini
          label="Leave (Week)"
          value={fmtN(wf.leaveThisWeek)}
          color={C.blue}
          loading={loading}
        />
        <Mini
          label="Leave (Month)"
          value={fmtN(wf.leaveThisMonth)}
          color={C.blue}
          loading={loading}
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          marginBottom: 10,
        }}
      >
        <Gauge size={13} color={C.textSf} />
        <p style={{ fontSize: 11, fontWeight: 600, color: C.textMd }}>
          Department Headcount
        </p>
      </div>
      {!loading && (wf.deptProductivity || []).length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "24px",
            color: C.textSf,
            fontSize: 12,
          }}
        >
          <Users size={28} color={C.textSf} style={{ marginBottom: 8 }} />
          <p>No department data found</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={160}>
          <BarChart
            data={wf.deptProductivity || []}
            margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
          >
            <XAxis
              dataKey="dept"
              tick={{ fontSize: 9, fill: C.textSf, fontFamily: "'Sora'" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 9, fill: C.textSf }}
              axisLine={false}
              tickLine={false}
              width={28}
            />
            <Tooltip
              content={<Tip />}
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
            />
            <Bar dataKey="score" name="Headcount" radius={[6, 6, 0, 0]}>
              {(wf.deptProductivity || []).map((e, i) => (
                <Cell
                  key={i}
                  fill={
                    [C.blue, C.green, C.amber, C.purple, C.cyan, C.orange][
                    i % 6
                    ]
                  }
                  fillOpacity={0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Panel>
  );
}

/* ══════════════════════════════════════════════════
   SPLASH LOADER
══════════════════════════════════════════════════ */
const LOAD_STEPS = [
  { label: "Connecting to Zoho Creator", duration: 800 },
  { label: "Loading flock master records", duration: 800 },
  { label: "Loading daily operations data", duration: 700 },
  { label: "Processing egg collection by breed", duration: 600 },
  { label: "Loading detailed daily ops", duration: 700 },
  { label: "Fetching hatchery data ", duration: 800 },
  { label: "Loading storage details (eggs)", duration: 700 },
  { label: "Loading Day Old Chicks report", duration: 600 },
  { label: "Loading poultry sales orders", duration: 800 },
  { label: "Processing chick orders ", duration: 600 },
  { label: "Loading payment records", duration: 600 },
  { label: "Loading product stock levels", duration: 700 },
  { label: "Loading employee & leave records", duration: 700 },
  { label: "Loading Chicken4U field orders", duration: 1000 },
  { label: "Building breed-specific KPIs", duration: 800 },
];

const LOAD_STAGES = [
  { Ic: Package, label: "Collecting eggs from farms…", color: C.blue },
  { Ic: Egg, label: "Processing hatchery data…", color: C.amber },
  { Ic: Bird, label: "Counting day-old chicks…", color: C.green },
  { Ic: Wheat, label: "Measuring feed intake…", color: C.amber },
  { Ic: Boxes, label: "Checking inventory stock…", color: C.purple },
  { Ic: BarChart2, label: "Building breed KPIs…", color: C.cyan },
  { Ic: Store, label: "Loading Chicken4U orders…", color: C.orange },
  { Ic: Banknote, label: "Syncing financial data…", color: C.green },
  { Ic: CheckCircle2, label: "Dashboard ready!", color: C.green },
];

// REPLACE the entire SplashLoader function with:
function SplashLoader({ onDone }) {
  const [stageIdx, setStageIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const totalDuration = 12000;

  useEffect(() => {
    let rafId;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(100, ((now - start) / totalDuration) * 100);
      setProgress(p);
      if (p < 100) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const stageInterval = Math.floor(totalDuration / LOAD_STAGES.length);
    const stageTimer = setInterval(() => {
      setStageIdx((i) => Math.min(i + 1, LOAD_STAGES.length - 1));
    }, stageInterval);

    const exitTimer = setTimeout(() => {
      setExiting(true);
      setTimeout(onDone, 680);
    }, totalDuration + 120);

    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(stageTimer);
      clearTimeout(exitTimer);
    };
  }, [onDone]);

  const stage = LOAD_STAGES[Math.min(stageIdx, LOAD_STAGES.length - 1)];
  const StageIcon = stage.Ic;

  return (
    <div className={`loader-wrap${exiting ? " exit" : ""}`}>
      <div className="loader-grid-bg" />
      <div className="loader-scan" />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Animated Lucide icon — replaces emoji */}
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 32,
            background: `radial-gradient(circle at 40% 35%, ${stage.color}28, ${stage.color}08)`,
            border: `2px solid ${stage.color}44`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
            boxShadow: `0 0 48px ${stage.color}33, 0 0 120px ${stage.color}14`,
            animation: "eggBounce 1.4s ease-in-out infinite",
            transition: "all 0.5s cubic-bezier(.34,1.56,.64,1)",
          }}
        >
          <StageIcon
            size={56}
            color={stage.color}
            strokeWidth={1.5}
            style={{ filter: `drop-shadow(0 0 14px ${stage.color}88)` }}
          />
        </div>

        {/* Walking chick parade — Lucide Bird icons */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 28,
            alignItems: "center",
          }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                animation: `chickenWalk 0.8s ${i * 0.16}s ease-in-out infinite alternate`,
                opacity: 0.55,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Bird
                size={22}
                color={C.green}
                strokeWidth={1.8}
                style={{ filter: `drop-shadow(0 0 4px ${C.green}66)` }}
              />
            </div>
          ))}
        </div>

        <p
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: C.text,
            letterSpacing: ".1em",
            textAlign: "center",
          }}
        >
          WAFAD GROUP
        </p>
        <p
          style={{
            fontSize: 10,
            color: C.textSf,
            letterSpacing: ".22em",
            textTransform: "uppercase",
            marginTop: 5,
            marginBottom: 32,
          }}
        >
          Executive Dashboard · Live
        </p>

        {/* Progress bar */}
        <div style={{ width: 340, maxWidth: "86vw" }}>
          <div
            style={{
              height: 5,
              background: "rgba(30,140,255,0.13)",
              borderRadius: 4,
              overflow: "hidden",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${C.blue}, ${stage.color}, ${C.green})`,
                borderRadius: 4,
                transition: "width 0.3s linear, background 0.5s ease",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <span style={{ fontSize: 11, color: C.textMd, fontWeight: 600 }}>
              {stage.label}
            </span>
            <span style={{ fontSize: 10, color: C.textSf, fontFamily: C.mono }}>
              {Math.round(progress)}%
            </span>
          </div>

          {/* Stage pipeline — Lucide icons instead of emoji */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              flexWrap: "wrap",
            }}
          >
            {LOAD_STAGES.map((s, i) => {
              const Ic = s.Ic;
              const isDone = i < stageIdx;
              const isCurrent = i === stageIdx;
              return (
                <div
                  key={i}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: isDone
                      ? C.green + "1A"
                      : isCurrent
                        ? s.color + "28"
                        : "rgba(255,255,255,0.04)",
                    border: `1px solid ${isDone ? C.green + "55" : isCurrent ? s.color + "77" : C.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.4s cubic-bezier(.34,1.56,.64,1)",
                    transform: isCurrent ? "scale(1.3)" : "scale(1)",
                    boxShadow: isCurrent ? `0 0 14px ${s.color}55` : "none",
                  }}
                >
                  {isDone ? (
                    <CheckCircle2 size={14} color={C.green} strokeWidth={2.5} />
                  ) : (
                    <Ic
                      size={14}
                      color={isCurrent ? s.color : C.textSf}
                      strokeWidth={isCurrent ? 2 : 1.5}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   NAV CONFIG
══════════════════════════════════════════════════ */
const NAV = [
  { id: "kpi", Ic: BarChart2, label: "KPI Strip" },
  { id: "hatchery", Ic: Egg, label: "Hatchery" },
  { id: "feedmill", Ic: Wheat, label: "Feed Mill" },
  { id: "finance", Ic: Banknote, label: "Finance" },
  { id: "inventory", Ic: Boxes, label: "Inventory" },
  { id: "alerts", Ic: ShieldAlert, label: "Risk & Alerts" },
  { id: "chicken4u", Ic: Store, label: "Chicken4U" },
  { id: "workforce", Ic: Users, label: "Workforce" },
  { id: "monthly", Ic: CalendarDays, label: "Monthly Trend" },
  // Add to NAV array:
  { id: "prevperiod", Ic: TrendingUp,   label: "Period Compare" },
  { id: "daterange",  Ic: CalendarDays, label: "Date Range"     },
];

/* ══════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════ */
export default function WAFADExecutiveDashboard() {

  const [customFrom,    setCustomFrom]    = useState("");
  const [customTo,      setCustomTo]      = useState("");
  const [dateRangeMode, setDateRangeMode] = useState(false);

  const [prevPeriod,  setPrevPeriod]  = useState(null);
  const [customRange, setCustomRange] = useState(null);


  const [showLoader, setShowLoader] = useState(true);
  const [active, setActive] = useState("kpi");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState(null);
  const [exporting, setExporting] = useState(null);
  const [mobOpen, setMobOpen] = useState(false);
  const [error, setError] = useState(null);
  // Global breed filter — lifted to App so all sections can share it
  // ─── REPLACE WITH ────────────────────────────────────
  const [selectedBreed, setSelectedBreed] = useState("All Breeds");
  const [selectedFarm, setSelectedFarm] = useState("All Farms");

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [availableYears, setAvailableYears] = useState([currentYear]);

  const yearsToShow = availableYears.includes(selectedYear)
    ? availableYears
    : [...availableYears, selectedYear].sort((a, b) => b - a);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await loadAllData(selectedYear);  // ← pass year
      setData(result);
      setLastSync(new Date());
      // Replace with:
      if (result.availableYears?.length > 0) {
        setAvailableYears(result.availableYears);
      } else {
        setAvailableYears([currentYear]);
      }
      setSelectedBreed(prev =>
        (result.allBreeds || []).includes(prev) ? prev : "All Breeds"
      );
      setSelectedFarm(prev =>
        (result.allFarms || []).includes(prev) ? prev : "All Farms"
      );

          // ── NEW: compute prev period from already-loaded data ──
    const pp = computePrevPeriod(result, selectedYear);
    setPrevPeriod(pp);

    // ── NEW: re-apply custom range if one was active ──
    if (customFrom && customTo) {
      setCustomRange(applyCustomRange(result, customFrom, customTo));
    }

      // setData(result);
      // setLastSync(new Date());
      // setSelectedBreed(prev =>
      //   (result.allBreeds || []).includes(prev) ? prev : "All Breeds"
      // );
      // setSelectedFarm(prev =>
      //   (result.allFarms || []).includes(prev) ? prev : "All Farms"
      // );
    } catch (e) {
      console.error("[WAFAD] Top-level load error:", e);
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }, [selectedYear,  customFrom, customTo]);  // ← add selectedYear dependency

  // Add this inside WAFADExecutiveDashboard, after loadData:
const applyRange = useCallback(() => {
  if (!customFrom || !customTo || !data) return;
  const result = applyCustomRange(data, customFrom, customTo);
  setCustomRange(result);
  scrollTo("daterange");
}, [customFrom, customTo, data]);

const clearRange = useCallback(() => {
  setCustomFrom("");
  setCustomTo("");
  setCustomRange(null);
  setDateRangeMode(false);
}, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    setSelectedBreed("All Breeds");
    setSelectedFarm("All Farms");
  }, [selectedYear]);

  const handleScroll = (e) => {
    const top = e.target.scrollTop + 120;
    let cur = "kpi";
    for (const { id } of NAV) {
      const el = document.getElementById(`sec-${id}`);
      if (el && el.offsetTop <= top) cur = id;
    }
    setActive(cur);
  };
  const scrollTo = (id) => {
    setActive(id);
    setMobOpen(false);
    document
      .getElementById(`sec-${id}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleExport = async (type) => {
  if (!data) return;
  setExporting(type);
  try {
    if (type === "excel") await doExcel(data, selectedYear, selectedBreed, selectedFarm);
    else await doPptx(data, selectedYear, selectedBreed, selectedFarm);
    } catch {
      alert("Export failed. Please try again.");
    } finally {
      setExporting(null);
    }
  };

  const critCount =
    data?.alerts?.filter((a) => a.type === "critical").length ?? 0;
  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const MobNavContent = () => (
  <>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
        paddingBottom: 12,
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <img src={LOGO_IMG} alt="logo" style={{ width: 20, height: 20, borderRadius: 5, objectFit: "cover" }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>WAFAD</span>
      </div>
      <button
        onClick={() => setMobOpen(false)}
        style={{ background: "none", border: "none", cursor: "pointer", color: C.textMd, display: "flex" }}
      >
        <X size={20} />
      </button>
    </div>

    {/* ── Status ── */}
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "10px 12px", borderRadius: 10,
      background: loading ? C.amberLt : error ? C.redLt : C.greenLt,
      border: `1px solid ${loading ? C.amber : error ? C.red : C.green}44`,
      marginBottom: 12,
    }}>
      {loading
        ? <RefreshCw size={12} color={C.amber} className="spin-ic" />
        : error
          ? <AlertCircle size={12} color={C.red} />
          : <Circle size={6} color={C.green} fill={C.green} className="dot-pulse" />}
      <span style={{ fontSize: 11, fontWeight: 700, color: loading ? C.amber : error ? C.red : C.green }}>
        {loading ? "Loading…" : error ? "Error" : "Live"}
      </span>
      <span style={{ fontSize: 10, color: C.textSf, marginLeft: "auto" }}>{dateStr}</span>
    </div>

    {/* ── Year Selector ── */}
    <div style={{
      padding: "10px 12px", borderRadius: 10,
      background: C.surf2, border: `1px solid ${C.border}`,
      marginBottom: 12,
    }}>
      <p style={{ fontSize: 9, color: C.textSf, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 8 }}>
        Year
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <select
          value={selectedYear}
          onChange={e => { setSelectedYear(Number(e.target.value)); setMobOpen(false); }}
          style={{
            flex: 1, background: C.surf, border: `1px solid ${C.borderMd}`,
            borderRadius: 7, color: selectedYear !== currentYear ? C.blue : C.text,
            fontSize: 12, fontWeight: 700, padding: "6px 10px",
            cursor: "pointer", fontFamily: "'Sora',sans-serif", outline: "none",
          }}
        >
          {yearsToShow.map(y => (
            <option key={y} value={y} style={{ background: C.surf, color: C.text }}>
              {y}{y === currentYear ? " ★ Current" : ""}
            </option>
          ))}
        </select>
        {selectedYear !== currentYear && (
          <button
            onClick={() => { setSelectedYear(currentYear); setMobOpen(false); }}
            style={{
              padding: "6px 10px", borderRadius: 7,
              border: `1px solid ${C.blue}44`, background: C.blueLt,
              color: C.blue, cursor: "pointer",
              fontFamily: "'Sora',sans-serif", fontSize: 11, fontWeight: 700,
            }}
          >
            ← Live
          </button>
        )}
      </div>
    </div>

    {/* ── Date Range ── */}
    <div style={{
      padding: "10px 12px", borderRadius: 10,
      background: C.surf2, border: `1px solid ${C.border}`,
      marginBottom: 12,
    }}>
      <p style={{ fontSize: 9, color: C.textSf, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 8 }}>
        Date Range
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <input
          type="date"
          value={customFrom}
          onChange={e => setCustomFrom(e.target.value)}
          style={{
            background: C.surf, border: `1px solid ${C.borderMd}`,
            borderRadius: 7, color: C.text, fontSize: 12,
            padding: "6px 10px", fontFamily: "'Sora',sans-serif",
            colorScheme: "dark", outline: "none",
          }}
        />
        <input
          type="date"
          value={customTo}
          onChange={e => setCustomTo(e.target.value)}
          style={{
            background: C.surf, border: `1px solid ${C.borderMd}`,
            borderRadius: 7, color: C.text, fontSize: 12,
            padding: "6px 10px", fontFamily: "'Sora',sans-serif",
            colorScheme: "dark", outline: "none",
          }}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => { applyRange(); setMobOpen(false); }}
            disabled={!customFrom || !customTo || loading}
            style={{
              flex: 1, padding: "7px", borderRadius: 7, border: "none",
              background: C.blue, color: "#fff", fontSize: 12,
              fontWeight: 700, cursor: "pointer",
              fontFamily: "'Sora',sans-serif",
              opacity: (!customFrom || !customTo || loading) ? 0.4 : 1,
            }}
          >
            Apply
          </button>
          {customRange && (
            <button
              onClick={() => { clearRange(); setMobOpen(false); }}
              style={{
                padding: "7px 12px", borderRadius: 7,
                border: `1px solid ${C.border}`, background: "transparent",
                color: C.textMd, fontSize: 12, cursor: "pointer",
                fontFamily: "'Sora',sans-serif",
              }}
            >
              ✕ Clear
            </button>
          )}
        </div>
      </div>
    </div>

    {/* ── Actions ── */}
    <div style={{
      padding: "10px 12px", borderRadius: 10,
      background: C.surf2, border: `1px solid ${C.border}`,
      marginBottom: 12,
    }}>
      <p style={{ fontSize: 9, color: C.textSf, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 8 }}>
        Actions
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <button
          onClick={() => { loadData(); setMobOpen(false); }}
          disabled={loading}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "10px", borderRadius: 8,
            border: `1px solid ${C.borderMd}`, background: C.surf,
            color: C.textMd, fontSize: 12, fontWeight: 600,
            cursor: "pointer", fontFamily: "'Sora',sans-serif",
            opacity: loading ? 0.5 : 1,
          }}
        >
          <RefreshCw size={14} />
          Refresh Data
        </button>
        <button
          onClick={() => { handleExport("excel"); setMobOpen(false); }}
          disabled={!!exporting || loading || !data}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "10px", borderRadius: 8,
            border: "none", background: C.greenLt,
            color: C.green, fontSize: 12, fontWeight: 700,
            cursor: "pointer", fontFamily: "'Sora',sans-serif",
            opacity: !data ? 0.4 : 1,
          }}
        >
          {exporting === "excel" ? <RefreshCw size={14} className="spin-ic" /> : <FileSpreadsheet size={14} />}
          Export to Excel
        </button>
        <button
          onClick={() => { handleExport("pptx"); setMobOpen(false); }}
          disabled={!!exporting || loading || !data}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "10px", borderRadius: 8,
            border: "none", background: C.orangeLt,
            color: C.orange, fontSize: 12, fontWeight: 700,
            cursor: "pointer", fontFamily: "'Sora',sans-serif",
            opacity: !data ? 0.4 : 1,
          }}
        >
          {exporting === "pptx" ? <RefreshCw size={14} className="spin-ic" /> : <Presentation size={14} />}
          Export to PowerPoint
        </button>
      </div>
    </div>

    {/* ── Breed & Farm Filters ── */}
    {data?.allFarms && data.allFarms.length > 1 && (
      <div style={{ padding: "8px 4px", marginBottom: 8 }}>
        <p style={{ fontSize: 9, color: C.textSf, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 6 }}>
          Filter by Farm
        </p>
        <BreedDropdown breeds={data.allFarms} selected={selectedFarm} onChange={v => { setSelectedFarm(v); setMobOpen(false); }} />
      </div>
    )}
    {data?.allBreeds && data.allBreeds.length > 1 && (
      <div style={{ padding: "8px 4px", marginBottom: 12 }}>
        <p style={{ fontSize: 9, color: C.textSf, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 6 }}>
          Filter by Breed
        </p>
        <BreedDropdown breeds={data.allBreeds} selected={selectedBreed} onChange={v => { setSelectedBreed(v); setMobOpen(false); }} />
      </div>
    )}

    {/* ── Nav Links ── */}
    <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
      <p style={{ fontSize: 9, color: C.textSf, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 8, paddingLeft: 4 }}>
        Navigation
      </p>
      {NAV.map((n) => (
        <div
          key={n.id}
          onClick={() => scrollTo(n.id)}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 10px", borderRadius: 10, marginBottom: 4,
            cursor: "pointer",
            background: active === n.id ? "rgba(30,140,255,0.14)" : "transparent",
            borderLeft: `3px solid ${active === n.id ? C.blue : "transparent"}`,
            transition: "all 0.14s",
          }}
        >
          <n.Ic size={15} color={active === n.id ? C.blue : C.textMd} strokeWidth={2} />
          <span style={{ fontSize: 13, fontWeight: 500, color: active === n.id ? C.blue : C.textMd }}>
            {n.label}
          </span>
          {n.id === "alerts" && critCount > 0 && (
            <span style={{
              marginLeft: "auto", fontSize: 9.5, fontWeight: 700,
              background: C.redLt, color: C.red,
              padding: "1px 7px", borderRadius: 10,
            }}>
              {critCount}
            </span>
          )}
        </div>
      ))}
    </div>

    {/* ── Footer ── */}
    <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
      <p style={{ fontSize: 9, color: C.textSf }}>WAFAD Executive Dashboard · CEO View</p>
      {lastSync && (
        <p style={{ fontSize: 9, color: C.textSf, marginTop: 4 }}>
          Last sync: {lastSync.toLocaleTimeString("en-US")}
        </p>
      )}
    </div>
  </>
);

  return (
    <div
      style={{
        fontFamily: "'Sora',sans-serif",
        background: C.bg,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {showLoader && <SplashLoader onDone={() => setShowLoader(false)} />}
      <div
        className={`mob-overlay${mobOpen ? " show" : ""}`}
        onClick={() => setMobOpen(false)}
      />
      <nav className={`mob-nav${mobOpen ? " open" : ""}`}>
        <MobNavContent />
      </nav>

      {/* HEADER */}
      <header
        className="nav-glow"
        style={{
          background: C.surf,
          borderBottom: `1px solid ${C.border}`,
          position: "sticky",
          top: 0,
          zIndex: 300,
          boxShadow: "0 4px 24px rgba(0,0,0,0.45)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 14px",
            height: 54,
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              className="mob-ham xbtn"
              onClick={() => setMobOpen((o) => !o)}
              style={{
                display: "none",
                alignItems: "center",
                background: C.surf2,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: "7px 9px",
                cursor: "pointer",
                color: C.textMd,
              }}
            >
              <Menu size={18} />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  background: `linear-gradient(135deg,${C.blue},${C.purple})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 3px 14px rgba(30,140,255,0.38)`,
                }}
              >
                <img
                  src={LOGO_IMG}
                  alt="logo"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: C.text,
                    letterSpacing: "-.3px",
                    lineHeight: 1.1,
                  }}
                >
                  WAFAD GROUP
                </p>
                <p
                  style={{
                    fontSize: 7.5,
                    color: C.textSf,
                    letterSpacing: ".12em",
                  }}
                >
                  EXECUTIVE DASHBOARD · LIVE
                </p>
              </div>
            </div>
          </div>
          <div
  className="hdr-right"
  style={{ display: "flex", alignItems: "center", gap: 6 }}
>
  {/* Hide everything except hamburger on mobile via CSS */}
  <div className="hdr-desktop-only" style={{ display: "flex", alignItems: "center", gap: 6 }}>
    {/* status pill */}
    <div style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:20, border:`1px solid ${loading ? C.amber+"55" : error ? C.red+"55" : C.green+"55"}`, background: loading ? C.amberLt : error ? C.redLt : C.greenLt }}>
      {loading ? <RefreshCw size={10} color={C.amber} className="spin-ic" /> : error ? <AlertCircle size={10} color={C.red} /> : <Circle size={5} color={C.green} fill={C.green} className="dot-pulse" />}
      <span style={{ fontSize:10, fontWeight:700, color: loading ? C.amber : error ? C.red : C.green }}>
        {loading ? "Loading…" : error ? "Error" : "Live"}
      </span>
    </div>
    <div className="hdr-date" style={{ display:"flex", alignItems:"center", gap:4 }}>
      <CalendarDays size={11} color={C.textSf} />
      <span style={{ fontSize:9.5, color:C.textSf }}>{dateStr}</span>
    </div>
    <div style={{ display:"flex", alignItems:"center", gap:4 }}>
      <CalendarDays size={11} color={C.textSf} />
      <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))} style={{ background:C.surf2, border:`1px solid ${C.borderMd}`, borderRadius:7, color: selectedYear !== currentYear ? C.blue : C.textMd, fontSize:11, fontWeight:700, padding:"4px 8px", cursor:"pointer", fontFamily:"'Sora',sans-serif", outline:"none" }}>
        {yearsToShow.map(y => <option key={y} value={y} style={{ background:C.surf, color:C.text }}>{y}{y === currentYear ? " ★" : ""}</option>)}
      </select>
      {selectedYear !== currentYear && (
        <button onClick={() => setSelectedYear(currentYear)} style={{ fontSize:9, padding:"3px 7px", borderRadius:6, border:`1px solid ${C.blue}44`, background:C.blueLt, color:C.blue, cursor:"pointer", fontFamily:"'Sora',sans-serif", fontWeight:700 }}>← Live</button>
      )}
    </div>
    <button className="hdr-range-btn xbtn" onClick={() => setDateRangeMode(v => !v)} style={{ display:"flex", alignItems:"center", gap:4, padding:"5px 10px", borderRadius:7, border:`1px solid ${dateRangeMode ? C.cyan+"77" : C.borderMd}`, background: dateRangeMode ? C.blueLt : "transparent", color: dateRangeMode ? C.cyan : C.textMd, fontSize:10, fontWeight:700, cursor:"pointer", fontFamily:"'Sora',sans-serif" }}>
      <CalendarDays size={11} />
      <span className="hdr-export-lbl">Date Range</span>
    </button>
    {dateRangeMode && (
      <div style={{ display:"flex", alignItems:"center", gap:5, flexWrap:"wrap" }}>
        <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)} style={{ background:C.surf2, border:`1px solid ${C.borderMd}`, borderRadius:7, color:C.text, fontSize:10, padding:"4px 8px", fontFamily:"'Sora',sans-serif", colorScheme:"dark" }} />
        <span style={{ color:C.textSf, fontSize:10 }}>→</span>
        <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)} style={{ background:C.surf2, border:`1px solid ${C.borderMd}`, borderRadius:7, color:C.text, fontSize:10, padding:"4px 8px", fontFamily:"'Sora',sans-serif", colorScheme:"dark" }} />
        <button onClick={applyRange} disabled={!customFrom || !customTo || loading} style={{ padding:"4px 12px", borderRadius:7, border:"none", background:C.blue, color:"#fff", fontSize:10, fontWeight:700, cursor:"pointer", fontFamily:"'Sora',sans-serif", opacity:(!customFrom||!customTo||loading)?0.4:1 }}>Apply</button>
        {customRange && <button onClick={clearRange} style={{ padding:"4px 8px", borderRadius:7, border:`1px solid ${C.border}`, background:"transparent", color:C.textMd, fontSize:10, cursor:"pointer", fontFamily:"'Sora',sans-serif" }}>✕ Clear</button>}
      </div>
    )}
    <button className="hdr-refresh xbtn" onClick={loadData} disabled={loading} style={{ display:"flex", alignItems:"center", gap:4, padding:"5px 10px", borderRadius:7, border:`1px solid ${C.borderMd}`, background:"transparent", color:C.textMd, fontSize:10, cursor:"pointer", fontFamily:"'Sora',sans-serif", opacity: loading ? 0.5 : 1 }}>
      <RefreshCw size={11} />
      <span className="hdr-export-lbl">Refresh</span>
    </button>
    <button className="xbtn" onClick={() => handleExport("excel")} disabled={!!exporting || loading || !data} style={{ display:"flex", alignItems:"center", gap:4, padding:"5px 10px", borderRadius:7, border:"none", background:C.greenLt, color:C.green, fontSize:10, fontWeight:700, cursor:"pointer", fontFamily:"'Sora',sans-serif", opacity: !data ? 0.4 : 1 }}>
      {exporting === "excel" ? <RefreshCw size={12} className="spin-ic" /> : <FileSpreadsheet size={12} />}
      <span className="hdr-export-lbl">Excel</span>
    </button>
    <button className="xbtn" onClick={() => handleExport("pptx")} disabled={!!exporting || loading || !data} style={{ display:"flex", alignItems:"center", gap:4, padding:"5px 10px", borderRadius:7, border:"none", background:C.orangeLt, color:C.orange, fontSize:10, fontWeight:700, cursor:"pointer", fontFamily:"'Sora',sans-serif", opacity: !data ? 0.4 : 1 }}>
      {exporting === "pptx" ? <RefreshCw size={12} className="spin-ic" /> : <Presentation size={12} />}
      <span className="hdr-export-lbl">PPT</span>
    </button>
  </div>
</div>
        </div>

        {/* Nav pills */}
        <div
          className="top-nav-pills top-nav-scroll"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: "0 14px",
            height: 42,
          }}
        >
          {NAV.map((n, idx) => (
            <button
              key={n.id}
              onClick={() => scrollTo(n.id)}
              className={`nav-pill${active === n.id ? " active" : ""}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 12px",
                borderRadius: 8,
                border: `1px solid ${active === n.id ? "rgba(30,140,255,0.55)" : "transparent"}`,
                background: "transparent",
                color: active === n.id ? C.blue : C.textMd,
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'Sora',sans-serif",
                animationDelay: `${idx * 30}ms`,
              }}
            >
              <n.Ic size={13} strokeWidth={2} />
              {n.label}
              {n.id === "alerts" && critCount > 0 && (
                <span
                  className="crit-badge"
                  style={{
                    fontSize: 8.5,
                    fontWeight: 800,
                    background: C.red,
                    color: "#fff",
                    padding: "1px 5px",
                    borderRadius: 8,
                    marginLeft: 2,
                    lineHeight: 1.4,
                  }}
                >
                  {critCount}
                </span>
              )}
              {n.id === "chicken4u" && (
                <span
                  style={{
                    fontSize: 8,
                    background: C.amber,
                    color: "#fff",
                    padding: "1px 5px",
                    borderRadius: 7,
                    marginLeft: 2,
                    fontWeight: 700,
                  }}
                >
                  Field
                </span>
              )}
            </button>
          ))}
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 5,
              flexShrink: 0,
            }}
          >
            {lastSync && (
              <>
                <Clock size={10} color={C.textSf} />
                <span
                  style={{
                    fontSize: 9.5,
                    color: C.textSf,
                    whiteSpace: "nowrap",
                  }}
                >
                  Synced {lastSync.toLocaleTimeString("en-US")}
                </span>
              </>
            )}
            <UserCog size={10} color={C.textSf} style={{ marginLeft: 6 }} />
            <span
              style={{ fontSize: 9.5, color: C.textSf, whiteSpace: "nowrap" }}
            >
              CEO View
            </span>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main
        onScroll={handleScroll}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 14px 48px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {error && (
          <div
            style={{
              background: C.redLt,
              border: `1px solid ${C.red}44`,
              borderRadius: 12,
              padding: "14px 18px",
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
            }}
          >
            <AlertCircle
              size={18}
              color={C.red}
              style={{ flexShrink: 0, marginTop: 1 }}
            />
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: C.red }}>
                Data load error — showing available data
              </p>
              <p style={{ fontSize: 11, color: C.textMd, marginTop: 4 }}>
                {error}
              </p>
            </div>
            <button
              onClick={loadData}
              style={{
                marginLeft: "auto",
                flexShrink: 0,
                padding: "5px 12px",
                borderRadius: 8,
                border: `1px solid ${C.red}55`,
                background: "transparent",
                color: C.red,
                fontSize: 11,
                cursor: "pointer",
                fontFamily: "'Sora',sans-serif",
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Summary strip */}
        {!loading && data && (
          <div
            className="fade-in"
            style={{
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
              padding: "10px 16px",
              borderRadius: 12,
              background: C.surf,
              border: `1px solid ${C.border}`,
              alignItems: "center",
            }}
          >
            {[
              {
                Ic: AlertTriangle,
                label: "Critical Issues",
                value: data.kpi.criticalIssues,
                color: C.red,
              },
              {
                Ic: Bird,
                label: "Birds Alive",
                value: fmtN(data.kpi.birdsAlive),
                color: C.green,
              },
              // ─── REPLACE WITH ────────────────────────────────────
              {
                Ic: Filter,
                label: "Breed Filter",
                value: selectedBreed,
                color: selectedBreed !== "All Breeds" ? C.blue : C.textSf,
              },
              {
                Ic: Building2,
                label: "Farm Filter",
                value: selectedFarm,
                color: selectedFarm !== "All Farms" ? C.cyan : C.textSf,
              },
              {
                Ic: Gauge,
                label: "Hatchability",
                value: data.kpi.hatchabilityWeek + "%",
                color: C.blue,
              },
              {
                Ic: ShoppingCart,
                label: "Chick Orders (Wk)",
                value: fmtN(data.kpi.confirmedChicksWeek),
                color: C.amber,
              },
              {
                Ic: Egg,
                label: "Storage Eggs",
                value: fmtN(data.kpi.storageEggsAvailable),
                color: C.purple,
              },
              {
                Ic: Bird,
                label: "DOC Available",
                value: fmtN(data.kpi.totalDOC),
                color: C.green,
              },
              {
                Ic: Users,
                label: "Staff on Duty",
                value: fmtN(data.workforce?.staffTurnoutToday),
                color: C.cyan,
              },
              {
                Ic: Banknote,
                label: "Cash Rcvd (Month)",
                value: fmtCur(data.finance?.cashReceivedMonth),
                color: C.purple,
              },
            ].map(({ Ic, label, value, color }, i) => (
              <div
                key={label}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <Ic size={12} color={color} strokeWidth={2} />
                <span style={{ fontSize: 9.5, color: C.textSf }}>{label}:</span>
                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 700,
                    color,
                    fontFamily: C.mono,
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        )}

        <div id="sec-kpi">
          <KpiStrip
            data={data}
            loading={loading}
            selectedBreed={selectedBreed}
            onBreedChange={setSelectedBreed}
            selectedFarm={selectedFarm}
            onFarmChange={setSelectedFarm}
            selectedYear={selectedYear}
            prevPeriod={prevPeriod}

          />
        </div>
        <div id="sec-hatchery">
          {" "}
          <HatcherySection
            data={data}
            loading={loading}
            selectedBreed={selectedBreed}
            prevPeriod={prevPeriod}

          />
        </div>
        <div id="sec-feedmill">
          {" "}
          <FeedMillSection data={data} loading={loading} />
        </div>
        <div id="sec-sales">
          {" "}
          <SalesSection data={data} loading={loading} />
        </div>
        <div id="sec-finance">
          {" "}
          <FinanceSection data={data} loading={loading}     prevPeriod={prevPeriod} />
        </div>
        <div id="sec-inventory">
          {" "}
          <InventorySection data={data} loading={loading} />
        </div>
        <div id="sec-alerts">
          {" "}
          <AlertsSection data={data} loading={loading} />
        </div>
        <div id="sec-chicken4u">
          {" "}
          <Chicken4USection data={data} loading={loading} />
        </div>
        <div id="sec-workforce">
          {" "}
          <WorkforceSection data={data} loading={loading} />
        </div>
        <div id="sec-monthly">
          <MonthlyTrendSection data={data} loading={loading} selectedYear={selectedYear} />
        </div>

        <div id="sec-prevperiod">
  <PrevPeriodPanel
    data={data} loading={loading}
    prevPeriod={prevPeriod}
  />
</div>

<div id="sec-daterange">
  <CustomRangePanel
    customRange={customRange}
    loading={loading}
  />
</div>

        <p
          style={{
            textAlign: "center",
            padding: "8px 0",
            color: C.textSf,
            fontSize: 10.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <Building2 size={12} color={C.textSf} />
          WAFAD Executive Dashboard · CEO / Chairman View
        </p>
      </main>
    </div>
}  );




