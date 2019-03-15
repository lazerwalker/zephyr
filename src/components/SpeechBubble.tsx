import * as React from 'react'

interface Props {
  onClick: any; // lol, how do I declare a (void -> void)
}

export default class SpeechBubble extends React.Component<Props> {
  render() {
    return (
      <div className="speech-wrapper">
        <div className='speech-bubble' onClick={this.props.onClick}
        >S</div>
      </div >
    )
  }

  onClick() {
    if (this.props.onClick) {
      this.props.onClick()
    }
  }
}
