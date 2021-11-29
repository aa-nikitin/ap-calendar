import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
// import moment from 'moment';
import * as yup from 'yup';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import { TransitionsModal, Loading } from '../../componetns';
import { getServices } from '../../redux/reducers';
import { addServicesRequest, editServicesRequest } from '../../redux/actions';

const validationSchema = yup.object({
  name: yup.string('Название').required('Поле обязательное для заполнения'),
  price: yup
    .number('Цена')
    .required('Поле обязательное для заполнения')
    .typeError('Должно быть числом'),
  hourly: yup.boolean('Почасовая оплата')
});

const ServiceForm = ({ captionButton, align, nameForm, CustomBtn, handleClick, service, Icon }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => getServices(state));
  const formik = useFormik({
    initialValues: {
      name: service.name ? service.name : '',
      price: service.price ? service.price : '',
      hourly: service.hourly ? service.hourly : false
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // const { paymentDate, paymentMethod, paymentPurpose, paymentSum, paymentType } = values;
      // const paymentDateFormat = moment(paymentDate).format('DD.MM.YYYY');
      if (!service._id) {
        dispatch(addServicesRequest(values));

        formik.setFieldValue('name', '');
        formik.setFieldValue('price', '');
        formik.setFieldValue('hourly', false);
      } else {
        dispatch(editServicesRequest({ params: values, id: service._id }));
      }
    }
  });

  const handleChange = (nameField) => (_elem, value) => formik.setFieldValue(nameField, value);

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
            <div className="form-box__head">Название</div>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Например, Ведущий"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </div>
          <div className="form-box__row">
            <div className="form-box__head">Цена</div>
            <TextField
              fullWidth
              multiline
              id="price"
              name="price"
              label="руб."
              value={formik.values.price}
              onChange={formik.handleChange}
              error={formik.touched.price && Boolean(formik.errors.price)}
              helperText={formik.touched.price && formik.errors.price}
            />
          </div>
          <div className="form-box__row">
            <FormControlLabel
              className="form-box__head"
              control={<Checkbox checked={formik.values.hourly} />}
              onChange={handleChange('hourly')}
              label="Почасовая оплата"
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

ServiceForm.propTypes = {
  captionButton: PropTypes.string,
  align: PropTypes.string,
  nameForm: PropTypes.string,
  params: PropTypes.object,
  CustomBtn: PropTypes.func,
  handleClick: PropTypes.func,
  service: PropTypes.object,
  Icon: PropTypes.object
};
ServiceForm.defaultProps = {
  captionButton: '',
  align: '',
  nameForm: '',
  handleClick: null,
  CustomBtn: null,
  params: {},
  service: {},
  Icon: null
};

export { ServiceForm };
