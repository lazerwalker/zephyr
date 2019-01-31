import React from 'react'
import { CacheEntry } from '../preloadMedia';
import Cinemagraph from './Cinemagraph';

interface Props {
  onStart: (() => void)
  media: CacheEntry
}

export default (props: Props) => {
  return <div>
    <Cinemagraph media={props.media} silent />
    <div id='menu'>
      <h1>Görli</h1>
      <p>by <a href="https://lazerwalker.com" target="_blank">@lazerwalker</a></p>
      <p>made for <a href="https://itch.io/jam/flatjam2018/" target="_blank">flatjam 2018</a></p>
      <button id='start' onClick={props.onStart}>
        <div id="play-icon" />
      </button>
    </div>
  </div>
}