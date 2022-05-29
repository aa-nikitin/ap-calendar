import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import moment from 'moment';
import * as yup from 'yup';

import {
  Loading,
  Socials,
  PaymentsForm,
  ServicesForm,
  BillForm,
  PlanForm,
  ButtonIcon,
  Notification
} from '../componetns';
import {
  setPlanDetailsVisible,
  paymentsGetRequest,
  paymentsDeleteRequest,
  planDataRequest,
  getRefreshDetailsRequest,
  addPlanPriceRequest,
  delPlanPriceRequest,
  editPlanPriceRequest,
  changeRecalcPlanInfoRequest
} from '../redux/actions';
import {
  getPlanDetails,
  getDetailsOrder,
  getPayments,
  getPaymentMethodObj,
  getWorkShedule,
  getPlan,
  getPlanPrice,
  getPlanPriceList
} from '../redux/reducers';
// import { forEach } from 'lodash';

const validationSchema = yup.object({
  nameService: yup.string('Товар / Услуга').required('Поле обязательное для заполнения'),
  priceService: yup.string('Цена'),
  countService: yup.string('Количество'),
  discountService: yup.string('Скидка')
});

const PlanDetails = ({ isSeparatePage, valueDate, setValueDate }) => {
  const [activeAddServise, setActiveAddServise] = useState(false);
  const [planPriceVal, setPlanPriceVal] = useState('');
  const [activePlanPrice, setActivePlanPrice] = useState('');
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => getPlanDetails(state));
  const { planFetch } = useSelector((state) => getPlan(state));
  const detailsOrder = useSelector((state) => getDetailsOrder(state));
  const paymentMethodObj = useSelector((state) => getPaymentMethodObj(state));
  const workShedule = useSelector((state) => getWorkShedule(state));
  const { loading: loadingService } = useSelector((state) => getPlanPrice(state));
  const planPrice = useSelector((state) => getPlanPriceList(state));
  const initialValues = {
    nameService: '',
    priceService: '',
    countService: '',
    discountService: ''
  };
  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const { countService, discountService, nameService, priceService } = values;
      formik.setFieldValue('nameService', '');
      formik.setFieldValue('priceService', '');
      formik.setFieldValue('countService', '');
      formik.setFieldValue('discountService', '');
      setActiveAddServise(false);
      dispatch(
        addPlanPriceRequest({
          count: countService,
          discount: discountService,
          name: nameService,
          price: priceService,
          idPlan: detailsOrder.idPlan
        })
      );
    }
  });

  const {
    loading: loadingPayments,
    list,
    total: totalPayments,
    resultBill
  } = useSelector((state) => getPayments(state));
  const countSocials =
    detailsOrder && detailsOrder.clientInfo && detailsOrder.clientInfo.socials
      ? Object.keys(detailsOrder.clientInfo.socials).length
      : [].length;
  const thisDate = moment(valueDate).format('DD.MM.YYYY');
  const backToPlan = () => dispatch(setPlanDetailsVisible(false));

  const handleDelete = (id, idPlan) => () => {
    if (window.confirm('Вы действительно хотите удалить платеж?')) {
      dispatch(paymentsDeleteRequest({ id, idPlan }));
    }
  };
  const handlePlan = (values) => {
    dispatch(getRefreshDetailsRequest(values));
    // setTimeout(() => {
    //   dispatch(getPlanDetailsRequest(detailsOrder.idPlan));
    // }, 2000);
  };
  const handlePlanBtn = (obj, thisHourInfo) => (refreshObj) => {
    const workObj = refreshObj ? refreshObj : obj;
    if (!thisHourInfo) dispatch(planDataRequest(workObj));
    else {
      dispatch(planDataRequest({ ...workObj, idPlan: thisHourInfo.id }));
    }
  };

  const handleAddService = () => {
    setActiveAddServise(true);
  };

  const handleDeleteService = (id, idService) => () => {
    if (window.confirm('Вы действительно хотите удалить позицию?'))
      dispatch(delPlanPriceRequest({ id, idPlan: detailsOrder.idPlan, idService }));
  };

  const handleChangeService = (e) => {
    setPlanPriceVal(e.target.value);
  };

  const handleBlurService = (id, field, value) => (e) => {
    if (parseInt(planPriceVal) >= 0 && value !== planPriceVal) {
      dispatch(
        editPlanPriceRequest({
          id,
          field,
          value: parseInt(planPriceVal),
          idPlan: detailsOrder.idPlan
        })
      );
    }
    setPlanPriceVal('');
    setActivePlanPrice('');
  };

  const handleActivePlanPrice = (id, field) => () => {
    setActivePlanPrice(`${id}-${field}`);
  };

  const handleCancelService = () => {
    formik.setFieldValue('nameService', '');
    formik.setFieldValue('priceService', '');
    formik.setFieldValue('countService', '');
    formik.setFieldValue('discountService', '');
    setActiveAddServise(false);
  };

  const handleRecalcEstimate = () => {
    dispatch(changeRecalcPlanInfoRequest({ idPlan: detailsOrder.idPlan }));
  };

  const handleDisableRecalcEstimate = () => {
    dispatch(changeRecalcPlanInfoRequest({ idPlan: detailsOrder.idPlan, disable: true }));
  };

  useEffect(() => {
    dispatch(paymentsGetRequest({ id: detailsOrder.idPlan }));
  }, [dispatch, detailsOrder.idPlan]);

  if (loading || loadingPayments || loadingService) return <Loading />;

  return planFetch ? (
    <Loading />
  ) : (
    <div className="content-page">
      <div className="content-page__panel content-page--panel-extend">
        <div className="content-page__panel-item">
          {isSeparatePage && (
            <div className="content-page__panel-btn">
              <Button variant="outlined" color="primary" onClick={backToPlan}>
                Назад
              </Button>
            </div>
          )}
          <div className="content-page__panel-btn">
            <PlanForm
              onClick={handlePlan}
              captionButton={`Изменить мероприятие`}
              nameForm="Аренда"
              params={workShedule}
              thisHourInfo={detailsOrder.planInfo}
              thisDate={thisDate}
              handleClick={handlePlanBtn(
                {
                  idHall: detailsOrder.hall.idHall,
                  date: detailsOrder.date,
                  time: detailsOrder.time,
                  minutes: detailsOrder.minutesStart
                },
                detailsOrder.planInfo
              )}
            />
          </div>
        </div>
      </div>
      <div className="content-page__main">
        {detailsOrder && detailsOrder.idPlan && (
          <div className="content-page__item">ID заказа - {detailsOrder.idPlan}</div>
        )}
        {detailsOrder && detailsOrder.orderNumber && (
          <h1 className="content-page__head">
            Заказ №{detailsOrder.orderNumber} от {detailsOrder.dateOrder}{' '}
            {detailsOrder.paymentType && (
              <span className="content-page__highlight">({detailsOrder.paymentType.name})</span>
            )}{' '}
            {detailsOrder.statusText ? detailsOrder.statusText : ''}
          </h1>
        )}
        {detailsOrder && detailsOrder.clientInfo && detailsOrder.clientInfo.blacklist ? (
          <Notification
            Icon={InfoIcon}
            text="Клиент в Черном списке"
            dopClass="notification--black"
          />
        ) : (
          ''
        )}
        {detailsOrder && detailsOrder.clientInfo && detailsOrder.clientInfo.idClient ? (
          <Link
            target="_blank"
            className="content-page__title content-page--link"
            to={`./clients/${detailsOrder.clientInfo.idClient}`}>
            {detailsOrder.clientInfo.name}
          </Link>
        ) : (
          <div className="content-page__title content-page--link">
            {detailsOrder.clientInfo.name}
          </div>
        )}
        {detailsOrder && detailsOrder.orderNumber && (
          <div className="content-page__title">{detailsOrder.dateOrderPlan}</div>
        )}
        {detailsOrder && detailsOrder.clientInfo && (
          <div className="content-page__item">
            Телефон: <span className="content-page--cl-main">{detailsOrder.clientInfo.phone}</span>
          </div>
        )}
        {detailsOrder && detailsOrder.clientInfo && (
          <div className="content-page__item">
            E-mail: <span className="content-page--cl-main">{detailsOrder.clientInfo.mail}</span>
          </div>
        )}
        {detailsOrder && detailsOrder.clientInfo && detailsOrder.clientInfo.birthday && (
          <div className="content-page__item">
            ДР: <span className="content-page--cl-main">{detailsOrder.clientInfo.birthday}</span>
          </div>
        )}
        {detailsOrder && detailsOrder.comment && (
          <div className="content-page__comment">
            <b>Комментарий к заказу:</b> {detailsOrder.comment}
          </div>
        )}
        {detailsOrder && detailsOrder.clientInfo && countSocials > 0 && (
          <div className="content-page__socials">
            <Socials socials={detailsOrder.clientInfo.socials} />
          </div>
        )}

        {detailsOrder && detailsOrder.hall && (
          <>
            <div className="content-page__panel-item content-page--valign-center content-page--indent-bottom">
              <h2 className="content-page__title content-page--no-margin content-page--indent-right">
                Смета
              </h2>
              <ServicesForm
                // onClick={handlePayment}
                idPlan={detailsOrder.idPlan}
                minutes={detailsOrder.minutes}
                captionButton="+ Добавить из справочника"
                nameForm="Ваши услуги"
              />
            </div>
            {!detailsOrder.priceInfo || !detailsOrder.priceInfo.recalc ? (
              <div className="recalc-estimate">
                <div className="recalc-estimate__left">
                  <div className="recalc-estimate__icon">
                    <InfoIcon />
                  </div>
                  <div className="recalc-estimate__text">
                    <div className="recalc-estimate__head">
                      Отключен автоматический пересчёт сметы!
                    </div>
                    <div className="recalc-estimate__sub-head">
                      Смета была изменена вручную. Следите за сметой при изменении заказа
                    </div>
                  </div>
                </div>
                <div className="recalc-estimate__button">
                  <Button variant="contained" onClick={handleRecalcEstimate}>
                    Пересчитать по прайсу
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="contained" onClick={handleDisableRecalcEstimate}>
                Отключить автоматический пересчёт сметы!
              </Button>
            )}

            <div className="content-page__table-list">
              <div className="table-list">
                <div className="table-list__head">
                  <div className="table-list__head-item">Услуга</div>
                  <div className="table-list__head-item">Цена, руб.</div>
                  <div className="table-list__head-item">Скидка, руб. </div>
                  <div className="table-list__head-item">Сумма, руб.</div>
                </div>
                <div className="table-list__body">
                  {planPrice.map((element) => {
                    const { _id, name, count, price, discount, total, idService } = element;

                    return (
                      <div key={_id} className="table-list__item table-list--row">
                        <div className="table-list__col">{name}</div>
                        <div className="table-list__col">
                          <div className="plan-service plan-service--flex">
                            {activePlanPrice === `${_id}-price` ? (
                              <TextField
                                label={`Значение - ${price}`}
                                value={planPriceVal}
                                onChange={handleChangeService}
                                onBlur={handleBlurService(_id, 'price', price)}
                                autoFocus={true}
                                variant="standard"
                              />
                            ) : (
                              <div
                                className="plan-service__item"
                                onClick={handleActivePlanPrice(_id, 'price', price)}>
                                {price}
                              </div>
                            )}
                            <div
                              className="plan-service__item plan-service--count plan-service--flex"
                              onClick={handleActivePlanPrice(_id, 'count', count)}>
                              <div className="plan-service__multiplier">x</div>
                              {activePlanPrice === `${_id}-count` ? (
                                <TextField
                                  label={`Значение - ${count}`}
                                  value={planPriceVal}
                                  onChange={handleChangeService}
                                  onBlur={handleBlurService(_id, 'count', count)}
                                  autoFocus={true}
                                  variant="standard"
                                />
                              ) : (
                                count
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="table-list__col">
                          {activePlanPrice === `${_id}-discount` ? (
                            <TextField
                              label={`Значение - ${discount}`}
                              value={planPriceVal}
                              onChange={handleChangeService}
                              onBlur={handleBlurService(_id, 'discount', discount)}
                              autoFocus={true}
                              variant="standard"
                            />
                          ) : (
                            <div
                              className="plan-service__item"
                              onClick={handleActivePlanPrice(_id, 'discount', discount)}>
                              {discount ? discount : '-'}
                            </div>
                          )}
                        </div>
                        <div className="table-list__col table-list--col-space-between">
                          <b>{total}</b>
                          <ButtonIcon
                            Icon={DeleteIcon}
                            title="Удалить"
                            fontSize="small"
                            onClick={handleDeleteService(_id, idService)}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {activeAddServise && (
                    <form
                      onSubmit={formik.handleSubmit}
                      className="table-list__item table-list--row">
                      <div className="table-list__col">
                        <TextField
                          fullWidth
                          id="nameService"
                          name="nameService"
                          label="Товар/Услуга"
                          value={formik.values.nameService}
                          onChange={formik.handleChange}
                          error={formik.touched.nameService && Boolean(formik.errors.nameService)}
                        />
                      </div>
                      <div className="table-list__col table-list--col-flex">
                        <TextField
                          fullWidth
                          id="priceService"
                          name="priceService"
                          label="Цена"
                          value={formik.values.priceService}
                          onChange={formik.handleChange}
                          error={formik.touched.priceService && Boolean(formik.errors.priceService)}
                        />
                        <div className="table-list__icon-multiplay">x</div>
                        <TextField
                          fullWidth
                          id="countService"
                          name="countService"
                          label="Количество"
                          value={formik.values.countService}
                          onChange={formik.handleChange}
                          error={formik.touched.countService && Boolean(formik.errors.countService)}
                        />
                      </div>
                      <div className="table-list__col">
                        <TextField
                          fullWidth
                          id="discountService"
                          name="discountService"
                          label="Скидка"
                          value={formik.values.discountService}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.discountService && Boolean(formik.errors.discountService)
                          }
                        />
                      </div>
                      <div className="table-list__col">
                        <ButtonIcon
                          Icon={CheckIcon}
                          title="Сохранить"
                          type="submit"
                          fontSize="small"
                        />
                        <ButtonIcon
                          Icon={CloseIcon}
                          title="Отменить"
                          fontSize="small"
                          onClick={handleCancelService}
                        />
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
        {detailsOrder && detailsOrder.priceInfo && (
          <div className="content-page__total">
            <div className="total-price total-price--columns">
              <div className="total-price__col ">
                {!activeAddServise && (
                  <>
                    <button className="link" onClick={handleAddService}>
                      Добавить вручную
                    </button>
                  </>
                )}
              </div>
              <div className="total-price__col">
                {!!detailsOrder.priceInfo.total && (
                  <div className="total-price__item">
                    <b>Итого с учетом скидок {detailsOrder.priceInfo.total} руб.</b>
                  </div>
                )}
                {!!detailsOrder.priceInfo.addServices && (
                  <div className="total-price__item">
                    Доп услуги {detailsOrder.priceInfo.addServices} руб.
                  </div>
                )}
                {!!detailsOrder.priceInfo.percentDisount && (
                  <div className="total-price__item">
                    Общая скидка {detailsOrder.priceInfo.percentDisount}%
                  </div>
                )}
                {!!detailsOrder.priceInfo.totalDiscount && (
                  <div className="total-price__item">
                    Сумма скидок {detailsOrder.priceInfo.totalDiscount} руб.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {detailsOrder && detailsOrder.priceInfo && (
          <div className="content-page__payments">
            <div className="content-page__panel-item content-page--valign-center content-page--indent-bottom">
              <h2 className="content-page__title content-page--no-margin content-page--indent-right">
                Платежи
              </h2>
              <div className="content-page__btn">
                <PaymentsForm
                  // onClick={handlePayment}
                  idPlan={detailsOrder.idPlan}
                  captionButton="+ Добавить платеж"
                  nameForm="Новый платеж"
                />
              </div>
              <div className="content-page__btn">
                <BillForm
                  // onClick={handlePayment}
                  priceBill={detailsOrder.priceInfo.total - totalPayments.total}
                  idPlan={detailsOrder.idPlan}
                  captionButton="Отправить счет"
                  nameForm="Счет"
                />
              </div>
            </div>
            {!!resultBill.invoice_url && (
              <div className="content-page__payments-info">
                <div>
                  <b>Счет успешно сформирован и отправлен на почту клиенту</b>
                </div>
                <br />
                <div>
                  Ссылка на оплату которую можно отправить клиенту: <b>{resultBill.invoice_url}</b>
                </div>
              </div>
            )}

            {!!totalPayments.total ? (
              <div className="content-page__table-list">
                <div className="table-list">
                  <div className="table-list__head">
                    <div className="table-list__head-item">Дата</div>
                    <div className="table-list__head-item">Назначение</div>
                    <div className="table-list__head-item">Способ </div>
                    <div className="table-list__head-item">Сумма, руб.</div>
                  </div>
                  <div className="table-list__body">
                    {list.map((item) => (
                      <div key={item.id} className="table-list__item table-list--row">
                        <div className="table-list__col">{item.paymentDate}</div>
                        <div className="table-list__col">{item.paymentPurpose}</div>
                        <div className="table-list__col">
                          {paymentMethodObj[item.paymentWay].name}
                        </div>
                        <div
                          className={`table-list__col table-list--col-space-between table-list--col-${
                            item.paymentType === 'income' ? 'green' : 'red'
                          }`}>
                          {item.paymentType === 'income' ? '+' : '-'}
                          {item.paymentSumText}
                          <ButtonIcon
                            Icon={DeleteIcon}
                            title="Удалить"
                            fontSize="small"
                            onClick={handleDelete(item.id, detailsOrder.idPlan)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="content-page__info-payment">Платежей не поступало</div>
            )}
          </div>
        )}
        {!!totalPayments.total && (
          <div className="content-page__total">
            <div className="total-price">
              {!!totalPayments.income && (
                <div className="total-price__item">Оплачено {totalPayments.incomeText} руб.</div>
              )}
              {!!totalPayments.expense && (
                <div className="total-price__item">Расходы {totalPayments.expenseText} руб.</div>
              )}
              {!!totalPayments.expense && (
                <div className="total-price__item">Итого {totalPayments.totalText} руб.</div>
              )}
              {/* {totalPayments.total >= detailsOrder.priceInfo.total ? (
                <div className="total-price__item total-price--green">Оплачено полностью</div>
              ) : (
                <div className="total-price__item total-price--red">
                  Осталось{' '}
                  {(detailsOrder.priceInfo.total - totalPayments.total)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}{' '}
                  руб.
                </div>
              )} */}
            </div>
          </div>
        )}

        {/* {detailsOrder && detailsOrder.hall && detailsOrder.servicePrice && (
        <>
          <h2 className="content-page__title">Доп. услуги</h2>
          <div className="table-list">
            <div className="table-list__head">
              <div className="table-list__head-item">Зал</div>
              <div className="table-list__head-item">Цена, руб.</div>
              <div className="table-list__head-item">Скидка, руб. </div>
              <div className="table-list__head-item">Сумма, руб.</div>
            </div>
            <div className="table-list__body">
              <div className="table-list__item table-list--row">
                <div className="table-list__col">{detailsOrder.hall.name}</div>
                <div className="table-list__col">{detailsOrder.servicePrice.price}</div>
                <div className="table-list__col">{detailsOrder.servicePrice.discount}</div>
                <div className="table-list__col">
                  <b>{detailsOrder.servicePrice.total}</b>
                </div>
              </div>
            </div>
          </div>
          <div className="content-page__sep"></div>
        </>
      )} */}
      </div>
    </div>
  );
};

PlanDetails.propTypes = {
  isSeparatePage: PropTypes.bool,
  valueDate: PropTypes.object,
  setValueDate: PropTypes.func
};
PlanDetails.defaultProps = {
  isSeparatePage: false,
  valueDate: {},
  setValueDate: () => {}
};

export { PlanDetails };
