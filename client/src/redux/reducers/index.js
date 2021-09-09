import { combineReducers } from 'redux';
// import pizzas from './pizzas';
import admin from './admin';
import clients from './clients';
import client from './client';
import halls from './halls';

export * from './admin';
export * from './clients';
export * from './client';
export * from './halls';

export default combineReducers({ admin, clients, client, halls });
