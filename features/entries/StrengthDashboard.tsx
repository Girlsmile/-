"use client";

import { useEffect, useMemo, useState } from "react";
import {
  calculateDashboardStats,
  countEntriesByType,
  dateKey,
  formatDate,
  getBenchWeight,
  groupEntriesByDate,
  parseDate
} from "@/features/entries/calculations";
import { ENTRY_TYPES, TYPE_LABELS, TYPE_SHORT_LABELS, type EntryType, type EntryView } from "@/features/entries/types";

/** DashboardAction is a server action accepted by dashboard forms. */
type DashboardAction = (formData: FormData) => Promise<void>;

/** StrengthDashboardProps contains data and server actions for the dashboard. */
type StrengthDashboardProps = {
  /** Current user's persisted entries. */
  entries: EntryView[];
  /** Email address displayed in the top bar. */
  userEmail: string;
  /** Server action used by the create form. */
  createEntryAction: DashboardAction;
  /** Server action used by delete forms. */
  deleteEntryAction: DashboardAction;
  /** Server action used by the logout form. */
  signOutAction: DashboardAction;
};

/** StrengthDashboard renders the protected app experience over server data. */
export function StrengthDashboard(props: StrengthDashboardProps) {
  const [activeFilter, setActiveFilter] = useState<EntryType | "all">("all");
  const [currentMonth, setCurrentMonth] = useState(getInitialMonth(props.entries));
  const stats = useMemo(() => calculateDashboardStats(props.entries, currentMonth), [props.entries, currentMonth]);
  const filteredEntries = useMemo(() => filterEntries(props.entries, activeFilter), [activeFilter, props.entries]);

  useEffect(() => {
    applyStoredTheme();
  }, []);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Strength Log</p>
          <h1>力训记录</h1>
        </div>
        <div className="topbar-actions">
          <span className="user-chip">{props.userEmail}</span>
          <button className="icon-button" onClick={toggleTheme} title="切换主题" type="button">
            ◐
          </button>
          <form action={props.signOutAction}>
            <button className="ghost-button" type="submit">
              登出
            </button>
          </form>
        </div>
      </header>

      <main>
        <StatsGrid stats={stats} currentMonth={currentMonth} />
        <section className="workspace">
          <CalendarPanel currentMonth={currentMonth} entries={props.entries} setCurrentMonth={setCurrentMonth} />
          <EntryForm createEntryAction={props.createEntryAction} />
        </section>
        <section className="analysis-grid">
          <TypeBars entries={props.entries} />
          <BenchSparkline entries={props.entries} />
        </section>
        <RecordsSection
          activeFilter={activeFilter}
          deleteEntryAction={props.deleteEntryAction}
          entries={filteredEntries}
          setActiveFilter={setActiveFilter}
        />
      </main>
    </div>
  );
}

/** StatsGrid renders the four summary metrics. */
function StatsGrid({ stats, currentMonth }: { stats: ReturnType<typeof calculateDashboardStats>; currentMonth: string }) {
  return (
    <section aria-label="训练概览" className="stats-grid">
      <Metric label="训练天数" value={stats.totalDays} detail="已记录打卡" />
      <Metric label="本月打卡" value={stats.monthDays} detail={`${currentMonth.replace("-", "年")}月`} />
      <Metric label="最长连续" value={stats.bestStreak} detail="天" />
      <Metric label="卧推最高工作组" value={stats.benchMax ? `${stats.benchMax}kg` : "-"} detail="从记录中提取" />
    </section>
  );
}

