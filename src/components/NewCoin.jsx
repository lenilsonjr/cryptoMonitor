import React, { Component } from 'react';
import '../styles/global.css'

class NewCoin extends Component {

  constructor(props){
    super(props);
    this.state = {
      coins: {},
      baseImg: ''
    }
  }

  componentDidMount() {
    let FETCH_URL = 'https://min-api.cryptocompare.com/data/all/coinlist';
    
    fetch(FETCH_URL, {
      method: 'GET',
    })
    .then(response => response.json())
    .then(json => {
      const baseImg = json.BaseImageUrl;
      const coins = json.Data;
      this.setState({coins, baseImg});
    });

  }

  renderOptions() {
    const coins = this.state.coins;
    let coinOptions = []
    Object.keys(coins).forEach(function (key) {
      let coin = coins[key];
      coinOptions.push( <option key={ coin.Id } value={ coin.Symbol }>{ coin.CoinName }</option> )
    })
    return(
      <select
        className="form-control"
      >
      { coinOptions }
      </select>
    )
  }

  render() {
    return(

      <div className="col-md-3">
      
        <div className="panel panel-default coin-card new-coin">
          <div className="panel-body">
            <div className="form-group">
              <span>I bought</span>
              <input
                type="text"
                placeholder="5000"
                className="form-control"
              />
              <span>of</span>
              { this.renderOptions() }
              <span>at</span>
              <input
                type="number"
                min="0"
                step="0.0001"
                placeholder="0.30"
                className="form-control"
              />
              <span>USD</span>
            </div>
            <button 
              className="btn btn-default"
            >
              <span className="glyphicon glyphicon-plus"></span> Add to portfolio
            </button>
          </div>
        </div>

      </div>
      

    )
  }

}

export default NewCoin;