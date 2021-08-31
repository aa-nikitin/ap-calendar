import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutFetchFromToken } from '../redux/actions';

const Header = () => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logoutFetchFromToken());
  };
  return (
    <>
      <div>
        <Link to="/">Главная</Link>
        <Link to="/admin">Админка</Link>
      </div>
      <button onClick={handleLogout}>Выйти</button>
    </>
  );
};

export { Header };
