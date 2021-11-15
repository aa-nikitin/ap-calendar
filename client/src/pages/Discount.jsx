import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getDiscountsRequest, deleteDiscountsRequest, setPageTplName } from '../redux/actions';
import { DiscountItem, DiscountForm } from '../componetns';
import { getDiscounts } from '../redux/reducers';

const Discount = () => {
  const dispatch = useDispatch();

  const { list: listDiscounts } = useSelector((state) => getDiscounts(state));
  // console.log(listDiscounts);
  useEffect(() => {
    dispatch(getDiscountsRequest());
    dispatch(setPageTplName('DISCOUNT'));
  }, [dispatch]);

  const handleDeleteDiscount = (id) => () => {
    if (window.confirm('Вы действительно хотите отменить заявку?'))
      dispatch(deleteDiscountsRequest(id));
  };

  return (
    <div className="content-page">
      <h1 className="content-page__title">Скидки и акции</h1>
      <div className="content-page__main">
        <div className="content-page__panel content-page--panel-extend">
          <div className="content-page__panel-item">
            <div className="content-page__panel-btn">
              <DiscountForm captionButton="Добавить" nameForm="Новая скидка" />
            </div>
          </div>
        </div>
        <div className="content-page__info">
          <div className="table-list">
            <div className="table-list__head">
              <div className="table-list__head-item table-list--head-goal">Цель брони</div>
              <div className="table-list__head-item table-list--head-condition">Условие</div>
              <div className="table-list__head-item table-list--head-sale">Скидка </div>
              <div className="table-list__head-item table-list--head-buttons-discount"></div>
            </div>
            <div className="table-list__body">
              {listDiscounts.map((item) => {
                return (
                  <div key={item.id} className="table-list__item">
                    <DiscountItem discount={item} handleDeleteDiscount={handleDeleteDiscount} />
                  </div>
                );
              })}

              {/* <div className="table-list__item">
                <DiscountItem />
              </div>
              <div className="table-list__item">
                <DiscountItem />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Discount };
