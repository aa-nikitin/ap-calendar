import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Button from '@mui/material/Button';

import { getWorkShedule, getPlan, getPlanMonth, getPlanCalendar } from '../redux/reducers';
import {
  planDataRequest,
  planFetchAddRequest,
  planMonthRequest,
  getPlanDetailsRequest
} from '../redux/actions';
import { Loading, PlanForm, BtnChangePlanMonth } from '../componetns';
import { monthsConfig } from '../config';

const PlanMonth = ({ valueDate, setValueDate }) => {
  const dispatch = useDispatch();
  const workShedule = useSelector((state) => getWorkShedule(state));
  const { planFetch } = useSelector((state) => getPlan(state));
  const planMonth = useSelector((state) => getPlanMonth(state));
  const planCalendar = useSelector((state) => getPlanCalendar(state));
  const thisDate = moment(valueDate).format('DD.MM.YYYY');
  const handlePlan = (values) => {
    dispatch(planFetchAddRequest({ ...values, typePlan: 'planMonth' }));
  };
  const handlePlanBtn = (obj, thisHourInfo) => (refreshObj) => {
    const workObj = refreshObj ? refreshObj : obj;
    if (!thisHourInfo) dispatch(planDataRequest(workObj));
    else {
      dispatch(planDataRequest({ ...workObj, idPlan: thisHourInfo.id }));
    }
  };
  const handleDateInc = () => {
    setValueDate(moment(valueDate).add(1, 'M'));
  };
  const handleDateDec = () => {
    setValueDate(moment(valueDate).subtract(1, 'M'));
  };
  const handleDateToday = () => {
    setValueDate(new Date());
  };
  const monthDate = Number(moment(valueDate).format('M'));
  const thisMonth = monthsConfig[Number(moment(valueDate).format('M')) - 1];
  const handleDate = (dateSelect) => () => {
    setValueDate(moment(dateSelect, 'DD.MM.YYYY'));
  };
  const handleDetailShedule = (idPlan) => () => {
    dispatch(getPlanDetailsRequest(idPlan));
  };
  useEffect(() => {
    if (Number(moment(thisDate, 'DD.MM.YYYY').format('M')) === monthDate) {
      dispatch(planMonthRequest(thisDate));
    }
  }, [dispatch, thisDate, monthDate]);

  const thisDayPlan =
    planMonth && planMonth[thisDate] && planMonth[thisDate].length > 0 ? planMonth[thisDate] : [];

  if (planFetch) return <Loading />;
  return (
    <div className="content-page__main">
      <div className="content-page__panel content-page--panel-extend">
        <div className="content-page__panel-item">
          <div className="content-page__panel-btn">
            <PlanForm
              onClick={handlePlan}
              captionButton={`+????????????????`}
              nameForm="????????????"
              params={workShedule}
              handleClick={handlePlanBtn({ date: thisDate })}
              thisDate={thisDate}
            />
          </div>
          <div className="content-page__panel-btn">
            <Button variant="outlined" color="primary" onClick={handleDateToday}>
              ??????????????
            </Button>
          </div>
          <div className="content-page__panel-btn">
            {thisMonth} {moment(valueDate).format('YYYY')}
          </div>
          <div className="content-page__panel-btn">
            <Button variant="outlined" color="primary" onClick={handleDateDec}>
              <ArrowBackIosNewIcon />
            </Button>
            <Button variant="outlined" color="primary" onClick={handleDateInc}>
              <ArrowForwardIosIcon />
            </Button>
          </div>
          {/* 
          <div className="content-page__panel-btn">
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
              <MobileDatePicker
                label="????????"
                inputFormat="dd.MM.yyyy"
                value={valueDate}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </div>
           */}
        </div>
      </div>
      <div className="content-page__info content-page--columns">
        <div className="content-page__left calendar">
          <div className="calendar__head">
            <div className="calendar__head-item">????</div>
            <div className="calendar__head-item">????</div>
            <div className="calendar__head-item">????</div>
            <div className="calendar__head-item">????</div>
            <div className="calendar__head-item">????</div>
            <div className="calendar__head-item calendar--border">????</div>
            <div className="calendar__head-item">????</div>
          </div>
          <div className="calendar__body">
            {!!planCalendar &&
              planCalendar.map((item) => {
                const isPlanDay =
                  planMonth && planMonth[item.date] && planMonth[item.date].length > 0;
                return (
                  <div
                    className={`calendar__item-wrap ${
                      item.dayOfWeek === '????' ? 'calendar--border' : ''
                    }`}
                    key={item.date}
                    onClick={handleDate(item.date)}>
                    <div
                      className={`calendar__item ${
                        item.thisMonth !== true ? 'calendar--dim' : ''
                      } ${item.date === thisDate ? 'calendar--active' : ''} ${
                        isPlanDay ? 'calendar--plan-day' : ''
                      }  `}>
                      {item.day}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="content-page__right plan-month">
          {thisDayPlan.length > 0 ? (
            <div className="plan-month__body">
              {thisDayPlan.map((item) => {
                return (
                  <div className="plan-month__item-wrap" key={item.id}>
                    <div className="plan-month__item-info">
                      <PlanForm
                        onClick={handlePlan}
                        nameForm="????????????"
                        params={workShedule}
                        thisHourInfo={item}
                        // handleDeletePlan={handleDeletePlan}
                        handleClick={handlePlanBtn(
                          {
                            idHall: item.hall._id,
                            date: moment(item.date).format('DD.MM.YYYY'),
                            time: moment(item.time).format('HH:mm'),
                            minutes: item.timeMinutes
                          },
                          item
                        )}
                        CustomBtn={BtnChangePlanMonth({
                          thisPlanInfo: item
                        })}
                        thisDate={thisDate}
                      />
                    </div>
                    <div onClick={handleDetailShedule(item.id)} className="plan-month__detail">
                      <ArrowForwardIosIcon />
                    </div>
                  </div>
                  //   <div className="plan-month__item" key={item.id}>
                  //     <div className="plan-month__time">
                  //       <div>{item.timeFrom}</div>
                  //       <div>{item.timeTo}</div>
                  //     </div>
                  //     <div className="plan-month__name">
                  //       <div>
                  //         ????????????, ?????? {item.purposeText} #{item.orderNumber}{' '}
                  //       </div>
                  //       <div>
                  //         ?????? - {item.hall.name}, {item.persons} ??????.
                  //       </div>
                  //     </div>
                  //     <div className="plan-month__client">
                  //       <div>{item.clientInfo.name}</div>
                  //       <div>{item.clientInfo.phone}</div>
                  //     </div>
                  //   </div>
                );
              })}
            </div>
          ) : (
            <div className="plan-month__info">???? ???????? ???????? ?????????????????????? ???? ?????????????????????????? </div>
          )}
        </div>
      </div>
    </div>
  );
};

PlanMonth.propTypes = {
  valueDate: PropTypes.object,
  setValueDate: PropTypes.func
};
PlanMonth.defaultProps = {
  valueDate: {},
  setValueDate: () => {}
};

export { PlanMonth };
