import React, { Component, SyntheticEvent } from 'react';
import './App.css';
import Cinemagraph from './components/Cinemagraph';
import preloadMedia, { CacheEntry } from './preloadMedia';

import Levels from './data'
import MainMenu from './components/MainMenu';

enum PlayState {
  NotStarted = 0,
  Playing = 1,
  Complete = 2,
  MainMenu
}

interface State {
  index: number
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
      index: -1,
      playState: PlayState.MainMenu,
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

    window.addEventListener('keypress', this.clickedNext)

    preloadMedia(Levels, (percent) => {
      if (this.progressBarRef.current) {
        this.progressBarRef.current.value = percent
      }
    }).then(cache => {
      this.cache = cache
      this.setState({ loaded: true })

      const video = Levels[0]
      const media = this.cache[video.name]
    })
  }

  render() {
    console.log("Re-rendering")

    if (!this.state.loaded) {
      return (
        <div className="App" >
          <div className="video-wrapper">
            <div>loading!</div>
            <progress ref={this.progressBarRef} value={this.state.loadingProgress} max="100" />
          </div>
        </div >
      )
    }

    if (this.state.playState === PlayState.MainMenu) {
      return (
        <div className="App" >
          <div className="video-wrapper">
            <MainMenu
              onStart={this.startGame}
              media={this.cache["title"]}
            />
          </div>
        </div>
      )
    }

    const video = Levels[this.state.index]

    const next = <div id='next-wrapper'
      className={(video.noAudio || this.state.playState === PlayState.Complete) ? "visible" : "hidden"}
    >
      <div id='next' onClick={this.clickedNext}
      >→</div>
    </div >

    let text;
    if (video.text) {
      text = <div className='text' dangerouslySetInnerHTML={{ __html: video.text }} />
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

  startGame = () => {
    this.setState({ playState: PlayState.NotStarted, index: this.nextIndex(0)! })
  }

  clickedNext = () => {
    const canContinue = Levels[this.state.index].noAudio || this.state.playState === PlayState.Complete
    if (!canContinue) return

    const index = this.nextIndex()
    if (!index) {
      if (this.playerRef.current) {
        this.playerRef.current.fadeOut(() => {
          this.setState({ index: 0, playState: PlayState.MainMenu })
        })
      }
      return
    }

    this.setState({ index, playState: PlayState.NotStarted })

    const video = Levels[index]
    const media = this.cache[video.name]

    if (this.playerRef.current) {
      this.playerRef.current.fadeTransition(media)
    }
  }

  nextIndex = (startIndex?: number): number | undefined => {
    let index = (startIndex === undefined ? this.state.index : startIndex) + 1

    while (Levels[index] && Levels[index].ignore) {
      index += 1
    }

    if (index >= Levels.length) {
      return undefined
    }

    return index
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
