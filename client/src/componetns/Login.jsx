import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';

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
            className={clsx(classes.textField)}
            required
            id="standard-basic"
            label="Логин"
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
