import { fork } from 'redux-saga/effects';

import { clientsWatch } from './clients';
import { clientWatch } from './client';
import { adminWatch } from './admin';

export function* sagas() {
  yield fork(adminWatch);
  yield fork(clientsWatch);
  yield fork(clientWatch);
}
