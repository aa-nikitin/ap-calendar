import React from 'react';
import AutorenewIcon from '@material-ui/icons/Autorenew';

const Loading = () => {
  return (
    <div className="loading">
      <AutorenewIcon className="loading__icon" fontSize="large" />
    </div>
  );
};

export { Loading };
