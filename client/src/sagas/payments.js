import { takeLatest, call, put, select } from 'redux-saga/effects';
import moment from 'moment';

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
  logoutFetchFromToken,
  paymentsSendBillRequest,
  paymentsSendBillSuccess,
  paymentsSendBillError
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

export function* sendBill() {
  try {
    const token = localStorage.getItem(storageName);
    const { query } = yield select(getPayments);
    const dateOrder = moment().format('DD.MM.YYYY HH:mm');
    const resultBill = yield call(fetchPost, `/api/send-bill`, { ...query, dateOrder }, token);

    yield put(paymentsSendBillSuccess(resultBill));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(paymentsSendBillError(error));
  }
}

export function* paymentsWatch() {
  yield takeLatest(paymentsAddRequest, addPayments);
  yield takeLatest(paymentsGetRequest, allPayments);
  yield takeLatest(paymentsDeleteRequest, deletePayments);
  yield takeLatest(paymentsSendBillRequest, sendBill);
}
