import React, { Component, SyntheticEvent } from 'react';
import './App.css';
import Cinemagraph from './components/Cinemagraph';
import preloadMedia, { CacheEntry } from './preloadMedia';

import Levels from './data'

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
  loadingProgress: number
}

class App extends Component<{}, State> {
  private playerRef = React.createRef<Cinemagraph>()
  private progressBarRef = React.createRef<HTMLProgressElement>()

  private cache: { [name: string]: CacheEntry } = {}

  constructor(props: any) {
    super(props)
    this.state = {
      index: 0,
      keypressIndex: 0,
      keyTimeout: 1000,
      playState: PlayState.NotStarted,
      loaded: false,
      loadingProgress: 0
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

    preloadMedia(Levels.map(v => v.name), (percent) => {
      if (this.progressBarRef.current) {
        this.progressBarRef.current.value = percent
      }
    }).then(cache => {
      this.cache = cache
      this.setState({ loaded: true })

      const video = Levels[0]
      const media = this.cache[video.name]
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
          <div className="video-wrapper">
            <div>Loading!</div>
            <progress ref={this.progressBarRef} value={this.state.loadingProgress} max="100" />
          </div>
        </div>
      )
    }

    const video = Levels[this.state.index]

    const next = <div id='next-wrapper'
      onClick={this.clickedNext}
      className={(video.noAudio || this.state.playState === PlayState.Complete) ? "visible" : "hidden"}
    >
      <div id='next'>→</div>
    </div >

    let text;
    if (video.text) {
      text = <div className='text'
        dangerouslySetInnerHTML={{ __html: video.text }}
        style={{ top: `${video.textPos!}%` }} />
    }

    return (
      <div className="App" >
        <div className="video-wrapper">
          <Cinemagraph
            media={this.cache[video.name]}
            ref={this.playerRef}
            onComplete={this.onComplete}>
          </Cinemagraph >
          {text}
          {next}
        </div>
      </div >
    );
  }

  clickedNext = () => {
    const index = (this.state.index >= Levels.length - 1 ? 0 : this.state.index + 1)
    this.setState({ index, keypressIndex: 0, playState: PlayState.NotStarted })

    const video = Levels[index]
    const media = this.cache[video.name]

    // TODO: The 10ms delay is necessay, but shouldn't be!
    setTimeout(() => {
      if (!this.playerRef.current) {
        return
      }
      this.playerRef.current.loadVideo(media)
      this.playerRef.current!.playIfNotPlaying()
      this.setState({ playState: PlayState.Playing })
    }, 10)
  }

  stopAudio = () => {
    if (!this.playerRef.current) { return }
    this.playerRef.current.pause()
  }

  onComplete = () => {
    console.log("Is complete!")
    this.setState({ playState: PlayState.Complete })
  }
}

export default App;
