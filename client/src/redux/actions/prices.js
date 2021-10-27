import { createActions } from 'redux-actions';

const {
  price: {
    add: { request: addPriceRequest, success: addPriceSuccess, error: addPriceError },
    delete: { request: deletePriceRequest, success: deletePriceSuccess, error: deletePriceError },
    edit: { request: editPriceRequest, success: editPriceSuccess, error: editPriceError },
    copy: { request: copyPricesRequest, success: copyPricesSuccess, error: copyPricesError },
    delAll: { request: delAllPricesRequest, success: delAllPricesSuccess, error: delAllPricesError }
  },
  setPrices
} = createActions({
  PRICE: {
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
    },
    COPY: {
      REQUEST: null,
      SUCCESS: null,
      ERROR: null
    },
    DEL_ALL: {
      REQUEST: null,
      SUCCESS: null,
      ERROR: null
    }
  },
  SET_PRICES: null
});

export {
  addPriceRequest,
  addPriceSuccess,
  addPriceError,
  deletePriceRequest,
  deletePriceSuccess,
  deletePriceError,
  editPriceRequest,
  editPriceSuccess,
  editPriceError,
  copyPricesRequest,
  copyPricesSuccess,
  copyPricesError,
  delAllPricesRequest,
  delAllPricesSuccess,
  delAllPricesError,
  setPrices
};
