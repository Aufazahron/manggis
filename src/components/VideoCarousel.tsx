import { Play, Video } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { PROCESS_VIDEOS } from '../data'

/**
 * Player khusus browser Smart TV (Coocaa / Android WebView / X5):
 * - Hindari remount via key (sering bikin decoder WebView stuck)
 * - preload metadata (preload=auto sering gagal di TV)
 * - Atribut X5/WebKit untuk kernel browser TV China
 * - Retry play agresif + recovery on error
 */
export function VideoCarousel({ className = '' }: { className?: string }) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)
  const userPausedRef = useRef(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const retryTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clip = PROCESS_VIDEOS[index]

  const clearRetry = () => {
    if (retryTimerRef.current) {
      clearInterval(retryTimerRef.current)
      retryTimerRef.current = null
    }
  }

  const tryPlay = () => {
    const video = videoRef.current
    if (!video || userPausedRef.current) return

    video.muted = true
    video.defaultMuted = true
    video.setAttribute('muted', '')
    video.volume = 0

    const playPromise = video.play()
    if (playPromise !== undefined) {
      void playPromise
        .then(() => {
          setPlaying(true)
          setFailed(false)
          clearRetry()
        })
        .catch(() => {
          setPlaying(false)
        })
    }
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    userPausedRef.current = false
    setFailed(false)
    setPlaying(false)
    clearRetry()

    video.pause()
    video.removeAttribute('src')
    while (video.firstChild) {
      video.removeChild(video.firstChild)
    }

    const source = document.createElement('source')
    source.src = clip.src
    source.type = 'video/mp4'
    video.appendChild(source)

    video.load()

    const onCanPlay = () => tryPlay()
    const onLoadedData = () => tryPlay()
    const onPlaying = () => {
      setPlaying(true)
      setFailed(false)
      clearRetry()
    }
    const onPause = () => setPlaying(false)
    let errorJump: ReturnType<typeof setTimeout> | null = null
    const onError = () => {
      setFailed(true)
      setPlaying(false)
      errorJump = setTimeout(() => {
        setIndex((current) => (current + 1) % PROCESS_VIDEOS.length)
      }, 2500)
    }
    const onEnded = () => {
      setIndex((current) => (current + 1) % PROCESS_VIDEOS.length)
    }

    video.setAttribute('webkit-playsinline', 'true')
    video.setAttribute('playsinline', 'true')
    video.setAttribute('x5-playsinline', 'true')
    video.setAttribute('x5-video-player-type', 'h5')
    video.setAttribute('x5-video-player-fullscreen', 'false')
    video.setAttribute('x5-video-orientation', 'landscape')

    video.addEventListener('canplay', onCanPlay)
    video.addEventListener('loadeddata', onLoadedData)
    video.addEventListener('playing', onPlaying)
    video.addEventListener('pause', onPause)
    video.addEventListener('error', onError)
    video.addEventListener('ended', onEnded)

    retryTimerRef.current = setInterval(() => {
      if (!userPausedRef.current && video.paused) tryPlay()
    }, 1500)

    const immediate = window.setTimeout(tryPlay, 120)

    return () => {
      window.clearTimeout(immediate)
      if (errorJump) clearTimeout(errorJump)
      clearRetry()
      video.removeEventListener('canplay', onCanPlay)
      video.removeEventListener('loadeddata', onLoadedData)
      video.removeEventListener('playing', onPlaying)
      video.removeEventListener('pause', onPause)
      video.removeEventListener('error', onError)
      video.removeEventListener('ended', onEnded)
    }
  }, [index, clip.src])

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') tryPlay()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [])

  const togglePlayback = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      userPausedRef.current = false
      tryPlay()
    } else {
      userPausedRef.current = true
      clearRetry()
      video.pause()
    }
  }

  return (
    <div className={`video-stage ${className}`.trim()}>
      <video
        ref={videoRef}
        className="video-media"
        autoPlay
        muted
        playsInline
        preload="metadata"
        controls={false}
        disablePictureInPicture
      />

      <div className="video-scrim" aria-hidden />

      <div className="video-steps" aria-hidden>
        {PROCESS_VIDEOS.map((item, videoIndex) => (
          <span
            key={item.step}
            className={`video-step ${videoIndex === index ? 'active' : ''}`}
          />
        ))}
      </div>

      <button
        type="button"
        className="video-toggle"
        onClick={togglePlayback}
        aria-label={playing ? 'Jeda video' : 'Putar video'}
      >
        <span className={`video-toggle-btn ${playing ? 'is-playing' : ''}`}>
          {playing ? (
            <span className="pause-icon" aria-hidden>
              <i />
              <i />
            </span>
          ) : (
            <Play className="play-icon" strokeWidth={0} fill="currentColor" />
          )}
        </span>
      </button>

      <div className="video-caption">
        <span className="video-caption-left">
          <Video className="video-caption-icon" strokeWidth={2} />
          <span>
            {failed ? 'Memuat ulang video…' : `${clip.step}: ${clip.caption}`}
          </span>
        </span>
        <span className="video-caption-count">
          {index + 1}/{PROCESS_VIDEOS.length}
        </span>
      </div>
    </div>
  )
}
