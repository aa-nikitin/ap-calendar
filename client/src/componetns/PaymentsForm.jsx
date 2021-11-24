import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
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

import { TransitionsModal, Loading, ButtonsSwitches } from '../componetns';
import { getPriceParams, getPayments } from '../redux/reducers';
import { paymentsAddRequest } from '../redux/actions';

const validationSchema = yup.object({
  paymentType: yup.string('Тип платежа'),
  paymentDate: yup.date('Дата платежа'),
  paymentMethod: yup.string('Способ'),
  paymentSum: yup
    .number('Сумма')
    .typeError('Должно быть числом')
    .required('Поле обязательное для заполнения'),
  paymentPurpose: yup.string('Назначение платежа')
});

const PaymentsForm = ({ captionButton, align, nameForm, CustomBtn, handleClick, idPlan }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => getPayments(state));
  const { paymentMethodArr, paymentArr } = useSelector((state) => getPriceParams(state));
  const formik = useFormik({
    initialValues: {
      paymentType: paymentArr[0].value,
      paymentDate: new Date(),
      paymentMethod: paymentMethodArr[0].value,
      paymentSum: '',
      paymentPurpose: ''
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const { paymentDate, paymentMethod, paymentPurpose, paymentSum, paymentType } = values;
      const paymentDateFormat = moment(paymentDate).format('DD.MM.YYYY');
      dispatch(
        paymentsAddRequest({
          paymentType,
          paymentDate: paymentDateFormat,
          paymentWay: paymentMethod,
          paymentSum,
          paymentPurpose,
          idPlan
        })
      );
    }
  });
  const handleChangeByTime = (nameField) => (elem) => formik.setFieldValue(nameField, elem);
  // const handleChangeSelect = (elem) => formik.setFieldValue('hall', elem.target.value);

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
            <div className="form-box__head">Тип платежа</div>
            <ButtonsSwitches
              values={formik.values.paymentType}
              onChange={formik.handleChange}
              listButtons={paymentArr}
              name="paymentType"
            />
          </div>
          <div className="form-box__row">
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
              <div className="form-box__head">Дата платежа</div>
              <MobileDatePicker
                label=""
                inputFormat="dd.MM.yyyy"
                value={formik.values.paymentDate}
                onChange={handleChangeByTime('paymentDate')}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </LocalizationProvider>
          </div>
          <div className="form-box__row">
            <div className="form-box__head">Способ</div>
            <ButtonsSwitches
              values={formik.values.paymentMethod}
              onChange={formik.handleChange}
              listButtons={paymentMethodArr}
              name="paymentMethod"
            />
          </div>
          <div className="form-box__row">
            <div className="form-box__head">Сумма</div>
            <TextField
              fullWidth
              id="paymentSum"
              name="paymentSum"
              label=""
              value={formik.values.paymentSum}
              onChange={formik.handleChange}
              error={formik.touched.paymentSum && Boolean(formik.errors.paymentSum)}
              helperText={formik.touched.paymentSum && formik.errors.paymentSum}
            />
          </div>
          <div className="form-box__row">
            <div className="form-box__head">Назначение платежа</div>
            <TextField
              fullWidth
              multiline
              id="paymentPurpose"
              name="paymentPurpose"
              label=""
              value={formik.values.paymentPurpose}
              onChange={formik.handleChange}
              error={formik.touched.paymentPurpose && Boolean(formik.errors.paymentPurpose)}
              helperText={formik.touched.paymentPurpose && formik.errors.paymentPurpose}
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

PaymentsForm.propTypes = {
  idHall: PropTypes.string,
  captionButton: PropTypes.string,
  align: PropTypes.string,
  nameForm: PropTypes.string,
  params: PropTypes.object,
  CustomBtn: PropTypes.func,
  handleClick: PropTypes.func,
  idPlan: PropTypes.string
};
PaymentsForm.defaultProps = {
  idHall: '',
  captionButton: '',
  align: '',
  nameForm: '',
  handleClick: null,
  CustomBtn: null,
  params: {},
  idPlan: ''
};

export { PaymentsForm };
