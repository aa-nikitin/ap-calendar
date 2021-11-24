import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import Slider from '@mui/material/Slider';
import FormHelperText from '@mui/material/FormHelperText';
import NativeSelect from '@mui/material/NativeSelect';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import InputMask from 'react-input-mask';
import moment from 'moment';

import PropTypes from 'prop-types';

import { clientsFetchRequest } from '../redux/actions';
import { TransitionsModal } from './';
import { getPriceParams, getClients, getPlan } from '../redux/reducers';
import { ButtonIcon, ButtonsSwitches } from '../componetns';

const validationSchema = yup.object({
  status: yup.string('Статус'),
  paymentType: yup.string('Тип платежа'),
  purpose: yup.string('Цель аренды'),
  hall: yup.string('Зал'),
  persons: yup
    .number('Количество человек')
    .required('Поле обязательное для заполнения')
    .typeError('Должно быть числом'),
  comment: yup.string('Комментарий'),
  paidFor: yup.string('Оплачено'),
  paymentMethod: yup.string('Метод оплаты'),
  clientName: yup.string('Имя клиента'),
  clientAlias: yup.string('Псевдоним'),
  clientPhone: yup.string('Телефон'),
  clientEmail: yup.string('Введите E-mail').email('Введите корректный email')
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
  const {
    minutes: busyMinutes,
    clientInfo,
    client: idClient,
    price,
    priceFormat,
    paymentType
  } = thisHourInfo;
  const newClientInfo = clientInfo ? { ...clientInfo, id: idClient } : {};
  const [searchName, setSearchName] = useState('');
  const [tabValue, setTabValue] = useState('1');
  // console.log(busyMinutes);
  const [positionTime, setPositionTime] = useState(busyMinutes ? busyMinutes : minutesStep);
  const dispatch = useDispatch();
  const [clientSelected, setClientSelected] = useState(newClientInfo);
  const { clients } = useSelector((state) => getClients(state));
  const { statusArr, paymentTypeArr, purposeArr, paymentMethodArr } = useSelector((state) =>
    getPriceParams(state)
  );
  const { availableDataPlan, plan } = useSelector((state) => getPlan(state));
  const {
    planFree,
    planFreeTime,
    date,
    minutes: minutesAvailable,
    idHall,
    time: timeChoice
  } = availableDataPlan;

  const initialValues = {
    status: thisHourInfo.status ? thisHourInfo.status : statusArr[0].value,
    paymentType: paymentType ? paymentType : paymentTypeArr[0].value,
    purpose: thisHourInfo.purpose ? thisHourInfo.purpose : purposeArr[0].value,
    persons: thisHourInfo.persons ? thisHourInfo.persons : 1,
    comment: thisHourInfo.comment ? thisHourInfo.comment : '',
    paidFor: thisHourInfo.paidFor ? thisHourInfo.paidFor : '',
    paymentMethod: thisHourInfo.paymentMethod
      ? thisHourInfo.paymentMethod
      : paymentMethodArr[0].value,
    hall: idHall,
    clientName: '',
    clientAlias: '',
    clientPhone: '',
    clientEmail: ''
  };

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const {
        clientName,
        clientAlias,
        clientPhone,
        clientEmail,
        status,
        paymentType,
        purpose,
        persons,
        comment,
        paidFor,
        paymentMethod
      } = values;
      if (!idHall) return alert('Зал не выбран');
      if (!planFreeTime || !positionTime || !timeChoice) return alert('Не выбрано время');
      if (tabValue === '1' && !clientSelected.id) return alert('Выберите клиента');
      if (tabValue === '2' && !clientName) return alert('Введите имя клиента');

      const planMinutes = positionTime > planFreeTime ? planFreeTime : positionTime;
      const dateOrder = moment(new Date());
      const newPlan = {
        idHall,
        minutes: planMinutes,
        date,
        time: timeChoice,
        idClient: clientSelected.id,
        clientName,
        clientAlias,
        clientPhone,
        clientEmail,
        idPlan: thisHourInfo.id,
        status,
        paymentType,
        purpose,
        persons,
        comment,
        paidFor,
        paymentMethod,
        dateOrder
      };

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
  const refreshParamsPlan = (obj, refresh) => () => {
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
  // console.log(planFreeTime);
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
              <div className="form-box__head">Статус</div>
              <ButtonsSwitches
                values={formik.values.status}
                onChange={formik.handleChange}
                listButtons={statusArr}
                name="status"
              />
            </div>
            <div className="form-box__row">
              <div className="form-box__head">Тип платежа</div>
              <NativeSelect
                style={{ width: '100%' }}
                id="paymentType"
                name="paymentType"
                value={formik.values.paymentType}
                onChange={formik.handleChange}
                error={formik.touched.paymentType && Boolean(formik.errors.paymentType)}
                inputProps={{
                  name: 'paymentType',
                  id: 'paymentType'
                }}>
                {paymentTypeArr.map((planItem) => (
                  <option key={planItem.value} value={planItem.value}>
                    {planItem.name}
                  </option>
                ))}
              </NativeSelect>
              <FormHelperText>{formik.touched.hall && formik.errors.hall}</FormHelperText>
            </div>
            <div className="form-box__row">
              <div className="form-box__head">Цель аренды</div>
              <NativeSelect
                style={{ width: '100%' }}
                id="purpose"
                name="purpose"
                value={formik.values.purpose}
                onChange={formik.handleChange}
                error={formik.touched.purpose && Boolean(formik.errors.purpose)}
                inputProps={{
                  name: 'purpose',
                  id: 'purpose'
                }}>
                {purposeArr.map((planItem) => (
                  <option key={planItem.value} value={planItem.value}>
                    {planItem.name}
                  </option>
                ))}
              </NativeSelect>
              <FormHelperText>{formik.touched.hall && formik.errors.hall}</FormHelperText>
            </div>
            <div className="form-box__row">
              <div className="form-box__head">Зал</div>
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
            </div>
            <div className="form-box__row">
              <TextField
                fullWidth
                id="persons"
                name="persons"
                label="Количество человек"
                value={formik.values.persons}
                onChange={formik.handleChange}
                error={formik.touched.persons && Boolean(formik.errors.persons)}
                helperText={formik.touched.persons && formik.errors.persons}
              />
            </div>
            <div className="form-box__row">
              <TextField
                fullWidth
                multiline
                id="comment"
                name="comment"
                label="Комментарий к заказу"
                value={formik.values.comment}
                onChange={formik.handleChange}
                error={formik.touched.comment && Boolean(formik.errors.comment)}
                helperText={formik.touched.comment && formik.errors.comment}
              />
            </div>
            {price > 0 && thisHourInfo.paymentType === 'paid' && (
              <>
                <div className="form-box__row">
                  <div className="form-box__head">Итоговая стоимость</div>
                  <b>{priceFormat} руб.</b>
                </div>
                <div className="form-box__row">
                  <div className="form-box__head">Метод оплаты</div>
                  <ButtonsSwitches
                    values={formik.values.paymentMethod}
                    onChange={formik.handleChange}
                    listButtons={paymentMethodArr}
                    name="paymentMethod"
                  />
                </div>
                <div className="form-box__row">
                  <TextField
                    fullWidth
                    id="paidFor"
                    name="paidFor"
                    label="Оплачено"
                    value={formik.values.paidFor}
                    onChange={formik.handleChange}
                    error={formik.touched.paidFor && Boolean(formik.errors.paidFor)}
                    helperText={formik.touched.paidFor && formik.errors.paidFor}
                  />
                </div>
              </>
            )}
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
            <div className="form-box__row">
              <div className="form-box__head">Клиент</div>
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
                    <InputMask
                      mask="+7 (999) 999-99-99"
                      value={formik.values.clientPhone}
                      onChange={formik.handleChange}
                      disabled={false}
                      error={formik.touched.clientPhone && Boolean(formik.errors.clientPhone)}
                      helperText={formik.touched.clientPhone && formik.errors.clientPhone}>
                      <TextField fullWidth id="clientPhone" name="clientPhone" label="Телефон" />
                    </InputMask>
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
