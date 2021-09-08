import { createActions } from 'redux-actions';

const {
  client: {
    fetch: { request: clientFetchRequest, success: clientFetchSuccess, error: clientFetchError },
    change: { request: clientChangeRequest, success: clientChangeSuccess, error: clientChangeError }
  }
} = createActions({
  CLIENT: {
    FETCH: {
      REQUEST: null,
      SUCCESS: null,
      ERROR: null
    },
    CHANGE: {
      REQUEST: null,
      SUCCESS: null,
      ERROR: null
    }
  }
});

export {
  clientFetchRequest,
  clientFetchSuccess,
  clientFetchError,
  clientChangeRequest,
  clientChangeSuccess,
  clientChangeError
};
