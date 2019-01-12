import React, { Component, SyntheticEvent } from 'react';
import logo from './logo.svg';
import './App.css';
import Cinemagraph from './components/Cinemagraph';

interface State {
  index: number
}

class App extends Component<{}, State> {
  videos = [
    "bed",
    "shower",
    "bike",
    "ubahn"
  ]

  constructor(props: any) {
    super(props)
    this.state = { index: 0 }
  }


  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
  }

  render() {
    return (
      <div className="App" >
        <Cinemagraph file={this.videos[this.state.index]} />
      </div>
    );
  }

  onKeyDown = (e: Event) => {
    const index = (this.state.index >= this.videos.length ? 0 : this.state.index + 1)
    console.log("Changin index", index)
    this.setState({ index })
  }

  onKeyUp = (e: Event) => {
    console.log(e)
  }
}

export default App;
