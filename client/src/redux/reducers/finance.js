import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';

import { financeGetRequest, financeGetSuccess, financeGetError } from '../actions';

const loading = handleActions(
  {
    [financeGetRequest]: (_state) => true,
    [financeGetSuccess]: (_state) => false,
    [financeGetError]: (_state) => false
  },
  false
);
const error = handleActions(
  {
    [financeGetRequest]: (_state) => null,
    [financeGetSuccess]: (_state) => null,
    [financeGetError]: (_state, { payload }) => payload
  },
  null
);
const list = handleActions(
  {
    [financeGetRequest]: (_state) => [],
    [financeGetSuccess]: (_state, { payload }) => payload.list,
    [financeGetError]: (_state) => []
  },
  []
);
const total = handleActions(
  {
    [financeGetRequest]: (_state) => ({}),
    [financeGetSuccess]: (_state, { payload }) => payload.total,
    [financeGetError]: (_state) => ({})
  },
  {}
);
const query = handleActions(
  {
    [financeGetRequest]: (_state, { payload }) => payload,
    [financeGetSuccess]: (_state) => ({}),
    [financeGetError]: (_state) => ({})
  },
  {}
);

export const getFinance = ({ finance }) => finance;

export default combineReducers({ loading, error, list, query, total });
