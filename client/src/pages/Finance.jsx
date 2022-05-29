import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TextField from '@mui/material/TextField';
import MobileDateRangePicker from '@mui/lab/MobileDateRangePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import Box from '@mui/material/Box';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Button from '@mui/material/Button';
import ruLocale from 'date-fns/locale/ru';
import moment from 'moment';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { financeGetRequest } from '../redux/actions';
import { ButtonsSwitches, FinanceItem, Loading } from '../componetns';
import { getParamsHalls, getFinance } from '../redux/reducers';

const durationList = [
  { name: 'Сегодня', value: 'today' },
  { name: 'Вчера', value: 'yesterday' },
  { name: 'Неделя', value: 'week' },
  { name: 'Месяц', value: 'month' },
  { name: 'Квартал', value: 'quarter' }
];
const paymentDateList = [
  { name: 'По дате платежа', value: 'byPaymentDate' },
  { name: 'По дате заказа', value: 'byOrderDate' }
];
const operationsList = [
  { name: 'Все операции', value: 'all' },
  { name: 'Поступления', value: 'income' },
  { name: 'Списания', value: 'expenses' }
];
const methodsList = [
  { name: 'Все способы', value: 'all' },
  { name: 'Наличный', value: 'сash' },
  { name: 'Безналичный', value: 'сashless' }
];

