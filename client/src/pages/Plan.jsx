import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Loading, PlanForm, BtnAddPlan } from '../componetns';
import {
  planHallsRequest,
  setPageTplName,
  planDataRequest,
  planFetchAddRequest
} from '../redux/actions';
import { getPlan, getParams } from '../redux/reducers';

const Plan = () => {
  const dispatch = useDispatch();
  const { plan, planFetch, planPopupFetch } = useSelector((state) => getPlan(state));
  const { workShedule } = useSelector((state) => getParams(state));
  const { list: hoursArray, minutesStep, hourSize } = workShedule;
  const handlePlan = (values) => {
    console.log(values);
    dispatch(planFetchAddRequest(values));
  };
  const handlePlanBtn = (obj, thisHourInfo) => (refreshObj) => {
    const workObj = refreshObj ? refreshObj : obj;
    if (!thisHourInfo) dispatch(planDataRequest(workObj));
    else {
      dispatch(planDataRequest({ ...workObj, idPlan: thisHourInfo.id }));
      // console.log(thisHourInfo.id, obj);
    }
  };
  // console.log(animals.slice(-2));
  // console.log(halls.slice(2, 4));
  // console.log(plan);
  const thisDate = '15.07.2021';
  useEffect(() => {
    dispatch(planHallsRequest(thisDate));
    dispatch(setPageTplName('PLAN'));
  }, [dispatch]);

  // const handleClick = () => {
  //   handlePlanBtn({ date: thisDate });
  // };

  if (planFetch) return <Loading />;
  return (
    <>
      <div className="content-page">
        <h1 className="content-page__title">Планирование</h1>
        <div className="content-page__main">
          <div className="content-page__panel content-page--panel-extend">
            <div className="content-page__panel-item">
              <div className="content-page__panel-btn">sad</div>
            </div>
          </div>
          <PlanForm
            onClick={handlePlan}
            captionButton={`+Добавить`}
            nameForm="Аренда"
            params={workShedule}
            handleClick={handlePlanBtn({ date: thisDate })}
          />
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
                                  <div className="shedule__cell">
                                    <PlanForm
                                      onClick={handlePlan}
                                      nameForm="Аренда"
                                      params={workShedule}
                                      thisHourInfo={thisHourInfo}
                                      handleClick={handlePlanBtn(
                                        {
                                          idHall: planItem.id,
                                          date: thisDate,
                                          time: thisTime,
                                          minutes: item.minutes
                                        },
                                        thisHourInfo
                                      )}
                                      CustomBtn={BtnAddPlan({
                                        thisHourInfo,
                                        time: thisTime,
                                        style
                                      })}
                                    />
                                  </div>
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
      {planPopupFetch && <Loading />}
    </>
  );
};

export { Plan };
