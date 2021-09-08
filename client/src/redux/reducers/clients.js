import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';

import {
  clientsFetchRequest,
  clientsFetchSuccess,
  clientsFetchError,
  clientsSelectionCheck,
  clientsSelectionDelRequest,
  clientsSelectionDelSuccess,
  clientsSelectionDelError,
  clientsAddRequest,
  clientsAddSuccess,
  clientsAddError
} from '../actions';

const clientsFetch = handleActions(
  {
    [clientsFetchRequest]: (_state) => true,
    [clientsFetchSuccess]: (_state) => false,
    [clientsFetchError]: (_state) => false,
    [clientsSelectionDelRequest]: (_state) => true,
    [clientsSelectionDelSuccess]: (_state) => false,
    [clientsSelectionDelError]: (_state) => false,
    [clientsAddRequest]: (_state) => true,
    [clientsAddSuccess]: (_state) => false,
    [clientsAddError]: (_state) => false
  },
  false
);
const clients = handleActions(
  {
    [clientsFetchRequest]: (_state) => [],
    [clientsFetchSuccess]: (_state, { payload }) => payload,
    [clientsFetchError]: (_state) => [],
    [clientsSelectionDelSuccess]: (_state, { payload }) => payload,
    [clientsAddSuccess]: (_state, { payload }) => payload
  },
  []
);
const error = handleActions(
  {
    [clientsFetchRequest]: (_state) => null,
    [clientsFetchSuccess]: (_state) => null,
    [clientsFetchError]: (_state, { payload }) => payload,
    [clientsSelectionDelRequest]: (_state) => null,
    [clientsSelectionDelSuccess]: (_state) => null,
    [clientsSelectionDelError]: (_state, { payload }) => payload,
    [clientsAddRequest]: (_state) => null,
    [clientsAddSuccess]: (_state) => null,
    [clientsAddError]: (_state, { payload }) => payload
  },
  null
);

const clientsCheckList = handleActions(
  {
    [clientsSelectionCheck]: (_state, { payload }) => payload,
    [clientsSelectionDelSuccess]: (_state) => [],
    [clientsSelectionDelError]: (_state) => [],
    [clientsFetchSuccess]: (_state) => [],
    [clientsFetchError]: (_state) => []
  },
  []
);

const newClient = handleActions(
  {
    [clientsAddRequest]: (_state, { payload }) => {
      const { firstName, lastName, ...info } = payload;
      return { name: { first: firstName, last: lastName }, ...info };
    },
    [clientsAddSuccess]: (_state) => {},
    [clientsAddError]: (_state) => {}
  },
  {}
);

export const getClients = ({ clients }) => clients;

export default combineReducers({ clientsFetch, clients, error, clientsCheckList, newClient });
