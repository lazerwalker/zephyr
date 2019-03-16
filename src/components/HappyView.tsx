import * as React from 'react'
import Button from './Button';
import Language from '../language';

interface Props {
  continue: any;
  language: Language;
}

export default class HappyView extends React.Component<Props> {
  render() {
    return (
      <div className='angry-view dialog'>
        <div className="text-wrapper">
          <div className="text">{this.props.language.thanks()}</div>
        </div>

        <Button onClick={this.continue}>Bye!</Button>
      </div>
    )
  }

  continue = () => {
    if (this.props.continue) {
      this.props.continue()
    }
  }
}