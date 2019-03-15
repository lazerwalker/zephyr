import * as React from 'react'

interface Props {
  onClick: any; // lol, how do I declare a (void -> void)
}

export default class Arrow extends React.Component<Props> {
  render() {
    return (
      <div className='next-wrapper'>
        <div className='next' onClick={this.props.onClick}
        >→</div>
      </div >
    )
  }

  onClick() {
    if (this.props.onClick) {
      this.props.onClick()
    }
  }
}
