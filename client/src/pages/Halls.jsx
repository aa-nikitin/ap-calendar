import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Loading, HallForm, Hall } from '../componetns';
import {
  hallsFetchRequest,
  hallsDeleteRequest,
  hallsChangeRequest,
  hallsAddRequest
} from '../redux/actions';
import { getHalls } from '../redux/reducers';

const Halls = () => {
  const dispatch = useDispatch();
  const { halls, hallsFetch, hallsPhotosFetch } = useSelector((state) => getHalls(state));

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
                  <div className="halls-list__head-item halls-list--head-price">Цена</div>
                  <div className="halls-list__head-item halls-list--head-buttons"></div>
                </div>
                <div className="halls-list__body">
                  {halls.map((elem) => {
                    return (
                      <div key={elem._id} className="halls-list__item">
                        <Hall
                          params={elem}
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
