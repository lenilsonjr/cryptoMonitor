import { ADD_COIN, REMOVE_COIN } from '../constants';

const coin = (action) => {
  let { CoinName, Symbol, ImageUrl, Quantity, InvestedAt } = action;
  return {
    id: Math.random(),
    CoinName,
    Symbol,
    ImageUrl,
    Quantity,
    InvestedAt
  }
}

const removeById = (state = [], id) => {
  const coins = state.filter(coin => coin.id !== id);
  return coins;
}

const coins = (state = [], action) => {
  
  let coins = null;
  const localStorage = window.localStorage;
  if (localStorage.getItem('cryptomonitorcoins'))
    state = JSON.parse( localStorage.getItem('cryptomonitorcoins') );
  switch(action.type) {
    case ADD_COIN:
      coins = [...state, coin(action)]
      localStorage.removeItem("cryptomonitorcoins");
      localStorage.setItem('cryptomonitorcoins', JSON.stringify(coins));
      return coins;
    case REMOVE_COIN:
      coins = removeById(state, action.id);
      localStorage.removeItem("cryptomonitorcoins");
      localStorage.setItem('cryptomonitorcoins', JSON.stringify(coins));
      return coins;
    default:
      return state;
  }

}
  
export default coins;