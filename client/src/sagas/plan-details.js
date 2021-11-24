import { takeLatest, call, put, select } from 'redux-saga/effects';

import { fetchGet } from '../api';
import {
  getPlanDetailsRequest,
  getPlanDetailsSuccess,
  getPlanDetailsError,
  logoutFetchFromToken
} from '../redux/actions';
import { storageName } from '../config';
import { getPlanDetails } from '../redux/reducers';

export function* getPlanDetail() {
  try {
    const token = localStorage.getItem(storageName);
    const { query } = yield select(getPlanDetails);
    const planDetails = yield call(fetchGet, `/api/plan-details/${query}`, token);
    // console.log(planDetails);
    yield put(getPlanDetailsSuccess(planDetails));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(getPlanDetailsError, error);
  }
}

export function* planDetailsWatch() {
  yield takeLatest(getPlanDetailsRequest, getPlanDetail);
}
