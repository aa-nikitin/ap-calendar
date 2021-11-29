import { takeLatest, call, put, select } from 'redux-saga/effects';

import { fetchGet, fetchPut } from '../api';
import {
  getPlanDetailsRequest,
  getPlanDetailsSuccess,
  getPlanDetailsError,
  getRefreshDetailsRequest,
  getRefreshDetailsSuccess,
  getRefreshDetailsError,
  logoutFetchFromToken
} from '../redux/actions';
import { storageName } from '../config';
import { getPlanDetails } from '../redux/reducers';

export function* getPlanDetail() {
  try {
    const token = localStorage.getItem(storageName);
    const { query } = yield select(getPlanDetails);
    const planDetails = yield call(fetchGet, `/api/plan-details/${query}`, token);

    yield put(getPlanDetailsSuccess(planDetails));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(getPlanDetailsError, error);
  }
}

export function* getRefreshDetail() {
  try {
    const token = localStorage.getItem(storageName);
    const { query } = yield select(getPlanDetails);
    yield call(fetchPut, '/api/plan-date/', query, token);
    const planDetails = yield call(fetchGet, `/api/plan-details/${query.idPlan}`, token);

    yield put(getRefreshDetailsSuccess(planDetails));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(getRefreshDetailsError, error);
  }
}

export function* planDetailsWatch() {
  yield takeLatest(getPlanDetailsRequest, getPlanDetail);
  yield takeLatest(getRefreshDetailsRequest, getRefreshDetail);
}
