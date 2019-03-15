import * as React from 'react'
import Cinemagraph from './Cinemagraph';
import { TrainCar } from '../train';
import Arrow, { ArrowDirection } from './Arrow';
import SpeechBubble from './SpeechBubble';
import Button from './Button';

interface Props {
  trade?: any;
  ask?: any;
  goodbye?: any;
}

export default class MenuView extends React.Component<Props> {
  render() {
    return (
      <div className='menu-view'>
        <div className="desire-wrapper">
          <div className="desire">I would like to trade Foo for Bar.</div>
        </div>
        <Button className='trade' onClick={this.trade}>Trade Foo for Bar</Button>
        <Button className='ask' onClick={this.ask}>Where can I find Foo?</Button>
        <Button className='goodbue' onClick={this.goodbye}>Goodbye!</Button>
      </div>
    )
  }

  trade = () => {
    if (this.props.trade) {
      this.props.trade()
    }
  }

  ask = () => {
    if (this.props.ask) {
      this.props.ask()
    }
  }

  goodbye = () => {
    if (this.props.goodbye) {
      this.props.goodbye()
    }
  }
}