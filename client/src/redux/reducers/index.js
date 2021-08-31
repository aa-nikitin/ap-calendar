import { combineReducers } from 'redux';
// import pizzas from './pizzas';
// import filters from './filters';
// import cart from './cart';
import admin from './admin';

// export * from './pizzas';
// export * from './filters';
// export * from './cart';
export * from './admin';

export default combineReducers({ admin });
