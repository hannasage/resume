'use client';

/* ============================================================
   RESTRUCTURING AMERICAN SOCCER — A Sage Advice LLC BA Brief · v0.2
   ------------------------------------------------------------
   DROP-IN NOTES for hannasage/resume (Next 15 App Router):
   1. Save as app/brief/page.tsx — 'use client' is already set;
      only dependency is recharts (^3.8 installed). React 19 OK.
   2. Fonts: consumes var(--font-syne) / var(--font-plex-mono),
      which app/layout.tsx already loads via next/font. The
      @import in GlobalStyles is a standalone fallback — delete it.
   3. Theme: THEMES below match the Theme shape in
      app/lib/projection-themes.ts exactly (colors + planColors).
      To wire into the site's 12-theme system, replace the local
      useState with your ThemeContext's active theme, pass it to
      toRuntime(), and delete ThemeSwitcher (ThemeSelector is
      already global). Radius is 'sharp' to match the resume.
   4. Suggested data/side-projects.json entry at bottom of file.
   ============================================================ */

import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LabelList,
} from "recharts";
import { useTheme } from "../context/ThemeContext";
import { THEMES } from "../lib/projection-themes";

/* Themes come from the site's shared 12-theme system (app/lib/projection-themes.ts).
   The App component reads/writes the active theme through ThemeContext, so a change
   made here (via ThemeMenu) persists across the whole site. */

/* Adapter: Theme (site shape) → runtime tokens used by this page */
function toRuntime(theme) {
  const c = theme.colors;
  return {
    ...c,
    isDark: theme.isDark,
    primary: c.accent, primaryFg: c.textOnAccent, danger: c.red, warn: c.orange,
    surfaceAlt: c.faint, grid: c.border,
    chart: theme.planColors.map((p) => p.value),
    font: "var(--font-plex-mono, 'IBM Plex Mono'), ui-monospace, SFMono-Regular, Menlo, monospace",
    display: "var(--font-syne, 'Syne'), 'IBM Plex Mono', sans-serif",
    radius: { sm: "2px", md: "4px", lg: "6px", full: "4px" }, // 'sharp' preset
  };
}

function GlobalStyles({ t }) {
  return (
    <style>{`
      /* Fonts (--font-syne / --font-plex-mono) are loaded globally by app/layout.tsx. */
      * { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
      body { background: ${t.bg}; }
      ::selection { background: ${t.primary}; color: ${t.primaryFg}; }
      ::-webkit-scrollbar { width: 8px; height: 8px; }
      ::-webkit-scrollbar-track { background: ${t.bg}; }
      ::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 4px; }
      ::-webkit-scrollbar-thumb:hover { background: ${t.primary}; }
      a:focus-visible, button:focus-visible { outline: 2px solid ${t.primary}; outline-offset: 2px; }
      @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } * { transition: none !important; animation: none !important; } }
      .chips::-webkit-scrollbar { display: none; }
      .chips { scrollbar-width: none; }
      .prose-link { color: ${t.primary}; text-decoration: none; border-bottom: 1px solid ${t.border}; overflow-wrap: anywhere; }
      .prose-link:hover { border-bottom-color: ${t.primary}; }
      /* mobile-first grids: single column base, widen on min-width */
      .statgrid { display: grid; grid-template-columns: 1fr; gap: 10px; }
      @media (min-width: 700px) { .statgrid { grid-template-columns: repeat(3, 1fr); } }
      .grid2 { display: grid; grid-template-columns: 1fr; gap: 12px; }
      @media (min-width: 820px) { .grid2 { grid-template-columns: 1fr 1fr; } }
      .grid3 { display: grid; grid-template-columns: 1fr; gap: 12px; }
      @media (min-width: 820px) { .grid3 { grid-template-columns: repeat(3, 1fr); } }
      .gantt-desktop { display: none; }
      @media (min-width: 820px) { .gantt-mobile { display: none; } .gantt-desktop { display: block; } }
      .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 18px; }
      @media (min-width: 700px) { .meta-grid { grid-template-columns: repeat(5, auto); gap: 12px 34px; } }
    `}</style>
  );
}

/* ============================================================
   PRIMITIVES — Sage Advice BA document language
   Mono 300 body @13px · Syne display · sharp radii · letterspaced labels
   ============================================================ */
const Card = ({ t, children, style, pad = 16 }) => (
  <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.radius.lg, padding: pad, ...style }}>{children}</div>
);

const Eyebrow = ({ t, children }) => (
  <div style={{ fontFamily: t.font, color: t.primary, fontSize: 10, letterSpacing: "3.5px", textTransform: "uppercase", fontWeight: 500, marginBottom: 10 }}>{children}</div>
);

const SectionTitle = ({ t, children }) => (
  <h2 style={{ fontFamily: t.display, color: t.text, fontSize: "clamp(21px, 5.5vw, 30px)", lineHeight: 1.12, fontWeight: 800, letterSpacing: "-0.01em", marginBottom: 14 }}>{children}</h2>
);

const H3 = ({ t, children }) => (
  <h3 style={{ fontFamily: t.font, color: t.text, fontSize: 14.5, fontWeight: 600, margin: "28px 0 10px", lineHeight: 1.35 }}>
    <span style={{ color: t.primary, marginRight: 8 }}>//</span>{children}
  </h3>
);

const P = ({ t, children, style }) => (
  <p style={{ fontFamily: t.font, color: t.text, fontSize: 13, lineHeight: 1.78, marginBottom: 13, fontWeight: 300, ...style }}>{children}</p>
);

const Lead = ({ t, children }) => (
  <p style={{ fontFamily: t.font, color: t.text, fontSize: 14.5, lineHeight: 1.72, marginBottom: 15, fontWeight: 300 }}>{children}</p>
);

const Note = ({ t, children }) => (
  <p style={{ fontFamily: t.font, color: t.muted, fontSize: 11, lineHeight: 1.65, marginTop: 8, fontWeight: 300 }}>{children}</p>
);

const Strong = ({ t, children }) => <strong style={{ color: t.text, fontWeight: 600 }}>{children}</strong>;

const Cite = ({ t, n, onJump }) => {
  const list = Array.isArray(n) ? n : [n];
  return (
    <sup style={{ fontFamily: t.font, fontSize: 9.5, marginLeft: 1 }}>
      {list.map((x, i) => (
        <React.Fragment key={x}>
          {i > 0 && ","}
          <a href={"#bib-" + x} onClick={(e) => { if (onJump) { e.preventDefault(); onJump(x); } }}
            style={{ color: t.primary, textDecoration: "none", cursor: "pointer" }}>[{x}]</a>
        </React.Fragment>
      ))}
    </sup>
  );
};

/* Cite reads onJump from context so we don't thread a prop through every section */
const JumpCtx = React.createContext(null);
const CiteC = (props) => {
  const onJump = React.useContext(JumpCtx);
  return <Cite {...props} onJump={onJump} />;
};

const Badge = ({ t, children, tone = "primary" }) => {
  const map = { primary: [t.primary, t.primaryFg], danger: [t.danger, t.isDark ? "#160404" : "#fff"], muted: [t.border, t.text], warn: [t.warn, t.isDark ? "#160b02" : "#fff"] };
  const [bgc, fgc] = map[tone] || map.primary;
  return (
    <span style={{ fontFamily: t.font, background: bgc, color: fgc, fontSize: 9.5, fontWeight: 600, letterSpacing: "1.5px", padding: "3px 8px", borderRadius: t.radius.sm, textTransform: "uppercase", whiteSpace: "nowrap" }}>{children}</span>
  );
};

const StatCard = ({ t, value, label, sub }) => (
  <Card t={t} pad={14}>
    <div style={{ fontFamily: t.display, color: t.primary, fontSize: "clamp(26px, 7vw, 32px)", fontWeight: 800, lineHeight: 1 }}>{value}</div>
    <div style={{ fontFamily: t.font, color: t.text, fontSize: 11, fontWeight: 600, marginTop: 8, textTransform: "uppercase", letterSpacing: "1.5px" }}>{label}</div>
    {sub && <div style={{ fontFamily: t.font, color: t.muted, fontSize: 11, marginTop: 6, lineHeight: 1.6, fontWeight: 300 }}>{sub}</div>}
  </Card>
);

const PullQuote = ({ t, children, attr }) => (
  <div style={{ borderLeft: `2px solid ${t.primary}`, padding: "10px 14px", margin: "18px 0", background: t.surfaceAlt, borderRadius: `0 ${t.radius.md} ${t.radius.md} 0` }}>
    <div style={{ fontFamily: t.font, color: t.text, fontSize: 13, lineHeight: 1.7, fontWeight: 400 }}>{children}</div>
    {attr && <div style={{ fontFamily: t.font, color: t.muted, fontSize: 10, letterSpacing: "1.5px", textTransform: "uppercase", marginTop: 8 }}>{attr}</div>}
  </div>
);

const ChartCard = ({ t, title, caption, children, height = 260 }) => (
  <Card t={t} style={{ margin: "16px 0" }}>
    <div style={{ fontFamily: t.font, color: t.text, fontSize: 11, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 3 }}>{title}</div>
    {caption && <div style={{ fontFamily: t.font, color: t.muted, fontSize: 11, marginBottom: 10, lineHeight: 1.6, fontWeight: 300 }}>{caption}</div>}
    <div style={{ width: "100%", height }}>{children}</div>
  </Card>
);

const tooltipStyle = (t) => ({
  contentStyle: { background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.radius.md, fontFamily: t.font, fontSize: 11.5, color: t.text },
  labelStyle: { color: t.text, fontWeight: 600, fontFamily: t.font, fontSize: 11.5 },
  itemStyle: { color: t.text, fontFamily: t.font, fontSize: 11.5 },
  cursor: { fill: t.faint },
});
const axisProps = (t) => ({ stroke: t.muted, tick: { fill: t.muted, fontFamily: t.font, fontSize: 10 }, tickLine: false, axisLine: { stroke: t.border } });

/* ============================================================
   CHARTS — mobile-first: horizontal layouts, compact heights
   ============================================================ */
const FEE_DATA = [
  { club: "Chicago '98", fee: 5 }, { club: "Toronto '07", fee: 10 },
  { club: "Seattle '09", fee: 30 }, { club: "NYCFC '13", fee: 100 },
  { club: "Cincy/Nash '18", fee: 150 }, { club: "St. Louis '19", fee: 200 },
  { club: "Charlotte '19", fee: 325 }, { club: "San Diego '23", fee: 500 },
];
const NWSL_FEE_DATA = [
  { club: "Bay FC '23", fee: 53 }, { club: "Boston '23", fee: 53 }, { club: "Denver '25", fee: 110 },
];

