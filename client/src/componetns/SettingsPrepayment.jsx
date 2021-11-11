import React from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';

const validationSchema = yup.object({
  hours: yup.number('Часы'),
  percent: yup.number('Проценты')
});

const SettingsPrepayment = ({ prepayment, handlePrepayment }) => {
  const { hours, percent } = prepayment;
  const formik = useFormik({
    initialValues: {
      hours: hours ? hours : 1,
      percent: percent ? percent : 10
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handlePrepayment(values);
    }
  });

  const handleChangeSelect = (value) => (elem) => formik.setFieldValue(value, elem.target.value);

  return (
    <form className="form-box" onSubmit={formik.handleSubmit}>
      <div className="form-box__row">
        <div className="form-box__head">
          Через сколько часов отменяем заявку если нет предоплаты - {formik.values.hours} час.
        </div>
        <Slider
          id="hours"
          value={formik.values.hours}
          step={1}
          marks
          min={1}
          max={24}
          onChange={handleChangeSelect('hours')}
        />
      </div>
      <div className="form-box__row">
        <div className="form-box__head">
          Предоплата которую необходимо внести что бы забронировать заявку - {formik.values.percent}
          %
        </div>
        <Slider
          id="percent"
          value={formik.values.percent}
          step={10}
          marks
          min={10}
          max={100}
          onChange={handleChangeSelect('percent')}
        />
      </div>
      <div>
        <Button variant="outlined" color="primary" type="submit">
          Сохранить
        </Button>
      </div>
    </form>
  );
};

SettingsPrepayment.propTypes = {
  prepayment: PropTypes.object,
  handlePrepayment: PropTypes.func
};
SettingsPrepayment.defaultProps = {
  prepayment: {},
  handlePrepayment: () => {}
};

export { SettingsPrepayment };
