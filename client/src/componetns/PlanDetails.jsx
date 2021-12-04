import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';

import { Loading, Socials, PaymentsForm, PlanForm, ButtonIcon, Notification } from '../componetns';
import {
  setPlanDetailsVisible,
  paymentsGetRequest,
  paymentsDeleteRequest,
  planDataRequest,
  getRefreshDetailsRequest
} from '../redux/actions';
import {
  getPlanDetails,
  getDetailsOrder,
  getPayments,
  getPaymentMethodObj,
  getWorkShedule,
  getPlan
} from '../redux/reducers';

const PlanDetails = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => getPlanDetails(state));
  const { planFetch } = useSelector((state) => getPlan(state));
  const detailsOrder = useSelector((state) => getDetailsOrder(state));
  const paymentMethodObj = useSelector((state) => getPaymentMethodObj(state));
  const workShedule = useSelector((state) => getWorkShedule(state));
  const {
    loading: loadingPayments,
    list,
    total: totalPayments
  } = useSelector((state) => getPayments(state));
  const countSocials =
    detailsOrder && detailsOrder.clientInfo && detailsOrder.clientInfo.socials
      ? Object.keys(detailsOrder.clientInfo.socials).length
      : [].length;

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

  useEffect(() => {
    dispatch(paymentsGetRequest({ id: detailsOrder.idPlan }));
  }, [dispatch, detailsOrder.idPlan]);

  if (loading || loadingPayments) return <Loading />;

  return planFetch ? (
    <Loading />
  ) : (
    <div className="content-page">
      <div className="content-page__panel content-page--panel-extend">
        <div className="content-page__panel-item">
          <div className="content-page__panel-btn">
            <Button variant="outlined" color="primary" onClick={backToPlan}>
              Назад
            </Button>
          </div>
          <div className="content-page__panel-btn">
            <PlanForm
              onClick={handlePlan}
              captionButton={`Изменить мероприятие`}
              nameForm="Аренда"
              params={workShedule}
              thisHourInfo={detailsOrder.planInfo}
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

        {detailsOrder && detailsOrder.hall && detailsOrder.servicePrice && (
          <>
            <h2 className="content-page__title">Аренда</h2>
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
            <div className="content-page__indent"></div>
          </>
        )}
        {detailsOrder && detailsOrder.total && (
          <div className="content-page__total">
            <div className="total-price">
              <div className="total-price__item">
                Доп услуги {detailsOrder.servicePrice.priceService} руб.
              </div>
              <div className="total-price__item">
                Итого с учетом скидок {detailsOrder.total.totalPriceText} руб.
              </div>
              <div className="total-price__item">
                Общая скидка {detailsOrder.total.discountPercent}%
              </div>
              <div className="total-price__item">
                Сумма скидок {detailsOrder.total.discount} руб.
              </div>
            </div>
          </div>
        )}
        {detailsOrder && detailsOrder.total && (
          <div className="content-page__payments">
            <div className="content-page__panel-item content-page--valign-center content-page--indent-bottom">
              <h2 className="content-page__title content-page--no-margin content-page--indent-right">
                Платежи
              </h2>
              <PaymentsForm
                // onClick={handlePayment}
                idPlan={detailsOrder.idPlan}
                captionButton="+ Добавить платеж"
                nameForm="Новый платеж"
              />
            </div>
            {!!totalPayments.total ? (
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

              <div className="total-price__item">Итого {totalPayments.totalText} руб.</div>
              {totalPayments.total >= detailsOrder.total.totalPrice ? (
                <div className="total-price__item total-price--green">Оплачено полностью</div>
              ) : (
                <div className="total-price__item total-price--red">
                  Осталось{' '}
                  {(detailsOrder.total.totalPrice - totalPayments.total)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}{' '}
                  руб.
                </div>
              )}
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

export { PlanDetails };
