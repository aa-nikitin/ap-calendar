import { takeLatest, call, put, select } from 'redux-saga/effects';

import { fetchGet, fetchPost, fetchDelete } from '../api';
import {
  paymentsGetRequest,
  paymentsGetSuccess,
  paymentsGetError,
  paymentsDeleteRequest,
  paymentsDeleteSuccess,
  paymentsDeleteError,
  paymentsAddRequest,
  paymentsAddSuccess,
  paymentsAddError,
  logoutFetchFromToken
} from '../redux/actions';
import { getPayments } from '../redux/reducers';
import { storageName } from '../config';

export function* addPayments() {
  try {
    const token = localStorage.getItem(storageName);
    const { query } = yield select(getPayments);
    const payments = yield call(fetchPost, '/api/payments', query, token);
    const totalPayments = yield call(fetchGet, `/api/payments-total/${query.idPlan}`, {}, token);

    yield put(paymentsAddSuccess({ list: payments, total: totalPayments }));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(paymentsAddError(error));
  }
}

export function* allPayments() {
  try {
    const token = localStorage.getItem(storageName);
    const { query } = yield select(getPayments);

    const payments = yield call(fetchGet, `/api/payments/${query.id}`, {}, token);
    const totalPayments = yield call(fetchGet, `/api/payments-total/${query.id}`, {}, token);

    yield put(paymentsGetSuccess({ list: payments, total: totalPayments }));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(paymentsGetError(error));
  }
}

export function* deletePayments() {
  try {
    const token = localStorage.getItem(storageName);
    const { query } = yield select(getPayments);

    yield call(fetchDelete, `/api/payments/${query.id}`, {}, token);

    const payments = yield call(fetchGet, `/api/payments/${query.idPlan}`, {}, token);
    const totalPayments = yield call(fetchGet, `/api/payments-total/${query.idPlan}`, {}, token);

    yield put(paymentsDeleteSuccess({ list: payments, total: totalPayments }));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(paymentsDeleteError(error));
  }
}

export function* paymentsWatch() {
  yield takeLatest(paymentsAddRequest, addPayments);
  yield takeLatest(paymentsGetRequest, allPayments);
  yield takeLatest(paymentsDeleteRequest, deletePayments);
}
