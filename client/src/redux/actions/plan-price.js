import { createActions } from 'redux-actions';

const {
  planPrice: {
    get: { request: getPlanPriceRequest, success: getPlanPriceSuccess, error: getPlanPriceError },
    add: { request: addPlanPriceRequest, success: addPlanPriceSuccess, error: addPlanPriceError },
    delete: {
      request: delPlanPriceRequest,
      success: delPlanPriceSuccess,
      error: delPlanPriceError
    },
    edit: {
      request: editPlanPriceRequest,
      success: editPlanPriceSuccess,
      error: editPlanPriceError
    }
  }
} = createActions({
  PLAN_PRICE: {
    GET: {
      REQUEST: null,
      SUCCESS: null,
      ERROR: null
    },
    ADD: {
      REQUEST: null,
      SUCCESS: null,
      ERROR: null
    },
    DELETE: {
      REQUEST: null,
      SUCCESS: null,
      ERROR: null
    },
    EDIT: {
      REQUEST: null,
      SUCCESS: null,
      ERROR: null
    }
  }
});

export {
  getPlanPriceRequest,
  getPlanPriceSuccess,
  getPlanPriceError,
  addPlanPriceRequest,
  addPlanPriceSuccess,
  addPlanPriceError,
  delPlanPriceRequest,
  delPlanPriceSuccess,
  delPlanPriceError,
  editPlanPriceRequest,
  editPlanPriceSuccess,
  editPlanPriceError
};
