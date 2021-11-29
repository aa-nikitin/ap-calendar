import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { TransitionsModal, Loading } from '../../componetns';
import { getHalls, getPrices } from '../../redux/reducers';
import { copyPricesRequest } from '../../redux/actions';

const validationSchema = yup.object({
  hall: yup.string('Зал')
});

const PriceCopyForm = ({ idHall, captionButton, align, nameForm, CustomBtn, handleClick }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => getPrices(state));
  const { halls } = useSelector((state) => getHalls(state));
  const formik = useFormik({
    initialValues: {
      hall: halls[0]._id
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(copyPricesRequest({ idHall: values.hall, newIdHall: idHall }));
    }
  });

  const handleChangeSelect = (elem) => formik.setFieldValue('hall', elem.target.value);

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
            <div className="form-box__head">Зал</div>
            <Select
              labelId="hall"
              id="hall"
              value={formik.values.hall}
              label=""
              onChange={handleChangeSelect}>
              {halls.map((itemHall) => (
                <MenuItem key={itemHall._id} value={itemHall._id}>
                  {itemHall.name}
                </MenuItem>
              ))}
            </Select>
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

PriceCopyForm.propTypes = {
  idHall: PropTypes.string,
  captionButton: PropTypes.string,
  align: PropTypes.string,
  nameForm: PropTypes.string,
  CustomBtn: PropTypes.func,
  handleClick: PropTypes.func
};
PriceCopyForm.defaultProps = {
  idHall: '',
  captionButton: '',
  align: '',
  nameForm: '',
  handleClick: null,
  CustomBtn: null
};

export { PriceCopyForm };
