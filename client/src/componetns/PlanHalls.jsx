import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import TextField from '@mui/material/TextField';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import Button from '@mui/material/Button';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ruLocale from 'date-fns/locale/ru';
import PropTypes from 'prop-types';
import useWindowDimensions from '../hooks/useWindowDimensions';

import { Loading, PlanForm, BtnAddPlan } from '../componetns';
import {
  planHallsRequest,
  planDataRequest,
  planFetchAddRequest,
  // planFetchDeleteRequest,
  getPlanDetailsRequest
  // setPlanDetailsVisible
} from '../redux/actions';
import { getPlan, getWorkShedule } from '../redux/reducers';

const PlanHalls = ({ valueDate, setValueDate }) => {
  const itemWidthMobile = 240;
  const dispatch = useDispatch();
  const { plan, planFetch } = useSelector((state) => getPlan(state));
  const workShedule = useSelector((state) => getWorkShedule(state));
  const { list: hoursArray, minutesStep, hourSize } = workShedule;
  const { width } = useWindowDimensions();
  const handlePlan = (values) => {
    dispatch(planFetchAddRequest({ ...values, typePlan: 'planHalls' }));
  };
  // const handleDeletePlan = (dataPlan) => () => {
  //   if (window.confirm('Вы действительно хотите отменить заявку?')) {
  //     dispatch(planFetchDeleteRequest(dataPlan));
  //   }
  // };
  const handlePlanBtn = (obj, thisHourInfo) => (refreshObj) => {
    const workObj = refreshObj ? refreshObj : obj;
    if (!thisHourInfo) dispatch(planDataRequest(workObj));
    else {
      dispatch(planDataRequest({ ...workObj, idPlan: thisHourInfo.id }));
    }
  };
  const handleDateChange = (newValue) => {
    setValueDate(newValue);
  };
  const handleDateInc = () => {
    setValueDate(moment(valueDate).add(1, 'd'));
  };
  const handleDateDec = () => {
    setValueDate(moment(valueDate).subtract(1, 'd'));
  };
  const handleDateToday = () => {
    setValueDate(new Date());
  };
  const thisDate = moment(valueDate).format('DD.MM.YYYY');

  const handleDetailShedule = (idPlan) => () => {
    dispatch(getPlanDetailsRequest(idPlan));
  };
  useEffect(() => {
    dispatch(planHallsRequest(thisDate));
  }, [dispatch, thisDate]);
  if (planFetch) return <Loading />;

  return (
    <div className="content-page__main">
      <div className="content-page__panel content-page--panel-extend">
        <div className="content-page__panel-item">
          <div className="content-page__panel-btn">
            <PlanForm
              onClick={handlePlan}
              captionButton={`+Добавить`}
              nameForm="Аренда"
              params={workShedule}
              handleClick={handlePlanBtn({ date: thisDate })}
              setValueDate={setValueDate}
            />
          </div>
          <div className="content-page__panel-btn">
            <Button variant="outlined" color="primary" onClick={handleDateToday}>
              Сегодня
            </Button>
          </div>
          <div className="content-page__panel-btn">
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
              <MobileDatePicker
                label="Дата"
                inputFormat="dd.MM.yyyy"
                value={valueDate}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </div>
          <div className="content-page__panel-btn">
            <Button variant="outlined" color="primary" onClick={handleDateDec}>
              <ArrowBackIosNewIcon />
            </Button>
            <Button variant="outlined" color="primary" onClick={handleDateInc}>
              <ArrowForwardIosIcon />
            </Button>
          </div>
        </div>
      </div>
      <div className="content-page__info">
        {plan.length > 0 && (
          <div className="shedule">
            <div
              className="shedule__row"
              style={width <= 1170 ? { width: plan.length * itemWidthMobile } : {}}>
              <div className="shedule__scale shedule-scale">
                {hoursArray.map((item) => {
                  const itemCount = item.minutes / minutesStep;
                  const divisorCount = hourSize / minutesStep > 2 ? hourSize / minutesStep : 2;

                  return (
                    <div className="shedule-scale__item" key={item.minutes}>
                      {!(itemCount % divisorCount) && (
                        <div className="shedule-scale__hour">
                          <span>{item.timeH === '24' ? '00' : item.timeH}</span>
                          <em>{item.timeM}</em>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {plan.map((planItem) => {
                return (
                  <div
                    className="shedule__item"
                    key={planItem.id}
                    style={width <= 1170 ? { width: itemWidthMobile } : {}}>
                    <div className="shedule__head" key={planItem.id}>
                      {planItem.name}
                    </div>
                    <div className="shedule__body">
                      {hoursArray.map((item, key) => {
                        const itemCount = item.minutes / minutesStep;
                        const thisTime = `${item.timeH}:${item.timeM}`;
                        const thisTimeHalfHour =
                          !(minutesStep % hourSize) &&
                          !!planItem.plans[thisTime.replace('00', '30')]
                            ? thisTime.replace('00', '30')
                            : thisTime;
                        const thisHourInfo = planItem.plans[thisTimeHalfHour];
                        const style = thisHourInfo && {
                          height: Math.ceil(thisHourInfo.minutes / minutesStep) * 26
                        };
                        const divisorCount =
                          hourSize / minutesStep > 2 ? hourSize / minutesStep : 2;
                        const paidSumm =
                          thisHourInfo && thisHourInfo.paidSumm > 0 ? thisHourInfo.paidSumm : 0;

                        return (
                          <div
                            className={`shedule__hour ${
                              !!(itemCount % divisorCount) ? 'shedule--hour-even' : ''
                            }`}
                            key={item.minutes}>
                            {!(key + 1 === hoursArray.length) && (
                              <div className="shedule__cell">
                                {!!thisHourInfo && (
                                  <div
                                    onClick={handleDetailShedule(thisHourInfo.id)}
                                    className="shedule__detail">
                                    Подробнее
                                  </div>
                                )}

                                <PlanForm
                                  onClick={handlePlan}
                                  nameForm="Аренда"
                                  params={workShedule}
                                  thisHourInfo={thisHourInfo}
                                  thisDate={thisDate}
                                  setValueDate={setValueDate}
                                  // handleDeletePlan={handleDeletePlan}
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
                                    style,
                                    paidSumm,
                                    hallName: planItem.name
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
                          <span>{item.timeH === '24' ? '00' : item.timeH}</span>
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
  );
};
PlanHalls.propTypes = {
  valueDate: PropTypes.object,
  setValueDate: PropTypes.func
};
PlanHalls.defaultProps = {
  valueDate: {},
  setValueDate: () => {}
};

export { PlanHalls };
