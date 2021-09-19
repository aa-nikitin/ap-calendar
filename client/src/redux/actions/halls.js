import { createActions } from 'redux-actions';

const {
  halls: {
    fetch: { request: hallsFetchRequest, success: hallsFetchSuccess, error: hallsFetchError },
    delete: { request: hallsDeleteRequest, success: hallsDeleteSuccess, error: hallsDeleteError },
    change: { request: hallsChangeRequest, success: hallsChangeSuccess, error: hallsChangeError },
    add: { request: hallsAddRequest, success: hallsAddSuccess, error: hallsAddError }
  },
  hallPhotos: {
    upload: {
      request: hallPhotosUploadRequest,
      success: hallPhotosUploadSuccess,
      error: hallPhotosUploadError
    },
    remove: {
      request: hallPhotoRemoveRequest,
      success: hallPhotoRemoveSuccess,
      error: hallPhotoRemoveError
    },
    cover: {
      request: hallPhotoCoverRequest,
      success: hallPhotoCoverSuccess,
      error: hallPhotoCoverError
    }
  }
} = createActions({
  HALLS: {
    FETCH: {
      REQUEST: null,
      SUCCESS: null,
      ERROR: null
    },
    DELETE: {
      REQUEST: null,
      SUCCESS: null,
      ERROR: null
    },
    CHANGE: {
      REQUEST: null,
      SUCCESS: null,
      ERROR: null
    },
    ADD: {
      REQUEST: null,
      SUCCESS: null,
      ERROR: null
    }
  },
  HALL_PHOTOS: {
    UPLOAD: {
      REQUEST: null,
      SUCCESS: null,
      ERROR: null
    },
    REMOVE: {
      REQUEST: null,
      SUCCESS: null,
      ERROR: null
    },
    COVER: {
      REQUEST: null,
      SUCCESS: null,
      ERROR: null
    }
  }
});

export {
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
};
