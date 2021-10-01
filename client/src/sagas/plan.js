import { takeLatest, call, put, select } from 'redux-saga/effects';

import { fetchAdd } from '../api';
import {
  planHallsRequest,
  planHallsSuccess,
  planHallsError,
  logoutFetchFromToken
} from '../redux/actions';
import { getPlan } from '../redux/reducers';
import { storageName } from '../config';
export function* getPlanHalls() {
  try {
    const token = localStorage.getItem(storageName);
    const { datePlanHalls } = yield select(getPlan);
    const planHallsResult = yield call(fetchAdd, '/api/plan-halls', { date: datePlanHalls }, token);
    yield put(planHallsSuccess(planHallsResult));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(planHallsError(error));
  }
}

export function* planWatch() {
  yield takeLatest(planHallsRequest, getPlanHalls);
}
