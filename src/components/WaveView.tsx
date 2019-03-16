import * as React from 'react'
import Button from './Button';
import Language from '../language';

interface Props {
  continue: any;
  language: Language
}

export default class WaveView extends React.Component<Props> {
  render() {
    return (
      <div className='wave-view dialog'>
        <div className="text-wrapper">
          <div className="text">{this.props.language.npcGreeting}</div>
        </div>
        <Button onClick={this.continue}>{this.props.language.menuGreeting}</Button>
      </div>
    )
  }

  continue = () => {
    if (this.props.continue) {
      this.props.continue()
    }
  }
}
