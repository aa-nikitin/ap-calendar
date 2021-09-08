import { combineReducers } from 'redux';
// import pizzas from './pizzas';
// import filters from './filters';
import admin from './admin';
import clients from './clients';
import client from './client';

// export * from './pizzas';
export * from './admin';
export * from './clients';
export * from './client';

export default combineReducers({ admin, clients, client });
