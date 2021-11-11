import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';

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
export const getPriceParams = ({ params }) => params.priceParams;

export default combineReducers({ sizeWindow, pageTplName, priceParams });
