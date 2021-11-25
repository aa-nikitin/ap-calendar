import { combineReducers } from 'redux';
// import pizzas from './pizzas';
import admin from './admin';
import clients from './clients';
import client from './client';
import halls from './halls';
import params from './params';
import plan from './plan';
import prices from './prices';
import settings from './settings';
import discounts from './discounts';
import planDetails from './plan-details';
import payments from './payments';
import services from './services';

export * from './admin';
export * from './clients';
export * from './client';
export * from './halls';
export * from './params';
export * from './plan';
export * from './prices';
export * from './settings';
export * from './discounts';
export * from './plan-details';
export * from './payments';
export * from './services';

export default combineReducers({
  admin,
  clients,
  client,
  halls,
  params,
  plan,
  prices,
  settings,
  discounts,
  planDetails,
  payments,
  services
});
