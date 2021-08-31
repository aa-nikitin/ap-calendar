import { createActions } from 'redux-actions';

const {
  admin: {
    loginFetch: { request: loginFetchRequest, success: loginFetchSuccess, error: loginFetchError },
    fromToken: { login: loginFetchFromToken, logout: logoutFetchFromToken }
  }
} = createActions({
  ADMIN: {
    LOGIN_FETCH: {
      REQUEST: null,
      SUCCESS: null,
      ERROR: null
    },
    FROM_TOKEN: {
      LOGIN: null,
      LOGOUT: null
    }
  }
});

export {
  loginFetchRequest,
  loginFetchSuccess,
  loginFetchError,
  loginFetchFromToken,
  logoutFetchFromToken
};
