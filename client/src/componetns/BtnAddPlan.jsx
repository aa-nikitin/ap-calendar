import React from 'react';

const BtnAddPlan = ({ thisHourInfo, time, style }) => {
  const contactsList = [
    { name: 'Компания', value: 'company' },
    { name: 'Телефон', value: 'phone' },
    { name: 'E-mail', value: 'mail' }
  ];
  return (params) => {
    return thisHourInfo ? (
      <div className="shedule__booking " style={style} {...params}>
        <div className="shedule-booking">
          <div className="shedule-booking__head">
            {thisHourInfo.timeRange} {thisHourInfo.clientInfo.name}
          </div>
          <div className="shedule-booking__body">
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
