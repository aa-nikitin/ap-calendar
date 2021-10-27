import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { PriceForm, PriceCopyForm, BtnAddPrice } from '../componetns';
import { delAllPricesRequest } from '../redux/actions';

const PriceHall = ({ idHall, prices }) => {
  const dispatch = useDispatch();
  // const { loading } = useSelector((state) => getPrices(state));

  const handleDelAllPrices = (idHall) => () => {
    if (window.confirm('Вы действительно хотите удалить все цены для данного зала?')) {
      dispatch(delAllPricesRequest({ idHall }));
    }
  };

  const pricesArr = Object.keys(prices);
  // console.log(pricesArr);
  return (
    <div className="price-hall">
      {pricesArr.map((item) => {
        return (
          <div className="price-hall__list price-list" key={item}>
            <div className="price-list__head">{prices[item].name}</div>
            <div className="price-list__list">
              {prices[item].list.map((itemPrice) => (
                <div className="price-list__str" key={itemPrice.id}>
                  {itemPrice.info}
                  <div className="price-list__str-price">
                    <PriceForm
                      prices={itemPrice.obj}
                      idHall={idHall}
                      nameForm="Редактирование цены"
                      CustomBtn={BtnAddPrice({
                        name: itemPrice.price
                      })}
                    />
                  </div>
                  {itemPrice.fromHours}
                </div>
              ))}
            </div>
          </div>
        );
      })}
      <div className="price-hall__btns">
        <div className="price-hall__btn">
          <PriceForm
            idHall={idHall}
            nameForm="Новая цена"
            CustomBtn={BtnAddPrice({
              name: 'добавить цену'
            })}
          />
        </div>
        <div className="price-hall__btn">
          <PriceCopyForm
            idHall={idHall}
            nameForm="Копирование цен"
            CustomBtn={BtnAddPrice({
              name: 'скопировать с зала'
            })}
          />
        </div>
        {pricesArr.length > 0 && (
          <div className="price-hall__btn">
            <button className="price-hall__button" onClick={handleDelAllPrices(idHall)}>
              удалить цены
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

PriceHall.propTypes = {
  idHall: PropTypes.string,
  prices: PropTypes.object
};
PriceHall.defaultProps = {
  idHall: '',
  prices: {}
};

export { PriceHall };
