import { createActions } from 'redux-actions';

const {
  payments: {
    get: { request: paymentsGetRequest, success: paymentsGetSuccess, error: paymentsGetError },
    delete: {
      request: paymentsDeleteRequest,
      success: paymentsDeleteSuccess,
      error: paymentsDeleteError
    },
    add: { request: paymentsAddRequest, success: paymentsAddSuccess, error: paymentsAddError },
    sendBill: {
      request: paymentsSendBillRequest,
      success: paymentsSendBillSuccess,
      error: paymentsSendBillError
    }
  }
} = createActions({
  PAYMENTS: {
    GET: {
      REQUEST: null,
      SUCCESS: null,
      ERROR: null
    },
    DELETE: {
      REQUEST: null,
      SUCCESS: null,
      ERROR: null
    },
    ADD: {
      REQUEST: null,
      SUCCESS: null,
      ERROR: null
    },
    SEND_BILL: {
      REQUEST: null,
      SUCCESS: null,
      ERROR: null
    }
  }
});

export {
  paymentsGetRequest,
  paymentsGetSuccess,
  paymentsGetError,
  paymentsDeleteRequest,
  paymentsDeleteSuccess,
  paymentsDeleteError,
  paymentsAddRequest,
  paymentsAddSuccess,
  paymentsAddError,
  paymentsSendBillRequest,
  paymentsSendBillSuccess,
  paymentsSendBillError
};
