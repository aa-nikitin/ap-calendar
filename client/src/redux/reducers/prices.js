import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';

import {
  addPriceRequest,
  addPriceSuccess,
  addPriceError,
  deletePriceRequest,
  deletePriceSuccess,
  deletePriceError,
  editPriceRequest,
  editPriceSuccess,
  editPriceError,
  copyPricesRequest,
  copyPricesSuccess,
  copyPricesError,
  delAllPricesRequest,
  delAllPricesSuccess,
  delAllPricesError,
  setPrices
} from '../actions';

const loading = handleActions(
  {
    [addPriceRequest]: (_state) => true,
    [addPriceSuccess]: (_state) => false,
    [addPriceError]: (_state) => false,
    [deletePriceRequest]: (_state) => true,
    [deletePriceSuccess]: (_state) => false,
    [deletePriceError]: (_state) => false,
    [editPriceRequest]: (_state) => true,
    [editPriceSuccess]: (_state) => false,
    [editPriceError]: (_state) => false,
    [copyPricesRequest]: (_state) => true,
    [copyPricesSuccess]: (_state) => false,
    [copyPricesError]: (_state) => false,
    [delAllPricesRequest]: (_state) => true,
    [delAllPricesSuccess]: (_state) => false,
    [delAllPricesError]: (_state) => false
  },
  false
);
const error = handleActions(
  {
    [addPriceRequest]: (_state) => null,
    [addPriceSuccess]: (_state) => null,
    [addPriceError]: (_state, { payload }) => payload,
    [deletePriceRequest]: (_state) => null,
    [deletePriceSuccess]: (_state) => null,
    [deletePriceError]: (_state, { payload }) => payload,
    [editPriceRequest]: (_state) => null,
    [editPriceSuccess]: (_state) => null,
    [editPriceError]: (_state, { payload }) => payload,
    [copyPricesRequest]: (_state) => null,
    [copyPricesSuccess]: (_state) => null,
    [copyPricesError]: (_state, { payload }) => payload,
    [delAllPricesRequest]: (_state) => null,
    [delAllPricesSuccess]: (_state) => null,
    [delAllPricesError]: (_state, { payload }) => payload
  },
  null
);
const list = handleActions(
  {
    [addPriceRequest]: (_state) => {},
    [addPriceSuccess]: (_state, { payload }) => payload,
    [addPriceError]: (_state) => {},
    [deletePriceRequest]: (_state) => {},
    [deletePriceSuccess]: (_state, { payload }) => payload,
    [deletePriceError]: (_state) => {},
    [editPriceRequest]: (_state) => {},
    [editPriceSuccess]: (_state, { payload }) => payload,
    [editPriceError]: (_state) => {},
    [copyPricesRequest]: (_state) => {},
    [copyPricesSuccess]: (_state, { payload }) => payload,
    [copyPricesError]: (_state) => {},
    [delAllPricesRequest]: (_state) => {},
    [delAllPricesSuccess]: (_state, { payload }) => payload,
    [delAllPricesError]: (_state) => {},
    [setPrices]: (_state, { payload }) => payload
  },
  {}
);
const query = handleActions(
  {
    [addPriceRequest]: (_state, { payload }) => payload,
    [addPriceSuccess]: (_state) => {},
    [addPriceError]: (_state) => {},
    [deletePriceRequest]: (_state, { payload }) => payload,
    [deletePriceSuccess]: (_state) => {},
    [deletePriceError]: (_state) => {},
    [editPriceRequest]: (_state, { payload }) => payload,
    [editPriceSuccess]: (_state) => {},
    [editPriceError]: (_state) => {},
    [copyPricesRequest]: (_state, { payload }) => payload,
    [copyPricesSuccess]: (_state) => {},
    [copyPricesError]: (_state) => {},
    [delAllPricesRequest]: (_state, { payload }) => payload,
    [delAllPricesSuccess]: (_state) => {},
    [delAllPricesError]: (_state) => {}
  },
  {}
);

export const getPrices = ({ prices }) => prices;

export default combineReducers({ loading, error, list, query });
