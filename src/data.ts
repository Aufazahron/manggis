export type GradeId = 'A' | 'B' | 'C'

export const COLOR_A = '#6d28d9'
export const COLOR_B = '#16a34a'
export const COLOR_C = '#64748b'

export const GRADE_LABELS: Record<GradeId, string> = {
  A: 'Grade A',
  B: 'Grade B',
  C: 'Grade C',
}

export const GRADE_LINES = [
  { id: 'A' as const, dataKey: 'gradeA' as const, name: GRADE_LABELS.A, color: COLOR_A },
  { id: 'B' as const, dataKey: 'gradeB' as const, name: GRADE_LABELS.B, color: COLOR_B },
  { id: 'C' as const, dataKey: 'gradeC' as const, name: GRADE_LABELS.C, color: COLOR_C },
]

export const GRADE_PRICES = [
  {
    id: 'A' as const,
    label: GRADE_LABELS.A,
    badgeLabel: 'Grade A',
    badgeClass: 'badge-a',
    barClass: 'bar-a',
    price: 52000,
    image: '/grade-a.webp',
    imagePosition: 'center 40%',
  },
  {
    id: 'B' as const,
    label: GRADE_LABELS.B,
    badgeLabel: 'Grade B',
    badgeClass: 'badge-b',
    barClass: 'bar-b',
    price: 35000,
    image: '/grade-b.webp',
    imagePosition: 'center center',
  },
  {
    id: 'C' as const,
    label: GRADE_LABELS.C,
    badgeLabel: 'Grade C',
    badgeClass: 'badge-c',
    barClass: 'bar-c',
    price: 12000,
    image: '/grade-c.webp',
    imagePosition: 'center center',
  },
]

export const trendData = [
  { month: 'Feb', gradeA: 48000, gradeB: 32000, gradeC: 10000 },
  { month: 'Mar', gradeA: 55000, gradeB: 36000, gradeC: 12000 },
  { month: 'Apr', gradeA: 58000, gradeB: 40000, gradeC: 14000 },
  { month: 'Mei', gradeA: 56000, gradeB: 38000, gradeC: 13000 },
  { month: 'Jun', gradeA: 53000, gradeB: 36000, gradeC: 12000 },
  { month: 'Jul', gradeA: 52000, gradeB: 35000, gradeC: 12000 },
]

export const EXPORT_SHARE = { A: 65, B: 30, C: 5 } as const
export const EXPORT_TOTAL_TON = 96000
export const NATIONAL_PRODUCTION_TON = 416753
export const TOP_PROVINCE = 'Jawa Barat'
export const TOP_PROVINCE_TON = 100117
export const AVG_PRICE_A = 52000

export const exportNeeds = (['A', 'B', 'C'] as const).map((gradeId) => ({
  gradeId,
  label: GRADE_LABELS[gradeId],
  value: `${(Math.round((EXPORT_TOTAL_TON * EXPORT_SHARE[gradeId]) / 100 / 1000) * 1000).toLocaleString('id-ID')} ton`,
  percent: EXPORT_SHARE[gradeId],
  color: gradeId === 'A' ? COLOR_A : gradeId === 'B' ? COLOR_B : COLOR_C,
}))

export const summaryStats = [
  {
    label: 'Produksi Nasional',
    value: `${Math.round(NATIONAL_PRODUCTION_TON / 1000)} rb ton`,
    hint: 'Produksi manggis 2024 (BPS)',
    tone: 'violet',
  },
  {
    label: 'Volume Ekspor',
    value: `${Math.round(EXPORT_TOTAL_TON / 1000)} rb ton`,
    hint: `±${Math.round((EXPORT_TOTAL_TON / NATIONAL_PRODUCTION_TON) * 100)}% dari produksi nasional`,
    tone: 'sky',
  },
  {
    label: 'Provinsi Teratas',
    value: TOP_PROVINCE,
    hint: `${Math.round(TOP_PROVINCE_TON / 1000)} rb ton • ${Math.round((TOP_PROVINCE_TON / NATIONAL_PRODUCTION_TON) * 100)}% nasional`,
    tone: 'emerald',
  },
  {
    label: 'Harga Rata-rata',
    value: `Rp${Math.round(AVG_PRICE_A / 1000)} rb/kg`,
    hint: 'Grade A/super 2026',
    tone: 'amber',
  },
] as const

export const partnerLogos = [
  { src: '/upi.png', alt: 'Universitas Pendidikan Indonesia' },
  { src: '/d-tech.png', alt: 'DTECH Edge Innovation' },
]

export const CONTACT_EMAIL = 'dtech.inno@gmail.com'

export const footerItems = [
  { title: 'Kualitas Terjaga', subtitle: 'Sortasi & QC Ketat', icon: 'shield' as const },
  { title: 'Pasar Global Terpercaya', subtitle: 'Buah Manggis Indonesia', icon: 'globe' as const },
]

export const PROCESS_VIDEOS = [
  {
    src: '/videos/proses-tanam.mp4',
    step: 'Tanam',
    caption: 'Bibit & perawatan kebun manggis',
  },
  {
    src: '/videos/proses-panen.mp4',
    step: 'Panen',
    caption: 'Pemetikan buah matang di kebun',
  },
  {
    src: '/videos/proses-sortasi.mp4',
    step: 'Sortasi',
    caption: 'Sortasi & grading di pabrik',
  },
] as const

export function formatPrice(value: number): string {
  return `Rp ${value.toLocaleString('id-ID')}`
}

export function formatYAxis(value: number): string {
  return `${Math.round(value / 1000)}rb`
}

export function formatClock(date: Date): string {
  const h = String(date.getHours()).padStart(2, '0')
  const m = String(date.getMinutes()).padStart(2, '0')
  return `${h}:${m} WIB`
}

export function formatDateId(date: Date): string {
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function isGradeFocused(gradeId: GradeId, focusedGrade: GradeId | null): boolean {
  return !focusedGrade || focusedGrade === gradeId
}

export function gradeLabel(id: GradeId): string {
  return GRADE_LABELS[id]
}
