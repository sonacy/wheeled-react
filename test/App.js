import React from '../src/'
import './App.css'
import logo from './logo.svg'

class App extends React.Component {
  render() {
    return (
      <div className='App'>
        <header className='App-header'>
          <img src={logo} alt="logo" className='App-logo'/>
          <h1 className='App-title'>welcome to react</h1>
        </header>
        <p className='App-intro'>
          to get started,
          <code>src/App.js</code>
          save to reload.
        </p>
      </div>
    )
  }
}

export default App
