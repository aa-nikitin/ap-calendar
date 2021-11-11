import { createActions } from 'redux-actions';

const {
  shedule: {
    load: {
      request: settingsLoadSheduleRequest,
      success: settingsLoadSheduleSuccess,
      error: settingsLoadSheduleError
    },
    save: {
      request: settingsSaveSheduleRequest,
      success: settingsSaveSheduleSuccess,
      error: settingsSaveSheduleError
    }
  },
  holidays: {
    load: {
      request: settingsLoadHolidaysRequest,
      success: settingsLoadHolidaysSuccess,
      error: settingsLoadHolidaysError
    },
    save: {
      request: settingsSaveHolidaysRequest,
      success: settingsSaveHolidaysSuccess,
      error: settingsSaveHolidaysError
    },
    delete: {
      request: settingsDeleteHolidaysRequest,
      success: settingsDeleteHolidaysSuccess,
      error: settingsDeleteHolidaysError
    }
  },
  paykeeper: {
    load: {
      request: settingsLoadPaykeeperRequest,
      success: settingsLoadPaykeeperSuccess,
      error: settingsLoadPaykeeperError
    },
    save: {
      request: settingsSavePaykeeperRequest,
      success: settingsSavePaykeeperSuccess,
      error: settingsSavePaykeeperError
    }
  },
  prepayment: {
    load: {
      request: settingsLoadPrepaymentRequest,
      success: settingsLoadPrepaymentSuccess,
      error: settingsLoadPrepaymentError
    },
    save: {
      request: settingsSavePrepaymentRequest,
      success: settingsSavePrepaymentSuccess,
      error: settingsSavePrepaymentError
    }
  }
} = createActions({
  SHEDULE: {
    LOAD: { REQUEST: null, SUCCESS: null, ERROR: null },
    SAVE: { REQUEST: null, SUCCESS: null, ERROR: null }
  },
  HOLIDAYS: {
    LOAD: { REQUEST: null, SUCCESS: null, ERROR: null },
    SAVE: { REQUEST: null, SUCCESS: null, ERROR: null },
    DELETE: { REQUEST: null, SUCCESS: null, ERROR: null }
  },
  PAYKEEPER: {
    LOAD: { REQUEST: null, SUCCESS: null, ERROR: null },
    SAVE: { REQUEST: null, SUCCESS: null, ERROR: null }
  },
  PREPAYMENT: {
    LOAD: { REQUEST: null, SUCCESS: null, ERROR: null },
    SAVE: { REQUEST: null, SUCCESS: null, ERROR: null }
  }
});

export {
  settingsLoadSheduleRequest,
  settingsLoadSheduleSuccess,
  settingsLoadSheduleError,
  settingsSaveSheduleRequest,
  settingsSaveSheduleSuccess,
  settingsSaveSheduleError,
  settingsLoadHolidaysRequest,
  settingsLoadHolidaysSuccess,
  settingsLoadHolidaysError,
  settingsSaveHolidaysRequest,
  settingsSaveHolidaysSuccess,
  settingsSaveHolidaysError,
  settingsDeleteHolidaysRequest,
  settingsDeleteHolidaysSuccess,
  settingsDeleteHolidaysError,
  settingsLoadPaykeeperRequest,
  settingsLoadPaykeeperSuccess,
  settingsLoadPaykeeperError,
  settingsSavePaykeeperRequest,
  settingsSavePaykeeperSuccess,
  settingsSavePaykeeperError,
  settingsLoadPrepaymentRequest,
  settingsLoadPrepaymentSuccess,
  settingsLoadPrepaymentError,
  settingsSavePrepaymentRequest,
  settingsSavePrepaymentSuccess,
  settingsSavePrepaymentError
};
