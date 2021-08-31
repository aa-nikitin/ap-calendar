import React from 'react';
import { Redirect } from 'react-router';
import { useSelector } from 'react-redux';
import { getLogin } from '../redux/reducers';

const Footer = () => {
  const { loginCheck } = useSelector((state) => getLogin(state));

  // return <div>Footer</div>;
  return loginCheck ? <Redirect to="/" /> : <Redirect to="/login" />;
};

export { Footer };
