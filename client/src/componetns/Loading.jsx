import React from 'react';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

const Loading = () => {
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={`modal-box`}
      open={true}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500
      }}>
      <Fade in={true}>
        <div className="loading">
          <AutorenewIcon className="loading__icon" fontSize="large" />
        </div>
      </Fade>
    </Modal>
  );
};

export { Loading };
