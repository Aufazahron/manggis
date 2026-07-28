"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  Calendar,
  ChevronRight,
  Clock,
  Crown,
  Globe,
  Leaf,
  Mail,
  Package,
  Play,
  ShieldCheck,
  Star,
  TrendingDown,
  TrendingUp,
  Truck,
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
  A: "Grade A",
  B: "Grade B",
  C: "Grade C",
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
    badgeLabel: "Grade A",
    badge: "bg-amber-400 text-amber-950",
    bar: "bg-[#3b0764]",
    price: 52000,
    image: "/grade-a.webp",
    imagePosition: "center 40%",
    icon: Crown,
  },
  {
    id: "B",
    label: GRADE_LABELS.B,
    badgeLabel: "Grade B",
    badge: "bg-emerald-500 text-white",
    bar: "bg-emerald-700",
    price: 35000,
    image: "/grade-b.webp",
    imagePosition: "center center",
    icon: Leaf,
  },
  {
    id: "C",
    label: GRADE_LABELS.C,
    badgeLabel: "Grade C",
    badge: "bg-slate-400 text-white",
    bar: "bg-slate-600",
    price: 12000,
    image: "/grade-c.webp",
    imagePosition: "center center",
    icon: Star,
  },
];

// Harga manggis per kg — rata-rata nasional Indonesia 2026 (bukan satu wilayah).
// Angka merupakan estimasi rerata lintas daerah, sehingga fluktuasi lebih landai
// dibanding lonjakan lokal (mis. rekor Rp80rb di Banyuwangi/Bali saat pasokan langka).
// Acuan: kisaran retail Jul ~Rp13-55rb, tingkat petani ~Rp50rb, sortasi Sp/MIX/Bs.
const trendData = [
  { month: "Feb", gradeA: 48000, gradeB: 32000, gradeC: 10000 },
  { month: "Mar", gradeA: 55000, gradeB: 36000, gradeC: 12000 },
  { month: "Apr", gradeA: 58000, gradeB: 40000, gradeC: 14000 },
  { month: "Mei", gradeA: 56000, gradeB: 38000, gradeC: 13000 },
  { month: "Jun", gradeA: 53000, gradeB: 36000, gradeC: 12000 },
  { month: "Jul", gradeA: 52000, gradeB: 35000, gradeC: 12000 },
];

const GRADE_SHARE = { A: 48, B: 32, C: 20 } as const;
// Komposisi kebutuhan ekspor condong ke premium: protokol ekspor menuntut mutu
// tinggi & hanya sebagian kecil produksi lolos standar ekspor (mis. Purwakarta
// ~30% produksi menembus ekspor). Rincian A/B/C tidak dirilis resmi -> estimasi.
const EXPORT_SHARE = { A: 65, B: 30, C: 5 } as const;
// Total volume ekspor manggis Indonesia 2024 (BPS): ~95.679 ton, dibulatkan.
const EXPORT_TOTAL_TON = 96000;
// Data umum nasional (Angka Tetap Hortikultura 2024, Kementan/BPS).
const NATIONAL_PRODUCTION_TON = 416753; // Produksi manggis Indonesia 2024
const TOP_PROVINCE = "Jawa Barat"; // Provinsi produsen terbesar 2024
const TOP_PROVINCE_TON = 100117; // Produksi Jawa Barat 2024
const AVG_PRICE_A = 52000; // Rata-rata harga Grade A/super 2026 (per kg)

const exportNeeds = (["A", "B", "C"] as const).map((gradeId) => ({
  gradeId,
  label: GRADE_LABELS[gradeId],
  value: `${(Math.round((EXPORT_TOTAL_TON * EXPORT_SHARE[gradeId]) / 100 / 1000) * 1000).toLocaleString("id-ID")} ton`,
  percent: EXPORT_SHARE[gradeId],
  color: gradeId === "A" ? COLOR_A : gradeId === "B" ? COLOR_B : COLOR_C,
}));

