import {
  Calendar,
  ChevronRight,
  Clock,
  Crown,
  Globe,
  Leaf,
  Mail,
  Package,
  ShieldCheck,
  Star,
  TrendingDown,
  TrendingUp,
  Truck,
  Weight,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { GradeChart, PriceTrendChart } from './components/Charts'
import { VideoCarousel } from './components/VideoCarousel'
import {
  CONTACT_EMAIL,
  exportDestinations,
  exportNeeds,
  EXPORT_TOTAL_TON,
  footerItems,
  formatClock,
  formatDateId,
  formatPrice,
  gradeLabel,
  GRADE_PRICES,
  insightMetrics,
  isGradeFocused,
  partnerLogos,
  summaryStats,
  type GradeId,
} from './data'
import './App.css'

type LayoutMode = 'landscape' | 'portrait'

const SUMMARY_ICONS: Record<(typeof summaryStats)[number]['tone'], LucideIcon> = {
  violet: Weight,
  sky: Truck,
  emerald: Leaf,
  amber: TrendingUp,
}

const GRADE_ICONS: Record<GradeId, LucideIcon> = {
  A: Crown,
  B: Leaf,
  C: Star,
}

function getViewportSize() {
  const vv = typeof window !== 'undefined' ? window.visualViewport : null
  const widths = [
    vv?.width,
    document.documentElement?.clientWidth,
    window.innerWidth,
  ].filter((n): n is number => typeof n === 'number' && n > 0)
  const heights = [
    vv?.height,
    document.documentElement?.clientHeight,
    window.innerHeight,
  ].filter((n): n is number => typeof n === 'number' && n > 0)

  // Ambil nilai terkecil agar chrome browser TV tidak membuat konten overflow
  return {
    width: Math.max(1, Math.floor(Math.min(...widths))),
    height: Math.max(1, Math.floor(Math.min(...heights))),
    offsetTop: Math.max(0, Math.floor(vv?.offsetTop ?? 0)),
    offsetLeft: Math.max(0, Math.floor(vv?.offsetLeft ?? 0)),
  }
}

function resolveLayoutMode(width: number, height: number): LayoutMode {
  const isLandscape = width >= height
  const isWideEnough = width >= 1024
  if (isLandscape || isWideEnough) return 'landscape'
  return 'portrait'
}

function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <article className={`card ${className}`.trim()}>{children}</article>
}

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: LucideIcon
  title: string
  subtitle?: string
}) {
  return (
    <div className="section-head">
      <div className="section-head-row">
        <Icon className="section-icon" strokeWidth={2} />
        <h2>{title}</h2>
      </div>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
  )
}

