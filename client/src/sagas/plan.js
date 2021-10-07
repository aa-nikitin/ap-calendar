import { takeLatest, call, put, select } from 'redux-saga/effects';

import { fetchPost } from '../api';
import {
  planHallsRequest,
  planHallsSuccess,
  planHallsError,
  logoutFetchFromToken,
  planDataRequest,
  planDataSuccess,
  planDataError,
  planFetchAddRequest,
  planFetchAddSuccess,
  planFetchAddError
} from '../redux/actions';
import { getPlan } from '../redux/reducers';
import { storageName } from '../config';
export function* getPlanHalls() {
  try {
    const token = localStorage.getItem(storageName);
    const { datePlanHalls } = yield select(getPlan);
    const planHallsResult = yield call(
      fetchPost,
      '/api/plan-halls',
      { date: datePlanHalls },
      token
    );
    yield put(planHallsSuccess(planHallsResult));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(planHallsError(error));
  }
}

export function* getPlanData() {
  try {
    const token = localStorage.getItem(storageName);
    const { dataPlan } = yield select(getPlan);
    const { date, time, idHall, idPlan, minutes } = dataPlan;
    // console.log(idPlan);
    if (!idPlan) {
      const planFreeTime = yield call(fetchPost, '/api/plan-check-time/', dataPlan, token);
      const planFree = yield call(fetchPost, '/api/plan-check-free/', dataPlan, token);

      yield put(planDataSuccess({ planFreeTime, planFree, date, time, idHall, minutes }));
    } else {
      const planTimeForEdit = yield call(fetchPost, '/api/plan-time-for-edit/', dataPlan, token);
      yield put(planDataSuccess(planTimeForEdit));
    }
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(planDataError(error));
  }
}

export function* addPlan() {
  try {
    const token = localStorage.getItem(storageName);
    const { dataPlan } = yield select(getPlan);
    yield call(fetchPost, '/api/plan-date/', dataPlan, token);
    const planHallsResult = yield call(
      fetchPost,
      '/api/plan-halls',
      { date: dataPlan.date },
      token
    );
    // console.log(dataPlan);
    // const { date, time, idHall, idPlan, minutes } = dataPlan;
    // console.log(idPlan);
    yield put(planFetchAddSuccess(planHallsResult));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(planFetchAddError(error));
  }
}

export function* planWatch() {
  yield takeLatest(planHallsRequest, getPlanHalls);
  yield takeLatest(planDataRequest, getPlanData);
  yield takeLatest(planFetchAddRequest, addPlan);
}
