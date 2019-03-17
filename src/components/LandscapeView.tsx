import * as React from 'react'
import Arrow, { ArrowDirection } from './Arrow';

import * as _ from 'lodash'

interface Props {
  continue?: any
}

export default class TrainCarView extends React.Component<Props> {
  render() {
    return <div>
      <Arrow onClick={this.continue} direction={ArrowDirection.Down} />
    </div>
  }

  continue = () => {
    if (this.props.continue) {
      this.props.continue()
    }
  }
}