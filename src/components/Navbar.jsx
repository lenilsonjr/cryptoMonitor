import React, { Component } from 'react';
import '../styles/global.css'

class Navbar extends Component {

  //constructor(props) {
  //  super(props);
  //}

  render() {
    return(
      <nav className="navbar navbar-inverse">
        <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand" href="/">
              <img alt="Crypto Monitor Logo" src="coin.png" />
            </a>

            <p className="navbar-text">CryptoMonitor</p>            
          </div>
        </div>
      </nav>    
    )
  }

}

export default Navbar;