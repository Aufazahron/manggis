export type Grade = 'A' | 'B' | 'C' | 'Reject'

export interface Kpi {
  id: string
  label: string
  value: string
  unit: string
  delta: string
  positive: boolean
  hint: string
}

export interface ProductionPoint {
  day: string
  kg: number
  target: number
}

export interface GradeShare {
  grade: Grade
  persen: number
  kg: number
  color: string
}

export interface InventoryRow {
  lokasi: string
  gradeA: number
  gradeB: number
  gradeC: number
  total: number
  kapasitas: number
}

export interface Shipment {
  id: string
  tujuan: string
  volume: string
  status: 'Dalam perjalanan' | 'Siap kirim' | 'Terkirim' | 'Packing'
  eta: string
}

export interface Activity {
  time: string
  text: string
  type: 'panen' | 'qc' | 'kirim' | 'alert'
}

export interface VideoSlide {
  id: string
  title: string
  subtitle: string
  src: string
  poster: string
}

export const farmMeta = {
  name: 'MANGGIS',
  estate: 'Kebun Manggis Sari · Blok A–D',
  region: 'Tasikmalaya, Jawa Barat',
  season: 'Musim Panen Puncak',
}

export const kpis: Kpi[] = [
  {
    id: 'produksi',
    label: 'Produksi Hari Ini',
    value: '2.840',
    unit: 'kg',
    delta: '+12,4%',
    positive: true,
    hint: 'vs kemarin',
  },
  {
    id: 'stok',
    label: 'Stok Gudang',
    value: '18.650',
    unit: 'kg',
    delta: '74% kapasitas',
    positive: true,
    hint: '4 cold storage',
  },
  {
    id: 'grade',
    label: 'Grade A',
    value: '68',
    unit: '%',
    delta: '+3,1 pt',
    positive: true,
    hint: 'hasil QC pagi',
  },
  {
    id: 'harga',
    label: 'Harga Pasar',
    value: '42.500',
    unit: 'Rp/kg',
    delta: '+Rp 1.200',
    positive: true,
    hint: 'rata-rata Grade A',
  },
  {
    id: 'target',
    label: 'Target Bulanan',
    value: '86',
    unit: '%',
    delta: '64.5 / 75 ton',
    positive: true,
    hint: 'progres Juli',
  },
]

export const productionWeek: ProductionPoint[] = [
  { day: 'Jum', kg: 2140, target: 2500 },
  { day: 'Sab', kg: 2680, target: 2500 },
  { day: 'Min', kg: 1920, target: 2200 },
  { day: 'Sen', kg: 2450, target: 2500 },
  { day: 'Sel', kg: 2710, target: 2500 },
  { day: 'Rab', kg: 2530, target: 2500 },
  { day: 'Kam', kg: 2840, target: 2600 },
]

export const gradeShares: GradeShare[] = [
  { grade: 'A', persen: 68, kg: 12682, color: '#3D9B6E' },
  { grade: 'B', persen: 22, kg: 4103, color: '#E8A84A' },
  { grade: 'C', persen: 7, kg: 1305, color: '#6B8F9C' },
  { grade: 'Reject', persen: 3, kg: 560, color: '#C45C48' },
]

export const inventory: InventoryRow[] = [
  { lokasi: 'Cold Storage 1', gradeA: 4200, gradeB: 1100, gradeC: 280, total: 5580, kapasitas: 7000 },
  { lokasi: 'Cold Storage 2', gradeA: 3850, gradeB: 980, gradeC: 310, total: 5140, kapasitas: 7000 },
  { lokasi: 'Cold Storage 3', gradeA: 2980, gradeB: 1240, gradeC: 420, total: 4640, kapasitas: 6000 },
  { lokasi: 'Packing Hall', gradeA: 1652, gradeB: 783, gradeC: 295, total: 3290, kapasitas: 4000 },
]

export const shipments: Shipment[] = [
  { id: 'SH-2407', tujuan: 'Jakarta · Modern Trade', volume: '3.200 kg', status: 'Dalam perjalanan', eta: '14:40' },
  { id: 'SH-2408', tujuan: 'Bandung · Pasar Induk', volume: '1.850 kg', status: 'Packing', eta: '16:10' },
  { id: 'SH-2409', tujuan: 'Surabaya · Export Prep', volume: '4.500 kg', status: 'Siap kirim', eta: '18:00' },
  { id: 'SH-2410', tujuan: 'Singapore · FCL', volume: '8.000 kg', status: 'Terkirim', eta: 'Selesai' },
]

export const activities: Activity[] = [
  { time: '13:52', text: 'Panen Blok C selesai — 920 kg masuk sorting', type: 'panen' },
  { time: '13:20', text: 'QC Grade A naik ke 68% setelah sortir ulang', type: 'qc' },
  { time: '12:45', text: 'Truk SH-2407 berangkat menuju Jakarta', type: 'kirim' },
  { time: '11:30', text: 'Kelembaban Cold Storage 2 stabil di 88%', type: 'alert' },
  { time: '10:15', text: 'Packing Hall mulai batch ekspor Singapore', type: 'kirim' },
]

export const weather = {
  temp: 27,
  humidity: 78,
  rainChance: 35,
  wind: 8,
  soilMoisture: 62,
  status: 'Cocok untuk panen sore',
}

export const videos: VideoSlide[] = [
  {
    id: 'v1',
    title: 'Panen Blok A',
    subtitle: 'Tim panen pagi · Grade A dominan',
    src: 'https://videos.pexels.com/video-files/5532770/5532770-uhd_2560_1440_30fps.mp4',
    poster: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'v2',
    title: 'Sorting & QC',
    subtitle: 'Line sortir otomatis · cold chain',
    src: 'https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4',
    poster: 'https://images.pexels.com/photos/2294471/pexels-photo-2294471.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'v3',
    title: 'Packing Export',
    subtitle: 'Persiapan pengiriman FCL',
    src: 'https://videos.pexels.com/video-files/4057400/4057400-uhd_2560_1440_25fps.mp4',
    poster: 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
]
