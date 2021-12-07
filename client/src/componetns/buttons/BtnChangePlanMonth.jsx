import React from 'react';
import PropTypes from 'prop-types';

const BtnChangePlanMonth = ({ thisPlanInfo }) => {
  return (params) => {
    return thisPlanInfo ? (
      <div className="plan-month__item" key={thisPlanInfo.id} {...params}>
        <div className="plan-month__time">
          <div>{thisPlanInfo.timeFrom}</div>
          <div className="plan-month--gray">{thisPlanInfo.timeTo}</div>
        </div>
        <div className="plan-month__name">
          <div>
            Аренда, для {thisPlanInfo.purposeText}{' '}
            <span className="plan-month--gray">#{thisPlanInfo.orderNumber}</span>{' '}
          </div>
          <div className="plan-month--gray">
            Зал - {thisPlanInfo.hall.name}, {thisPlanInfo.persons} чел.
          </div>
        </div>
        <div className="plan-month__client">
          <div className="plan-month--gray">{thisPlanInfo.clientInfo.name}</div>
          <div>{thisPlanInfo.clientInfo.phone}</div>
        </div>
      </div>
    ) : (
      <></>
    );

    // return <button className="shedule__button" data-hour={time} onClick={onClick}></button>;
  };
};

Notification.BtnChangePlanMonth = {
  thisPlanInfo: PropTypes.object
};
Notification.BtnChangePlanMonth = {
  thisPlanInfo: {}
};

export { BtnChangePlanMonth };
