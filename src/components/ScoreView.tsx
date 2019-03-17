import * as React from 'react'
import { Item } from '../train'

interface Props {
  score: number
  total: number
  constant: number
}

export default class ScoreView extends React.Component<Props> {
  numbers = "０１２３４５６７８９".split("")

  convertNumber(num: number): string {
    return num
      .toString()
      .split("")
      .map(c => this.numbers[parseInt(c)])
      .join("")
  }

  render() {
    return (
      <div className='score-wrapper'>
        <div className='score'>
          <div className='header'>ｐｌｅａｓｅｄ</div>
          <div className='score-box'>{this.convertNumber(this.props.score + this.props.constant)} / {this.convertNumber(this.props.total + this.props.constant)}</div>
        </div></div>
    )
  }
}