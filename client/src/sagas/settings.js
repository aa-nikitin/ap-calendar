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
  settingsSavePaykeeperRequest,
  settingsSavePaykeeperSuccess,
  settingsSavePaykeeperError,
  settingsSavePrepaymentRequest,
  settingsSavePrepaymentSuccess,
  settingsSavePrepaymentError,
  settingsSaveMailPostRequest,
  settingsSaveMailPostSuccess,
  settingsSaveMailPostError,
  settingsLoadSettingsRequest,
  settingsLoadSettingsSuccess,
  settingsLoadSettingsError,
  settingsSendMailPostRequest,
  settingsSendMailPostSuccess,
  settingsSendMailPostError,
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

    alert(`Изменения успешно сохранены`);

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

export function* savePaykeeper() {
  try {
    const token = localStorage.getItem(storageName);
    const { query } = yield select(getSettings);
    const paykeeper = yield call(fetchPut, `/api/paykeeper`, query, token);

    alert(`Изменения успешно сохранены`);

    yield put(settingsSavePaykeeperSuccess(paykeeper));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(settingsSavePaykeeperError(error));
  }
}

export function* savePrepayment() {
  try {
    const token = localStorage.getItem(storageName);
    const { query } = yield select(getSettings);
    const prepayment = yield call(fetchPut, `/api/prepayment`, query, token);

    alert(`Изменения успешно сохранены`);

    yield put(settingsSavePrepaymentSuccess(prepayment));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(settingsSavePrepaymentError(error));
  }
}

export function* saveMailPost() {
  try {
    const token = localStorage.getItem(storageName);
    const { query } = yield select(getSettings);
    const mailPost = yield call(fetchPut, `/api/mail-post`, query, token);

    alert(`Изменения успешно сохранены`);

    yield put(settingsSaveMailPostSuccess(mailPost));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(settingsSaveMailPostError(error));
  }
}
export function* getSettingParams() {
  try {
    const token = localStorage.getItem(storageName);
    const mailPost = yield call(fetchGet, `/api/mail-post`, token);
    const prepayment = yield call(fetchGet, `/api/prepayment`, token);
    const paykeeper = yield call(fetchGet, `/api/paykeeper`, token);

    yield put(settingsLoadSettingsSuccess({ mailPost, prepayment, paykeeper }));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(settingsLoadSettingsError(error));
  }
}
export function* sendMailPost() {
  try {
    const token = localStorage.getItem(storageName);
    const mailPost = yield call(fetchGet, `/api/send-mail-post`, token);

    alert(`Тестовое письмо успешно отправлено на следующий адресс - ${mailPost.accepted[0]}`);

    yield put(settingsSendMailPostSuccess());
  } catch (error) {
    console.log(error.message);

    alert(
      `Сообщение не было отправлено что то пошло не так, отчет можно посмотреть в консоле (нажмите клавишу F12)`
    );

    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(settingsSendMailPostError(error));
  }
}

export function* settingsWatch() {
  yield takeLatest(settingsSaveSheduleRequest, changeShedule);
  yield takeLatest(settingsLoadHolidaysRequest, getHolidays);
  yield takeLatest(settingsDeleteHolidaysRequest, delHoliday);
  yield takeLatest(settingsSaveHolidaysRequest, addHoliday);
  yield takeLatest(settingsSavePaykeeperRequest, savePaykeeper);
  yield takeLatest(settingsSavePrepaymentRequest, savePrepayment);
  yield takeLatest(settingsSaveMailPostRequest, saveMailPost);
  yield takeLatest(settingsLoadSettingsRequest, getSettingParams);
  yield takeLatest(settingsSendMailPostRequest, sendMailPost);
}
