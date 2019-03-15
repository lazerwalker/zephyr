import * as React from 'react'
import { UIPosition } from '../data';

interface Props {
  onClick: any; // lol, how do I declare a (void -> void)
  position: UIPosition
}

export default class SpeechBubble extends React.Component<Props> {
  render() {
    return (
      <div className="speech-wrapper" style={{
        left: this.props.position.x,
        top: this.props.position.y
      }}>
        <div className='speech-bubble' onClick={this.props.onClick}
        >
          <img src="speechbubble.png" />
        </div>
      </div >
    )
  }

  onClick() {
    if (this.props.onClick) {
      this.props.onClick()
    }
  }
}