/** Metric renders one dashboard metric card. */
function Metric({ label, value, detail }: { label: string; value: number | string; detail: string }) {
  return (
    <article className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

/** CalendarPanel renders local month navigation over persisted entries. */
function CalendarPanel({
  currentMonth,
  entries,
  setCurrentMonth
}: {
  currentMonth: string;
  entries: EntryView[];
  setCurrentMonth: (value: string) => void;
}) {
  return (
    <div className="calendar-panel">
      <div className="section-head">
        <div>
          <p className="eyebrow">Check-in</p>
          <h2>打卡表</h2>
        </div>
        <div className="month-controls">
          <button className="icon-button" onClick={() => setCurrentMonth(shiftMonth(currentMonth, -1))} title="上个月" type="button">
            ‹
          </button>
          <input aria-label="选择月份" onChange={(event) => setCurrentMonth(event.target.value)} type="month" value={currentMonth} />
          <button className="icon-button" onClick={() => setCurrentMonth(shiftMonth(currentMonth, 1))} title="下个月" type="button">
            ›
          </button>
        </div>
      </div>
      <div aria-hidden="true" className="weekdays">
        <span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span><span>日</span>
      </div>
      <div aria-label="月度训练打卡" className="calendar">
        {renderCalendarDays(currentMonth, entries)}
      </div>
      <div className="legend">
        <span><i className="dot hit" />已练</span>
        <span><i className="dot today" />今天</span>
        <span><i className="dot empty" />未记录</span>
      </div>
    </div>
  );
}

/** EntryForm renders the server-backed create form. */
function EntryForm({ createEntryAction }: { createEntryAction: DashboardAction }) {
  return (
    <form action={createEntryAction} className="entry-form">
      <div className="section-head">
        <div>
          <p className="eyebrow">New log</p>
          <h2>添加训练</h2>
        </div>
      </div>
      <label>
        日期
        <input defaultValue={dateKey(new Date())} name="date" required type="date" />
      </label>
      <label>
        训练类型
        <select name="type">
          <option value="push">推：胸 / 肩 / 三头</option>
          <option value="pull">拉：背 / 二头</option>
          <option value="legs">腿 / 核心</option>
          <option value="mixed">混合 / 补弱</option>
        </select>
      </label>
      <label>
        内容
        <textarea name="text" placeholder="例：卧推 65kg 5 5 5 6 6，上斜卧推 40kgx10x3" required rows={7} />
      </label>
      <button className="primary-button" type="submit">保存记录</button>
    </form>
  );
}

/** TypeBars renders category distribution bars. */
function TypeBars({ entries }: { entries: EntryView[] }) {
  const counts = countEntriesByType(entries);
  const max = Math.max(1, ...Object.values(counts));

  return (
    <div className="panel">
      <PanelTitle eyebrow="Split" title="训练分布" />
      <div className="bars">
        {ENTRY_TYPES.map((type) => (
          <div className="bar-row" key={type}>
            <span>{TYPE_LABELS[type]}</span>
            <div className="bar-track"><div className="bar-fill" style={{ width: `${Math.round((counts[type] / max) * 100)}%` }} /></div>
            <strong>{counts[type]}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

/** BenchSparkline renders a simple SVG trend line from parsed bench entries. */
function BenchSparkline({ entries }: { entries: EntryView[] }) {
  const points = getSparklinePoints(entries);

  return (
    <div className="panel">
      <PanelTitle eyebrow="Bench" title="卧推走势" />
      <div className="sparkline-wrap">
        <svg aria-label="卧推工作重量走势" className="sparkline" role="img" viewBox="0 0 640 180">
          {points.length < 2 ? <text x="24" y="92">卧推记录不足，继续写就会有走势。</text> : <SparklineShape points={points} />}
        </svg>
      </div>
    </div>
  );
}

/** RecordsSection renders filters and server-backed delete forms. */
function RecordsSection({
  activeFilter,
  deleteEntryAction,
  entries,
  setActiveFilter
}: {
  activeFilter: EntryType | "all";
  deleteEntryAction: DashboardAction;
  entries: EntryView[];
  setActiveFilter: (value: EntryType | "all") => void;
}) {
  return (
    <section className="records-section">
      <div className="section-head">
        <div>
          <p className="eyebrow">Logs</p>
          <h2>训练记录</h2>
        </div>
        <div aria-label="筛选训练类型" className="filters" role="group">
          {(["all", ...ENTRY_TYPES] as const).map((filter) => (
            <button className={`filter ${activeFilter === filter ? "active" : ""}`} key={filter} onClick={() => setActiveFilter(filter)} type="button">
              {filter === "all" ? "全部" : TYPE_SHORT_LABELS[filter]}
            </button>
          ))}
        </div>
      </div>
      <div className="records">
        {entries.length ? entries.map((entry) => <RecordCard deleteEntryAction={deleteEntryAction} entry={entry} key={entry.id} />) : <p className="empty-state">这个筛选下还没有记录。</p>}
      </div>
    </section>
  );
}

/** RecordCard renders one persisted entry with an ownership-checked delete form. */
function RecordCard({ deleteEntryAction, entry }: { deleteEntryAction: DashboardAction; entry: EntryView }) {
  return (
    <article className="record-card">
      <div className="record-top">
        <div>
          <time>{formatDate(entry.date)}</time>
          <strong>{TYPE_LABELS[entry.type]}</strong>
        </div>
        <form action={deleteEntryAction}>
          <input name="id" type="hidden" value={entry.id} />
          <button aria-label="删除记录" className="icon-button delete-entry" title="删除记录" type="submit">×</button>
        </form>
      </div>
      <p>{entry.text}</p>
    </article>
  );
}

/** PanelTitle renders repeated analysis panel headings. */
function PanelTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="section-head">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
    </div>
  );
}

/** SparklineShape renders points and line once enough data exists. */
function SparklineShape({ points }: { points: Array<EntryView & { weight: number }> }) {
  const coords = getSparklineCoords(points);
  const line = coords.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <>
      <polyline className="line" points={line} />
      {coords.map((point) => <circle className="point" cx={point.x} cy={point.y} key={`${point.date}-${point.x}`} r="5"><title>{`${point.date} ${point.weight}kg`}</title></circle>)}
      <text x="28" y="22">{Math.max(...points.map((point) => point.weight))}kg</text>
      <text x="28" y="172">{Math.min(...points.map((point) => point.weight))}kg</text>
    </>
  );
}

/** getInitialMonth chooses the latest entry month or the current month. */
function getInitialMonth(entries: EntryView[]): string {
  return entries[0]?.date.slice(0, 7) ?? dateKey(new Date()).slice(0, 7);
}

/** filterEntries applies the selected record filter. */
function filterEntries(entries: EntryView[], filter: EntryType | "all"): EntryView[] {
  return entries.filter((entry) => filter === "all" || entry.type === filter);
}

/** shiftMonth returns a yyyy-mm month shifted by a delta. */
function shiftMonth(value: string, delta: number): string {
  const [year, month] = value.split("-").map(Number);
  return dateKey(new Date(year, month - 1 + delta, 1)).slice(0, 7);
}

/** renderCalendarDays builds cells for the current month. */
function renderCalendarDays(currentMonth: string, entries: EntryView[]) {
  const [year, month] = currentMonth.split("-").map(Number);
  const first = new Date(year, month - 1, 1);
  const last = new Date(year, month, 0);
  const offset = (first.getDay() + 6) % 7;
  const groups = groupEntriesByDate(entries);

  return [
    ...Array.from({ length: offset }, (_, index) => <div className="day empty-month" key={`empty-${index}`} />),
    ...Array.from({ length: last.getDate() }, (_, index) => renderCalendarDay(new Date(year, month - 1, index + 1), groups))
  ];
}

/** renderCalendarDay renders one calendar cell. */
function renderCalendarDay(date: Date, groups: Record<string, EntryView[]>) {
  const key = dateKey(date);
  const dayEntries = groups[key] ?? [];
  const className = `day ${dayEntries.length ? "has-entry" : ""} ${dateKey(new Date()) === key ? "today" : ""}`;

  return (
    <div className={className} key={key} title={dayEntries.map((entry) => `${TYPE_LABELS[entry.type]}：${entry.text}`).join("\n")}>
      <span className="date-num">{date.getDate()}</span>
      <span className="day-title">{dayEntries.map((entry) => TYPE_SHORT_LABELS[entry.type]).join(" / ")}</span>
    </div>
  );
}

/** getSparklinePoints extracts sortable bench weight points. */
function getSparklinePoints(entries: EntryView[]): Array<EntryView & { weight: number }> {
  return entries
    .map((entry) => ({ ...entry, weight: getBenchWeight(entry) }))
    .filter((entry): entry is EntryView & { weight: number } => entry.weight !== null)
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** getSparklineCoords converts points into SVG coordinates. */
function getSparklineCoords(points: Array<EntryView & { weight: number }>) {
  const width = 640;
  const height = 180;
  const pad = 28;
  const min = Math.min(...points.map((point) => point.weight)) - 2.5;
  const max = Math.max(...points.map((point) => point.weight)) + 2.5;
  const xStep = (width - pad * 2) / (points.length - 1);

  return points.map((point, index) => {
    const ratio = (point.weight - min) / (max - min || 1);
    return { ...point, x: pad + index * xStep, y: height - pad - ratio * (height - pad * 2) };
  });
}

/** applyStoredTheme restores the local theme preference without touching legacy data. */
function applyStoredTheme() {
  const stored = localStorage.getItem("strength-log-theme");
  if (stored === "dark") {
    document.documentElement.classList.add("dark");
  }
}

/** toggleTheme flips the theme and stores only the theme preference in localStorage. */
function toggleTheme() {
  document.documentElement.classList.toggle("dark");
  localStorage.setItem("strength-log-theme", document.documentElement.classList.contains("dark") ? "dark" : "light");
}
