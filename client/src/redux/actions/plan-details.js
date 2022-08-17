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
  },
  planInfo: {
    changeRecalc: {
      request: changeRecalcPlanInfoRequest,
      success: changeRecalcPlanInfoSuccess,
      error: changeRecalcPlanInfoError
    },
    changeFixed: {
      request: changeFixedPlanInfoRequest,
      success: changeFixedPlanInfoSuccess,
      error: changeFixedPlanInfoError
    }
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
  },
  PLAN_INFO: {
    CHANGE_RECALC: {
      REQUEST: null,
      SUCCESS: null,
      ERROR: null
    },
    CHANGE_FIXED: {
      REQUEST: null,
      SUCCESS: null,
      ERROR: null
    }
  }
});
// , changeRecalc: changePriceInfoRecalc
export {
  getPlanDetailsRequest,
  getPlanDetailsSuccess,
  getPlanDetailsError,
  setPlanDetailsVisible,
  getRefreshDetailsRequest,
  getRefreshDetailsSuccess,
  getRefreshDetailsError,
  changeRecalcPlanInfoRequest,
  changeRecalcPlanInfoSuccess,
  changeRecalcPlanInfoError,
  changeFixedPlanInfoRequest,
  changeFixedPlanInfoSuccess,
  changeFixedPlanInfoError
};
