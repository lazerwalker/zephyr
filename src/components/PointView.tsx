import * as React from 'react'
import Button from './Button';
import Language from '../language';

interface Props {
  continue: any;
  language: Language
  isForward: Boolean
}

export default class PointView extends React.Component<Props> {
  render() {
    const text = this.props.isForward ? this.props.language.npcForward : this.props.language.npcBackward

    return (
      <div className='point-view dialog'>
        <div className="text-wrapper">
          <div className="text" dangerouslySetInnerHTML={{ __html: text }} />
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