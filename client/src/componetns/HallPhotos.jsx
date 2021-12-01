import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import DeleteIcon from '@mui/icons-material/Delete';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import Button from '@mui/material/Button';

import {
  hallPhotosUploadRequest,
  hallPhotoRemoveRequest,
  hallPhotoCoverRequest
} from '../redux/actions';
import { ButtonIcon } from '../componetns';

import { TransitionsModal } from './';

const HallPhotos = ({ captionButton, align, nameForm, hall, Icon }) => {
  const { _id: id, photos } = hall;
  const inputFile = useRef(null);
  const [files, setFiles] = useState('');
  const [countFiles, setCountFiles] = useState(0);
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setCountFiles(Object.values(e.target.files).length);
    setFiles(e.target.files);
  };
  const handleDelPhoto = (photo) => () => {
    dispatch(hallPhotoRemoveRequest({ idHall: hall._id, idPhoto: photo._id }));
  };
  const handleUpdateCoverPhoto = (photo) => () => {
    dispatch(hallPhotoCoverRequest({ idHall: hall._id, idPhoto: photo._id }));
  };
  const handleLoadPhotos = () => {
    dispatch(hallPhotosUploadRequest({ id, data: files }));
    setCountFiles(0);
  };
  const onInputFileClick = () => inputFile.current.click();

  return (
    <TransitionsModal Icon={Icon} captionButton={captionButton} nameForm={nameForm} align={align}>
      <div className="photo-hall">
        {photos.length > 0 ? (
          <div className="photo-hall__list">
            {photos.map((photo) => {
              return (
                <div className="photo-hall__item" key={photo._id}>
                  <img className="photo-hall__image" src={photo.pathResize} alt="" />
                  <div className="photo-hall__btns">
                    <ButtonIcon
                      Icon={DeleteIcon}
                      fontSize="small"
                      title="Удалить"
                      onClick={handleDelPhoto(photo)}
                    />
                    <ButtonIcon
                      Icon={PermMediaIcon}
                      fontSize="small"
                      title="Сделать обложкой"
                      onClick={handleUpdateCoverPhoto(photo)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="photo-hall__message">Загрузите фотографии, пока тут ничего нет</div>
        )}
        <div className="photo-hall__footer">
          <input
            className="photo-hall__input-file"
            type="file"
            name="photo"
            multiple
            accept="image/*,image/jpeg,image/x-png"
            onChange={handleChange}
            ref={inputFile}
          />
          <Button variant="contained" color="primary" onClick={onInputFileClick}>
            Вабрать файлы
          </Button>
          <div className="photo-hall__info-file">Выбрано файлов: {countFiles} </div>
          <Button
            disabled={countFiles > 0 ? false : true}
            variant="outlined"
            color="primary"
            onClick={handleLoadPhotos}>
            Загрузить
          </Button>
        </div>
      </div>
    </TransitionsModal>
  );
};

HallPhotos.propTypes = {
  captionButton: PropTypes.string,
  align: PropTypes.string,
  hall: PropTypes.object,
  nameForm: PropTypes.string,
  Icon: PropTypes.object
};
HallPhotos.defaultProps = {
  captionButton: '',
  align: '',
  hall: {},
  nameForm: '',
  Icon: null
};

export { HallPhotos };
