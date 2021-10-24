import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';

import { addPriceRequest, addPriceSuccess, addPriceError } from '../actions';

const loading = handleActions(
  {
    [addPriceRequest]: (_state) => true,
    [addPriceSuccess]: (_state) => false,
    [addPriceError]: (_state) => false
  },
  false
);
const error = handleActions(
  {
    [addPriceRequest]: (_state) => null,
    [addPriceSuccess]: (_state) => null,
    [addPriceError]: (_state, { payload }) => payload
  },
  null
);
const price = handleActions(
  {
    [addPriceRequest]: (_state) => {},
    [addPriceSuccess]: (_state, { payload }) => {},
    [addPriceError]: (_state) => {}
  },
  {}
);
const query = handleActions(
  {
    [addPriceRequest]: (_state, { payload }) => payload,
    [addPriceSuccess]: (_state) => {},
    [addPriceError]: (_state) => {}
  },
  {}
);

export const getPrices = ({ prices }) => prices;

export default combineReducers({ loading, error, price, query });
