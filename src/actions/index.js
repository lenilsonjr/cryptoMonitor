import { ADD_COIN } from '../constants';

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