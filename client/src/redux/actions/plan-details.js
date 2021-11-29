import { createActions } from 'redux-actions';

const {
  plan: {
    get: {
      request: getPlanDetailsRequest,
      success: getPlanDetailsSuccess,
      error: getPlanDetailsError
    },
    refresh: {
      request: getRefreshDetailsRequest,
      success: getRefreshDetailsSuccess,
      error: getRefreshDetailsError
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
    REFRESH: {
      REQUEST: null,
      SUCCESS: null,
      ERROR: null
    },
    SET_VISIBLE: null
  }
});

export {
  getPlanDetailsRequest,
  getPlanDetailsSuccess,
  getPlanDetailsError,
  setPlanDetailsVisible,
  getRefreshDetailsRequest,
  getRefreshDetailsSuccess,
  getRefreshDetailsError
};
