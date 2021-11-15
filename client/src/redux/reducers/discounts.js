import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';

import {
  getDiscountsRequest,
  getDiscountsSuccess,
  getDiscountsError,
  addDiscountsRequest,
  addDiscountsSuccess,
  addDiscountsError,
  editDiscountsRequest,
  editDiscountsSuccess,
  editDiscountsError,
  deleteDiscountsRequest,
  deleteDiscountsSuccess,
  deleteDiscountsError
} from '../actions';

const loading = handleActions(
  {
    [getDiscountsRequest]: (_state) => true,
    [getDiscountsSuccess]: (_state) => false,
    [getDiscountsError]: (_state) => false,
    [addDiscountsRequest]: (_state) => true,
    [addDiscountsSuccess]: (_state) => false,
    [addDiscountsError]: (_state) => false,
    [editDiscountsRequest]: (_state) => true,
    [editDiscountsSuccess]: (_state) => false,
    [editDiscountsError]: (_state) => false,
    [deleteDiscountsRequest]: (_state) => true,
    [deleteDiscountsSuccess]: (_state) => false,
    [deleteDiscountsError]: (_state) => false
  },
  false
);
const error = handleActions(
  {
    [getDiscountsRequest]: (_state) => null,
    [getDiscountsSuccess]: (_state) => null,
    [getDiscountsError]: (_state, { payload }) => payload,
    [addDiscountsRequest]: (_state) => null,
    [addDiscountsSuccess]: (_state) => null,
    [addDiscountsError]: (_state, { payload }) => payload,
    [editDiscountsRequest]: (_state) => null,
    [editDiscountsSuccess]: (_state) => null,
    [editDiscountsError]: (_state, { payload }) => payload,
    [deleteDiscountsRequest]: (_state) => null,
    [deleteDiscountsSuccess]: (_state) => null,
    [deleteDiscountsError]: (_state, { payload }) => payload
  },
  null
);
const list = handleActions(
  {
    [getDiscountsRequest]: (_state) => [],
    [getDiscountsSuccess]: (_state, { payload }) => payload,
    [getDiscountsError]: (_state) => [],
    [addDiscountsRequest]: (_state) => [],
    [addDiscountsSuccess]: (_state, { payload }) => payload,
    [addDiscountsError]: (_state) => [],
    [editDiscountsRequest]: (_state) => [],
    [editDiscountsSuccess]: (_state, { payload }) => payload,
    [editDiscountsError]: (_state) => [],
    [deleteDiscountsRequest]: (_state) => [],
    [deleteDiscountsSuccess]: (_state, { payload }) => payload,
    [deleteDiscountsError]: (_state) => []
  },
  []
);
const query = handleActions(
  {
    [addDiscountsRequest]: (_state, { payload }) => payload,
    [addDiscountsSuccess]: (_state) => ({}),
    [addDiscountsError]: (_state) => ({}),
    [editDiscountsRequest]: (_state, { payload }) => payload,
    [editDiscountsSuccess]: (_state) => ({}),
    [editDiscountsError]: (_state) => ({}),
    [deleteDiscountsRequest]: (_state, { payload }) => payload,
    [deleteDiscountsSuccess]: (_state) => ({}),
    [deleteDiscountsError]: (_state) => ({})
  },
  {}
);

export const getDiscounts = ({ discounts }) => discounts;

export default combineReducers({ loading, error, list, query });
