import React from 'react';
import PropTypes from 'prop-types';

const Notification = ({ Icon, text, dopClass }) => {
  return (
    <div className={`notification ${dopClass}`}>
      <Icon className="notification__icon" />
      <div className="notification__text">{text}</div>
    </div>
  );
};

Notification.propTypes = {
  //   Icon: PropTypes.object,
  text: PropTypes.string,
  dopClass: PropTypes.string
};
Notification.defaultProps = {
  //   Icon: {},
  text: '',
  dopClass: ''
};

export { Notification };