function FeeChart({ t }) {
  return (
    <ChartCard t={t} title="The parked-money curve — MLS expansion fees, 1998–2023 ($M)" height={300}
      caption="Entry to Division I is purchased, and the price of scarcity compounds: a 100x escalation in 25 years. Sources: [5][6][10]">
      <ResponsiveContainer>
        <BarChart data={FEE_DATA} layout="vertical" margin={{ top: 0, right: 48, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={t.grid} strokeOpacity={0.5} horizontal={false} />
          <XAxis type="number" {...axisProps(t)} tickFormatter={(v) => "$" + v + "M"} />
          <YAxis type="category" dataKey="club" {...axisProps(t)} width={104} interval={0} />
          <Tooltip {...tooltipStyle(t)} formatter={(v) => ["$" + v + "M", "Expansion fee"]} />
          <Bar dataKey="fee" fill={t.chart[0]} radius={[0, 2, 2, 0]}>
            <LabelList dataKey="fee" position="right" formatter={(v) => "$" + v + "M"} style={{ fill: t.text, fontFamily: t.font, fontSize: 10 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

function NwslFeeChart({ t }) {
  return (
    <ChartCard t={t} title="NWSL expansion fees ($M) — the same curve, faster" height={160}
      caption="Denver's $110M (Jan 2025) is the largest fee in US women's sports history — more than double Boston's fee agreed 16 months earlier. Sources: [13][21]">
      <ResponsiveContainer>
        <BarChart data={NWSL_FEE_DATA} layout="vertical" margin={{ top: 0, right: 48, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={t.grid} strokeOpacity={0.5} horizontal={false} />
          <XAxis type="number" {...axisProps(t)} />
          <YAxis type="category" dataKey="club" {...axisProps(t)} width={92} interval={0} />
          <Tooltip {...tooltipStyle(t)} formatter={(v) => ["$" + v + "M", "Fee"]} />
          <Bar dataKey="fee" fill={t.chart[1]} radius={[0, 2, 2, 0]}>
            <LabelList dataKey="fee" position="right" formatter={(v) => "$" + v + "M"} style={{ fill: t.text, fontFamily: t.font, fontSize: 10 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

const YOUTH_DATA = [
  { tier: "Recreational", base: 125, range: 275, label: "$125–400/yr" },
  { tier: "Competitive club", base: 3500, range: 4500, label: "$3.5–8K/yr all-in" },
  { tier: "Elite (ECNL / MLS NEXT / GA)", base: 8000, range: 7000, label: "$8–15K/yr (reports to ~$25K)" },
];
function YouthCostChart({ t }) {
  return (
    <ChartCard t={t} title="The cost cliff — annual family cost by tier (USD)" height={210}
      caption="Floating bars show reported ranges, all-in (dues + travel + gear + tournaments). The cliff appears at ages 10–12, exactly when serious development begins. Sources: [29][30][32][36]">
      <ResponsiveContainer>
        <BarChart data={YOUTH_DATA} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={t.grid} strokeOpacity={0.5} horizontal={false} />
          <XAxis type="number" {...axisProps(t)} tickFormatter={(v) => "$" + (v / 1000) + "K"} />
          <YAxis type="category" dataKey="tier" {...axisProps(t)} width={112} interval={0} tick={{ fill: t.muted, fontFamily: t.font, fontSize: 9.5 }} />
          <Tooltip cursor={{ fill: t.faint }} content={({ active, payload }) => {
            if (!active || !payload || !payload.length) return null;
            const d = payload[0].payload;
            return <div style={{ background: t.surface, border: "1px solid " + t.border, borderRadius: t.radius.md, padding: "8px 10px", fontFamily: t.font, fontSize: 11.5, color: t.text }}>{d.tier}: <b>{d.label}</b></div>;
          }} />
          <Bar dataKey="base" stackId="a" fill="transparent" />
          <Bar dataKey="range" stackId="a" fill={t.chart[0]} radius={[0, 2, 2, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

const SPLIT_PRE = [
  { name: "First Division", value: 50 }, { name: "Second Division", value: 25 },
  { name: "Third Division", value: 12.5 }, { name: "Fourth Division", value: 12.5 },
];
const SPLIT_POST = [
  { name: "Premier League (22 clubs)", value: 96 }, { name: "Rest of pyramid", value: 4 },
];
function SplitDonuts({ t }) {
  const render = (data, title) => (
    <div style={{ flex: "1 1 240px", minWidth: 0 }}>
      <div style={{ fontFamily: t.font, fontSize: 10, letterSpacing: "1.5px", color: t.muted, textAlign: "center", marginBottom: 4 }}>{title}</div>
      <div style={{ width: "100%", height: 180 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="85%" paddingAngle={2} stroke={t.surface}>
              {data.map((_, i) => <Cell key={i} fill={t.chart[i % t.chart.length]} />)}
            </Pie>
            <Tooltip {...tooltipStyle(t)} formatter={(v, n) => [v + "%", n]} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
  return (
    <Card t={t} style={{ margin: "16px 0" }}>
      <div style={{ fontFamily: t.font, color: t.text, fontSize: 11, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 3 }}>Who gets the TV money — England, before &amp; after 1992</div>
      <div style={{ fontFamily: t.font, color: t.muted, fontSize: 11, marginBottom: 8, lineHeight: 1.6, fontWeight: 300 }}>Pre-1992: pooled across all four divisions (50 / 25 / 12.5 / 12.5). Post-breakaway: the top flight retained effectively all of its own new deal, with only minor early solidarity flowing down (illustrative split shown). Sources: [43][40][41]</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {render(SPLIT_PRE, "FOOTBALL LEAGUE, PRE-1992")}
        {render(SPLIT_POST, "POST-BREAKAWAY, 1992 →")}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 6, justifyContent: "center" }}>
        {SPLIT_PRE.map((d, i) => (
          <span key={d.name} style={{ fontFamily: t.font, fontSize: 10, color: t.muted }}>
            <span style={{ display: "inline-block", width: 8, height: 8, background: t.chart[i], borderRadius: 2, marginRight: 5 }} />{d.name}
          </span>
        ))}
      </div>
    </Card>
  );
}

const PARACHUTE_DATA = [
  { name: "Parachute, yr 1", val: 44 },
  { name: "Solidarity (Champ.)", val: 5.3 },
  { name: "Solidarity (Lg One)", val: 0.9 },
  { name: "Solidarity (Lg Two)", val: 0.6 },
];
function ParachuteChart({ t }) {
  return (
    <ChartCard t={t} title="England's distortion — parachute vs. solidarity (£M / club / yr, approx.)" height={200}
      caption="Recently-relegated clubs receive ~8x what their division rivals get — academic work finds they're roughly twice as likely to be promoted, a 'revolving door' at the top of the Championship. Sources: [43][44][45]">
      <ResponsiveContainer>
        <BarChart data={PARACHUTE_DATA} layout="vertical" margin={{ top: 0, right: 46, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={t.grid} strokeOpacity={0.5} horizontal={false} />
          <XAxis type="number" {...axisProps(t)} />
          <YAxis type="category" dataKey="name" {...axisProps(t)} width={124} interval={0} />
          <Tooltip {...tooltipStyle(t)} formatter={(v) => ["£" + v + "M", "Per club"]} />
          <Bar dataKey="val" radius={[0, 2, 2, 0]}>
            {PARACHUTE_DATA.map((_, i) => <Cell key={i} fill={i === 0 ? t.chart[4] : t.chart[0]} />)}
            <LabelList dataKey="val" position="right" formatter={(v) => "£" + v + "M"} style={{ fill: t.text, fontFamily: t.font, fontSize: 10 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

const UCL_DATA = [{
  name: "€4.4B", UCL: 2467, UEL: 565, UECL: 285, Solidarity: 308, Qualifying: 132, Costs: 387, WomensYouth: 25,
}];
const UCL_KEYS = [
  ["UCL", "Champions League + Super Cup"], ["UEL", "Europa League"], ["UECL", "Conference League"],
  ["Solidarity", "Solidarity (non-participants)"], ["Qualifying", "Qualifying-round clubs"],
  ["Costs", "Organisational costs"], ["WomensYouth", "Women's CL + Youth League"],
];
function UclChart({ t }) {
  return (
    <Card t={t} style={{ margin: "16px 0" }}>
      <div style={{ fontFamily: t.font, color: t.text, fontSize: 11, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 3 }}>Where UEFA's €4.4B went — men's club competition revenue, 2024/25</div>
      <div style={{ fontFamily: t.font, color: t.muted, fontSize: 11, marginBottom: 10, lineHeight: 1.6, fontWeight: 300 }}>10% of gross revenue is committed to solidarity; €308M reached clubs not even in the league phases — the redistribution layer the closed US model lacks entirely. Sources: [49][51][52]</div>
      <div style={{ width: "100%", height: 88 }}>
        <ResponsiveContainer>
          <BarChart data={UCL_DATA} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
            <XAxis type="number" hide domain={[0, 4169]} />
            <YAxis type="category" dataKey="name" {...axisProps(t)} width={52} />
            <Tooltip {...tooltipStyle(t)} formatter={(v, n) => ["€" + v + "M", (UCL_KEYS.find((k) => k[0] === n) || [n, n])[1]]} />
            {UCL_KEYS.map(([k], i) => (
              <Bar key={k} dataKey={k} stackId="a" fill={t.chart[i % t.chart.length]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 10px", marginTop: 10 }}>
        {UCL_KEYS.map(([k, label], i) => (
          <span key={k} style={{ fontFamily: t.font, fontSize: 10, color: t.muted, display: "inline-flex", alignItems: "center" }}>
            <span style={{ display: "inline-block", width: 8, height: 8, background: t.chart[i % t.chart.length], borderRadius: 2, marginRight: 5, flexShrink: 0 }} />{label}
          </span>
        ))}
      </div>
    </Card>
  );
}

function ScaleChart({ t }) {
  const area = [
    { name: "England", val: 130300 }, { name: "New York State", val: 141300 },
  ];
  const big = [
    { name: "Contiguous US", area: 8.08, pop: 340 }, { name: "Europe", area: 10.18, pop: 745 },
  ];
  return (
    <div className="grid2">
      <ChartCard t={t} title="England fits inside New York State (km²)" height={140}
        caption="England: 92 fully professional clubs + ~1,600 pyramid clubs. New York State: ~2 MLS clubs.">
        <ResponsiveContainer>
          <BarChart data={area} layout="vertical" margin={{ top: 0, right: 64, left: 0, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" {...axisProps(t)} width={112} interval={0} />
            <Tooltip {...tooltipStyle(t)} formatter={(v) => [v.toLocaleString() + " km²", "Area"]} />
            <Bar dataKey="val" fill={t.chart[0]} radius={[0, 2, 2, 0]}>
              <LabelList dataKey="val" position="right" formatter={(v) => (v / 1000).toFixed(0) + "K km²"} style={{ fill: t.text, fontFamily: t.font, fontSize: 10 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard t={t} title="The US is a continent — area (M km²) &amp; population (M)" height={170}
        caption="Similar landmass; Europe carries 2.2x the population — so the honest per-capita pitch is 'state = country,' argued on population.">
        <ResponsiveContainer>
          <BarChart data={big} margin={{ top: 14, right: 0, left: -22, bottom: 0 }}>
            <CartesianGrid stroke={t.grid} strokeOpacity={0.5} vertical={false} />
            <XAxis dataKey="name" {...axisProps(t)} />
            <YAxis {...axisProps(t)} />
            <Tooltip {...tooltipStyle(t)} formatter={(v, n) => (n === "area" ? [v + "M km²", "Area"] : [v + "M", "Population"])} />
            <Legend wrapperStyle={{ fontFamily: t.font, fontSize: 10, color: t.muted }} formatter={(v) => (v === "area" ? "Area (M km²)" : "Population (M)")} />
            <Bar dataKey="area" fill={t.chart[0]} radius={[2, 2, 0, 0]} />
            <Bar dataKey="pop" fill={t.chart[1]} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

const PRIZE_DATA = [
  { role: "Champion", pre: 300, now: 600 },
  { role: "Runner-up", pre: 100, now: 250 },
  { role: "Best / div", pre: 25, now: 50 },
];
function PrizeChart({ t }) {
  return (
    <ChartCard t={t} title="Open Cup prize money — doubled for 2026 ($K)" height={210}
      caption="Directionally right; still roughly two orders of magnitude below FA Cup distributions. The 2026 edition also adds the John Motta Trophy for the deepest-advancing Open Division side. Sources: [61][62]">
      <ResponsiveContainer>
        <BarChart data={PRIZE_DATA} margin={{ top: 14, right: 0, left: -22, bottom: 0 }}>
          <CartesianGrid stroke={t.grid} strokeOpacity={0.5} vertical={false} />
          <XAxis dataKey="role" {...axisProps(t)} />
          <YAxis {...axisProps(t)} tickFormatter={(v) => "$" + v + "K"} />
          <Tooltip {...tooltipStyle(t)} formatter={(v, n) => ["$" + v + "K", n === "pre" ? "Through 2025" : "2026 →"]} />
          <Legend wrapperStyle={{ fontFamily: t.font, fontSize: 10 }} formatter={(v) => (v === "pre" ? "Through 2025" : "2026 →")} />
          <Bar dataKey="pre" fill={t.chart[9]} radius={[2, 2, 0, 0]} />
          <Bar dataKey="now" fill={t.chart[0]} radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

function EquityChart({ t }) {
  const data = [
    { name: "Paid-in fees", val: 4 },
    { name: "Paper equity", val: 19.5 },
  ];
  return (
    <ChartCard t={t} title="Why you convert, not refund — MLS franchise value ($B, est.)" height={140}
      caption="~$3.5–4B was ever paid in; ~$18–21B of valuation now sits on top of it. No refund is possible — owners must be converted into shareholders of the thing that actually generates the value. Sources: [7] + §07">
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 52, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={t.grid} strokeOpacity={0.5} horizontal={false} />
          <XAxis type="number" {...axisProps(t)} tickFormatter={(v) => "$" + v + "B"} />
          <YAxis type="category" dataKey="name" {...axisProps(t)} width={106} interval={0} />
          <Tooltip {...tooltipStyle(t)} formatter={(v) => ["$" + v + "B", "Estimate"]} />
          <Bar dataKey="val" radius={[0, 2, 2, 0]}>
            <Cell fill={t.chart[9]} /><Cell fill={t.chart[0]} />
            <LabelList dataKey="val" position="right" formatter={(v) => "$" + v + "B"} style={{ fill: t.text, fontFamily: t.font, fontSize: 10 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/* ============================================================
   DIAGRAMS (custom SVG / flex builds)
   ============================================================ */
function MoneyLoop({ t }) {
  const box = (label, sub) => (
    <div style={{ background: t.surfaceAlt, border: "1px solid " + t.border, borderRadius: t.radius.md, padding: "10px 12px", textAlign: "center", flex: 1, minWidth: 118 }}>
      <div style={{ fontFamily: t.font, color: t.text, fontSize: 12, fontWeight: 700 }}>{label}</div>
      {sub && <div style={{ fontFamily: t.font, color: t.muted, fontSize: 11, marginTop: 3 }}>{sub}</div>}
    </div>
  );
  const arrow = (label, color) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minWidth: 84 }}>
      <div style={{ fontFamily: t.font, fontSize: 10, color: color, marginBottom: 2, textAlign: "center" }}>{label}</div>
      <div style={{ color: color, fontFamily: t.font, fontSize: 16 }}>⟶</div>
    </div>
  );
  return (
    <Card t={t} style={{ margin: "18px 0" }}>
      <div style={{ fontFamily: t.font, color: t.text, fontSize: 13, fontWeight: 700, marginBottom: 10 }}>THE MONEY LOOP — funded development vs. pay-to-play</div>
      <div style={{ fontFamily: t.font, fontSize: 11, color: t.primary, letterSpacing: ".1em", marginBottom: 8 }}>FIFA / EUROPE — A CLOSED LOOP</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "stretch", marginBottom: 6 }}>
        {box("Youth academy", "free to play")}
        {arrow("develops player", t.primary)}
        {box("Pro club", "signs / sells player")}
        {arrow("training comp. + 5% solidarity", t.primary)}
        {box("Back to academy", "funds next generation ↺")}
      </div>
      <div style={{ borderTop: "1px dashed " + t.border, margin: "14px 0" }} />
      <div style={{ fontFamily: t.font, fontSize: 11, color: t.danger, letterSpacing: ".1em", marginBottom: 8 }}>UNITED STATES (DOMESTIC) — A BROKEN LINE</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "stretch" }}>
        {box("Parents", "$8–15K+/yr")}
        {arrow("fees fund club", t.danger)}
        {box("Youth club", "develops player")}
        {arrow("player signs pro", t.danger)}
        {box("Pro club", "typically owes youth club $0 domestically")}
      </div>
      <Note t={t}>USSF declared "neutrality" in 2015; MLS complies with FIFA's international mechanisms only since 2019; FIFA's RSTP does not apply to domestic transfers. Note too that RSTP training compensation (Art. 20) does not apply to women's football at all — so any money-loop fix for the women's pyramid needs a purpose-built mechanism, not a copy of the men's rules. Development produces no revenue — therefore parents are the revenue. Sources: [35][36][37]</Note>
    </Card>
  );
}

function TimelineStrip({ t, title, items, caption }) {
  return (
    <Card t={t} style={{ margin: "18px 0" }}>
      <div style={{ fontFamily: t.font, color: t.text, fontSize: 13, fontWeight: 700, marginBottom: 12 }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: "flex", gap: 14 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 14 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: it.tone === "danger" ? t.danger : it.tone === "warn" ? t.warn : t.primary, marginTop: 4, flexShrink: 0 }} />
              {i < items.length - 1 && <div style={{ width: 2, flex: 1, background: t.border, minHeight: 18 }} />}
            </div>
            <div style={{ minWidth: 0, paddingBottom: i < items.length - 1 ? 16 : 0 }}>
              <div style={{ fontFamily: t.font, color: t.primary, fontSize: 11.5, fontWeight: 700, letterSpacing: ".04em" }}>{it.when}</div>
              <div style={{ fontFamily: t.font, color: t.text, fontSize: 13.5, lineHeight: 1.55, marginTop: 2 }}>{it.what}</div>
            </div>
          </div>
        ))}
      </div>
      {caption && <Note t={t}>{caption}</Note>}
    </Card>
  );
}

function BrazilPyramid({ t }) {
  const tier = (label, sub, width, hl) => (
    <div style={{ width, maxWidth: "100%", background: hl ? t.primary : t.surfaceAlt, color: hl ? t.primaryFg : t.text, border: "1px solid " + (hl ? t.primary : t.border), borderRadius: t.radius.sm, padding: "7px 10px", textAlign: "center", margin: "0 auto" }}>
      <span style={{ fontFamily: t.font, fontSize: 11.5, fontWeight: 700 }}>{label}</span>
      {sub && <span style={{ fontFamily: t.font, fontSize: 10.5, opacity: 0.85, marginLeft: 6 }}>{sub}</span>}
    </div>
  );
  return (
    <Card t={t} style={{ margin: "18px 0" }}>
      <div style={{ fontFamily: t.font, color: t.text, fontSize: 13, fontWeight: 700, marginBottom: 2 }}>BRAZIL'S DUAL PYRAMID — national + 27 state systems, joined by gateways</div>
      <div style={{ fontFamily: t.font, color: t.muted, fontSize: 12.5, marginBottom: 14, lineHeight: 1.5 }}>Clubs play both systems every year. State placement feeds Série D and the Copa do Brasil — so any club, in any town, has a defined annual merit path into the national game. Sources: [68][72]</div>
      <div className="grid2" style={{ alignItems: "start" }}>
        <div>
          <div style={{ fontFamily: t.font, fontSize: 10.5, color: t.muted, letterSpacing: ".12em", textAlign: "center", marginBottom: 8 }}>NATIONAL PYRAMID (CBF · MAY–DEC)</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {tier("SÉRIE A", "20 clubs", "52%")}
            {tier("SÉRIE B", "20 clubs", "66%")}
            {tier("SÉRIE C", "20 clubs", "80%")}
            {tier("SÉRIE D", "40 clubs — the gateway", "94%", true)}
          </div>
        </div>
        <div>
          <div style={{ fontFamily: t.font, fontSize: 10.5, color: t.muted, letterSpacing: ".12em", textAlign: "center", marginBottom: 8 }}>27 STATE PYRAMIDS (JAN–APR)</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {tier("STATE DIVISION 1", "e.g. Paulistão", "70%")}
            {tier("STATE DIVISION 2", "", "82%")}
            {tier("STATE DIVISIONS 3–4", "community clubs", "94%")}
          </div>
          <div style={{ textAlign: "center", marginTop: 10, fontFamily: t.font, fontSize: 11, color: t.primary }}>
            best-placed state clubs ⟶ SÉRIE D entry<br />state placement ⟶ COPA DO BRASIL berths
          </div>
        </div>
      </div>
      <Note t={t}>Proof of concept: São Caetano (founded 1989) was a Série A runner-up by 2000; Brasiliense (founded 2000) reached Série A in 2005. The climb is real, defined, and annual.</Note>
    </Card>
  );
}

const OWNERSHIP_ROWS = [
  ["Member / supporter-owned", "Real Madrid, Barcelona, Athletic, Osasuna; all German 50+1 clubs", "Loyalty moat, price discipline, anti-PE bulwark"],
  ["Fan-majority hybrid (50+1)", "Bundesliga statute", "Investment capital with member veto — the compromise instrument"],
  ["Private / family corporate", "Most of Serie A, Ligue 1, EFL", "Speed of capital; requires fit-and-proper tests + cost controls"],
  ["Benefactor / industrial", "Bayer Leverkusen, Wolfsburg", "Grandfathering template for legacy stakeholders"],
  ["League-equity investor-operator", "MLS single-entity", "The incumbent US model — convertible per §6.2"],
  ["Club-corporation w/ association parent", "Brazil SAF (Part V-B)", "The statutory conversion mechanism the US lacks"],
];
function OwnershipMatrix({ t }) {
  return (
    <Card t={t} style={{ margin: "16px 0" }}>
      <div style={{ fontFamily: t.font, color: t.text, fontSize: 11, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 12 }}>Six ownership models, all already coexisting inside single leagues</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {OWNERSHIP_ROWS.map((r, i) => (
          <div key={i} style={{ background: t.surfaceAlt, border: "1px solid " + t.border, borderRadius: t.radius.md, padding: "10px 12px" }}>
            <div style={{ fontFamily: t.font, color: t.primary, fontSize: 11.5, fontWeight: 600, marginBottom: 4 }}>{r[0]}</div>
            <div style={{ fontFamily: t.font, color: t.text, fontSize: 11.5, lineHeight: 1.6, fontWeight: 300 }}>{r[1]}</div>
            <div style={{ fontFamily: t.font, color: t.muted, fontSize: 11, lineHeight: 1.6, marginTop: 4, fontWeight: 300 }}>→ {r[2]}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

const PLS_TIERS = [
  { name: "DIVISION I (MEN)", rows: [["Teams", "12 (14 by yr 3)"], ["Time zones", "ET + CT + PT"], ["Markets", "75% in 1M+ metros"], ["Stadium", "15,000 seats"], ["Principal owner", "$40M net worth, 35% stake"], ["Group net worth", "$70M"], ["Bond", "$1M"]] },
  { name: "DIVISION I (WOMEN)", rows: [["Teams", "8 (10 by yr 4)"], ["Time zones", "2 (3 by yr 6)"], ["Markets", "75% in 750K+"], ["Stadium", "5,000 seats"], ["Principal owner", "$15M net worth"], ["Group net worth", "$25M"], ["Bond", "$100K"]] },
  { name: "DIVISIONS II / III", rows: [["Teams", "8 / 8 (6 women's D3)"], ["Time zones", "2 / none"], ["Markets", "75% in 750K+ / none"], ["Stadium", "5,000 / 1,000 seats"], ["Principal owner", "$20M / $10M"], ["Group net worth", "—"], ["Bond", "— / $250K"]] },
];
function PlsWall({ t }) {
  return (
    <div style={{ margin: "18px 0" }}>
      <div style={{ fontFamily: t.font, color: t.text, fontSize: 13, fontWeight: 700, marginBottom: 10 }}>THE WEALTH WALL — USSF Professional League Standards <CiteC t={t} n={[25, 26]} /></div>
      <div className="grid3">
        {PLS_TIERS.map((tier) => (
          <Card key={tier.name} t={t} pad={14}>
            <div style={{ fontFamily: t.font, color: t.primary, fontSize: 11.5, fontWeight: 700, letterSpacing: ".08em", marginBottom: 10 }}>{tier.name}</div>
            {tier.rows.map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "5px 0", borderBottom: i < tier.rows.length - 1 ? "1px solid " + t.border : "none" }}>
                <span style={{ fontFamily: t.font, color: t.muted, fontSize: 11 }}>{r[0]}</span>
                <span style={{ fontFamily: t.font, color: t.text, fontSize: 11.5, fontWeight: 600, textAlign: "right" }}>{r[1]}</span>
              </div>
            ))}
          </Card>
        ))}
      </div>
    </div>
  );
}

const RISK_ROWS = [
  ["USL Premier undercapitalized / stadium deadlines slip", "HIGH", "The open-pyramid proof-of-concept failing sets the thesis back 10+ years"],
  ["Pro/rel-driven insolvencies in early years", "HIGH", "England's 50+ insolvencies; mitigation must be in founding docs (squad-cost ratios, sunset parachutes)"],
  ["MLS/Apple content economics entrench closure", "MED", "A single-buyer media model has no per-market incentive to add jeopardy"],
  ["MLSPA/NWSLPA opposition to training compensation", "MED", "Unions view it as a player-movement tax; youth funding needs a player-neutral mechanism"],
  ["USSF governance capture", "MED", "The PLS lever only works if USSF acts independently of D1 incumbents"],
  ["Women's game collateral damage", "MED", "Unification designs drafted around the men's game historically strip-mine the women's (see WSL's PL-affiliate capture)"],
];
function RiskTable({ t }) {
  return (
    <Card t={t} style={{ margin: "16px 0" }}>
      <div style={{ fontFamily: t.font, color: t.text, fontSize: 11, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 12 }}>Risk register — top items</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {RISK_ROWS.map((r, i) => (
          <div key={i} style={{ background: t.surfaceAlt, border: "1px solid " + t.border, borderLeft: "2px solid " + (r[1] === "HIGH" ? t.danger : t.warn), borderRadius: t.radius.md, padding: "10px 12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 5 }}>
              <span style={{ fontFamily: t.font, color: t.text, fontSize: 12, fontWeight: 600, lineHeight: 1.5 }}>{r[0]}</span>
              <Badge t={t} tone={r[1] === "HIGH" ? "danger" : "warn"}>{r[1]}</Badge>
            </div>
            <div style={{ fontFamily: t.font, color: t.muted, fontSize: 11, lineHeight: 1.65, fontWeight: 300 }}>{r[2]}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ---------- The showpiece: 2026–2056 Gantt ---------- */
const GANTT = [
  { label: "PHASE 0 · Proof Window", from: 2026, to: 2030, prob: "60–70%", desc: "USL Premier launches with pro/rel; MLS calendar flip; NWSL cap escalation; Open Cup reforms bed in" },
  { label: "PHASE 1 · Competitive Pressure", from: 2028, to: 2034, prob: "~50%", desc: "Two-D1 era; MLS selective convergence; Open Cup as annual referendum; first pro/rel miracle-club story" },
  { label: "PHASE 2 · Unification Window", from: 2033, to: 2041, prob: "40–50% open pyramid · 10–15% full plan", desc: "Post-Apple media renegotiation as forcing event; equity conversion + WSL-style licensing bridge" },
  { label: "PHASE 3 · Maturation", from: 2041, to: 2056, prob: "35–45% composite", desc: "Two clean pro/rel cycles; 300–500 pro/semi-pro clubs; free-to-play elite youth; women's pyramid on its own brand" },
];
const GANTT_MARKERS = [
  { yr: 2026, label: "WC: USA/MEX/CAN" }, { yr: 2030, label: "WC: ESP/POR/MAR" },
  { yr: 2034, label: "WC: KSA" }, { yr: 2046, label: "NA window opens" }, { yr: 2050, label: "modal NA return" },
];
function Gantt({ t }) {
  const min = 2026, max = 2056, span = max - min;
  const pct = (yr) => ((yr - min) / span) * 100;
  return (
    <Card t={t} style={{ margin: "18px 0" }}>
      <div style={{ fontFamily: t.font, color: t.text, fontSize: 13, fontWeight: 700, marginBottom: 2 }}>THE 30-YEAR RUNWAY — phases &amp; the hosting clock, 2026–2056</div>
      <div style={{ fontFamily: t.font, color: t.muted, fontSize: 12.5, marginBottom: 16, lineHeight: 1.5 }}>Probability bands are structured priors — analytical judgments to revise as events land, not data.</div>

      {/* ---- MOBILE: vertical stack ---- */}
      <div className="gantt-mobile">
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px", paddingBottom: 12, marginBottom: 14, borderBottom: "1px solid " + t.border }}>
          <span style={{ fontFamily: t.font, fontSize: 9.5, letterSpacing: "1.5px", color: t.muted, textTransform: "uppercase", width: "100%", marginBottom: 2 }}>Hosting clock</span>
          {GANTT_MARKERS.map((m) => (
            <span key={m.yr} style={{ fontFamily: t.font, fontSize: 10.5, color: t.warn }}>
              <b style={{ color: t.text }}>{m.yr}</b> {m.label}
            </span>
          ))}
        </div>
        {GANTT.map((g, i) => (
          <div key={i} style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 10, flexShrink: 0 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: t.primary, opacity: 0.95 - i * 0.14, marginTop: 3 }} />
              {i < GANTT.length - 1 && <div style={{ width: 2, flex: 1, background: t.border, minHeight: 30 }} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "baseline" }}>
                <span style={{ fontFamily: t.font, fontSize: 11.5, fontWeight: 700, color: t.primary }}>{g.from}–{g.to}</span>
                <span style={{ fontFamily: t.font, fontSize: 12, fontWeight: 700, color: t.text }}>{g.label}</span>
              </div>
              <div style={{ marginTop: 6 }}><Badge t={t} tone="muted">{g.prob}</Badge></div>
              <div style={{ fontFamily: t.font, fontSize: 12, color: t.muted, marginTop: 6, lineHeight: 1.6 }}>{g.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ---- DESKTOP: horizontal timeline ---- */}
      <div className="gantt-desktop" style={{ position: "relative", padding: "26px 0 8px" }}>
        <div style={{ position: "relative", height: 1, background: t.border, marginBottom: 18 }}>
          {GANTT_MARKERS.map((m) => (
            <div key={m.yr} style={{ position: "absolute", left: pct(m.yr) + "%", top: -22, transform: "translateX(-50%)", textAlign: "center" }}>
              <div style={{ fontFamily: t.font, fontSize: 9.5, color: t.warn, whiteSpace: "nowrap" }}>{m.label}</div>
              <div style={{ width: 1, height: 14, background: t.warn, margin: "2px auto 0" }} />
            </div>
          ))}
        </div>
        {GANTT.map((g, i) => (
          <div key={i} style={{ marginBottom: 14 }}>
            <div style={{ position: "relative", height: 26, background: t.surfaceAlt, borderRadius: t.radius.sm, border: "1px solid " + t.border }}>
              <div style={{ position: "absolute", left: pct(g.from) + "%", width: (pct(g.to) - pct(g.from)) + "%", top: 0, bottom: 0, background: t.primary, opacity: 0.9 - i * 0.14, borderRadius: t.radius.sm, display: "flex", alignItems: "center", paddingLeft: 8, overflow: "hidden" }}>
                <span style={{ fontFamily: t.font, fontSize: 10, fontWeight: 700, color: t.primaryFg, whiteSpace: "nowrap" }}>{g.from}–{g.to}</span>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "baseline", marginTop: 5 }}>
              <span style={{ fontFamily: t.font, fontSize: 11.5, fontWeight: 700, color: t.text }}>{g.label}</span>
              <Badge t={t} tone="muted">{g.prob}</Badge>
            </div>
            <div style={{ fontFamily: t.font, fontSize: 12, color: t.muted, marginTop: 3, lineHeight: 1.5 }}>{g.desc}</div>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: t.font, fontSize: 10, color: t.muted, borderTop: "1px solid " + t.border, paddingTop: 6 }}>
          {[2026, 2032, 2038, 2044, 2050, 2056].map((y) => <span key={y}>{y}</span>)}
        </div>
      </div>
    </Card>
  );
}

function LessonCard({ t, country, flag, lesson, children }) {
  return (
    <Card t={t} style={{ margin: "18px 0" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 20, flexShrink: 0 }}>{flag}</span>
        <span style={{ fontFamily: t.font, color: t.text, fontSize: 15, fontWeight: 700 }}>{country}</span>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <span style={{ width: 3, borderRadius: 2, background: t.primary, flexShrink: 0 }} />
        <span style={{ fontFamily: t.font, color: t.primary, fontSize: 11, fontWeight: 600, letterSpacing: ".3px", lineHeight: 1.5, textTransform: "uppercase", overflowWrap: "anywhere" }}>{lesson}</span>
      </div>
      {children}
    </Card>
  );
}


/* ============================================================
   NAV (mobile-first: sticky chip rail is the primary nav)
   + SAGE ADVICE MASTHEAD
   ============================================================ */
/* Theme dropdown — mirrors the ThemeSelector on hannasage.love:
   palette-dot trigger, panel grouped Dark/Light with swatch + check,
   closes on outside click. On deploy, delete this; the site's global
   ThemeSelector already provides it. */
function ThemeMenu({ t, themeId, setThemeId }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  const dark = THEMES.filter((x) => x.isDark);
  const light = THEMES.filter((x) => !x.isDark);
  const cur = THEMES.find((x) => x.id === themeId) || THEMES[0];
  const dot = (cx, cy, i) => <circle cx={cx} cy={cy} r="1.2" fill={cur.planColors[i]?.value || t.primary} />;
  const groupLabel = (txt) => (
    <div style={{ fontFamily: t.font, fontSize: 9, letterSpacing: "2.5px", textTransform: "uppercase", color: t.muted, padding: "8px 12px 6px", borderBottom: "1px solid " + t.border }}>{txt}</div>
  );
  const row = (th) => {
    const on = th.id === themeId;
    return (
      <button key={th.id} type="button" onClick={() => { setThemeId(th.id); setOpen(false); }}
        style={{ display: "flex", width: "100%", alignItems: "center", gap: 10, border: "none", borderBottom: "1px solid " + t.border + "44", padding: "11px 12px", textAlign: "left", cursor: "pointer", background: on ? cur.colors.accent + "28" : "transparent", minHeight: 44 }}>
        <span style={{ fontSize: 11, width: 18, textAlign: "center", flexShrink: 0 }} aria-hidden>{th.isDark ? "🌙" : "☀️"}</span>
        <span style={{ width: 16, height: 16, flexShrink: 0, borderRadius: 3, background: th.colors.accent, border: "1px solid " + th.colors.accent + "66" }} />
        <span style={{ flex: 1, minWidth: 0, fontFamily: t.font, fontSize: 12.5, color: on ? th.colors.accent : t.text, fontWeight: on ? 600 : 400 }}>{th.name}</span>
        {on && <span style={{ fontFamily: t.font, fontSize: 12, color: th.colors.accent, flexShrink: 0 }}>✓</span>}
      </button>
    );
  };
  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-label="Change theme" aria-expanded={open}
        style={{ display: "flex", alignItems: "center", gap: 6, borderRadius: t.radius.sm, border: "1px solid " + t.border, padding: "8px 10px", cursor: "pointer", background: open ? t.primary + "26" : "transparent", color: t.muted, minHeight: 40 }}>
        <svg width="15" height="15" viewBox="0 0 14 14" fill="none" aria-hidden style={{ flexShrink: 0 }}>
          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
          {dot(4.5, 5.5, 0)}{dot(7, 4, 1)}{dot(9.5, 5.5, 2)}{dot(9, 8.5, 3)}{dot(5, 8.5, 4)}
        </svg>
        <span style={{ width: 8, height: 8, borderRadius: 9999, background: cur.colors.accent, flexShrink: 0 }} />
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 200, minWidth: 200, maxHeight: 360, overflowY: "auto", borderRadius: t.radius.lg, border: "1px solid " + t.border, background: t.surface, boxShadow: "0 8px 32px " + t.bg + "cc" }}>
          {groupLabel("Dark")}
          {dark.map(row)}
          {groupLabel("Light")}
          {light.map(row)}
        </div>
      )}
    </div>
  );
}

/* Section nav = a dropdown. One control, tap to open the list, pick a
   section. Same select-style pattern as the theme menu. */
function TabMenu({ t, tabs, active, setActive }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  const idx = tabs.findIndex((x) => x.id === active);
  const cur = tabs[idx] || tabs[0];
  return (
    <div ref={ref} style={{ position: "relative", flex: 1, minWidth: 0 }}>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-label="Jump to section" aria-expanded={open}
        style={{ display: "flex", width: "100%", alignItems: "center", gap: 8, borderRadius: t.radius.sm, border: "1px solid " + (open ? t.primary : t.border), padding: "9px 12px", cursor: "pointer", background: open ? t.primary + "1a" : t.surface, minHeight: 42 }}>
        <span style={{ fontFamily: t.font, fontSize: 10, color: t.primary, fontWeight: 600, flexShrink: 0 }}>{String(idx + 1).padStart(2, "0")}</span>
        <span style={{ flex: 1, minWidth: 0, textAlign: "left", fontFamily: t.font, fontSize: 12.5, color: t.text, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cur.label}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform .15s ease" }}>
          <path d="M2.5 4.5 6 8l3.5-3.5" stroke={t.muted} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 200, maxHeight: 380, overflowY: "auto", borderRadius: t.radius.lg, border: "1px solid " + t.border, background: t.surface, boxShadow: "0 8px 32px " + t.bg + "cc" }}>
          {tabs.map((tab, i) => {
            const on = tab.id === active;
            return (
              <button key={tab.id} type="button" onClick={() => { setActive(tab.id); setOpen(false); }} aria-current={on ? "page" : undefined}
                style={{ display: "flex", width: "100%", alignItems: "center", gap: 10, border: "none", borderBottom: "1px solid " + t.border + "44", padding: "11px 12px", textAlign: "left", cursor: "pointer", background: on ? t.primary + "22" : "transparent", minHeight: 44 }}>
                <span style={{ fontFamily: t.font, fontSize: 10, color: on ? t.primary : t.muted, fontWeight: 600, width: 18, flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ flex: 1, minWidth: 0, fontFamily: t.font, fontSize: 12.5, color: on ? t.primary : t.text, fontWeight: on ? 600 : 400 }}>{tab.label}</span>
                {on && <span style={{ fontFamily: t.font, fontSize: 12, color: t.primary, flexShrink: 0 }}>✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function NavBar({ t, tabs, active, setActive, themeId, setThemeId }) {
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 50, background: t.isDark ? "rgba(7,9,12,.92)" : "rgba(246,248,250,.94)", backdropFilter: "blur(10px)", borderBottom: "1px solid " + t.border }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "10px 12px", display: "flex", alignItems: "center", gap: 8 }}>
        <TabMenu t={t} tabs={tabs} active={active} setActive={setActive} />
        <ThemeMenu t={t} themeId={themeId} setThemeId={setThemeId} />
      </div>
    </div>
  );
}

const Section = ({ t, num, kicker, title, children }) => (


  <section style={{ padding: "28px 0 40px" }}>
    <Eyebrow t={t}>{num} / {kicker}</Eyebrow>
    <SectionTitle t={t}>{title}</SectionTitle>
    {children}
  </section>
);

/* ---------- Masthead: the Sage Advice BA letterhead ---------- */
function Masthead({ t }) {
  const metaItem = (k, v) => (
    <div>
      <div style={{ fontFamily: t.font, fontSize: 9, letterSpacing: "2.5px", color: t.muted, textTransform: "uppercase", marginBottom: 4 }}>{k}</div>
      <div style={{ fontFamily: t.font, fontSize: 11, fontWeight: 500, color: t.text, letterSpacing: ".5px" }}>{v}</div>
    </div>
  );
  return (
    <div style={{ position: "relative", overflow: "hidden", background: t.faint, borderBottom: "1px solid " + t.border }}>
      {/* ghost glyph — soccer-ball pentagon panel */}
      <svg viewBox="0 0 100 100" aria-hidden="true" style={{ position: "absolute", right: "-70px", top: "-60px", width: 340, height: 340, opacity: t.isDark ? 0.05 : 0.055 }}>
        <polygon points="50,4 95,37 78,92 22,92 5,37" fill="none" stroke={t.text} strokeWidth="1.6" />
        <polygon points="50,26 72,42 64,68 36,68 28,42" fill={t.text} />
        <line x1="50" y1="4" x2="50" y2="26" stroke={t.text} strokeWidth="1.6" />
        <line x1="95" y1="37" x2="72" y2="42" stroke={t.text} strokeWidth="1.6" />
        <line x1="78" y1="92" x2="64" y2="68" stroke={t.text} strokeWidth="1.6" />
        <line x1="22" y1="92" x2="36" y2="68" stroke={t.text} strokeWidth="1.6" />
        <line x1="5" y1="37" x2="28" y2="42" stroke={t.text} strokeWidth="1.6" />
      </svg>
      <div style={{ position: "relative", maxWidth: 728, margin: "0 auto", padding: "40px 16px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 26 }}>
          <span style={{ width: 8, height: 8, background: t.primary, borderRadius: 2, flexShrink: 0 }} />
          <span style={{ fontFamily: t.font, fontSize: 10, letterSpacing: "4px", color: t.text, fontWeight: 500 }}>SAGE ADVICE LLC</span>
          <span style={{ fontFamily: t.font, fontSize: 10, letterSpacing: "2.5px", color: t.muted }}>· BUSINESS ANALYSIS</span>
        </div>
        <h1 style={{ fontFamily: t.display, color: t.text, fontSize: "clamp(30px, 8.5vw, 50px)", lineHeight: 1.04, fontWeight: 800, letterSpacing: "-0.015em" }}>
          Restructuring<br />American Soccer<span style={{ color: t.primary }}>.</span>
        </h1>
        <p style={{ fontFamily: t.font, color: t.muted, fontSize: 13, lineHeight: 1.75, maxWidth: 560, margin: "16px 0 26px", fontWeight: 300 }}>
          The United States is the only major footballing economy structured primarily as a financial asset class rather than a sporting pyramid. This brief maps the closed system, the working alternatives across Europe and Brazil, and a 30-year path to a legitimate footballing nation by the next North American World Cup.
        </p>
        <div className="meta-grid" style={{ borderTop: "1px solid " + t.border, borderBottom: "1px solid " + t.border, padding: "14px 0", marginBottom: 22 }}>
          {metaItem("Engagement", "US SOCCER RESTRUCTURE")}
          {metaItem("Document", "RESEARCH BRIEF")}
          {metaItem("Version", "V0.2 · WORKING")}
          {metaItem("Date", "JULY 2026")}
          {metaItem("Analyst", "HANNA SAGE")}
        </div>
        <div className="statgrid">
          <StatCard t={t} value="$500M" label="Price of one MLS seat" sub="San Diego FC's 2023 expansion fee — up from $5M in 1998" />
          <StatCard t={t} value="$8–15K" label="Elite youth soccer / yr" sub="Per child, per year, paid by families — before hidden costs" />
          <StatCard t={t} value="1999" label="Last non-MLS Open Cup win" sub="Rochester Rhinos. Twenty-seven years and counting" />
        </div>
        <div style={{ background: t.primary, borderRadius: t.radius.md, padding: "12px 14px", marginTop: 14 }}>
          <div style={{ fontFamily: t.font, color: t.primaryFg, fontSize: 9.5, fontWeight: 600, letterSpacing: "2.5px", marginBottom: 5 }}>THE MISSION</div>
          <div style={{ fontFamily: t.font, color: t.primaryFg, fontSize: 12.5, fontWeight: 500, lineHeight: 1.6 }}>
            By the time the men's World Cup returns to North America (~2046–2050), the USA is recognized as a legitimate footballing nation — not a host that hit its Ro16 ceiling on home soil.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SECTION 1 — MISSION
   ============================================================ */
function S1({ t }) {
  return (
    <Section t={t} num="01" kicker="EXECUTIVE SUMMARY" title="The mission, honestly framed">
      <Lead t={t}>
        Entry to the top divisions is purchased ($500M for MLS San Diego in 2023<CiteC t={t} n={5} />; $110M for NWSL Denver in 2025<CiteC t={t} n={13} />), youth development is largely funded by parents ($8,000–$15,000+ per year at the elite level<CiteC t={t} n={36} />), and until 2025 no sanctioned professional league had ever committed to promotion and relegation.<CiteC t={t} n={22} /> Three structural facts define the moment.
      </Lead>
      <P t={t}><Strong t={t}>1. The USL is already running the experiment.</Strong> In 2025, USL owners voted by supermajority to adopt promotion/relegation across a three-tier system topped by a new Division I league, "USL Premier," launching 2028.<CiteC t={t} n={[21, 22]} /> This is the live proof-of-concept for an open American pyramid — its success or failure will shape everything else.</P>
      <P t={t}><Strong t={t}>2. The 2026 World Cup result was better than the popular framing — and proves the same point.</Strong> The USMNT won Group D, beat Bosnia and Herzegovina 2-0 in the new Round of 32 (the first knockout win since 2002), then lost 4-1 to Belgium in Seattle on July 6 — the fifth Round-of-16 exit in six attempts since 1994.<CiteC t={t} n={[1, 2, 3]} /> Even at home, with its best-ever generation and a record goal tally, the US could not break the Ro16 ceiling. The talent pipeline, not the national-team program, is the binding constraint. On the hosting clock, 2030 is Spain/Portugal/Morocco and 2034 is Saudi Arabia; under FIFA's confederation-rotation norms CONCACAF's earliest realistic re-entry is 2038, but the modal window for a North American men's World Cup return is 2046 or 2050<CiteC t={t} n={85} /> — which aligns with a 30-year build.</P>
      <P t={t}><Strong t={t}>3. England is not a clean model — it's a cautionary tale with one great lesson.</Strong> The Premier League's 1992 breakaway was itself a money-capture maneuver by the biggest clubs. What England did right was keep the pyramid connected: pro/rel with the EFL survived the breakaway.<CiteC t={t} n={39} /> What it did wrong — hollowed-out revenue sharing, the parachute-payment distortion, 50+ lower-league insolvencies since 1992<CiteC t={t} n={[43, 44]} /> — is precisely what a designed-from-scratch American pyramid could avoid. The Women's Super League's 2018 licensing-based professionalization is the closest real-world analog to the transition mechanism this plan needs.<CiteC t={t} n={[46, 47]} /></P>
      <PullQuote t={t} attr="Core BA finding — developed in §07">
        There is no legal or financial mechanism to dissolve the MLS/NWSL franchise model against its owners' will (a federal jury upheld the USSF/MLS structure against antitrust challenge in NASL v. USSF, February 2025). The viable paths: make an open pyramid more profitable than a closed one so incumbents opt in; apply regulatory pressure through USSF sanctioning standards; and let USL's open system compete MLS into convergence.
      </PullQuote>
    </Section>
  );
}

/* ============================================================
   SECTION 2 — THE CLOSED SYSTEM (Parts I + II)
   ============================================================ */
function S2({ t }) {
  return (
    <Section t={t} num="02" kicker="PARTS I–II" title="The closed system: pro leagues & pay-to-play youth">
      <H3 t={t}>Division status is a license, not a table position</H3>
      <P t={t}>Unlike anywhere else in world football, US division status is not earned on the pitch. The US Soccer Federation sanctions leagues into Divisions I–III via its Professional League Standards (PLS), with annual applications.<CiteC t={t} n={25} /> The PLS is the single most powerful lever in American soccer that nobody elected. It was designed to prevent league collapses — a rational response to the NASL's 1984 death and two failed women's leagues — but it functionally hard-codes wealth requirements into the sport's structure and makes small-market, community-owned clubs structurally ineligible for the top flight regardless of sporting merit. Any restructuring plan ultimately runs through the USSF board and these standards. Note: they survived their biggest legal test — a jury in <em>North American Soccer League v. USSF</em> (E.D.N.Y., verdict February 2025) found the divisional system did not violate antitrust law.<CiteC t={t} n={[23, 27]} /></P>
      <PlsWall t={t} />
      <H3 t={t}>Major League Soccer — single-entity by design</H3>
      <P t={t}>MLS is a single-entity LLC: club "owners" are technically investor-operators holding equity in the league itself; player contracts are held centrally by the league, not the clubs. The structure was designed explicitly to defeat antitrust challenges to salary restraints, and it worked — the structure survived <em>Fraser v. MLS</em> (1st Cir. 2002), where the court treated MLS as a single entity but declined to rule the question definitively, disposing of the case on the players' failure to prove a relevant market.<CiteC t={t} n={12} /> The consequences matter: there is no independent club to "sell back to fans." An MLS club is a revocable operating right plus a share of a Delaware LLC — dissolving the franchise model means restructuring the LLC itself, a unanimous-consent-grade corporate event, not a league rule change. Salary controls (a budget in the mid-single-digit millions per club, with Designated Player slots, allocation-money mechanisms, and U22 initiative slots layered on top) are league policy governed by the CBA framework, and the roster machinery is notoriously opaque — itself a fan-alienation cost.</P>
      <FeeChart t={t} />
      <P t={t}>MLS reached 30 teams in 2025 and has stated no near-term plans to expand further.<CiteC t={t} n={6} /> Sportico reported at the San Diego announcement that MLS held 18 of the world's 50 most valuable soccer franchises — more than the Premier League's 9 — despite not being a top-10 league on sporting quality.<CiteC t={t} n={5} /> <Strong t={t}>That gap between franchise valuation and sporting output is the empirical core of the "safe space to park money" thesis.</Strong> Valuations are driven by scarcity (closed membership), real-estate and stadium plays, and the league's growth narrative — not by competitive success, which carries no downside risk (no relegation) and limited upside (capped spending).</P>
      <P t={t}><Strong t={t}>The November 2025 calendar decision.</Strong> MLS's Board of Governors voted on November 13, 2025 to move to a summer-to-spring calendar: a 14-game "sprint season" February–May 2027, then the first full 2027–28 season starting July 2027, with a midwinter break and MLS Cup in May 2028.<CiteC t={t} n={[8, 9, 10]} /> Stated rationale: transfer-window alignment, FIFA-calendar alignment, playoff decongestion. Reporting also indicates a single-table format divided into geographic divisions is under discussion, and that changing <em>spending rules</em> is proving a harder internal sell than changing the schedule.<CiteC t={t} n={11} /> The read: MLS voluntarily converges toward global norms where convergence is costless to the franchise model (calendar, formats) while defending the parts that protect asset values (closed membership, cost controls). That tells you exactly where the negotiation boundary sits. On media, the Apple deal was restructured for 2026 — MLS Season Pass's separate paywall was eliminated — a tacit admission that the hard-paywall strategy suppressed reach.</P>
      <H3 t={t}>NWSL — the third attempt, and the radical CBA</H3>
      <P t={t}>NWSL is the <em>third</em> try at a top women's league — WUSA (2001–03) and WPS (played 2009–11, folded 2012) both collapsed.<CiteC t={t} n={19} /> That trauma explains the league's conservative early economics. The current state (2026): 16 teams after Boston Legacy and Denver Summit joined; the fee curve mirrors MLS — Bay FC and Boston at $53M (2023), Denver at $110M (January 2025), the largest fee in US women's sports history.<CiteC t={t} n={[13, 18]} /> Angel City's controlling-stake sale (2024) at a $250M valuation made it the world's most valuable women's team, and the 2024–27 media deal (CBS, ESPN, Amazon, Scripps) is worth $240M over four years — roughly 40x the prior deal.<CiteC t={t} n={14} /></P>
      <NwslFeeChart t={t} />
      <P t={t}>The 2024 CBA is genuinely radical by US standards: the <Strong t={t}>first major US league to abolish the draft entirely</Strong>; unrestricted free agency at contract expiry; guaranteed contracts; no trades without consent; a salary cap rising from $3.3M (2025) to $5.1M (2030) with revenue-sharing top-ups; minimums rising from $48.5K to $82.5K.<CiteC t={t} n={[14, 15, 16]} /> Commissioner Berman's framing was explicit: NWSL competes in a <em>global</em> labor market, so it aligned with global standards. Friction remains — in December 2025 the league unilaterally introduced a "High Impact Player" rule allowing up to $1M in over-cap star spending (Trinity Rodman's ~$2M+ deal the headline outcome); the NWSLPA filed a grievance in January 2026 alleging the unilateral change violates labor law.<CiteC t={t} n={17} /> The larger point: NWSL already did, voluntarily, half of what this plan asks — it abandoned the draft and movement restrictions because the WSL was beating it for talent. <Strong t={t}>Competition from an open system forced convergence. That is the theory of change, demonstrated.</Strong></P>
      <H3 t={t}>The USL system — the live open-pyramid experiment</H3>
      <P t={t}>USL Championship (D2) runs ~24 independently owned clubs — not single-entity, no salary cap, no academy territorial restrictions.<CiteC t={t} n={26} /> Below it: USL League One (D3), USL League Two (pre-professional), and the USL Super League (women's — sanctioned Division I in February 2024, on a fall–spring calendar from launch). Above it, USL Premier: announced February 2025, named January 2026, launching 2028 as a single national table with a long-term target of 20 clubs (12–14 at launch; ~8 promoted from the Championship plus 4–6 expansion sides expected).<CiteC t={t} n={[21, 24]} /> In March 2025, USL owners voted by supermajority to implement promotion and relegation across all three men's tiers — the first US pro league ever to do so — with initial reporting suggesting two up, two down.<CiteC t={t} n={22} /> USL hired Tony Scholes, formerly the Premier League's chief football officer, to run the new division.<CiteC t={t} n={23} /></P>
      <P t={t}>The constraint to watch: the 15,000-seat D1 stadium requirement. Only a couple of current venues comply; Pittsburgh (5,500 → 15,000, ~$125M), Sacramento, Detroit, Raleigh and others have stadium projects racing the 2028 deadline.<CiteC t={t} n={23} /> The USSF's PLS is simultaneously the enabler and the chokepoint of the experiment. USL's bet is that <em>jeopardy is a product</em>. If USL Premier launches successfully and pro/rel demonstrably drives engagement in mid-size markets (Louisville, Sacramento, Indianapolis, Phoenix), the "American exceptionalism" argument against open systems dies on contact with evidence. If it stumbles, it hands MLS a decade of "told you so." Rounding out the map: MLS NEXT Pro (D3, 2022–) is primarily MLS reserve sides — a closed shadow of a pyramid MLS already controls internally.</P>
      <H3 t={t}>Youth: the cost cliff</H3>
      <P t={t}>US Soccer shuttered its Development Academy in 2020, fragmenting elite youth soccer into competing private platforms: MLS NEXT (boys; free at MLS-club academies in the "Homegrown Division," $3,000+ base fees at non-MLS "Academy Division" clubs), ECNL and ECNL-RL (boys and girls, $3,000–8,000 dues), Girls Academy, USYS National League, and mid-tier leagues (NPL, EDP, ECRL) at $2,500–7,000.<CiteC t={t} n={[32, 33]} /> Aggregating current reporting: recreational soccer costs $125–400/year; competitive club soccer $2,500–5,000 in fees plus $1,000–3,000 in travel, gear, and tournaments; elite national-league soccer routinely $8,000–15,000, with some families reporting up to ~$25,000/year, and a full elite youth career exceeding $100,000 per child.<CiteC t={t} n={[29, 30, 36, 37]} /> The cliff appears at ages 10–12 — exactly when serious development begins. Hidden costs (mandatory uniform packages, "optional" showcases, coach per-diems) mean advertised fees routinely understate true cost by 50–100%.<CiteC t={t} n={30} /> A ~$100K household income is roughly the de facto gate for the travel tier, and the structure is regressive twice over: families pay, <em>and</em> the system's geographic sprawl converts income into access even among those who can nominally afford fees.</P>
      <YouthCostChart t={t} />
      <H3 t={t}>Why it stays broken: the missing money loop</H3>
      <P t={t}>In most of the world, youth development is financed by clubs because developed players are <em>assets</em>: FIFA's transfer regulations mandate training compensation (paid to clubs that trained a player, ages 12–21, on his first pro contract abroad or international transfers through age 23) and the solidarity mechanism (5% of any international fee distributed to training clubs).<CiteC t={t} n={[35, 53]} /> The US broke this loop. USSF declared "neutrality" in 2015 and refuses to enforce the mechanisms domestically, citing antitrust fear.<CiteC t={t} n={36} /> MLS only began complying with FIFA's international rules in April 2019 — after the Crossfire Premier/DeAndre Yedlin dispute exposed the gap — and the MLSPA formally opposes the mechanisms as player-movement restraints.<CiteC t={t} n={[35, 37, 38]} /> Critically, the FIFA rules don't apply to domestic transfers, so a youth club that develops a player who signs directly with an MLS side typically receives nothing. Development produces no revenue; therefore parents are the revenue. England's academy players do not pay — clubs fund academies because the compensation architecture makes players recoverable assets.<CiteC t={t} n={54} /> Any US youth fix that doesn't create a domestic money loop is a scholarship band-aid on a structural wound.</P>
      <MoneyLoop t={t} />
      <P t={t}>On geography: national footprints at U13–U19 are a cost multiplier with negligible development benefit — the Netherlands and England develop world-class players inside travel radii smaller than many US metro areas. England's lower men's steps and the FA Women's National League split North/South precisely to cap travel. A properly dense US pyramid regionalizes below the second or third tier for adults and almost entirely for youth. Regionalization is the strongest, cheapest, least-opposed element of the whole plan — and community counter-programming (cooperative, fee-capped clubs like Solstice FC<CiteC t={t} n={30} />) is already emerging at the grassroots.</P>
    </Section>
  );
}

/* ============================================================
   SECTION 3 — CASE STUDIES (Parts III + III-B)
   ============================================================ */
function S3({ t }) {
  return (
    <Section t={t} num="03" kicker="PARTS III + III-B" title="Case studies: five footballing nations, read honestly">
      <LessonCard t={t} country="England" flag="🏴󠁧󠁢󠁥󠁮󠁧󠁿" lesson="Jeopardy is monetizable — but write redistribution into the constitution">
        <P t={t}>The Football League (1888) grew to four divisions with pooled TV money: pre-1992, television revenue split roughly 50% to Division One, 25% to Division Two, 12.5% each to the lower two. Solidarity was structural.<CiteC t={t} n={43} /> In October 1990, LWT's Greg Dyke convened the "Big Five" (Man Utd, Liverpool, Arsenal, Everton, Spurs) to plan a breakaway that would concentrate TV money on the top flight; the FA — feuding with the Football League — blessed it. The Founder Members Agreement was signed July 17, 1991; the First Division resigned from the Football League on February 20, 1992; Sky won the rights with a £304M five-year bid, and the money went to the breakaway clubs alone. The domestic deal is now £6.7B per cycle.<CiteC t={t} n={[39, 40, 41, 42]} /></P>
        <P t={t}><Strong t={t}>The one thing the breakaway did not break: promotion and relegation.</Strong> Three up, three down with the Football League survived, and 51 different clubs have since played in the Premier League.<CiteC t={t} n={39} /> England's top flight is, functionally, a commercial breakaway that retained sporting openness — proof that concentrated commercial value and an open pyramid can coexist, and that jeopardy became part of the product Sky sold.</P>
        <SplitDonuts t={t} />
        <P t={t}>The costs England paid form the design checklist of what to avoid. Cutting the lower divisions out of the TV pool contributed to 50+ insolvency events in the EFL since 1992. Parachute payments (introduced 2006–07, now ~£225–233M/yr to recently relegated clubs, £40M+ in year one) dwarf solidarity payments of roughly £5M per non-parachute Championship club and under £1M lower down; academic work finds parachute clubs roughly twice as likely to be promoted — a "revolving door" that measurably reduces Championship competitive balance.<CiteC t={t} n={[43, 44, 45]} /> Championship clubs chasing promotion have run wage-to-revenue ratios near or above 100%; relegation cuts revenue ~73% (parachutes limit it to ~42%) while wages fall only ~28% in year one.<CiteC t={t} n={45} /> Profitability rules produce points deductions after the fact (Leicester docked 6 points in early 2026, West Brom 2) rather than preventing distress — and England has now legislated an Independent Football Regulator (Football Governance Act 2025) with power to impose distribution settlements, i.e., the state had to intervene because the leagues couldn't agree on solidarity. EFL chair Rick Parry's counter-proposal: abolish parachutes, pool 25% of broadcast revenue across all four divisions on merit.<CiteC t={t} n={44} /></P>
        <ParachuteChart t={t} />
        <P t={t}><Strong t={t}>The WSL is the closest analog to the transition mechanism this plan needs.</Strong> 2011: the FA launches the WSL with 8 teams selected by application (16 applied) — a licensed, closed launch, no relegation for two seasons. 2014: WSL 2 created; pro/rel introduced within. 2016: promotion from the wider pyramid opened — the licensed league stitched back into the open pyramid. 2018–19: full professionalization by re-licensing — every club re-applied against criteria (16-hour minimum contracts, mandatory academies); Sunderland was denied a license and dropped despite mid-table results; Manchester United (re-formed 2018) entered by application. Controversial — but it worked: fully professional in seven years, and the global standard-setter that forced NWSL's CBA revolution. 2023–25: governance spun out of the FA into a club-owned company (now WSL Football); the top flight expands to 14 for 2026–27.<CiteC t={t} n={[46, 47, 48]} /></P>
        <TimelineStrip t={t} title="THE WSL LICENSING BRIDGE — closed launch → open pyramid in ~7 years" items={[
          { when: "2011", what: "Licensed launch: 8 clubs by application; no relegation for two seasons" },
          { when: "2014", what: "WSL 2 created; internal promotion/relegation begins" },
          { when: "2016", what: "Promotion from the wider pyramid opened — stitched into the open system" },
          { when: "2018–19", what: "Full professionalization by re-licensing; Sunderland denied, Man United enters", tone: "warn" },
          { when: "2023–25", what: "Governance spun out of the FA to a club-owned company; expansion to 14 clubs" },
        ]} caption="The hybrid this plan gestures at: licensing as the bridge between a closed launch and an open pyramid. Incumbents get security during the capital-intensive build; sporting merit takes over once the tier below is viable. Failure mode to guard: 11 of 12 WSL clubs are appendages of men's Premier League clubs." />
      </LessonCard>
      <LessonCard t={t} country="Spain" flag="🇪🇸" lesson="The accidental mixed-ownership proof">
        <P t={t}>Spain's 1990 Sports Law forced clubs to convert into sports corporations (SADs) as a debt-crisis response, but exempted the four clubs then solvent: <Strong t={t}>Real Madrid, Barcelona, Athletic Club, and Osasuna remain member-owned non-profits competing in the same league as privately owned corporations.</Strong><CiteC t={t} n={82} /> The conversion obligation itself was eliminated in 2022, but the four exempt clubs had already held their status for three decades by then. Thirty-five years of evidence: the mixed model is not merely viable — the two member-owned giants are the league's most valuable brands. This is the single most direct precedent for a league with teams funded in different ways.</P>
        <P t={t}>La Liga also runs the strictest <em>ex ante</em> cost control in Europe — each club receives a computed squad-cost limit before the season, enforced by blocking player registrations rather than punishing after the fact (the mechanism behind Barcelona's registration crises). "You cannot spend it in the first place" beats England's after-the-fact points deductions, and is the model a new US pyramid should copy. The cautionary tale: La Liga's 2021 "Impulso" deal sold ~8.2% of media revenue to CVC for ~€2B over 50 years — Real Madrid, Barcelona, and Athletic refused and litigated.<CiteC t={t} n={82} /> Liga F became Spain's first fully professional women's league in 2021–22 by government designation — followed immediately by the 2023 players' strike over minimum salaries: professionalization on paper without floor-wage enforcement reproduces the old exploitation with better branding.<CiteC t={t} n={83} /> Meanwhile Barcelona Femení — a member-owned club — repeatedly filled Camp Nou with 90,000+: member ownership and women's-game excellence are demonstrably compatible.</P>
      </LessonCard>
      <LessonCard t={t} country="Germany" flag="🇩🇪" lesson="Fans defeated private equity in open field">
        <P t={t}>The 50+1 rule (DFL statute since 1998): to be licensed for the top two divisions, the parent members' association must hold 50% of voting rights plus one share in the professional football company. Grandfathered exceptions exist for 20-year continuous benefactors (Bayer Leverkusen, Wolfsburg; Hoffenheim's exception was voluntarily reversed in November 2024), and RB Leipzig complies technically while restricting membership — the known exploit. In June 2025 the Federal Cartel Office ruled that further exceptions will no longer be tolerated, and the Chancellor publicly endorsed the rule in September 2025.<CiteC t={t} n={[73, 76]} /> Attributed effects: Europe's highest attendances (42,000+ average), €20 standing tickets, low insolvency rates, fierce fan-culture continuity.</P>
        <P t={t}><Strong t={t}>The February 2024 DFL investor collapse is the decade's most important ownership-politics event.</Strong> Clubs voted in December 2023 to sell 8% of a new media-rights company to private equity (~€1B over 20 years; CVC and Blackstone the finalists). Organized fan protests — tennis-ball barrages, remote-control cars on pitches, bike-locked goals, matches delayed toward abandonment — plus a legitimacy crisis over Hannover 96's contested vote killed the deal within ten weeks.<CiteC t={t} n={[74, 75]} /> For a thesis that financial incentives should reward responsible ownership rather than PE, Germany supplies both the constitutional mechanism (50+1) and the proof that fan power can enforce it. The counterweight caution: the Frauen-Bundesliga — federation-run, expanded to 14 teams in 2025–26 — remains effectively semi-professional, with women's-only clubs historically unable to survive without corporate backing.<CiteC t={t} n={77} /> Fan-ownership doctrine alone does not professionalize a women's league; dedicated investment and independent league governance are separate, necessary work.</P>
      </LessonCard>
      <LessonCard t={t} country="Italy" flag="🇮🇹" lesson="What MLS owners might become without cost controls">
        <P t={t}>The opposite pole from Germany: near-total private ownership with the heaviest foreign (especially US institutional) presence in Europe — RedBird (Milan), Oaktree (Inter, via loan-default seizure), Friedkin (Roma), and others.<CiteC t={t} n={85} /> Italy is the live experiment in distressed-asset and leveraged ownership at scale: chronic stadium underinvestment (most clubs rent municipal grounds) and a league whose competitive brand has eroded relative to its 1990s peak despite on-pitch quality. A warning, not a model. The bright spot: Serie A Femminile — founded 1968, Europe's oldest of the five — was taken over by the federation in 2018 and made professional in 2022–23, the first professional women's sports league in Italian history, driven top-down after the 2019 World Cup surge.<CiteC t={t} n={[79, 80]} /> Nearly every club is an appendage of a men's Serie A side and all current top-flight women's clubs were founded or absorbed within two decades — the fastest, most complete example of the men's-club capture pattern. In 2026, Serie A Women was among 14 women's leagues formally admitted into the European Leagues association — a continent-wide governance milestone.<CiteC t={t} n={79} /></P>
      </LessonCard>
      <LessonCard t={t} country="France" flag="🇫🇷" lesson="A league hanging on one media deal is fragile, pyramid or not">
        <P t={t}>France's football economy has been destabilized twice in five years by broadcast-partner failures: the Mediapro collapse (2020, mid-contract) and the DAZN dispute and exit (2024–25), forcing the league to launch its own direct-to-consumer channel in 2025.<CiteC t={t} n={84} /> Combined with DNCG oversight (France's long-standing independent club-finance auditor — itself a good regulatory model) and PSG's state-linked dominance, France demonstrates that a league whose economics hang on a single volatile media deal is fragile regardless of structure — directly relevant to MLS's single-buyer Apple dependence. On the women's side, Division 1 Féminine was restructured in 2024 under a new professional league body with the "Première Ligue" rebrand — France following the England/Spain playbook of spinning women's football out of pure federation control.<CiteC t={t} n={[79, 84]} /> Lyon's dynasty built the modern women's club game; PSG money followed; men's-institution capture is near-total here too.</P>
      </LessonCard>
      <H3 t={t}>Synthesis: designing a mixed-ownership league</H3>
      <P t={t}>Across the Big Five plus Brazil, every ownership architecture this plan needs already exists — <em>and coexists with the others inside single leagues</em>. The design principles the evidence supports: (1) <Strong t={t}>ownership-form pluralism as explicit policy</Strong> — license the club, regulate the behavior, stay agnostic on the form; supporter-owned clubs build differentiated fan loyalty, borne out by Bundesliga attendance and pricing data. (2) <Strong t={t}>Protect the form, don't mandate it</Strong> — a US 50+1 mandate is politically impossible against incumbent capital, but protections for clubs that choose member ownership (golden shares, supporter right-of-first-refusal on sale or relocation, heritage locks on name, crest, colors) are achievable and create the choice architecture for fan ownership to grow organically. (3) <Strong t={t}>Ex ante cost control</Strong> (La Liga) over ex post punishment (England). (4) <Strong t={t}>An independent financial auditor</Strong> (DNCG) rather than league-committee self-policing. (5) <Strong t={t}>Media-revenue concentration limits</Strong> — no single buyer above a fixed share of rights, and no PE sale of league media equity without a supermajority of clubs plus a supporter-representation mechanism: the German fans' February 2024 victory, codified.</P>
      <OwnershipMatrix t={t} />
    </Section>
  );
}

/* ============================================================
   SECTION 4 — CONTINENTAL LAYERS (Parts IV + V-B)
   ============================================================ */
function S4({ t }) {
  return (
    <Section t={t} num="04" kicker="PARTS IV + V-B" title="Continental layers: the UCL's job & Brazil's blueprint">
      <H3 t={t}>What the Champions League actually does for Europe</H3>
      <P t={t}>It converts domestic league position into a continental jackpot, making every national league's qualification race meaningful — the incentive engine of 55 domestic leagues simultaneously. The scale (2024/25, first season of the 36-team format): total men's club-competition revenue of €4.4B, with €3.4B distributed to clubs; each league-phase club receives a guaranteed ~€18.6M plus performance pay (~€2.1M per win), and deep runs are worth well north of €100M.<CiteC t={t} n={[49, 50, 51]} /> Crucially, UEFA commits 10% of gross competition revenue to solidarity — €308M in 2024/25 to clubs <em>not</em> in the league phases, up 76% year-on-year, routed to youth development.<CiteC t={t} n={49} /> This is the redistribution layer the closed US model lacks entirely. The dark side is instructive too: UCL money is the primary driver of domestic competitive imbalance across Europe — the same clubs qualify, compound their advantage, and (as the 2021 Super League attempt showed) eventually try to close the system from the top. Any US continental layer needs distribution caps from day one or it recreates the parked-money dynamic one level up.</P>
      <UclChart t={t} />
      <P t={t}>The US analog isn't hypothetical: the CONCACAF Champions Cup exists, and Leagues Cup is a nascent US–Mexico layer. A "USSF Champions League" is better understood as a domestic inter-divisional and inter-regional competition — closer to an FA Cup + UCL hybrid — giving lower-pyramid clubs revenue events and regionalized divisions a national narrative. The neglected asset here is the US Open Cup (Section 06): it already provides open, all-pyramid competition, and reviving it is the cheapest possible pilot of this entire thesis.</P>
      <H3 t={t}>Brazil: the continental-scale case study</H3>
      <P t={t}>Brazil is the only footballing nation that shares the United States' defining constraint — continental geography — and it has solved (and mis-solved) nearly every problem in this brief. It runs <Strong t={t}>two simultaneous, independent pyramid systems</Strong>, and clubs compete in both every year: the national pyramid (CBF-run Séries A–D, connected by promotion and relegation, May–December) and 27 state pyramids (each state federation runs its own multi-tier championship, January–April in the big-club states).<CiteC t={t} n={68} /> Flamengo can be winning Série A nationally while another club is relegated within its own state league — the systems touch only at defined gateways, and the gateways are the genius of the design: the best-placed state clubs not already in Séries A–C qualify annually for Série D, and state placement feeds the Copa do Brasil, which pays meaningful prize money down the pyramid and offers a Libertadores berth.</P>
      <BrazilPyramid t={t} />
      <P t={t}><Strong t={t}>Translation to the US:</Strong> Brazil is the existence proof for the state-based design — state-level competition as the base layer, national divisions on top, automatic annual qualification gateways between them. The US already has 50+ state associations under USSF and adult amateur state cups; what's missing is the gateway (a Série D equivalent that state champions qualify into) and the incentive (Open Cup berths plus prize money flowing to state winners). The NPSL and USL League Two are proto-Série-D material.</P>
      <H3 t={t}>The SAF law — Brazil's answer to the ownership-conversion problem</H3>
      <P t={t}>Until 2021, Brazilian clubs were legally non-profit civil associations: tax-exempt, member-governed, unsellable — a century of community rootedness, and eventually catastrophic debt at giants like Botafogo, Cruzeiro, and Vasco. <Strong t={t}>Law 14.193/2021 created the Sociedade Anônima do Futebol (SAF)</Strong> — a purpose-built football corporation form.<CiteC t={t} n={[69, 70]} /> Three formation routes (transform the association; spin off football operations into a new SAF with the association as parent shareholder; found from scratch), with the SAF inheriting the club's competition rights and identity. The debt architecture is the clever part: a centralized judicial execution regime pools legacy creditors, and the SAF dedicates 20% of revenues to servicing old obligations — investors buy the future without the past ambushing them. SAFs can issue regulated securities including dedicated football debentures, and mandatory boards and fiscal councils set a governance floor the old model lacked.<CiteC t={t} n={70} /></P>
      <P t={t}>Results after four operating years: roughly a third of Série A converted or attracted investment — Botafogo (John Textor; Libertadores champions 2024), Cruzeiro, Bahia (City Football Group), Atlético-MG, Fortaleza — while <Strong t={t}>Vasco's 777 Partners deal collapsed with control returned to the association by court order in 2024</Strong>, the PE failure case, on schedule.<CiteC t={t} n={[69, 71]} /> Crucially, SAFs, traditional member-owned associations (Flamengo and Palmeiras, the two financially strongest clubs, remain associations by choice), and pre-existing corporations (Red Bull Bragantino) all compete in the same league: ownership pluralism, statutorily enabled, competitively neutral. Série A's average operating revenue grew 73% from 2015–2024 to €69.3M — now sixth globally, ahead of the EFL Championship, Eredivisie, and Primeira Liga.<CiteC t={t} n={71} /> An American analog — a Community Club Conversion framework — could run in the opposite direction: giving investor-owned franchises a tax- and governance-advantaged path to <em>partial member ownership</em>, and giving new pyramid clubs a standard form with supporter golden shares baked in.</P>
      <P t={t}><Strong t={t}>Brazil's warnings:</Strong> calendar cannibalism (state + national + cup + continental yields 70+ match seasons — cap the base layer's claim on top-division squads); vestigial-institution drag (state federations are century-old political fiefdoms — design sunset and review clauses); corporate form is not competence (the four-year SAF review is blunt: legal reform brought capital, not automatically discipline<CiteC t={t} n={71} />); and the export-economy trap — funding the pyramid by selling every good player to Europe reproduces the national-team ceiling. Domestic wage growth, the thing pro/rel-driven investment races produce, is the counterweight.</P>
    </Section>
  );
}

/* ============================================================
   SECTION 5 — SCALE THESIS (Part V)
   ============================================================ */
function S5({ t }) {
  return (
    <Section t={t} num="05" kicker="PART V" title="The scale thesis, stress-tested">
      <Lead t={t}>The directional claim holds: <Strong t={t}>the US is continent-scaled but league-structured like a single mid-sized country.</Strong> England fits inside New York State and supports 92 fully professional clubs plus thousands below; the entire US supports roughly 90–100 professional men's clubs across a landmass 60x larger.</Lead>
      <ScaleChart t={t} />
      <P t={t}>Two honest caveats sharpen rather than weaken the argument. First, <Strong t={t}>population density, not just landmass, is the binding constraint</Strong>: Europe has 2.2x the US population on similar land, so the right comparison set is "state = country" — California (~39M) against Spain or Poland; Texas (~31M) against Australia-plus; Florida (~23M) against the Netherlands and Belgium combined. Each of those European comparators sustains a full professional pyramid with pro/rel. On a per-capita basis the US pro-club deficit is roughly 5–8x versus Western Europe — enormous, but the "each state as a footballing country" framing should be pitched on population, where it is bulletproof, rather than area alone.</P>
      <P t={t}>Second, <Strong t={t}>travel economics genuinely break the naive pyramid.</Strong> A national US third division is a flight league; a national English third division is a bus league. Regionalizing below tier ~2 is not a compromise but a requirement — which is why USL Premier's single national table at D1 is rational (the top tier can afford flights) while regional splits belong at D3/D4 and throughout youth. Mexico and Brazil are the working precedents for regionalized lower tiers under national upper tiers on continental landmasses — and Brazil (Section 04) is the single best structural comparator for the US.</P>
    </Section>
  );
}

/* ============================================================
   SECTION 6 — OPEN CUP (Part IV-B)
   ============================================================ */
function S6({ t }) {
  return (
    <Section t={t} num="06" kicker="PART IV-B" title="The Lamar Hunt U.S. Open Cup: full analysis">
      <Lead t={t}>The oldest ongoing national soccer competition in the United States — first contested 1913–14 as the National Challenge Cup, played for the Dewar Challenge Trophy, consciously modeled on the FA Cup: <Strong t={t}>open to every affiliated team in the country, amateur or professional</Strong>, single elimination.<CiteC t={t} n={[59, 60]} /> Renamed for Lamar Hunt in 1999.</Lead>
      <P t={t}>Current mechanics: roughly 100 clubs from MLS, USL Championship, USL League One, MLS Next Pro, NISA, and the amateur Open Division (which, per a July 2025 USSF change, now enters entirely through qualifying rounds).<CiteC t={t} n={[59, 61]} /> Lower divisions enter early; MLS enters late (in 2025, 16 MLS teams at the fourth round, with entry coordinated against Champions Cup and Leagues Cup commitments). The winner earns a CONCACAF Champions Cup berth. A 2016 rule bars teams majority-owned by a higher-tier club — the anti-reserve-team firewall that made the 2023 MLS Next Pro gambit a rule-change request rather than a default right.<CiteC t={t} n={59} /></P>
      <TimelineStrip t={t} title="FOUR ERAS OF THE CUP" items={[
        { when: "1914–1950s · Industrial era", what: "The Cup was American soccer's national championship. Bethlehem Steel (5 titles by 1926) and Fall River Marksmen (5 by 1931) were company-town powerhouses. Foundational warning: in 1928 the American Soccer League barred its clubs from the Cup ('the Soccer War') in a power struggle with the federation — the conflict helped collapse the ASL and bury American soccer for two generations." },
        { when: "1950s–1980s · Ethnic-club era", what: "German-American, Greek-American, Italian-American, and Maccabee clubs kept the Cup alive as the pro game withered; Maccabee LA won five titles (1973–81); Greek American AA's three-peat (1967–69) still stands. The NASL almost entirely ignored the Cup — and had no roots when its TV money vanished." },
        { when: "1996–2022 · MLS era", what: "MLS entered from its first season, restoring a true national championship; all US-based MLS teams received automatic berths from 2012. MLS sides have won every edition since Rochester Rhinos (USL) in 1999 — the fact that defines both the Cup's problem and its romance. Sacramento Republic (USL Championship) reaching the 2022 final is the modern high-water mark for the underdogs." },
        { when: "2023– · Crisis & rescue era", what: "The MLS withdrawal war, the USSF's partial stand, and the 2025–26 reform package — detailed below.", tone: "warn" },
      ]} caption="Sources: [59][60][67]" />
      <H3 t={t}>Finances and incentives — the political economy of the Cup</H3>
      <P t={t}>The real economics are hosting economics. For USL and amateur clubs, a home draw against an MLS side is often the biggest gate of the season — USL leadership said plainly during the 2024 crisis that these matches are "some of the biggest games of the season... especially in terms of revenue."<CiteC t={t} n={66} /> Meanwhile MLS clubs privately argued they <em>lose</em> money on Cup participation (midweek fixtures, small away venues, no broadcast return).<CiteC t={t} n={65} /> <Strong t={t}>This asymmetry is the whole political economy of the Cup:</Strong> its value flows down the pyramid while its costs fall on the top — exactly what a closed-league operator has no reason to fund, and an open pyramid would treat as core solidarity infrastructure. Broadcast has been the chronic failure: no coherent central rights package, matches scattered across streams, no marketing budget comparable to Leagues Cup (which MLS co-owns and placed on its own Apple platform). The underexposure is a choice, not a market verdict.</P>
      <PrizeChart t={t} />
      <H3 t={t}>The 2023–24 war, blow by blow — because it maps the power structure</H3>
      <TimelineStrip t={t} title="SIX MOVES THAT DECIDED THE CUP'S SURVIVAL" items={[
        { when: "May 2023", what: "Commissioner Garber publicly calls the Cup 'a very poor reflection on what it is that we're trying to do with soccer at the highest level.'", tone: "danger" },
        { when: "Dec 15, 2023", what: "MLS Board of Governors votes to withdraw first teams from the 2024 Cup, proposing MLS Next Pro reserve teams instead — framed as fixture congestion, while the four-year-old Leagues Cup adds more fixtures than the Cup ever did.", tone: "danger" },
        { when: "Dec 20, 2023", what: "USSF's Pro League Taskforce denies the waiver. Backlash is universal — the Independent Supporters Council condemns, USL sides openly with fans: 'We stand with fans across the country who want to see it remain an authentic and inclusive competition.'" },
        { when: "Jan–Feb 2024", what: "Private USSF–MLS talks reopen what fans thought settled. Open Cup Committee chair Duncan Mattson, told to 'stand down' from a rules-based resolution, resigns in protest: 'I would never allow MLS to pick and choose the rules and policies that they follow.'", tone: "warn" },
        { when: "Mar 1, 2024", what: "Compromise: only 8 MLS senior teams enter 2024; 11 MLS Next Pro sides fill in; CONCACAF-participating clubs sit out entirely.", tone: "warn" },
        { when: "2025–26", what: "Partial restoration: 16 MLS teams enter; defending champion LAFC becomes the first modern holder not to defend (Champions Cup priority); prize money doubles for 2026; Nashville SC wins the 2025 final over Austin FC — its first-ever trophy, marketed heavily by the club itself." },
      ]} caption="Sources: [63][64][65][66] — what the war proved: (a) the USSF bends to MLS in private even after standing firm in public — governance capture, quantified; (b) organized public opinion moved the outcome; (c) MLS's objection is economic, not principled — which means it is purchasable." />
      <H3 t={t}>Attempts to become an FA Cup — failed and successful</H3>
      <P t={t}><Strong t={t}>Failed or stalled:</Strong> prize scaling to relevance (even doubled, $600K cannot move an MLS roster decision — the FA Cup's pull rests on nine figures of distributed value plus a Wembley final); broadcast packaging (repeated USSF efforts never produced a marquee deal, no free-to-air showcase that makes cup upsets national events); scheduling dignity (midweek graveyard slots, finals at the finalist's stadium rather than a neutral cathedral, constant calendar subordination); and the 2023 reserve-team dilution attempt — beaten back, but brand damage the FA Cup has never suffered.</P>
      <P t={t}><Strong t={t}>Successful or promising:</Strong> surviving 1928 and 2023 — institutional persistence is itself the asset, 100+ editions minus only the COVID years is a heritage moat no new competition can buy; the 2016 reserve-team ban, protecting authenticity a decade before it was tested; the upset economy (Sacramento 2022, the annual amateur "cupset" cycle, a devoted independent media ecosystem — TheCup.us has covered it for decades<CiteC t={t} n={60} />); and the 2025–26 reforms — prize doubling, the Motta Trophy, cleaner Open Division qualifying, coordinated MLS entry: the first coherent USSF investment package in the Cup's modern history.<CiteC t={t} n={61} /> Most important is the USL alignment: with USL Premier launching in 2028, the Cup becomes the venue where the two rival D1s can actually meet. <Strong t={t}>A USL Premier side beating MLS opposition in a well-broadcast Cup run is the single highest-leverage narrative event available to the open-pyramid movement.</Strong> The Cup is where the league war becomes legible to casual fans.</P>
      <PullQuote t={t} attr="Reform package recommended by this brief — feeds the roadmap in Section 07">
        Ring-fenced free-to-air broadcast deal; a permanent neutral-venue final rotated among iconic stadiums; a prize fund tied to a fixed percentage of USSF commercial revenue so it self-scales; guaranteed lower-seed hosting through the Round of 32; and a solidarity kicker — every Cup gate involving a top-two-division club shares a fixed percentage with the lower-division participant's academy.
      </PullQuote>
    </Section>
  );
}

/* ============================================================
   SECTION 7 — ASSESSMENT + TIMELINE (Parts VI + VII)
   ============================================================ */
function S7({ t }) {
  return (
    <Section t={t} num="07" kicker="PARTS VI + VII" title="The plan, the assessment, and the 30-year runway">
      <H3 t={t}>The plan, restated</H3>
      <P t={t}>(1) Dissolve the franchise model at D1. (2) Unify the ladder under single men's and women's brands with tiered naming. (3) Go regional below ~tier 2; regionalize youth aggressively. (4) Rebuild financial incentives around responsible ownership and sporting merit rather than VC/PE asset appreciation. (5) Add a domestic champions-league layer. (6) Compensate incumbent franchise buyers — money talks.</P>
      <H3 t={t}>Dissolution — reframe it as convergence</H3>
      <P t={t}>There is no lever to dissolve MLS involuntarily. The antitrust route just failed (<em>NASL v. USSF</em>, jury verdict for the federation and MLS, February 2025<CiteC t={t} n={27} />); Congress isn't touching it; USSF revoking MLS's D1 sanction is legally possible but politically unthinkable. The realistic version is <Strong t={t}>convergence under competitive and regulatory pressure</Strong>, via three mechanisms: the <Strong t={t}>USL flank</Strong> (market pressure — if USL Premier works, MLS faces a rival selling jeopardy and open access, the product it can't copy without restructuring; NWSL's draft abolition under WSL pressure is the proven template); the <Strong t={t}>PLS lever</Strong> (regulatory — USSF could amend Professional League Standards over a 10–15 year horizon to require pyramid interconnection, minimum solidarity distributions, or academy-access standards as conditions of D1 sanctioning, grandfathering incumbents on a schedule; post-<em>NASL</em>, USSF's discretion is legally fortified — the barrier is board politics); and the <Strong t={t}>licensing bridge</Strong> (the WSL mechanism — a future MLS–USL accommodation could give incumbents guaranteed top-flight status for N years, their fee treated as having purchased that license period, while pro/rel operates beneath and phases upward: closed launch → stitched pyramid → merit takeover, the only transition mechanism with a real-world success record).</P>
      <H3 t={t}>Compensation — the actual math</H3>
      <EquityChart t={t} />
      <P t={t}>You cannot refund your way out; you must <em>convert</em>. Options, in rough order of viability: (1) <Strong t={t}>Equity conversion</Strong> — franchise stakes convert into shares of a unified league media/commercial entity, the thing that actually generates the value; owners keep the asset while the sporting layer opens underneath (the Premier League is itself a company whose shareholders are its member clubs — relegated clubs surrender their share to the promoted club, and English club values survived fine). Brazil's SAF law is the statutory template for this kind of voluntary, incentive-laden conversion.<CiteC t={t} n={[69, 70]} /> (2) <Strong t={t}>Time-limited immunity licenses</Strong> — e.g., ten seasons of guaranteed D1 status post-unification, tradeable, decaying, pricing the fee as a term purchase. (3) <Strong t={t}>Relegation insurance and parachute design</Strong> — guaranteed multi-year revenue floors for relegated founding members, funded by the larger unified media pool: England's concept, capped and sunset to avoid England's distortion. (4) <Strong t={t}>Fan and community buyback provisions</Strong> — right-of-first-refusal for supporter trusts at relegation or sale, Germany-style golden-share protections: politically potent, financially marginal to incumbents, so pair it with 1–3 rather than leading with it. The pitch to owners must be EPL-shaped: <em>the open pyramid is worth more</em> — more clubs, more markets, more matches of consequence, promotion races and relegation battles as premium inventory. The Premier League's founders broke away to get richer and accidentally proved jeopardy sells; the American unification case is "get richer on purpose."</P>
      <H3 t={t}>Branding, regionalization, financial redesign, and the champions layer</H3>
      <P t={t}><Strong t={t}>Branding — two flags.</Strong> An MLS masterbrand assumes MLS wins the coming decade; if USL Premier succeeds, the better-branded league may not be MLS — keep the naming architecture league-agnostic. And on the women's side, a derivative "W" brand would subordinate what is currently the <em>stronger</em> global property: NWSL out-earns and out-values nearly every women's league on earth and just set the global standard on player freedom. The NBA/WNBA pattern — the appended W as a permanent junior-partner marker — is exactly what to avoid. The women's pyramid needs <em>interconnection</em> (NWSL + USL Super League), not renaming, with NWSL treated as the brand asset. Each game stands on its own merits; neither serves as a farm system or a marketing appendage for the other.</P>
      <P t={t}><Strong t={t}>Regionalization</Strong> is the strongest element, essentially unopposed by evidence — it attacks pay-to-play at its cost driver (travel) rather than its symptom (fees), pairs with the domestic money loop to give regional clubs a business model beyond parent invoices, and is achievable without anyone's permission: state associations, USL League Two, NPSL, and community clubs can densify now. <Strong t={t}>Financial redesign</Strong> instruments all exist somewhere in Europe today: squad-cost ratios over after-the-fact loss limits; pooled broadcast revenue with a fixed pyramid share written into founding documents (Parry's 25% is the reference number); standardized relegation wage-adjustment clauses (kills the cliff edge); fit-and-proper ownership tests plus multi-club limits; a solidarity levy on all transfer fees. <Strong t={t}>The champions layer</Strong> starts with the Open Cup (Section 06), then a regional interdivisional competition — building the UCL analog only once the pyramid exists to feed it, with its distribution share capped from day one.</P>
      <RiskTable t={t} />
      <H3 t={t}>What history gives us, condensed</H3>
      <P t={t}>1992 England: commercial concentration and an open pyramid can coexist; jeopardy is monetizable; write redistribution into the constitution or the state eventually writes it for you. 2018 WSL: licensing is the working bridge from closed to open; expect a Sunderland — an incumbent that loses out and screams — and survive it. 2019–24 NWSL: open-system competition forces closed-system liberalization faster than any lawsuit. 2025 NASL v. USSF: the courts will not open the pyramid for you. 2025–28 USL: the experiment is running; the near-term job is to help it succeed, because every subsequent argument depends on its results. 2026 World Cup: a home tournament, record goals, a group win, a knockout win — and the same Ro16 ceiling. The pipeline is the constraint, and the pipeline is Sections 02 and 05.</P>
      <H3 t={t}>The 30-year runway</H3>
      <P t={t}>The hosting clock sets the outer deadline: 2030 is Iberia/Morocco, 2034 is Saudi Arabia, and under confederation-rotation norms CONCACAF's earliest realistic re-entry is 2038 — but the <em>modal</em> window for a North American men's World Cup return is <Strong t={t}>2046 or 2050</Strong> — so the pyramid must be functioning by the late 2030s for a full development generation (a 2040 six-year-old is a 2056 twenty-two-year-old) to pass through it.<CiteC t={t} n={85} /></P>
      <Gantt t={t} />
      <P t={t}><Strong t={t}>Phase 0 (2026–2030), the proof window:</Strong> MLS sprint season and calendar flip; USL Premier launches with pro/rel; NWSL cap escalation and the HIP-rule labor resolution; the Open Cup's doubled prize fund beds in; the 2028 LA Olympics keeps investment warm. What the mission needs: USL Premier launching with 12+ compliant stadiums and surviving its first relegations without an insolvency; at least one USL-vs-MLS Cup moment breaking into mainstream coverage; the women's interconnection question at least being asked publicly. Plausibility of an adequate landing: ~60–70%, with the stadium chokepoint the main hazard.</P>
      <P t={t}><Strong t={t}>Phase 1 (2028–2034), competitive pressure:</Strong> the two-D1 era. Expected dynamics from every precedent in this brief: MLS responds with selective convergence (calendar already; likely next, spending liberalization, possibly Open Cup recommitment) while defending closed membership; the women's game runs the same play at faster clock speed; the Open Cup becomes the annual referendum. Markers to watch: USL Premier attendance and media versus baseline; the first pro/rel miracle-club story; whether MLS's single-table flirtation extends toward any sporting consequence for finishing last; USSF board composition and whether PLS review opens. Plausibility that an open pyramid is demonstrably viable by ~2034: ~50% — a coin flip, resolved mostly by Phase 0.</P>
      <P t={t}><Strong t={t}>Phase 2 (2033–2041), the unification window:</Strong> is structural transformation plausible within 10–15 years? The full plan — a single unified branded ladder, franchise model dissolved — is unlikely on that clock (~10–15%). A <em>functionally open pyramid</em> is genuinely plausible (~40–50%), via three routes in ascending ambition: a parallel-pyramid equilibrium (MLS closed at top, USL running the open pyramid beside it, the Open Cup and CONCACAF places arbitrating — not the full plan, but perhaps 60% of the developmental benefit, because the pyramid's <em>existence</em>, not MLS's participation, is what multiplies clubs and free academies); convergence-by-accommodation (interleague play → Cup integration → pro/rel between MLS Next Pro-tier and USL tiers → conditional access to MLS itself, likely triggered by the post-Apple media renegotiation in the early 2030s, with the WSL precedent saying the licensing bridge takes ~7 years from decision to full merit operation — a ~2033 decision completes by ~2040); and regulatory forcing (post-2026-cycle USSF leadership amends the PLS to require pyramid interconnection on a 10-year grandfathered schedule — legally fortified, politically the longest shot, unless routes one and two have already shifted incentives, in which case regulation ratifies rather than forces). The youth and Open Cup tracks run faster than the league track and shouldn't wait for it: domestic training-compensation reform, state-gateway competitions, and Cup reform are all achievable inside 10 years because they don't require incumbents to surrender anything material.</P>
      <P t={t}><Strong t={t}>Phase 3 (2041–2056), maturation:</Strong> two full pro/rel cycles without systemic insolvency; club-count growth from ~100 to a 300–500 professional and semi-pro band (roughly Argentine, not English, density — the realistic per-capita target); free-to-play elite youth as the norm within pyramid-club academies, pay-to-play surviving only as a genuine recreational tier; and the women's pyramid reaching the same state on its own brand equity. <Strong t={t}>Composite plausibility of the end-state — a legitimate footballing nation with an open, dense, largely free-to-develop pyramid by a ~2050 World Cup return: ~35–45%</Strong>, with USL Premier's launch the largest swing factor and the youth money loop the second. The strategic corollary: the controllable near-term work is not persuading MLS — it's making USL Premier succeed, reforming the Open Cup and youth funding through USSF channels, and building the intellectual and public case so that when the forcing events arrive — the post-Apple media negotiation, the post-World Cup USSF election cycle, the first USL giant-killing — the open-pyramid position has a fully drafted, financially literate plan waiting.</P>
    </Section>
  );
}

/* ============================================================
   SECTION 8 — BIBLIOGRAPHY (all 85 entries)
   ============================================================ */
const BIB = [
  { group: "2026 World Cup", items: [
    [1, "Yahoo Sports — \"USA soccer's 2026 World Cup run ends: USMNT round of 16 history\"", "https://sports.yahoo.com/articles/usa-soccers-2026-world-cup-025122190.html"],
    [2, "U.S. Soccer — \"USMNT vs. Belgium: Match Recap, World Cup Round of 16\"", "https://www.ussoccer.com/stories/2026/07/usmnt/match-recap-highlights-vs-belgium-world-cup-round-of-16"],
    [3, "NPR — \"The U.S. men's run at the World Cup ends with a 4-1 Round of 16 loss to Belgium\"", "https://www.npr.org/2026/07/06/nx-s1-5883842/2026-world-cup-fifa-usmnt-belgium-round-of-16"],
    [4, "Yahoo Sports — \"2026 World Cup results, standings and schedule\"", "https://sports.yahoo.com/soccer/article/2026-world-cup-results-standings-and-schedule-live-scores-group-stage-updates-and-how-to-watch-050724193.html"],
  ]},
  { group: "MLS", items: [
    [5, "Sportico — \"MLS Inks $500 Million Expansion Fee to Add San Diego Team\" (2023)", "https://www.sportico.com/business/team-sales/2023/mls-san-diego-expansion-fee-1234723087/"],
    [6, "Wikipedia — \"Expansion of Major League Soccer\" (fee history)", "https://en.wikipedia.org/wiki/Expansion_of_Major_League_Soccer"],
    [7, "Front Office Sports — \"$500M San Diego FC Debut Highlights Surging MLS Valuations\"", "https://frontofficesports.com/500m-san-diego-fc-debut-highlights-surging-mls-valuations/"],
    [8, "MLSsoccer.com — \"MLS to align calendar with top leagues around the world\" (Nov 13, 2025 BoG vote)", "https://www.mlssoccer.com/news/mls-to-align-calendar-with-top-leagues-around-world"],
    [9, "Wikipedia — \"2027 Major League Soccer season\" (sprint season)", "https://en.wikipedia.org/wiki/2027_Major_League_Soccer_season"],
    [10, "Wikipedia — \"2027–28 Major League Soccer season\"", "https://en.wikipedia.org/wiki/2027%E2%80%9328_Major_League_Soccer_season"],
    [11, "Sounder at Heart — \"MLS owners agree to shift schedule in 2027\"", "https://www.sounderatheart.com/2025/11/mls-owners-agree-to-shift-schedule-in-2027/"],
    [12, "Fraser v. Major League Soccer, 284 F.3d 47 (1st Cir. 2002) — single-entity antitrust ruling", "https://en.wikipedia.org/wiki/Fraser_v._Major_League_Soccer", true],
  ]},
  { group: "NWSL", items: [
    [13, "CNBC — \"Denver awarded NWSL's 16th franchise at record $110 million expansion fee\"", "https://www.cnbc.com/2025/01/30/denver-awarded-nwsl-franchise.html"],
    [14, "ESPN — \"NWSL, players agree on new CBA with no draft, better pay\" (2024)", "https://www.espn.com/soccer/story/_/id/40945371/nwsl-players-agree-cba-no-draft-expanded-leave"],
    [15, "ESPN — \"Inside the NWSL's new CBA: Free agency, revenue sharing, more\"", "https://www.espn.com/soccer/story/_/id/41400681/nwsl-2024-cba-draft-free-agency-charter-flights-health-coverage-revenue-sharing"],
    [16, "NWSLPA — \"CBA\" (union's own summary)", "https://www.nwslplayers.com/cba"],
    [17, "Athlete Advisor Match — \"NWSL Player Financial Planning Guide 2026\" (HIP rule Dec 2025; grievance Jan 2026)", "https://financial-advisors-for-athletes.com/guides/nwsl-financial-planning/"],
    [18, "Wikipedia — \"Denver Summit FC\"", "https://en.wikipedia.org/wiki/Denver_Summit_FC"],
    [19, "WUSA (2001–03) and WPS (played 2009–11, folded 2012) league histories", "https://en.wikipedia.org/wiki/Women%27s_Professional_Soccer", true],
  ]},
  { group: "USL / sanctioning / antitrust", items: [
    [20, "USL — \"Promotion & Relegation\" (official FAQ)", "https://www.uslsoccer.com/promotion-relegation"],
    [21, "USL — \"USL Announces USL Premier, New Interconnected Men's Professional Structure\" (Jan 2026)", "https://www.uslsoccer.com/news_article/show/1354227"],
    [22, "USL — \"United Soccer League Adopts Promotion and Relegation System\" (Mar 19, 2025)", "https://www.uslsoccer.com/news_article/show/1334700"],
    [23, "Wikipedia — \"USL Premier\" (NASL v. USSF context; stadium projects; Scholes hire)", "https://en.wikipedia.org/wiki/USL_Premier"],
    [24, "FOX Sports — \"USL Announces Plans To Launch 'Premier' League In 2028\"", "https://www.foxsports.com/stories/soccer/usl-announces-premier-division-one-mens-league-details-promotion-relegation-plan"],
    [25, "Wikipedia — \"United States soccer league system\" (PLS requirements)", "https://en.wikipedia.org/wiki/United_States_soccer_league_system"],
    [26, "Goal — \"USL's plans to launch a Division One league: opportunity and uncertainty\"", "https://www.goal.com/en-us/lists/set-their-own-course-of-destiny-usl-s-plans-to-launch-a-division-one-league-presents-both-opportunity-uncertainty-for-club-owners/bltaa79ec4ff3af69f2"],
    [27, "Villanova Sports Law — \"A Monopoly on American Soccer: The USL's Plan to Break the Hold of MLS\"", "https://www.novasportslaw.com/post/a-monopoly-on-american-soccer-the-usl-s-plan-to-break-the-hold-of-mls"],
    [28, "Hudson River Blue — \"USL will introduce promotion and relegation\"", "https://www.hudsonriverblue.com/usl-will-introduce-promotion-and-relegation-in-2028-usl-division-one-usl-championship/"],
  ]},
  { group: "Youth soccer", items: [
    [29, "One Beat Soccer — \"How Much Does Youth Soccer Cost? A Complete Breakdown by Level\"", "https://onebeatsoccer.com/youth-soccer-costs/"],
    [30, "Solstice FC — \"The True Cost of Youth Soccer in America (And What It Should Be)\"", "https://solsticefc.com/blog/true-cost-of-youth-soccer"],
    [31, "Solstice FC — \"ECNL vs MLS NEXT: Costs, Commitment, and What Parents Should Know\"", "https://solsticefc.com/blog/ecnl-vs-mls-next"],
    [32, "ClubScout — \"Compare All Youth Soccer Leagues: The Complete Table (2026)\"", "https://myclubscout.com/blog/compare-youth-soccer-leagues"],
    [33, "Play Club Soccer — \"Inside the Top Youth Soccer Academies: MLS Next and ECNL Pathways\"", "https://playclubsoccer.org/blog/inside-the-top-youth-soccer-academies-the-realities-of-mls-next-and-ecnl-pathways"],
    [34, "US Soccer Parent — \"Costs of Youth Soccer: What Parents Should Know\"", "https://ussoccerparent.com/costs-of-youth-soccer/"],
  ]},
  { group: "Training compensation / solidarity", items: [
    [35, "ESPN — \"MLS clubs to receive solidarity payments after league agrees to follow FIFA rule\" (Apr 2019)", "https://www.espn.com/soccer/story/_/id/37571924/mls-clubs-receive-solidarity-payments-league-agrees-follow-fifa-rule"],
    [36, "ESPN — \"What does adoption of training compensation, solidarity payments mean for MLS?\"", "https://www.espn.com/soccer/story/_/id/37508312/what-does-adoption-training-compensation-solidarity-payments-mean-mls"],
    [37, "MLSPA — \"Q&A: Training Compensation and Solidarity Payments\" (union opposition)", "https://mlsplayers.org/news/training-compensation-and-solidarity-payments"],
    [38, "Beyond the 90 — \"Solidarity Payments and Training Compensation can change the game in the US\"", "https://beyondthe90.substack.com/p/solidarity-payments-and-training"],
  ]},
  { group: "England — Premier League / EFL", items: [
    [39, "Wikipedia — \"Premier League\" (formation, collective selling, TV deal)", "https://en.wikipedia.org/wiki/Premier_League"],
    [40, "Wikipedia — \"Foundation of the Premier League\"", "https://en.wikipedia.org/wiki/Foundation_of_the_Premier_League"],
    [41, "GiveMeSport — \"Why the Premier League was Formed in 1992\"", "https://www.givemesport.com/why-the-premier-league-was-formed-in-1992/"],
    [42, "FourFourTwo — \"How the Premier League breakaway happened: 1992/93 as told by its heroes\"", "https://www.fourfourtwo.com/features/199293-premier-league-first-season-sky-sports-man-utd-champions"],
    [43, "Wikipedia — \"Premier League parachute and solidarity payments\"", "https://en.wikipedia.org/wiki/Premier_League_parachute_and_solidarity_payments"],
    [44, "The Ball Business — \"What Parachute Payments Are and Why Championship Clubs Depend on Them\"", "https://theballbusiness.com/inside-football/what-parachute-payments-are-and-why-championship-clubs-depend-on-them/"],
    [45, "Wilson, Plumley et al. — parachute payments research (Sheffield Hallam / Birkbeck)", "https://shura.shu.ac.uk/17115/3/Wilson-ParachutePaymentsInEnglishFootball(AM).pdf"],
  ]},
  { group: "England — WSL", items: [
    [46, "Wikipedia — \"Women's Super League\" (2011 launch, 2018 restructure, WSL Football, expansion)", "https://en.wikipedia.org/wiki/Women%27s_Super_League"],
    [47, "On Her Side — \"WSL History\" (application launch; 2018 re-licensing; Sunderland)", "https://www.onherside.co.uk/fa-women-s-super-league"],
    [48, "WSL Football — \"History\" (official timeline)", "https://www.wslfootball.com/history"],
  ]},
  { group: "UEFA / Champions League", items: [
    [49, "UEFA — \"UEFA's 2024/25 financial results: Growing the game at every level\"", "https://www.uefa.com/news-media/news/02a2-1fe83965a42a-37e08e26c799-1000--uefa-s-2024-25-financial-results-growing-the-game-at-every-/"],
    [50, "UEFA — Financial Report 2024/25 (PDF; distribution mechanics)", "https://editorial.uefa.com/resources/02a1-1fcc539a26d9-78ac6793e755-1000/20260113_enclosure_04_financial_report_2024-25_en.pdf"],
    [51, "Finances of Football — \"UEFA Revenue Distribution for the 2025/26 Season\"", "https://www.financesoffootball.com/p/uefa-revenue-distribution-for-the"],
    [52, "Inside World Football — \"UEFA 2024-25 revenue tops €5bn\"", "https://www.insideworldfootball.com/2026/02/16/uefa-2024-25-revenue-tops-e5bn-record-non-euro-year/"],
  ]},
  { group: "Background [K] — v0.1", items: [
    [53, "FIFA Regulations on the Status and Transfer of Players (training compensation; solidarity mechanism)", "https://support.fifatms.com/en/support/solutions/articles/7000097497-solidarity-mechanism", true],
    [54, "Elite Player Performance Plan (EPPP), Premier League, 2012 — England's academy funding system", "https://www.premierleague.com/en/footballandcommunity/youth-development/eppp", true],
    [55, "Bundesliga 50+1 rule; German licensing (DFL Lizenzierungsordnung)", "https://www.dfl.de/en/news/legal-certainty-for-the-501-rule-dfl-executive-committee-adopts-proposal-to-submit-to-the-german-federal-antitrust-office/", true],
    [56, "Brazilian league structure (Séries A–D + state championships) as a continental-scale precedent", "https://en.wikipedia.org/wiki/State_football_leagues_in_Brazil", true],
    [57, "Lamar Hunt U.S. Open Cup (1914–) history", "https://thecup.us/about-the-u-s-open-cup/", true],
    [58, "2030 FIFA World Cup: Spain/Portugal/Morocco + centennial matches; 2034: Saudi Arabia", "https://www.fifa.com/en/tournaments/mens/worldcup/articles/2030-2034-host-nations-confirmed", true],
  ]},
  { group: "U.S. Open Cup (v0.2)", items: [
    [59, "Wikipedia — \"U.S. Open Cup\" (history, format, 2016 reserve rule, 2023–25 MLS saga, Nashville 2025)", "https://en.wikipedia.org/wiki/U.S._Open_Cup"],
    [60, "TheCup.us — \"US Open Cup History: Overview\"", "https://thecup.us/us-open-cup-history/history/"],
    [61, "NPSL — \"2026 U.S. Open Cup\" (doubled prizes; John Motta Trophy; qualifying change)", "https://www.npsl.com/usoc-2026/"],
    [62, "LAFC — \"U.S. Open Cup\" (pre-2026 prize structure; Dewar Trophy)", "https://www.lafc.com/club/competitions/open-cup/"],
    [63, "ESPN — \"MLS withdraws first teams from U.S. Open Cup\" (Dec 15, 2023)", "https://www.espn.com/soccer/story/_/id/39120689/mls-pulls-first-teams-us-open-cup-play-reserves"],
    [64, "CBS Sports — \"U.S. Soccer denies MLS request to send Next Pro teams\" (Dec 20, 2023)", "https://www.cbssports.com/soccer/news/u-s-soccer-denies-mls-request-to-send-next-pro-teams-to-compete-in-2024-open-cup/"],
    [65, "Yahoo Sports — \"MLS–U.S. Open Cup spat begs a provocative question: Who controls U.S. soccer?\"", "https://sports.yahoo.com/us-soccer-mls-open-cup-power-dynamics-184649873.html"],
    [66, "ESPN — \"USL 'disappointed' with handling of MLS–U.S. Open Cup dispute\"", "https://www.espn.com/soccer/story/_/id/39569649/usl-disappointed-us-open-cup-mls-soccer-dispute"],
    [67, "World Soccer Talk — \"MLS Open Cup stance backfires\" (1928 ASL 'Soccer War' parallel)", "https://worldsoccertalk.com/news/mls-open-cup-stance-backfires-as-ussf-blocks-next-pro-teams-20231220-WST-478030.html"],
  ]},
  { group: "Brazil (v0.2)", items: [
    [68, "Wikipedia — \"Brazilian football league system\" (dual pyramids; Série D gateway)", "https://en.wikipedia.org/wiki/Brazilian_football_league_system"],
    [69, "Wikipedia — \"Sociedade Anônima do Futebol\" (Law 14.193/21; conversions; Vasco/777 reversal)", "https://en.wikipedia.org/wiki/Sociedade_An%C3%B4nima_do_Futebol"],
    [70, "International Bar Association — \"Football corporations in Brazil (SAF)\" (legal mechanics)", "https://www.ibanet.org/football-corporations-brazil"],
    [71, "Football Benchmark — \"The SAF law and the changing meaning of success in Brazilian football\"", "https://footballbenchmark.com/w/the-saf-law-and-the-changing-meaning-of-success-in-brazilian-football"],
    [72, "Sporting Maps — \"Brazil Soccer Maps: Série A–D\" (dual-league participation)", "https://www.sportingmaps.com/soccer/americas/brazil"],
  ]},
  { group: "Europe: Big Five ownership & women's leagues (v0.2)", items: [
    [73, "Wikipedia — \"50+1 rule\" (mechanics; exceptions; Hoffenheim reversal Nov 2024)", "https://en.wikipedia.org/wiki/50%2B1_rule"],
    [74, "Forbes — \"Bundesliga Investor Deal Axed Amid Fan Protests\" (Feb 2024)", "https://www.forbes.com/sites/manuelveth/2024/02/21/bundesliga-investor-deal-axed-amidst-fan-protests/"],
    [75, "Fear The Wall — \"The DFL Investment Deal is Off!\" (protest tactics; La Liga/CVC comparison)", "https://www.fearthewall.com/2024/2/21/24079163/report-the-dfl-investment-deal-is-off-bundesliga-borussia-dortmund"],
    [76, "Medium (Elliott) — \"Why England stopped short of the Bundesliga's 50+1 model\" (2025 cartel-office ruling)", "https://medium.com/@charlieelliott635/why-england-stopped-short-of-the-bundesligas-50-1-fan-ownership-model-92cb5bae9ef9"],
    [77, "Wikipedia — \"Frauen-Bundesliga\" (1990 founding; 14 teams; semi-professional status)", "https://en.wikipedia.org/wiki/Frauen-Bundesliga"],
    [78, "Tifosy Capital & Advisory — \"Women's football: Europe's Big 5\" (club census; foundation types)", "https://www.tifosy.com/en/insights/women-s-football-europe-s-big-5-3433"],
    [79, "FIGC — \"Serie A Women joins European Leagues\" (2026 admission of 14 women's leagues)", "https://www.figc.it/en/figc/news/serie-a-women-joins-european-leagues-the-association-of-european-professional-football-leagues-pba59tkl"],
    [80, "Superprof — \"Top 10 Best Women's Soccer Leagues\" (Serie A Femminile pro 2022–23; Première Ligue)", "https://www.superprof.com/blog/best-leagues-womens-soccer/"],
    [81, "Wikipedia — \"Big Five (association football)\" (comparative league economics)", "https://en.wikipedia.org/wiki/Big_Five_(association_football)"],
  ]},
  { group: "Background [K] — v0.2", items: [
    [82, "Spain Sports Law 10/1990 (SAD conversions; four-club member-ownership exemption); La Liga squad-cost limits; La Liga–CVC \"Impulso\" (2021)", "https://en.wikipedia.org/wiki/Sociedad_An%C3%B3nima_Deportiva", true],
    [83, "Liga F professionalization (CSD designation, 2021–22); 2023 players' minimum-salary strike", "https://www.espn.com/soccer/story/_/id/38396486/liga-f-players-strike-called-pay-deal-agreed", true],
    [84, "France: DNCG oversight; Mediapro collapse (2020); DAZN dispute & Ligue 1+ launch (2025); LFFP / \"Première Ligue\" rebrand (2024)", "https://www.sportspro.com/news/ligue-1-lfp-dazn-tv-rights-contract-termination-dtc-channel-may-2025/", true],
    [85, "Serie A ownership landscape (RedBird, Oaktree, Friedkin; municipal-stadium dependence); FIFA hosting rotation post-2026", "https://sports.yahoo.com/articles/future-world-cup-locations-full-123250652.html", true],
  ]},
];

/* Download control for the full brief. Serves the source markdown from the
   site's /public folder (Next.js static-asset pattern) — single source of
   truth, no embedded duplicate. Drop the finalized brief at BRIEF_HREF on
   deploy and this lights up. */
const BRIEF_HREF = "/us-soccer-restructuring-brief.md";
function DownloadBrief({ t }) {
  return (
    <a href={BRIEF_HREF} download
      style={{ display: "flex", alignItems: "center", gap: 12, margin: "6px 0 4px", padding: "14px 16px", borderRadius: t.radius.lg, border: "1px solid " + t.border, background: t.surfaceAlt, textDecoration: "none", minHeight: 56 }}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden style={{ flexShrink: 0 }}>
        <path d="M10 2.5v9m0 0 3.2-3.2M10 11.5 6.8 8.3" stroke={t.primary} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3.5 13.5v2a1.5 1.5 0 0 0 1.5 1.5h10a1.5 1.5 0 0 0 1.5-1.5v-2" stroke={t.muted} strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontFamily: t.font, color: t.text, fontSize: 12.5, fontWeight: 600, letterSpacing: ".3px" }}>Download the full brief</span>
        <span style={{ display: "block", fontFamily: t.font, color: t.muted, fontSize: 11, marginTop: 2 }}>Complete ~11,500-word research document, markdown</span>
      </span>
      <span style={{ fontFamily: t.font, color: t.primary, fontSize: 10.5, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", flexShrink: 0 }}>.MD</span>
    </a>
  );
}

function S8({ t }) {
  return (
    <Section t={t} num="08" kicker="SOURCES" title="Bibliography — 85 sources">
      <P t={t} style={{ color: t.muted, fontSize: 13.5 }}>Web sources retrieved July 15, 2026. Items tagged <Badge t={t} tone="muted">K</Badge> are stable historical or regulatory background; each is linked to a primary or contemporaneous source below. Inline citations throughout this page link here by number.</P>
      <DownloadBrief t={t} />
      {BIB.map((g) => (
        <div key={g.group} style={{ marginTop: 22 }}>
          <div style={{ fontFamily: t.font, color: t.primary, fontSize: 11.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8, borderBottom: "1px solid " + t.border, paddingBottom: 6 }}>{g.group}</div>
          {g.items.map(([n, label, url, k]) => (
            <div key={n} id={"bib-" + n} style={{ display: "flex", gap: 10, padding: "6px 0", scrollMarginTop: 110 }}>
              <span style={{ fontFamily: t.font, color: t.muted, fontSize: 11.5, minWidth: 28, textAlign: "right" }}>{n}.</span>
              <span style={{ fontFamily: t.font, color: t.text, fontSize: 13, lineHeight: 1.55 }}>
                {label}{" "}
                {k && <Badge t={t} tone="muted">K</Badge>}{" "}
                {url && <a className="prose-link" href={url} target="_blank" rel="noreferrer" style={{ fontFamily: t.font, fontSize: 11.5, wordBreak: "break-all" }}>{url.replace("https://", "")}</a>}
              </span>
            </div>
          ))}
        </div>
      ))}
    </Section>
  );
}


/* ============================================================
   APP
   Theme is driven by the site-wide ThemeContext, so the ThemeMenu in the
   brief's NavBar changes the palette everywhere (and persists to storage).
   ============================================================ */
export default function App() {
  const { theme, setTheme } = useTheme();
  const themeId = theme.id;
  const setThemeId = (id) => {
    const next = THEMES.find((th) => th.id === id);
    if (next) setTheme(next);
  };
  const [active, setActive] = useState("mission");
  const t = toRuntime(theme);

  const TABS = [
    { id: "mission", label: "Mission", node: <S1 t={t} /> },
    { id: "closed-system", label: "Closed System", node: <S2 t={t} /> },
    { id: "case-studies", label: "Case Studies", node: <S3 t={t} /> },
    { id: "continental", label: "Continental", node: <S4 t={t} /> },
    { id: "scale", label: "Scale", node: <S5 t={t} /> },
    { id: "open-cup", label: "Open Cup", node: <S6 t={t} /> },
    { id: "assessment", label: "Assessment", node: <S7 t={t} /> },
    { id: "bibliography", label: "Sources", node: <S8 t={t} /> },
  ];

  const jumpingRef = React.useRef(false);
  const jump = (n) => {
    jumpingRef.current = true;
    setActive("bibliography");
    // wait for the panel to mount, then scroll to the entry
    setTimeout(() => {
      const el = document.getElementById("bib-" + n);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 60);
  };

  // Scroll to top whenever the active section changes (dropdown or pager),
  // but not on a citation jump, which scrolls to its own anchor.
  React.useEffect(() => {
    if (jumpingRef.current) { jumpingRef.current = false; return; }
    if (typeof window === "undefined") return;
    // run after the new panel has painted; reset both window and root el
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
    });
  }, [active]);

  const goTab = (id) => { setActive(id); };

  const idx = TABS.findIndex((x) => x.id === active);
  const panel = TABS[idx] || TABS[0];

  return (
    <JumpCtx.Provider value={jump}>
      <div style={{ background: t.bg, minHeight: "100vh", fontFamily: t.font, transition: "background .2s ease" }}>
        <GlobalStyles t={t} />
        <NavBar t={t} tabs={TABS} active={active} setActive={goTab} themeId={themeId} setThemeId={setThemeId} />
        {active === "mission" ? <Masthead t={t} /> : <CompactHeader t={t} label={panel.label} num={idx + 1} total={TABS.length} />}
        <main style={{ maxWidth: 728, margin: "0 auto", padding: "0 16px" }}>
          {panel.node}
          <PanelFooter t={t} idx={idx} tabs={TABS} goTab={goTab} />
        </main>
      </div>
    </JumpCtx.Provider>
  );
}

/* Condensed letterhead shown on every tab except Mission — keeps brand
   present without re-scrolling the full masthead each time. */
function CompactHeader({ t, label, num, total }) {
  return (
    <div style={{ borderBottom: "1px solid " + t.border, background: t.faint }}>
      <div style={{ maxWidth: 728, margin: "0 auto", padding: "11px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontFamily: t.font, fontSize: 9.5, letterSpacing: "2px", color: t.muted }}>RESEARCH BRIEF · V0.2</span>
        <span style={{ marginLeft: "auto", fontFamily: t.font, fontSize: 9.5, letterSpacing: "1.5px", color: t.muted }}>{String(num).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
      </div>
    </div>
  );
}

/* Prev / Next panel pager — thumb-friendly bottom nav */
function PanelFooter({ t, idx, tabs, goTab }) {
  const prev = tabs[idx - 1], next = tabs[idx + 1];
  const btn = (tab, dir) => (
    <button onClick={() => goTab(tab.id)}
      style={{ flex: 1, textAlign: dir === "prev" ? "left" : "right", background: t.surface, border: "1px solid " + t.border, borderRadius: t.radius.md, padding: "12px 14px", cursor: "pointer", minHeight: 56 }}>
      <div style={{ fontFamily: t.font, fontSize: 9, letterSpacing: "2px", color: t.muted, textTransform: "uppercase" }}>{dir === "prev" ? "← Prev" : "Next →"}</div>
      <div style={{ fontFamily: t.font, fontSize: 12.5, color: t.text, fontWeight: 600, marginTop: 3 }}>{tab.label}</div>
    </button>
  );
  return (
    <div style={{ borderTop: "1px solid " + t.border, margin: "8px 0 0", padding: "20px 0 46px" }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {prev ? btn(prev, "prev") : <div style={{ flex: 1 }} />}
        {next ? btn(next, "next") : <div style={{ flex: 1 }} />}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ width: 7, height: 7, background: t.primary, borderRadius: 2 }} />
        <a href="/" style={{ fontFamily: t.font, fontSize: 9.5, letterSpacing: "2.5px", color: t.muted, fontWeight: 300, textDecoration: "none" }}>
          HANNA SAGE · SAGE ADVICE LLC · ← BACK TO SITE
        </a>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------
   Suggested data/side-projects.json entry:
   {
     "id": "us-soccer-brief",
     "title": "Restructuring American Soccer",
     "subtitle": "Business Analysis Brief · Sage Advice LLC",
     "description": "A sourced 30-year restructuring analysis of the US soccer pyramid — franchise economics, pay-to-play youth, five international case studies, and a phased open-pyramid roadmap with 85 cited sources.",
     "technologies": ["Business Analysis", "React", "Recharts", "projection-ui"],
     "liveUrl": "https://hannasage.love/brief",
     "githubUrl": null,
     "featured": false
   }
   ------------------------------------------------------------ */
