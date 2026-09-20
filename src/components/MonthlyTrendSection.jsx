
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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
function buildMonthRows(monthlyOpsData = {}, monthlyHatchData = {}, monthlyFinData = {}, year) {
  return buildMonthsForYear(year).map(({ key, label }) => {
    const o = monthlyOpsData[key] || OPS_TPL;
    const h = monthlyHatchData[key] || HATCH_TPL;
    const f = monthlyFinData[key] || FIN_TPL;
    const hatchabilityPct = h.eggsSet > 0
      ? parseFloat(((h.goodChicks / h.eggsSet) * 100).toFixed(1)) : 0;
    const feedMT = parseFloat((o.feedKg / 1000).toFixed(1));
    return {
      key, label,
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
        <div key={i} style={{
          flex: 1,
          height: `${Math.max(2, (v / max) * height)}px`,
          background: color,
          borderRadius: "2px 2px 0 0",
          opacity: i === values.length - 1 ? 1 : 0.45,
        }} />
      ))}
    </div>
  );
}

/* ── compact metric row card ── */
function MRow({ label, curVal, prevVal, color, format = v => fmtN(v) }) {
  const diff = curVal - prevVal;
  const pct = prevVal > 0 ? ((diff / prevVal) * 100).toFixed(1) : null;
  const up = diff >= 0;
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "8px 12px", borderRadius: 8,
      background: C.surf2, border: `1px solid ${C.border}`,
      marginBottom: 6,
    }}>
      <span style={{ fontSize: 11, color: C.textMd, flex: 1 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color, fontFamily: C.mono, marginRight: 10 }}>
        {format(curVal)}
      </span>
      {pct !== null && (
        <span style={{
          fontSize: 10, fontWeight: 700,
          padding: "2px 7px", borderRadius: 12,
          background: up ? C.green + "18" : C.red + "18",
          color: up ? C.green : C.red,
        }}>
          {up ? "▲" : "▼"} {Math.abs(pct)}%
        </span>
      )}
    </div>
  );
}

