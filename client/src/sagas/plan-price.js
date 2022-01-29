import { takeLatest, call, put, select } from 'redux-saga/effects';

import { fetchGet, fetchPost, fetchDelete, fetchPut } from '../api';
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
  servicePlanPriceRequest,
  servicePlanPriceSuccess,
  servicePlanPriceError,
  setPriceInfo,
  setPlanInfoServices,
  removePlanInfoServices,
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
    const priceInfo = yield call(fetchGet, `/api/price-info/${query.idPlan}`, {}, token);

    yield put(setPriceInfo(priceInfo));
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
    const planPrice = yield call(fetchDelete, `/api/plan-price/${query.id}`, query, token);
    const priceInfo = yield call(fetchGet, `/api/price-info/${query.idPlan}`, {}, token);

    yield put(setPriceInfo(priceInfo));
    yield put(delPlanPriceSuccess(planPrice));
    yield put(removePlanInfoServices(query.idService));
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
    const priceInfo = yield call(fetchGet, `/api/price-info/${query.idPlan}`, {}, token);

    yield put(setPriceInfo(priceInfo));
    yield put(editPlanPriceSuccess(planPrice));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(editPlanPriceError, error);
  }
}

export function* addServicePlanPrice() {
  try {
    // console.log('planPrice');
    const token = localStorage.getItem(storageName);
    const { query } = yield select(getPlanPrice);
    const planPrice = yield call(fetchPost, `/api/plan-price-from-services`, query, token);
    const priceInfo = yield call(fetchGet, `/api/price-info/${query.idPlan}`, {}, token);

    yield put(setPriceInfo(priceInfo));
    yield put(servicePlanPriceSuccess(planPrice));
    yield put(setPlanInfoServices(planPrice));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(servicePlanPriceError, error);
  }
}

export function* planPriceWatch() {
  yield takeLatest(addPlanPriceRequest, addPlanPrice);
  yield takeLatest(delPlanPriceRequest, delPlanPrice);
  yield takeLatest(editPlanPriceRequest, editPlanPrice);
  yield takeLatest(servicePlanPriceRequest, addServicePlanPrice);
}
