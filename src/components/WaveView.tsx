import * as React from 'react'
import Cinemagraph from './Cinemagraph';
import { TrainCar } from '../train';
import Arrow, { ArrowDirection } from './Arrow';
import SpeechBubble from './SpeechBubble';
import Button from './Button';

interface Props {
  continue: any;
}

export default class WaveView extends React.Component<Props> {
  render() {
    return (
      <div className='wave-view dialog'>
        <div className="text-wrapper">
          <div className="text">Greetings!</div>
        </div>
        <Button onClick={this.continue}>Hello!</Button>
      </div>
    )
  }

  continue = () => {
    if (this.props.continue) {
      this.props.continue()
    }
  }
}