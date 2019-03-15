import * as React from 'react'
import Cinemagraph from './Cinemagraph';
import { TrainCar } from '../train';
import Arrow, { ArrowDirection } from './Arrow';
import SpeechBubble from './SpeechBubble';
import Button from './Button';
import { Human } from '../Human';

interface Props {
  human: Human
  trade?: any;
  ask?: any;
  goodbye?: any;
}

export default class MenuView extends React.Component<Props> {
  render() {
    return (
      <div className='menu-view'>
        <div className="desire-wrapper">
          <div className="desire">I would like a {this.props.human.wants}, and have a {this.props.human.has}.</div>
        </div>
        <Button className='trade' onClick={this.trade}>Trade your Foo</Button>
        <Button className='ask' onClick={this.ask}>Who wants my Foo?</Button>
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