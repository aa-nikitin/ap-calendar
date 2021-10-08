import { createActions } from 'redux-actions';

const {
  planHalls: { request: planHallsRequest, success: planHallsSuccess, error: planHallsError },
  planParams: {
    activeHall: setActiveParamHall,
    stepHall: setStepParamHall,
    countHall: setCountParamHall
  },
  planData: { request: planDataRequest, success: planDataSuccess, error: planDataError },
  planFetch: {
    add: { request: planFetchAddRequest, success: planFetchAddSuccess, error: planFetchAddError },
    delete: {
      request: planFetchDeleteRequest,
      success: planFetchDeleteSuccess,
      error: planFetchDeleteError
    }
  }
} = createActions({
  PLAN_HALLS: {
    REQUEST: null,
    SUCCESS: null,
    ERROR: null
  },
  PLAN_PARAMS: {
    ACTIVE_HALL: null,
    STEP_HALL: null,
    COUNT_HALL: null
  },
  PLAN_DATA: {
    REQUEST: null,
    SUCCESS: null,
    ERROR: null
  },
  PLAN_FETCH: {
    ADD: { REQUEST: null, SUCCESS: null, ERROR: null },
    DELETE: { REQUEST: null, SUCCESS: null, ERROR: null }
  }
});

export {
  planHallsRequest,
  planHallsSuccess,
  planHallsError,
  setActiveParamHall,
  setStepParamHall,
  setCountParamHall,
  planDataRequest,
  planDataSuccess,
  planDataError,
  planFetchAddRequest,
  planFetchAddSuccess,
  planFetchAddError,
  planFetchDeleteRequest,
  planFetchDeleteSuccess,
  planFetchDeleteError
};
