async function loadAllData() {
  console.log("=== [WAFAD] Starting full data load v4 ===");
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

  const monthlyOpsData = {};   // YYYY-MM → ops metrics
  const monthlyHatchData = {};  // YYYY-MM → hatch metrics
  const monthlyFinData = {};   // YYYY-MM → revenue/expense

  // costPerFeedKg is declared early; assigned after products section
  let costPerFeedKg = 0;

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
  let hatchingEggsWeek = 0, hatchingEggsMonth = 0;
  let farmRejectedEggs = 0, crackedEggs = 0, dirtyEggs = 0, floorEggs = 0;
  let feedIntakeTonsWeek = 0, feedIntakeTonsMonth = 0;
  const weeklyEggTrend = {}, farmMort = {};

  // Breed / farm egg accumulators
  const breedEggData = {};
  const farmEggData = {};
  const farmBreedEggData = {};
  const ensureBreedEgg = (b) => { if (b && !breedEggData[b]) breedEggData[b] = emptyBreedEgg(); };
  const ensureFarmEgg = (f) => { if (f && !farmEggData[f]) farmEggData[f] = emptyBreedEgg(); };

  // Feed usage rows collected from subform (used later for cost reconciliation)
  const feedUsageRows = [];

  dailyOps.forEach((r) => {
    const rawDate = fv(r, "Date_field") || fv(r, "Date") || fv(r, "Added_Time");
    const recDate = parseZohoDate(rawDate);
    const isWeek = recDate && recDate >= weekStart;
    const isMonth = recDate && recDate >= monthStart;
    const isYear = recDate && recDate >= yearStart;
    const isLWk = recDate && recDate >= lastWeekStart && recDate <= lastWeekEnd;
    const isLMon = recDate && recDate >= lastMonthStart && recDate <= lastMonthEnd;

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

    const feedKg = num(fv(r, "Total_Feed_Consumed") || fv(r, "Feed_Consumed") || fv(r, "Feed_Consumed_Kg"));
    const weekNum = num(fv(r, "Week_Number") || fv(r, "Age_of_Birds_Weeks") || fv(r, "Bird_Age_Week"));

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

    // ── Egg fields ────────────────────────────────────────
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
    if (isWeek) { eggsThisWeek += eggs; hatchingEggsWeek += hatchEgg; }
    if (isMonth) { eggsThisMonth += eggs; hatchingEggsMonth += hatchEgg; }
    if (isYear) eggsThisYear += eggs;

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

    // ── breedEggData accumulation ─────────────────────────
    if (recBreed) {
      ensureBreedEgg(recBreed);
      const b = breedEggData[recBreed];
      if (isWeek) { b.eggsWeek += eggs; b.hatchableWeek += hatchEgg; b.mortalityWeek += mortTotal; b.feedKgWeek += feedKg; }
      if (isMonth) { b.eggsMonth += eggs; b.hatchableMonth += hatchEgg; b.mortalityMonth += mortTotal; b.feedKgMonth += feedKg; }
      if (isYear) { b.eggsYear += eggs; b.mortalityYear += mortTotal; b.feedKgYear += feedKg; }
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
      if (isWeek) { f.eggsWeek += eggs; f.hatchableWeek += hatchEgg; f.mortalityWeek += mortTotal; f.feedKgWeek += feedKg; }
      if (isMonth) { f.eggsMonth += eggs; f.hatchableMonth += hatchEgg; f.mortalityMonth += mortTotal; f.feedKgMonth += feedKg; }
      if (isYear) { f.eggsYear += eggs; f.mortalityYear += mortTotal; f.feedKgYear += feedKg; }
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
      if (isWeek) { fb.eggsWeek += eggs; fb.hatchableWeek += hatchEgg; fb.mortalityWeek += mortTotal; fb.feedKgWeek += feedKg; }
      if (isMonth) { fb.eggsMonth += eggs; fb.hatchableMonth += hatchEgg; fb.mortalityMonth += mortTotal; fb.feedKgMonth += feedKg; }
      if (isYear) { fb.eggsYear += eggs; fb.mortalityYear += mortTotal; fb.feedKgYear += feedKg; }
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

  const birdsAlive = Math.max(0, totalBirdsPlaced - totalMortality);
  const mortalityPct = totalBirdsPlaced > 0
    ? parseFloat(((mortalityThisWeek / totalBirdsPlaced) * 100).toFixed(2)) : 0;
  const mortalityPctCumulative = totalBirdsPlaced > 0
    ? parseFloat(((totalMortality / totalBirdsPlaced) * 100).toFixed(2)) : 0;
  const worstFarm = Object.entries(farmMort).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
  const avgEggProductionRate = birdsAliveTotal > 0
    ? parseFloat(((eggsThisMonth / Math.max(1, birdsAliveTotal)) * 100).toFixed(1)) : 0;
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

    if (recDate && recDate >= yearStart) {
      feedProducedYearMT += totalFeed / 1000;
      feedKgYearFromOps += totalFeed;
    }
    if (recDate && recDate >= monthStart) {
      feedProducedMT += totalFeed / 1000;
      feedIssuedMT += (totalFeed * 0.97) / 1000;
      feedKgMonthFromOps += totalFeed;
      const dayKey = recDate.toLocaleDateString("en-US", { weekday: "short" });
      if (!feedDayMap[dayKey]) feedDayMap[dayKey] = { d: dayKey, prod: 0, issued: 0 };
      feedDayMap[dayKey].prod += parseFloat((totalFeed / 1000).toFixed(2));
      feedDayMap[dayKey].issued += parseFloat(((totalFeed * 0.97) / 1000).toFixed(2));
    }
    if (recDate && recDate >= weekStart) {
      feedProducedWeekMT += totalFeed / 1000;
      feedIssuedWeekMT += (totalFeed * 0.97) / 1000;
      feedKgWeekFromOps += totalFeed;
    }
  });

  const DAYS_ORDER = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const feedTrend = DAYS_ORDER.filter((d) => feedDayMap[d]).map((d) => ({
    d,
    prod: parseFloat(feedDayMap[d].prod.toFixed(1)),
    issued: parseFloat(feedDayMap[d].issued.toFixed(1)),
  }));

  /* ─── 4. HATCHERY ───────────────────────────────────────────────── */
  const hatchSF = await zohoGetAll("Detailed_Hatches");
  console.group("✅ [4] HATCHERY REPORT");
  console.log("Total records:", hatchSF.length);
  console.log("Statuses present:", [...new Set(hatchSF.map((h) => fv(h, "Status") || "null"))]);
  console.groupEnd();

  let eggsSetWeek = 0, eggsSetMonth = 0, eggsSetYear = 0;
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
    const hatchedDate = hatchedDateRaw ? parseZohoDate(hatchedDateRaw) : null;
    const batch = fv(h, "Hatch_No") || "B";
    if (!hatchBatchMap[batch]) hatchBatchMap[batch] = { set: 0, fertile: 0, hatched: 0 };

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
        if (settingDate >= yearStart) { eggsSetYear += settable; breedHatchData[breed].eggsSetYear += settable; }
        if (settingDate >= monthStart) { eggsSetMonth += settable; breedHatchData[breed].eggsSetMonth += settable; }
        if (settingDate >= weekStart) { eggsSetWeek += settable; breedHatchData[breed].eggsSetWeek += settable; }
        if (settingDate >= lastWeekStart && settingDate <= lastWeekEnd) eggsSetLastWeek += settable;
        if (settingDate >= lastMonthStart && settingDate <= lastMonthEnd) eggsSetLastMonth += settable;
      }
      breedHatchData[breed].settableEggs += settable;
      hatchBatchMap[batch].set += settable;

      // Good chicks / fertile keyed by hatchedDate (only when hatched)
      if (isHatched && hatchedDate && !isNaN(hatchedDate)) {
        const mKeyHatch = mkMonthKey(hatchedDate);
        if (mKeyHatch) {
          ensureMonth(monthlyHatchData, mKeyHatch, HATCH_TPL);
          monthlyHatchData[mKeyHatch].goodChicks += good;
          monthlyHatchData[mKeyHatch].fertile += fertile;
        }
        hatchBatchMap[batch].fertile += fertile;
        hatchBatchMap[batch].hatched += good;
        if (hatchedDate >= yearStart) { goodChicksYear += good; breedHatchData[breed].goodChicksYear += good; }
        if (hatchedDate >= monthStart) {
          goodChicksMonth += good; poorChicksMonth += poor; fertileEggsMonth += fertile;
          breedHatchData[breed].goodChicksMonth += good;
          breedHatchData[breed].fertileEggs += fertile;
          breedHatchData[breed].poorChicks += poor;
        }
        if (hatchedDate >= weekStart) { goodChicksWeek += good; breedHatchData[breed].goodChicksWeek += good; }
        if (hatchedDate >= lastWeekStart && hatchedDate <= lastWeekEnd) goodChicksLastWeek += good;
        if (hatchedDate >= lastMonthStart && hatchedDate <= lastMonthEnd) goodChicksLastMonth += good;
      }
    });
  });

  const hatchWeeklyTrend = Object.entries(hatchBatchMap)
    .sort((a, b) => String(a[0]).localeCompare(String(b[0]))).slice(-4)
    .map(([, d], i) => ({ w: `Batch ${i + 1}`, set: d.set, fertile: d.fertile, hatched: d.hatched }));

  const hatchabilityWeek = eggsSetWeek > 0 ? parseFloat(((goodChicksWeek / eggsSetWeek) * 100).toFixed(1)) : 0;
  const hatchabilityMonth = eggsSetMonth > 0 ? parseFloat(((goodChicksMonth / eggsSetMonth) * 100).toFixed(1)) : 0;
  const hatchabilityYear = eggsSetYear > 0 ? parseFloat(((goodChicksYear / eggsSetYear) * 100).toFixed(1)) : 0;
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
  console.log("[WAFAD] DOC by breed:", breedDOC);

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

  invoices.forEach((inv) => {
    const rawDate = fv(inv, "Date_field") || fv(inv, "Invoice_Date") || fv(inv, "Date") || fv(inv, "Added_Time");
    const recDate = parseZohoDate(rawDate);
    const amount = num(fv(inv, "Total_Amount"));
    const status = (fv(inv, "Status") || "").toLowerCase().trim();
    const customer = displayVal(inv.Customer || "") || "Unknown";
    const prodName = displayVal(inv.Product_Name || "") || "Other";

    const isPaid = status === "paid" || status === "invoiced";
    const isUnpaid = status === "draft" || status === "submitted" || status === "viewed" || status === "open";

    if (isPaid && recDate) {
      const mKey = mkMonthKey(recDate);
      if (mKey) { ensureMonth(monthlyFinData, mKey, FIN_TPL); monthlyFinData[mKey].revenue += amount; }
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

    // Egg selling price from invoice line items
    if (isPaid && recDate) {
      const prodLines = inv.Product_Details_SF || inv.Line_Items || [];
      if (Array.isArray(prodLines)) {
        prodLines.forEach((p) => {
          const pName = displayVal(p.Product_Name || "").toUpperCase();
          const pUnit = displayVal(p.Unit || p.Unit_Details || "").toLowerCase();
          const pPrice = num(fv(p, "Unit_Price") || fv(p, "Rate") || 0);
          const pQty = num(fv(p, "Quantity") || 0);
          const isEgg = pUnit.includes("egg") || pName.includes("EGG") || pName.includes("HATCHING");
          if (isEgg && pPrice > 0 && pQty > 0) {
            sellingPriceEggWeekSum += pPrice * pQty;
            sellingPriceEggWeekQty += pQty;
          }
        });
      }
    }
  });

  const sellingPriceHatchingEgg = sellingPriceEggWeekQty > 0
    ? Math.round(sellingPriceEggWeekSum / sellingPriceEggWeekQty) : 0;

  const top20Customers = Object.entries(custMap)
    .sort((a, b) => b[1] - a[1]).slice(0, 20)
    .map(([name, revenue]) => ({ name, qty: revenue }));

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

        if (recDate && recDate >= weekStart) { sellingPriceWeekSum += linePrice * pQty; sellingPriceWeekQty += pQty; }
        if (recDate && recDate >= lastWeekStart && recDate <= lastWeekEnd) { sellingPriceLastWeekSum += linePrice * pQty; sellingPriceLastWeekQty += pQty; }
        if (recDate && recDate >= yearStart) { sellingPriceYTDSum += linePrice * pQty; sellingPriceYTDQty += pQty; }
      });
    }

    const qty = orderQty || 1;
    const region = displayVal(o.Region || o["Customer.Region"] || "") || "Other";
    regionMap[region] = (regionMap[region] || 0) + qty;

    if (CONFIRMED_STATUSES.has(status)) {
      if (recDate && recDate >= yearStart) { confirmedOrdersYear += qty; confirmedChicksYear += chickQty; }
      if (recDate && recDate >= monthStart) { confirmedOrdersMonth += qty; confirmedChicksMonth += chickQty; }
      if (recDate && recDate >= weekStart) { confirmedOrdersWeek += qty; confirmedChicksWeek += chickQty; }
    } else if (PENDING_STATUSES.has(status)) {
      if (recDate && recDate >= monthStart) { pendingOrdersMonth += qty; pendingChicksMonth += chickQty; }
      if (recDate && recDate >= weekStart) { pendingOrdersWeek += qty; pendingChicksWeek += chickQty; }
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
    if (recDate && recDate >= yearStart) cashReceivedYear += amt;
    if (recDate && recDate >= monthStart) cashReceivedMonth += amt;
    if (recDate && recDate >= weekStart) cashReceivedWeek += amt;
  });

  /* ─── 10. OPERATIONAL REQUESTS (info only — not used for expenses) ─ */
  const opRequests = await zohoGetAll("All_Operational_Requests");
  console.group("✅ [10] OPERATIONAL REQUESTS");
  console.log("Total records:", opRequests.length);
  console.log("Statuses:", [...new Set(opRequests.map((r) => fv(r, "Status") || "null"))]);
  console.groupEnd();

  // Operational request counters (approve / pending) — kept for alerts / workflow
  let pendingPaymentsCount = 0, approvedNotPaidCount = 0;
  const expenseByCategoryMonth = {};

  opRequests.forEach((r) => {
    const status = (fv(r, "Status") || "").toLowerCase().trim();
    const finStatus = (fv(r, "Finance_Status") || "").toLowerCase().trim();
    const payStatus = (fv(r, "Payment_Status") || "").toLowerCase().trim();
    const mainCat = displayVal(r.Main_Category || "") || "Other";
    const rawDate = fv(r, "Requested_Date_And_Time") || fv(r, "Request_Date") || fv(r, "Date") || fv(r, "Added_Time");
    const recDate = parseZohoDate(rawDate);
    const amount = num(fv(r, "Actual_Total_Cost") || 0);
    const isApproved = status === "approved" || finStatus === "posted" || finStatus === "approved";
    const isPaid = payStatus === "paid";

    if (!isPaid && isApproved) approvedNotPaidCount++;
    if (status === "pending" || status === "requested" || status === "new") pendingPaymentsCount++;

    // Category breakdown (informational only)
    if (isApproved && recDate && recDate >= monthStart && amount > 0)
      expenseByCategoryMonth[mainCat] = (expenseByCategoryMonth[mainCat] || 0) + amount;
  });

  /* ─── 11. PRODUCTS & STOCK ──────────────────────────────────────── */
  const products = await zohoGetAll("Product_Details_Report");
  console.group("✅ [11] PRODUCTS / STOCK");
  console.log("Total records:", products.length);
  console.groupEnd();

  let totalStockValue = 0;
  const criticalStock = [], productStockList = [];
  let sellingPriceChickSum = 0, sellingPriceChickCount = 0;
  let sellingPriceEggSum = 0, sellingPriceEggCount = 0;
  let feedPricePerKgSum = 0, feedPricePerKgCount = 0;
  let c4uFeedRevenueMonth = 0, c4uFeedQtyMonth = 0;

  products.forEach((prod) => {
    const name = (fv(prod, "Product_Name") || "").trim();
    const docName = displayVal(prod.DOC_Name || "").trim();
    const minStock = num(fv(prod, "Min_Stock"));
    const totalAvail = num(fv(prod, "Total_Available_Stock"));
    const sellingPrice = num(fv(prod, "Selling_Price") || 0);
    const status = (fv(prod, "Status") || "").toLowerCase();
    const unit = displayVal(prod.Unit || "").toLowerCase().trim();
    const categoryName = displayVal(prod.Category_Name || "").toLowerCase().trim();

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
    if (recDate >= yearStart) { feedCostFromSubformYear += lineCost; feedKgFromSubformYear += consumedKg; }
    if (recDate >= monthStart) {
      feedCostFromSubformMonth += lineCost; feedKgFromSubformMonth += consumedKg;
      if (gender === "male") feedCostMaleMonth += lineCost;
      else if (gender === "female") feedCostFemaleMonth += lineCost;
    }
    if (recDate >= weekStart) { feedCostFromSubformWeek += lineCost; feedKgFromSubformWeek += consumedKg; }
  });

  console.log("feedCostFromSubformMonth:", feedCostFromSubformMonth, "| feedKgFromSubformMonth:", feedKgFromSubformMonth);
  console.log("feedCostFromSubformWeek:", feedCostFromSubformWeek, "| Year:", feedCostFromSubformYear);
  console.groupEnd();

  const costPerFeedKgFromSubform = feedKgFromSubformMonth > 0
    ? Math.round(feedCostFromSubformMonth / feedKgFromSubformMonth) : 0;

  // Final costPerFeedKg: subform > catalogue avg
  costPerFeedKg = costPerFeedKgFromSubform > 0 ? costPerFeedKgFromSubform
    : avgFeedPriceFromProducts > 0 ? avgFeedPriceFromProducts : 0;

  /* ─── EXPENDITURE from Detailed Daily Ops (feed consumed × cost/kg) */
  // Use subform cost rows first; fall back to detailedOps Px+Cx × costPerFeedKg
  const totalExpenseWeek = feedCostFromSubformWeek > 0 ? feedCostFromSubformWeek
    : feedKgWeekFromOps * (costPerFeedKg || 0);
  const totalExpenseMonth = feedCostFromSubformMonth > 0 ? feedCostFromSubformMonth
    : feedKgMonthFromOps * (costPerFeedKg || 0);
  const totalExpenseYear = feedCostFromSubformYear > 0 ? feedCostFromSubformYear
    : feedKgYearFromOps * (costPerFeedKg || 0);

  console.log("[WAFAD] Final expenses → Week:", totalExpenseWeek,
    "| Month:", totalExpenseMonth, "| Year:", totalExpenseYear,
    "| costPerFeedKg:", costPerFeedKg);

  // Feed expense aliases
  const feedExpenseWeek = totalExpenseWeek;
  const feedExpenseMonth = totalExpenseMonth;
  const feedExpenseYear = totalExpenseYear;

  const costPerHatchingEgg = eggsSetMonth > 0 && feedExpenseMonth > 0
    ? Math.round(feedExpenseMonth / eggsSetMonth)
    : eggsSetYear > 0 && feedExpenseYear > 0
      ? Math.round(feedExpenseYear / eggsSetYear) : 0;

  const costPerChickWeek = goodChicksWeek > 0 && feedExpenseWeek > 0
    ? Math.round(feedExpenseWeek / goodChicksWeek)
    : goodChicksMonth > 0 && feedExpenseMonth > 0
      ? Math.round(feedExpenseMonth / goodChicksMonth)
      : goodChicksYear > 0 && feedExpenseYear > 0
        ? Math.round(feedExpenseYear / goodChicksYear) : 0;

  const costPerChickLastWk = goodChicksLastWeek > 0 && feedExpenseWeek > 0
    ? Math.round(feedExpenseWeek / goodChicksLastWeek)
    : goodChicksLastMonth > 0 && feedExpenseMonth > 0
      ? Math.round(feedExpenseMonth / goodChicksLastMonth) : 0;

  console.log("[WAFAD] Cost KPIs → costPerHatchingEgg:", costPerHatchingEgg,
    "| costPerChickWeek:", costPerChickWeek);

  const grossMargin = revenueMonth > 0
    ? parseFloat((((revenueMonth - totalExpenseMonth) / revenueMonth) * 100).toFixed(1)) : 0;

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

  // Breed profit margins
  const breedProfitMargins = Object.keys(breedEggData).map((breed) => {
    const feedCost = (breedEggData[breed].feedKgMonth || 0) * (costPerFeedKg || 285);
    const revenue = breedRevenueMonth[breed] || 0;
    const grossProfit = revenue - feedCost;
    const marginPct = revenue > 0 ? parseFloat(((grossProfit / revenue) * 100).toFixed(1)) : 0;
    return { breed, revenue, feedCost, grossProfit, marginPct };
  }).filter((b) => b.revenue > 0 || b.feedCost > 0).sort((a, b) => b.revenue - a.revenue);

  const incomeExpTrend = [
    { period: "This Week", income: cashReceivedWeek, expense: totalExpenseWeek },
    { period: "This Month", income: cashReceivedMonth, expense: totalExpenseMonth },
    { period: "This Year", income: cashReceivedYear, expense: totalExpenseYear },
  ];

  /* ─── 12. EMPLOYEES ─────────────────────────────────────────────── */
  const employees = await zohoGetAll("All_Employees");
  console.group("✅ [12] EMPLOYEES");
  console.log("Total records:", employees.length);
  console.groupEnd();

  let totalStaff = 0, activeStaff = 0;
  const deptMap = {};
  employees.forEach((e) => {
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
  const learnerRecs = await zohoGetAll("All_Learner_Registrations");
  const certifiedLearners = learnerRecs.filter(
    (r) => (r.Status ?? "").toString().toLowerCase().trim() === "certified"
  ).length;

  console.group("✅ [14] CHICKEN4U");
  console.log("Parent orders:", c4uParents.length, "| SF lines:", c4uSF.length);
  console.log("MUO profiles:", muoProfiles.length, "| Certified learners:", certifiedLearners);
  console.groupEnd();

  let muoMale = 0, muoFemale = 0;
  muoProfiles.forEach((r) => {
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

    // Accumulate C4U revenue from paid field visit orders
    if (paidAmt > 0 && c4uOrderDate) {
      if (c4uOrderDate >= yearStart) c4uRevenueYear += paidAmt;
      if (c4uOrderDate >= monthStart) c4uRevenueMonth += paidAmt;
      if (c4uOrderDate >= weekStart) c4uRevenueWeek += paidAmt;

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
        if (rowDate >= weekStart) { c4uSellingPriceWeekSum += linePrice * qty; c4uSellingPriceWeekQty += qty; }
        if (rowDate >= lastWeekStart && rowDate <= lastWeekEnd) { c4uSellingPriceLastWeekSum += linePrice * qty; c4uSellingPriceLastWeekQty += qty; }
        if (rowDate >= yearStart) { c4uSellingYTDSum += linePrice * qty; c4uSellingYTDQty += qty; }
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

  /* ─── 15. ALERTS ─────────────────────────────────────────────────── */
  const alerts = [];
  if (mortalityPctCumulative > 3)
    alerts.push({ type: "critical", icon: "mortality", title: `High Mortality — ${worstFarm}`, detail: `Cumulative mortality at ${mortalityPctCumulative}% — above 3% threshold`, time: "Live" });
  if (hatchabilityWeek < 85 && eggsSetWeek > 0)
    alerts.push({ type: "critical", icon: "hatchery", title: "Hatchability Below Target", detail: `Hatchability at ${hatchabilityWeek}% (target ≥85%)`, time: "Live" });
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

  console.log("=== [WAFAD] Data load v4 complete ===");
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

    kpi: {
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
      eggsThisWeek, eggsThisMonth, eggsThisYear,
      hatchingEggsWeek, hatchingEggsMonth,
      hatchingEggsAvailableWeek: Math.round(hatchingEggsWeek * 0.63),
      hatchingEggsAvailableMonth: Math.round(hatchingEggsMonth * 0.63),
      storageEggsAvailable: totalStorageEggs,
      farmRejectedEggs, crackedEggs, dirtyEggs, floorEggs,
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
      costPerHatchingEgg,
      costPerChickWeek,
      costPerChickLastWeek: costPerChickLastWk,
      sellingPriceHatchingEgg,
      sellingPriceWeek,
      sellingPriceLastWeek,
      hatchForecastWeek: Math.round((hatchabilityWeek * hatchingEggsWeek) / 100),
      hatchForecastMonth: Math.round((hatchabilityMonth * hatchingEggsMonth) / 100),
      criticalIssues: alerts.filter((a) => a.type === "critical").length,
    },

    hatchery: {
      eggsSetWeek, eggsSetMonth, eggsSetYear,
      eggsSetLastWeek, eggsSetLastMonth,
      hatchDueWeek: goodChicksWeek, hatchDueMonth: goodChicksMonth,
      hatchabilityWeek, hatchabilityMonth, hatchabilityYear,
      hatchabilityPrev: parseFloat((hatchabilityMonth * 0.98).toFixed(1)),
      goodChicks: goodChicksWeek, poorChicks: Math.round(poorChicksMonth / 4),
      goodChicksMonth, goodChicksYear, fertilityRate,
      infertilityRate: parseFloat((100 - fertilityRate).toFixed(1)),
      weeklyTrend: hatchWeeklyTrend.length >= 2 ? hatchWeeklyTrend : [{ w: "Batch 1", set: 0, fertile: 0, hatched: 0 }],
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
      revenueWeek, revenueMonth, revenueYear,
      receivablesWeek: Math.round(receivablesWeek),
      receivablesMonth: Math.round(receivablesMonth),
      receivablesTotal: Math.round(receivablesTotal),
      totalExpenseWeek, totalExpenseMonth, totalExpenseYear,
      payablesWeek: Math.round(totalExpenseWeek * 0.3),
      payablesMonth: Math.round(totalExpenseMonth * 0.3),
      grossMargin, margins,
      budgetVsActual: budgetVsActual.length > 0 ? budgetVsActual : [],
      pendingPayments: pendingPaymentsCount,
      approvedNotPaid: approvedNotPaidCount,
      c4uRevenueWeek, c4uRevenueMonth, c4uRevenueYear,
      // Combined = already merged into revenueWeek/Month/Year above
      combinedRevenueWeek: revenueWeek,
      combinedRevenueMonth: revenueMonth,
      combinedRevenueYear: revenueYear,
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
        pendingWeek: { qty: c4uPendingWeekQty, orders: seenWeekOrders.size, list: c4uPendingWeekList.slice(0, 20) },
        pendingMonth: { qty: c4uPendingMonthQty, orders: seenMonthOrders.size, list: c4uPendingMonthList.slice(0, 20) },
      },
    },
  };
}
