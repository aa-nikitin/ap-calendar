import { fork } from 'redux-saga/effects';

import { adminWatch } from './admin';
import { clientsWatch } from './clients';
import { clientWatch } from './client';
import { hallsWatch } from './halls';
import { planWatch } from './plan';
import { pricesWatch } from './prices';
import { settingsWatch } from './settings';
import { discountsWatch } from './discounts';
import { planDetailsWatch } from './plan-details';
import { paymentsWatch } from './payments';
import { servicesWatch } from './services';
import { financeWatch } from './finance';

export function* sagas() {
  yield fork(adminWatch);
  yield fork(clientsWatch);
  yield fork(clientWatch);
  yield fork(hallsWatch);
  yield fork(planWatch);
  yield fork(pricesWatch);
  yield fork(settingsWatch);
  yield fork(discountsWatch);
  yield fork(planDetailsWatch);
  yield fork(paymentsWatch);
  yield fork(servicesWatch);
  yield fork(financeWatch);
}
