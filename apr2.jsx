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
  Building2, Menu, X, Circle, Syringe, Wrench,
} from "lucide-react";

/* ─── CDN Script Loader ─────────────────────────────── */
function loadScript(src) {
  return new Promise((res) => {
    if (document.querySelector(`script[src="${src}"]`)) return res();
    const s = document.createElement("script");
    s.src = src; s.onload = res; document.head.appendChild(s);
  });
}

/* ─── Global styles ─────────────────────────────────── */
(function injectStyles() {
  const id = "wafad-exec-styles-v3";
  if (document.getElementById(id)) return;
  const s = document.createElement("style");
  s.id = id;
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Sora', sans-serif !important; background: #060A12 !important; color: #E8EDF5 !important; }
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-thumb { background: #1E4D8C55; border-radius: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }

    @keyframes pulseGlowRed {
      0%, 100% { box-shadow: 0 0 14px rgba(239,68,68,0.25); }
      50%       { box-shadow: 0 0 32px rgba(239,68,68,0.6);  }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(22px); }
      to   { opacity: 1; transform: translateY(0);    }
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-12px); }
      to   { opacity: 1; transform: translateY(0);     }
    }
    @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
    @keyframes shimmer {
      0%   { background-position: -600px 0; }
      100% { background-position:  600px 0; }
    }
    @keyframes spinAnim { to { transform: rotate(360deg); } }
    @keyframes blinkAnim { 0%,100%{opacity:1} 50%{opacity:.25} }
    @keyframes numberRise {
      from { opacity: 0; transform: translateY(10px) scale(0.94); }
      to   { opacity: 1; transform: translateY(0)    scale(1);    }
    }
    @keyframes alertPulse {
      0%,100% { background: rgba(239,68,68,0.05); }
      50%     { background: rgba(239,68,68,0.14); }
    }
    @keyframes cardEntrance {
      from { opacity: 0; transform: translateY(16px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0)    scale(1);    }
    }
    @keyframes navGlow {
      0%,100% { box-shadow: 0 1px 0 rgba(30,140,255,0.15), 0 4px 24px rgba(0,0,0,0.5); }
      50%     { box-shadow: 0 1px 0 rgba(30,140,255,0.3),  0 4px 24px rgba(0,0,0,0.5); }
    }
    @keyframes dotPulse {
      0%,100% { transform: scale(1); opacity: 1; }
      50%     { transform: scale(1.5); opacity: 0.6; }
    }
    @keyframes critBadge {
      0%,100% { transform: scale(1); }
      50%     { transform: scale(1.08); }
    }
    @keyframes summaryBarSlide {
      from { opacity: 0; transform: translateX(-10px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes loaderFadeIn {
      from { opacity: 0; transform: translateY(14px); }
      to   { opacity: 1; transform: translateY(0);    }
    }
    @keyframes birdFloat {
      0%,100% { transform: translateY(0px) rotate(-2deg); }
      50%     { transform: translateY(-10px) rotate(2deg); }
    }
    @keyframes birdGlow {
      0%,100% { filter: drop-shadow(0 0 8px rgba(30,140,255,0.4)); }
      50%     { filter: drop-shadow(0 0 24px rgba(30,140,255,0.9)); }
    }
    @keyframes orbFloat1 {
      0%,100% { transform: translate(0,0) scale(1); }
      33%     { transform: translate(30px,-20px) scale(1.1); }
      66%     { transform: translate(-20px,15px) scale(0.95); }
    }
    @keyframes orbFloat2 {
      0%,100% { transform: translate(0,0) scale(1); }
      33%     { transform: translate(-25px,20px) scale(0.9); }
      66%     { transform: translate(20px,-15px) scale(1.08); }
    }
    @keyframes progressGlow {
      0%,100% { box-shadow: 0 0 8px rgba(30,140,255,0.5); }
      50%     { box-shadow: 0 0 20px rgba(30,140,255,0.9), 0 0 40px rgba(30,140,255,0.4); }
    }
    @keyframes scanLine {
      0%   { top: 0%; opacity: 0.6; }
      100% { top: 100%; opacity: 0; }
    }
    @keyframes stepPop {
      from { opacity: 0; transform: scale(0.85) translateX(-8px); }
      to   { opacity: 1; transform: scale(1) translateX(0); }
    }
    @keyframes dotRow {
      0%,80%,100% { transform: scale(1); opacity: 0.4; }
      40%         { transform: scale(1.4); opacity: 1; }
    }
    @keyframes loaderExit {
      0%   { opacity: 1; visibility: visible; }
      100% { opacity: 0; visibility: hidden;  }
    }
    @keyframes gridPulse {
      0%,100% { opacity: 0.04; }
      50%     { opacity: 0.09; }
    }
    @keyframes titleReveal {
      from { opacity: 0; letter-spacing: .5em; transform: translateY(-8px); }
      to   { opacity: 1; letter-spacing: .12em; transform: translateY(0); }
    }

    .slide-up      { animation: slideUp      0.5s cubic-bezier(0.22,1,0.36,1) both; }
    .fade-in       { animation: fadeIn       0.4s ease both; }
    .num-rise      { animation: numberRise   0.65s cubic-bezier(0.22,1,0.36,1) both; }
    .glow-red      { animation: pulseGlowRed 2s ease-in-out infinite; }
    .spin-ic       { animation: spinAnim     1s linear infinite; }
    .blink-ic      { animation: blinkAnim    2s ease-in-out infinite; }
    .alert-pulse   { animation: alertPulse   2s ease-in-out infinite; }
    .crit-badge    { animation: critBadge    1.4s ease-in-out infinite; }
    .dot-pulse     { animation: dotPulse     1.8s ease-in-out infinite; }

    .skeleton {
      background: linear-gradient(90deg, #0D1826 25%, #162033 50%, #0D1826 75%);
      background-size: 600px 100%;
      animation: shimmer 1.6s infinite;
      border-radius: 6px;
    }

    .nav-pill {
      transition: all 0.18s cubic-bezier(0.22,1,0.36,1);
      cursor: pointer; user-select: none; white-space: nowrap;
    }
    .nav-pill:hover  {
      background: rgba(30,140,255,0.12) !important;
      color: #5BB3FF !important;
    }
    .nav-pill.active {
      background:   rgba(30,140,255,0.2)  !important;
      border-color: rgba(30,140,255,0.55) !important;
      color: #5BB3FF !important;
      box-shadow: 0 0 12px rgba(30,140,255,0.18);
    }

    .kpi-card {
      animation: cardEntrance 0.5s cubic-bezier(0.22,1,0.36,1) both;
      transition: transform 0.22s cubic-bezier(0.22,1,0.36,1), box-shadow 0.22s;
    }
    .kpi-card:hover {
      transform: translateY(-4px) scale(1.015);
      box-shadow: 0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(30,140,255,0.2);
    }

    .alert-row { transition: background 0.18s; }
    .alert-row:hover { background: rgba(255,255,255,0.04) !important; }

    .xbtn { transition: all 0.16s cubic-bezier(0.22,1,0.36,1); }
    .xbtn:hover {
      filter: brightness(1.18);
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.3);
    }

    .tab-btn { transition: all 0.18s; }
    .tab-btn:hover  { background: rgba(30,140,255,0.12) !important; }
    .tab-btn.active {
      background:   rgba(30,140,255,0.2)  !important;
      border-color: rgba(30,140,255,0.6)  !important;
      color: #5BB3FF !important;
    }

    .panel-enter { animation: slideUp 0.55s cubic-bezier(0.22,1,0.36,1) both; }

    .mini-card { transition: transform 0.2s, box-shadow 0.2s; }
    .mini-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.35);
    }

    .mob-nav {
      position: fixed; top: 0; left: -260px; width: 252px; height: 100vh;
      background: #0D1826; border-right: 1px solid rgba(30,140,255,0.14);
      z-index: 600; transition: left 0.28s cubic-bezier(0.4,0,.2,1);
      overflow-y: auto; padding: 16px 10px; display: flex; flex-direction: column;
    }
    .mob-nav.open { left: 0; }
    .mob-overlay {
      display: none; position: fixed; inset: 0;
      background: rgba(0,0,0,0.6); z-index: 590; backdrop-filter: blur(2px);
    }
    .mob-overlay.show { display: block; }

    .top-nav-scroll { overflow-x: auto; scrollbar-width: none; }
    .top-nav-scroll::-webkit-scrollbar { display: none; }

    .summary-item { animation: summaryBarSlide 0.4s cubic-bezier(0.22,1,0.36,1) both; }

    .nav-glow { animation: navGlow 4s ease-in-out infinite; }

    .loader-wrap {
      position: fixed; inset: 0; z-index: 9999;
      background: #060A12;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      overflow: hidden;
    }
    .loader-wrap.exit { animation: loaderExit 0.7s cubic-bezier(0.4,0,0.2,1) forwards; pointer-events: none; }
    .loader-grid-bg {
      position: absolute; inset: 0; pointer-events: none;
      background-image:
        linear-gradient(rgba(30,140,255,0.07) 1px, transparent 1px),
        linear-gradient(90deg, rgba(30,140,255,0.07) 1px, transparent 1px);
      background-size: 48px 48px;
      animation: gridPulse 3s ease-in-out infinite;
    }
    .loader-scan {
      position: absolute; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, transparent, rgba(30,140,255,0.6), transparent);
      animation: scanLine 2.4s linear infinite; pointer-events: none;
    }
    .loader-orb { position: absolute; border-radius: 50%; pointer-events: none; filter: blur(60px); }
    .loader-bird { animation: birdFloat 2.4s ease-in-out infinite, birdGlow 2.4s ease-in-out infinite; }
    .loader-title { animation: titleReveal 0.9s cubic-bezier(0.22,1,0.36,1) 0.3s both; }
    .loader-sub { animation: loaderFadeIn 0.7s ease 0.7s both; }
    .loader-progress-wrap { animation: loaderFadeIn 0.7s ease 0.9s both; }
    .loader-progress-bar { animation: progressGlow 1.5s ease-in-out infinite; transition: width 0.4s cubic-bezier(0.22,1,0.36,1); }
    .loader-step { animation: stepPop 0.35s cubic-bezier(0.22,1,0.36,1) both; }
    .loader-dots span {
      display: inline-block; width: 6px; height: 6px; border-radius: 50%;
      background: #1E8CFF; margin: 0 3px;
    }
    .loader-dots span:nth-child(1) { animation: dotRow 1.2s ease-in-out 0s    infinite; }
    .loader-dots span:nth-child(2) { animation: dotRow 1.2s ease-in-out 0.2s  infinite; }
    .loader-dots span:nth-child(3) { animation: dotRow 1.2s ease-in-out 0.4s  infinite; }

    /* ── Mobile responsive breakpoints ── */
    @media (max-width: 860px) {
      .top-nav-pills  { display: none !important; }
      .mob-ham        { display: flex !important; }
      .hdr-date       { display: none !important; }
      .hdr-export-lbl { display: none !important; }
    }
    @media (max-width: 600px) {
      .kpi-grid       { grid-template-columns: repeat(2, 1fr) !important; }
      .mini-grid      { grid-template-columns: repeat(2, 1fr) !important; }
      .two-col        { grid-template-columns: 1fr !important; }
      .summary-strip  { display: none !important; }
      .hdr-refresh    { display: none !important; }
      .hdr-right      { gap: 4px !important; }
    }
    @media (max-width: 400px) {
      .kpi-grid       { grid-template-columns: 1fr !important; }
    }

    .mob-ham { display: none; }
  `;
  document.head.appendChild(s);
})();

/* ─── Palette ───────────────────────────────────────── */
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
  mono: "'JetBrains Mono', monospace",
};

/* ─── Zoho helpers — SEQUENTIAL (required by iOS SDK) ── */
const ZOHO_APP = "poultry-management";

async function zohoGet(report, max = 500) {
  try {
    const r = await window.ZOHO?.CREATOR?.DATA?.getRecords({
      app_name: ZOHO_APP,
      report_name: report,
      field_config: "all",
      max_records: max,
    });
    return r?.data ?? [];
  } catch (e) {
    console.warn(`[WAFAD] zohoGet(${report}) failed:`, e);
    return [];
  }
}

/* ─── Field value extractor ─────────────────────────── */
const fv = (rec, f) => {
  if (!rec || !f) return null;
  const v = rec[f];
  if (!v) return null;
  return typeof v === "object" ? (v.zc_display_value || v.display_value || v.Name || null) : v;
};
const num = v => { const n = parseFloat(v); return isNaN(n) ? 0 : n; };
const safeDiv = (a, b, fallback = 0) => (b && b !== 0) ? a / b : fallback;

/* ─── Seed / static fallback data ───────────────────── */
function seed() {
  return {
    kpi: {
      totalBirdsPlaced: 485200, birdsAlive: 461840,
      mortalityThisWeek: 1240, mortalityTarget: 900,
      mortalityThisMonth: 4820, mortalityMale: 2100, mortalityFemale: 2720,
      feedIntakeTons: 312.4, feedCostTotal: 18720000,
      eggsThisWeek: 284500, eggsWeekTarget: 300000,
      eggsThisMonth: 1124000, eggsMonthTarget: 1200000,
      hatchingEggsWeek: 98400, hatchingEggsAvailableWeek: 62000,
      farmRejectedEggs: 14820, avgEggProductionRate: 84.2,
      goodChicksWeek: 54200, goodChicksMonth: 216800, goodChicksYear: 2601600,
      confirmedOrdersWeek: 68400, confirmedOrdersMonth: 273600,
      pendingOrdersWeek: 12800, pendingOrdersMonth: 51200,
      hatchabilityWeek: 87.4, hatchabilityMonth: 86.1,
      mortalityPct: 2.4, worstFarm: "Farm D – Kaduna",
      costPerFeedKg: 285, costPerHatchingEgg: 420,
      hatchForecastWeek: 58000, hatchForecastMonth: 232000,
      costPerChickWeek: 820, costPerChickLastWeek: 795,
      sellingPriceWeek: 1200, sellingPriceLastWeek: 1150,
      criticalIssues: 3,
    },
    hatchery: {
      eggsSetWeek: 68000, eggsSetMonth: 272000,
      hatchDueWeek: 54200, hatchDueMonth: 216800,
      hatchabilityWeek: 87.4, hatchabilityPrev: 85.1,
      goodChicks: 52480, poorChicks: 1720,
      fertilityRate: 91.2, infertilityRate: 8.8,
      weeklyTrend: [
        { w: "Wk 1", set: 65000, hatched: 56000, fertile: 59800 },
        { w: "Wk 2", set: 70000, hatched: 60200, fertile: 64100 },
        { w: "Wk 3", set: 68000, hatched: 59400, fertile: 62400 },
        { w: "Wk 4", set: 72000, hatched: 62500, fertile: 66100 },
      ],
    },
    feedmill: {
      producedMT: 128.4, producedDay: 18.3,
      issuedWeek: 98.2, issuedMonth: 390.4,
      productionVsDemand: 94.2, rawMaterialEff: 97.8, machineUptime: 91.4,
      trend: [
        { d: "Mon", prod: 18.2, issued: 17.1 }, { d: "Tue", prod: 19.0, issued: 18.4 },
        { d: "Wed", prod: 17.8, issued: 16.9 }, { d: "Thu", prod: 18.6, issued: 18.0 },
        { d: "Fri", prod: 18.3, issued: 17.6 }, { d: "Sat", prod: 16.5, issued: 15.8 },
      ],
    },
    sales: {
      confirmedWeek: 68400, confirmedMonth: 273600, confirmedYear: 3283200,
      pendingWeek: 12800, pendingMonth: 51200,
      ordersVsProduction: 91.2, fulfilledPct: 88.4,
      regionalDemand: [
        { region: "Abuja FCT", orders: 18400, color: C.blue },
        { region: "Lagos", orders: 15200, color: C.green },
        { region: "Kaduna", orders: 12800, color: C.amber },
        { region: "Kano", orders: 11600, color: C.purple },
        { region: "Ibadan", orders: 10400, color: C.cyan },
      ],
      top20: [
        { name: "Aminu Farms", qty: 8400 }, { name: "Lagos Poultry Co", qty: 7200 },
        { name: "Northern Agro", qty: 6800 }, { name: "Sunrise Farms", qty: 6200 },
        { name: "GreenField Ltd", qty: 5800 }, { name: "AgroNorth", qty: 5400 },
        { name: "Meridian Farms", qty: 4900 }, { name: "Eagle Poultry", qty: 4600 },
        { name: "Prime Chicks", qty: 4200 }, { name: "Delta Farms", qty: 3900 },
        { name: "Apex Agro", qty: 3600 }, { name: "Sahel Farms", qty: 3300 },
        { name: "Valley Fresh", qty: 3100 }, { name: "Unity Poultry", qty: 2800 },
        { name: "River State Agro", qty: 2600 }, { name: "Sunset Farms", qty: 2400 },
        { name: "TechFarm", qty: 2200 }, { name: "AgriPro", qty: 2000 },
        { name: "NovoBird", qty: 1800 }, { name: "FarmLink", qty: 1600 },
      ],
      avgSellingChick: 1200, avgSellingEgg: 85,
    },
    finance: {
      cashReceivedWeek: 82400000, cashReceivedMonth: 329600000,
      receivablesWeek: 24800000, receivablesMonth: 99200000,
      payablesWeek: 18200000, payablesMonth: 72800000,
      margins: [
        { product: "Chicks", margin: 32.4 }, { product: "Eggs", margin: 28.1 },
        { product: "Feed", margin: 18.6 }, { product: "Live Birds", margin: 41.2 },
      ],
      budgetVsActual: [
        { line: "Feed Cost", budget: 20000000, actual: 18720000 },
        { line: "Labour", budget: 8000000, actual: 7640000 },
        { line: "Utilities", budget: 3000000, actual: 3420000 },
        { line: "Veterinary", budget: 2500000, actual: 2180000 },
        { line: "Transport", budget: 1800000, actual: 2100000 },
      ],
    },
    inventory: {
      rawMaterialDays: 18, finishedFeedTons: 84.2,
      vaccineStatus: "Low", eggTrays: 12400, chickBoxes: 3200,
      criticalAlerts: [
        { item: "Newcastle Vaccine", status: "Critical", days: 3 },
        { item: "Marek's Vaccine", status: "Low", days: 7 },
        { item: "Chick Boxes", status: "Low", days: 5 },
      ],
      pendingPOs: 8, supplierDelays: 2,
    },
    alerts: [
      { type: "critical", icon: "mortality", title: "High Mortality – Farm D Kaduna", detail: "Mortality at 4.8% — above 3% threshold", time: "2h ago" },
      { type: "critical", icon: "hatchery", title: "Hatchery Loss > Threshold", detail: "Batch #HB-2214 hatchability 79% (target 85%)", time: "4h ago" },
      { type: "warning", icon: "vaccine", title: "Missed Vaccination – Farm B Abuja", detail: "Gumboro dose overdue by 2 days", time: "6h ago" },
      { type: "warning", icon: "equipment", title: "Generator Fault – Incubator Unit 3", detail: "Power fluctuation, maintenance dispatched", time: "8h ago" },
      { type: "warning", icon: "feed", title: "Feed Stock Low – Kaduna Mill", detail: "Maize stock for 3 days only", time: "10h ago" },
      { type: "info", icon: "biosecurity", title: "Biosecurity Alert – Farm A", detail: "Unauthorized vehicle entry logged", time: "1d ago" },
    ],
    workforce: {
      staffTurnoutToday: 284, staffOnLeave: 18,
      absenteeismPct: 5.4, overtime: 12, extendedHours: 22, openHRIssues: 4,
      deptProductivity: [
        { dept: "Hatchery", score: 92 }, { dept: "Feed Mill", score: 88 },
        { dept: "Farm Ops", score: 84 }, { dept: "Sales", score: 96 },
        { dept: "Logistics", score: 79 }, { dept: "Admin", score: 91 },
      ],
    },
  };
}

/* ─── Real-data loader (SEQUENTIAL — required by iOS) ─ */
async function loadZohoData() {
  // !! IMPORTANT: All getRecords calls are SEQUENTIAL (not parallel).
  // Parallel requests are NOT supported in Zoho Creator iOS native apps.

  // 1. Flock master — report: All_Flock_Management
  const flocks = await zohoGet("All_Flock_Management", 500);

  // 2. Hatchery SF batches — report: hatches_SF_Report
  //    Fields used: Good_Chicks, Poor_Chicks, Settable_Eggs, Fertile_Eggs,
  //                 Hatch_Date, Batch_No, Flock (lookup)
  const hatchSF = await zohoGet("hatches_SF_Report", 500);

  // 3. Chick sales orders — report: All_Chick_Orders
  //    Fields used: Status, Quantity, Customer_Name, Region, Order_Date, Order_Value
  const sales = await zohoGet("All_Chick_Orders", 500);

  // 4. Daily operations — report: ALL_WAFAD_BREEDER_FARM_DAILY_OPS
  //    Fields used: Age_of_Birds_Weeks, Total_Egg_Collected, Total_Quantity_Mortality,
  //                 Total_Feed_Consumed, Total_Hatchable_Eggs, Average_Weight_g,
  //                 Breeder_Farm, Breeder_House, Flock_Code, Record_Date
  const dailyOps = await zohoGet("ALL_WAFAD_BREEDER_FARM_DAILY_OPS", 1000);

  return { flocks, hatchSF, sales, dailyOps };
}

/* ─── Data transform ─────────────────────────────────── */
function transformData({ flocks, hatchSF, sales, dailyOps }) {
  const s = seed();
  const hasData = flocks.length || hatchSF.length || sales.length || dailyOps.length;
  if (!hasData) return s;

  /* ── Flock master aggregation ── */
  const totalBirdsPlaced = flocks.reduce((a, f) => {
    return a + num(fv(f, "Pullets_Housed")) + num(fv(f, "Cockerels_Housed"));
  }, 0) || s.kpi.totalBirdsPlaced;

  /* ── Daily ops — find current week (highest Age_of_Birds_Weeks) ── */
  const weeks = dailyOps.map(r => num(fv(r, "Age_of_Birds_Weeks"))).filter(w => w > 0);
  const maxWeek = weeks.length ? Math.max(...weeks) : 0;
  const thisWeekOps = dailyOps.filter(r => num(fv(r, "Age_of_Birds_Weeks")) === maxWeek);
  const thisMonthOps = dailyOps.filter(r => num(fv(r, "Age_of_Birds_Weeks")) >= maxWeek - 3);

  const totalMortality = dailyOps.reduce((a, r) => a + num(fv(r, "Total_Quantity_Mortality")), 0);
  const mortalityThisWeek = thisWeekOps.reduce((a, r) => a + num(fv(r, "Total_Quantity_Mortality")), 0) || s.kpi.mortalityThisWeek;
  const mortalityThisMonth = thisMonthOps.reduce((a, r) => a + num(fv(r, "Total_Quantity_Mortality")), 0) || s.kpi.mortalityThisMonth;
  const birdsAlive = (totalBirdsPlaced - totalMortality) || s.kpi.birdsAlive;
  const mortalityPct = totalBirdsPlaced > 0 ? parseFloat(((totalMortality / totalBirdsPlaced) * 100).toFixed(1)) : s.kpi.mortalityPct;

  const feedKgMonth = thisMonthOps.reduce((a, r) => a + num(fv(r, "Total_Feed_Consumed")), 0);
  const feedIntakeTons = feedKgMonth > 0 ? feedKgMonth / 1000 : s.kpi.feedIntakeTons;

  const eggsThisWeek = thisWeekOps.reduce((a, r) => a + num(fv(r, "Total_Egg_Collected")), 0) || s.kpi.eggsThisWeek;
  const eggsThisMonth = thisMonthOps.reduce((a, r) => a + num(fv(r, "Total_Egg_Collected")), 0) || s.kpi.eggsThisMonth;
  const hatchingEggsWeek = thisWeekOps.reduce((a, r) => a + num(fv(r, "Total_Hatchable_Eggs")), 0) || s.kpi.hatchingEggsWeek;

  /* ── Worst farm by mortality ── */
  const farmMort = {};
  dailyOps.forEach(r => {
    const farm = fv(r, "Breeder_Farm");
    if (farm) farmMort[farm] = (farmMort[farm] || 0) + num(fv(r, "Total_Quantity_Mortality"));
  });
  const worstFarm = Object.entries(farmMort).sort((a, b) => b[1] - a[1])[0]?.[0] || s.kpi.worstFarm;

  /* ── Hatchery ── */
  const goodChicksMonth = hatchSF.reduce((a, h) => a + num(fv(h, "Good_Chicks")), 0) || s.kpi.goodChicksMonth;
  const poorChicks = hatchSF.reduce((a, h) => a + num(fv(h, "Poor_Chicks")), 0);
  const eggsSetMonth = hatchSF.reduce((a, h) => a + num(fv(h, "Settable_Eggs")), 0) || s.hatchery.eggsSetMonth;
  const fertileEggs = hatchSF.reduce((a, h) => a + num(fv(h, "Fertile_Eggs")), 0);
  const hatchabilityWeek = eggsSetMonth > 0 ? parseFloat(((goodChicksMonth / eggsSetMonth) * 100).toFixed(1)) : s.kpi.hatchabilityWeek;
  const fertilityRate = eggsSetMonth > 0 ? parseFloat(((fertileEggs / eggsSetMonth) * 100).toFixed(1)) : s.hatchery.fertilityRate;

  /* ── Hatchery weekly trend (group hatches by batch/date) ── */
  const hatchByBatch = {};
  hatchSF.forEach(h => {
    const batch = fv(h, "Batch_No") || fv(h, "Hatch_Batch") || fv(h, "Batch") || "B";
    if (!hatchByBatch[batch]) hatchByBatch[batch] = { set: 0, fertile: 0, hatched: 0 };
    hatchByBatch[batch].set += num(fv(h, "Settable_Eggs"));
    hatchByBatch[batch].fertile += num(fv(h, "Fertile_Eggs"));
    hatchByBatch[batch].hatched += num(fv(h, "Good_Chicks"));
  });
  const hatchWeeklyTrend = Object.entries(hatchByBatch)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-4)
    .map(([b, d], i) => ({ w: `Wk ${i + 1}`, ...d }));

  /* ── Feed mill daily trend (group by Age_of_Birds_Weeks) ── */
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const feedByDay = {};
  thisWeekOps.forEach((r, i) => {
    const d = DAYS[i % 6];
    if (!feedByDay[d]) feedByDay[d] = { d, prod: 0, issued: 0, n: 0 };
    const feed = num(fv(r, "Total_Feed_Consumed")) / 1000;
    feedByDay[d].prod += feed;
    feedByDay[d].issued += feed * 0.96;
    feedByDay[d].n++;
  });
  const feedTrend = Object.values(feedByDay).length
    ? Object.values(feedByDay).map(d => ({ d: d.d, prod: parseFloat(d.prod.toFixed(1)), issued: parseFloat(d.issued.toFixed(1)) }))
    : s.feedmill.trend;

  /* ── Sales ── */
  const confirmedOrders = sales.filter(o => (fv(o, "Status") || "").toLowerCase() === "confirmed");
  const pendingOrders = sales.filter(o => (fv(o, "Status") || "").toLowerCase() !== "confirmed");
  const confirmedOrdersMonth = confirmedOrders.reduce((a, o) => a + num(fv(o, "Quantity")), 0) || s.kpi.confirmedOrdersMonth;
  const pendingOrdersMonth = pendingOrders.reduce((a, o) => a + num(fv(o, "Quantity")), 0) || s.kpi.pendingOrdersMonth;

  /* ── Regional demand from sales orders ── */
  const regionMap = {};
  sales.forEach(o => {
    const region = fv(o, "Region") || fv(o, "Location") || fv(o, "Delivery_Region") || "Other";
    regionMap[region] = (regionMap[region] || 0) + num(fv(o, "Quantity"));
  });
  const REGION_COLORS = [C.blue, C.green, C.amber, C.purple, C.cyan, C.orange];
  const regionalDemand = Object.entries(regionMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([region, orders], i) => ({ region, orders, color: REGION_COLORS[i] }));

  /* ── Top customers from sales ── */
  const custMap = {};
  sales.forEach(o => {
    const name = fv(o, "Customer_Name") || fv(o, "Customer") || "Unknown";
    custMap[name] = (custMap[name] || 0) + num(fv(o, "Quantity"));
  });
  const top20 = Object.entries(custMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([name, qty]) => ({ name, qty }));

  /* ── Assemble final data ── */
  return {
    ...s,
    kpi: {
      ...s.kpi,
      totalBirdsPlaced,
      birdsAlive,
      mortalityThisWeek,
      mortalityThisMonth,
      feedIntakeTons,
      eggsThisWeek,
      eggsThisMonth,
      hatchingEggsWeek,
      goodChicksMonth,
      goodChicksWeek: Math.round(goodChicksMonth / 4),
      confirmedOrdersMonth,
      confirmedOrdersWeek: Math.round(confirmedOrdersMonth / 4),
      pendingOrdersMonth,
      pendingOrdersWeek: Math.round(pendingOrdersMonth / 4),
      hatchabilityWeek,
      mortalityPct,
      worstFarm,
      criticalIssues: mortalityPct > 3 ? s.kpi.criticalIssues : Math.max(0, s.kpi.criticalIssues - 1),
    },
    hatchery: {
      ...s.hatchery,
      eggsSetMonth,
      eggsSetWeek: Math.round(eggsSetMonth / 4),
      hatchDueMonth: goodChicksMonth,
      hatchDueWeek: Math.round(goodChicksMonth / 4),
      goodChicks: Math.round(goodChicksMonth / 4),
      poorChicks: poorChicks || s.hatchery.poorChicks,
      hatchabilityWeek,
      fertilityRate,
      infertilityRate: parseFloat((100 - fertilityRate).toFixed(1)),
      weeklyTrend: hatchWeeklyTrend.length >= 2 ? hatchWeeklyTrend : s.hatchery.weeklyTrend,
    },
    feedmill: {
      ...s.feedmill,
      issuedMonth: feedKgMonth / 1000 || s.feedmill.issuedMonth,
      trend: feedTrend,
    },
    sales: {
      ...s.sales,
      confirmedWeek: Math.round(confirmedOrdersMonth / 4),
      confirmedMonth: confirmedOrdersMonth,
      confirmedYear: confirmedOrdersMonth * 12,
      pendingWeek: Math.round(pendingOrdersMonth / 4),
      pendingMonth: pendingOrdersMonth,
      regionalDemand: regionalDemand.length >= 2 ? regionalDemand : s.sales.regionalDemand,
      top20: top20.length >= 3 ? top20 : s.sales.top20,
    },
  };
}

/* ─── Formatters (en-US) ────────────────────────────── */
const fmtN = (n, d = 0) => n == null ? "—" : Number(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtCur = n => { if (!n) return "₦0"; if (n >= 1e9) return `₦${(n / 1e9).toFixed(1)}B`; if (n >= 1e6) return `₦${(n / 1e6).toFixed(1)}M`; if (n >= 1e3) return `₦${(n / 1e3).toFixed(0)}K`; return `₦${n}`; };
const fmtK = n => n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(0)}K` : `${n}`;

