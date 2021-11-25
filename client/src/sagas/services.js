import { takeLatest, call, put, select } from 'redux-saga/effects';

import { fetchGet, fetchPost, fetchPut, fetchDelete } from '../api';
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
  logoutFetchFromToken
} from '../redux/actions';
import { getServices } from '../redux/reducers';
import { storageName } from '../config';

export function* getAllServices() {
  try {
    const token = localStorage.getItem(storageName);
    const services = yield call(fetchGet, '/api/services', token);

    yield put(getServicesSuccess(services));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(getServicesError, error);
  }
}

export function* addServices() {
  try {
    const token = localStorage.getItem(storageName);
    const { query } = yield select(getServices);
    const newPriceResult = yield call(fetchPost, '/api/services', query, token);

    yield put(addServicesSuccess(newPriceResult));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(addServicesError(error));
  }
}

export function* editServices() {
  try {
    const token = localStorage.getItem(storageName);
    const { query } = yield select(getServices);

    const deleteResult = yield call(fetchPut, `/api/services/${query.id}`, query.params, token);

    yield put(editServicesSuccess(deleteResult));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(editServicesError(error));
  }
}

export function* deleteServices() {
  try {
    const token = localStorage.getItem(storageName);
    const { query } = yield select(getServices);

    const deleteResult = yield call(fetchDelete, `/api/services/${query.id}`, {}, token);

    yield put(deleteServicesSuccess(deleteResult));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(deleteServicesError(error));
  }
}

export function* servicesWatch() {
  yield takeLatest(getServicesRequest, getAllServices);
  yield takeLatest(addServicesRequest, addServices);
  yield takeLatest(editServicesRequest, editServices);
  yield takeLatest(deleteServicesRequest, deleteServices);
}
