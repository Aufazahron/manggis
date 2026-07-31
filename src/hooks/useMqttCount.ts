import mqtt, { type MqttClient } from 'mqtt'
import { useEffect, useState } from 'react'

export type MqttConnectionStatus = 'connecting' | 'connected' | 'disconnected'

export const MQTT_TOPIC = 'dtek/manggis/data'
export const MQTT_USERNAME = 'manggis'
export const MQTT_PASSWORD = 'manggis'

function parseCountPayload(raw: string): number | null {
  const trimmed = raw.trim()
  if (!trimmed) return null
  const value = Number(trimmed)
  if (!Number.isFinite(value)) return null
  return value
}

export function useMqttCount() {
  const [count, setCount] = useState<number | null>(null)
  const [status, setStatus] = useState<MqttConnectionStatus>('connecting')
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null)
  const brokerUrl = import.meta.env.VITE_MQTT_URL as string | undefined

  useEffect(() => {
    if (!brokerUrl) {
      setStatus('disconnected')
      return
    }

    let client: MqttClient | null = null
    let disposed = false

    setStatus('connecting')

    try {
      client = mqtt.connect(brokerUrl, {
        username: MQTT_USERNAME,
        password: MQTT_PASSWORD,
        protocol: 'wss',
        reconnectPeriod: 3000,
        connectTimeout: 10_000,
        clean: true,
      })
    } catch {
      setStatus('disconnected')
      return
    }

    client.on('connect', () => {
      if (disposed) return
      setStatus('connected')
      client?.subscribe(MQTT_TOPIC, (err) => {
        if (err && !disposed) setStatus('disconnected')
      })
    })

    client.on('reconnect', () => {
      if (!disposed) setStatus('connecting')
    })

    client.on('close', () => {
      if (!disposed) setStatus('disconnected')
    })

    client.on('offline', () => {
      if (!disposed) setStatus('disconnected')
    })

    client.on('error', () => {
      if (!disposed) setStatus('disconnected')
    })

    client.on('message', (topic, payload) => {
      if (disposed || topic !== MQTT_TOPIC) return
      const next = parseCountPayload(payload.toString())
      if (next === null) return
      setCount(next)
      setUpdatedAt(new Date())
    })

    return () => {
      disposed = true
      client?.end(true)
      client = null
    }
  }, [brokerUrl])

  return { count, status, updatedAt, topic: MQTT_TOPIC, brokerConfigured: Boolean(brokerUrl) }
}
