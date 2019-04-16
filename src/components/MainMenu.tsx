import React from 'react'
import { CacheEntry } from '../preloadMedia';
import Cinemagraph from './Cinemagraph';
import Button from './Button';

interface Props {
  onStart: (() => void)
  onCredits: (() => void)
  media: CacheEntry
  subtitle: string
  startText: string
}

export default (props: Props) => {
  return <div>
    <Cinemagraph media={props.media} silent />
    <div id='menu'>
      <h1>ｚｅｐｈｙｒ</h1>
      <div className='subtitle'>{props.subtitle}</div>
      <div id='short-credits'>
        <p>made on <a href="https://itch.io/jam/trainjam2019/" target="_blank">trainjam 2019</a><br />
          by <a href="https://lazerwalker.com" target="_blank">@lazerwalker</a></p>
        <p>music by <a href="https://twitter.com/maizewallin">maize wallin</a><br />
          sound by <a href="#" target="_blank">ali cedroni</a><br />
          acting by <a href="#" onClick={props.onCredits}>others</a>
        </p>
      </div>
      <Button onClick={props.onStart}>
        {props.startText}
      </Button>
    </div>
  </div>
}