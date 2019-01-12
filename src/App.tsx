import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Cinemagraph from './components/Cinemagraph';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Cinemagraph file="bed" />
      </div>
    );
  }
}

export default App;
