import React, { Component, SyntheticEvent } from 'react';
import logo from './logo.svg';
import './App.css';
import Cinemagraph from './components/Cinemagraph';
import KeyIndicator from './components/KeyIndicator';
import { isAbsolute } from 'path';
import preloadMedia, { CacheEntry } from './preloadMedia';

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
  loaded: boolean
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
  private cache: { [name: string]: CacheEntry } = {}

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
      playCoord: { x: 40, y: 70 },
      nextCoord: { x: 70, y: 50 }

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
      playState: PlayState.NotStarted,
      loaded: false
    }
  }

  componentDidMount() {
    // Mobile viewport sizing hack from https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
    function resizeViewport() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    window.addEventListener('resize', resizeViewport)
    resizeViewport()

    preloadMedia(this.videos.map(v => v.name)).then(cache => {
      this.cache = cache
      this.setState({ loaded: true })


      const video = this.videos[0]
      const media = this.cache[video.name]
      // TODO
      setTimeout(() => {
        this.playerRef.current!.loadVideo(media)
      }, 100)
    })
  }

  render() {
    console.log("Re-rendering")

    if (!this.state.loaded) {
      return (
        <div className="App" >
          <div>Loading!</div>
        </div>
      )
    }

    const video = this.videos[this.state.index]

    let next;
    if (this.state.playState === PlayState.NotStarted) {
      next = <div id='next-wrapper'
        onClick={this.clickedTouchPoint}
        style={{
          left: `${video.playCoord!.x}%`,
          top: `${video.playCoord!.y}%`,
        }}>
        <div id='next' />
      </div>
    } else if (this.state.playState === PlayState.Complete) {
      next = <div id='next-wrapper'
        onClick={this.clickedTouchPoint}
        style={{
          left: `${video.nextCoord!.x}%`,
          top: `${video.nextCoord!.y}%`,
        }}>
        <div id='next' />
      </div>
    }

    return (
      <div className="App" >
        <div className="video-wrapper">
          <Cinemagraph
            media={this.cache[video.name]}
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

  clickedTouchPoint = () => {
    // TODO: Remove touch delay on mobile
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

    const video = this.videos[index]
    const media = this.cache[video.name]

    // TODO: The 100ms delay is necessay, but shouldn't be!
    setTimeout(() => {
      if (!this.playerRef.current) {
        return
      }
      this.playerRef.current.loadVideo(media)
    }, 10)
  }
}

export default App;
