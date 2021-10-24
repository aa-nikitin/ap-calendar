import React from 'react';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';

import { ButtonIcon } from './';
const TransitionsModal = ({
  children,
  captionButton,
  align,
  nameForm,
  Icon,
  CustomBtn,
  nameClass,
  handleClick,
  closeModal
}) => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    if (handleClick) handleClick();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {Icon ? <ButtonIcon Icon={Icon} title={captionButton} onClick={handleOpen} /> : <></>}
      {CustomBtn ? <CustomBtn onClick={handleOpen} /> : <></>}
      {!Icon && !CustomBtn ? (
        <Button variant="outlined" color="primary" onClick={handleOpen}>
          {captionButton}
        </Button>
      ) : (
        <> </>
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
          <div className={`modal-box__wrap ${nameClass ? `modal-box--wrap-${nameClass}` : ''}`}>
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
  Icon: PropTypes.object,
  CustomBtn: PropTypes.func,
  nameClass: PropTypes.string,
  handleClick: PropTypes.func
};
TransitionsModal.defaultProps = {
  children: {},
  captionButton: '',
  align: '',
  nameForm: '',
  Icon: null,
  CustomBtn: null,
  nameClass: '',
  handleClick: null
};

export { TransitionsModal };
