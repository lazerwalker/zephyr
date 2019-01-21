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
    console.log("Loiading video", media.name)
    this.setState({ media })

    if (this.videoRef.current) {
      this.videoRef.current.src = media.video
      this.videoRef.current.load()
    }

    if (this.audioRef.current) {
      this.audioRef.current.src = media.dialog
    }

    // Background audio
    const src = media.bgaudio
    let audioData: any, srcNode: AudioBufferSourceNode;  // global so we can access them from handlers

    const decode = (buffer: any) => {
      this.ctx.decodeAudioData(buffer, playLoop)
    }

    fetch(src, { mode: "cors" }).then(function (resp) { return resp.arrayBuffer() }).then(decode);

    // Sets up a new source node as needed as stopping will render current invalid
    const playLoop = (abuffer: any) => {
      if (!audioData) audioData = abuffer;  // create a reference for control buttons
      srcNode = this.ctx.createBufferSource();  // create audio source
      srcNode.buffer = abuffer;             // use decoded buffer
      srcNode.connect(this.ctx.destination);    // create output
      srcNode.loop = true;                  // takes care of perfect looping
      srcNode.start();                      // play...
    }
  }



  render() {
    return (
      <div>
        <video className='cinemagraph' autoPlay loop muted playsInline ref={this.videoRef} />
        <audio autoPlay loop ref={this.bgAudioRef} />
        <audio ref={this.audioRef} />
      </div>
    )
  }
}