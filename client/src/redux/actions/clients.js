import { createActions } from 'redux-actions';

const {
  clients: {
    fetch: { request: clientsFetchRequest, success: clientsFetchSuccess, error: clientsFetchError },
    add: { request: clientsAddRequest, success: clientsAddSuccess, error: clientsAddError },
    selection: {
      check: clientsSelectionCheck,
      delete: {
        request: clientsSelectionDelRequest,
        success: clientsSelectionDelSuccess,
        error: clientsSelectionDelError
      }
    }
  }
} = createActions({
  CLIENTS: {
    FETCH: {
      REQUEST: null,
      SUCCESS: null,
      ERROR: null
    },
    SELECTION: {
      CHECK: null,
      DELETE: {
        REQUEST: null,
        SUCCESS: null,
        ERROR: null
      }
    },
    ADD: { REQUEST: null, SUCCESS: null, ERROR: null }
  }
});

export {
  clientsFetchRequest,
  clientsFetchSuccess,
  clientsFetchError,
  clientsSelectionCheck,
  clientsSelectionDelRequest,
  clientsSelectionDelSuccess,
  clientsSelectionDelError,
  clientsAddRequest,
  clientsAddSuccess,
  clientsAddError
};
