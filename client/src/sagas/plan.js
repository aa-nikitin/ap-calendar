import { takeLatest, call, put, select } from 'redux-saga/effects';
import moment from 'moment';

import { fetchPost, fetchPut, fetchDelete } from '../api';
import {
  planHallsRequest,
  planHallsSuccess,
  planHallsError,
  planMonthRequest,
  planMonthSuccess,
  planMonthError,
  logoutFetchFromToken,
  planDataRequest,
  planDataSuccess,
  planDataError,
  planFetchAddRequest,
  planFetchAddSuccess,
  planFetchAddError,
  planFetchDeleteRequest,
  planFetchDeleteSuccess,
  planFetchDeleteError,
  planCancalledRequest,
  planCancalledSuccess,
  planCancalledError
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
export function* getPlanMonth() {
  try {
    const token = localStorage.getItem(storageName);
    const { datePlanHalls } = yield select(getPlan);
    const planHallsResult = yield call(
      fetchPost,
      '/api/plan-month',
      { date: datePlanHalls },
      token
    );
    yield put(planMonthSuccess(planHallsResult));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(planMonthError(error));
  }
}

export function* getPlanData() {
  try {
    const token = localStorage.getItem(storageName);
    const { dataPlan } = yield select(getPlan);
    const { date, time, idHall, idPlan, minutes } = dataPlan;

    if (!idPlan) {
      const planFreeTime = yield call(fetchPost, '/api/plan-check-time/', dataPlan, token);
      const planFree = yield call(fetchPost, '/api/plan-check-free/', dataPlan, token);

      console.log(dataPlan);
      yield put(planDataSuccess({ planFreeTime, planFree, date, time, idHall, minutes }));
    } else {
      const planTimeForEdit = yield call(fetchPost, '/api/plan-time-for-edit/', dataPlan, token);
      // console.log(dataPlan, planTimeForEdit, minutes);
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
    const dateOrderFormat = moment(dataPlan.dateOrder).format('DD.MM.YYYY HH:mm');

    if (!dataPlan.idPlan) {
      yield call(fetchPost, '/api/plan-date/', { ...dataPlan, dateOrderFormat }, token);
    } else {
      yield call(fetchPut, '/api/plan-date/', { ...dataPlan, dateOrderFormat }, token);
    }
    if (dataPlan.typePlan === 'planHalls') {
      const planHallsResult = yield call(
        fetchPost,
        '/api/plan-halls',
        { date: dataPlan.date },
        token
      );
      yield put(planFetchAddSuccess(planHallsResult));
    } else if (dataPlan.typePlan === 'planMonth') {
      const planHallsResult = yield call(
        fetchPost,
        '/api/plan-month',
        { date: dataPlan.date },
        token
      );
      yield put(planMonthSuccess(planHallsResult));
    }
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(planFetchAddError(error));
  }
}

export function* deletePlan() {
  try {
    const token = localStorage.getItem(storageName);
    const { dataPlan } = yield select(getPlan);

    yield call(fetchDelete, '/api/plan-date/', { idPlan: dataPlan.idPlan }, token);

    const planHallsResult = yield call(
      fetchPost,
      '/api/plan-halls',
      { date: dataPlan.date },
      token
    );
    yield put(planFetchDeleteSuccess(planHallsResult));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(planFetchDeleteError(error));
  }
}

export function* cancalledPlan() {
  try {
    const token = localStorage.getItem(storageName);
    const { dataPlan } = yield select(getPlan);

    yield call(fetchPut, '/api/plan-canceled/', dataPlan, token);

    const planHallsResult = yield call(
      fetchPost,
      '/api/plan-halls',
      { date: dataPlan.date },
      token
    );
    yield put(planCancalledSuccess(planHallsResult));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(planCancalledError(error));
  }
}

export function* planWatch() {
  yield takeLatest(planHallsRequest, getPlanHalls);
  yield takeLatest(planMonthRequest, getPlanMonth);
  yield takeLatest(planDataRequest, getPlanData);
  yield takeLatest(planFetchAddRequest, addPlan);
  yield takeLatest(planFetchDeleteRequest, deletePlan);
  yield takeLatest(planCancalledRequest, cancalledPlan);
}
