import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';

import {
  getServicesRequest,
  getServicesSuccess,
  getServicesError,
  addServicesRequest,
  addServicesSuccess,
  addServicesError,
  editServicesRequest,
  editServicesSuccess,
  editServicesError,
  deleteServicesRequest,
  deleteServicesSuccess,
  deleteServicesError,
  setServices
} from '../actions';

const loading = handleActions(
  {
    [getServicesRequest]: (_state) => true,
    [getServicesSuccess]: (_state) => false,
    [getServicesError]: (_state) => false,
    [addServicesRequest]: (_state) => true,
    [addServicesSuccess]: (_state) => false,
    [addServicesError]: (_state) => false,
    [editServicesRequest]: (_state) => true,
    [editServicesSuccess]: (_state) => false,
    [editServicesError]: (_state) => false,
    [deleteServicesRequest]: (_state) => true,
    [deleteServicesSuccess]: (_state) => false,
    [deleteServicesError]: (_state) => false
  },
  false
);
const error = handleActions(
  {
    [getServicesRequest]: (_state) => null,
    [getServicesSuccess]: (_state) => null,
    [getServicesError]: (_state, { payload }) => payload,
    [addServicesRequest]: (_state) => null,
    [addServicesSuccess]: (_state) => null,
    [addServicesError]: (_state, { payload }) => payload,
    [editServicesRequest]: (_state) => null,
    [editServicesSuccess]: (_state) => null,
    [editServicesError]: (_state, { payload }) => payload,
    [deleteServicesRequest]: (_state) => null,
    [deleteServicesSuccess]: (_state) => null,
    [deleteServicesError]: (_state, { payload }) => payload
  },
  null
);
const list = handleActions(
  {
    [getServicesRequest]: (_state) => [],
    [getServicesSuccess]: (_state, { payload }) => payload,
    [getServicesError]: (_state) => [],
    [addServicesRequest]: (_state) => [],
    [addServicesSuccess]: (_state, { payload }) => payload,
    [addServicesError]: (_state) => [],
    [editServicesRequest]: (_state) => [],
    [editServicesSuccess]: (_state, { payload }) => payload,
    [editServicesError]: (_state) => [],
    [deleteServicesRequest]: (_state) => [],
    [deleteServicesSuccess]: (_state, { payload }) => payload,
    [deleteServicesError]: (_state) => [],
    [setServices]: (_state, { payload }) => payload
  },
  []
);
const query = handleActions(
  {
    [addServicesRequest]: (_state, { payload }) => payload,
    [addServicesSuccess]: (_state) => ({}),
    [addServicesError]: (_state) => ({}),
    [editServicesRequest]: (_state, { payload }) => payload,
    [editServicesSuccess]: (_state) => ({}),
    [editServicesError]: (_state) => ({}),
    [deleteServicesRequest]: (_state, { payload }) => payload,
    [deleteServicesSuccess]: (_state) => ({}),
    [deleteServicesError]: (_state) => ({})
  },
  {}
);

export const getServices = ({ services }) => services;

export default combineReducers({ loading, error, list, query });
