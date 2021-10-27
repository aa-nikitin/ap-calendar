import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import Slider from '@mui/material/Slider';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import NativeSelect from '@mui/material/NativeSelect';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import PropTypes from 'prop-types';

import { clientsFetchRequest } from '../redux/actions';
import { TransitionsModal } from './';
import { getClients, getPlan } from '../redux/reducers';
import { ButtonIcon } from '../componetns';

const validationSchema = yup.object({
  hall: yup.string('Зал'),
  clientName: yup.string('Имя клиента'),
  clientAlias: yup.string('Псевдоним'),
  clientPhone: yup.string('Телефон'),
  clientEmail: yup.string('E-mail')
});

const PlanForm = ({
  captionButton,
  align,
  nameForm,
  onClick,
  CustomBtn,
  params,
  handleClick,
  handleDeletePlan,
  thisHourInfo
}) => {
  // console.log(params);
  const contactsList = [
    { name: 'Имя', value: 'name' },
    { name: 'Компания', value: 'company' },
    { name: 'Телефон', value: 'phone' },
    { name: 'E-mail', value: 'mail' },
    { name: 'Комментарий', value: 'comment' }
  ];
  const { minutesStep, hourSize } = params;
  const { minutes: busyMinutes, clientInfo, client: idClient } = thisHourInfo;
  const newClientInfo = clientInfo ? { ...clientInfo, id: idClient } : {};
  const [searchName, setSearchName] = useState('');
  const [tabValue, setTabValue] = useState('1');
  // console.log(busyMinutes);
  const [positionTime, setPositionTime] = useState(busyMinutes ? busyMinutes : minutesStep);
  const dispatch = useDispatch();
  const [clientSelected, setClientSelected] = useState(newClientInfo);
  const { clients } = useSelector((state) => getClients(state));
  const { availableDataPlan, plan } = useSelector((state) => getPlan(state));
  const {
    planFree,
    planFreeTime,
    date,
    minutes: minutesAvailable,
    idHall,
    time: timeChoice
  } = availableDataPlan;
  // console.log(thisHourInfo);
  const formik = useFormik({
    initialValues: {
      hall: idHall,
      clientName: '',
      clientAlias: '',
      clientPhone: '',
      clientEmail: ''
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (!idHall) return alert('Зал не выбран');
      if (!planFreeTime || !positionTime || !timeChoice) return alert('Не выбрано время');
      if (tabValue === '1' && !clientSelected.id) return alert('Выберите клиента');
      if (tabValue === '2' && !values.clientName) return alert('Введите имя клиента');

      const planMinutes = positionTime > planFreeTime ? planFreeTime : positionTime;

      const newPlan = {
        idHall,
        minutes: planMinutes,
        date,
        time: timeChoice,
        idClient: clientSelected.id,
        clientName: values.clientName,
        clientAlias: values.clientAlias,
        clientPhone: values.clientPhone,
        clientEmail: values.clientEmail,
        idPlan: thisHourInfo.id
      };

      // console.log(values, idHall);
      onClick(newPlan);
    }
  });

  const handleSearchName = (elem) => {
    setSearchName(elem.target.value);
  };

  const handleClientSeclect = (clientObj) => () => {
    setSearchName('');
    setClientSelected({ ...clientObj, name: `${clientObj.name.first} ${clientObj.name.last}` });
  };

  const clearSearchName = () => {
    setSearchName('');
    setClientSelected({ id: '' });
  };
  const calcTime = (value, detail = false) => {
    const hours = Math.floor(value / hourSize);
    const minutes = value - hours * hourSize;

    return detail
      ? `${hours}ч. ${minutes}м.`
      : `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };
  const resultTime = calcTime(positionTime, true);
  // console.log(clientSelected);
  const refreshParamsPlan = (obj, refresh, aaa) => () => {
    // console.log(thisHourInfo);
    // if (positionTime > planFreeTime) setPositionTime(planFreeTime);

    // console.log(obj, aaa);
    if (refresh) handleClick(obj);
  };
  const handleChangeSect = (elem) => {
    if (!!elem.target.value) handleClick({ date: date, idHall: elem.target.value });
    // console.log(elem.target.value);
    formik.handleChange(elem);
  };

  const handleChangeTab = (_, newValue) => {
    setTabValue(newValue);
  };

  React.useEffect(() => {
    if (searchName) {
      dispatch(clientsFetchRequest(searchName));
    }
  }, [dispatch, searchName]);
  return (
    <TransitionsModal
      captionButton={captionButton}
      nameForm={nameForm}
      align={align}
      CustomBtn={CustomBtn}
      handleClick={handleClick}
      nameClass="plan-form">
      <form className="form-box" onSubmit={formik.handleSubmit}>
        <div className="form-box__body form-box--body-columns">
          <div className="form-box__column form-box--column-plan-left">
            <div className="form-box__row">
              <InputLabel id="demo-simple-select-label">Зал</InputLabel>
              <NativeSelect
                style={{ width: '100%' }}
                id="hall"
                name="hall"
                value={idHall ? idHall : formik.values.hall}
                onChange={handleChangeSect}
                error={formik.touched.hall && Boolean(formik.errors.hall)}
                inputProps={{
                  name: 'hall',
                  id: 'hall'
                }}>
                {!idHall && <option value="">Выберите зал</option>}

                {plan.map((planItem) => (
                  <option key={planItem.id} value={planItem.id}>
                    {planItem.name}
                  </option>
                ))}
              </NativeSelect>
              <FormHelperText>{formik.touched.hall && formik.errors.hall}</FormHelperText>
              {/* <InputLabel id="demo-simple-select-label">Зал</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="hall"
                name="hall"
                value={formik.values.hall}
                onChange={formik.handleChange}
                error={formik.touched.hall && Boolean(formik.errors.hall)}
                label="Зал">
                {plan.map((planItem) => (
                  <MenuItem key={planItem.id} value={planItem.id}>
                    {planItem.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{formik.touched.hall && formik.errors.hall}</FormHelperText> */}
            </div>
            <div className="form-box__row">
              <InputLabel>Клиент</InputLabel>
              <TabContext value={tabValue}>
                <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
                  <Tab label="Найти" value="1" />
                  <Tab label="Новый" value="2" />
                </TabList>
                <TabPanel value="1" style={{ padding: '10px 0px' }}>
                  <div className="form-box__row-icon">
                    <TextField
                      fullWidth
                      id="searchClient"
                      name="searchClient"
                      label="Поиск клиента"
                      value={searchName}
                      onChange={handleSearchName}
                    />
                    <ButtonIcon Icon={CloseIcon} title="Очистить" onClick={clearSearchName} />
                  </div>
                  <div className="form-box__row">
                    {searchName && clients && clients.length > 0 && (
                      <div className="form-box__drop-list drop-list">
                        {clients.map((client) => {
                          // console.log(client);
                          return (
                            <div
                              className="drop-list__item  drop-list--item-hover"
                              key={client.id}
                              onClick={handleClientSeclect(client)}>
                              <div className="drop-list__name">
                                {client.name.first} {client.name.last}
                                {client.company ? ` (${client.company})` : ''}
                              </div>
                              {client.phone ? `Тел: ${client.phone}` : ''}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div className="form-box__row">
                    <div className="client-contacts">
                      {contactsList.map(
                        ({ name, value }) =>
                          clientSelected[value] && (
                            <div key={name} className="client-contacts__item">
                              <div className="client-contacts__name">{name}:</div>
                              <div className="client-contacts__value">{clientSelected[value]}</div>
                            </div>
                          )
                      )}
                    </div>
                  </div>
                </TabPanel>
                <TabPanel value="2" style={{ padding: '10px 0px' }}>
                  <div className="form-box__row">
                    <TextField
                      fullWidth
                      id="clientName"
                      name="clientName"
                      label="Имя клиента"
                      value={formik.values.clientName}
                      onChange={formik.handleChange}
                      error={formik.touched.clientName && Boolean(formik.errors.clientName)}
                      helperText={formik.touched.clientName && formik.errors.clientName}
                    />
                  </div>
                  <div className="form-box__row">
                    <TextField
                      fullWidth
                      id="clientAlias"
                      name="clientAlias"
                      label="Псевдоним"
                      value={formik.values.clientAlias}
                      onChange={formik.handleChange}
                      error={formik.touched.clientAlias && Boolean(formik.errors.clientAlias)}
                      helperText={formik.touched.clientAlias && formik.errors.clientAlias}
                    />
                  </div>
                  <div className="form-box__row">
                    <TextField
                      fullWidth
                      id="clientPhone"
                      name="clientPhone"
                      label="Телефон"
                      value={formik.values.clientPhone}
                      onChange={formik.handleChange}
                      error={formik.touched.clientPhone && Boolean(formik.errors.clientPhone)}
                      helperText={formik.touched.clientPhone && formik.errors.clientPhone}
                    />
                  </div>
                  <div className="form-box__row">
                    <TextField
                      fullWidth
                      id="clientEmail"
                      name="clientEmail"
                      label="Email"
                      value={formik.values.clientEmail}
                      onChange={formik.handleChange}
                      error={formik.touched.clientEmail && Boolean(formik.errors.clientEmail)}
                      helperText={formik.touched.clientEmail && formik.errors.clientEmail}
                    />
                  </div>
                </TabPanel>
              </TabContext>
            </div>
          </div>
          <div className="form-box__column form-box--column-plan-right">
            {!!planFreeTime && !!idHall && (
              <>
                <Slider
                  aria-label="Small steps"
                  value={positionTime}
                  step={minutesStep}
                  marks
                  min={minutesStep}
                  max={planFreeTime}
                  onChange={(_, value) => setPositionTime(value)}
                  // valueLabelDisplay="off"
                  // valueLabelFormat={(value) => aaa(value)}
                />
                {resultTime}
              </>
            )}

            {planFree && (
              <div className="available-time">
                {planFree.map(({ time: timeFree, minutes, busy }) => {
                  const activeTimeItem =
                    minutes >= minutesAvailable && minutes < minutesAvailable + positionTime;
                  // console.log(activeTimeItem);
                  return (
                    <div
                      onClick={refreshParamsPlan({ time: timeFree, minutes, date, idHall }, !busy, {
                        positionTime,
                        minutesStep,
                        planFreeTime
                      })}
                      className={`available-time__item ${
                        activeTimeItem ? 'available-time--active' : ''
                      } ${busy ? 'available-time--busy' : ''}`}
                      key={minutes}>
                      {timeFree}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div className="form-box__footer  form-box--footer-btn-panels">
          <div className="form-box__footer-btn">
            <Button variant="outlined" color="primary" type="submit">
              Сохранить
            </Button>
          </div>
          {!!thisHourInfo.id && handleDeletePlan && (
            <div className="form-box__footer-btn">
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleDeletePlan({ date, idPlan: thisHourInfo.id })}>
                Отменить заявку
              </Button>
            </div>
          )}
        </div>
      </form>
    </TransitionsModal>
  );
};

PlanForm.propTypes = {
  captionButton: PropTypes.string,
  align: PropTypes.string,
  nameForm: PropTypes.string,
  onClick: PropTypes.func,
  params: PropTypes.object,
  CustomBtn: PropTypes.func,
  handleClick: PropTypes.func,
  thisHourInfo: PropTypes.object,
  handleDeletePlan: PropTypes.func
};
PlanForm.defaultProps = {
  captionButton: '',
  align: '',
  nameForm: '',
  onClick: () => {},
  handleClick: null,
  CustomBtn: null,
  params: {},
  thisHourInfo: {},
  handleDeletePlan: () => {}
};

export { PlanForm };
