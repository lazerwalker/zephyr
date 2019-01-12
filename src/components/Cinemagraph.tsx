import * as React from 'react'

interface Props {
  file: String
}

export default class Cinemagraph extends React.Component<Props> {
  private videoRef = React.createRef<HTMLVideoElement>()
  private audioRef = React.createRef<HTMLAudioElement>()
  private bgAudioRef = React.createRef<HTMLAudioElement>()

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
          <source src={`cinemagraphs/${this.props.file}.mov`} type="video/mp4" />
        </video>

        <audio autoPlay loop ref={this.bgAudioRef}>
          <source src={`bgaudio/${this.props.file}.mp3`} type="audio/mp3" />
        </audio>

        <audio autoPlay ref={this.audioRef}>
          <source src={`dialog/${this.props.file}.mp3`} type="audio/mp3" />
        </audio>
      </div>
    )
  }
}