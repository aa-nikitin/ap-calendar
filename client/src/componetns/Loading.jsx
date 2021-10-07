import React from 'react';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';

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
          <div className="loading__backdrop">
            <AutorenewIcon className="loading__icon" fontSize="large" />
          </div>
        </div>
      </Fade>
    </Modal>
  );
};

export { Loading };
