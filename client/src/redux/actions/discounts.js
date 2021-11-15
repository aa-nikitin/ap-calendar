import { createActions } from 'redux-actions';

const {
  discounts: {
    get: { request: getDiscountsRequest, success: getDiscountsSuccess, error: getDiscountsError },
    add: { request: addDiscountsRequest, success: addDiscountsSuccess, error: addDiscountsError },
    delete: {
      request: deleteDiscountsRequest,
      success: deleteDiscountsSuccess,
      error: deleteDiscountsError
    },
    edit: {
      request: editDiscountsRequest,
      success: editDiscountsSuccess,
      error: editDiscountsError
    }
  }
} = createActions({
  DISCOUNTS: {
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
    EDIT: {
      REQUEST: null,
      SUCCESS: null,
      ERROR: null
    },
    DELETE: {
      REQUEST: null,
      SUCCESS: null,
      ERROR: null
    }
  }
});

export {
  getDiscountsRequest,
  getDiscountsSuccess,
  getDiscountsError,
  addDiscountsRequest,
  addDiscountsSuccess,
  addDiscountsError,
  deleteDiscountsRequest,
  deleteDiscountsSuccess,
  deleteDiscountsError,
  editDiscountsRequest,
  editDiscountsSuccess,
  editDiscountsError
};
