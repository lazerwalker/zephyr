import * as React from 'react'
import Cinemagraph from './Cinemagraph';
import { TrainCar } from '../train';
import Arrow from './Arrow';

interface Props {
  car: TrainCar

  moveForward?: any
  moveBackward?: any
}

export default class TrainCarView extends React.Component<Props> {
  render() {
    console.log(this.props.car)
    return <div>
      <Arrow onClick={this.moveForward} />
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