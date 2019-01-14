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
  keypresses?: string[]
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
      name: "street",
    },
    {
      name: "parks",
    },
    {
      name: "drugdealers",
    },
    {
      name: "turkey",
    },
    {
      name: "keepwalking",
    },
    {
      name: "dolores",
    },
    {
      name: "urethra",
    },
    {
      name: "google",
    },
    {
      name: "fork",
    },
    {
      name: "slide",
    },
    {
      name: "up",
    },
    {
      name: "stumble",
    },
    {
      name: "run",
    },
    {
      name: "canal",
    },
    {
      name: "across",
    },
    {
      name: "slidetop",
    },
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

    return (
      <div className="App" >
        <Cinemagraph
          file={video.name}
          ref={this.playerRef}
          onComplete={this.onComplete} />
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
