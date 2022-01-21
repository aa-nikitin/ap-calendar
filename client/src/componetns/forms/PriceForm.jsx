import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import moment from 'moment';
import * as yup from 'yup';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import TimePicker from '@mui/lab/TimePicker';
import TextField from '@mui/material/TextField';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import ruLocale from 'date-fns/locale/ru';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import { ButtonsSwitches, Loading, TransitionsModal } from '../../componetns';
import { getPriceParams, getPrices } from '../../redux/reducers';
import { addPriceRequest, deletePriceRequest, editPriceRequest } from '../../redux/actions';

const validationSchema = yup.object({
  purpose: yup.string('Цель аренды'),
  weekday: yup.string('Дни недели'),
  worktime: yup.string('Время'),
  fromHours: yup.number('От скольки часов').typeError('Должно быть числом'),
  fromPersons: yup.number('От скольки человек').typeError('Должно быть числом'),
  toPersons: yup.number('До скольки человек').typeError('Должно быть числом'),
  validityPeriod: yup.string('Срок действия'),
  price: yup.string('Цена'),
  priceSum: yup.string('Цена').required('Поле обязательное для заполнения'),
  // daysOfWeek: yup.array('Список дней недели'),
  timeFrom: yup.date('Время от'),
  timeTo: yup.date('Время до'),
  dateFrom: yup.date('Дата от'),
  dateTo: yup.date('Дата до'),
  priority: yup
    .number('Приоритет')
    .required('Поле обязательное для заполнения')
    .typeError('Должно быть числом'),
  roundUp: yup.boolean('Округлять')
});

