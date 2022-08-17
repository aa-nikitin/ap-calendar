import { takeLatest, call, put, select } from 'redux-saga/effects';

import { fetchGet, fetchPut, fetchPost } from '../api';
import {
  getPlanDetailsRequest,
  getPlanDetailsSuccess,
  getPlanDetailsError,
  getRefreshDetailsRequest,
  getRefreshDetailsSuccess,
  getRefreshDetailsError,
  getPlanPriceSuccess,
  getPlanPriceError,
  changeRecalcPlanInfoRequest,
  // changeRecalcPlanInfoSuccess,
  changeRecalcPlanInfoError,
  changeFixedPlanInfoRequest,
  changeFixedPlanInfoError,
  logoutFetchFromToken
} from '../redux/actions';
import { storageName } from '../config';
import { getPlanDetails } from '../redux/reducers';

export function* getPlanDetail() {
  try {
    const token = localStorage.getItem(storageName);
    const { query } = yield select(getPlanDetails);
    const planDetails = yield call(fetchGet, `/api/plan-details/${query}`, token);
    const planPrice = yield call(fetchGet, `/api/plan-price/${query}`, token);

    yield put(getPlanDetailsSuccess(planDetails));
    yield put(getPlanPriceSuccess(planPrice));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(getPlanDetailsError, error);
    yield put(getPlanPriceError, error);
  }
}

export function* getRefreshDetail() {
  try {
    const token = localStorage.getItem(storageName);
    const { query } = yield select(getPlanDetails);
    yield call(fetchPut, '/api/plan-date/', query, token);
    const planDetails = yield call(fetchGet, `/api/plan-details/${query.idPlan}`, token);
    const planPrice = yield call(fetchGet, `/api/plan-price/${query.idPlan}`, token);

    yield put(getRefreshDetailsSuccess(planDetails));
    yield put(getPlanPriceSuccess(planPrice));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(getRefreshDetailsError, error);
  }
}

export function* changeRecalcPlanInfo() {
  try {
    const token = localStorage.getItem(storageName);
    const { query } = yield select(getPlanDetails);
    yield call(fetchPost, '/api/recalc-estimate/', query, token);

    const planDetails = yield call(fetchGet, `/api/plan-details/${query.idPlan}`, token);
    const planPrice = yield call(fetchGet, `/api/plan-price/${query.idPlan}`, token);

    yield put(getPlanDetailsSuccess(planDetails));
    yield put(getPlanPriceSuccess(planPrice));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(changeRecalcPlanInfoError, error);
  }
}

export function* changeFixedPlanInfo() {
  try {
    const token = localStorage.getItem(storageName);
    const { query } = yield select(getPlanDetails);
    yield call(fetchPost, '/api/fixed-booking/', query, token);

    const planDetails = yield call(fetchGet, `/api/plan-details/${query.idPlan}`, token);

    yield put(getPlanDetailsSuccess(planDetails));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(changeFixedPlanInfoError, error);
  }
}

export function* planDetailsWatch() {
  yield takeLatest(getPlanDetailsRequest, getPlanDetail);
  yield takeLatest(getRefreshDetailsRequest, getRefreshDetail);
  yield takeLatest(changeRecalcPlanInfoRequest, changeRecalcPlanInfo);
  yield takeLatest(changeFixedPlanInfoRequest, changeFixedPlanInfo);
}
