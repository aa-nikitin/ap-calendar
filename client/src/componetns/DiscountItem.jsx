import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PropTypes from 'prop-types';

import { ButtonIcon, DiscountForm } from '../componetns';

const DiscountItem = ({ discount, handleDeleteDiscount }) => {
  const { info: infoDiscount } = discount;
  const {
    condition: conditionInfo,
    discount: discountInfo,
    everyHour: everyHourInfo,
    purpose: purposeInfo,
    weekday: weekdayInfo
  } = infoDiscount;
  return (
    <div className="discount-item">
      <div className="discount-item__column discount-item--goal">{purposeInfo}</div>
      <div className="discount-item__column discount-item--condition">
        <div className="discount-item__condition-head">{weekdayInfo}</div>
        {!!conditionInfo && <div className="discount-item__condition-info">{conditionInfo}</div>}
      </div>
      <div className="discount-item__column discount-item--sale">
        <div className="discount-item__sale-head">{discountInfo}</div>
        {everyHourInfo && <div className="discount-item__sale-info">{everyHourInfo}</div>}
      </div>
      <div className="discount-item__column discount-item--buttons">
        <DiscountForm
          discounts={discount}
          /*onClick={onClick}*/
          Icon={EditIcon}
          captionButton="Изменить"
          nameForm="Редактирование скидки"
        />
        <ButtonIcon Icon={DeleteIcon} title="Удалить" onClick={handleDeleteDiscount(discount.id)} />
      </div>
    </div>
  );
};
DiscountItem.propTypes = {
  discount: PropTypes.object,
  handleDeleteDiscount: PropTypes.func
};

DiscountItem.defaultProps = {
  discount: {},
  handleDeleteDiscount: () => {}
};

export { DiscountItem };
