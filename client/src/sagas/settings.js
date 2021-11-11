import { takeLatest, call, put, select } from 'redux-saga/effects';
import _ from 'lodash';

import { fetchPut, fetchPost, fetchGet, fetchDelete } from '../api';
import {
  settingsSaveSheduleRequest,
  settingsSaveSheduleSuccess,
  settingsSaveSheduleError,
  settingsLoadHolidaysRequest,
  settingsLoadHolidaysSuccess,
  settingsLoadHolidaysError,
  settingsDeleteHolidaysRequest,
  settingsDeleteHolidaysSuccess,
  settingsDeleteHolidaysError,
  settingsSaveHolidaysRequest,
  settingsSaveHolidaysSuccess,
  settingsSaveHolidaysError,
  settingsLoadPaykeeperRequest,
  settingsLoadPaykeeperSuccess,
  settingsLoadPaykeeperError,
  settingsSavePaykeeperRequest,
  settingsSavePaykeeperSuccess,
  settingsSavePaykeeperError,
  settingsLoadPrepaymentRequest,
  settingsLoadPrepaymentSuccess,
  settingsLoadPrepaymentError,
  settingsSavePrepaymentRequest,
  settingsSavePrepaymentSuccess,
  settingsSavePrepaymentError,
  logoutFetchFromToken
} from '../redux/actions';
import { getSettings } from '../redux/reducers';
import { storageName } from '../config';

export function* changeShedule() {
  try {
    const token = localStorage.getItem(storageName);
    const { query } = yield select(getSettings);
    const newShedule = {
      minutesFrom: query.minutesFrom * query.hourSize,
      minutesTo: query.minutesTo * query.hourSize,
      minutesStep: query.minutesStep,
      hourSize: query.hourSize
    };
    const settingsShedule = yield call(fetchPut, '/api/work-shedule', newShedule, token);

    yield put(settingsSaveSheduleSuccess(settingsShedule));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(settingsSaveSheduleError(error));
  }
}

export function* getHolidays() {
  try {
    const token = localStorage.getItem(storageName);
    const holidays = yield call(fetchGet, '/api/holidays', token);

    yield put(settingsLoadHolidaysSuccess(holidays));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(settingsLoadHolidaysError(error));
  }
}

export function* delHoliday() {
  try {
    const token = localStorage.getItem(storageName);
    const { query } = yield select(getSettings);
    // console.log(query);
    const holidays = yield call(fetchDelete, `/api/holidays/${query}`, {}, token);

    yield put(settingsDeleteHolidaysSuccess(holidays));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(settingsDeleteHolidaysError(error));
  }
}

export function* addHoliday() {
  try {
    const token = localStorage.getItem(storageName);
    const { query, holidays } = yield select(getSettings);
    const isSameHoliday =
      _.findIndex(holidays, function (o) {
        return o.date === query;
      }) >= 0;
    const holidaysNew = isSameHoliday
      ? holidays
      : yield call(fetchPost, `/api/holidays/`, { date: query }, token);

    yield put(settingsSaveHolidaysSuccess(holidaysNew));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(settingsSaveHolidaysError(error));
  }
}

export function* getPaykeeper() {
  try {
    const token = localStorage.getItem(storageName);
    const paykeeper = yield call(fetchGet, `/api/paykeeper/${token}`, token);

    yield put(settingsLoadPaykeeperSuccess(paykeeper));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(settingsLoadPaykeeperError(error));
  }
}
export function* savePaykeeper() {
  try {
    const token = localStorage.getItem(storageName);
    const { query } = yield select(getSettings);
    const paykeeper = yield call(fetchPut, `/api/paykeeper`, query, token);

    yield put(settingsSavePaykeeperSuccess(paykeeper));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(settingsSavePaykeeperError(error));
  }
}

export function* getPrepayment() {
  try {
    const token = localStorage.getItem(storageName);
    const prepayment = yield call(fetchGet, `/api/prepayment/${token}`, token);

    yield put(settingsLoadPrepaymentSuccess(prepayment));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(settingsLoadPrepaymentError(error));
  }
}
export function* savePrepayment() {
  try {
    const token = localStorage.getItem(storageName);
    const { query } = yield select(getSettings);
    const prepayment = yield call(fetchPut, `/api/prepayment`, query, token);

    yield put(settingsSavePrepaymentSuccess(prepayment));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(settingsSavePrepaymentError(error));
  }
}

export function* settingsWatch() {
  yield takeLatest(settingsSaveSheduleRequest, changeShedule);
  yield takeLatest(settingsLoadHolidaysRequest, getHolidays);
  yield takeLatest(settingsDeleteHolidaysRequest, delHoliday);
  yield takeLatest(settingsSaveHolidaysRequest, addHoliday);
  yield takeLatest(settingsLoadPaykeeperRequest, getPaykeeper);
  yield takeLatest(settingsSavePaykeeperRequest, savePaykeeper);
  yield takeLatest(settingsLoadPrepaymentRequest, getPrepayment);
  yield takeLatest(settingsSavePrepaymentRequest, savePrepayment);
}
