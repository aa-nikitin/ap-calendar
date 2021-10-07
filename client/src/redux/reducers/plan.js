import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';

import {
  setActiveParamHall,
  setStepParamHall,
  setCountParamHall,
  planHallsRequest,
  planHallsSuccess,
  planHallsError,
  planDataRequest,
  planDataSuccess,
  planDataError,
  planFetchAddRequest,
  planFetchAddSuccess,
  planFetchAddError,
  planFetchEditEequest,
  planFetchEditSuccess,
  planFetchEditError,
  planFetchDeleteEequest,
  planFetchDeleteSuccess,
  planFetchDeleteError
} from '../actions';

const plan = handleActions(
  {
    [planHallsRequest]: (_state) => [],
    [planHallsSuccess]: (_state, { payload }) => payload,
    [planHallsError]: (_state) => [],
    [planFetchAddRequest]: (_state) => [],
    [planFetchAddSuccess]: (_state, { payload }) => payload,
    [planFetchAddError]: (_state) => []
  },
  []
);
const planFetch = handleActions(
  {
    [planHallsRequest]: (_state) => true,
    [planHallsSuccess]: (_state) => false,
    [planHallsError]: (_state) => false,
    [planFetchAddRequest]: (_state) => true,
    [planFetchAddSuccess]: (_state) => false,
    [planFetchAddError]: (_state) => false
  },
  false
);
const planPopupFetch = handleActions(
  {
    [planDataRequest]: (_state) => true,
    [planDataSuccess]: (_state) => false,
    [planDataError]: (_state) => false
  },
  false
);
const error = handleActions(
  {
    [planHallsRequest]: (_state) => null,
    [planHallsSuccess]: (_state) => null,
    [planHallsError]: (_state, { payload }) => payload,
    [planDataRequest]: (_state) => null,
    [planDataSuccess]: (_state) => null,
    [planDataError]: (_state, { payload }) => payload,
    [planFetchAddRequest]: (_state) => null,
    [planFetchAddSuccess]: (_state) => null,
    [planFetchAddError]: (_state, { payload }) => payload
  },
  null
);
const dataPlan = handleActions(
  {
    [planDataRequest]: (_state, { payload }) => payload,
    [planDataSuccess]: (_state) => {},
    [planDataError]: (_state) => {},
    [planFetchAddRequest]: (_state, { payload }) => payload,
    [planFetchAddSuccess]: (_state) => {},
    [planFetchAddError]: (_state) => {}
  },
  {}
);
const availableDataPlan = handleActions(
  {
    [planDataRequest]: (_state) => {},
    [planDataSuccess]: (_state, { payload }) => payload,
    [planDataError]: (_state) => {}
  },
  {}
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

export default combineReducers({
  params,
  plan,
  datePlanHalls,
  planFetch,
  error,
  dataPlan,
  planPopupFetch,
  availableDataPlan
});
