import React, { Component, SyntheticEvent } from 'react';
import './App.css';
import Cinemagraph from './components/Cinemagraph';
import preloadMedia, { CacheEntry } from './preloadMedia';

import Levels from './data'
import TrainCarView from './components/TrainCarView';
import { Train, TrainCar } from './train';
import { Human } from './Human';
import WaveView from './components/WaveView';
import MenuView from './components/MenuView';
import AngryView from './components/AngryView';

enum PlayState {
  NotStarted = 0,
  Car,
  TalkingWave,
  TalkingMenu,
  TalkingHappy,
  TalkingSad,
  TalkingForward,
  TalkingBackward
}

interface State {
  playState: PlayState
  loaded: boolean
  loadingProgress: number

  currentCar: TrainCar
  currentHuman?: Human
  item: string
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
      playState: PlayState.Car,
      loaded: false,
      loadingProgress: 0,
      item: "optimism"
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

    if (this.state.playState === PlayState.Car) {
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
              speechBubble={this.speechBubble}
            />
          </div>
        </div >
      );
    } else if (this.state.playState === PlayState.TalkingWave) {
      const video = this.state.currentHuman!.wave()

      return <div className="App">
        <div className="video-wrapper">
          <Cinemagraph
            media={this.cache[video.name]}
            ref={this.playerRef}
            onComplete={this.onComplete}>
          </Cinemagraph >
          <WaveView continue={this.toMenu} />
        </div>
      </div >
    } else if (this.state.playState === PlayState.TalkingMenu) {
      const video = this.state.currentHuman!.neutral()

      return <div className="App">
        <div className="video-wrapper">
          <Cinemagraph
            media={this.cache[video.name]}
            ref={this.playerRef}
            onComplete={this.onComplete}>
          </Cinemagraph >
          <MenuView goodbye={this.exitConversation}
            human={this.state.currentHuman!}
            item={this.state.item}
            trade={this.trade} />
        </div>
      </div >
    } else if (this.state.playState === PlayState.TalkingSad) {
      const video = this.state.currentHuman!.angry()

      return <div className="App">
        <div className="video-wrapper">
          <Cinemagraph
            media={this.cache[video.name]}
            ref={this.playerRef}
            onComplete={this.onComplete}>
          </Cinemagraph >
          <AngryView continue={this.toMenu} />
        </div>
      </div >
    }
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

  trade = () => {
    if (!this.state.currentHuman) return
    if (this.state.currentHuman.wants === this.state.item) {
      const result = this.state.currentHuman.trade()
      if (result) {
        this.setState({ item: result })
      }
    } else {
      this.setState({ playState: PlayState.TalkingSad })
      if (this.playerRef.current) {
        this.playerRef.current.fadeTransition(this.state.currentHuman.angry())
      }
    }
  }

  speechBubble = () => {
    const human = new Human("Ben", "a USB key", "an apple")
    this.setState({ playState: PlayState.TalkingWave, currentHuman: human })
    if (this.playerRef.current) {
      this.playerRef.current.fadeTransition(human.wave())
    }
  }

  stopAudio = () => {
    if (!this.playerRef.current) { return }
    this.playerRef.current.pause()
  }

  onComplete = () => {
    console.log("Is complete!")
  }

  exitConversation = () => {
    // TODO: This will change!
    this.setState({ playState: PlayState.Car })
    if (this.playerRef.current) {
      this.playerRef.current.fadeTransition(this.state.currentCar.media())
    }
  }

  toMenu = () => {
    this.setState({ playState: PlayState.TalkingMenu })
    if (this.playerRef.current) {
      this.playerRef.current.fadeTransition(this.state.currentHuman!.neutral())
    }
  }
}

export default App;
