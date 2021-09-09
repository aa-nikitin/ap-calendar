import { fork } from 'redux-saga/effects';

import { adminWatch } from './admin';
import { clientsWatch } from './clients';
import { clientWatch } from './client';
import { hallsWatch } from './halls';

export function* sagas() {
  yield fork(adminWatch);
  yield fork(clientsWatch);
  yield fork(clientWatch);
  yield fork(hallsWatch);
}
