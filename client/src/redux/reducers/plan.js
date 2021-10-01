import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';

import {
  setActiveParamHall,
  setStepParamHall,
  setCountParamHall,
  planHallsRequest,
  planHallsSuccess,
  planHallsError
} from '../actions';

const plan = handleActions(
  {
    [planHallsRequest]: (_state) => [],
    [planHallsSuccess]: (_state, { payload }) => payload,
    [planHallsError]: (_state) => []
  },
  []
);
const planFetch = handleActions(
  {
    [planHallsRequest]: (_state) => true,
    [planHallsSuccess]: (_state) => false,
    [planHallsError]: (_state) => false
  },
  false
);
const error = handleActions(
  {
    [planHallsRequest]: (_state) => null,
    [planHallsSuccess]: (_state) => null,
    [planHallsError]: (_state, { payload }) => payload
  },
  null
);
const datePlanHalls = handleActions(
  {
    [planHallsRequest]: (_state, { payload }) => payload,
    [planHallsSuccess]: (_state) => '',
    [planHallsError]: (_state) => ''
  },
  ''
);

const params = handleActions(
  {
    [setActiveParamHall]: (state, { payload }) => ({ ...state, activeHall: payload }),
    [setStepParamHall]: (state, { payload }) => ({ ...state, stepHall: payload }),
    [setCountParamHall]: (state, { payload }) => ({ ...state, countHall: payload })
  },
  { activeHall: 0, stepHall: 1, countHall: 4 }
);

export const getPlan = ({ plan }) => plan;

export default combineReducers({ params, plan, datePlanHalls, planFetch, error });
