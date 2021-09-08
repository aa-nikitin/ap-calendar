import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';

import {
  clientFetchRequest,
  clientFetchSuccess,
  clientFetchError,
  clientChangeRequest,
  clientChangeSuccess,
  clientChangeError
} from '../actions';

const clientFetch = handleActions(
  {
    [clientFetchRequest]: (_state) => true,
    [clientFetchSuccess]: (_state) => false,
    [clientFetchError]: (_state) => false,
    [clientChangeRequest]: (_state) => true,
    [clientChangeSuccess]: (_state) => false,
    [clientChangeError]: (_state) => false
  },
  false
);
const client = handleActions(
  {
    [clientFetchRequest]: (_state) => {},
    [clientFetchSuccess]: (_state, { payload }) => payload,
    [clientFetchError]: (_state) => {},
    [clientChangeRequest]: (_state, { payload }) => {
      const { firstName, lastName, ...info } = payload.data;
      return { name: { first: firstName, last: lastName }, ...info };
    },
    [clientChangeSuccess]: (_state, { payload }) => payload,
    [clientChangeError]: (_state) => {}
  },
  {}
);
const error = handleActions(
  {
    [clientFetchRequest]: (_state) => null,
    [clientFetchSuccess]: (_state) => null,
    [clientFetchError]: (_state, { payload }) => payload,
    [clientChangeRequest]: (_state) => null,
    [clientChangeSuccess]: (_state) => null,
    [clientChangeError]: (_state, { payload }) => payload
  },
  null
);
const clientId = handleActions(
  {
    [clientFetchRequest]: (_state, { payload }) => payload,
    [clientFetchSuccess]: (_state) => '',
    [clientFetchError]: (_state) => '',
    [clientChangeRequest]: (_state, { payload }) => payload.id,
    [clientChangeSuccess]: (_state) => '',
    [clientChangeError]: (_state) => ''
  },
  ''
);

export const getClient = ({ client }) => client;

export default combineReducers({ clientFetch, client, error, clientId });
