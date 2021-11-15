import { takeLatest, call, put, select } from 'redux-saga/effects';

import { fetchGet, fetchPost, fetchPut, fetchDelete } from '../api';
import {
  getDiscountsRequest,
  getDiscountsSuccess,
  getDiscountsError,
  addDiscountsRequest,
  addDiscountsSuccess,
  addDiscountsError,
  editDiscountsRequest,
  editDiscountsSuccess,
  editDiscountsError,
  deleteDiscountsRequest,
  deleteDiscountsSuccess,
  deleteDiscountsError,
  logoutFetchFromToken
} from '../redux/actions';
import { getDiscounts } from '../redux/reducers';
import { storageName } from '../config';

export function* getAllDiscounts() {
  try {
    const token = localStorage.getItem(storageName);
    const discounts = yield call(fetchGet, '/api/discounts', token);

    yield put(getDiscountsSuccess(discounts));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(getDiscountsError, error);
  }
}

export function* addDiscount() {
  try {
    const token = localStorage.getItem(storageName);
    const { query } = yield select(getDiscounts);
    const newPriceResult = yield call(fetchPost, '/api/discounts', query, token);

    yield put(addDiscountsSuccess(newPriceResult));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(addDiscountsError(error));
  }
}

export function* editDiscount() {
  try {
    const token = localStorage.getItem(storageName);
    const { query } = yield select(getDiscounts);

    const deleteResult = yield call(fetchPut, `/api/discounts/${query.id}`, query.list, token);

    yield put(editDiscountsSuccess(deleteResult));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(editDiscountsError(error));
  }
}

export function* deleteDiscount() {
  try {
    const token = localStorage.getItem(storageName);
    const { query } = yield select(getDiscounts);

    const deleteResult = yield call(fetchDelete, `/api/discounts/${query}`, {}, token);

    yield put(deleteDiscountsSuccess(deleteResult));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(deleteDiscountsError(error));
  }
}

export function* discountsWatch() {
  yield takeLatest(getDiscountsRequest, getAllDiscounts);
  yield takeLatest(addDiscountsRequest, addDiscount);
  yield takeLatest(editDiscountsRequest, editDiscount);
  yield takeLatest(deleteDiscountsRequest, deleteDiscount);
}
