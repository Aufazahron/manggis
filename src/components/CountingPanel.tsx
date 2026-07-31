import { Activity, Hash } from 'lucide-react'
import { MQTT_TOPIC, useMqttCount, type MqttConnectionStatus } from '../hooks/useMqttCount'

function statusLabel(status: MqttConnectionStatus, brokerConfigured: boolean): string {
  if (!brokerConfigured) return 'Broker belum dikonfigurasi'
  if (status === 'connected') return 'Terhubung'
  if (status === 'connecting') return 'Menghubungkan'
  return 'Terputus'
}

export function CountingPanel() {
  const { count, status, updatedAt, brokerConfigured } = useMqttCount()

  return (
    <article className="card counting-card">
      <div className="section-head counting-head">
        <div className="section-head-row">
          <Hash className="section-icon" strokeWidth={2} />
          <h2>Counting Manggis</h2>
        </div>
        <div className="counting-meta">
          <span className={`counting-status status-${status}`}>
            <i aria-hidden />
            {statusLabel(status, brokerConfigured)}
          </span>
          <p>
            {MQTT_TOPIC} · update real-time
            {updatedAt
              ? ` · ${updatedAt.toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}`
              : ''}
          </p>
        </div>
      </div>

      <div className="counting-body">
        <div className="counting-value-wrap">
          <Activity className="counting-accent" strokeWidth={1.75} aria-hidden />
          <p className="counting-label">Total hitungan</p>
          <p className="counting-value" aria-live="polite">
            {count === null ? '—' : count.toLocaleString('id-ID')}
          </p>
          <p className="counting-unit">buah · ESP32 MQTT</p>
        </div>
      </div>
    </article>
  )
}
