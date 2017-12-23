import { ADD_COIN } from '../constants';

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
  switch(action.type) {
    case ADD_COIN:
      coins = [...state, coin(action)]
      console.log('reducer', coins);      
      return coins;
    default:
      return state;
  }

}
  
export default coins;