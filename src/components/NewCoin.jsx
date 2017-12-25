import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addCoin } from '../actions';
import '../styles/global.css'

class NewCoin extends Component {

  constructor(props){
    super(props);
    this.state = {
      Coins: {},
      BaseImg: '',
      CoinName: '',
      Symbol: '',
      ImageUrl: '',
      Quantity: '',
      InvestedAt: ''
    }
  }

  addCoin() {
    this.props.addCoin(this.state.CoinName, this.state.Symbol, this.state.ImageUrl, this.state.Quantity, this.state.InvestedAt);
  }

  componentDidMount() {
    let FETCH_URL = 'https://min-api.cryptocompare.com/data/all/coinlist';
    
    fetch(FETCH_URL, {
      method: 'GET',
    })
    .then(response => response.json())
    .then(json => {
      const BaseImg = json.BaseImageUrl;
      const Coins = json.Data;
      this.setState({Coins, BaseImg});
    });

  }

  renderOptions() {
    const coins = this.state.Coins;
    let coinOptions = []
    Object.keys(coins).forEach(function (key) {
      let coin = coins[key];
      if (coin.CoinName !== 'Bitcoin')
        coinOptions.push( <option key={ coin.Id } value={ coin.Symbol }>{ coin.CoinName }</option> )
    })
    return(
      <select
        className="form-control input-sm"
        onChange={ event => this.setCoin(event.target.value) }        
      >
      { coinOptions }
      </select>
    )
  }

  setCoin(coin) {
    let { Symbol, CoinName, ImageUrl } = this.state.Coins[coin];
    ImageUrl = `${this.state.BaseImg}${ImageUrl}`;
    this.setState({ Symbol, CoinName, ImageUrl });
  }

  render() {
    return(

      <div className="col-md-6 col-md-offset-3">
      
        <div className="panel panel-default coin-card new-coin">
          <div className="panel-body">
            <div className="form-inline">
              <div className="form-group">
                <span>I bought</span>
                <input
                  type="number"
                  min="0"
                  step="0.00001"                
                  placeholder="5000"
                  className="form-control input-sm"
                  onChange={ event => this.setState({Quantity: event.target.value}) }
                />
                <span>of</span>
                { this.renderOptions() }
                <span>at</span>
                <input
                  type="number"
                  min="0"
                  step="0.00001"
                  placeholder="0.00001"
                  className="form-control input-sm"
                  onChange={ event => this.setState({InvestedAt: event.target.value}) }                
                />
                <span>BTC</span>
              </div>
              <div className="form-group">              
                <button 
                  className="btn btn-default"
                  onClick={ () => this.addCoin()}
                >
                  <span className="glyphicon glyphicon-plus"></span> Add to portfolio
                </button>
              </div>
            </div>
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

export default connect(mapStateToProps, { addCoin })(NewCoin);