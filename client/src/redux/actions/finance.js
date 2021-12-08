import { createActions } from 'redux-actions';

const {
  finance: {
    get: { request: financeGetRequest, success: financeGetSuccess, error: financeGetError }
  }
} = createActions({
  FINANCE: {
    GET: {
      REQUEST: null,
      SUCCESS: null,
      ERROR: null
    }
  }
});

export { financeGetRequest, financeGetSuccess, financeGetError };
