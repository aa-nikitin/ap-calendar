import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import moment from 'moment';
import * as yup from 'yup';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import ruLocale from 'date-fns/locale/ru';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { ButtonsSwitches, Loading, TransitionsModal } from '../../componetns';
import { getPriceParams, getDiscounts } from '../../redux/reducers';
import { addDiscountsRequest, editDiscountsRequest } from '../../redux/actions';

const validationSchema = yup.object({
  purpose: yup.string('Цель аренды'),
  weekday: yup.string('Дни недели'),
  condition: yup.string('Условие'),
  dateFrom: yup.date('Дата от'),
  dateTo: yup.date('Дата до'),
  daysBeforeBooking: yup.string('Дней до брони'),
  fromHours: yup.number('От скольки часов').typeError('Должно быть числом'),
  hall: yup.string('Зал'),
  discount: yup.string('Скидка').required('Поле обязательное для заполнения'),
  everyHour: yup.boolean('На каждый час')
});

const DiscountForm = ({
  discounts,
  captionButton,
  align,
  nameForm,
  CustomBtn,
  handleClick,
  Icon
}) => {
  const dispatch = useDispatch();
  const [visibleDaysOfWeek, setVisibleDaysOfWeek] = useState(
    discounts && discounts.weekday === 'by-days' ? true : false
  );
  const [visibleLimitedPeriod, setVisibleLimitedPeriod] = useState(
    discounts && discounts.condition === 'limited' ? true : false
  );
  const { goalArr, weekdayArr, conditionArr, daysBeforeBookingArr, daysOfWeekArr, hallsArr } =
    useSelector((state) => getPriceParams(state));
  const { loading } = useSelector((state) => getDiscounts(state));
  const priceId = discounts && discounts.id ? discounts.id : '';

  const initialValues = {
    purpose: discounts ? discounts.purpose : goalArr[0].value,
    weekday: discounts ? discounts.weekday : weekdayArr[0].value,
    daysOfWeek: discounts ? discounts.daysOfWeek : [],
    condition: discounts ? discounts.condition : conditionArr[0].value,
    dateFrom: discounts && discounts.dateFrom ? discounts.dateFrom : new Date(),
    dateTo: discounts && discounts.dateTo ? discounts.dateTo : new Date(),
    daysBeforeBooking: discounts ? discounts.daysBeforeBooking : daysBeforeBookingArr[0].value,
    fromHours: discounts ? discounts.fromHours : '',
    hall: discounts ? discounts.hall : 'all',
    discount: discounts ? discounts.discount : '',
    everyHour: discounts ? discounts.everyHour : false
  };
  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const dateFrom = moment(values.dateFrom).format('DD.MM.YYYY');
      const dateTo = moment(values.dateTo).format('DD.MM.YYYY');

      if (!priceId) {
        dispatch(addDiscountsRequest({ ...values, dateFrom, dateTo }));
        formik.setFieldValue('purpose', goalArr[0].value);
        formik.setFieldValue('weekday', weekdayArr[0].value);
        formik.setFieldValue('daysOfWeek', []);
        formik.setFieldValue('condition', conditionArr[0].value);
        formik.setFieldValue('dateFrom', new Date());
        formik.setFieldValue('dateTo', new Date());
        formik.setFieldValue('daysBeforeBooking', daysBeforeBookingArr[0].value);
        formik.setFieldValue('fromHours', '');
        formik.setFieldValue('hall', 'all');
        formik.setFieldValue('discount', '');
        formik.setFieldValue('everyHour', false);
        setVisibleDaysOfWeek(false);
        setVisibleLimitedPeriod(false);
      } else {
        dispatch(
          editDiscountsRequest({
            id: priceId,
            list: { ...values, dateFrom, dateTo }
          })
        );
      }
    }
  });

  const handleDaysOfWeekArr = (_, value) => formik.setFieldValue('daysOfWeek', value);
  const handleChangeHall = (elem) => formik.setFieldValue('hall', elem.target.value);
  const handleChangeByTime = (nameField) => (elem) => formik.setFieldValue(nameField, elem);
  const handleChangeSwitcher = (switcher) => (elem, value) => {
    switch (switcher) {
      case 'weekday':
        if (elem.target.value === 'by-days') setVisibleDaysOfWeek(true);
        else setVisibleDaysOfWeek(false);
        break;
      case 'condition':
        if (elem.target.value === 'limited') setVisibleLimitedPeriod(true);
        else setVisibleLimitedPeriod(false);
        break;

      default:
        break;
    }
    if (switcher === 'everyHour') {
      formik.setFieldValue('everyHour', value);
    } else formik.handleChange(elem);
  };

  return loading ? (
    <Loading />
  ) : (
    <TransitionsModal
      Icon={Icon}
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
              listButtons={goalArr}
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
            <div className="form-box__head">Условие</div>
            <ButtonsSwitches
              values={formik.values.condition}
              onChange={handleChangeSwitcher('condition')}
              listButtons={conditionArr}
              name="condition"
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
          {formik.values.condition === 'days-before-booking' && (
            <div className="form-box__row">
              <div className="form-box__head">Дней до брони</div>
              <ButtonsSwitches
                values={formik.values.daysBeforeBooking}
                onChange={formik.handleChange}
                listButtons={daysBeforeBookingArr}
                name="daysBeforeBooking"
              />
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
            <div className="form-box__head">Зал</div>
            <Select
              labelId="hall"
              id="hall"
              value={formik.values.hall}
              label=""
              onChange={handleChangeHall}>
              <MenuItem value="all">Все залы</MenuItem>
              {hallsArr.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className="form-box__row">
            <div className="form-box__head">Скидка</div>
            <TextField
              fullWidth
              id="discount"
              name="discount"
              label={`Допишите знак % для скидки в процентах`}
              value={formik.values.discount}
              onChange={formik.handleChange}
              error={formik.touched.discount && Boolean(formik.errors.discount)}
              helperText={formik.touched.discount && formik.errors.discount}
            />
          </div>
          <div className="form-box__row">
            <FormControlLabel
              className="form-box__head"
              control={<Checkbox checked={formik.values.everyHour} />}
              onChange={handleChangeSwitcher('everyHour')}
              label="На каждый час"
            />
          </div>
        </div>
        <div className="form-box__footer  form-box--footer-btn-panels">
          <div className="form-box__footer-btn">
            <Button variant="outlined" color="primary" type="submit">
              Сохранить
            </Button>
          </div>
        </div>
      </form>
    </TransitionsModal>
  );
};

DiscountForm.propTypes = {
  captionButton: PropTypes.string,
  align: PropTypes.string,
  nameForm: PropTypes.string,
  params: PropTypes.object,
  CustomBtn: PropTypes.func,
  handleClick: PropTypes.func,
  Icon: PropTypes.object
};
DiscountForm.defaultProps = {
  captionButton: '',
  align: '',
  nameForm: '',
  handleClick: null,
  CustomBtn: null,
  params: {},
  Icon: null
};
export { DiscountForm };
