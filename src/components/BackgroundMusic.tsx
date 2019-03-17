import * as React from 'react'

export default class BackgroundMusic extends React.Component {
  render() {
    return <audio autoPlay loop src="audio/music.wav" />
  }
}