import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Loading } from '../componetns';
import { planHallsRequest, setPageTplName } from '../redux/actions';
import { getPlan } from '../redux/reducers';

const hoursArray = [];
const minutesStep = 60;
const hourSize = 60;
let minutesFrom = 9 * hourSize;
const minutesTo = 22 * hourSize;

while (minutesFrom <= minutesTo) {
  const timeH = Math.floor(minutesFrom / hourSize)
    .toString()
    .padStart(2, '0');
  const timeM = Math.floor(minutesFrom % hourSize)
    .toString()
    .padStart(2, '0');
  hoursArray.push({ timeH: timeH, timeM: timeM, minutes: minutesFrom });
  minutesFrom = minutesFrom + minutesStep;
}

const Plan = () => {
  const dispatch = useDispatch();
  const { plan, planFetch } = useSelector((state) => getPlan(state));
  // console.log(animals.slice(-2));
  // console.log(halls.slice(2, 4));
  // console.log(plan);
  useEffect(() => {
    dispatch(planHallsRequest('15.07.2021'));
    dispatch(setPageTplName('PLAN'));
  }, [dispatch]);

  if (planFetch) return <Loading />;
  return (
    <div className="content-page">
      <h1 className="content-page__title">Планирование</h1>
      <div className="content-page__main">
        <div className="content-page__panel content-page--panel-extend">
          <div className="content-page__panel-item">
            <div className="content-page__panel-btn">sad</div>
          </div>
        </div>
        <div className="content-page__info">
          {plan.length > 0 && (
            <div className="shedule">
              <div className="shedule__row">
                <div className="shedule__scale shedule-scale">
                  {hoursArray.map((item) => {
                    const itemCount = item.minutes / minutesStep;
                    const divisorCount = hourSize / minutesStep > 2 ? hourSize / minutesStep : 2;

                    return (
                      <div className="shedule-scale__item" key={item.minutes}>
                        {!(itemCount % divisorCount) && (
                          <div className="shedule-scale__hour">
                            <span>{item.timeH}</span>
                            <em>{item.timeM}</em>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {plan.map((planItem) => {
                  return (
                    <div className="shedule__item" key={planItem.id}>
                      <div className="shedule__head" key={planItem.id}>
                        {planItem.name}
                      </div>
                      <div className="shedule__body">
                        {hoursArray.map((item, key) => {
                          console.log();
                          const itemCount = item.minutes / minutesStep;
                          const thisTime = `${item.timeH}:${item.timeM}`;
                          const thisHourInfo = planItem.plans[thisTime];
                          const style = thisHourInfo && {
                            height: Math.ceil(thisHourInfo.minutes / minutesStep) * 26
                          };
                          const divisorCount =
                            hourSize / minutesStep > 2 ? hourSize / minutesStep : 2;

                          return (
                            <div
                              className={`shedule__hour ${
                                !!(itemCount % divisorCount) ? 'shedule--hour-even' : ''
                              }`}
                              key={item.minutes}>
                              {!(key + 1 === hoursArray.length) && (
                                <>
                                  <button className="shedule__button" data-hour={thisTime}></button>
                                  {thisHourInfo ? (
                                    <div className="shedule__booking" style={style}>
                                      {thisHourInfo.timeRange} {thisHourInfo.clientInfo.name}
                                    </div>
                                  ) : (
                                    ''
                                  )}
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                <div className="shedule__scale shedule--scale-last shedule-scale ">
                  {hoursArray.map((item) => {
                    const itemCount = item.minutes / minutesStep;
                    const divisorCount = hourSize / minutesStep > 2 ? hourSize / minutesStep : 2;

                    return (
                      <div className="shedule-scale__item" key={item.minutes}>
                        {!(itemCount % divisorCount) && (
                          <div className="shedule-scale__hour">
                            <span>{item.timeH}</span>
                            <em>{item.timeM}</em>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { Plan };
