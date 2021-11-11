import React from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const validationSchema = yup.object({
  loginPK: yup.string('логин'),
  passPK: yup.string('пароль'),
  serverPK: yup.string('сервер')
});

const SettingsPaykeeper = ({ paykeeper, handlePaykeeper }) => {
  const { loginPK, passPK, serverPK } = paykeeper;
  const formik = useFormik({
    initialValues: {
      loginPK: loginPK ? loginPK : '',
      passPK: passPK ? passPK : '',
      serverPK: serverPK ? serverPK : ''
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handlePaykeeper(values);
    }
  });

  return (
    <form className="form-box" onSubmit={formik.handleSubmit}>
      <div className="form-box__row">
        <TextField
          fullWidth
          id="loginPK"
          name="loginPK"
          label="Логин paykeeper"
          value={formik.values.loginPK}
          onChange={formik.handleChange}
          error={formik.touched.loginPK && Boolean(formik.errors.loginPK)}
          helperText={formik.touched.loginPK && formik.errors.loginPK}
        />
      </div>
      <div className="form-box__row">
        <TextField
          fullWidth
          id="passPK"
          name="passPK"
          label="Пароль paykeeper"
          value={formik.values.passPK}
          onChange={formik.handleChange}
          error={formik.touched.passPK && Boolean(formik.errors.passPK)}
          helperText={formik.touched.passPK && formik.errors.passPK}
        />
      </div>
      <div className="form-box__row">
        <TextField
          fullWidth
          id="serverPK"
          name="serverPK"
          label="Сервер paykeeper"
          value={formik.values.serverPK}
          onChange={formik.handleChange}
          error={formik.touched.serverPK && Boolean(formik.errors.serverPK)}
          helperText={formik.touched.serverPK && formik.errors.serverPK}
        />
      </div>
      <div className="form-box__row">Данные необходимы для подключения и оплат через paykeeper</div>
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
SettingsPaykeeper.propTypes = {
  paykeeper: PropTypes.object,
  handlePaykeeper: PropTypes.func
};
SettingsPaykeeper.defaultProps = {
  paykeeper: {},
  handlePaykeeper: () => {}
};

export { SettingsPaykeeper };
