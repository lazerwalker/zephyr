import * as React from 'react'
import Button from './Button';
import { Human } from '../Human';
import Language from '../language';

interface Props {
  human: Human
  item: string

  trade?: any;
  ask?: any;
  goodbye?: any;

  language: Language
}

export default class MenuView extends React.Component<Props> {
  render() {
    if (this.props.human.canTrade) {
      return (
        <div className='menu-view'>
          <div className="desire-wrapper text-wrapper">
            <div className="desire" dangerouslySetInnerHTML={{ __html: this.props.language.tradeDeclaration(this.props.human.desiredTrade) }} />
          </div>
          <Button className='trade' onClick={this.trade} html={this.props.language.menuTrade(this.props.item)} />
          <Button className='ask' onClick={this.ask} html={this.props.language.menuAsk(this.props.item)} />
          <Button className='goodbye' onClick={this.goodbye} html={this.props.language.menuGoodbye} />        </div>
      )
    } else {
      return (
        <div className='menu-view'>
          <div className="text-wrapper">
            <div className="thank-you">Thank you for the {this.props.human.wants}.</div>
          </div>
          <Button className='goodbye' onClick={this.goodbye} html={this.props.language.menuGoodbye} />
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