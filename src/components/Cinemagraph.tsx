import * as React from 'react'

interface Props {
  file: String
  onComplete?: () => void
}

export default class Cinemagraph extends React.Component<Props> {
  private videoRef = React.createRef<HTMLVideoElement>()
  private audioRef = React.createRef<HTMLAudioElement>()
  private bgAudioRef = React.createRef<HTMLAudioElement>()

  private lastPauseTime = new Date()

  componentDidMount() {
    if (!this.audioRef.current) { return }
    console.log("Mounted!")
    this.audioRef.current.addEventListener('ended', () => {
      if (this.props.onComplete) { this.props.onComplete() }
    })
  }

  shouldComponentUpdate(newProps: Props) {
    return newProps.file !== this.props.file
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

  render() {
    if (this.videoRef.current) {
      this.videoRef.current.load()
    }
    if (this.audioRef.current) {
      this.audioRef.current.load()
    }

    // Todo: Treating `render` as such a state-influencing event is liable to bite me in the ass
    if (this.bgAudioRef.current) {
      let actx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const src = `bgaudio/${this.props.file}.mp3`
      let audioData: any, srcNode: AudioBufferSourceNode;  // global so we can access them from handlers

      const decode = (buffer: any) => {
        console.log("Decoding)")
        actx.decodeAudioData(buffer, playLoop);
      }

      console.log("Context?", actx)
      fetch(src, { mode: "cors" }).then(function (resp) { return resp.arrayBuffer() }).then(decode);

      // Sets up a new source node as needed as stopping will render current invalid
      const playLoop = (abuffer: any) => {
        console.log("Playing")
        if (!audioData) audioData = abuffer;  // create a reference for control buttons
        srcNode = actx.createBufferSource();  // create audio source
        srcNode.buffer = abuffer;             // use decoded buffer
        srcNode.connect(actx.destination);    // create output
        srcNode.loop = true;                  // takes care of perfect looping
        srcNode.start();                      // play...
      }
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