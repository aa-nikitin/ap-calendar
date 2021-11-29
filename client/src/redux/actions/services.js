import { createActions } from 'redux-actions';

const {
  services: {
    get: { request: getServicesRequest, success: getServicesSuccess, error: getServicesError },
    add: { request: addServicesRequest, success: addServicesSuccess, error: addServicesError },
    delete: {
      request: deleteServicesRequest,
      success: deleteServicesSuccess,
      error: deleteServicesError
    },
    edit: { request: editServicesRequest, success: editServicesSuccess, error: editServicesError },
    set: setServices
  }
} = createActions({
  SERVICES: {
    GET: {
      REQUEST: null,
      SUCCESS: null,
      ERROR: null
    },
    ADD: {
      REQUEST: null,
      SUCCESS: null,
      ERROR: null
    },
    EDIT: {
      REQUEST: null,
      SUCCESS: null,
      ERROR: null
    },
    DELETE: {
      REQUEST: null,
      SUCCESS: null,
      ERROR: null
    },
    SET: null
  }
});

export {
  getServicesRequest,
  getServicesSuccess,
  getServicesError,
  addServicesRequest,
  addServicesSuccess,
  addServicesError,
  deleteServicesRequest,
  deleteServicesSuccess,
  deleteServicesError,
  editServicesRequest,
  editServicesSuccess,
  editServicesError,
  setServices
};
