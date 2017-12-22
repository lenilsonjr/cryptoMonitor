import React, { Component } from 'react';
import '../styles/global.css'

class Coin extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div className="col-md-3">
        <div class="panel panel-default coin-card">
          <div class="panel-body">
            <img src="https://www.cryptocompare.com/media/12318032/xvg.png" alt=""/>
            <br />
            <span class="label label-primary">XVG</span>
            <h3><small>You have</small> R$0.34 <small>or</small> 500 <small>Verge</small></h3>
            <hr/>
            <div className="row">

              <div className="col-xs-6">
                <small>Your profit</small>
                <br />
                <span className="glyphicon glyphicon-chevron-up"></span> +100%
              </div>
              <div className="col-xs-6">
                <small>24hr change</small>
                <br />
                <span className="glyphicon glyphicon-chevron-down"></span> -34%
              </div>

            </div>
            <hr />
            <div className="row">
            
              <div className="col-xs-4">
                <small>BTC</small>
                <br />
                <span className="glyphicon glyphicon-chevron-up"></span> 0.5000
              </div>
              <div className="col-xs-4">
                <small>USD</small>
                <br />
                <span className="glyphicon glyphicon-chevron-down"></span> 0.34
              </div>
              <div className="col-xs-4">
                <small>BRL</small>
                <br />
                <span className="glyphicon glyphicon-minus"></span> 0.65
              </div>

            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default Coin;