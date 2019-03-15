import * as React from 'react'
import Button from './Button';

interface Props {
  continue: any;
}

export default class PointView extends React.Component<Props> {
  render() {
    return (
      <div className='point-view dialog'>
        <div className="text-wrapper">
          <div className="text">I think someone is looking that way.</div>
        </div>

        <Button onClick={this.continue}>Thank you.</Button>
      </div>
    )
  }

  continue = () => {
    if (this.props.continue) {
      this.props.continue()
    }
  }
}