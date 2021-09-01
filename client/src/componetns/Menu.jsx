import React from 'react';
import { useDispatch } from 'react-redux';
import TodayIcon from '@material-ui/icons/Today';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import FaceIcon from '@material-ui/icons/Face';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { MenuItem } from './index';
import { logoutFetchFromToken } from '../redux/actions';

const Menu = () => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logoutFetchFromToken());
  };
  return (
    <div className="menu">
      <MenuItem Icon={TodayIcon} linkTo="/plan" nameItem="Учет" />
      <MenuItem Icon={PeopleAltIcon} linkTo="/clients" nameItem="Клиенты" />
      <MenuItem Icon={AttachMoneyIcon} linkTo="/finance" nameItem="Финансы" />
      <MenuItem Icon={LoyaltyIcon} linkTo="/discount" nameItem="Скидки" />
      <MenuItem Icon={FaceIcon} linkTo="/company" nameItem="Профиль" />
      <MenuItem Icon={ExitToAppIcon} onClick={handleLogout} nameItem="Выйти" />
    </div>
  );
};

export { Menu };
