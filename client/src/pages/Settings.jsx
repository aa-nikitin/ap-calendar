import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import { setPageTplName } from '../redux/actions';
import {
  settingsSavePaykeeperRequest,
  settingsSavePrepaymentRequest,
  settingsSaveMailPostRequest,
  settingsLoadSettingsRequest,
  settingsSendMailPostRequest
} from '../redux/actions';
import {
  SettingsShedule,
  SettingsHolidays,
  SettingsPaykeeper,
  SettingsPrepayment,
  SettingsMailPost,
  SettingsServices,
  Loading
} from '../componetns';
import { getSettings, getPaykeeper, getPrepayment, getMailPost } from '../redux/reducers';

const Settings = () => {
  const dispatch = useDispatch();
  const [value, setValue] = React.useState('shedule');
  const { loading } = useSelector((state) => getSettings(state));
  const paykeeper = useSelector((state) => getPaykeeper(state));
  const prepayment = useSelector((state) => getPrepayment(state));
  const mailPost = useSelector((state) => getMailPost(state));
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handlePaykeeper = (values) => {
    dispatch(settingsSavePaykeeperRequest(values));
  };
  const handlePrepayment = (values) => {
    dispatch(settingsSavePrepaymentRequest(values));
  };
  const handleMailPost = (values) => {
    dispatch(settingsSaveMailPostRequest(values));
  };
  const handleSendMailPost = () => {
    dispatch(settingsSendMailPostRequest());
  };

  useEffect(() => {
    dispatch(setPageTplName('SETTINGS'));
    dispatch(settingsLoadSettingsRequest());
  }, [dispatch]);

  return (
    <>
      {loading && <Loading />}
      <div className="content-page">
        <h1 className="content-page__title">Настройки</h1>
        <div className="content-page__main">
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                  <Tab label="Расписание" value="shedule" />
                  <Tab label="Праздники" value="holidays" />
                  <Tab label="PayKeeper" value="paykeeper" />
                  <Tab label="Предоплата" value="prepayment" />
                  <Tab label="Почта" value="mailpost" />
                  <Tab label="Услуги" value="services" />
                </TabList>
              </Box>
              <TabPanel value="shedule">
                <SettingsShedule />
              </TabPanel>
              <TabPanel value="holidays">
                <SettingsHolidays />
              </TabPanel>
              <TabPanel value="paykeeper">
                <SettingsPaykeeper paykeeper={paykeeper} handlePaykeeper={handlePaykeeper} />
              </TabPanel>
              <TabPanel value="prepayment">
                <SettingsPrepayment prepayment={prepayment} handlePrepayment={handlePrepayment} />
              </TabPanel>
              <TabPanel value="mailpost">
                <SettingsMailPost
                  mailPost={mailPost}
                  handleMailPost={handleMailPost}
                  handleSendMailPost={handleSendMailPost}
                />
              </TabPanel>
              <TabPanel value="services">
                <SettingsServices />
              </TabPanel>
            </TabContext>
          </Box>
        </div>
      </div>
    </>
  );
};

export { Settings };
