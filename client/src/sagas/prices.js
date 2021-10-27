import { takeLatest, call, put, select } from 'redux-saga/effects';

import { fetchPost, fetchDelete, fetchPut } from '../api';
import {
  addPriceRequest,
  addPriceSuccess,
  addPriceError,
  deletePriceRequest,
  deletePriceSuccess,
  deletePriceError,
  editPriceRequest,
  editPriceSuccess,
  editPriceError,
  copyPricesRequest,
  copyPricesSuccess,
  copyPricesError,
  delAllPricesRequest,
  delAllPricesSuccess,
  delAllPricesError,
  logoutFetchFromToken
} from '../redux/actions';
import { getPrices } from '../redux/reducers';
import { storageName } from '../config';

export function* addNewPrice() {
  try {
    const token = localStorage.getItem(storageName);
    const { query } = yield select(getPrices);
    const newPriceResult = yield call(fetchPost, '/api/price', query, token);

    yield put(addPriceSuccess(newPriceResult));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(addPriceError(error));
  }
}

export function* deletePrice() {
  try {
    const token = localStorage.getItem(storageName);
    const { query } = yield select(getPrices);
    const deleteResult = yield call(fetchDelete, `/api/price/${query.id}`, {}, token);

    yield put(deletePriceSuccess(deleteResult));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(deletePriceError(error));
  }
}

export function* editPrice() {
  try {
    const token = localStorage.getItem(storageName);
    const { query } = yield select(getPrices);
    const deleteResult = yield call(fetchPut, `/api/price/${query.id}`, query.list, token);

    yield put(editPriceSuccess(deleteResult));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(editPriceError(error));
  }
}

export function* copyPrices() {
  try {
    const token = localStorage.getItem(storageName);
    const { query } = yield select(getPrices);
    const copyResult = yield call(fetchPost, `/api/prices`, query, token);

    yield put(copyPricesSuccess(copyResult));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(copyPricesError(error));
  }
}

export function* delAllPrices() {
  try {
    const token = localStorage.getItem(storageName);
    const { query } = yield select(getPrices);
    const delResult = yield call(fetchDelete, `/api/prices`, query, token);

    yield put(delAllPricesSuccess(delResult));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(delAllPricesError(error));
  }
}

export function* pricesWatch() {
  yield takeLatest(addPriceRequest, addNewPrice);
  yield takeLatest(deletePriceRequest, deletePrice);
  yield takeLatest(editPriceRequest, editPrice);
  yield takeLatest(copyPricesRequest, copyPrices);
  yield takeLatest(delAllPricesRequest, delAllPrices);
}
