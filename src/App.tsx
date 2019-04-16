import React, { Component, SyntheticEvent } from 'react';
import './App.css';
import Cinemagraph from './components/Cinemagraph';
import preloadMedia, { CacheEntry } from './preloadMedia';

import Levels from './data'
import TrainCarView from './components/TrainCarView';
import { Item, Train, TrainCar } from './train';
import { Human } from './Human';
import MainMenu from './components/MainMenu'
import CreditView from './components/CreditView'
import WaveView from './components/WaveView';
import MenuView from './components/MenuView';
import WinView from './components/WinView';
import AngryView from './components/AngryView';
import PointView from './components/PointView';
import InventoryView from './components/InventoryView'
import ScoreView from './components/ScoreView'
import BackgroundMusic from './components/BackgroundMusic'
import LandscapeView from './components/LandscapeView'

import HappyView from './components/HappyView';
import Language from './language';

import _ from 'lodash';

enum PlayState {
  MainMenu = 0,
  Credits,
  Car,
  Landscape,
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
  item: Item

  score: number
  constant: number

  language: Language

  won: boolean
}

export const LanguageContext = React.createContext(new Language())

class App extends Component<{}, State> {
  private playerRef = React.createRef<Cinemagraph>()
  private progressBarRef = React.createRef<HTMLProgressElement>()

  private train: Train

  private cache: { [name: string]: CacheEntry } = {}

  private ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
  private currentBuffer: AudioBufferSourceNode | undefined

  constructor(props: any) {
    super(props)
    let language = new Language()
    this.train = Train.generate(language)
    console.log(language.items)

    this.state = {
      currentCar: this.train.cars[1],
      playState: PlayState.MainMenu,
      loaded: false,
      loadingProgress: 0,
      item: this.train.cars[1].front!.human.desiredTrade.wants,
      language: language,
      score: 0,
      constant: _.random(2, 7),
      won: false
    }
  }

