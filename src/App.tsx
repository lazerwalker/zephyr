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
import PointView from './components/PointView';
import _ from 'lodash';
import HappyView from './components/HappyView';
import Language from './language';

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

  language: Language
}

export const LanguageContext = React.createContext(new Language())

class App extends Component<{}, State> {
  private playerRef = React.createRef<Cinemagraph>()
  private progressBarRef = React.createRef<HTMLProgressElement>()

  private train: Train

  private cache: { [name: string]: CacheEntry } = {}

  constructor(props: any) {
    super(props)
    let language = new Language()
    this.train = Train.generate(language)

    this.state = {
      currentCar: this.train.cars[0],
      playState: PlayState.Car,
      loaded: false,
      loadingProgress: 0,
      item: _.sample(language.items)!,
      language: language
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

  playAudio(human: Human, state: PlayState) {
    let actx = new (window.AudioContext || (window as any).webkitAudioContext)()

    const map = {
      [PlayState.TalkingWave.valueOf()]: "Hey",
      [PlayState.TalkingHappy.valueOf()]: "Bye",
      [PlayState.TalkingMenu.valueOf()]: "Want",
      [PlayState.TalkingSad.valueOf()]: "DontWant",
      [PlayState.TalkingForward.valueOf()]: "Thatway",
      [PlayState.TalkingBackward.valueOf()]: "Thatway"
    }

    let num = _.random(1, 4) // TODO: Some have 5!
    const src = `audio/${human.voice}-${map[state.valueOf()]}${num}.wav`
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
      srcNode.start();                      // play...
    }
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
          <WaveView continue={this.toMenu} language={this.state.language} />
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
          <MenuView
            human={this.state.currentHuman!}
            item={this.state.item}
            trade={this.trade}
            ask={this.ask}
            goodbye={this.exitConversation}
            language={this.state.language}
          />
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
          <AngryView continue={this.toMenu} language={this.state.language} item={this.state.item} />
        </div>
      </div >
    } else if (this.state.playState === PlayState.TalkingHappy) {
      const video = this.state.currentHuman!.happy()

      return <div className="App">
        <div className="video-wrapper">
          <Cinemagraph
            media={this.cache[video.name]}
            ref={this.playerRef}
            onComplete={this.onComplete}>
          </Cinemagraph >
          <HappyView continue={this.exitConversation} language={this.state.language} />
        </div>
      </div >
    } else if (this.state.playState === PlayState.TalkingForward) {
      const video = this.state.currentHuman!.towards()

      return <div className="App">
        <div className="video-wrapper">
          <Cinemagraph
            media={this.cache[video.name]}
            ref={this.playerRef}
            onComplete={this.onComplete}>
          </Cinemagraph >
          <PointView continue={this.toMenu} isForward={true} language={this.state.language} />
        </div>
      </div >
    } else if (this.state.playState === PlayState.TalkingBackward) {
      const video = this.state.currentHuman!.behind()

      return <div className="App">
        <div className="video-wrapper">
          <Cinemagraph
            media={this.cache[video.name]}
            ref={this.playerRef}
            onComplete={this.onComplete}>
          </Cinemagraph >
          <PointView continue={this.toMenu} isForward={false} language={this.state.language} />
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
        this.playAudio(this.state.currentHuman!, PlayState.TalkingHappy)
        this.setState({ item: result, playState: PlayState.TalkingHappy })
        if (this.playerRef.current) {
          this.playerRef.current.fadeTransition(this.state.currentHuman.happy())
        }
      }
    } else {
      this.setState({ playState: PlayState.TalkingSad })
      this.playAudio(this.state.currentHuman!, PlayState.TalkingSad)
      if (this.playerRef.current) {
        this.playerRef.current.fadeTransition(this.state.currentHuman.angry())
      }
    }
  }

  ask = () => {
    if (!this.state.currentHuman) { return }

    let state: PlayState
    let animation: CacheEntry

    if (this.state.currentCar.hasTrade(this.state.item)) {
      console.log("It's here!")
      state = PlayState.TalkingWave
      animation = this.state.currentHuman.wave()
    } else {
      // Seek forward to find the nearest located car
      let forwardSeeker: TrainCar | undefined = this.state.currentCar
      let existsForward = false
      let forwardCount = 0
      while (!existsForward && !_.isUndefined(forwardSeeker)) {
        forwardSeeker = forwardSeeker.front
        if (!forwardSeeker) {
          forwardCount = -1;
          continue;
        };

        forwardCount++
        if (forwardSeeker.hasTrade(this.state.item)) {
          existsForward = true
          break;
        }
      }

      // Seek backwards
      let backwardsSeeker: TrainCar | undefined = this.state.currentCar
      let existsBackwards = false
      let backwardsCount = 0
      while (!existsBackwards && !_.isUndefined(backwardsSeeker)) {
        backwardsSeeker = backwardsSeeker.rear
        if (!backwardsSeeker) {
          backwardsCount = -1;
          continue;
        };

        backwardsCount++
        if (backwardsSeeker.hasTrade(this.state.item)) {
          existsBackwards = true
          break;
        }
      }

      if (existsForward && existsBackwards) {
        if (backwardsCount > forwardCount) {
          existsBackwards = false
        } else if (backwardsCount < forwardCount) {
          existsForward = false
        }
      }

      if (existsForward) {
        state = PlayState.TalkingForward
        animation = this.state.currentHuman.towards()
      } else if (existsBackwards) {
        state = PlayState.TalkingBackward
        animation = this.state.currentHuman.behind()
      } else {
        // TODO: This should be a 'it's in here' state
        state = PlayState.TalkingWave
        animation = this.state.currentHuman.wave()
      }
    }

    this.setState({ playState: state })
    this.playAudio(this.state.currentHuman!, PlayState.TalkingBackward)
    if (this.playerRef.current) {
      this.playerRef.current.fadeTransition(animation)
    }
  }

  speechBubble = () => {
    const car = this.state.currentCar
    this.setState({ playState: PlayState.TalkingWave, currentHuman: car.human })
    this.playAudio(car.human, PlayState.TalkingWave)
    if (this.playerRef.current) {
      this.playerRef.current.fadeTransition(car.human.wave())
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
    this.playAudio(this.state.currentHuman!, PlayState.TalkingMenu)
    if (this.playerRef.current) {
      this.playerRef.current.fadeTransition(this.state.currentHuman!.neutral())
    }
  }
}

export default App;
