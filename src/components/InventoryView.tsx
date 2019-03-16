import * as React from 'react'
import { Item } from '../train'

interface Props {
  item: Item
}

export default class InventoryView extends React.Component<Props> {
  render() {
    console.log(this.props.item)
    return (
      <div className='inventory-wrapper'>
        <div className='inventory'>
          <div className='header'>ｉｎｖｅｎｔｏｒｙ</div>
          <div className='item-box' style={{ color: this.props.item.color }}>{this.props.item.name}</div>
        </div></div>
    )
  }
}