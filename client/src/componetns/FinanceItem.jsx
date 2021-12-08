import React from 'react';
// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// import { ButtonIcon, DiscountForm } from '../componetns';

const FinanceItem = ({ params }) => {
  const {
    id,
    paymentDate,
    clientName,
    paymentType,
    orderNumber,
    idPlan,
    dateOrder,
    datePlan,
    nameHall,
    personsPlan,
    paymentSum,
    paymentWay
  } = params;
  // const {
  //   condition: conditionInfo,
  //   discount: discountInfo,
  //   everyHour: everyHourInfo,
  //   purpose: purposeInfo,
  //   weekday: weekdayInfo
  // } = infoDiscount;
  return (
    <div className="discount-item">
      <div className="discount-item__column discount-item--goal">
        <div className="discount-item__item discount-item--gray-item">
          №{id} от {paymentDate}
        </div>
        <div className="discount-item__item">{clientName}</div>
        <div className="discount-item__item discount-item--gray-item">
          {paymentType === 'income' ? 'Оказание услуг' : 'Возврат средств клиенту'}
        </div>
      </div>
      <div className="discount-item__column discount-item--condition">
        <div className="discount-item__item">
          <Link target="_blank" className="" to={`./detail-plan/${idPlan}`}>
            №{orderNumber}
          </Link>{' '}
          от {dateOrder}
        </div>
        <div className="discount-item__item discount-item--gray-item">{datePlan}</div>
        <div className="discount-item__item">Аренда</div>
        <div className="discount-item__item discount-item--gray-item">
          {nameHall}, {personsPlan} чел.
        </div>
      </div>
      <div className="discount-item__column discount-item--sale">
        <div
          className={`discount-item__item discount-item--price ${
            paymentType === 'income' ? 'discount-item--green' : ''
          }`}>
          {paymentType === 'income' ? '+' : '-'}
          {paymentSum}
        </div>
        <div className="discount-item__item discount-item--gray-item">{paymentWay}</div>
        {/* {everyHourInfo && <div className="discount-item__sale-info">{everyHourInfo}</div>} */}
      </div>
      {/* <div className="discount-item__column discount-item--buttons">
        <DiscountForm
          discounts={discount}
          Icon={EditIcon}
          captionButton="Изменить"
          nameForm="Редактирование скидки"
        />
        <ButtonIcon Icon={DeleteIcon} title="Удалить"  />
      </div> */}
    </div>
  );
};
FinanceItem.propTypes = {
  params: PropTypes.object
};

FinanceItem.defaultProps = {
  params: {}
};

export { FinanceItem };
