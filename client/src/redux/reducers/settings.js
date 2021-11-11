import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';

import {
  settingsLoadSheduleRequest,
  settingsLoadSheduleSuccess,
  settingsLoadSheduleError,
  settingsSaveSheduleRequest,
  settingsSaveSheduleSuccess,
  settingsSaveSheduleError,
  settingsLoadHolidaysRequest,
  settingsLoadHolidaysSuccess,
  settingsLoadHolidaysError,
  settingsDeleteHolidaysRequest,
  settingsDeleteHolidaysSuccess,
  settingsDeleteHolidaysError,
  settingsSaveHolidaysRequest,
  settingsSaveHolidaysSuccess,
  settingsSaveHolidaysError,
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
} from '../actions';

const shedule = handleActions(
  {
    [settingsLoadSheduleRequest]: (_state) => ({}),
    [settingsLoadSheduleSuccess]: (_state, { payload }) => (payload ? payload : {}),
    [settingsLoadSheduleError]: (_state) => ({}),
    [settingsSaveSheduleRequest]: (_state) => ({}),
    [settingsSaveSheduleSuccess]: (_state, { payload }) => payload,
    [settingsSaveSheduleError]: (_state) => ({})
  },
  {}
);
const holidays = handleActions(
  {
    [settingsLoadHolidaysRequest]: (_state) => [],
    [settingsLoadHolidaysSuccess]: (_state, { payload }) => (payload ? payload : []),
    [settingsLoadHolidaysError]: (_state) => [],
    [settingsDeleteHolidaysRequest]: (_state) => [],
    [settingsDeleteHolidaysSuccess]: (_state, { payload }) => (payload ? payload : []),
    [settingsDeleteHolidaysError]: (_state) => [],
    [settingsSaveHolidaysSuccess]: (_state, { payload }) => (payload ? payload : []),
    [settingsSaveHolidaysError]: (_state) => []
  },
  []
);
const paykeeper = handleActions(
  {
    [settingsSavePaykeeperSuccess]: (_state, { payload }) => (payload ? payload : {}),
    [settingsSavePaykeeperError]: (_state) => ({}),
    [settingsLoadSettingsRequest]: (_state) => ({}),
    [settingsLoadSettingsSuccess]: (_state, { payload }) =>
      payload && payload.paykeeper ? payload.paykeeper : {},
    [settingsLoadSettingsError]: (_state) => ({})
  },
  {}
);
const prepayment = handleActions(
  {
    [settingsSavePrepaymentSuccess]: (_state, { payload }) => (payload ? payload : {}),
    [settingsSavePrepaymentError]: (_state) => ({}),
    [settingsLoadSettingsRequest]: (_state) => ({}),
    [settingsLoadSettingsSuccess]: (_state, { payload }) =>
      payload && payload.prepayment ? payload.prepayment : {},
    [settingsLoadSettingsError]: (_state) => ({})
  },
  {}
);
const mailPost = handleActions(
  {
    [settingsSaveMailPostSuccess]: (_state, { payload }) => (payload ? payload : {}),
    [settingsSaveMailPostError]: (_state) => ({}),
    [settingsLoadSettingsRequest]: (_state) => ({}),
    [settingsLoadSettingsSuccess]: (_state, { payload }) =>
      payload && payload.mailPost ? payload.mailPost : {},
    [settingsLoadSettingsError]: (_state) => ({})
  },
  {}
);
const loading = handleActions(
  {
    [settingsLoadSheduleRequest]: (_state) => true,
    [settingsLoadSheduleSuccess]: (_state) => false,
    [settingsLoadSheduleError]: (_state) => false,
    [settingsSaveSheduleRequest]: (_state) => true,
    [settingsSaveSheduleSuccess]: (_state) => false,
    [settingsSaveSheduleError]: (_state) => false,
    [settingsLoadHolidaysRequest]: (_state) => true,
    [settingsLoadHolidaysSuccess]: (_state) => false,
    [settingsLoadHolidaysError]: (_state) => false,
    [settingsDeleteHolidaysRequest]: (_state) => true,
    [settingsDeleteHolidaysSuccess]: (_state) => false,
    [settingsDeleteHolidaysError]: (_state) => false,
    [settingsSaveHolidaysRequest]: (_state) => true,
    [settingsSaveHolidaysSuccess]: (_state) => false,
    [settingsSaveHolidaysError]: (_state) => false,
    [settingsSavePaykeeperRequest]: (_state) => true,
    [settingsSavePaykeeperSuccess]: (_state) => false,
    [settingsSavePaykeeperError]: (_state) => false,
    [settingsSavePrepaymentRequest]: (_state) => true,
    [settingsSavePrepaymentSuccess]: (_state) => false,
    [settingsSavePrepaymentError]: (_state) => false,
    [settingsSaveMailPostRequest]: (_state) => true,
    [settingsSaveMailPostSuccess]: (_state) => false,
    [settingsSaveMailPostError]: (_state) => false,
    [settingsLoadSettingsRequest]: (_state) => true,
    [settingsLoadSettingsSuccess]: (_state) => false,
    [settingsLoadSettingsError]: (_state) => false,
    [settingsSendMailPostRequest]: (_state) => true,
    [settingsSendMailPostSuccess]: (_state) => false,
    [settingsSendMailPostError]: (_state) => false
  },
  false
);
const error = handleActions(
  {
    [settingsLoadSheduleRequest]: (_state) => null,
    [settingsLoadSheduleSuccess]: (_state) => null,
    [settingsLoadSheduleError]: (_state, { payload }) => payload,
    [settingsSaveSheduleRequest]: (_state) => null,
    [settingsSaveSheduleSuccess]: (_state) => null,
    [settingsSaveSheduleError]: (_state, { payload }) => payload,
    [settingsLoadHolidaysRequest]: (_state) => null,
    [settingsLoadHolidaysSuccess]: (_state) => null,
    [settingsLoadHolidaysError]: (_state, { payload }) => payload,
    [settingsDeleteHolidaysRequest]: (_state) => null,
    [settingsDeleteHolidaysSuccess]: (_state) => null,
    [settingsDeleteHolidaysError]: (_state, { payload }) => payload,
    [settingsSaveHolidaysRequest]: (_state) => null,
    [settingsSaveHolidaysSuccess]: (_state) => null,
    [settingsSaveHolidaysError]: (_state, { payload }) => payload,
    [settingsSavePaykeeperRequest]: (_state) => null,
    [settingsSavePaykeeperSuccess]: (_state) => null,
    [settingsSavePaykeeperError]: (_state, { payload }) => payload,
    [settingsSavePrepaymentRequest]: (_state) => null,
    [settingsSavePrepaymentSuccess]: (_state) => null,
    [settingsSavePrepaymentError]: (_state, { payload }) => payload,
    [settingsSaveMailPostRequest]: (_state) => null,
    [settingsSaveMailPostSuccess]: (_state) => null,
    [settingsSaveMailPostError]: (_state, { payload }) => payload,
    [settingsLoadSettingsRequest]: (_state) => null,
    [settingsLoadSettingsSuccess]: (_state) => null,
    [settingsLoadSettingsError]: (_state, { payload }) => payload,
    [settingsSendMailPostRequest]: (_state) => null,
    [settingsSendMailPostSuccess]: (_state) => null,
    [settingsSendMailPostError]: (_state, { payload }) => payload
  },
  null
);
const query = handleActions(
  {
    [settingsLoadSheduleRequest]: (_state, { payload }) => payload,
    [settingsLoadSheduleSuccess]: () => ({}),
    [settingsLoadSheduleError]: (_state) => ({}),
    [settingsSaveSheduleRequest]: (_state, { payload }) => payload,
    [settingsSaveSheduleSuccess]: () => ({}),
    [settingsSaveSheduleError]: (_state) => ({}),
    [settingsDeleteHolidaysRequest]: (_state, { payload }) => payload,
    [settingsDeleteHolidaysSuccess]: () => ({}),
    [settingsDeleteHolidaysError]: (_state) => ({}),
    [settingsSaveHolidaysRequest]: (_state, { payload }) => payload,
    [settingsSaveHolidaysSuccess]: () => ({}),
    [settingsSaveHolidaysError]: (_state) => ({}),
    [settingsSavePaykeeperRequest]: (_state, { payload }) => payload,
    [settingsSavePaykeeperSuccess]: () => ({}),
    [settingsSavePaykeeperError]: (_state) => ({}),
    [settingsSavePrepaymentRequest]: (_state, { payload }) => payload,
    [settingsSavePrepaymentSuccess]: () => ({}),
    [settingsSavePrepaymentError]: (_state) => ({}),
    [settingsSaveMailPostRequest]: (_state, { payload }) => payload,
    [settingsSaveMailPostSuccess]: () => ({}),
    [settingsSaveMailPostError]: (_state) => ({})
  },
  {}
);

export const getSettings = ({ settings }) => settings;
export const getWorkShedule = ({ settings }) => settings.shedule;
export const getHolidays = ({ settings }) => settings.holidays;
export const getPaykeeper = ({ settings }) => settings.paykeeper;
export const getPrepayment = ({ settings }) => settings.prepayment;
export const getMailPost = ({ settings }) => settings.mailPost;

export default combineReducers({
  shedule,
  loading,
  error,
  query,
  holidays,
  paykeeper,
  prepayment,
  mailPost
});
