import React from 'react';
import PropTypes from 'prop-types';

import { PriceForm, BtnAddPrice } from '../componetns';

const PriceHall = ({ idHall }) => {
  return (
    <div className="price-hall">
      <div className="price-hall__btns">
        <div className="price-hall__btn">
          <PriceForm
            // hall={params}
            // onClick={onClick}
            idHall={idHall}
            nameForm="Новая цена"
            CustomBtn={BtnAddPrice({
              name: 'добавить цену'
            })}
          />
        </div>
        <div className="price-hall__btn">
          <PriceForm
            // hall={params}
            // onClick={onClick}
            idHall={idHall}
            nameForm="Редактирование зала"
            CustomBtn={BtnAddPrice({
              name: 'скопировать с зала'
            })}
          />
        </div>
      </div>
    </div>
  );
};

PriceHall.propTypes = {
  idHall: PropTypes.string
};
PriceHall.defaultProps = {
  idHall: ''
};

export { PriceHall };