const Finance = () => {
  const month = moment().month();
  const startMonth = moment().month(month).startOf('month');
  const endMonth = moment().month(month).endOf('month');
  const [duration, setDuration] = useState('month');
  const [dateRage, setDateRage] = useState([startMonth, endMonth]);
  const [paymentDate, setPaymentDate] = useState('byPaymentDate');
  const [operations, setOperations] = useState('all');
  const [methods, setMethods] = useState('all');
  const [halls, setHalls] = useState('all');
  const hallsArr = useSelector((state) => getParamsHalls(state));
  const {
    list: listFinance,
    total: totalFinance,
    loading
  } = useSelector((state) => getFinance(state));
  const dispatch = useDispatch();
  const changeParams = () => {
    financeGetRequest({
      dateFrom: moment(dateRage[0]).format('DD.MM.YYYY'),
      dateTo: moment(dateRage[1]).format('DD.MM.YYYY'),
      paymentDate,
      operations,
      methods,
      halls
    });
  };
  const handleChangeSwitcher = (elem, value) => {
    if (value) setDuration(value);
    switch (value) {
      case 'today':
        setDateRage([moment(), moment()]);
        break;
      case 'yesterday':
        setDateRage([moment().subtract(1, 'd'), moment().subtract(1, 'd')]);
        break;
      case 'week':
        const week = moment().week();
        const startWeek = moment().week(week).startOf('week').add(1, 'd');
        const endWeek = moment().week(week).endOf('week').add(1, 'd');

        setDateRage([startWeek, endWeek]);
        break;
      case 'month':
        setDateRage([startMonth, endMonth]);
        break;
      case 'quarter':
        const quarter = moment().quarter();
        const startQuarter = moment().quarter(quarter).startOf('quarter');
        const endQuarter = moment().quarter(quarter).endOf('quarter');

        setDateRage([startQuarter, endQuarter]);
        break;
      // case 'worktime':
      //   if (elem.target.value === 'by-time') setVisibleByTime(true);
      //   else setVisibleByTime(false);
      //   break;
      // case 'validityPeriod':
      //   if (elem.target.value === 'limited') setVisibleLimitedPeriod(true);
      //   else setVisibleLimitedPeriod(false);
      //   break;

      default:
        break;
    }
    changeParams();
    // if (switcher === 'roundUp') {
    //   formik.setFieldValue('roundUp', value);
    // } else formik.handleChange(elem);
  };
  const handleDateInc = () => {
    switch (duration) {
      case 'today':
        setDateRage([dateRage[0].add(1, 'd'), dateRage[1].add(1, 'd')]);
        break;
      case 'yesterday':
        setDateRage([dateRage[0].add(1, 'd'), dateRage[1].add(1, 'd')]);
        break;
      case 'week':
        setDateRage([dateRage[0].add(7, 'd'), dateRage[1].add(7, 'd')]);
        break;
      case 'month':
        const dateRageFrom = moment(dateRage[0]).add(1, 'M');
        const month = moment(dateRageFrom).month();
        const dateRageTo = moment(dateRageFrom).month(month).endOf('month');
        setDateRage([dateRageFrom, dateRageTo]);
        break;
      case 'quarter':
        const quarter = moment(dateRage[0]).quarter();
        const quarterNew = quarter === 4 ? 1 : quarter + 1;
        const startQuarter =
          quarter === 4
            ? dateRage[0].add(1, 'Y').quarter(quarterNew).startOf('quarter')
            : dateRage[0].quarter(quarterNew).startOf('quarter');
        const endQuarter =
          quarter === 4
            ? dateRage[1].add(1, 'Y').quarter(quarterNew).endOf('quarter')
            : dateRage[1].quarter(quarterNew).endOf('quarter');

        setDateRage([startQuarter, endQuarter]);
        break;

      default:
        const diffDays = moment(dateRage[1]).diff(moment(dateRage[0]), 'd') + 1;
        setDateRage([
          moment(dateRage[0]).add(diffDays, 'd'),
          moment(dateRage[1]).add(diffDays, 'd')
        ]);
        break;
    }
    changeParams();
    // setValueDate(moment(valueDate).add(1, 'd'));
  };
  const handleDateDec = () => {
    switch (duration) {
      case 'today':
        setDateRage([dateRage[0].subtract(1, 'd'), dateRage[1].subtract(1, 'd')]);
        break;
      case 'yesterday':
        setDateRage([dateRage[0].subtract(1, 'd'), dateRage[1].subtract(1, 'd')]);
        break;
      case 'week':
        setDateRage([dateRage[0].subtract(7, 'd'), dateRage[1].subtract(7, 'd')]);
        break;
      case 'month':
        const dateRageFrom = moment(dateRage[0]).subtract(1, 'M');
        const month = moment(dateRageFrom).month();
        const dateRageTo = moment(dateRageFrom).month(month).endOf('month');
        setDateRage([dateRageFrom, dateRageTo]);
        break;
      case 'quarter':
        const quarter = moment(dateRage[0]).quarter();
        const quarterNew = quarter === 1 ? 4 : quarter - 1;
        const startQuarter =
          quarter === 1
            ? dateRage[0].subtract(1, 'Y').quarter(quarterNew).startOf('quarter')
            : dateRage[0].quarter(quarterNew).startOf('quarter');
        const endQuarter =
          quarter === 1
            ? dateRage[1].subtract(1, 'Y').quarter(quarterNew).endOf('quarter')
            : dateRage[1].quarter(quarterNew).endOf('quarter');

        setDateRage([startQuarter, endQuarter]);
        break;

      default:
        const diffDays = moment(dateRage[1]).diff(moment(dateRage[0]), 'd') + 1;
        setDateRage([
          moment(dateRage[0]).subtract(diffDays, 'd'),
          moment(dateRage[1]).subtract(diffDays, 'd')
        ]);
        break;
    }
    changeParams();
    // setValueDate(moment(valueDate).subtract(1, 'd'));
  };
  const handleChangeDate = (newValue) => {
    setDuration('');
    setDateRage(newValue);
    changeParams();
  };

  const handleChangeSelect = (setValue) => (elem) => {
    setValue(elem.target.value);
    changeParams();
  };
  // const [dateRage, setDateRage] = useState([startMonth, endMonth]);
  // const [paymentDate, setPaymentDate] = useState('byPaymentDate');
  // const [operations, setOperations] = useState('all');
  // const [methods, setMethods] = useState('all');
  // const [halls, setHalls] = useState('all');
  useEffect(() => {
    dispatch(
      financeGetRequest({
        dateFrom: moment(dateRage[0]).format('DD.MM.YYYY'),
        dateTo: moment(dateRage[1]).format('DD.MM.YYYY'),
        paymentDate,
        operations,
        methods,
        halls
      })
    );
  }, [dispatch, dateRage, paymentDate, operations, methods, halls]);

  if (loading) return <Loading />;
  return (
    <div className="content-page">
      <h1 className="content-page__title">Финансы</h1>
      <div className="content-page__main">
        <div className="content-page__panel content-page--panel-extend">
          <div className="content-page__panel-item">
            <div className="content-page__panel-btn">
              <ButtonsSwitches
                values={duration}
                onChange={handleChangeSwitcher}
                listButtons={durationList}
                name="duration"
              />
            </div>
            <div className="content-page__panel-btn">
              <Button variant="outlined" color="primary" onClick={handleDateDec}>
                <ArrowBackIosNewIcon />
              </Button>
              <Button variant="outlined" color="primary" onClick={handleDateInc}>
                <ArrowForwardIosIcon />
              </Button>
            </div>
            <div className="content-page__panel-btn">
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
                <MobileDateRangePicker
                  startText="От"
                  endText="До"
                  value={dateRage}
                  mask="__.__.____"
                  onChange={handleChangeDate}
                  renderInput={(startProps, endProps) => (
                    <>
                      <TextField {...startProps} />
                      <Box sx={{ mx: 2 }}></Box>
                      <TextField {...endProps} />
                    </>
                  )}
                />
              </LocalizationProvider>
            </div>
          </div>
        </div>
        <div className="content-page__panel content-page--panel-extend">
          <div className="content-page__panel-item">
            <div className="content-page__panel-btn">
              <Select
                labelId="hall"
                id="hall"
                value={halls}
                label=""
                onChange={handleChangeSelect(setHalls)}>
                <MenuItem value="all">Все залы</MenuItem>
                {hallsArr.map((itemHall) => (
                  <MenuItem key={itemHall.value} value={itemHall.value}>
                    {itemHall.name}
                  </MenuItem>
                ))}
              </Select>
            </div>

            <div className="content-page__panel-btn">
              <Select
                labelId="paymentDate"
                id="paymentDate"
                value={paymentDate}
                label=""
                onChange={handleChangeSelect(setPaymentDate)}>
                {paymentDateList.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className="content-page__panel-btn">
              <Select
                labelId="operations"
                id="operations"
                value={operations}
                label=""
                onChange={handleChangeSelect(setOperations)}>
                {operationsList.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className="content-page__panel-btn">
              <Select
                labelId="methods"
                id="methods"
                value={methods}
                label=""
                onChange={handleChangeSelect(setMethods)}>
                {methodsList.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>
        </div>
        <div className="content-page__panel">
          <div className="calc-info">
            <div className="calc-info__item">
              <div className="calc-info__head">Доход, руб.</div>
              <div className="calc-info__bottom">
                <div className="calc-info__num">{totalFinance.income}</div>
              </div>
            </div>
            <div className="calc-info__item">
              <div className="calc-info__head">Расход, руб.</div>
              <div className="calc-info__bottom">
                <div className="calc-info__num">{totalFinance.expense}</div>
              </div>
            </div>
            <div className="calc-info__item">
              <div className="calc-info__head">Прибыль, руб.</div>
              <div className="calc-info__bottom">
                <div className="calc-info__num">{totalFinance.profit}</div>
              </div>
            </div>
            <div className="calc-info__item">
              <div className="calc-info__head">Операций</div>
              <div className="calc-info__bottom">
                <div className="calc-info__num">{totalFinance.operations}</div>
                <div className="calc-info__dop-info">
                  <div className="calc-info__dop-info-item">
                    поступлений {totalFinance.receipts}
                  </div>
                  <div className="calc-info__dop-info-item">списаний {totalFinance.offs}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-page__info">
          <div className="table-list table-list--a-width">
            <div className="table-list__head table-list--mobile-head">
              <div className="table-list__head-item table-list--head-goal">Чек</div>
              <div className="table-list__head-item table-list--head-condition">Заказ</div>
              <div className="table-list__head-item table-list--head-sale">Сумма, руб. </div>
              <div className="table-list__head-item table-list--head-buttons-discount"></div>
            </div>
            <div className="table-list__body">
              {/* <div className="table-list__item">
                <FinanceItem />
              </div>
              <div className="table-list__item">
                <FinanceItem />
              </div> */}
              {listFinance.map((item) => {
                return (
                  <div key={item.id} className="table-list__item">
                    <FinanceItem params={item} />
                  </div>
                );
              })}

              {/* <div className="table-list__item">
                <DiscountItem />
              </div>
              <div className="table-list__item">
                <DiscountItem />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Finance };
