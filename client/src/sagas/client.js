import { takeLatest, call, put, select } from 'redux-saga/effects';

import { fetchGet, fetchPut } from '../api';
import {
  clientFetchRequest,
  clientFetchSuccess,
  clientFetchError,
  clientChangeRequest,
  clientChangeSuccess,
  clientChangeError,
  logoutFetchFromToken
} from '../redux/actions';
import { getClient } from '../redux/reducers';
import { storageName } from '../config';

export function* getClientDetail() {
  try {
    const token = localStorage.getItem(storageName);
    const { clientId } = yield select(getClient);
    const clientResult = yield call(fetchGet, `/api/client/${clientId}`, token);

    yield put(clientFetchSuccess(clientResult));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(clientFetchError(error));
  }
}

export function* changeClient() {
  try {
    const token = localStorage.getItem(storageName);
    const { clientId, client } = yield select(getClient);
    const clientResult = yield call(fetchPut, `/api/client/${clientId}`, client, token);

    yield put(clientChangeSuccess(clientResult));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(clientChangeError(error));
  }
}

export function* clientWatch() {
  yield takeLatest(clientFetchRequest, getClientDetail);
  yield takeLatest(clientChangeRequest, changeClient);
}
