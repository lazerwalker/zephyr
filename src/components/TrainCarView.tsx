import * as React from 'react'
import Cinemagraph from './Cinemagraph';
import { TrainCar } from '../train';

interface Props {
  car: TrainCar
}

export default class TrainCarView extends React.Component<Props> {
  render() {
    return <div>
      <Cinemagraph media={this.props.car.media()} silent={true} />
    </div>
  }
}