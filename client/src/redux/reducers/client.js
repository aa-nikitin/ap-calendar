import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import moment from 'moment';

import {
  clientFetchRequest,
  clientFetchSuccess,
  clientFetchError,
  clientChangeRequest,
  clientChangeSuccess,
  clientChangeError,
  planClientRequest,
  planClientSuccess,
  planClientError
} from '../actions';

const clientFetch = handleActions(
  {
    [clientFetchRequest]: (_state) => true,
    [clientFetchSuccess]: (_state) => false,
    [clientFetchError]: (_state) => false,
    [clientChangeRequest]: (_state) => true,
    [clientChangeSuccess]: (_state) => false,
    [clientChangeError]: (_state) => false
  },
  false
);
const client = handleActions(
  {
    [clientFetchRequest]: (_state) => {},
    [clientFetchSuccess]: (_state, { payload }) => payload,
    [clientFetchError]: (_state) => {},
    [clientChangeRequest]: (_state, { payload }) => {
      const { firstName, lastName, ...info } = payload.data;
      return { name: { first: firstName, last: lastName }, ...info };
    },
    [clientChangeSuccess]: (_state, { payload }) => payload,
    [clientChangeError]: (_state) => {}
  },
  {}
);
const plansClient = handleActions(
  {
    [planClientRequest]: (_state) => [],
    [planClientSuccess]: (_state, { payload }) => payload,
    [planClientError]: (_state) => []
  },
  []
);
const error = handleActions(
  {
    [clientFetchRequest]: (_state) => null,
    [clientFetchSuccess]: (_state) => null,
    [clientFetchError]: (_state, { payload }) => payload,
    [clientChangeRequest]: (_state) => null,
    [clientChangeSuccess]: (_state) => null,
    [clientChangeError]: (_state, { payload }) => payload
  },
  null
);
const clientId = handleActions(
  {
    [clientFetchRequest]: (_state, { payload }) => payload,
    [clientFetchSuccess]: (_state) => '',
    [clientFetchError]: (_state) => '',
    [clientChangeRequest]: (_state, { payload }) => payload.id,
    [clientChangeSuccess]: (_state) => '',
    [clientChangeError]: (_state) => ''
  },
  ''
);

export const getClient = ({ client }) => client;
export const getClientPlans = createSelector(
  (state) => state.client.plansClient,
  (state) => state.params.priceParams.statusArr,
  (plansClient, statusPlan) => {
    const arrToObj = (arr, key) =>
      arr.reduce((newObj, item) => {
        const newKey = key ? key : 'value';
        newObj[item[newKey]] = item;
        return newObj;
      }, {});
    const statusObj = arrToObj(statusPlan);
    const statusObjNew = { ...statusObj, cancelled: { name: 'Отменен', value: 'cancelled' } };
    const newPlansClient = plansClient.map((item) => {
      const durationHour = Math.floor(item.minutes / 60);
      const durationMinutes = item.minutes - durationHour * 60;
      const durationHourText = durationHour > 0 ? `${durationHour} час. ` : '';
      const durationMinutesText = durationMinutes > 0 ? `${durationMinutes} мин.` : '';
      const itemPlan = {
        id: item._id,
        nameHall: item && item.hall && item.hall.name ? item.hall.name : '',
        orderNumber: item.orderNumber,
        price: item.price,
        discount: item.discount,
        totalPrice: item.price + item.priceService - item.discount,
        dateFrom: moment(item.date).format('DD.MM.YYYY'),
        timeFrom: moment(item.time).format('HH:mm'),
        minutes: `${durationHourText}${durationMinutesText}`,
        status: statusObjNew[item.status].name,
        statusValue: statusObjNew[item.status].value
      };
      return itemPlan;
    });

    return newPlansClient;
  }
);

export default combineReducers({ clientFetch, client, error, clientId, plansClient });
