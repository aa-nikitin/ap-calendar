import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import produce from 'immer';

import {
  getPlanDetailsRequest,
  getPlanDetailsSuccess,
  getPlanDetailsError,
  setPlanDetailsVisible,
  getRefreshDetailsRequest,
  getRefreshDetailsSuccess,
  getRefreshDetailsError,
  setPriceInfo,
  removePlanInfoServices,
  setPlanInfoServices,
  changeRecalcPlanInfoRequest,
  changeRecalcPlanInfoSuccess,
  changeRecalcPlanInfoError
} from '../actions';

const loading = handleActions(
  {
    [getPlanDetailsRequest]: (_state) => true,
    [getPlanDetailsSuccess]: (_state) => false,
    [getPlanDetailsError]: (_state) => false,
    [getRefreshDetailsRequest]: (_state) => true,
    [getRefreshDetailsSuccess]: (_state) => false,
    [getRefreshDetailsError]: (_state) => false,
    [changeRecalcPlanInfoRequest]: (_state) => true,
    [changeRecalcPlanInfoSuccess]: (_state) => false,
    [changeRecalcPlanInfoError]: (_state) => false
  },
  false
);
const error = handleActions(
  {
    [getPlanDetailsRequest]: (_state) => null,
    [getPlanDetailsSuccess]: (_state) => null,
    [getPlanDetailsError]: (_state, { payload }) => payload,
    [getRefreshDetailsRequest]: (_state) => null,
    [getRefreshDetailsSuccess]: (_state) => null,
    [getRefreshDetailsError]: (_state, { payload }) => payload,
    [changeRecalcPlanInfoRequest]: (_state) => null,
    [changeRecalcPlanInfoSuccess]: (_state) => null,
    [changeRecalcPlanInfoError]: (_state, { payload }) => payload
  },
  null
);
const details = handleActions(
  {
    [getPlanDetailsRequest]: (_state) => [],
    [getPlanDetailsSuccess]: (_state, { payload }) => payload,
    [getPlanDetailsError]: (_state) => [],
    [getRefreshDetailsRequest]: (_state) => [],
    [getRefreshDetailsSuccess]: (_state, { payload }) => payload,
    [getRefreshDetailsError]: (_state) => [],
    [setPriceInfo]: (state, { payload }) => ({ ...state, priceInfo: payload }),
    [setPlanInfoServices]: (state, { payload }) => {
      const services = state.planInfo.services;
      const newServices = [...services, ...payload.map((item) => item.idService)];
      const nextState = produce(state, (draft) => {
        draft.planInfo.services = newServices;
      });

      return nextState;
    },
    [removePlanInfoServices]: (state, { payload }) => {
      const services = state.planInfo.services;
      const newServices = services.filter((item) => {
        return item !== payload;
      });
      const nextState = produce(state, (draft) => {
        draft.planInfo.services = newServices;
      });

      return nextState;
    },
    [changeRecalcPlanInfoSuccess]: (state, { payload }) => {
      const nextState = produce(state, (draft) => {
        draft.priceInfo = payload.priceInfo;
      });

      return nextState;
    }
  },
  []
);
const query = handleActions(
  {
    [getPlanDetailsRequest]: (_state, { payload }) => payload,
    [getPlanDetailsSuccess]: (_state) => ({}),
    [getPlanDetailsError]: (_state) => ({}),
    [getRefreshDetailsRequest]: (_state, { payload }) => payload,
    [getRefreshDetailsSuccess]: (_state) => ({}),
    [getRefreshDetailsError]: (_state) => ({}),
    [changeRecalcPlanInfoRequest]: (_state, { payload }) => payload,
    [changeRecalcPlanInfoSuccess]: (_state) => ({}),
    [changeRecalcPlanInfoError]: (_state) => ({})
  },
  {}
);
const isVisible = handleActions(
  {
    [getPlanDetailsRequest]: (_state) => true,
    [setPlanDetailsVisible]: (_state, { payload }) => payload
  },
  false
);

export const getPlanDetails = ({ planDetails }) => planDetails;
export const getDetailsOrder = ({ planDetails }) => planDetails.details;
// export const getPlanDetailsServices = ({ planDetails }) => planDetails.details.planInfo.services;

export const getPlanDetailsServices = createSelector(
  (state) => state.planDetails.details.planInfo.services,
  (state) => state.services.list,
  (servicesChecked, services) => {
    const servicesList = services.filter((item) => {
      const indexChecked = servicesChecked.indexOf(item._id);
      return indexChecked < 0;
    });
    return { servicesList, servicesChecked };
  }
);

export default combineReducers({ loading, error, details, query, isVisible });
