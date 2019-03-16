import * as React from 'react'
import Button from './Button';

interface Props {
  continue: any;
}

export default class HappyView extends React.Component<Props> {
  render() {
    return (
      <div className='angry-view dialog'>
        <div className="text-wrapper">
          <div className="text">Thank you for the thing.</div>
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