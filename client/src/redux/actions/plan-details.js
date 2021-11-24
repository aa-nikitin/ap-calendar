import { createActions } from 'redux-actions';

const {
  plan: {
    get: {
      request: getPlanDetailsRequest,
      success: getPlanDetailsSuccess,
      error: getPlanDetailsError
    },
    setVisible: setPlanDetailsVisible
  }
} = createActions({
  PLAN: {
    GET: {
      REQUEST: null,
      SUCCESS: null,
      ERROR: null
    },
    SET_VISIBLE: null
  }
});

export { getPlanDetailsRequest, getPlanDetailsSuccess, getPlanDetailsError, setPlanDetailsVisible };
