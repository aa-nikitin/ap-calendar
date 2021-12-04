import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@mui/material/Button';
import UpdateIcon from '@mui/icons-material/Update';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import { Link } from 'react-router-dom';

import { Loading, ClientForm, Notification } from '../componetns';
import { getClient, getClientPlans } from '../redux/reducers';
import { clientFetchRequest, clientChangeRequest, setPageTplName } from '../redux/actions';

const Client = ({ match, history }) => {
  const dispatch = useDispatch();
  const { client, clientFetch } = useSelector((state) => getClient(state));
  const plansClient = useSelector((state) => getClientPlans(state));
  const firstName = client.name ? client.name.first : '';
  const lastName = client.name ? client.name.last : '';
  const { nickname, company, phone, mail, comment, blacklist } = client;
  const contactsList = [
    { name: 'Псевдоним/Название', value: nickname },
    { name: 'Компания', value: company },
    { name: 'Телефон', value: phone },
    { name: 'E-mail', value: mail },
    { name: 'Комментарий', value: comment }
  ];
  const handleBack = () => {
    history.goBack();
  };

  const updateClient = () => {
    dispatch(clientFetchRequest(match.params.id));
  };

  const changeClient = (data) => {
    dispatch(clientChangeRequest({ id: match.params.id, data: data }));
  };

  useEffect(() => {
    dispatch(clientFetchRequest(match.params.id));
    dispatch(setPageTplName('CLIENT'));
  }, [dispatch, match.params.id]);
  if (clientFetch) return <Loading />;
  return (
    <div className="content-page">
      <div className="content-page__panel content-page--panel-extend">
        {history.length > 1 && (
          <div className="content-page__panel-item">
            <div className="content-page__panel-btn">
              <Button variant="outlined" color="primary" onClick={handleBack}>
                Назад
              </Button>
            </div>
          </div>
        )}

        <div className="content-page__panel-item">
          <div className="content-page__panel-btn">
            <Tooltip title="Обновить">
              <Button variant="outlined" color="primary" onClick={updateClient}>
                <UpdateIcon />
              </Button>
            </Tooltip>
          </div>
          <div className="content-page__panel-btn">
            <ClientForm
              client={client}
              onClick={changeClient}
              captionButton="Изменить"
              nameForm="Редактирование клиента"
            />
          </div>
        </div>
      </div>
      <div className="content-page__main">
        <h1 className="content-page__title">
          {firstName} {lastName}
        </h1>
        {blacklist && (
          <Notification
            Icon={InfoIcon}
            text="Клиент в Черном списке"
            dopClass="notification--black"
          />
        )}

        <div className="content-page__body client-page">
          <div className="client-page__contacts client-contacts">
            {contactsList.map(
              ({ name, value }) =>
                value && (
                  <div key={name} className="client-contacts__item">
                    <div className="client-contacts__name">{name}:</div>
                    <div className="client-contacts__value">{value}</div>
                  </div>
                )
            )}
          </div>

          <div className="content-page__info">
            <div className="table-list">
              <div className="table-list__head">
                <div className="table-list__head-item table-list--head-goal">Цель брони</div>
                <div className="table-list__head-item table-list--head-condition">Условие</div>
                <div className="table-list__head-item table-list--head-sale">Скидка </div>
                <div className="table-list__head-item table-list--head-sale">Сумма</div>
                <div className="table-list__head-item table-list--head-sale">Итого, руб.</div>
              </div>
              <div className="table-list__body">
                {plansClient.map((item) => {
                  return (
                    !!item && (
                      <div key={item.id} className="table-list__item">
                        <div className="discount-item">
                          <div className="discount-item__column discount-item--goal">
                            {item.nameHall}
                          </div>
                          <div className="discount-item__column discount-item--condition">
                            <Link target="_blank" to={`/detail-plan/${item.id}`}>
                              №{item.orderNumber}
                            </Link>
                            , {item.dateFrom} - {item.timeFrom}, {item.minutes}(<b>{item.status}</b>
                            )
                          </div>
                          <div className="discount-item__column discount-item--sale">
                            {item.discount ? item.discount : '-'}
                          </div>
                          <div className="discount-item__column discount-item--sale">
                            {item.price ? item.price : '-'}
                          </div>
                          <div className="discount-item__column discount-item--sale">
                            {item.totalPrice ? item.totalPrice : '-'}
                          </div>
                        </div>
                      </div>
                    )
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Client };
