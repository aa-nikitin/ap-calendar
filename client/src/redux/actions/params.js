import { createActions } from 'redux-actions';

const {
  params: {
    windowSize: setWindowSize,
    pageTplName: setPageTplName,
    workShedule: setWorkShedule,
    priceParams: setPriceParams
  }
} = createActions({
  PARAMS: {
    WINDOW_SIZE: null,
    PAGE_TPL_NAME: null,
    WORK_SHEDULE: null,
    PRICE_PARAMS: null
  }
});

export { setWindowSize, setPageTplName, setWorkShedule, setPriceParams };
