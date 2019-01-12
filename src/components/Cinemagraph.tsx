import * as React from 'react'

interface Props {
  file: String
  onComplete?: () => void
}

export default class Cinemagraph extends React.Component<Props> {
  private videoRef = React.createRef<HTMLVideoElement>()
  private audioRef = React.createRef<HTMLAudioElement>()
  private bgAudioRef = React.createRef<HTMLAudioElement>()

  componentDidMount() {
    if (!this.audioRef.current) { return }
    console.log("Mounted!")
    this.audioRef.current.addEventListener('ended', () => {
      if (this.props.onComplete) { this.props.onComplete() }
    })
  }

  public playIfNotPlaying() {
    if (!this.audioRef.current) { return }
    if (!this.audioRef.current.paused) return
    this.audioRef.current.load()
    this.audioRef.current.play()
  }

  public pause() {
    if (!this.audioRef.current) { return }
    this.audioRef.current.pause()
  }

  render() {
    if (this.videoRef.current) {
      this.videoRef.current.load()
    }
    if (this.audioRef.current) {
      this.audioRef.current.load()
    }

    if (this.bgAudioRef.current) {
      this.bgAudioRef.current.load()
    }

    return (
      <div>
        <video className='cinemagraph' autoPlay loop muted playsInline ref={this.videoRef}>
          <source src={`cinemagraphs/${this.props.file}.webm`} type="video/webm" />
          <source src={`cinemagraphs/${this.props.file}.mp4`} type="video/mp4" />
        </video>

        <audio autoPlay loop ref={this.bgAudioRef}>
          <source src={`bgaudio/${this.props.file}.mp3`} type="audio/mp3" />
        </audio>

        <audio ref={this.audioRef}>
          <source src={`dialog/${this.props.file}.mp3`} type="audio/mp3" />
        </audio>
      </div>
    )
  }
}