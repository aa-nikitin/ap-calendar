import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import { createSelector } from 'reselect';

import { setWindowSize, setPageTplName, setPriceParams } from '../actions';

const sizeWindow = handleActions(
  {
    [setWindowSize]: (_state, { payload }) => payload
  },
  {}
);
const pageTplName = handleActions(
  {
    [setPageTplName]: (_state, { payload }) => payload
  },
  ''
);
const priceParams = handleActions(
  {
    [setPriceParams]: (_state, { payload }) => payload
  },
  {}
);

export const getParams = ({ params }) => params;
export const getParamsHalls = ({ params }) => params.priceParams.hallsArr;
export const getPriceParams = ({ params }) => params.priceParams;
export const getPaymentMethodObj = createSelector(
  (state) => state.params.priceParams.paymentMethodArr,
  (paymentMethods) =>
    paymentMethods.reduce((newObj, item) => {
      newObj[item['value']] = item;
      return newObj;
    }, {})
);

export default combineReducers({ sizeWindow, pageTplName, priceParams });
