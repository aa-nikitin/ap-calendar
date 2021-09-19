import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import _ from 'lodash';
import produce from 'immer';

import {
  hallsFetchRequest,
  hallsFetchSuccess,
  hallsFetchError,
  hallsDeleteRequest,
  hallsDeleteSuccess,
  hallsDeleteError,
  hallsChangeRequest,
  hallsChangeSuccess,
  hallsChangeError,
  hallsAddRequest,
  hallsAddSuccess,
  hallsAddError,
  hallPhotosUploadRequest,
  hallPhotosUploadSuccess,
  hallPhotosUploadError,
  hallPhotoRemoveRequest,
  hallPhotoRemoveSuccess,
  hallPhotoRemoveError,
  hallPhotoCoverRequest,
  hallPhotoCoverSuccess,
  hallPhotoCoverError
} from '../actions';

const hallsFetch = handleActions(
  {
    [hallsFetchRequest]: (_state) => true,
    [hallsFetchSuccess]: (_state) => false,
    [hallsFetchError]: (_state) => false,
    [hallsDeleteRequest]: (_state) => true,
    [hallsDeleteSuccess]: (_state) => false,
    [hallsDeleteError]: (_state) => false,
    [hallsChangeRequest]: (_state) => true,
    [hallsChangeSuccess]: (_state) => false,
    [hallsChangeError]: (_state) => false,
    [hallsAddRequest]: (_state) => true,
    [hallsAddSuccess]: (_state) => false,
    [hallsAddError]: (_state) => false
  },
  false
);
const hallsPhotosFetch = handleActions(
  {
    [hallPhotosUploadRequest]: (_state) => true,
    [hallPhotosUploadSuccess]: (_state) => false,
    [hallPhotosUploadError]: (_state) => false,
    [hallPhotoRemoveRequest]: (_state) => true,
    [hallPhotoRemoveSuccess]: (_state) => false,
    [hallPhotoRemoveError]: (_state) => false,
    [hallPhotoCoverRequest]: (_state) => true,
    [hallPhotoCoverSuccess]: (_state) => false,
    [hallPhotoCoverError]: (_state) => false
  },
  false
);
const halls = handleActions(
  {
    [hallsFetchRequest]: (_state) => [],
    [hallsFetchSuccess]: (_state, { payload }) => payload,
    [hallsFetchError]: (_state) => [],
    [hallsDeleteRequest]: (_state) => [],
    [hallsDeleteSuccess]: (_state, { payload }) => payload,
    [hallsDeleteError]: (_state) => [],
    [hallsChangeRequest]: (_state) => [],
    [hallsChangeSuccess]: (_state, { payload }) => payload,
    [hallsChangeError]: (_state) => [],
    [hallsAddRequest]: (_state) => [],
    [hallsAddSuccess]: (_state, { payload }) => payload,
    [hallsAddError]: (_state) => [],
    [hallPhotosUploadSuccess]: (state, { payload }) => {
      const indexHall = _.findIndex(state, (hall) => hall._id === payload._id);
      const nextState = produce(state, (draft) => {
        draft[indexHall].photos = payload.photos;
      });
      return nextState;
    },
    [hallPhotoRemoveSuccess]: (state, { payload }) => {
      const indexHall = _.findIndex(state, (hall) => hall._id === payload._id);
      const nextState = produce(state, (draft) => {
        draft[indexHall].photos = payload.photos;
        draft[indexHall].cover = payload.cover;
      });
      return nextState;
    },
    [hallPhotoCoverSuccess]: (state, { payload }) => {
      const indexHall = _.findIndex(state, (hall) => hall._id === payload._id);
      const nextState = produce(state, (draft) => {
        draft[indexHall].cover = payload.cover;
      });
      return nextState;
    }
  },
  []
);
const error = handleActions(
  {
    [hallsFetchRequest]: (_state) => null,
    [hallsFetchSuccess]: (_state) => null,
    [hallsFetchError]: (_state, { payload }) => payload,
    [hallsDeleteRequest]: (_state) => null,
    [hallsDeleteSuccess]: (_state) => null,
    [hallsDeleteError]: (_state, { payload }) => payload,
    [hallsChangeRequest]: (_state) => null,
    [hallsChangeSuccess]: (_state) => null,
    [hallsChangeError]: (_state, { payload }) => payload,
    [hallsAddRequest]: (_state) => null,
    [hallsAddSuccess]: (_state) => null,
    [hallsAddError]: (_state, { payload }) => payload,
    [hallPhotosUploadRequest]: (_state) => null,
    [hallPhotosUploadSuccess]: (_state) => null,
    [hallPhotosUploadError]: (_state, { payload }) => payload,
    [hallPhotoRemoveRequest]: (_state) => null,
    [hallPhotoRemoveSuccess]: (_state) => null,
    [hallPhotoRemoveError]: (_state, { payload }) => payload,
    [hallPhotoCoverRequest]: (_state) => null,
    [hallPhotoCoverSuccess]: (_state) => null,
    [hallPhotoCoverError]: (_state, { payload }) => payload
  },
  null
);
const idHall = handleActions(
  {
    [hallsFetchRequest]: (_state) => null,
    [hallsFetchSuccess]: (_state) => null,
    [hallsFetchError]: (_state) => null,
    [hallsDeleteRequest]: (_state, { payload }) => payload,
    [hallsDeleteSuccess]: (_state) => null,
    [hallsDeleteError]: (_state) => null,
    [hallsChangeRequest]: (_state, { payload }) => payload.id,
    [hallsChangeSuccess]: (_state) => null,
    [hallsChangeError]: (_state) => null,
    [hallsAddRequest]: (_state) => null,
    [hallsAddSuccess]: (_state) => null,
    [hallsAddError]: (_state) => null,
    [hallPhotosUploadRequest]: (_state, { payload }) => payload.id,
    [hallPhotosUploadSuccess]: (_state) => null,
    [hallPhotosUploadError]: (_state) => null,
    [hallPhotoRemoveRequest]: (_state, { payload }) => payload.idHall,
    [hallPhotoRemoveSuccess]: (_state) => null,
    [hallPhotoRemoveError]: (_state) => null,
    [hallPhotoCoverRequest]: (_state, { payload }) => payload.idHall,
    [hallPhotoCoverSuccess]: (_state) => null,
    [hallPhotoCoverError]: (_state) => null
  },
  null
);
const idPhoto = handleActions(
  {
    [hallPhotoRemoveRequest]: (_state, { payload }) => payload.idPhoto,
    [hallPhotoRemoveSuccess]: (_state) => null,
    [hallPhotoRemoveError]: (_state) => null,
    [hallPhotoCoverRequest]: (_state, { payload }) => payload.idPhoto,
    [hallPhotoCoverSuccess]: (_state) => null,
    [hallPhotoCoverError]: (_state) => null
  },
  null
);
const hall = handleActions(
  {
    [hallsFetchRequest]: (_state) => {},
    [hallsFetchSuccess]: (_state) => {},
    [hallsFetchError]: (_state) => {},
    [hallsDeleteRequest]: (_state) => {},
    [hallsDeleteSuccess]: (_state) => {},
    [hallsDeleteError]: (_state) => {},
    [hallsChangeRequest]: (_state, { payload }) => payload.data,
    [hallsChangeSuccess]: (_state) => {},
    [hallsChangeError]: (_state) => {},
    [hallsAddRequest]: (_state, { payload }) => payload,
    [hallsAddSuccess]: (_state) => {},
    [hallsAddError]: (_state) => {}
  },
  {}
);
const hallPhotos = handleActions(
  {
    [hallPhotosUploadRequest]: (_state, { payload }) => payload.data,
    [hallPhotosUploadSuccess]: (_state) => {},
    [hallPhotosUploadError]: (_state) => {}
  },
  {}
);

export const getHalls = ({ halls }) => halls;

export default combineReducers({
  hallsFetch,
  halls,
  error,
  idHall,
  idPhoto,
  hall,
  hallPhotos,
  hallsPhotosFetch
});
