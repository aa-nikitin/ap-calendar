import React from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import { ButtonIcon, HallForm } from '../componetns';

const Hall = ({ params, handleDelete, onClick }) => {
  const { _id: id, name, priceFrom, ceilingHeight, square } = params;
  return (
    <div className="hall">
      <div className="hall__item hall--img"></div>
      <div className="hall__item hall--name">
        <div className="hall__head">{name}</div>
        <div className="hall__param">потолок {ceilingHeight} м</div>
        <div className="hall__param">
          площадь {square} м<sup>2</sup>
        </div>
        <div className="hall__param">цена от {priceFrom} руб.</div>
      </div>
      <div className="hall__item hall--price">{priceFrom}</div>
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

export { Hall };