function ExportDestinationsCard() {
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined)
  const [hoverIndex, setHoverIndex] = useState<number | undefined>(undefined)
  const activeIndex = hoverIndex ?? selectedIndex

  return (
    <Card className="dest-card">
      <SectionHeader
        icon={Globe}
        title="Tujuan Ekspor Utama"
        subtitle="Volume tahunan (UN Comtrade 2024)"
      />
      <ul className="dest-list">
        {exportDestinations.map((dest, index) => (
          <li key={dest.country}>
            <button
              type="button"
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(undefined)}
              onClick={() =>
                setSelectedIndex((current) => (current === index ? undefined : index))
              }
              className={`dest-item ${activeIndex === index ? 'active' : ''}`}
            >
              <span className="dest-item-top">
                <span className="dest-country">
                  <span className="dest-flag">
                    <img src={dest.flagSrc} alt="" />
                  </span>
                  {dest.country}
                </span>
                <ChevronRight className="dest-chevron" strokeWidth={2} />
              </span>
              {activeIndex === index ? (
                <span className="dest-detail">
                  <span>
                    Volume: <strong>{dest.volume}</strong>
                  </span>
                  <span>{dest.share}% dari total ekspor nasional</span>
                </span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>
    </Card>
  )
}

export default function App() {
  const [now, setNow] = useState<Date | null>(null)
  const [focusedGrade, setFocusedGrade] = useState<GradeId | null>(null)
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('landscape')
  const [viewportBox, setViewportBox] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
    offsetTop: 0,
    offsetLeft: 0,
  })

  const toggleGradeFocus = (gradeId: GradeId) => {
    setFocusedGrade((current) => (current === gradeId ? null : gradeId))
  }

  useEffect(() => {
    setNow(new Date())
    const tick = window.setInterval(() => setNow(new Date()), 60000)
    return () => window.clearInterval(tick)
  }, [])

  useEffect(() => {
    const updateLayout = () => {
      const box = getViewportSize()
      const mode = resolveLayoutMode(box.width, box.height)

      setLayoutMode(mode)
      setViewportBox(box)

      const root = document.documentElement
      root.dataset.layout = mode
      document.body.dataset.layout = mode
      root.style.setProperty('--vv-width', `${box.width}px`)
      root.style.setProperty('--vv-height', `${box.height}px`)
      root.style.setProperty('--vv-top', `${box.offsetTop}px`)
      root.style.setProperty('--vv-left', `${box.offsetLeft}px`)
    }

    updateLayout()
    window.addEventListener('resize', updateLayout)
    window.addEventListener('orientationchange', updateLayout)
    window.visualViewport?.addEventListener('resize', updateLayout)
    window.visualViewport?.addEventListener('scroll', updateLayout)
    return () => {
      window.removeEventListener('resize', updateLayout)
      window.removeEventListener('orientationchange', updateLayout)
      window.visualViewport?.removeEventListener('resize', updateLayout)
      window.visualViewport?.removeEventListener('scroll', updateLayout)
    }
  }, [])

  // Landscape: isi penuh area terlihat (tanpa letterbox / gap kiri-kanan)
  const landscapeStyle =
    layoutMode === 'landscape'
      ? ({
          width: '100%',
          height: '100%',
        } as CSSProperties)
      : undefined

  return (
    <div
      className="viewport"
      data-layout={layoutMode}
      style={
        layoutMode === 'landscape'
          ? {
              width: viewportBox.width,
              height: viewportBox.height,
              top: viewportBox.offsetTop,
              left: viewportBox.offsetLeft,
            }
          : undefined
      }
    >
      <div className="canvas" data-layout={layoutMode} style={landscapeStyle}>
        <header className="topbar">
          <div className="brand">
            <h1>Dashboard Monitoring Manggis</h1>
            <p>Sortasi, Harga, Tren, dan Kebutuhan Ekspor</p>
          </div>
          <div className="clock">
            <div>
              <Calendar className="clock-icon" strokeWidth={2} />
              <span>{now ? formatDateId(now) : '-'}</span>
            </div>
            <div>
              <Clock className="clock-icon" strokeWidth={2} />
              <span>{now ? formatClock(now) : '-'}</span>
            </div>
          </div>
        </header>

        <main className="main-grid">
          <div className="row-top">
            <Card className="video-card">
              <VideoCarousel />
            </Card>

            <Card className="trend-card">
              <PriceTrendChart focusedGrade={focusedGrade} onGradeFocus={toggleGradeFocus} />
            </Card>

            <div className="grade-prices">
              {GRADE_PRICES.map((grade) => {
                const Icon = GRADE_ICONS[grade.id]
                const isFocused = focusedGrade === grade.id
                const isDimmed = focusedGrade !== null && !isFocused

                return (
                  <button
                    key={grade.id}
                    type="button"
                    onClick={() => toggleGradeFocus(grade.id)}
                    className={`grade-price ${isFocused ? 'focused' : ''} ${
                      isDimmed ? 'dimmed' : ''
                    }`}
                  >
                    <div className="grade-price-media">
                      <img
                        src={grade.image}
                        alt={grade.label}
                        style={{ objectPosition: grade.imagePosition }}
                      />
                      <span className={`grade-badge ${grade.badgeClass}`}>
                        <Icon strokeWidth={2.5} />
                        {grade.badgeLabel}
                      </span>
                    </div>
                    <div className={`grade-price-bar ${grade.barClass}`}>
                      <span>{grade.label}</span>
                      <strong>{formatPrice(grade.price)}/kg</strong>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="row-bottom">
            <Card className="summary-card">
              <SectionHeader
                icon={Package}
                title="Ringkasan Nasional"
                subtitle="Komoditas manggis Indonesia (BPS/Kementan 2024)"
              />
              <div className="summary-grid">
                {summaryStats.map((stat) => {
                  const Icon = SUMMARY_ICONS[stat.tone]
                  return (
                    <div key={stat.label} className="summary-item">
                      <div className={`summary-icon tone-${stat.tone}`}>
                        <Icon strokeWidth={2} />
                      </div>
                      <p className="summary-label">{stat.label}</p>
                      <p className={`summary-value tone-${stat.tone}`}>{stat.value}</p>
                      <p className="summary-hint">{stat.hint}</p>
                    </div>
                  )
                })}
              </div>
            </Card>

            <Card className="export-card">
              <SectionHeader
                icon={Globe}
                title="Kebutuhan Jumlah Ekspor"
                subtitle={
                  focusedGrade
                    ? `Estimasi per grade (BPS 2024), fokus ${gradeLabel(focusedGrade)}`
                    : 'Estimasi komposisi per grade (BPS 2024)'
                }
              />

              <div className="export-stack">
                <p className="export-total-label">
                  Komposisi total {EXPORT_TOTAL_TON.toLocaleString('id-ID')} ton
                </p>
                <div className="export-bar">
                  {exportNeeds.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => toggleGradeFocus(item.gradeId)}
                      style={{
                        width: `${item.percent}%`,
                        backgroundColor: item.color,
                        opacity: isGradeFocused(item.gradeId, focusedGrade) ? 1 : 0.25,
                      }}
                      title={`${item.label}: ${item.value}`}
                    />
                  ))}
                </div>
                <div className="export-legend">
                  {exportNeeds.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => toggleGradeFocus(item.gradeId)}
                      className={isGradeFocused(item.gradeId, focusedGrade) ? '' : 'dimmed'}
                    >
                      <i style={{ backgroundColor: item.color }} />
                      {item.label} {item.percent}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="export-rows">
                {exportNeeds.map((item) => {
                  const isFocused = focusedGrade === item.gradeId
                  const isDimmed = focusedGrade !== null && !isFocused
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => toggleGradeFocus(item.gradeId)}
                      className={`export-row ${isFocused ? 'focused' : ''} ${
                        isDimmed ? 'dimmed' : ''
                      }`}
                    >
                      <div className="export-row-top">
                        <span>{item.label}</span>
                        <strong>{item.value}</strong>
                      </div>
                      <div className="export-row-track">
                        <div
                          style={{
                            width: `${item.percent}%`,
                            backgroundColor: item.color,
                            opacity: isGradeFocused(item.gradeId, focusedGrade) ? 1 : 0.35,
                          }}
                        />
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="export-footer">
                Total Ekspor Nasional 2024:{' '}
                <strong>{EXPORT_TOTAL_TON.toLocaleString('id-ID')} ton</strong>
              </div>
            </Card>

            <div className="dest-wrap">
              <ExportDestinationsCard />
            </div>

            <Card className="grade-card">
              <GradeChart focusedGrade={focusedGrade} onGradeFocus={toggleGradeFocus} />
            </Card>

            <Card className="insight-card">
              <SectionHeader
                icon={TrendingUp}
                title="Insight Performa"
                subtitle="Pergerakan sepanjang 2026"
              />
              <div className="insight-list">
                {insightMetrics.map((metric) => {
                  const TrendIcon = metric.up ? TrendingUp : TrendingDown
                  const tone = metric.value.startsWith('-') ? 'down' : 'up'
                  return (
                    <div key={metric.label} className="insight-row">
                      <div>
                        <p>{metric.label}</p>
                        <span>{metric.comparison}</span>
                      </div>
                      <div className={`insight-value ${tone}`}>
                        <strong>{metric.value}</strong>
                        <TrendIcon strokeWidth={2.5} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>
        </main>

        <footer className="footer">
          <div className="footer-brand">
            <span className="footer-accent" aria-hidden />
            <div>
              <p>Manggis Indonesia</p>
              <span>Berkualitas, Mendunia.</span>
            </div>
          </div>

          {footerItems.map((item) => {
            const Icon = item.icon === 'shield' ? ShieldCheck : Globe
            return (
              <div key={item.title} className="footer-feature">
                <div className="footer-feature-icon">
                  <Icon strokeWidth={2} />
                </div>
                <div>
                  <p>{item.title}</p>
                  <span>{item.subtitle}</span>
                </div>
              </div>
            )
          })}

          <div className="footer-partners">
            <div className="partner-box">
              {partnerLogos.map((logo) => (
                <div key={logo.alt} className="partner-logo">
                  <img src={logo.src} alt={logo.alt} />
                </div>
              ))}
            </div>
            <a className="footer-mail" href={`mailto:${CONTACT_EMAIL}`}>
              <Mail strokeWidth={2} />
              <span>{CONTACT_EMAIL}</span>
            </a>
          </div>
        </footer>
      </div>
    </div>
  )
}
