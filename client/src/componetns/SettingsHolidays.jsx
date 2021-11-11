import React, { useEffect } from 'react';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TextField from '@mui/material/TextField';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import ruLocale from 'date-fns/locale/ru';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
// import Slider from '@mui/material/Slider';

import { getHolidays } from '../redux/reducers';
import {
  settingsLoadHolidaysRequest,
  settingsDeleteHolidaysRequest,
  settingsSaveHolidaysRequest
} from '../redux/actions';

const validationSchema = yup.object({
  dateHolliday: yup.date('Дата')
});

const SettingsHolidays = () => {
  const dispatch = useDispatch();
  const holidays = useSelector((state) => getHolidays(state));
  const formik = useFormik({
    initialValues: {
      dateHolliday: new Date()
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const { dateHolliday } = values;
      const date = moment(dateHolliday).format('DD.MM.YYYY');
      dispatch(settingsSaveHolidaysRequest(date));
    }
  });
  const dateHoliday = moment(formik.values.dateHolliday).format('DD.MM.YYYY');

  const handleChange = (nameField) => (elem) => formik.setFieldValue(nameField, elem);
  const handleDeleteHoliday = (idHoliday) => () =>
    dispatch(settingsDeleteHolidaysRequest(idHoliday));
  const handleAddDate = (dateHolliday) => {
    const date = moment(dateHolliday).format('DD.MM.YYYY');
    dispatch(settingsSaveHolidaysRequest(date));
  };
  useEffect(() => {
    dispatch(settingsLoadHolidaysRequest());
  }, [dispatch]);
  // console.log(dateHoliday);

  return (
    <div className="hollidays">
      <form className="hollidays__form-box" onSubmit={formik.handleSubmit}>
        <div className="hollidays__panel hollidays--panel-extend">
          <div className="hollidays__panel-item">
            <div className="hollidays__panel-btn">
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
                <MobileDatePicker
                  label="Праздничный(нерабочий) день"
                  inputFormat="dd.MM.yyyy"
                  value={formik.values.dateHolliday}
                  onChange={handleChange('dateHolliday')}
                  renderInput={(params) => <TextField {...params} />}
                  onAccept={handleAddDate}
                />
              </LocalizationProvider>
            </div>
          </div>
        </div>
      </form>
      <div className="hollidays__info">Нажмите на дату что бы удалить</div>
      <div className="hollidays__list">
        {holidays.map((item) => (
          <div
            key={item._id}
            className={`hollidays__item ${item.date === dateHoliday ? 'hollidays--same-item' : ''}`}
            onClick={handleDeleteHoliday(item._id)}>
            {item.date}
          </div>
        ))}
      </div>
      <div className="hollidays__info">
        Информация из данного раздела используется для формирования цен, когда в "Дни недели" выбран
        раздел "Выходные/Праздники"
      </div>
    </div>
  );
};

// SettingsShedule.propTypes = {};
// SettingsShedule.defaultProps = {};

export { SettingsHolidays };
