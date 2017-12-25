import { ADD_COIN, REMOVE_COIN } from '../constants';

export const addCoin = (CoinName, Symbol, ImageUrl, Quantity, InvestedAt) => {
  const action = {
    type: ADD_COIN,
    CoinName,
    Symbol,
    ImageUrl,
    Quantity,
    InvestedAt
  }
  return action;
}

export const removeCoin = (id) => {
  const action = {
    type: REMOVE_COIN,
    id
  }
  return action;
}