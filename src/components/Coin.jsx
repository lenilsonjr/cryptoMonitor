import React, { Component } from 'react';
import io from 'socket.io-client';
import '../styles/global.css';
import CCC from '../streamer.js';

class Coin extends Component {

  constructor(props) {
    super(props);
    this.state = {
      CoinName: 'Verge',
      Symbol: 'XVG',
      ImageUrl: 'https://www.cryptocompare.com/media/12318032/xvg.png',

      OtherCurrency: 'USD',

      Change: 0,
      ChangeIcon: 'glyphicon glyphicon-minus',

      Prices: {
        BTC: 0.0,
        BTCIcon: 'glyphicon glyphicon-minus',
        USD: 0.0,
        USDIcon: 'glyphicon glyphicon-minus'        
      },
      Portfolio: {
        Quantity: 575,
        InvestedAt: 0.13,
        Profit: 0,
        ProfitIcon: 'glyphicon glyphicon-minus',
        BTC: 0.0,
        USD: 0.0,
      }
    }
  }

  componentDidMount() {
    const $this = this;
    let socket = io.connect('https://streamer.cryptocompare.com/');
    //Format: {SubscriptionId}~{ExchangeName}~{FromSymbol}~{ToSymbol}
    //Use SubscriptionId 0 for TRADE, 2 for CURRENT and 5 for CURRENTAGG
    //For aggregate quote updates use CCCAGG as market
    let subscription = [`5~CCCAGG~${this.state.Symbol}~BTC`, `5~CCCAGG~${this.state.Symbol}~USD`];
    socket.emit('SubAdd', { subs: subscription });
    socket.on("m", function(message) {
      let messageType = message.substring(0, message.indexOf("~"));
      let res = {};
      if (messageType === CCC.STATIC.TYPE.CURRENTAGG) {
        res = CCC.CURRENT.unpack(message);
        $this.handleData(res);
      }
    });
  }
    
  handleData(data) {

    if (data['PRICE'] !== undefined ) {
      const quantity = this.state.Portfolio.Quantity;
      let Prices = {...this.state.Prices};      
      let Portfolio = {...this.state.Portfolio};
      let {Change, ChangeIcon} = this.state;
      
      if ( data['TOSYMBOL'] === this.state.OtherCurrency && data['OPEN24HOUR'] !== undefined ) {
        Change = ((data['PRICE'] - data['OPEN24HOUR']) / data['OPEN24HOUR'] * 100).toFixed(2);
        ChangeIcon = 'glyphicon glyphicon-minus';
        if ( Change < 0 ) {
          ChangeIcon = 'glyphicon glyphicon-chevron-down';
        } else if ( Change > 0) {
          ChangeIcon = 'glyphicon glyphicon-chevron-up';          
        }

        Portfolio.Profit = ((data['PRICE'] - Portfolio.InvestedAt) / Portfolio.InvestedAt * 100).toFixed(2);
        Portfolio.ProfitIcon = 'glyphicon glyphicon-minus';
        if ( Portfolio.Profit < 0 ) {
          Portfolio.ProfitIcon = 'glyphicon glyphicon-chevron-down';
        } else if ( Portfolio.Profit > 0) {
          Portfolio.ProfitIcon = 'glyphicon glyphicon-chevron-up';          
        }
      }

      if ( data['TOSYMBOL'] === 'USD' ) {
        Prices.USD = data['PRICE'];
        if ( data['FLAGS'] === '1' ) {
          Prices.USDIcon = 'glyphicon glyphicon-chevron-up';
        } else if ( data['FLAGS'] === '2' ) {
          Prices.USDIcon = 'glyphicon glyphicon-chevron-down';
        } else {
          Prices.USDIcon = 'glyphicon glyphicon-minus';          
        }
        Portfolio.USD = data['PRICE'] * quantity;
      } else if ( data['TOSYMBOL'] === 'BTC' ) {
        Prices.BTC = data['PRICE'];
        if ( data['FLAGS'] === '1' ) {
          Prices.BTCIcon = 'glyphicon glyphicon-chevron-up';
        } else if ( data['FLAGS'] === '2' ) {
          Prices.BTCIcon = 'glyphicon glyphicon-chevron-down';
        } else {
          Prices.BTCIcon = 'glyphicon glyphicon-minus';          
        }
        Portfolio.BTC = data['PRICE'] * quantity;        
      }

      this.setState({ Change, ChangeIcon, Portfolio, Prices });
    }

    console.log(data);
  }

  render() {
    return(
      <div className="col-md-3">
        <div className="panel panel-default coin-card">
          <div className="panel-body">
            <img src={ this.state.ImageUrl } alt={this.state.Symbol} />
            <br />
            <span className="label label-primary">{ this.state.Symbol }</span>
            <h3><small>You have</small> ${this.state.Portfolio.USD} <small>or</small> { this.state.Portfolio.Quantity } <small>{ this.state.CoinName }</small></h3>
            <hr/>
            <div className="row">

              <div className="col-xs-6">
                <small>Your profit</small>
                <br />
                <span className={ this.state.Portfolio.ProfitIcon }></span> { this.state.Portfolio.Profit }%
              </div>
              <div className="col-xs-6">
                <small>24hr change ({ this.state.OtherCurrency })</small>
                <br />
                <span className={ this.state.ChangeIcon }></span> { this.state.Change }%
              </div>

            </div>
            <hr />
            <div className="row">
            
              <div className="col-xs-6">
                <small>BTC</small>
                <br />
                <span className={ this.state.Prices.BTCIcon }></span> { this.state.Prices.BTC }
              </div>
              <div className="col-xs-6">
                <small>USD</small>
                <br />
                <span className={ this.state.Prices.USDIcon }></span> { this.state.Prices.USD }
              </div>

            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default Coin;