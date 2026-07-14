"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Calendar,
  ChevronRight,
  Clock,
  Crown,
  Globe,
  Leaf,
  Package,
  Play,
  ShieldCheck,
  Ban,
  TrendingDown,
  TrendingUp,
  Truck,
  Users,
  Video,
  Weight,
} from "lucide-react";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartTooltipProps = {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number;
    color?: string;
  }>;
  label?: string;
};

const PLACEHOLDER_IMAGE = "/manggis-placeholder.png";

const COLOR_A = "#6d28d9";
const COLOR_B = "#16a34a";
const COLOR_C = "#64748b";

type GradeId = "A" | "B" | "C";

const GRADE_LABELS: Record<GradeId, string> = {
  A: "Ekspor",
  B: "Lokal",
  C: "Tidak Layak Jual",
};

function gradeLabel(id: GradeId): string {
  return GRADE_LABELS[id];
}

const GRADE_LINES: {
  id: GradeId;
  dataKey: "gradeA" | "gradeB" | "gradeC";
  name: string;
  color: string;
}[] = [
  { id: "A", dataKey: "gradeA", name: GRADE_LABELS.A, color: COLOR_A },
  { id: "B", dataKey: "gradeB", name: GRADE_LABELS.B, color: COLOR_B },
  { id: "C", dataKey: "gradeC", name: GRADE_LABELS.C, color: COLOR_C },
];

const GRADE_PRICES = [
  {
    id: "A",
    label: GRADE_LABELS.A,
    badge: "bg-amber-400 text-amber-950",
    bar: "bg-[#3b0764]",
    price: 85000,
    image: "/manggis-ekspor.png",
    icon: Crown,
  },
  {
    id: "B",
    label: GRADE_LABELS.B,
    badge: "bg-emerald-500 text-white",
    bar: "bg-emerald-700",
    price: 68000,
    image: "/manggis-lokal.png",
    icon: Leaf,
  },
  {
    id: "C",
    label: GRADE_LABELS.C,
    badgeLabel: "Busuk",
    badge: "bg-slate-500 text-white",
    bar: "bg-slate-600",
    price: 52000,
    image: "/manggis-busuk.png",
    icon: Ban,
  },
];

const trendData = [
  { month: "Feb", gradeA: 72000, gradeB: 56000, gradeC: 44000 },
  { month: "Mar", gradeA: 76000, gradeB: 60000, gradeC: 47000 },
  { month: "Apr", gradeA: 80000, gradeB: 64000, gradeC: 49000 },
  { month: "Mei", gradeA: 82000, gradeB: 66000, gradeC: 50500 },
  { month: "Jun", gradeA: 83500, gradeB: 67000, gradeC: 51500 },
  { month: "Jul", gradeA: 85000, gradeB: 68000, gradeC: 52000 },
];

const GRADE_SHARE = { A: 48, B: 32, C: 20 } as const;
const EXPORT_TOTAL_TON = 25;
const DAILY_SORTASI_TON = 3.2;
const STOCK_READY_TON = 18;
const LOCAL_PARTNER_COUNT = 14;
const QC_PASS_RATE = 91;

const exportNeeds = (["A", "B", "C"] as const).map((gradeId) => ({
  gradeId,
  label: GRADE_LABELS[gradeId],
  value: `${Math.round((EXPORT_TOTAL_TON * GRADE_SHARE[gradeId]) / 100)} ton`,
  percent: GRADE_SHARE[gradeId],
  color: gradeId === "A" ? COLOR_A : gradeId === "B" ? COLOR_B : COLOR_C,
}));

