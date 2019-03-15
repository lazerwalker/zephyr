import React, { Component, SyntheticEvent } from 'react';
import './App.css';
import Cinemagraph from './components/Cinemagraph';
import preloadMedia, { CacheEntry } from './preloadMedia';

import Levels from './data'
import TrainCarView from './components/TrainCarView';
import { Train, TrainCar } from './train';

enum PlayState {
  NotStarted = 0,
  Playing = 1,
  Complete = 2,
}

interface State {
  playState: PlayState
  loaded: boolean
  loadingProgress: number

  currentCar: TrainCar
}

class App extends Component<{}, State> {
  private playerRef = React.createRef<Cinemagraph>()
  private progressBarRef = React.createRef<HTMLProgressElement>()

  private train = Train.generate()

  private cache: { [name: string]: CacheEntry } = {}

  constructor(props: any) {
    super(props)
    this.state = {
      currentCar: this.train.cars[0],
      playState: PlayState.Playing,
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

    console.log("isWKWebView: ", (window as any).skipPreload)
    preloadMedia(Levels, (window as any).skipPreload, (percent) => {
      if (this.progressBarRef.current) {
        this.progressBarRef.current.value = percent
      }
    }).then(cache => {
      console.log("Setting cache", cache);
      (window as any).cache = cache
      this.cache = cache
      this.setState({ loaded: true })
    })
  }

  render() {
    console.log("Re-rendering")

    if (!this.state.loaded) {
      console.log("Not loaded!")
      return (
        <div className="App" >
          <div className="video-wrapper">
            <div>loading!</div>
            <progress ref={this.progressBarRef} value={this.state.loadingProgress} max="100" />
          </div>
        </div >
      )
    }

    const video = this.state.currentCar.media()

    console.log("Loaded?")
    return (
      <div className="App" >
        <div className="video-wrapper">
          <Cinemagraph
            media={this.cache[video.name]}
            ref={this.playerRef}
            onComplete={this.onComplete}>
          </Cinemagraph >
          <TrainCarView
            car={this.state.currentCar}
            moveForward={this.moveForward}
            moveBackward={this.moveBackward}
          />
        </div>
      </div >
    );
  }

  moveForward = () => {
    const nextCar = this.state.currentCar.front
    if (!nextCar) return;

    this.setState({ currentCar: nextCar })

    if (this.playerRef.current) {
      this.playerRef.current.fadeTransition(nextCar.media())
    }
  }

  moveBackward = () => {
    const nextCar = this.state.currentCar.rear
    if (!nextCar) return

    this.setState({ currentCar: nextCar })

    if (this.playerRef.current) {
      this.playerRef.current.fadeTransition(nextCar.media())
    }
  }

  startGame = () => {
    this.setState({ playState: PlayState.Playing })
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
