import * as React from 'react'
import Button from './Button';

interface Props {
  continue: any;
}

export default class AngryView extends React.Component<Props> {
  render() {
    return (
      <div className='angry-view'>
        <div className="thanks-wrapper">
          <div className="thank-you">I do not want this.</div>
        </div>

        <Button onClick={this.continue}>Ok.</Button>
      </div>
    )
  }

  continue = () => {
    if (this.props.continue) {
      this.props.continue()
    }
  }
}