import React from 'react';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';

import { ButtonIcon } from './';

const TransitionsModal = ({ children, captionButton, align, nameForm, Icon }) => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {Icon ? (
        <ButtonIcon Icon={Icon} title={captionButton} onClick={handleOpen} />
      ) : (
        <Button variant="outlined" color="primary" onClick={handleOpen}>
          {captionButton}
        </Button>
      )}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={`modal-box ${align === 'center' ? 'modal-box--center' : ''}`}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}>
        <Fade in={open}>
          <div className="modal-box__wrap">
            <div className="modal-box__paper">
              <div className="modal-box__header">
                <div className="modal-box__name">{nameForm}</div>
                <button className="modal-box__close" onClick={handleClose}>
                  <CloseIcon />
                </button>
              </div>
              <div className="modal-box__body">{children}</div>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

TransitionsModal.propTypes = {
  children: PropTypes.object,
  captionButton: PropTypes.string,
  align: PropTypes.string,
  nameForm: PropTypes.string,
  Icon: PropTypes.object
};
TransitionsModal.defaultProps = {
  children: {},
  captionButton: '',
  align: '',
  nameForm: '',
  Icon: null
};

export { TransitionsModal };
