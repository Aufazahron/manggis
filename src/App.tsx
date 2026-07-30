import { useEffect, useState } from 'react'
import {
  activities,
  farmMeta,
  inventory,
  kpis,
  shipments,
  weather,
} from './data'
import { GradeChart, ProductionChart } from './components/Charts'
import { VideoCarousel } from './components/VideoCarousel'
import './App.css'

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])
  return now
}

function statusClass(status: string) {
  if (status === 'Terkirim') return 'tag ok'
  if (status === 'Dalam perjalanan') return 'tag move'
  if (status === 'Siap kirim') return 'tag ready'
  return 'tag pack'
}

export default function App() {
  const now = useClock()
  const dateLabel = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const timeLabel = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  return (
    <div className="tv">
      <div className="bg-glow" aria-hidden />
      <div className="bg-leaf" aria-hidden />

      <header className="topbar">
        <div className="brand">
          <div className="brand-mark" aria-hidden>
            <span />
          </div>
          <div>
            <h1>{farmMeta.name}</h1>
            <p>
              {farmMeta.estate} · {farmMeta.region}
            </p>
          </div>
        </div>

        <div className="season-chip">{farmMeta.season}</div>

        <div className="clock">
          <strong>{timeLabel}</strong>
          <span>{dateLabel}</span>
        </div>
      </header>

      <section className="kpi-row">
        {kpis.map((k) => (
          <article key={k.id} className="kpi">
            <span className="kpi-label">{k.label}</span>
            <div className="kpi-value">
              <strong>{k.value}</strong>
              <em>{k.unit}</em>
            </div>
            <div className={`kpi-delta ${k.positive ? 'up' : 'down'}`}>
              {k.delta}
              <span>{k.hint}</span>
            </div>
          </article>
        ))}
      </section>

      <main className="grid-main">
        <ProductionChart />
        <VideoCarousel />
        <GradeChart />
      </main>

      <section className="grid-bottom">
        <article className="panel inventory-panel">
          <div className="panel-head">
            <div>
              <h2>Stok per Lokasi</h2>
              <p>Cold storage & packing hall</p>
            </div>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Lokasi</th>
                <th>A</th>
                <th>B</th>
                <th>C</th>
                <th>Total</th>
                <th>Kapasitas</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((row) => {
                const pct = Math.round((row.total / row.kapasitas) * 100)
                return (
                  <tr key={row.lokasi}>
                    <td>{row.lokasi}</td>
                    <td>{row.gradeA.toLocaleString('id-ID')}</td>
                    <td>{row.gradeB.toLocaleString('id-ID')}</td>
                    <td>{row.gradeC.toLocaleString('id-ID')}</td>
                    <td>
                      <div className="cap">
                        <strong>{row.total.toLocaleString('id-ID')} kg</strong>
                        <div className="cap-bar">
                          <i style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </td>
                    <td>{pct}%</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </article>

        <article className="panel ship-panel">
          <div className="panel-head">
            <div>
              <h2>Pengiriman Hari Ini</h2>
              <p>Status outbound logistics</p>
            </div>
          </div>
          <ul className="ship-list">
            {shipments.map((s) => (
              <li key={s.id}>
                <div>
                  <strong>{s.id}</strong>
                  <span>{s.tujuan}</span>
                </div>
                <b>{s.volume}</b>
                <em className={statusClass(s.status)}>{s.status}</em>
                <span className="eta">{s.eta}</span>
              </li>
            ))}
          </ul>
        </article>

        <aside className="side-stack">
          <article className="panel weather-panel">
            <div className="panel-head">
              <div>
                <h2>Kondisi Kebun</h2>
                <p>{weather.status}</p>
              </div>
            </div>
            <div className="weather-grid">
              <div>
                <span>Suhu</span>
                <strong>{weather.temp}°C</strong>
              </div>
              <div>
                <span>Kelembaban</span>
                <strong>{weather.humidity}%</strong>
              </div>
              <div>
                <span>Hujan</span>
                <strong>{weather.rainChance}%</strong>
              </div>
              <div>
                <span>Angin</span>
                <strong>{weather.wind} km/j</strong>
              </div>
              <div className="wide">
                <span>Kelembaban Tanah</span>
                <div className="soil">
                  <i style={{ width: `${weather.soilMoisture}%` }} />
                  <b>{weather.soilMoisture}%</b>
                </div>
              </div>
            </div>
          </article>

          <article className="panel activity-panel">
            <div className="panel-head">
              <div>
                <h2>Aktivitas Terbaru</h2>
                <p>Update operasional real-time</p>
              </div>
            </div>
            <ul className="activity-list">
              {activities.map((a) => (
                <li key={`${a.time}-${a.text}`} className={`act-${a.type}`}>
                  <time>{a.time}</time>
                  <p>{a.text}</p>
                </li>
              ))}
            </ul>
          </article>
        </aside>
      </section>

      <footer className="footer">
        <span>Dashboard Produksi Manggis · Dtech Edge Innovations</span>
        <span>Auto-refresh visual · Optimasi layar TV 43"</span>
      </footer>
    </div>
  )
}
