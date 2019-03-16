import * as React from 'react'
import Button from './Button';
import Language from '../language';

interface Props {
  continue: any;
  language: Language;
  item: string
}

export default class AngryView extends React.Component<Props> {
  render() {
    return (
      <div className='angry-view dialog'>
        <div className="text-wrapper">
          <div className="text" dangerouslySetInnerHTML={{ __html: this.props.language.npcNoThanks(this.props.item) }} />
        </div>

        <Button onClick={this.continue}>{this.props.language.menuOkay}</Button>
      </div>
    )
  }

  continue = () => {
    if (this.props.continue) {
      this.props.continue()
    }
  }
}