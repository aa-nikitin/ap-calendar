import { takeLatest, call, put, select } from 'redux-saga/effects';
import { fetchLogin, fetchLoginFromToken } from '../api';
import {
  loginFetchRequest,
  loginFetchSuccess,
  loginFetchError,
  loginFetchFromToken,
  logoutFetchFromToken
} from '../redux/actions';
import { getLogin } from '../redux/reducers';

const storageName = 'userData';

export function* loginAdmin() {
  try {
    const { login, pass } = yield select(getLogin);
    const loginResult = yield call(fetchLogin, login, pass);

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
    const loginToken = yield call(fetchLoginFromToken, token);

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
