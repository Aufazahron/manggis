import { useEffect, useRef, useState } from 'react'
import { videos, type VideoSlide } from '../data'

export function VideoCarousel() {
  const [index, setIndex] = useState(0)
  const [failed, setFailed] = useState<Record<string, boolean>>({})
  const videoRef = useRef<HTMLVideoElement>(null)
  const current: VideoSlide = videos[index]

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % videos.length)
    }, 18000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    el.load()
    const play = el.play()
    if (play) play.catch(() => undefined)
  }, [index, failed])

  const showPoster = failed[current.id]

  return (
    <section className="panel video-panel">
      <div className="panel-head">
        <div>
          <h2>Monitoring Lapangan</h2>
          <p>Carousel video kebun & proses pasca panen</p>
        </div>
        <div className="video-dots" aria-hidden>
          {videos.map((v, i) => (
            <button
              key={v.id}
              type="button"
              className={`dot ${i === index ? 'active' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={v.title}
            />
          ))}
        </div>
      </div>

      <div className="video-stage">
        {showPoster ? (
          <img className="video-media" src={current.poster} alt={current.title} />
        ) : (
          <video
            ref={videoRef}
            className="video-media"
            key={current.id}
            src={current.src}
            poster={current.poster}
            muted
            playsInline
            autoPlay
            loop
            onError={() => setFailed((f) => ({ ...f, [current.id]: true }))}
          />
        )}
        <div className="video-scrim" />
        <div className="video-caption">
          <span className="video-badge">LIVE FEED</span>
          <h3>{current.title}</h3>
          <p>{current.subtitle}</p>
        </div>
        <div className="video-progress">
          <div className="video-progress-bar" key={current.id} />
        </div>
      </div>

      <div className="video-thumbs">
        {videos.map((v, i) => (
          <button
            key={v.id}
            type="button"
            className={`thumb ${i === index ? 'active' : ''}`}
            onClick={() => setIndex(i)}
          >
            <img src={v.poster} alt="" />
            <span>{v.title}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
