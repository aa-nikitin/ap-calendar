import React from 'react';
import { useDispatch } from 'react-redux';
import TodayIcon from '@mui/icons-material/Today';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import StoreIcon from '@mui/icons-material/Store';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

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
      <MenuItem Icon={StoreIcon} linkTo="/halls" nameItem="Залы" />
      <MenuItem Icon={PeopleAltIcon} linkTo="/clients" nameItem="Клиенты" />
      <MenuItem Icon={AttachMoneyIcon} linkTo="/finance" nameItem="Финансы" />
      <MenuItem Icon={LoyaltyIcon} linkTo="/discount" nameItem="Скидки" />
      <MenuItem Icon={ExitToAppIcon} onClick={handleLogout} nameItem="Выйти" />
    </div>
  );
};

export { Menu };
