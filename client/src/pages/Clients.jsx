import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { DataGrid, ruRU } from '@mui/x-data-grid';
import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
// import { ruRU } from '@mui/material/locale';
import {
  clientsFetchRequest,
  clientsSelectionCheck,
  clientsSelectionDelRequest,
  clientsAddRequest,
  setPageTplName
} from '../redux/actions';
import { getClients } from '../redux/reducers';
import { Loading, ClientForm } from '../componetns';

const useStyles = makeStyles({
  root: {
    '& .super-app-theme--header .MuiDataGrid-columnHeaderTitle': {
      fontWeight: 'bold'
    }
  }
});

const Clients = () => {
  const { clients, clientsFetch, clientsCheckList } = useSelector((state) => getClients(state));
  const dispatch = useDispatch();
  const clientsSelection = (list) => {
    dispatch(clientsSelectionCheck(list));
  };

  const handleRemoveClients = () => {
    if (window.confirm('Вы действительно хотите удалить клиентов?')) {
      dispatch(clientsSelectionDelRequest());
    }
  };

  const addClient = (data) => {
    dispatch(clientsAddRequest(data));
  };

  useEffect(() => {
    dispatch(clientsFetchRequest());
    dispatch(setPageTplName('CLIENTS'));
  }, [dispatch]);
  const columns = [
    {
      field: 'nickname',
      headerName: 'ФИО',
      minWidth: 200,
      flex: 1,
      cellClassName: 'super-app-theme--cell',
      headerClassName: 'super-app-theme--header',
      renderCell: ({ row: { name, id, blacklist } }) => {
        const { first: firstName, last: lastName } = name;

        return (
          <Link
            className={`data-grid-link ${blacklist ? 'data-grid--blacklist' : ''}`}
            to={`/clients/${id}`}>
            {firstName} {lastName}
          </Link>
        );
      }
    },
    {
      field: 'company',
      headerName: 'Компания',
      minWidth: 180,
      flex: 1,
      headerClassName: 'super-app-theme--header'
    },
    {
      field: 'phone',
      headerName: 'Телефон',
      minWidth: 180,
      flex: 1,
      headerClassName: 'super-app-theme--header'
    },
    {
      field: 'mail',
      headerName: 'E-mail',
      minWidth: 120,
      flex: 1,
      headerClassName: 'super-app-theme--header'
    }
  ];
  const classes = useStyles();
  if (clientsFetch) return <Loading />;
  return (
    <div className="content-page">
      <h1 className="content-page__title">База клиентов</h1>
      <div className="content-page__main">
        <div className="content-page__panel content-page--panel-extend">
          <div className="content-page__panel-item">
            <div className="content-page__panel-btn">
              <ClientForm
                onClick={addClient}
                captionButton="Добавить клиента"
                nameForm="Новый клиент"
              />
            </div>
            {clientsCheckList.length > 0 && (
              <div className="content-page__panel-btn">
                <Button variant="outlined" color="primary" onClick={handleRemoveClients}>
                  Удалить
                </Button>
              </div>
            )}
          </div>
        </div>
        <div style={{ width: '100%' }} className={classes.root}>
          <DataGrid
            autoHeight
            pagination
            columns={columns}
            rows={clients}
            checkboxSelection
            disableSelectionOnClick
            localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
            onSelectionModelChange={(list) => {
              clientsSelection(list);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export { Clients };