const summaryStats = [
  {
    label: "Produksi Nasional",
    value: `${Math.round(NATIONAL_PRODUCTION_TON / 1000)} rb ton`,
    hint: "Produksi manggis 2024 (BPS)",
    icon: Weight,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    label: "Volume Ekspor",
    value: `${Math.round(EXPORT_TOTAL_TON / 1000)} rb ton`,
    hint: `±${Math.round((EXPORT_TOTAL_TON / NATIONAL_PRODUCTION_TON) * 100)}% dari produksi nasional`,
    icon: Truck,
    color: "text-sky-600",
    bg: "bg-sky-50",
  },
  {
    label: "Provinsi Teratas",
    value: TOP_PROVINCE,
    hint: `${Math.round(TOP_PROVINCE_TON / 1000)} rb ton • ${Math.round((TOP_PROVINCE_TON / NATIONAL_PRODUCTION_TON) * 100)}% nasional`,
    icon: Leaf,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    label: "Harga Rata-rata",
    value: `Rp${Math.round(AVG_PRICE_A / 1000)} rb/kg`,
    hint: "Grade A/super 2026",
    icon: TrendingUp,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

// Tujuan ekspor manggis Indonesia — data BPS 2024 (via jurnal utami.id/JM v2i2.399).
// Volume tahunan nasional; Tiongkok + Hongkong = pasar dominan (~75% total ekspor).
const exportDestinations = [
  { country: "Hongkong", flagSrc: "/flags/hk.png", volume: "55.000 ton", share: 50 },
  { country: "Tiongkok", flagSrc: "/flags/cn.png", volume: "45.000 ton", share: 40 },
  { country: "Malaysia", flagSrc: "/flags/my.png", volume: "11.000 ton", share: 10 },
];

const gradeDistribution = (["A", "B", "C"] as const).map((gradeId) => ({
  gradeId,
  name: GRADE_LABELS[gradeId],
  value: GRADE_SHARE[gradeId],
  color: gradeId === "A" ? COLOR_A : gradeId === "B" ? COLOR_B : COLOR_C,
}));

// Logo mitra/institusi di footer. Set `src: null` untuk slot yang menyusul.
const partnerLogos: { src: string | null; alt: string }[] = [
  { src: "/upi.png", alt: "Universitas Pendidikan Indonesia" },
  { src: "/d-tech.png", alt: "DTECH Edge Innovation" },
];

const CONTACT_EMAIL = "dtech.inno@gmail.com";

const footerItems = [
  {
    title: "Kualitas Terjaga",
    subtitle: "Sortasi & QC Ketat",
    icon: ShieldCheck,
  },
  {
    title: "Pasar Global Terpercaya",
    subtitle: "Buah Manggis Indonesia",
    icon: Globe,
  },
];

// Insight murni data 2026, diturunkan dari tren harga (Feb->Jul 2026) yang tampil
// di dashboard + data ekspor awal 2026:
// - Harga Grade A: 48.000 -> 52.000 (grafik tren) -> +8,3%
// - Harga Grade B: 32.000 -> 35.000 (grafik tren) -> +9,4%
// - Harga Grade C: 10.000 -> 12.000 (grafik tren) -> +20,0%
// - Volume ekspor awal 2026 vs 2025: 79,5 vs 356,5 ton (Barantin) -> -77,7%
const insightMetrics = [
  {
    label: "Harga Grade A",
    value: "+8,3%",
    comparison: "Juli vs Februari 2026",
    up: true,
  },
  {
    label: "Harga Grade B",
    value: "+9,4%",
    comparison: "Juli vs Februari 2026",
    up: true,
  },
  {
    label: "Harga Grade C",
    value: "+20,0%",
    comparison: "Juli vs Februari 2026",
    up: true,
  },
  {
    label: "Volume Ekspor",
    value: "-77,7%",
    comparison: "Awal 2026 dibanding 2025",
    up: false,
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
      <div className="relative h-[120px] w-[120px] shrink-0">
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
      <SectionHeader
        icon={Globe}
        title="Tujuan Ekspor Utama"
        subtitle="Volume tahunan nasional (BPS 2024)"
      />
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
                  <span className="relative h-4 w-6 shrink-0 overflow-hidden rounded-[3px] ring-1 ring-slate-200">
                    <Image
                      src={dest.flagSrc}
                      alt={dest.country}
                      fill
                      className="object-cover"
                      sizes="24px"
                      unoptimized
                    />
                  </span>
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
                  <span>{dest.share}% dari 3 tujuan teratas</span>
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
    <div className="mb-2">
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

const PROCESS_VIDEOS = [
  {
    src: "/videos/proses-tanam.mp4",
    step: "Tanam",
    caption: "Bibit & perawatan kebun manggis",
  },
  {
    src: "/videos/proses-panen.mp4",
    step: "Panen",
    caption: "Pemetikan buah matang di kebun",
  },
  {
    src: "/videos/proses-sortasi.mp4",
    step: "Sortasi",
    caption: "Sortasi & grading di pabrik",
  },
] as const;

function ProcessVideoPlayer({ className = "" }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const userPausedRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const clip = PROCESS_VIDEOS[index];

  const startPlayback = () => {
    const video = videoRef.current;
    if (!video || userPausedRef.current) return;

    void video.play().catch(() => setPlaying(false));
  };

  useEffect(() => {
    userPausedRef.current = false;
    startPlayback();
  }, [index]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      userPausedRef.current = false;
      void video.play().catch(() => setPlaying(false));
    } else {
      userPausedRef.current = true;
      video.pause();
    }
  };

  return (
    <div
      className={`group relative min-h-0 w-full overflow-hidden rounded-lg bg-black ${className}`}
    >
      <video
        ref={videoRef}
        key={clip.src}
        className="h-full w-full object-cover"
        src={clip.src}
        autoPlay
        muted
        playsInline
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onCanPlay={startPlayback}
        onEnded={() => setIndex((current) => (current + 1) % PROCESS_VIDEOS.length)}
      />

      <div className="pointer-events-none absolute inset-0 bg-black/15" />

      <div className="absolute top-3 right-3 flex gap-1.5">
        {PROCESS_VIDEOS.map((item, videoIndex) => (
          <span
            key={item.step}
            className={`h-1.5 rounded-full transition-all ${
              videoIndex === index ? "w-6 bg-white" : "w-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={togglePlayback}
        className="absolute inset-0 z-10 flex items-center justify-center"
        aria-label={playing ? "Jeda video" : "Putar video"}
      >
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-md transition-opacity ${
            playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"
          }`}
        >
          {playing ? (
            <span className="flex gap-1">
              <span className="h-4 w-1 rounded-full bg-slate-800" />
              <span className="h-4 w-1 rounded-full bg-slate-800" />
            </span>
          ) : (
            <Play className="ml-0.5 h-5 w-5 fill-slate-800 text-slate-800" strokeWidth={0} />
          )}
        </span>
      </button>

      <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-20 flex items-center justify-between gap-3 bg-black/55 px-4 py-2.5">
        <span className="flex min-w-0 items-center gap-2">
          <Video className="h-4 w-4 shrink-0 text-emerald-300" />
          <span className="truncate text-sm font-medium text-white">
            {clip.step}: {clip.caption}
          </span>
        </span>
        <span className="shrink-0 rounded bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white/90">
          {index + 1}/{PROCESS_VIDEOS.length}
        </span>
      </div>
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
      className={`rounded-xl border border-slate-200/80 bg-white p-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)] ${className}`}
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
    <div className="flex justify-center bg-[#dfe4ea]">
      <div className="flex aspect-[9/16] h-[max(1920px,min(100dvh,calc(100dvw*16/9)))] w-[max(1080px,min(100dvw,calc(100dvh*9/16)))] min-h-[1920px] min-w-[1080px] shrink-0 flex-col overflow-hidden bg-[#eef1f4] text-slate-900 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        {/* Header */}
        <header className="shrink-0 bg-[#0f2e22] px-5 py-2.5">
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
                <span>{now ? formatDateId(now) : "-"}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/90">
                <Clock className="h-3.5 w-3.5 text-emerald-300" />
                <span>{now ? formatClock(now) : "-"}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_minmax(0,1fr)_auto_auto_auto] gap-2 overflow-hidden px-4 py-3">
          {/* Video Proses */}
          <Card className="flex min-h-0 flex-col overflow-hidden">
            <ProcessVideoPlayer className="min-h-0 flex-1" />
          </Card>

          {/* Harga per Grade */}
          <Card className="flex min-h-0 flex-col overflow-hidden">
            <div className="grid min-h-0 flex-1 grid-cols-3 gap-3">
              {GRADE_PRICES.map((grade) => {
                const isFocused = focusedGrade === grade.id;
                const isDimmed = focusedGrade !== null && !isFocused;

                return (
                  <button
                    key={grade.id}
                    type="button"
                    onClick={() => toggleGradeFocus(grade.id as GradeId)}
                    className={`flex h-full min-h-0 flex-col overflow-hidden rounded-xl border bg-white text-left transition-all ${
                      isFocused
                        ? "scale-[1.02] border-emerald-400 ring-2 ring-emerald-500/60"
                        : isDimmed
                          ? "border-slate-200 opacity-50"
                          : "border-slate-200 hover:border-emerald-200"
                    }`}
                  >
                    <div className="relative min-h-0 flex-1 overflow-hidden bg-black">
                      <Image
                        src={grade.image}
                        alt={grade.label}
                        fill
                        className="object-cover"
                        style={{ objectPosition: grade.imagePosition }}
                        sizes="400px"
                        unoptimized
                        priority={grade.id === "A"}
                      />
                      <span
                        className={`absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-bold shadow-md ${grade.badge}`}
                      >
                        <grade.icon className="h-4 w-4" strokeWidth={2.5} />
                        {grade.badgeLabel}
                      </span>
                    </div>
                    <div
                      className={`${grade.bar} shrink-0 px-3 py-3.5 text-center text-2xl font-bold text-white`}
                    >
                      {formatPrice(grade.price)}/kg
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Trend + Kebutuhan Ekspor */}
          <div className="grid grid-cols-2 items-stretch gap-2">
            <Card className="flex flex-col">
              <SectionHeader
                icon={Globe}
                title="Trend Harga"
                subtitle={
                  focusedGrade
                    ? `6 Bulan Terakhir, fokus ${gradeLabel(focusedGrade)}`
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
              <div className="relative min-h-[320px] flex-1">
                <div className="absolute inset-0">
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
              </div>
            </Card>

            <Card className="flex flex-col">
              <SectionHeader
                icon={Globe}
                title="Kebutuhan Jumlah Ekspor"
                subtitle={
                  focusedGrade
                    ? `Estimasi per grade (BPS 2024), fokus ${gradeLabel(focusedGrade)}`
                    : "Estimasi komposisi per grade (BPS 2024)"
                }
              />

              <div className="rounded-lg border border-slate-100 bg-slate-50/80 p-2.5">
                <p className="mb-2 text-xs font-medium text-slate-600">
                  Komposisi total {EXPORT_TOTAL_TON.toLocaleString("id-ID")} ton
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

              <div className="mt-2 space-y-1.5">
                {exportNeeds.map((item) => {
                  const isFocused = focusedGrade === item.gradeId;
                  const isDimmed = focusedGrade !== null && !isFocused;

                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => toggleGradeFocus(item.gradeId)}
                      className={`block w-full rounded-lg border px-3 py-2 text-left transition-all ${
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

              <div className="mt-auto rounded-lg bg-emerald-50 px-3 py-2 text-center">
                <p className="text-sm font-semibold text-emerald-800">
                  Total Ekspor Nasional 2024:{" "}
                  <span className="text-base">
                    {EXPORT_TOTAL_TON.toLocaleString("id-ID")} ton
                  </span>
                </p>
              </div>
            </Card>
          </div>

          {/* Ringkasan Hari Ini */}
          <Card>
            <SectionHeader
              icon={Package}
              title="Ringkasan Nasional"
              subtitle="Komoditas manggis Indonesia (BPS/Kementan 2024)"
            />
            <div className="grid grid-cols-4 gap-2">
              {summaryStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-slate-100 bg-slate-50/80 p-3"
                >
                  <div
                    className={`mb-2 flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}
                  >
                    <stat.icon className={`h-4 w-4 ${stat.color}`} strokeWidth={2} />
                  </div>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                  <p className={`mt-1 text-xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="mt-1 text-[10px] leading-snug text-slate-400">{stat.hint}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Bottom row */}
          <div className="grid min-h-0 grid-cols-3 gap-2 overflow-hidden">
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
                subtitle="Pergerakan sepanjang 2026"
              />
              <div className="flex flex-1 flex-col justify-center divide-y divide-slate-100">
                {insightMetrics.map((metric) => {
                  const TrendIcon = metric.up ? TrendingUp : TrendingDown;
                  const valueColor = insightTrendColor(metric.value);

                  return (
                    <div
                      key={metric.label}
                      className="flex items-center justify-between py-2 first:pt-0"
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
        </main>

        {/* Footer */}
        <footer className="shrink-0 bg-[#0f2e22] px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Brand */}
            <div className="flex shrink-0 items-center gap-2.5">
              <span className="h-8 w-1 shrink-0 rounded-full bg-emerald-400/80" />
              <div>
                <p className="text-sm font-bold text-white">Manggis Indonesia</p>
                <p className="text-[11px] text-emerald-200/80">Berkualitas, Mendunia.</p>
              </div>
            </div>

            {/* Fitur */}
            {footerItems.map((item) => (
              <div key={item.title} className="flex shrink-0 items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-emerald-900/60">
                  <item.icon className="h-3.5 w-3.5 text-emerald-300" strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-white">{item.title}</p>
                  <p className="truncate text-[10px] text-emerald-200/75">{item.subtitle}</p>
                </div>
              </div>
            ))}

            {/* Logo mitra + email */}
            <div className="flex shrink-0 items-center gap-3">
              <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-1.5 ring-1 ring-white/10">
                {partnerLogos.map((logo) =>
                  logo.src ? (
                    <div
                      key={logo.alt}
                      className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-white shadow-sm"
                    >
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        fill
                        className="object-contain p-1"
                        sizes="44px"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div
                      key={logo.alt}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-dashed border-white/20 text-[8px] leading-none text-emerald-200/45"
                    >
                      Segera
                    </div>
                  ),
                )}
              </div>

              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex shrink-0 items-center gap-2 rounded-lg bg-emerald-700/90 px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-emerald-600"
              >
                <Mail className="h-4 w-4 text-emerald-200" strokeWidth={2} />
                <span>{CONTACT_EMAIL}</span>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
