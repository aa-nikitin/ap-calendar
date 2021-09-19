import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';

const ButtonIcon = ({ Icon, title, fontSize, onClick }) => {
  return (
    <Tooltip title={title}>
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
  onClick: PropTypes.func
};
ButtonIcon.defaultProps = {
  Icon: {},
  title: '',
  fontSize: '',
  alionClickgn: () => {}
};

export { ButtonIcon };
