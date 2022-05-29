import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Loading } from '../../componetns';

import { ButtonIcon, ServiceForm } from '../../componetns';
import { getServicesRequest, deleteServicesRequest } from '../../redux/actions';
import { getServices } from '../../redux/reducers';

const SettingsServices = () => {
  const { loading, list } = useSelector((state) => getServices(state));
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getServicesRequest());
  }, [dispatch]);
  const handleDelete = (id) => () => {
    if (window.confirm('Вы действительно хотите удалить услугу?')) {
      dispatch(deleteServicesRequest({ id }));
    }
  };

  return (
    <>
      {loading && <Loading />}
      <div className="content-page__panel-item content-page--valign-center content-page--indent-bottom">
        <h2 className="content-page__title content-page--no-margin content-page--indent-right">
          Услуги
        </h2>
        <ServiceForm
          // onClick={handlePayment}
          // idPlan={detailsOrder.idPlan}
          captionButton="Добавить услугу"
          nameForm="Новая услуга"
        />
      </div>
      <div className="table-list table-list--a-width">
        <div className="table-list__head table-list--mobile-head">
          <div className="table-list__head-item table-list--col-percent-70">Услуга</div>
          <div className="table-list__head-item table-list--col-percent-30">Цена</div>
        </div>
        <div className="table-list__body">
          {list.map((item) => (
            <div key={item._id} className="table-list__item table-list--row">
              <div className="table-list__col table-list--col-percent-70">{item.name}</div>
              <div className="table-list__col table-list--col-space-between table-list--col-percent-30">
                {item.priceText} руб. {item.hourly ? '/ ч' : ''}
                <div className="table-list__buttons">
                  <ServiceForm
                    service={item}
                    Icon={EditIcon}
                    captionButton="Добавить услугу"
                    nameForm="Новая услуга"
                  />
                  <ButtonIcon Icon={DeleteIcon} title="Удалить" onClick={handleDelete(item._id)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export { SettingsServices };
