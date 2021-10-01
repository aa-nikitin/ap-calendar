import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setPageTplName } from '../redux/actions';

const Discount = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTplName('DISCOUNT'));
  }, [dispatch]);

  return (
    <div className="content-page">
      <h1 className="content-page__title">Скидки и акции</h1>
      <div className="content-page__main">Discount</div>
    </div>
  );
};

export { Discount };
