import React from 'react';
import PropTypes from 'prop-types';

const BtnAddPrice = ({ name }) => {
  return (params) => {
    return (
      <button className="price-hall__button" {...params}>
        {name}
      </button>
    );

    // return <button className="shedule__button" data-hour={time} onClick={onClick}></button>;
  };
};

BtnAddPrice.propTypes = {
  name: PropTypes.string
};
BtnAddPrice.defaultProps = {
  name: ''
};

export { BtnAddPrice };
