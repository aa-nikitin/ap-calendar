import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';

const ButtonIcon = ({ Icon, title, fontSize, onClick, className, type }) => {
  return type ? (
    <Tooltip className={className} title={title} type={type}>
      <IconButton onClick={onClick}>
        <Icon fontSize={fontSize ? fontSize : 'medium'} />
      </IconButton>
    </Tooltip>
  ) : (
    <Tooltip className={className} title={title}>
      <IconButton onClick={onClick}>
        <Icon fontSize={fontSize ? fontSize : 'medium'} />
      </IconButton>
    </Tooltip>
  );
};

ButtonIcon.propTypes = {
  Icon: PropTypes.object,
  title: PropTypes.string,
  fontSize: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  type: PropTypes.string
};
ButtonIcon.defaultProps = {
  Icon: {},
  title: '',
  fontSize: '',
  alionClickgn: () => {},
  className: '',
  type: ''
};

export { ButtonIcon };
