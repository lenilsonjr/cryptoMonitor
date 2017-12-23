import React, { Component } from 'react';
import Navbar from './Navbar';
import Coin from './Coin';
import NewCoin from './NewCoin';
import { connect } from 'react-redux';
import '../styles/global.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      coins: [{}]
    }
  }

  render() {
    return(
      <div className="app">

        <Navbar />
      
        <div className="container-fluid">
          <div className="row coin-list">
            {
              this.props.coins.map(coin => {

                return (
                  <Coin
                    key={coin.id}
                    {...coin}
                  />
                )
              })
            }
          </div>
          <div className="row">
            <NewCoin />
          </div>

        </div>
      </div>
    )
  }

}

function mapStateToProps(state) {
  return {
    coins: state
  }
}

export default connect(mapStateToProps)(App);