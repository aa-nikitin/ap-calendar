import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route } from 'react-router-dom';
import { loginFetchFromToken } from './redux/actions';
import { Home, Plan, Clients, Finance, Discount, Company } from './pages';
import { Menu, Login, Loading } from './componetns';
import { getLogin } from './redux/reducers';

function App() {
  const { loginCheck, loginFetch } = useSelector((state) => getLogin(state));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loginFetchFromToken());
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
        <Route path="/finance" component={Finance} exact />
        <Route path="/discount" component={Discount} exact />
        <Route path="/company" component={Company} exact />
      </div>
    </div>
  );
}

export default App;
