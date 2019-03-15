import * as React from 'react'
import Cinemagraph from './Cinemagraph';
import { TrainCar } from '../train';
import Arrow, { ArrowDirection } from './Arrow';

interface Props {
  car: TrainCar

  moveForward?: any
  moveBackward?: any
}

export default class TrainCarView extends React.Component<Props> {
  render() {
    console.log(this.props.car)
    return <div>
      <Arrow onClick={this.moveForward} direction={ArrowDirection.Up} />
      <Arrow onClick={this.moveBackward} direction={ArrowDirection.Down} />
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
}