const PriceForm = ({ idHall, prices, captionButton, align, nameForm, CustomBtn, handleClick }) => {
  const dispatch = useDispatch();
  const [visibleDaysOfWeek, setVisibleDaysOfWeek] = useState(
    prices && prices.weekday === 'by-days' ? true : false
  );
  const [visibleByTime, setVisibleByTime] = useState(
    prices && prices.worktime === 'by-time' ? true : false
  );
  const [visibleLimitedPeriod, setVisibleLimitedPeriod] = useState(
    prices && prices.validityPeriod === 'limited' ? true : false
  );
  const { purposeArr, weekdayArr, worktimeArr, validityPeriodArr, priceArr, daysOfWeekArr } =
    useSelector((state) => getPriceParams(state));
  const { loading } = useSelector((state) => getPrices(state));
  const priceId = prices && prices._id ? prices._id : '';

  const initialValues = {
    purpose: prices ? prices.purpose : purposeArr[0].value,
    weekday: prices ? prices.weekday : weekdayArr[0].value,
    daysOfWeek: prices ? prices.daysOfWeek : [],
    worktime: prices ? prices.worktime : worktimeArr[0].value,
    timeFrom: prices && prices.timeFrom ? prices.timeFrom : new Date(),
    timeTo: prices && prices.timeTo ? prices.timeTo : new Date(),
    fromHours: prices ? prices.fromHours : '',
    fromPersons: prices ? prices.fromPersons : '',
    toPersons: prices ? prices.toPersons : '',
    validityPeriod: prices ? prices.validityPeriod : validityPeriodArr[0].value,
    dateFrom: prices && prices.dateFrom ? prices.dateFrom : new Date(),
    dateTo: prices && prices.dateTo ? prices.dateTo : new Date(),
    price: prices ? prices.price : priceArr[0].value,
    priceSum: prices ? prices.priceSum : '',
    priority: prices ? prices.priority : 0,
    roundUp: prices ? prices.roundUp : false
  };
  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const dateFrom = moment(values.dateFrom).format('DD.MM.YYYY');
      const dateTo = moment(values.dateTo).format('DD.MM.YYYY');
      const timeFrom = moment(values.timeFrom).format('HH:mm');
      const timeTo = moment(values.timeTo).format('HH:mm');

      if (!priceId) {
        dispatch(addPriceRequest({ ...values, dateFrom, dateTo, timeFrom, timeTo, idHall }));
        formik.setFieldValue('purpose', purposeArr[0].value);
        formik.setFieldValue('weekday', weekdayArr[0].value);
        formik.setFieldValue('daysOfWeek', []);
        formik.setFieldValue('worktime', worktimeArr[0].value);
        formik.setFieldValue('timeFrom', new Date());
        formik.setFieldValue('timeTo', new Date());
        formik.setFieldValue('fromHours', '');
        formik.setFieldValue('fromPersons', '');
        formik.setFieldValue('toPersons', '');
        formik.setFieldValue('validityPeriod', validityPeriodArr[0].value);
        formik.setFieldValue('dateFrom', new Date());
        formik.setFieldValue('dateTo', new Date());
        formik.setFieldValue('price', priceArr[0].value);
        formik.setFieldValue('priceSum', '');
        formik.setFieldValue('priority', 0);
        formik.setFieldValue('roundUp', false);
        setVisibleDaysOfWeek(false);
        setVisibleByTime(false);
        setVisibleLimitedPeriod(false);
      } else
        dispatch(
          editPriceRequest({
            id: priceId,
            list: { ...values, dateFrom, dateTo, timeFrom, timeTo, idHall }
          })
        );
    }
  });

  const handleDaysOfWeekArr = (_, value) => formik.setFieldValue('daysOfWeek', value);
  const handleChangeByTime = (nameField) => (elem) => formik.setFieldValue(nameField, elem);
  const handleChangeSwitcher = (switcher) => (elem, value) => {
    switch (switcher) {
      case 'weekday':
        if (elem.target.value === 'by-days') setVisibleDaysOfWeek(true);
        else setVisibleDaysOfWeek(false);
        break;
      case 'worktime':
        if (elem.target.value === 'by-time') setVisibleByTime(true);
        else setVisibleByTime(false);
        break;
      case 'validityPeriod':
        if (elem.target.value === 'limited') setVisibleLimitedPeriod(true);
        else setVisibleLimitedPeriod(false);
        break;

      default:
        break;
    }
    if (switcher === 'roundUp') {
      formik.setFieldValue('roundUp', value);
    } else formik.handleChange(elem);
  };
  const handleDeletePrice = () => {
    dispatch(deletePriceRequest({ id: priceId }));
  };

  return loading ? (
    <Loading />
  ) : (
    <TransitionsModal
      captionButton={captionButton}
      nameForm={nameForm}
      align={align}
      CustomBtn={CustomBtn}
      handleClick={handleClick}
      nameClass="plan-form">
      <form className="form-box" onSubmit={formik.handleSubmit}>
        <div className="form-box__body">
          <div className="form-box__row">
            <div className="form-box__head">Цель аренды</div>
            <ButtonsSwitches
              values={formik.values.purpose}
              onChange={formik.handleChange}
              listButtons={purposeArr}
              name="purpose"
            />
          </div>
          <div className="form-box__row">
            <div className="form-box__head">Дни недели</div>
            <ButtonsSwitches
              values={formik.values.weekday}
              onChange={handleChangeSwitcher('weekday')}
              listButtons={weekdayArr}
              name="weekday"
            />
          </div>
          {visibleDaysOfWeek && (
            <div className="form-box__row">
              <ButtonsSwitches
                valuesArr={formik.values.daysOfWeek}
                onChange={handleDaysOfWeekArr}
                listButtons={daysOfWeekArr}
                name="daysOfWeek"
                exclusive={false}
              />
            </div>
          )}
          <div className="form-box__row">
            <div className="form-box__head">Время</div>
            <ButtonsSwitches
              values={formik.values.worktime}
              onChange={handleChangeSwitcher('worktime')}
              listButtons={worktimeArr}
              name="worktime"
            />
          </div>

          {visibleByTime && (
            <div className="form-box__row">
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
                <div className="fields-row">
                  <div className="fields-row__item">
                    <div className="fields-row__name">с</div>
                    <TimePicker
                      value={formik.values.timeFrom}
                      onChange={handleChangeByTime('timeFrom')}
                      renderInput={(params) => <TextField {...params} />}
                      inputFormat="HH"
                      mask="__"
                      views={['hours']}
                    />
                  </div>
                  <div className="fields-row__item">
                    <div className="fields-row__name">по</div>
                    <TimePicker
                      value={formik.values.timeTo}
                      onChange={handleChangeByTime('timeTo')}
                      renderInput={(params) => <TextField {...params} />}
                      inputFormat="HH"
                      mask="__"
                      views={['hours']}
                    />
                  </div>
                </div>
              </LocalizationProvider>
            </div>
          )}

          <div className="form-box__row">
            <div className="form-box__head">От скольки часов включительно</div>
            <TextField
              fullWidth
              id="fromHours"
              name="fromHours"
              label="пусто, если с первого часа"
              value={formik.values.fromHours}
              onChange={formik.handleChange}
              error={formik.touched.fromHours && Boolean(formik.errors.fromHours)}
              helperText={formik.touched.fromHours && formik.errors.fromHours}
            />
          </div>
          <div className="form-box__row">
            <div className="form-box__head">От скольки человек включительно</div>
            <TextField
              fullWidth
              id="fromPersons"
              name="fromPersons"
              label="пусто, если с первого человека"
              value={formik.values.fromPersons}
              onChange={formik.handleChange}
              error={formik.touched.fromPersons && Boolean(formik.errors.fromPersons)}
              helperText={formik.touched.fromPersons && formik.errors.fromPersons}
            />
          </div>
          <div className="form-box__row">
            <div className="form-box__head">До скольки человек включительно</div>
            <TextField
              fullWidth
              id="toPersons"
              name="toPersons"
              label="пусто, если нет ограничений"
              value={formik.values.toPersons}
              onChange={formik.handleChange}
              error={formik.touched.toPersons && Boolean(formik.errors.toPersons)}
              helperText={formik.touched.toPersons && formik.errors.toPersons}
            />
          </div>

          <div className="form-box__row">
            <div className="form-box__head">Срок действия</div>
            <ButtonsSwitches
              values={formik.values.validityPeriod}
              onChange={handleChangeSwitcher('validityPeriod')}
              listButtons={validityPeriodArr}
              name="validityPeriod"
            />
          </div>
          {visibleLimitedPeriod && (
            <div className="form-box__row">
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
                <div className="fields-row">
                  <div className="fields-row__item">
                    <div className="fields-row__name">с</div>
                    <MobileDatePicker
                      label=""
                      inputFormat="dd.MM.yyyy"
                      value={formik.values.dateFrom}
                      onChange={handleChangeByTime('dateFrom')}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </div>
                  <div className="fields-row__item">
                    <div className="fields-row__name">по</div>
                    <MobileDatePicker
                      label=""
                      inputFormat="dd.MM.yyyy"
                      value={formik.values.dateTo}
                      onChange={handleChangeByTime('dateTo')}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </div>
                </div>
              </LocalizationProvider>
            </div>
          )}
          <div className="form-box__row">
            <div className="form-box__head">Цена</div>
            <ButtonsSwitches
              values={formik.values.price}
              onChange={formik.handleChange}
              listButtons={priceArr}
              name="price"
            />
          </div>
          <div className="form-box__row">
            <TextField
              fullWidth
              id="priceSum"
              name="priceSum"
              label={`${formik.values.price === 'surcharge' ? 'руб. или %' : 'руб.'}`}
              value={formik.values.priceSum}
              onChange={formik.handleChange}
              error={formik.touched.priceSum && Boolean(formik.errors.priceSum)}
              helperText={formik.touched.priceSum && formik.errors.priceSum}
            />
          </div>
          <div className="form-box__row">
            <div className="form-box__head">Приоритет</div>
            <TextField
              fullWidth
              id="priority"
              name="priority"
              label="При пересичении параметров, будет изпользоваться с наибольшим значением 'приоритета'"
              value={formik.values.priority}
              onChange={formik.handleChange}
              error={formik.touched.priority && Boolean(formik.errors.priority)}
              helperText={formik.touched.priority && formik.errors.priority}
            />
          </div>
          <div className="form-box__row">
            <FormControlLabel
              className="form-box__head"
              control={<Checkbox checked={formik.values.roundUp} />}
              onChange={handleChangeSwitcher('roundUp')}
              label="Округлять до полного часа, т.е. 1.5 часа будет считаться за 2 часа"
            />
          </div>
        </div>
        <div className="form-box__footer  form-box--footer-btn-panels">
          <div className="form-box__footer-btn">
            <Button variant="outlined" color="primary" type="submit">
              Сохранить
            </Button>
          </div>
          {!!priceId && (
            <div className="form-box__footer-btn">
              <Button variant="outlined" color="secondary" onClick={handleDeletePrice}>
                Удалить
              </Button>
            </div>
          )}
        </div>
      </form>
    </TransitionsModal>
  );
};

PriceForm.propTypes = {
  idHall: PropTypes.string,
  captionButton: PropTypes.string,
  align: PropTypes.string,
  nameForm: PropTypes.string,
  params: PropTypes.object,
  CustomBtn: PropTypes.func,
  handleClick: PropTypes.func
};
PriceForm.defaultProps = {
  idHall: '',
  captionButton: '',
  align: '',
  nameForm: '',
  handleClick: null,
  CustomBtn: null,
  params: {}
};

export { PriceForm };
