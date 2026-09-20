import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import {
  Bird,
  TrendingDown,
  Wheat,
  Egg,
  PackageOpen,
  Trash2,
  CheckCircle2,
  Clock,
  Skull,
  DollarSign,
  Package,
  Banknote,
  Tag,
  AlertTriangle,
  BarChart2,
  Flame,
  ShieldAlert,
  Layers,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  FileSpreadsheet,
  Presentation,
  Activity,
  Users,
  UserCog,
  AlertCircle,
  Gauge,
  TrendingUp,
  Boxes,
  Zap,
  Lock,
  CalendarDays,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Menu,
  X,
  Circle,
  Syringe,
  Wrench,
  Store,
  Filter,
} from "lucide-react";

/* ─── CDN Script Loader ─────────────────────────────── */
function loadScript(src) {
  return new Promise((res) => {
    if (document.querySelector(`script[src="${src}"]`)) return res();
    const s = document.createElement("script");
    s.src = src;
    s.onload = res;
    document.head.appendChild(s);
  });
}


/* ─── Global Styles ─────────────────────────────────── */
(function injectStyles() {
  const id = "wafad-exec-v7";
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
    .breed-dropdown{position:relative;display:inline-block}
    .breed-menu{position:absolute;top:calc(100% + 6px);left:0;min-width:200px;background:#0D1826;border:1px solid rgba(30,140,255,0.25);border-radius:10px;padding:6px;z-index:400;box-shadow:0 12px 40px rgba(0,0,0,0.6);max-height:260px;overflow-y:auto}
    .breed-option{padding:8px 12px;border-radius:7px;cursor:pointer;font-size:11px;color:#8FA3C0;transition:all 0.14s;white-space:nowrap}
    .breed-option:hover{background:rgba(30,140,255,0.12);color:#E8EDF5}
    .breed-option.selected{background:rgba(30,140,255,0.18);color:#5BB3FF;font-weight:600}
    @media(max-width:860px){.top-nav-pills{display:none!important}.mob-ham{display:flex!important}.hdr-date{display:none!important}.hdr-export-lbl{display:none!important}}
    @media(max-width:600px){.kpi-grid{grid-template-columns:repeat(2,1fr)!important}.mini-grid{grid-template-columns:repeat(2,1fr)!important}.two-col{grid-template-columns:1fr!important}.hdr-refresh{display:none!important}.hdr-right{gap:4px!important}}
    @media(max-width:400px){.kpi-grid{grid-template-columns:1fr!important}}
    .mob-ham{display:none}
@keyframes eggBounce {
  0%, 100% { transform: translateY(0) rotate(-4deg); }
  50%       { transform: translateY(-14px) rotate(4deg); }
}
@keyframes chickenWalk {
  from { transform: translateY(0) scaleX(1); }
  to   { transform: translateY(-7px) scaleX(-1); }
}
  `;
  document.head.appendChild(s);
})();

/* ─── Palette ─────────────────────────────────────── */
const C = {
  bg: "#060A12",
  surf: "#0D1826",
  surf2: "#101D30",
  surf3: "#152238",
  border: "rgba(30,140,255,0.12)",
  borderMd: "rgba(30,140,255,0.25)",
  blue: "#1E8CFF",
  blueLt: "rgba(30,140,255,0.1)",
  green: "#10D97A",
  greenLt: "rgba(16,217,122,0.1)",
  red: "#EF4444",
  redLt: "rgba(239,68,68,0.1)",
  amber: "#F59E0B",
  amberLt: "rgba(245,158,11,0.1)",
  purple: "#8B5CF6",
  purpleLt: "rgba(139,92,246,0.1)",
  cyan: "#06B6D4",
  cyanLt: "rgba(6,182,212,0.1)",
  orange: "#F97316",
  orangeLt: "rgba(249,115,22,0.1)",
  text: "#E8EDF5",
  textMd: "#8FA3C0",
  textSf: "#4A6A90",
  mono: "'JetBrains Mono',monospace",
};

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

// ─── REPLACE WITH ────────────────────────────────────
function getDateBounds() {
  const now = new Date();
  // Monday-based week: Sun(0)→go back 6, Mon(1)→0, Tue(2)→1 ... Sat(6)→5
  const dow = now.getDay();
  const daysFromMonday = dow === 0 ? 6 : dow - 1;
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - daysFromMonday);
  weekStart.setHours(0, 0, 0, 0);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  monthEnd.setHours(23, 59, 59, 999);
  console.log(
    "[WAFAD] Date bounds → weekStart:",
    weekStart.toDateString(),
    "| monthStart:",
    monthStart.toDateString(),
  );
  return { now, weekStart, monthStart, weekEnd, monthEnd };
}
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
const HATCH_TPL = { eggsSet: 0, goodChicks: 0, fertile: 0 };
const FIN_TPL = { revenue: 0, expense: 0, cashIn: 0 };

/* ═════════════════════════════════════════════════════
   loadAllData  — v3  (breed-specific edition)
═════════════════════════════════════════════════════ */
async function loadAllData() {
  console.log("=== [WAFAD] Starting full data load v3 ===");
  const { now, weekStart, monthStart, weekEnd, monthEnd } = getDateBounds();
  const lastWeekStart = new Date(weekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);
  const lastWeekEnd = new Date(weekStart);
  lastWeekEnd.setDate(lastWeekEnd.getDate() - 1);
  const lastMonthStart = new Date(monthStart);
  lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
  const lastMonthEnd = new Date(monthStart);
  lastMonthEnd.setDate(lastMonthEnd.getDate() - 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  const monthlyOpsData = {}; // YYYY-MM → ops metrics
  const monthlyHatchData = {}; // YYYY-MM → hatch metrics
  const monthlyFinData = {}; // YYYY-MM → revenue/expense
  let costPerFeedKg = 0; // declared early, assigned after products load:

  // function mkMonthKey(d) {
  //   if (!d) return null;
  //   return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  // }
  // function ensureMonth(map, key, template) {
  //   if (key && !map[key]) map[key] = { ...template };
  // }

  // ─── REPLACE WITH ────────────────────────────────────
  /* ─── 1. FLOCK — collect unique breeds ─────────────── */
  const flocks = await zohoGetAll("All_Flock_Management");
  console.group("✅ [1] FLOCK REPORT");
  console.log("Total records:", flocks.length);
  console.log(
    "Sample record keys:",
    flocks[0] ? Object.keys(flocks[0]) : "EMPTY",
  );
  console.log(
    "Sample breed:",
    flocks[0] ? displayVal(flocks[0].Breed_Name) : "—",
  );
  console.log(
    "Sample Pullets_Housed:",
    flocks[0] ? fv(flocks[0], "Pullets_Housed") : "—",
  );
  console.groupEnd();
  let totalPulletsHoused = 0,
    totalCockerelsHoused = 0,
    totalBirdsPlaced = 0;
  let femaleAliveCurrent = 0,
    maleAliveCurrent = 0;
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
    if (flockId && breed && breed !== "Unknown")
      flockIdBreedMap[flockId] = breed;
  });

  const allBreeds = ["All Breeds", ...Array.from(breedSet).sort()];
  const birdsAliveTotal = femaleAliveCurrent + maleAliveCurrent;

  /* ─── 1b. BREEDER FARMS ─────────────────────────────── */
  const breederFarms = await zohoGetAll("All_Breeder_Farms");
  console.group("✅ [1b] BREEDER FARMS");
  console.log("Total records:", breederFarms.length);
  console.log(
    "Sample keys:",
    breederFarms[0] ? Object.keys(breederFarms[0]) : "EMPTY",
  );
  console.groupEnd();
  const farmSet = new Set();
  const farmIdNameMap = {};
  breederFarms.forEach((f) => {
    const name = displayVal(
      f.Farm_Name || f.Breeder_Farm_Name || f.Name || "",
    ).trim();
    const id = String(f.ID || f.id || "");
    if (name) {
      farmSet.add(name);
      if (id) farmIdNameMap[id] = name;
    }
  });

  const allFarms = ["All Farms", ...Array.from(farmSet).sort()];
  console.log("[WAFAD] allFarms:", allFarms);

  // ── Rebuild farmBirdsPlacedMap now that farmIdNameMap is available ──
  flocks.forEach((f) => {
    const pullets = num(fv(f, "Pullets_Housed"));
    const cockerels = num(fv(f, "Cockerels_Housed"));
    const total = num(fv(f, "Total_Birds_Housed")) || pullets + cockerels;
    if (total === 0) return;

    const farmRef = f.Breeder_Farm;
    let farmName = null;
    if (farmRef) {
      if (typeof farmRef === "object") {
        farmName =
          farmRef.zc_display_value ||
          farmRef.display_value ||
          farmRef.Farm_Name ||
          farmRef.Name ||
          null;
        const fId = String(farmRef.ID || farmRef.id || "");
        if (!farmName && fId) farmName = farmIdNameMap[fId] || null;
      } else {
        farmName = String(farmRef).trim() || null;
      }
    }
    if (farmName) {
      farmBirdsPlacedMap[farmName] =
        (farmBirdsPlacedMap[farmName] || 0) + total;
    }
  });
  console.log("[WAFAD] farmBirdsPlacedMap (rebuilt):", farmBirdsPlacedMap);

  /* ─── 2. DAILY OPS — breed-split via Egg_Collection_Details subform ── */
  const dailyOps = await zohoGetAll("Detailed_Daily_Ops_Report", 1000);
  // After: const dailyOps = await zohoGetAll("ALL_WAFAD_BREEDER_FARM_DAILY_OPS", 1000);
  console.group("✅ [2] DAILY OPS REPORT");
  console.log("Total records:", dailyOps.length);
  console.log("Sample keys:", dailyOps[0] ? Object.keys(dailyOps[0]) : "EMPTY");
  console.log(
    "Sample Total_Egg_Collected:",
    dailyOps[0] ? fv(dailyOps[0], "Total_Egg_Collected") : "—",
  );
  console.log(
    "Sample Total_Mortality_Count:",
    dailyOps[0] ? fv(dailyOps[0], "Total_Mortality_Count") : "—",
  );
  console.log(
    "Sample Total_Feed_Consumed:",
    dailyOps[0] ? fv(dailyOps[0], "Total_Feed_Consumed") : "—",
  );
  console.log("Sample Flock ref:", dailyOps[0]?.Flock);
  console.groupEnd();

  function diagnoseDailyOpsRecord(rec) {
    console.group("=== DAILY OPS RECORD STRUCTURE ===");
    console.log("Top-level keys:", Object.keys(rec));

    // Check for subform field
    const possibleSubformKeys = Object.keys(rec).filter(
      (k) => Array.isArray(rec[k]) && rec[k].length > 0,
    );
    console.log("Array fields (subforms):", possibleSubformKeys);

    possibleSubformKeys.forEach((key) => {
      console.group(`Subform: ${key}`);
      console.log("First row keys:", Object.keys(rec[key][0]));
      console.log("First row values:", rec[key][0]);
      console.groupEnd();
    });
    console.groupEnd();
  }

  // Call it on the first 2 records that have subform data
  const sampleRecs = dailyOps
    .filter((r) =>
      Object.values(r).some((v) => Array.isArray(v) && v.length > 0),
    )
    .slice(0, 2);
  sampleRecs.forEach(diagnoseDailyOpsRecord);

  // global accumulators
  let totalMortality = 0;
  let mortalityThisWeek = 0,
    mortalityThisMonth = 0,
    mortalityThisYear = 0;
  let mortalityLastWeek = 0,
    mortalityLastMonth = 0;
  let mortalityFemale = 0,
    mortalityMale = 0;
  let eggsThisWeek = 0,
    eggsThisMonth = 0,
    eggsThisYear = 0;
  let hatchingEggsWeek = 0,
    hatchingEggsMonth = 0;
  let farmRejectedEggs = 0,
    crackedEggs = 0,
    dirtyEggs = 0,
    floorEggs = 0;
  let feedIntakeTonsWeek = 0,
    feedIntakeTonsMonth = 0;
  const weeklyEggTrend = {},
    farmMort = {};

  // ─── REPLACE WITH ────────────────────────────────────
  // breed-keyed accumulators
  const breedEggData = {}; // breed → emptyBreedEgg()
  const farmEggData = {}; // farm  → emptyBreedEgg()
  const farmBreedEggData = {}; // farm  → breed → emptyBreedEgg()
  const ensureBreedEgg = (b) => {
    if (b && !breedEggData[b]) breedEggData[b] = emptyBreedEgg();
  };
  const ensureFarmEgg = (f) => {
    if (f && !farmEggData[f]) farmEggData[f] = emptyBreedEgg();
  };

  dailyOps.forEach((r) => {
    if (!window._flockLogged) {
      window._flockLogged = true;
      console.log(
        "[WAFAD] Flock field sample:",
        r.Flock,
        "| Type:",
        typeof r.Flock,
      );
      console.log(
        "[WAFAD] flockIdBreedMap keys (first 5):",
        Object.keys(flockIdBreedMap).slice(0, 5),
      );
      console.log("[WAFAD] Breeder_Farm sample:", r.Breeder_Farm);
    }

    // ─── REPLACE WITH ────────────────────────────────────
    const rawDate = fv(r, "Date_field") || fv(r, "Date") || fv(r, "Added_Time");
    const recDate = parseZohoDate(rawDate);
    const isWeek = recDate && recDate >= weekStart;
    const isMonth = recDate && recDate >= monthStart;
    const isYear = recDate && recDate >= yearStart;
    const isLWk = recDate && recDate >= lastWeekStart && recDate <= lastWeekEnd;
    const isLMon =
      recDate && recDate >= lastMonthStart && recDate <= lastMonthEnd;


    // REPLACE the Feed_Details block inside dailyOps.forEach:
    const feedRows = r.Feed_Details;
    if (Array.isArray(feedRows) && feedRows.length > 0) {
      feedRows.forEach((row) => {
        // Product_Name is a lookup (NUMBER type) — use displayVal to get name
        const prodName = displayVal(
          row["Product_Name.Product_Name"] ||
          row["Product_Name.Name"] ||
          row.Product_Name || ""
        ).trim().toUpperCase();

        const consumedKg = num(row.Consumed_KG ?? row.Consumed_Kg ?? 0);
        const gender = (row.Gender || "").toString().toLowerCase().trim();

        if (!window._feedSubformLogged) {
          window._feedSubformLogged = true;
          console.log("[WAFAD] Feed_Details keys:", Object.keys(row));
          console.log("[WAFAD] Feed_Details row:", JSON.stringify(row));
          console.log("[WAFAD] → prodName:", prodName, "| kg:", consumedKg, "| gender:", gender);
        }

        if (!prodName || consumedKg === 0) return;
        if (!window._feedUsageRows) window._feedUsageRows = [];
        window._feedUsageRows.push({ prodName, consumedKg, gender, recDate });
      });
    }
    // Mortality: try total field first, fall back to female+male sum
    const mortFemale = num(
      fv(r, "Mortality_Count_Px") ||
      fv(r, "Female_Mortality") ||
      fv(r, "Px_Mortality_Count") ||
      fv(r, "Dead_Female"),
    );
    const mortMale = num(
      fv(r, "Mortality_Count_Cx") ||
      fv(r, "Male_Mortality") ||
      fv(r, "Cx_Mortality_Count") ||
      fv(r, "Dead_Male"),
    );
    const mortTotalRaw = num(
      fv(r, "Total_Mortality_Count") ||
      fv(r, "Total_Quantity_Mortality") ||
      fv(r, "Mortality_Count") ||
      fv(r, "Total_Dead_Birds"),
    );
    // Use explicit total if available, otherwise sum female+male
    const mortTotal = mortTotalRaw > 0 ? mortTotalRaw : mortFemale + mortMale;

    const feedKg = num(
      fv(r, "Total_Feed_Consumed") ||
      fv(r, "Feed_Consumed") ||
      fv(r, "Feed_Consumed_Kg"),
    );
    const weekNum = num(
      fv(r, "Week_Number") ||
      fv(r, "Age_of_Birds_Weeks") ||
      fv(r, "Bird_Age_Week"),
    );

    // ── Resolve farm name ──────────────────────────────
    const farmRef = r.Breeder_Farm;
    let recFarm = null;
    if (farmRef) {
      if (typeof farmRef === "object") {
        recFarm =
          farmRef.zc_display_value ||
          farmRef.display_value ||
          farmRef.Name ||
          null;
        const fId = String(farmRef.ID || farmRef.id || "");
        if (!recFarm && fId) recFarm = farmIdNameMap[fId] || null;
      } else {
        recFarm = String(farmRef).trim() || null;
      }
    }
    // Fallback: try string match against farmIdNameMap values
    if (!recFarm && farmRef) recFarm = displayVal(farmRef) || null;

    totalMortality += mortTotal;
    mortalityFemale += mortFemale;
    mortalityMale += mortMale;
    if (recFarm) farmMort[recFarm] = (farmMort[recFarm] || 0) + mortTotal;
    if (isWeek) {
      mortalityThisWeek += mortTotal;
      feedIntakeTonsWeek += feedKg / 1000;
    }
    if (isMonth) {
      mortalityThisMonth += mortTotal;
      feedIntakeTonsMonth += feedKg / 1000;
    }
    if (isYear) mortalityThisYear += mortTotal;
    if (isLWk) mortalityLastWeek += mortTotal;
    if (isLMon) mortalityLastMonth += mortTotal;

    // ── Flat egg fields ────────────────────────────────
    const eggs = num(fv(r, "Total_Egg_Collected"));
    const hatchEgg = num(fv(r, "Total_Hatchable_Eggs"));
    const farmRej = num(fv(r, "Total_Farm_Rejected_Eggs"));
    const cracked = num(fv(r, "Total_Cracked_Eggs"));
    const dirty = num(fv(r, "Total_Dirty_Eggs"));
    const floor_ = num(fv(r, "Total_Floor_Eggs"));

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
    if (isWeek) {
      eggsThisWeek += eggs;
      hatchingEggsWeek += hatchEgg;
    }
    if (isMonth) {
      eggsThisMonth += eggs;
      hatchingEggsMonth += hatchEgg;
    }
    if (isYear) eggsThisYear += eggs;

    // ── Resolve breed via Flock lookup ─────────────────
    const flockRef = r.Flock;
    let recBreed = null;
    if (flockRef) {
      if (typeof flockRef === "object") {
        const flockId = String(flockRef.ID || flockRef.id || "");
        recBreed =
          flockIdBreedMap[flockId] ||
          displayVal(
            flockRef["Breed_Name"] || flockRef["Breed_Name.Breed_Name"] || "",
          ) ||
          displayVal(flockRef) ||
          null;
      } else {
        recBreed =
          flockIdBreedMap[String(flockRef)] || String(flockRef).trim() || null;
      }
    }

    // ── Accumulate into breedEggData ───────────────────
    if (recBreed) {
      ensureBreedEgg(recBreed);
      const b = breedEggData[recBreed];
      if (isWeek) {
        b.eggsWeek += eggs;
        b.hatchableWeek += hatchEgg;
        b.mortalityWeek += mortTotal;
        b.feedKgWeek += feedKg;
      }
      if (isMonth) {
        b.eggsMonth += eggs;
        b.hatchableMonth += hatchEgg;
        b.mortalityMonth += mortTotal;
        b.feedKgMonth += feedKg;
      }
      if (isYear) {
        b.eggsYear += eggs;
        b.mortalityYear += mortTotal;
        b.feedKgYear += feedKg;
      }
      b.farmRejectedTotal += farmRej;
      b.crackedTotal += cracked;
      b.dirtyTotal += dirty;
      b.floorTotal += floor_;
      b.mortalityFemale += mortFemale;
      b.mortalityMale += mortMale;
    }

    // ── Accumulate into farmEggData ────────────────────
    if (recFarm) {
      ensureFarmEgg(recFarm);
      const f = farmEggData[recFarm];
      if (isWeek) {
        f.eggsWeek += eggs;
        f.hatchableWeek += hatchEgg;
        f.mortalityWeek += mortTotal;
        f.feedKgWeek += feedKg;
      }
      if (isMonth) {
        f.eggsMonth += eggs;
        f.hatchableMonth += hatchEgg;
        f.mortalityMonth += mortTotal;
        f.feedKgMonth += feedKg;
      }
      if (isYear) {
        f.eggsYear += eggs;
        f.mortalityYear += mortTotal;
        f.feedKgYear += feedKg;
      }
      f.farmRejectedTotal += farmRej;
      f.crackedTotal += cracked;
      f.dirtyTotal += dirty;
      f.floorTotal += floor_;
      f.mortalityFemale += mortFemale;
      f.mortalityMale += mortMale;
    }

    // ── Accumulate into farmBreedEggData ───────────────
    if (recFarm && recBreed) {
      if (!farmBreedEggData[recFarm]) farmBreedEggData[recFarm] = {};
      if (!farmBreedEggData[recFarm][recBreed])
        farmBreedEggData[recFarm][recBreed] = emptyBreedEgg();
      const fb = farmBreedEggData[recFarm][recBreed];
      if (isWeek) {
        fb.eggsWeek += eggs;
        fb.hatchableWeek += hatchEgg;
        fb.mortalityWeek += mortTotal;
        fb.feedKgWeek += feedKg;
      }
      if (isMonth) {
        fb.eggsMonth += eggs;
        fb.hatchableMonth += hatchEgg;
        fb.mortalityMonth += mortTotal;
        fb.feedKgMonth += feedKg;
      }
      if (isYear) {
        fb.eggsYear += eggs;
        fb.mortalityYear += mortTotal;
        fb.feedKgYear += feedKg;
      }
      fb.farmRejectedTotal += farmRej;
      fb.mortalityFemale += mortFemale;
      fb.mortalityMale += mortMale;
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
  // Use this week's mortality for the % card — consistent with what farm-filter shows
  const mortalityPct =
    totalBirdsPlaced > 0
      ? parseFloat(((mortalityThisWeek / totalBirdsPlaced) * 100).toFixed(2))
      : 0;
  // Keep cumulative for alert threshold check only
  const mortalityPctCumulative =
    totalBirdsPlaced > 0
      ? parseFloat(((totalMortality / totalBirdsPlaced) * 100).toFixed(2))
      : 0;
  const worstFarm =
    Object.entries(farmMort).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
  const avgEggProductionRate =
    birdsAliveTotal > 0
      ? parseFloat(
        ((eggsThisMonth / Math.max(1, birdsAliveTotal)) * 100).toFixed(1),
      )
      : 0;
  const eggsWeeklyTrend = Object.values(weeklyEggTrend)
    .sort((a, b) => a.week - b.week)
    .slice(-6)
    .map((w) => ({
      w: `Wk ${w.week}`,
      eggs: w.eggs,
      feed: parseFloat(w.feed.toFixed(1)),
      mort: w.mort,
    }));

  /* ─── 3. DETAILED DAILY OPS ────────────────────────── */
  const detailedOps = await zohoGetAll("Detailed_Daily_Ops_Report", 1000);
  console.group("✅ [3] DETAILED DAILY OPS (Feed Mill)");
  console.log("Total records:", detailedOps.length);
  console.log(
    "Sample Feed_Consumed_Kg_Px:",
    detailedOps[0] ? fv(detailedOps[0], "Feed_Consumed_Kg_Px") : "—",
  );
  console.log(
    "Sample Feed_Consumed_Kg_Cx:",
    detailedOps[0] ? fv(detailedOps[0], "Feed_Consumed_Kg_Cx") : "—",
  );
  console.groupEnd();
  let feedProducedMT = 0,
    feedIssuedMT = 0;
  let feedProducedWeekMT = 0,
    feedIssuedWeekMT = 0,
    feedProducedYearMT = 0;
  const feedDayMap = {};
  detailedOps.forEach((r) => {
    const rawDate = fv(r, "Date_field") || fv(r, "Added_Time");
    const recDate = parseZohoDate(rawDate);
    const feedPx = num(fv(r, "Feed_Consumed_Kg_Px"));
    const feedCx = num(fv(r, "Feed_Consumed_Kg_Cx"));
    const totalFeed = feedPx + feedCx;
    if (recDate && recDate >= yearStart) feedProducedYearMT += totalFeed / 1000;
    if (recDate && recDate >= monthStart) {
      feedProducedMT += totalFeed / 1000;
      feedIssuedMT += (totalFeed * 0.97) / 1000;
      const dayKey = recDate.toLocaleDateString("en-US", { weekday: "short" });
      if (!feedDayMap[dayKey])
        feedDayMap[dayKey] = { d: dayKey, prod: 0, issued: 0 };
      feedDayMap[dayKey].prod += parseFloat((totalFeed / 1000).toFixed(2));
      feedDayMap[dayKey].issued += parseFloat(
        ((totalFeed * 0.97) / 1000).toFixed(2),
      );
    }
    if (recDate && recDate >= weekStart) {
      feedProducedWeekMT += totalFeed / 1000;
      feedIssuedWeekMT += (totalFeed * 0.97) / 1000;
    }
  });
  const DAYS_ORDER = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const feedTrend = DAYS_ORDER.filter((d) => feedDayMap[d]).map((d) => ({
    d,
    prod: parseFloat(feedDayMap[d].prod.toFixed(1)),
    issued: parseFloat(feedDayMap[d].issued.toFixed(1)),
  }));

  /* ─── 4. HATCHERY (hatches_SF_Report) — breed via Breed_Name1 ───── */
  const hatchSF = await zohoGetAll("Detailed_Hatches");
  console.group("✅ [4] HATCHERY REPORT");
  console.log("Total records:", hatchSF.length);
  console.log(
    "Records with Eggs_Details subform:",
    hatchSF.filter(
      (h) => Array.isArray(h.Eggs_Details) && h.Eggs_Details.length > 0,
    ).length,
  );
  console.log("Statuses present:", [
    ...new Set(hatchSF.map((h) => fv(h, "Status") || "null")),
  ]);
  console.log(
    "Sample Eggs_Details[0]:",
    hatchSF.find(
      (h) => Array.isArray(h.Eggs_Details) && h.Eggs_Details.length > 0,
    )?.Eggs_Details[0],
  );
  console.groupEnd();
  function diagnoseHatchRecord(rec) {
    console.group("=== HATCH SF RECORD STRUCTURE ===");
    console.log("Top-level keys:", Object.keys(rec));
    console.log(
      "Breed field candidates:",
      Object.entries(rec)
        .filter(([k, v]) => typeof v === "string" || (v && v.zc_display_value))
        .map(([k, v]) => `${k}: ${v?.zc_display_value ?? v}`),
    );
    console.groupEnd();
  }
  hatchSF.slice(0, 3).forEach(diagnoseHatchRecord);
  // Add right after: hatchSF.slice(0, 3).forEach(diagnoseHatchRecord);
  hatchSF.slice(0, 2).forEach((h, i) => {
    console.log(
      `[WAFAD] Hatch[${i}] Eggs_Details:`,
      h.Eggs_Details,
      "| isArray:",
      Array.isArray(h.Eggs_Details),
      "| length:",
      Array.isArray(h.Eggs_Details) ? h.Eggs_Details.length : "N/A",
    );
  });
  let eggsSetWeek = 0,
    eggsSetMonth = 0,
    eggsSetYear = 0;
  let eggsSetLastWeek = 0,
    eggsSetLastMonth = 0;
  let goodChicksWeek = 0,
    goodChicksMonth = 0,
    goodChicksYear = 0;
  let goodChicksLastWeek = 0,
    goodChicksLastMonth = 0;
  let poorChicksMonth = 0,
    fertileEggsMonth = 0;
  const hatchBatchMap = {};

  // breed-keyed hatch accumulators
  const breedHatchData = {};
  const ensureBreedHatch = (b) => {
    if (b && !breedHatchData[b]) breedHatchData[b] = emptyBreedHatch();
  };

  hatchSF.forEach((h) => {
    const status = (fv(h, "Status") || "").toLowerCase().trim();
    const isHatched = status === "hatched";

    const settingDateRaw = fv(h, "Setting_Date");
    const hatchedDateRaw = fv(h, "Hatched_Date");
    const settingDate = parseZohoDate(settingDateRaw);
    const hatchedDate =
      hatchedDateRaw && hatchedDateRaw !== ""
        ? parseZohoDate(hatchedDateRaw)
        : null;

    // ❌ DELETE THIS ENTIRE BLOCK — good/fertile undefined here
    // if (isHatched && hatchedDate) {
    //   const mKeyHatch = mkMonthKey(hatchedDate);
    //   if (mKeyHatch) {
    //     ensureMonth(monthlyHatchData, mKeyHatch, HATCH_TPL);
    //     monthlyHatchData[mKeyHatch].goodChicks += good;
    //     monthlyHatchData[mKeyHatch].fertile += fertile;
    //   }
    // }

    const batch = fv(h, "Hatch_No") || "B";
    if (!hatchBatchMap[batch])
      hatchBatchMap[batch] = { set: 0, fertile: 0, hatched: 0 };

    const eggRows = h.Eggs_Details;
    if (Array.isArray(eggRows) && eggRows.length > 0) {
      eggRows.forEach((row) => {
        const breed =
          displayVal(
            row.Birds || row["Birds.Name"] || row.Breed_Name1 || "",
          ).trim() || "Unknown";
        const settable = num(row.Settable_Eggs ?? 0);
        const fertile = num(row.Fertile_Eggs ?? 0);
        const good = num(row.Good_Chicks ?? 0);
        const poor = num(row.Poor_Hatch_Culls ?? 0);

        ensureBreedHatch(breed);

        // ✅ settable eggs — keyed by settingDate
        if (settingDate && !isNaN(settingDate)) {
          const mKeySet = mkMonthKey(settingDate);
          if (mKeySet) {
            ensureMonth(monthlyHatchData, mKeySet, HATCH_TPL);
            monthlyHatchData[mKeySet].eggsSet += settable;
          }
          if (settingDate >= yearStart) {
            eggsSetYear += settable;
            breedHatchData[breed].eggsSetYear += settable;
          }
          if (settingDate >= monthStart) {
            eggsSetMonth += settable;
            breedHatchData[breed].eggsSetMonth += settable;
          }
          if (settingDate >= weekStart) {
            eggsSetWeek += settable;
            breedHatchData[breed].eggsSetWeek += settable;
          }
          if (settingDate >= lastWeekStart && settingDate <= lastWeekEnd)
            eggsSetLastWeek += settable;
          if (settingDate >= lastMonthStart && settingDate <= lastMonthEnd)
            eggsSetLastMonth += settable;
        }
        breedHatchData[breed].settableEggs += settable;
        hatchBatchMap[batch].set += settable;

        // ✅ good chicks / fertile — keyed by hatchedDate, only when status = hatched
        if (isHatched && hatchedDate && !isNaN(hatchedDate)) {
          const mKeyHatch = mkMonthKey(hatchedDate);
          if (mKeyHatch) {
            ensureMonth(monthlyHatchData, mKeyHatch, HATCH_TPL);
            monthlyHatchData[mKeyHatch].goodChicks += good; // ✅ good IS defined here
            monthlyHatchData[mKeyHatch].fertile += fertile; // ✅ fertile IS defined here
          }
          hatchBatchMap[batch].fertile += fertile;
          hatchBatchMap[batch].hatched += good;
          if (hatchedDate >= yearStart) {
            goodChicksYear += good;
            breedHatchData[breed].goodChicksYear += good;
          }
          if (hatchedDate >= monthStart) {
            goodChicksMonth += good;
            poorChicksMonth += poor;
            fertileEggsMonth += fertile;
            breedHatchData[breed].goodChicksMonth += good;
            breedHatchData[breed].fertileEggs += fertile;
            breedHatchData[breed].poorChicks += poor;
          }
          if (hatchedDate >= weekStart) {
            goodChicksWeek += good;
            breedHatchData[breed].goodChicksWeek += good;
          }
          if (hatchedDate >= lastWeekStart && hatchedDate <= lastWeekEnd)
            goodChicksLastWeek += good;
          if (hatchedDate >= lastMonthStart && hatchedDate <= lastMonthEnd)
            goodChicksLastMonth += good;
        }
      });
    }
  });


  const hatchWeeklyTrend = Object.entries(hatchBatchMap)
    .sort((a, b) => String(a[0]).localeCompare(String(b[0])))
    .slice(-4)
    .map(([, d], i) => ({
      w: `Batch ${i + 1}`,
      set: d.set,
      fertile: d.fertile,
      hatched: d.hatched,
    }));
  const hatchabilityWeek =
    eggsSetWeek > 0
      ? parseFloat(((goodChicksWeek / eggsSetWeek) * 100).toFixed(1))
      : 0;
  const hatchabilityMonth =
    eggsSetMonth > 0
      ? parseFloat(((goodChicksMonth / eggsSetMonth) * 100).toFixed(1))
      : 0;
  const hatchabilityYear =
    eggsSetYear > 0
      ? parseFloat(((goodChicksYear / eggsSetYear) * 100).toFixed(1))
      : 0;
  const fertilityRate =
    eggsSetMonth > 0
      ? parseFloat(((fertileEggsMonth / eggsSetMonth) * 100).toFixed(1))
      : 0;

  /* ─── 5. STORAGE DETAILS — available eggs per breed ─────────────── */
  // Storage_Details report → Eggs_Details subform
  // Subform fields: Birds (breed lookup), Available_Eggs, Hatchery_Line_Name
  const storageDetails = await zohoGetAll("Storage_Details_SF_Report");
  console.group("✅ [5] STORAGE DETAILS");
  console.log("Total records:", storageDetails.length);
  console.log("Sample record:", storageDetails[0]);
  console.log(
    "Sample breed field:",
    storageDetails[0]
      ? displayVal(storageDetails[0]["Birds.Name"] || storageDetails[0].Birds)
      : "—",
  );
  console.log("Sample Available_Eggs:", storageDetails[0]?.Available_Eggs);
  console.groupEnd();
  const breedStorageEggs = {}; // breed → available eggs total
  let totalStorageEggs = 0;
  storageDetails.forEach((s) => {
    // The storage report may have a subform with breed + available eggs
    const eggRows = s.Eggs_Details || s.Storage_SF || s.Egg_Storage_Details;

    if (Array.isArray(eggRows) && eggRows.length > 0) {
      eggRows.forEach((row) => {
        const breed = displayVal(
          row["Birds.Name"] ||
          row["Bird_Type.Name"] ||
          row.Birds ||
          row.Bird_Type ||
          row.Breed_Name ||
          row.Breed ||
          "",
        ).trim();
        const avail = num(row.Available_Eggs ?? row.Available ?? 0);
        if (!breed) return;
        breedStorageEggs[breed] = (breedStorageEggs[breed] || 0) + avail;
        totalStorageEggs += avail;
      });
    } else {
      // Flat record — try all breed field variants
      const breed = displayVal(
        s["Birds.Name"] ||
        s["Bird_Type.Name"] ||
        s["Breed.Name"] ||
        s.Birds ||
        s.Bird_Type ||
        s.Breed_Name ||
        s.Breed ||
        s.Bird ||
        "",
      ).trim();
      const avail = num(s.Available_Eggs ?? s.Available ?? 0);
      if (!window._storageLogged) {
        window._storageLogged = true;
        console.log("[WAFAD] Storage keys:", Object.keys(s));
        console.log("[WAFAD] Storage full record:", JSON.stringify(s));
      }
      if (!breed) return;
      breedStorageEggs[breed] = (breedStorageEggs[breed] || 0) + avail;
      totalStorageEggs += avail;
    }
  });
  console.log("[WAFAD] Storage eggs by breed:", breedStorageEggs);

  /* ─── 6. DAY OLD CHICKS — stock per breed ───────────────────────── */
  const docRecords = await zohoGetAll("Day_Old_Chicks_Report");
  console.group("✅ [6] DAY OLD CHICKS");
  console.log("Total records:", docRecords.length);
  console.log("Sample record:", docRecords[0]);
  console.log(
    "Sample Available_Chicks:",
    docRecords[0]?.Available_Chicks ?? docRecords[0]?.Available_Qty,
  );
  console.groupEnd();
  const breedDOC = {}; // breed → available chicks
  let totalDOC = 0;
  docRecords.forEach((d) => {
    const breed =
      displayVal(d.Breed_Name || d["Breed_Name.Breed_Name"] || "") || "Unknown";
    const avail = num(d.Available_Chicks ?? d.Available_Qty ?? 0);
    breedDOC[breed] = (breedDOC[breed] || 0) + avail;
    totalDOC += avail;
  });
  console.log("[WAFAD] DOC by breed:", breedDOC);

  /* ─── 7. INVOICES ────────────────────────────────────────────────── */
  const invoices = await zohoGetAll("All_Invoices");
  console.group("✅ [7] INVOICES");
  console.log("Total records:", invoices.length);
  console.log("Statuses:", [
    ...new Set(invoices.map((i) => fv(i, "Status") || "null")),
  ]);
  console.log(
    "Sample Total_Amount:",
    invoices[0] ? fv(invoices[0], "Total_Amount") : "—",
  );
  console.groupEnd();
  let revenueWeek = 0,
    revenueMonth = 0,
    revenueYear = 0;
  let receivablesWeek = 0,
    receivablesMonth = 0,
    receivablesTotal = 0;
  const custMap = {},
    productRevenueMap = {};
  // ─── REPLACE WITH ────────────────────────────────────
  let sellingPriceEggWeekSum = 0,
    sellingPriceEggWeekQty = 0;
  invoices.forEach((inv) => {
    const rawDate =
      fv(inv, "Date_field") ||
      fv(inv, "Invoice_Date") ||
      fv(inv, "Date") ||
      fv(inv, "Added_Time");
    const recDate = parseZohoDate(rawDate);
    const amount = num(fv(inv, "Total_Amount"));
    const status = (fv(inv, "Status") || "").toLowerCase().trim();
    const customer = displayVal(inv.Customer || "") || "Unknown";
    const prodName = displayVal(inv.Product_Name || "") || "Other";
    const isPaid = status === "paid" || status === "invoiced";
    const isUnpaid =
      status === "draft" ||
      status === "submitted" ||
      status === "viewed" ||
      status === "open";
    if (isPaid && recDate) {
      const mKey = mkMonthKey(recDate);
      ensureMonth(monthlyFinData, mKey, FIN_TPL);
      monthlyFinData[mKey].revenue += amount;
    }
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
    if (status !== "void" && status !== "draft" && amount > 0)
      custMap[customer] = (custMap[customer] || 0) + amount;
    if (prodName && amount > 0)
      productRevenueMap[prodName] = (productRevenueMap[prodName] || 0) + amount;
    // ADD inside invoices.forEach — capture egg selling prices
    if (isPaid && recDate) {
      const prodLines = inv.Product_Details_SF || inv.Line_Items || [];
      if (Array.isArray(prodLines)) {
        prodLines.forEach((p) => {
          const pName = displayVal(p.Product_Name || "").toUpperCase();
          const pUnit = displayVal(
            p.Unit || p.Unit_Details || "",
          ).toLowerCase();
          const pPrice = num(fv(p, "Unit_Price") || fv(p, "Rate") || 0);
          const pQty = num(fv(p, "Quantity") || 0);
          const isEggLine =
            pUnit.includes("egg") ||
            pName.includes("EGG") ||
            pName.includes("HATCHING");
          if (isEggLine && pPrice > 0 && pQty > 0) {
            sellingPriceEggWeekSum =
              (sellingPriceEggWeekSum || 0) + pPrice * pQty;
            sellingPriceEggWeekQty = (sellingPriceEggWeekQty || 0) + pQty;
          }
        });
      }
    }
  });

  const sellingPriceHatchingEgg =
    sellingPriceEggWeekQty > 0
      ? Math.round(sellingPriceEggWeekSum / sellingPriceEggWeekQty)
      : 0;

  const top20Customers = Object.entries(custMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([name, revenue]) => ({ name, qty: revenue }));

  /* ─── 8. SALES ORDERS — use Unit_Details = "chick" for chick orders  */
  // Unit_Details is a text field that contains the unit name (e.g. "chick", "bag", "kg")
  // Product_Details_SF subform: Unit_Details (text), Quantity, Product_Name
  // ADD this line just before: const salesOrders = await zohoGetAll("Sales_Order_Report");
  const productPriceMap = {}; // will be populated in section 11, used as empty map here for now
  const salesOrders = await zohoGetAll("Sales_Order_Report");
  console.group("✅ [8] SALES ORDERS");
  console.log("Total records:", salesOrders.length);
  console.log("Statuses:", [
    ...new Set(salesOrders.map((o) => fv(o, "Status") || "null")),
  ]);
  const sampleSO = salesOrders.find(
    (o) =>
      Array.isArray(o.Product_Details_SF) && o.Product_Details_SF.length > 0,
  );
  console.log(
    "Sample Product_Details_SF line:",
    sampleSO?.Product_Details_SF[0],
  );
  console.log(
    "Sample Unit_Details:",
    sampleSO?.Product_Details_SF[0]?.Unit_Details,
  );
  console.groupEnd();
  let confirmedOrdersWeek = 0,
    confirmedOrdersMonth = 0,
    confirmedOrdersYear = 0;
  let pendingOrdersWeek = 0,
    pendingOrdersMonth = 0;
  let confirmedChicksWeek = 0,
    confirmedChicksMonth = 0,
    confirmedChicksYear = 0;
  let pendingChicksWeek = 0,
    pendingChicksMonth = 0;
  const regionMap = {};
  // ─── REPLACE WITH ────────────────────────────────────
  // const CONFIRMED_STATUSES = new Set([
  //   "invoiced", "closed", "fulfilled", "confirmed",
  //   "delivered", "completed", "approved", "dispatched", "Invoiced"
  // ]);
  // const PENDING_STATUSES = new Set([
  //   "draft", "open", "pending", "submitted", "Draft",
  //   "new", "in progress", "processing", "null"
  // ]);

  const CONFIRMED_STATUSES = new Set([
    "invoiced",
    "closed",
    "fulfilled",
    "confirmed",
    "delivered",
    "completed",
    "approved",
    "dispatched",
    "Invoiced",
    "Delivered",
    "Completed",
    "Approved", // ← ADD THESE (capitalized versions)
  ]);
  const PENDING_STATUSES = new Set([
    "draft",
    "open",
    "pending",
    "submitted",
    "Draft",
    "new",
    "in progress",
    "processing",
    "null",
    "Pending",
    "New",
    "Open", // ← ADD THESE
  ]);

  // ADD before salesOrders.forEach:
  const breedRevenueMonth = {}; // breed → revenue this month
  const breedRevenueYear = {}; // breed → revenue this year
  const c4uRegionMap = {};


  let sellingPriceYTDSum = 0, sellingPriceYTDQty = 0;

  let sellingPriceWeekSum = 0,
    sellingPriceWeekQty = 0;
  let sellingPriceLastWeekSum = 0,
    sellingPriceLastWeekQty = 0;
  // ─── REPLACE WITH ────────────────────────────────────
  salesOrders.forEach((o) => {
    const statusRaw = fv(o, "Status") || fv(o, "Order_Status") || "";
    const status = (
      typeof statusRaw === "string" ? statusRaw : displayVal(statusRaw)
    )
      .toLowerCase()
      .trim();
    const rawDate =
      fv(o, "Date_field") ||
      fv(o, "Order_Date") ||
      fv(o, "Date") ||
      fv(o, "Added_Time");
    const recDate = parseZohoDate(rawDate);

    const productLines =
      o.Product_Details_SF || o.Product_Details || o.Line_Items || [];

    let orderQty = 0,
      chickQty = 0;
    if (Array.isArray(productLines) && productLines.length > 0) {
      productLines.forEach((p) => {
        const qty = num(
          fv(p, "Quantity") || fv(p, "Qty") || fv(p, "Total_Quantity") || 0,
        );
        orderQty += qty;
        const unit = (
          displayVal(p.Unit_Details || p.Unit || "") || ""
        ).toLowerCase();
        const prodName = (
          displayVal(p.Product_Name || p.Product || "") || ""
        ).toLowerCase();
        if (
          unit.includes("chick") ||
          unit === "chicks" ||
          prodName.includes("chick")
        )
          chickQty += qty;
      });
    }
    if (orderQty === 0) {
      orderQty = num(
        fv(o, "Total_Quantity") || fv(o, "Quantity") || fv(o, "Total_Qty") || 0,
      );
      chickQty = orderQty;
    }



    // REPLACE selling price block inside salesOrders.forEach:
    if (CONFIRMED_STATUSES.has(status) && Array.isArray(productLines)) {
      productLines.forEach((p) => {
        const pQty = num(fv(p, "Quantity") || 0);
        if (pQty === 0) return;

        const unitRaw = (displayVal(p.Unit_Details || p.Unit || "") || "").toLowerCase();
        const pNameRaw = displayVal(p.Product_Name || p.Product || "").trim();
        const pNameUp = pNameRaw.toUpperCase();

        // Unit_Price is null in Zoho — use Rate field directly
        let linePrice = num(p.Rate || fv(p, "Unit_Price") || fv(p, "Rate") || 0);

        // Fallback: productPriceMap lookup by name
        if (linePrice === 0 && pNameUp) {
          const mapped = productPriceMap[pNameUp];
          if (mapped?.sellingPrice > 0) linePrice = mapped.sellingPrice;
        }
        if (linePrice === 0) return;

        const isChickLine =
          unitRaw.includes("chick") || unitRaw === "pcs" ||
          pNameUp.includes("DOC") || pNameUp.includes("GRANGER") ||
          pNameUp.includes("SASSO") || pNameUp.includes("NOVO") ||
          pNameUp.includes("JA57") || pNameUp.includes("BROILER") ||
          pNameUp.includes("LAYER") || pNameUp.includes("REDBRO") ||
          pNameUp.includes("EFFICIENCY") || pNameUp.includes("COCK");
        if (!isChickLine) return;

        if (recDate && recDate >= weekStart) {
          sellingPriceWeekSum += linePrice * pQty;
          sellingPriceWeekQty += pQty;
        }
        if (recDate && recDate >= lastWeekStart && recDate <= lastWeekEnd) {
          sellingPriceLastWeekSum += linePrice * pQty;
          sellingPriceLastWeekQty += pQty;
        }
        if (recDate && recDate >= yearStart) {
          sellingPriceYTDSum += linePrice * pQty;
          sellingPriceYTDQty += pQty;
        }
      });
    }

    // if (CONFIRMED_STATUSES.has(status) && Array.isArray(productLines)) {
    //   productLines.forEach((p) => {
    //     const pName = displayVal(
    //       p.Product_Name || p.Product || "",
    //     ).toUpperCase();
    //     const pPrice = num(fv(p, "Unit_Price") || fv(p, "Rate") || 0);
    //     const pQty = num(fv(p, "Quantity") || 0);
    //     const lineAmt = pPrice * pQty;
    //     if (lineAmt === 0) return;
    //     let revBreed = null;
    //     if (pName.includes("GRANGER") || pName.includes("REDBRO"))
    //       revBreed = "Redbro";
    //     else if (pName.includes("NOVO") && pName.includes("BROWN"))
    //       revBreed = "Novo Brown";
    //     else if (pName.includes("NOVO") && pName.includes("WHITE"))
    //       revBreed = "Novo White";
    //     else if (pName.includes("JA57") || pName.includes("JA 57"))
    //       revBreed = "Ja57Ki";
    //     else if (pName.includes("EFFICIENCY")) revBreed = "Efficiency Plus";
    //     if (revBreed) {
    //       if (recDate && recDate >= monthStart)
    //         breedRevenueMonth[revBreed] =
    //           (breedRevenueMonth[revBreed] || 0) + lineAmt;
    //       if (recDate && recDate >= yearStart)
    //         breedRevenueYear[revBreed] =
    //           (breedRevenueYear[revBreed] || 0) + lineAmt;
    //     }
    //   });
    // }

    // ── Real selling price per chick from confirmed line items ──────
    if (CONFIRMED_STATUSES.has(status) && Array.isArray(productLines)) {
      productLines.forEach((p) => {
        const pQty = num(fv(p, "Quantity") || 0);
        if (pQty === 0) return;
        const pNameRaw = displayVal(p.Product_Name || p.Product || "").trim();
        const pNameKey = pNameRaw.toUpperCase();
        const unitRaw = (
          displayVal(p.Unit_Details || p.Unit || "") || ""
        ).toLowerCase();
        // Check if this line item is a chick product
        const isChickByUnit = unitRaw.includes("chick");
        const isChickByName =
          pNameRaw.toLowerCase().includes("chick") ||
          pNameRaw.toUpperCase().includes("GRANGER") ||
          pNameRaw.toUpperCase().includes("LAYER") ||
          pNameRaw.toUpperCase().includes("BROILER") ||
          pNameRaw.toUpperCase().includes("NOVO") ||
          pNameRaw.toUpperCase().includes("JA57");
        const isChickByProduct = (
          productPriceMap[pNameKey]?.unit || ""
        ).includes("chick");
        if (!isChickByUnit && !isChickByName && !isChickByProduct) return;
        // Use only the actual invoice line price — no fallback
        const linePrice = num(fv(p, "Unit_Price") || fv(p, "Rate") || 0);
        if (linePrice === 0) return;
        if (recDate && recDate >= weekStart) {
          sellingPriceWeekSum += linePrice * pQty;
          sellingPriceWeekQty += pQty;
        }
        if (recDate && recDate >= lastWeekStart && recDate <= lastWeekEnd) {
          sellingPriceLastWeekSum += linePrice * pQty;
          sellingPriceLastWeekQty += pQty;
        }
      });
    }

    const qty = orderQty || 1;

    const region =
      displayVal(o.Region || o["Customer.Region"] || "") || "Other";

    regionMap[region] = (regionMap[region] || 0) + qty;

    if (CONFIRMED_STATUSES.has(status)) {
      if (recDate && recDate >= yearStart) {
        confirmedOrdersYear += qty;
        confirmedChicksYear += chickQty;
      }
      if (recDate && recDate >= monthStart) {
        confirmedOrdersMonth += qty;
        confirmedChicksMonth += chickQty;
      }
      if (recDate && recDate >= weekStart) {
        confirmedOrdersWeek += qty;
        confirmedChicksWeek += chickQty;
      }
    } else if (PENDING_STATUSES.has(status)) {
      if (recDate && recDate >= monthStart) {
        pendingOrdersMonth += qty;
        pendingChicksMonth += chickQty;
      }
      if (recDate && recDate >= weekStart) {
        pendingOrdersWeek += qty;
        pendingChicksWeek += chickQty;
      }
    }
  });

  console.group("🔍 [Sales Price Debug]");
  const sampleConfirmed = salesOrders
    .filter((o) => {
      const s = (fv(o, "Status") || "").toLowerCase();
      return CONFIRMED_STATUSES.has(s);
    })
    .slice(0, 3);
  sampleConfirmed.forEach((o, i) => {
    const lines = o.Product_Details_SF || [];
    console.log(
      `ConfirmedSO[${i}] status:`,
      fv(o, "Status"),
      "| lines:",
      lines.length,
    );
    lines.slice(0, 2).forEach((p, j) => {
      console.log(`  line[${j}]:`, {
        Product_Name: displayVal(p.Product_Name || ""),
        Unit_Details: displayVal(p.Unit_Details || ""),
        Unit_Price: fv(p, "Unit_Price"),
        Rate: fv(p, "Rate"),
        Quantity: fv(p, "Quantity"),
      });
    });
  });
  console.groupEnd();

  // Weighted average selling price per chick — real data only, no fallback
  const sellingPriceWeek =
    sellingPriceWeekQty > 0
      ? Math.round(sellingPriceWeekSum / sellingPriceWeekQty)
      : 0;
  const sellingPriceLastWeek =
    sellingPriceLastWeekQty > 0
      ? Math.round(sellingPriceLastWeekSum / sellingPriceLastWeekQty)
      : 0;

  console.log(
    "[WAFAD] sellingPriceWeek:",
    sellingPriceWeek,
    "qty:",
    sellingPriceWeekQty,
  );
  console.log(
    "[WAFAD] sellingPriceLastWeek:",
    sellingPriceLastWeek,
    "qty:",
    sellingPriceLastWeekQty,
  );

  const REGION_COLORS = [C.blue, C.green, C.amber, C.purple, C.cyan, C.orange];
  const regionalDemand = Object.entries(regionMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([region, orders], i) => ({
      region,
      orders,
      color: REGION_COLORS[i],
    }));

  /* ─── 9. PAYMENTS ────────────────────────────────────────────────── */
  const payments = await zohoGetAll("Payment_Received_Report");
  console.group("✅ [9] PAYMENTS");
  console.log("Total records:", payments.length);
  console.log(
    "Sample Amount_Received:",
    payments[0] ? fv(payments[0], "Amount_Received") : "—",
  );
  console.log(
    "Sample Payment_Date:",
    payments[0] ? fv(payments[0], "Payment_Date") : "—",
  );
  console.groupEnd();
  let cashReceivedWeek = 0,
    cashReceivedMonth = 0,
    cashReceivedYear = 0;
  // ─── REPLACE WITH ────────────────────────────────────
  payments.forEach((p) => {
    const amt = num(fv(p, "Amount_Received"));
    const rawDate =
      fv(p, "Payment_Date") || fv(p, "Date") || fv(p, "Added_Time");
    const recDate = parseZohoDate(rawDate);
    const mKey = mkMonthKey(recDate);
    if (mKey) {
      ensureMonth(monthlyFinData, mKey, FIN_TPL);
      monthlyFinData[mKey].cashIn += amt;
    }
    if (recDate && recDate >= yearStart) cashReceivedYear += amt;
    if (recDate && recDate >= monthStart) cashReceivedMonth += amt;
    if (recDate && recDate >= weekStart) cashReceivedWeek += amt;
  });

  let c4uFeedRevenueMonth = 0;
  let c4uFeedQtyMonth = 0; // in kg

  let feedPricePerKgSum = 0,
    feedPricePerKgCount = 0;

  /* ─── 10. OPERATIONAL REQUESTS ──────────────────────────────────── */
  const opRequests = await zohoGetAll("All_Operational_Requests");
  console.group("✅ [10] OPERATIONAL REQUESTS (Expenses)");
  console.log("Total records:", opRequests.length);
  console.log("Statuses:", [
    ...new Set(opRequests.map((r) => fv(r, "Status") || "null")),
  ]);
  console.log("Finance statuses:", [
    ...new Set(opRequests.map((r) => fv(r, "Finance_Status") || "null")),
  ]);
  console.log(
    "Request types sample:",
    opRequests.slice(0, 5).map((r) => fv(r, "Request_Type")),
  );
  console.log(
    "Sample Actual_Total_Cost:",
    opRequests[0] ? fv(opRequests[0], "Actual_Total_Cost") : "—",
  );
  console.groupEnd();
  let totalExpenseWeek = 0,
    totalExpenseMonth = 0,
    totalExpenseYear = 0;
  let feedExpenseMonth = 0,
    vetExpenseMonth = 0,
    labourExpenseMonth = 0;
  let pendingPaymentsCount = 0,
    approvedNotPaidCount = 0;
  const expenseByCategoryMonth = {};
  // ─── REPLACE WITH ────────────────────────────────────
  opRequests.forEach((r) => {
    const rawDate =
      fv(r, "Requested_Date_And_Time") ||
      fv(r, "Request_Date") ||
      fv(r, "Date") ||
      fv(r, "Added_Time");
    const recDate = parseZohoDate(rawDate);
    const amount = num(fv(r, "Actual_Total_Cost") || 0);
    const status = (fv(r, "Status") || "").toLowerCase().trim();
    const finStatus = (fv(r, "Finance_Status") || "").toLowerCase().trim();
    const payStatus = (fv(r, "Payment_Status") || "").toLowerCase().trim();
    const reqType = (fv(r, "Request_Type") || "Other").toString();
    const mainCat = displayVal(r.Main_Category || "") || "Other";
    const isApproved =
      status === "approved" ||
      finStatus === "posted" ||
      finStatus === "approved";
    const isPaid = payStatus === "paid";
    if (!isPaid && isApproved) approvedNotPaidCount++;
    if (status === "pending" || status === "requested" || status === "new")
      pendingPaymentsCount++;
    if (isApproved && recDate) {
      const mKey = mkMonthKey(recDate);
      if (mKey) {
        ensureMonth(monthlyFinData, mKey, FIN_TPL);
        monthlyFinData[mKey].expense += amount;
      }
      if (recDate >= yearStart) totalExpenseYear += amount;
      if (recDate >= weekStart) totalExpenseWeek += amount;
      if (recDate >= monthStart) {
        totalExpenseMonth += amount;
        expenseByCategoryMonth[mainCat] =
          (expenseByCategoryMonth[mainCat] || 0) + amount;
        const rtUp = reqType.toUpperCase();
        if (rtUp.includes("FEED") || rtUp.includes("RAW"))
          feedExpenseMonth += amount;
        else if (
          rtUp.includes("MED") ||
          rtUp.includes("VET") ||
          rtUp.includes("VACC")
        )
          vetExpenseMonth += amount;
        else if (
          rtUp.includes("LABOUR") ||
          rtUp.includes("SALARY") ||
          rtUp.includes("STAFF")
        )
          labourExpenseMonth += amount;
      }
    }
  });

  // ADD after the opRequests.forEach loop closes
  console.group("🔍 [OpEx Debug] Expense breakdown");
  console.log("All statuses seen:", [
    ...new Set(opRequests.map((r) => fv(r, "Status") || "null")),
  ]);
  console.log("All finance statuses seen:", [
    ...new Set(opRequests.map((r) => fv(r, "Finance_Status") || "null")),
  ]);
  console.log("All payment statuses seen:", [
    ...new Set(opRequests.map((r) => fv(r, "Payment_Status") || "null")),
  ]);
  opRequests.slice(0, 3).forEach((r, i) => {
    console.log(`OpReq[${i}]:`, {
      Status: fv(r, "Status"),
      Finance_Status: fv(r, "Finance_Status"),
      Payment_Status: fv(r, "Payment_Status"),
      Actual_Total_Cost: fv(r, "Actual_Total_Cost"),
      Date:
        fv(r, "Requested_Date_And_Time") ||
        fv(r, "Request_Date") ||
        fv(r, "Added_Time"),
      Request_Type: fv(r, "Request_Type"),
    });
  });
  console.groupEnd();

  const costPerHatchingEgg = (() => {
    if (eggsSetMonth > 0 && feedExpenseMonth > 0)
      return Math.round(feedExpenseMonth / eggsSetMonth);
    // YTD fallback
    if (eggsSetYear > 0 && feedExpenseYear > 0)
      return Math.round(feedExpenseYear / eggsSetYear);
    return 0;
  })();

  // const costPerHatchingEgg =
  //   eggsSetMonth > 0 && totalExpenseMonth > 0
  //     ? Math.round(totalExpenseMonth / eggsSetMonth)
  //     : 0;

  // Feed cost this week = feedIntakeTonsWeek * costPerFeedKg
  const feedCostWeek = feedIntakeTonsWeek * 1000 * (costPerFeedKg || 0);
  const feedCostMonth = feedIntakeTonsMonth * 1000 * (costPerFeedKg || 0);

  // Cost per chick = feed expense ÷ good chicks hatched
  const costPerChickWeek = (() => {
    // Week
    if (goodChicksWeek > 0 && feedExpenseWeek > 0)
      return Math.round(feedExpenseWeek / goodChicksWeek);
    // Month
    if (goodChicksMonth > 0 && feedExpenseMonth > 0)
      return Math.round(feedExpenseMonth / goodChicksMonth);
    // YTD
    if (goodChicksYear > 0 && feedExpenseYear > 0)
      return Math.round(feedExpenseYear / goodChicksYear);
    return 0;
  })();

  const costPerChickLastWk = (() => {
    if (goodChicksLastWeek > 0 && feedExpenseWeek > 0)
      return Math.round(feedExpenseWeek / goodChicksLastWeek);
    if (goodChicksLastMonth > 0 && feedExpenseMonth > 0)
      return Math.round(feedExpenseMonth / goodChicksLastMonth);
    return 0;
  })();

  console.log("[WAFAD] Cost KPIs →",
    "costPerHatchingEgg:", costPerHatchingEgg,
    "| costPerChickWeek:", costPerChickWeek,
    "| costPerChickLastWk:", costPerChickLastWk
  );


  const grossMargin =
    revenueMonth > 0
      ? parseFloat(
        (((revenueMonth - totalExpenseMonth) / revenueMonth) * 100).toFixed(
          1,
        ),
      )
      : 0;
  const margins = Object.entries(productRevenueMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([product, rev]) => ({
      product: product.length > 14 ? product.slice(0, 14) + "…" : product,
      margin:
        revenueMonth > 0
          ? parseFloat(((rev / revenueMonth) * 100).toFixed(1))
          : 0,
    }))
    .filter((m) => m.margin > 0);
  const budgetVsActual = [
    feedExpenseMonth > 0
      ? {
        line: "Feed Cost",
        budget: feedIntakeTonsMonth * 1000 * costPerFeedKg * 1.05,
        actual: feedExpenseMonth,
      }
      : null,
    labourExpenseMonth > 0
      ? { line: "Labour", budget: 0, actual: labourExpenseMonth }
      : null,
    vetExpenseMonth > 0
      ? { line: "Veterinary", budget: 0, actual: vetExpenseMonth }
      : null,
    totalExpenseMonth > 0
      ? { line: "Total OpEx", budget: 0, actual: totalExpenseMonth }
      : null,
  ]
    .filter(Boolean)
    .filter((b) => b.actual > 0);

  /* ─── BREED PROFIT MARGINS ───────────────────────────── */
  // Feed cost per breed = feedKgMonth × costPerFeedKg
  // Revenue per breed = breedRevenueMonth
  const breedProfitMargins = Object.keys(breedEggData)
    .map((breed) => {
      const feedCost =
        (breedEggData[breed].feedKgMonth || 0) * (costPerFeedKg || 285);
      const revenue = breedRevenueMonth[breed] || 0;
      const grossProfit = revenue - feedCost;
      const marginPct =
        revenue > 0
          ? parseFloat(((grossProfit / revenue) * 100).toFixed(1))
          : 0;
      return { breed, revenue, feedCost, grossProfit, marginPct };
    })
    .filter((b) => b.revenue > 0 || b.feedCost > 0)
    .sort((a, b) => b.revenue - a.revenue);

  /* ─── INCOME vs EXPENDITURE TREND ───────────────────── */
  const incomeExpTrend = [
    {
      period: "This Week",
      income: cashReceivedWeek,
      expense: totalExpenseWeek,
    },
    {
      period: "This Month",
      income: cashReceivedMonth,
      expense: totalExpenseMonth,
    },
    {
      period: "This Year",
      income: cashReceivedYear,
      expense: totalExpenseYear,
    },
  ];

  /* ─── 11. PRODUCTS & STOCK ───────────────────────────────────────── */
  const products = await zohoGetAll("Product_Details_Report");
  console.group("✅ [11] PRODUCTS / STOCK");
  console.log("Total records:", products.length);
  console.log("Sample keys:", products[0] ? Object.keys(products[0]) : "EMPTY");
  console.log(
    "Sample Selling_Price:",
    products[0] ? fv(products[0], "Selling_Price") : "—",
  );
  console.log(
    "Sample Category_Name:",
    products[0] ? displayVal(products[0].Category_Name) : "—",
  );
  console.log("Sample Unit:", products[0] ? displayVal(products[0].Unit) : "—");
  console.log(
    "Sample Chicken4U_Product:",
    products[0] ? displayVal(products[0].Chicken4U_Product) : "—",
  );
  console.log(
    "Sample Net_Chick_Count:",
    products[0] ? fv(products[0], "Net_Chick_Count") : "—",
  );
  console.groupEnd();

  let totalStockValue = 0;
  const criticalStock = [],
    productStockList = [];
  let sellingPriceChickSum = 0,
    sellingPriceChickCount = 0;
  let sellingPriceEggSum = 0,
    sellingPriceEggCount = 0;
  // const breedDOC_fromProducts = {};
  // let totalDOC_fromProducts = 0;

  products.forEach((prod) => {
    const name = (fv(prod, "Product_Name") || "").trim();
    const docName = displayVal(prod.DOC_Name || "").trim();
    const minStock = num(fv(prod, "Min_Stock"));
    const totalAvail = num(fv(prod, "Total_Available_Stock"));
    const netChickCount = num(fv(prod, "Net_Chick_Count") || 0);
    const sellingPrice = num(fv(prod, "Selling_Price") || 0);
    const status = (fv(prod, "Status") || "").toLowerCase();
    const unit = displayVal(prod.Unit || "")
      .toLowerCase()
      .trim();
    const categoryName = displayVal(prod.Category_Name || "")
      .toLowerCase()
      .trim();

    // If product has Chicken4U_Product flag, register it with C4U product key too
    const c4uProductFlag = displayVal(
      prod.Chicken4U_Product || "",
    ).toLowerCase();
    if (c4uProductFlag === "yes" || c4uProductFlag === "true") {
      // Also index by DOC_Name for C4U matching
      const docKey = docName.toUpperCase();
      if (docKey)
        productPriceMap[docKey] = {
          sellingPrice,
          unit,
          category: categoryName,
        };
    }

    // Feed price per kg from product catalogue selling price
    if (isFeedProduct(name, categoryName) && sellingPrice > 0) {
      const unitL = unit.toLowerCase();
      let pricePerKg = 0;
      if (unitL === "kg") {
        pricePerKg = sellingPrice;
      } else if (unitL.includes("50kg") || unitL === "50 kg bag") {
        pricePerKg = sellingPrice / 50;
      } else if (unitL.includes("25kg") || unitL === "25 kg bag") {
        pricePerKg = sellingPrice / 25;
      } else {
        // Default assumption: 50 kg bag
        pricePerKg = sellingPrice / 50;
      }
      if (pricePerKg > 5) {
        feedPricePerKgSum += pricePerKg;
        feedPricePerKgCount++;
      }
    }

    // Build price lookup by both Product_Name and DOC_Name (uppercase keys)
    const keys = [name.toUpperCase(), docName.toUpperCase()].filter(Boolean);
    keys.forEach((k) => {
      if (k)
        productPriceMap[k] = { sellingPrice, unit, category: categoryName };
    });

    totalStockValue += totalAvail;

    // Aggregate selling prices by unit type for avg display
    if (sellingPrice > 0) {
      const isChickUnit = unit === "chicks" || unit === "chick";
      const isChickCat =
        categoryName.includes("day old") || categoryName.includes("chick");
      const isEggUnit = unit === "egg" || unit === "eggs";
      const isEggCat = categoryName.includes("egg");
      if (isChickUnit || isChickCat) {
        sellingPriceChickSum += sellingPrice;
        sellingPriceChickCount++;
      } else if (isEggUnit || isEggCat) {
        sellingPriceEggSum += sellingPrice;
        sellingPriceEggCount++;
      }
    }


    if (status !== "inactive") {
      productStockList.push({
        name: name || "—",
        stock: totalAvail,
        min: minStock,
        sellingPrice,
        unit,
      });
      if (totalAvail <= minStock && minStock > 0) {
        criticalStock.push({
          item: name || "—",
          status: totalAvail === 0 ? "Critical" : "Low",
          stock: totalAvail,
        });
      }
    }
  });

  /* ─── Feed cost reconciliation using Feed_Details subform ── */
  /* ─── Feed cost reconciliation using Feed_Details subform ── */
  let feedCostFromSubformMonth = 0, feedKgFromSubformMonth = 0;
  let feedCostFromSubformWeek = 0, feedKgFromSubformWeek = 0;
  let feedCostFromSubformYear = 0, feedKgFromSubformYear = 0;
  // Gender-split for reporting
  let feedCostMaleMonth = 0, feedCostFemaleMonth = 0;

  console.group("🔍 [Feed Subform Cost Reconciliation]");
  console.log("Total feed usage rows:", (window._feedUsageRows || []).length);
  console.log("productPriceMap keys sample:",
    Object.keys(productPriceMap).slice(0, 10));

  (window._feedUsageRows || []).forEach(({ prodName, consumedKg, gender, recDate }) => {
    if (!recDate) return;

    // Step 1: exact match
    let priceEntry = productPriceMap[prodName];

    // Step 2: partial match — find key that contains prodName or vice versa
    if (!priceEntry) {
      const matchKey = Object.keys(productPriceMap).find(k =>
        k.includes(prodName) || prodName.includes(k)
      );
      if (matchKey) {
        priceEntry = productPriceMap[matchKey];
        if (!window._feedMatchLogged) {
          window._feedMatchLogged = true;
          console.log("[WAFAD] Feed partial match:", prodName, "→", matchKey, "| price:", priceEntry?.sellingPrice);
        }
      }
    }

    // Step 3: known fallbacks
    if (!priceEntry) {
      if (prodName.includes("COCK")) priceEntry = productPriceMap["COCK MASH"];
      else if (prodName.includes("LAYER")) priceEntry = productPriceMap["LAYER MASH"];
    }

    if (!priceEntry || !priceEntry.sellingPrice) {
      console.warn("[WAFAD] No price found for feed product:", prodName);
      return;
    }

    const sellingPrice = num(priceEntry.sellingPrice);
    const unit = (priceEntry.unit || "").toLowerCase();

    // Convert to price per kg based on unit
    let pricePerKg = 0;
    if (unit === "kg") {
      pricePerKg = sellingPrice;
    } else if (unit.includes("50") || unit === "bag" || unit === "50kg bag") {
      pricePerKg = sellingPrice / 50;
    } else if (unit.includes("25")) {
      pricePerKg = sellingPrice / 25;
    } else if (sellingPrice > 0) {
      // Default: assume 50kg bag
      pricePerKg = sellingPrice / 50;
    }

    if (pricePerKg <= 0 || consumedKg <= 0) return;

    const lineCost = pricePerKg * consumedKg;

    if (recDate >= yearStart) {
      feedCostFromSubformYear += lineCost;
      feedKgFromSubformYear += consumedKg;
    }
    if (recDate >= monthStart) {
      feedCostFromSubformMonth += lineCost;
      feedKgFromSubformMonth += consumedKg;
      if (gender === "male") feedCostMaleMonth += lineCost;
      else if (gender === "female") feedCostFemaleMonth += lineCost;
    }
    if (recDate >= weekStart) {
      feedCostFromSubformWeek += lineCost;
      feedKgFromSubformWeek += consumedKg;
    }
  });

  console.log("feedCostFromSubformMonth:", feedCostFromSubformMonth,
    "| feedKgFromSubformMonth:", feedKgFromSubformMonth);
  console.log("feedCostFromSubformWeek:", feedCostFromSubformWeek);
  console.log("feedCostFromSubformYear:", feedCostFromSubformYear);
  console.log("Male feed cost month:", feedCostMaleMonth,
    "| Female:", feedCostFemaleMonth);
  console.groupEnd();

  // costPerFeedKg: Priority 1=subform, 2=opex, 3=catalogue avg
  const costPerFeedKgFromSubform = feedKgFromSubformMonth > 0
    ? Math.round(feedCostFromSubformMonth / feedKgFromSubformMonth) : 0;

  const avgFeedPriceFromProducts = feedPricePerKgCount > 0
    ? Math.round(feedPricePerKgSum / feedPricePerKgCount) : 0;

  costPerFeedKg =
    costPerFeedKgFromSubform > 0 ? costPerFeedKgFromSubform
      : avgFeedPriceFromProducts > 0 ? avgFeedPriceFromProducts
        : 0;

  // Use subform feed costs as THE expense source (as client requested)
  // Fall back to feedIntakeTons × costPerFeedKg if subform is empty
  const feedExpenseWeek = feedCostFromSubformWeek > 0
    ? feedCostFromSubformWeek
    : feedIntakeTonsWeek * 1000 * (costPerFeedKg || 0);

  feedExpenseMonth = feedCostFromSubformMonth > 0
    ? feedCostFromSubformMonth
    : feedIntakeTonsMonth * 1000 * (costPerFeedKg || 0);

  const feedExpenseYear = feedCostFromSubformYear > 0
    ? feedCostFromSubformYear
    : feedProducedYearMT * 1000 * (costPerFeedKg || 0);

  console.log("[WAFAD] Final feed expenses →",
    "Week:", feedExpenseWeek,
    "| Month:", feedExpenseMonth,
    "| Year:", feedExpenseYear,
    "| costPerFeedKg:", costPerFeedKg
  );

  // Expense = feed cost (primary source as per client)
  totalExpenseWeek = feedExpenseWeek;
  totalExpenseMonth = feedExpenseMonth;
  totalExpenseYear = feedExpenseYear;

  /* ─── 12. EMPLOYEES ─────────────────────────────────────────────── */
  const employees = await zohoGetAll("All_Employees");
  console.group("✅ [12] EMPLOYEES");
  console.log("Total records:", employees.length);
  console.log("Statuses:", [
    ...new Set(employees.map((e) => fv(e, "Employee_Status") || "empty")),
  ]);
  console.log("Departments:", [
    ...new Set(employees.map((e) => displayVal(e.Department) || "Other")),
  ]);
  console.groupEnd();
  let totalStaff = 0,
    activeStaff = 0;
  const deptMap = {};
  employees.forEach((e) => {
    totalStaff++;
    const empStatus = (fv(e, "Employee_Status") || "").toLowerCase();
    if (empStatus === "active" || empStatus === "") activeStaff++;
    const dept = displayVal(e.Department || "") || "Other";
    deptMap[dept] = (deptMap[dept] || 0) + 1;
  });
  const deptProductivity = Object.entries(deptMap)
    .map(([dept, count]) => ({
      dept: dept.length > 12 ? dept.slice(0, 12) + "…" : dept,
      score: count,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  /* ─── 13. LEAVE ─────────────────────────────────────────────────── */
  const leaves = await zohoGetAll("Leave_Form_Report");
  console.group("✅ [13] LEAVE");
  console.log("Total records:", leaves.length);
  console.log("Statuses:", [
    ...new Set(leaves.map((l) => fv(l, "Status") || "null")),
  ]);
  console.groupEnd();
  let staffOnLeaveToday = 0,
    openLeaveRequests = 0;
  let leaveThisWeek = 0,
    leaveThisMonth = 0;
  const leaveByDept = {};
  leaves.forEach((l) => {
    const leaveStatus = (fv(l, "Status") || "").toLowerCase().trim();
    const rawFrom = fv(l, "From");
    const rawTo = fv(l, "To");
    const fromDate = rawFrom ? new Date(rawFrom) : null;
    const toDate = rawTo ? new Date(rawTo) : null;
    const dept = displayVal(l.Department || "") || "Unknown";
    if (leaveStatus === "approved") {
      if (fromDate && toDate && fromDate <= now && toDate >= now) {
        staffOnLeaveToday++;
        leaveByDept[dept] = (leaveByDept[dept] || 0) + 1;
      }
      if (fromDate && toDate && fromDate <= weekEnd && toDate >= weekStart)
        leaveThisWeek++;
      if (fromDate && toDate && fromDate <= monthEnd && toDate >= monthStart)
        leaveThisMonth++;
    } else if (leaveStatus === "requested" || leaveStatus === "pending")
      openLeaveRequests++;
  });
  const absenteeismPct =
    activeStaff > 0
      ? parseFloat(((staffOnLeaveToday / activeStaff) * 100).toFixed(1))
      : 0;

  /* ─── 14. CHICKEN4U ─────────────────────────────────────────────── */
  const c4uParents = await zohoGetAll("Field_Visit_Sales_Order_Report");
  const c4uSF = await zohoGetAll("Field_Visit_Sales_Order_Master_SF_Report");
  const muoProfiles = await zohoGetAll("All_Muo_Profiles");
  const learnerRecs = await zohoGetAll("All_Learner_Registrations");
  const certifiedLearners = learnerRecs.filter(
    (r) => (r.Status ?? "").toString().toLowerCase().trim() === "certified",
  ).length;

  console.group("✅ [14] CHICKEN4U");
  console.log("Parent orders (SO_Report):", c4uParents.length);
  console.log("SF line items:", c4uSF.length);
  console.log("MUO profiles:", muoProfiles.length);
  console.log("Learner registrations:", learnerRecs.length);
  console.log("Certified learners:", certifiedLearners);
  console.log("Sample SF row:", c4uSF[0]);
  console.groupEnd();
  let muoMale = 0,
    muoFemale = 0;
  muoProfiles.forEach((r) => {
    const g = (r.Gender ?? "").toString().toLowerCase().trim();
    if (g === "male") muoMale++;
    else if (g === "female") muoFemale++;
  });

  const orderMetaMap = new Map();
  let c4uConfirmedOrders = 0,
    c4uPendingOrdersCount = 0;
  let c4uConfirmedWeekCount = 0,
    c4uConfirmedMonthCount = 0;
  let c4uPendingWeekCount = 0,
    c4uPendingMonthCount = 0;

  let c4uRevenueWeek = 0,
    c4uRevenueMonth = 0,
    c4uRevenueYear = 0;

  for (const rec of c4uParents) {
    const orderId = String(rec.ID ?? "");
    // REPLACE revenue block inside c4uParents loop:
    const payStatusRaw = displayVal(rec.Payment_Status ?? "").toLowerCase().trim();
    const isPaid = payStatusRaw === "paid";
    const isPartial = payStatusRaw === "partial";
    const statusRaw = displayVal(rec.Order_Status ?? rec.Status ?? "").toLowerCase().trim();
    const isDelivered = statusRaw === "delivered";

    const totalAmt = num(fv(rec, "Total_Amount") || fv(rec, "Grand_Total") || 0);
    const paidAmt = isPaid ? totalAmt
      : isPartial ? num(fv(rec, "Amount_Paid") || fv(rec, "Paid_Amount") || totalAmt * 0.5)
        : 0;

    // Revenue: use Total_Amount directly for paid orders
    if (paidAmt > 0 && c4uOrderDate) {
      if (c4uOrderDate >= yearStart) c4uRevenueYear += paidAmt;
      if (c4uOrderDate >= monthStart) c4uRevenueMonth += paidAmt;
      if (c4uOrderDate >= weekStart) c4uRevenueWeek += paidAmt;
    }

    const c4uOrderDate = parseZohoDate(
      fv(rec, "Date_field") ||
      fv(rec, "Order_Date") ||
      fv(rec, "Date") ||
      fv(rec, "Added_Time"),
    );

    if (paidAmt > 0 && c4uOrderDate) {
      if (c4uOrderDate >= yearStart) c4uRevenueYear += paidAmt;
      if (c4uOrderDate >= monthStart) c4uRevenueMonth += paidAmt;
      if (c4uOrderDate >= weekStart) c4uRevenueWeek += paidAmt;
    }

    const muoName = displayVal(
      rec["MUO.MUO_Name"] ??
      rec["MUO.Name"] ??
      rec["MUO.Full_Name"] ??
      rec.MUO ??
      "",
    ).trim();
    const satoName = displayVal(
      rec["SATO.SATO_Name"] ??
      rec["SATO.Name"] ??
      rec["SATO.Full_Name"] ??
      rec.SATO ??
      "",
    ).trim();
    let expectedDate = null;
    const edd =
      rec.Expected_Delivery_Date ??
      rec.Expected_Date ??
      rec.Delivery_Date ??
      "";
    if (edd) {
      try {
        expectedDate = parseZohoDate(edd);
      } catch (e) { }
    }

    // orderMetaMap.set(orderId, { isDelivered, isPaid, muoName, satoName, expectedDate, statusRaw });

    orderMetaMap.set(orderId, {
      isDelivered,
      isPaid,
      muoName,
      satoName,
      expectedDate,
      statusRaw,
      orderDate: c4uOrderDate,
    });

    const c4uRegion =
      displayVal(
        rec.Region ?? rec["Customer.Region"] ?? rec.District ?? "",
      ).trim() || "Other";

    if (CONFIRMED_STATUSES.has(statusRaw)) {
      c4uConfirmedOrders++;
      c4uRegionMap[c4uRegion] = (c4uRegionMap[c4uRegion] || 0) + 1;
      if (c4uOrderDate) {
        if (c4uOrderDate >= weekStart) c4uConfirmedWeekCount++;
        if (c4uOrderDate >= monthStart) c4uConfirmedMonthCount++;
      }
    } else if (PENDING_STATUSES.has(statusRaw) || statusRaw === "") {
      c4uPendingOrdersCount++;
      if (c4uOrderDate) {
        if (c4uOrderDate >= weekStart) c4uPendingWeekCount++;
        if (c4uOrderDate >= monthStart) c4uPendingMonthCount++;
      }
    }
  }

  let c4uGrangers = 0,
    c4uLayers = 0,
    c4uBroilers = 0;
  const c4uGrangerBreeds = {},
    c4uLayerBreeds = {},
    c4uBroilerBreeds = {};
  let c4uGrangersDel = 0,
    c4uLayersDel = 0,
    c4uBroilersDel = 0;
  let c4uGrangersPend = 0,
    c4uLayersPend = 0,
    c4uBroilersPend = 0;
  const c4uGrangerBreedsDel = {},
    c4uLayerBreedsDel = {},
    c4uBroilerBreedsDel = {};
  const c4uGrangerBreedsPend = {},
    c4uLayerBreedsPend = {},
    c4uBroilerBreedsPend = {};
  let c4uOrdersDel = 0,
    c4uOrdersPend = 0;
  let c4uFeedKgOrdered = 0,
    c4uFeedKgDelivered = 0,
    c4uFeedKgPending = 0;
  const c4uMuoMap = {},
    c4uSatoMap = {},
    c4uAllProducts = {};
  let c4uPendingWeekQty = 0,
    c4uPendingMonthQty = 0;
  const seenOrders = new Set(),
    seenWeekOrders = new Set(),
    seenMonthOrders = new Set();
  const c4uPendingWeekList = [],
    c4uPendingMonthList = [];

  let c4uSellingPriceWeekSum = 0,
    c4uSellingPriceWeekQty = 0;
  let c4uSellingPriceLastWeekSum = 0,
    c4uSellingPriceLastWeekQty = 0;
  for (const row of c4uSF) {
    const qty = Number(row.Quantity ?? 0);
    if (qty === 0) continue;
    const orderId = row.SO_Reference?.ID;
    if (!orderId) continue;
    const meta = orderMetaMap.get(String(orderId));
    if (!meta) continue;
    const { isDelivered, isPaid, muoName, satoName, expectedDate, statusRaw } =
      meta;

    if (!seenOrders.has(orderId)) {
      seenOrders.add(orderId);
      if (isDelivered) c4uOrdersDel++;
      else c4uOrdersPend++;
    }

    // Product field = category selector (GRANGERS, LAYERS, BROILER, SAVANNA FEED, etc.)
    // Product_Type field = actual product detail lookup (specific product name)
    const productCategory = displayVal(row.Product ?? "").trim();
    // const productDetail = displayVal(
    //   row["Product_Type.Product_Name"] ||
    //   row["Product_Type.Name"] ||
    //   row.Product_Type ?? ""
    // ).trim();

    const productDetail = displayVal(
      row["Product_Type.Product_Name"] ||
      row["Product_Type.Name"] ||
      (row.Product_Type ?? ""),
    ).trim();
    const productKey = productDetail || productCategory || "Unknown";
    const nameUp = productCategory.toUpperCase();

    // Classify by the category field (Product)
    const isFeed = nameUp.includes("SAVANNA") || nameUp.includes("FEED");
    const category = isFeed
      ? "feed"
      : nameUp.includes("GRANGER") || nameUp.includes("COCK")
        ? "chick"
        : nameUp.includes("LAYER")
          ? "chick"
          : nameUp.includes("BROILER")
            ? "chick"
            : nameUp.includes("VACCINE") || nameUp.includes("MEDIC")
              ? "medication"
              : "other";

    // Feed revenue accumulation for cost/kg calculation
    if (category === "feed") {
      const feedUnitPrice = num(fv(row, "Unit_Price") || fv(row, "Rate") || 0);
      // Get order date from parent via orderMetaMap isn't enough —
      // use the SF row date or fall back to parent
      const feedOrderDate =
        parseZohoDate(fv(row, "Date_field") || fv(row, "Added_Time")) ||
        meta.expectedDate;
      if (feedOrderDate && feedOrderDate >= monthStart) {
        c4uFeedRevenueMonth += feedUnitPrice * qty;
        c4uFeedQtyMonth += qty;
      }
    }

    // Product map
    if (!c4uAllProducts[productKey]) {
      c4uAllProducts[productKey] = {
        ordered: 0,
        delivered: 0,
        pending: 0,
        category,
      };
    }
    c4uAllProducts[productKey].ordered += qty;
    if (isDelivered) c4uAllProducts[productKey].delivered += qty;
    else c4uAllProducts[productKey].pending += qty;

    // ── Selling price per chick from C4U Field Visit SF ──────
    const isChickRow =
      nameUp.includes("GRANGER") ||
      nameUp.includes("LAYER") ||
      nameUp.includes("BROILER") ||
      nameUp.includes("NOVO") ||
      nameUp.includes("EFFICIENCY") ||
      nameUp.includes("COCK");
    // If SF unit price is 0 or suspiciously low, look up from productPriceMap
    let linePrice = num(fv(row, "Unit_Price") || fv(row, "Rate") || 0);
    if ((linePrice === 0 || linePrice < 20) && productDetail) {
      const mapped = productPriceMap[productDetail.toUpperCase()];
      if (mapped?.sellingPrice > 0) linePrice = mapped.sellingPrice;
    }
    // REPLACE isChickRow block in c4uSF loop:
    if (isChickRow) {
      // Unit_Price is null — use Rate field
      let linePrice = num(row.Rate || fv(row, "Unit_Price") || 0);

      // Fallback 1: productPriceMap by productDetail name
      if (linePrice === 0 && productDetail) {
        const mapped = productPriceMap[productDetail.toUpperCase()];
        if (mapped?.sellingPrice > 0) linePrice = mapped.sellingPrice;
      }
      // Fallback 2: productPriceMap by productCategory
      if (linePrice === 0 && productCategory) {
        const mapped = productPriceMap[productCategory.toUpperCase()];
        if (mapped?.sellingPrice > 0) linePrice = mapped.sellingPrice;
      }

      const rowDate = parseZohoDate(fv(row, "Date_field") || fv(row, "Added_Time"))
        || meta.orderDate;

      if (!window._c4uPriceLogged) {
        window._c4uPriceLogged = true;
        console.log("[WAFAD] C4U SF price sample →",
          "productCategory:", productCategory,
          "| productDetail:", productDetail,
          "| Rate:", row.Rate,
          "| linePrice:", linePrice, "| qty:", qty);
      }

      if (linePrice > 0 && rowDate) {
        if (rowDate >= weekStart) {
          c4uSellingPriceWeekSum += linePrice * qty;
          c4uSellingPriceWeekQty += qty;
        }
        if (rowDate >= lastWeekStart && rowDate <= lastWeekEnd) {
          c4uSellingPriceLastWeekSum += linePrice * qty;
          c4uSellingPriceLastWeekQty += qty;
        }
        if (rowDate >= yearStart) {
          if (!window._c4uSellingYTDSum) { window._c4uSellingYTDSum = 0; window._c4uSellingYTDQty = 0; }
          window._c4uSellingYTDSum += linePrice * qty;
          window._c4uSellingYTDQty += qty;
        }
      }
    }

    // Feed tracking
    if (category === "feed") {
      c4uFeedKgOrdered += qty;
      if (isDelivered) c4uFeedKgDelivered += qty;
      else c4uFeedKgPending += qty;
    }

    // Chick type tracking — use productCategory for type, productDetail for breed label
    const breedLabel = productDetail || productCategory || "Unknown";
    if (nameUp.includes("GRANGER") || nameUp.includes("COCK")) {
      c4uGrangers += qty;
      addBreed(c4uGrangerBreeds, breedLabel, qty);
      if (isDelivered) {
        c4uGrangersDel += qty;
        addBreed(c4uGrangerBreedsDel, breedLabel, qty);
      } else {
        c4uGrangersPend += qty;
        addBreed(c4uGrangerBreedsPend, breedLabel, qty);
      }
    } else if (nameUp.includes("LAYER") || nameUp.includes("NOVO")) {
      c4uLayers += qty;
      addBreed(c4uLayerBreeds, breedLabel, qty);
      if (isDelivered) {
        c4uLayersDel += qty;
        addBreed(c4uLayerBreedsDel, breedLabel, qty);
      } else {
        c4uLayersPend += qty;
        addBreed(c4uLayerBreedsPend, breedLabel, qty);
      }
    } else if (nameUp.includes("BROILER")) {
      c4uBroilers += qty;
      addBreed(c4uBroilerBreeds, breedLabel, qty);
      if (isDelivered) {
        c4uBroilersDel += qty;
        addBreed(c4uBroilerBreedsDel, breedLabel, qty);
      } else {
        c4uBroilersPend += qty;
        addBreed(c4uBroilerBreedsPend, breedLabel, qty);
      }
    }

    if (muoName && category === "chick") {
      if (!c4uMuoMap[muoName])
        c4uMuoMap[muoName] = { ordered: 0, delivered: 0 };
      c4uMuoMap[muoName].ordered += qty;
      if (isDelivered) c4uMuoMap[muoName].delivered += qty;
    }
    if (satoName && category === "chick") {
      if (!c4uSatoMap[satoName])
        c4uSatoMap[satoName] = { paidQty: 0, totalQty: 0 };
      c4uSatoMap[satoName].totalQty += qty;
      if (isPaid) c4uSatoMap[satoName].paidQty += qty;
    }

    if (!isDelivered && expectedDate && !isNaN(expectedDate)) {
      if (expectedDate >= weekStart && expectedDate <= weekEnd) {
        c4uPendingWeekQty += qty;
        if (!seenWeekOrders.has(String(orderId))) {
          seenWeekOrders.add(String(orderId));
          c4uPendingWeekList.push({
            orderId: String(orderId),
            muoName,
            satoName,
            expectedDate: expectedDate.toISOString().split("T")[0],
            status: statusRaw,
          });
        }
      }
      if (expectedDate >= monthStart && expectedDate <= monthEnd) {
        c4uPendingMonthQty += qty;
        if (!seenMonthOrders.has(String(orderId))) {
          seenMonthOrders.add(String(orderId));
          c4uPendingMonthList.push({
            orderId: String(orderId),
            muoName,
            satoName,
            expectedDate: expectedDate.toISOString().split("T")[0],
            status: statusRaw,
          });
        }
      }
    }
  }
  c4uPendingWeekList.sort(
    (a, b) => new Date(a.expectedDate) - new Date(b.expectedDate),
  );
  c4uPendingMonthList.sort(
    (a, b) => new Date(a.expectedDate) - new Date(b.expectedDate),
  );
  const c4uTopMuos = Object.entries(c4uMuoMap)
    .map(([name, d]) => ({ name, value: d.delivered, ordered: d.ordered }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
  const c4uTopSatos = Object.entries(c4uSatoMap)
    .map(([name, d]) => ({ name, value: d.paidQty, totalQty: d.totalQty }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
  const sspTotal = Math.floor(c4uGrangers / 5);

  // Combined regional demand (poultry sales + C4U field visits)
  const combinedRegionMap = { ...regionMap };
  Object.entries(c4uRegionMap).forEach(([region, count]) => {
    combinedRegionMap[region] = (combinedRegionMap[region] || 0) + count;
  });

  const c4uRegionalDemand = Object.entries(c4uRegionMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([region, orders], i) => ({
      region,
      orders,
      color: REGION_COLORS[i],
    }));

  const combinedRegionalDemand = Object.entries(combinedRegionMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([region, orders], i) => ({
      region,
      orders,
      color: REGION_COLORS[i % REGION_COLORS.length],
    }));

  /* ─── 14b. TARGET CONFIG ─────────────────────────────────────────── */
  const targetConfig = await zohoGetAll("Target_Config_Report");
  console.group("✅ [14b] TARGET CONFIG");
  console.log("Total records:", targetConfig.length);
  console.log("Sample:", targetConfig[0]);
  console.groupEnd();

  const targets = {};
  targetConfig.forEach((t) => {
    const active = fv(t, "Active");
    const isActive =
      active === true ||
      active === "true" ||
      active === 1 ||
      active === "1" ||
      active === null ||
      active === undefined;
    if (!isActive) return;
    const key = (
      fv(t, "Metric_Name") ||
      fv(t, "Target_Name") ||
      fv(t, "Name") ||
      ""
    ).trim();
    const val = num(fv(t, "Target_Value") || fv(t, "Value") || 0);
    const period = (fv(t, "Period") || "week").toLowerCase().trim();
    if (key) targets[`${key}_${period}`] = val;
  });
  console.log("[WAFAD] Loaded targets:", targets);
  // Expected keys from your report:
  // eggs_production_week=50000, eggs_production_month=200000, eggs_production_year=2400000
  // mortality_week=50, mortality_month=200, mortality_year=2400
  // hatchability_week=85, hatchability_month=85
  // fertility_month=90
  // feed_cost_kg_week=285
  // cost_per_chick_week=1000
  // selling_price_chick_week=1200
  // feed_produced_month=150
  // eggs_set_week=8000, eggs_set_month=26000
  // confirmed_orders_week=20, confirmed_orders_month=80

  const getTarget = (metric, period) => targets[`${metric}_${period}`] ?? 0;

  /* ─── 15. ALERTS ─────────────────────────────────────────────────── */
  const alerts = [];
  if (mortalityPctCumulative > 3)
    alerts.push({
      type: "critical",
      icon: "mortality",
      title: `High Mortality — ${worstFarm}`,
      detail: `Cumulative mortality at ${mortalityPctCumulative}% — above 3% threshold`,
      time: "Live",
    });
  if (hatchabilityWeek < 85 && eggsSetWeek > 0)
    alerts.push({
      type: "critical",
      icon: "hatchery",
      title: "Hatchability Below Target",
      detail: `Hatchability at ${hatchabilityWeek}% (target ≥85%)`,
      time: "Live",
    });
  criticalStock.slice(0, 3).forEach((s) =>
    alerts.push({
      type: s.status === "Critical" ? "critical" : "warning",
      icon: "vaccine",
      title: `Low Stock — ${s.item}`,
      detail: `Current stock: ${s.stock} unit(s) — below minimum`,
      time: "Live",
    }),
  );
  if (absenteeismPct > 10)
    alerts.push({
      type: "warning",
      icon: "equipment",
      title: "High Absenteeism Detected",
      detail: `${absenteeismPct}% of staff currently on leave`,
      time: "Live",
    });
  if (openLeaveRequests > 5)
    alerts.push({
      type: "info",
      icon: "biosecurity",
      title: `${openLeaveRequests} Pending Leave Requests`,
      detail: "Requires HR approval",
      time: "Live",
    });
  if (approvedNotPaidCount > 10)
    alerts.push({
      type: "warning",
      icon: "feed",
      title: `${approvedNotPaidCount} Requests Awaiting Payment`,
      detail: "Approved operational requests — payment pending",
      time: "Live",
    });
  if (alerts.length === 0)
    alerts.push({
      type: "info",
      icon: "biosecurity",
      title: "All Systems Normal",
      detail: "No critical issues detected at this time",
      time: "Live",
    });

  console.log("=== [WAFAD] Data load v3 complete ===", {
    allBreeds,
    breedEggData,
    breedHatchData,
    breedStorageEggs,
    breedDOC,
  });

  // At the END of loadAllData, before return:
  console.group("📊 [SUMMARY] All Computed Values");
  console.log(
    "Birds placed:",
    totalBirdsPlaced,
    "| Birds alive:",
    birdsAliveTotal,
  );
  console.log(
    "Mortality total:",
    totalMortality,
    "| Mortality %:",
    mortalityPct,
  );
  console.log("Eggs this week:", eggsThisWeek, "| This month:", eggsThisMonth);
  console.log(
    "Hatching eggs week:",
    hatchingEggsWeek,
    "| Month:",
    hatchingEggsMonth,
  );
  console.log(
    "Storage eggs total:",
    totalStorageEggs,
    "| DOC total:",
    totalDOC,
  );
  console.log("Good chicks week:", goodChicksWeek, "| Month:", goodChicksMonth);
  console.log(
    "Hatchability week:",
    hatchabilityWeek + "%",
    "| Month:",
    hatchabilityMonth + "%",
  );
  console.log("Fertility rate:", fertilityRate + "%");
  console.log(
    "Feed intake week (MT):",
    feedIntakeTonsWeek,
    "| Month:",
    feedIntakeTonsMonth,
  );
  console.log("Feed produced month (MT):", feedProducedMT);
  console.log(
    "Revenue week:",
    revenueWeek,
    "| Month:",
    revenueMonth,
    "| Year:",
    revenueYear,
  );
  console.log("Cash received month:", cashReceivedMonth);
  console.log("Total expense month:", totalExpenseMonth);
  console.log(
    "Feed expense month:",
    feedExpenseMonth,
    "| Vet:",
    vetExpenseMonth,
    "| Labour:",
    labourExpenseMonth,
  );
  console.log(
    "Cost per feed kg:",
    costPerFeedKg,
    "| Cost per hatching egg:",
    costPerHatchingEgg,
  );
  console.log("Gross margin:", grossMargin + "%");
  console.log("breedEggData:", breedEggData);
  console.log("breedHatchData:", breedHatchData);
  console.log("breedProfitMargins:", breedProfitMargins);
  console.log("Breed storage eggs:", breedStorageEggs);
  console.log("DOC by breed:", breedDOC);
  console.groupEnd();

  // ─── REPLACE WITH ────────────────────────────────────
  return {
    /* ── breed metadata ── */
    allBreeds,
    allFarms, // ← NEW
    farmBirdsPlacedMap, // ← ADD THIS
    breedEggData,
    farmEggData, // ← NEW
    farmBreedEggData, // ← NEW
    breedProfitMargins,
    incomeExpTrend,
    breedMap,
    breedHatchData,
    breedStorageEggs,
    breedDOC,
    // ADD this as a new top-level key in the return {} block:
    targets,
    getTarget, // pass through for use in UI
    monthlyOpsData,
    monthlyHatchData,
    monthlyFinData,
    /* ── global kpi ── */
    kpi: {
      totalBirdsPlaced,
      totalPulletsHoused,
      totalCockerelsHoused,
      femaleAlive: femaleAliveCurrent,
      maleAlive: maleAliveCurrent,
      birdsAlive: birdsAliveTotal || birdsAlive,
      breedBreakdown: Object.entries(breedMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([breed, count]) => ({ breed, count })),
      mortalityThisWeek,
      mortalityThisMonth,
      mortalityThisYear,
      mortalityLastWeek,
      mortalityLastMonth,
      mortalityFemale,
      mortalityMale,

      eggsWeekTarget:
        getTarget("eggs_production", "week") ||
        Math.round((birdsAliveTotal || birdsAlive) * 0.8 * 7),
      eggsMonthTarget:
        getTarget("eggs_production", "month") ||
        Math.round((birdsAliveTotal || birdsAlive) * 0.8 * 30),
      eggsYearTarget: getTarget("eggs_production", "year") || 0,
      mortalityTarget:
        getTarget("mortality", "week") ||
        Math.round((birdsAliveTotal || birdsAlive) * 0.003),
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

      // mortalityTarget: Math.round((birdsAliveTotal || birdsAlive) * 0.003),
      mortalityPct,
      worstFarm,
      feedIntakeTonsWeek: parseFloat(feedIntakeTonsWeek.toFixed(1)),
      feedIntakeTons: parseFloat(feedIntakeTonsMonth.toFixed(1)),
      feedIntakeTonsMonth: parseFloat(feedIntakeTonsMonth.toFixed(1)),
      feedIntakeTonsYear: parseFloat(feedProducedYearMT.toFixed(1)),
      feedCostTotal:
        feedExpenseMonth > 0
          ? feedExpenseMonth
          : feedIntakeTonsMonth * 1000 * 285,
      costPerFeedKg,
      eggsThisWeek,
      eggsThisMonth,
      eggsThisYear,
      // eggsWeekTarget: Math.round((birdsAliveTotal || birdsAlive) * 0.8 * 7),
      // eggsMonthTarget: Math.round((birdsAliveTotal || birdsAlive) * 0.8 * 30),
      hatchingEggsWeek,
      hatchingEggsMonth,
      hatchingEggsAvailableWeek: Math.round(hatchingEggsWeek * 0.63),
      hatchingEggsAvailableMonth: Math.round(hatchingEggsMonth * 0.63),
      storageEggsAvailable: totalStorageEggs,
      farmRejectedEggs,
      crackedEggs,
      dirtyEggs,
      floorEggs,
      avgEggProductionRate,
      goodChicksWeek,
      goodChicksMonth,
      goodChicksYear,
      goodChicksLastWeek,
      goodChicksLastMonth,
      totalDOC,
      hatchabilityWeek,
      hatchabilityMonth,
      hatchabilityYear,
      hatchabilityPrev: parseFloat((hatchabilityMonth * 0.98).toFixed(1)),
      confirmedOrdersWeek,
      confirmedOrdersMonth,
      confirmedOrdersYear,
      confirmedChicksWeek,
      confirmedChicksMonth,
      confirmedChicksYear,
      pendingOrdersWeek,
      pendingOrdersMonth,
      pendingChicksWeek,
      pendingChicksMonth,
      revenueWeek,
      revenueMonth,
      revenueYear,
      cashReceivedWeek,
      cashReceivedMonth,
      cashReceivedYear,
      costPerHatchingEgg,
      costPerChickWeek,
      costPerChickLastWeek: costPerChickLastWk,
      sellingPriceHatchingEgg,
      sellingPriceWeek: (() => {
        const wSum = sellingPriceWeekSum + c4uSellingPriceWeekSum;
        const wQty = sellingPriceWeekQty + c4uSellingPriceWeekQty;
        if (wQty > 0) return Math.round(wSum / wQty);
        // YTD fallback
        const ytdSum = sellingPriceYTDSum + (window._c4uSellingYTDSum || 0);
        const ytdQty = sellingPriceYTDQty + (window._c4uSellingYTDQty || 0);
        if (ytdQty > 0) return Math.round(ytdSum / ytdQty);
        return avgSellingPriceChick || 0;
      })(),

      sellingPriceLastWeek: (() => {
        const lSum = sellingPriceLastWeekSum + c4uSellingPriceLastWeekSum;
        const lQty = sellingPriceLastWeekQty + c4uSellingPriceLastWeekQty;
        return lQty > 0 ? Math.round(lSum / lQty) : 0;
      })(),

      hatchForecastWeek: Math.round(
        (hatchabilityWeek * hatchingEggsWeek) / 100,
      ),
      hatchForecastMonth: Math.round(
        (hatchabilityMonth * hatchingEggsMonth) / 100,
      ),
      criticalIssues: alerts.filter((a) => a.type === "critical").length,
    },
    hatchery: {
      eggsSetWeek,
      eggsSetMonth,
      eggsSetYear,
      eggsSetLastWeek,
      eggsSetLastMonth,
      hatchDueWeek: goodChicksWeek,
      hatchDueMonth: goodChicksMonth,
      hatchabilityWeek,
      hatchabilityMonth,
      hatchabilityYear,
      hatchabilityPrev: parseFloat((hatchabilityMonth * 0.98).toFixed(1)),
      goodChicks: goodChicksWeek,
      poorChicks: Math.round(poorChicksMonth / 4),
      goodChicksMonth,
      goodChicksYear,
      fertilityRate,
      infertilityRate: parseFloat((100 - fertilityRate).toFixed(1)),
      weeklyTrend:
        hatchWeeklyTrend.length >= 2
          ? hatchWeeklyTrend
          : [{ w: "Batch 1", set: 0, fertile: 0, hatched: 0 }],
    },
    feedmill: {
      producedWeekMT: parseFloat(feedProducedWeekMT.toFixed(1)),
      producedMT: parseFloat(feedProducedMT.toFixed(1)),
      producedDay: parseFloat((feedProducedMT / 30).toFixed(1)),
      producedYearMT: parseFloat(feedProducedYearMT.toFixed(1)),
      issuedWeek: parseFloat(feedIssuedWeekMT.toFixed(1)),
      issuedMonth: parseFloat(feedIssuedMT.toFixed(1)),
      productionVsDemand:
        feedProducedMT > 0
          ? parseFloat(((feedIssuedMT / feedProducedMT) * 100).toFixed(1))
          : 0,
      rawMaterialEff: null,
      machineUptime: null,
      trend:
        feedTrend.length > 0 ? feedTrend : [{ d: "Mon", prod: 0, issued: 0 }],
    },
    sales: {
      // ── Poultry Sales Orders (existing) ──────────────────────
      confirmedWeek: confirmedOrdersWeek,
      confirmedMonth: confirmedOrdersMonth,
      confirmedYear: confirmedOrdersYear,
      confirmedChicksWeek,
      confirmedChicksMonth,
      confirmedChicksYear,
      pendingWeek: pendingOrdersWeek,
      pendingMonth: pendingOrdersMonth,
      pendingChicksWeek,
      pendingChicksMonth,
      ordersVsProduction:
        goodChicksMonth > 0 && confirmedOrdersMonth > 0
          ? parseFloat(
            Math.min(
              100,
              (confirmedOrdersMonth / goodChicksMonth) * 100,
            ).toFixed(1),
          )
          : 0,
      fulfilledPct:
        confirmedOrdersMonth + pendingOrdersMonth > 0
          ? parseFloat(
            (
              (confirmedOrdersMonth /
                (confirmedOrdersMonth + pendingOrdersMonth)) *
              100
            ).toFixed(1),
          )
          : 0,

      // ── Chicken4U Field Visit Orders (new) ───────────────────
      c4uConfirmedOrders,
      c4uPendingOrdersCount,
      c4uConfirmedWeek: c4uConfirmedWeekCount,
      c4uConfirmedMonth: c4uConfirmedMonthCount,
      c4uPendingWeek: c4uPendingWeekCount,
      c4uPendingMonth: c4uPendingMonthCount,
      c4uRegionalDemand: c4uRegionalDemand.length > 0 ? c4uRegionalDemand : [],

      // ── Combined totals ───────────────────────────────────────
      combinedConfirmedWeek: confirmedOrdersWeek + c4uConfirmedWeekCount,
      combinedConfirmedMonth: confirmedOrdersMonth + c4uConfirmedMonthCount,
      combinedPendingWeek: pendingOrdersWeek + c4uPendingWeekCount,
      combinedPendingMonth: pendingOrdersMonth + c4uPendingMonthCount,
      combinedRegionalDemand:
        combinedRegionalDemand.length > 0
          ? combinedRegionalDemand
          : [{ region: "No Data", orders: 0, color: C.blue }],

      // ── Existing ──────────────────────────────────────────────
      regionalDemand:
        regionalDemand.length > 0
          ? regionalDemand
          : [{ region: "No Data", orders: 0, color: C.blue }],
      top20: top20Customers,
      avgSellingChick: avgSellingPriceChick,
      avgSellingEgg: avgSellingPriceEgg,
    },

    finance: {
      cashReceivedWeek,
      cashReceivedMonth,
      cashReceivedYear,
      revenueWeek,
      revenueMonth,
      revenueYear,
      receivablesWeek: Math.round(receivablesWeek),
      receivablesMonth: Math.round(receivablesMonth),
      receivablesTotal: Math.round(receivablesTotal),
      totalExpenseWeek,
      totalExpenseMonth,
      totalExpenseYear,
      payablesWeek: Math.round(totalExpenseWeek * 0.3),
      payablesMonth: Math.round(totalExpenseMonth * 0.3),
      grossMargin,
      margins,
      budgetVsActual: budgetVsActual.length > 0 ? budgetVsActual : [],
      pendingPayments: pendingPaymentsCount,
      approvedNotPaid: approvedNotPaidCount,
      c4uRevenueWeek,
      c4uRevenueMonth,
      c4uRevenueYear,
      combinedRevenueWeek: revenueWeek + c4uRevenueWeek,
      combinedRevenueMonth: revenueMonth + c4uRevenueMonth,
      combinedRevenueYear: revenueYear + c4uRevenueYear,
    },
    inventory: {
      rawMaterialDays:
        feedIssuedMT > 0 ? Math.round(feedProducedMT / (feedIssuedMT / 30)) : 0,
      finishedFeedTons: parseFloat(feedProducedMT.toFixed(1)),
      vaccineStatus: criticalStock.some((s) => s.status === "Critical")
        ? "Critical"
        : criticalStock.some((s) => s.status === "Low")
          ? "Low"
          : "OK",
      eggTrays: 0,
      chickBoxes: 0,
      criticalAlerts: criticalStock.slice(0, 5),
      pendingPOs: pendingPaymentsCount,
      supplierDelays: 0,
      productStockList: productStockList.slice(0, 10),
    },
    alerts,
    workforce: {
      staffTurnoutToday: activeStaff - staffOnLeaveToday,
      totalStaff,
      activeStaff,
      staffOnLeave: staffOnLeaveToday,
      leaveThisWeek,
      leaveThisMonth,
      absenteeismPct,
      overtime: null,
      extendedHours: null,
      openHRIssues: openLeaveRequests,
      deptProductivity,
      leaveByDept: Object.entries(leaveByDept)
        .map(([dept, count]) => ({ dept, count }))
        .sort((a, b) => b.count - a.count),
    },
    eggsWeeklyTrend,
    chicken4u: {
      muo: {
        total: muoProfiles.length,
        male: muoMale,
        female: muoFemale,
        sspTotal,
      },
      learners: certifiedLearners,
      sales: {
        grangers: c4uGrangers,
        layers: c4uLayers,
        broilers: c4uBroilers,
        grangerBreeds: c4uGrangerBreeds,
        layerBreeds: c4uLayerBreeds,
        broilerBreeds: c4uBroilerBreeds,
        grangerBreedsDel: c4uGrangerBreedsDel,
        layerBreedsDel: c4uLayerBreedsDel,
        broilerBreedsDel: c4uBroilerBreedsDel,
        grangerBreedsPend: c4uGrangerBreedsPend,
        layerBreedsPend: c4uLayerBreedsPend,
        broilerBreedsPend: c4uBroilerBreedsPend,
        grangersDelivered: c4uGrangersDel,
        layersDelivered: c4uLayersDel,
        broilersDelivered: c4uBroilersDel,
        grangersPending: c4uGrangersPend,
        layersPending: c4uLayersPend,
        broilersPending: c4uBroilersPend,
        chicksOrdered: c4uGrangers + c4uLayers + c4uBroilers,
        chicksDelivered: c4uGrangersDel + c4uLayersDel + c4uBroilersDel,
        chicksPending: c4uGrangersPend + c4uLayersPend + c4uBroilersPend,
        feedKgOrdered: c4uFeedKgOrdered,
        feedKgDelivered: c4uFeedKgDelivered,
        feedKgPending: c4uFeedKgPending,
        ordersDelivered: c4uOrdersDel,
        ordersPending: c4uOrdersPend,
        allProducts: c4uAllProducts,
        topMuos: c4uTopMuos,
        topSatos: c4uTopSatos,
        pendingWeek: {
          qty: c4uPendingWeekQty,
          orders: seenWeekOrders.size,
          list: c4uPendingWeekList.slice(0, 20),
        },
        pendingMonth: {
          qty: c4uPendingMonthQty,
          orders: seenMonthOrders.size,
          list: c4uPendingMonthList.slice(0, 20),
        },
      },
    },
  };
}

/* ─── Export helpers ─────────────────────────────── */
async function doExcel(data) {
  await loadScript(
    "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js",
  );
  const XLSX = window.XLSX;
  if (!XLSX) {
    alert("SheetJS failed");
    return;
  }
  const wb = XLSX.utils.book_new();
  const k = data?.kpi || {};
  const add = (name, rows) => {
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws["!cols"] = rows[0]?.map((_, i) => ({
      wch: Math.max(18, ...rows.map((r) => String(r[i] ?? "").length + 4)),
    }));
    XLSX.utils.book_append_sheet(wb, ws, name);
  };
  add("Executive KPIs", [
    ["WAFAD GROUP – Executive Dashboard"],
    [`Generated: ${new Date().toLocaleString("en-US")}`],
    [],
    ["KPI", "Value", "Target", "Status"],
    ["Total Birds Placed", k.totalBirdsPlaced, "", ""],
    ["Birds Alive", k.birdsAlive, "", ""],
    [
      "Mortality (Week)",
      k.mortalityThisWeek,
      k.mortalityTarget,
      k.mortalityThisWeek <= k.mortalityTarget ? "OK" : "Over",
    ],
    ["Eggs (Week)", k.eggsThisWeek, k.eggsWeekTarget, ""],
    ["Hatchability %", k.hatchabilityWeek + "%", "85%", ""],
    ["Good Chicks (Week)", k.goodChicksWeek, "", ""],
    ["Storage Eggs Available", k.storageEggsAvailable, "", ""],
    ["Day Old Chicks (DOC)", k.totalDOC, "", ""],
    ["Chick Orders Confirmed (Wk)", k.confirmedChicksWeek, "", ""],
    [
      "Critical Issues",
      k.criticalIssues,
      "",
      k.criticalIssues > 0 ? "URGENT" : "Clear",
    ],
  ]);
  // Breed breakdown sheet
  const breedRows = [
    [
      "Breed",
      "Eggs (Week)",
      "Eggs (Month)",
      "Hatchable (Week)",
      "Hatchable (Month)",
      "Eggs Set (Week)",
      "Good Chicks (Week)",
      "Storage Eggs",
      "DOC Available",
    ],
  ];
  Object.entries(data.breedEggData || {}).forEach(([breed, e]) => {
    const h = data.breedHatchData?.[breed] || emptyBreedHatch();
    breedRows.push([
      breed,
      e.eggsWeek,
      e.eggsMonth,
      e.hatchableWeek,
      e.hatchableMonth,
      h.eggsSetWeek,
      h.goodChicksWeek,
      data.breedStorageEggs?.[breed] || 0,
      data.breedDOC?.[breed] || 0,
    ]);
  });
  add("Breed Breakdown", breedRows);
  const c4u = data?.chicken4u;
  const s = c4u?.sales;
  add("Chicken4U", [
    ["Chicken4U Field Sales"],
    [],
    ["Metric", "Value"],
    ["Total MUOs", c4u?.muo?.total ?? 0],
    ["Certified Learners", c4u?.learners ?? 0],
    ["Grangers Ordered", s?.grangers ?? 0],
    ["Grangers Delivered", s?.grangersDelivered ?? 0],
    ["Layers Ordered", s?.layers ?? 0],
    ["Layers Delivered", s?.layersDelivered ?? 0],
    ["Broilers Ordered", s?.broilers ?? 0],
    ["Broilers Delivered", s?.broilersDelivered ?? 0],
    ["Feed (kg) Ordered", s?.feedKgOrdered ?? 0],
    ["Pending Week Qty", s?.pendingWeek?.qty ?? 0],
    ["Pending Month Qty", s?.pendingMonth?.qty ?? 0],
  ]);
  add("Alerts", [
    ["Operations Alerts"],
    [],
    ["Type", "Title", "Detail", "Time"],
    ...(data?.alerts || []).map((a) => [
      a.type.toUpperCase(),
      a.title,
      a.detail,
      a.time,
    ]),
  ]);
  XLSX.writeFile(
    wb,
    `WAFAD_Executive_${new Date().toISOString().slice(0, 10)}.xlsx`,
  );
}

async function doPptx(data) {
  await loadScript(
    "https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js",
  );
  const PG = window.PptxGenJS;
  if (!PG) {
    alert("PptxGenJS failed");
    return;
  }
  const p = new PG();
  p.layout = "LAYOUT_16x9";
  p.title = "WAFAD Executive Dashboard";
  const BG = "060A12",
    SF = "0D1826",
    BL = "1E8CFF",
    GR = "10D97A",
    RD = "EF4444",
    AM = "F59E0B",
    TX = "E8EDF5",
    SO = "8FA3C0";
  const k = data?.kpi || {};
  {
    const sl = p.addSlide();
    sl.background = { color: BG };
    sl.addShape(p.shapes.RECTANGLE, {
      x: 0,
      y: 0,
      w: 0.15,
      h: 5.625,
      fill: { color: BL },
      line: { color: BL },
    });
    sl.addText("WAFAD GROUP", {
      x: 0.35,
      y: 0.8,
      w: 9,
      h: 0.7,
      fontSize: 14,
      bold: true,
      color: BL,
      fontFace: "Trebuchet MS",
      charSpacing: 4,
    });
    sl.addText("Executive Dashboard", {
      x: 0.35,
      y: 1.5,
      w: 9,
      h: 1.1,
      fontSize: 48,
      bold: true,
      color: TX,
      fontFace: "Trebuchet MS",
    });
    sl.addText(`Generated: ${new Date().toLocaleString("en-US")}`, {
      x: 0.35,
      y: 4.95,
      w: 7,
      h: 0.4,
      fontSize: 12,
      color: TX,
      fontFace: "Calibri",
    });
  }
  {
    const sl = p.addSlide();
    sl.background = { color: BG };
    sl.addShape(p.shapes.RECTANGLE, {
      x: 0,
      y: 0,
      w: 10,
      h: 0.65,
      fill: { color: BL },
      line: { color: BL },
    });
    sl.addText("Production KPIs", {
      x: 0.3,
      y: 0,
      w: 9,
      h: 0.65,
      fontSize: 18,
      bold: true,
      color: TX,
      fontFace: "Trebuchet MS",
      valign: "middle",
    });
    [
      [fmtN(k.totalBirdsPlaced), "Birds Placed", BL],
      [fmtN(k.birdsAlive), "Birds Alive", GR],
      [fmtN(k.eggsThisWeek), "Eggs (Week)", AM],
      [fmtN(k.goodChicksWeek), "Good Chicks", GR],
      [k.hatchabilityWeek + "%", "Hatchability", BL],
      [k.mortalityPct + "%", "Mortality %", RD],
    ].forEach(([v, l, c], i) => {
      const col = i % 3,
        row = Math.floor(i / 3),
        x = 0.2 + col * 3.25,
        y = 0.85 + row * 2.3;
      sl.addShape(p.shapes.RECTANGLE, {
        x,
        y,
        w: 3.05,
        h: 2.0,
        fill: { color: SF },
        line: { color: "1E4D8C" },
      });
      sl.addText(l.toUpperCase(), {
        x: x + 0.12,
        y: y + 0.15,
        w: 2.8,
        h: 0.3,
        fontSize: 8.5,
        color: SO,
        fontFace: "Calibri",
        bold: true,
      });
      sl.addText(v, {
        x: x + 0.1,
        y: y + 0.55,
        w: 2.85,
        h: 0.9,
        fontSize: 32,
        bold: true,
        color: c,
        fontFace: "Trebuchet MS",
      });
    });
  }
  await p.writeFile({
    fileName: `WAFAD_Executive_${new Date().toISOString().slice(0, 10)}.pptx`,
  });
}

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

  return {
    isFiltered,
    isFarmFiltered,
    isBreedFiltered,
    // eggs
    eggsThisWeek: eggs_val,
    eggsThisMonth: isFiltered ? (eD?.eggsMonth ?? 0) : k.eggsThisMonth,
    eggsThisYear: isFiltered ? (eD?.eggsYear ?? 0) : k.eggsThisYear,
    // hatching
    hatchingEggsWeek: hatch_val,
    hatchingEggsMonth: isFiltered
      ? (eD?.hatchableMonth ?? 0)
      : k.hatchingEggsMonth,
    // rejected
    farmRejectedEggs: isFiltered
      ? (eD?.farmRejectedTotal ?? 0)
      : k.farmRejectedEggs,
    // mortality
    mortalityThisWeek: mort_val,
    mortalityThisMonth: isFiltered
      ? (eD?.mortalityMonth ?? 0)
      : k.mortalityThisMonth,
    mortalityThisYear: isFiltered
      ? (eD?.mortalityYear ?? 0)
      : k.mortalityThisYear,
    mortalityFemale: mortFemale_val,
    mortalityMale: mortMale_val,
    // feed
    feedIntakeTons: parseFloat(feedTons_val.toFixed(1)),
    feedCostTotal: feedCost_val,
    // hatchery
    eggsSetWeek: eggsSet_val,
    eggsSetMonth: isFiltered ? (hD?.eggsSetMonth ?? 0) : h.eggsSetMonth,
    goodChicksWeek: chicks_val,
    goodChicksMonth: isFiltered
      ? (hD?.goodChicksMonth ?? 0)
      : k.goodChicksMonth,
    goodChicksYear: isFiltered ? (hD?.goodChicksYear ?? 0) : k.goodChicksYear,
    hatchabilityWeek: hatchabilityWeek_val,
    hatchabilityMonth: hatchabilityMonth_val,
    // storage
    storageEggs: isBreedFiltered
      ? data?.breedStorageEggs?.[selectedBreed] || 0
      : k.storageEggsAvailable,
    docAvailable: isBreedFiltered
      ? data?.breedDOC?.[selectedBreed] || 0
      : k.totalDOC,
    // birds
    // birds
    totalBirdsPlaced: isBreedFiltered
      ? data?.breedMap?.[selectedBreed] || 0
      : isFarmFiltered
        ? data?.farmBirdsPlacedMap?.[selectedFarm] || k.totalBirdsPlaced
        : k.totalBirdsPlaced,
    birdsAlive: isBreedFiltered
      ? Math.max(
        0,
        (data?.breedMap?.[selectedBreed] || 0) -
        (data?.breedEggData?.[selectedBreed]?.mortalityYear || 0),
      )
      : isFarmFiltered
        ? Math.max(
          0,
          (data?.farmBirdsPlacedMap?.[selectedFarm] || 0) -
          (data?.farmEggData?.[selectedFarm]?.mortalityYear || 0),
        )
        : k.birdsAlive,
    // global-only (no breed/farm split available)
    avgEggProductionRate: k.avgEggProductionRate,
    mortalityPct: (() => {
      if (!isFiltered) return k.mortalityPct;

      // Period-aware death count from filtered bucket
      const filteredDeaths = eD
        ? period === "year"
          ? eD.mortalityYear
          : period === "month"
            ? eD.mortalityMonth
            : eD.mortalityWeek
        : 0;

      // Correct birds-placed denominator for the filter
      let filteredBirdsPlaced = 0;
      if (isFarmFiltered && isBreedFiltered) {
        filteredBirdsPlaced = data?.breedMap?.[selectedBreed] || 0;
      } else if (isBreedFiltered) {
        filteredBirdsPlaced = data?.breedMap?.[selectedBreed] || 0;
      } else if (isFarmFiltered) {
        // Use farmBirdsPlacedMap if available, else fall back to summing breedMap
        filteredBirdsPlaced =
          data?.farmBirdsPlacedMap?.[selectedFarm] ||
          Object.keys(data?.farmBreedEggData?.[selectedFarm] || {}).reduce(
            (sum, b) => sum + (data?.breedMap?.[b] || 0),
            0,
          );
      }

      return filteredBirdsPlaced > 0
        ? parseFloat(((filteredDeaths / filteredBirdsPlaced) * 100).toFixed(2))
        : 0;
    })(),
    worstFarm: isFarmFiltered
      ? selectedFarm
      : isBreedFiltered
        ? selectedBreed
        : k.worstFarm,
    costPerFeedKg: k.costPerFeedKg,
    costPerHatchingEgg: k.costPerHatchingEgg,
    hatchForecastWeek: k.hatchForecastWeek,
    hatchForecastMonth: k.hatchForecastMonth,
    costPerChickWeek: k.costPerChickWeek,
    costPerChickLastWeek: k.costPerChickLastWeek,
    sellingPriceWeek: k.sellingPriceWeek,
    sellingPriceLastWeek: k.sellingPriceLastWeek,
    criticalIssues: k.criticalIssues,
    confirmedOrdersWeek: isFiltered
      ? k.confirmedChicksWeek
      : k.confirmedOrdersWeek,
    confirmedOrdersMonth: isFiltered
      ? k.confirmedChicksMonth
      : k.confirmedOrdersMonth,
    pendingOrdersWeek: isFiltered ? k.pendingChicksWeek : k.pendingOrdersWeek,
    pendingOrdersMonth: isFiltered
      ? k.pendingChicksMonth
      : k.pendingOrdersMonth,
    // eggsWeekTarget: k.eggsWeekTarget,
    // eggsMonthTarget: k.eggsMonthTarget,
    // mortalityTarget: k.mortalityTarget,
    // new usebreedkpi
    // ADD to useBreedKpi return block:
    eggsWeekTarget: k.eggsWeekTarget,
    eggsMonthTarget: k.eggsMonthTarget,
    eggsYearTarget: k.eggsYearTarget || 0,
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

function MonthlyTrendSection({ data, loading }) {
  const curYear = new Date().getFullYear();
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
    {
      key: "eggs",
      label: "Eggs Produced",
      color: MC.cyan,
      format: (v) => fmtN(v),
    },
    {
      key: "goodChicks",
      label: "Good Chicks",
      color: MC.green,
      format: (v) => fmtN(v),
    },
    {
      key: "hatchability",
      label: "Hatchability %",
      color: MC.blue,
      format: (v) => `${v}%`,
    },
    { key: "mort", label: "Mortality", color: MC.red, format: (v) => fmtN(v) },
    {
      key: "feedMT",
      label: "Feed (MT)",
      color: MC.amber,
      format: (v) => `${fmtN(v, 1)} MT`,
    },
    {
      key: "revenue",
      label: "Revenue (GHC)",
      color: MC.green,
      format: (v) => fmtCur(v),
    },
    {
      key: "expense",
      label: "Expenses (GHC)",
      color: MC.red,
      format: (v) => fmtCur(v),
    },
    {
      key: "profit",
      label: "Net Profit (GHC)",
      color: MC.purple,
      format: (v) => fmtCur(v),
    },
    {
      key: "eggsSet",
      label: "Eggs Set",
      color: MC.amber,
      format: (v) => fmtN(v),
    },
  ];

  const activeMeta =
    METRIC_OPTIONS.find((m) => m.key === metric) || METRIC_OPTIONS[0];
  const curValues = curRows.map((r) => r[metric] || 0);
  const prevValues = prevRows.map((r) => r[metric] || 0);
  const curTotal = sumField(curRows, metric);
  const prevTotal = sumField(prevRows, metric);
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
}) {
  const [period, setPeriod] = useState("week");
  const bk = useBreedKpi(data, selectedBreed, selectedFarm, period);

  const periodLabel =
    period === "year" ? "Year" : period === "month" ? "Month" : "Week";

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
      sub: `F: ${fmtN(bk.mortalityFemale)} · M: ${fmtN(bk.mortalityMale)}`,
      subNode:
        bk.mortalityTarget > 0 ? (
          <VsBadge
            current={bk.mortalityThisWeek}
            target={bk.mortalityTarget}
            invertColor
          />
        ) : null,
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
        <VsBadge
          current={bk.eggsThisWeek}
          target={
            period === "year"
              ? bk.eggsYearTarget
              : period === "month"
                ? bk.eggsMonthTarget
                : bk.eggsWeekTarget
          }
        />
      ),
    },
    {
      Ic: PackageOpen,
      label: `Hatching Eggs (${periodLabel})`,
      color: C.purple,
      value: fmtN(bk.hatchingEggsWeek),
      sub: `Storage: ${fmtN(bk.storageEggs)}`,
    },
    {
      Ic: Trash2,
      label: "Farm Rejected Eggs",
      color: C.orange,
      value: fmtN(bk.farmRejectedEggs),
      sub: `Avg Rate: ${bk.avgEggProductionRate}%`,
    },
    {
      Ic: CheckCircle2,
      label: `Good Chicks (${periodLabel})`,
      color: C.green,
      value: fmtN(bk.goodChicksWeek),
      subNode:
        bk.goodChicksWeekTarget > 0 ? (
          <VsBadge
            current={bk.goodChicksWeek}
            target={
              period === "month"
                ? bk.goodChicksMonthTarget
                : bk.goodChicksWeekTarget
            }
          />
        ) : (
          <span style={{ fontSize: 10, color: C.textMd }}>
            DOC: {fmtN(bk.docAvailable)}
          </span>
        ),
    },
    {
      Ic: ShoppingCart,
      label: "Confirmed Orders (Wk)",
      color: C.blue,
      value: fmtN(
        (bk.confirmedOrdersWeek || 0) + (data?.sales?.c4uConfirmedWeek || 0),
      ),
      subNode: (
        <span style={{ fontSize: 10, color: C.textMd }}>
          Poultry: {fmtK(bk.confirmedOrdersWeek || 0)} · C4U:{" "}
          {fmtK(data?.sales?.c4uConfirmedWeek || 0)}
        </span>
      ),
    },
    {
      Ic: Clock,
      label: "Pending Orders (Wk)",
      color: C.amber,
      value: fmtN(
        (bk.pendingOrdersWeek || 0) + (data?.sales?.c4uPendingWeek || 0),
      ),
      subNode: (
        <span style={{ fontSize: 10, color: C.textMd }}>
          Poultry: {fmtK(bk.pendingOrdersWeek || 0)} · C4U:{" "}
          {fmtK(data?.sales?.c4uPendingWeek || 0)}
        </span>
      ),
    },
    {
      Ic: Gauge,
      label: `Hatchability % (${periodLabel})`,
      color: C.green,
      value: `${bk.hatchabilityWeek || 0}%`,
      subNode: (
        <span
          style={{
            fontSize: 10,
            color:
              bk.hatchabilityWeek >= (bk.hatchabilityTarget || 85)
                ? C.green
                : C.red,
          }}
        >
          Target: {bk.hatchabilityTarget || 85}% · Prev: {bk.hatchabilityMonth}%
        </span>
      ),
    },
    {
      Ic: Skull,
      label: "Mortality % / Farm",
      color: C.red,
      value: `${bk.mortalityPct || 0}%`,
      sub: bk.isFarmFiltered
        ? selectedFarm
        : bk.isBreedFiltered
          ? selectedBreed
          : bk.worstFarm,
    },
    {
      Ic: Banknote,
      label: `Cost / Feed kg (${periodLabel})`,
      color: C.amber,
      value: bk.costPerFeedKg > 0 ? `GHC${bk.costPerFeedKg}` : "—",
      subNode:
        bk.feedCostKgTarget > 0 ? (
          <span style={{ fontSize: 10, color: C.textMd }}>
            Target: GHC{bk.feedCostKgTarget}
          </span>
        ) : (
          <span style={{ fontSize: 10, color: C.textMd }}>
            Egg: GHC{bk.costPerHatchingEgg || 0}
          </span>
        ),
    },
    {
      Ic: Layers,
      label: `Hatch Forecast (${periodLabel})`,
      color: C.purple,
      value: bk.hatchForecastWeek > 0 ? fmtN(bk.hatchForecastWeek) : "—",
      sub:
        bk.hatchForecastMonth > 0
          ? `Month: ${fmtK(bk.hatchForecastMonth)}`
          : "",
    },
    {
      Ic: DollarSign,
      label: `Cost/Chick (${periodLabel})`,
      color: C.orange,
      value: bk.costPerChickWeek > 0 ? `GHC${fmtN(bk.costPerChickWeek)}` : "—",
      subNode: (
        <span style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <Delta value={bk.costPerChickWeek} prev={bk.costPerChickLastWeek} />
          {bk.costPerChickTarget > 0 && (
            <span style={{ fontSize: 9, color: C.textSf }}>
              T:{bk.costPerChickTarget}
            </span>
          )}
        </span>
      ),
    },
    {
      Ic: Tag,
      label: `Selling Price/Chick (${periodLabel})`,
      color: C.green,
      value: bk.sellingPriceWeek > 0 ? `GHC${fmtN(bk.sellingPriceWeek)}` : "—",
      subNode: (
        <span style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <Delta value={bk.sellingPriceWeek} prev={bk.sellingPriceLastWeek} />
          {bk.sellingPriceTarget > 0 && (
            <span style={{ fontSize: 9, color: C.textSf }}>
              T:{bk.sellingPriceTarget}
            </span>
          )}
        </span>
      ),
    },
    {
      Ic: Egg,
      label: "Cost/Hatching Egg",
      color: C.orange,
      value:
        bk.costPerHatchingEgg > 0 ? `GHC${fmtN(bk.costPerHatchingEgg)}` : "—",
      sub: `Eggs Set Mo: ${fmtN(bk.eggsSetMonth)}`,
    },
    {
      Ic: Tag,
      label: "Selling Px/Hatching Egg",
      color: C.cyan,
      value:
        data?.kpi?.sellingPriceHatchingEgg > 0
          ? `GHC${fmtN(data.kpi.sellingPriceHatchingEgg)}`
          : "—",
      sub: "From paid invoices",
    },
    {
      Ic: AlertTriangle,
      label: "Critical Issues",
      color: bk.criticalIssues > 0 ? C.red : C.green,
      value: bk.criticalIssues || 0,
      sub: bk.criticalIssues > 0 ? "Immediate attention" : "All clear",
      pulse: bk.criticalIssues > 0,
    },
  ];

  const anyFilter =
    selectedBreed !== "All Breeds" || selectedFarm !== "All Farms";

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
    </Panel>
  );
}

/* ══════════════════════════════════════════════════
   SECTION: HATCHERY
══════════════════════════════════════════════════ */
function HatcherySection({ data, loading, selectedBreed }) {
  const isFiltered = selectedBreed !== "All Breeds";
  const hD = isFiltered
    ? data?.breedHatchData?.[selectedBreed] || emptyBreedHatch()
    : null;
  const h = data?.hatchery || {};

  const eggsSetWeek = isFiltered ? hD.eggsSetWeek : h.eggsSetWeek;
  const eggsSetMonth = isFiltered ? hD.eggsSetMonth : h.eggsSetMonth;
  const goodChicksWk = isFiltered ? hD.goodChicksWeek : h.goodChicks;
  const goodChicksMo = isFiltered ? hD.goodChicksMonth : h.goodChicksMonth;
  const hatchabilityWk =
    eggsSetWeek > 0
      ? parseFloat(((goodChicksWk / eggsSetWeek) * 100).toFixed(1))
      : h.hatchabilityWeek;
  const hatchabilityMo =
    eggsSetMonth > 0
      ? parseFloat(((goodChicksMo / eggsSetMonth) * 100).toFixed(1))
      : h.hatchabilityMonth;
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
        <Mini
          label="Eggs Set (Week)"
          value={fmtN(eggsSetWeek)}
          color={C.amber}
          loading={loading}
          subNode={
            data?.kpi?.eggsSetWeekTarget > 0 ? (
              <VsBadge
                current={eggsSetWeek}
                target={data.kpi.eggsSetWeekTarget}
              />
            ) : null
          }
        />
        <Mini
          label="Eggs Set (Month)"
          value={fmtN(eggsSetMonth)}
          color={C.amber}
          loading={loading}
          subNode={
            data?.kpi?.eggsSetMonthTarget > 0 ? (
              <VsBadge
                current={eggsSetMonth}
                target={data.kpi.eggsSetMonthTarget}
              />
            ) : null
          }
        />
        <Mini
          label="Hatch Due (Week)"
          value={fmtN(goodChicksWk)}
          color={C.blue}
          loading={loading}
          subNode={
            data?.kpi?.goodChicksWeekTarget > 0 ? (
              <VsBadge
                current={goodChicksWk}
                target={data.kpi.goodChicksWeekTarget}
              />
            ) : (
              <Delta value={goodChicksWk} prev={goodChicksMo / 4} />
            )
          }
        />
        <Mini
          label="Hatch Due (Month)"
          value={fmtN(goodChicksMo)}
          color={C.blue}
          loading={loading}
          subNode={
            data?.kpi?.goodChicksMonthTarget > 0 ? (
              <VsBadge
                current={goodChicksMo}
                target={data.kpi.goodChicksMonthTarget}
              />
            ) : null
          }
        />
        <Mini
          label="Hatchability% (Wk)"
          value={`${hatchabilityWk || 0}%`}
          color={C.green}
          loading={loading}
          subNode={
            <span
              style={{
                fontSize: 10,
                color:
                  hatchabilityWk >= (data?.kpi?.hatchabilityTarget || 85)
                    ? C.green
                    : C.red,
              }}
            >
              Target: {data?.kpi?.hatchabilityTarget || 85}% · Mo:{" "}
              {hatchabilityMo}%
            </span>
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
        <Mini
          label="Produced (MT/Month)"
          value={`${fmtN(f.producedMT, 1)} MT`}
          color={C.amber}
          loading={loading}
        />
        <Mini
          label="Produced (MT/Day)"
          value={`${fmtN(f.producedDay, 1)} MT`}
          color={C.amber}
          loading={loading}
        />
        <Mini
          label="Issued (Week)"
          value={`${fmtN(f.issuedWeek, 1)} MT`}
          color={C.blue}
          loading={loading}
        />
        <Mini
          label="Issued (Month)"
          value={`${fmtN(f.issuedMonth, 1)} MT`}
          color={C.blue}
          loading={loading}
        />
        <Mini
          label="Prod vs Demand"
          value={`${f.productionVsDemand || 0}%`}
          color={f.productionVsDemand >= 95 ? C.green : C.amber}
          loading={loading}
        />
        <Mini
          label="Raw Material Eff."
          value={f.rawMaterialEff ? `${f.rawMaterialEff}%` : "—"}
          color={C.cyan}
          loading={loading}
        />
        <Mini
          label="Machine Uptime"
          value={f.machineUptime ? `${f.machineUptime}%` : "—"}
          color={f.machineUptime >= 90 ? C.green : C.red}
          loading={loading}
        />
      </div>
      {!loading && (f.trend || []).length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "24px",
            color: C.textSf,
            fontSize: 12,
          }}
        >
          <Wheat size={28} color={C.textSf} style={{ marginBottom: 8 }} />
          <p>No feed data found for current month</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart
            data={f.trend || []}
            margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
          >
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
            <XAxis
              dataKey="d"
              tick={{ fontSize: 10, fill: C.textSf, fontFamily: "'Sora'" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: C.textSf }}
              axisLine={false}
              tickLine={false}
              width={28}
            />
            <Tooltip content={<Tip />} cursor={{ stroke: C.borderMd }} />
            <Area
              type="monotone"
              dataKey="prod"
              name="Produced"
              stroke={C.amber}
              fill="url(#gP)"
              strokeWidth={2}
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="issued"
              name="Issued"
              stroke={C.blue}
              fill="url(#gI)"
              strokeWidth={2}
              dot={false}
            />
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

      {/* ── Row 1: Poultry Sales Orders ── */}
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
              background: C.green,
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
            Poultry Sales Orders
          </p>
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
            label="Confirmed (Wk)"
            value={fmtN(s.confirmedWeek)}
            color={C.green}
            loading={loading}
          />
          <Mini
            label="Confirmed (Mo)"
            value={fmtN(s.confirmedMonth)}
            color={C.green}
            loading={loading}
          />
          <Mini
            label="Chicks (Wk)"
            value={fmtN(s.confirmedChicksWeek)}
            color={C.blue}
            loading={loading}
          />
          <Mini
            label="Chicks (Mo)"
            value={fmtN(s.confirmedChicksMonth)}
            color={C.blue}
            loading={loading}
          />
          <Mini
            label="Pending (Wk)"
            value={fmtN(s.pendingWeek)}
            color={C.amber}
            loading={loading}
          />
          <Mini
            label="Pending (Mo)"
            value={fmtN(s.pendingMonth)}
            color={C.amber}
            loading={loading}
          />
          <Mini
            label="Orders vs Prod%"
            value={`${s.ordersVsProduction || 0}%`}
            color={s.ordersVsProduction >= 90 ? C.green : C.red}
            loading={loading}
          />
          <Mini
            label="Fulfilled%"
            value={`${s.fulfilledPct || 0}%`}
            color={s.fulfilledPct >= 90 ? C.green : C.amber}
            loading={loading}
          />
        </div>
      </div>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: C.border, margin: "4px 0 16px" }} />

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

      {/* ── Row 3: Combined totals banner ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))",
          gap: 10,
          padding: "14px 16px",
          borderRadius: 12,
          background: `linear-gradient(135deg, ${C.blue}0A, ${C.green}0A)`,
          border: `1px solid ${C.blue}22`,
          marginBottom: 20,
        }}
      >
        {[
          {
            label: "Combined Confirmed (Wk)",
            value: fmtN(s.combinedConfirmedWeek),
            color: C.blue,
          },
          {
            label: "Combined Confirmed (Mo)",
            value: fmtN(s.combinedConfirmedMonth),
            color: C.blue,
          },
          {
            label: "Combined Pending (Wk)",
            value: fmtN(s.combinedPendingWeek),
            color: C.amber,
          },
          {
            label: "Combined Pending (Mo)",
            value: fmtN(s.combinedPendingMonth),
            color: C.amber,
          },
          {
            label: "Avg Price / Chick",
            value: `GHC${s.avgSellingChick || 0}`,
            color: C.green,
          },
          {
            label: "Avg Price / Egg",
            value: `GHC${s.avgSellingEgg || 0}`,
            color: C.cyan,
          },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            style={{ display: "flex", alignItems: "center", gap: 10 }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: color,
                flexShrink: 0,
              }}
            />
            <div>
              <p
                style={{
                  fontSize: 9,
                  color: C.textSf,
                  textTransform: "uppercase",
                  letterSpacing: ".06em",
                }}
              >
                {label}
              </p>
              {loading ? (
                <Sk h={16} w={60} />
              ) : (
                <p
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color,
                    fontFamily: C.mono,
                  }}
                >
                  {value}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

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
                { key: "combined", label: "Both" },
                { key: "poultry", label: "Poultry" },
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
function FinanceSection({ data, loading }) {
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
        <Mini
          label="Cash Received (Wk)"
          value={fmtCur(f.cashReceivedWeek)}
          color={C.green}
          loading={loading}
        />
        <Mini
          label="Cash Received (Mo)"
          value={fmtCur(f.cashReceivedMonth)}
          color={C.green}
          loading={loading}
        />
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
        <Mini
          label="Revenue (Week)"
          value={fmtCur((f.revenueWeek || 0) + (f.c4uRevenueWeek || 0))}
          color={C.green}
          loading={loading}
          sub={`Poultry: ${fmtCur(f.revenueWeek || 0)} · C4U: ${fmtCur(f.c4uRevenueWeek || 0)}`}
        />
        <Mini
          label="Revenue (Month)"
          value={fmtCur((f.revenueMonth || 0) + (f.c4uRevenueMonth || 0))}
          color={C.green}
          loading={loading}
          sub={`Poultry: ${fmtCur(f.revenueMonth || 0)} · C4U: ${fmtCur(f.c4uRevenueMonth || 0)}`}
        />
      </div>
      <div
        className="two-col"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}
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
      {(data?.breedProfitMargins || []).length > 0 && (
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
                  {b.marginPct}%
                </p>
                <div style={{ fontSize: 9, color: C.textSf, marginTop: 4 }}>
                  <span>Rev: {fmtCur(b.revenue)}</span> ·{" "}
                  <span>Cost: {fmtCur(b.feedCost)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Panel>
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
            onClick={() => setShowTopSatos((v) => !v)}
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
              <UserCog size={13} color={C.green} />
              Top SATOs (by paid qty)
            </span>
            {showTopSatos ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          {showTopSatos && (
            <div style={{ maxHeight: 220, overflowY: "auto" }}>
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <Sk key={i} h={28} style={{ marginBottom: 4 }} />
                ))
              ) : (s.topSatos || []).length === 0 ? (
                <p
                  style={{
                    fontSize: 11,
                    color: C.textSf,
                    textAlign: "center",
                    padding: "16px",
                  }}
                >
                  No SATO data yet
                </p>
              ) : (
                (s.topSatos || []).slice(0, 10).map((st, i) => {
                  const pct =
                    s.topSatos[0]?.value > 0
                      ? (st.value / s.topSatos[0].value) * 100
                      : 0;
                  return (
                    <div
                      key={st.name}
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
                          #{i + 1} {st.name}
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: C.green,
                            fontFamily: C.mono,
                          }}
                        >
                          {fmtN(st.value)}
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
                            background: C.green,
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
  { id: "sales", Ic: TrendingUp, label: "Poultry Sales" },
  { id: "finance", Ic: Banknote, label: "Finance" },
  { id: "inventory", Ic: Boxes, label: "Inventory" },
  { id: "alerts", Ic: ShieldAlert, label: "Risk & Alerts" },
  { id: "chicken4u", Ic: Store, label: "Chicken4U" },
  { id: "workforce", Ic: Users, label: "Workforce" },
  { id: "monthly", Ic: CalendarDays, label: "Monthly Trend" },
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
  // Global breed filter — lifted to App so all sections can share it
  // ─── REPLACE WITH ────────────────────────────────────
  const [selectedBreed, setSelectedBreed] = useState("All Breeds");
  const [selectedFarm, setSelectedFarm] = useState("All Farms");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await loadAllData();
      setData(result);
      setLastSync(new Date());
      // Reset breed filter if it no longer exists
      // ─── REPLACE WITH ────────────────────────────────────
      setSelectedBreed((prev) =>
        (result.allBreeds || []).includes(prev) ? prev : "All Breeds",
      );
      setSelectedFarm((prev) =>
        (result.allFarms || []).includes(prev) ? prev : "All Farms",
      );
    } catch (e) {
      console.error("[WAFAD] Top-level load error:", e);
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
      if (type === "excel") await doExcel(data);
      else await doPptx(data);
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
          <img
            src={LOGO_IMG}
            alt="logo"
            style={{
              width: 20,
              height: 20,
              borderRadius: 5,
              objectFit: "cover",
            }}
          />
          <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>
            WAFAD
          </span>
        </div>
        <button
          onClick={() => setMobOpen(false)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: C.textMd,
            display: "flex",
          }}
        >
          <X size={20} />
        </button>
      </div>
      {/* Breed selector in mobile nav */}
      {data?.allBreeds && data.allBreeds.length > 1 && (
        <div style={{ padding: "8px 4px", marginBottom: 8 }}>
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
            Filter by Breed
          </p>
          <BreedDropdown
            breeds={data.allBreeds}
            selected={selectedBreed}
            onChange={setSelectedBreed}
          />
        </div>
      )}
      {NAV.map((n) => (
        <div
          key={n.id}
          onClick={() => scrollTo(n.id)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "9px 10px",
            borderRadius: 10,
            marginBottom: 4,
            cursor: "pointer",
            background:
              active === n.id ? "rgba(30,140,255,0.14)" : "transparent",
            borderLeft: `3px solid ${active === n.id ? C.blue : "transparent"}`,
            transition: "all 0.14s",
          }}
        >
          <n.Ic
            size={15}
            color={active === n.id ? C.blue : C.textMd}
            strokeWidth={2}
          />
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: active === n.id ? C.blue : C.textMd,
            }}
          >
            {n.label}
          </span>
          {n.id === "alerts" && critCount > 0 && (
            <span
              style={{
                marginLeft: "auto",
                fontSize: 9.5,
                fontWeight: 700,
                background: C.redLt,
                color: C.red,
                padding: "1px 7px",
                borderRadius: 10,
              }}
            >
              {critCount}
            </span>
          )}
          {n.id === "chicken4u" && (
            <span
              style={{
                marginLeft: n.id === "alerts" ? 4 : "auto",
                fontSize: 9,
                background: C.amberLt,
                color: C.amber,
                padding: "1px 6px",
                borderRadius: 8,
                fontWeight: 600,
              }}
            >
              Field
            </span>
          )}
        </div>
      ))}
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "4px 10px",
                borderRadius: 20,
                border: `1px solid ${loading ? C.amber + "55" : error ? C.red + "55" : C.green + "55"}`,
                background: loading ? C.amberLt : error ? C.redLt : C.greenLt,
              }}
            >
              {loading ? (
                <RefreshCw size={10} color={C.amber} className="spin-ic" />
              ) : error ? (
                <AlertCircle size={10} color={C.red} />
              ) : (
                <Circle
                  size={5}
                  color={C.green}
                  fill={C.green}
                  className="dot-pulse"
                />
              )}
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: loading ? C.amber : error ? C.red : C.green,
                }}
              >
                {loading ? "Loading…" : error ? "Error" : "Live"}
              </span>
            </div>
            <div
              className="hdr-date"
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
              <CalendarDays size={11} color={C.textSf} />
              <span style={{ fontSize: 9.5, color: C.textSf }}>{dateStr}</span>
            </div>
            <button
              className="hdr-refresh xbtn"
              onClick={loadData}
              disabled={loading}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "5px 10px",
                borderRadius: 7,
                border: `1px solid ${C.borderMd}`,
                background: "transparent",
                color: C.textMd,
                fontSize: 10,
                cursor: "pointer",
                fontFamily: "'Sora',sans-serif",
                opacity: loading ? 0.5 : 1,
              }}
            >
              <RefreshCw size={11} />
              <span className="hdr-export-lbl">Refresh</span>
            </button>
            <button
              className="xbtn"
              onClick={() => handleExport("excel")}
              disabled={!!exporting || loading || !data}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "5px 10px",
                borderRadius: 7,
                border: "none",
                background: C.greenLt,
                color: C.green,
                fontSize: 10,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'Sora',sans-serif",
                opacity: !data ? 0.4 : 1,
              }}
            >
              {exporting === "excel" ? (
                <RefreshCw size={12} className="spin-ic" />
              ) : (
                <FileSpreadsheet size={12} />
              )}
              <span className="hdr-export-lbl">Excel</span>
            </button>
            <button
              className="xbtn"
              onClick={() => handleExport("pptx")}
              disabled={!!exporting || loading || !data}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "5px 10px",
                borderRadius: 7,
                border: "none",
                background: C.orangeLt,
                color: C.orange,
                fontSize: 10,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'Sora',sans-serif",
                opacity: !data ? 0.4 : 1,
              }}
            >
              {exporting === "pptx" ? (
                <RefreshCw size={12} className="spin-ic" />
              ) : (
                <Presentation size={12} />
              )}
              <span className="hdr-export-lbl">PPT</span>
            </button>
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
          />
        </div>
        <div id="sec-hatchery">
          {" "}
          <HatcherySection
            data={data}
            loading={loading}
            selectedBreed={selectedBreed}
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
          <FinanceSection data={data} loading={loading} />
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
          <MonthlyTrendSection data={data} loading={loading} />
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
  );
}

