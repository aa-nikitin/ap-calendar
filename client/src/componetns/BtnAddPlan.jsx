import React from 'react';

const BtnAddPlan = ({ thisHourInfo, time, style }) => {
  const contactsList = [
    { name: 'Компания', value: 'company' },
    { name: 'Телефон', value: 'phone' },
    { name: 'E-mail', value: 'mail' }
  ];
  const paidFor = thisHourInfo && thisHourInfo.paidFor ? parseInt(thisHourInfo.paidFor) : 0;
  const price = thisHourInfo ? parseInt(thisHourInfo.price) : 0;
  const discount = thisHourInfo ? parseInt(thisHourInfo.discount) : 0;
  const status = thisHourInfo ? thisHourInfo.status : '';
  const paymentType = thisHourInfo ? thisHourInfo.paymentTypeObj : {};

  return (params) => {
    return thisHourInfo ? (
      <div
        className={`shedule__booking ${
          status === 'application' ? 'shedule--booking-application' : ''
        } ${status === 'completed' ? 'shedule--booking-completed' : ''}`}
        style={style}
        {...params}>
        <div
          className={`shedule-booking ${
            status === 'application' ? 'shedule-booking--application' : ''
          } ${status === 'completed' ? 'shedule-booking--completed' : ''}`}>
          <div className="shedule-booking__head">
            {thisHourInfo.timeRange} {thisHourInfo.clientInfo.name}
          </div>
          <div className="shedule-booking__status">
            <b>{thisHourInfo.statusText}</b>
          </div>
          <div className="shedule-booking__body">
            {!!thisHourInfo.comment && (
              <div className="shedule-booking__item">
                <div className="shedule-booking__value">({thisHourInfo.comment})</div>
              </div>
            )}

            {!!thisHourInfo &&
              contactsList.map(
                ({ name, value }) =>
                  thisHourInfo.clientInfo[value] && (
                    <div key={name} className="shedule-booking__item">
                      <div className="shedule-booking__name">{name}:</div>
                      <div className="shedule-booking__value">{thisHourInfo.clientInfo[value]}</div>
                    </div>
                  )
              )}

            <div className="shedule-booking__item">
              <div className="shedule-booking__value">Аренда, для {thisHourInfo.purposeText}</div>
            </div>
            <div className="shedule-booking__item">
              <div className="shedule-booking__value">будет {thisHourInfo.persons} чел.</div>
            </div>
            {!!price && (
              <div className="shedule-booking__item shedule-booking--price">
                <div className="shedule-booking__value">Итого, {thisHourInfo.priceFormat} руб.</div>
              </div>
            )}
            {!!discount && (
              <div className="shedule-booking__item shedule-booking--discount">
                <div className="shedule-booking__value">
                  (Включая скидку {thisHourInfo.discountFormat} руб.)
                </div>
              </div>
            )}
            <div className="shedule-booking__item shedule-booking--status-pay">
              {paidFor >= price && paymentType.value === 'paid' ? (
                <b>Оплачено полностью</b>
              ) : (
                <b>Осталось оплатить: {price - paidFor} руб.</b>
              )}
            </div>
            {paymentType.value !== 'paid' && (
              <div className="shedule-booking__item">
                <b className="shedule-booking__payment-type">{paymentType.name}</b>
              </div>
            )}
          </div>
        </div>
      </div>
    ) : (
      <button className="shedule__button" data-hour={time} {...params}></button>
    );

    // return <button className="shedule__button" data-hour={time} onClick={onClick}></button>;
  };
};

export { BtnAddPlan };