export function MonthlyTrendSection({ data, loading, selectedYear }) {
  const actualCurrentYear = new Date().getFullYear();
  const curYear = selectedYear || actualCurrentYear;
  const prevYear = curYear - 1;
  const [metric, setMetric] = useState("eggs");
  const [viewMode, setViewMode] = useState("chart");

  if (!data?.monthlyOpsData && !loading) {
    return (
      <Panel delay={0}>
        <SecHeader Ic={CalendarDays} title="Monthly Trend — Year on Year"
          subtitle="Add monthly aggregation to loadAllData (see Step 1–5 comments)"
          iconColor={MC.blue} />
        <div style={{ padding: "32px", textAlign: "center", color: C.textSf, fontSize: 12 }}>
          <CalendarDays size={32} color={C.textSf} style={{ marginBottom: 10 }} />
          <p>Monthly data not yet wired.</p>
          <p style={{ marginTop: 6 }}>Follow Steps 1–5 in MonthlyTrendSection.jsx to add the aggregation blocks to loadAllData.</p>
        </div>
      </Panel>
    );
  }

  const curRows = buildMonthRows(
    data?.monthlyOpsData, data?.monthlyHatchData, data?.monthlyFinData, curYear
  );
  const prevRows = buildMonthRows(
    data?.monthlyOpsData, data?.monthlyHatchData, data?.monthlyFinData, prevYear
  );

  /* ── Total this year vs last year ── */
  const sumField = (rows, field) => rows.reduce((s, r) => s + (r[field] || 0), 0);

  const METRIC_OPTIONS = [
    { key: "eggs", label: "Eggs Produced", color: MC.cyan, format: v => fmtN(v) },
    { key: "goodChicks", label: "Good Chicks", color: MC.green, format: v => fmtN(v) },
    { key: "hatchability", label: "Hatchability %", color: MC.blue, format: v => `${v}%` },
    { key: "mort", label: "Mortality", color: MC.red, format: v => fmtN(v) },
    { key: "feedMT", label: "Feed (MT)", color: MC.amber, format: v => `${fmtN(v, 1)} MT` },
    { key: "revenue", label: "Revenue (GHC)", color: MC.green, format: v => fmtCur(v) },
    { key: "expense", label: "Expenses (GHC)", color: MC.red, format: v => fmtCur(v) },
    { key: "profit", label: "Net Profit (GHC)", color: MC.purple, format: v => fmtCur(v) },
    { key: "eggsSet", label: "Eggs Set", color: MC.amber, format: v => fmtN(v) },
  ];

  const activeMeta = METRIC_OPTIONS.find(m => m.key === metric) || METRIC_OPTIONS[0];
  const curValues = curRows.map(r => r[metric] || 0);
  const prevValues = prevRows.map(r => r[metric] || 0);
  const curTotal = sumField(curRows, metric);
  const prevTotal = sumField(prevRows, metric);
  const totalDiff = curTotal - prevTotal;
  const totalDiffPct = prevTotal > 0 ? parseFloat(((totalDiff / prevTotal) * 100).toFixed(1)) : null;

  /* ── Build chart bars (cur + prev side by side per month) ── */
  const maxVal = Math.max(...curValues, ...prevValues, 1);

  const summaryCards = [
    { 
      label: curYear === actualCurrentYear ? `${curYear} YTD` : `${curYear} Full Year`, 
      value: activeMeta.format(curTotal), 
      color: activeMeta.color 
    },
    { label: `${prevYear} Full Year`, value: activeMeta.format(prevTotal), color: MC.orange },
    {
      label: "YoY Change",
      value: totalDiffPct !== null
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
        subtitle={`${curYear} vs ${prevYear} · Select metric below${curYear !== actualCurrentYear ? " · Historical View" : ""}`}
        iconColor={MC.blue}
        right={
          <div style={{ display: "flex", gap: 5 }}>
            {["chart", "table"].map(v => (
              <button key={v} className={`tab-btn${viewMode === v ? " active" : ""}`}
                onClick={() => setViewMode(v)}
                style={{
                  padding: "5px 12px", borderRadius: 7, border: `1px solid ${C.border}`,
                  background: "transparent", color: C.textMd, fontSize: 11, fontWeight: 600,
                  cursor: "pointer", fontFamily: "'Sora',sans-serif", textTransform: "capitalize"
                }}>
                {v}
              </button>
            ))}
          </div>
        }
      />

      {/* Metric selector pills */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
        {METRIC_OPTIONS.map(m => (
          <button key={m.key} onClick={() => setMetric(m.key)}
            style={{
              padding: "5px 13px", borderRadius: 20,
              border: `1px solid ${metric === m.key ? m.color + "77" : C.border}`,
              background: metric === m.key ? m.color + "18" : "transparent",
              color: metric === m.key ? m.color : C.textMd,
              fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'Sora',sans-serif",
            }}>
            {m.label}
          </button>
        ))}
      </div>

      {/* Summary KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 10, marginBottom: 20 }}>
        {summaryCards.map(({ label, value, color }) => (
          <div key={label} style={{
            background: C.surf2, border: `1px solid ${C.border}`, borderRadius: 10,
            padding: "12px 14px", borderTop: `3px solid ${color}`
          }}>
            <p style={{
              fontSize: 9, color: C.textSf, fontWeight: 700, textTransform: "uppercase",
              letterSpacing: ".07em", marginBottom: 6
            }}>{label}</p>
            {loading
              ? <div className="skeleton" style={{ height: 22, borderRadius: 4 }} />
              : <p style={{ fontSize: 18, fontWeight: 700, color, fontFamily: C.mono }}>{value}</p>
            }
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginBottom: 12, alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: activeMeta.color }} />
          <span style={{ fontSize: 11, color: C.textMd }}>{curYear}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: MC.orange, opacity: 0.6 }} />
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
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 220, padding: "0 4px" }}>
                {MONTH_NAMES.map((mon, i) => {
                  const cv = curValues[i] || 0;
                  const pv = prevValues[i] || 0;
                  const chPct = (cv / maxVal) * 200;
                  const phPct = (pv / maxVal) * 200;
                  return (
                    <div key={mon} style={{
                      flex: 1, display: "flex", flexDirection: "column",
                      alignItems: "center", gap: 2
                    }}>
                      <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 200, width: "100%" }}>
                        {/* prev year bar */}
                        <div style={{
                          flex: 1, display: "flex", flexDirection: "column",
                          justifyContent: "flex-end", height: "100%"
                        }}>
                          <div style={{
                            height: `${phPct}px`, background: MC.orange,
                            borderRadius: "3px 3px 0 0", opacity: 0.55,
                            minHeight: pv > 0 ? 3 : 0, position: "relative"
                          }}
                            title={`${prevYear} ${mon}: ${activeMeta.format(pv)}`}
                          />
                        </div>
                        {/* cur year bar */}
                        <div style={{
                          flex: 1, display: "flex", flexDirection: "column",
                          justifyContent: "flex-end", height: "100%"
                        }}>
                          <div style={{
                            height: `${chPct}px`, background: activeMeta.color,
                            borderRadius: "3px 3px 0 0",
                            minHeight: cv > 0 ? 3 : 0, position: "relative"
                          }}
                            title={`${curYear} ${mon}: ${activeMeta.format(cv)}`}
                          />
                        </div>
                      </div>
                      <span style={{ fontSize: 9, color: C.textSf, marginTop: 4 }}>{mon}</span>
                    </div>
                  );
                })}
              </div>

              {/* Month-by-month delta row */}
              <div style={{ display: "flex", gap: 6, marginTop: 10, padding: "0 4px" }}>
                {MONTH_NAMES.map((mon, i) => {
                  const cv = curValues[i] || 0;
                  const pv = prevValues[i] || 0;
                  const d = pv > 0 ? ((cv - pv) / pv * 100).toFixed(0) : null;
                  const up = cv >= pv;
                  return (
                    <div key={mon} style={{ flex: 1, textAlign: "center" }}>
                      {d !== null && (
                        <span style={{
                          fontSize: 8, fontWeight: 700,
                          color: up ? MC.green : MC.red
                        }}>
                          {up ? "▲" : "▼"}{Math.abs(d)}%
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
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {["Month",
                  `${curYear} Eggs`, `${prevYear} Eggs`,
                  `${curYear} Chicks`, `${prevYear} Chicks`,
                  `${curYear} Mort`, `${prevYear} Mort`,
                  `${curYear} Hatch%`, `${prevYear} Hatch%`,
                  `${curYear} Feed MT`, `${prevYear} Feed MT`,
                  `${curYear} Revenue`, `${prevYear} Revenue`,
                ].map(h => (
                  <th key={h} style={{
                    padding: "7px 10px", textAlign: "right",
                    color: C.textSf, fontWeight: 700, whiteSpace: "nowrap",
                    fontSize: 9, textTransform: "uppercase", letterSpacing: ".05em"
                  }}>
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
                  <tr key={mon} style={{
                    borderBottom: `1px solid ${C.border}`,
                    background: hasData ? "transparent" : C.surf2 + "55",
                  }}>
                    <td style={{ padding: "7px 10px", color: C.text, fontWeight: 600 }}>{mon}</td>
                    {/* Eggs */}
                    <td style={{
                      padding: "7px 10px", textAlign: "right",
                      color: MC.cyan, fontFamily: C.mono
                    }}>{fmtN(c.eggs)}</td>
                    <td style={{
                      padding: "7px 10px", textAlign: "right",
                      color: MC.orange, fontFamily: C.mono, opacity: 0.7
                    }}>{fmtN(p.eggs)}</td>
                    {/* Chicks */}
                    <td style={{
                      padding: "7px 10px", textAlign: "right",
                      color: MC.green, fontFamily: C.mono
                    }}>{fmtN(c.goodChicks)}</td>
                    <td style={{
                      padding: "7px 10px", textAlign: "right",
                      color: MC.orange, fontFamily: C.mono, opacity: 0.7
                    }}>{fmtN(p.goodChicks)}</td>
                    {/* Mortality */}
                    <td style={{
                      padding: "7px 10px", textAlign: "right",
                      color: MC.red, fontFamily: C.mono
                    }}>{fmtN(c.mort)}</td>
                    <td style={{
                      padding: "7px 10px", textAlign: "right",
                      color: MC.orange, fontFamily: C.mono, opacity: 0.7
                    }}>{fmtN(p.mort)}</td>
                    {/* Hatchability */}
                    <td style={{
                      padding: "7px 10px", textAlign: "right",
                      color: c.hatchability >= 85 ? MC.green : MC.amber,
                      fontFamily: C.mono
                    }}>{c.hatchability}%</td>
                    <td style={{
                      padding: "7px 10px", textAlign: "right",
                      color: MC.orange, fontFamily: C.mono, opacity: 0.7
                    }}>{p.hatchability}%</td>
                    {/* Feed */}
                    <td style={{
                      padding: "7px 10px", textAlign: "right",
                      color: MC.amber, fontFamily: C.mono
                    }}>{fmtN(c.feedMT, 1)}</td>
                    <td style={{
                      padding: "7px 10px", textAlign: "right",
                      color: MC.orange, fontFamily: C.mono, opacity: 0.7
                    }}>{fmtN(p.feedMT, 1)}</td>
                    {/* Revenue */}
                    <td style={{
                      padding: "7px 10px", textAlign: "right",
                      color: MC.green, fontFamily: C.mono, whiteSpace: "nowrap"
                    }}>{fmtCur(c.revenue)}</td>
                    <td style={{
                      padding: "7px 10px", textAlign: "right",
                      color: MC.orange, fontFamily: C.mono, opacity: 0.7, whiteSpace: "nowrap"
                    }}>{fmtCur(p.revenue)}</td>
                  </tr>
                );
              })}
              {/* Totals row */}
              <tr style={{ borderTop: `2px solid ${C.borderMd}`, background: C.surf2 }}>
                <td style={{ padding: "8px 10px", color: C.text, fontWeight: 700 }}>Total / Avg</td>
                {[
                  [sumField(curRows, "eggs"), sumField(prevRows, "eggs"), MC.cyan, v => fmtN(v)],
                  [sumField(curRows, "goodChicks"), sumField(prevRows, "goodChicks"), MC.green, v => fmtN(v)],
                  [sumField(curRows, "mort"), sumField(prevRows, "mort"), MC.red, v => fmtN(v)],
                  [
                    parseFloat((curRows.filter(r => r.hatchability > 0).reduce((s, r) => s + r.hatchability, 0) / Math.max(1, curRows.filter(r => r.hatchability > 0).length)).toFixed(1)),
                    parseFloat((prevRows.filter(r => r.hatchability > 0).reduce((s, r) => s + r.hatchability, 0) / Math.max(1, prevRows.filter(r => r.hatchability > 0).length)).toFixed(1)),
                    MC.blue, v => `${v}%`
                  ],
                  [sumField(curRows, "feedMT"), sumField(prevRows, "feedMT"), MC.amber, v => `${fmtN(v, 1)} MT`],
                  [sumField(curRows, "revenue"), sumField(prevRows, "revenue"), MC.green, v => fmtCur(v)],
                ].map(([cv, pv, col, fmt], idx) => (
                  <React.Fragment key={idx}>
                    <td style={{
                      padding: "8px 10px", textAlign: "right",
                      color: col, fontFamily: C.mono, fontWeight: 700
                    }}>{fmt(cv)}</td>
                    <td style={{
                      padding: "8px 10px", textAlign: "right",
                      color: MC.orange, fontFamily: C.mono, opacity: 0.7
                    }}>{fmt(pv)}</td>
                  </React.Fragment>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Bottom YoY comparison sparklines */}
      {!loading && (
        <div style={{
          marginTop: 22, display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 12
        }}>
          {METRIC_OPTIONS.filter(m => !["hatchability"].includes(m.key)).map(m => {
            const cv = curRows.map(r => r[m.key] || 0);
            const pv = prevRows.map(r => r[m.key] || 0);
            const ct = cv.reduce((s, v) => s + v, 0);
            const pt = pv.reduce((s, v) => s + v, 0);
            const diffPct = pt > 0 ? parseFloat(((ct - pt) / pt * 100).toFixed(1)) : null;
            return (
              <div key={m.key} style={{
                background: C.surf2, border: `1px solid ${C.border}`,
                borderRadius: 10, padding: "10px 12px", borderTop: `2px solid ${m.color}`
              }}>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "flex-start", marginBottom: 6
                }}>
                  <p style={{
                    fontSize: 9.5, color: C.textSf, fontWeight: 700,
                    textTransform: "uppercase", letterSpacing: ".06em"
                  }}>{m.label}</p>
                  {diffPct !== null && (
                    <span style={{
                      fontSize: 10, fontWeight: 700,
                      color: diffPct >= 0 ? MC.green : MC.red
                    }}>
                      {diffPct >= 0 ? "▲" : "▼"}{Math.abs(diffPct)}%
                    </span>
                  )}
                </div>
                <SparkBar values={cv} color={m.color} height={28} />
                <SparkBar values={pv} color={MC.orange} height={16} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  <span style={{ fontSize: 10, color: m.color, fontFamily: C.mono, fontWeight: 700 }}>
                    {m.format(ct)}
                  </span>
                  <span style={{ fontSize: 9, color: MC.orange, fontFamily: C.mono, opacity: 0.7 }}>
                    {m.format(pt)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Panel>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STEP 6 — Add to NAV array in your dashboard:
 
   { id: "monthly", Ic: CalendarDays, label: "Monthly Trend" },
 
   STEP 7 — Add render in <main>:
 
   <div id="sec-monthly">
     <MonthlyTrendSection data={data} loading={loading} />
   </div>
═══════════════════════════════════════════════════════════════ */

