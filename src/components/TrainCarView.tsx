import * as React from 'react'
import { TrainCar } from '../train';
import Arrow, { ArrowDirection } from './Arrow';
import SpeechBubble from './SpeechBubble';
import EyeView from './EyeView'

import * as _ from 'lodash'

interface Props {
  car: TrainCar

  moveForward?: any
  moveBackward?: any
  speechBubble?: any
  viewWindow?: any
}

export default class TrainCarView extends React.Component<Props> {
  render() {
    const forwardArrow = (this.props.car.front ? <Arrow onClick={this.moveForward} direction={ArrowDirection.Up} />
      : undefined)
    const backwardArrow = (this.props.car.rear ? <Arrow onClick={this.moveBackward} direction={ArrowDirection.Down} />
      : undefined)

    const positions = _.shuffle(this.props.car.bubbles())

    const bubbles = this.props.car.trades.map((t, i) => {
      return <SpeechBubble key={`bubble-${i}`} onClick={this.speechBubble} position={positions.shift()!} />
    })

    const window = (this.props.car.eye() ?
      <EyeView onClick={this.viewWindow} position={this.props.car.eye()!} />
      : undefined
    )


    return <div>
      {forwardArrow}
      {backwardArrow}
      {bubbles}
      {window}
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

  viewWindow = () => {
    if (this.props.viewWindow) {
      this.props.viewWindow()
    }
  }
}