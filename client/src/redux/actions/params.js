import { createActions } from 'redux-actions';

const {
  params: { windowSize: setWindowSize, pageTplName: setPageTplName }
} = createActions({
  PARAMS: {
    WINDOW_SIZE: null,
    PAGE_TPL_NAME: null
  }
});

export { setWindowSize, setPageTplName };
