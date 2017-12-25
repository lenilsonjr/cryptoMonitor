import React, { Component } from 'react';
import io from 'socket.io-client';
import '../styles/global.css';
import CCC from '../streamer.js';
import { connect } from 'react-redux';
import { removeCoin } from '../actions';

class Coin extends Component {

  constructor(props) {
    super(props);
    this.state = {
      OtherCurrency: 'BTC',

      Change: 0,
      ChangeIcon: 'glyphicon glyphicon-minus',

      Prices: {
        BTC: 0.0,
        BTCIcon: 'glyphicon glyphicon-minus',
        USD: 0.0,
        USDIcon: 'glyphicon glyphicon-minus'        
      },
      Portfolio: {
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
    let subscription = this.props.Symbol === 'BTC' ? [`5~CCCAGG~${this.props.Symbol}~USD`] : [`5~CCCAGG~${this.props.Symbol}~BTC`, `5~CCCAGG~${this.props.Symbol}~USD`];
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
      const quantity = this.props.Quantity;
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

        Portfolio.Profit = ((data['PRICE'] - this.props.InvestedAt) / this.props.InvestedAt * 100).toFixed(2);
        Portfolio.ProfitIcon = 'glyphicon glyphicon-minus';
        if ( Portfolio.Profit < 0 ) {
          Portfolio.ProfitIcon = 'glyphicon glyphicon-chevron-down';
        } else if ( Portfolio.Profit > 0) {
          Portfolio.ProfitIcon = 'glyphicon glyphicon-chevron-up';          
        }
      }

      if ( data['TOSYMBOL'] === 'USD' ) {
        Prices.USD = data['PRICE'].toFixed(4);
        if ( data['FLAGS'] === '1' ) {
          Prices.USDIcon = 'glyphicon glyphicon-chevron-up';
        } else if ( data['FLAGS'] === '2' ) {
          Prices.USDIcon = 'glyphicon glyphicon-chevron-down';
        } else {
          Prices.USDIcon = 'glyphicon glyphicon-minus';          
        }
        Portfolio.USD = (data['PRICE'] * quantity).toFixed(4);
      } else if ( data['TOSYMBOL'] === 'BTC' ) {
        Prices.BTC = data['PRICE'];
        if ( data['FLAGS'] === '1' ) {
          Prices.BTCIcon = 'glyphicon glyphicon-chevron-up';
        } else if ( data['FLAGS'] === '2' ) {
          Prices.BTCIcon = 'glyphicon glyphicon-chevron-down';
        } else {
          Prices.BTCIcon = 'glyphicon glyphicon-minus';          
        }
        Portfolio.BTC = (data['PRICE'] * quantity).toFixed(4);
      }

      this.setState({ Change, ChangeIcon, Portfolio, Prices });
    }

    //console.log(data);
  }

  removeCoin(id) {
    this.props.removeCoin(id);    
  }

  render() {
    return(
      <div className="col-md-4">
        <div className="panel panel-default coin-card">
          <div className="panel-body">
            <img src={ this.props.ImageUrl } alt={this.props.Symbol} />
            <br />
            <span className="label label-primary">{ this.props.Symbol }</span>
            <h3><small>You have</small> ${this.state.Portfolio.USD} <small>or</small> { this.props.Quantity } <small>{ this.props.CoinName }</small></h3>
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
          <div className="panel-footer">
            <button
              className="btn btn-danger btn-block"
              onClick={() => this.removeCoin(this.props.id)}
            >
              <span className="glyphicon glyphicon-remove"></span> Remove
            </button>
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

export default connect(mapStateToProps, { removeCoin })(Coin);