import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';

import { Loading, HallForm, Hall, ButtonIcon } from '../componetns';
import {
  hallsFetchRequest,
  hallsDeleteRequest,
  hallsChangeRequest,
  hallsAddRequest,
  setPageTplName
} from '../redux/actions';
import { getHalls, getPrices } from '../redux/reducers';

const Halls = () => {
  const dispatch = useDispatch();
  const { halls, hallsFetch, hallsPhotosFetch } = useSelector((state) => getHalls(state));
  const { list: priceList } = useSelector((state) => getPrices(state));
  const handleDelete = (id) => () => {
    if (window.confirm('Вы действительно хотите удалить зал?')) {
      dispatch(hallsDeleteRequest(id));
    }
  };

  const addHall = (data) => {
    dispatch(hallsAddRequest(data));
  };

  const editHall = (id) => (data) => {
    dispatch(hallsChangeRequest({ id, data }));
  };

  useEffect(() => {
    dispatch(hallsFetchRequest());
    dispatch(setPageTplName('HALLS'));
  }, [dispatch]);

  if (hallsFetch) return <Loading />;

  return (
    <>
      {hallsPhotosFetch && <Loading />}
      <div className="content-page">
        <h1 className="content-page__title">Залы</h1>
        <div className="content-page__main">
          <div className="content-page__panel content-page--panel-extend">
            <div className="content-page__panel-item">
              <div className="content-page__panel-btn">
                <HallForm onClick={addHall} captionButton="Добавить зал" nameForm="Новый зал" />
              </div>
            </div>
          </div>
          {halls.length > 0 && (
            <div className="content-page__info">
              <div className="halls-list">
                <div className="halls-list__head">
                  <div className="halls-list__head-item halls-list--head-img"></div>
                  <div className="halls-list__head-item halls-list--head-name">Название</div>
                  <div className="halls-list__head-item halls-list--head-price">
                    Цена
                    <ButtonIcon
                      Icon={LiveHelpIcon}
                      title={
                        'У каждой цены есть поле "приоритет", чем больше этот параметр тем важнее цена, в таблице такие цены располагаются вверху'
                      }
                    />
                  </div>
                  <div className="halls-list__head-item halls-list--head-buttons"></div>
                </div>
                <div className="halls-list__body">
                  {halls.map((elem) => {
                    return (
                      <div key={elem._id} className="halls-list__item">
                        <Hall
                          params={elem}
                          prices={priceList[elem._id]}
                          handleDelete={handleDelete}
                          onClick={editHall(elem._id)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export { Halls };
