import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@mui/styles';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

import { loginFetchRequest } from '../redux/actions';
import { getLogin } from '../redux/reducers';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    width: '100%'
  }
}));
const Login = () => {
  const { loginFetch, resultFetch } = useSelector((state) => getLogin(state));
  const classes = useStyles();
  const [values, setValues] = React.useState({
    login: '',
    password: '',
    showPassword: false
  });
  const dispatch = useDispatch();
  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleEnter = () => {
    const { login, password } = values;

    dispatch(loginFetchRequest({ login: login, pass: password, loginFetch: true }));
  };

  return (
    <div className="login">
      <div className="login__wrap">
        <div className="login__item">
          <TextField
            onChange={handleChange('login')}
            required
            id="standard-basic"
            label="Логин"
            className={clsx(classes.textField)}
          />
        </div>
        <div className="login__item">
          <FormControl required className={clsx(classes.textField)}>
            <InputLabel htmlFor="standard-adornment-password">Пароль</InputLabel>
            <Input
              id="standard-adornment-password"
              type={values.showPassword ? 'text' : 'password'}
              value={values.password}
              onChange={handleChange('password')}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}>
                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </div>
        <div className="login__item">
          <Button
            className={clsx(classes.textField)}
            variant="outlined"
            color="primary"
            disabled={loginFetch ? true : false}
            onClick={handleEnter}>
            {loginFetch ? 'Проверка...' : 'Войти'}
          </Button>
        </div>
      </div>
      {resultFetch.error && resultFetch.message && (
        <div className="login__alert">
          <Alert severity="error">{resultFetch.message}</Alert>
        </div>
      )}
    </div>
  );
};

export { Login };
