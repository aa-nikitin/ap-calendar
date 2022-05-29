import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route } from 'react-router-dom';

import { loginFetchFromToken } from './redux/actions';
import {
  Home,
  Plan,
  Clients,
  Client,
  Finance,
  Discount,
  Halls,
  Settings,
  DetailPlan
} from './pages';
import { Menu, Login, Loading } from './componetns';
import { getLogin } from './redux/reducers';
// import useWindowDimensions from './hooks/useWindowDimensions';

function App() {
  const { loginCheck, loginFetch } = useSelector((state) => getLogin(state));
  // const { width, height } = useWindowDimensions();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loginFetchFromToken());
    // dispatch(setWindowSize({ width, height }));
  }, [dispatch]);

  if (loginFetch) {
    return <Loading />;
  }

  if (!loginCheck) {
    return <Login />;
  }

  return (
    <div className="main">
      <div className="main__left">
        <Menu />
      </div>
      <div className="main__right">
        <Route path="/" component={Home} exact />
        <Route path="/plan" component={Plan} exact />
        <Route path="/clients" component={Clients} exact />
        <Route path="/clients/:id" component={Client} exact />
        <Route path="/detail-plan/:id" component={DetailPlan} exact />
        <Route path="/finance" component={Finance} exact />
        <Route path="/discount" component={Discount} exact />
        <Route path="/halls" component={Halls} exact />
        <Route path="/settings" component={Settings} exact />
      </div>
    </div>
  );
}

export default App;
