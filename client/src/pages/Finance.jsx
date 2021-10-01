import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setPageTplName } from '../redux/actions';

const Finance = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTplName('FINANCE'));
  }, [dispatch]);

  return (
    <div className="content-page">
      <h1 className="content-page__title">Финансы</h1>
      <div className="content-page__main">Finance</div>
    </div>
  );
};

export { Finance };
