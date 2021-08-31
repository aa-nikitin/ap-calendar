import { fork } from 'redux-saga/effects';

// import { pizzasWatch } from './pizzas';
import { adminWatch } from './admin';

export function* sagas() {
  // yield fork(pizzasWatch);
  yield fork(adminWatch);
}
