import React from 'react'
import { CacheEntry } from '../preloadMedia';
import Cinemagraph from './Cinemagraph';
import Button from './Button';

interface Props {
  onStart: (() => void)
  media?: CacheEntry
  subtitle: string
  startText: string
}

export default (props: Props) => {
  return <div>
    {/* <Cinemagraph media={props.media} silent /> */}
    <div id='menu'>
      <h1>ｙｏｕｗｉｎ</h1>
      <div className='subtitle'>{props.subtitle}</div>
      <Button onClick={props.onStart}>
        {props.startText}
      </Button>
    </div>
  </div>
}