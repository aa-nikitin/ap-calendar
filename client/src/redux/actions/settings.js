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
    save: {
      request: settingsSavePaykeeperRequest,
      success: settingsSavePaykeeperSuccess,
      error: settingsSavePaykeeperError
    }
  },
  prepayment: {
    save: {
      request: settingsSavePrepaymentRequest,
      success: settingsSavePrepaymentSuccess,
      error: settingsSavePrepaymentError
    }
  },
  mailPost: {
    save: {
      request: settingsSaveMailPostRequest,
      success: settingsSaveMailPostSuccess,
      error: settingsSaveMailPostError
    },
    send: {
      request: settingsSendMailPostRequest,
      success: settingsSendMailPostSuccess,
      error: settingsSendMailPostError
    }
  },
  settings: {
    load: {
      request: settingsLoadSettingsRequest,
      success: settingsLoadSettingsSuccess,
      error: settingsLoadSettingsError
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
    SAVE: { REQUEST: null, SUCCESS: null, ERROR: null }
  },
  PREPAYMENT: {
    SAVE: { REQUEST: null, SUCCESS: null, ERROR: null }
  },
  MAIL_POST: {
    SAVE: { REQUEST: null, SUCCESS: null, ERROR: null },
    SEND: { REQUEST: null, SUCCESS: null, ERROR: null }
  },
  SETTINGS: { LOAD: { REQUEST: null, SUCCESS: null, ERROR: null } }
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
  settingsSavePaykeeperRequest,
  settingsSavePaykeeperSuccess,
  settingsSavePaykeeperError,
  settingsSavePrepaymentRequest,
  settingsSavePrepaymentSuccess,
  settingsSavePrepaymentError,
  settingsSaveMailPostRequest,
  settingsSaveMailPostSuccess,
  settingsSaveMailPostError,
  settingsLoadSettingsRequest,
  settingsLoadSettingsSuccess,
  settingsLoadSettingsError,
  settingsSendMailPostRequest,
  settingsSendMailPostSuccess,
  settingsSendMailPostError
};
