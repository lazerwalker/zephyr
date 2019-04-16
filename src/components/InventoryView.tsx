import * as React from 'react'
import { Item } from '../train'

interface Props {
  item: Item
  won: boolean
}

export default class InventoryView extends React.Component<Props> {
  render() {
    let text = (this.props.won ? "🎉" : this.props.item.name)
    return (
      <div className='inventory-wrapper'>
        <div className='inventory'>
          <div className='header'>ｉｎｖｅｎｔｏｒｙ</div>
          <div className='item-box' style={{ color: this.props.item.color }}>{text}</div>
        </div></div>
    )
  }
}