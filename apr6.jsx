import { useState, useEffect, useCallback, useRef } from "react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell,
} from "recharts";
import {
  Bird, TrendingDown, Wheat, Egg, PackageOpen, Trash2,
  CheckCircle2, Clock, Skull, DollarSign, Package,
  Banknote, Tag, AlertTriangle, BarChart2, Flame, ShieldAlert,
  Layers, ShoppingCart, ChevronDown, ChevronUp,
  RefreshCw, FileSpreadsheet, Presentation, Activity, Users,
  UserCog, AlertCircle, Gauge, TrendingUp, Boxes, Zap, Lock,
  CalendarDays, MapPin, ArrowUpRight, ArrowDownRight,
  Building2, Menu, X, Circle, Syringe, Wrench, Store,
} from "lucide-react";

/* ─── CDN Script Loader ─────────────────────────────── */
function loadScript(src) {
  return new Promise((res) => {
    if (document.querySelector(`script[src="${src}"]`)) return res();
    const s = document.createElement("script");
    s.src = src; s.onload = res; document.head.appendChild(s);
  });
}





/* ─── Global Styles ─────────────────────────────────── */
(function injectStyles() {
  const id = "wafad-exec-v6";
  if (document.getElementById(id)) return;
  const s = document.createElement("style");
  s.id = id;
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Sora',sans-serif!important;background:#060A12!important;color:#E8EDF5!important}
    ::-webkit-scrollbar{width:4px;height:4px}
    ::-webkit-scrollbar-thumb{background:#1E4D8C55;border-radius:4px}
    ::-webkit-scrollbar-track{background:transparent}
    @keyframes pulseGlowRed{0%,100%{box-shadow:0 0 14px rgba(239,68,68,0.25)}50%{box-shadow:0 0 32px rgba(239,68,68,0.6)}}
    @keyframes slideUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}
    @keyframes spinAnim{to{transform:rotate(360deg)}}
    @keyframes numberRise{from{opacity:0;transform:translateY(10px) scale(0.94)}to{opacity:1;transform:translateY(0) scale(1)}}
    @keyframes alertPulse{0%,100%{background:rgba(239,68,68,0.05)}50%{background:rgba(239,68,68,0.14)}}
    @keyframes cardEntrance{from{opacity:0;transform:translateY(16px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}
    @keyframes navGlow{0%,100%{box-shadow:0 1px 0 rgba(30,140,255,0.15),0 4px 24px rgba(0,0,0,0.5)}50%{box-shadow:0 1px 0 rgba(30,140,255,0.3),0 4px 24px rgba(0,0,0,0.5)}}
    @keyframes dotPulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.5);opacity:0.6}}
    @keyframes critBadge{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
    @keyframes loaderFadeIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    @keyframes birdFloat{0%,100%{transform:translateY(0px) rotate(-2deg)}50%{transform:translateY(-10px) rotate(2deg)}}
    @keyframes birdGlow{0%,100%{filter:drop-shadow(0 0 8px rgba(30,140,255,0.4))}50%{filter:drop-shadow(0 0 24px rgba(30,140,255,0.9))}}
    @keyframes progressGlow{0%,100%{box-shadow:0 0 8px rgba(30,140,255,0.5)}50%{box-shadow:0 0 20px rgba(30,140,255,0.9),0 0 40px rgba(30,140,255,0.4)}}
    @keyframes gridPulse{0%,100%{opacity:0.04}50%{opacity:0.09}}
    @keyframes titleReveal{from{opacity:0;letter-spacing:.5em;transform:translateY(-8px)}to{opacity:1;letter-spacing:.12em;transform:translateY(0)}}
    @keyframes loaderExit{0%{opacity:1;visibility:visible}100%{opacity:0;visibility:hidden}}
    @keyframes stepPop{from{opacity:0;transform:scale(0.85) translateX(-8px)}to{opacity:1;transform:scale(1) translateX(0)}}
    @keyframes dotRow{0%,80%,100%{transform:scale(1);opacity:0.4}40%{transform:scale(1.4);opacity:1}}
    .slide-up{animation:slideUp 0.5s cubic-bezier(0.22,1,0.36,1) both}
    .fade-in{animation:fadeIn 0.4s ease both}
    .num-rise{animation:numberRise 0.65s cubic-bezier(0.22,1,0.36,1) both}
    .glow-red{animation:pulseGlowRed 2s ease-in-out infinite}
    .spin-ic{animation:spinAnim 1s linear infinite}
    .alert-pulse{animation:alertPulse 2s ease-in-out infinite}
    .crit-badge{animation:critBadge 1.4s ease-in-out infinite}
    .dot-pulse{animation:dotPulse 1.8s ease-in-out infinite}
    .skeleton{background:linear-gradient(90deg,#0D1826 25%,#162033 50%,#0D1826 75%);background-size:600px 100%;animation:shimmer 1.6s infinite;border-radius:6px}
    .nav-pill{transition:all 0.18s cubic-bezier(0.22,1,0.36,1);cursor:pointer;user-select:none;white-space:nowrap}
    .nav-pill:hover{background:rgba(30,140,255,0.12)!important;color:#5BB3FF!important}
    .nav-pill.active{background:rgba(30,140,255,0.2)!important;border-color:rgba(30,140,255,0.55)!important;color:#5BB3FF!important;box-shadow:0 0 12px rgba(30,140,255,0.18)}
    .kpi-card{animation:cardEntrance 0.5s cubic-bezier(0.22,1,0.36,1) both;transition:transform 0.22s cubic-bezier(0.22,1,0.36,1),box-shadow 0.22s}
    .kpi-card:hover{transform:translateY(-4px) scale(1.015);box-shadow:0 8px 32px rgba(0,0,0,0.45),0 0 0 1px rgba(30,140,255,0.2)}
    .alert-row{transition:background 0.18s}
    .alert-row:hover{background:rgba(255,255,255,0.04)!important}
    .xbtn{transition:all 0.16s cubic-bezier(0.22,1,0.36,1)}
    .xbtn:hover{filter:brightness(1.18);transform:translateY(-1px);box-shadow:0 4px 16px rgba(0,0,0,0.3)}
    .tab-btn{transition:all 0.18s}
    .tab-btn:hover{background:rgba(30,140,255,0.12)!important}
    .tab-btn.active{background:rgba(30,140,255,0.2)!important;border-color:rgba(30,140,255,0.6)!important;color:#5BB3FF!important}
    .panel-enter{animation:slideUp 0.55s cubic-bezier(0.22,1,0.36,1) both}
    .mini-card{transition:transform 0.2s,box-shadow 0.2s}
    .mini-card:hover{transform:translateY(-2px);box-shadow:0 4px 16px rgba(0,0,0,0.35)}
    .mob-nav{position:fixed;top:0;left:-260px;width:252px;height:100vh;background:#0D1826;border-right:1px solid rgba(30,140,255,0.14);z-index:600;transition:left 0.28s cubic-bezier(0.4,0,.2,1);overflow-y:auto;padding:16px 10px;display:flex;flex-direction:column}
    .mob-nav.open{left:0}
    .mob-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:590;backdrop-filter:blur(2px)}
    .mob-overlay.show{display:block}
    .top-nav-scroll{overflow-x:auto;scrollbar-width:none}
    .top-nav-scroll::-webkit-scrollbar{display:none}
    .nav-glow{animation:navGlow 4s ease-in-out infinite}
    .loader-wrap{position:fixed;inset:0;z-index:9999;background:#060A12;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden}
    .loader-wrap.exit{animation:loaderExit 0.7s cubic-bezier(0.4,0,0.2,1) forwards;pointer-events:none}
    .loader-grid-bg{position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(rgba(30,140,255,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(30,140,255,0.07) 1px,transparent 1px);background-size:48px 48px;animation:gridPulse 3s ease-in-out infinite}
    .loader-scan{position:absolute;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(30,140,255,0.6),transparent);animation:scanLine 2.4s linear infinite;pointer-events:none}
    @keyframes scanLine{0%{top:0%;opacity:0.6}100%{top:100%;opacity:0}}
    .loader-bird{animation:birdFloat 2.4s ease-in-out infinite,birdGlow 2.4s ease-in-out infinite}
    .loader-title{animation:titleReveal 0.9s cubic-bezier(0.22,1,0.36,1) 0.3s both}
    .loader-sub{animation:loaderFadeIn 0.7s ease 0.7s both}
    .loader-progress-wrap{animation:loaderFadeIn 0.7s ease 0.9s both}
    .loader-progress-bar{animation:progressGlow 1.5s ease-in-out infinite;transition:width 0.4s cubic-bezier(0.22,1,0.36,1)}
    .loader-step{animation:stepPop 0.35s cubic-bezier(0.22,1,0.36,1) both}
    .loader-dots span{display:inline-block;width:6px;height:6px;border-radius:50%;background:#1E8CFF;margin:0 3px}
    .loader-dots span:nth-child(1){animation:dotRow 1.2s ease-in-out 0s infinite}
    .loader-dots span:nth-child(2){animation:dotRow 1.2s ease-in-out 0.2s infinite}
    .loader-dots span:nth-child(3){animation:dotRow 1.2s ease-in-out 0.4s infinite}
    @media(max-width:860px){.top-nav-pills{display:none!important}.mob-ham{display:flex!important}.hdr-date{display:none!important}.hdr-export-lbl{display:none!important}}
    @media(max-width:600px){.kpi-grid{grid-template-columns:repeat(2,1fr)!important}.mini-grid{grid-template-columns:repeat(2,1fr)!important}.two-col{grid-template-columns:1fr!important}.hdr-refresh{display:none!important}.hdr-right{gap:4px!important}}
    @media(max-width:400px){.kpi-grid{grid-template-columns:1fr!important}}
    .mob-ham{display:none}
  `;
  document.head.appendChild(s);
})();

/* ─── Palette ─────────────────────────────────────── */
const C = {
  bg: "#060A12", surf: "#0D1826", surf2: "#101D30", surf3: "#152238",
  border: "rgba(30,140,255,0.12)", borderMd: "rgba(30,140,255,0.25)",
  blue: "#1E8CFF", blueLt: "rgba(30,140,255,0.1)",
  green: "#10D97A", greenLt: "rgba(16,217,122,0.1)",
  red: "#EF4444", redLt: "rgba(239,68,68,0.1)",
  amber: "#F59E0B", amberLt: "rgba(245,158,11,0.1)",
  purple: "#8B5CF6", purpleLt: "rgba(139,92,246,0.1)",
  cyan: "#06B6D4", cyanLt: "rgba(6,182,212,0.1)",
  orange: "#F97316", orangeLt: "rgba(249,115,22,0.1)",
  text: "#E8EDF5", textMd: "#8FA3C0", textSf: "#4A6A90",
  mono: "'JetBrains Mono',monospace",
};

const ZOHO_APP = "poultry-management";

/* ─── Helpers ────────────────────────────────────── */
const num = v => { const n = parseFloat(v); return isNaN(n) ? 0 : n; };
const fv = (rec, f) => {
  if (!rec || !f) return null;
  const v = rec[f];
  if (!v) return null;
  return typeof v === "object" ? (v.zc_display_value || v.display_value || v.Name || null) : v;
};
// displayVal: handles nested lookup objects from field visit reports
const displayVal = v => {
  if (v === null || v === undefined) return "";
  if (typeof v === "object") return (v.zc_display_value ?? v.display_value ?? v.name ?? "").toString();
  return v.toString();
};
const fmtN = (n, d = 0) => n == null ? "—" : Number(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtCur = n => { if (!n) return "GHC 0"; if (n >= 1e9) return `GHC ${(n / 1e9).toFixed(1)}B`; if (n >= 1e6) return `GHC ${(n / 1e6).toFixed(1)}M`; if (n >= 1e3) return `GHC ${(n / 1e3).toFixed(0)}K`; return `GHC ${n}`; };
const fmtK = n => n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(0)}K` : `${n}`;
const addBreed = (map, breed, qty) => { if (!breed) return; map[breed] = (map[breed] ?? 0) + qty; };
const isFeedProduct = (name, type) => {
  const u = (name + " " + type).toUpperCase();
  return u.includes("FEED") || u.includes("MASH") || u.includes("PELLET") || u.includes("STARTER") || u.includes("FINISHER") || u.includes("GROWER");
};
const classifyC4uProduct = (productName, productType) => {
  const u = (productName + " " + productType).toUpperCase();
  if (u.includes("GRANGER") || u.includes("COCK") || u.includes("LAYER") || u.includes("NOVO") || u.includes("BROILER")) return "chick";
  if (isFeedProduct(productName, productType)) return "feed";
  if (u.includes("MEDIC") || u.includes("VACCINE") || u.includes("DRUG") || u.includes("VITAMIN") || u.includes("ANTIBIOTIC") || u.includes("DEWORM")) return "medication";
  if (u.includes("DISINFECT") || u.includes("CLEAN") || u.includes("SANITIZ")) return "sanitation";
  if (u.includes("EQUIP") || u.includes("FEEDER") || u.includes("DRINKER") || u.includes("WATERER") || u.includes("CAGE") || u.includes("LAMP") || u.includes("BULB")) return "equipment";
  return "other";
};

/* ─── Zoho sequential fetcher with pagination ──────── */
async function zohoGetAll(report, max = 1000) {
  console.log(`[WAFAD] Fetching report: ${report}`);
  const all = [];
  let cursor = null;
  let page = 1;
  try {
    while (true) {
      const config = { app_name: ZOHO_APP, report_name: report, field_config: "all", max_records: max };
      if (cursor) config.record_cursor = cursor;
      const r = await window.ZOHO?.CREATOR?.DATA?.getRecords(config);
      if (!r || (r.code !== 3000 && r.code !== undefined)) { console.warn(`[WAFAD] ${report} page ${page} → code:${r?.code}`); break; }
      const records = r?.data ?? [];
      all.push(...records);
      console.log(`[WAFAD] ${report} page ${page}: +${records.length} (total: ${all.length})`);
      cursor = r?.record_cursor ?? null;
      if (!cursor || records.length < max) break;
      page++;
    }
  } catch (e) { console.error(`[WAFAD] zohoGetAll(${report}) ERROR:`, e); }
  console.log(`[WAFAD] ${report} TOTAL: ${all.length}`);
  return all;
}

/* ─── Date helpers ───────────────────────────────── */
function getDateBounds() {
  const now = new Date();
  const weekStart = new Date(now); weekStart.setDate(now.getDate() - now.getDay()); weekStart.setHours(0, 0, 0, 0);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const weekEnd = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 6); weekEnd.setHours(23, 59, 59, 999);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0); monthEnd.setHours(23, 59, 59, 999);
  return { now, weekStart, monthStart, weekEnd, monthEnd };
}

/* ═════════════════════════════════════════════════════
   DATA LOADER
═════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════════
   loadAllData — v2  (real field names from Zoho schema)
   Key corrections vs v1:
   - Daily ops mortality: Mortality_Count_Px (female/pullets),
     Mortality_Count_Cx (male/cockerels), Total_Mortality_Count (total)
   - Daily ops feed: Total_Feed_Consumed (single correct field)
   - Egg subform: Egg_Collection_Details → Hatchable_eggs, Collected_Eggs,
     Farm_Rejected_Eggs, Cracked_eggs, Dirty_eggs, Floor_eggs, Breed_Name
   - Sales Order status: "invoiced","open","closed","fulfilled" (not "confirmed")
   - Customer on SO: Customer field (number/lookup — use displayVal)
   - All_Invoices: real revenue, receivables, customer ranking
   - All_Operational_Requests: real expenditure
   - Leave: From / To date fields
═══════════════════════════════════════════════════════════════════ */
async function loadAllData() {
  console.log("=== [WAFAD] Starting full data load ===");
  const { now, weekStart, monthStart, weekEnd, monthEnd } = getDateBounds();

  // Previous period bounds (computed once, reused everywhere)
  const lastWeekStart = new Date(weekStart); lastWeekStart.setDate(lastWeekStart.getDate() - 7);
  const lastWeekEnd = new Date(weekStart); lastWeekEnd.setDate(lastWeekEnd.getDate() - 1);
  const lastMonthStart = new Date(monthStart); lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
  const lastMonthEnd = new Date(monthStart); lastMonthEnd.setDate(lastMonthEnd.getDate() - 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  /* ─────────────────────────────────────────────────────────────────
     1. FLOCK MASTER
     Fields: Pullets_Housed, Cockerels_Housed, Birds_Female_Current,
             Birds_Male_Current, Total_Birds_Housed, Breed_Name,
             Production_Type, Flock_Status
  ───────────────────────────────────────────────────────────────── */
  const flocks = await zohoGetAll("All_Flock_Management");
  console.log("[WAFAD] Flock count:", flocks.length,
    "| sample keys:", flocks[0] ? Object.keys(flocks[0]).join(", ") : "EMPTY");

  let totalPulletsHoused = 0, totalCockerelsHoused = 0, totalBirdsPlaced = 0;
  let femaleAliveCurrent = 0, maleAliveCurrent = 0;
  const breedMap = {};

  flocks.forEach(f => {
    const pullets = num(fv(f, "Pullets_Housed"));
    const cockerels = num(fv(f, "Cockerels_Housed"));
    const femaleCur = num(fv(f, "Birds_Female_Current"));
    const maleCur = num(fv(f, "Birds_Male_Current"));
    const total = num(fv(f, "Total_Birds_Housed")) || (pullets + cockerels);
    const breed = displayVal(f.Breed_Name || "") || "Unknown";

    totalPulletsHoused += pullets;
    totalCockerelsHoused += cockerels;
    totalBirdsPlaced += total;
    // Use current counts if available, otherwise fall back to housed counts
    femaleAliveCurrent += femaleCur > 0 ? femaleCur : pullets;
    maleAliveCurrent += maleCur > 0 ? maleCur : cockerels;

    if (breed && breed !== "Unknown") {
      breedMap[breed] = (breedMap[breed] || 0) + total;
    }
  });

  const birdsAliveTotal = femaleAliveCurrent + maleAliveCurrent;

  /* ─────────────────────────────────────────────────────────────────
     2. BREEDER DAILY OPS
     Key fields:
       Total_Feed_Consumed     — total feed used (kg)
       Total_Mortality_Count   — total deaths
       Mortality_Count_Px      — female (pullet) deaths
       Mortality_Count_Cx      — male (cockerel) deaths
       Total_Egg_Collected     — all eggs
       Total_Hatchable_Eggs    — hatchable subset
       Total_Farm_Rejected_Eggs
       Breeder_Farm            — farm lookup (for worst-farm calc)
       Egg_Collection_Details  — subform with per-breed egg breakdown
  ───────────────────────────────────────────────────────────────── */
  const dailyOps = await zohoGetAll("ALL_WAFAD_BREEDER_FARM_DAILY_OPS", 1000);
  console.log("[WAFAD] DailyOps count:", dailyOps.length,
    "| sample:", dailyOps[0] ? JSON.stringify(dailyOps[0], null, 2).slice(0, 400) : "EMPTY");

  let totalMortality = 0;
  let mortalityThisWeek = 0, mortalityThisMonth = 0, mortalityThisYear = 0;
  let mortalityLastWeek = 0, mortalityLastMonth = 0;
  let mortalityFemale = 0, mortalityMale = 0; // Px=female, Cx=male

  let eggsThisWeek = 0, eggsThisMonth = 0, eggsThisYear = 0;
  let hatchingEggsWeek = 0, hatchingEggsMonth = 0;
  let farmRejectedEggs = 0, crackedEggs = 0, dirtyEggs = 0, floorEggs = 0;

  // Feed — use Total_Feed_Consumed
  let feedIntakeTonsWeek = 0, feedIntakeTonsMonth = 0;

  const weeklyEggTrend = {}, farmMort = {};

  dailyOps.forEach(r => {
    const rawDate = fv(r, "Date_field") || fv(r, "Added_Time");
    const recDate = rawDate ? new Date(rawDate) : null;

    // ── Mortality (real female/male split from Px/Cx fields)
    const mortTotal = num(fv(r, "Total_Mortality_Count") || fv(r, "Total_Quantity_Mortality"));
    const mortFemale = num(fv(r, "Mortality_Count_Px")); // Px = Pullet = Female
    const mortMale = num(fv(r, "Mortality_Count_Cx")); // Cx = Cockerel = Male
    const farm = displayVal(r.Breeder_Farm || "") || fv(r, "Breeder_Farm") || "";

    totalMortality += mortTotal;
    mortalityFemale += mortFemale;
    mortalityMale += mortMale;
    if (farm) farmMort[farm] = (farmMort[farm] || 0) + mortTotal;

    // ── Feed (Total_Feed_Consumed in kg → convert to MT)
    const feedKg = num(fv(r, "Total_Feed_Consumed"));

    // ── Eggs from top-level totals (fast path)
    const eggs = num(fv(r, "Total_Egg_Collected"));
    const hatchEggs = num(fv(r, "Total_Hatchable_Eggs"));
    const farmRej = num(fv(r, "Total_Farm_Rejected_Eggs"));
    const cracked = num(fv(r, "Total_Cracked_Eggs"));
    const dirty = num(fv(r, "Total_Dirty_Eggs"));
    const floor_ = num(fv(r, "Total_Floor_Eggs"));

    farmRejectedEggs += farmRej;
    crackedEggs += cracked;
    dirtyEggs += dirty;
    floorEggs += floor_;

    const weekNum = num(fv(r, "Week_Number") || fv(r, "Age_of_Birds_Weeks"));

    if (recDate) {
      if (recDate >= weekStart) {
        mortalityThisWeek += mortTotal;
        eggsThisWeek += eggs;
        hatchingEggsWeek += hatchEggs;
        feedIntakeTonsWeek += feedKg / 1000;
      }
      if (recDate >= monthStart) {
        mortalityThisMonth += mortTotal;
        eggsThisMonth += eggs;
        hatchingEggsMonth += hatchEggs;
        feedIntakeTonsMonth += feedKg / 1000;
      }
      if (recDate >= yearStart) { mortalityThisYear += mortTotal; eggsThisYear += eggs; }
      if (recDate >= lastWeekStart && recDate <= lastWeekEnd) mortalityLastWeek += mortTotal;
      if (recDate >= lastMonthStart && recDate <= lastMonthEnd) mortalityLastMonth += mortTotal;
    }

    if (weekNum > 0) {
      if (!weeklyEggTrend[weekNum])
        weeklyEggTrend[weekNum] = { week: weekNum, eggs: 0, feed: 0, mort: 0 };
      weeklyEggTrend[weekNum].eggs += eggs;
      weeklyEggTrend[weekNum].feed += feedKg / 1000;
      weeklyEggTrend[weekNum].mort += mortTotal;
    }
  });

  const birdsAlive = Math.max(0, totalBirdsPlaced - totalMortality);
  const mortalityPct = totalBirdsPlaced > 0
    ? parseFloat(((totalMortality / totalBirdsPlaced) * 100).toFixed(2)) : 0;
  const worstFarm = Object.entries(farmMort).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  const avgEggProductionRate = birdsAliveTotal > 0
    ? parseFloat(((eggsThisMonth / Math.max(1, birdsAliveTotal)) * 100).toFixed(1)) : 0;

  const eggsWeeklyTrend = Object.values(weeklyEggTrend)
    .sort((a, b) => a.week - b.week).slice(-6)
    .map(w => ({ w: `Wk ${w.week}`, eggs: w.eggs, feed: parseFloat(w.feed.toFixed(1)), mort: w.mort }));

  /* ─────────────────────────────────────────────────────────────────
     3. DETAILED DAILY OPS (feed mill produced/issued per day)
     Fields: Feed_Consumed_Kg_Px, Feed_Consumed_Kg_Cx, Date_field
  ───────────────────────────────────────────────────────────────── */
  const detailedOps = await zohoGetAll("Detailed_Daily_Ops_Report", 1000);
  console.log("[WAFAD] DetailedOps count:", detailedOps.length);

  let feedProducedMT = 0, feedIssuedMT = 0;
  let feedProducedWeekMT = 0, feedIssuedWeekMT = 0, feedProducedYearMT = 0;
  const feedDayMap = {};

  detailedOps.forEach(r => {
    const rawDate = fv(r, "Date_field") || fv(r, "Added_Time");
    const recDate = rawDate ? new Date(rawDate) : null;
    const feedPx = num(fv(r, "Feed_Consumed_Kg_Px"));
    const feedCx = num(fv(r, "Feed_Consumed_Kg_Cx"));
    const totalFeed = feedPx + feedCx;

    if (recDate && recDate >= yearStart) feedProducedYearMT += totalFeed / 1000;
    if (recDate && recDate >= monthStart) {
      feedProducedMT += totalFeed / 1000;
      feedIssuedMT += (totalFeed * 0.97) / 1000;
      const dayKey = recDate.toLocaleDateString("en-US", { weekday: "short" });
      if (!feedDayMap[dayKey]) feedDayMap[dayKey] = { d: dayKey, prod: 0, issued: 0 };
      feedDayMap[dayKey].prod += parseFloat((totalFeed / 1000).toFixed(2));
      feedDayMap[dayKey].issued += parseFloat(((totalFeed * 0.97) / 1000).toFixed(2));
    }
    if (recDate && recDate >= weekStart) {
      feedProducedWeekMT += totalFeed / 1000;
      feedIssuedWeekMT += (totalFeed * 0.97) / 1000;
    }
  });

  const DAYS_ORDER = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const feedTrend = DAYS_ORDER.filter(d => feedDayMap[d])
    .map(d => ({ d, prod: parseFloat(feedDayMap[d].prod.toFixed(1)), issued: parseFloat(feedDayMap[d].issued.toFixed(1)) }));

  /* ─────────────────────────────────────────────────────────────────
     4. HATCHERY
     Fields: Settable_Eggs, Fertile_Eggs, Good_Chicks,
             Poor_Hatch_Culls / Poor_Chicks, Setting_Date
  ───────────────────────────────────────────────────────────────── */
  const hatchSF = await zohoGetAll("hatches_SF_Report");
  console.log("[WAFAD] HatchSF count:", hatchSF.length,
    "| sample:", hatchSF[0] ? JSON.stringify(hatchSF[0], null, 2).slice(0, 300) : "EMPTY");

  let eggsSetWeek = 0, eggsSetMonth = 0, eggsSetYear = 0;
  let eggsSetLastWeek = 0, eggsSetLastMonth = 0;
  let goodChicksWeek = 0, goodChicksMonth = 0, goodChicksYear = 0;
  let goodChicksLastWeek = 0, goodChicksLastMonth = 0;
  let poorChicksMonth = 0, fertileEggsMonth = 0;
  const hatchBatchMap = {};

  hatchSF.forEach(h => {
    const rawDate = fv(h, "Hatches.Setting_Date") || fv(h, "Setting_Date");
    const recDate = rawDate ? new Date(rawDate) : null;
    const settable = num(fv(h, "Settable_Eggs"));
    const fertile = num(fv(h, "Fertile_Eggs"));
    const good = num(fv(h, "Good_Chicks"));
    const poor = num(fv(h, "Poor_Hatch_Culls") || fv(h, "Poor_Chicks"));
    const batch = fv(h, "Hatches") || fv(h, "Batch_No") || "B";

    if (!hatchBatchMap[batch]) hatchBatchMap[batch] = { set: 0, fertile: 0, hatched: 0 };
    hatchBatchMap[batch].set += settable;
    hatchBatchMap[batch].fertile += fertile;
    hatchBatchMap[batch].hatched += good;

    if (recDate) {
      if (recDate >= yearStart) { eggsSetYear += settable; goodChicksYear += good; }
      if (recDate >= monthStart) { eggsSetMonth += settable; goodChicksMonth += good; poorChicksMonth += poor; fertileEggsMonth += fertile; }
      if (recDate >= weekStart) { eggsSetWeek += settable; goodChicksWeek += good; }
      if (recDate >= lastWeekStart && recDate <= lastWeekEnd) { eggsSetLastWeek += settable; goodChicksLastWeek += good; }
      if (recDate >= lastMonthStart && recDate <= lastMonthEnd) { eggsSetLastMonth += settable; goodChicksLastMonth += good; }
    }
  });

  const hatchWeeklyTrend = Object.entries(hatchBatchMap)
    .sort((a, b) => String(a[0]).localeCompare(String(b[0]))).slice(-4)
    .map(([, d], i) => ({ w: `Batch ${i + 1}`, set: d.set, fertile: d.fertile, hatched: d.hatched }));

  const hatchabilityWeek = eggsSetWeek > 0 ? parseFloat(((goodChicksWeek / eggsSetWeek) * 100).toFixed(1)) : 0;
  const hatchabilityMonth = eggsSetMonth > 0 ? parseFloat(((goodChicksMonth / eggsSetMonth) * 100).toFixed(1)) : 0;
  const hatchabilityYear = eggsSetYear > 0 ? parseFloat(((goodChicksYear / eggsSetYear) * 100).toFixed(1)) : 0;
  const fertilityRate = eggsSetMonth > 0 ? parseFloat(((fertileEggsMonth / eggsSetMonth) * 100).toFixed(1)) : 0;

  /* ─────────────────────────────────────────────────────────────────
     5. ALL_INVOICES — real revenue & customer ranking
     Status values seen: Draft, Sent, Paid, Overdue, Void, etc.
     Fields: Total_Amount, Status, Customer (lookup), Date_field,
             Product_Name, Product_Details_Invoice (subform)
  ───────────────────────────────────────────────────────────────── */
  const invoices = await zohoGetAll("All_Invoices");
  console.log("[WAFAD] Invoices count:", invoices.length,
    "| sample:", invoices[0] ? JSON.stringify(invoices[0], null, 2).slice(0, 400) : "EMPTY");

  let revenueWeek = 0, revenueMonth = 0, revenueYear = 0;
  let receivablesWeek = 0, receivablesMonth = 0, receivablesTotal = 0;
  const custMap = {}, productRevenueMap = {};

  invoices.forEach(inv => {
    const rawDate = fv(inv, "Date_field") || fv(inv, "Added_Time");
    const recDate = rawDate ? new Date(rawDate) : null;
    const amount = num(fv(inv, "Total_Amount"));
    const status = (fv(inv, "Status") || "").toLowerCase().trim();
    // Customer is a lookup (number type in schema) — use displayVal to get name
    const customer = displayVal(inv.Customer || "") || fv(inv, "Customer") || "Unknown";
    const prodName = displayVal(inv.Product_Name || "") || "Other";

    const isPaid = status === "paid";
    const isUnpaid = status === "draft" || status === "submitted" || status === "viewed" || status === "open";

    if (isPaid && recDate) {
      if (recDate >= yearStart) revenueYear += amount;
      if (recDate >= monthStart) revenueMonth += amount;
      if (recDate >= weekStart) revenueWeek += amount;
    }
    if (isUnpaid) {
      receivablesTotal += amount;
      if (recDate && recDate >= monthStart) receivablesMonth += amount;
      if (recDate && recDate >= weekStart) receivablesWeek += amount;
    }

    // All invoices (any non-void status) count for customer ranking
    if (status !== "void" && status !== "draft" && amount > 0) {
      custMap[customer] = (custMap[customer] || 0) + amount;
    }
    if (prodName && amount > 0) {
      productRevenueMap[prodName] = (productRevenueMap[prodName] || 0) + amount;
    }
  });

  const top20Customers = Object.entries(custMap)
    .sort((a, b) => b[1] - a[1]).slice(0, 20)
    .map(([name, revenue]) => ({ name, qty: revenue }));

  console.log("[WAFAD] Top customers:", top20Customers.slice(0, 5));

  /* ─────────────────────────────────────────────────────────────────
     6. SALES ORDERS — order counts & regional demand
     Status: Draft | Open | Invoiced | Closed | Fulfilled | Void
     Confirmed = Invoiced + Closed + Fulfilled
     Pending   = Draft + Open
     Customer  = lookup (number) → use displayVal
  ───────────────────────────────────────────────────────────────── */
  const salesOrders = await zohoGetAll("Sales_Order_Report");
  console.log("[WAFAD] SalesOrders count:", salesOrders.length,
    "| statuses seen:", [...new Set(salesOrders.map(o => fv(o, "Status") || "null"))].join(", "));

  let confirmedOrdersWeek = 0, confirmedOrdersMonth = 0, confirmedOrdersYear = 0;
  let pendingOrdersWeek = 0, pendingOrdersMonth = 0;
  const regionMap = {};

  // Confirmed = order is actually processed/invoiced/fulfilled
  const CONFIRMED_STATUSES = new Set(["invoiced", "closed", "fulfilled"]);
  // Pending = not yet converted to an invoice
  const PENDING_STATUSES = new Set(["draft", "open"]);

  salesOrders.forEach(o => {
    const status = (fv(o, "Status") || "").toLowerCase().trim();
    const rawDate = fv(o, "Date_field") || fv(o, "Added_Time");
    const recDate = rawDate ? new Date(rawDate) : null;

    let orderQty = 0;
    const productLines = o.Product_Details_SF;
    if (Array.isArray(productLines)) {
      productLines.forEach(p => {
        orderQty += num(fv(p, "Quantity"));
      });
    }
    const qty = orderQty || 1;

    // Regional demand (use customer region if available, else "Other")
    const region = displayVal(o.Region || o["Customer.Region"] || "") || "Other";
    if (!regionMap[region]) regionMap[region] = 0;
    regionMap[region] += qty;

    if (CONFIRMED_STATUSES.has(status)) {
      if (recDate && recDate >= yearStart) confirmedOrdersYear += qty;
      if (recDate && recDate >= monthStart) confirmedOrdersMonth += qty;
      if (recDate && recDate >= weekStart) confirmedOrdersWeek += qty;
    } else if (PENDING_STATUSES.has(status)) {
      if (recDate && recDate >= monthStart) pendingOrdersMonth += qty;
      if (recDate && recDate >= weekStart) pendingOrdersWeek += qty;
    }
  });

  const REGION_COLORS = [C.blue, C.green, C.amber, C.purple, C.cyan, C.orange];
  const regionalDemand = Object.entries(regionMap)
    .sort((a, b) => b[1] - a[1]).slice(0, 6)
    .map(([region, orders], i) => ({ region, orders, color: REGION_COLORS[i] }));

  /* ─────────────────────────────────────────────────────────────────
     7. PAYMENTS RECEIVED
  ───────────────────────────────────────────────────────────────── */
  const payments = await zohoGetAll("Payment_Received_Report");
  let cashReceivedWeek = 0, cashReceivedMonth = 0, cashReceivedYear = 0;

  payments.forEach(p => {
    const amt = num(fv(p, "Amount_Received"));
    const rawDate = fv(p, "Payment_Date") || fv(p, "Added_Time");
    const recDate = rawDate ? new Date(rawDate) : null;
    if (recDate && recDate >= yearStart) cashReceivedYear += amt;
    if (recDate && recDate >= monthStart) cashReceivedMonth += amt;
    if (recDate && recDate >= weekStart) cashReceivedWeek += amt;
  });

  /* ─────────────────────────────────────────────────────────────────
     8. ALL_OPERATIONAL_REQUESTS — real expenditure
     Key fields: Actual_Total_Cost, Status, Finance_Status,
                 Payment_Status, Request_Type, Main_Category,
                 Requested_Date_And_Time
     Approved = Status=="approved" OR Finance_Status=="posted"
  ───────────────────────────────────────────────────────────────── */
  const opRequests = await zohoGetAll("All_Operational_Requests");
  console.log("[WAFAD] OpRequests count:", opRequests.length,
    "| sample statuses:", [...new Set(opRequests.slice(0, 20).map(r => fv(r, "Status") || "null"))].join(", "));

  let totalExpenseWeek = 0, totalExpenseMonth = 0, totalExpenseYear = 0;
  let feedExpenseMonth = 0, vetExpenseMonth = 0, labourExpenseMonth = 0;
  let pendingPaymentsCount = 0, approvedNotPaidCount = 0;
  const expenseByCategoryMonth = {};

  opRequests.forEach(r => {
    const rawDate = fv(r, "Requested_Date_And_Time") || fv(r, "Added_Time");
    const recDate = rawDate ? new Date(rawDate) : null;
    const amount = num(fv(r, "Actual_Total_Cost") || 0);
    const status = (fv(r, "Status") || "").toLowerCase().trim();
    const finStatus = (fv(r, "Finance_Status") || "").toLowerCase().trim();
    const payStatus = (fv(r, "Payment_Status") || "").toLowerCase().trim();
    const reqType = (fv(r, "Request_Type") || "Other").toString();
    const mainCat = displayVal(r.Main_Category || "") || "Other";

    const isApproved = status === "approved" || finStatus === "posted" || finStatus === "approved";
    const isPaid = payStatus === "paid";

    if (!isPaid && isApproved) approvedNotPaidCount++;
    if (status === "pending" || status === "requested" || status === "new") pendingPaymentsCount++;

    if (isApproved && recDate) {
      if (recDate >= yearStart) totalExpenseYear += amount;
      if (recDate >= weekStart) totalExpenseWeek += amount;
      if (recDate >= monthStart) {
        totalExpenseMonth += amount;
        expenseByCategoryMonth[mainCat] = (expenseByCategoryMonth[mainCat] || 0) + amount;

        // Classify into key cost buckets
        const rtUp = reqType.toUpperCase();
        if (rtUp.includes("FEED") || rtUp.includes("RAW")) feedExpenseMonth += amount;
        else if (rtUp.includes("MED") || rtUp.includes("VET") || rtUp.includes("VACC")) vetExpenseMonth += amount;
        else if (rtUp.includes("LABOUR") || rtUp.includes("SALARY") || rtUp.includes("STAFF")) labourExpenseMonth += amount;
      }
    }
  });

  // Cost per feed kg: prefer real expense data, fallback to GHC 285
  const costPerFeedKg = feedIntakeTonsMonth > 0 && feedExpenseMonth > 0
    ? Math.round(feedExpenseMonth / (feedIntakeTonsMonth * 1000)) : 285;

  const costPerHatchingEgg = eggsSetMonth > 0 && totalExpenseMonth > 0
    ? Math.round(totalExpenseMonth / eggsSetMonth) : 0;

  const costPerChickWeek = goodChicksWeek > 0 && cashReceivedWeek > 0
    ? Math.round((cashReceivedWeek * 0.6) / goodChicksWeek) : 0;
  const costPerChickLastWk = goodChicksLastWeek > 0 && cashReceivedWeek > 0
    ? Math.round((cashReceivedWeek * 0.6) / goodChicksLastWeek) : 0;

  // Gross margin: revenue vs expenses
  const grossMargin = revenueMonth > 0
    ? parseFloat(((revenueMonth - totalExpenseMonth) / revenueMonth * 100).toFixed(1)) : 0;

  // Margin by product from invoices
  const margins = Object.entries(productRevenueMap)
    .sort((a, b) => b[1] - a[1]).slice(0, 4)
    .map(([product, rev]) => ({
      product: product.length > 14 ? product.slice(0, 14) + "…" : product,
      margin: revenueMonth > 0 ? parseFloat(((rev / revenueMonth) * 100).toFixed(1)) : 0,
    }))
    .filter(m => m.margin > 0);

  // Budget vs actual — only lines with real data
  const budgetVsActual = [
    feedExpenseMonth > 0 ? { line: "Feed Cost", budget: feedIntakeTonsMonth * 1000 * costPerFeedKg * 1.05, actual: feedExpenseMonth } : null,
    labourExpenseMonth > 0 ? { line: "Labour", budget: 0, actual: labourExpenseMonth } : null,
    vetExpenseMonth > 0 ? { line: "Veterinary", budget: 0, actual: vetExpenseMonth } : null,
    totalExpenseMonth > 0 ? { line: "Total OpEx", budget: 0, actual: totalExpenseMonth } : null,
  ].filter(Boolean).filter(b => b.actual > 0);

  /* ─────────────────────────────────────────────────────────────────
     9. PRODUCTS & STOCK
  ───────────────────────────────────────────────────────────────── */
  const products = await zohoGetAll("Product_Details_Report");
  let totalStockValue = 0;
  const criticalStock = [], productStockList = [];

  products.forEach(prod => {
    const name = fv(prod, "Product_Name") || "—";
    const minStock = num(fv(prod, "Min_Stock"));
    const totalAvail = num(fv(prod, "Total_Available_Stock"));
    const status = (fv(prod, "Status") || "").toLowerCase();
    totalStockValue += totalAvail;
    if (status !== "inactive") {
      productStockList.push({ name, stock: totalAvail, min: minStock });
      if (totalAvail <= minStock && minStock > 0) {
        criticalStock.push({ item: name, status: totalAvail === 0 ? "Critical" : "Low", stock: totalAvail });
      }
    }
  });

  /* ─────────────────────────────────────────────────────────────────
     10. EMPLOYEES
  ───────────────────────────────────────────────────────────────── */
  const employees = await zohoGetAll("All_Employees");
  let totalStaff = 0, activeStaff = 0;
  const deptMap = {};

  employees.forEach(e => {
    totalStaff++;
    const empStatus = (fv(e, "Employee_Status") || "").toLowerCase();
    if (empStatus === "active" || empStatus === "") activeStaff++;
    const dept = displayVal(e.Department || "") || fv(e, "Department") || "Other";
    if (!deptMap[dept]) deptMap[dept] = 0;
    deptMap[dept]++;
  });

  const deptProductivity = Object.entries(deptMap)
    .map(([dept, count]) => ({ dept: dept.length > 12 ? dept.slice(0, 12) + "…" : dept, score: count }))
    .sort((a, b) => b.score - a.score).slice(0, 6);

  /* ─────────────────────────────────────────────────────────────────
     11. LEAVE — uses real From / To date fields
     Status: Requested | Approved | Rejected | Recalled
  ───────────────────────────────────────────────────────────────── */
  const leaves = await zohoGetAll("Leave_Form_Report");
  console.log("[WAFAD] Leaves count:", leaves.length,
    "| sample:", leaves[0] ? JSON.stringify(leaves[0], null, 2).slice(0, 300) : "EMPTY");

  let staffOnLeaveToday = 0, openLeaveRequests = 0;
  let leaveThisWeek = 0, leaveThisMonth = 0;
  const leaveByDept = {};

  leaves.forEach(l => {
    const leaveStatus = (fv(l, "Status") || "").toLowerCase().trim();
    // Use "From" and "To" — confirmed from screenshot
    const rawFrom = fv(l, "From");
    const rawTo = fv(l, "To");
    const fromDate = rawFrom ? new Date(rawFrom) : null;
    const toDate = rawTo ? new Date(rawTo) : null;
    const dept = displayVal(l.Department || "") || fv(l, "Department") || "Unknown";

    if (leaveStatus === "approved") {
      // Is this leave active right now (today falls within From..To)?
      if (fromDate && toDate && fromDate <= now && toDate >= now) {
        staffOnLeaveToday++;
        leaveByDept[dept] = (leaveByDept[dept] || 0) + 1;
      }
      // Overlaps this week
      if (fromDate && toDate && fromDate <= weekEnd && toDate >= weekStart) leaveThisWeek++;
      // Overlaps this month
      if (fromDate && toDate && fromDate <= monthEnd && toDate >= monthStart) leaveThisMonth++;
    } else if (leaveStatus === "requested" || leaveStatus === "pending") {
      openLeaveRequests++;
    }
  });

  const absenteeismPct = activeStaff > 0
    ? parseFloat(((staffOnLeaveToday / activeStaff) * 100).toFixed(1)) : 0;

  /* ─────────────────────────────────────────────────────────────────
     12. CHICKEN4U (unchanged — logic correct, field names verified)
  ───────────────────────────────────────────────────────────────── */
  const c4uParents = await zohoGetAll("Field_Visit_Sales_Order_Report");
  const c4uSF = await zohoGetAll("Field_Visit_Sales_Order_Master_SF_Report");
  const muoProfiles = await zohoGetAll("All_Muo_Profiles");
  const learnerRecs = await zohoGetAll("All_Learner_Registrations");
  const certifiedLearners = learnerRecs
    .filter(r => (r.Status ?? "").toString().toLowerCase().trim() === "certified").length;

  let muoMale = 0, muoFemale = 0;
  muoProfiles.forEach(r => {
    const g = (r.Gender ?? "").toString().toLowerCase().trim();
    if (g === "male") muoMale++; else if (g === "female") muoFemale++;
  });

  const orderMetaMap = new Map();
  for (const rec of c4uParents) {
    const orderId = String(rec.ID ?? "");
    const statusRaw = displayVal(rec.Order_Status ?? rec.Status ?? "").toLowerCase().trim();
    const isDelivered = statusRaw === "delivered";
    const isPaid = displayVal(rec.Payment_Status ?? "").toLowerCase().trim() === "paid";
    const muoName = displayVal(rec["MUO.MUO_Name"] ?? rec["MUO.Name"] ?? rec["MUO.Full_Name"] ?? rec.MUO ?? "").trim();
    const satoName = displayVal(rec["SATO.SATO_Name"] ?? rec["SATO.Name"] ?? rec["SATO.Full_Name"] ?? rec.SATO ?? "").trim();
    let expectedDate = null;
    const edd = rec.Expected_Delivery_Date ?? rec.Expected_Date ?? rec.Delivery_Date ?? "";
    if (edd) { try { expectedDate = new Date(edd); } catch (e) { } }
    orderMetaMap.set(orderId, { isDelivered, isPaid, muoName, satoName, expectedDate, statusRaw });
  }

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

  for (const row of c4uSF) {
    const qty = Number(row.Quantity ?? 0);
    if (qty === 0) continue;
    const orderId = row.SO_Reference?.ID;
    if (!orderId) continue;
    const meta = orderMetaMap.get(String(orderId));
    if (!meta) continue;
    const { isDelivered, isPaid, muoName, satoName, expectedDate, statusRaw } = meta;

    if (!seenOrders.has(orderId)) {
      seenOrders.add(orderId);
      if (isDelivered) c4uOrdersDel++; else c4uOrdersPend++;
    }

    const productName = displayVal(row.Product ?? "").trim();
    const productType = displayVal(row.Product_Type ?? "").trim();
    const productKey = productName || productType || "Unknown";
    const category = classifyC4uProduct(productName, productType);
    const nameUp = productName.toUpperCase();

    if (!c4uAllProducts[productKey]) c4uAllProducts[productKey] = { ordered: 0, delivered: 0, pending: 0, category };
    c4uAllProducts[productKey].ordered += qty;
    if (isDelivered) c4uAllProducts[productKey].delivered += qty;
    else c4uAllProducts[productKey].pending += qty;

    if (category === "feed") {
      c4uFeedKgOrdered += qty;
      if (isDelivered) c4uFeedKgDelivered += qty; else c4uFeedKgPending += qty;
    }

    if (nameUp.includes("GRANGER") || nameUp.includes("COCK")) {
      c4uGrangers += qty; addBreed(c4uGrangerBreeds, productType, qty);
      if (isDelivered) { c4uGrangersDel += qty; addBreed(c4uGrangerBreedsDel, productType, qty); }
      else { c4uGrangersPend += qty; addBreed(c4uGrangerBreedsPend, productType, qty); }
    } else if (nameUp.includes("LAYER") || nameUp.includes("NOVO")) {
      c4uLayers += qty; addBreed(c4uLayerBreeds, productType, qty);
      if (isDelivered) { c4uLayersDel += qty; addBreed(c4uLayerBreedsDel, productType, qty); }
      else { c4uLayersPend += qty; addBreed(c4uLayerBreedsPend, productType, qty); }
    } else if (nameUp.includes("BROILER")) {
      c4uBroilers += qty; addBreed(c4uBroilerBreeds, productType, qty);
      if (isDelivered) { c4uBroilersDel += qty; addBreed(c4uBroilerBreedsDel, productType, qty); }
      else { c4uBroilersPend += qty; addBreed(c4uBroilerBreedsPend, productType, qty); }
    }

    if (muoName && category === "chick") {
      if (!c4uMuoMap[muoName]) c4uMuoMap[muoName] = { ordered: 0, delivered: 0 };
      c4uMuoMap[muoName].ordered += qty;
      if (isDelivered) c4uMuoMap[muoName].delivered += qty;
    }
    if (satoName && category === "chick") {
      if (!c4uSatoMap[satoName]) c4uSatoMap[satoName] = { paidQty: 0, totalQty: 0 };
      c4uSatoMap[satoName].totalQty += qty;
      if (isPaid) c4uSatoMap[satoName].paidQty += qty;
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

  c4uPendingWeekList.sort((a, b) => new Date(a.expectedDate) - new Date(b.expectedDate));
  c4uPendingMonthList.sort((a, b) => new Date(a.expectedDate) - new Date(b.expectedDate));
  const c4uTopMuos = Object.entries(c4uMuoMap).map(([name, d]) => ({ name, value: d.delivered, ordered: d.ordered })).sort((a, b) => b.value - a.value).slice(0, 10);
  const c4uTopSatos = Object.entries(c4uSatoMap).map(([name, d]) => ({ name, value: d.paidQty, totalQty: d.totalQty })).sort((a, b) => b.value - a.value).slice(0, 10);
  const sspTotal = Math.floor(c4uGrangers / 5);

  /* ─────────────────────────────────────────────────────────────────
     13. ALERTS — derived from real thresholds
  ───────────────────────────────────────────────────────────────── */
  const alerts = [];
  if (mortalityPct > 3)
    alerts.push({ type: "critical", icon: "mortality", title: `High Mortality — ${worstFarm}`, detail: `Mortality at ${mortalityPct}% — above 3% threshold`, time: "Live" });
  if (hatchabilityWeek < 85 && eggsSetWeek > 0)
    alerts.push({ type: "critical", icon: "hatchery", title: "Hatchability Below Target", detail: `Hatchability at ${hatchabilityWeek}% (target ≥85%)`, time: "Live" });
  criticalStock.slice(0, 3).forEach(s =>
    alerts.push({
      type: s.status === "Critical" ? "critical" : "warning", icon: "vaccine",
      title: `Low Stock — ${s.item}`, detail: `Current stock: ${s.stock} unit(s) — below minimum`, time: "Live"
    }));
  if (absenteeismPct > 10)
    alerts.push({ type: "warning", icon: "equipment", title: "High Absenteeism Detected", detail: `${absenteeismPct}% of staff currently on leave`, time: "Live" });
  if (openLeaveRequests > 5)
    alerts.push({ type: "info", icon: "biosecurity", title: `${openLeaveRequests} Pending Leave Requests`, detail: "Requires HR approval", time: "Live" });
  if (approvedNotPaidCount > 10)
    alerts.push({ type: "warning", icon: "feed", title: `${approvedNotPaidCount} Requests Awaiting Payment`, detail: "Approved operational requests — payment pending", time: "Live" });
  if (alerts.length === 0)
    alerts.push({ type: "info", icon: "biosecurity", title: "All Systems Normal", detail: "No critical issues detected at this time", time: "Live" });

  /* ─────────────────────────────────────────────────────────────────
     FINAL SUMMARY LOG
  ───────────────────────────────────────────────────────────────── */
  console.log("=== [WAFAD] Data load complete ===", {
    flocks: flocks.length, dailyOps: dailyOps.length,
    hatchSF: hatchSF.length, invoices: invoices.length,
    opRequests: opRequests.length, salesOrders: salesOrders.length,
    payments: payments.length, employees: employees.length, leaves: leaves.length,
    c4uParents: c4uParents.length, c4uSF: c4uSF.length,
    // Key numbers for quick sanity check
    totalBirdsPlaced, femaleAliveCurrent, maleAliveCurrent,
    feedIntakeTonsWeek: feedIntakeTonsWeek.toFixed(2),
    feedIntakeTonsMonth: feedIntakeTonsMonth.toFixed(2),
    mortalityThisWeek, mortalityFemale, mortalityMale, mortalityPct, worstFarm,
    eggsThisWeek, eggsThisMonth, hatchingEggsWeek,
    hatchabilityWeek, hatchabilityMonth, goodChicksWeek, goodChicksMonth,
    confirmedOrdersWeek, confirmedOrdersMonth, pendingOrdersWeek,
    revenueMonth, cashReceivedMonth, totalExpenseMonth, feedExpenseMonth,
    top5Customers: top20Customers.slice(0, 5).map(c => `${c.name}: ${c.qty}`),
    c4uGrangers, sspTotal,
  });

  /* ─────────────────────────────────────────────────────────────────
     RETURN
  ───────────────────────────────────────────────────────────────── */
  return {
    kpi: {
      // Birds
      totalBirdsPlaced, totalPulletsHoused, totalCockerelsHoused,
      femaleAlive: femaleAliveCurrent, maleAlive: maleAliveCurrent,
      birdsAlive: birdsAliveTotal || birdsAlive,
      breedBreakdown: Object.entries(breedMap).sort((a, b) => b[1] - a[1]).slice(0, 5)
        .map(([breed, count]) => ({ breed, count })),
      // Mortality
      mortalityThisWeek, mortalityThisMonth, mortalityThisYear,
      mortalityLastWeek, mortalityLastMonth,
      mortalityFemale, mortalityMale,
      mortalityTarget: Math.round((birdsAliveTotal || birdsAlive) * 0.003),
      mortalityPct, worstFarm,
      // Feed
      feedIntakeTonsWeek: parseFloat(feedIntakeTonsWeek.toFixed(1)),
      feedIntakeTons: parseFloat(feedIntakeTonsMonth.toFixed(1)),
      feedIntakeTonsMonth: parseFloat(feedIntakeTonsMonth.toFixed(1)),
      feedIntakeTonsYear: parseFloat(feedProducedYearMT.toFixed(1)),
      feedCostTotal: feedExpenseMonth > 0 ? feedExpenseMonth : feedIntakeTonsMonth * 1000 * 285,
      costPerFeedKg,
      // Eggs
      eggsThisWeek, eggsThisMonth, eggsThisYear,
      eggsWeekTarget: Math.round((birdsAliveTotal || birdsAlive) * 0.8 * 7),
      eggsMonthTarget: Math.round((birdsAliveTotal || birdsAlive) * 0.8 * 30),
      hatchingEggsWeek, hatchingEggsMonth,
      hatchingEggsAvailableWeek: Math.round(hatchingEggsWeek * 0.63),
      hatchingEggsAvailableMonth: Math.round(hatchingEggsMonth * 0.63),
      farmRejectedEggs, crackedEggs, dirtyEggs, floorEggs,
      avgEggProductionRate,
      // Chicks
      goodChicksWeek, goodChicksMonth, goodChicksYear,
      goodChicksLastWeek, goodChicksLastMonth,
      // Hatchability
      hatchabilityWeek, hatchabilityMonth, hatchabilityYear,
      hatchabilityPrev: parseFloat((hatchabilityMonth * 0.98).toFixed(1)),
      // Orders
      confirmedOrdersWeek, confirmedOrdersMonth, confirmedOrdersYear,
      pendingOrdersWeek, pendingOrdersMonth,
      // Finance
      revenueWeek, revenueMonth, revenueYear,
      cashReceivedWeek, cashReceivedMonth, cashReceivedYear,
      // Cost per chick / hatching egg
      costPerHatchingEgg, costPerChickWeek,
      costPerChickLastWeek: costPerChickLastWk,
      sellingPriceWeek: 1200, sellingPriceLastWeek: 1150, // derive from invoices when unit qty available
      hatchForecastWeek: Math.round(hatchabilityWeek * hatchingEggsWeek / 100),
      hatchForecastMonth: Math.round(hatchabilityMonth * hatchingEggsMonth / 100),
      criticalIssues: alerts.filter(a => a.type === "critical").length,
    },
    hatchery: {
      eggsSetWeek, eggsSetMonth, eggsSetYear,
      eggsSetLastWeek, eggsSetLastMonth,
      hatchDueWeek: goodChicksWeek, hatchDueMonth: goodChicksMonth,
      hatchabilityWeek, hatchabilityMonth, hatchabilityYear,
      hatchabilityPrev: parseFloat((hatchabilityMonth * 0.98).toFixed(1)),
      goodChicks: goodChicksWeek, poorChicks: Math.round(poorChicksMonth / 4),
      goodChicksMonth, goodChicksYear,
      fertilityRate, infertilityRate: parseFloat((100 - fertilityRate).toFixed(1)),
      weeklyTrend: hatchWeeklyTrend.length >= 2
        ? hatchWeeklyTrend : [{ w: "Batch 1", set: 0, fertile: 0, hatched: 0 }],
    },
    feedmill: {
      producedWeekMT: parseFloat(feedProducedWeekMT.toFixed(1)),
      producedMT: parseFloat(feedProducedMT.toFixed(1)),
      producedDay: parseFloat((feedProducedMT / 30).toFixed(1)),
      producedYearMT: parseFloat(feedProducedYearMT.toFixed(1)),
      issuedWeek: parseFloat(feedIssuedWeekMT.toFixed(1)),
      issuedMonth: parseFloat(feedIssuedMT.toFixed(1)),
      productionVsDemand: feedProducedMT > 0
        ? parseFloat(((feedIssuedMT / feedProducedMT) * 100).toFixed(1)) : 0,
      rawMaterialEff: null, // No source report yet
      machineUptime: null, // No source report yet
      trend: feedTrend.length > 0 ? feedTrend : [{ d: "Mon", prod: 0, issued: 0 }],
    },
    sales: {
      confirmedWeek: confirmedOrdersWeek, confirmedMonth: confirmedOrdersMonth, confirmedYear: confirmedOrdersYear,
      pendingWeek: pendingOrdersWeek, pendingMonth: pendingOrdersMonth,
      ordersVsProduction: goodChicksMonth > 0 && confirmedOrdersMonth > 0
        ? parseFloat(Math.min(100, (confirmedOrdersMonth / goodChicksMonth) * 100).toFixed(1)) : 0,
      fulfilledPct: (confirmedOrdersMonth + pendingOrdersMonth) > 0
        ? parseFloat((confirmedOrdersMonth / (confirmedOrdersMonth + pendingOrdersMonth) * 100).toFixed(1)) : 0,
      regionalDemand: regionalDemand.length > 0
        ? regionalDemand : [{ region: "No Data", orders: 0, color: C.blue }],
      top20: top20Customers,
      avgSellingChick: 1200, avgSellingEgg: 85,
    },
    finance: {
      cashReceivedWeek, cashReceivedMonth, cashReceivedYear,
      revenueWeek, revenueMonth, revenueYear,
      receivablesWeek: Math.round(receivablesWeek),
      receivablesMonth: Math.round(receivablesMonth),
      receivablesTotal: Math.round(receivablesTotal),
      totalExpenseWeek, totalExpenseMonth, totalExpenseYear,
      payablesWeek: Math.round(totalExpenseWeek * 0.3),
      payablesMonth: Math.round(totalExpenseMonth * 0.3),
      grossMargin, margins,
      budgetVsActual: budgetVsActual.length > 0 ? budgetVsActual : [],
      pendingPayments: pendingPaymentsCount, approvedNotPaid: approvedNotPaidCount,
    },
    inventory: {
      rawMaterialDays: feedIssuedMT > 0
        ? Math.round(feedProducedMT / (feedIssuedMT / 30)) : 0,
      finishedFeedTons: parseFloat(feedProducedMT.toFixed(1)),
      vaccineStatus: criticalStock.some(s => s.status === "Critical") ? "Critical"
        : criticalStock.some(s => s.status === "Low") ? "Low" : "OK",
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
      leaveThisWeek, leaveThisMonth,
      absenteeismPct,
      overtime: null, // Need Attendance_Report with clock-in/out
      extendedHours: null,
      openHRIssues: openLeaveRequests,
      deptProductivity,
      leaveByDept: Object.entries(leaveByDept)
        .map(([dept, count]) => ({ dept, count }))
        .sort((a, b) => b.count - a.count),
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
        allProducts: c4uAllProducts,
        topMuos: c4uTopMuos, topSatos: c4uTopSatos,
        pendingWeek: { qty: c4uPendingWeekQty, orders: seenWeekOrders.size, list: c4uPendingWeekList.slice(0, 20) },
        pendingMonth: { qty: c4uPendingMonthQty, orders: seenMonthOrders.size, list: c4uPendingMonthList.slice(0, 20) },
      },
    },
  };
}



/* ─── Export helpers ─────────────────────────────── */
async function doExcel(data) {
  await loadScript("https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js");
  const XLSX = window.XLSX; if (!XLSX) { alert("SheetJS failed"); return; }
  const wb = XLSX.utils.book_new(); const k = data?.kpi || {};
  const add = (name, rows) => {
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws["!cols"] = rows[0]?.map((_, i) => ({ wch: Math.max(18, ...rows.map(r => String(r[i] ?? "").length + 4)) }));
    XLSX.utils.book_append_sheet(wb, ws, name);
  };
  add("Executive KPIs", [
    ["WAFAD GROUP – Executive Dashboard"], [`Generated: ${new Date().toLocaleString("en-US")}`], [],
    ["KPI", "Value", "Target", "Status"],
    ["Total Birds Placed", k.totalBirdsPlaced, "", ""],
    ["Birds Alive", k.birdsAlive, "", ""],
    ["Mortality (Week)", k.mortalityThisWeek, k.mortalityTarget, k.mortalityThisWeek <= k.mortalityTarget ? "OK" : "Over"],
    ["Eggs (Week)", k.eggsThisWeek, k.eggsWeekTarget, ""],
    ["Hatchability %", k.hatchabilityWeek + "%", "85%", ""],
    ["Good Chicks (Week)", k.goodChicksWeek, "", ""],
    ["Critical Issues", k.criticalIssues, "", k.criticalIssues > 0 ? "URGENT" : "Clear"],
  ]);
  const c4u = data?.chicken4u; const s = c4u?.sales;
  add("Chicken4U", [
    ["Chicken4U Field Sales"], [],
    ["Metric", "Value"],
    ["Total MUOs", c4u?.muo?.total ?? 0], ["Certified Learners", c4u?.learners ?? 0],
    ["Grangers Ordered", s?.grangers ?? 0], ["Grangers Delivered", s?.grangersDelivered ?? 0],
    ["Layers Ordered", s?.layers ?? 0], ["Layers Delivered", s?.layersDelivered ?? 0],
    ["Broilers Ordered", s?.broilers ?? 0], ["Broilers Delivered", s?.broilersDelivered ?? 0],
    ["Feed (kg) Ordered", s?.feedKgOrdered ?? 0],
    ["Pending Week Qty", s?.pendingWeek?.qty ?? 0], ["Pending Month Qty", s?.pendingMonth?.qty ?? 0],
  ]);
  add("Alerts", [["Operations Alerts"], [], ["Type", "Title", "Detail", "Time"],
  ...(data?.alerts || []).map(a => [a.type.toUpperCase(), a.title, a.detail, a.time])]);
  XLSX.writeFile(wb, `WAFAD_Executive_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

async function doPptx(data) {
  await loadScript("https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js");
  const PG = window.PptxGenJS; if (!PG) { alert("PptxGenJS failed"); return; }
  const p = new PG(); p.layout = "LAYOUT_16x9"; p.title = "WAFAD Executive Dashboard";
  const BG = "060A12", SF = "0D1826", BL = "1E8CFF", GR = "10D97A", RD = "EF4444", AM = "F59E0B", TX = "E8EDF5", SO = "8FA3C0";
  const k = data?.kpi || {};
  { const sl = p.addSlide(); sl.background = { color: BG }; sl.addShape(p.shapes.RECTANGLE, { x: 0, y: 0, w: .15, h: 5.625, fill: { color: BL }, line: { color: BL } }); sl.addText("WAFAD GROUP", { x: .35, y: .8, w: 9, h: .7, fontSize: 14, bold: true, color: BL, fontFace: "Trebuchet MS", charSpacing: 4 }); sl.addText("Executive Dashboard", { x: .35, y: 1.5, w: 9, h: 1.1, fontSize: 48, bold: true, color: TX, fontFace: "Trebuchet MS" }); sl.addText(`Generated: ${new Date().toLocaleString("en-US")}`, { x: .35, y: 4.95, w: 7, h: .4, fontSize: 12, color: TX, fontFace: "Calibri" }); }
  { const sl = p.addSlide(); sl.background = { color: BG }; sl.addShape(p.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: .65, fill: { color: BL }, line: { color: BL } }); sl.addText("Production KPIs", { x: .3, y: 0, w: 9, h: .65, fontSize: 18, bold: true, color: TX, fontFace: "Trebuchet MS", valign: "middle" });[[fmtN(k.totalBirdsPlaced), "Birds Placed", BL], [fmtN(k.birdsAlive), "Birds Alive", GR], [fmtN(k.eggsThisWeek), "Eggs (Week)", AM], [fmtN(k.goodChicksWeek), "Good Chicks", GR], [k.hatchabilityWeek + "%", "Hatchability", BL], [k.mortalityPct + "%", "Mortality %", RD]].forEach(([v, l, c], i) => { const col = i % 3, row = Math.floor(i / 3), x = .2 + col * 3.25, y = .85 + row * 2.3; sl.addShape(p.shapes.RECTANGLE, { x, y, w: 3.05, h: 2.0, fill: { color: SF }, line: { color: "1E4D8C" } }); sl.addText(l.toUpperCase(), { x: x + .12, y: y + .15, w: 2.8, h: .3, fontSize: 8.5, color: SO, fontFace: "Calibri", bold: true }); sl.addText(v, { x: x + .1, y: y + .55, w: 2.85, h: .9, fontSize: 32, bold: true, color: c, fontFace: "Trebuchet MS" }); }); }
  await p.writeFile({ fileName: `WAFAD_Executive_${new Date().toISOString().slice(0, 10)}.pptx` });
}

/* ══════════════════════════════════════════════════
   UI PRIMITIVES
══════════════════════════════════════════════════ */
const Sk = ({ w = "100%", h = 20 }) => <div className="skeleton" style={{ width: w, height: h }} />;

function Delta({ value, prev }) {
  if (!value || !prev) return null;
  const d = ((value - prev) / prev * 100).toFixed(1), up = d > 0;
  const Ic = up ? ArrowUpRight : ArrowDownRight;
  return (<span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 20, background: up ? C.greenLt : C.redLt, color: up ? C.green : C.red, display: "inline-flex", alignItems: "center", gap: 2 }}><Ic size={10} />{Math.abs(d)}%</span>);
}
function VsBadge({ current, target }) {
  if (!target) return null;
  const p = ((current / target) * 100).toFixed(1), color = p >= 95 ? C.green : p >= 80 ? C.amber : C.red;
  return <span style={{ fontSize: 10, color, fontWeight: 600 }}>{p}% of target</span>;
}
function SecHeader({ Ic, title, subtitle, iconColor = C.blue, right }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: iconColor + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Ic size={18} color={iconColor} strokeWidth={2} />
        </div>
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{title}</h2>
          {subtitle && <p style={{ fontSize: 11, color: C.textMd, marginTop: 2 }}>{subtitle}</p>}
        </div>
      </div>
      {right}
    </div>
  );
}
function Panel({ children, sx = {}, delay = 0, glowRed = false }) {
  return (<div className={`panel-enter${glowRed ? " glow-red" : ""}`} style={{ background: C.surf, border: `1px solid ${glowRed ? C.red + "44" : C.border}`, borderRadius: 16, padding: "18px 16px", boxShadow: "0 4px 28px rgba(0,0,0,0.32)", animationDelay: `${delay}ms`, ...sx }}>{children}</div>);
}
function Mini({ label, value, sub, subNode, color = C.blue, loading }) {
  return (<div className="mini-card" style={{ background: C.surf2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}><p style={{ fontSize: 9, color: C.textSf, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 5 }}>{label}</p>{loading ? <Sk h={24} /> : <p className="num-rise" style={{ fontSize: 18, fontWeight: 700, color, fontFamily: C.mono }}>{value}</p>}{(sub || subNode) && <div style={{ fontSize: 10, color: C.textMd, marginTop: 4 }}>{loading ? <Sk h={12} w="60%" /> : (subNode || sub)}</div>}</div>);
}
function Tip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (<div style={{ background: C.surf3, border: `1px solid ${C.borderMd}`, borderRadius: 10, padding: "10px 14px", fontSize: 12, fontFamily: "'Sora',sans-serif", boxShadow: "0 12px 36px rgba(0,0,0,0.5)" }}><p style={{ fontWeight: 600, color: C.text, marginBottom: 6 }}>{label}</p>{payload.map((p, i) => <p key={i} style={{ color: p.color, margin: "2px 0" }}>{p.name}: <strong>{fmtN(p.value)}</strong></p>)}</div>);
}
function AlertIc({ iconKey, alertType }) {
  const color = alertType === "critical" ? C.red : alertType === "warning" ? C.amber : C.blue;
  const pr = { size: 17, color, strokeWidth: 2 };
  const map = { mortality: <Skull {...pr} />, hatchery: <Egg {...pr} />, vaccine: <Syringe {...pr} />, equipment: <Wrench {...pr} />, feed: <Wheat {...pr} />, biosecurity: <Lock {...pr} /> };
  return map[iconKey] || <AlertCircle {...pr} />;
}

/* ══════════════════════════════════════════════════
   SECTION: KPI STRIP
══════════════════════════════════════════════════ */
function KpiStrip({ data, loading }) {
  const k = data?.kpi || {};
  const [period, setPeriod] = useState("week");
  const kpis = [
    { Ic: Bird, label: "Total Birds Placed", color: C.blue, value: fmtN(k.totalBirdsPlaced), sub: `${fmtN(k.birdsAlive)} alive`, subColor: C.green },
    { Ic: TrendingDown, label: "Mortality (Week)", color: C.red, value: fmtN(k.mortalityThisWeek), subNode: <VsBadge current={k.mortalityThisWeek} target={k.mortalityTarget} /> },
    { Ic: Wheat, label: "Feed Intake (MT)", color: C.amber, value: fmtN(k.feedIntakeTons, 1), sub: `Cost: ${fmtCur(k.feedCostTotal)}` },
    { Ic: Egg, label: period === "week" ? "Eggs This Week" : "Eggs This Month", color: C.cyan, value: fmtN(period === "week" ? k.eggsThisWeek : k.eggsThisMonth), subNode: <VsBadge current={period === "week" ? k.eggsThisWeek : k.eggsThisMonth} target={period === "week" ? k.eggsWeekTarget : k.eggsMonthTarget} /> },
    { Ic: PackageOpen, label: "Hatching Eggs (Wk)", color: C.purple, value: fmtN(k.hatchingEggsWeek), sub: `Available: ${fmtN(k.hatchingEggsAvailableWeek)}` },
    { Ic: Trash2, label: "Farm Rejected Eggs", color: C.orange, value: fmtN(k.farmRejectedEggs), sub: `Avg: ${k.avgEggProductionRate}%` },
    { Ic: CheckCircle2, label: period === "week" ? "Good Chicks (Week)" : "Good Chicks (Month)", color: C.green, value: fmtN(period === "week" ? k.goodChicksWeek : k.goodChicksMonth), sub: `Year Est: ${fmtK(k.goodChicksYear)}` },
    { Ic: ShoppingCart, label: "Confirmed Orders", color: C.blue, value: fmtN(k.confirmedOrdersWeek), sub: `Month: ${fmtK(k.confirmedOrdersMonth)}` },
    { Ic: Clock, label: "Pending Orders", color: C.amber, value: fmtN(k.pendingOrdersWeek), sub: `Month: ${fmtK(k.pendingOrdersMonth)}` },
    { Ic: Gauge, label: "Hatchability %", color: C.green, value: `${k.hatchabilityWeek || 0}%`, subNode: <Delta value={k.hatchabilityWeek} prev={k.hatchabilityMonth} /> },
    { Ic: Skull, label: "Mortality % / Worst", color: C.red, value: `${k.mortalityPct || 0}%`, sub: k.worstFarm },
    { Ic: Banknote, label: "Cost / Feed kg", color: C.amber, value: `GHC${k.costPerFeedKg || 0}`, sub: `Hatching Egg: GHC${k.costPerHatchingEgg || 0}` },
    { Ic: Layers, label: "Hatch Forecast (Wk)", color: C.purple, value: fmtN(k.hatchForecastWeek), sub: `Month: ${fmtK(k.hatchForecastMonth || 0)}` },
    { Ic: DollarSign, label: "Cost / Chick (Week)", color: C.orange, value: `GHC${fmtN(k.costPerChickWeek || 0)}`, subNode: <Delta value={k.costPerChickWeek} prev={k.costPerChickLastWeek} /> },
    { Ic: Tag, label: "Selling Price / Chick", color: C.green, value: `GHC${fmtN(k.sellingPriceWeek || 0)}`, subNode: <Delta value={k.sellingPriceWeek} prev={k.sellingPriceLastWeek} /> },
    { Ic: AlertTriangle, label: "Critical Issues", color: k.criticalIssues > 0 ? C.red : C.green, value: k.criticalIssues || 0, sub: k.criticalIssues > 0 ? "Requires immediate attention" : "All clear", pulse: k.criticalIssues > 0 },
  ];
  return (
    <Panel delay={0}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
        <SecHeader Ic={BarChart2} title="Production Control Center" subtitle="Live KPI Strip — CEO first-screen view" />
        <div style={{ display: "flex", gap: 6 }}>
          {["week", "month", "year"].map(p => (<button key={p} className={`tab-btn${period === p ? " active" : ""}`} onClick={() => setPeriod(p)} style={{ padding: "5px 14px", borderRadius: 20, border: `1px solid ${C.border}`, background: "transparent", color: C.textMd, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'Sora',sans-serif", textTransform: "capitalize" }}>{p}</button>))}
        </div>
      </div>
      <div className="kpi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 12 }}>
        {kpis.map((item, i) => (
          <div key={item.label} className="kpi-card" style={{ background: C.surf2, border: `1px solid ${item.pulse ? C.red + "55" : C.border}`, borderRadius: 12, padding: "14px 14px", borderTop: `3px solid ${item.color}`, animationDelay: `${i * 40}ms`, boxShadow: item.pulse ? `0 0 18px rgba(239,68,68,0.22)` : undefined }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: item.color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}><item.Ic size={14} color={item.color} strokeWidth={2} /></div>
              <span style={{ fontSize: 9, color: C.textSf, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", textAlign: "right", lineHeight: 1.3 }}>{item.label}</span>
            </div>
            {loading ? <Sk h={28} /> : <p className="num-rise" style={{ fontSize: 22, fontWeight: 700, color: item.color, fontFamily: C.mono, letterSpacing: "-.5px", animationDelay: `${i * 40 + 100}ms` }}>{item.value}</p>}
            <div style={{ marginTop: 6, fontSize: 10, color: item.subColor || C.textMd }}>{loading ? <Sk h={12} w="70%" /> : (item.subNode || item.sub)}</div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* ══════════════════════════════════════════════════
   SECTION: HATCHERY
══════════════════════════════════════════════════ */
function HatcherySection({ data, loading }) {
  const h = data?.hatchery || {};
  return (
    <Panel delay={80}>
      <SecHeader Ic={Egg} title="Hatchery Performance" subtitle="Eggs-to-chicks pipeline metrics" iconColor={C.amber} />
      <div className="mini-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 10, marginBottom: 20 }}>
        <Mini label="Eggs Set (Week)" value={fmtN(h.eggsSetWeek)} color={C.amber} loading={loading} />
        <Mini label="Eggs Set (Month)" value={fmtN(h.eggsSetMonth)} color={C.amber} loading={loading} />
        <Mini label="Hatch Due (Week)" value={fmtN(h.hatchDueWeek)} color={C.blue} loading={loading} />
        <Mini label="Hatch Due (Month)" value={fmtN(h.hatchDueMonth)} color={C.blue} loading={loading} />
        <Mini label="Hatchability% (Wk)" value={`${h.hatchabilityWeek || 0}%`} color={C.green} loading={loading} subNode={<Delta value={h.hatchabilityWeek} prev={h.hatchabilityPrev} />} />
        <Mini label="Good Chicks" value={fmtN(h.goodChicks)} color={C.green} loading={loading} />
        <Mini label="Poor Chicks" value={fmtN(h.poorChicks)} color={C.red} loading={loading} />
        <Mini label="Fertility %" value={`${h.fertilityRate || 0}%`} color={C.cyan} loading={loading} />
        <Mini label="Infertility %" value={`${h.infertilityRate || 0}%`} color={C.orange} loading={loading} />
      </div>
      {(!loading && (h.weeklyTrend || []).every(w => w.set === 0)) ? (
        <div style={{ textAlign: "center", padding: "24px", color: C.textSf, fontSize: 12 }}><Egg size={28} color={C.textSf} style={{ marginBottom: 8 }} /><p>No hatchery batch data for current month</p></div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={h.weeklyTrend || []} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barCategoryGap="22%">
            <XAxis dataKey="w" tick={{ fontSize: 10, fill: C.textSf, fontFamily: "'Sora'" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: C.textSf }} axisLine={false} tickLine={false} width={40} tickFormatter={fmtK} />
            <Tooltip content={<Tip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Bar dataKey="set" name="Eggs Set" fill={C.amber} radius={[4, 4, 0, 0]} fillOpacity={0.85} />
            <Bar dataKey="fertile" name="Fertile" fill={C.cyan} radius={[4, 4, 0, 0]} fillOpacity={0.85} />
            <Bar dataKey="hatched" name="Hatched" fill={C.green} radius={[4, 4, 0, 0]} fillOpacity={0.85} />
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
  return (
    <Panel delay={130}>
      <SecHeader Ic={Wheat} title="Feed Mill Operations" subtitle="Production, issuance & efficiency from daily ops records" iconColor={C.amber} />
      <div className="mini-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 10, marginBottom: 20 }}>
        <Mini label="Produced (MT/Month)" value={`${fmtN(f.producedMT, 1)} MT`} color={C.amber} loading={loading} />
        <Mini label="Produced (MT/Day)" value={`${fmtN(f.producedDay, 1)} MT`} color={C.amber} loading={loading} />
        <Mini label="Issued (Week)" value={`${fmtN(f.issuedWeek, 1)} MT`} color={C.blue} loading={loading} />
        <Mini label="Issued (Month)" value={`${fmtN(f.issuedMonth, 1)} MT`} color={C.blue} loading={loading} />
        <Mini label="Prod vs Demand" value={`${f.productionVsDemand || 0}%`} color={f.productionVsDemand >= 95 ? C.green : C.amber} loading={loading} />
        <Mini label="Raw Material Eff." value={`${f.rawMaterialEff || 0}%`} color={C.cyan} loading={loading} />
        <Mini label="Machine Uptime" value={`${f.machineUptime || 0}%`} color={f.machineUptime >= 90 ? C.green : C.red} loading={loading} />
      </div>
      {(!loading && (f.trend || []).length === 0) ? (
        <div style={{ textAlign: "center", padding: "24px", color: C.textSf, fontSize: 12 }}><Wheat size={28} color={C.textSf} style={{ marginBottom: 8 }} /><p>No feed data found for current month</p></div>
      ) : (
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={f.trend || []} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gP" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.amber} stopOpacity={0.3} /><stop offset="95%" stopColor={C.amber} stopOpacity={0} /></linearGradient>
              <linearGradient id="gI" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.blue} stopOpacity={0.3} /><stop offset="95%" stopColor={C.blue} stopOpacity={0} /></linearGradient>
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
   SECTION: SALES (Main Poultry — Sales_Order_Report)
══════════════════════════════════════════════════ */
function SalesSection({ data, loading }) {
  const s = data?.sales || {};
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? s.top20 : (s.top20 || []).slice(0, 8);
  return (
    <Panel delay={180}>
      <SecHeader Ic={TrendingUp} title="Poultry Sales & Demand" subtitle="From Sales_Order_Report — WAFAD breeder/hatchery sales to customers (incl. CHICKEN4U)" iconColor={C.green} />
      <div className="mini-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 10, marginBottom: 20 }}>
        <Mini label="Confirmed (Week)" value={fmtN(s.confirmedWeek)} color={C.green} loading={loading} />
        <Mini label="Confirmed (Month)" value={fmtN(s.confirmedMonth)} color={C.green} loading={loading} />
        <Mini label="Confirmed (Year)" value={fmtK(s.confirmedYear || 0)} color={C.green} loading={loading} />
        <Mini label="Pending (Week)" value={fmtN(s.pendingWeek)} color={C.amber} loading={loading} />
        <Mini label="Pending (Month)" value={fmtN(s.pendingMonth)} color={C.amber} loading={loading} />
        <Mini label="Orders vs Prod %" value={`${s.ordersVsProduction || 0}%`} color={s.ordersVsProduction >= 90 ? C.green : C.red} loading={loading} />
        <Mini label="Orders Fulfilled%" value={`${s.fulfilledPct || 0}%`} color={s.fulfilledPct >= 90 ? C.green : C.amber} loading={loading} />
        <Mini label="Avg Price (Chick)" value={`GHC${s.avgSellingChick || 0}`} color={C.blue} loading={loading} />
        <Mini label="Avg Price (Egg)" value={`GHC${s.avgSellingEgg || 0}`} color={C.blue} loading={loading} />
      </div>
      <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}><MapPin size={13} color={C.textSf} /><p style={{ fontSize: 11, fontWeight: 600, color: C.textMd }}>Regional Demand Distribution</p></div>
          {(!loading && (s.regionalDemand || []).every(r => r.orders === 0)) ? (
            <div style={{ textAlign: "center", padding: "32px 16px", color: C.textSf, fontSize: 12 }}><MapPin size={24} color={C.textSf} style={{ marginBottom: 8 }} /><p>No regional sales data available</p></div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={s.regionalDemand || []} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 9, fill: C.textSf }} axisLine={false} tickLine={false} tickFormatter={fmtK} />
                <YAxis dataKey="region" type="category" tick={{ fontSize: 9, fill: C.textSf, fontFamily: "'Sora'" }} axisLine={false} tickLine={false} width={80} />
                <Tooltip content={<Tip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="orders" name="Orders" radius={[0, 6, 6, 0]}>{(s.regionalDemand || []).map((e, i) => <Cell key={i} fill={e.color || C.blue} fillOpacity={0.85} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}><Users size={13} color={C.textSf} /><p style={{ fontSize: 11, fontWeight: 600, color: C.textMd }}>Top {showAll ? 20 : 8} Customers</p></div>
          <div style={{ maxHeight: 215, overflowY: "auto" }}>
            {loading ? [...Array(5)].map((_, i) => <Sk key={i} h={28} style={{ marginBottom: 6 }} />) :
              displayed?.length === 0 ? (<div style={{ textAlign: "center", padding: "32px 16px", color: C.textSf, fontSize: 12 }}><Users size={24} color={C.textSf} style={{ marginBottom: 8 }} /><p>No customer data available</p></div>) :
                displayed?.map((c, i) => (
                  <div key={c.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", borderRadius: 8, marginBottom: 4, background: i % 2 === 0 ? C.surf2 : "transparent" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 10, color: C.textSf, fontFamily: C.mono, width: 20 }}>#{i + 1}</span><span style={{ fontSize: 11, color: C.text }}>{c.name}</span></div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.blue, fontFamily: C.mono }}>{fmtN(c.qty)}</span>
                  </div>
                ))
            }
          </div>
          {(s.top20 || []).length > 8 && (
            <button onClick={() => setShowAll(v => !v)} style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 5, padding: "5px 14px", borderRadius: 20, border: `1px solid ${C.borderMd}`, background: "transparent", color: C.textMd, fontSize: 11, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>
              {showAll ? <ChevronUp size={12} /> : <ChevronDown size={12} />}{showAll ? "Show Less" : "Show All 20"}
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
function FinanceSection({ data, loading }) {
  const f = data?.finance || {};
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 400); return () => clearTimeout(t); }, []);
  return (
    <Panel delay={230}>
      <SecHeader Ic={Banknote} title="Financial Snapshot" subtitle="Cash from Payment_Received_Report · Margins estimated from sales & ops" iconColor={C.green} />
      <div className="mini-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 10, marginBottom: 20 }}>
        <Mini label="Cash Received (Wk)" value={fmtCur(f.cashReceivedWeek)} color={C.green} loading={loading} />
        <Mini label="Cash Received (Mo)" value={fmtCur(f.cashReceivedMonth)} color={C.green} loading={loading} />
        <Mini label="Receivables (Wk)" value={fmtCur(f.receivablesWeek)} color={C.amber} loading={loading} />
        <Mini label="Receivables (Mo)" value={fmtCur(f.receivablesMonth)} color={C.amber} loading={loading} />
        <Mini label="Payables Due (Wk)" value={fmtCur(f.payablesWeek)} color={C.red} loading={loading} />
        <Mini label="Payables Due (Mo)" value={fmtCur(f.payablesMonth)} color={C.red} loading={loading} />
      </div>
      <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}><Activity size={13} color={C.textSf} /><p style={{ fontSize: 11, fontWeight: 600, color: C.textMd }}>Gross Margin by Product</p></div>
          {(!loading && (f.margins || []).every(m => m.margin === 0)) ? (
            <div style={{ textAlign: "center", padding: "32px 16px", color: C.textSf, fontSize: 12 }}><BarChart2 size={24} color={C.textSf} style={{ marginBottom: 8 }} /><p>No margin data available</p></div>
          ) : (
            <ResponsiveContainer width="100%" height={170}>
              <BarChart data={f.margins || []} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <XAxis dataKey="product" tick={{ fontSize: 9, fill: C.textSf, fontFamily: "'Sora'" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: C.textSf }} axisLine={false} tickLine={false} width={28} tickFormatter={v => v + "%"} />
                <Tooltip content={<Tip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="margin" name="Margin %" radius={[6, 6, 0, 0]}>{(f.margins || []).map((_, i) => <Cell key={i} fill={[C.green, C.blue, C.amber, C.purple][i % 4]} fillOpacity={0.85} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}><BarChart2 size={13} color={C.textSf} /><p style={{ fontSize: 11, fontWeight: 600, color: C.textMd }}>Budget vs Actual (estimated)</p></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(f.budgetVsActual || []).filter(b => b.budget > 0).map((b, idx) => {
              const pct = Math.min(100, b.budget > 0 ? (b.actual / b.budget) * 100 : 0); const over = b.actual > b.budget;
              return (<div key={b.line}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontSize: 10, color: C.textMd }}>{b.line}</span><div style={{ display: "flex", alignItems: "center", gap: 4 }}>{over ? <ArrowUpRight size={10} color={C.red} /> : <ArrowDownRight size={10} color={C.green} />}<span style={{ fontSize: 10, fontFamily: C.mono, color: over ? C.red : C.green }}>{fmtCur(Math.abs(b.actual - b.budget))}</span></div></div><div style={{ height: 6, background: C.surf3, borderRadius: 4, overflow: "hidden" }}><div style={{ height: "100%", width: mounted ? `${pct}%` : "0%", borderRadius: 4, background: over ? C.red : C.green, transition: `width 1.2s cubic-bezier(0.22,1,0.36,1) ${idx * 120}ms` }} /></div></div>);
            })}
          </div>
        </div>
      </div>
    </Panel>
  );
}

/* ══════════════════════════════════════════════════
   SECTION: INVENTORY
══════════════════════════════════════════════════ */
function InventorySection({ data, loading }) {
  const inv = data?.inventory || {};
  const [showProducts, setShowProducts] = useState(false);
  const sc = s => s === "Critical" ? C.red : s === "Low" ? C.amber : C.green;
  const si = s => s === "Critical" ? <AlertTriangle size={14} color={C.red} /> : <AlertCircle size={14} color={C.amber} />;
  return (
    <Panel delay={280}>
      <SecHeader Ic={Boxes} title="Inventory & Supply Chain" subtitle="Stock from Product_Details_Report · Consumables from Detailed_Daily_Ops_Report" iconColor={C.purple} />
      <div className="mini-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 10, marginBottom: 20 }}>
        <Mini label="Feed Stock (MT)" value={`${fmtN(inv.finishedFeedTons, 1)} MT`} color={inv.finishedFeedTons > 50 ? C.green : C.amber} loading={loading} />
        <Mini label="Vaccine Status" value={inv.vaccineStatus ?? "—"} color={sc(inv.vaccineStatus)} loading={loading} />
        <Mini label="Products Tracked" value={fmtN((inv.productStockList || []).length)} color={C.blue} loading={loading} />
        <Mini label="Pending POs" value={inv.pendingPOs ?? 0} color={C.purple} loading={loading} />
        <Mini label="Supplier Delays" value={inv.supplierDelays ?? 0} color={inv.supplierDelays > 0 ? C.red : C.green} loading={loading} />
      </div>
      {(inv.criticalAlerts || []).length > 0 && (<>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}><Zap size={13} color={C.red} /><p style={{ fontSize: 11, fontWeight: 600, color: C.textMd }}>Low / Critical Stock Alerts</p></div>
        {(inv.criticalAlerts || []).map((a, i) => (
          <div key={i} className="alert-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 10, marginBottom: 6, background: sc(a.status) + "10", border: `1px solid ${sc(a.status)}30` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>{si(a.status)}<span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{a.item}</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Package size={12} color={sc(a.status)} /><span style={{ fontSize: 11, color: sc(a.status), fontWeight: 700 }}>Stock: {a.stock} unit(s)</span></div>
          </div>
        ))}
      </>)}
      {(inv.productStockList || []).length > 0 && (<>
        <button onClick={() => setShowProducts(v => !v)} style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 10, border: `1px solid ${C.borderMd}`, background: "transparent", color: C.textMd, fontSize: 11, cursor: "pointer", fontFamily: "'Sora',sans-serif", width: "100%", justifyContent: "center" }}>
          {showProducts ? <ChevronUp size={12} /> : <ChevronDown size={12} />}{showProducts ? "Hide" : "Show"} All Product Stock ({(inv.productStockList || []).length} items)
        </button>
        {showProducts && (<div style={{ marginTop: 10, maxHeight: 240, overflowY: "auto" }}>{(inv.productStockList || []).map((p, i) => (<div key={p.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 12px", borderRadius: 8, marginBottom: 4, background: i % 2 === 0 ? C.surf2 : "transparent", border: `1px solid ${C.border}` }}><span style={{ fontSize: 11, color: C.text, flex: 1 }}>{p.name}</span><div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}><span style={{ fontSize: 11, color: C.textSf }}>Min: {p.min}</span><span style={{ fontSize: 12, fontWeight: 700, color: p.stock <= p.min && p.min > 0 ? C.red : C.green, fontFamily: C.mono }}>{fmtN(p.stock)}</span></div></div>))}</div>)}
      </>)}
    </Panel>
  );
}

/* ══════════════════════════════════════════════════
   SECTION: ALERTS
══════════════════════════════════════════════════ */
function AlertsSection({ data, loading }) {
  const alerts = data?.alerts || [];
  const tc = t => t === "critical" ? C.red : t === "warning" ? C.amber : C.blue;
  const crit = alerts.filter(a => a.type === "critical").length;
  return (
    <Panel delay={330} glowRed={crit > 0}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
        <SecHeader Ic={ShieldAlert} title="Operations Risk & Alerts" subtitle="Auto-derived from real data thresholds" iconColor={C.red} />
        {crit > 0 && (<span className="crit-badge" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, padding: "5px 14px", borderRadius: 20, background: C.redLt, color: C.red, border: `1px solid ${C.red}44` }}><Flame size={12} color={C.red} />{crit} Critical Active</span>)}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {loading ? [...Array(3)].map((_, i) => <Sk key={i} h={56} />) :
          alerts.map((a, i) => (
            <div key={i} className={`alert-row${a.type === "critical" ? " alert-pulse" : ""}`} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px", borderRadius: 12, background: tc(a.type) + "0C", border: `1px solid ${tc(a.type)}28`, animationDelay: `${i * 60}ms` }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: tc(a.type) + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><AlertIc iconKey={a.icon} alertType={a.type} /></div>
              <div style={{ flex: 1, minWidth: 0 }}><p style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{a.title}</p><p style={{ fontSize: 11, color: C.textMd, marginTop: 2 }}>{a.detail}</p></div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <span style={{ fontSize: 9.5, fontWeight: 700, padding: "3px 9px", borderRadius: 12, background: tc(a.type) + "20", color: tc(a.type), textTransform: "uppercase", letterSpacing: ".06em" }}>{a.type}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 5, justifyContent: "flex-end" }}><Clock size={10} color={C.textSf} /><p style={{ fontSize: 10, color: C.textSf }}>{a.time}</p></div>
              </div>
            </div>
          ))
        }
      </div>
    </Panel>
  );
}

/* ══════════════════════════════════════════════════
   SECTION: CHICKEN4U (Field_Visit_Sales_Order_Report)
══════════════════════════════════════════════════ */
function C4uChickCard({ icon, label, color, bg, total, breeds, loading }) {
  const breedArr = Object.entries(breeds || {});
  return (
    <div style={{ background: bg, border: `1px solid ${color}33`, borderRadius: 10, padding: "12px 14px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: color + "1A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Egg size={14} color={color} strokeWidth={2} />
        </div>
        <div>
          <p style={{ fontSize: 9, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: ".07em" }}>{label}</p>
          {loading ? <Sk h={18} w={60} /> : <p style={{ fontSize: 18, fontWeight: 700, color, fontFamily: C.mono, letterSpacing: "-.4px", lineHeight: 1.1 }}>{total}</p>}
        </div>
      </div>
      {breedArr.map(([breed, qty]) => (
        <div key={breed} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 8px", borderRadius: 6, background: color + "10", border: `1px solid ${color}20`, marginTop: 4 }}>
          <span style={{ fontSize: 10, color: C.textMd, display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: color, display: "inline-block" }} />{breed || "—"}
          </span>
          {loading ? <Sk h={12} w={36} /> : <span style={{ fontSize: 11, fontWeight: 700, color, fontFamily: C.mono }}>{fmtN(qty)}</span>}
        </div>
      ))}
      {!loading && breedArr.length === 0 && <p style={{ fontSize: 10, color: C.textSf, marginTop: 6, textAlign: "center" }}>No breed data</p>}
    </div>
  );
}

function C4uPendingCard({ label, icon, orders, qty, list, color, loading }) {
  const [showList, setShowList] = useState(false);
  return (
    <div style={{ background: C.surf2, border: `1px solid ${color}33`, borderRadius: 12, padding: "14px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: color + "1A", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CalendarDays size={15} color={color} strokeWidth={2} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: ".07em" }}>{label}</p>
          {loading ? <Sk h={20} w={80} /> : <p style={{ fontSize: 20, fontWeight: 700, color, fontFamily: C.mono, lineHeight: 1.1 }}>{fmtN(orders)} <span style={{ fontSize: 11, fontWeight: 500, color: color + "99" }}>orders</span></p>}
        </div>
        {!loading && <div style={{ textAlign: "right" }}><p style={{ fontSize: 15, fontWeight: 700, color }}>{fmtN(qty)}</p><p style={{ fontSize: 9.5, color: C.textSf }}>total qty</p></div>}
      </div>
      {!loading && list.length > 0 && (
        <button onClick={() => setShowList(v => !v)} style={{ width: "100%", padding: "6px", borderRadius: 8, border: `1px solid ${color}33`, background: color + "14", color, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'Sora',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
          {showList ? <ChevronUp size={11} /> : <ChevronDown size={11} />}{showList ? "Hide" : "View"} {list.length} order{list.length !== 1 ? "s" : ""}
        </button>
      )}
      {showList && list.length > 0 && (
        <div style={{ marginTop: 8, maxHeight: 180, overflowY: "auto" }}>
          {list.map((o, idx) => (
            <div key={o.orderId} style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px", borderRadius: 7, marginBottom: 3, background: idx % 2 === 0 ? C.surf3 : "transparent", border: `1px solid ${C.border}` }}>
              <div><p style={{ fontSize: 11, fontWeight: 600, color: C.text }}>{o.muoName || o.orderId}</p>{o.satoName && <p style={{ fontSize: 10, color: C.textSf }}>SATO: {o.satoName}</p>}</div>
              <div style={{ textAlign: "right" }}><p style={{ fontSize: 10.5, fontWeight: 600, color }}>{o.expectedDate}</p><p style={{ fontSize: 9.5, color: C.textSf, textTransform: "capitalize" }}>{o.status}</p></div>
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

  const muoTotal = muo.total ?? 0;
  const muoMale = muo.male ?? 0;
  const muoFemale = muo.female ?? 0;
  const sspTotal = muo.sspTotal ?? 0;
  const certified = c4u.learners ?? 0;

  const tabConfig = {
    ordered: {
      grangerBreeds: s.grangerBreeds, layerBreeds: s.layerBreeds, broilerBreeds: s.broilerBreeds,
      grangerTotal: s.grangers ?? 0, layerTotal: s.layers ?? 0, broilerTotal: s.broilers ?? 0,
    },
    delivered: {
      grangerBreeds: s.grangerBreedsDel, layerBreeds: s.layerBreedsDel, broilerBreeds: s.broilerBreedsDel,
      grangerTotal: s.grangersDelivered ?? 0, layerTotal: s.layersDelivered ?? 0, broilerTotal: s.broilersDelivered ?? 0,
    },
    pending: {
      grangerBreeds: s.grangerBreedsPend, layerBreeds: s.layerBreedsPend, broilerBreeds: s.broilerBreedsPend,
      grangerTotal: s.grangersPending ?? 0, layerTotal: s.layersPending ?? 0, broilerTotal: s.broilersPending ?? 0,
    },
  };
  const tab = tabConfig[activeTab];

  // Non-chick products
  const CHICK_KW = ["GRANGER", "LAYER", "BROILER", "NOVOBROWN", "NOVOWHITE", "NOVO", "COCK", "PULLET"];
  const nonChickProducts = Object.entries(s.allProducts || {}).filter(([name]) => !CHICK_KW.some(k => name.toUpperCase().includes(k)));
  const prodMeta = name => {
    const u = name.toUpperCase();
    if (u.includes("FEED") || u.includes("MASH") || u.includes("PELLET") || u.includes("STARTER") || u.includes("FINISHER") || u.includes("GROWER")) return { icon: Wheat, color: C.amber, label: "Feed" };
    if (u.includes("MEDIC") || u.includes("VACCINE") || u.includes("DRUG") || u.includes("VITAMIN")) return { icon: Syringe, color: C.red, label: "Medication" };
    if (u.includes("EQUIP") || u.includes("FEEDER") || u.includes("DRINKER")) return { icon: Wrench, color: C.blue, label: "Equipment" };
    return { icon: Package, color: C.purple, label: "Other" };
  };

  return (
    <Panel delay={380} sx={{ borderTop: `3px solid ${C.amber}` }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: C.amber + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Store size={18} color={C.amber} strokeWidth={2} />
        </div>
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Chicken4U — Field Sales Dashboard</h2>
          <p style={{ fontSize: 11, color: C.textMd, marginTop: 2 }}>From <code style={{ color: C.amber, fontSize: 10 }}>Field_Visit_Sales_Order_Report</code> + <code style={{ color: C.amber, fontSize: 10 }}>All_Muo_Profiles</code></p>
        </div>
      </div>

      {/* MUO & Learner KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Total MUOs", value: muoTotal, color: C.blue },
          { label: "Female MUOs", value: muoFemale, color: C.purple, sub: muoTotal > 0 ? ((muoFemale / muoTotal) * 100).toFixed(0) + "%" : "0%" },
          { label: "Male MUOs", value: muoMale, color: C.cyan, sub: muoTotal > 0 ? ((muoMale / muoTotal) * 100).toFixed(0) + "%" : "0%" },
          { label: "SHF/SSPs Reached", value: sspTotal, color: C.green, sub: `÷5 of ${fmtN(s.grangers ?? 0)} Grangers` },

          { label: "Certified Learners", value: certified, color: C.amber },
          { label: "Orders Delivered", value: s.ordersDelivered ?? 0, color: C.green },
          { label: "Orders Pending", value: s.ordersPending ?? 0, color: C.orange },
          { label: "Feed (kg) Ordered", value: s.feedKgOrdered ?? 0, color: C.amber },
        ].map(({ label, value, color, sub }) => (
          <Mini key={label} label={label} value={fmtN(value)} color={color} sub={sub} loading={loading} />
        ))}
      </div>

      {/* Pending Deliveries */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
        <C4uPendingCard label="Pending This Week" icon="week" orders={s.pendingWeek?.orders ?? 0} qty={s.pendingWeek?.qty ?? 0} list={s.pendingWeek?.list ?? []} color={C.amber} loading={loading} />
        <C4uPendingCard label="Pending This Month" icon="month" orders={s.pendingMonth?.orders ?? 0} qty={s.pendingMonth?.qty ?? 0} list={s.pendingMonth?.list ?? []} color={C.blue} loading={loading} />
      </div>

      {/* Chick Tabs */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          {[
            { key: "ordered", label: `Ordered (${fmtN((s.grangers ?? 0) + (s.layers ?? 0) + (s.broilers ?? 0))})` },
            { key: "delivered", label: `Delivered (${fmtN((s.grangersDelivered ?? 0) + (s.layersDelivered ?? 0) + (s.broilersDelivered ?? 0))})` },
            { key: "pending", label: `Pending (${fmtN((s.grangersPending ?? 0) + (s.layersPending ?? 0) + (s.broilersPending ?? 0))})` },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setActiveTab(key)} className={`tab-btn${activeTab === key ? " active" : ""}`} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: C.textMd, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>{label}</button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12 }}>
          <C4uChickCard label="Grangers" color={C.amber} bg={C.amberLt} total={fmtN(tab.grangerTotal)} breeds={tab.grangerBreeds || {}} loading={loading} />
          <C4uChickCard label="Layers" color={C.green} bg={C.greenLt} total={fmtN(tab.layerTotal)} breeds={tab.layerBreeds || {}} loading={loading} />
          <C4uChickCard label="Broilers" color={C.blue} bg={C.blueLt} total={fmtN(tab.broilerTotal)} breeds={tab.broilerBreeds || {}} loading={loading} />
        </div>
      </div>

      {/* Top MUOs & SATOs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
        {/* Top MUOs */}
        <div>
          <button onClick={() => setShowTopMuos(v => !v)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 10, border: `1px solid ${C.borderMd}`, background: "transparent", color: C.textMd, fontSize: 11, cursor: "pointer", fontFamily: "'Sora',sans-serif", width: "100%", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Users size={13} color={C.cyan} />Top MUOs (by delivered)</span>
            {showTopMuos ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          {showTopMuos && (
            <div style={{ maxHeight: 220, overflowY: "auto" }}>
              {loading ? [...Array(4)].map((_, i) => <Sk key={i} h={28} style={{ marginBottom: 4 }} />) :
                (s.topMuos || []).length === 0 ? <p style={{ fontSize: 11, color: C.textSf, textAlign: "center", padding: "16px" }}>No MUO data yet</p> :
                  (s.topMuos || []).slice(0, 10).map((m, i) => {
                    const pct = s.topMuos[0]?.value > 0 ? (m.value / s.topMuos[0].value * 100) : 0;
                    return (
                      <div key={m.name} style={{ padding: "8px 10px", borderRadius: 8, marginBottom: 4, background: C.surf2, border: `1px solid ${C.border}` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontSize: 11, color: C.text, fontWeight: i < 3 ? 600 : 400 }}>#{i + 1} {m.name}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: C.cyan, fontFamily: C.mono }}>{fmtN(m.value)}</span>
                        </div>
                        <div style={{ height: 4, background: C.surf3, borderRadius: 2, overflow: "hidden" }}><div style={{ height: "100%", width: `${pct}%`, background: C.cyan, borderRadius: 2 }} /></div>
                      </div>
                    );
                  })
              }
            </div>
          )}
        </div>
        {/* Top SATOs */}
        <div>
          <button onClick={() => setShowTopSatos(v => !v)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 10, border: `1px solid ${C.borderMd}`, background: "transparent", color: C.textMd, fontSize: 11, cursor: "pointer", fontFamily: "'Sora',sans-serif", width: "100%", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><UserCog size={13} color={C.green} />Top SATOs (by paid qty)</span>
            {showTopSatos ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          {showTopSatos && (
            <div style={{ maxHeight: 220, overflowY: "auto" }}>
              {loading ? [...Array(4)].map((_, i) => <Sk key={i} h={28} style={{ marginBottom: 4 }} />) :
                (s.topSatos || []).length === 0 ? <p style={{ fontSize: 11, color: C.textSf, textAlign: "center", padding: "16px" }}>No SATO data yet</p> :
                  (s.topSatos || []).slice(0, 10).map((st, i) => {
                    const pct = s.topSatos[0]?.value > 0 ? (st.value / s.topSatos[0].value * 100) : 0;
                    return (
                      <div key={st.name} style={{ padding: "8px 10px", borderRadius: 8, marginBottom: 4, background: C.surf2, border: `1px solid ${C.border}` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontSize: 11, color: C.text, fontWeight: i < 3 ? 600 : 400 }}>#{i + 1} {st.name}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: C.green, fontFamily: C.mono }}>{fmtN(st.value)}</span>
                        </div>
                        <div style={{ height: 4, background: C.surf3, borderRadius: 2, overflow: "hidden" }}><div style={{ height: "100%", width: `${pct}%`, background: C.green, borderRadius: 2 }} /></div>
                      </div>
                    );
                  })
              }
            </div>
          )}
        </div>
      </div>

      {/* Other Products (Feed, Medication, etc.) */}
      {(loading || nonChickProducts.length > 0) && (
        <>
          <button onClick={() => setShowProducts(v => !v)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 10, border: `1px solid ${C.borderMd}`, background: "transparent", color: C.textMd, fontSize: 11, cursor: "pointer", fontFamily: "'Sora',sans-serif", width: "100%", justifyContent: "center", marginBottom: showProducts ? 12 : 0 }}>
            {showProducts ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {showProducts ? "Hide" : "Show"} Other Products (Feed, Medication, Equipment) — {nonChickProducts.length} items
          </button>
          {showProducts && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 10 }}>
              {loading ? [...Array(4)].map((_, i) => <Sk key={i} h={90} />) :
                nonChickProducts.map(([name, d]) => {
                  const { icon: Ic, color, label } = prodMeta(name);
                  return (
                    <div key={name} style={{ background: color + "0D", border: `1px solid ${color}22`, borderRadius: 10, padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 7, background: color + "1A", display: "flex", alignItems: "center", justifyContent: "center" }}><Ic size={13} color={color} strokeWidth={2} /></div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: 9, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: ".07em" }}>{label}</p>
                          <p style={{ fontSize: 10, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={name}>{name}</p>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 5 }}>
                        {[["Ord", d.ordered, color], ["Del", d.delivered, C.green], ["Pend", d.pending, C.amber]].map(([lbl, val, c]) => (
                          <div key={lbl} style={{ flex: 1, background: C.surf2, borderRadius: 6, padding: "4px 3px", textAlign: "center" }}>
                            <p style={{ fontSize: 12, fontWeight: 700, color: c, fontFamily: C.mono }}>{fmtN(val)}</p>
                            <p style={{ fontSize: 8, color: C.textSf, textTransform: "uppercase" }}>{lbl}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              }
            </div>
          )}
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
      <SecHeader Ic={Users} title="Workforce & HR" subtitle="Staff from All_Employees · Leave from Leave_Form_Report" iconColor={C.cyan} />
      <div className="mini-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 10, marginBottom: 20 }}>
        <Mini label="Total Staff" value={fmtN(wf.totalStaff)} color={C.blue} loading={loading} />
        <Mini label="On Duty Today" value={fmtN(wf.staffTurnoutToday)} color={C.green} loading={loading} />
        <Mini label="Staff on Leave" value={fmtN(wf.staffOnLeave)} color={C.amber} loading={loading} />
        <Mini label="Absenteeism %" value={`${wf.absenteeismPct || 0}%`} color={wf.absenteeismPct > 10 ? C.red : C.amber} loading={loading} />
        <Mini label="Open HR Issues" value={wf.openHRIssues ?? 0} color={wf.openHRIssues > 0 ? C.red : C.green} loading={loading} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}><Gauge size={13} color={C.textSf} /><p style={{ fontSize: 11, fontWeight: 600, color: C.textMd }}>Department Headcount</p></div>
      {(!loading && (wf.deptProductivity || []).length === 0) ? (
        <div style={{ textAlign: "center", padding: "24px", color: C.textSf, fontSize: 12 }}><Users size={28} color={C.textSf} style={{ marginBottom: 8 }} /><p>No department data found</p></div>
      ) : (
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={wf.deptProductivity || []} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <XAxis dataKey="dept" tick={{ fontSize: 9, fill: C.textSf, fontFamily: "'Sora'" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: C.textSf }} axisLine={false} tickLine={false} width={28} />
            <Tooltip content={<Tip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Bar dataKey="score" name="Headcount" radius={[6, 6, 0, 0]}>{(wf.deptProductivity || []).map((e, i) => <Cell key={i} fill={[C.blue, C.green, C.amber, C.purple, C.cyan, C.orange][i % 6]} fillOpacity={0.85} />)}</Bar>
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
  { label: "Connecting to Zoho Creator", duration: 950 },
  { label: "Loading flock master records", duration: 800 },
  { label: "Loading daily operations data", duration: 700 },
  { label: "Loading detailed daily ops", duration: 800 },
  { label: "Fetching hatchery data", duration: 800 },
  { label: "Loading poultry sales orders", duration: 800 },
  { label: "Loading payment records", duration: 600 },
  { label: "Loading product stock levels", duration: 800 },
  { label: "Loading employee records", duration: 800 },
  { label: "Loading leave records", duration: 600 },
  { label: "Loading Chicken4U Sales orders", duration: 1200 },
  { label: "Loading MUO profiles", duration: 800 },
  { label: "Loading learner registrations", duration: 600 },
  { label: "Building executive view", duration: 800 },
];

function SplashLoader({ onDone }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [doneSteps, setDoneSteps] = useState([]);
  useEffect(() => {
    const total = LOAD_STEPS.reduce((s, x) => s + x.duration, 0);
    let rafId;
    const start = performance.now();
    const tick = now => { setProgress(Math.min(100, ((now - start) / total) * 100)); if (now - start < total) rafId = requestAnimationFrame(tick); else setProgress(100); };
    rafId = requestAnimationFrame(tick);
    let acc = 0;
    const timers = LOAD_STEPS.map((step, i) => { acc += step.duration; return setTimeout(() => { setStepIdx(i + 1); setDoneSteps(d => [...d, i]); }, acc); });
    const exitTimer = setTimeout(() => { setExiting(true); setTimeout(onDone, 680); }, total + 120);
    return () => { cancelAnimationFrame(rafId); timers.forEach(clearTimeout); clearTimeout(exitTimer); };
  }, [onDone]);
  return (
    <div className={`loader-wrap${exiting ? " exit" : ""}`}>
      <div className="loader-grid-bg" />
      <div className="loader-scan" />
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ width: 80, height: 80, borderRadius: 22, background: `linear-gradient(135deg,${C.blue},${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 40px rgba(30,140,255,0.45)" }}>
            <img src={LOGO_IMG} alt="logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>
        <p className="loader-title" style={{ fontSize: 28, fontWeight: 800, color: C.text, letterSpacing: ".12em", textAlign: "center" }}>WAFAD GROUP</p>
        <p className="loader-sub" style={{ fontSize: 11, color: C.textSf, letterSpacing: ".22em", textTransform: "uppercase", marginTop: 6, marginBottom: 40 }}>Executive Dashboard — Live Data</p>
        <div className="loader-progress-wrap" style={{ width: 360, maxWidth: "88vw" }}>
          <div style={{ height: 4, background: "rgba(30,140,255,0.14)", borderRadius: 4, overflow: "hidden", marginBottom: 12 }}>
            <div className="loader-progress-bar" style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg,${C.blue},${C.purple})`, borderRadius: 4 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
            <div className="loader-dots"><span /><span /><span /></div>
            <span style={{ fontSize: 10, color: C.textSf, fontFamily: C.mono }}>{Math.round(progress)}%</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 300, overflowY: "auto" }}>
            {LOAD_STEPS.map((step, i) => {
              const done = doneSteps.includes(i), current = stepIdx === i, pending = stepIdx < i;
              return (
                <div key={i} className={done || current ? "loader-step" : ""} style={{ display: "flex", alignItems: "center", gap: 10, animationDelay: `${i * 50}ms`, opacity: pending ? 0.2 : 1, transition: "opacity 0.3s" }}>
                  <div style={{ width: 18, height: 18, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: done ? C.greenLt : current ? C.blueLt : "rgba(255,255,255,0.04)", border: `1px solid ${done ? C.green + "44" : current ? C.blue + "44" : "transparent"}`, transition: "all 0.3s" }}>
                    {done ? <CheckCircle2 size={10} color={C.green} /> : current ? <RefreshCw size={9} color={C.blue} className="spin-ic" /> : <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.textSf }} />}
                  </div>
                  <span style={{ fontSize: 10.5, color: done ? C.text : current ? C.blue : C.textSf, fontWeight: current ? 600 : 400, transition: "color 0.3s" }}>{step.label}</span>
                  {done && <span style={{ marginLeft: "auto", fontSize: 9, color: C.green, fontFamily: C.mono, fontWeight: 600 }}>done</span>}
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
  { id: "sales", Ic: TrendingUp, label: "Poultry Sales" },
  { id: "finance", Ic: Banknote, label: "Finance" },
  { id: "inventory", Ic: Boxes, label: "Inventory" },
  { id: "alerts", Ic: ShieldAlert, label: "Risk & Alerts" },
  { id: "chicken4u", Ic: Store, label: "Chicken4U" },
  { id: "workforce", Ic: Users, label: "Workforce" },
];

/* ══════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════ */
export default function WAFADExecutiveDashboard() {
  const [showLoader, setShowLoader] = useState(true);
  const [active, setActive] = useState("kpi");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState(null);
  const [exporting, setExporting] = useState(null);
  const [mobOpen, setMobOpen] = useState(false);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const result = await loadAllData();
      setData(result); setLastSync(new Date());
    } catch (e) { console.error("[WAFAD] Top-level load error:", e); setError(String(e?.message || e)); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleScroll = e => {
    const top = e.target.scrollTop + 120; let cur = "kpi";
    for (const { id } of NAV) { const el = document.getElementById(`sec-${id}`); if (el && el.offsetTop <= top) cur = id; }
    setActive(cur);
  };

  const scrollTo = id => { setActive(id); setMobOpen(false); document.getElementById(`sec-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }); };

  const handleExport = async type => {
    if (!data) return; setExporting(type);
    try { if (type === "excel") await doExcel(data); else await doPptx(data); }
    catch { alert("Export failed. Please try again."); }
    finally { setExporting(null); }
  };

  const critCount = data?.alerts?.filter(a => a.type === "critical").length ?? 0;
  const dateStr = new Date().toLocaleDateString("en-US", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });

  const MobNavContent = () => (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src={LOGO_IMG} alt="logo" style={{ width: 20, height: 20, borderRadius: 5, objectFit: "cover" }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>WAFAD</span></div>
        <button onClick={() => setMobOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: C.textMd, display: "flex" }}><X size={20} /></button>
      </div>
      {NAV.map(n => (
        <div key={n.id} onClick={() => scrollTo(n.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 10, marginBottom: 4, cursor: "pointer", background: active === n.id ? "rgba(30,140,255,0.14)" : "transparent", borderLeft: `3px solid ${active === n.id ? C.blue : "transparent"}`, transition: "all 0.14s" }}>
          <n.Ic size={15} color={active === n.id ? C.blue : C.textMd} strokeWidth={2} />
          <span style={{ fontSize: 12, fontWeight: 500, color: active === n.id ? C.blue : C.textMd }}>{n.label}</span>
          {n.id === "alerts" && critCount > 0 && (<span style={{ marginLeft: "auto", fontSize: 9.5, fontWeight: 700, background: C.redLt, color: C.red, padding: "1px 7px", borderRadius: 10 }}>{critCount}</span>)}
          {n.id === "chicken4u" && (<span style={{ marginLeft: n.id === "alerts" ? 4 : "auto", fontSize: 9, background: C.amberLt, color: C.amber, padding: "1px 6px", borderRadius: 8, fontWeight: 600 }}>Field</span>)}
        </div>
      ))}
    </>
  );

  return (
    <div style={{ fontFamily: "'Sora',sans-serif", background: C.bg, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {showLoader && <SplashLoader onDone={() => setShowLoader(false)} />}
      <div className={`mob-overlay${mobOpen ? " show" : ""}`} onClick={() => setMobOpen(false)} />
      <nav className={`mob-nav${mobOpen ? " open" : ""}`}><MobNavContent /></nav>

      {/* HEADER */}
      <header className="nav-glow" style={{ background: C.surf, borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, zIndex: 300, boxShadow: "0 4px 24px rgba(0,0,0,0.45)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px", height: 54, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button className="mob-ham xbtn" onClick={() => setMobOpen(o => !o)} style={{ display: "none", alignItems: "center", background: C.surf2, border: `1px solid ${C.border}`, borderRadius: 8, padding: "7px 9px", cursor: "pointer", color: C.textMd }}>
              <Menu size={18} />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: `linear-gradient(135deg,${C.blue},${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 3px 14px rgba(30,140,255,0.38)` }}>
                <img src={LOGO_IMG} alt="logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div><p style={{ fontSize: 12, fontWeight: 800, color: C.text, letterSpacing: "-.3px", lineHeight: 1.1 }}>WAFAD GROUP</p><p style={{ fontSize: 7.5, color: C.textSf, letterSpacing: ".12em" }}>EXECUTIVE DASHBOARD · LIVE</p></div>
            </div>
          </div>
          <div className="hdr-right" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 20, border: `1px solid ${loading ? C.amber + "55" : error ? C.red + "55" : C.green + "55"}`, background: loading ? C.amberLt : error ? C.redLt : C.greenLt }}>
              {loading ? <RefreshCw size={10} color={C.amber} className="spin-ic" /> : error ? <AlertCircle size={10} color={C.red} /> : <Circle size={5} color={C.green} fill={C.green} className="dot-pulse" />}
              <span style={{ fontSize: 10, fontWeight: 700, color: loading ? C.amber : error ? C.red : C.green }}>{loading ? "Loading…" : error ? "Error" : "Live"}</span>
            </div>
            <div className="hdr-date" style={{ display: "flex", alignItems: "center", gap: 4 }}><CalendarDays size={11} color={C.textSf} /><span style={{ fontSize: 9.5, color: C.textSf }}>{dateStr}</span></div>
            <button className="hdr-refresh xbtn" onClick={loadData} disabled={loading} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 7, border: `1px solid ${C.borderMd}`, background: "transparent", color: C.textMd, fontSize: 10, cursor: "pointer", fontFamily: "'Sora',sans-serif", opacity: loading ? 0.5 : 1 }}>
              <RefreshCw size={11} /><span className="hdr-export-lbl">Refresh</span>
            </button>
            <button className="xbtn" onClick={() => handleExport("excel")} disabled={!!exporting || loading || !data} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 7, border: "none", background: C.greenLt, color: C.green, fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora',sans-serif", opacity: !data ? 0.4 : 1 }}>
              {exporting === "excel" ? <RefreshCw size={12} className="spin-ic" /> : <FileSpreadsheet size={12} />}<span className="hdr-export-lbl">Excel</span>
            </button>
            <button className="xbtn" onClick={() => handleExport("pptx")} disabled={!!exporting || loading || !data} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 7, border: "none", background: C.orangeLt, color: C.orange, fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora',sans-serif", opacity: !data ? 0.4 : 1 }}>
              {exporting === "pptx" ? <RefreshCw size={12} className="spin-ic" /> : <Presentation size={12} />}<span className="hdr-export-lbl">PPT</span>
            </button>
          </div>
        </div>

        {/* Nav pills */}
        <div className="top-nav-pills top-nav-scroll" style={{ display: "flex", alignItems: "center", gap: 4, padding: "0 14px", height: 42 }}>
          {NAV.map((n, idx) => (
            <button key={n.id} onClick={() => scrollTo(n.id)} className={`nav-pill${active === n.id ? " active" : ""}`} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 8, border: `1px solid ${active === n.id ? "rgba(30,140,255,0.55)" : "transparent"}`, background: "transparent", color: active === n.id ? C.blue : C.textMd, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'Sora',sans-serif", animationDelay: `${idx * 30}ms` }}>
              <n.Ic size={13} strokeWidth={2} />
              {n.label}
              {n.id === "alerts" && critCount > 0 && (<span className="crit-badge" style={{ fontSize: 8.5, fontWeight: 800, background: C.red, color: "#fff", padding: "1px 5px", borderRadius: 8, marginLeft: 2, lineHeight: 1.4 }}>{critCount}</span>)}
              {n.id === "chicken4u" && (<span style={{ fontSize: 8, background: C.amber, color: "#fff", padding: "1px 5px", borderRadius: 7, marginLeft: 2, fontWeight: 700 }}>Field</span>)}
            </button>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
            {lastSync && (<><Clock size={10} color={C.textSf} /><span style={{ fontSize: 9.5, color: C.textSf, whiteSpace: "nowrap" }}>Synced {lastSync.toLocaleTimeString("en-US")}</span></>)}
            <UserCog size={10} color={C.textSf} style={{ marginLeft: 6 }} />
            <span style={{ fontSize: 9.5, color: C.textSf, whiteSpace: "nowrap" }}>CEO View</span>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main onScroll={handleScroll} style={{ flex: 1, overflowY: "auto", padding: "16px 14px 48px", display: "flex", flexDirection: "column", gap: 16 }}>

        {error && (
          <div style={{ background: C.redLt, border: `1px solid ${C.red}44`, borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "flex-start", gap: 12 }}>
            <AlertCircle size={18} color={C.red} style={{ flexShrink: 0, marginTop: 1 }} />
            <div><p style={{ fontSize: 13, fontWeight: 700, color: C.red }}>Data load error — showing available data</p><p style={{ fontSize: 11, color: C.textMd, marginTop: 4 }}>{error}</p></div>
            <button onClick={loadData} style={{ marginLeft: "auto", flexShrink: 0, padding: "5px 12px", borderRadius: 8, border: `1px solid ${C.red}55`, background: "transparent", color: C.red, fontSize: 11, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>Retry</button>
          </div>
        )}

        {/* Summary strip */}
        {!loading && data && (
          <div className="fade-in" style={{ display: "flex", gap: 14, flexWrap: "wrap", padding: "10px 16px", borderRadius: 12, background: C.surf, border: `1px solid ${C.border}`, alignItems: "center" }}>
            {[
              { Ic: AlertTriangle, label: "Critical Issues", value: data.kpi.criticalIssues, color: C.red },
              { Ic: Bird, label: "Birds Alive", value: fmtN(data.kpi.birdsAlive), color: C.green },
              { Ic: Gauge, label: "Hatchability", value: data.kpi.hatchabilityWeek + "%", color: C.blue },
              { Ic: ShoppingCart, label: "Poultry Orders (Wk)", value: fmtN(data.kpi.confirmedOrdersWeek), color: C.amber },
              { Ic: Store, label: "C4U Chicks Ordered", value: fmtN((data.chicken4u?.sales?.chicksOrdered) || 0), color: C.amber },
              { Ic: Users, label: "Staff on Duty", value: fmtN(data.workforce?.staffTurnoutToday), color: C.cyan },
              { Ic: Banknote, label: "Cash Rcvd (Month)", value: fmtCur(data.finance?.cashReceivedMonth), color: C.purple },
            ].map(({ Ic, label, value, color }, i) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Ic size={12} color={color} strokeWidth={2} />
                <span style={{ fontSize: 9.5, color: C.textSf }}>{label}:</span>
                <span style={{ fontSize: 11.5, fontWeight: 700, color, fontFamily: C.mono }}>{value}</span>
              </div>
            ))}
          </div>
        )}

        <div id="sec-kpi">        <KpiStrip data={data} loading={loading} /></div>
        <div id="sec-hatchery">   <HatcherySection data={data} loading={loading} /></div>
        <div id="sec-feedmill">   <FeedMillSection data={data} loading={loading} /></div>
        <div id="sec-sales">      <SalesSection data={data} loading={loading} /></div>
        <div id="sec-finance">    <FinanceSection data={data} loading={loading} /></div>
        <div id="sec-inventory">  <InventorySection data={data} loading={loading} /></div>
        <div id="sec-alerts">     <AlertsSection data={data} loading={loading} /></div>
        <div id="sec-chicken4u">  <Chicken4USection data={data} loading={loading} /></div>
        <div id="sec-workforce">  <WorkforceSection data={data} loading={loading} /></div>

        <p style={{ textAlign: "center", padding: "8px 0", color: C.textSf, fontSize: 10.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <Building2 size={12} color={C.textSf} />
          WAFAD Executive Dashboard · CEO / Chairman View
        </p>
      </main>
    </div>
  );
}

