import React from 'react';
import PropTypes from 'prop-types';

const PrettyPrice = ({ price }) => {
  return <>{price ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : 0}</>;
};

PrettyPrice.propTypes = {
  price: PropTypes.number
};
PrettyPrice.defaultProps = {
  price: 0
};

export { PrettyPrice };