const summaryStats = [
  {
    label: "Sortasi Hari Ini",
    value: `${DAILY_SORTASI_TON.toLocaleString("id-ID")} ton`,
    hint: "Hasil sortasi hari ini",
    icon: Weight,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    label: "Lolos QC",
    value: `${QC_PASS_RATE}%`,
    hint: "Dari sortasi hari ini",
    icon: ShieldCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    label: "Stok Siap Kirim",
    value: `${STOCK_READY_TON} ton`,
    hint: `${Math.round((STOCK_READY_TON / EXPORT_TOTAL_TON) * 100)}% dari kebutuhan ${EXPORT_TOTAL_TON} ton`,
    icon: Truck,
    color: "text-sky-600",
    bg: "bg-sky-50",
  },
  {
    label: "Mitra Petani",
    value: `${LOCAL_PARTNER_COUNT}`,
    hint: "Kebun & koperasi lokal",
    icon: Users,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

const exportDestinations = [
  { country: "Tiongkok", flag: "🇨🇳", volume: "10 ton", share: 40 },
  { country: "Singapura", flag: "🇸🇬", volume: "8 ton", share: 32 },
  { country: "Uni Emirat Arab", flag: "🇦🇪", volume: "7 ton", share: 28 },
];

const gradeDistribution = (["A", "B", "C"] as const).map((gradeId) => ({
  gradeId,
  name: GRADE_LABELS[gradeId],
  value: GRADE_SHARE[gradeId],
  color: gradeId === "A" ? COLOR_A : gradeId === "B" ? COLOR_B : COLOR_C,
}));

const footerItems = [
  {
    title: "Kualitas Terjaga",
    subtitle: "Sortasi & QC Ketat",
    icon: ShieldCheck,
  },
  {
    title: "Rantai Pasok Efisien",
    subtitle: "Dari Kebun ke Dunia",
    icon: Truck,
  },
  {
    title: "Pasar Global Terpercaya",
    subtitle: "Buah Manggis Indonesia",
    icon: Globe,
  },
];

const insightMetrics = [
  {
    label: "Harga Ekspor",
    value: "+12,3%",
    comparison: "Perbandingan minggu lalu",
    up: true,
  },
  {
    label: "Volume Ekspor",
    value: "+8,5%",
    comparison: "Perbandingan bulan lalu",
    up: true,
  },
  {
    label: "Lolos QC",
    value: "+2,1%",
    comparison: "Perbandingan hari sebelumnya",
    up: true,
  },
  {
    label: "Permintaan Ekspor",
    value: "+15,0%",
    comparison: "Perbandingan minggu lalu",
    up: true,
  },
];

function insightTrendColor(value: string): string {
  return value.startsWith("-") ? "text-red-600" : "text-emerald-600";
}

function TrendTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-lg">
      <p className="mb-2 text-xs font-semibold text-slate-800">Bulan {label}</p>
      <ul className="space-y-1">
        {payload.map((entry) => (
          <li key={entry.name} className="flex items-center justify-between gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              {entry.name}
            </span>
            <span className="font-semibold text-slate-900">
              {formatPrice(Number(entry.value))}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function GradeDistributionChart({
  focusedGrade,
  onGradeFocus,
}: {
  focusedGrade: GradeId | null;
  onGradeFocus: (gradeId: GradeId) => void;
}) {
  const [hoverIndex, setHoverIndex] = useState<number | undefined>(undefined);
  const focusedIndex =
    focusedGrade !== null
      ? gradeDistribution.findIndex((item) => item.gradeId === focusedGrade)
      : undefined;
  const activeIndex = hoverIndex ?? focusedIndex;

  return (
    <div className="flex flex-1 items-center gap-3">
      <div className="relative h-[140px] w-[140px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={gradeDistribution}
              dataKey="value"
              nameKey="name"
              innerRadius={40}
              outerRadius={58}
              paddingAngle={2}
              strokeWidth={0}
              onMouseEnter={(_, index) => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(undefined)}
              onClick={(_, index) => onGradeFocus(gradeDistribution[index].gradeId)}
            >
              {gradeDistribution.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={entry.color}
                  stroke={activeIndex === index ? "#fff" : undefined}
                  strokeWidth={activeIndex === index ? 2 : 0}
                  opacity={
                    focusedGrade === null || entry.gradeId === focusedGrade
                      ? activeIndex === undefined || activeIndex === index
                        ? 1
                        : 0.45
                      : 0.25
                  }
                  style={{ cursor: "pointer" }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="text-base">🥭</span>
        </div>
      </div>
      <ul className="space-y-2 text-xs">
        {gradeDistribution.map((item, index) => {
          const isFocused = isGradeFocused(item.gradeId, focusedGrade);
          return (
            <li key={item.name}>
              <button
                type="button"
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(undefined)}
                onClick={() => onGradeFocus(item.gradeId)}
                className={`flex w-full flex-col rounded-md px-2 py-1.5 text-left transition-all ${
                  activeIndex === index
                    ? "bg-slate-100 ring-1 ring-slate-200"
                    : isFocused
                      ? "hover:bg-slate-50"
                      : "opacity-40 hover:opacity-60"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-600">{item.name}</span>
                  <span className="font-semibold text-slate-900">{item.value}%</span>
                </span>
                {activeIndex === index ? (
                  <span className="mt-1 pl-5 text-[10px] text-slate-400">
                    {item.value}% dari total stok
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ExportDestinationsCard() {
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined);
  const [hoverIndex, setHoverIndex] = useState<number | undefined>(undefined);
  const activeIndex = hoverIndex ?? selectedIndex;

  return (
    <Card className="flex h-full flex-col">
      <SectionHeader icon={Globe} title="Tujuan Ekspor Utama" subtitle="3 negara tujuan" />
      <ul className="space-y-2">
        {exportDestinations.map((dest, index) => (
          <li key={dest.country}>
            <button
              type="button"
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(undefined)}
              onClick={() =>
                setSelectedIndex((current) => (current === index ? undefined : index))
              }
              className={`flex w-full flex-col rounded-lg border px-3 py-3 text-left transition-colors ${
                activeIndex === index
                  ? "border-emerald-200 bg-emerald-50 ring-1 ring-emerald-200"
                  : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span className="flex items-center justify-between">
                <span className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
                  <span className="text-lg">{dest.flag}</span>
                  {dest.country}
                </span>
                <ChevronRight
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    activeIndex === index ? "text-emerald-600" : "text-slate-400"
                  }`}
                />
              </span>
              {activeIndex === index ? (
                <span className="mt-2 flex items-center justify-between border-t border-emerald-100 pt-2 text-xs text-slate-600">
                  <span>
                    Volume: <strong className="text-slate-800">{dest.volume}</strong>
                  </span>
                  <span>{dest.share}% dari total ekspor</span>
                </span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function formatPrice(value: number): string {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

function formatYAxis(value: number): string {
  return `${Math.round(value / 1000)}rb`;
}

function formatClock(date: Date): string {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${m} WIB`;
}

function formatDateId(date: Date): string {
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-emerald-700" strokeWidth={2} />
        <h2 className="text-xs font-bold tracking-wide text-slate-800 uppercase">
          {title}
        </h2>
      </div>
      {subtitle ? (
        <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
      ) : null}
    </div>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] ${className}`}
    >
      {children}
    </div>
  );
}

function isGradeFocused(gradeId: GradeId, focusedGrade: GradeId | null): boolean {
  return !focusedGrade || focusedGrade === gradeId;
}

export default function Dashboard() {
  const [now, setNow] = useState<Date | null>(null);
  const [focusedGrade, setFocusedGrade] = useState<GradeId | null>(null);

  const toggleGradeFocus = (gradeId: GradeId) => {
    setFocusedGrade((current) => (current === gradeId ? null : gradeId));
  };

  useEffect(() => {
    setNow(new Date());
    const tick = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(tick);
  }, []);

  return (
    <div className="scrollbar-thin min-h-screen w-full overflow-y-auto bg-[#dfe4ea] py-4">
      <div className="mx-auto grid h-[1920px] w-[1080px] grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden bg-[#eef1f4] text-slate-900 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        {/* Header */}
        <header className="shrink-0 bg-[#0f2e22] px-5 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-white/10">
                <Image
                  src={PLACEHOLDER_IMAGE}
                  alt="Manggis"
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-xl font-bold text-white">
                  Dashboard Monitoring Manggis
                </h1>
                <p className="truncate text-xs text-emerald-200/90 italic">
                  Sortasi, Harga, Tren, dan Kebutuhan Ekspor
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <div className="flex items-center gap-2 text-xs text-white/90">
                <Calendar className="h-3.5 w-3.5 text-emerald-300" />
                <span>{now ? formatDateId(now) : "—"}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/90">
                <Clock className="h-3.5 w-3.5 text-emerald-300" />
                <span>{now ? formatClock(now) : "—"}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="scrollbar-thin grid min-h-0 flex-1 grid-rows-[auto_auto_minmax(0,1fr)_auto_auto] gap-3 overflow-y-auto px-4 py-4">
          {/* Video Proses */}
          <Card>
            <SectionHeader icon={Video} title="Video Proses" />
            <div className="group relative h-[310px] overflow-hidden rounded-lg bg-slate-900">
              <Image
                src={PLACEHOLDER_IMAGE}
                alt="Video proses tanam, panen, dan sortasi manggis"
                fill
                className="object-cover"
                sizes="1080px"
              />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-md">
                  <Play
                    className="ml-0.5 h-5 w-5 fill-slate-800 text-slate-800"
                    strokeWidth={0}
                  />
                </span>
              </div>
              <div className="absolute right-0 bottom-0 left-0 flex items-center gap-2 bg-black/55 px-4 py-2.5">
                <Video className="h-4 w-4 text-emerald-300" />
                <span className="text-sm font-medium text-white">
                  Tanam, Panen & Sortasi Manggis
                </span>
              </div>
            </div>
          </Card>

          {/* Harga per Grade */}
          <Card>
            <SectionHeader
              icon={Package}
              title="Harga Manggis Per Kategori"
              subtitle={
                focusedGrade
                  ? `Fokus ${gradeLabel(focusedGrade)} — ketuk lagi untuk tampilkan semua`
                  : "Ketuk kartu kategori untuk fokus ke grafik"
              }
            />
            <div className="grid grid-cols-3 gap-3">
              {GRADE_PRICES.map((grade) => {
                const isFocused = focusedGrade === grade.id;
                const isDimmed = focusedGrade !== null && !isFocused;

                return (
                  <button
                    key={grade.id}
                    type="button"
                    onClick={() => toggleGradeFocus(grade.id as GradeId)}
                    className={`overflow-hidden rounded-lg border bg-white text-left transition-all ${
                      isFocused
                        ? "scale-[1.02] border-emerald-400 ring-2 ring-emerald-500/60"
                        : isDimmed
                          ? "border-slate-200 opacity-50"
                          : "border-slate-200 hover:border-emerald-200"
                    }`}
                  >
                    <div className="relative h-[175px]">
                      <Image
                        src={grade.image}
                        alt={grade.label}
                        fill
                        className="object-cover"
                        sizes="400px"
                      />
                      <span
                        className={`absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-bold ${grade.badge}`}
                      >
                        <grade.icon className="h-3.5 w-3.5" strokeWidth={2.5} />
                        {grade.badgeLabel ?? grade.label}
                      </span>
                    </div>
                    <div
                      className={`${grade.bar} px-3 py-2.5 text-center text-base font-bold text-white`}
                    >
                      {formatPrice(grade.price)}/kg
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Trend + Kebutuhan Ekspor */}
          <div className="grid min-h-0 grid-cols-2 items-stretch gap-3">
            <Card className="flex min-h-0 flex-col">
              <SectionHeader
                icon={Globe}
                title="Trend Harga"
                subtitle={
                  focusedGrade
                    ? `6 Bulan Terakhir — fokus ${gradeLabel(focusedGrade)}`
                    : "6 Bulan Terakhir"
                }
              />
              <div className="mb-2 flex flex-wrap gap-2 text-xs font-medium">
                {GRADE_LINES.map((line) => {
                  const active = isGradeFocused(line.id, focusedGrade);
                  return (
                    <button
                      key={line.id}
                      type="button"
                      onClick={() => toggleGradeFocus(line.id)}
                      className={`flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors ${
                        focusedGrade === line.id
                          ? "bg-slate-100 ring-1 ring-slate-200"
                          : focusedGrade
                            ? "opacity-40"
                            : "hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: line.color, opacity: active ? 1 : 0.35 }}
                      />
                      <span className={active ? "text-slate-700" : "text-slate-400"}>
                        {line.name}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="min-h-[240px] flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 11 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 11 }}
                      tickFormatter={formatYAxis}
                      width={36}
                    />
                    <Tooltip
                      content={<TrendTooltip />}
                      cursor={{ stroke: "#94a3b8", strokeWidth: 1, strokeDasharray: "4 4" }}
                    />
                    {GRADE_LINES.map((line) => (
                      <Line
                        key={line.dataKey}
                        type="monotone"
                        dataKey={line.dataKey}
                        name={line.name}
                        stroke={line.color}
                        strokeWidth={
                          focusedGrade === line.id ? 3.5 : focusedGrade ? 1.5 : 2.5
                        }
                        strokeOpacity={isGradeFocused(line.id, focusedGrade) ? 1 : 0.15}
                        dot={{
                          r: isGradeFocused(line.id, focusedGrade) ? 4 : 2,
                          fill: line.color,
                          fillOpacity: isGradeFocused(line.id, focusedGrade) ? 1 : 0.15,
                          strokeWidth: 0,
                        }}
                        activeDot={
                          isGradeFocused(line.id, focusedGrade)
                            ? { r: 6, fill: line.color, stroke: "#fff", strokeWidth: 2 }
                            : false
                        }
                        hide={focusedGrade !== null && focusedGrade !== line.id}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="flex h-full flex-col">
              <SectionHeader
                icon={Globe}
                title="Kebutuhan Jumlah Ekspor"
                subtitle={
                  focusedGrade
                    ? `Kebutuhan per kategori — fokus ${gradeLabel(focusedGrade)}`
                    : "Kebutuhan per kategori"
                }
              />

              <div className="rounded-lg border border-slate-100 bg-slate-50/80 p-3">
                <p className="mb-2 text-xs font-medium text-slate-600">
                  Komposisi total {EXPORT_TOTAL_TON} ton
                </p>
                <div className="flex h-7 w-full overflow-hidden rounded-full">
                  {exportNeeds.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => toggleGradeFocus(item.gradeId)}
                      className="h-full transition-opacity"
                      style={{
                        width: `${item.percent}%`,
                        backgroundColor: item.color,
                        opacity: isGradeFocused(item.gradeId, focusedGrade) ? 1 : 0.25,
                      }}
                      title={`${item.label}: ${item.value}`}
                    />
                  ))}
                </div>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-500">
                  {exportNeeds.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => toggleGradeFocus(item.gradeId)}
                      className={`flex items-center gap-1 transition-opacity ${
                        isGradeFocused(item.gradeId, focusedGrade) ? "" : "opacity-40"
                      }`}
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.label} {item.percent}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-3 space-y-2">
                {exportNeeds.map((item) => {
                  const isFocused = focusedGrade === item.gradeId;
                  const isDimmed = focusedGrade !== null && !isFocused;

                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => toggleGradeFocus(item.gradeId)}
                      className={`block w-full rounded-lg border px-3 py-2.5 text-left transition-all ${
                        isFocused
                          ? "border-emerald-300 bg-emerald-50/50 ring-1 ring-emerald-200"
                          : isDimmed
                            ? "border-slate-100 opacity-45"
                            : "border-slate-100 hover:border-slate-200"
                      }`}
                    >
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">{item.label}</span>
                        <span className="font-bold text-slate-900">{item.value}</span>
                      </div>
                      <div className="h-5 w-full rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${item.percent}%`,
                            backgroundColor: item.color,
                            opacity: isGradeFocused(item.gradeId, focusedGrade) ? 1 : 0.35,
                          }}
                        />
                      </div>
                      <p className="mt-1.5 text-[10px] text-slate-400">
                        {item.percent}% dari total kebutuhan
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-auto rounded-lg bg-emerald-50 px-4 py-3 pt-4 text-center">
                <p className="text-sm font-semibold text-emerald-800">
                  Total Kebutuhan Ekspor:{" "}
                  <span className="text-base">{EXPORT_TOTAL_TON} ton</span>
                </p>
              </div>
            </Card>
          </div>

          {/* Ringkasan Hari Ini */}
          <Card>
            <SectionHeader
              icon={Package}
              title="Ringkasan Hari Ini"
              subtitle="Sortasi harian dan stok akumulasi gudang"
            />
            <div className="grid grid-cols-4 gap-3">
              {summaryStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-slate-100 bg-slate-50/80 p-4"
                >
                  <div
                    className={`mb-2 flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}
                  >
                    <stat.icon className={`h-4 w-4 ${stat.color}`} strokeWidth={2} />
                  </div>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                  <p className={`mt-1 text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="mt-1 text-[10px] leading-snug text-slate-400">{stat.hint}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Bottom row */}
          <div className="grid min-h-[220px] grid-cols-3 gap-3">
            <ExportDestinationsCard />

            <Card className="flex flex-col">
              <SectionHeader icon={Package} title="Distribusi Kategori" />
              <GradeDistributionChart
                focusedGrade={focusedGrade}
                onGradeFocus={toggleGradeFocus}
              />
            </Card>

            <Card className="flex flex-col">
              <SectionHeader
                icon={TrendingUp}
                title="Insight Performa"
                subtitle="Perbandingan terhadap periode sebelumnya"
              />
              <div className="flex flex-1 flex-col justify-center divide-y divide-slate-100">
                {insightMetrics.map((metric) => {
                  const TrendIcon = metric.up ? TrendingUp : TrendingDown;
                  const valueColor = insightTrendColor(metric.value);

                  return (
                    <div
                      key={metric.label}
                      className="flex items-center justify-between py-3 first:pt-0"
                    >
                      <div>
                        <p className="text-xs font-medium text-slate-700">{metric.label}</p>
                        <p className="text-[10px] text-slate-400">{metric.comparison}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-lg font-bold ${valueColor}`}>
                          {metric.value}
                        </span>
                        <TrendIcon className={`h-4 w-4 ${valueColor}`} strokeWidth={2.5} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="shrink-0 bg-[#0f2e22] px-5 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="grid flex-1 grid-cols-3 gap-2">
              {footerItems.map((item) => (
                <div key={item.title} className="flex items-start gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-emerald-900/60">
                    <item.icon className="h-3.5 w-3.5 text-emerald-300" strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-white">{item.title}</p>
                    <p className="truncate text-[10px] text-emerald-200/75">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="shrink-0 rounded-lg bg-emerald-700 px-3 py-2 text-right">
              <p className="text-xs font-bold text-white">Manggis Indonesia</p>
              <p className="text-[10px] text-emerald-100/90">
                Berkualitas, Mendunia.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
