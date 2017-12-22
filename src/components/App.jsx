import React, { Component } from 'react';
import Navbar from './Navbar';
import Coin from './Coin';
import '../styles/global.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      text: '',
      dueDate: ''
    }
  }

  render() {
    return(
      <div className="app">

        <Navbar />
      
        <div className="container-fluid">
          <div className="row">

            <Coin />            

          </div>
        </div>

      </div>
    )
  }

}

export default App;