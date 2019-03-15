import * as React from 'react'
import Button from './Button';
import { Human } from '../Human';

interface Props {
  human: Human
  item: string

  trade?: any;
  ask?: any;
  goodbye?: any;
}

export default class MenuView extends React.Component<Props> {
  render() {
    if (this.props.human.canTrade) {
      return (
        <div className='menu-view'>
          <div className="desire-wrapper text-wrapper">
            <div className="desire">I would like {this.props.human.wants}, and have a {this.props.human.has}.</div>
          </div>
          <Button className='trade' onClick={this.trade}>Trade your {this.props.item}.</Button>
          <Button className='ask' onClick={this.ask}>Who is looking for {this.props.item}?</Button>
          <Button className='goodbye' onClick={this.goodbye}>Goodbye!</Button>
        </div>
      )
    } else {
      return (
        <div className='menu-view'>
          <div className="text-wrapper">
            <div className="thank-you">Thank you for the {this.props.human.wants}.</div>
          </div>
          <Button className='goodbye' onClick={this.goodbye}>Goodbye!</Button>
        </div>
      )
    }
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