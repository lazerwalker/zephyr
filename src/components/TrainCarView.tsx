import * as React from 'react'
import { TrainCar } from '../train';
import Arrow, { ArrowDirection } from './Arrow';
import SpeechBubble from './SpeechBubble';

import * as _ from 'lodash'

interface Props {
  car: TrainCar

  moveForward?: any
  moveBackward?: any
  speechBubble?: any
}

export default class TrainCarView extends React.Component<Props> {
  render() {
    console.log("BUBBLES", this.props.car.bubbles(), this.props.car)
    const forwardArrow = (this.props.car.front ? <Arrow onClick={this.moveForward} direction={ArrowDirection.Up} />
      : undefined)
    const backwardArrow = (this.props.car.rear ? <Arrow onClick={this.moveBackward} direction={ArrowDirection.Down} />
      : undefined)
    return <div>
      {forwardArrow}
      {backwardArrow}
      <SpeechBubble onClick={this.speechBubble} position={_.sample(this.props.car.bubbles())!} />
    </div>
  }

  moveForward = () => {
    if (this.props.moveForward) {
      this.props.moveForward()
    }
  }

  moveBackward = () => {
    if (this.props.moveBackward) {
      this.props.moveBackward()
    }
  }

  speechBubble = () => {
    if (this.props.speechBubble) {
      this.props.speechBubble()
    }
  }
}