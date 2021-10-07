import React from 'react';

const BtnAddPlan =
  ({ thisHourInfo, time, style }) =>
  (params) => {
    return thisHourInfo ? (
      <div className="shedule__booking" style={style} {...params}>
        {thisHourInfo.timeRange} {thisHourInfo.clientInfo.name}
      </div>
    ) : (
      <button className="shedule__button" data-hour={time} {...params}></button>
    );

    // return <button className="shedule__button" data-hour={time} onClick={onClick}></button>;
  };

export { BtnAddPlan };
