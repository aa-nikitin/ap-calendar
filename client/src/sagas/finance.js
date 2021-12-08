import { takeLatest, call, put, select } from 'redux-saga/effects';

import { fetchPost } from '../api';
import {
  financeGetRequest,
  financeGetSuccess,
  financeGetError,
  logoutFetchFromToken
} from '../redux/actions';
import { getFinance } from '../redux/reducers';
import { storageName } from '../config';

export function* getFinanceAll() {
  try {
    const token = localStorage.getItem(storageName);
    const { query } = yield select(getFinance);
    const finance = yield call(fetchPost, '/api/finance', query, token);
    // const totalPayments = yield call(fetchGet, `/api/payments-total/${query.idPlan}`, {}, token);

    yield put(financeGetSuccess({ list: finance.paymentPlan, total: finance.total }));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(financeGetError(error));
  }
}

export function* financeWatch() {
  yield takeLatest(financeGetRequest, getFinanceAll);
}
