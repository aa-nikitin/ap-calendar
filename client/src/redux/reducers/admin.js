import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';

import {
  loginFetchRequest,
  loginFetchSuccess,
  loginFetchError,
  loginFetchFromToken,
  logoutFetchFromToken
} from '../actions';

const loginFetch = handleActions(
  {
    [loginFetchRequest]: (_state) => true,
    [loginFetchSuccess]: (_state) => false,
    [loginFetchError]: (_state) => false,
    [loginFetchFromToken]: (_state) => true,
    [logoutFetchFromToken]: (_state) => false
  },
  false
);
const login = handleActions(
  {
    [loginFetchRequest]: (_state, { payload }) => payload.login,
    [loginFetchSuccess]: (_state) => '',
    [loginFetchError]: (_state) => '',
    [loginFetchFromToken]: (_state) => '',
    [logoutFetchFromToken]: (_state) => ''
  },
  ''
);
const pass = handleActions(
  {
    [loginFetchRequest]: (_state, { payload }) => payload.pass,
    [loginFetchSuccess]: (_state) => '',
    [loginFetchError]: (_state) => '',
    [loginFetchFromToken]: (_state) => '',
    [logoutFetchFromToken]: (_state) => ''
  },
  ''
);
const resultFetch = handleActions(
  {
    [loginFetchRequest]: (_state) => ({}),
    [loginFetchSuccess]: (_state, { payload }) => payload,
    [loginFetchError]: (_state, { payload }) => payload,
    [loginFetchFromToken]: (_state) => ({}),
    [logoutFetchFromToken]: (_state) => ({})
  },
  {}
);
const loginCheck = handleActions(
  {
    [loginFetchRequest]: (_state) => false,
    [loginFetchSuccess]: (_state) => true,
    [loginFetchError]: (_state) => false,
    [loginFetchFromToken]: (_state) => false,
    [logoutFetchFromToken]: (_state) => false
  },
  false
);

export const getLogin = ({ admin }) => admin;

export default combineReducers({ loginFetch, login, pass, resultFetch, loginCheck });
