import React from 'react';
import { Redirect } from 'react-router';
import { useSelector } from 'react-redux';

import { Header } from '../componetns';
import { getLogin } from '../redux/reducers';

const Home = () => {
  const { loginCheck } = useSelector((state) => getLogin(state));

  return !loginCheck ? (
    <Redirect to="/login" />
  ) : (
    <>
      <Header />
      <div>Home</div>
    </>
  );
};

export { Home };
