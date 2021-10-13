import { takeLatest, call, put, select } from 'redux-saga/effects';

import { fetchDelete, fetchPost } from '../api';
import {
  clientsFetchRequest,
  clientsFetchSuccess,
  clientsFetchError,
  clientsSelectionDelRequest,
  clientsSelectionDelSuccess,
  clientsSelectionDelError,
  clientsAddRequest,
  clientsAddSuccess,
  clientsAddError,
  logoutFetchFromToken
} from '../redux/actions';
import { getClients } from '../redux/reducers';
import { storageName } from '../config';

export function* getClientsList() {
  try {
    const token = localStorage.getItem(storageName);
    const { query } = yield select(getClients);
    const clientsResult = yield call(fetchPost, '/api/clients/', { query }, token);

    yield put(clientsFetchSuccess(clientsResult));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(clientsFetchError(error));
  }
}

export function* deleteClients() {
  try {
    const token = localStorage.getItem(storageName);
    const { clientsCheckList } = yield select(getClients);
    const clientsResult = yield call(fetchDelete, '/api/clients', clientsCheckList, token);

    yield put(clientsSelectionDelSuccess(clientsResult));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(clientsSelectionDelError(error));
  }
}
export function* addClient() {
  try {
    const token = localStorage.getItem(storageName);
    const { newClient } = yield select(getClients);
    const clientResult = yield call(fetchPost, '/api/client/', newClient, token);

    yield put(clientsAddSuccess(clientResult));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(clientsAddError(error));
  }
}

export function* clientsWatch() {
  yield takeLatest(clientsFetchRequest, getClientsList);
  yield takeLatest(clientsSelectionDelRequest, deleteClients);
  yield takeLatest(clientsAddRequest, addClient);
}
