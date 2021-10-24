import { takeLatest, call, put, select } from 'redux-saga/effects';

import { fetchPost } from '../api';
import {
  addPriceRequest,
  addPriceSuccess,
  addPriceError,
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

export function* pricesWatch() {
  yield takeLatest(addPriceRequest, addNewPrice);
}
