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
  private isComplete = false

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
    window.addEventListener('touchstart', this.onTouchStart)

    // Mobile viewport sizing hack from https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
    function resizeViewport() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    window.addEventListener('resize', resizeViewport)
    resizeViewport()
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
        {/* <KeyIndicator keyName={key} /> */}
      </div>
    );
  }

  onKeyDown = (e: KeyboardEvent) => {
    if (this.isComplete) {
      this.next()
    } else {
      this.playerRef.current!.playIfNotPlaying()
    }
  }

  onTouchStart = (e: TouchEvent) => {
    if (this.isComplete) {
      this.next()
    } else {
      this.playerRef.current!.playIfNotPlaying()
    }
  }

  stopAudio = () => {
    if (!this.playerRef.current) { return }
    this.playerRef.current.pause()
  }

  onComplete = () => {
    this.isComplete = true
  }

  next() {
    const index = (this.state.index >= this.videos.length - 1 ? 0 : this.state.index + 1)
    this.setState({ index, keypressIndex: 0 })
    this.isComplete = false
    setTimeout(() => { this.playerRef.current!.playIfNotPlaying() }, 0)
  }
}

export default App;
