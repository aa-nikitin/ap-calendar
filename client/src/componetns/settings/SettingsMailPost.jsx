import React from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const validationSchema = yup.object({
  email: yup.string('email').email('Введите корректный email'),
  fromWhom: yup.string('от кого'),
  host: yup.string('хочт'),
  port: yup.number('порт'),
  userAuth: yup.string('логин'),
  passAuth: yup.string('пароль')
});

const SettingsMailPost = ({ mailPost, handleMailPost, handleSendMailPost }) => {
  const { email, fromWhom, host, port, userAuth, passAuth } = mailPost;
  const formik = useFormik({
    initialValues: {
      email: email ? email : '',
      fromWhom: fromWhom ? fromWhom : '',
      host: host ? host : '',
      port: port ? port : 465,
      userAuth: userAuth ? userAuth : '',
      passAuth: passAuth ? passAuth : ''
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleMailPost(values);
    }
  });

  return (
    <form className="form-box" onSubmit={formik.handleSubmit}>
      <div className="form-box__row">
        <TextField
          fullWidth
          id="email"
          name="email"
          label="email куда будут приходить оповещения и заявки"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
      </div>
      <div className="form-box__row">
        <TextField
          fullWidth
          id="fromWhom"
          name="fromWhom"
          label="От кого (имя)"
          value={formik.values.fromWhom}
          onChange={formik.handleChange}
          error={formik.touched.fromWhom && Boolean(formik.errors.fromWhom)}
          helperText={formik.touched.fromWhom && formik.errors.fromWhom}
        />
      </div>
      <div className="form-box__row">
        <TextField
          fullWidth
          id="host"
          name="host"
          label="Хост (например smtp.mail.ru)"
          value={formik.values.host}
          onChange={formik.handleChange}
          error={formik.touched.host && Boolean(formik.errors.host)}
          helperText={formik.touched.host && formik.errors.host}
        />
      </div>
      <div className="form-box__row">
        <TextField
          fullWidth
          id="port"
          name="port"
          label="Порт (например 465)"
          value={formik.values.port}
          onChange={formik.handleChange}
          error={formik.touched.port && Boolean(formik.errors.port)}
          helperText={formik.touched.port && formik.errors.port}
          type="number"
        />
      </div>
      <div className="form-box__row">
        <TextField
          fullWidth
          id="userAuth"
          name="userAuth"
          label="Логин от почты"
          value={formik.values.userAuth}
          onChange={formik.handleChange}
          error={formik.touched.userAuth && Boolean(formik.errors.userAuth)}
          helperText={formik.touched.userAuth && formik.errors.userAuth}
        />
      </div>
      <div className="form-box__row">
        <TextField
          fullWidth
          id="passAuth"
          name="passAuth"
          label="Пароль от почты"
          value={formik.values.passAuth}
          onChange={formik.handleChange}
          error={formik.touched.passAuth && Boolean(formik.errors.passAuth)}
          helperText={formik.touched.passAuth && formik.errors.passAuth}
        />
      </div>
      <div className="form-box__row">Данные необходимы для отправки сообщений</div>
      <div className="form-box__footer  form-box--footer-btn-panels">
        <div className="form-box__footer-btn">
          <Button variant="outlined" color="primary" type="submit">
            Сохранить
          </Button>
        </div>
        <div className="form-box__footer-btn">
          <Button variant="outlined" color="secondary" onClick={handleSendMailPost}>
            Тестовое сообщение
          </Button>
        </div>
      </div>
    </form>
  );
};

// SettingsShedule.propTypes = {};
// SettingsShedule.defaultProps = {};
SettingsMailPost.propTypes = {
  mailPost: PropTypes.object,
  handleMailPost: PropTypes.func,
  handleSendMailPost: PropTypes.func
};
SettingsMailPost.defaultProps = {
  mailPost: {},
  handleMailPost: () => {},
  handleSendMailPost: () => {}
};

export { SettingsMailPost };
