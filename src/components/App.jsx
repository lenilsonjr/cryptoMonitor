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
          <div className="row coin-list">

            <Coin />

            <div className="col-md-3">

              <div className="panel panel-default coin-card new-coin">
                <div className="panel-body">
                  <span className="glyphicon glyphicon-plus"></span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    )
  }

}

export default App;