/* ─── Export helpers ────────────────────────────────── */
async function doExcel(data) {
  await loadScript("https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js");
  const XLSX = window.XLSX; if (!XLSX) { alert("SheetJS failed"); return; }
  const wb = XLSX.utils.book_new(); const k = data.kpi;
  const add = (name, rows) => {
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws["!cols"] = rows[0]?.map((_, i) => ({ wch: Math.max(18, ...rows.map(r => String(r[i] ?? "").length + 4)) }));
    XLSX.utils.book_append_sheet(wb, ws, name);
  };
  add("Executive KPIs", [
    ["WAFAD GROUP – Executive Dashboard"],
    [`Generated: ${new Date().toLocaleString("en-US")}`], [],
    ["KPI", "Value", "Target", "Status"],
    ["Total Birds Placed", k.totalBirdsPlaced, "", ""],
    ["Birds Alive", k.birdsAlive, "", ""],
    ["Mortality (Week)", k.mortalityThisWeek, k.mortalityTarget, k.mortalityThisWeek <= k.mortalityTarget ? "OK" : "Over"],
    ["Eggs (Week)", k.eggsThisWeek, k.eggsWeekTarget, ""],
    ["Hatchability %", k.hatchabilityWeek + "%", "85%", ""],
    ["Good Chicks (Week)", k.goodChicksWeek, "", ""],
    ["Confirmed Orders (Wk)", k.confirmedOrdersWeek, "", ""],
    ["Pending Orders (Wk)", k.pendingOrdersWeek, "", ""],
    ["Cost/Chick", "₦" + k.costPerChickWeek, "", ""],
    ["Selling Price/Chick", "₦" + k.sellingPriceWeek, "", ""],
    ["Critical Issues", k.criticalIssues, "", k.criticalIssues > 0 ? "URGENT" : "Clear"],
  ]);
  add("Alerts", [["Operations Alerts"], [], ["Type", "Title", "Detail", "Time"],
  ...data.alerts.map(a => [a.type.toUpperCase(), a.title, a.detail, a.time])]);
  XLSX.writeFile(wb, `WAFAD_Executive_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

async function doPptx(data) {
  await loadScript("https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js");
  const PG = window.PptxGenJS; if (!PG) { alert("PptxGenJS failed"); return; }
  const p = new PG(); p.layout = "LAYOUT_16x9"; p.title = "WAFAD Executive Dashboard";
  const BG = "060A12", SF = "0D1826", BL = "1E8CFF", GR = "10D97A", RD = "EF4444", AM = "F59E0B", TX = "E8EDF5", SO = "8FA3C0";
  const k = data.kpi;
  {
    const sl = p.addSlide();
    sl.background = { color: BG };
    sl.addShape(p.shapes.RECTANGLE, { x: 0, y: 0, w: .15, h: 5.625, fill: { color: BL }, line: { color: BL } });
    sl.addText("WAFAD GROUP", { x: .35, y: .8, w: 9, h: .7, fontSize: 14, bold: true, color: BL, fontFace: "Trebuchet MS", charSpacing: 4 });
    sl.addText("Executive Dashboard", { x: .35, y: 1.5, w: 9, h: 1.1, fontSize: 48, bold: true, color: TX, fontFace: "Trebuchet MS" });
    sl.addText("CEO / Chairman Overview", { x: .35, y: 2.65, w: 9, h: .5, fontSize: 18, color: SO, fontFace: "Calibri" });
    sl.addText(`Generated: ${new Date().toLocaleString("en-US")}`, { x: .35, y: 4.95, w: 7, h: .4, fontSize: 12, color: TX, fontFace: "Calibri" });
  }
  {
    const sl = p.addSlide();
    sl.background = { color: BG };
    sl.addShape(p.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: .65, fill: { color: BL }, line: { color: BL } });
    sl.addText("Production KPIs", { x: .3, y: 0, w: 9, h: .65, fontSize: 18, bold: true, color: TX, fontFace: "Trebuchet MS", valign: "middle" });
    [[fmtN(k.totalBirdsPlaced), "Birds Placed", BL], [fmtN(k.birdsAlive), "Birds Alive", GR],
    [fmtN(k.eggsThisWeek), "Eggs (Week)", AM], [fmtN(k.goodChicksWeek), "Good Chicks", GR],
    [k.hatchabilityWeek + "%", "Hatchability", BL], [k.mortalityPct + "%", "Mortality %", RD]]
      .forEach(([v, l, c], i) => {
        const col = i % 3, row = Math.floor(i / 3), x = .2 + col * 3.25, y = .85 + row * 2.3;
        sl.addShape(p.shapes.RECTANGLE, { x, y, w: 3.05, h: 2.0, fill: { color: SF }, line: { color: "1E4D8C" } });
        sl.addText(l.toUpperCase(), { x: x + .12, y: y + .15, w: 2.8, h: .3, fontSize: 8.5, color: SO, fontFace: "Calibri", bold: true });
        sl.addText(v, { x: x + .1, y: y + .55, w: 2.85, h: .9, fontSize: 32, bold: true, color: c, fontFace: "Trebuchet MS" });
      });
  }
  await p.writeFile({ fileName: `WAFAD_Executive_${new Date().toISOString().slice(0, 10)}.pptx` });
}

/* ══════════════════════════════════════════════════════
   UI PRIMITIVES
══════════════════════════════════════════════════════ */
const Sk = ({ w = "100%", h = 20 }) => <div className="skeleton" style={{ width: w, height: h }} />;

function Delta({ value, prev }) {
  if (!value || !prev) return null;
  const d = ((value - prev) / prev * 100).toFixed(1), up = d > 0;
  const Ic = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 20, background: up ? C.greenLt : C.redLt, color: up ? C.green : C.red, display: "inline-flex", alignItems: "center", gap: 2 }}>
      <Ic size={10} />{Math.abs(d)}%
    </span>
  );
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
  return (
    <div
      className={`panel-enter${glowRed ? " glow-red" : ""}`}
      style={{ background: C.surf, border: `1px solid ${glowRed ? C.red + "44" : C.border}`, borderRadius: 16, padding: "18px 16px", boxShadow: "0 4px 28px rgba(0,0,0,0.32)", animationDelay: `${delay}ms`, ...sx }}
    >
      {children}
    </div>
  );
}

function Mini({ label, value, sub, subNode, color = C.blue, loading }) {
  return (
    <div className="mini-card" style={{ background: C.surf2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
      <p style={{ fontSize: 9, color: C.textSf, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 5 }}>{label}</p>
      {loading ? <Sk h={24} /> : <p className="num-rise" style={{ fontSize: 18, fontWeight: 700, color, fontFamily: C.mono }}>{value}</p>}
      {(sub || subNode) && <div style={{ fontSize: 10, color: C.textMd, marginTop: 4 }}>{loading ? <Sk h={12} w="60%" /> : (subNode || sub)}</div>}
    </div>
  );
}

function Tip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: C.surf3, border: `1px solid ${C.borderMd}`, borderRadius: 10, padding: "10px 14px", fontSize: 12, fontFamily: "'Sora',sans-serif", boxShadow: "0 12px 36px rgba(0,0,0,0.5)" }}>
      <p style={{ fontWeight: 600, color: C.text, marginBottom: 6 }}>{label}</p>
      {payload.map((p, i) => <p key={i} style={{ color: p.color, margin: "2px 0" }}>{p.name}: <strong>{fmtN(p.value)}</strong></p>)}
    </div>
  );
}

function AlertIc({ iconKey, alertType }) {
  const color = alertType === "critical" ? C.red : alertType === "warning" ? C.amber : C.blue;
  const pr = { size: 17, color, strokeWidth: 2 };
  const map = { mortality: <Skull {...pr} />, hatchery: <Egg {...pr} />, vaccine: <Syringe {...pr} />, equipment: <Wrench {...pr} />, feed: <Wheat {...pr} />, biosecurity: <Lock {...pr} /> };
  return map[iconKey] || <AlertCircle {...pr} />;
}

/* ══════════════════════════════════════════════════════
   SECTION: KPI STRIP
══════════════════════════════════════════════════════ */
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
    { Ic: CheckCircle2, label: period === "week" ? "Good Chicks (Week)" : "Good Chicks (Month)", color: C.green, value: fmtN(period === "week" ? k.goodChicksWeek : k.goodChicksMonth), sub: `Year: ${fmtK(k.goodChicksYear)}` },
    { Ic: ShoppingCart, label: "Confirmed Orders", color: C.blue, value: fmtN(k.confirmedOrdersWeek), sub: `Month: ${fmtK(k.confirmedOrdersMonth)}` },
    { Ic: Clock, label: "Pending Orders", color: C.amber, value: fmtN(k.pendingOrdersWeek), sub: `Month: ${fmtK(k.pendingOrdersMonth)}` },
    { Ic: Gauge, label: "Hatchability %", color: C.green, value: `${k.hatchabilityWeek}%`, subNode: <Delta value={k.hatchabilityWeek} prev={k.hatchabilityMonth} /> },
    { Ic: Skull, label: "Mortality % / Worst", color: C.red, value: `${k.mortalityPct}%`, sub: k.worstFarm },
    { Ic: Banknote, label: "Cost / Feed kg", color: C.amber, value: `₦${k.costPerFeedKg}`, sub: `Hatching Egg: ₦${k.costPerHatchingEgg}` },
    { Ic: Layers, label: "Hatch Forecast (Wk)", color: C.purple, value: fmtN(k.hatchForecastWeek), sub: `Month: ${fmtK(k.hatchForecastMonth)}` },
    { Ic: DollarSign, label: "Cost / Chick (Week)", color: C.orange, value: `₦${fmtN(k.costPerChickWeek)}`, subNode: <Delta value={k.costPerChickWeek} prev={k.costPerChickLastWeek} /> },
    { Ic: Tag, label: "Selling Price / Chick", color: C.green, value: `₦${fmtN(k.sellingPriceWeek)}`, subNode: <Delta value={k.sellingPriceWeek} prev={k.sellingPriceLastWeek} /> },
    { Ic: AlertTriangle, label: "Critical Issues", color: k.criticalIssues > 0 ? C.red : C.green, value: k.criticalIssues, sub: k.criticalIssues > 0 ? "Requires immediate attention" : "All clear", pulse: k.criticalIssues > 0 },
  ];
  return (
    <Panel delay={0}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
        <SecHeader Ic={BarChart2} title="Production Control Center" subtitle="Live KPI Strip — CEO first-screen view" />
        <div style={{ display: "flex", gap: 6 }}>
          {["week", "month", "year"].map(p => (
            <button key={p} className={`tab-btn${period === p ? " active" : ""}`} onClick={() => setPeriod(p)}
              style={{ padding: "5px 14px", borderRadius: 20, border: `1px solid ${C.border}`, background: "transparent", color: C.textMd, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'Sora',sans-serif", textTransform: "capitalize" }}>{p}</button>
          ))}
        </div>
      </div>
      <div className="kpi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 12 }}>
        {kpis.map((item, i) => (
          <div key={item.label} className="kpi-card"
            style={{ background: C.surf2, border: `1px solid ${item.pulse ? C.red + "55" : C.border}`, borderRadius: 12, padding: "14px 14px", borderTop: `3px solid ${item.color}`, animationDelay: `${i * 40}ms`, boxShadow: item.pulse ? `0 0 18px rgba(239,68,68,0.22)` : undefined }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: item.color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <item.Ic size={14} color={item.color} strokeWidth={2} />
              </div>
              <span style={{ fontSize: 9, color: C.textSf, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", textAlign: "right", lineHeight: 1.3 }}>{item.label}</span>
            </div>
            {loading ? <Sk h={28} /> : <p className="num-rise" style={{ fontSize: 22, fontWeight: 700, color: item.color, fontFamily: C.mono, letterSpacing: "-.5px", animationDelay: `${i * 40 + 100}ms` }}>{item.value}</p>}
            <div style={{ marginTop: 6, fontSize: 10, color: item.subColor || C.textMd }}>
              {loading ? <Sk h={12} w="70%" /> : (item.subNode || item.sub)}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* ══════════════════════════════════════════════════════
   SECTION: HATCHERY
══════════════════════════════════════════════════════ */
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
        <Mini label="Hatchability% (Wk)" value={`${h.hatchabilityWeek}%`} color={C.green} loading={loading} subNode={<Delta value={h.hatchabilityWeek} prev={h.hatchabilityPrev} />} />
        <Mini label="Good Chicks" value={fmtN(h.goodChicks)} color={C.green} loading={loading} />
        <Mini label="Poor Chicks" value={fmtN(h.poorChicks)} color={C.red} loading={loading} />
        <Mini label="Fertility %" value={`${h.fertilityRate}%`} color={C.cyan} loading={loading} />
        <Mini label="Infertility %" value={`${h.infertilityRate}%`} color={C.orange} loading={loading} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
        <BarChart2 size={13} color={C.textSf} />
        <p style={{ fontSize: 11, fontWeight: 600, color: C.textMd }}>Weekly Trend — Set / Fertile / Hatched</p>
      </div>
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
    </Panel>
  );
}

/* ══════════════════════════════════════════════════════
   SECTION: FEED MILL
══════════════════════════════════════════════════════ */
function FeedMillSection({ data, loading }) {
  const f = data?.feedmill || {};
  return (
    <Panel delay={130}>
      <SecHeader Ic={Wheat} title="Feed Mill Operations" subtitle="Production, issuance & efficiency" iconColor={C.amber} />
      <div className="mini-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 10, marginBottom: 20 }}>
        <Mini label="Produced (MT/Month)" value={`${fmtN(f.producedMT, 1)} MT`} color={C.amber} loading={loading} />
        <Mini label="Produced (MT/Day)" value={`${fmtN(f.producedDay, 1)} MT`} color={C.amber} loading={loading} />
        <Mini label="Issued (Week)" value={`${fmtN(f.issuedWeek, 1)} MT`} color={C.blue} loading={loading} />
        <Mini label="Issued (Month)" value={`${fmtN(f.issuedMonth, 1)} MT`} color={C.blue} loading={loading} />
        <Mini label="Prod vs Demand" value={`${f.productionVsDemand}%`} color={f.productionVsDemand >= 95 ? C.green : C.amber} loading={loading} />
        <Mini label="Raw Material Eff." value={`${f.rawMaterialEff}%`} color={C.cyan} loading={loading} />
        <Mini label="Machine Uptime" value={`${f.machineUptime}%`} color={f.machineUptime >= 90 ? C.green : C.red} loading={loading} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
        <Activity size={13} color={C.textSf} />
        <p style={{ fontSize: 11, fontWeight: 600, color: C.textMd }}>Daily Production vs Issuance (MT)</p>
      </div>
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
    </Panel>
  );
}

/* ══════════════════════════════════════════════════════
   SECTION: SALES
══════════════════════════════════════════════════════ */
function SalesSection({ data, loading }) {
  const s = data?.sales || {};
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? s.top20 : (s.top20 || []).slice(0, 8);
  return (
    <Panel delay={180}>
      <SecHeader Ic={TrendingUp} title="Chicken4U Sales & Demand Engine" subtitle="Orders, fulfillment, regional demand & top customers" iconColor={C.green} />
      <div className="mini-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 10, marginBottom: 20 }}>
        <Mini label="Confirmed (Week)" value={fmtN(s.confirmedWeek)} color={C.green} loading={loading} />
        <Mini label="Confirmed (Month)" value={fmtN(s.confirmedMonth)} color={C.green} loading={loading} />
        <Mini label="Confirmed (Year)" value={fmtK(s.confirmedYear)} color={C.green} loading={loading} />
        <Mini label="Pending (Week)" value={fmtN(s.pendingWeek)} color={C.amber} loading={loading} />
        <Mini label="Pending (Month)" value={fmtN(s.pendingMonth)} color={C.amber} loading={loading} />
        <Mini label="Orders vs Prod %" value={`${s.ordersVsProduction}%`} color={s.ordersVsProduction >= 90 ? C.green : C.red} loading={loading} />
        <Mini label="Orders Fulfilled%" value={`${s.fulfilledPct}%`} color={s.fulfilledPct >= 90 ? C.green : C.amber} loading={loading} />
        <Mini label="Avg Price (Chick)" value={`₦${s.avgSellingChick}`} color={C.blue} loading={loading} />
        <Mini label="Avg Price (Egg)" value={`₦${s.avgSellingEgg}`} color={C.blue} loading={loading} />
      </div>
      <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
            <MapPin size={13} color={C.textSf} />
            <p style={{ fontSize: 11, fontWeight: 600, color: C.textMd }}>Regional Demand Distribution</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={s.regionalDemand || []} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 9, fill: C.textSf }} axisLine={false} tickLine={false} tickFormatter={fmtK} />
              <YAxis dataKey="region" type="category" tick={{ fontSize: 9, fill: C.textSf, fontFamily: "'Sora'" }} axisLine={false} tickLine={false} width={80} />
              <Tooltip content={<Tip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="orders" name="Orders" radius={[0, 6, 6, 0]}>
                {(s.regionalDemand || []).map((e, i) => <Cell key={i} fill={e.color || C.blue} fillOpacity={0.85} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
            <Users size={13} color={C.textSf} />
            <p style={{ fontSize: 11, fontWeight: 600, color: C.textMd }}>Top {showAll ? 20 : 8} Customers</p>
          </div>
          <div style={{ maxHeight: 215, overflowY: "auto" }}>
            {loading ? [...Array(5)].map((_, i) => <Sk key={i} h={28} style={{ marginBottom: 6 }} />) :
              displayed?.map((c, i) => (
                <div key={c.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", borderRadius: 8, marginBottom: 4, background: i % 2 === 0 ? C.surf2 : "transparent" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 10, color: C.textSf, fontFamily: C.mono, width: 20 }}>#{i + 1}</span>
                    <span style={{ fontSize: 11, color: C.text }}>{c.name}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.blue, fontFamily: C.mono }}>{fmtN(c.qty)}</span>
                </div>
              ))
            }
          </div>
          <button onClick={() => setShowAll(v => !v)} style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 5, padding: "5px 14px", borderRadius: 20, border: `1px solid ${C.borderMd}`, background: "transparent", color: C.textMd, fontSize: 11, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>
            {showAll ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {showAll ? "Show Less" : "Show All 20"}
          </button>
        </div>
      </div>
    </Panel>
  );
}

/* ══════════════════════════════════════════════════════
   SECTION: FINANCE
══════════════════════════════════════════════════════ */
function FinanceSection({ data, loading }) {
  const f = data?.finance || {};
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 400); return () => clearTimeout(t); }, []);
  return (
    <Panel delay={230}>
      <SecHeader Ic={Banknote} title="Financial Snapshot" subtitle="Cash, receivables, margins & budget vs actual" iconColor={C.green} />
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
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
            <Activity size={13} color={C.textSf} />
            <p style={{ fontSize: 11, fontWeight: 600, color: C.textMd }}>Gross Margin by Product</p>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={f.margins || []} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <XAxis dataKey="product" tick={{ fontSize: 9, fill: C.textSf, fontFamily: "'Sora'" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: C.textSf }} axisLine={false} tickLine={false} width={28} tickFormatter={v => v + "%"} />
              <Tooltip content={<Tip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="margin" name="Margin %" radius={[6, 6, 0, 0]}>
                {(f.margins || []).map((_, i) => <Cell key={i} fill={[C.green, C.blue, C.amber, C.purple][i % 4]} fillOpacity={0.85} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
            <BarChart2 size={13} color={C.textSf} />
            <p style={{ fontSize: 11, fontWeight: 600, color: C.textMd }}>Budget vs Actual</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(f.budgetVsActual || []).map((b, idx) => {
              const pct = Math.min(100, b.budget > 0 ? (b.actual / b.budget) * 100 : 0);
              const over = b.actual > b.budget;
              return (
                <div key={b.line}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 10, color: C.textMd }}>{b.line}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      {over ? <ArrowUpRight size={10} color={C.red} /> : <ArrowDownRight size={10} color={C.green} />}
                      <span style={{ fontSize: 10, fontFamily: C.mono, color: over ? C.red : C.green }}>{fmtCur(Math.abs(b.actual - b.budget))}</span>
                    </div>
                  </div>
                  <div style={{ height: 6, background: C.surf3, borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: mounted ? `${pct}%` : "0%", borderRadius: 4, background: over ? C.red : C.green, transition: `width 1.2s cubic-bezier(0.22,1,0.36,1) ${idx * 120}ms` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Panel>
  );
}

/* ══════════════════════════════════════════════════════
   SECTION: INVENTORY
══════════════════════════════════════════════════════ */
function InventorySection({ data, loading }) {
  const inv = data?.inventory || {};
  const sc = s => s === "Critical" ? C.red : s === "Low" ? C.amber : C.green;
  const si = s => s === "Critical" ? <AlertTriangle size={14} color={C.red} /> : <AlertCircle size={14} color={C.amber} />;
  return (
    <Panel delay={280}>
      <SecHeader Ic={Boxes} title="Inventory & Supply Chain Control" subtitle="Stock levels, POs, supplier status & low-stock alerts" iconColor={C.purple} />
      <div className="mini-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 10, marginBottom: 20 }}>
        <Mini label="Raw Material (Days)" value={`${inv.rawMaterialDays} days`} color={inv.rawMaterialDays >= 14 ? C.green : C.red} loading={loading} />
        <Mini label="Finished Feed (MT)" value={fmtN(inv.finishedFeedTons, 1)} color={C.amber} loading={loading} />
        <Mini label="Vaccine Status" value={inv.vaccineStatus ?? "—"} color={sc(inv.vaccineStatus)} loading={loading} />
        <Mini label="Egg Trays" value={fmtN(inv.eggTrays)} color={C.blue} loading={loading} />
        <Mini label="Chick Boxes" value={fmtN(inv.chickBoxes)} color={C.cyan} loading={loading} />
        <Mini label="Pending POs" value={inv.pendingPOs} color={C.purple} loading={loading} />
        <Mini label="Supplier Delays" value={inv.supplierDelays} color={inv.supplierDelays > 0 ? C.red : C.green} loading={loading} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
        <Zap size={13} color={C.red} />
        <p style={{ fontSize: 11, fontWeight: 600, color: C.textMd }}>Critical Low-Stock Alerts</p>
      </div>
      {(inv.criticalAlerts || []).map((a, i) => (
        <div key={i} className="alert-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 10, marginBottom: 6, background: sc(a.status) + "10", border: `1px solid ${sc(a.status)}30` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>{si(a.status)}<span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{a.item}</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}><CalendarDays size={12} color={sc(a.status)} /><span style={{ fontSize: 11, color: sc(a.status), fontWeight: 700 }}>{a.days} days remaining</span></div>
        </div>
      ))}
    </Panel>
  );
}

/* ══════════════════════════════════════════════════════
   SECTION: ALERTS
══════════════════════════════════════════════════════ */
function AlertsSection({ data, loading }) {
  const alerts = data?.alerts || [];
  const tc = t => t === "critical" ? C.red : t === "warning" ? C.amber : C.blue;
  const crit = alerts.filter(a => a.type === "critical").length;
  return (
    <Panel delay={330} glowRed={crit > 0}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
        <SecHeader Ic={ShieldAlert} title="Operations Risk & Alerts" subtitle="Control tower — live issues requiring CEO attention" iconColor={C.red} />
        {crit > 0 && (
          <span className="crit-badge" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, padding: "5px 14px", borderRadius: 20, background: C.redLt, color: C.red, border: `1px solid ${C.red}44` }}>
            <Flame size={12} color={C.red} />{crit} Critical Active
          </span>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {loading ? [...Array(4)].map((_, i) => <Sk key={i} h={56} />) :
          alerts.map((a, i) => (
            <div key={i}
              className={`alert-row${a.type === "critical" ? " alert-pulse" : ""}`}
              style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px", borderRadius: 12, background: tc(a.type) + "0C", border: `1px solid ${tc(a.type)}28`, animationDelay: `${i * 60}ms` }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: tc(a.type) + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <AlertIc iconKey={a.icon} alertType={a.type} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{a.title}</p>
                <p style={{ fontSize: 11, color: C.textMd, marginTop: 2 }}>{a.detail}</p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <span style={{ fontSize: 9.5, fontWeight: 700, padding: "3px 9px", borderRadius: 12, background: tc(a.type) + "20", color: tc(a.type), textTransform: "uppercase", letterSpacing: ".06em" }}>{a.type}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 5, justifyContent: "flex-end" }}>
                  <Clock size={10} color={C.textSf} /><p style={{ fontSize: 10, color: C.textSf }}>{a.time}</p>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </Panel>
  );
}

/* ══════════════════════════════════════════════════════
   SECTION: WORKFORCE
══════════════════════════════════════════════════════ */
function WorkforceSection({ data, loading }) {
  const w = data?.workforce || {};
  return (
    <Panel delay={380}>
      <SecHeader Ic={Users} title="Workforce & Discipline" subtitle="Attendance, absenteeism, productivity & HR issues" iconColor={C.cyan} />
      <div className="mini-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 10, marginBottom: 20 }}>
        <Mini label="Staff Turnout Today" value={fmtN(w.staffTurnoutToday)} color={C.green} loading={loading} />
        <Mini label="Staff on Leave" value={fmtN(w.staffOnLeave)} color={C.amber} loading={loading} />
        <Mini label="Absenteeism %" value={`${w.absenteeismPct}%`} color={w.absenteeismPct > 8 ? C.red : C.amber} loading={loading} />
        <Mini label="Overtime Staff" value={fmtN(w.overtime)} color={C.orange} loading={loading} />
        <Mini label="Extended Hours" value={fmtN(w.extendedHours)} color={C.purple} loading={loading} />
        <Mini label="Open HR Issues" value={w.openHRIssues} color={w.openHRIssues > 0 ? C.red : C.green} loading={loading} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
        <Gauge size={13} color={C.textSf} />
        <p style={{ fontSize: 11, fontWeight: 600, color: C.textMd }}>Department Productivity Score</p>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={w.deptProductivity || []} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <XAxis dataKey="dept" tick={{ fontSize: 9, fill: C.textSf, fontFamily: "'Sora'" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 9, fill: C.textSf }} axisLine={false} tickLine={false} width={28} domain={[60, 100]} tickFormatter={v => v + "%"} />
          <Tooltip content={<Tip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Bar dataKey="score" name="Score %" radius={[6, 6, 0, 0]}>
            {(w.deptProductivity || []).map((e, i) => <Cell key={i} fill={e.score >= 90 ? C.green : e.score >= 80 ? C.blue : C.amber} fillOpacity={0.85} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Panel>
  );
}

/* ══════════════════════════════════════════════════════
   SPLASH LOADER
══════════════════════════════════════════════════════ */
const LOAD_STEPS = [
  { label: "Connecting to Zoho Creator", icon: "🔗", duration: 500 },
  { label: "Loading flock master records", icon: "🐔", duration: 700 },
  { label: "Fetching hatchery SF data", icon: "🥚", duration: 650 },
  { label: "Loading chick sales orders", icon: "📦", duration: 500 },
  { label: "Loading daily operations", icon: "📊", duration: 700 },
  { label: "Building executive view", icon: "✅", duration: 350 },
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
    const tick = now => {
      setProgress(Math.min(100, ((now - start) / total) * 100));
      if (now - start < total) rafId = requestAnimationFrame(tick);
      else setProgress(100);
    };
    rafId = requestAnimationFrame(tick);

    let acc = 0;
    const timers = LOAD_STEPS.map((step, i) => {
      acc += step.duration;
      return setTimeout(() => { setStepIdx(i + 1); setDoneSteps(d => [...d, i]); }, acc);
    });

    const exitTimer = setTimeout(() => { setExiting(true); setTimeout(onDone, 680); }, total + 120);
    return () => { cancelAnimationFrame(rafId); timers.forEach(clearTimeout); clearTimeout(exitTimer); };
  }, [onDone]);

  return (
    <div className={`loader-wrap${exiting ? " exit" : ""}`}>
      <div className="loader-grid-bg" />
      <div className="loader-scan" />
      <div className="loader-orb" style={{ width: 400, height: 400, background: "rgba(30,140,255,0.12)", top: "-100px", left: "-80px", animation: "orbFloat1 7s ease-in-out infinite" }} />
      <div className="loader-orb" style={{ width: 300, height: 300, background: "rgba(139,92,246,0.1)", bottom: "-60px", right: "-40px", animation: "orbFloat2 9s ease-in-out infinite" }} />

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div className="loader-bird" style={{ marginBottom: 28 }}>
          <div style={{ width: 80, height: 80, borderRadius: 22, background: `linear-gradient(135deg,${C.blue},${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 40px rgba(30,140,255,0.45)" }}>
            <Bird size={38} color="#fff" strokeWidth={1.8} />
          </div>
        </div>
        <p className="loader-title" style={{ fontSize: 28, fontWeight: 800, color: C.text, letterSpacing: ".12em", textAlign: "center" }}>WAFAD GROUP</p>
        <p className="loader-sub" style={{ fontSize: 11, color: C.textSf, letterSpacing: ".22em", textTransform: "uppercase", marginTop: 6, marginBottom: 40 }}>Executive Dashboard</p>

        <div className="loader-progress-wrap" style={{ width: 320, maxWidth: "85vw" }}>
          <div style={{ height: 4, background: "rgba(30,140,255,0.14)", borderRadius: 4, overflow: "hidden", marginBottom: 12 }}>
            <div className="loader-progress-bar" style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg,${C.blue},${C.purple})`, borderRadius: 4 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
            <div className="loader-dots"><span /><span /><span /></div>
            <span style={{ fontSize: 10, color: C.textSf, fontFamily: C.mono }}>{Math.round(progress)}%</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {LOAD_STEPS.map((step, i) => {
              const done = doneSteps.includes(i), current = stepIdx === i, pending = stepIdx < i;
              return (
                <div key={i} className={done || current ? "loader-step" : ""} style={{ display: "flex", alignItems: "center", gap: 10, animationDelay: `${i * 60}ms`, opacity: pending ? 0.25 : 1, transition: "opacity 0.3s" }}>
                  <div style={{ width: 20, height: 20, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: done ? C.greenLt : current ? C.blueLt : "rgba(255,255,255,0.04)", border: `1px solid ${done ? C.green + "44" : current ? C.blue + "44" : "transparent"}`, transition: "all 0.3s" }}>
                    {done ? <CheckCircle2 size={11} color={C.green} /> : current ? <RefreshCw size={10} color={C.blue} className="spin-ic" /> : <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.textSf }} />}
                  </div>
                  <span style={{ fontSize: 11, color: done ? C.text : current ? C.blue : C.textSf, fontWeight: current ? 600 : 400, fontFamily: "'Sora',sans-serif", transition: "color 0.3s" }}>{step.label}</span>
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

/* ══════════════════════════════════════════════════════
   NAV CONFIG
══════════════════════════════════════════════════════ */
const NAV = [
  { id: "kpi", Ic: BarChart2, label: "KPI Strip" },
  { id: "hatchery", Ic: Egg, label: "Hatchery" },
  { id: "feedmill", Ic: Wheat, label: "Feed Mill" },
  { id: "sales", Ic: TrendingUp, label: "Sales" },
  { id: "finance", Ic: Banknote, label: "Finance" },
  { id: "inventory", Ic: Boxes, label: "Inventory" },
  { id: "alerts", Ic: ShieldAlert, label: "Risk & Alerts" },
  { id: "workforce", Ic: Users, label: "Workforce" },
];

/* ══════════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════════ */
export default function WAFADExecutiveDashboard() {
  const [showLoader, setShowLoader] = useState(true);
  const [active, setActive] = useState("kpi");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState(null);
  const [exporting, setExporting] = useState(null);
  const [mobOpen, setMobOpen] = useState(false);
  const mainRef = useRef(null);

  /* ── Data loader — sequential per Zoho iOS requirement ── */
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Sequential calls (NOT parallel — Zoho iOS SDK requirement)
      const raw = await loadZohoData();
      setData(transformData(raw));
    } catch (e) {
      console.warn("[WAFAD] falling back to seed data:", e);
      setData(seed());
    } finally {
      setLoading(false);
      setLastSync(new Date());
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  /* ── Scroll-spy ── */
  const handleScroll = e => {
    const top = e.target.scrollTop + 120;
    let cur = "kpi";
    for (const { id } of NAV) {
      const el = document.getElementById(`sec-${id}`);
      if (el && el.offsetTop <= top) cur = id;
    }
    setActive(cur);
  };

  const scrollTo = id => {
    setActive(id); setMobOpen(false);
    document.getElementById(`sec-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleExport = async type => {
    if (!data) return; setExporting(type);
    try { if (type === "excel") await doExcel(data); else await doPptx(data); }
    catch { alert("Export failed. Please try again."); }
    finally { setExporting(null); }
  };

  const critCount = data?.alerts?.filter(a => a.type === "critical").length ?? 0;
  const dateStr = new Date().toLocaleDateString("en-US", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });

  /* ── Mobile sidebar ── */
  const MobNavContent = () => (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Bird size={20} color={C.blue} />
          <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>WAFAD</span>
        </div>
        <button onClick={() => setMobOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: C.textMd, display: "flex" }}>
          <X size={20} />
        </button>
      </div>
      <p style={{ fontSize: 9, fontWeight: 700, color: C.textSf, textTransform: "uppercase", letterSpacing: ".12em", margin: "0 8px 12px" }}>Navigation</p>
      {NAV.map(n => (
        <div key={n.id} onClick={() => scrollTo(n.id)}
          style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 10, marginBottom: 4, cursor: "pointer", background: active === n.id ? "rgba(30,140,255,0.14)" : "transparent", borderLeft: `3px solid ${active === n.id ? C.blue : "transparent"}`, transition: "all 0.14s" }}>
          <n.Ic size={15} color={active === n.id ? C.blue : C.textMd} strokeWidth={2} />
          <span style={{ fontSize: 12, fontWeight: 500, color: active === n.id ? C.blue : C.textMd }}>{n.label}</span>
          {n.id === "alerts" && critCount > 0 && (
            <span style={{ marginLeft: "auto", fontSize: 9.5, fontWeight: 700, background: C.redLt, color: C.red, padding: "1px 7px", borderRadius: 10 }}>{critCount}</span>
          )}
        </div>
      ))}
      <div style={{ marginTop: "auto", padding: "14px 8px 0", borderTop: `1px solid ${C.border}` }}>
        {lastSync && <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}><Clock size={11} color={C.textSf} /><p style={{ fontSize: 9.5, color: C.textSf }}>Synced {lastSync.toLocaleTimeString("en-US")}</p></div>}
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}><UserCog size={11} color={C.textSf} /><p style={{ fontSize: 9.5, color: C.textSf }}>CEO / Chairman View</p></div>
      </div>
    </>
  );

  return (
    <div style={{ fontFamily: "'Sora',sans-serif", background: C.bg, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {showLoader && <SplashLoader onDone={() => setShowLoader(false)} />}
      <div className={`mob-overlay${mobOpen ? " show" : ""}`} onClick={() => setMobOpen(false)} />
      <nav className={`mob-nav${mobOpen ? " open" : ""}`}><MobNavContent /></nav>

      {/* ═══ HEADER ═══════════════════════════════════════ */}
      <header className="nav-glow" style={{ background: C.surf, borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, zIndex: 300, boxShadow: "0 4px 24px rgba(0,0,0,0.45)" }}>

        {/* Row 1: Brand + Controls */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px", height: 54, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button className="mob-ham xbtn" onClick={() => setMobOpen(o => !o)}
              style={{ alignItems: "center", background: C.surf2, border: `1px solid ${C.border}`, borderRadius: 8, padding: "7px 9px", cursor: "pointer", color: C.textMd }}>
              <Menu size={18} />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: `linear-gradient(135deg,${C.blue},${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 3px 14px rgba(30,140,255,0.38)` }}>
                <Bird size={16} color="#fff" strokeWidth={2} />
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 800, color: C.text, letterSpacing: "-.3px", lineHeight: 1.1 }}>WAFAD GROUP</p>
                <p style={{ fontSize: 7.5, color: C.textSf, letterSpacing: ".12em" }}>EXECUTIVE DASHBOARD</p>
              </div>
            </div>
          </div>

          <div className="hdr-right" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {/* Live pill */}
            <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 20, border: `1px solid ${loading ? C.amber + "55" : C.green + "55"}`, background: loading ? C.amberLt : C.greenLt }}>
              {loading ? <RefreshCw size={10} color={C.amber} className="spin-ic" /> : <Circle size={5} color={C.green} fill={C.green} className="dot-pulse" />}
              <span style={{ fontSize: 10, fontWeight: 700, color: loading ? C.amber : C.green }}>{loading ? "Loading…" : "Live"}</span>
            </div>
            {/* Date (hidden on mobile) */}
            <div className="hdr-date" style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <CalendarDays size={11} color={C.textSf} />
              <span style={{ fontSize: 9.5, color: C.textSf }}>{dateStr}</span>
            </div>
            {/* Refresh (hidden on small mobile) */}
            <button className="hdr-refresh xbtn" onClick={loadData} disabled={loading}
              style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 7, border: `1px solid ${C.borderMd}`, background: "transparent", color: C.textMd, fontSize: 10, cursor: "pointer", fontFamily: "'Sora',sans-serif", opacity: loading ? 0.5 : 1 }}>
              <RefreshCw size={11} />
              <span className="hdr-export-lbl">Refresh</span>
            </button>
            {/* Excel */}
            <button className="xbtn" onClick={() => handleExport("excel")} disabled={!!exporting || loading}
              style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 7, border: "none", background: C.greenLt, color: C.green, fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>
              {exporting === "excel" ? <RefreshCw size={12} className="spin-ic" /> : <FileSpreadsheet size={12} />}
              <span className="hdr-export-lbl">Excel</span>
            </button>
            {/* PPT */}
            <button className="xbtn" onClick={() => handleExport("pptx")} disabled={!!exporting || loading}
              style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 7, border: "none", background: C.orangeLt, color: C.orange, fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>
              {exporting === "pptx" ? <RefreshCw size={12} className="spin-ic" /> : <Presentation size={12} />}
              <span className="hdr-export-lbl">PPT</span>
            </button>
          </div>
        </div>

        {/* Row 2: Nav pills (desktop only) */}
        <div className="top-nav-pills top-nav-scroll" style={{ display: "flex", alignItems: "center", gap: 4, padding: "0 14px", height: 42 }}>
          {NAV.map((n, idx) => (
            <button key={n.id} onClick={() => scrollTo(n.id)}
              className={`nav-pill${active === n.id ? " active" : ""}`}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 8, border: `1px solid ${active === n.id ? "rgba(30,140,255,0.55)" : "transparent"}`, background: "transparent", color: active === n.id ? C.blue : C.textMd, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'Sora',sans-serif", position: "relative", animationDelay: `${idx * 30}ms` }}>
              <n.Ic size={13} strokeWidth={2} />
              {n.label}
              {n.id === "alerts" && critCount > 0 && (
                <span className="crit-badge" style={{ fontSize: 8.5, fontWeight: 800, background: C.red, color: "#fff", padding: "1px 5px", borderRadius: 8, marginLeft: 2, lineHeight: 1.4 }}>{critCount}</span>
              )}
            </button>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
            {lastSync && (<><Clock size={10} color={C.textSf} /><span style={{ fontSize: 9.5, color: C.textSf, whiteSpace: "nowrap" }}>Synced {lastSync.toLocaleTimeString("en-US")}</span></>)}
            <UserCog size={10} color={C.textSf} style={{ marginLeft: 6 }} />
            <span style={{ fontSize: 9.5, color: C.textSf, whiteSpace: "nowrap" }}>CEO View</span>
          </div>
        </div>
      </header>

      {/* ═══ MAIN CONTENT ══════════════════════════════════ */}
      <main ref={mainRef} onScroll={handleScroll}
        style={{ flex: 1, overflowY: "auto", padding: "16px 14px 48px", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Summary strip */}
        {!loading && data && (
          <div className="summary-strip fade-in" style={{ display: "flex", gap: 14, flexWrap: "wrap", padding: "10px 16px", borderRadius: 12, background: C.surf, border: `1px solid ${C.border}`, alignItems: "center" }}>
            {[
              { Ic: AlertTriangle, label: "Critical Issues", value: data.kpi.criticalIssues, color: C.red },
              { Ic: Bird, label: "Birds Alive", value: fmtN(data.kpi.birdsAlive), color: C.green },
              { Ic: Gauge, label: "Hatchability", value: data.kpi.hatchabilityWeek + "%", color: C.blue },
              { Ic: ShoppingCart, label: "Orders (Week)", value: fmtN(data.kpi.confirmedOrdersWeek), color: C.amber },
              { Ic: Banknote, label: "Feed Cost/Day", value: fmtCur(data.kpi.feedCostTotal / 30), color: C.purple },
            ].map(({ Ic, label, value, color }, i) => (
              <div key={label} className="summary-item" style={{ display: "flex", alignItems: "center", gap: 6, animationDelay: `${i * 80}ms` }}>
                <Ic size={12} color={color} strokeWidth={2} />
                <span style={{ fontSize: 9.5, color: C.textSf }}>{label}:</span>
                <span style={{ fontSize: 11.5, fontWeight: 700, color, fontFamily: C.mono }}>{value}</span>
              </div>
            ))}
          </div>
        )}

        <div id="sec-kpi">       <KpiStrip data={data} loading={loading} /></div>
        <div id="sec-hatchery">  <HatcherySection data={data} loading={loading} /></div>
        <div id="sec-feedmill">  <FeedMillSection data={data} loading={loading} /></div>
        <div id="sec-sales">     <SalesSection data={data} loading={loading} /></div>
        <div id="sec-finance">   <FinanceSection data={data} loading={loading} /></div>
        <div id="sec-inventory"> <InventorySection data={data} loading={loading} /></div>
        <div id="sec-alerts">    <AlertsSection data={data} loading={loading} /></div>
        <div id="sec-workforce"> <WorkforceSection data={data} loading={loading} /></div>

        <p style={{ textAlign: "center", padding: "8px 0", color: C.textSf, fontSize: 10.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <Building2 size={12} color={C.textSf} />
          WAFAD Executive Dashboard · CEO / Chairman View
        </p>
      </main>
    </div>
  );
}

