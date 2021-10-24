import { takeLatest, call, put, select } from 'redux-saga/effects';
import { fetchPost, fetchGet } from '../api';
import {
  loginFetchRequest,
  loginFetchSuccess,
  loginFetchError,
  loginFetchFromToken,
  logoutFetchFromToken,
  setWorkShedule,
  setPriceParams
} from '../redux/actions';
import { getLogin } from '../redux/reducers';
import { storageName } from '../config';

export function* loginAdmin() {
  try {
    const { login, pass } = yield select(getLogin);
    const loginResult = yield call(fetchPost, `/api/login/`, { login, password: pass });
    const workShedule = yield call(fetchGet, `/api/work-shedule/`);
    const priceParams = yield call(fetchGet, `/api/price-params/`);

    yield put(setWorkShedule(workShedule));
    yield put(setPriceParams(priceParams));
    yield put(loginFetchSuccess(loginResult));
    yield localStorage.setItem(storageName, loginResult.token);
  } catch (error) {
    yield put(loginFetchError(error));
    yield localStorage.setItem(storageName, '');
  }
}

export function* loginAdminFromToken() {
  try {
    const token = localStorage.getItem(storageName);
    const loginToken = yield call(fetchPost, '/api/authFromToken/', {}, token);
    const workShedule = yield call(fetchGet, `/api/work-shedule/`);
    const priceParams = yield call(fetchGet, `/api/price-params/`);

    yield put(setPriceParams(priceParams));
    yield put(setWorkShedule(workShedule));
    yield put(loginFetchSuccess(loginToken));
  } catch (error) {
    yield put(loginFetchError(error));
  }
}

export function* logoutAdminFromToken() {
  try {
    yield localStorage.setItem(storageName, '');
  } catch (error) {
    yield localStorage.setItem(storageName, '');
  }
}

export function* adminWatch() {
  yield takeLatest(loginFetchRequest, loginAdmin);
  yield takeLatest(loginFetchFromToken, loginAdminFromToken);
  yield takeLatest(logoutFetchFromToken, logoutAdminFromToken);
}
