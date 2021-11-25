import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Slider from '@mui/material/Slider';

import { getWorkShedule } from '../../redux/reducers';
import { settingsSaveSheduleRequest } from '../../redux/actions';

const validationSchema = yup.object({
  fromHours: yup.string('Время от'),
  toHours: yup.string('Время до')
});

const SettingsShedule = () => {
  const dispatch = useDispatch();
  const workShedule = useSelector((state) => getWorkShedule(state));
  const { minutesFrom, minutesTo, minutesStep, hourSize } = workShedule;
  const formik = useFormik({
    initialValues: {
      fromHours: minutesFrom >= 0 ? minutesFrom / hourSize : 9,
      toHours: minutesTo ? minutesTo / hourSize : 22,
      step: minutesStep ? minutesStep : 30
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const { fromHours, toHours, step } = values;
      // console.log(values);
      if (toHours <= fromHours)
        return alert(
          'конец рабочего дня должен быть как минимум на 1 час больше начала рабочего дня'
        );
      dispatch(
        settingsSaveSheduleRequest({
          minutesFrom: fromHours,
          minutesTo: toHours,
          minutesStep: step,
          hourSize: hourSize
        })
      );
    }
  });

  // useEffect(() => {
  //   dispatch(setPageTplName('SETTINGS'));
  // }, [dispatch]);

  const handleChangeSelect = (value) => (elem) => formik.setFieldValue(value, elem.target.value);

  return (
    <form className="form-box" onSubmit={formik.handleSubmit}>
      <div className="form-box__row">
        <div className="form-box__head">Начало рабочего дня ({formik.values.fromHours}:00)</div>
        <Slider
          id="fromHours"
          value={formik.values.fromHours}
          step={1}
          marks
          min={0}
          max={23}
          onChange={handleChangeSelect('fromHours')}
        />
      </div>
      <div className="form-box__row">
        <div className="form-box__head">Конец рабочего дня ({formik.values.toHours}:00)</div>
        <Slider
          id="toHours"
          value={formik.values.toHours}
          step={1}
          marks
          min={formik.values.fromHours + 1}
          max={24}
          onChange={handleChangeSelect('toHours')}
        />
      </div>
      <div className="form-box__row">
        <div className="form-box__head">Шаг в админке</div>
        <Select
          labelId="step"
          id="step"
          value={formik.values.step}
          label=""
          onChange={handleChangeSelect('step')}
          className="form-box__width-full">
          <MenuItem value={30}>30 минут</MenuItem>
          <MenuItem value={60}>1 час</MenuItem>
        </Select>
      </div>
      <div className="form-box__footer  form-box--footer-btn-panels">
        <div className="form-box__footer-btn">
          <Button variant="outlined" color="primary" type="submit">
            Сохранить
          </Button>
        </div>
      </div>
    </form>
  );
};

// SettingsShedule.propTypes = {};
// SettingsShedule.defaultProps = {};

export { SettingsShedule };
