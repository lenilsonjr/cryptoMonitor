import React, { Component } from 'react';
import Navbar from './Navbar';
import Coin from './Coin';
import NewCoin from './NewCoin';
import '../styles/global.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      coins: [
        {
          CoinName: 'Verge',
          Symbol: 'XVG',
          ImageUrl: 'https://www.cryptocompare.com/media/12318032/xvg.png',
          Quantity: 575,
          InvestedAt: 0.13
        },
        {
          CoinName: 'NEO',
          Symbol: 'NEO',
          ImageUrl: 'https://www.cryptocompare.com/media/1383858/neo.jpg',
          Quantity: 575,
          InvestedAt: 0.13
        },
        {
          CoinName: 'Bitcoin',
          Symbol: 'BTC',
          ImageUrl: 'https://www.cryptocompare.com/media/19633/btc.png',
          Quantity: 575,
          InvestedAt: 0.13
        }
      ]
    }
  }

  render() {
    return(
      <div className="app">

        <Navbar />
      
        <div className="container-fluid">
          <div className="row coin-list">
            {
              this.state.coins.map(coin => {

                return (
                  <Coin
                    key={coin.Symbol}
                    {...coin}
                  />
                )
              })
            }

            <NewCoin />

          </div>
        </div>

      </div>
    )
  }

}

export default App;