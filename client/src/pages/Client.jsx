import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import UpdateIcon from '@material-ui/icons/Update';
import Tooltip from '@material-ui/core/Tooltip';

import { Loading, ClientForm } from '../componetns';
import { getClient } from '../redux/reducers';
import { clientFetchRequest, clientChangeRequest, setPageTplName } from '../redux/actions';

const Client = ({ match, history }) => {
  const dispatch = useDispatch();
  const { client, clientFetch } = useSelector((state) => getClient(state));
  const firstName = client.name ? client.name.first : '';
  const lastName = client.name ? client.name.last : '';
  const { nickname, company, phone, mail, comment } = client;
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
        <div className="content-page__panel-item">
          <div className="content-page__panel-btn">
            <Button variant="outlined" color="primary" onClick={handleBack}>
              Назад
            </Button>
          </div>
        </div>
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
        </div>
      </div>
    </div>
  );
};

export { Client };
