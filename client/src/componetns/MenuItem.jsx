import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

const MenuItem = ({ Icon, linkTo, nameItem, ...props }) => {
  return (
    <div className="menu__item">
      {linkTo ? (
        <NavLink className="menu-item" to={linkTo} activeClassName="active">
          <div className="menu-item__icon">
            <Icon />
          </div>
          <div className="menu-item__name">{nameItem}</div>
        </NavLink>
      ) : (
        <button className="menu-item" {...props}>
          <div className="menu-item__icon">
            <Icon />
          </div>
          <div className="menu-item__name">{nameItem}</div>
        </button>
      )}
    </div>
  );
};

MenuItem.propTypes = {
  Icon: PropTypes.object,
  linkTo: PropTypes.string,
  nameItem: PropTypes.string
};
MenuItem.defaultProps = {
  Icon: {},
  linkTo: '',
  nameItem: ''
};

export { MenuItem };