  componentDidMount() {
    // Mobile viewport sizing hack from https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
    function resizeViewport() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    window.addEventListener('resize', resizeViewport)

    window.addEventListener('appPause', () => {
      var audioEls = document.getElementsByTagName('audio');
      for (var i = 0, len = audioEls.length; i < len; i++) {
        audioEls[i].pause()
      }
    })

    window.addEventListener('appResume', () => {
      var audioEls = document.getElementsByTagName('audio');
      for (var i = 0, len = audioEls.length; i < len; i++) {
        audioEls[i].play()
      }
    })

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
    if (this.currentBuffer && this.ctx.state != "suspended") {
      this.currentBuffer.stop()
    }

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

    console.log("Audio src = ", src)
    const decode = (buffer: any) => {
      console.log("Decoding")
      this.ctx.decodeAudioData(buffer, playLoop);
    }

    console.log("Context?", this.ctx)
    fetch(src, { mode: "cors" }).then(function (resp) { return resp.arrayBuffer() }).then(decode);

    // Sets up a new source node as needed as stopping will render current invalid
    const playLoop = (abuffer: any) => {
      console.log("Playing")
      if (!audioData) audioData = abuffer;  // create a reference for control buttons
      srcNode = this.ctx.createBufferSource();  // create audio source
      srcNode.buffer = abuffer;             // use decoded buffer
      srcNode.connect(this.ctx.destination);    // create output
      srcNode.start();
      this.currentBuffer = srcNode                    // play...
      this.currentBuffer.onended = () => {
        delete this.currentBuffer
      }
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

    let customView;
    let media;

    if (this.state.playState === PlayState.MainMenu) {
      return <MainMenu
        subtitle={this.state.language.gamePitch()}
        startText={this.state.language.gamePitch()}
        media={this.cache["room"]}
        onStart={this.exitConversation}
        onCredits={this.showCredits} />
    } else if (this.state.playState === PlayState.Credits) {
      return <CreditView onExit={this.reset} />
    }

    if (this.state.playState === PlayState.Car) {
      media = this.state.currentCar.media()
      customView = <TrainCarView
        car={this.state.currentCar}
        moveForward={this.moveForward}
        moveBackward={this.moveBackward}
        speechBubble={this.speechBubble}
        viewWindow={this.viewWindow}
      />
    } else if (this.state.playState === PlayState.TalkingWave) {
      media = this.state.currentHuman!.wave()
      customView = <WaveView continue={this.toMenu} language={this.state.language} />
    } else if (this.state.playState === PlayState.TalkingMenu) {
      media = this.state.currentHuman!.neutral()
      customView = <MenuView
        human={this.state.currentHuman!}
        item={this.state.item}
        trade={this.trade}
        ask={this.ask}
        goodbye={this.exitConversation}
        language={this.state.language}
      />
    } else if (this.state.playState === PlayState.TalkingSad) {
      media = this.state.currentHuman!.angry()
      customView = <AngryView continue={this.toMenu} language={this.state.language} item={this.state.item} />
    } else if (this.state.playState === PlayState.TalkingHappy) {
      media = this.state.currentHuman!.happy()
      customView = <HappyView continue={this.exitConversation} language={this.state.language} />
    } else if (this.state.playState === PlayState.TalkingForward) {
      media = this.state.currentHuman!.towards()
      customView = <PointView continue={this.exitConversation} isForward={true} language={this.state.language} />
    } else if (this.state.playState === PlayState.TalkingBackward) {
      media = this.state.currentHuman!.behind()
      customView = <PointView continue={this.exitConversation} isForward={false} language={this.state.language} />
    } else if (this.state.playState === PlayState.Landscape) {
      media = this.state.currentCar.landscape()
      customView = <LandscapeView continue={this.exitConversation} />
    }

    if (!media) { return <div /> }

    return (
      <div className="App">
        <div className="video-wrapper">
          <BackgroundMusic />
          <InventoryView item={this.state.item} won={this.state.won} />
          <ScoreView score={this.state.score} total={this.train.cars.length} constant={this.state.constant} />
          <Cinemagraph
            media={this.cache[media.name]}
            ref={this.playerRef}
            onComplete={this.onComplete}>
          </Cinemagraph >
          {customView}
        </div>
      </div >
    )
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
    if (this.state.currentHuman.desiredTrade.wants === this.state.item) {
      const result = this.state.currentHuman.trade()
      if (result) {
        const newScore = this.state.score + 1
        this.playAudio(this.state.currentHuman!, PlayState.TalkingHappy)
        this.setState({ item: result, playState: PlayState.TalkingHappy, score: this.state.score + 1 })
        if (this.playerRef.current) {
          this.playerRef.current.fadeTransition(this.state.currentHuman.happy())
        }

        if (this.state.score + 1 >= this.train.cars.length) {
          this.setState({ won: true })
          alert(this.state.language.won())
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

    this.setState({ playState: state })
    this.playAudio(this.state.currentHuman!, PlayState.TalkingBackward)
    if (this.playerRef.current) {
      this.playerRef.current.fadeTransition(animation)
    }
  }

  speechBubble = () => {
    const car = this.state.currentCar

    if (!car.human.canTrade) {
      this.setState({ playState: PlayState.TalkingHappy, currentHuman: car.human })
      this.playAudio(car.human, PlayState.TalkingHappy)
      if (this.playerRef.current) {
        this.playerRef.current.fadeTransition(car.human.happy())
      }

    } else {
      this.setState({ playState: PlayState.TalkingWave, currentHuman: car.human })
      this.playAudio(car.human, PlayState.TalkingWave)
      if (this.playerRef.current) {
        this.playerRef.current.fadeTransition(car.human.wave())
      }
    }
  }

  viewWindow = () => {
    this.setState({ playState: PlayState.Landscape })
    if (this.playerRef.current) {
      this.playerRef.current.fadeTransition(this.state.currentCar.landscape())
    }
  }

  stopAudio = () => {
    if (!this.playerRef.current) { return }
    this.playerRef.current.pause()
  }

  onComplete = () => {
    console.log("Is complete!")
  }

  reset = () => {
    let language = new Language()
    this.train = Train.generate(language)

    this.setState({
      currentCar: this.train.cars[1],
      playState: PlayState.MainMenu,
      item: this.train.cars[1].front!.human.desiredTrade.wants,
      language: language,
      score: 0,
      constant: _.random(2, 7),
      won: false
    })
  }

  exitConversation = () => {
    this.setState({ playState: PlayState.Car })
    if (this.currentBuffer) {
      this.currentBuffer.stop()
    }
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

  showCredits = () => {
    this.setState({ playState: PlayState.Credits })
  }
}

export default App;
