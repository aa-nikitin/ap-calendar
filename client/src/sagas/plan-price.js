import { takeLatest, call, put, select } from 'redux-saga/effects';

import { fetchPost, fetchDelete, fetchPut } from '../api';
import {
  addPlanPriceRequest,
  addPlanPriceSuccess,
  addPlanPriceError,
  delPlanPriceRequest,
  delPlanPriceSuccess,
  delPlanPriceError,
  editPlanPriceRequest,
  editPlanPriceSuccess,
  editPlanPriceError,
  logoutFetchFromToken
} from '../redux/actions';
import { storageName } from '../config';
import { getPlanPrice } from '../redux/reducers';

export function* addPlanPrice() {
  try {
    // console.log('planPrice');
    const token = localStorage.getItem(storageName);
    const { query } = yield select(getPlanPrice);
    const planPrice = yield call(fetchPost, `/api/plan-price/`, query, token);
    // console.log(planPrice);

    yield put(addPlanPriceSuccess(planPrice));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(addPlanPriceError, error);
  }
}

export function* delPlanPrice() {
  try {
    // console.log('planPrice');
    const token = localStorage.getItem(storageName);
    const { query } = yield select(getPlanPrice);
    const planPrice = yield call(fetchDelete, `/api/plan-price/${query.id}`, {}, token);
    // console.log(planPrice);

    yield put(delPlanPriceSuccess(planPrice));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(delPlanPriceError, error);
  }
}

export function* editPlanPrice() {
  try {
    // console.log('planPrice');
    const token = localStorage.getItem(storageName);
    const { query } = yield select(getPlanPrice);
    const planPrice = yield call(fetchPut, `/api/plan-price/${query.id}`, query, token);
    // console.log(planPrice);

    yield put(editPlanPriceSuccess(planPrice));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(editPlanPriceError, error);
  }
}

export function* planPriceWatch() {
  yield takeLatest(addPlanPriceRequest, addPlanPrice);
  yield takeLatest(delPlanPriceRequest, delPlanPrice);
  yield takeLatest(editPlanPriceRequest, editPlanPrice);
}
