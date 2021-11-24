import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';

import {
  paymentsGetRequest,
  paymentsGetSuccess,
  paymentsGetError,
  paymentsDeleteRequest,
  paymentsDeleteSuccess,
  paymentsDeleteError,
  paymentsAddRequest,
  paymentsAddSuccess,
  paymentsAddError
} from '../actions';

const loading = handleActions(
  {
    [paymentsGetRequest]: (_state) => true,
    [paymentsGetSuccess]: (_state) => false,
    [paymentsGetError]: (_state) => false,
    [paymentsDeleteRequest]: (_state) => true,
    [paymentsDeleteSuccess]: (_state) => false,
    [paymentsDeleteError]: (_state) => false,
    [paymentsAddRequest]: (_state) => true,
    [paymentsAddSuccess]: (_state) => false,
    [paymentsAddError]: (_state) => false
  },
  false
);
const error = handleActions(
  {
    [paymentsGetRequest]: (_state) => null,
    [paymentsGetSuccess]: (_state) => null,
    [paymentsGetError]: (_state, { payload }) => payload,
    [paymentsDeleteRequest]: (_state) => null,
    [paymentsDeleteSuccess]: (_state) => null,
    [paymentsDeleteError]: (_state, { payload }) => payload,
    [paymentsAddRequest]: (_state) => null,
    [paymentsAddSuccess]: (_state) => null,
    [paymentsAddError]: (_state, { payload }) => payload
  },
  null
);
const list = handleActions(
  {
    [paymentsAddRequest]: (_state) => [],
    [paymentsAddSuccess]: (_state, { payload }) => payload.list,
    [paymentsAddError]: (_state) => [],
    [paymentsGetRequest]: (_state) => [],
    [paymentsGetSuccess]: (_state, { payload }) => payload.list,
    [paymentsGetError]: (_state) => [],
    [paymentsDeleteRequest]: (_state) => [],
    [paymentsDeleteSuccess]: (_state, { payload }) => payload.list,
    [paymentsDeleteError]: (_state) => []
  },
  []
);
const total = handleActions(
  {
    [paymentsAddRequest]: (_state) => ({}),
    [paymentsAddSuccess]: (_state, { payload }) => payload.total,
    [paymentsAddError]: (_state) => ({}),
    [paymentsGetRequest]: (_state) => ({}),
    [paymentsGetSuccess]: (_state, { payload }) => payload.total,
    [paymentsGetError]: (_state) => ({}),
    [paymentsDeleteRequest]: (_state) => ({}),
    [paymentsDeleteSuccess]: (_state, { payload }) => payload.total,
    [paymentsDeleteError]: (_state) => ({})
  },
  {}
);
const query = handleActions(
  {
    [paymentsAddRequest]: (_state, { payload }) => payload,
    [paymentsAddSuccess]: (_state) => ({}),
    [paymentsAddError]: (_state) => ({}),
    [paymentsGetRequest]: (_state, { payload }) => payload,
    [paymentsGetSuccess]: (_state) => ({}),
    [paymentsGetError]: (_state) => ({}),
    [paymentsDeleteRequest]: (_state, { payload }) => payload,
    [paymentsDeleteSuccess]: (_state) => ({}),
    [paymentsDeleteError]: (_state) => ({})
  },
  {}
);

export const getPayments = ({ payments }) => payments;

export default combineReducers({ loading, error, list, query, total });
