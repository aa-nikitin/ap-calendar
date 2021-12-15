import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { TransitionsModal } from '../../componetns';
import { paymentsSendBillRequest } from '../../redux/actions';

const validationSchema = yup.object({
  price: yup.string('Цена').required('Обязательно для заполнения')
});

const BillForm = ({
  priceBill,
  idPlan,
  captionButton,
  align,
  nameForm,
  CustomBtn,
  handleClick
}) => {
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      price: priceBill < 0 ? 0 : priceBill
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(paymentsSendBillRequest({ priceBill: values.price, idPlan }));
    }
  });

  return (
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
            <TextField
              fullWidth
              id="price"
              name="price"
              label="Сумма, для выставления счета, руб."
              value={formik.values.price}
              onChange={formik.handleChange}
              error={formik.touched.price && Boolean(formik.errors.price)}
              helperText={formik.touched.price && formik.errors.price}
            />
          </div>
        </div>
        <div className="form-box__footer  form-box--footer-btn-panels">
          <div className="form-box__footer-btn">
            <Button variant="outlined" color="primary" type="submit">
              Отправить
            </Button>
          </div>
        </div>
      </form>
    </TransitionsModal>
  );
};

BillForm.propTypes = {
  priceBill: PropTypes.number,
  idPlan: PropTypes.string,
  captionButton: PropTypes.string,
  align: PropTypes.string,
  nameForm: PropTypes.string,
  CustomBtn: PropTypes.func,
  handleClick: PropTypes.func
};
BillForm.defaultProps = {
  priceBill: 0,
  idPlan: '',
  captionButton: '',
  align: '',
  nameForm: '',
  handleClick: null,
  CustomBtn: null
};

export { BillForm };
