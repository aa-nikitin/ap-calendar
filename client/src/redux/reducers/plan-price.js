import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import { createSelector } from 'reselect';

import {
  getPlanPriceRequest,
  getPlanPriceSuccess,
  getPlanPriceError,
  addPlanPriceRequest,
  addPlanPriceSuccess,
  addPlanPriceError,
  delPlanPriceRequest,
  delPlanPriceSuccess,
  delPlanPriceError,
  editPlanPriceRequest,
  editPlanPriceSuccess,
  editPlanPriceError,
  servicePlanPriceRequest,
  servicePlanPriceSuccess,
  servicePlanPriceError
} from '../actions';

const loading = handleActions(
  {
    [getPlanPriceRequest]: (_state) => true,
    [getPlanPriceSuccess]: (_state) => false,
    [getPlanPriceError]: (_state) => false,
    [addPlanPriceRequest]: (_state) => true,
    [addPlanPriceSuccess]: (_state) => false,
    [addPlanPriceError]: (_state) => false,
    [delPlanPriceRequest]: (_state) => true,
    [delPlanPriceSuccess]: (_state) => false,
    [delPlanPriceError]: (_state) => false,
    [editPlanPriceRequest]: (_state) => true,
    [editPlanPriceSuccess]: (_state) => false,
    [editPlanPriceError]: (_state) => false,
    [servicePlanPriceRequest]: (_state) => true,
    [servicePlanPriceSuccess]: (_state) => false,
    [servicePlanPriceError]: (_state) => false
  },
  false
);
const error = handleActions(
  {
    [getPlanPriceRequest]: (_state) => null,
    [getPlanPriceSuccess]: (_state) => null,
    [getPlanPriceError]: (_state, { payload }) => payload,
    [addPlanPriceRequest]: (_state) => null,
    [addPlanPriceSuccess]: (_state) => null,
    [addPlanPriceError]: (_state, { payload }) => payload,
    [delPlanPriceRequest]: (_state) => null,
    [delPlanPriceSuccess]: (_state) => null,
    [delPlanPriceError]: (_state, { payload }) => payload,
    [editPlanPriceRequest]: (_state) => null,
    [editPlanPriceSuccess]: (_state) => null,
    [editPlanPriceError]: (_state, { payload }) => payload,
    [servicePlanPriceRequest]: (_state) => null,
    [servicePlanPriceSuccess]: (_state) => null,
    [servicePlanPriceError]: (_state, { payload }) => payload
  },
  null
);
const list = handleActions(
  {
    [getPlanPriceRequest]: (_state) => [],
    [getPlanPriceSuccess]: (_state, { payload }) => payload,
    [getPlanPriceError]: (_state) => [],
    [addPlanPriceSuccess]: (state, { payload }) => [...state, payload],
    [addPlanPriceError]: (_state) => [],
    [delPlanPriceSuccess]: (state, { payload }) => {
      const newList = state.filter((item) => item._id !== payload.id);
      return newList;
    },
    [delPlanPriceError]: (_state) => [],
    [editPlanPriceSuccess]: (state, { payload }) => {
      const newState = state.map((item) => {
        if (item._id === payload.id) {
          return { ...item, ...payload };
        } else return item;
      });

      return newState;
    },
    [editPlanPriceError]: (_state) => [],
    [servicePlanPriceSuccess]: (state, { payload }) => [...state, ...payload],
    [servicePlanPriceError]: (_state) => []
  },
  []
);
const query = handleActions(
  {
    [addPlanPriceRequest]: (_state, { payload }) => payload,
    [addPlanPriceSuccess]: (_state) => ({}),
    [addPlanPriceError]: (_state) => ({}),
    [delPlanPriceRequest]: (_state, { payload }) => payload,
    [delPlanPriceSuccess]: (_state) => ({}),
    [delPlanPriceError]: (_state) => ({}),
    [editPlanPriceRequest]: (_state, { payload }) => payload,
    [editPlanPriceSuccess]: (_state) => ({}),
    [editPlanPriceError]: (_state) => ({}),
    [servicePlanPriceRequest]: (_state, { payload }) => payload,
    [servicePlanPriceSuccess]: (_state) => ({}),
    [servicePlanPriceError]: (_state) => ({})
  },
  {}
);

export const getPlanPrice = ({ planPrice }) => planPrice;

const formatPrice = (priceNum) =>
  priceNum ? priceNum.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ') : 0;

export const getPlanPriceList = createSelector(
  (state) => state.planPrice.list,
  (listPlanPrice) => {
    const newPlanPriceList = listPlanPrice.map((item) => {
      const { price, discount, total } = item;
      const priceFormat = formatPrice(price);
      const discountFormat = formatPrice(discount);
      const totalFormat = formatPrice(total);

      return { ...item, price: priceFormat, discount: discountFormat, total: totalFormat };
    });
    // console.log(newPlanPriceList);
    return newPlanPriceList;
  }
);
// export const getDetailsOrder = ({ planDetails }) => planDetails.details;

export default combineReducers({ loading, error, list, query });
