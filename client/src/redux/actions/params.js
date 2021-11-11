import { createActions } from 'redux-actions';

const {
  params: { windowSize: setWindowSize, pageTplName: setPageTplName, priceParams: setPriceParams }
} = createActions({
  PARAMS: {
    WINDOW_SIZE: null,
    PAGE_TPL_NAME: null,
    PRICE_PARAMS: null
  }
});

export { setWindowSize, setPageTplName, setPriceParams };
