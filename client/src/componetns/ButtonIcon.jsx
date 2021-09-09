import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';

const ButtonIcon = ({ Icon, title, onClick }) => {
  return (
    <Tooltip title={title}>
      <IconButton onClick={onClick}>
        <Icon />
      </IconButton>
    </Tooltip>
  );
};

ButtonIcon.propTypes = {
  Icon: PropTypes.object,
  title: PropTypes.string,
  onClick: PropTypes.func
};
ButtonIcon.defaultProps = {
  Icon: {},
  title: '',
  alionClickgn: () => {}
};

export { ButtonIcon };
