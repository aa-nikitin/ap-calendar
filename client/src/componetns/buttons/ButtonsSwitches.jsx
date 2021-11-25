import React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import PropTypes from 'prop-types';

const ButtonsSwitches = ({ values, valuesArr, onChange, listButtons, name, exclusive }) => {
  return (
    <ToggleButtonGroup
      value={exclusive ? values : valuesArr}
      exclusive={exclusive}
      onChange={onChange}>
      {listButtons.map((item) => (
        <ToggleButton key={item.value} name={name} value={item.value}>
          {item.name}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

ButtonsSwitches.propTypes = {
  values: PropTypes.string,
  valuesArr: PropTypes.array,
  onChange: PropTypes.func,
  listButtons: PropTypes.array,
  name: PropTypes.string,
  exclusive: PropTypes.bool
};
ButtonsSwitches.defaultProps = {
  values: '',
  valuesArr: [],
  onChange: () => {},
  listButtons: [],
  name: '',
  exclusive: true
};

export { ButtonsSwitches };
