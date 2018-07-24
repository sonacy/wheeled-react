import React from '../src'
import logo from './logo.svg'
import './App.css'

class App extends React.Component {

  state = {
    counter: 0
  }

  add = () => {
    this.setState({
      counter: this.state.counter + 1
    })
  }

  minus = () => {
    this.setState({
      counter: this.state.counter - 1
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div className="App-intro">
          <button onClick={this.add}>+</button>
          <span>{this.state.counter}</span>
          <button onClick={this.minus}>-</button>
        </div>
      </div>
    )
  }
}

export default App
