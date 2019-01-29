import * as React from 'react'
import { CacheEntry } from '../preloadMedia';

interface Props {
  media: CacheEntry
  onComplete?: () => void
}

export default class Cinemagraph extends React.Component<Props> {
  private videoRef = React.createRef<HTMLVideoElement>()
  private audioRef = React.createRef<HTMLAudioElement>()
  private bgAudioRef = React.createRef<HTMLAudioElement>()

  private ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
  private sourceNode = this.ctx.createBufferSource()

  private lastPauseTime = new Date()

  componentDidMount() {
    if (!this.audioRef.current) { return }
    this.audioRef.current.addEventListener('ended', () => {
      if (this.props.onComplete) { this.props.onComplete() }
    })
  }

  shouldComponentUpdate(newProps: Props) {
    // lol
    return false
  }

  public playIfNotPlaying() {
    if (!this.audioRef.current) { return }
    if (!this.audioRef.current.paused) return

    const timeDiff = new Date().getTime() - this.lastPauseTime.getTime()
    if (timeDiff > 5000) {
      this.audioRef.current.load()
    }
    this.audioRef.current.play()
  }

  public pause() {
    if (!this.audioRef.current) { return }
    this.lastPauseTime = new Date()
    this.audioRef.current.pause()
  }

  public loadVideo(media: CacheEntry) {
    console.log("Loading video", media.name)
    this.setState({ media })

    if (this.videoRef.current && media) {
      if (media.video) {
        this.videoRef.current.src = media.video
        this.videoRef.current.load()
      } else {
        this.videoRef.current.src = "broken"
      }
    }

    if (this.audioRef.current) {
      if (media.dialog) {
        console.log("Has dialog!")
        this.audioRef.current.src = media.dialog
        this.audioRef.current.load()
      } else {
        this.audioRef.current.src = "broken"
      }
    }

    if (this.bgAudioRef.current) {
      if (media.bgaudio && media.hasBg) {
        this.bgAudioRef.current.src = media.bgaudio
        this.bgAudioRef.current.load()
        if (window.AudioContext) {
          const src = this.ctx.createMediaElementSource(this.bgAudioRef.current)
          src.connect(this.ctx.destination)
        }
      } else {
        this.bgAudioRef.current.src = "broken"
      }
    }
  }



  render() {
    return (
      <div>
        <video className='cinemagraph' autoPlay loop muted playsInline ref={this.videoRef} />
        <audio autoPlay loop ref={this.bgAudioRef} />
        <audio autoPlay ref={this.audioRef} />
      </div>
    )
  }
}