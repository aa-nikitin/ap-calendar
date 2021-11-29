import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';

import {
  getPlanDetailsRequest,
  getPlanDetailsSuccess,
  getPlanDetailsError,
  setPlanDetailsVisible,
  getRefreshDetailsRequest,
  getRefreshDetailsSuccess,
  getRefreshDetailsError
} from '../actions';

const loading = handleActions(
  {
    [getPlanDetailsRequest]: (_state) => true,
    [getPlanDetailsSuccess]: (_state) => false,
    [getPlanDetailsError]: (_state) => false,
    [getRefreshDetailsRequest]: (_state) => true,
    [getRefreshDetailsSuccess]: (_state) => false,
    [getRefreshDetailsError]: (_state) => false
  },
  false
);
const error = handleActions(
  {
    [getPlanDetailsRequest]: (_state) => null,
    [getPlanDetailsSuccess]: (_state) => null,
    [getPlanDetailsError]: (_state, { payload }) => payload,
    [getRefreshDetailsRequest]: (_state) => null,
    [getRefreshDetailsSuccess]: (_state) => null,
    [getRefreshDetailsError]: (_state, { payload }) => payload
  },
  null
);
const details = handleActions(
  {
    [getPlanDetailsRequest]: (_state) => [],
    [getPlanDetailsSuccess]: (_state, { payload }) => payload,
    [getPlanDetailsError]: (_state) => [],
    [getRefreshDetailsRequest]: (_state) => [],
    [getRefreshDetailsSuccess]: (_state, { payload }) => payload,
    [getRefreshDetailsError]: (_state) => []
  },
  []
);
const query = handleActions(
  {
    [getPlanDetailsRequest]: (_state, { payload }) => payload,
    [getPlanDetailsSuccess]: (_state) => ({}),
    [getPlanDetailsError]: (_state) => ({}),
    [getRefreshDetailsRequest]: (_state, { payload }) => payload,
    [getRefreshDetailsSuccess]: (_state) => ({}),
    [getRefreshDetailsError]: (_state) => ({})
  },
  {}
);
const isVisible = handleActions(
  {
    [getPlanDetailsRequest]: (_state) => true,
    [setPlanDetailsVisible]: (_state, { payload }) => payload
  },
  false
);

export const getPlanDetails = ({ planDetails }) => planDetails;
export const getDetailsOrder = ({ planDetails }) => planDetails.details;

export default combineReducers({ loading, error, details, query, isVisible });
