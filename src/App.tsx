import React, { Component, SyntheticEvent } from 'react';
import logo from './logo.svg';
import './App.css';
import Cinemagraph from './components/Cinemagraph';
import KeyIndicator from './components/KeyIndicator';
import { isAbsolute } from 'path';

enum PlayState {
  NotStarted = 0,
  Playing = 1,
  Complete = 2
}

interface State {
  index: number
  keypressIndex: number
  keyTimeout: number
  playState: PlayState
}

interface Video {
  name: string
  keypresses?: string[]
  playCoord?: { x: number, y: number }
  nextCoord?: { x: number, y: number }
}

class App extends Component<{}, State> {
  private playerRef = React.createRef<Cinemagraph>()
  private timeoutId: number | undefined

  videos: Video[] = [
    {
      name: "bed",
      keypresses: ["ArrowUp"],
      playCoord: { x: 20, y: 60 },
      nextCoord: { x: 70, y: 60 }
    },
    {
      name: "shower",
      keypresses: ["ArrowDown"],
      playCoord: { x: 80, y: 90 },
      nextCoord: { x: 0, y: 0 }

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
      keyTimeout: 1000,
      playState: PlayState.NotStarted
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
    console.log("Re-rendering")
    const video = this.videos[this.state.index]

    let next;
    if (this.state.playState === PlayState.NotStarted) {
      next = <div id='next' style={{
        left: `${video.playCoord!.x}%`,
        top: `${video.playCoord!.y}%`,
      }} />
    } else if (this.state.playState === PlayState.Complete) {
      next = <div id='next' style={{
        left: `${video.nextCoord!.x}%`,
        top: `${video.nextCoord!.y}%`,
      }} />
    }

    return (
      <div className="App" >
        <div className="video-wrapper">
          <Cinemagraph
            file={video.name}
            ref={this.playerRef}
            onComplete={this.onComplete}>
          </Cinemagraph >
          {next}
        </div>
      </div >
    );
  }

  onKeyDown = (e: KeyboardEvent) => {
    if (this.state.playState === PlayState.Complete) {
      this.next()
    } else if (this.state.playState === PlayState.NotStarted) {
      this.playerRef.current!.playIfNotPlaying()
      this.setState({ playState: PlayState.Playing })
    }
  }

  onTouchStart = (e: TouchEvent) => {
    if (this.state.playState === PlayState.Complete) {
      this.next()
    } else if (this.state.playState === PlayState.NotStarted) {
      this.playerRef.current!.playIfNotPlaying()
      this.setState({ playState: PlayState.Playing })
    }
  }

  stopAudio = () => {
    if (!this.playerRef.current) { return }
    this.playerRef.current.pause()
  }

  onComplete = () => {
    console.log("Is complete!")
    this.setState({ playState: PlayState.Complete })
  }

  next() {
    const index = (this.state.index >= this.videos.length - 1 ? 0 : this.state.index + 1)
    this.setState({ index, keypressIndex: 0, playState: PlayState.NotStarted })
    setTimeout(() => { this.playerRef.current!.playIfNotPlaying() }, 0)
  }
}

export default App;
