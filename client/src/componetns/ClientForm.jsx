import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';
import InputMask from 'react-input-mask';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import ruLocale from 'date-fns/locale/ru';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import moment from 'moment';

import { TransitionsModal } from './';
import { daysConfig, monthsConfig } from '../config';

const validationSchema = yup.object({
  firstName: yup
    .string('Введите Имя')
    .min(2, 'Поле должно содержать минимум 2 буквы')
    .required('Имя обязательно для заполнения'),
  lastName: yup.string('Введите Фамилию'),
  nickName: yup.string('Введите Псевдоним/Название'),
  company: yup.string('Введите Компанию'),
  phone: yup.string('Введите Телефон'),
  mail: yup.string('Введите E-mail').email('Введите корректный email'),
  comment: yup.string('Введите Комментарий'),
  year: yup.string('Год'),
  month: yup.string('Месяц'),
  day: yup.string('День'),
  vk: yup.string('вконтакте'),
  fb: yup.string('facebook'),
  ins: yup.string('instagram')
});

const ClientForm = ({ captionButton, align, nameForm, client, onClick }) => {
  const firstName = client.name ? client.name.first : '';
  const lastName = client.name ? client.name.last : '';
  const nickname = client.nickname ? client.nickname : '';
  const company = client.company ? client.company : '';
  const phone = client.phone ? client.phone : '';
  const mail = client.mail ? client.mail : '';
  const comment = client.comment ? client.comment : '';
  const socials = client.socials ? client.socials : {};
  const dateOfBirth = client.dateOfBirth ? client.dateOfBirth : {};
  const formik = useFormik({
    initialValues: {
      firstName: firstName,
      lastName: lastName,
      nickname: nickname,
      company: company,
      phone: phone,
      mail: mail,
      comment: comment,
      year: dateOfBirth.year ? dateOfBirth.year : '',
      month: dateOfBirth.month ? dateOfBirth.month : '',
      day: dateOfBirth.day ? dateOfBirth.day : '',
      vk: socials.vk ? socials.vk : '',
      fb: socials.fb ? socials.fb : '',
      ins: socials.ins ? socials.ins : ''
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const { vk, fb, ins, day, month, year } = values;
      const yearStr = year ? moment(year).format('YYYY') : '';
      const socials = { vk, fb, ins };
      const dateOfBirth = { day, month, year: yearStr };
      // console.log(values, socials, dateOfBirth);
      onClick({ ...values, socials, dateOfBirth });
    }
  });

  const handleChange = (nameField) => (elem) => {
    const value = nameField === 'year' ? elem : elem.target.value;
    formik.setFieldValue(nameField, value);
  };
  // const handleChangeSelect = (nameField) => (elem) =>
  //   formik.setFieldValue(nameField, elem.target.value);

  return (
    <TransitionsModal captionButton={captionButton} nameForm={nameForm} align={align}>
      <form className="form-box" onSubmit={formik.handleSubmit}>
        <div className="form-box__body">
          <div className="form-box__row form-box--row-two">
            <div className="form-box__field">
              <TextField
                fullWidth
                id="firstName"
                name="firstName"
                label="Имя"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName}
              />
            </div>
            <div className="form-box__field">
              <TextField
                fullWidth
                id="lastName"
                name="lastName"
                label="Фамилия"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
                className="form-box__field"
              />
            </div>
          </div>
          <div className="form-box__row">
            <TextField
              fullWidth
              id="nickname"
              name="nickname"
              label="Псевдоним/Название"
              value={formik.values.nickname}
              onChange={formik.handleChange}
              error={formik.touched.nickname && Boolean(formik.errors.nickname)}
              helperText={formik.touched.nickname && formik.errors.nickname}
            />
          </div>
          <div className="form-box__row">
            <TextField
              fullWidth
              id="company"
              name="company"
              label="Компания"
              value={formik.values.company}
              onChange={formik.handleChange}
              error={formik.touched.company && Boolean(formik.errors.company)}
              helperText={formik.touched.company && formik.errors.company}
            />
          </div>
          <div className="form-box__row">
            <InputMask
              mask="+7 (999) 999-99-99"
              value={formik.values.phone}
              onChange={formik.handleChange}
              disabled={false}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}>
              <TextField fullWidth id="phone" name="phone" label="Телефон" />
            </InputMask>
          </div>
          <div className="form-box__row">
            <TextField
              fullWidth
              id="mail"
              name="mail"
              label="E-mail"
              value={formik.values.mail}
              onChange={formik.handleChange}
              error={formik.touched.mail && Boolean(formik.errors.mail)}
              helperText={formik.touched.mail && formik.errors.mail}
            />
          </div>
          <div className="form-box__row">
            <div className="form-box__head">Социальные сети</div>
            <div className="form-box__field-row">
              <TextField
                fullWidth
                id="vk"
                name="vk"
                label="ВКонтакте"
                value={formik.values.vk}
                onChange={formik.handleChange}
                error={formik.touched.vk && Boolean(formik.errors.vk)}
                helperText={formik.touched.vk && formik.errors.vk}
              />
            </div>
            <div className="form-box__field-row">
              <TextField
                fullWidth
                id="fb"
                name="fb"
                label="Facebook"
                value={formik.values.fb}
                onChange={formik.handleChange}
                error={formik.touched.fb && Boolean(formik.errors.fb)}
                helperText={formik.touched.fb && formik.errors.fb}
              />
            </div>
            <div className="form-box__field-row">
              <TextField
                fullWidth
                id="ins"
                name="ins"
                label="Instagram"
                value={formik.values.ins}
                onChange={formik.handleChange}
                error={formik.touched.ins && Boolean(formik.errors.ins)}
                helperText={formik.touched.ins && formik.errors.ins}
              />
            </div>
          </div>
          <div className="form-box__head">День рождения:</div>
          <div className="form-box__row form-box--row-two">
            <div className="form-box__field">
              <div className="form-box__head form-box--head-light">День</div>
              <Select
                fullWidth
                labelId="day"
                id="day"
                value={formik.values.day}
                label=""
                onChange={handleChange('day')}>
                <MenuItem value="">Не знаю</MenuItem>
                {daysConfig.map((itemDay) => (
                  <MenuItem key={itemDay} value={itemDay}>
                    {itemDay}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className="form-box__field">
              <div className="form-box__head form-box--head-light">Месяц</div>
              <Select
                fullWidth
                labelId="month"
                id="month"
                value={formik.values.month}
                label=""
                onChange={handleChange('month')}>
                <MenuItem value="">Не знаю</MenuItem>
                {monthsConfig.map((itemMonth, keyMonth) => (
                  <MenuItem key={itemMonth} value={String(keyMonth + 1)}>
                    {itemMonth}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className="form-box__field">
              <div className="form-box__head form-box--head-light">Год</div>
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
                <DatePicker
                  views={['year']}
                  label=""
                  value={formik.values.year}
                  onChange={handleChange('year')}
                  renderInput={(params) => <TextField fullWidth {...params} helperText={null} />}
                />
              </LocalizationProvider>
            </div>
          </div>
          <div className="form-box__row">
            <TextField
              fullWidth
              id="comment"
              multiline
              name="comment"
              label="Комментарий"
              value={formik.values.comment}
              onChange={formik.handleChange}
              error={formik.touched.comment && Boolean(formik.errors.comment)}
              helperText={formik.touched.comment && formik.errors.comment}
            />
          </div>
        </div>
        <div className="form-box__footer">
          <Button variant="outlined" color="primary" type="submit">
            Сохранить
          </Button>
        </div>
      </form>
    </TransitionsModal>
  );
};

ClientForm.propTypes = {
  captionButton: PropTypes.string,
  align: PropTypes.string,
  nameForm: PropTypes.string,
  client: PropTypes.object,
  onClick: PropTypes.func
};
ClientForm.defaultProps = {
  captionButton: '',
  align: '',
  nameForm: '',
  client: {
    name: {
      first: '',
      last: ''
    },
    nickname: '',
    company: '',
    phone: '',
    mail: '',
    comment: ''
  },
  onClick: () => {}
};

export { ClientForm };
