import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';

import { TransitionsModal } from './';

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
  comment: yup.string('Введите Комментарий')
});

const ClientForm = ({ captionButton, align, nameForm, client, onClick }) => {
  const firstName = client.name ? client.name.first : '';
  const lastName = client.name ? client.name.last : '';
  const nickname = client.nickname ? client.nickname : '';
  const company = client.company ? client.company : '';
  const phone = client.phone ? client.phone : '';
  const mail = client.mail ? client.mail : '';
  const comment = client.comment ? client.comment : '';
  const formik = useFormik({
    initialValues: {
      firstName: firstName,
      lastName: lastName,
      nickname: nickname,
      company: company,
      phone: phone,
      mail: mail,
      comment: comment
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onClick(values);
    }
  });

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
            <TextField
              fullWidth
              id="phone"
              name="phone"
              label="Телефон"
              value={formik.values.phone}
              onChange={formik.handleChange}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
            />
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
