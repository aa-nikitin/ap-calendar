import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import { ButtonsSwitches } from '../../componetns';
import { getPriceParams } from '../../redux/reducers';
import { planCancalledRequest } from '../../redux/actions';

const validationSchema = yup.object({
  reason: yup.string('Причина'),
  comment: yup.string('Комментарий'),
  blacklist: yup.string('Черный список')
});

const CancelledForm = ({ handleCancelled, plan, date }) => {
  const dispatch = useDispatch();
  //   const { loading } = useSelector((state) => getPrices(state));
  //   const { halls } = useSelector((state) => getHalls(state));
  const { reasonArr } = useSelector((state) => getPriceParams(state));
  const formik = useFormik({
    initialValues: {
      reason: '',
      comment: '',
      blacklist: false
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(planCancalledRequest({ ...values, idPlan: plan.id, date, idClient: plan.client }));
      //   dispatch(copyPricesRequest({ idHall: values.hall, newIdHall: idHall }));
    }
  });

  const handleChangeSwitcher = (switcher) => (elem, value) => {
    if (switcher === 'blacklist') {
      formik.setFieldValue('blacklist', value);
    } else formik.handleChange(elem);
  };

  //   const handleChangeSelect = (elem) => formik.setFieldValue('hall', elem.target.value);

  return (
    <form className="form-box" onSubmit={formik.handleSubmit}>
      <div className="form-box__body">
        <div className="form-box__row">
          <div className="form-box__head">Какая причина отмены?</div>
          <ButtonsSwitches
            values={formik.values.reason}
            onChange={formik.handleChange}
            listButtons={reasonArr}
            name="reason"
          />
        </div>
        <div className="form-box__row">
          <TextField
            fullWidth
            multiline
            id="comment"
            name="comment"
            label="Комментарий"
            value={formik.values.comment}
            onChange={formik.handleChange}
            error={formik.touched.comment && Boolean(formik.errors.comment)}
            helperText={formik.touched.comment && formik.errors.comment}
          />
        </div>
        <div className="form-box__row">
          <FormControlLabel
            className="form-box__head"
            control={<Checkbox checked={formik.values.blacklist} />}
            onChange={handleChangeSwitcher('blacklist')}
            label="Добавить в черный список?"
          />
        </div>
      </div>
      <div className="form-box__footer  form-box--footer-btn-panels">
        <div className="form-box__footer-btn">
          <Button variant="contained" color="primary" type="submit">
            Сохранить
          </Button>
        </div>
        <div className="form-box__footer-btn">
          <Button variant="outlined" color="primary" onClick={handleCancelled}>
            Не отменять
          </Button>
        </div>
      </div>
    </form>
  );
};

CancelledForm.propTypes = {
  handleCancelled: PropTypes.func,
  plan: PropTypes.object,
  date: PropTypes.string
};
CancelledForm.defaultProps = {
  handleCancelled: () => {},
  plan: {},
  date: ''
};

export { CancelledForm };
