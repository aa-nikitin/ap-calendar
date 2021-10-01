import { createActions } from 'redux-actions';

const {
  planHalls: { request: planHallsRequest, success: planHallsSuccess, error: planHallsError },
  planParams: {
    activeHall: setActiveParamHall,
    stepHall: setStepParamHall,
    countHall: setCountParamHall
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
  }
});

export {
  planHallsRequest,
  planHallsSuccess,
  planHallsError,
  setActiveParamHall,
  setStepParamHall,
  setCountParamHall
};
