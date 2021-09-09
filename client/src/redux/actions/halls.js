import { createActions } from 'redux-actions';

const {
  halls: {
    fetch: { request: hallsFetchRequest, success: hallsFetchSuccess, error: hallsFetchError },
    delete: { request: hallsDeleteRequest, success: hallsDeleteSuccess, error: hallsDeleteError },
    change: { request: hallsChangeRequest, success: hallsChangeSuccess, error: hallsChangeError },
    add: { request: hallsAddRequest, success: hallsAddSuccess, error: hallsAddError }
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
  hallsAddError
};
