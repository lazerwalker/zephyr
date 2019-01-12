import React, { Component, SyntheticEvent } from 'react';
import logo from './logo.svg';
import './App.css';
import Cinemagraph from './components/Cinemagraph';
import KeyIndicator from './components/KeyIndicator';

interface State {
  index: number,
  keypressIndex: number;
  keyTimeout: number
}

interface Video {
  name: string
  keypresses: string[]
}

class App extends Component<{}, State> {
  private playerRef = React.createRef<Cinemagraph>()
  private timeoutId: number | undefined

  videos: Video[] = [
    {
      name: "bed",
      keypresses: ["ArrowUp"],
    },
    {
      name: "shower",
      keypresses: ["ArrowDown"]
    },
    {
      name: "bike",
      keypresses: ["ArrowUp", "ArrowDown"]
    },
    {
      name: "ubahn",
      keypresses: ["ArrowLeft", "ArrowRight"]
    }
  ]

  constructor(props: any) {
    super(props)
    this.state = {
      index: 0,
      keypressIndex: 0,
      keyTimeout: 1000
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown)
  }

  render() {
    const video = this.videos[this.state.index]
    const key = video.keypresses[this.state.keypressIndex]

    return (
      <div className="App" >
        <Cinemagraph
          file={video.name}
          ref={this.playerRef}
          onComplete={this.onComplete} />
        <KeyIndicator keyName={key} />
      </div>
    );
  }

  onKeyDown = (e: KeyboardEvent) => {
    clearTimeout(this.timeoutId)

    if (!this.playerRef.current) { return }
    const video = this.videos[this.state.index]

    if (e.key === video.keypresses[this.state.keypressIndex]) {
      this.playerRef.current.playIfNotPlaying()

      const keypressIndex = (this.state.keypressIndex >= video.keypresses.length - 1 ? 0 : this.state.keypressIndex + 1)
      this.setState({ keypressIndex })

      // The explicit window is to shut up the TS compiler, which grabs the Node version, because CRA requires @types/node to be installed
      this.timeoutId = window.setTimeout(this.stopAudio, this.state.keyTimeout)
    } else {
      this.playerRef.current.pause()
      this.setState({ keypressIndex: 0 })
    }
  }

  stopAudio = () => {
    if (!this.playerRef.current) { return }
    this.playerRef.current.pause()
  }

  onComplete = () => {
    const index = (this.state.index >= this.videos.length - 1 ? 0 : this.state.index + 1)
    this.setState({ index, keypressIndex: 0 })
  }
}

export default App;
