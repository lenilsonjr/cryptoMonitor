import { ADD_COIN } from '../constants';
import { bake_cookie, read_cookie } from 'sfcookies';

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

const coins = (state = [], action) => {
  
  let coins = null;
  state = read_cookie('coins');  
  switch(action.type) {
    case ADD_COIN:
      coins = [...state, coin(action)]
      bake_cookie('coins', coins);
      return coins;
    default:
      return state;
  }

}
  
export default coins;