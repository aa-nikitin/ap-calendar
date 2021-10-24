import { createActions } from 'redux-actions';

const {
  addPrice: { request: addPriceRequest, success: addPriceSuccess, error: addPriceError }
} = createActions({
  ADD_PRICE: {
    REQUEST: null,
    SUCCESS: null,
    ERROR: null
  }
});

export { addPriceRequest, addPriceSuccess, addPriceError };
