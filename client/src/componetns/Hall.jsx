import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PropTypes from 'prop-types';

import { ButtonIcon, HallForm, HallPhotos, PriceHall } from '../componetns';

const Hall = ({ params, prices, handleDelete, onClick }) => {
  const { _id: id, name, priceFrom, ceilingHeight, square, cover, photos } = params;

  return (
    <div className="hall">
      <div className="hall__item hall--img">
        <img src={`${!cover ? './files/common/no-image-340x200.jpg' : cover.pathResize}`} alt="" />
        <HallPhotos
          hall={params}
          onClick={onClick}
          captionButton={`Фотографии${photos.length > 0 ? ` (${photos.length})` : ''}`}
          nameForm="Фотографии зала"
        />
      </div>
      <div className="hall__item hall--name">
        <div className="hall__head">{name}</div>
        <div className="hall__param">ID {id}</div>
        <div className="hall__param">потолок {ceilingHeight} м</div>
        <div className="hall__param">
          площадь {square} м<sup>2</sup>
        </div>
        <div className="hall__param">цена от {priceFrom} руб.</div>
      </div>
      <div className="hall__item hall--price">
        <PriceHall idHall={id} prices={prices} />
      </div>
      <div className="hall__item hall--buttons">
        <ButtonIcon Icon={DeleteIcon} title="Удалить" onClick={handleDelete(id)} />
        <HallForm
          hall={params}
          onClick={onClick}
          Icon={EditIcon}
          captionButton="Изменить"
          nameForm="Редактирование зала"
        />
      </div>
    </div>
  );
};

Hall.propTypes = {
  params: PropTypes.object,
  handleDelete: PropTypes.func,
  onClick: PropTypes.func,
  prices: PropTypes.object
};
Hall.defaultProps = {
  params: {},
  handleDelete: () => {},
  onClick: () => {},
  prices: {}
};

export { Hall };
