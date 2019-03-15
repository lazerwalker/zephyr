import * as React from 'react'

export enum ArrowDirection {
  Up = 0,
  Down
}

interface Props {
  onClick: any; // lol, how do I declare a (void -> void)
  direction: ArrowDirection
}

export default class Arrow extends React.Component<Props> {
  render() {
    const className = `next-wrapper ${this.props.direction === ArrowDirection.Up ? "up" : "down"}`
    return (
      <div className={className}>
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
