import { takeLatest, call, put, select } from 'redux-saga/effects';

import {
  fetchGetAll,
  fetchDeleteHalls,
  fetchAdd,
  fetchChange,
  fetchUploadPhotosHall,
  fetchDeleteByParams,
  fetchChangeParams
} from '../api';
import {
  hallsFetchRequest,
  hallsFetchSuccess,
  hallsFetchError,
  hallsDeleteRequest,
  hallsDeleteSuccess,
  hallsDeleteError,
  hallsAddRequest,
  hallsAddSuccess,
  hallsAddError,
  hallsChangeRequest,
  hallsChangeSuccess,
  hallsChangeError,
  logoutFetchFromToken,
  hallPhotosUploadRequest,
  hallPhotosUploadSuccess,
  hallPhotosUploadError,
  hallPhotoRemoveRequest,
  hallPhotoRemoveSuccess,
  hallPhotoRemoveError,
  hallPhotoCoverRequest,
  hallPhotoCoverSuccess,
  hallPhotoCoverError
} from '../redux/actions';
import { getHalls } from '../redux/reducers';
import { storageName } from '../config';

export function* getHallsList() {
  try {
    const token = localStorage.getItem(storageName);
    const hallsResult = yield call(fetchGetAll, '/api/halls', token);

    yield put(hallsFetchSuccess(hallsResult));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(hallsFetchError(error));
  }
}

export function* deleteHall() {
  try {
    const token = localStorage.getItem(storageName);
    const { idHall } = yield select(getHalls);
    const hallsResult = yield call(fetchDeleteHalls, idHall, token);

    yield put(hallsDeleteSuccess(hallsResult));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(hallsDeleteError(error));
  }
}

export function* addHall() {
  try {
    const token = localStorage.getItem(storageName);
    const { hall } = yield select(getHalls);
    const hallResult = yield call(fetchAdd, '/api/hall/', hall, token);

    yield put(hallsAddSuccess(hallResult));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(hallsAddError(error));
  }
}

export function* changeHall() {
  try {
    const token = localStorage.getItem(storageName);
    const { idHall, hall } = yield select(getHalls);
    const hallResult = yield call(fetchChange, '/api/hall/', idHall, hall, token);

    yield put(hallsChangeSuccess(hallResult));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(hallsChangeError(error));
  }
}

export function* upploadHallPhotos() {
  try {
    const token = localStorage.getItem(storageName);
    const { idHall, hallPhotos } = yield select(getHalls);
    const images = Object.values(hallPhotos);
    const formData = new FormData();

    images.forEach((image) => formData.append('images', image));
    formData.append('idHall', idHall);

    const uploadPhotos = yield call(fetchUploadPhotosHall, '/api/upload-photos', formData, token);

    yield put(hallPhotosUploadSuccess(uploadPhotos));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(hallPhotosUploadError(error));
  }
}

export function* delHallPhoto() {
  try {
    const token = localStorage.getItem(storageName);
    const { idHall, idPhoto } = yield select(getHalls);

    const uploadPhotos = yield call(
      fetchDeleteByParams,
      '/api/delete-photo',
      { idHall, idPhoto },
      token
    );

    yield put(hallPhotoRemoveSuccess(uploadPhotos));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(hallPhotoRemoveError(error));
  }
}

export function* updateCoverHallPhoto() {
  try {
    const token = localStorage.getItem(storageName);
    const { idHall, idPhoto } = yield select(getHalls);

    const uploadPhotos = yield call(
      fetchChangeParams,
      '/api/hall-cover',
      { idHall, idPhoto },
      token
    );

    yield put(hallPhotoCoverSuccess(uploadPhotos));
  } catch (error) {
    if (error === 'Unauthorized') yield put(logoutFetchFromToken());
    yield put(hallPhotoCoverError(error));
  }
}

export function* hallsWatch() {
  yield takeLatest(hallsFetchRequest, getHallsList);
  yield takeLatest(hallsDeleteRequest, deleteHall);
  yield takeLatest(hallsAddRequest, addHall);
  yield takeLatest(hallsChangeRequest, changeHall);
  yield takeLatest(hallPhotosUploadRequest, upploadHallPhotos);
  yield takeLatest(hallPhotoRemoveRequest, delHallPhoto);
  yield takeLatest(hallPhotoCoverRequest, updateCoverHallPhoto);
}
