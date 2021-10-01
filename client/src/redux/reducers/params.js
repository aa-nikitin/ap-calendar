import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';

import { setWindowSize, setPageTplName } from '../actions';

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

export const getParams = ({ params }) => params;

export default combineReducers({ sizeWindow, pageTplName });
