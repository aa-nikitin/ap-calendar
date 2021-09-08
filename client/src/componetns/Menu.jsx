import React from 'react';
import { useDispatch } from 'react-redux';
import TodayIcon from '@material-ui/icons/Today';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import StoreIcon from '@material-ui/icons/Store';
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
      <MenuItem Icon={StoreIcon} linkTo="/company" nameItem="Залы" />
      <MenuItem Icon={PeopleAltIcon} linkTo="/clients" nameItem="Клиенты" />
      <MenuItem Icon={AttachMoneyIcon} linkTo="/finance" nameItem="Финансы" />
      <MenuItem Icon={LoyaltyIcon} linkTo="/discount" nameItem="Скидки" />
      <MenuItem Icon={ExitToAppIcon} onClick={handleLogout} nameItem="Выйти" />
    </div>
  );
};

export { Menu };
